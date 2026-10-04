#!/usr/bin/env python3
"""Pull already-downloaded nflverse 2026 files into a pack the scorer can grade.

Reads /tmp/nfl/{week,snaps,games,team}.csv. Does not invent stats.
"""
import csv, json, re
from collections import defaultdict

TEAM = {"LA": "LAR", "JAX": "JAC"}
NICK = {
    "ARI": "cardinals", "ATL": "falcons", "BAL": "ravens", "BUF": "bills", "CAR": "panthers",
    "CHI": "bears", "CIN": "bengals", "CLE": "browns", "DAL": "cowboys", "DEN": "broncos",
    "DET": "lions", "GB": "packers", "HOU": "texans", "IND": "colts", "JAC": "jaguars",
    "KC": "chiefs", "LAC": "chargers", "LAR": "rams", "LV": "raiders", "MIA": "dolphins",
    "MIN": "vikings", "NE": "patriots", "NO": "saints", "NYG": "giants", "NYJ": "jets",
    "PHI": "eagles", "PIT": "steelers", "SEA": "seahawks", "SF": "49ers", "TB": "buccaneers",
    "TEN": "titans", "WAS": "commanders",
}
SKILL = {"QB", "RB", "WR", "TE", "FB"}

def team(code):
    code = TEAM.get(code, code)
    return code

def slug(name):
    name = name.lower().replace("'", "").replace(".", "")
    name = re.sub(r"[^a-z0-9]+", "-", name).strip("-")
    return name

def num(row, key):
    raw = row.get(key) or ""
    try:
        return float(raw)
    except ValueError:
        return 0.0

def counting(row):
    att = num(row, "attempts")
    pc = num(row, "completions")
    py = num(row, "passing_yards")
    ry = num(row, "rushing_yards")
    rey = num(row, "receiving_yards")
    fuml = num(row, "fumbles_lost_total")
    if not fuml:
        fuml = num(row, "rushing_fumbles_lost") + num(row, "receiving_fumbles_lost") + num(row, "sack_fumbles_lost")
    return {
        "py": py, "pc": pc, "inc": max(0, att - pc), "ptd": num(row, "passing_tds"), "ptd50": 0,
        "pfd": num(row, "passing_first_downs"), "int": num(row, "passing_interceptions"),
        "p2": num(row, "passing_2pt_conversions"), "p300": 1 if py >= 300 else 0, "p400": 1 if py >= 400 else 0,
        "sk": num(row, "sacks_suffered"), "ry": ry, "ra": num(row, "carries"), "rtd": num(row, "rushing_tds"),
        "rtd50": 0, "rfd": num(row, "rushing_first_downs"), "r2": num(row, "rushing_2pt_conversions"),
        "ry100": 1 if ry >= 100 else 0, "ry200": 1 if ry >= 200 else 0, "rey": rey,
        "rec": num(row, "receptions"), "retd": num(row, "receiving_tds"), "retd50": 0,
        "refd": num(row, "receiving_first_downs"), "rec2": num(row, "receiving_2pt_conversions"),
        "rey100": 1 if rey >= 100 else 0, "rey200": 1 if rey >= 200 else 0, "ret": num(row, "targets"),
        "fuml": fuml,
    }

games = list(csv.DictReader(open("/tmp/nfl/games.csv")))
reg = [g for g in games if g["season"] == "2026" and g["game_type"] == "REG"]
played = {}
slate = defaultdict(dict)
for g in reg:
    week = int(g["week"])
    home, away = team(g["home_team"]), team(g["away_team"])
    spread = float(g["spread_line"]) if g["spread_line"] else None
    total = float(g["total_line"]) if g["total_line"] else None
    scored = g["home_score"] != "" and g["away_score"] != ""
    for abbr, opp, home_flag, side in ((home, away, True, spread), (away, home, False, None if spread is None else -spread)):
        slate[abbr][str(week)] = {"opp": opp, "home": home_flag, "spread": side, "total": total, "bye": False}
        if scored:
            played[(abbr, week)] = True

for abbr in list(NICK):
    for week in range(1, 19):
        slate[abbr].setdefault(str(week), {"opp": "", "home": False, "spread": None, "total": None, "bye": True})

weeks = list(csv.DictReader(open("/tmp/nfl/week.csv")))
skill = [r for r in weeks if r["season_type"] == "REG" and r["position"] in SKILL]
snaps = list(csv.DictReader(open("/tmp/nfl/snaps.csv")))
snap_key = {}
for s in snaps:
    if s.get("game_type") not in ("REG", "", None) and s.get("season") not in ("2026", ""):
        continue
    try:
        week = int(s["week"])
    except ValueError:
        continue
    snap_key[(slug(s["player"]), team(s["team"]), week)] = num(s, "offense_pct")

by_player = defaultdict(dict)
team_week = defaultdict(lambda: {"att": 0, "car": 0, "sk": 0, "plays_n": 0})
for r in skill:
    week = int(r["week"])
    abbr = team(r["team"])
    pid = slug(r["player_display_name"] or r["player_name"])
    pos = "RB" if r["position"] == "FB" else r["position"]
    by_player[pid][week] = {
        "name": r["player_display_name"],
        "pos": pos,
        "team": abbr,
        "opp": team(r["opponent_team"]),
        "stats": counting(r),
        "targets": num(r, "targets"),
        "carries": num(r, "carries"),
        "att": num(r, "attempts"),
        "sk": num(r, "sacks_suffered"),
    }
    bucket = team_week[(abbr, week)]
    bucket["att"] += num(r, "attempts")
    bucket["car"] += num(r, "carries")
    bucket["sk"] += num(r, "sacks_suffered")

rows = []
for pid, weeks_map in by_player.items():
    for week, row in sorted(weeks_map.items()):
        prior_weeks = [w for w in weeks_map if w < week]
        abbr = row["team"]
        att = car = sk = 0
        pt = pc = 0
        snaps_n = []
        games = 0
        for w in prior_weeks:
            tw = team_week[(abbr, w)]
            # team totals are season-location stable only if the player stayed; use that week's team
            att += team_week[(weeks_map[w]["team"], w)]["att"]
            car += team_week[(weeks_map[w]["team"], w)]["car"]
            sk += team_week[(weeks_map[w]["team"], w)]["sk"]
            pt += weeks_map[w]["targets"]
            pc += weeks_map[w]["carries"]
            games += 1
            snap = snap_key.get((pid, weeks_map[w]["team"], w))
            if snap:
                snaps_n.append(snap)
        prior = None
        if games:
            plays = (att + sk + car) / games
            denom_pass = att + car
            prior = {
                "games": games,
                "targetShare": (pt / att) if att else 0,
                "carryShare": (pc / car) if car else 0,
                "snap": sum(snaps_n) / len(snaps_n) if snaps_n else None,
                "pace": plays or 63,
                "passRate": (att / denom_pass) if denom_pass else 0.57,
            }
        game = slate[abbr].get(str(week), {})
        rows.append({
            "playerId": pid,
            "name": row["name"],
            "pos": row["pos"],
            "week": week,
            "team": abbr,
            "opp": row["opp"],
            "home": bool(game.get("home")),
            "spread": game.get("spread"),
            "total": game.get("total"),
            "stats": row["stats"],
            "prior": prior,
            "priorWeeks": len(prior_weeks),
        })

# Team defense actuals for the baseline. Points and yards allowed come from the opponent's offense.
team_rows = list(csv.DictReader(open("/tmp/nfl/team.csv")))
offense_ya = {}
for r in team_rows:
    if r.get("season", "2026") not in ("2026", ""):
        continue
    try:
        week = int(r["week"])
    except ValueError:
        continue
    abbr = team(r["team"])
    offense_ya[(abbr, week)] = num(r, "passing_yards") + num(r, "rushing_yards")

dst = []
for r in team_rows:
    try:
        week = int(r["week"])
    except ValueError:
        continue
    abbr = team(r["team"])
    opp = team(r.get("opponent_team", ""))
    nick = NICK.get(abbr)
    if not nick:
        continue
    game = next((g for g in reg if int(g["week"]) == week and team(g["home_team"]) in (abbr, opp) and team(g["away_team"]) in (abbr, opp)), None)
    if not game or game["home_score"] == "":
        continue
    home = team(game["home_team"])
    pa = float(game["away_score"] if home == abbr else game["home_score"])
    won = (home == abbr and float(game["home_score"]) > float(game["away_score"])) or (home != abbr and float(game["away_score"]) > float(game["home_score"]))
    dst.append({
        "playerId": f"{nick}-dst",
        "name": f"{nick.title()} DST",
        "pos": "DST",
        "week": week,
        "team": abbr,
        "stats": {
            "sack": num(r, "def_sacks"),
            "int": num(r, "def_interceptions"),
            "fr": num(r, "fumble_recovery_opp"),
            "ff": num(r, "def_fumbles_forced"),
            "safety": num(r, "def_safeties"),
            "td": num(r, "def_tds") + num(r, "fumble_recovery_tds"),
            "block": 0,
            "tw": 1 if won else 0,
            "pa": pa,
            "ya": offense_ya.get((opp, week), 0),
        },
    })

pack = {"rows": rows, "dst": dst, "slate": slate, "fullyScoredWeeks": [1, 2, 3]}
with open("/tmp/nfl/pack.json", "w") as f:
    json.dump(pack, f)
print("skill rows", len(rows), "dst", len(dst))

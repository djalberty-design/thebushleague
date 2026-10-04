#!/usr/bin/env python3
"""nflverse 2026 identity pack. Stats only. No invented rows."""
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
    return TEAM.get(code, code)

def num(row, key):
    try:
        return float(row.get(key) or 0)
    except ValueError:
        return 0.0

def counting(row):
    att = num(row, "attempts")
    pc = num(row, "completions")
    py = num(row, "passing_yards")
    ry = num(row, "rushing_yards")
    rey = num(row, "receiving_yards")
    fuml = num(row, "fumbles_lost_total") or (
        num(row, "rushing_fumbles_lost") + num(row, "receiving_fumbles_lost") + num(row, "sack_fumbles_lost")
    )
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

weeks = [r for r in csv.DictReader(open("/tmp/nfl/week.csv")) if r["season_type"] == "REG" and r["position"] in SKILL]
def nkey(value):
    text = re.sub(r"[^a-z0-9]+", "", (value or "").lower())
    for suffix in ("iii", "ii", "jr", "sr", "iv"):
        if text.endswith(suffix) and len(text) > len(suffix) + 3:
            text = text[: -len(suffix)]
            break
    return text

snaps = {}
for s in csv.DictReader(open("/tmp/nfl/snaps.csv")):
    try:
        w = int(s["week"])
    except ValueError:
        continue
    snaps[(nkey(s["player"]), team(s["team"]), w)] = num(s, "offense_pct")

players = {}
for r in weeks:
    gsis = r["player_id"]
    w = int(r["week"])
    abbr = team(r["team"])
    name = r["player_display_name"] or r["player_name"]
    pos = "RB" if r["position"] == "FB" else r["position"]
    bucket = players.setdefault(gsis, {"gsis": gsis, "name": name, "pos": pos, "team": abbr, "weeks": {}})
    bucket["team"] = abbr
    snap = snaps.get((nkey(name), abbr, w))
    if snap is None:
        snap = snaps.get((nkey(r["player_name"]), abbr, w))
    bucket["weeks"][str(w)] = {
        "stats": counting(r),
        "targets": num(r, "targets"),
        "carries": num(r, "carries"),
        "attempts": num(r, "attempts"),
        "snap": snap,
        "air": num(r, "passing_air_yards") if pos == "QB" else num(r, "receiving_air_yards"),
    }

games = [g for g in csv.DictReader(open("/tmp/nfl/games.csv")) if g["season"] == "2026" and g["game_type"] == "REG"]
scored = {}
for g in games:
    if g["home_score"] == "" or g["away_score"] == "":
        continue
    w = int(g["week"])
    for abbr in (team(g["home_team"]), team(g["away_team"])):
        scored.setdefault(str(w), []).append(abbr)

team_rows = list(csv.DictReader(open("/tmp/nfl/team.csv")))
offense_ya = {}
dst = []
for r in team_rows:
    try:
        w = int(r["week"])
    except ValueError:
        continue
    abbr = team(r["team"])
    offense_ya[(abbr, w)] = num(r, "passing_yards") + num(r, "rushing_yards")
for r in team_rows:
    try:
        w = int(r["week"])
    except ValueError:
        continue
    abbr = team(r["team"])
    opp = team(r.get("opponent_team", ""))
    nick = NICK.get(abbr)
    game = next((g for g in games if int(g["week"]) == w and team(g["home_team"]) in (abbr, opp) and team(g["away_team"]) in (abbr, opp) and g["home_score"] != ""), None)
    if not nick or not game:
        continue
    home = team(game["home_team"])
    pa = float(game["away_score"] if home == abbr else game["home_score"])
    won = (home == abbr and float(game["home_score"]) > float(game["away_score"])) or (home != abbr and float(game["away_score"]) > float(game["home_score"]))
    dst.append({
        "id": f"{nick}-dst",
        "team": abbr,
        "week": w,
        "stats": {
            "sack": num(r, "def_sacks"), "int": num(r, "def_interceptions"), "fr": num(r, "fumble_recovery_opp"),
            "ff": num(r, "def_fumbles_forced"), "safety": num(r, "def_safeties"),
            "td": num(r, "def_tds") + num(r, "fumble_recovery_tds"), "block": 0, "tw": 1 if won else 0,
            "pa": pa, "ya": offense_ya.get((opp, w), 0),
        },
    })

with open("/tmp/nfl/identity.json", "w") as f:
    json.dump({"players": list(players.values()), "dst": dst, "scoredTeams": scored}, f)
print("players", len(players), "dst", len(dst))

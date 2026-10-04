#!/usr/bin/env python3
"""2025 held-out replay. Tune = odd weeks. Test = even weeks. 2026 is not used."""
import csv, json, math
from collections import defaultdict

SKILL = {"QB", "RB", "WR", "TE", "FB"}
TUNE = {5, 7, 9, 11, 13, 15, 17}
TEST = {4, 6, 8, 10, 12, 14, 16, 18}

def num(row, key):
    try:
        return float(row.get(key) or 0)
    except ValueError:
        return 0.0

def team(value):
    return {"JAX": "JAC", "LA": "LAR", "WSH": "WAS", "OAK": "LV"}.get(value, value)

def score(s):
    return (
        s["py"] * 0.05 + s["pc"] * 0.1 + s["inc"] * -0.1 + s["ptd"] * 4 + s["ptd50"] * 3 + s["pfd"] * 0.5
        + s["int"] * -2 + s["p2"] * 2 + s["p300"] * 2 + s["p400"] * 4 + s["sk"] * -1
        + s["ry"] * 0.1 + s["ra"] * 0.1 + s["rtd"] * 6 + s["rtd50"] * 3 + s["rfd"]
        + s["r2"] * 2 + s["ry100"] * 2 + s["ry200"] * 4
        + s["rey"] * 0.1 + s["rec"] + s["retd"] * 6 + s["retd50"] * 3 + s["refd"]
        + s["rec2"] * 2 + s["rey100"] * 2 + s["rey200"] * 4 + s["ret"] * 0.2 + s["fuml"] * -2
    )

def bonus(mean, threshold, spread):
    if mean <= 0:
        return 0
    z = (threshold - mean) / max(12, spread)
    return min(0.85, max(0, 1 / (1 + math.exp(z * 1.7))))

def actual_of(row, pos):
    py, pc, att = num(row, "passing_yards"), num(row, "completions"), num(row, "attempts")
    ry, ra = num(row, "rushing_yards"), num(row, "carries")
    rey, rec, ret = num(row, "receiving_yards"), num(row, "receptions"), num(row, "targets")
    stats = {
        "py": py, "pc": pc, "inc": max(0, att - pc), "ptd": num(row, "passing_tds"), "ptd50": 0,
        "pfd": num(row, "passing_first_downs"), "int": num(row, "passing_interceptions"),
        "p2": num(row, "passing_2pt_conversions"), "p300": 1 if py >= 300 else 0, "p400": 1 if py >= 400 else 0,
        "sk": num(row, "sacks_suffered"), "ry": ry, "ra": ra, "rtd": num(row, "rushing_tds"), "rtd50": 0,
        "rfd": num(row, "rushing_first_downs"), "r2": num(row, "rushing_2pt_conversions"),
        "ry100": 1 if ry >= 100 else 0, "ry200": 1 if ry >= 200 else 0, "rey": rey, "rec": rec,
        "retd": num(row, "receiving_tds"), "retd50": 0, "refd": num(row, "receiving_first_downs"),
        "rec2": num(row, "receiving_2pt_conversions"), "rey100": 1 if rey >= 100 else 0, "rey200": 1 if rey >= 200 else 0,
        "ret": ret, "fuml": num(row, "rushing_fumbles_lost") + num(row, "receiving_fumbles_lost") + num(row, "sack_fumbles_lost"),
    }
    return stats, score(stats)

weeks = []
for row in csv.DictReader(open("/tmp/nfl2025/week.csv")):
    if row["season"] != "2025" or row["season_type"] != "REG":
        continue
    pos = "RB" if row["position"] == "FB" else row["position"]
    if pos not in SKILL:
        continue
    week = int(row["week"])
    stats, points = actual_of(row, pos)
    weeks.append({
        "id": row["player_id"], "name": row.get("player_display_name") or row.get("player_name"),
        "pos": pos, "team": team(row["team"]), "week": week, "stats": stats, "points": points,
        "att": num(row, "attempts"), "car": num(row, "carries"), "ret": num(row, "targets"),
    })

by_player = defaultdict(list)
team_week = defaultdict(lambda: {"att": 0.0, "car": 0.0})
for row in weeks:
    by_player[row["id"]].append(row)
    bucket = team_week[(row["team"], row["week"])]
    bucket["att"] += row["att"]
    bucket["car"] += row["car"]
for rows in by_player.values():
    rows.sort(key=lambda item: item["week"])

games = {}
for row in csv.DictReader(open("/tmp/nfl2025/games.csv")):
    if row["season"] != "2025" or row["game_type"] != "REG":
        continue
    week = int(row["week"])
    try:
        spread = float(row["spread_line"])
        total = float(row["total_line"])
    except ValueError:
        continue
    home, away = team(row["home_team"]), team(row["away_team"])
    games[(home, week)] = {"spread": spread, "total": total}
    games[(away, week)] = {"spread": -spread, "total": total}

def implied(team_name, week):
    game = games.get((team_name, week))
    if not game:
        return None
    return game["total"] / 2 + game["spread"] / 2

def rate(num_sum, den_sum, fallback):
    return num_sum / den_sum if den_sum else fallback

def project(priors, pos, team_name, week, weight):
    season = priors
    last = priors[-3:]
    games_n = len(season)
    def share(rows, kind):
        opp = 0
        mine = 0
        for row in rows:
            bucket = team_week[(row["team"], row["week"])]
            opp += bucket["att"] if kind == "target" else bucket["car"]
            mine += row["ret"] if kind == "target" else row["car"]
        if opp <= 0:
            return None
        return mine / opp
    season_target, season_carry = share(season, "target"), share(season, "carry")
    last_target, last_carry = share(last, "target"), share(last, "carry")
    if games_n > 3 and last_target is not None and season_target is not None:
        target_share = weight * last_target + (1 - weight) * season_target
    else:
        target_share = season_target
    if games_n > 3 and last_carry is not None and season_carry is not None:
        carry_share = weight * last_carry + (1 - weight) * season_carry
    else:
        carry_share = season_carry
    paces = []
    league = []
    seen = set()
    for row in season:
        key = (row["team"], row["week"])
        if key in seen:
            continue
        seen.add(key)
        bucket = team_week[key]
        paces.append(bucket["att"] + bucket["car"])
    if not paces:
        return None
    for (club, wk), bucket in team_week.items():
        if wk < week and bucket["att"] + bucket["car"] > 0:
            league.append(bucket["att"] + bucket["car"])
    if not league:
        return None
    team_plays = 0.7 * (sum(paces) / len(paces)) + 0.3 * (sum(league) / len(league))
    game = games.get((team_name, week))
    spread = game["spread"] if game else None
    pass_rate = 0.57
    if spread is not None and spread >= 7:
        pass_rate += 0.08
    if spread is not None and spread <= -7:
        pass_rate -= 0.08
    pass_rate = min(0.72, max(0.45, pass_rate))
    rush_rate = 1 - pass_rate
    if pos != "QB" and target_share is None and carry_share is None:
        return None
    if pos == "QB" and carry_share is None and sum(row["att"] for row in season) == 0:
        return None

    def sums(key, stat):
        return sum(row["stats"][stat] for row in season), sum(row["stats"][key] if key in row["stats"] else row.get(key, 0) for row in season)

    # position means from every earlier skill week
    pos_rows = [row for row in weeks if row["pos"] == pos and row["week"] < week]
    def mean_rate(num_key, den_key, fallback):
        n = sum(row["stats"][num_key] for row in pos_rows)
        d = sum(row["stats"][den_key] for row in pos_rows)
        return n / d if d else fallback
    py = sum(row["stats"]["py"] for row in season)
    pc = sum(row["stats"]["pc"] for row in season)
    att = sum(row["att"] for row in season)
    sk = sum(row["stats"]["sk"] for row in season)
    ry = sum(row["stats"]["ry"] for row in season)
    ra = sum(row["stats"]["ra"] for row in season)
    rey = sum(row["stats"]["rey"] for row in season)
    ret = sum(row["stats"]["ret"] for row in season)
    rec = sum(row["stats"]["rec"] for row in season)
    rtd = sum(row["stats"]["rtd"] for row in season)
    retd = sum(row["stats"]["retd"] for row in season)
    ptd = sum(row["stats"]["ptd"] for row in season)
    rfd = sum(row["stats"]["rfd"] for row in season)
    refd = sum(row["stats"]["refd"] for row in season)
    pfd = sum(row["stats"]["pfd"] for row in season)
    def half(player, mean):
        return 0.5 * player + 0.5 * mean
    ypc = half(ry / ra if ra else mean_rate("ry", "ra", 4.2), mean_rate("ry", "ra", 4.2))
    ypt = half((py / pc if pos == "QB" and pc else rey / rec if rec else mean_rate("rey", "rec", 8)), mean_rate("rey", "rec", 8) if pos != "QB" else (mean_rate("py", "pc", 11)))
    catch = half(rec / ret if ret else 0.65, mean_rate("rec", "ret", 0.65))
    cmp = half(pc / att if att else 0.645, mean_rate("pc", "inc", 0) and 0.645)
    # completion mean from attempts, not incompletions
    cmp_mean_n = sum(row["stats"]["pc"] for row in pos_rows)
    cmp_mean_d = sum(row["att"] for row in pos_rows)
    cmp = half(pc / att if att else (cmp_mean_n / cmp_mean_d if cmp_mean_d else 0.645), cmp_mean_n / cmp_mean_d if cmp_mean_d else 0.645)
    sack = half(sk / (att + sk) if att + sk else 0.065, 0.065)
    td_rush = half(rtd / ra if ra else 0.04, mean_rate("rtd", "ra", 0.04))
    td_target = half((ptd / att if pos == "QB" and att else retd / ret if ret else 0.045), mean_rate("retd", "ret", 0.045) if pos != "QB" else 0.045)
    fd_rush = half(rfd / ra if ra else 0.22, mean_rate("rfd", "ra", 0.22))
    fd_rec = half(refd / rec if rec else 0.6, mean_rate("refd", "rec", 0.6))
    fd_pass = half(pfd / pc if pc else 0.38, 0.38)
    targets = 0 if target_share is None or pos == "QB" else team_plays * pass_rate * target_share
    carries = 0 if carry_share is None else team_plays * rush_rate * carry_share
    if pos == "QB":
        att_hat = team_plays * pass_rate
        cmp_rate = min(0.78, max(0.45, cmp))
        pc_hat = att_hat * cmp_rate
        py_hat = pc_hat * (py / pc if pc else 7.4)
        stats = {k: 0 for k in ["py","pc","inc","ptd","ptd50","pfd","int","p2","p300","p400","sk","ry","ra","rtd","rtd50","rfd","r2","ry100","ry200","rey","rec","retd","retd50","refd","rec2","rey100","rey200","ret","fuml"]}
        stats.update({
            "pc": pc_hat, "inc": att_hat - pc_hat, "py": py_hat, "ptd": att_hat * (ptd / att if att else 0.048),
            "pfd": pc_hat * fd_pass, "int": att_hat * (sum(row["stats"]["int"] for row in season) / att if att else 0.022),
            "sk": att_hat * sack, "ra": carries, "ry": carries * ypc, "rtd": carries * td_rush, "rfd": carries * fd_rush,
            "ret": 0,
        })
        stats["p300"] = bonus(stats["py"], 300, 55)
        stats["p400"] = bonus(stats["py"], 400, 55)
    else:
        rec_hat = targets * catch
        stats = {k: 0 for k in ["py","pc","inc","ptd","ptd50","pfd","int","p2","p300","p400","sk","ry","ra","rtd","rtd50","rfd","r2","ry100","ry200","rey","rec","retd","retd50","refd","rec2","rey100","rey200","ret","fuml"]}
        stats.update({
            "ra": carries, "ry": carries * ypc, "rtd": carries * td_rush, "rfd": carries * fd_rush,
            "ret": targets, "rec": rec_hat, "rey": rec_hat * (rey / rec if rec else ypt), "retd": targets * td_target,
            "refd": rec_hat * fd_rec,
        })
        stats["ry100"] = bonus(stats["ry"], 100, 38)
        stats["rey100"] = bonus(stats["rey"], 100, 32)
    # 50-yard TD bonus is not in the week file. Left at 0 and named.
    return score(stats)

rows = []
for player_id, priors_all in by_player.items():
    for item in priors_all:
        if item["week"] < 4:
            continue
        priors = [row for row in priors_all if row["week"] < item["week"]]
        if not priors:
            continue
        b0 = sum(row["points"] for row in priors[-3:]) / len(priors[-3:])
        recent = [implied(item["team"], week) for week in range(item["week"] - 3, item["week"]) if week >= 1]
        now = implied(item["team"], item["week"])
        b1 = None if now is None or any(value is None for value in recent) or not recent or sum(recent) <= 0 else b0 * (now / (sum(recent) / len(recent)))
        b2 = project(priors, item["pos"], item["team"], item["week"], 0.6)
        if b2 is None or b1 is None:
            continue
        rows.append({"id": player_id, "week": item["week"], "actual": item["points"], "b0": b0, "b1": b1, "b2": b2, "pos": item["pos"], "team": item["team"]})

def mae(sample, key):
    if not sample:
        return None
    return sum(abs(row["actual"] - row[key]) for row in sample) / len(sample)

def owns(sample, key, margin):
    week_own = False
    player_own = False
    base = mae(sample, "b0") - mae(sample, key)
    if base < margin:
        return True, True
    for week in {row["week"] for row in sample}:
        rest = [row for row in sample if row["week"] != week]
        if mae(rest, "b0") - mae(rest, key) < margin:
            week_own = True
            break
    gains = defaultdict(float)
    for row in sample:
        gains[row["id"]] += abs(row["actual"] - row["b0"]) - abs(row["actual"] - row[key])
    if gains:
        top = max(gains, key=gains.get)
        rest = [row for row in sample if row["id"] != top]
        if rest and mae(rest, "b0") - mae(rest, key) < margin:
            player_own = True
    return week_own, player_own

for row in rows:
    row["b3"] = 0.5 * row["b0"] + 0.5 * row["b2"]
held = [row for row in rows if row["week"] in TEST]
tune = [row for row in rows if row["week"] in TUNE]
summary = {
    "fetched": True,
    "pbp": "/tmp/nfl2025/pbp.csv.gz",
    "rows": len(rows),
    "heldRows": len(held),
    "tuneRows": len(tune),
    "b0": round(mae(held, "b0"), 3),
    "b1": round(mae(held, "b1"), 3),
    "b2": round(mae(held, "b2"), 3),
    "b3": round(mae(held, "b3"), 3),
    "note": "Even weeks are the held-out half. Odd weeks were the tune half. usageLast3 stayed 0.60 because the grid is not allowed to open the card from 2026, and this replay did not retune after seeing the test half. Red-zone carries are null: the week file has no red-zone column. 50-yard touchdown bonus is 0 because that split is not in the file.",
}
for key in ("b2", "b3"):
    week_own, player_own = owns(held, key, 0.25)
    summary[key + "WeekOwns"] = week_own
    summary[key + "PlayerOwns"] = player_own
    summary[key + "BeatsB0"] = round(summary["b0"] - summary[key], 3)
    summary[key + "BeatsB1"] = round(summary["b1"] - summary[key], 3)
challenger = None
for key in ("b2", "b3"):
    if summary[key + "BeatsB0"] >= 0.25 and summary[key + "BeatsB1"] >= 0.25 and not summary[key + "WeekOwns"] and not summary[key + "PlayerOwns"]:
        challenger = key.upper()
        break
summary["challenger"] = challenger
summary["card"] = challenger is not None
print(json.dumps(summary, indent=2))
open("/tmp/nfl2025/replay.json", "w").write(json.dumps(summary))

def compact_week(row):
    stats = row["stats"]
    return {
        "id": row["id"], "pos": row["pos"], "team": row["team"], "week": row["week"],
        "points": row["points"], "att": row["att"], "car": row["car"], "ret": row["ret"],
        "py": stats["py"], "pc": stats["pc"], "inc": stats["inc"], "ptd": stats["ptd"], "pfd": stats["pfd"],
        "int": stats["int"], "sk": stats["sk"], "ry": stats["ry"], "ra": stats["ra"], "rtd": stats["rtd"],
        "rfd": stats["rfd"], "rey": stats["rey"], "rec": stats["rec"], "retd": stats["retd"], "refd": stats["refd"],
    }

def load_season(week_path, games_path, season):
    loaded = []
    for row in csv.DictReader(open(week_path)):
        if row["season"] != str(season) or row["season_type"] != "REG":
            continue
        pos = "RB" if row["position"] == "FB" else row["position"]
        if pos not in SKILL:
            continue
        stats, points = actual_of(row, pos)
        loaded.append({
            "id": row["player_id"], "pos": pos, "team": team(row["team"]), "week": int(row["week"]),
            "stats": stats, "points": points,
            "att": num(row, "attempts"), "car": num(row, "carries"), "ret": num(row, "targets"),
        })
    listed = []
    for row in csv.DictReader(open(games_path)):
        if row["season"] != str(season) or row["game_type"] != "REG":
            continue
        try:
            spread = float(row["spread_line"])
            total = float(row["total_line"])
        except ValueError:
            continue
        week = int(row["week"])
        home, away = team(row["home_team"]), team(row["away_team"])
        listed.append({"team": home, "week": week, "spread": spread, "total": total})
        listed.append({"team": away, "week": week, "spread": -spread, "total": total})
    return loaded, listed

def dump_frame(path, week_rows, game_rows, held_rows=None):
    payload = {"weeks": [compact_week(row) for row in week_rows], "games": game_rows}
    if held_rows is not None:
        payload["held"] = [{
            "id": row["id"], "week": row["week"], "pos": row["pos"], "team": row["team"],
            "actual": row["actual"], "b0": row["b0"], "b1": row["b1"], "b2": row["b2"],
        } for row in held_rows]
    open(path, "w").write(json.dumps(payload))

dump_frame("/tmp/nfl2025/frame.json", weeks, [
    {"team": team_name, "week": week, "spread": game["spread"], "total": game["total"]}
    for (team_name, week), game in games.items()
], held)
weeks_2026, games_2026 = load_season("/tmp/nfl/week.csv", "/tmp/nfl/games.csv", 2026)
dump_frame("/tmp/nfl/frame2026.json", weeks_2026, games_2026)
print("frames", len(weeks), len(held), len(weeks_2026))


#!/usr/bin/env python3
"""Red zone, ESPN injuries, and NWS wind. Missing stays missing."""
import csv, json, urllib.request

TEAM = {"LA": "LAR", "JAX": "JAC"}
DOMES = {"ARI", "ATL", "DET", "IND", "MIN", "NO", "LV"}
STADIUM = {
    "ARI": (33.5276, -112.2626), "ATL": (33.7554, -84.4008), "BAL": (39.278, -76.6227),
    "BUF": (42.7738, -78.787), "CAR": (35.2258, -80.8528), "CHI": (41.8623, -87.6167),
    "CIN": (39.0955, -84.5161), "CLE": (41.5061, -81.6995), "DAL": (32.7473, -97.0945),
    "DEN": (39.7439, -105.0201), "DET": (42.34, -83.0456), "GB": (44.5013, -88.0622),
    "HOU": (29.6847, -95.4107), "IND": (39.7601, -86.1639), "JAC": (30.3239, -81.6373),
    "KC": (39.0489, -94.4839), "LAC": (33.9534, -118.3389), "LAR": (33.9534, -118.3389),
    "LV": (36.0909, -115.1833), "MIA": (25.958, -80.2389), "MIN": (44.9738, -93.2577),
    "NE": (42.0909, -71.2643), "NO": (29.9511, -90.0812), "NYG": (40.8135, -74.0745),
    "NYJ": (40.8135, -74.0745), "PHI": (39.9008, -75.1675), "PIT": (40.4468, -80.0158),
    "SEA": (47.5952, -122.3316), "SF": (37.4033, -121.9694), "TB": (27.9759, -82.5033),
    "TEN": (36.1665, -86.7713), "WAS": (38.9077, -76.8645),
}
ROLE = {
    "CB": "shadow corner", "OT": "starting tackle", "T": "starting tackle",
    "DT": "interior run defender", "NT": "interior run defender", "DE": "interior run defender",
}

def team(code):
    return TEAM.get(code, code or "")

rz = {}
gl = {}
team_rz = {}
team_gl = {}
with open("/tmp/nfl/pbp.csv") as f:
    for row in csv.DictReader(f):
        if row.get("season_type") != "REG":
            continue
        try:
            week = int(row["week"])
            yard = float(row["yardline_100"])
        except ValueError:
            continue
        if week > 3 or row.get("play_type") not in ("pass", "run"):
            continue
        abbr = team(row.get("posteam"))
        if not abbr or yard > 20:
            continue
        player = row.get("rusher_player_id") or row.get("receiver_player_id")
        if not player:
            continue
        team_rz[abbr] = team_rz.get(abbr, 0) + 1
        rz[player] = rz.get(player, 0) + 1
        if yard <= 5:
            team_gl[abbr] = team_gl.get(abbr, 0) + 1
            gl[player] = gl.get(player, 0) + 1

gsis_team = {}
with open("/tmp/nfl/identity.json") as f:
    ident = json.load(f)
for player in ident["players"]:
    gsis_team[player["gsis"]] = player["team"]

rz_out = {}
for gsis, team_name in gsis_team.items():
    touches = team_rz.get(team_name, 0)
    goal = team_gl.get(team_name, 0)
    rz_out[gsis] = {
        "redZone": (rz.get(gsis, 0) / touches) if touches else None,
        "goalLine": (gl.get(gsis, 0) / goal) if goal else None,
        "teamRedZone": touches,
        "teamGoalLine": goal,
    }

injuries = []
raw = json.load(open("/tmp/nfl/injuries.json"))
for club in raw["injuries"]:
    for item in club["injuries"]:
        athlete = item.get("athlete") or {}
        pos = ((athlete.get("position") or {}).get("abbreviation")) or ""
        abbr = ((athlete.get("team") or {}).get("abbreviation")) or ""
        abbr = team(abbr)
        practice = None
        details = item.get("details") or {}
        if isinstance(details, dict):
            practice = details.get("practice") or details.get("practiceStatus")
        injuries.append({
            "name": athlete.get("displayName"),
            "pos": pos,
            "team": abbr,
            "status": (item.get("status") or "").title(),
            "practice": practice,
            "role": ROLE.get(pos),
        })

homes = set()
with open("/tmp/nfl/games.csv") as f:
    for row in csv.DictReader(f):
        if row.get("season") == "2026" and row.get("game_type") == "REG" and row.get("week") == "4":
            homes.add(team(row["home_team"]))

weather = {}
for abbr in sorted(homes):
    if abbr in DOMES:
        weather[abbr] = {"dome": True, "wind": None, "rain": False, "reason": "Dome. Weather ignored."}
        continue
    lat, lon = STADIUM[abbr]
    try:
        req = urllib.request.Request(
            f"https://api.weather.gov/points/{lat},{lon}",
            headers={"User-Agent": "BushLeagueDesk (local)", "Accept": "application/geo+json"},
        )
        with urllib.request.urlopen(req, timeout=12) as res:
            point = json.load(res)
        forecast_url = point["properties"]["forecast"]
        req = urllib.request.Request(forecast_url, headers={"User-Agent": "BushLeagueDesk (local)", "Accept": "application/geo+json"})
        with urllib.request.urlopen(req, timeout=12) as res:
            forecast = json.load(res)
        periods = forecast["properties"]["periods"]
        # Sunday daytime if present, else the next daytime period.
        period = next((p for p in periods if "Sunday" in p.get("name", "")), periods[0])
        text = (period.get("detailedForecast") or "").lower()
        weather[abbr] = {
            "dome": False,
            "wind": period.get("windSpeed"),
            "rain": "rain" in text or "shower" in text,
            "reason": f"{period.get('name')}: {period.get('windSpeed')} {period.get('windDirection')}. {period.get('shortForecast')}.",
        }
    except Exception as exc:
        weather[abbr] = {"dome": False, "wind": None, "rain": None, "reason": f"Missing: NWS request failed ({type(exc).__name__})."}

with open("/tmp/nfl/feeds.json", "w") as f:
    json.dump({"redZone": rz_out, "injuries": injuries, "weather": weather, "routes": None, "routesReason": "Missing: nflverse participation 2026 returned 404. Routes were not invented from snaps."}, f)
print("rz", len(rz_out), "injuries", len(injuries), "weather", len(weather))
print(json.dumps({k: weather[k] for k in list(weather)[:4]}, indent=2))

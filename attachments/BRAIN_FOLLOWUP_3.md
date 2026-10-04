# Program manager order — data is clean, or it is not a brain

Date: 2026-10-04. Coder report accepted. Product 6. Brain 2. Gate 9. Card stays BASELINE. `cardUsesBrain()` stays false.

The Thursday study lost again, about 6.7 to 6.4 on nine players. Do not average the eighteen rows. The second league is the same nine copied. A fourth week does not open the gate. Weeks 4–7 and 40 real player-weeks still do, and only if the brain wins.

Two stains make that file unusable as a freeze. Fix those before any new factor is trusted.

## P0 — leakage and fills

1. Rebuild every Thursday range from weeks 1–3 only. Thursday actual stays in the actual column and nowhere else. Metcalf's ceiling must not be 25.3. A pregame freeze that contains the game just played is void. Delete those ceilings from the grade file and rewrite them.
2. Stop filling holes. Missing snap is null, not 1.00. Missing wind is STALE, not calm. A null must not enter the projection as a full share or a dome. The drawer says missing.
3. One grade row per player per week. Tag both league ids on it when he is rostered in both. Pooled MAE uses unique player-weeks. Nine is nine.
4. The Sunday freeze clock is the file's write time. A scripted 8:12 AM is not a job. If the job did not run at that time, do not print that time.

## P1 — the weight file is the only writer

`setWeights` in memory is not the loop. `project.ts` reads the weight file after a restart. Do not step a weight until two graded weeks and twelve unique player-weeks exist. When a step happens, it is written to that file. A worse next week rolls the file back and freezes that weight for two weeks. `floorRatio` 0.72 is unused. Leave it unused. The card floor is the low actual week.

## P2 — every factor, with a feed, in the drawer only

The card does not read this. A stamp of "n/a" is not a feature. Each row below is done only when the week file has a number or an explicit missing reason from that source.

| Factor | Source | Done when |
|---|---|---|
| Snap, target, carry shares | nflverse snap counts and weekly player stats, last 3 and season | Last-3 is null only if fewer than 3 games |
| Routes | nflverse participation. If the file has no routes, store null. Do not invent from snaps | Column present, null allowed |
| Red zone and goal line | nflverse play-by-play, yardline inside the 20 and inside the 5 | Share of team touches, or null |
| Teammate out | ESPN injuries on the same NFL team plus depth chart. Rebuild target and carry shares from the routes left behind | A WR1 out changes the other receivers' shadow shares |
| Backup quarterback | Same feed. Reprice pass-catchers off the backup's attempt and sack priors | Shadow points move. Card does not |
| Player availability | ESPN status, inactive, practice if the injury feed has it | Out is 0. Friday DNP cuts snaps. Missing practice is missing, not full |
| Opponent role out | ESPN injuries for the opposing team: shadow corner, starting tackle, interior run defender | Stored on the opponent row, or missing |
| Spread and total | nflverse schedule `spread_line` and `total_line` | Implied team points on every future week |
| Weather | NWS point forecast for a stadium lat/long table | Wind and rain, or STALE. Dome ignores |
| Opponent defense | nflverse points allowed by position, drop games vs bottom-5 offenses | Adjustment in the shadow score only |
| Identity | nflverse player ids, ESPN id and `gsis_id` | Jacobs, Aiyuk, Pacheco resolved or marked no 2026 skill row. Marquise Brown stays the Hollywood Brown join |

Chemistry beyond a teammate being out does not raise expected points. A quarterback and his receiver correlate at 0.25 in the 2,000-draw team sample only.

Store at weight 0 until a later promotion test: corner scheme, home/away, short week, age, rookie, primetime, expert rank, ownership, points over expected. Points over expected is faded.

## P3 — Sunday, then the gate

Score Sunday's games Monday against the weeks 1–3 freeze only. Write those rows once. If the brain loses that set too, leave it in the drawer. Do not add a page.

The gate file is weeks 4 through 7, every skill player with a crosswalk, priors from earlier weeks only, no same-week actuals in the range, no filled snaps, no filled weather. Brain MAE must beat the trailing average on at least 40 unique player-weeks. Then, and only then, `cardUsesBrain()` may return true.

## What the user manages with this week

Command stays BASELINE. Floor is the low pregame week. Ceiling is the high pregame week. NO TRAIL cannot start, be claimed as a rank, or be traded as a value. Coin-flip under 1.5. Drawer shows the shadow row and the two losses: 6.69 to 5.11, and 6.7 to 6.4 on nine Thursday players. No new chart.

## Done when

- Thursday ceilings contain no Thursday actuals.
- No snap is 1.00 and no wind is calm unless the feed said so.
- Grade MAE counts nine Thursday players, not eighteen.
- Weight file survives restart and is what the projector loads.
- Drawer has a number or a missing reason for routes, red zone, weather, and opponent injury.
- `cardUsesBrain()` is still false.

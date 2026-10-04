# Bush League OS — Projection Brain Spec

Program manager spec for the build chat. Implement this. Do not redesign the model. Do not replace Bush League scoring with a generic PPR rank.

## Outcome

For both ESPN leagues, the desk tells the user who to start, add, drop, and trade, with a floor, expected score, ceiling, and a one-line reason. Every call is frozen before lock and graded after the games in Bush League points. Features that do not beat a trailing-usage baseline stay in the log. They do not move the button.

Leagues, same scorer:

- The Bush League, ESPN `1014874`, user team Let Maye Cook (team id 9 in the seed).
- TW Fantasy, ESPN `210326445`, user team Utility Man (team id 1 in the snapshot).

Live ESPN rosters, injury flags, free agents, matchups, waiver order, and playoff settings override the seed. Scoring does not. Both leagues use `scoreOffense` and `scoreDst` in `src/lib/fantasy/scoring.ts`. If a future ESPN settings pull disagrees with that file, surface the disagreement. Do not silently switch formulas.

## Hard rules

- Delete `estimateOffense` and `estimateDst` as the source of truth. They may remain only as a last-resort fallback, marked `source: "converted"`, confidence capped at Med, card stamped STALE.
- Never ingest a half-PPR or PPR total and multiply it. Project counting stats, then call the existing scorers.
- Kickers stay out. Do not recommend them.
- Under 1.5 Bush points, label Coin-flip. Do not invent a winner.
- Favorite margin stays 8 (`FAVORITE_MARGIN`). Favorite optimizes `p20`. Underdog optimizes `0.35 * ePts + 0.65 * p80`. Toss-up optimizes `ePts`. This already exists in `lineup.ts`. Keep it.
- One bad week does not change a weight.
- Do not put secrets in the client. ESPN `swid` / `espnS2` stay server-side.

## Files to change

- `src/lib/fantasy/scoring.ts` — keep formulas. Add `projectOffense` / `projectDst` that return `CountStats` and `DstStats`. Remove heuristic estimation from the live path.
- `src/lib/fantasy/model.ts` — `toPlayerState` must call the new projector. `usageOf` must use real shares, not `p.usage` as a fake snap rate.
- `src/lib/fantasy/engine.ts` — pass league id, week, freeze id, and feature snapshot into the desk.
- `src/lib/fantasy/lineup.ts` — already correct. Feed it real ranges.
- `src/lib/fantasy/waivers.ts` — rank next 3 weeks against the best player on that league's wire. Price `PRIORITY_COST`. Do not use a global rank.
- `src/lib/fantasy/trades.ts` — keep the fair band and consolidation bonus. Add a reject when the partner is a top-3 points-for team and the outgoing player fills their starter hole at a position the user is thin.
- `src/lib/fantasy/config.ts` — add `LEAGUES` with both ids. Do not hardcode a single `LEAGUE_ID` as the only brain target.
- New: `src/lib/fantasy/brain/` with the modules below.
- New route: `/grade` for the record. Card reason line on lineup, waivers, trades, and the player drawer.

## New modules

```
src/lib/fantasy/brain/types.ts
src/lib/fantasy/brain/ingest.ts
src/lib/fantasy/brain/usage.ts
src/lib/fantasy/brain/environment.ts
src/lib/fantasy/brain/availability.ts
src/lib/fantasy/brain/project.ts
src/lib/fantasy/brain/features.ts
src/lib/fantasy/brain/freeze.ts
src/lib/fantasy/brain/grade.ts
src/lib/fantasy/brain/correct.ts
src/lib/fantasy/brain/promote.ts
src/lib/fantasy/brain/reason.ts
src/lib/fantasy/brain/weights.ts
```

Cache under server-only storage, keyed by season, week, league id, and refresh slot. Do not rebuild on every page load.

## Refresh slots

Three frozen snapshots per NFL week:

- `thu` — after the Wednesday/Thursday injury report, before Thursday kickoff.
- `sun` — Sunday morning, before 1 p.m. ET lock.
- `inactives` — after the inactive list, as late as the pipeline can run before the early window.

If a slot is missing, serve the newest freeze and stamp the card STALE. Never fill a hole with last week's box score.

## Data to ingest

All of these are stored on every freeze. Live weights are only the ones marked LIVE. Everything else is SHADOW until `promote.ts` says otherwise.

### LIVE

1. Availability, player and teammates. ESPN status plus practice participation if the ESPN or nflverse injury feed has it. Out, IR, suspended, bye, or inactive → weekly points forced to 0. Questionable with Friday DNP → snap expectation × 0.55 and confidence down. Questionable with full Friday practice → no snap cut. A teammate ruled out is an opportunity handoff, not a chemistry bonus. Rebuild target and carry shares for the remaining players from the routes and carries they inherit. Backup quarterback in → reprice every pass-catcher off the backup's attempt and sack priors.
2. Usage. nflverse snap counts, participation routes where present, targets, carries, red-zone and goal-line touches. Blend `0.6 * last 3 games + 0.4 * season` once three games exist. Before that, season plus depth-chart role. Committee back under 58% snaps gets a volume haircut. Receiver target share under 20% does not get a matchup ceiling bump.
3. Team environment. Spread and total from the nflverse schedule (`spread_line`, `total_line`). Implied team points = `(total / 2) - (spread / 2)` from that team's side. Pace = team plays per game, regressed to league average. Script moves pass rate: underdog by 7 or more → pass rate up; favorite by 7 or more → rush rate up.
4. Opponent, small. Position points allowed, opponent-adjusted: drop games against bottom-5 offenses and games where the opponent starter was out. Run-defense and light-box rate for backs. Pass-defense for quarterbacks as a tiebreaker only. Opponent injuries enter only when a named role is out: shadow corner, starting tackle, or run-stuffing interior lineman. Do not use raw fantasy points allowed.
5. Weather. Stadium lat/long table. NWS point forecast. Wind at or over 20 mph → pass attempts × 0.92, completion rate down 2 points, long-touchdown bonus probability × 0.7. Rain → fumble rate × 1.25 and completion rate down 1 point. Dome or closed retractable roof → ignore.
6. Counting-stat projection, then `scoreOffense` / `scoreDst`.
7. Range. `p20`, `p50`, `p80`, `ePts = 0.25*p20 + 0.50*p50 + 0.25*p80`. Keep `rangeFromP50` only as a fallback when variance is missing. Prefer residual quantiles from the grade log once 4 graded weeks exist.

### SHADOW (ingest, compute, show on the drawer, do not add to live points until promoted)

- Cornerback / man-zone / shadow assignment. Public open models found this null or wrong-signed. Store it.
- Teammate chemistry beyond the injury handoff. Stacking (QB + his WR/TE) widens the team weekly range. It does not raise either player's expected points.
- Home/away split.
- Short week and days rest.
- Age curve (RB 29+, WR 32+). Already a confidence haircut in `model.ts`. Keep it as confidence, not a points cut, until graded.
- Rookie penalty. Same treatment.
- Red-zone share as its own feature on top of usage. It is already inside LIVE usage. The shadow test is whether an extra weight helps.
- Opponent pace.
- Primetime, revenge, narrative tags. Store. Default weight 0.
- Expert consensus rank. Tiebreaker display only.
- Ownership / rostered percent. Waiver scarcity display only. Not a projection feature.
- Expected fantasy points over expected (FPOE). Log it. Fade it. Do not chase it.
- Last week's box score. Grade target only. Not an input.

## Projection math

Per skill player, per week:

```
plays = teamPace * scriptMultiplier(spread)
passAttempts = plays * passRate(script) * qbShare
carries = plays * rushRate(script) * carryShare
targets = passAttempts * targetShare
```

Regress efficiency 50% toward the positional mean for yards per carry, yards per target, and touchdown per touch. Quarterback completion rate and sack rate use the player's own rate, regressed 40% toward the mean. First downs: rush attempts × positional first-down rate, targets × positional first-down rate, regressed the same way. Bonus probabilities use the existing `bonusProb` helper. 50-yard touchdown bonuses stay a small fraction of touchdowns, scaled by air-yard or explosive rate when that column exists, else the current constants in `estimateOffense`.

DST: project sacks, interceptions, fumble recoveries, forced fumbles, safeties, return touchdowns, blocks, points allowed, and yards allowed from opponent implied total, opponent pace, and opponent turnover rate. Win probability from the spread. Then `scoreDst`.

Replacement levels stay in `config.ts`: QB14, RB26, WR37, TE12, DST11. Weekly VOR uses `round(replacement * 0.55)` as `model.ts` already does. Rest-of-season VOR uses the full rank. OP is why quarterback replacement is 14 in a 10-team league. Per-league starter counts from ESPN override those ranks when the slot map differs. Scoring does not change. Roster shape can.

## Decisions

Start/sit. `optimalLineup` as written. Stars stay in unless out, bye, or snap expectation under 50%. Debates within `COIN_FLIP_WEEKLY` (1.5) are coin flips. Utility Man was 0-3 in the week-4 snapshot. Mode still comes from `inferMode`, not from the season record. Record may break a toss-up toward ceiling. It does not override an 8-point weekly favorite.

Waivers. Value = user's optimal lineup points over the next 3 weeks with the add and the best legal drop, minus the same lineup without the add, minus `PRIORITY_COST[priority]`. Stream tag if the gain is one week only. DST is a stream unless the next 3 weeks are all positive against the wire. Respect `ROSTER_MAX`.

Trades. Rest-of-season lineup VOR after the swap, minus drop cost of a 2-for-1, plus the existing consolidation bonus. Fair band stays 8%. Reject, even if fair, when the user becomes thinner at a starting position and the partner is top 3 in points for. Show the letter grade already implemented.

Reason line, required on every card. Template: `"{usage fact}. Team total {n}. {injury fact}."` Example: `"22% targets over the last 3. Team total 26.5. Questionable, Friday full practice."` If any LIVE feed is missing, prefix `STALE`.

## Grade loop

Grading is not the correction. Grading writes the evidence. `correct.ts` is the only module allowed to change the next projection. A page that shows a record and does not write a weight is incomplete.

On each freeze, persist an immutable row. Never edit it after lock:

- league id, week, slot, player id, opponent, home/away
- projected `CountStats` or `DstStats`
- `p20`, `p50`, `p80`, `ePts`
- live feature values, shadow feature values, and the weight version used
- decision: start, sit, add, drop, trade-give, trade-get
- reason string
- model version

After Monday, score the actual counting stats with `scoreOffense` / `scoreDst`. Store actual points. Compute, separately for each league and pooled:

- MAE versus actual, by position
- MAE of the baseline: mean of the last 3 weeks of actual Bush points for that player. If the brain cannot beat this baseline over a month, confidence is capped at Med
- Start/sit hit rate only when the projected gap was over 1.5. Coin flips excluded from the hit rate and from the correction sample
- Calibration: fraction of weeks the actual landed below `p20`, inside `p20-p80`, above `p80`. Target about 20 / 60 / 20
- Miss tag, assigned by rule, not by hand: usage if projected targets or carries missed actual by more than 25%; script if team plays or pass rate missed by more than 15%; injury if the player played under 30% of projected snaps after a questionable tag; weather if a 20 mph wind game was projected as calm; touchdown variance if usage was within 25% and points missed by more than 6; else unknown
- Waiver value added: add minus drop over the next 3 weeks, in Bush points
- Trade value added: incoming lineup points minus outgoing lineup points over the next 4 weeks

`/grade` shows the record in plain language: `"Start calls over 1.5: 18/27. Last miss: touchdown variance, not usage. Brain MAE 4.6 vs baseline 4.9. Last correction: usage blend 0.60 to 0.64."`

## Self-correction

This is required. The brain must change itself from the grade log. It must not retrain a model every Monday.

`weights.ts` holds the only tunable numbers. Ship these defaults. Clamp every correction inside the bounds. Persist the version on each freeze so a week can be replayed.

| Weight | Default | Bounds | Moves when |
|---|---|---|---|
| `usageLast3` | 0.60 | 0.40–0.80 | usage misses repeat |
| `usageSeason` | 0.40 | 0.20–0.60 | must stay `1 - usageLast3` |
| `scriptPassBump` | 0.08 | 0.00–0.16 | script misses repeat |
| `opponentScale` | 0.35 | 0.00–0.60 | opponent-adjusted error beats unadjusted |
| `windPassCut` | 0.08 | 0.00–0.15 | weather misses in 20 mph games |
| `qDnpSnap` | 0.55 | 0.35–0.75 | injury misses on Friday DNP |
| `efficiencyRegress` | 0.50 | 0.30–0.70 | touchdown-variance rate is low and efficiency error is high |
| `floorRatio` | from `rangeFromP50` | ±0.10 of current | calibration outside 15–25% below p20 |
| `ceilRatio` | from `rangeFromP50` | ±0.10 of current | calibration outside 15–25% above p80 |

`correct.ts` runs Tuesday, after the grade for that week is written. Rules:

- A single week changes nothing. A tag must hit on at least 12 player-weeks across 2 graded weeks before a weight moves.
- A move is one step, 0.02, toward the side that would have cut MAE on those rows. Then stop. Next week tests that step.
- Touchdown variance never moves a weight. It only widens `ceilRatio` / lowers `floorRatio` if calibration is off.
- Usage misses raise `usageLast3` if the last-3 share was closer to actual than the season share, or the reverse.
- Script misses raise or lower `scriptPassBump`. Opponent misses lower `opponentScale` toward 0 if the unadjusted projection had lower MAE.
- If a correction raises pooled MAE on the following graded week, roll it back one step and freeze that weight for 2 weeks.
- Scoring coefficients in `scoring.ts` are not weights. The corrector must not touch them. Coin-flip threshold 1.5 and favorite margin 8 are not weights.
- Shadow features are not corrected into the live score here. That path is only `promote.ts`.
- Write a correction row: week, weight, old, new, reason, rows used. Show the last 8 on `/grade`.

Team win probability, used by `inferMode`, is a 2,000-draw sample from each starter's `p20/p50/p80`, correlated 0.25 inside a QB-WR or QB-TE stack and 0 otherwise. If the user's win probability is 65% or higher, mode is favorite. 35% or lower, underdog. Else toss-up. Season record breaks a toss-up only: a team under .500 leans underdog. It does not override the win probability.

## Promotion

`promote.ts` may move a SHADOW feature to LIVE only if, on the last 4 graded weeks, adding it cuts MAE versus the current live model, and it does not raise MAE on the 4 weeks before that. Minimum 40 player-weeks. Otherwise weight stays 0. Log the test. Do not auto-promote on a single week. A promoted feature enters `weights.ts` at the low bound and is then subject to `correct.ts`.

## UI

- Lineup, waivers, trades, and the player drawer show floor / expected / ceiling, confidence, reason, and STALE when needed.
- Drawer has a Shadow section. Those numbers are labeled "not in the score."
- `/grade` is the brain's record: hit rate, MAE against the baseline, miss tags, calibration, and the correction log. No vanity chart without the baseline next to it.
- League switcher must run the same brain for `1014874` and `210326445`. Grades are split by league and pooled.

## Backtest before the button

Do not let the live card outrank the trailing-three-week baseline until a replay says it should. Replay at least the last 4 completed 2026 weeks, or 2025 if 2026 usage is thin. Freeze usage as of the day before each game, score with `scoreOffense` and `scoreDst`, and compare MAE to the baseline. If the brain loses, ship the baseline as the number on the card and keep the brain in Shadow until `correct.ts` flips it. This is the gate that was missing. A new data source does not replace it.

## Product and UX

The desk is in season. Draft was September 8. Do not lead with keeper or draft countdowns. Command is the weekly action list.

- Command, in this order: league and team name, week, record, win chance, lock clock to the next slate, brain freeze time and STALE if the newest slot is missing, then the swaps ESPN does not yet match, then the top waiver, then the top trade. One primary button per block. Keeper and draft routes stay in More.
- The app cannot write the ESPN lineup. Every swap, claim, and trade ends with the exact ESPN action: who to start, who to drop, who to offer. Link to the league if a URL can be built from `espnLeagueId`. Do not make the user translate a grade into a move.
- League switcher stays in the shell. Label it with team name first: `Let Maye Cook · Bush League` and `Utility Man · TW Fantasy`. Persist the last league. A 0-3 team does not get the same empty state as a contender. Record is allowed to break a toss-up only, as already specified.
- Coin-flip is a visual state, not a green start. If the gap is under 1.5, the row is neutral and the copy says the call does not matter. Do not rank a 0.4 edge as a recommendation.
- Header chip on every desk screen: `Sun freeze · 8:12 AM` or `STALE · last Thu`. The user must see whether the brain has seen inactives.
- Player drawer: reason line, floor / expected / ceiling, injury and practice, then Shadow collapsed and labeled not in the score. No chart before the sentence.
- `/grade` is linked from Command as `Brain 18/27`, not a primary tab. Mobile tap targets stay at least 44px. Bottom primary nav stays Command, Lineup, Waivers, Trades.
- ESPN session dead: one reconnect state on Command. Do not render a seed roster as if it were live.
- Bye strip for the next four weeks on Lineup, both leagues. An empty starter banner already exists. Keep it above the roster.

## Acceptance

The build is not done until:

- A known high-target receiver outscores a similar air-yard receiver with half the targets, in Bush points, because of the 0.20 target and 1.0 first-down rates.
- A back under 58% snaps is not auto-started over a 70% snap back in a worse matchup, unless the range gap is over 1.5 and the mode is underdog.
- An inactive scores 0 and is not in the optimal lineup.
- Thursday, Sunday, and inactive freezes persist and survive a reload.
- A week with no odds feed still returns a projection, stamped STALE, using season pace.
- `/grade` renders after at least one frozen week is scored, with the baseline beside the brain.
- A fixture with 12 usage misses across 2 weeks moves `usageLast3` by 0.02 and writes a correction row. A fixture with 1 miss moves nothing.
- A correction that raises next-week MAE rolls back.
- `correct.ts` has no write path to `scoreOffense` or `scoreDst`.
- Both league ids produce a desk. Bush League scoring is identical for both.
- `estimateOffense` is not on the live path.
- Command in season does not lead with the September draft countdown.
- A sub-1.5 gap renders as coin-flip, not as a start recommendation.
- A missing freeze stamps STALE on Command and Lineup.
- League switcher shows team name and league name for both ids.
- A 4-week replay exists. If it loses to the trailing baseline, the card shows the baseline and the brain stays in Shadow.

## Out of scope

- FAAB. These leagues use waiver priority.
- Kickers.
- Dynasty aging and contract dollars.
- A black-box rank as the number on the button.
- Training a new neural net before the grade log has a season of frozen calls.
- Changing league scoring from the grade log.

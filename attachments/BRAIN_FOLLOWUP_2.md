# Program manager order — full desk, brain stays off the button

Date: 2026-10-04. Coder report accepted. Product 6. Brain 2. Gate honesty 8.

The handwritten replay is gone. `cardUsesBrain()` is false. The card is BASELINE. That part stands. Do not put the brain back on the button. It lost the only fair test: MAE 6.69 against a trailing-average MAE of 5.11 on 14 Thursday rows. Week 4 is one game. Four weeks of history do not open the gate.

The user wants every factor and a real self-correction loop. Build all of it into the shadow brain and the next replay. The number on the card stays the trailing Bush League average until that replay wins. A losing model with more inputs is still a losing model.

Both leagues, same scorer: Bush League `1014874` Let Maye Cook, TW Fantasy `210326445` Utility Man. `scoreOffense` and `scoreDst` only.

## P0 — bugs that can lose a week

1. A missed name join is not 0 points and not an inactive. 72 of 219 pool players have no trailing average (30 WR, 25 RB, 10 QB, 7 TE). Match ESPN name and team to nflverse `gsis_id` through a stored crosswalk. If the join fails, the card says `NO TRAIL` and the player is off the start list, the waiver rank, and the trade grade. Do not rank him under a streamer.
2. Floor and ceiling are the last three actual Bush weeks, not `rangeFromP50` around the mean. Floor is the lowest of those weeks. Ceiling is the highest. Expected is the mean. A player with one scored week uses that week for all three and is marked thin. Favorite mode optimizes that floor. Underdog mode optimizes that ceiling. A made-up `0.72 × average` floor is a failed lineup.
3. Rest of season is the remaining schedule, not `average × weeks left × health`. For each future week apply bye = 0, opponent implied total from the nflverse schedule line, and the player's trailing average scaled by that week's team total versus the league-average total. Trades read that sum.
4. Waiver weeks 2 and 3 already take that week's opponent. Keep that. Points are the trailing average scaled by that week's implied total. Not a clone of this week. Not the shadow brain.

## P1 — one real grade loop

Write one Sunday freeze to disk for both leagues. Store player id, opponent, projected counting stats, floor, expected, ceiling, decision, reason, weight version. Monday, score the box score with `scoreOffense` / `scoreDst` and append a grade row. `/grade` shows those rows and nothing invented. One week does not move a weight.

Weights live in a file the projector reads after a restart. `setWeights` in memory is not the loop. A correction that does not survive reload does not count. The unit test of the 0.02 step may stay. It is not the grade page.

Freeze chip only if that file has a row. Empty `FREEZE_ROWS` means no chip.

## P2 — shadow brain, every factor, not on the card

Build this in `brain/` and show it in the drawer under "not in the score." The card does not read it.

Identity and usage, from nflverse, frozen the day before the game in any replay:

- Snap share, route share, target share, carry share, red-zone share, goal-line share.
- Last 3 games and season rate. Last-3 may be null only when the player has fewer than 3 games. That is thin, not zero.
- Teammate out or a backup quarterback: rebuild the shares from the routes and carries left behind. That is the chemistry input. A narrative stack does not raise expected points. It only correlates the 2,000-draw team sample at 0.25.

Availability:

- ESPN status, inactive list, practice participation when the feed has it. Out, IR, bye, inactive → 0. Friday DNP → snap × `qDnpSnap`. Full Friday practice → no cut. Opponent role out (shadow corner, starting tackle, interior run defender) is stored on the opponent row.

Environment:

- Spread and total from the nflverse schedule. Implied team points. Pace. Script pass bump. Wind at or over 20 mph and rain from the NWS point forecast. Dome ignores weather. Missing feed stamps STALE on the shadow row only.

Opponent:

- Position points allowed, dropping games against bottom-5 offenses. Run defense for backs. Pass defense as a quarterback tiebreaker. Raw fantasy points allowed is not a feature.

Count, then score:

- Project attempts, completions, incompletions, sacks, yards, touchdowns, first downs, targets, carries, receptions. Run `scoreOffense` / `scoreDst`. Shadow floor and ceiling come from this player's last scored weeks plus the positional residual, not a fixed ratio.

Store and do not weight until promotion: corner and man-zone tags, home/away, short week, age, rookie, primetime, expert rank, ownership, points over expected. Points over expected is faded, not chased.

## P3 — the replay that can open the gate

Weeks 4 through 7, every skill player with a crosswalk, priors from earlier weeks only. No same-week usage. Score actuals in Bush points. Brain MAE must beat the trailing-average MAE on that set, with at least 40 player-weeks. Then the brain may take the card. Until that file exists and wins, `cardUsesBrain()` stays false.

Do not open the gate because a fourth week elapsed. This brain already lost.

## P4 — self-correction after the loop is real

`correct.ts` runs only on stored grade rows. A tag needs 12 player-weeks across 2 graded weeks to move 0.02, inside the bounds in the spec. Touchdown variance never moves a weight. It may widen the measured floor and ceiling. A step that raises next-week MAE rolls back and freezes that weight for 2 weeks. Scoring coefficients, the 1.5 coin-flip line, and the favorite margin are not weights.

Promotion of a shadow feature is a separate test: 4 graded weeks of lower MAE, no harm on the prior 4, minimum 40 player-weeks, enter at the low bound.

`/grade` shows hit rate only on gaps over 1.5, MAE against the baseline, miss tags, calibration, and the correction log. Split by league and pooled.

## What the user sees this week

Command stays the in-season desk: BASELINE stamp, swaps against the trailing average, waiver, trade, lock clock. Coin-flip under 1.5. `NO TRAIL` is not a start. Brain record in the drawer: lost 6.69 to 5.11, off the card. No weather chart and no new page before P0 and P1.

## Done when

- Zero pool players are ranked at 0 because a name missed.
- Floor and ceiling on the card are actual weeks.
- Rest of season uses the remaining schedule.
- One Sunday freeze is on disk and `/grade` shows Monday's score of it.
- A weight change survives restart and is what the shadow projector loads.
- The shadow row contains usage, script, weather, and opponent injury, labeled not in the score.
- `cardUsesBrain()` is still false.

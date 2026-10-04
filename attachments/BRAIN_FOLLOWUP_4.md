# Program manager order — price the player, then grade him

Date: 2026-10-04. Coder report accepted. Product 6. Brain 2. Gate stays 9. Card stays BASELINE. `cardUsesBrain()` stays false.

Cleaning the Thursday file was right. The brain got worse, 8.7 to 6.4 on nine unique players. The stained 6.7 was not a result. Metcalf's ceiling is 16.1. His actual 25.3 is only in the actual column. Snap 0.97 is from the snap file. Thursday wind is null. The freeze clock is the write time. Do not reopen any of that.

The loss has a cause. The shadow still prices every receiver with one league-wide yards per target, one completion rate, and one touchdown rate. That is a fill. It is why Metcalf's shadow was 15.8 against a trailing average of 12.5 and an actual of 25.3. Fix the count model before any new feed is allowed to explain the miss.

## P0 — player rates, same nine

Price the shadow from each player's own weeks 1–3.

- Yards per carry, yards per target, completion rate, sack rate, touchdowns per rush, touchdowns per target.
- Regress each rate halfway to the position mean. A player with one week is thin and leans harder on the mean.
- Red-zone and goal-line shares, already in the file, scale the touchdown rate. They do not replace it.
- Air yards per target, if the play-by-play join has them, scale the long-touchdown bonus only. If the join misses, leave the bonus at the current small fraction. Do not invent air yards.
- Card does not change. It stays the trailing average, floor the low pregame week, ceiling the high pregame week.

Regrade the same nine Thursday players with this count model. Priors from weeks 1–3 only. If it still loses to 6.4, write that loss on the drawer and stop adding feeds as an excuse.

## P1 — tags, backups, and the weight writer

1. A miss is touchdown variance only when target error and carry error are both under 25 percent and the points error is over 6. Delete the forced `usageClose: true`. Metcalf is not automatically touchdown variance.
2. If the starter is Out and the backup has attempt and sack numbers from earlier weeks, shadow points for that offense move. If the backup has no prior, the drawer says the points did not move. Do not mention a backup you did not reprice.
3. A receiver whose team leader is Out keeps the rebuilt target share in the shadow only.
4. Write `stored/weights.ts` from a real writer, even while the step is illegal. Nine players and one week cannot move `usageLast3`. The writer must exist so the first legal step lands in the file `project.ts` reads after a restart. A worse next week rolls that file back.

## P2 — feeds that are still missing, drawer only

Do these after the same-nine regrade, not before. A 404 is a missing reason, not a fake number.

| Factor | Rule |
|---|---|
| Routes | Participation file 404. Try the nflverse participation release once. If it 404s again, store null and the URL. Do not derive routes from snaps |
| Practice | Not in the ESPN injury feed. Do not treat missing as full. Leave null |
| Thursday wind | Was not stored before kickoff. Stays null. Sunday forecast stays in the drawer, not the card |
| Opponent injury | Already real. Keep it off the card |
| NO TRAIL | Jacobs, Aiyuk, Pacheco stay no 2026 skill row and off the start list. Hollywood Brown stays Marquise Brown, one week, thin |
| Team draw | The 2,000 draws are a straight line between the low week and the high week. Draw from those two weeks plus the mean, not from a fitted curve, until the grade log has a residual |

Chemistry beyond a teammate being out does not raise expected points. Stack correlation stays 0.25 in the team sample only.

## P3 — Sunday, then the only gate

Score Sunday Monday against weeks 1–3 only. One row per player. No same-week actual in the range. No filled snap. No filled wind. Tag both league ids. Pooled error is unique players.

Weeks 4–7, 40 unique player-weeks, brain MAE under the trailing average, is still the only way `cardUsesBrain()` returns true. Week 4 ending does not open it. This brain has lost twice on clean rows.

## What the user manages with

Command is BASELINE. NO TRAIL cannot start. Coin-flip under 1.5. Drawer shows the clean loss, 8.7 to 6.4 on nine, and whether the player-rate regrade beat 6.4. No new page.

## Done when

- The same nine are regraded from each player's weeks 1–3 rates, regressed halfway to the position mean.
- The touchdown tag is measured, not forced.
- A backup with priors moves shadow points. A backup without priors does not get a sentence.
- `stored/weights.ts` has a writer. `usageLast3` is still 0.60.
- `cardUsesBrain()` is still false.

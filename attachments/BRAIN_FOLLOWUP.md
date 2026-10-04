# Program manager follow-up — 2026-10-04

The build report is accepted. Product is a 6. Brain is a 3. Do not add features. Fix the gate that was marked passed with a fixture.

## P0 — take the brain off the button

`src/lib/fantasy/brain/grade.ts` `REPLAY_WEEKS` is a handwritten array. `replay()` then sets `brainOnCard` because those rows were written so the brain would win. `cardUsesBrain()` reads that flag. `model.ts` uses it. `/grade` prints "Brain is on the card."

That is a failed acceptance test, not a passed one.

- `cardUsesBrain()` returns false until a real replay file exists.
- The number on the lineup, waiver, and trade card is the trailing three-week Bush League average.
- Stamp the card BASELINE, not a Sun freeze that did not run.
- Delete `REPLAY_WEEKS` or move it to a test that asserts the function math only. It must not be imported by `ingest.ts`, `model.ts`, or `grade.tsx`.
- Add a test that fails if `brainOnCard` is true while the replay source is an in-repo constant.

## P1 — real replay, then ingest

Replay the last four completed 2026 weeks. Freeze usage, opponent, and available injury status as of the day before each game. Score actual box scores with `scoreOffense` / `scoreDst`. Compare MAE to the trailing three-week baseline. Write the result to a stored replay record with week ids and player ids. If the brain loses, it stays in shadow. If it wins, it may take the card.

Do not invent the rows. Source is nflverse weekly stats and snap counts. `usage.ts` `sharesFromRaw` still derives target share from `rec / 17`. That is the season prior. Last-3 shares are null on the live path. `ingest.ts` already says usage is a season prior and odds and weather are missing. Keep that honesty. Do not stamp a fresh freeze over it.

`freeze.ts` `FREEZES` is a hardcoded Thursday and Sunday timestamp. A freeze row is written only when a job runs, and it stores the projected counting stats. No job, no chip.

## P2 — the grade log has to change next week

`/grade` must read stored grade rows, not `REPLAY`. `correct.ts` may run on those rows only. The weight it writes is the weight `project.ts` uses the next week. Today `sharesFromRaw` blends with a hardcoded 0.6 / 0.4 and ignores the corrected weights. A correction that does not change the next projection is a demo.

Sample misses in `brain.test.ts` may stay as a unit test of the 12-row / 2-week step. They are not the grade page.

## P3 — two calculations that are still shortcuts

- Waiver weeks 2 and 3 must use that week's opponent, spread, total, and bye. Do not reuse this week's projection and zero byes only.
- Command win chance is the 2,000-draw sample. The sample is not only a favorite / toss-up / underdog switch. A formula on Command is a miss.

## Done when

- The card says BASELINE until the stored replay beats the trailing average.
- `/grade` no longer cites the fixture MAE.
- A freeze chip appears only after a real snapshot is stored.
- A usage correction changes the next projection's target share.
- Both league ids still share `scoreOffense` / `scoreDst`.

No new data source, chart, or page before P0 and P1.

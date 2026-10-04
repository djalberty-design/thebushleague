import { SLATE, type SlateWeek } from "./stored/slate";

export function slateFor(team: string, week: number): SlateWeek | null {
  return SLATE[team]?.[String(week)] ?? null;
}

export function teamImplied(slate: SlateWeek | null) {
  if (!slate || slate.bye || slate.spread == null || slate.total == null) return null;
  return slate.total / 2 + slate.spread / 2;
}

export function ownRecentImplied(team: string, weeks: number[]) {
  const values: number[] = [];
  for (const week of weeks) {
    const implied = teamImplied(slateFor(team, week));
    if (implied == null) return null;
    values.push(implied);
  }
  if (!values.length) return null;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

/** B1 lost to the trailing average, 6.31 to 6.19. It is not a bar and it is not on the card. */
export const B1_DISABLED = true;

export function shadowB1(baseline: number, team: string, week: number) {
  if (B1_DISABLED) return null;
  const slate = slateFor(team, week);
  if (slate?.bye) return 0;
  const now = teamImplied(slate);
  const recent = ownRecentImplied(team, [week - 3, week - 2, week - 1].filter((value) => value >= 1));
  if (now == null || recent == null || recent <= 0) return null;
  return baseline * (now / recent);
}

/** Own trailing mean times games left. Bye scores 0. No positional mean. */
export function thinRos(
  team: string,
  weekly: { p20: number; ePts: number; p80: number },
  from = 4,
  through = 17,
) {
  let games = 0;
  for (let week = from; week <= through; week++) {
    const slate = slateFor(team, week);
    if (!slate || slate.bye) continue;
    games += 1;
  }
  const round = (n: number) => Math.round(n * games * 10) / 10;
  return { p20: round(weekly.p20), p50: round(weekly.ePts), p80: round(weekly.p80), ePts: round(weekly.ePts), weeksLeft: games };
}

/** Retired. The star-quarterback mean is not a legal prior. Nothing calls this. */
export function scheduleRos(
  team: string,
  weekly: { p20: number; ePts: number; p80: number },
  roleMean: number,
  from = 4,
  through = 17,
) {
  const recent = ownRecentImplied(team, [from - 3, from - 2, from - 1].filter((week) => week >= 1));
  let expected = 0;
  let low = 0;
  let high = 0;
  let weeks = 0;
  let horizon = 0;
  for (let week = from; week <= through; week++) {
    horizon += 1;
    const slate = slateFor(team, week);
    if (!slate) continue;
    if (slate.bye) {
      weeks += 1;
      continue;
    }
    const shrink = horizon > 3 ? 3 / horizon : 1;
    const base = shrink * weekly.ePts + (1 - shrink) * roleMean;
    const baseLow = shrink * weekly.p20 + (1 - shrink) * roleMean;
    const baseHigh = shrink * weekly.p80 + (1 - shrink) * roleMean;
    const implied = teamImplied(slate);
    const scale = implied != null && recent != null && recent > 0 ? implied / recent : 1;
    expected += base * scale;
    low += baseLow * scale;
    high += baseHigh * scale;
    weeks += 1;
  }
  const round = (n: number) => Math.round(n * 10) / 10;
  return { p20: round(low), p50: round(expected), p80: round(high), ePts: round(expected), weeksLeft: weeks };
}

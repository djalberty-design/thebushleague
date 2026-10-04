import { readFileSync, writeFileSync } from "node:fs";
import { indexReplay, projectReplay, type ReplayGame, type ReplayIndex, type ReplayRow } from "../src/lib/fantasy/brain/replay-project.ts";
import { TRAILS } from "../src/lib/fantasy/brain/stored/trails.ts";
import { SUNDAY_FREEZE } from "../src/lib/fantasy/brain/stored/sunday-freeze.ts";
import { NINE } from "../src/lib/fantasy/brain/stored/nine.ts";

const TARGET = new Set([7, 9, 11, 13, 15, 17]);
const TUNE = new Set([5, 7, 9, 11, 13, 15, 17]);
const NINE_IDS = [
  "dk-metcalf",
  "kc-concepcion",
  "quinshon-judkins",
  "harold-fannin-jr",
  "deshaun-watson",
  "denzel-boston",
  "michael-pittman-jr",
  "jaylen-warren",
  "aaron-rodgers",
];

function writeModule(path: string, name: string, value: unknown) {
  writeFileSync(path, `export const ${name} = ${JSON.stringify(value, null, 2)}\n`);
}

function fitShrink(rows: ReplayRow[]) {
  if (rows.some((row) => row.week % 2 === 0 && row.week >= 4)) {
    throw new Error("even weeks 4-18 leaked into the shrink fit");
  }
  const qbs = rows.filter((row) => row.pos === "QB");
  const attempts = new Map<string, Map<string, number>>();
  for (const row of qbs) {
    if (row.week > 3) continue;
    const club = attempts.get(row.team) ?? new Map<string, number>();
    club.set(row.id, (club.get(row.id) ?? 0) + row.att);
    attempts.set(row.team, club);
  }
  const starters = new Set<string>();
  for (const club of attempts.values()) {
    let max = 0;
    for (const att of club.values()) max = Math.max(max, att);
    if (max <= 0) continue;
    for (const [id, att] of club) if (att === max) starters.add(id);
  }
  const seenEarly = new Set(qbs.filter((row) => row.week <= 3).map((row) => row.id));
  const backups = new Set([...seenEarly].filter((id) => !starters.has(id)));

  function roleFit(ids: Set<string>, role: string) {
    const early = new Map<string, number[]>();
    const later = new Map<string, number[]>();
    for (const row of qbs) {
      if (!ids.has(row.id)) continue;
      if (row.week <= 3) {
        const list = early.get(row.id) ?? [];
        list.push(row.points);
        early.set(row.id, list);
      } else if (TARGET.has(row.week)) {
        const list = later.get(row.id) ?? [];
        list.push(row.points);
        later.set(row.id, list);
      }
    }
    const sample: { early: number; later: number }[] = [];
    const priorParts: number[] = [];
    for (const [id, points] of early) {
      const mean = points.reduce((sum, n) => sum + n, 0) / points.length;
      priorParts.push(mean);
      const target = later.get(id);
      if (!target?.length) continue;
      sample.push({ early: mean, later: target.reduce((sum, n) => sum + n, 0) / target.length });
    }
    const prior = priorParts.length ? priorParts.reduce((sum, n) => sum + n, 0) / priorParts.length : null;
    if (prior == null || sample.length < 8) {
      return { role, weight: null, prior, n: sample.length, priorN: priorParts.length, mae: null, applied: false as const };
    }
    let best = { weight: 1, mae: Number.POSITIVE_INFINITY };
    for (let step = 0; step <= 20; step++) {
      const weight = step / 20;
      const mae = sample.reduce((sum, row) => sum + Math.abs(row.later - (weight * row.early + (1 - weight) * prior)), 0) / sample.length;
      if (mae < best.mae - 1e-9 || (Math.abs(mae - best.mae) <= 1e-9 && weight > best.weight)) best = { weight, mae };
    }
    return {
      role,
      weight: best.weight,
      prior: Math.round(prior * 1000) / 1000,
      n: sample.length,
      priorN: priorParts.length,
      mae: Math.round(best.mae * 1000) / 1000,
      applied: false as const,
    };
  }

  return {
    applied: false,
    evenWeeksBurned: true,
    feature: "Bush mean of weeks 1-3. Week 2 is included because it is before the held-out half.",
    target: "Bush mean of odd weeks 7, 9, 11, 13, 15, and 17. Even weeks 4-18 were not read.",
    priorRule: "Mean of that pregame role's weeks 1-3 means, including quarterbacks with no target weeks.",
    starter: roleFit(starters, "most pass attempts on his club in weeks 1-3"),
    backup: roleFit(backups, "every other quarterback with a week 1-3 attempt"),
  };
}

function round3(n: number) {
  return Math.round(n * 1000) / 1000;
}

const frame = JSON.parse(readFileSync("/tmp/nfl2025/frame.json", "utf8")) as { weeks: ReplayRow[]; games: ReplayGame[]; held: { id: string; week: number; pos: string; team: string; actual: number; b0: number; b1: number; b2: number }[] };
const shrinkRows = frame.weeks.filter((row) => row.week <= 3 || row.week % 2 === 1);
const shrink = fitShrink(shrinkRows);
writeModule("src/lib/fantasy/brain/stored/shrink.ts", "SHRINK", shrink);

const index = indexReplay(frame.weeks, frame.games);
let absSum = 0;
let maxAbs = 0;
let nulls = 0;
const failures: { id: string; week: number; python: number; ts: number | null; diff: number | null }[] = [];
const scored: { actual: number; b0: number; ts: number; week: number }[] = [];
for (const row of frame.held) {
  const priors = (index.byPlayer.get(row.id) ?? []).filter((item) => item.week < row.week);
  const parts = projectReplay(index, priors, row.pos, row.team, row.week, 0.6);
  if (!parts) {
    nulls += 1;
    if (failures.length < 15) failures.push({ id: row.id, week: row.week, python: row.b2, ts: null, diff: null });
    continue;
  }
  const diff = Math.abs(parts.points - row.b2);
  absSum += diff;
  if (diff > maxAbs) maxAbs = diff;
  if (diff > 0.25 && failures.length < 15) failures.push({ id: row.id, week: row.week, python: row.b2, ts: parts.points, diff });
  scored.push({ actual: row.actual, b0: row.b0, ts: parts.points, week: row.week });
}
const meanAbs = frame.held.length ? absSum / frame.held.length : null;
const passed = nulls === 0 && frame.held.length === 2076 && meanAbs != null && meanAbs <= 0.05 && maxAbs <= 0.25;

let disagree = 0;
let errorSaved = 0;
const higher = { n: 0, actual: 0, trailing: 0, swing: 0 };
const lower = { n: 0, actual: 0, trailing: 0, swing: 0 };
for (const row of scored) {
  if (Math.abs(row.ts - row.b0) <= 1.5) continue;
  disagree += 1;
  errorSaved += Math.abs(row.actual - row.b0) - Math.abs(row.actual - row.ts);
  const side = row.ts > row.b0 ? higher : lower;
  side.n += 1;
  side.actual += row.actual;
  side.trailing += row.b0;
  side.swing += row.actual - row.b0;
}
const decisions = {
  rows: frame.held.length,
  threshold: 1.5,
  disagree,
  share: frame.held.length ? round3(disagree / frame.held.length) : null,
  b2Higher: { n: higher.n, actualSum: round3(higher.actual), trailingSum: round3(higher.trailing), actualMinusTrailing: round3(higher.swing) },
  b0Higher: { n: lower.n, actualSum: round3(lower.actual), trailingSum: round3(lower.trailing), actualMinusTrailing: round3(lower.swing) },
  netActual: round3(higher.swing - lower.swing),
  errorSaved: round3(errorSaved),
  definition: "A disagreement is |B2-B0| > 1.5. netActual is the sum of (actual-trailing) when B2 is higher, minus that sum when B0 is higher. errorSaved is the absolute-error points B2 saves on those rows. This does not open the gate.",
  opensGate: false,
};
writeModule("src/lib/fantasy/brain/stored/decisions.ts", "DECISIONS", decisions);

let odd: Record<string, unknown> = { ran: false, reason: "Parity had not passed." };
if (passed) {
  const blocks = new Map<number, { err: number; n: number; abs0: number; abs2: number }>();
  for (const list of index.byPlayer.values()) {
    for (const item of list) {
      if (!TUNE.has(item.week)) continue;
      const priors = list.filter((row) => row.week < item.week);
      if (!priors.length) continue;
      const parts = projectReplay(index, priors, item.pos, item.team, item.week, 0.6);
      if (!parts) continue;
      const trail = priors.slice(-3);
      const b0 = trail.reduce((sum, row) => sum + row.points, 0) / trail.length;
      const block = blocks.get(item.week) ?? { err: 0, n: 0, abs0: 0, abs2: 0 };
      block.n += 1;
      block.abs0 += Math.abs(item.points - b0);
      block.abs2 += Math.abs(item.points - parts.points);
      block.err += Math.abs(item.points - b0) - Math.abs(item.points - parts.points);
      blocks.set(item.week, block);
    }
  }
  const deltas = [...blocks.entries()].sort((a, b) => a[0] - b[0]).map(([week, block]) => ({ week, n: block.n, delta: block.err / block.n, abs0: block.abs0, abs2: block.abs2 }));
  const mean = deltas.reduce((sum, row) => sum + row.delta, 0) / deltas.length;
  const variance = deltas.reduce((sum, row) => sum + (row.delta - mean) ** 2, 0) / Math.max(1, deltas.length - 1);
  const lowerBound = mean - 1.96 * Math.sqrt(variance / deltas.length);
  const n = deltas.reduce((sum, row) => sum + row.n, 0);
  const mae0 = deltas.reduce((sum, row) => sum + row.abs0, 0) / n;
  const mae2 = deltas.reduce((sum, row) => sum + row.abs2, 0) / n;
  const gap = mae0 - mae2;
  odd = {
    ran: true,
    preRegistered: "Week-block delta is the mean of |actual-B0| minus |actual-B2|. The lower bound is that mean minus 1.96 standard errors across weeks. It has to clear zero. The MAE gap has to clear 0.25. The even-week decision count has to be positive. A pass still does not open the card.",
    weeks: deltas.map((row) => ({ week: row.week, n: row.n, delta: round3(row.delta) })),
    lowerBound: round3(lowerBound),
    maeB0: round3(mae0),
    maeB2: round3(mae2),
    gap: round3(gap),
    decisionCount: disagree,
    passed: lowerBound > 0 && gap >= 0.25 && disagree > 0,
    opensGate: false,
  };
}

writeModule("src/lib/fantasy/brain/stored/parity.ts", "PARITY", {
  rows: frame.held.length,
  nulls,
  meanAbs,
  maxAbs,
  passed,
  failures: failures.map((row) => ({ ...row, python: round3(row.python), ts: row.ts == null ? null : round3(row.ts), diff: row.diff == null ? null : round3(row.diff) })),
  weight: 0.6,
  redZone: null,
  bonus50: 0,
  research: "6.04 and 5.98 stay research until this pass is true. The locked even-week file was not rewritten.",
  odd,
});

const identity = JSON.parse(readFileSync("/tmp/nfl/identity.json", "utf8")) as { players: { gsis: string; name: string }[] };
function nkey(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]/g, "").replace(/(jr|sr|iii|ii)$/, "");
}
const gsisByName = new Map(identity.players.map((player) => [nkey(player.name), player.gsis]));

function projectWeek4(id: string, source: ReplayIndex) {
  const gsis = TRAILS[id]?.gsis ?? gsisByName.get(nkey(id)) ?? null;
  const list = gsis ? source.byPlayer.get(gsis) ?? [] : [];
  const priors = list.filter((row) => row.week < 4);
  const last = priors[priors.length - 1];
  const parts = last ? projectReplay(source, priors, last.pos, last.team, 4, 0.6) : null;
  const b0 = priors.length ? priors.reduce((sum, row) => sum + row.points, 0) / priors.length : null;
  const reason = !gsis ? "No 2026 skill identity. Defense is outside this projector." : priors.length === 0 ? "No weeks 1-3. Not priced." : parts ? "Weeks 1-3 only. Not on the card." : "Projector returned nothing.";
  return {
    playerId: id,
    gsis,
    pos: last?.pos ?? null,
    team: last?.team ?? null,
    games: priors.length,
    b0: b0 == null ? null : round3(b0),
    brain: parts ? round3(parts.points) : null,
    teamPlays: parts ? round3(parts.teamPlays) : null,
    targets: parts ? round3(parts.targets) : null,
    carries: parts ? round3(parts.carries) : null,
    receptions: parts ? round3(parts.receptions) : null,
    firstDowns: parts ? round3(parts.firstDowns) : null,
    reason,
  };
}

const frame26 = JSON.parse(readFileSync("/tmp/nfl/frame2026.json", "utf8")) as { weeks: ReplayRow[]; games: ReplayGame[] };
const index26 = indexReplay(frame26.weeks, frame26.games);
const nineRows = NINE_IDS.map((id) => {
  const projected = projectWeek4(id, index26);
  const stored = NINE.rows.find((row) => row.playerId === id);
  return { ...projected, actual: stored?.actual ?? null, oldBrain: stored?.brain ?? null, oldB0: stored?.b0 ?? null };
});
writeModule("src/lib/fantasy/brain/stored/nine-parity.ts", "NINE_PARITY", {
  priors: "weeks 1-3 only",
  regradedCard: false,
  oldActualMean: NINE.actualMean,
  oldB0Mean: NINE.b0Mean,
  oldBrainMean: NINE.brainMean,
  rows: nineRows,
});

const sundayIds = [...new Set(SUNDAY_FREEZE.map((row) => row.playerId))];
writeModule("src/lib/fantasy/brain/stored/sunday-parity.ts", "SUNDAY_PARITY", {
  week: 4,
  priors: "weeks 1-3 only",
  confirms: true,
  opensGate: false,
  rows: sundayIds.map((id) => projectWeek4(id, index26)),
});

console.log(JSON.stringify({ passed, rows: frame.held.length, nulls, meanAbs, maxAbs, disagree, shrink: shrink.starter, odd }, null, 2));

const { toPlayerState } = await import("../src/lib/fantasy/model.ts");
const { PLAYERS } = await import("../src/lib/fantasy/players.ts");
const maye = PLAYERS.find((player) => player.id === "drake-maye");
if (!maye) throw new Error("Maye missing");
const state = toPlayerState(maye, 4);
console.log(JSON.stringify({ mayeRos: state.ros, mayeReason: state.reason, card: state.weekly.ePts }));


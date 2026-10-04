import { readFileSync, writeFileSync } from "node:fs";
import { GRADE_ROWS } from "../src/lib/fantasy/brain/stored/grades.ts";
import { scoreOffense } from "../src/lib/fantasy/scoring.ts";
import type { CountStats } from "../src/lib/fantasy/types.ts";

const pack = JSON.parse(readFileSync("/tmp/nfl/identity.json", "utf8")) as {
  players: { gsis: string; name: string; pos: string; team: string; weeks: Record<string, { stats: CountStats; targets: number; carries: number; attempts: number }> }[];
  scoredTeams: Record<string, string[]>;
};

const teamRush = new Map<string, number>();
for (const player of pack.players) {
  const week = player.weeks["4"];
  if (!week) continue;
  teamRush.set(player.team, (teamRush.get(player.team) ?? 0) + week.carries);
}
const teamRushPrior = new Map<string, number>();
for (const player of pack.players) {
  let plays = 0;
  let games = 0;
  for (const week of [1, 2, 3]) {
    const row = player.weeks[String(week)];
    if (!row) continue;
  }
  const seen = new Set<number>();
  for (const week of [1, 2, 3]) {
    if (seen.has(week) || !player.weeks[String(week)]) continue;
  }
}
const pace = new Map<string, { att: number; car: number; n: number }>();
for (const player of pack.players) {
  for (const week of [1, 2, 3]) {
    const row = player.weeks[String(week)];
    if (!row) continue;
    const key = `${player.team}:${week}`;
    const bucket = pace.get(key) ?? { att: 0, car: 0, n: 0 };
    bucket.att += row.attempts;
    bucket.car += row.carries;
    pace.set(key, bucket);
  }
}

function priorPace(team: string) {
  const rows = [1, 2, 3].map((week) => pace.get(`${team}:${week}`)).filter((row): row is { att: number; car: number; n: number } => Boolean(row));
  if (!rows.length) return null;
  return rows.reduce((sum, row) => sum + row.att + row.car, 0) / rows.length;
}

function norm(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

const lines = GRADE_ROWS.map((row) => {
  const ident = pack.players.find((player) => norm(player.name) === norm(row.playerId) && player.weeks["4"])
    ?? pack.players.find((player) => norm(player.name).includes(norm(row.playerId).slice(0, 10)) && player.weeks["4"]);
  const week4 = ident?.weeks["4"];
  const actualStats = week4?.stats;
  const hand = actualStats ? Math.round(scoreOffense(actualStats) * 10) / 10 : null;
  const projected = row.projected as CountStats;
  const paid = ["rec", "refd", "rfd", "ret", "ra", "pfd"] as const;
  const dropped = actualStats ? paid.filter((key) => (actualStats[key] ?? 0) > 0 && (projected[key] ?? 0) === 0) : [];
  const actualCarries = week4?.carries ?? row.actualCarries;
  const teamCar = ident ? teamRush.get(ident.team) ?? 0 : 0;
  const projectedShare = teamCar && projected.ra ? projected.ra / priorPace(ident?.team ?? "")! : null;
  const actualShare = teamCar ? actualCarries / teamCar : null;
  const projectedTeamRush = projectedShare && projectedShare > 0 ? projected.ra / projectedShare : null;
  const carryGap = projectedTeamRush != null && actualShare != null && projectedShare != null
    ? (teamCar - projectedTeamRush) * projectedShare + teamCar * (actualShare - projectedShare)
    : null;
  const tdGap = ((actualStats?.rtd ?? 0) + (actualStats?.retd ?? 0) + (actualStats?.ptd ?? 0)) - ((projected.rtd ?? 0) + (projected.retd ?? 0) + (projected.ptd ?? 0));
  const afterTd = row.actualPoints - 6 * tdGap;
  const volumeClose = actualCarries > 0 ? Math.abs(projected.ra - actualCarries) / actualCarries <= 0.15 : Math.abs(projected.ret - row.actualTargets) / Math.max(1, row.actualTargets) <= 0.15;
  return {
    playerId: row.playerId,
    hand,
    handAgrees: hand === row.actualPoints,
    actual: row.actualPoints,
    b0: row.baseline,
    brain: row.ePts,
    recentLow: row.p20,
    recentHigh: row.p80,
    targets: Number(projected.ret.toFixed(2)),
    actualTargets: row.actualTargets,
    carries: Number(projected.ra.toFixed(2)),
    actualCarries,
    receptions: Number(projected.rec.toFixed(2)),
    actualReceptions: actualStats ? Number(actualStats.rec.toFixed(2)) : null,
    firstDowns: Number(((projected.rfd ?? 0) + (projected.refd ?? 0) + (projected.pfd ?? 0)).toFixed(2)),
    actualFirstDowns: actualStats ? Number((actualStats.rfd + actualStats.refd + actualStats.pfd).toFixed(2)) : null,
    teamPlays: ident ? priorPace(ident.team) : null,
    carryGap: carryGap == null ? null : Number(carryGap.toFixed(2)),
    droppedPaidCounts: dropped,
    volumeClose,
    remainderAfterTouchdowns: Number(afterTd.toFixed(1)),
    touchdownExplains: volumeClose && Math.abs(afterTd - (row.ePts ?? row.baseline)) <= 4,
    shareShrunk: false,
  };
});

const actualMean = lines.reduce((sum, row) => sum + row.actual, 0) / lines.length;
const b0Mean = lines.reduce((sum, row) => sum + row.b0, 0) / lines.length;
const brainMean = lines.reduce((sum, row) => sum + (row.brain ?? 0), 0) / lines.length;
const body = `export const NINE = ${JSON.stringify({ actualMean: Number(actualMean.toFixed(2)), b0Mean: Number(b0Mean.toFixed(2)), brainMean: Number(brainMean.toFixed(2)), regraded: false, reason: "Shares were not shrunk. A regrade was not run. Dropped paid counts are listed per player.", rows: lines }, null, 2)};\n`;
writeFileSync("src/lib/fantasy/brain/stored/nine.ts", body);
console.log(JSON.stringify({ actualMean, b0Mean, brainMean, judkins: lines.find((row) => row.playerId.includes("judkins")) }, null, 2));

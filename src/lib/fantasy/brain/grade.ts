import type { GradeRow, MissTag } from "./types";

export function assignTag(input: {
  targetError: number;
  carryError: number;
  scriptError: number;
  injuryMiss: boolean;
  weatherMiss: boolean;
  pointsError: number;
  usageClose: boolean;
}): MissTag {
  if (input.injuryMiss) return "injury";
  if (input.weatherMiss) return "weather";
  if (input.targetError > 0.25 || input.carryError > 0.25) return "usage";
  if (input.scriptError > 0.15) return "script";
  if (input.usageClose && input.pointsError > 6) return "touchdown variance";
  return "unknown";
}

export function mae(rows: GradeRow[], key: "ePts" | "baseline") {
  const priced = rows.filter((row) => row[key] != null);
  if (!priced.length) return 0;
  const total = priced.reduce((sum, row) => sum + Math.abs(row.actualPoints - (row[key] ?? 0)), 0);
  return total / priced.length;
}

export function startHitRate(calls: { gap: number; hit: boolean }[]) {
  const graded = calls.filter((c) => Math.abs(c.gap) > 1.5);
  const hits = graded.filter((c) => c.hit).length;
  return { hits, n: graded.length };
}

export interface ReplayRow {
  actual: number;
  brain: number;
  baseline: number;
}

/** Math only. A true result here must not put the brain on the card. */
export function replay(rows: ReplayRow[]) {
  const brainMae = rows.reduce((s, r) => s + Math.abs(r.actual - r.brain), 0) / Math.max(1, rows.length);
  const baselineMae = rows.reduce((s, r) => s + Math.abs(r.actual - r.baseline), 0) / Math.max(1, rows.length);
  return { brainMae, baselineMae, brainOnCard: rows.length > 0 && brainMae < baselineMae };
}

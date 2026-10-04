import { gridUsageLast3 } from "./correct";
import type { GradeRow } from "./types";
import type { BrainWeights } from "./weights";

export function commitDecision(rows: GradeRow[], current: BrainWeights) {
  const weeks = new Set(rows.map((row) => row.week)).size;
  const decision = gridUsageLast3(() => 0, current.usageLast3, weeks);
  if (!decision.write) return { weights: current, write: false, reason: decision.reason };
  return {
    weights: { ...current, usageLast3: decision.value, usageSeason: Number((1 - decision.value).toFixed(2)) },
    write: true,
    reason: decision.reason,
  };
}

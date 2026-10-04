import type { CorrectionRow, GradeRow } from "./types";
import { DEFAULT_WEIGHTS, type BrainWeights } from "./weights";

export function correctWeights(rows: GradeRow[], weights: BrainWeights = DEFAULT_WEIGHTS) {
  return { weights, corrections: [] as CorrectionRow[], rows: rows.length };
}

export function gridUsageLast3(score: (weight: number) => number, current = 0.6, gradedWeeks: number) {
  if (gradedWeeks < 2) return { value: current, write: false, reason: "Two graded weeks do not exist. usageLast3 stays 0.60." };
  const base = score(current);
  let best = current;
  let bestMae = base;
  for (let step = 0; step <= 8; step++) {
    const weight = Number((0.4 + step * 0.05).toFixed(2));
    const mae = score(weight);
    if (base - mae >= 0.25 && mae < bestMae) {
      best = weight;
      bestMae = mae;
    }
  }
  if (best === current) return { value: current, write: false, reason: "No grid point beat 0.60 by 0.25 MAE." };
  return { value: best, write: true, reason: `usageLast3 ${current.toFixed(2)} to ${best.toFixed(2)} on the tune half.` };
}

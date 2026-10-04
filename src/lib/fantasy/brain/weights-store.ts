import { STORED_WEIGHTS } from "./stored/weights";
import type { BrainWeights } from "./weights";

export function getWeights(): BrainWeights {
  return STORED_WEIGHTS;
}

import { writeFileSync } from "node:fs";
import { commitDecision } from "../src/lib/fantasy/brain/commit";
import { GRADE_ROWS } from "../src/lib/fantasy/brain/stored/grades";
import { STORED_WEIGHTS } from "../src/lib/fantasy/brain/stored/weights";
import type { BrainWeights } from "../src/lib/fantasy/brain/weights";

function render(weights: BrainWeights) {
  return `import type { BrainWeights } from "../weights";\nexport const STORED_WEIGHTS: BrainWeights = ${JSON.stringify(weights)};\n`;
}

const decision = commitDecision(GRADE_ROWS, STORED_WEIGHTS);
const weights = decision.write ? decision.weights : STORED_WEIGHTS;
writeFileSync("src/lib/fantasy/brain/stored/weights.ts", render(weights));
console.log(JSON.stringify({ write: decision.write, reason: decision.reason, usageLast3: weights.usageLast3 }));

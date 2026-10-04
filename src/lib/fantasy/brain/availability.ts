import type { BrainWeights } from "./weights";
import type { AvailabilityView } from "./types";

export function availabilityFrom(input: {
  status?: string | null;
  bye?: boolean;
  inactive?: boolean;
  practice?: "DNP" | "LIMITED" | "FULL" | null;
  teammateOut?: boolean;
  backupQb?: boolean;
}, weights: BrainWeights): AvailabilityView {
  const status = input.status ?? "Active";
  const out = Boolean(input.bye || input.inactive || status === "O" || status === "IR" || status === "SSPD");
  let snapMult = 1;
  let fact = "Active.";
  if (out) {
    snapMult = 0;
    fact = input.bye ? "Bye." : input.inactive ? "Inactive." : `${status}.`;
  } else if (status === "Q" && input.practice === "DNP") {
    snapMult = weights.qDnpSnap;
    fact = "Questionable, Friday DNP.";
  } else if (status === "Q" && input.practice === "FULL") {
    fact = "Questionable, Friday full practice.";
  } else if (status === "Q" || status === "D") {
    snapMult = status === "D" ? 0.8 : 0.9;
    fact = `${status}.`;
  }
  if (input.teammateOut && !out) fact = `${fact} Teammate out, usage rebuilt.`;
  if (input.backupQb && !out) fact = `${fact} Backup quarterback.`;
  return {
    snapMult,
    practice: input.practice ?? null,
    out,
    teammateOut: Boolean(input.teammateOut),
    backupQb: Boolean(input.backupQb),
    fact,
  };
}

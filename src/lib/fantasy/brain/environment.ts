import type { BrainWeights } from "./weights";
import type { EnvironmentView } from "./types";

export function impliedPoints(total: number, spread: number) {
  return total / 2 - spread / 2;
}

export function environmentFrom(input: {
  spread: number | null;
  total: number | null;
  pace: number | null;
  wind?: number | null;
  rain?: boolean;
  dome?: boolean;
}, weights: BrainWeights): EnvironmentView {
  const stale = input.spread == null || input.total == null;
  const pace = input.pace ?? 63;
  const spread = input.spread ?? 0;
  let passRate = 0.57;
  const rushRate = 0.43;
  if (!stale && spread >= 7) passRate += weights.scriptPassBump;
  if (!stale && spread <= -7) passRate -= weights.scriptPassBump;
  passRate = Math.min(0.72, Math.max(0.45, passRate));
  return {
    spread: input.spread,
    total: input.total,
    implied: input.total == null ? null : impliedPoints(input.total, spread),
    pace,
    passRate,
    rushRate: 1 - passRate || rushRate,
    wind: input.dome ? 0 : (input.wind ?? null),
    rain: input.dome ? false : Boolean(input.rain),
    dome: Boolean(input.dome),
    stale,
  };
}

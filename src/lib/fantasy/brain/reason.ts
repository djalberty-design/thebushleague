import type { FeatureSnapshot } from "./types";

export function reasonLine(features: FeatureSnapshot) {
  const share = Math.round(features.usage.targetShare * 100);
  const total = features.env.total == null ? "n/a" : features.env.total.toFixed(1);
  const body = `${share}% targets over the last 3. Team total ${total}. ${features.availability.fact}`;
  return features.stale ? `STALE. ${body}` : body;
}

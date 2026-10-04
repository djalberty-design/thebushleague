import { availabilityFrom } from "./availability";
import { environmentFrom } from "./environment";
import { applyWeights, sharesFromRaw } from "./usage";
import type { FeatureSnapshot, ShadowFeatures } from "./types";
import type { BrainWeights } from "./weights";

export function featuresFor(input: {
  pos: string;
  usage: number;
  rec: number;
  age: number;
  rook?: boolean;
  home: boolean;
  adp12: number;
  status?: string | null;
  bye: boolean;
  weights: BrainWeights;
  spread?: number | null;
  total?: number | null;
  pace?: number | null;
  wind?: number | null;
  rain?: boolean;
  dome?: boolean;
  practice?: "DNP" | "LIMITED" | "FULL" | null;
  inactive?: boolean;
  teammateOut?: boolean;
  backupQb?: boolean;
  games?: number;
  last3Target?: number | null;
}): FeatureSnapshot {
  const usage = applyWeights(
    sharesFromRaw({
      pos: input.pos,
      usage: input.usage,
      rec: input.rec,
      games: input.games,
      last3Target: input.last3Target,
    }),
    input.weights,
  );
  const env = environmentFrom(
    { spread: input.spread ?? null, total: input.total ?? null, pace: input.pace ?? null, wind: input.wind, rain: input.rain, dome: input.dome },
    input.weights,
  );
  const availability = availabilityFrom(
    {
      status: input.status,
      bye: input.bye,
      inactive: input.inactive,
      practice: input.practice,
      teammateOut: input.teammateOut,
      backupQb: input.backupQb,
    },
    input.weights,
  );
  if (input.teammateOut && input.pos !== "QB") usage.targetShare = Math.min(0.4, usage.targetShare + 0.04);
  const snapCut = input.pos === "RB" && usage.snap < 0.58 ? 0.9 : 1;
  usage.snap *= availability.snapMult * snapCut;
  const shadow: ShadowFeatures = {
    corner: 0,
    stack: 0,
    home: input.home ? 1 : 0,
    shortWeek: 0,
    ageFlag: (input.pos === "RB" && input.age >= 29) || (input.pos === "WR" && input.age >= 32) ? 1 : 0,
    rookie: input.rook ? 1 : 0,
    rzExtra: 0,
    oppPace: env.pace,
    narrative: 0,
    ecr: input.adp12,
    owned: 0,
    fpoe: 0,
  };
  return { usage, env, availability, shadow, stale: env.stale || input.wind == null };
}

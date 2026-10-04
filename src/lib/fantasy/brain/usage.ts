import type { BrainWeights } from "./weights";
import type { UsageShares } from "./types";

export function blendShare(last3: number | null, season: number, games: number, weights: BrainWeights) {
  if (games < 3 || last3 == null) return season;
  return weights.usageLast3 * last3 + weights.usageSeason * season;
}

export function sharesFromRaw(input: {
  pos: string;
  usage: number;
  rec: number;
  games?: number;
  last3Target?: number | null;
  last3Carry?: number | null;
}): UsageShares {
  const games = input.games ?? (input.last3Target == null && input.last3Carry == null ? 0 : 3);
  const snap = Math.min(0.95, Math.max(0.2, input.usage / 100));
  const seasonTarget = input.pos === "QB" ? 0 : Math.min(0.35, Math.max(0.04, input.rec / 17 / 34));
  const seasonCarry = input.pos === "RB" ? snap * 0.62 : input.pos === "QB" ? 0.12 : 0.02;
  return {
    games,
    snap,
    targetShare: seasonTarget,
    carryShare: seasonCarry,
    routeShare: input.pos === "WR" || input.pos === "TE" ? snap * 0.9 : snap * 0.4,
    rzShare: snap * 0.5,
    last3TargetShare: input.last3Target ?? null,
    seasonTargetShare: seasonTarget,
    last3CarryShare: input.last3Carry ?? null,
    seasonCarryShare: seasonCarry,
  };
}

export function applyWeights(shares: UsageShares, weights: BrainWeights): UsageShares {
  return {
    ...shares,
    targetShare: blendShare(shares.last3TargetShare, shares.seasonTargetShare, shares.games, weights),
    carryShare: blendShare(shares.last3CarryShare, shares.seasonCarryShare, shares.games, weights),
  };
}

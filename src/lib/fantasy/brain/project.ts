import { expectedPoints, projectDst, projectOffense, rangeFromP50, scoreDst, scoreOffense } from "../scoring";
import type { CountStats, DstStats, Pos, Range, RawPlayer } from "../types";
import { featuresFor } from "./features";
import { reasonLine } from "./reason";
import type { FeatureSnapshot } from "./types";
import { DEFAULT_WEIGHTS, type BrainWeights } from "./weights";
import { getWeights } from "./weights-store";

export interface BrainProjection {
  stats: CountStats | DstStats;
  range: Range;
  source: "counting" | "converted";
  stale: boolean;
  reason: string;
  features: FeatureSnapshot;
  points: number;
}

function sketchFor(pos: Pos, features: FeatureSnapshot, weights: BrainWeights) {
  const snap = features.availability.out ? 0 : features.usage.snap;
  const ypt = pos === "TE" ? 7.2 : pos === "RB" ? 6.4 : pos === "QB" ? 7.3 : 8.4;
  return {
    pos: pos as "QB" | "RB" | "WR" | "TE",
    plays: features.env.pace,
    passRate: features.env.passRate,
    rushRate: features.env.rushRate,
    qbShare: pos === "QB" ? 0.98 : 1,
    carryShare: pos === "QB" ? 0.08 : features.usage.carryShare,
    targetShare: pos === "QB" ? 0 : features.usage.targetShare * (features.availability.backupQb ? 0.92 : 1),
    snap,
    ypc: pos === "QB" ? 5.2 : 4.3,
    ypt: features.availability.backupQb && pos !== "QB" ? ypt * 0.92 : ypt,
    tdPerRush: 0.045,
    tdPerTarget: features.availability.backupQb && pos !== "QB" ? 0.035 : 0.05,
    cmp: 0.65,
    sackRate: 0.07,
    explosive: features.usage.targetShare > 0.2 ? 0.2 : 0.08,
    wind: features.env.wind,
    rain: features.env.rain,
    windPassCut: weights.windPassCut,
    efficiencyRegress: weights.efficiencyRegress,
  };
}

export function projectFeatures(pos: Pos, features: FeatureSnapshot, weights: BrainWeights = DEFAULT_WEIGHTS): BrainProjection {
  if (pos === "DST") {
    const stats = projectDst({
      impliedOpp: features.env.implied ?? 22.5,
      oppPace: features.env.pace,
      oppTurnoverRate: 0.12,
      spread: features.env.spread ?? 0,
    });
    const p50 = scoreDst(stats);
    const range = rangeFromP50(p50, 60, 50);
    return {
      stats,
      range: { ...range, ePts: expectedPoints(range.p20, range.p50, range.p80) },
      source: "counting",
      stale: features.stale,
      reason: reasonLine(features),
      features,
      points: p50,
    };
  }
  const stats = projectOffense(sketchFor(pos, features, weights));
  const p50 = scoreOffense(stats);
  const range = rangeFromP50(Math.max(0, p50), 62, 58);
  return {
    stats,
    range,
    source: p50 > 0 || features.availability.out ? "counting" : "converted",
    stale: features.stale,
    reason: reasonLine(features),
    features,
    points: p50,
  };
}

export function projectFromRaw(
  player: RawPlayer,
  week: number,
  weights: BrainWeights = getWeights(),
  extra?: { last3Target?: number | null; games?: number },
): BrainProjection {
  const features = featuresFor({
    pos: player.pos,
    usage: player.usage,
    rec: player.rec,
    age: player.age,
    rook: player.rook,
    home: player.home,
    adp12: player.adp12,
    status: player.status,
    bye: player.bye === week,
    weights,
    games: extra?.games,
    last3Target: extra?.last3Target ?? null,
  });
  return projectFeatures(player.pos, features, weights);
}

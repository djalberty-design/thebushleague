export interface BrainWeights {
  version: string;
  usageLast3: number;
  usageSeason: number;
  scriptPassBump: number;
  opponentScale: number;
  windPassCut: number;
  qDnpSnap: number;
  efficiencyRegress: number;
  floorRatio: number;
  ceilRatio: number;
  frozen: Partial<Record<keyof Omit<BrainWeights, "version" | "frozen">, number>>;
}

export const WEIGHT_BOUNDS = {
  usageLast3: [0.4, 0.8],
  scriptPassBump: [0, 0.16],
  opponentScale: [0, 0.6],
  windPassCut: [0, 0.15],
  qDnpSnap: [0.35, 0.75],
  efficiencyRegress: [0.3, 0.7],
} as const;

export const DEFAULT_WEIGHTS: BrainWeights = {
  version: "2026.10.0",
  usageLast3: 0.6,
  usageSeason: 0.4,
  scriptPassBump: 0.08,
  opponentScale: 0.35,
  windPassCut: 0.08,
  qDnpSnap: 0.55,
  efficiencyRegress: 0.5,
  floorRatio: 0.72,
  ceilRatio: 1.42,
  frozen: {},
};

export function clampWeight(key: keyof typeof WEIGHT_BOUNDS, value: number) {
  const [lo, hi] = WEIGHT_BOUNDS[key];
  return Math.min(hi, Math.max(lo, value));
}

export function withUsage(last3: number): BrainWeights {
  const usageLast3 = clampWeight("usageLast3", last3);
  return { ...DEFAULT_WEIGHTS, usageLast3, usageSeason: roundSeason(usageLast3), version: `u${usageLast3.toFixed(2)}` };
}

function roundSeason(last3: number) {
  const season = 1 - last3;
  return Math.min(0.6, Math.max(0.2, season));
}

import type { CountStats, DstStats, Pos } from "../types";

export type FreezeSlot = "thu" | "sun" | "inactives";
export type MissTag = "usage" | "script" | "injury" | "weather" | "touchdown variance" | "unknown";
export type DecisionKind = "start" | "sit" | "add" | "drop" | "trade-give" | "trade-get";

export interface UsageShares {
  games: number;
  snap: number;
  targetShare: number;
  carryShare: number;
  routeShare: number;
  rzShare: number;
  last3TargetShare: number | null;
  seasonTargetShare: number;
  last3CarryShare: number | null;
  seasonCarryShare: number;
}

export interface EnvironmentView {
  spread: number | null;
  total: number | null;
  implied: number | null;
  pace: number;
  passRate: number;
  rushRate: number;
  wind: number | null;
  rain: boolean;
  dome: boolean;
  stale: boolean;
}

export interface AvailabilityView {
  snapMult: number;
  practice: "DNP" | "LIMITED" | "FULL" | null;
  out: boolean;
  teammateOut: boolean;
  backupQb: boolean;
  fact: string;
}

export interface ShadowFeatures {
  corner: number;
  stack: number;
  home: number;
  shortWeek: number;
  ageFlag: number;
  rookie: number;
  rzExtra: number;
  oppPace: number;
  narrative: number;
  ecr: number;
  owned: number;
  fpoe: number;
}

export interface FeatureSnapshot {
  usage: UsageShares;
  env: EnvironmentView;
  availability: AvailabilityView;
  shadow: ShadowFeatures;
  stale: boolean;
}

export interface FreezeMeta {
  id: string;
  leagueId: string;
  week: number;
  slot: FreezeSlot;
  at: string;
  weightVersion: string;
}

export interface GradeRow {
  leagueId: string;
  leagueIds: string[];
  week: number;
  slot: FreezeSlot;
  playerId: string;
  pos: Pos;
  projected: CountStats | DstStats;
  actualPoints: number;
  ePts: number | null;
  p20: number;
  p80: number;
  projectedTargets: number;
  actualTargets: number;
  projectedCarries: number;
  actualCarries: number;
  teamPlaysError: number;
  questionable: boolean;
  playedSnapRatio: number | null;
  windProjectedCalm: boolean | null;
  last3Closer?: boolean;
  scriptHigh?: boolean;
  tag: MissTag;
  baseline: number;
}

export interface CorrectionRow {
  week: number;
  weight: string;
  old: number;
  new: number;
  reason: string;
  rows: number;
}

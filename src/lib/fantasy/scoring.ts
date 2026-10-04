import { PPR_FALLBACK_MULT } from "./config";
import type { CountStats, DstStats, Pos, Range, RawPlayer } from "./types";
import { clamp, round1 } from "@/lib/utils";

const EMPTY_OFF: CountStats = {
  py: 0, pc: 0, inc: 0, ptd: 0, ptd50: 0, pfd: 0, int: 0, p2: 0, p300: 0, p400: 0, sk: 0,
  ry: 0, ra: 0, rtd: 0, rtd50: 0, rfd: 0, r2: 0, ry100: 0, ry200: 0,
  rey: 0, rec: 0, retd: 0, retd50: 0, refd: 0, rec2: 0, rey100: 0, rey200: 0, ret: 0,
  fuml: 0,
};

export function scoreOffense(s: CountStats): number {
  return (
    s.py * 0.05 +
    s.pc * 0.1 +
    s.inc * -0.1 +
    s.ptd * 4 +
    s.ptd50 * 3 +
    s.pfd * 0.5 +
    s.int * -2 +
    s.p2 * 2 +
    s.p300 * 2 +
    s.p400 * 4 +
    s.sk * -1 +
    s.ry * 0.1 +
    s.ra * 0.1 +
    s.rtd * 6 +
    s.rtd50 * 3 +
    s.rfd * 1 +
    s.r2 * 2 +
    s.ry100 * 2 +
    s.ry200 * 4 +
    s.rey * 0.1 +
    s.rec * 1 +
    s.retd * 6 +
    s.retd50 * 3 +
    s.refd * 1 +
    s.rec2 * 2 +
    s.rey100 * 2 +
    s.rey200 * 4 +
    s.ret * 0.2 +
    s.fuml * -2
  );
}

function paPts(pa: number) {
  if (pa <= 0) return 5;
  if (pa <= 6) return 4;
  if (pa <= 13) return 3;
  if (pa <= 17) return 1;
  if (pa <= 27) return 0;
  if (pa <= 34) return -1;
  if (pa <= 45) return -3;
  return -5;
}

function yaPts(ya: number) {
  if (ya <= 99) return 5;
  if (ya <= 199) return 3;
  if (ya <= 299) return 2;
  if (ya <= 349) return 0;
  if (ya <= 399) return -1;
  if (ya <= 449) return -3;
  if (ya <= 499) return -5;
  if (ya <= 549) return -6;
  return -7;
}

export function scoreDst(s: DstStats): number {
  const win = s.tw;
  const loss = 1 - s.tw;
  return (
    s.sack * 2 +
    s.int * 2 +
    s.fr * 2 +
    s.ff * 1 +
    s.safety * 2 +
    s.td * 6 +
    s.block * 3 +
    win * 1 +
    loss * -1 +
    paPts(s.pa) +
    yaPts(s.ya)
  );
}

export function bonusProb(mean: number, threshold: number, spread: number) {
  if (mean <= 0) return 0;
  const z = (threshold - mean) / Math.max(12, spread);
  const p = 1 / (1 + Math.exp(z * 1.7));
  return clamp(p, 0, 0.85);
}

export function estimateOffense(p: RawPlayer): CountStats {
  const s: CountStats = { ...EMPTY_OFF };
  const u = p.usage / 100;
  if (p.pos === "QB") {
    const att = 28 + u * 10;
    const cmpPct = 0.62 + p.consistency / 800;
    s.pc = att * cmpPct;
    s.inc = att * (1 - cmpPct);
    s.py = 210 + u * 90 + p.upside * 0.4;
    s.ptd = 1.3 + u * 1.1;
    s.ptd50 = s.ptd * 0.08;
    s.pfd = s.pc * 0.38;
    s.int = 0.75 - p.consistency / 400;
    s.sk = 2.4 - u * 0.6;
    s.ry = 8 + u * 28 + (p.upside > 80 ? 12 : 0);
    s.ra = 2 + s.ry / 7;
    s.rtd = s.ry > 30 ? 0.35 : 0.12;
    s.rtd50 = s.rtd * 0.08;
    s.rfd = s.ra * 0.22;
    s.p300 = bonusProb(s.py, 300, 55);
    s.p400 = bonusProb(s.py, 400, 55);
    s.fuml = 0.12;
  } else if (p.pos === "RB") {
    s.ra = 8 + u * 14;
    s.ry = s.ra * (3.8 + p.upside / 80);
    s.rtd = 0.2 + u * 0.7;
    s.rtd50 = s.rtd * 0.07;
    s.rfd = s.ra * 0.23 + s.ry / 50;
    s.rec = (p.rec || 20) / 17;
    s.ret = s.rec / 0.78;
    s.rey = s.rec * 7.6;
    s.retd = s.rec * 0.04;
    s.refd = s.rec * 0.55;
    s.ry100 = bonusProb(s.ry, 100, 38);
    s.ry200 = bonusProb(s.ry, 200, 38);
    s.rey100 = bonusProb(s.rey, 100, 30);
    s.fuml = 0.14;
  } else {
    s.rec = (p.rec || 50) / 17;
    const catchRate = p.pos === "TE" ? 0.7 : 0.63;
    s.ret = s.rec / catchRate;
    const ypr = p.pos === "TE" ? 10.4 : 12.4 + p.upside / 60;
    s.rey = s.rec * ypr;
    s.retd = s.rec * (p.pos === "TE" ? 0.07 : 0.065);
    s.retd50 = s.retd * (p.upside > 80 ? 0.18 : 0.1);
    s.refd = s.rec * (p.pos === "TE" ? 0.58 : 0.62);
    s.rey100 = bonusProb(s.rey, 100, 32);
    s.rey200 = bonusProb(s.rey, 200, 32);
    if (p.pos === "WR" && p.usage > 70) {
      s.ry = 2;
      s.ra = 0.3;
    }
    s.fuml = 0.06;
  }
  return s;
}

export interface OffenseSketch {
  pos: "QB" | "RB" | "WR" | "TE";
  plays: number;
  passRate: number;
  rushRate: number;
  qbShare: number;
  carryShare: number;
  targetShare: number;
  snap: number;
  ypc: number;
  ypt: number;
  tdPerRush: number;
  tdPerTarget: number;
  cmp: number;
  sackRate: number;
  explosive: number;
  airYpt?: number | null;
  attempts?: number | null;
  wind: number | null;
  rain: boolean;
  windPassCut: number;
  efficiencyRegress: number;
}

export interface DstSketch {
  impliedOpp: number;
  oppPace: number;
  oppTurnoverRate: number;
  spread: number;
}

const POS_MEAN = { ypc: 4.2, yptWr: 8.1, yptTe: 7.2, yptRb: 6.4, tdRush: 0.04, tdRec: 0.055, cmp: 0.645, sack: 0.065, fdRush: 0.22, fdRec: 0.6 };

function regress(value: number, mean: number, toward: number) {
  return (1 - toward) * value + toward * mean;
}

export function projectOffense(input: OffenseSketch): CountStats {
  const s: CountStats = { ...EMPTY_OFF };
  const snap = clamp(input.snap, 0, 1.2);
  if (snap <= 0) return s;
  const toward = input.efficiencyRegress;
  let passAttempts = input.attempts ?? input.plays * input.passRate * input.qbShare;
  let cmp = input.cmp;
  if (input.wind != null && input.wind >= 20) {
    passAttempts *= 1 - input.windPassCut;
    cmp -= 0.02;
  }
  if (input.rain) cmp -= 0.01;
  cmp = clamp(cmp, 0.45, 0.78);
  const carries = input.plays * input.rushRate * input.carryShare * (input.pos === "QB" ? 1 : snap);
  const targets = passAttempts * input.targetShare * (input.pos === "QB" ? 0 : snap);

  if (input.pos === "QB") {
    const att = passAttempts * snap;
    const cmpRate = regress(cmp, POS_MEAN.cmp, toward);
    const sackRate = regress(input.sackRate, POS_MEAN.sack, toward);
    s.pc = att * cmpRate;
    s.inc = att * (1 - cmpRate);
    s.py = s.pc * regress(input.ypt, 7.4, toward);
    s.ptd = att * regress(input.tdPerTarget, 0.048, toward);
    const air = input.airYpt == null ? 1 : clamp(input.airYpt / 7.5, 0.5, 1.8);
    s.ptd50 = s.ptd * (0.08 * air * (input.wind != null && input.wind >= 20 ? 0.7 : 1));
    s.pfd = s.pc * 0.38;
    s.int = att * 0.022;
    s.sk = att * sackRate;
    s.ry = carries * regress(input.ypc, POS_MEAN.ypc, toward);
    s.ra = carries;
    s.rtd = carries * regress(input.tdPerRush, POS_MEAN.tdRush, toward);
    s.rtd50 = s.rtd * 0.08;
    s.rfd = s.ra * POS_MEAN.fdRush;
    s.p300 = bonusProb(s.py, 300, 55);
    s.p400 = bonusProb(s.py, 400, 55);
    s.fuml = 0.12 * (input.rain ? 1.25 : 1);
  } else if (input.pos === "RB") {
    const ypc = regress(input.ypc, POS_MEAN.ypc, toward);
    s.ra = carries;
    s.ry = carries * ypc;
    s.rtd = carries * regress(input.tdPerRush, POS_MEAN.tdRush, toward);
    s.rtd50 = s.rtd * 0.07;
    s.rfd = s.ra * regress(POS_MEAN.fdRush, POS_MEAN.fdRush, toward);
    const catchRate = 0.74;
    s.ret = targets;
    s.rec = targets * catchRate;
    s.rey = s.rec * regress(input.ypt, POS_MEAN.yptRb, toward);
    s.retd = targets * regress(input.tdPerTarget, 0.03, toward);
    s.refd = targets * regress(0.48, POS_MEAN.fdRec, toward);
    s.ry100 = bonusProb(s.ry, 100, 38);
    s.ry200 = bonusProb(s.ry, 200, 38);
    s.rey100 = bonusProb(s.rey, 100, 30);
    s.fuml = 0.14 * (input.rain ? 1.25 : 1);
  } else {
    const meanYpt = input.pos === "TE" ? POS_MEAN.yptTe : POS_MEAN.yptWr;
    const catchRate = input.pos === "TE" ? 0.7 : 0.64;
    s.ret = targets;
    s.rec = targets * catchRate;
    s.rey = s.rec * regress(input.ypt, meanYpt, toward);
    s.retd = targets * regress(input.tdPerTarget, input.pos === "TE" ? 0.05 : 0.045, toward);
    const air = input.airYpt == null ? 1 : clamp(input.airYpt / (input.pos === "TE" ? 7 : 11), 0.5, 1.8);
    s.retd50 = s.retd * (0.1 + input.explosive * 0.08) * air * (input.wind != null && input.wind >= 20 ? 0.7 : 1);
    s.refd = targets * regress(input.pos === "TE" ? 0.58 : 0.62, POS_MEAN.fdRec, toward);
    s.rey100 = bonusProb(s.rey, 100, 32);
    s.rey200 = bonusProb(s.rey, 200, 32);
    s.fuml = 0.06 * (input.rain ? 1.25 : 1);
  }
  return s;
}

export function projectDst(input: DstSketch): DstStats {
  const pressure = clamp((24 - input.impliedOpp) / 16, 0, 1);
  const pace = input.oppPace / 64;
  return {
    sack: (1.6 + pressure * 1.6) * pace,
    int: (0.45 + input.oppTurnoverRate) * pace,
    fr: 0.35 + pressure * 0.25,
    ff: 0.5 + pressure * 0.35,
    safety: 0.03 + pressure * 0.03,
    td: 0.06 + pressure * 0.08,
    block: 0.04,
    tw: clamp(0.5 - input.spread / 14, 0.18, 0.82),
    pa: input.impliedOpp,
    ya: 280 + input.impliedOpp * 4.2,
  };
}

export function estimateDst(p: RawPlayer): DstStats {
  const q = (p.usage + p.matchup + p.sos) / 300;
  return {
    sack: 1.9 + q * 1.8,
    int: 0.55 + q * 0.5,
    fr: 0.4 + q * 0.3,
    ff: 0.6 + q * 0.4,
    safety: 0.03 + q * 0.04,
    td: 0.08 + q * 0.12,
    block: 0.05 + q * 0.05,
    tw: clamp(0.38 + q * 0.35, 0.2, 0.78),
    pa: 26 - q * 10,
    ya: 355 - q * 70,
  };
}

export function expectedPoints(p20: number, p50: number, p80: number) {
  return 0.25 * p20 + 0.5 * p50 + 0.25 * p80;
}

export function rangeFromP50(p50: number, consistency: number, upside: number): Range {
  const floorRatio = 0.46 + consistency / 250;
  const ceilRatio = 1.18 + upside / 280;
  const p20 = Math.max(0, p50 * floorRatio);
  const p80 = p50 * ceilRatio;
  return { p20: round1(p20), p50: round1(p50), p80: round1(p80), ePts: round1(expectedPoints(p20, p50, p80)) };
}

export function weeklyBushPoints(p: RawPlayer): { pts: number; stats: CountStats | DstStats; source: "counting" | "converted" } {
  if (p.pos === "DST") {
    const stats = estimateDst(p);
    return { pts: scoreDst(stats), stats, source: "counting" };
  }
  const stats = estimateOffense(p);
  const counted = scoreOffense(stats);
  if (counted > 1) return { pts: counted, stats, source: "counting" };
  const fallback = p.weekPpr * (PPR_FALLBACK_MULT[p.pos as Pos] ?? 1);
  return { pts: fallback, stats, source: "converted" };
}

export function adp10From12(adp12: number) {
  return 1 + (adp12 - 1) * (10 / 12);
}

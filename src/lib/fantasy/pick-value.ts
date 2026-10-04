import { PICK_VALUE_BY_ROUND, TEAMS } from "./config";
import { round1 } from "@/lib/utils";

export function pickValueRound(round: number) {
  const r = Math.max(1, Math.min(18, Math.round(round)));
  return PICK_VALUE_BY_ROUND[r] ?? 1;
}

export function pickValueExact(round: number, pickInRound: number) {
  const start = pickValueRound(round);
  const next = pickValueRound(round + 1);
  const t = Math.max(0, Math.min(0.9, (pickInRound - 1) / TEAMS));
  return round1(start + t * (next - start));
}

export function pickValueFromAdp10(adp10: number) {
  const pick = Math.max(1, adp10);
  const round = Math.floor((pick - 1) / TEAMS) + 1;
  const pickInRound = ((pick - 1) % TEAMS) + 1;
  return pickValueExact(round, pickInRound);
}

export function overallPick(slot: number, round: number, teams = TEAMS) {
  if (round % 2 === 1) return (round - 1) * teams + slot;
  return round * teams - slot + 1;
}

export function pickInRound(slot: number, round: number, teams = TEAMS) {
  return round % 2 === 1 ? slot : teams - slot + 1;
}

export function costLabel(slot: number, round: number, teams = TEAMS) {
  return `Rd ${round}, Pick ${pickInRound(slot, round, teams)}`;
}

export function pickLabel(slot: number, round: number, teams = TEAMS) {
  return `${round}.${String(pickInRound(slot, round, teams)).padStart(2, "0")}`;
}

export function slotPicks(slot: number, burnedRounds: number[], teams = TEAMS, rounds = 18) {
  const burned = new Set(burnedRounds);
  const out: { round: number; overall: number; label: string; espnLabel: string }[] = [];
  for (let r = 1; r <= rounds; r++) {
    if (burned.has(r)) continue;
    const overall = overallPick(slot, r, teams);
    out.push({
      round: r,
      overall,
      label: pickLabel(slot, r, teams),
      espnLabel: costLabel(slot, r, teams),
    });
  }
  return out;
}

export function roundOfOverall(overall: number, teams = TEAMS) {
  return Math.floor((overall - 1) / teams) + 1;
}

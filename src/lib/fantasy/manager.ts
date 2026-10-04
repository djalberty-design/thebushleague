import { optimalLineup, winProb, type StartSitResult } from "./lineup";
import type { PlayerState, Team } from "./types";
import { round1 } from "@/lib/utils";

export interface LineupMove {
  slot: string;
  start: PlayerState;
  sit: PlayerState | null;
  delta: number;
}

const FITS: Record<string, (p: PlayerState) => boolean> = {
  QB: (p) => p.pos === "QB",
  RB: (p) => p.pos === "RB",
  WR: (p) => p.pos === "WR",
  TE: (p) => p.pos === "TE",
  FLEX: (p) => p.pos === "RB" || p.pos === "WR" || p.pos === "TE",
  OP: (p) => p.pos !== "DST",
  DST: (p) => p.pos === "DST",
};

export function lineupMoves(me: Team, lineup: StartSitResult, map: Map<string, PlayerState>): LineupMove[] {
  const espn = (me.slots ?? []).filter((s) => s.slot !== "BE" && s.slot !== "IR");
  if (!espn.length) {
    return lineup.debates.slice(0, 3).map((d) => ({
      slot: d.starter.pos,
      start: d.starter,
      sit: d.bench,
      delta: d.delta,
    }));
  }
  const modelIds = new Set(lineup.starters.map((s) => s.player?.id).filter((id): id is string => Boolean(id)));
  const espnIds = new Set(espn.map((s) => s.id));
  const used = new Set<string>();
  const moves: LineupMove[] = [];
  for (const seat of lineup.starters) {
    const start = seat.player;
    if (!start || espnIds.has(start.id)) continue;
    const sitSlot = espn.find((s) => !modelIds.has(s.id) && !used.has(s.id) && (FITS[s.slot]?.(start) ?? FITS[seat.slot]?.(map.get(s.id) ?? start)));
    const sit = sitSlot ? (map.get(sitSlot.id) ?? null) : null;
    if (sitSlot) used.add(sitSlot.id);
    const delta = round1(start.weekly.ePts - (sit?.weekly.ePts ?? 0));
    if (sit && delta < 1.5) continue;
    moves.push({ slot: seat.slot, start, sit, delta });
  }
  return moves.sort((a, b) => b.delta - a.delta).slice(0, 4);
}

export function espnPoints(me: Team, map: Map<string, PlayerState>) {
  const starters = (me.slots ?? []).filter((s) => s.slot !== "BE" && s.slot !== "IR");
  if (!starters.length) return null;
  return round1(starters.reduce((sum, slot) => sum + (map.get(slot.id)?.weekly.ePts ?? 0), 0));
}

export function matchupWin(my: number, opp: number, myRange: number, oppRange: number) {
  return winProb(my, opp, Math.max(6, myRange), Math.max(6, oppRange));
}

export function rangeOf(lineup: StartSitResult) {
  return Math.max(6, (lineup.p80 - lineup.p20) / 2);
}

export function rosterWeek(roster: PlayerState[], ir: string[], mode: StartSitResult["mode"]) {
  return optimalLineup(roster, ir, mode).projected;
}

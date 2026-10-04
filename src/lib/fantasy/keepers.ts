import {
  BALANCE_BONUS_MAX,
  CORRELATION_PENALTY_MAX,
  DEFAULT_KEEPER_IDS,
  INELIGIBLE_KEEP_IDS,
  KEEP_SURPLUS_WEIGHT,
  KEEP_VOR_WEIGHT,
  USER_ELIGIBLE,
  USER_INELIGIBLE_IDS,
} from "./config";
import { LOCKED_KEEPERS } from "./league";
import { costLabel, overallPick, pickInRound, pickLabel, pickValueFromAdp10, pickValueRound } from "./pick-value";
import type { KeepLabel, League, PlayerState, Pos, Team } from "./types";
import { round1 } from "@/lib/utils";

const INELIGIBLE = new Set<string>([...INELIGIBLE_KEEP_IDS, ...USER_INELIGIBLE_IDS]);

export interface KeeperEval {
  player: PlayerState;
  sticker: number;
  assigned: number;
  surplus: number;
  adjVor: number;
  keepScore: number;
  label: KeepLabel;
  eligible: boolean;
  reason: string;
}

export interface KeeperPair {
  a: KeeperEval;
  b: KeeperEval;
  pairScore: number;
  balance: number;
  correlation: number;
  assigned: [number, number];
  why: string;
}

export interface LeagueKeeperSeat {
  id: string;
  player: PlayerState | null;
  round: number;
  pickInRound: number;
  overall: number;
  label: string;
  espnLabel: string;
  surplus: number;
  keepScore: number;
  labelGrade: KeepLabel;
}

export interface LeagueKeeperTeam {
  team: Team;
  seats: LeagueKeeperSeat[];
  empty: number;
  totalSurplus: number;
}

export function keepLabel(score: number): KeepLabel {
  if (score >= 85) return "Lock";
  if (score >= 70) return "Strong";
  if (score >= 55) return "Situational";
  if (score >= 40) return "Fringe";
  return "Cut";
}

export function assignCosts(keepers: { id: string; sticker: number }[]) {
  const order = new Map(USER_ELIGIBLE.map((e, i) => [e.id, i]));
  const sorted = [...keepers].sort(
    (a, b) => a.sticker - b.sticker || (order.get(a.id) ?? 99) - (order.get(b.id) ?? 99) || a.id.localeCompare(b.id),
  );
  const used = new Set<number>();
  return sorted.map((k) => {
    let r = k.sticker;
    while (used.has(r) && r < 18) r += 1;
    used.add(r);
    return { id: k.id, sticker: k.sticker, assigned: r };
  });
}

function zScores(values: number[]) {
  if (!values.length) return values;
  const mean = values.reduce((s, n) => s + n, 0) / values.length;
  const variance = values.reduce((s, n) => s + (n - mean) ** 2, 0) / values.length;
  const sd = Math.sqrt(variance);
  if (sd === 0) return values.map(() => 0);
  return values.map((n) => (n - mean) / sd);
}

export function surplusFor(player: PlayerState, assignedRound: number) {
  return round1(pickValueFromAdp10(player.adp10) - pickValueRound(assignedRound));
}

function surplusOf(player: PlayerState, assignedRound: number) {
  return surplusFor(player, assignedRound);
}

function scoreKeepers(rows: { player: PlayerState; surplus: number }[]) {
  if (!rows.length) return [];
  const zVor = zScores(rows.map((r) => r.player.adjVor));
  const zSur = zScores(rows.map((r) => r.surplus));
  const raw = rows.map((_, i) => 100 * (KEEP_VOR_WEIGHT * zVor[i] + KEEP_SURPLUS_WEIGHT * zSur[i]));
  const max = Math.max(...raw, 0.0001);
  return raw.map((n) => round1((n / max) * 100));
}

export function eligibleFor(team: Team, players: Map<string, PlayerState>): KeeperEval[] {
  const rows: { player: PlayerState; sticker: number; surplus: number; eligible: boolean; reason: string }[] = [];
  for (const spec of USER_ELIGIBLE) {
    if (!team.roster.includes(spec.id) && !team.ir.includes(spec.id)) continue;
    const player = players.get(spec.id);
    if (!player) continue;
    const locked = team.keeperCost[spec.id];
    const sticker = locked ?? spec.sticker;
    const eligible = !INELIGIBLE.has(player.id);
    rows.push({
      player,
      sticker,
      surplus: surplusOf(player, sticker),
      eligible,
      reason: eligible ? "On the 2025 roster and not on the K list or R1–4 ban." : ineligibleWhy(player.id),
    });
  }
  for (const id of USER_INELIGIBLE_IDS) {
    if (rows.some((r) => r.player.id === id)) continue;
    if (!team.roster.includes(id) && !team.ir.includes(id)) continue;
    const player = players.get(id);
    if (!player) continue;
    rows.push({
      player,
      sticker: 0,
      surplus: 0,
      eligible: false,
      reason: ineligibleWhy(id),
    });
  }
  const eligibleRows = rows.filter((r) => r.eligible);
  const scores = scoreKeepers(eligibleRows.map((r) => ({ player: r.player, surplus: r.surplus })));
  const scoreMap = new Map(eligibleRows.map((r, i) => [r.player.id, scores[i]]));
  return rows
    .map((r) => {
      const keepScore = r.eligible ? (scoreMap.get(r.player.id) ?? 0) : 0;
      return {
        player: r.player,
        sticker: r.sticker,
        assigned: r.sticker,
        surplus: r.surplus,
        adjVor: r.player.adjVor,
        keepScore,
        label: r.eligible ? keepLabel(keepScore) : ("Cut" as KeepLabel),
        eligible: r.eligible,
        reason: r.reason,
      };
    })
    .sort((a, b) => b.keepScore - a.keepScore || b.surplus - a.surplus);
}

function ineligibleWhy(id: string) {
  if (USER_INELIGIBLE_IDS.includes(id as (typeof USER_INELIGIBLE_IDS)[number])) {
    if (id === "drake-maye" || id === "jaxon-smith-njigba") return "Previously kept (K list). Cannot keep again.";
    return "Drafted in rounds 1–4. Cannot keep.";
  }
  return "League-wide ineligible (previously kept).";
}

export function applySelection(evals: KeeperEval[], selectedIds: string[]): KeeperEval[] {
  const selected = evals.filter((e) => selectedIds.includes(e.player.id));
  const assigned = assignCosts(selected.map((e) => ({ id: e.player.id, sticker: e.sticker })));
  const map = new Map(assigned.map((a) => [a.id, a.assigned]));
  return evals.map((e) => {
    if (!e.eligible) return e;
    const next = map.get(e.player.id);
    if (next == null) return { ...e, assigned: e.sticker, surplus: surplusOf(e.player, e.sticker) };
    return { ...e, assigned: next, surplus: surplusOf(e.player, next) };
  });
}

function balanceBonus(a: PlayerState, b: PlayerState, assigned: number[]) {
  let n = 0;
  const pos = new Set([a.pos, b.pos]);
  const scarce = pos.has("TE") || pos.has("QB");
  const volume = a.pos === "WR" || a.pos === "RB" || b.pos === "WR" || b.pos === "RB";
  if (scarce && volume) n += 4;
  if (assigned.every((r) => r >= 4)) n += 2;
  if (!assigned.includes(4) || !assigned.includes(5)) n += 2;
  return Math.min(BALANCE_BONUS_MAX, n);
}

function correlationPenalty(a: PlayerState, b: PlayerState) {
  let n = 0;
  if (a.nflTeam === b.nflTeam) n += 3;
  const volatile = (p: PlayerState) => p.confidence < 0.75 || p.status === "Q" || p.status === "IR";
  if (volatile(a) && volatile(b)) n += 3;
  return Math.min(CORRELATION_PENALTY_MAX, n);
}

export function legalPair(a: KeeperEval, b: KeeperEval) {
  if (a.player.id === b.player.id) return { ok: false, why: "Need two different players." };
  if (!a.eligible || !b.eligible) return { ok: false, why: "One of these names is ineligible." };
  if (a.player.pos === b.player.pos) return { ok: false, why: `Keepers cannot be the same position (${a.player.pos}).` };
  return { ok: true, why: "" };
}

export function rankPairs(evals: KeeperEval[]): KeeperPair[] {
  const eligible = evals.filter((e) => e.eligible);
  const pairs: KeeperPair[] = [];
  for (let i = 0; i < eligible.length; i++) {
    for (let j = i + 1; j < eligible.length; j++) {
      const a0 = eligible[i];
      const b0 = eligible[j];
      const gate = legalPair(a0, b0);
      if (!gate.ok) continue;
      const costs = assignCosts([
        { id: a0.player.id, sticker: a0.sticker },
        { id: b0.player.id, sticker: b0.sticker },
      ]);
      const assignedA = costs.find((c) => c.id === a0.player.id)!.assigned;
      const assignedB = costs.find((c) => c.id === b0.player.id)!.assigned;
      const a: KeeperEval = { ...a0, assigned: assignedA, surplus: surplusOf(a0.player, assignedA) };
      const b: KeeperEval = { ...b0, assigned: assignedB, surplus: surplusOf(b0.player, assignedB) };
      const pairPool = [
        { player: a.player, surplus: a.surplus },
        { player: b.player, surplus: b.surplus },
        ...eligible
          .filter((e) => e.player.id !== a.player.id && e.player.id !== b.player.id)
          .map((e) => ({ player: e.player, surplus: e.surplus })),
      ];
      const scores = scoreKeepers(pairPool);
      a.keepScore = scores[0];
      b.keepScore = scores[1];
      a.label = keepLabel(a.keepScore);
      b.label = keepLabel(b.keepScore);
      const assigned: [number, number] = [assignedA, assignedB];
      const balance = balanceBonus(a.player, b.player, assigned);
      const corr = correlationPenalty(a.player, b.player);
      const dstTax = a.player.pos === "DST" || b.player.pos === "DST" ? 18 : 0;
      const pairScore = round1(a.keepScore + b.keepScore + balance - corr - dstTax);
      const why = `${a.player.name} costs R${assignedA}${assignedA !== a.sticker ? ` (sticker R${a.sticker})` : ""}; ${b.player.name} costs R${assignedB}${assignedB !== b.sticker ? ` (sticker R${b.sticker})` : ""}.`;
      pairs.push({ a, b, pairScore, balance, correlation: corr, assigned, why });
    }
  }
  const ranked = pairs.sort((x, y) => y.pairScore - x.pairScore);
  const defSet = new Set<string>(DEFAULT_KEEPER_IDS);
  const def = ranked.find((p) => defSet.has(p.a.player.id) && defSet.has(p.b.player.id));
  const rest = ranked.filter((p) => p !== def);
  return (def ? [def, ...rest] : rest).slice(0, 5);
}

export function defaultPairIds() {
  return [...DEFAULT_KEEPER_IDS];
}

export function pairIllegalReason(ids: string[], evals: KeeperEval[]) {
  if (ids.length !== 2) return "Select two keepers.";
  const a = evals.find((e) => e.player.id === ids[0]);
  const b = evals.find((e) => e.player.id === ids[1]);
  if (!a || !b) return "One selected keeper is not on this roster.";
  return legalPair(a, b).ok ? null : legalPair(a, b).why;
}

export function samePosition(pos: Pos, other: Pos) {
  return pos === other;
}

export function copyToLm(teamName: string, pair: KeeperPair) {
  return `${teamName} keepers: ${pair.a.player.name} (${pair.a.player.pos}) Round ${pair.a.assigned}${pair.a.assigned !== pair.a.sticker ? ` — sticker R${pair.a.sticker}, collision` : ""}; ${pair.b.player.name} (${pair.b.player.pos}) Round ${pair.b.assigned}${pair.b.assigned !== pair.b.sticker ? ` — sticker R${pair.b.sticker}, collision` : ""}.`;
}

export function allKeptIds(league: League) {
  return league.teams.flatMap((t) => t.keepers);
}

export function buildLeagueKeepers(league: League, players: Map<string, PlayerState>): LeagueKeeperTeam[] {
  const scoredRows: { key: string; player: PlayerState; surplus: number }[] = [];
  for (const team of league.teams) {
    for (const id of team.keepers) {
      const round = team.keeperCost[id];
      const player = players.get(id);
      if (round == null || !player) continue;
      scoredRows.push({ key: `${team.id}:${id}`, player, surplus: surplusOf(player, round) });
    }
  }
  const scores = scoreKeepers(scoredRows.map((r) => ({ player: r.player, surplus: r.surplus })));
  const scoreById = new Map(scoredRows.map((r, i) => [r.key, scores[i]]));

  const byTeam = league.teams.map((team) => {
    const slot = team.draftSlot || team.id;
    const teamSeats: LeagueKeeperSeat[] = team.keepers
      .map((id) => {
        const round = team.keeperCost[id];
        if (round == null) return null;
        const player = players.get(id) ?? null;
        const keepScore = scoreById.get(`${team.id}:${id}`) ?? 0;
        return {
          id,
          player,
          round,
          pickInRound: pickInRound(slot, round),
          overall: overallPick(slot, round),
          label: pickLabel(slot, round),
          espnLabel: costLabel(slot, round),
          surplus: player ? surplusOf(player, round) : 0,
          keepScore,
          labelGrade: keepLabel(keepScore),
        } satisfies LeagueKeeperSeat;
      })
      .filter((s): s is LeagueKeeperSeat => Boolean(s));
    return {
      team,
      seats: teamSeats,
      empty: Math.max(0, 2 - teamSeats.length),
      totalSurplus: round1(teamSeats.reduce((s, seat) => s + seat.surplus, 0)),
    };
  });

  const you = byTeam.filter((t) => t.team.isYou);
  const rest = byTeam.filter((t) => !t.team.isYou).sort((a, b) => a.team.draftSlot - b.team.draftSlot);
  return [...you, ...rest];
}

export function thrownBack(team: Team, keptIds: string[], players: Map<string, PlayerState>) {
  return team.roster
    .filter((id) => !keptIds.includes(id))
    .map((id) => players.get(id))
    .filter((p): p is PlayerState => Boolean(p))
    .sort((a, b) => a.adp10 - b.adp10);
}

export function lockedCount() {
  return LOCKED_KEEPERS.reduce((n, t) => n + t.keepers.length, 0);
}

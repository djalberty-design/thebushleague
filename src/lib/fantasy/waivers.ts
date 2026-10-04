import { PRIORITY_COST, ROSTER_MAX } from "./config";
import { slateFor } from "./brain/slate-lookup";
import { optimalLineup, teamPlayers } from "./lineup";
import type { LineupMode, PlayerState, Pos, League, Team } from "./types";
import { normalizeName, round1 } from "@/lib/utils";

export interface WaiverClaim {
  player: PlayerState;
  drop: PlayerState | null;
  claimValue: number;
  weekPts: number;
  rosVor: number;
  priorityCost: number;
  advice: "Burn" | "Wait";
  reason: string;
  stream: boolean;
}

export function availablePlayers(league: League, players: Map<string, PlayerState>) {
  const rostered = new Set(league.teams.flatMap((t) => [...t.roster, ...t.ir]));
  return [...players.values()].filter((p) => !rostered.has(p.id));
}

function posCount(roster: PlayerState[], pos: Pos) {
  return roster.filter((p) => p.pos === pos).length;
}

function canAdd(roster: PlayerState[], add: PlayerState, drop: PlayerState | null) {
  const next = drop ? roster.filter((p) => p.id !== drop.id) : roster;
  const count = posCount(next, add.pos) + 1;
  const max = ROSTER_MAX[add.pos === "DST" ? "dst" : add.pos === "QB" ? "qb" : add.pos === "RB" ? "rb" : add.pos === "WR" ? "wr" : "te"];
  return count <= max;
}

function weekScore(player: PlayerState, week: number) {
  if (player.trail === "none") return 0;
  if (player.status === "O" || player.status === "IR" || player.status === "SSPD") return 0;
  const slate = slateFor(player.nflTeam, week);
  if (slate?.bye || player.bye === week) return 0;
  return player.weekly.ePts;
}

function rosterPoints(roster: PlayerState[], ir: string[], mode: LineupMode, week: number) {
  let unpriced = false;
  const adjusted = roster.map((player) => {
    const pts = weekScore(player, week);
    if (pts == null) unpriced = true;
    const n = pts ?? 0;
    const bye = slateFor(player.nflTeam, week)?.bye || player.bye === week;
    return {
      ...player,
      status: bye ? ("Bye" as const) : player.status,
      weekly: { ...player.weekly, ePts: n, p20: n * 0.72, p50: n, p80: n * 1.35 },
    };
  });
  if (unpriced) return null;
  return optimalLineup(adjusted, ir, mode).projected;
}

/** The claim sort does not read a rest-of-season number. The 1.6 scale is off. QB14 stays off this button. */
export const CLAIM_MULTIPLIER = 1;
export const CLAIM_SORT = {
  restOfSeason: 0,
  multiplier: CLAIM_MULTIPLIER,
  vor: "off the button",
  priority: "heuristic, tie under 1.5 only",
  price: "sum of the next three weeks of trailing average, bye at 0, a missing line stays the average",
} as const;

/** Priority may break a tie under 1.5. It does not reorder a larger gap. */
export function compareClaims(a: { points: number; priority: number }, b: { points: number; priority: number }) {
  const gap = Math.abs(a.points - b.points);
  if (gap >= 1.5) return b.points - a.points;
  if (a.priority !== b.priority) return a.priority - b.priority;
  return b.points - a.points;
}

export function rankClaimPoints<T extends { points: number; priority: number }>(rows: T[], multiplier = CLAIM_MULTIPLIER) {
  return rows
    .map((row) => ({ ...row, points: round1(row.points * multiplier) }))
    .sort((a, b) => compareClaims(a, b));
}

export function waiverTargets(team: Team, league: League, players: Map<string, PlayerState>, mode: LineupMode): WaiverClaim[] {
  const mine = teamPlayers(team, players).filter((p) => !team.ir.includes(p.id));
  const wireNames = new Set((league.freeAgents ?? []).map((p) => normalizeName(p.name)));
  const dropped = new Set(
    (league.activity ?? [])
      .filter((a) => a.status === "EXECUTED")
      .flatMap((a) => a.moves.filter((m) => m.action === "DROP").map((m) => normalizeName(m.name))),
  );
  let available = availablePlayers(league, players);
  if (wireNames.size) {
    const onWire = available.filter((p) => wireNames.has(normalizeName(p.name)) || p.pos === "DST");
    if (onWire.length) available = onWire;
  }
  const priorityCost = PRIORITY_COST[team.waivers] ?? 1;
  const claims: WaiverClaim[] = [];

  const dropCandidates = [...mine]
    .filter((p) => p.trail !== "none" && !p.undroppable && p.status !== "IR" && p.status !== "O")
    .sort((a, b) => a.weekly.ePts - b.weekly.ePts || a.id.localeCompare(b.id));

  for (const add of available.slice().sort((a, b) => b.weekly.ePts - a.weekly.ePts || a.id.localeCompare(b.id)).slice(0, 50)) {
    if (add.trail === "none") continue;
    if (add.source !== "counting" && add.pos !== "DST" && add.adp12 > 140) continue;
    const drop = mine.length >= 18 ? dropCandidates.find((d) => d.id !== add.id && canAdd(mine, add, d) && d.weekly.ePts <= add.weekly.ePts + 1) ?? null : null;
    if (mine.length >= 18 && !drop) continue;
    if (drop?.undroppable) continue;
    const nextRoster = drop ? [...mine.filter((p) => p.id !== drop.id), add] : [...mine, add];
    const legs = [0, 1, 2].map((i) => {
      const week = league.week + i;
      const withAdd = rosterPoints(nextRoster, team.ir, mode, week);
      const without = rosterPoints(mine, team.ir, mode, week);
      if (withAdd == null || without == null) return null;
      return withAdd - without;
    });
    const priced = legs.filter((n): n is number => n != null);
    const weekDelta = priced.reduce((s, n) => s + n, 0);
    const oneWeek = priced.length === 1 || (legs[0] != null && legs[0] > 1 && (legs[1] ?? 0) < 0.4 && (legs[2] ?? 0) < 0.4);
    const claimValue = round1(weekDelta * CLAIM_MULTIPLIER);
    const fresh = dropped.has(normalizeName(add.name));
    const stream = oneWeek || (add.pos === "DST" && priced.filter((d) => d > 0).length < 3);
    if (claimValue < 0) continue;
    if (claimValue < 0.4 && !stream && !fresh) continue;
    const advice: "Burn" | "Wait" = fresh && weekDelta >= 2 ? "Burn" : stream || (team.waivers <= 3 && weekDelta < 3) ? "Wait" : weekDelta >= 2 ? "Burn" : "Wait";
    const line = slateFor(add.nflTeam, league.week);
    const lineNote =
      !line || line.bye
        ? line?.bye
          ? `W${league.week} bye is 0.`
          : "Missing line stays the trailing average."
        : line.spread == null || line.total == null
          ? "Missing line stays the trailing average."
          : `Line stored, total ${line.total} spread ${line.spread}. It does not scale the price.`;
    claims.push({
      player: add,
      drop: drop && mine.length >= 18 ? drop : null,
      claimValue,
      weekPts: round1(add.weekly.ePts),
      rosVor: 0,
      priorityCost,
      advice,
      stream,
      reason: `${stream ? "Stream. " : ""}${fresh ? "Just dropped. " : ""}${lineNote} Next three weeks ${weekDelta >= 0 ? "+" : ""}${weekDelta.toFixed(1)}. Priority is a heuristic and only breaks a tie under 1.5.${drop ? ` After cutting ${drop.name}.` : ""}`,
    });
  }

  return rankClaimPoints(claims.map((claim) => ({ ...claim, points: claim.claimValue, priority: priorityCost })))
    .map(({ points: _points, priority: _priority, ...claim }) => claim)
    .slice(0, 8);
}

export function claimFactorSensitivity(_players: PlayerState[]) {
  return {
    moved: false,
    note: "QB14 is a heuristic value-over-replacement sort. It is off this button. The claim is the next three weeks of trailing average. Priority is a heuristic and only breaks a tie under 1.5. The 1.6 scale is off.",
  };
}

export function speculativeAdds(league: League, players: Map<string, PlayerState>) {
  return availablePlayers(league, players)
    .filter((player) => player.trail === "none" && player.pos !== "DST")
    .map((player) => ({
      player,
      points: null as null,
      rank: null as null,
      canStart: false as const,
      reason: "NO TRAIL. Projected 0. Cannot start. No rank above a priced player.",
    }));
}

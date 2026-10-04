import { BYE_STACK_PENALTY, NEED_BOOST, USER_DRAFT_SLOT } from "./config";
import { overallPick, slotPicks } from "./pick-value";
import type { PlayerState, Pos, Team } from "./types";
import { round1 } from "@/lib/utils";

export interface DraftRec {
  player: PlayerState;
  value: number;
  need: number;
  reach: boolean;
  why: string;
}

export function burnedRounds(team: Team, selectedKeepers: string[], assigned?: Record<string, number>) {
  const ids = selectedKeepers.length ? selectedKeepers : team.keepers;
  return ids.map((id) => assigned?.[id] ?? team.keeperCost[id]).filter((n): n is number => typeof n === "number");
}

export function remainingPicks(team: Team, selectedKeepers: string[], currentOverall = 1, assigned?: Record<string, number>) {
  const burned = burnedRounds(team, selectedKeepers, assigned);
  return slotPicks(team.draftSlot || USER_DRAFT_SLOT, burned).filter((p) => p.overall >= currentOverall);
}

function holes(roster: PlayerState[]) {
  const count = (pos: Pos) => roster.filter((p) => p.pos === pos).length;
  const qb = count("QB");
  const rb = count("RB");
  const wr = count("WR");
  const te = count("TE");
  const dst = count("DST");
  return {
    qb: Math.max(0, 1 - qb),
    rb: Math.max(0, 2 - rb),
    wr: Math.max(0, 3 - wr),
    te: Math.max(0, 1 - te),
    flex: Math.max(0, 1 - Math.max(0, rb - 2) - Math.max(0, wr - 3) - Math.max(0, te - 1)),
    op: Math.max(0, 1 - Math.max(0, qb - 1) - Math.max(0, rb + wr + te - 6)),
    dst: Math.max(0, 1 - dst),
    counts: { qb, rb, wr, te, dst },
  };
}

function needBoost(player: PlayerState, roster: PlayerState[]) {
  const h = holes(roster);
  const options: number[] = [0];
  if (player.pos === "QB" && h.qb) options.push(NEED_BOOST.emptyStarter);
  else if (player.pos === "RB" && h.rb) options.push(NEED_BOOST.emptyStarter);
  else if (player.pos === "WR" && h.wr) options.push(NEED_BOOST.emptyStarter);
  else if (player.pos === "TE" && h.te) options.push(NEED_BOOST.emptyStarter);
  else if (player.pos === "DST" && h.dst) options.push(NEED_BOOST.emptyStarter);
  else if ((player.pos === "RB" || player.pos === "WR" || player.pos === "TE") && h.flex) options.push(NEED_BOOST.emptyFlex);
  else if (player.pos !== "DST" && h.op) options.push(NEED_BOOST.emptyOp);
  else {
    const hasByeCover = roster.some((p) => p.pos === player.pos);
    const byeSoon = player.bye <= 4;
    if (!hasByeCover && byeSoon) options.push(NEED_BOOST.byeInsurance);
  }
  return Math.max(...options);
}

function byePenalty(player: PlayerState, roster: PlayerState[]) {
  const starters = roster.filter((p) => p.pos === player.pos || (player.pos !== "DST" && p.pos === player.pos));
  const shareBye = roster.filter((p) => p.bye === player.bye);
  const qbTe = player.pos === "QB" || player.pos === "TE";
  const bothRbs = player.pos === "RB" && roster.filter((p) => p.pos === "RB" && p.bye === player.bye).length >= 1;
  if ((qbTe || bothRbs) && shareBye.length && starters.length) return BYE_STACK_PENALTY;
  return 0;
}

function vorAtNextPick(available: PlayerState[], nextOverall: number) {
  const likely = available.filter((p) => p.adp10 >= nextOverall - 1).sort((a, b) => b.adjVor - a.adjVor);
  return likely[2]?.adjVor ?? likely[0]?.adjVor ?? 0;
}

export function draftBoard(
  available: PlayerState[],
  team: Team,
  roster: PlayerState[],
  selectedKeepers: string[],
  currentOverall = 1,
  assigned?: Record<string, number>,
): { recs: DraftRec[]; holes: ReturnType<typeof holes>; next: ReturnType<typeof remainingPicks>[number] | null; onClock: boolean; burned: number[] } {
  const picks = remainingPicks(team, selectedKeepers, currentOverall, assigned);
  const next = picks[0] ?? null;
  const following = picks[1]?.overall ?? (next ? next.overall + 12 : 20);
  const expectedWait = vorAtNextPick(available, following);
  const round = next ? next.round : 1;
  const pool = available.filter((p) => p.pos !== "DST" || round >= 14);
  const recs: DraftRec[] = pool
    .filter((p) => p.pos !== ("K" as string))
    .map((player) => {
      const need = needBoost(player, roster);
      const bye = byePenalty(player, roster);
      const p80Weight = round >= 8 ? 0.25 : 0;
      const vor = player.adjVor * (1 - p80Weight) + (player.ros.p80 / 16 - (player.ros.ePts / 16 - player.adjVor / 16)) * p80Weight * 16;
      const value = round1(vor - expectedWait + need * Math.max(0, player.adjVor) - bye * Math.max(0, player.adjVor));
      const reach = player.adp10 - (next?.overall ?? 1) > 8;
      const why =
        player.pos === "DST"
          ? "DST only late unless an elite unit is falling. Stream by default."
          : need >= NEED_BOOST.emptyStarter
            ? `Fills a starting ${player.pos} hole. AdjVOR ${player.adjVor.toFixed(0)} vs wait ${expectedWait.toFixed(0)}.`
            : `Best remaining AdjVOR (${player.adjVor.toFixed(0)}). ${reach ? "Reach vs ADP." : "On-market or value."}`;
      return { player, value, need, reach, why };
    })
    .sort((a, b) => b.value - a.value)
    .slice(0, 30);

  return {
    recs,
    holes: holes(roster),
    next,
    onClock: Boolean(next && next.overall === currentOverall),
    burned: burnedRounds(team, selectedKeepers, assigned),
  };
}

export function currentOverallFromTaken(takenCount: number, leagueKeepers: number) {
  return Math.max(1, takenCount - leagueKeepers + 1);
}

export function firstPickAfterKeepers(selectedKeepers: string[], team: Team) {
  const picks = remainingPicks(team, selectedKeepers, 1);
  return picks[0];
}

export { holes, overallPick };

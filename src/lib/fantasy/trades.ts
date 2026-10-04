import { CURRENT_WEEK, TRADE_FAIR_BAND } from "./config";
import { optimalLineup, teamPlayers } from "./lineup";
import { trailOf } from "./brain/trail";
import type { LineupMode, PlayerState, Team } from "./types";
import { round1 } from "@/lib/utils";

export interface TradeSide {
  give: PlayerState[];
  get: PlayerState[];
}

export interface TradeEval {
  you: number;
  them: number;
  weekYou: number;
  nra: number;
  fair: boolean;
  cut: PlayerState | null;
  consolidation: number;
  letter: "A" | "B" | "C" | "D" | "F";
  verdict: "Accept" | "Decline" | "Coin-flip" | "Ineligible";
  thinSample: boolean;
  byeConflict: boolean;
  weeksNotOnBye: number;
  why: string;
}

export interface TradeIdea {
  partner: Team;
  give: PlayerState[];
  get: PlayerState[];
  eval: TradeEval;
}

function assetOnBye(player: PlayerState, week = CURRENT_WEEK) {
  return player.status === "Bye" || player.bye === week;
}

function scoredWeeks(player: PlayerState) {
  return typeof player.scoredWeeks === "number" ? player.scoredWeeks : trailOf(player.id).points.length;
}

/** The letter is the weekly starter change. A season total cannot move it. */
function gradeWeek(weekYou: number): Pick<TradeEval, "letter" | "verdict"> {
  if (weekYou > 1.5) return { letter: "A", verdict: "Accept" };
  if (weekYou < -1.5) return { letter: "F", verdict: "Decline" };
  return { letter: "C", verdict: "Coin-flip" };
}

export function evaluateTrade(
  me: Team,
  partner: Team,
  players: Map<string, PlayerState>,
  giveIds: string[],
  getIds: string[],
  mode: LineupMode,
  ctx?: { partnerTop3?: boolean },
): TradeEval {
  const mine = teamPlayers(me, players).filter((p) => !me.ir.includes(p.id));
  const theirs = teamPlayers(partner, players).filter((p) => !partner.ir.includes(p.id));
  const give = giveIds.map((id) => players.get(id)).filter((p): p is PlayerState => Boolean(p));
  const get = getIds.map((id) => players.get(id)).filter((p): p is PlayerState => Boolean(p));
  const blank = (why: string, verdict: TradeEval["verdict"]): TradeEval => ({
    you: 0,
    them: 0,
    weekYou: 0,
    nra: 0,
    fair: false,
    cut: null,
    consolidation: 0,
    letter: "F",
    verdict,
    thinSample: false,
    byeConflict: false,
    weeksNotOnBye: 0,
    why,
  });
  if ([...give, ...get].some((player) => player.trail === "none" || scoredWeeks(player) === 0)) {
    return blank("NO TRAIL. No trade value.", "Ineligible");
  }

  const weekBefore = optimalLineup(mine, me.ir, mode).projected;
  const theirWeekBefore = optimalLineup(theirs, partner.ir, mode).projected;
  let myAfterRoster = [...mine.filter((p) => !giveIds.includes(p.id)), ...get];
  let theirAfterRoster = [...theirs.filter((p) => !getIds.includes(p.id)), ...give];
  let cut: PlayerState | null = null;
  if (myAfterRoster.length > 18) {
    cut = [...myAfterRoster].sort((a, b) => a.weekly.ePts - b.weekly.ePts)[0] ?? null;
    if (cut) myAfterRoster = myAfterRoster.filter((p) => p.id !== cut!.id);
  }
  if (theirAfterRoster.length > 18) {
    const theirCut = [...theirAfterRoster].sort((a, b) => a.weekly.ePts - b.weekly.ePts)[0];
    if (theirCut) theirAfterRoster = theirAfterRoster.filter((p) => p.id !== theirCut.id);
  }
  const weekYou = round1(optimalLineup(myAfterRoster, me.ir, mode).projected - weekBefore);
  const them = round1(optimalLineup(theirAfterRoster, partner.ir, mode).projected - theirWeekBefore);
  const weeksNotOnBye = Math.min(...[...give, ...get].map((player) => player.ros?.weeksLeft ?? 0));
  const byeConflict = [...give, ...get].some((player) => assetOnBye(player));
  const thinSample = [...give, ...get].some((player) => scoredWeeks(player) <= 3);
  const combined = Math.abs(weekYou) + Math.abs(them) + 1;
  const fair = Math.abs(weekYou - them) <= TRADE_FAIR_BAND * combined;
  const graded = gradeWeek(weekYou);
  const beforePos = new Map<string, number>();
  const afterPos = new Map<string, number>();
  for (const seat of optimalLineup(mine, me.ir, mode).starters) if (seat.player) beforePos.set(seat.player.pos, (beforePos.get(seat.player.pos) ?? 0) + 1);
  for (const seat of optimalLineup(myAfterRoster, me.ir, mode).starters) if (seat.player) afterPos.set(seat.player.pos, (afterPos.get(seat.player.pos) ?? 0) + 1);
  const thinner = ["QB", "RB", "WR", "TE"].some((pos) => (afterPos.get(pos) ?? 0) < (beforePos.get(pos) ?? 0));
  let letter = graded.letter;
  let verdict = graded.verdict;
  const top3 = Boolean(ctx?.partnerTop3 && thinner && !thinSample && !byeConflict);
  if (top3 && verdict === "Accept") {
    verdict = "Decline";
    letter = "D";
  }
  if (thinSample || byeConflict) {
    letter = "C";
    verdict = "Coin-flip";
  }
  const weekLine = byeConflict
    ? "This week's starter delta is suppressed."
    : `This week ${weekYou >= 0 ? "+" : ""}${weekYou.toFixed(1)}.`;
  const why = [
    byeConflict ? "CURRENT WEEK BYE CONFLICT — GRADE ON ACTIVE WEEKS ONLY." : "",
    thinSample ? "THIN SAMPLE. No Accept or Reject. Coin-flip advisory. The thin-sample rule ends at four scored weeks." : byeConflict ? "Coin-flip advisory. A bye is not a gain." : `${letter} · ${verdict}.`,
    top3 ? "Top-3 roster gets thinner at a starting position. Heuristic. It does not override a thin sample." : "",
    weekLine,
    `Weeks not on bye: ${weeksNotOnBye}. That count is not a season total.`,
    "A rest-of-season number can sit beside this letter. It is not in the grade.",
    thinSample || byeConflict ? "The 8 percent band does not override this." : fair ? "Inside the 8% band. Heuristic." : "Outside the 8% band. Heuristic.",
    cut ? `You would have to cut ${cut.name}.` : "",
  ].filter(Boolean).join(" ");
  const gradedYou = byeConflict ? 0 : weekYou;
  return {
    you: gradedYou,
    them: byeConflict ? 0 : them,
    weekYou: gradedYou,
    nra: byeConflict ? 0 : round1(weekYou - them),
    fair: byeConflict ? false : fair,
    cut,
    consolidation: 0,
    letter,
    verdict,
    thinSample,
    byeConflict,
    weeksNotOnBye,
    why,
  };
}

export function findTrades(me: Team, league: { teams: Team[] }, players: Map<string, PlayerState>, mode: LineupMode): TradeIdea[] {
  const mine = teamPlayers(me, players).filter((p) => !me.ir.includes(p.id) && p.pos !== "DST" && p.trail !== "none" && scoredWeeks(p) > 3);
  const myAssets = [...mine].sort((a, b) => b.weekly.ePts - a.weekly.ePts).slice(0, 8);
  const top3 = new Set([...league.teams].sort((a, b) => b.pf - a.pf).slice(0, 3).map((t) => t.id));
  const ideas: TradeIdea[] = [];
  for (const partner of league.teams.filter((t) => t.id !== me.id)) {
    const theirs = teamPlayers(partner, players).filter((p) => !partner.ir.includes(p.id) && p.pos !== "DST" && p.trail !== "none" && scoredWeeks(p) > 3);
    const theirAssets = [...theirs].sort((a, b) => b.weekly.ePts - a.weekly.ePts).slice(0, 6);
    for (const get of theirAssets) {
      for (const give of myAssets) {
        if (give.pos === get.pos && Math.abs(give.weekly.ePts - get.weekly.ePts) < 1.5) continue;
        const evald = evaluateTrade(me, partner, players, [give.id], [get.id], mode, { partnerTop3: top3.has(partner.id) });
        if (evald.verdict === "Accept") ideas.push({ partner, give: [give], get: [get], eval: evald });
      }
    }
  }
  return ideas.sort((a, b) => b.eval.weekYou - a.eval.weekYou).slice(0, 5);
}

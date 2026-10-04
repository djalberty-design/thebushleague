import { DEFAULT_KEEPER_IDS } from "./config";
import { nextActions, phaseNow } from "./actions";
import { draftBoard, remainingPicks } from "./draft";
import { allKeptIds, applySelection, buildLeagueKeepers, eligibleFor, legalPair, rankPairs, thrownBack } from "./keepers";
import { inferMode, optimalLineup, slateWinProb, teamPlayers } from "./lineup";
import { freezeChip } from "./brain/freeze";
import { espnPoints, lineupMoves, matchupWin, rangeOf } from "./manager";
import { attachVor, playerMap, toPlayerState } from "./model";
import { PLAYERS } from "./players";
import { findTrades } from "./trades";
import type { League, LineupMode, PlayerState, RawPlayer } from "./types";
import { availablePlayers, speculativeAdds, waiverTargets } from "./waivers";

export function buildPool(extra: RawPlayer[] = []): PlayerState[] {
  const ids = new Set(PLAYERS.map((p) => p.id));
  const raws = [...PLAYERS, ...extra.filter((p) => !ids.has(p.id))];
  return attachVor(raws.map((p) => toPlayerState(p)));
}

export function buildDesk(input: {
  league: League;
  myTeamId: number;
  extra: RawPlayer[];
  selectedKeepers: string[];
  takenManual: string[];
  hideTaken: boolean;
  mode: LineupMode | "auto";
  espnConnected: boolean;
  view: string;
  keeperLocked?: boolean;
}) {
  const players = buildPool(input.extra);
  const map = playerMap(players);
  const league = input.league;
  const me = league.teams.find((t) => t.id === input.myTeamId) ?? league.teams.find((t) => t.isYou);
  const mine = me ? teamPlayers(me, map) : [];
  const matchup = league.matchups.find((m) => m.week === league.week && (m.homeId === me?.id || m.awayId === me?.id));
  const opponent = matchup ? league.teams.find((t) => t.id === (matchup.homeId === me?.id ? matchup.awayId : matchup.homeId)) : undefined;
  const theirs = opponent ? teamPlayers(opponent, map) : [];

  const locked = input.keeperLocked ?? league.keepersLocked ?? true;
  const selected = locked && me?.keepers.length ? [...me.keepers] : input.selectedKeepers.length ? input.selectedKeepers : league.keepersLocked ? [...DEFAULT_KEEPER_IDS] : [];
  const evals0 = me ? eligibleFor(me, map) : [];
  const evals = applySelection(evals0, selected);
  const pairs = rankPairs(evals0);
  const selectedPair = pairs.find((p) => selected.includes(p.a.player.id) && selected.includes(p.b.player.id)) ?? pairs[0] ?? null;
  const a = evals.find((e) => e.player.id === selected[0]);
  const b = evals.find((e) => e.player.id === selected[1]);
  const gate = a && b ? legalPair(a, b) : { ok: false, why: "Select two keepers of different positions." };

  const keeperOff = new Set(allKeptIds(league));
  for (const id of selected) keeperOff.add(id);
  const rostered = new Set(league.teams.flatMap((t) => [...t.roster, ...t.ir]));
  const taken = new Set([...input.takenManual, ...keeperOff]);
  const available = players.filter((p) => !taken.has(p.id));
  const keptMine = mine.filter((p) => selected.includes(p.id));
  const assigned = {
    ...(me?.keeperCost ?? {}),
    ...Object.fromEntries(evals.filter((e) => selected.includes(e.player.id)).map((e) => [e.player.id, e.assigned])),
  };
  if (locked && me) {
    for (const [id, round] of Object.entries(me.keeperCost)) assigned[id] = round;
  }
  const board = me ? draftBoard(available, me, keptMine, selected, 9, assigned) : { recs: [], holes: null, next: null, onClock: false, burned: [] };
  const capital = me ? remainingPicks(me, selected, 1, assigned) : [];
  const leagueKeepers = buildLeagueKeepers(league, map);
  const returning = me ? thrownBack(me, selected, map) : [];

  const myLineupTossup = optimalLineup(mine, me?.ir ?? [], "tossup");
  const theirLineup = optimalLineup(theirs, opponent?.ir ?? [], "tossup");
  const sampled = slateWinProb(myLineupTossup, theirLineup);
  const autoMode = inferMode(myLineupTossup.projected, theirLineup.projected, sampled, me?.record);
  const mode = input.mode === "auto" ? autoMode : input.mode;
  const lineup = optimalLineup(mine, me?.ir ?? [], mode);
  const theirFinal = optimalLineup(theirs, opponent?.ir ?? [], mode);
  const waivers = me ? waiverTargets(me, league, map, mode) : [];
  const speculative = speculativeAdds(league, map);
  const trades = me ? findTrades(me, league, map, mode) : [];
  const chip = freezeChip(league.espnLeagueId || "1014874", league.week);
  const moves = me ? lineupMoves(me, lineup, map) : [];
  const espnProj = me ? espnPoints(me, map) : null;
  const spread = rangeOf(lineup);
  const oppSpread = rangeOf(theirFinal);
  const win = slateWinProb(lineup, theirFinal);
  const espnWin = matchupWin(espnProj ?? lineup.projected, theirFinal.projected, spread, oppSpread);
  const inSeason = league.source === "espn" && mine.length > 8;
  const phase = inSeason ? "season" : phaseNow();
  const actions = nextActions({
    phase,
    pair: selectedPair,
    pairLegal: gate.ok,
    pairWhy: gate.ok ? null : gate.why,
    recs: board.recs,
    lineup,
    waivers,
    trades,
    espnConnected: input.espnConnected,
    opponentName: opponent?.name ?? "your opponent",
    mode,
    keepersLocked: locked,
    keptCount: keeperOff.size,
    nextPick: board.next?.label ?? "1.09",
    moves,
    win,
  });

  const viewList = players.filter((p) => {
    if (input.hideTaken && taken.has(p.id)) return false;
    if (input.view === "ALL" || !input.view) return true;
    if (input.view === "FLEX") return p.pos === "RB" || p.pos === "WR" || p.pos === "TE";
    if (input.view === "OP") return p.pos !== "DST";
    return p.pos === input.view;
  });

  return {
    players,
    map,
    me,
    mine,
    opponent,
    theirs,
    evals,
    pairs,
    selectedPair,
    pairLegal: gate.ok,
    pairWhy: gate.ok ? null : gate.why,
    selected,
    board,
    lineup,
    theirLineup: theirFinal,
    waivers,
    speculative,
    trades,
    moves,
    brainChip: chip,
    baseline: "BASELINE" as const,
    win,
    espnWin,
    espnProj,
    actions,
    phase,
    mode,
    taken,
    rostered,
    keeperOff,
    available: availablePlayers(league, map),
    viewList,
    matchup,
    league,
    leagueKeepers,
    capital,
    returning,
    keepersLocked: locked,
  };
}

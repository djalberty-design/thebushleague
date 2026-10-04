import { COIN_FLIP_WEEKLY, FAVORITE_MARGIN, STARTERS } from "./config";
import type { ConfidenceLabel, LineupMode, PlayerState, Slot, Team } from "./types";
import { round1 } from "@/lib/utils";

const FLEX = new Set(["RB", "WR", "TE"]);
const OP = new Set(["QB", "RB", "WR", "TE"]);

export interface LineupSeat {
  slot: Slot;
  player: PlayerState | null;
}

export interface Debate {
  starter: PlayerState;
  bench: PlayerState;
  delta: number;
  confidence: ConfidenceLabel;
}

export interface StartSitResult {
  starters: LineupSeat[];
  bench: PlayerState[];
  ir: PlayerState[];
  projected: number;
  p20: number;
  p80: number;
  debates: Debate[];
  mode: LineupMode;
  twoQb: boolean;
}

function modeScore(p: PlayerState, mode: LineupMode) {
  if (p.trail === "none") return -999;
  if (p.status === "O" || p.status === "IR" || p.status === "Bye" || p.status === "SSPD") return -999;
  if (mode === "favorite") return p.weekly.p20;
  if (mode === "underdog") return p.weekly.p80;
  return p.weekly.ePts;
}

export function inferMode(myProj: number, oppProj: number, win?: number, record?: { w: number; l: number }): LineupMode {
  const p = win ?? (myProj - oppProj >= FAVORITE_MARGIN ? 0.7 : oppProj - myProj >= FAVORITE_MARGIN ? 0.3 : 0.5);
  if (p >= 0.65) return "favorite";
  if (p <= 0.35) return "underdog";
  if (record && record.w + record.l > 0 && record.w / (record.w + record.l) < 0.5) return "underdog";
  return "tossup";
}

function drawRange(rng: () => number, p20: number, p50: number, p80: number) {
  const pick = rng();
  if (pick < 1 / 3) return p20;
  if (pick < 2 / 3) return p50;
  return p80;
}

export function slateWinProb(mine: StartSitResult, opp: StartSitResult) {
  let seed = 20261004;
  const rng = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
  const my = mine.starters.map((s) => s.player).filter((p): p is PlayerState => Boolean(p));
  const their = opp.starters.map((s) => s.player).filter((p): p is PlayerState => Boolean(p));
  let wins = 0;
  const n = 2000;
  for (let i = 0; i < n; i++) {
    const qb = my.find((p) => p.pos === "QB");
    const qbDraw = qb ? drawRange(rng, qb.weekly.p20, qb.weekly.p50, qb.weekly.p80) : 0;
    const qbMean = qb ? qb.weekly.ePts : 0;
    let myScore = 0;
    for (const p of my) {
      let draw = p === qb ? qbDraw : drawRange(rng, p.weekly.p20, p.weekly.p50, p.weekly.p80);
      if (qb && p !== qb && p.nflTeam === qb.nflTeam && (p.pos === "WR" || p.pos === "TE")) {
        draw += 0.25 * (qbDraw - qbMean) * (p.weekly.p80 - p.weekly.p20) / Math.max(4, qb.weekly.p80 - qb.weekly.p20);
      }
      myScore += draw;
    }
    let oppScore = 0;
    for (const p of their) oppScore += drawRange(rng, p.weekly.p20, p.weekly.p50, p.weekly.p80);
    if (myScore > oppScore) wins += 1;
  }
  return wins / n;
}

export function optimalLineup(roster: PlayerState[], irIds: string[], mode: LineupMode): StartSitResult {
  const irSet = new Set(irIds);
  const ir = roster.filter((p) => irSet.has(p.id) || p.status === "IR");
  const available = roster
    .filter((p) => !irSet.has(p.id) && p.status !== "IR")
    .sort((a, b) => modeScore(b, mode) - modeScore(a, mode));
  const used = new Set<string>();
  const starters: LineupSeat[] = [];

  const take = (pred: (p: PlayerState) => boolean, raw = false) => {
    const pool = available.filter((p) => !used.has(p.id) && pred(p) && p.trail !== "none");
    pool.sort((a, b) => (raw ? b.weekly.ePts - a.weekly.ePts : modeScore(b, mode) - modeScore(a, mode)));
    const player = pool[0] ?? null;
    if (player) used.add(player.id);
    return player;
  };

  for (let i = 0; i < STARTERS.qb; i++) starters.push({ slot: "QB", player: take((p) => p.pos === "QB") });
  for (let i = 0; i < STARTERS.rb; i++) starters.push({ slot: "RB", player: take((p) => p.pos === "RB") });
  for (let i = 0; i < STARTERS.wr; i++) starters.push({ slot: "WR", player: take((p) => p.pos === "WR") });
  for (let i = 0; i < STARTERS.te; i++) starters.push({ slot: "TE", player: take((p) => p.pos === "TE") });
  for (let i = 0; i < STARTERS.flex; i++) starters.push({ slot: "FLEX", player: take((p) => FLEX.has(p.pos), true) });
  for (let i = 0; i < STARTERS.op; i++) starters.push({ slot: "OP", player: take((p) => OP.has(p.pos), true) });
  for (let i = 0; i < STARTERS.dst; i++) starters.push({ slot: "DST", player: take((p) => p.pos === "DST") });

  const bench = available.filter((p) => !used.has(p.id));
  const projected = starters.reduce((s, seat) => s + (seat.player?.weekly.ePts ?? 0), 0);
  const p20 = starters.reduce((s, seat) => s + (seat.player?.weekly.p20 ?? 0), 0);
  const p80 = starters.reduce((s, seat) => s + (seat.player?.weekly.p80 ?? 0), 0);
  const twoQb = starters.filter((s) => s.player?.pos === "QB").length >= 2;

  const debates: Debate[] = [];
  const seen = new Set<string>();
  for (const seat of starters) {
    if (!seat.player || seat.slot === "DST") continue;
    const rival = bench.find((b) => {
      if (seat.slot === "FLEX") return FLEX.has(b.pos);
      if (seat.slot === "OP") return OP.has(b.pos);
      return b.pos === seat.slot;
    });
    if (!rival) continue;
    const key = [seat.player.id, rival.id].sort().join(":");
    if (seen.has(key)) continue;
    const score = seat.slot === "FLEX" || seat.slot === "OP" ? (p: PlayerState) => p.weekly.ePts : (p: PlayerState) => modeScore(p, mode);
    const delta = round1(score(seat.player) - score(rival));
    if (Math.abs(delta) <= 2.8) {
      seen.add(key);
      debates.push({
        starter: seat.player,
        bench: rival,
        delta,
        confidence: Math.abs(delta) < COIN_FLIP_WEEKLY ? "Coin-flip" : "Med",
      });
    }
  }

  return {
    starters,
    bench,
    ir,
    projected: round1(projected),
    p20: round1(p20),
    p80: round1(p80),
    debates,
    mode,
    twoQb,
  };
}

export function teamPlayers(team: Team, players: Map<string, PlayerState>) {
  return [...team.roster, ...team.ir].map((id) => players.get(id)).filter((p): p is PlayerState => Boolean(p));
}

export function winProb(my: number, opp: number, mySpread: number, oppSpread: number) {
  const mean = my - opp;
  const sd = Math.sqrt(Math.max(8, (mySpread ** 2 + oppSpread ** 2) / 2));
  const z = mean / sd;
  return 1 / (1 + Math.exp(-1.7 * z));
}

import { CURRENT_WEEK, REPLACEMENT_RANK, WEEKS_LEFT } from "./config";
import { adp10From12 } from "./scoring";
import { projectFromRaw } from "./brain/project";
import { cardUsesBrain } from "./brain/ingest";
import { trailOf } from "./brain/trail";
import { ownRecentImplied, slateFor, teamImplied, thinRos } from "./brain/slate-lookup";
import { SHADOW } from "./brain/stored/shadow";
import { FREEZE_ROWS } from "./brain/stored/freezes";
import { STORED_WEIGHTS } from "./brain/stored/weights";
import type { ConfidenceLabel, PlayerState, Pos, RawPlayer, Usage } from "./types";
import { clamp, round1 } from "@/lib/utils";

function usageOf(features: { snap: number; routeShare: number; targetShare: number; carryShare: number; rzShare: number }): Usage {
  return {
    snap: features.snap * 100,
    route: features.routeShare * 100,
    targetShare: features.targetShare * 100,
    rushShare: features.carryShare * 100,
    rzShare: features.rzShare * 100,
  };
}

function roleLine(p: RawPlayer) {
  if (p.status === "IR" || p.status === "O") return "Unavailable until the designation clears. Weekly points forced toward zero.";
  if (p.pos === "DST") return "Stream by default. Hold only if the next three weeks are elite and waiver priority is terrible.";
  if (p.pos === "RB" && p.usage < 58) return "Committee. Volume is the score in this league — haircut until the job is clear.";
  if (p.pos === "RB" && p.age >= 29) return "Age-29+ back. Still startable on volume, but C takes the aging tax.";
  if (p.pos === "WR" && p.age >= 32) return "Age-32+ receiver. First downs still pay; the curve is the risk.";
  if (p.pos === "WR" && (p.rec || 0) >= 90) return "High-target slot. 0.2/target + first downs inflate him versus generic PPR ranks.";
  if (p.pos === "RB" && (p.rec || 0) >= 50) return "Pass-catching back. Targets, receptions, and rush attempts all score here.";
  if (p.pos === "QB") return "Completion rate and sack avoidance matter. Reckless boom QBs are taxed (INC, SK, INT).";
  if (p.pos === "TE") return "True TE cliff after the top tier. Scarcity lives in VOR, not a separate grade.";
  return "Stable role. Projection follows counting stats in Bush League scoring.";
}

export function confidenceOf(p: RawPlayer): number {
  let c = 1;
  if (p.status === "IR" || p.status === "O" || p.status === "SSPD") return 0.55;
  if (p.status === "D") c -= 0.18;
  if (p.status === "Q") c -= 0.1;
  if (p.pos === "RB" && p.usage < 58) c -= 0.12;
  if (p.pos === "RB" && p.age >= 29) c -= 0.08;
  if (p.pos === "WR" && p.age >= 32) c -= 0.08;
  if (p.health < 70) c -= 0.1;
  if (p.rook) c -= 0.08;
  if (p.news?.toLowerCase().includes("new")) c -= 0.1;
  return clamp(c, 0.55, 1);
}

export function confidenceLabel(c: number, weeklyGap?: number): ConfidenceLabel {
  if (weeklyGap !== undefined && Math.abs(weeklyGap) < 1.5) return "Coin-flip";
  if (c >= 0.86) return "High";
  if (c >= 0.7) return "Med";
  return "Coin-flip";
}

function cardBadges(p: RawPlayer, week: number, slate: ReturnType<typeof slateFor>, shadowRow?: { usage: string }) {
  const usage = shadowRow?.usage ?? "";
  const snap = usage.match(/Snap ([^.]+)/)?.[1] ?? "missing";
  const targets = usage.match(/Targets ([^.]+)/)?.[1] ?? "missing";
  const goal = usage.match(/Goal line ([^.]+)/)?.[1] ?? "missing";
  const now = teamImplied(slate);
  const recent = ownRecentImplied(p.team, [week - 3, week - 2, week - 1].filter((value) => value >= 1));
  const total = now == null || recent == null ? "Team total missing." : `Team total ${now.toFixed(1)} vs last three ${recent.toFixed(1)}.`;
  const freeze = FREEZE_ROWS.find((row) => row.week === week);
  return [
    { name: "Status", value: "BASELINE, brain disabled, validation failed." },
    { name: "Badges", value: `Snap ${snap}. Targets ${targets}. Goal line ${goal}. ${total}` },
    { name: "Rest of season", value: "THIN, NOT A FORECAST. Own trailing mean times games left. Bye is 0. 276 is not published." },
    {
      name: "Provenance",
      value: `Model ${STORED_WEIGHTS.version}. Weights ${STORED_WEIGHTS.usageLast3.toFixed(2)}. Freeze ${freeze?.at ?? "STALE"}. Odds freeze STALE. Injury freeze STALE. B1 disabled.`,
    },
  ];
}

export function toPlayerState(p: RawPlayer, week = CURRENT_WEEK): PlayerState {
  const slate = slateFor(p.team, week);
  const onBye = slate ? slate.bye : p.bye === week;
  const out = p.status === "O" || p.status === "IR" || p.status === "SSPD" || onBye;
  const trail = trailOf(p.id);
  const live = cardUsesBrain();
  const brain = projectFromRaw(p, week);
  const shadowRow = SHADOW[p.id];
  const card = live
    ? { p20: brain.range.p20, p50: brain.range.p50, p80: brain.range.p80, ePts: brain.points }
    : trail.kind === "none" || out
      ? { p20: 0, p50: 0, p80: 0, ePts: 0 }
      : { p20: round1(trail.floor), p50: round1(trail.mean), p80: round1(trail.ceiling), ePts: round1(trail.mean) };
  const weekly = card;
  const ros = trail.kind === "none" || live
    ? { ...card, ePts: live ? brain.points * WEEKS_LEFT : 0, p20: live ? brain.range.p20 * WEEKS_LEFT : 0, p50: live ? brain.points * WEEKS_LEFT : 0, p80: live ? brain.range.p80 * WEEKS_LEFT : 0, weeksLeft: WEEKS_LEFT }
    : thinRos(p.team, card, week, 17);
  const c = out ? 0.55 : confidenceOf(p);
  const label = trail.kind === "thin" || !live ? "Med" : confidenceLabel(c);
  const reason = trail.kind === "none"
    ? trail.reason
    : out
      ? `BASELINE. ${onBye ? "Bye." : "Out."} Not started.`
      : trail.kind === "thin"
        ? `BASELINE. Thin, ${trail.points.length} scored week${trail.points.length === 1 ? "" : "s"}: ${trail.points.join(", ")}.${trail.reason.startsWith("joined as") ? ` ${trail.reason}.` : ""}`
        : `BASELINE. Last three pregame weeks ${trail.points.join(", ")}.`;
  const rosNote = trail.kind === "none" || out ? "" : ` ROS ${ros.ePts.toFixed(1)} is THIN, NOT A FORECAST. Own mean × ${ros.weeksLeft} games, bye 0.`;
  return {
    id: p.id,
    name: p.name,
    pos: p.pos,
    nflTeam: p.team,
    bye: p.bye,
    status: onBye ? "Bye" : p.status ?? "Active",
    usage: usageOf(brain.features.usage),
    weekly,
    ros,
    weeklyVor: 0,
    rosVor: 0,
    adjVor: 0,
    confidence: round1(c),
    confidenceLabel: label,
    adp12: p.adp12,
    adp10: round1(adp10From12(p.adp12)),
    age: p.age,
    opp: slate?.opp || p.opp,
    home: slate?.home ?? p.home,
    rook: p.rook,
    news: p.news,
    role: roleLine(p),
    source: "counting",
    undroppable: Boolean(p.undroppable) || p.adp12 <= 36,
    stats: brain.stats,
    reason: reason + rosNote,
    stale: !live,
    trail: trail.kind,
    scoredWeeks: trail.points.length,
    shadow: cardBadges(p, week, slate, shadowRow),
  };
}

/** Heuristic replacement sort. Not the claim replacement and not the card. The ranks are not retuned here. */
export const VOR_SORT_LABEL = "Heuristic. Not the claim replacement and not the card.";

export function attachVor(players: PlayerState[]): PlayerState[] {
  const byPos = new Map<Pos, PlayerState[]>();
  for (const p of players) {
    const list = byPos.get(p.pos) ?? [];
    list.push(p);
    byPos.set(p.pos, list);
  }
  for (const [pos, list] of byPos) {
    const rosSorted = [...list].sort((a, b) => b.ros.ePts - a.ros.ePts);
    const weekSorted = [...list].sort((a, b) => b.weekly.ePts - a.weekly.ePts);
    const rosIdx = Math.min(rosSorted.length - 1, Math.max(0, REPLACEMENT_RANK[pos] - 1));
    const weekIdx = Math.min(weekSorted.length - 1, Math.max(0, Math.round(REPLACEMENT_RANK[pos] * 0.55) - 1));
    const rosBase = rosSorted[rosIdx]?.ros.ePts ?? 0;
    const weekBase = weekSorted[weekIdx]?.weekly.ePts ?? 0;
    for (const p of list) {
      p.rosVor = round1(p.ros.ePts - rosBase);
      p.weeklyVor = round1(p.weekly.ePts - weekBase);
      p.adjVor = round1(p.rosVor * p.confidence);
    }
  }
  return [...players].sort((a, b) => b.adjVor - a.adjVor || b.ros.ePts - a.ros.ePts);
}

export function playerMap(players: PlayerState[]) {
  return new Map(players.map((p) => [p.id, p]));
}

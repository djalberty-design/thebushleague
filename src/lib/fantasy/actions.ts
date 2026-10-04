import { DRAFT_START_AT, KEEPER_LOCK_AT } from "./config";
import type { DraftRec } from "./draft";
import type { KeeperPair } from "./keepers";
import type { StartSitResult } from "./lineup";
import type { TradeIdea } from "./trades";
import type { ActionRec, LineupMode } from "./types";
import type { WaiverClaim } from "./waivers";
import type { LineupMove } from "./manager";

export type Phase = "keepers" | "draft" | "season";

export function phaseNow(now = Date.now()): Phase {
  if (now < KEEPER_LOCK_AT) return "keepers";
  if (now < DRAFT_START_AT + 18 * 60 * 1000) return "draft";
  return "season";
}

export function nextActions(input: {
  phase: Phase;
  pair: KeeperPair | null;
  pairLegal: boolean;
  pairWhy: string | null;
  recs: DraftRec[];
  lineup: StartSitResult;
  waivers: WaiverClaim[];
  trades: TradeIdea[];
  espnConnected: boolean;
  opponentName: string;
  mode: LineupMode;
  keepersLocked?: boolean;
  keptCount?: number;
  nextPick?: string;
  moves?: LineupMove[];
  win?: number;
}): ActionRec[] {
  const out: ActionRec[] = [];
  if (input.phase === "keepers") {
    if (input.keepersLocked && input.pair && input.pairLegal) {
      out.push({
        id: "lock-keepers",
        title: "Keepers are in",
        doThis: `${input.pair.a.player.name} (R${input.pair.a.assigned}) and ${input.pair.b.player.name} (R${input.pair.b.assigned}) are off the board. Those picks are burned.`,
        why: `${input.keptCount ?? 16} names are already removed league-wide. Surplus uses the ESPN assigned round, not ADP.`,
        gain: `Pair surplus ${input.pair.a.surplus.toFixed(1)} / ${input.pair.b.surplus.toFixed(1)}`,
        confidence: "High",
        flip: "ESPN unlocking a name before Tuesday 7:30 PM — it has not happened.",
        href: "/keepers",
      });
    } else if (input.pair && input.pairLegal) {
      out.push({
        id: "lock-keepers",
        title: "Lock keepers",
        doThis: `Keep ${input.pair.a.player.name} (R${input.pair.a.assigned}) and ${input.pair.b.player.name} (R${input.pair.b.assigned}).`,
        why: input.pair.why,
        gain: `PairScore ${input.pair.pairScore.toFixed(0)} · surplus ${input.pair.a.surplus.toFixed(1)} / ${input.pair.b.surplus.toFixed(1)}`,
        confidence: "High",
        flip: "A live ADP swing that flips surplus, or a same-position constraint if you swap names.",
        href: "/keepers",
      });
    } else {
      out.push({
        id: "fix-keepers",
        title: "Fix keeper pair",
        doThis: input.pairWhy ?? "Pick two keepers of different positions.",
        why: "Illegal pairs cannot be locked. Collision and the one-year rule are already applied.",
        gain: "Unlocks the draft board at 7:30 PM Tuesday.",
        confidence: "High",
        flip: "Choose a legal pair from the top 5.",
        href: "/keepers",
      });
    }
    if (input.recs[0]) {
      out.push({
        id: "first-pick",
        title: `After lock, pick ${input.nextPick ?? "1.09"}`,
        doThis: `Board says ${input.recs[0].player.name} if the keepers hold.`,
        why: input.recs[0].why,
        gain: `AdjVOR ${input.recs[0].player.adjVor.toFixed(0)}`,
        confidence: input.recs[0].reach ? "Med" : "High",
        flip: "Tommy owns 1.01 with zero keepers. A run of thrown-back talent before 1.09 is the swing.",
        href: "/draft",
      });
    }
    if (!input.espnConnected && !input.keepersLocked) {
      out.push({
        id: "sync",
        title: "Confirm the roster",
        doThis: "Connect ESPN 1014874 or paste the 2025 ending roster if cookies fail.",
        why: "Locked keepers are already seeded from ESPN. Live ESPN still wins if a name moves.",
        gain: "Stops a silent wrong keeper.",
        confidence: "High",
        flip: "Paste mode is enough if ESPN stays private.",
        href: "/setup",
      });
    }
    if (input.keepersLocked && out.length >= 3) return out.slice(0, 3);
  } else if (input.phase === "draft") {
    const top = input.recs.slice(0, 3);
    if (top[0]) {
      out.push({
        id: "on-clock",
        title: "On the clock",
        doThis: `Take ${top[0].player.name}. Alts: ${top.slice(1).map((r) => r.player.name).join(", ") || "none"}.`,
        why: top[0].why,
        gain: `DraftValue ${top[0].value.toFixed(1)}`,
        confidence: top[0].reach ? "Med" : "High",
        flip: "Holes change if someone falls at a scarce slot (TE/QB).",
        href: "/draft",
      });
    }
  } else {
    const moves = input.moves ?? [];
    const winPct = input.win != null ? `${Math.round(input.win * 100)}%` : null;
    if (moves.length) {
      const top = moves[0];
      out.push({
        id: "start-sit",
        title: "Lineup",
        doThis: top.sit
          ? `Start ${top.start.name} over ${top.sit.name} at ${top.slot}.`
          : `Start ${top.start.name} at ${top.slot}.`,
        why: `${moves.length} spot${moves.length === 1 ? "" : "s"} differ from the ESPN lineup. ${winPct ? `Best lineup wins this matchup ${winPct}.` : ""} Mode is ${input.mode}.`,
        gain: `${top.delta >= 0 ? "+" : ""}${top.delta.toFixed(1)} pts`,
        confidence: Math.abs(top.delta) < 1.5 ? "Coin-flip" : Math.abs(top.delta) < 3 ? "Med" : "High",
        flip: "A questionable tag or a gametime inactive. Re-score before lock.",
        href: "/lineup",
      });
    } else {
      const debate = input.lineup.debates[0];
      if (debate) {
        out.push({
          id: "start-sit",
          title: "Lineup",
          doThis: Math.abs(debate.delta) < 1.5 ? `Coin-flip: ${debate.starter.name} vs ${debate.bench.name}.` : `Start ${debate.starter.name} over ${debate.bench.name}.`,
          why: `Closest call is ${debate.delta >= 0 ? "+" : ""}${debate.delta.toFixed(1)}. ${winPct ? `Three-point sample ${winPct} vs ${input.opponentName}. Not a win chance.` : `vs ${input.opponentName}.`}`,
          gain: `${Math.abs(debate.delta).toFixed(1)} pts`,
          confidence: debate.confidence,
          flip: "Injury designation or a Thursday lock.",
          href: "/lineup",
        });
      } else {
        out.push({
          id: "lineup-set",
          title: "Lineup is set",
          doThis: `Leave it. ${input.lineup.projected.toFixed(1)} vs ${input.opponentName}${winPct ? `, about ${winPct} to win` : ""}.`,
          why: input.lineup.twoQb ? "Second QB beats the next skill player in the OP slot." : "ESPN already matches the best lineup.",
          gain: `${input.lineup.projected.toFixed(1)} pts`,
          confidence: "High",
          flip: "Inactives, or a bench player whose projection jumps past the starter.",
          href: "/lineup",
        });
      }
    }
    const w = input.waivers[0];
    if (w) {
      out.push({
        id: "waiver",
        title: w.advice === "Burn" ? "Make the claim" : "Do not burn priority",
        doThis: w.drop ? `Add ${w.player.name}, drop ${w.drop.name}.` : `Add ${w.player.name} if a bench spot is open.`,
        why: w.reason,
        gain: `Score ${w.claimValue.toFixed(1)}`,
        confidence: w.stream || Math.abs(w.claimValue) < 1.5 ? "Med" : w.player.confidenceLabel,
        flip: "Someone better hits the wire, or the add's projection falls under the drop.",
        href: "/waivers",
      });
    }
    const t = input.trades[0];
    if (t && out.length < 3) {
      out.push({
        id: "trade",
        title: `${t.eval.letter} · ${t.eval.verdict} to ${t.partner.abbrev}`,
        doThis: `Send ${t.give.map((p) => p.name).join(", ")} for ${t.get.map((p) => p.name).join(", ")}.`,
        why: t.eval.why,
        gain: `ROS ${t.eval.you >= 0 ? "+" : ""}${t.eval.you.toFixed(1)} · week ${t.eval.weekYou >= 0 ? "+" : ""}${t.eval.weekYou.toFixed(1)}`,
        confidence: t.eval.letter === "A" || t.eval.letter === "B" ? "Med" : "Coin-flip",
        flip: "If their side goes negative past 6, they will not take it. Counter, do not add a sweetener blindly.",
        href: "/trades",
      });
    }
  }
  return out.slice(0, 3);
}

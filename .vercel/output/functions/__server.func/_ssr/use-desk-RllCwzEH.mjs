import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { C as USER_INELIGIBLE_IDS, D as cn, E as clamp, O as normalizeName, S as USER_ELIGIBLE, _ as REPLACEMENT_RANK, c as KEEPER_LOCK_AT, f as NEED_BOOST, g as PRIORITY_COST, h as PLAYERS, i as DEFAULT_KEEPER_IDS, k as round1, l as KEEP_SURPLUS_WEIGHT, m as PICK_VALUE_BY_ROUND, n as CONSOLIDATION_BONUS, o as DRAFT_START_AT, r as CURRENT_WEEK, s as INELIGIBLE_KEEP_IDS, t as BYE_STACK_PENALTY, u as KEEP_VOR_WEIGHT, v as ROSTER_MAX, x as TRADE_FAIR_BAND, y as STARTERS } from "./league-BHDWdH1h.mjs";
import { n as useBush } from "./router-C2UZVP6N.mjs";
import { t as STORED_WEIGHTS } from "./weights-BK7gfhJs.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/use-desk-RllCwzEH.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var badgeVariants = cva("inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium tracking-wide", {
	variants: { tone: {
		muted: "bg-bg-subtle text-muted",
		paper: "bg-paper/10 text-paper",
		start: "bg-start/15 text-start",
		warn: "bg-warn/15 text-warn",
		sit: "bg-sit/15 text-sit",
		accent: "bg-accent/15 text-accent"
	} },
	defaultVariants: { tone: "muted" }
});
function Badge({ className, tone, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn(badgeVariants({
			tone,
			className
		})),
		...props
	});
}
function phaseNow(now = Date.now()) {
	if (now < KEEPER_LOCK_AT) return "keepers";
	if (now < DRAFT_START_AT + 108e4) return "draft";
	return "season";
}
function nextActions(input) {
	const out = [];
	if (input.phase === "keepers") {
		if (input.keepersLocked && input.pair && input.pairLegal) out.push({
			id: "lock-keepers",
			title: "Keepers are in",
			doThis: `${input.pair.a.player.name} (R${input.pair.a.assigned}) and ${input.pair.b.player.name} (R${input.pair.b.assigned}) are off the board. Those picks are burned.`,
			why: `${input.keptCount ?? 16} names are already removed league-wide. Surplus uses the ESPN assigned round, not ADP.`,
			gain: `Pair surplus ${input.pair.a.surplus.toFixed(1)} / ${input.pair.b.surplus.toFixed(1)}`,
			confidence: "High",
			flip: "ESPN unlocking a name before Tuesday 7:30 PM — it has not happened.",
			href: "/keepers"
		});
		else if (input.pair && input.pairLegal) out.push({
			id: "lock-keepers",
			title: "Lock keepers",
			doThis: `Keep ${input.pair.a.player.name} (R${input.pair.a.assigned}) and ${input.pair.b.player.name} (R${input.pair.b.assigned}).`,
			why: input.pair.why,
			gain: `PairScore ${input.pair.pairScore.toFixed(0)} · surplus ${input.pair.a.surplus.toFixed(1)} / ${input.pair.b.surplus.toFixed(1)}`,
			confidence: "High",
			flip: "A live ADP swing that flips surplus, or a same-position constraint if you swap names.",
			href: "/keepers"
		});
		else out.push({
			id: "fix-keepers",
			title: "Fix keeper pair",
			doThis: input.pairWhy ?? "Pick two keepers of different positions.",
			why: "Illegal pairs cannot be locked. Collision and the one-year rule are already applied.",
			gain: "Unlocks the draft board at 7:30 PM Tuesday.",
			confidence: "High",
			flip: "Choose a legal pair from the top 5.",
			href: "/keepers"
		});
		if (input.recs[0]) out.push({
			id: "first-pick",
			title: `After lock, pick ${input.nextPick ?? "1.09"}`,
			doThis: `Board says ${input.recs[0].player.name} if the keepers hold.`,
			why: input.recs[0].why,
			gain: `AdjVOR ${input.recs[0].player.adjVor.toFixed(0)}`,
			confidence: input.recs[0].reach ? "Med" : "High",
			flip: "Tommy owns 1.01 with zero keepers. A run of thrown-back talent before 1.09 is the swing.",
			href: "/draft"
		});
		if (!input.espnConnected && !input.keepersLocked) out.push({
			id: "sync",
			title: "Confirm the roster",
			doThis: "Connect ESPN 1014874 or paste the 2025 ending roster if cookies fail.",
			why: "Locked keepers are already seeded from ESPN. Live ESPN still wins if a name moves.",
			gain: "Stops a silent wrong keeper.",
			confidence: "High",
			flip: "Paste mode is enough if ESPN stays private.",
			href: "/setup"
		});
		if (input.keepersLocked && out.length >= 3) return out.slice(0, 3);
	} else if (input.phase === "draft") {
		const top = input.recs.slice(0, 3);
		if (top[0]) out.push({
			id: "on-clock",
			title: "On the clock",
			doThis: `Take ${top[0].player.name}. Alts: ${top.slice(1).map((r) => r.player.name).join(", ") || "none"}.`,
			why: top[0].why,
			gain: `DraftValue ${top[0].value.toFixed(1)}`,
			confidence: top[0].reach ? "Med" : "High",
			flip: "Holes change if someone falls at a scarce slot (TE/QB).",
			href: "/draft"
		});
	} else {
		const moves = input.moves ?? [];
		const winPct = input.win != null ? `${Math.round(input.win * 100)}%` : null;
		if (moves.length) {
			const top = moves[0];
			out.push({
				id: "start-sit",
				title: "Lineup",
				doThis: top.sit ? `Start ${top.start.name} over ${top.sit.name} at ${top.slot}.` : `Start ${top.start.name} at ${top.slot}.`,
				why: `${moves.length} spot${moves.length === 1 ? "" : "s"} differ from the ESPN lineup. ${winPct ? `Best lineup wins this matchup ${winPct}.` : ""} Mode is ${input.mode}.`,
				gain: `${top.delta >= 0 ? "+" : ""}${top.delta.toFixed(1)} pts`,
				confidence: Math.abs(top.delta) < 1.5 ? "Coin-flip" : Math.abs(top.delta) < 3 ? "Med" : "High",
				flip: "A questionable tag or a gametime inactive. Re-score before lock.",
				href: "/lineup"
			});
		} else {
			const debate = input.lineup.debates[0];
			if (debate) out.push({
				id: "start-sit",
				title: "Lineup",
				doThis: Math.abs(debate.delta) < 1.5 ? `Coin-flip: ${debate.starter.name} vs ${debate.bench.name}.` : `Start ${debate.starter.name} over ${debate.bench.name}.`,
				why: `Closest call is ${debate.delta >= 0 ? "+" : ""}${debate.delta.toFixed(1)}. ${winPct ? `Three-point sample ${winPct} vs ${input.opponentName}. Not a win chance.` : `vs ${input.opponentName}.`}`,
				gain: `${Math.abs(debate.delta).toFixed(1)} pts`,
				confidence: debate.confidence,
				flip: "Injury designation or a Thursday lock.",
				href: "/lineup"
			});
			else out.push({
				id: "lineup-set",
				title: "Lineup is set",
				doThis: `Leave it. ${input.lineup.projected.toFixed(1)} vs ${input.opponentName}${winPct ? `, about ${winPct} to win` : ""}.`,
				why: input.lineup.twoQb ? "Second QB beats the next skill player in the OP slot." : "ESPN already matches the best lineup.",
				gain: `${input.lineup.projected.toFixed(1)} pts`,
				confidence: "High",
				flip: "Inactives, or a bench player whose projection jumps past the starter.",
				href: "/lineup"
			});
		}
		const w = input.waivers[0];
		if (w) out.push({
			id: "waiver",
			title: w.advice === "Burn" ? "Make the claim" : "Do not burn priority",
			doThis: w.drop ? `Add ${w.player.name}, drop ${w.drop.name}.` : `Add ${w.player.name} if a bench spot is open.`,
			why: w.reason,
			gain: `Score ${w.claimValue.toFixed(1)}`,
			confidence: w.stream || Math.abs(w.claimValue) < 1.5 ? "Med" : w.player.confidenceLabel,
			flip: "Someone better hits the wire, or the add's projection falls under the drop.",
			href: "/waivers"
		});
		const t = input.trades[0];
		if (t && out.length < 3) out.push({
			id: "trade",
			title: `${t.eval.letter} · ${t.eval.verdict} to ${t.partner.abbrev}`,
			doThis: `Send ${t.give.map((p) => p.name).join(", ")} for ${t.get.map((p) => p.name).join(", ")}.`,
			why: t.eval.why,
			gain: `ROS ${t.eval.you >= 0 ? "+" : ""}${t.eval.you.toFixed(1)} · week ${t.eval.weekYou >= 0 ? "+" : ""}${t.eval.weekYou.toFixed(1)}`,
			confidence: t.eval.letter === "A" || t.eval.letter === "B" ? "Med" : "Coin-flip",
			flip: "If their side goes negative past 6, they will not take it. Counter, do not add a sweetener blindly.",
			href: "/trades"
		});
	}
	return out.slice(0, 3);
}
function pickValueRound(round) {
	return PICK_VALUE_BY_ROUND[Math.max(1, Math.min(18, Math.round(round)))] ?? 1;
}
function pickValueExact(round, pickInRound) {
	const start = pickValueRound(round);
	const next = pickValueRound(round + 1);
	const t = Math.max(0, Math.min(.9, (pickInRound - 1) / 10));
	return round1(start + t * (next - start));
}
function pickValueFromAdp10(adp10) {
	const pick = Math.max(1, adp10);
	return pickValueExact(Math.floor((pick - 1) / 10) + 1, (pick - 1) % 10 + 1);
}
function overallPick(slot, round, teams = 10) {
	if (round % 2 === 1) return (round - 1) * teams + slot;
	return round * teams - slot + 1;
}
function pickInRound(slot, round, teams = 10) {
	return round % 2 === 1 ? slot : teams - slot + 1;
}
function costLabel(slot, round, teams = 10) {
	return `Rd ${round}, Pick ${pickInRound(slot, round, teams)}`;
}
function pickLabel(slot, round, teams = 10) {
	return `${round}.${String(pickInRound(slot, round, teams)).padStart(2, "0")}`;
}
function slotPicks(slot, burnedRounds, teams = 10, rounds = 18) {
	const burned = new Set(burnedRounds);
	const out = [];
	for (let r = 1; r <= rounds; r++) {
		if (burned.has(r)) continue;
		const overall = overallPick(slot, r, teams);
		out.push({
			round: r,
			overall,
			label: pickLabel(slot, r, teams),
			espnLabel: costLabel(slot, r, teams)
		});
	}
	return out;
}
function burnedRounds(team, selectedKeepers, assigned) {
	return (selectedKeepers.length ? selectedKeepers : team.keepers).map((id) => assigned?.[id] ?? team.keeperCost[id]).filter((n) => typeof n === "number");
}
function remainingPicks(team, selectedKeepers, currentOverall = 1, assigned) {
	const burned = burnedRounds(team, selectedKeepers, assigned);
	return slotPicks(team.draftSlot || 9, burned).filter((p) => p.overall >= currentOverall);
}
function holes(roster) {
	const count = (pos) => roster.filter((p) => p.pos === pos).length;
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
		counts: {
			qb,
			rb,
			wr,
			te,
			dst
		}
	};
}
function needBoost(player, roster) {
	const h = holes(roster);
	const options = [0];
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
function byePenalty(player, roster) {
	const starters = roster.filter((p) => p.pos === player.pos || player.pos !== "DST" && p.pos === player.pos);
	const shareBye = roster.filter((p) => p.bye === player.bye);
	const qbTe = player.pos === "QB" || player.pos === "TE";
	const bothRbs = player.pos === "RB" && roster.filter((p) => p.pos === "RB" && p.bye === player.bye).length >= 1;
	if ((qbTe || bothRbs) && shareBye.length && starters.length) return BYE_STACK_PENALTY;
	return 0;
}
function vorAtNextPick(available, nextOverall) {
	const likely = available.filter((p) => p.adp10 >= nextOverall - 1).sort((a, b) => b.adjVor - a.adjVor);
	return likely[2]?.adjVor ?? likely[0]?.adjVor ?? 0;
}
function draftBoard(available, team, roster, selectedKeepers, currentOverall = 1, assigned) {
	const picks = remainingPicks(team, selectedKeepers, currentOverall, assigned);
	const next = picks[0] ?? null;
	const expectedWait = vorAtNextPick(available, picks[1]?.overall ?? (next ? next.overall + 12 : 20));
	const round = next ? next.round : 1;
	return {
		recs: available.filter((p) => p.pos !== "DST" || round >= 14).filter((p) => p.pos !== "K").map((player) => {
			const need = needBoost(player, roster);
			const bye = byePenalty(player, roster);
			const p80Weight = round >= 8 ? .25 : 0;
			const vor = player.adjVor * (1 - p80Weight) + (player.ros.p80 / 16 - (player.ros.ePts / 16 - player.adjVor / 16)) * p80Weight * 16;
			const value = round1(vor - expectedWait + need * Math.max(0, player.adjVor) - bye * Math.max(0, player.adjVor));
			const reach = player.adp10 - (next?.overall ?? 1) > 8;
			return {
				player,
				value,
				need,
				reach,
				why: player.pos === "DST" ? "DST only late unless an elite unit is falling. Stream by default." : need >= NEED_BOOST.emptyStarter ? `Fills a starting ${player.pos} hole. AdjVOR ${player.adjVor.toFixed(0)} vs wait ${expectedWait.toFixed(0)}.` : `Best remaining AdjVOR (${player.adjVor.toFixed(0)}). ${reach ? "Reach vs ADP." : "On-market or value."}`
			};
		}).sort((a, b) => b.value - a.value).slice(0, 30),
		holes: holes(roster),
		next,
		onClock: Boolean(next && next.overall === currentOverall),
		burned: burnedRounds(team, selectedKeepers, assigned)
	};
}
var INELIGIBLE = /* @__PURE__ */ new Set([...INELIGIBLE_KEEP_IDS, ...USER_INELIGIBLE_IDS]);
function keepLabel(score) {
	if (score >= 85) return "Lock";
	if (score >= 70) return "Strong";
	if (score >= 55) return "Situational";
	if (score >= 40) return "Fringe";
	return "Cut";
}
function assignCosts(keepers) {
	const order = new Map(USER_ELIGIBLE.map((e, i) => [e.id, i]));
	const sorted = [...keepers].sort((a, b) => a.sticker - b.sticker || (order.get(a.id) ?? 99) - (order.get(b.id) ?? 99) || a.id.localeCompare(b.id));
	const used = /* @__PURE__ */ new Set();
	return sorted.map((k) => {
		let r = k.sticker;
		while (used.has(r) && r < 18) r += 1;
		used.add(r);
		return {
			id: k.id,
			sticker: k.sticker,
			assigned: r
		};
	});
}
function zScores(values) {
	if (!values.length) return values;
	const mean = values.reduce((s, n) => s + n, 0) / values.length;
	const variance = values.reduce((s, n) => s + (n - mean) ** 2, 0) / values.length;
	const sd = Math.sqrt(variance);
	if (sd === 0) return values.map(() => 0);
	return values.map((n) => (n - mean) / sd);
}
function surplusFor(player, assignedRound) {
	return round1(pickValueFromAdp10(player.adp10) - pickValueRound(assignedRound));
}
function surplusOf(player, assignedRound) {
	return surplusFor(player, assignedRound);
}
function scoreKeepers(rows) {
	if (!rows.length) return [];
	const zVor = zScores(rows.map((r) => r.player.adjVor));
	const zSur = zScores(rows.map((r) => r.surplus));
	const raw = rows.map((_, i) => 100 * (KEEP_VOR_WEIGHT * zVor[i] + KEEP_SURPLUS_WEIGHT * zSur[i]));
	const max = Math.max(...raw, 1e-4);
	return raw.map((n) => round1(n / max * 100));
}
function eligibleFor(team, players) {
	const rows = [];
	for (const spec of USER_ELIGIBLE) {
		if (!team.roster.includes(spec.id) && !team.ir.includes(spec.id)) continue;
		const player = players.get(spec.id);
		if (!player) continue;
		const sticker = team.keeperCost[spec.id] ?? spec.sticker;
		const eligible = !INELIGIBLE.has(player.id);
		rows.push({
			player,
			sticker,
			surplus: surplusOf(player, sticker),
			eligible,
			reason: eligible ? "On the 2025 roster and not on the K list or R1–4 ban." : ineligibleWhy(player.id)
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
			reason: ineligibleWhy(id)
		});
	}
	const eligibleRows = rows.filter((r) => r.eligible);
	const scores = scoreKeepers(eligibleRows.map((r) => ({
		player: r.player,
		surplus: r.surplus
	})));
	const scoreMap = new Map(eligibleRows.map((r, i) => [r.player.id, scores[i]]));
	return rows.map((r) => {
		const keepScore = r.eligible ? scoreMap.get(r.player.id) ?? 0 : 0;
		return {
			player: r.player,
			sticker: r.sticker,
			assigned: r.sticker,
			surplus: r.surplus,
			adjVor: r.player.adjVor,
			keepScore,
			label: r.eligible ? keepLabel(keepScore) : "Cut",
			eligible: r.eligible,
			reason: r.reason
		};
	}).sort((a, b) => b.keepScore - a.keepScore || b.surplus - a.surplus);
}
function ineligibleWhy(id) {
	if (USER_INELIGIBLE_IDS.includes(id)) {
		if (id === "drake-maye" || id === "jaxon-smith-njigba") return "Previously kept (K list). Cannot keep again.";
		return "Drafted in rounds 1–4. Cannot keep.";
	}
	return "League-wide ineligible (previously kept).";
}
function applySelection(evals, selectedIds) {
	const assigned = assignCosts(evals.filter((e) => selectedIds.includes(e.player.id)).map((e) => ({
		id: e.player.id,
		sticker: e.sticker
	})));
	const map = new Map(assigned.map((a) => [a.id, a.assigned]));
	return evals.map((e) => {
		if (!e.eligible) return e;
		const next = map.get(e.player.id);
		if (next == null) return {
			...e,
			assigned: e.sticker,
			surplus: surplusOf(e.player, e.sticker)
		};
		return {
			...e,
			assigned: next,
			surplus: surplusOf(e.player, next)
		};
	});
}
function balanceBonus(a, b, assigned) {
	let n = 0;
	const pos = /* @__PURE__ */ new Set([a.pos, b.pos]);
	const scarce = pos.has("TE") || pos.has("QB");
	const volume = a.pos === "WR" || a.pos === "RB" || b.pos === "WR" || b.pos === "RB";
	if (scarce && volume) n += 4;
	if (assigned.every((r) => r >= 4)) n += 2;
	if (!assigned.includes(4) || !assigned.includes(5)) n += 2;
	return Math.min(8, n);
}
function correlationPenalty(a, b) {
	let n = 0;
	if (a.nflTeam === b.nflTeam) n += 3;
	const volatile = (p) => p.confidence < .75 || p.status === "Q" || p.status === "IR";
	if (volatile(a) && volatile(b)) n += 3;
	return Math.min(6, n);
}
function legalPair(a, b) {
	if (a.player.id === b.player.id) return {
		ok: false,
		why: "Need two different players."
	};
	if (!a.eligible || !b.eligible) return {
		ok: false,
		why: "One of these names is ineligible."
	};
	if (a.player.pos === b.player.pos) return {
		ok: false,
		why: `Keepers cannot be the same position (${a.player.pos}).`
	};
	return {
		ok: true,
		why: ""
	};
}
function rankPairs(evals) {
	const eligible = evals.filter((e) => e.eligible);
	const pairs = [];
	for (let i = 0; i < eligible.length; i++) for (let j = i + 1; j < eligible.length; j++) {
		const a0 = eligible[i];
		const b0 = eligible[j];
		if (!legalPair(a0, b0).ok) continue;
		const costs = assignCosts([{
			id: a0.player.id,
			sticker: a0.sticker
		}, {
			id: b0.player.id,
			sticker: b0.sticker
		}]);
		const assignedA = costs.find((c) => c.id === a0.player.id).assigned;
		const assignedB = costs.find((c) => c.id === b0.player.id).assigned;
		const a = {
			...a0,
			assigned: assignedA,
			surplus: surplusOf(a0.player, assignedA)
		};
		const b = {
			...b0,
			assigned: assignedB,
			surplus: surplusOf(b0.player, assignedB)
		};
		const scores = scoreKeepers([
			{
				player: a.player,
				surplus: a.surplus
			},
			{
				player: b.player,
				surplus: b.surplus
			},
			...eligible.filter((e) => e.player.id !== a.player.id && e.player.id !== b.player.id).map((e) => ({
				player: e.player,
				surplus: e.surplus
			}))
		]);
		a.keepScore = scores[0];
		b.keepScore = scores[1];
		a.label = keepLabel(a.keepScore);
		b.label = keepLabel(b.keepScore);
		const assigned = [assignedA, assignedB];
		const balance = balanceBonus(a.player, b.player, assigned);
		const corr = correlationPenalty(a.player, b.player);
		const dstTax = a.player.pos === "DST" || b.player.pos === "DST" ? 18 : 0;
		const pairScore = round1(a.keepScore + b.keepScore + balance - corr - dstTax);
		const why = `${a.player.name} costs R${assignedA}${assignedA !== a.sticker ? ` (sticker R${a.sticker})` : ""}; ${b.player.name} costs R${assignedB}${assignedB !== b.sticker ? ` (sticker R${b.sticker})` : ""}.`;
		pairs.push({
			a,
			b,
			pairScore,
			balance,
			correlation: corr,
			assigned,
			why
		});
	}
	const ranked = pairs.sort((x, y) => y.pairScore - x.pairScore);
	const defSet = new Set(DEFAULT_KEEPER_IDS);
	const def = ranked.find((p) => defSet.has(p.a.player.id) && defSet.has(p.b.player.id));
	const rest = ranked.filter((p) => p !== def);
	return (def ? [def, ...rest] : rest).slice(0, 5);
}
function copyToLm(teamName, pair) {
	return `${teamName} keepers: ${pair.a.player.name} (${pair.a.player.pos}) Round ${pair.a.assigned}${pair.a.assigned !== pair.a.sticker ? ` — sticker R${pair.a.sticker}, collision` : ""}; ${pair.b.player.name} (${pair.b.player.pos}) Round ${pair.b.assigned}${pair.b.assigned !== pair.b.sticker ? ` — sticker R${pair.b.sticker}, collision` : ""}.`;
}
function allKeptIds(league) {
	return league.teams.flatMap((t) => t.keepers);
}
function buildLeagueKeepers(league, players) {
	const scoredRows = [];
	for (const team of league.teams) for (const id of team.keepers) {
		const round = team.keeperCost[id];
		const player = players.get(id);
		if (round == null || !player) continue;
		scoredRows.push({
			key: `${team.id}:${id}`,
			player,
			surplus: surplusOf(player, round)
		});
	}
	const scores = scoreKeepers(scoredRows.map((r) => ({
		player: r.player,
		surplus: r.surplus
	})));
	const scoreById = new Map(scoredRows.map((r, i) => [r.key, scores[i]]));
	const byTeam = league.teams.map((team) => {
		const slot = team.draftSlot || team.id;
		const teamSeats = team.keepers.map((id) => {
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
				labelGrade: keepLabel(keepScore)
			};
		}).filter((s) => Boolean(s));
		return {
			team,
			seats: teamSeats,
			empty: Math.max(0, 2 - teamSeats.length),
			totalSurplus: round1(teamSeats.reduce((s, seat) => s + seat.surplus, 0))
		};
	});
	const you = byTeam.filter((t) => t.team.isYou);
	const rest = byTeam.filter((t) => !t.team.isYou).sort((a, b) => a.team.draftSlot - b.team.draftSlot);
	return [...you, ...rest];
}
function thrownBack(team, keptIds, players) {
	return team.roster.filter((id) => !keptIds.includes(id)).map((id) => players.get(id)).filter((p) => Boolean(p)).sort((a, b) => a.adp10 - b.adp10);
}
var FLEX = /* @__PURE__ */ new Set([
	"RB",
	"WR",
	"TE"
]);
var OP = /* @__PURE__ */ new Set([
	"QB",
	"RB",
	"WR",
	"TE"
]);
function modeScore(p, mode) {
	if (p.trail === "none") return -999;
	if (p.status === "O" || p.status === "IR" || p.status === "Bye" || p.status === "SSPD") return -999;
	if (mode === "favorite") return p.weekly.p20;
	if (mode === "underdog") return p.weekly.p80;
	return p.weekly.ePts;
}
function inferMode(myProj, oppProj, win, record) {
	const p = win ?? (myProj - oppProj >= 8 ? .7 : oppProj - myProj >= 8 ? .3 : .5);
	if (p >= .65) return "favorite";
	if (p <= .35) return "underdog";
	if (record && record.w + record.l > 0 && record.w / (record.w + record.l) < .5) return "underdog";
	return "tossup";
}
function drawRange(rng, p20, p50, p80) {
	const pick = rng();
	if (pick < 1 / 3) return p20;
	if (pick < 2 / 3) return p50;
	return p80;
}
function slateWinProb(mine, opp) {
	let seed = 20261004;
	const rng = () => {
		seed = (seed * 1664525 + 1013904223) % 4294967296;
		return seed / 4294967296;
	};
	const my = mine.starters.map((s) => s.player).filter((p) => Boolean(p));
	const their = opp.starters.map((s) => s.player).filter((p) => Boolean(p));
	let wins = 0;
	const n = 2e3;
	for (let i = 0; i < n; i++) {
		const qb = my.find((p) => p.pos === "QB");
		const qbDraw = qb ? drawRange(rng, qb.weekly.p20, qb.weekly.p50, qb.weekly.p80) : 0;
		const qbMean = qb ? qb.weekly.ePts : 0;
		let myScore = 0;
		for (const p of my) {
			let draw = p === qb ? qbDraw : drawRange(rng, p.weekly.p20, p.weekly.p50, p.weekly.p80);
			if (qb && p !== qb && p.nflTeam === qb.nflTeam && (p.pos === "WR" || p.pos === "TE")) draw += .25 * (qbDraw - qbMean) * (p.weekly.p80 - p.weekly.p20) / Math.max(4, qb.weekly.p80 - qb.weekly.p20);
			myScore += draw;
		}
		let oppScore = 0;
		for (const p of their) oppScore += drawRange(rng, p.weekly.p20, p.weekly.p50, p.weekly.p80);
		if (myScore > oppScore) wins += 1;
	}
	return wins / n;
}
function optimalLineup(roster, irIds, mode) {
	const irSet = new Set(irIds);
	const ir = roster.filter((p) => irSet.has(p.id) || p.status === "IR");
	const available = roster.filter((p) => !irSet.has(p.id) && p.status !== "IR").sort((a, b) => modeScore(b, mode) - modeScore(a, mode));
	const used = /* @__PURE__ */ new Set();
	const starters = [];
	const take = (pred) => {
		const player = available.find((p) => !used.has(p.id) && pred(p) && modeScore(p, mode) > -900) ?? null;
		if (player) used.add(player.id);
		return player;
	};
	for (let i = 0; i < STARTERS.qb; i++) starters.push({
		slot: "QB",
		player: take((p) => p.pos === "QB")
	});
	for (let i = 0; i < STARTERS.rb; i++) starters.push({
		slot: "RB",
		player: take((p) => p.pos === "RB")
	});
	for (let i = 0; i < STARTERS.wr; i++) starters.push({
		slot: "WR",
		player: take((p) => p.pos === "WR")
	});
	for (let i = 0; i < STARTERS.te; i++) starters.push({
		slot: "TE",
		player: take((p) => p.pos === "TE")
	});
	for (let i = 0; i < STARTERS.flex; i++) starters.push({
		slot: "FLEX",
		player: take((p) => FLEX.has(p.pos))
	});
	for (let i = 0; i < STARTERS.op; i++) starters.push({
		slot: "OP",
		player: take((p) => OP.has(p.pos))
	});
	for (let i = 0; i < STARTERS.dst; i++) starters.push({
		slot: "DST",
		player: take((p) => p.pos === "DST")
	});
	const bench = available.filter((p) => !used.has(p.id));
	const projected = starters.reduce((s, seat) => s + (seat.player?.weekly.ePts ?? 0), 0);
	const p20 = starters.reduce((s, seat) => s + (seat.player?.weekly.p20 ?? 0), 0);
	const p80 = starters.reduce((s, seat) => s + (seat.player?.weekly.p80 ?? 0), 0);
	const twoQb = starters.filter((s) => s.player?.pos === "QB").length >= 2;
	const debates = [];
	const seen = /* @__PURE__ */ new Set();
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
		const delta = round1(modeScore(seat.player, mode) - modeScore(rival, mode));
		if (Math.abs(delta) <= 2.8) {
			seen.add(key);
			debates.push({
				starter: seat.player,
				bench: rival,
				delta,
				confidence: Math.abs(delta) < 1.5 ? "Coin-flip" : "Med"
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
		twoQb
	};
}
function teamPlayers(team, players) {
	return [...team.roster, ...team.ir].map((id) => players.get(id)).filter((p) => Boolean(p));
}
function winProb(my, opp, mySpread, oppSpread) {
	const z = (my - opp) / Math.sqrt(Math.max(8, (mySpread ** 2 + oppSpread ** 2) / 2));
	return 1 / (1 + Math.exp(-1.7 * z));
}
var FREEZE_ROWS = [{
	"id": "1014874-w4-sun",
	"leagueId": "1014874",
	"week": 4,
	"slot": "sun",
	"at": "2026-10-04T07:53:52.536Z",
	"weightVersion": "2026.10.0"
}, {
	"id": "210326445-w4-sun",
	"leagueId": "210326445",
	"week": 4,
	"slot": "sun",
	"at": "2026-10-04T07:53:52.536Z",
	"weightVersion": "2026.10.0"
}];
function newestFreeze(leagueId, week) {
	return FREEZE_ROWS.filter((row) => row.leagueId === leagueId && row.week === week).sort((a, b) => a.at < b.at ? 1 : -1)[0] ?? null;
}
function freezeChip(leagueId, week) {
	const freeze = newestFreeze(leagueId, week);
	if (!freeze) return null;
	const time = new Date(freeze.at).toLocaleTimeString("en-US", {
		hour: "numeric",
		minute: "2-digit",
		timeZone: "America/New_York"
	});
	return {
		label: `${freeze.slot === "thu" ? "Thu" : freeze.slot === "sun" ? "Sun" : "Inactives"} freeze · ${time}`,
		stale: false,
		id: freeze.id
	};
}
var FITS = {
	QB: (p) => p.pos === "QB",
	RB: (p) => p.pos === "RB",
	WR: (p) => p.pos === "WR",
	TE: (p) => p.pos === "TE",
	FLEX: (p) => p.pos === "RB" || p.pos === "WR" || p.pos === "TE",
	OP: (p) => p.pos !== "DST",
	DST: (p) => p.pos === "DST"
};
function lineupMoves(me, lineup, map) {
	const espn = (me.slots ?? []).filter((s) => s.slot !== "BE" && s.slot !== "IR");
	if (!espn.length) return lineup.debates.slice(0, 3).map((d) => ({
		slot: d.starter.pos,
		start: d.starter,
		sit: d.bench,
		delta: d.delta
	}));
	const modelIds = new Set(lineup.starters.map((s) => s.player?.id).filter((id) => Boolean(id)));
	const espnIds = new Set(espn.map((s) => s.id));
	const used = /* @__PURE__ */ new Set();
	const moves = [];
	for (const seat of lineup.starters) {
		const start = seat.player;
		if (!start || espnIds.has(start.id)) continue;
		const sitSlot = espn.find((s) => !modelIds.has(s.id) && !used.has(s.id) && (FITS[s.slot]?.(start) ?? FITS[seat.slot]?.(map.get(s.id) ?? start)));
		const sit = sitSlot ? map.get(sitSlot.id) ?? null : null;
		if (sitSlot) used.add(sitSlot.id);
		const delta = round1(start.weekly.ePts - (sit?.weekly.ePts ?? 0));
		if (sit && delta < 1.5) continue;
		moves.push({
			slot: seat.slot,
			start,
			sit,
			delta
		});
	}
	return moves.sort((a, b) => b.delta - a.delta).slice(0, 4);
}
function espnPoints(me, map) {
	const starters = (me.slots ?? []).filter((s) => s.slot !== "BE" && s.slot !== "IR");
	if (!starters.length) return null;
	return round1(starters.reduce((sum, slot) => sum + (map.get(slot.id)?.weekly.ePts ?? 0), 0));
}
function matchupWin(my, opp, myRange, oppRange) {
	return winProb(my, opp, Math.max(6, myRange), Math.max(6, oppRange));
}
function rangeOf(lineup) {
	return Math.max(6, (lineup.p80 - lineup.p20) / 2);
}
var EMPTY_OFF = {
	py: 0,
	pc: 0,
	inc: 0,
	ptd: 0,
	ptd50: 0,
	pfd: 0,
	int: 0,
	p2: 0,
	p300: 0,
	p400: 0,
	sk: 0,
	ry: 0,
	ra: 0,
	rtd: 0,
	rtd50: 0,
	rfd: 0,
	r2: 0,
	ry100: 0,
	ry200: 0,
	rey: 0,
	rec: 0,
	retd: 0,
	retd50: 0,
	refd: 0,
	rec2: 0,
	rey100: 0,
	rey200: 0,
	ret: 0,
	fuml: 0
};
function scoreOffense(s) {
	return s.py * .05 + s.pc * .1 + s.inc * -.1 + s.ptd * 4 + s.ptd50 * 3 + s.pfd * .5 + s.int * -2 + s.p2 * 2 + s.p300 * 2 + s.p400 * 4 + s.sk * -1 + s.ry * .1 + s.ra * .1 + s.rtd * 6 + s.rtd50 * 3 + s.rfd * 1 + s.r2 * 2 + s.ry100 * 2 + s.ry200 * 4 + s.rey * .1 + s.rec * 1 + s.retd * 6 + s.retd50 * 3 + s.refd * 1 + s.rec2 * 2 + s.rey100 * 2 + s.rey200 * 4 + s.ret * .2 + s.fuml * -2;
}
function paPts(pa) {
	if (pa <= 0) return 5;
	if (pa <= 6) return 4;
	if (pa <= 13) return 3;
	if (pa <= 17) return 1;
	if (pa <= 27) return 0;
	if (pa <= 34) return -1;
	if (pa <= 45) return -3;
	return -5;
}
function yaPts(ya) {
	if (ya <= 99) return 5;
	if (ya <= 199) return 3;
	if (ya <= 299) return 2;
	if (ya <= 349) return 0;
	if (ya <= 399) return -1;
	if (ya <= 449) return -3;
	if (ya <= 499) return -5;
	if (ya <= 549) return -6;
	return -7;
}
function scoreDst(s) {
	const win = s.tw;
	const loss = 1 - s.tw;
	return s.sack * 2 + s.int * 2 + s.fr * 2 + s.ff * 1 + s.safety * 2 + s.td * 6 + s.block * 3 + win * 1 + loss * -1 + paPts(s.pa) + yaPts(s.ya);
}
function bonusProb(mean, threshold, spread) {
	if (mean <= 0) return 0;
	const z = (threshold - mean) / Math.max(12, spread);
	const p = 1 / (1 + Math.exp(z * 1.7));
	return clamp(p, 0, .85);
}
var POS_MEAN = {
	ypc: 4.2,
	yptWr: 8.1,
	yptTe: 7.2,
	yptRb: 6.4,
	tdRush: .04,
	tdRec: .055,
	cmp: .645,
	sack: .065,
	fdRush: .22,
	fdRec: .6
};
function regress(value, mean, toward) {
	return (1 - toward) * value + toward * mean;
}
function projectOffense(input) {
	const s = { ...EMPTY_OFF };
	const snap = clamp(input.snap, 0, 1.2);
	if (snap <= 0) return s;
	const toward = input.efficiencyRegress;
	let passAttempts = input.attempts ?? input.plays * input.passRate * input.qbShare;
	let cmp = input.cmp;
	if (input.wind != null && input.wind >= 20) {
		passAttempts *= 1 - input.windPassCut;
		cmp -= .02;
	}
	if (input.rain) cmp -= .01;
	cmp = clamp(cmp, .45, .78);
	const carries = input.plays * input.rushRate * input.carryShare * (input.pos === "QB" ? 1 : snap);
	const targets = passAttempts * input.targetShare * (input.pos === "QB" ? 0 : snap);
	if (input.pos === "QB") {
		const att = passAttempts * snap;
		const cmpRate = regress(cmp, POS_MEAN.cmp, toward);
		const sackRate = regress(input.sackRate, POS_MEAN.sack, toward);
		s.pc = att * cmpRate;
		s.inc = att * (1 - cmpRate);
		s.py = s.pc * regress(input.ypt, 7.4, toward);
		s.ptd = att * regress(input.tdPerTarget, .048, toward);
		const air = input.airYpt == null ? 1 : clamp(input.airYpt / 7.5, .5, 1.8);
		s.ptd50 = s.ptd * (.08 * air * (input.wind != null && input.wind >= 20 ? .7 : 1));
		s.pfd = s.pc * .38;
		s.int = att * .022;
		s.sk = att * sackRate;
		s.ry = carries * regress(input.ypc, POS_MEAN.ypc, toward);
		s.ra = carries;
		s.rtd = carries * regress(input.tdPerRush, POS_MEAN.tdRush, toward);
		s.rtd50 = s.rtd * .08;
		s.rfd = s.ra * POS_MEAN.fdRush;
		s.p300 = bonusProb(s.py, 300, 55);
		s.p400 = bonusProb(s.py, 400, 55);
		s.fuml = .12 * (input.rain ? 1.25 : 1);
	} else if (input.pos === "RB") {
		const ypc = regress(input.ypc, POS_MEAN.ypc, toward);
		s.ra = carries;
		s.ry = carries * ypc;
		s.rtd = carries * regress(input.tdPerRush, POS_MEAN.tdRush, toward);
		s.rtd50 = s.rtd * .07;
		s.rfd = s.ra * regress(POS_MEAN.fdRush, POS_MEAN.fdRush, toward);
		const catchRate = .74;
		s.ret = targets;
		s.rec = targets * catchRate;
		s.rey = s.rec * regress(input.ypt, POS_MEAN.yptRb, toward);
		s.retd = targets * regress(input.tdPerTarget, .03, toward);
		s.refd = targets * regress(.48, POS_MEAN.fdRec, toward);
		s.ry100 = bonusProb(s.ry, 100, 38);
		s.ry200 = bonusProb(s.ry, 200, 38);
		s.rey100 = bonusProb(s.rey, 100, 30);
		s.fuml = .14 * (input.rain ? 1.25 : 1);
	} else {
		const meanYpt = input.pos === "TE" ? POS_MEAN.yptTe : POS_MEAN.yptWr;
		const catchRate = input.pos === "TE" ? .7 : .64;
		s.ret = targets;
		s.rec = targets * catchRate;
		s.rey = s.rec * regress(input.ypt, meanYpt, toward);
		s.retd = targets * regress(input.tdPerTarget, input.pos === "TE" ? .05 : .045, toward);
		const air = input.airYpt == null ? 1 : clamp(input.airYpt / (input.pos === "TE" ? 7 : 11), .5, 1.8);
		s.retd50 = s.retd * (.1 + input.explosive * .08) * air * (input.wind != null && input.wind >= 20 ? .7 : 1);
		s.refd = targets * regress(input.pos === "TE" ? .58 : .62, POS_MEAN.fdRec, toward);
		s.rey100 = bonusProb(s.rey, 100, 32);
		s.rey200 = bonusProb(s.rey, 200, 32);
		s.fuml = .06 * (input.rain ? 1.25 : 1);
	}
	return s;
}
function projectDst(input) {
	const pressure = clamp((24 - input.impliedOpp) / 16, 0, 1);
	const pace = input.oppPace / 64;
	return {
		sack: (1.6 + pressure * 1.6) * pace,
		int: (.45 + input.oppTurnoverRate) * pace,
		fr: .35 + pressure * .25,
		ff: .5 + pressure * .35,
		safety: .03 + pressure * .03,
		td: .06 + pressure * .08,
		block: .04,
		tw: clamp(.5 - input.spread / 14, .18, .82),
		pa: input.impliedOpp,
		ya: 280 + input.impliedOpp * 4.2
	};
}
function expectedPoints(p20, p50, p80) {
	return .25 * p20 + .5 * p50 + .25 * p80;
}
function rangeFromP50(p50, consistency, upside) {
	const floorRatio = .46 + consistency / 250;
	const ceilRatio = 1.18 + upside / 280;
	const p20 = Math.max(0, p50 * floorRatio);
	const p80 = p50 * ceilRatio;
	return {
		p20: round1(p20),
		p50: round1(p50),
		p80: round1(p80),
		ePts: round1(expectedPoints(p20, p50, p80))
	};
}
function adp10From12(adp12) {
	return 1 + (adp12 - 1) * (10 / 12);
}
function availabilityFrom(input, weights) {
	const status = input.status ?? "Active";
	const out = Boolean(input.bye || input.inactive || status === "O" || status === "IR" || status === "SSPD");
	let snapMult = 1;
	let fact = "Active.";
	if (out) {
		snapMult = 0;
		fact = input.bye ? "Bye." : input.inactive ? "Inactive." : `${status}.`;
	} else if (status === "Q" && input.practice === "DNP") {
		snapMult = weights.qDnpSnap;
		fact = "Questionable, Friday DNP.";
	} else if (status === "Q" && input.practice === "FULL") fact = "Questionable, Friday full practice.";
	else if (status === "Q" || status === "D") {
		snapMult = status === "D" ? .8 : .9;
		fact = `${status}.`;
	}
	if (input.teammateOut && !out) fact = `${fact} Teammate out, usage rebuilt.`;
	if (input.backupQb && !out) fact = `${fact} Backup quarterback.`;
	return {
		snapMult,
		practice: input.practice ?? null,
		out,
		teammateOut: Boolean(input.teammateOut),
		backupQb: Boolean(input.backupQb),
		fact
	};
}
function impliedPoints(total, spread) {
	return total / 2 - spread / 2;
}
function environmentFrom(input, weights) {
	const stale = input.spread == null || input.total == null;
	const pace = input.pace ?? 63;
	const spread = input.spread ?? 0;
	let passRate = .57;
	const rushRate = .43;
	if (!stale && spread >= 7) passRate += weights.scriptPassBump;
	if (!stale && spread <= -7) passRate -= weights.scriptPassBump;
	passRate = Math.min(.72, Math.max(.45, passRate));
	return {
		spread: input.spread,
		total: input.total,
		implied: input.total == null ? null : impliedPoints(input.total, spread),
		pace,
		passRate,
		rushRate: 1 - passRate || rushRate,
		wind: input.dome ? 0 : input.wind ?? null,
		rain: input.dome ? false : Boolean(input.rain),
		dome: Boolean(input.dome),
		stale
	};
}
function blendShare(last3, season, games, weights) {
	if (games < 3 || last3 == null) return season;
	return weights.usageLast3 * last3 + weights.usageSeason * season;
}
function sharesFromRaw(input) {
	const games = input.games ?? (input.last3Target == null && input.last3Carry == null ? 0 : 3);
	const snap = Math.min(.95, Math.max(.2, input.usage / 100));
	const seasonTarget = input.pos === "QB" ? 0 : Math.min(.35, Math.max(.04, input.rec / 17 / 34));
	const seasonCarry = input.pos === "RB" ? snap * .62 : input.pos === "QB" ? .12 : .02;
	return {
		games,
		snap,
		targetShare: seasonTarget,
		carryShare: seasonCarry,
		routeShare: input.pos === "WR" || input.pos === "TE" ? snap * .9 : snap * .4,
		rzShare: snap * .5,
		last3TargetShare: input.last3Target ?? null,
		seasonTargetShare: seasonTarget,
		last3CarryShare: input.last3Carry ?? null,
		seasonCarryShare: seasonCarry
	};
}
function applyWeights(shares, weights) {
	return {
		...shares,
		targetShare: blendShare(shares.last3TargetShare, shares.seasonTargetShare, shares.games, weights),
		carryShare: blendShare(shares.last3CarryShare, shares.seasonCarryShare, shares.games, weights)
	};
}
function featuresFor(input) {
	const usage = applyWeights(sharesFromRaw({
		pos: input.pos,
		usage: input.usage,
		rec: input.rec,
		games: input.games,
		last3Target: input.last3Target
	}), input.weights);
	const env = environmentFrom({
		spread: input.spread ?? null,
		total: input.total ?? null,
		pace: input.pace ?? null,
		wind: input.wind,
		rain: input.rain,
		dome: input.dome
	}, input.weights);
	const availability = availabilityFrom({
		status: input.status,
		bye: input.bye,
		inactive: input.inactive,
		practice: input.practice,
		teammateOut: input.teammateOut,
		backupQb: input.backupQb
	}, input.weights);
	if (input.teammateOut && input.pos !== "QB") usage.targetShare = Math.min(.4, usage.targetShare + .04);
	const snapCut = input.pos === "RB" && usage.snap < .58 ? .9 : 1;
	usage.snap *= availability.snapMult * snapCut;
	return {
		usage,
		env,
		availability,
		shadow: {
			corner: 0,
			stack: 0,
			home: input.home ? 1 : 0,
			shortWeek: 0,
			ageFlag: input.pos === "RB" && input.age >= 29 || input.pos === "WR" && input.age >= 32 ? 1 : 0,
			rookie: input.rook ? 1 : 0,
			rzExtra: 0,
			oppPace: env.pace,
			narrative: 0,
			ecr: input.adp12,
			owned: 0,
			fpoe: 0
		},
		stale: env.stale || input.wind == null
	};
}
function reasonLine(features) {
	const body = `${Math.round(features.usage.targetShare * 100)}% targets over the last 3. Team total ${features.env.total == null ? "n/a" : features.env.total.toFixed(1)}. ${features.availability.fact}`;
	return features.stale ? `STALE. ${body}` : body;
}
var DEFAULT_WEIGHTS = {
	version: "2026.10.0",
	usageLast3: .6,
	usageSeason: .4,
	scriptPassBump: .08,
	opponentScale: .35,
	windPassCut: .08,
	qDnpSnap: .55,
	efficiencyRegress: .5,
	floorRatio: .72,
	ceilRatio: 1.42,
	frozen: {}
};
function getWeights() {
	return STORED_WEIGHTS;
}
function sketchFor(pos, features, weights) {
	const snap = features.availability.out ? 0 : features.usage.snap;
	const ypt = pos === "TE" ? 7.2 : pos === "RB" ? 6.4 : pos === "QB" ? 7.3 : 8.4;
	return {
		pos,
		plays: features.env.pace,
		passRate: features.env.passRate,
		rushRate: features.env.rushRate,
		qbShare: pos === "QB" ? .98 : 1,
		carryShare: pos === "QB" ? .08 : features.usage.carryShare,
		targetShare: pos === "QB" ? 0 : features.usage.targetShare * (features.availability.backupQb ? .92 : 1),
		snap,
		ypc: pos === "QB" ? 5.2 : 4.3,
		ypt: features.availability.backupQb && pos !== "QB" ? ypt * .92 : ypt,
		tdPerRush: .045,
		tdPerTarget: features.availability.backupQb && pos !== "QB" ? .035 : .05,
		cmp: .65,
		sackRate: .07,
		explosive: features.usage.targetShare > .2 ? .2 : .08,
		wind: features.env.wind,
		rain: features.env.rain,
		windPassCut: weights.windPassCut,
		efficiencyRegress: weights.efficiencyRegress
	};
}
function projectFeatures(pos, features, weights = DEFAULT_WEIGHTS) {
	if (pos === "DST") {
		const stats = projectDst({
			impliedOpp: features.env.implied ?? 22.5,
			oppPace: features.env.pace,
			oppTurnoverRate: .12,
			spread: features.env.spread ?? 0
		});
		const p50 = scoreDst(stats);
		const range = rangeFromP50(p50, 60, 50);
		return {
			stats,
			range: {
				...range,
				ePts: expectedPoints(range.p20, range.p50, range.p80)
			},
			source: "counting",
			stale: features.stale,
			reason: reasonLine(features),
			features,
			points: p50
		};
	}
	const stats = projectOffense(sketchFor(pos, features, weights));
	const p50 = scoreOffense(stats);
	return {
		stats,
		range: rangeFromP50(Math.max(0, p50), 62, 58),
		source: p50 > 0 || features.availability.out ? "counting" : "converted",
		stale: features.stale,
		reason: reasonLine(features),
		features,
		points: p50
	};
}
function projectFromRaw(player, week, weights = getWeights(), extra) {
	const features = featuresFor({
		pos: player.pos,
		usage: player.usage,
		rec: player.rec,
		age: player.age,
		rook: player.rook,
		home: player.home,
		adp12: player.adp12,
		status: player.status,
		bye: player.bye === week,
		weights,
		games: extra?.games,
		last3Target: extra?.last3Target ?? null
	});
	return projectFeatures(player.pos, features, weights);
}
var GATE_REPLAY = {
	source: "nflverse",
	origin: "job",
	season: 2025,
	locked: true,
	challenger: null,
	beatsB0: .154,
	beatsB1: .273,
	singleWeekOwns: false,
	singlePlayerOwns: false,
	rows: [],
	heldOut: {
		weeks: "even 4-18",
		rows: 2076,
		b0: 6.193,
		b1: 6.312,
		b2: 6.039,
		b3: 5.984
	},
	note: "2025 player-week stats, schedules, and play-by-play were fetched. Held-out even weeks, 2,076 rows. B2 beat B0 by 0.154 and B1 by 0.273. B3 beat B0 by 0.209. The bar is 0.25 over both, so the card stays shut. usageLast3 stayed 0.60, chosen before this file was scored. Red-zone carries are null. The 50-yard touchdown split is not in the week file, so that bonus is 0."
};
function cardUsesBrain(record = GATE_REPLAY) {
	if (!record.locked || record.season !== 2025) return false;
	if (record.challenger !== "B2" && record.challenger !== "B3") return false;
	if ((record.beatsB0 ?? 0) < .25) return false;
	if (record.singleWeekOwns || record.singlePlayerOwns) return false;
	return true;
}
var TRAILS = {
	"jahmyr-gibbs": {
		"gsis": "00-0039139",
		"points": [
			54.5,
			33.5,
			56
		],
		"reason": "joined"
	},
	"bijan-robinson": {
		"gsis": "00-0038542",
		"points": [
			44.4,
			15.5,
			52.6
		],
		"reason": "joined"
	},
	"jamarr-chase": {
		"gsis": "00-0036900",
		"points": [
			5,
			31.3,
			33.2
		],
		"reason": "joined"
	},
	"puka-nacua": {
		"gsis": "00-0039075",
		"points": [16.2],
		"reason": "joined"
	},
	"jaxon-smith-njigba": {
		"gsis": "00-0038543",
		"points": [
			35.4,
			54.7,
			49.9
		],
		"reason": "joined"
	},
	"christian-mccaffrey": {
		"gsis": "00-0033280",
		"points": [
			18.4,
			30.4,
			31.1
		],
		"reason": "joined"
	},
	"amon-ra-st-brown": {
		"gsis": "00-0036963",
		"points": [
			35.5,
			46.8,
			15.5
		],
		"reason": "joined"
	},
	"jonathan-taylor": {
		"gsis": "00-0036223",
		"points": [
			34.8,
			41.4,
			15.1
		],
		"reason": "joined"
	},
	"ceedee-lamb": {
		"gsis": "00-0036358",
		"points": [
			22.1,
			46.1,
			28.8
		],
		"reason": "joined"
	},
	"ashton-jeanty": {
		"gsis": "00-0040122",
		"points": [
			47.2,
			14.8,
			17.8
		],
		"reason": "joined"
	},
	"justin-jefferson": {
		"gsis": "00-0036322",
		"points": [
			38,
			11.7,
			6.6
		],
		"reason": "joined"
	},
	"james-cook": {
		"gsis": "00-0037248",
		"points": [
			17,
			32.6,
			32
		],
		"reason": "joined"
	},
	"devon-achane": {
		"gsis": "00-0039040",
		"points": [
			15.7,
			18.5,
			3.2
		],
		"reason": "joined"
	},
	"omarion-hampton": {
		"gsis": "00-0040666",
		"points": [
			14.5,
			27.2,
			9.3
		],
		"reason": "joined"
	},
	"saquon-barkley": {
		"gsis": "00-0034844",
		"points": [
			12.9,
			4.8,
			14.9
		],
		"reason": "joined"
	},
	"chase-brown": {
		"gsis": "00-0038597",
		"points": [
			25.6,
			17.2,
			14.6
		],
		"reason": "joined"
	},
	"brock-bowers": {
		"gsis": "00-0039338",
		"points": [39.2],
		"reason": "joined"
	},
	"drake-london": {
		"gsis": "00-0037238",
		"points": [
			7.4,
			14,
			37.4
		],
		"reason": "joined"
	},
	"kenneth-walker-iii": {
		"gsis": "00-0038134",
		"points": [
			49.6,
			39.2,
			28.5
		],
		"reason": "joined"
	},
	"aj-brown": {
		"gsis": "00-0035676",
		"points": [8.4],
		"reason": "joined"
	},
	"derrick-henry": {
		"gsis": "00-0032764",
		"points": [
			47.9,
			25.9,
			28.7
		],
		"reason": "joined"
	},
	"nico-collins": {
		"gsis": "00-0036554",
		"points": [27.3],
		"reason": "joined"
	},
	"trey-mcbride": {
		"gsis": "00-0037744",
		"points": [
			33.1,
			23.1,
			21.7
		],
		"reason": "joined"
	},
	"jeremiyah-love": {
		"gsis": "00-0041027",
		"points": [
			16.9,
			10,
			30
		],
		"reason": "joined"
	},
	"george-pickens": {
		"gsis": "00-0037247",
		"points": [
			9,
			15.6,
			21.4
		],
		"reason": "joined"
	},
	"rashee-rice": {
		"gsis": "00-0039067",
		"points": [
			11.3,
			16.5,
			19.6
		],
		"reason": "joined"
	},
	"devonta-smith": {
		"gsis": "00-0036912",
		"points": [
			10.5,
			39.3,
			16.1
		],
		"reason": "joined"
	},
	"chris-olave": {
		"gsis": "00-0037239",
		"points": [
			39.8,
			30.6,
			31.3
		],
		"reason": "joined"
	},
	"josh-allen": {
		"gsis": "00-0034857",
		"points": [
			49.2,
			58.6,
			25.1
		],
		"reason": "joined"
	},
	"breece-hall": {
		"gsis": "00-0038120",
		"points": [
			31.4,
			20.8,
			15.4
		],
		"reason": "joined"
	},
	"kyren-williams": {
		"gsis": "00-0037840",
		"points": [
			21.2,
			21.3,
			32.7
		],
		"reason": "joined"
	},
	"zay-flowers": {
		"gsis": "00-0039064",
		"points": [34.2, 22.7],
		"reason": "joined"
	},
	"javonte-williams": {
		"gsis": "00-0036997",
		"points": [
			30.4,
			10,
			28.8
		],
		"reason": "joined"
	},
	"josh-jacobs": {
		"gsis": null,
		"points": [],
		"reason": "NO TRAIL. No 2026 skill row. Off the start list."
	},
	"travis-etienne-jr": {
		"gsis": "00-0036973",
		"points": [
			21.5,
			9.3,
			15.7
		],
		"reason": "joined"
	},
	"tee-higgins": {
		"gsis": "00-0036410",
		"points": [
			13.1,
			21.5,
			26.4
		],
		"reason": "joined"
	},
	"tetairoa-mcmillan": {
		"gsis": "00-0040124",
		"points": [
			16.1,
			23.1,
			5.7
		],
		"reason": "joined"
	},
	"malik-nabers": {
		"gsis": "00-0039337",
		"points": [
			17.7,
			1.9,
			10.8
		],
		"reason": "joined"
	},
	"emeka-egbuka": {
		"gsis": "00-0040129",
		"points": [
			15.5,
			12.4,
			15
		],
		"reason": "joined"
	},
	"colston-loveland": {
		"gsis": "00-0040126",
		"points": [
			.4,
			1.9,
			10.9
		],
		"reason": "joined"
	},
	"ladd-mcconkey": {
		"gsis": "00-0039915",
		"points": [
			25.6,
			9.1,
			14.6
		],
		"reason": "joined"
	},
	"garrett-wilson": {
		"gsis": "00-0037740",
		"points": [
			18.3,
			22.1,
			37.3
		],
		"reason": "joined"
	},
	"cam-skattebo": {
		"gsis": "00-0040715",
		"points": [
			21.9,
			13.5,
			19.8
		],
		"reason": "joined"
	},
	"jaylen-waddle": {
		"gsis": "00-0036613",
		"points": [
			1.8,
			31.8,
			9.9
		],
		"reason": "joined"
	},
	"terry-mclaurin": {
		"gsis": "00-0035659",
		"points": [
			5.2,
			10.8,
			26.5
		],
		"reason": "joined"
	},
	"davante-adams": {
		"gsis": "00-0031381",
		"points": [
			7.8,
			50.5,
			29.3
		],
		"reason": "joined"
	},
	"luther-burden-iii": {
		"gsis": "00-0040735",
		"points": [
			12.6,
			8.6,
			25.1
		],
		"reason": "joined"
	},
	"lamar-jackson": {
		"gsis": "00-0034796",
		"points": [
			38.3,
			24.2,
			32.4
		],
		"reason": "joined"
	},
	"quinshon-judkins": {
		"gsis": "00-0040784",
		"points": [
			10.6,
			14,
			14.1
		],
		"reason": "joined"
	},
	"dandre-swift": {
		"gsis": "00-0036275",
		"points": [
			42.4,
			20.5,
			16.4
		],
		"reason": "joined"
	},
	"david-montgomery": {
		"gsis": "00-0035685",
		"points": [
			36.5,
			5.4,
			10.3
		],
		"reason": "joined"
	},
	"bucky-irving": {
		"gsis": "00-0039361",
		"points": [
			27.5,
			18.5,
			12.1
		],
		"reason": "joined"
	},
	"jameson-williams": {
		"gsis": "00-0037240",
		"points": [
			12.3,
			8.1,
			11.7
		],
		"reason": "joined"
	},
	"dj-moore": {
		"gsis": "00-0034827",
		"points": [
			28.6,
			0,
			18.7
		],
		"reason": "joined"
	},
	"mike-evans": {
		"gsis": "00-0031408",
		"points": [
			24.3,
			12,
			16.6
		],
		"reason": "joined"
	},
	"jalen-hurts": {
		"gsis": "00-0036389",
		"points": [
			29.8,
			27.8,
			19.3
		],
		"reason": "joined"
	},
	"george-kittle": {
		"gsis": "00-0033288",
		"points": [
			4.2,
			21.8,
			33.6
		],
		"reason": "joined"
	},
	"marvin-harrison-jr": {
		"gsis": "00-0039849",
		"points": [
			5.9,
			.2,
			11
		],
		"reason": "joined"
	},
	"brian-thomas-jr": {
		"gsis": "00-0039893",
		"points": [
			10.6,
			11.6,
			2
		],
		"reason": "joined"
	},
	"tyler-warren": {
		"gsis": "00-0040128",
		"points": [
			12.3,
			17.9,
			19.8
		],
		"reason": "joined"
	},
	"rhamondre-stevenson": {
		"gsis": "00-0036875",
		"points": [
			20.5,
			7.6,
			11.1
		],
		"reason": "joined"
	},
	"xavier-worthy": {
		"gsis": "00-0039894",
		"points": [
			7,
			16.9,
			5.4
		],
		"reason": "joined"
	},
	"drake-maye": {
		"gsis": "00-0039851",
		"points": [
			20.1,
			12.1,
			8.5
		],
		"reason": "joined"
	},
	"rome-odunze": {
		"gsis": "00-0039919",
		"points": [
			8.8,
			10.1,
			10.6
		],
		"reason": "joined"
	},
	"jayden-daniels": {
		"gsis": "00-0039910",
		"points": [25, 23.9],
		"reason": "joined"
	},
	"joe-burrow": {
		"gsis": "00-0036442",
		"points": [
			28.7,
			18.8,
			34.5
		],
		"reason": "joined"
	},
	"sam-laporta": {
		"gsis": "00-0039065",
		"points": [
			13.4,
			22.6,
			9.2
		],
		"reason": "joined"
	},
	"alvin-kamara": {
		"gsis": "00-0033906",
		"points": [10.3, 8.2],
		"reason": "joined"
	},
	"chuba-hubbard": {
		"gsis": "00-0036555",
		"points": [
			29.3,
			21,
			21.7
		],
		"reason": "joined"
	},
	"courtland-sutton": {
		"gsis": "00-0034348",
		"points": [
			4.1,
			7.3,
			12
		],
		"reason": "joined"
	},
	"dk-metcalf": {
		"gsis": "00-0035640",
		"points": [
			12,
			9.5,
			16.1
		],
		"reason": "joined"
	},
	"calvin-ridley": {
		"gsis": "00-0034837",
		"points": [7.9, .2],
		"reason": "joined"
	},
	"isiah-pacheco": {
		"gsis": null,
		"points": [],
		"reason": "NO TRAIL. No 2026 skill row. Off the start list."
	},
	"tony-pollard": {
		"gsis": "00-0035261",
		"points": [
			6.5,
			12.1,
			20.1
		],
		"reason": "joined"
	},
	"rj-harvey": {
		"gsis": "00-0040730",
		"points": [10.2, 13.3],
		"reason": "joined"
	},
	"patrick-mahomes": {
		"gsis": "00-0033873",
		"points": [
			28,
			45.2,
			25.6
		],
		"reason": "joined"
	},
	"justin-herbert": {
		"gsis": "00-0036355",
		"points": [
			19.1,
			11.4,
			21.5
		],
		"reason": "joined"
	},
	"jordan-addison": {
		"gsis": "00-0038994",
		"points": [
			.4,
			6.1,
			24.8
		],
		"reason": "joined"
	},
	"carnell-tate": {
		"gsis": "00-0041438",
		"points": [
			10,
			7.7,
			16.6
		],
		"reason": "joined"
	},
	"jauan-jennings": {
		"gsis": "00-0036259",
		"points": [.2, 1.5],
		"reason": "joined"
	},
	"dak-prescott": {
		"gsis": "00-0033077",
		"points": [
			24.3,
			43.1,
			30.1
		],
		"reason": "joined"
	},
	"khalil-shakir": {
		"gsis": "00-0037261",
		"points": [
			12.2,
			10,
			3.2
		],
		"reason": "joined"
	},
	"ricky-pearsall": {
		"gsis": null,
		"points": [],
		"reason": "NO TRAIL. No 2026 skill row. Off the start list."
	},
	"keon-coleman": {
		"gsis": "00-0039901",
		"points": [
			1.3,
			17.5,
			6.1
		],
		"reason": "joined"
	},
	"jonathon-brooks": {
		"gsis": "00-0039344",
		"points": [9, 2.8],
		"reason": "joined"
	},
	"jerry-jeudy": {
		"gsis": "00-0036407",
		"points": [6.4, .2],
		"reason": "joined"
	},
	"braelon-allen": {
		"gsis": "00-0039794",
		"points": [
			8.2,
			11.2,
			5.7
		],
		"reason": "joined"
	},
	"jaylen-warren": {
		"gsis": "00-0037228",
		"points": [
			16.5,
			13.6,
			32.1
		],
		"reason": "joined"
	},
	"travis-kelce": {
		"gsis": "00-0030506",
		"points": [
			13.1,
			36.3,
			16.3
		],
		"reason": "joined"
	},
	"bo-nix": {
		"gsis": "00-0039732",
		"points": [
			6.7,
			27.3,
			32.4
		],
		"reason": "joined"
	},
	"stefon-diggs": {
		"gsis": "00-0031588",
		"points": [
			21.3,
			26.9,
			10.7
		],
		"reason": "joined"
	},
	"chris-godwin": {
		"gsis": "00-0033921",
		"points": [
			11.2,
			13.5,
			6.3
		],
		"reason": "joined"
	},
	"david-njoku": {
		"gsis": "00-0033885",
		"points": [14.8, 2.5],
		"reason": "joined"
	},
	"baker-mayfield": {
		"gsis": "00-0034855",
		"points": [
			19.1,
			18.7,
			12.2
		],
		"reason": "joined"
	},
	"tj-hockenson": {
		"gsis": "00-0035229",
		"points": [
			16.6,
			8.7,
			3.9
		],
		"reason": "joined"
	},
	"jared-goff": {
		"gsis": "00-0033106",
		"points": [
			24,
			42.3,
			29.3
		],
		"reason": "joined"
	},
	"jakobi-meyers": {
		"gsis": "00-0034960",
		"points": [
			15.7,
			5,
			26
		],
		"reason": "joined"
	},
	"jordan-mason": {
		"gsis": "00-0037525",
		"points": [15.4],
		"reason": "joined"
	},
	"tyrone-tracy-jr": {
		"gsis": "00-0039384",
		"points": [
			.6,
			0,
			1.4
		],
		"reason": "joined"
	},
	"jacory-croskey-merritt": {
		"gsis": "00-0040242",
		"points": [
			21.4,
			7.2,
			10.4
		],
		"reason": "joined"
	},
	"rico-dowdle": {
		"gsis": "00-0036139",
		"points": [5.9, 10.5],
		"reason": "joined"
	},
	"deebo-samuel": {
		"gsis": "00-0035719",
		"points": [
			23.5,
			8.4,
			16.6
		],
		"reason": "joined"
	},
	"trevor-lawrence": {
		"gsis": "00-0036971",
		"points": [
			36.6,
			11.8,
			28.9
		],
		"reason": "joined"
	},
	"cj-stroud": {
		"gsis": "00-0039163",
		"points": [
			24.3,
			27.9,
			17.1
		],
		"reason": "joined"
	},
	"kyler-murray": {
		"gsis": "00-0035228",
		"points": [.6, 12.9],
		"reason": "joined"
	},
	"aaron-jones-sr": {
		"gsis": "00-0033293",
		"points": [
			14.4,
			17.8,
			21.1
		],
		"reason": "joined"
	},
	"wandale-robinson": {
		"gsis": "00-0038117",
		"points": [
			13,
			3.1,
			24.9
		],
		"reason": "joined"
	},
	"michael-pittman-jr": {
		"gsis": "00-0036252",
		"points": [11.4, 5.6],
		"reason": "joined"
	},
	"brock-purdy": {
		"gsis": "00-0037834",
		"points": [
			35.3,
			44.5,
			42.8
		],
		"reason": "joined"
	},
	"josh-downs": {
		"gsis": "00-0038997",
		"points": [
			8.5,
			22,
			18.9
		],
		"reason": "joined"
	},
	"dallas-goedert": {
		"gsis": "00-0034351",
		"points": [27.7, 1.8],
		"reason": "joined"
	},
	"darnell-mooney": {
		"gsis": "00-0036309",
		"points": [
			7.1,
			9.4,
			7.6
		],
		"reason": "joined"
	},
	"jordan-love": {
		"gsis": "00-0036264",
		"points": [
			29.5,
			16.6,
			30.5
		],
		"reason": "joined"
	},
	"caleb-williams": {
		"gsis": "00-0039918",
		"points": [50.8, 12.5],
		"reason": "joined"
	},
	"zach-charbonnet": {
		"gsis": null,
		"points": [],
		"reason": "NO TRAIL. No 2026 skill row. Off the start list."
	},
	"jaxson-dart": {
		"gsis": "00-0040691",
		"points": [40.7, 2.1],
		"reason": "joined"
	},
	"mark-andrews": {
		"gsis": "00-0034753",
		"points": [
			12.1,
			16.3,
			7.4
		],
		"reason": "joined"
	},
	"hunter-henry": {
		"gsis": "00-0033090",
		"points": [
			7.2,
			9,
			1.9
		],
		"reason": "joined"
	},
	"tucker-kraft": {
		"gsis": "00-0038996",
		"points": [
			13.7,
			4.1,
			9.2
		],
		"reason": "joined"
	},
	"jake-ferguson": {
		"gsis": "00-0038041",
		"points": [
			3,
			24.1,
			11.3
		],
		"reason": "joined"
	},
	"jk-dobbins": {
		"gsis": "00-0036158",
		"points": [
			5.4,
			5.6,
			10.4
		],
		"reason": "joined"
	},
	"ray-davis": {
		"gsis": "00-0039875",
		"points": [.4, 0],
		"reason": "joined"
	},
	"brandon-aiyuk": {
		"gsis": null,
		"points": [],
		"reason": "NO TRAIL. No 2026 skill row. Off the start list."
	},
	"christian-kirk": {
		"gsis": null,
		"points": [],
		"reason": "NO TRAIL. No 2026 skill row. Off the start list."
	},
	"cedric-tillman": {
		"gsis": null,
		"points": [],
		"reason": "NO TRAIL. No 2026 skill row. Off the start list."
	},
	"marshawn-lloyd": {
		"gsis": "00-0039811",
		"points": [
			7.2,
			11.6,
			5.8
		],
		"reason": "joined"
	},
	"kyle-pitts-sr": {
		"gsis": "00-0036970",
		"points": [
			.2,
			4.1,
			1.9
		],
		"reason": "joined"
	},
	"evan-engram": {
		"gsis": "00-0033881",
		"points": [
			18.3,
			3.9,
			.4
		],
		"reason": "joined"
	},
	"tua-tagovailoa": {
		"gsis": null,
		"points": [],
		"reason": "NO TRAIL. No 2026 skill row. Off the start list."
	},
	"matthew-stafford": {
		"gsis": "00-0026498",
		"points": [
			8.9,
			40.5,
			35
		],
		"reason": "joined"
	},
	"cam-ward": {
		"gsis": "00-0040676",
		"points": [
			16.1,
			27.4,
			18.9
		],
		"reason": "joined"
	},
	"jalen-mcmillan": {
		"gsis": "00-0039855",
		"points": [.2],
		"reason": "joined"
	},
	"hollywood-brown": {
		"gsis": "00-0035662",
		"points": [1.4],
		"reason": "joined as Marquise Brown"
	},
	"xavier-legette": {
		"gsis": "00-0039342",
		"points": [.4, 10.2],
		"reason": "joined"
	},
	"justin-fields": {
		"gsis": null,
		"points": [],
		"reason": "NO TRAIL. No 2026 skill row. Off the start list."
	},
	"nick-chubb": {
		"gsis": null,
		"points": [],
		"reason": "NO TRAIL. No 2026 skill row. Off the start list."
	},
	"tank-bigsby": {
		"gsis": "00-0038555",
		"points": [
			.4,
			15.5,
			-.3
		],
		"reason": "joined"
	},
	"tyler-allgeier": {
		"gsis": "00-0037263",
		"points": [
			13.1,
			6.8,
			6.9
		],
		"reason": "joined"
	},
	"kenyon-sadiq": {
		"gsis": "00-0041032",
		"points": [
			13.1,
			4.3,
			31.1
		],
		"reason": "joined"
	},
	"jordyn-tyson": {
		"gsis": null,
		"points": [],
		"reason": "NO TRAIL. No 2026 skill row. Off the start list."
	},
	"makai-lemon": {
		"gsis": "00-0040867",
		"points": [
			3.3,
			3.2,
			8.7
		],
		"reason": "joined"
	},
	"dezhaun-stribling": {
		"gsis": null,
		"points": [],
		"reason": "NO TRAIL. No 2026 skill row. Off the start list."
	},
	"jadarian-price": {
		"gsis": "00-0041512",
		"points": [
			13.2,
			9.7,
			4.3
		],
		"reason": "joined"
	},
	"parker-washington": {
		"gsis": "00-0038606",
		"points": [
			24.5,
			22.2,
			16
		],
		"reason": "joined"
	},
	"brenton-strange": {
		"gsis": "00-0038935",
		"points": [
			11.9,
			5.1,
			8.2
		],
		"reason": "joined"
	},
	"isaiah-likely": {
		"gsis": "00-0037838",
		"points": [
			35.4,
			13.3,
			5.3
		],
		"reason": "joined"
	},
	"dalton-kincaid": {
		"gsis": "00-0038933",
		"points": [
			25.2,
			29.1,
			5.4
		],
		"reason": "joined"
	},
	"tyler-shough": {
		"gsis": "00-0040743",
		"points": [
			40.6,
			33.3,
			36.1
		],
		"reason": "joined"
	},
	"geno-smith": {
		"gsis": "00-0030565",
		"points": [
			17,
			22.3,
			38
		],
		"reason": "joined"
	},
	"michael-penix-jr": {
		"gsis": "00-0039917",
		"points": [21.9],
		"reason": "joined"
	},
	"jj-mccarthy": {
		"gsis": null,
		"points": [],
		"reason": "NO TRAIL. No 2026 skill row. Off the start list."
	},
	"sam-darnold": {
		"gsis": "00-0034869",
		"points": [.1, 46.8],
		"reason": "joined"
	},
	"fernando-mendoza": {
		"gsis": null,
		"points": [],
		"reason": "NO TRAIL. No 2026 skill row. Off the start list."
	},
	"dylan-sampson": {
		"gsis": "00-0040162",
		"points": [0],
		"reason": "joined"
	},
	"broncos-dst": {
		"gsis": "broncos-dst",
		"points": [
			1,
			12,
			13
		],
		"reason": "joined"
	},
	"ravens-dst": {
		"gsis": "ravens-dst",
		"points": [
			12,
			5,
			3
		],
		"reason": "joined"
	},
	"steelers-dst": {
		"gsis": "steelers-dst",
		"points": [
			26,
			11,
			7
		],
		"reason": "joined"
	},
	"vikings-dst": {
		"gsis": "vikings-dst",
		"points": [
			10,
			18,
			20
		],
		"reason": "joined"
	},
	"eagles-dst": {
		"gsis": "eagles-dst",
		"points": [
			6,
			6,
			-1
		],
		"reason": "joined"
	},
	"49ers-dst": {
		"gsis": "49ers-dst",
		"points": [
			12,
			15,
			3
		],
		"reason": "joined"
	},
	"packers-dst": {
		"gsis": "packers-dst",
		"points": [
			6,
			10,
			-7
		],
		"reason": "joined"
	},
	"texans-dst": {
		"gsis": "texans-dst",
		"points": [
			-2,
			11,
			15
		],
		"reason": "joined"
	},
	"bills-dst": {
		"gsis": "bills-dst",
		"points": [
			11,
			8,
			7
		],
		"reason": "joined"
	},
	"seahawks-dst": {
		"gsis": "seahawks-dst",
		"points": [
			18,
			13,
			4
		],
		"reason": "joined"
	},
	"lions-dst": {
		"gsis": "lions-dst",
		"points": [
			11,
			-4,
			13
		],
		"reason": "joined"
	},
	"chargers-dst": {
		"gsis": "chargers-dst",
		"points": [
			0,
			6,
			19
		],
		"reason": "joined"
	},
	"patriots-dst": {
		"gsis": "patriots-dst",
		"points": [
			8,
			27,
			0
		],
		"reason": "joined"
	},
	"chiefs-dst": {
		"gsis": "chiefs-dst",
		"points": [
			18,
			2,
			9
		],
		"reason": "joined"
	},
	"rams-dst": {
		"gsis": "rams-dst",
		"points": [
			0,
			15,
			5
		],
		"reason": "joined"
	},
	"jaguars-dst": {
		"gsis": "jaguars-dst",
		"points": [
			22,
			0,
			16
		],
		"reason": "joined"
	},
	"mike-washington-jr": {
		"gsis": "00-0040878",
		"points": [
			5.8,
			1.2,
			14.9
		],
		"reason": "joined"
	},
	"jonah-coleman": {
		"gsis": "00-0041496",
		"points": [0, 19.4],
		"reason": "joined"
	},
	"blake-corum": {
		"gsis": "00-0039738",
		"points": [
			8.4,
			17.6,
			4.9
		],
		"reason": "joined"
	},
	"bhayshul-tuten": {
		"gsis": "00-0040719",
		"points": [
			16.5,
			19.9,
			24.9
		],
		"reason": "joined"
	},
	"woody-marks": {
		"gsis": "00-0040583",
		"points": [
			10.1,
			12.5,
			11.8
		],
		"reason": "joined"
	},
	"isaac-guerendo": {
		"gsis": null,
		"points": [],
		"reason": "NO TRAIL. No 2026 skill row. Off the start list."
	},
	"justice-hill": {
		"gsis": "00-0034975",
		"points": [
			7.6,
			4.4,
			4.8
		],
		"reason": "joined"
	},
	"kimani-vidal": {
		"gsis": "00-0039391",
		"points": [0, 5.7],
		"reason": "joined"
	},
	"roschon-johnson": {
		"gsis": "00-0039021",
		"points": [0],
		"reason": "joined"
	},
	"jaydon-blue": {
		"gsis": null,
		"points": [],
		"reason": "NO TRAIL. No 2026 skill row. Off the start list."
	},
	"adonai-mitchell": {
		"gsis": "00-0039890",
		"points": [11.6, 19.7],
		"reason": "joined"
	},
	"troy-franklin": {
		"gsis": "00-0039868",
		"points": [
			.8,
			5.1,
			4.3
		],
		"reason": "joined"
	},
	"jalen-coker": {
		"gsis": "00-0039491",
		"points": [
			43.6,
			19.4,
			5.6
		],
		"reason": "joined"
	},
	"kc-concepcion": {
		"gsis": "00-0041547",
		"points": [
			12.1,
			10.5,
			5.7
		],
		"reason": "joined"
	},
	"omar-cooper-jr": {
		"gsis": "00-0041511",
		"points": [5.2],
		"reason": "joined"
	},
	"denzel-boston": {
		"gsis": "00-0041037",
		"points": [
			16.7,
			24.9,
			10.9
		],
		"reason": "joined"
	},
	"chris-bell": {
		"gsis": "00-0041525",
		"points": [
			4.9,
			.2,
			15.1
		],
		"reason": "joined"
	},
	"ted-hurst": {
		"gsis": "00-0041048",
		"points": [
			9.2,
			7.1,
			12.6
		],
		"reason": "joined"
	},
	"cade-otton": {
		"gsis": "00-0038129",
		"points": [
			9.6,
			11,
			11.8
		],
		"reason": "joined"
	},
	"pat-freiermuth": {
		"gsis": "00-0036894",
		"points": [
			19.6,
			10.5,
			8
		],
		"reason": "joined"
	},
	"dalton-schultz": {
		"gsis": "00-0034383",
		"points": [
			10.1,
			36.8,
			7.6
		],
		"reason": "joined"
	},
	"juwan-johnson": {
		"gsis": "00-0036040",
		"points": [
			18.8,
			13.4,
			29.9
		],
		"reason": "joined"
	},
	"tyler-higbee": {
		"gsis": "00-0033110",
		"points": [1.6, 28.4],
		"reason": "joined"
	},
	"noah-fant": {
		"gsis": "00-0035644",
		"points": [
			16.9,
			0,
			22.1
		],
		"reason": "joined"
	},
	"chig-okonkwo": {
		"gsis": "00-0037809",
		"points": [5.2],
		"reason": "joined"
	},
	"taysom-hill": {
		"gsis": null,
		"points": [],
		"reason": "NO TRAIL. No 2026 skill row. Off the start list."
	},
	"matthew-golden": {
		"gsis": "00-0040667",
		"points": [
			21.9,
			15,
			29.4
		],
		"reason": "joined"
	},
	"jayden-reed": {
		"gsis": "00-0039146",
		"points": [7.4, 1.6],
		"reason": "joined"
	},
	"dontayvion-wicks": {
		"gsis": "00-0038393",
		"points": [
			18.1,
			18.6,
			8.2
		],
		"reason": "joined"
	},
	"romeo-doubs": {
		"gsis": "00-0037816",
		"points": [
			.6,
			15.4,
			10.7
		],
		"reason": "joined"
	},
	"keenan-allen": {
		"gsis": "00-0030279",
		"points": [
			11.4,
			2.5,
			23.1
		],
		"reason": "joined"
	},
	"cooper-kupp": {
		"gsis": "00-0033908",
		"points": [
			8.1,
			5.4,
			18.6
		],
		"reason": "joined"
	},
	"amari-cooper": {
		"gsis": null,
		"points": [],
		"reason": "NO TRAIL. No 2026 skill row. Off the start list."
	},
	"michael-carter": {
		"gsis": null,
		"points": [],
		"reason": "NO TRAIL. No 2026 skill row. Off the start list."
	},
	"diontae-johnson": {
		"gsis": null,
		"points": [],
		"reason": "NO TRAIL. No 2026 skill row. Off the start list."
	},
	"rashid-shaheed": {
		"gsis": "00-0037545",
		"points": [
			2,
			9.2,
			4
		],
		"reason": "joined"
	},
	"marvin-mims-jr": {
		"gsis": "00-0038976",
		"points": [0],
		"reason": "joined"
	},
	"deandre-hopkins": {
		"gsis": null,
		"points": [],
		"reason": "NO TRAIL. No 2026 skill row. Off the start list."
	},
	"adam-thielen": {
		"gsis": null,
		"points": [],
		"reason": "NO TRAIL. No 2026 skill row. Off the start list."
	},
	"tyler-lockett": {
		"gsis": null,
		"points": [],
		"reason": "NO TRAIL. No 2026 skill row. Off the start list."
	},
	"quentin-johnston": {
		"gsis": "00-0038544",
		"points": [
			4.9,
			4.5,
			10.2
		],
		"reason": "joined"
	},
	"joshua-palmer": {
		"gsis": null,
		"points": [],
		"reason": "NO TRAIL. No 2026 skill row. Off the start list."
	},
	"treveyon-henderson": {
		"gsis": "00-0040734",
		"points": [18.2, 4.9],
		"reason": "joined"
	},
	"kareem-hunt": {
		"gsis": null,
		"points": [],
		"reason": "NO TRAIL. No 2026 skill row. Off the start list."
	},
	"najee-harris": {
		"gsis": "00-0036893",
		"points": [1, 9.1],
		"reason": "joined"
	},
	"austin-ekeler": {
		"gsis": null,
		"points": [],
		"reason": "NO TRAIL. No 2026 skill row. Off the start list."
	},
	"tyjae-spears": {
		"gsis": "00-0039032",
		"points": [
			6.5,
			12.1,
			.8
		],
		"reason": "joined"
	},
	"jaylen-wright": {
		"gsis": "00-0039874",
		"points": [0, 2.3],
		"reason": "joined"
	},
	"jawhar-jordan": {
		"gsis": null,
		"points": [],
		"reason": "NO TRAIL. No 2026 skill row. Off the start list."
	}
};
function trailOf(id) {
	const row = TRAILS[id];
	const points = row?.points ?? [];
	if (!row?.gsis || points.length === 0) return {
		kind: "none",
		points: [],
		floor: 0,
		mean: 0,
		ceiling: 0,
		reason: row?.reason ?? "NO TRAIL. Off the start list."
	};
	const floor = Math.min(...points);
	const ceiling = Math.max(...points);
	const mean = points.reduce((sum, n) => sum + n, 0) / points.length;
	return {
		kind: points.length >= 3 ? "full" : "thin",
		points,
		floor,
		mean,
		ceiling,
		reason: row.reason ?? ""
	};
}
var SLATE = {
	"SEA": {
		"1": {
			"opp": "NE",
			"home": true,
			"spread": 3,
			"total": 44.5,
			"bye": false
		},
		"2": {
			"opp": "ARI",
			"home": false,
			"spread": 3.5,
			"total": 40.5,
			"bye": false
		},
		"3": {
			"opp": "WAS",
			"home": false,
			"spread": 8.5,
			"total": 40.5,
			"bye": false
		},
		"4": {
			"opp": "LAC",
			"home": true,
			"spread": 7,
			"total": 42.5,
			"bye": false
		},
		"5": {
			"opp": "SF",
			"home": true,
			"spread": 3,
			"total": 47.5,
			"bye": false
		},
		"6": {
			"opp": "DEN",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"7": {
			"opp": "KC",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"8": {
			"opp": "CHI",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"9": {
			"opp": "ARI",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"10": {
			"opp": "LV",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"11": {
			"opp": "",
			"home": false,
			"spread": null,
			"total": null,
			"bye": true
		},
		"12": {
			"opp": "SF",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"13": {
			"opp": "DAL",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"14": {
			"opp": "NYG",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"15": {
			"opp": "PHI",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"16": {
			"opp": "LAR",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"17": {
			"opp": "CAR",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"18": {
			"opp": "LAR",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		}
	},
	"NE": {
		"1": {
			"opp": "SEA",
			"home": false,
			"spread": -3,
			"total": 44.5,
			"bye": false
		},
		"2": {
			"opp": "PIT",
			"home": true,
			"spread": 4.5,
			"total": 41.5,
			"bye": false
		},
		"3": {
			"opp": "JAC",
			"home": false,
			"spread": -3,
			"total": 46.5,
			"bye": false
		},
		"4": {
			"opp": "BUF",
			"home": false,
			"spread": -7,
			"total": 50.5,
			"bye": false
		},
		"5": {
			"opp": "LV",
			"home": true,
			"spread": 3.5,
			"total": 44.5,
			"bye": false
		},
		"6": {
			"opp": "NYJ",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"7": {
			"opp": "CHI",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"8": {
			"opp": "MIA",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"9": {
			"opp": "GB",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"10": {
			"opp": "DET",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"11": {
			"opp": "",
			"home": false,
			"spread": null,
			"total": null,
			"bye": true
		},
		"12": {
			"opp": "LAC",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"13": {
			"opp": "BUF",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"14": {
			"opp": "MIN",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"15": {
			"opp": "KC",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"16": {
			"opp": "NYJ",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"17": {
			"opp": "DEN",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"18": {
			"opp": "MIA",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		}
	},
	"LAR": {
		"1": {
			"opp": "SF",
			"home": true,
			"spread": 3.5,
			"total": 47.5,
			"bye": false
		},
		"2": {
			"opp": "NYG",
			"home": true,
			"spread": 6.5,
			"total": 47.5,
			"bye": false
		},
		"3": {
			"opp": "DEN",
			"home": false,
			"spread": -1.5,
			"total": 43.5,
			"bye": false
		},
		"4": {
			"opp": "PHI",
			"home": false,
			"spread": 3.5,
			"total": 42.5,
			"bye": false
		},
		"5": {
			"opp": "BUF",
			"home": true,
			"spread": 2.5,
			"total": 52.5,
			"bye": false
		},
		"6": {
			"opp": "ARI",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"7": {
			"opp": "LV",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"8": {
			"opp": "LAC",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"9": {
			"opp": "WAS",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"10": {
			"opp": "ARI",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"11": {
			"opp": "",
			"home": false,
			"spread": null,
			"total": null,
			"bye": true
		},
		"12": {
			"opp": "GB",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"13": {
			"opp": "KC",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"14": {
			"opp": "SF",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"15": {
			"opp": "DAL",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"16": {
			"opp": "SEA",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"17": {
			"opp": "TB",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"18": {
			"opp": "SEA",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		}
	},
	"SF": {
		"1": {
			"opp": "LAR",
			"home": false,
			"spread": -3.5,
			"total": 47.5,
			"bye": false
		},
		"2": {
			"opp": "MIA",
			"home": true,
			"spread": 12.5,
			"total": 44.5,
			"bye": false
		},
		"3": {
			"opp": "ARI",
			"home": true,
			"spread": 7.5,
			"total": 48.5,
			"bye": false
		},
		"4": {
			"opp": "DEN",
			"home": true,
			"spread": 3,
			"total": 48.5,
			"bye": false
		},
		"5": {
			"opp": "SEA",
			"home": false,
			"spread": -3,
			"total": 47.5,
			"bye": false
		},
		"6": {
			"opp": "WAS",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"7": {
			"opp": "ATL",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"8": {
			"opp": "",
			"home": false,
			"spread": null,
			"total": null,
			"bye": true
		},
		"9": {
			"opp": "LV",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"10": {
			"opp": "DAL",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"11": {
			"opp": "MIN",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"12": {
			"opp": "SEA",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"13": {
			"opp": "NYG",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"14": {
			"opp": "LAR",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"15": {
			"opp": "LAC",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"16": {
			"opp": "KC",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"17": {
			"opp": "PHI",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"18": {
			"opp": "ARI",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		}
	},
	"CAR": {
		"1": {
			"opp": "CHI",
			"home": true,
			"spread": -3,
			"total": 47.5,
			"bye": false
		},
		"2": {
			"opp": "ATL",
			"home": false,
			"spread": 2.5,
			"total": 43.5,
			"bye": false
		},
		"3": {
			"opp": "CLE",
			"home": false,
			"spread": 2.5,
			"total": 41.5,
			"bye": false
		},
		"4": {
			"opp": "DET",
			"home": true,
			"spread": -3.5,
			"total": 51.5,
			"bye": false
		},
		"5": {
			"opp": "",
			"home": false,
			"spread": null,
			"total": null,
			"bye": true
		},
		"6": {
			"opp": "PHI",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"7": {
			"opp": "TB",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"8": {
			"opp": "GB",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"9": {
			"opp": "DEN",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"10": {
			"opp": "NO",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"11": {
			"opp": "BAL",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"12": {
			"opp": "TB",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"13": {
			"opp": "MIN",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"14": {
			"opp": "NO",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"15": {
			"opp": "CIN",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"16": {
			"opp": "PIT",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"17": {
			"opp": "SEA",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"18": {
			"opp": "ATL",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		}
	},
	"CHI": {
		"1": {
			"opp": "CAR",
			"home": false,
			"spread": 3,
			"total": 47.5,
			"bye": false
		},
		"2": {
			"opp": "MIN",
			"home": true,
			"spread": 4.5,
			"total": 46.5,
			"bye": false
		},
		"3": {
			"opp": "PHI",
			"home": true,
			"spread": -3.5,
			"total": 42.5,
			"bye": false
		},
		"4": {
			"opp": "NYJ",
			"home": true,
			"spread": 3.5,
			"total": 43.5,
			"bye": false
		},
		"5": {
			"opp": "GB",
			"home": false,
			"spread": -2.5,
			"total": 45.5,
			"bye": false
		},
		"6": {
			"opp": "ATL",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"7": {
			"opp": "NE",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"8": {
			"opp": "SEA",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"9": {
			"opp": "TB",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"10": {
			"opp": "",
			"home": false,
			"spread": null,
			"total": null,
			"bye": true
		},
		"11": {
			"opp": "NO",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"12": {
			"opp": "DET",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"13": {
			"opp": "JAC",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"14": {
			"opp": "MIA",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"15": {
			"opp": "BUF",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"16": {
			"opp": "GB",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"17": {
			"opp": "DET",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"18": {
			"opp": "MIN",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		}
	},
	"CIN": {
		"1": {
			"opp": "TB",
			"home": true,
			"spread": 3.5,
			"total": 50.5,
			"bye": false
		},
		"2": {
			"opp": "HOU",
			"home": false,
			"spread": -3,
			"total": 45.5,
			"bye": false
		},
		"3": {
			"opp": "PIT",
			"home": false,
			"spread": 3.5,
			"total": 42.5,
			"bye": false
		},
		"4": {
			"opp": "JAC",
			"home": true,
			"spread": 2.5,
			"total": 51.5,
			"bye": false
		},
		"5": {
			"opp": "MIA",
			"home": false,
			"spread": 8.5,
			"total": 46.5,
			"bye": false
		},
		"6": {
			"opp": "",
			"home": false,
			"spread": null,
			"total": null,
			"bye": true
		},
		"7": {
			"opp": "BAL",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"8": {
			"opp": "TEN",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"9": {
			"opp": "ATL",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"10": {
			"opp": "PIT",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"11": {
			"opp": "WAS",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"12": {
			"opp": "NO",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"13": {
			"opp": "CLE",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"14": {
			"opp": "KC",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"15": {
			"opp": "CAR",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"16": {
			"opp": "IND",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"17": {
			"opp": "BAL",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"18": {
			"opp": "CLE",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		}
	},
	"TB": {
		"1": {
			"opp": "CIN",
			"home": false,
			"spread": -3.5,
			"total": 50.5,
			"bye": false
		},
		"2": {
			"opp": "CLE",
			"home": true,
			"spread": 8.5,
			"total": 41.5,
			"bye": false
		},
		"3": {
			"opp": "MIN",
			"home": true,
			"spread": -1.5,
			"total": 42.5,
			"bye": false
		},
		"4": {
			"opp": "GB",
			"home": true,
			"spread": -3,
			"total": 38.5,
			"bye": false
		},
		"5": {
			"opp": "DAL",
			"home": false,
			"spread": -9.5,
			"total": 47.5,
			"bye": false
		},
		"6": {
			"opp": "PIT",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"7": {
			"opp": "CAR",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"8": {
			"opp": "ATL",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"9": {
			"opp": "CHI",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"10": {
			"opp": "",
			"home": false,
			"spread": null,
			"total": null,
			"bye": true
		},
		"11": {
			"opp": "DET",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"12": {
			"opp": "CAR",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"13": {
			"opp": "LAC",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"14": {
			"opp": "BAL",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"15": {
			"opp": "NO",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"16": {
			"opp": "ATL",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"17": {
			"opp": "LAR",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"18": {
			"opp": "NO",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		}
	},
	"DET": {
		"1": {
			"opp": "NO",
			"home": true,
			"spread": 7,
			"total": 49.5,
			"bye": false
		},
		"2": {
			"opp": "BUF",
			"home": false,
			"spread": -5.5,
			"total": 54.5,
			"bye": false
		},
		"3": {
			"opp": "NYJ",
			"home": true,
			"spread": 7,
			"total": 49.5,
			"bye": false
		},
		"4": {
			"opp": "CAR",
			"home": false,
			"spread": 3.5,
			"total": 51.5,
			"bye": false
		},
		"5": {
			"opp": "ARI",
			"home": false,
			"spread": 5.5,
			"total": 52.5,
			"bye": false
		},
		"6": {
			"opp": "",
			"home": false,
			"spread": null,
			"total": null,
			"bye": true
		},
		"7": {
			"opp": "GB",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"8": {
			"opp": "MIN",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"9": {
			"opp": "MIA",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"10": {
			"opp": "NE",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"11": {
			"opp": "TB",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"12": {
			"opp": "CHI",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"13": {
			"opp": "ATL",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"14": {
			"opp": "TEN",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"15": {
			"opp": "MIN",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"16": {
			"opp": "NYG",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"17": {
			"opp": "CHI",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"18": {
			"opp": "GB",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		}
	},
	"NO": {
		"1": {
			"opp": "DET",
			"home": false,
			"spread": -7,
			"total": 49.5,
			"bye": false
		},
		"2": {
			"opp": "BAL",
			"home": false,
			"spread": -8.5,
			"total": 45.5,
			"bye": false
		},
		"3": {
			"opp": "LV",
			"home": true,
			"spread": 3.5,
			"total": 43.5,
			"bye": false
		},
		"4": {
			"opp": "ATL",
			"home": true,
			"spread": 1.5,
			"total": 47.5,
			"bye": false
		},
		"5": {
			"opp": "MIN",
			"home": true,
			"spread": -2.5,
			"total": 44.5,
			"bye": false
		},
		"6": {
			"opp": "NYG",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"7": {
			"opp": "PIT",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"8": {
			"opp": "",
			"home": false,
			"spread": null,
			"total": null,
			"bye": true
		},
		"9": {
			"opp": "CLE",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"10": {
			"opp": "CAR",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"11": {
			"opp": "CHI",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"12": {
			"opp": "CIN",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"13": {
			"opp": "GB",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"14": {
			"opp": "CAR",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"15": {
			"opp": "TB",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"16": {
			"opp": "ARI",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"17": {
			"opp": "ATL",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"18": {
			"opp": "TB",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		}
	},
	"HOU": {
		"1": {
			"opp": "BUF",
			"home": true,
			"spread": -1.5,
			"total": 44.5,
			"bye": false
		},
		"2": {
			"opp": "CIN",
			"home": true,
			"spread": 3,
			"total": 45.5,
			"bye": false
		},
		"3": {
			"opp": "IND",
			"home": false,
			"spread": 1.5,
			"total": 41.5,
			"bye": false
		},
		"4": {
			"opp": "DAL",
			"home": true,
			"spread": 3,
			"total": 48.5,
			"bye": false
		},
		"5": {
			"opp": "TEN",
			"home": false,
			"spread": 6.5,
			"total": 39.5,
			"bye": false
		},
		"6": {
			"opp": "JAC",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"7": {
			"opp": "NYG",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"8": {
			"opp": "",
			"home": false,
			"spread": null,
			"total": null,
			"bye": true
		},
		"9": {
			"opp": "LAC",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"10": {
			"opp": "CLE",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"11": {
			"opp": "IND",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"12": {
			"opp": "BAL",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"13": {
			"opp": "PIT",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"14": {
			"opp": "WAS",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"15": {
			"opp": "JAC",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"16": {
			"opp": "PHI",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"17": {
			"opp": "GB",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"18": {
			"opp": "TEN",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		}
	},
	"BUF": {
		"1": {
			"opp": "HOU",
			"home": false,
			"spread": 1.5,
			"total": 44.5,
			"bye": false
		},
		"2": {
			"opp": "DET",
			"home": true,
			"spread": 5.5,
			"total": 54.5,
			"bye": false
		},
		"3": {
			"opp": "LAC",
			"home": true,
			"spread": 7,
			"total": 50.5,
			"bye": false
		},
		"4": {
			"opp": "NE",
			"home": true,
			"spread": 7,
			"total": 50.5,
			"bye": false
		},
		"5": {
			"opp": "LAR",
			"home": false,
			"spread": -2.5,
			"total": 52.5,
			"bye": false
		},
		"6": {
			"opp": "LV",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"7": {
			"opp": "",
			"home": false,
			"spread": null,
			"total": null,
			"bye": true
		},
		"8": {
			"opp": "BAL",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"9": {
			"opp": "MIN",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"10": {
			"opp": "NYJ",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"11": {
			"opp": "MIA",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"12": {
			"opp": "KC",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"13": {
			"opp": "NE",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"14": {
			"opp": "GB",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"15": {
			"opp": "CHI",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"16": {
			"opp": "DEN",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"17": {
			"opp": "MIA",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"18": {
			"opp": "NYJ",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		}
	},
	"IND": {
		"1": {
			"opp": "BAL",
			"home": true,
			"spread": -3,
			"total": 48.5,
			"bye": false
		},
		"2": {
			"opp": "KC",
			"home": false,
			"spread": -6,
			"total": 46.5,
			"bye": false
		},
		"3": {
			"opp": "HOU",
			"home": true,
			"spread": -1.5,
			"total": 41.5,
			"bye": false
		},
		"4": {
			"opp": "WAS",
			"home": false,
			"spread": 4.5,
			"total": 46.5,
			"bye": false
		},
		"5": {
			"opp": "PIT",
			"home": false,
			"spread": -1.5,
			"total": 44.5,
			"bye": false
		},
		"6": {
			"opp": "TEN",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"7": {
			"opp": "MIN",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"8": {
			"opp": "JAC",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"9": {
			"opp": "DAL",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"10": {
			"opp": "MIA",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"11": {
			"opp": "HOU",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"12": {
			"opp": "NYG",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"13": {
			"opp": "",
			"home": false,
			"spread": null,
			"total": null,
			"bye": true
		},
		"14": {
			"opp": "PHI",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"15": {
			"opp": "TEN",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"16": {
			"opp": "CIN",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"17": {
			"opp": "CLE",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"18": {
			"opp": "JAC",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		}
	},
	"BAL": {
		"1": {
			"opp": "IND",
			"home": false,
			"spread": 3,
			"total": 48.5,
			"bye": false
		},
		"2": {
			"opp": "NO",
			"home": true,
			"spread": 8.5,
			"total": 45.5,
			"bye": false
		},
		"3": {
			"opp": "DAL",
			"home": false,
			"spread": 3,
			"total": 53.5,
			"bye": false
		},
		"4": {
			"opp": "TEN",
			"home": true,
			"spread": 11.5,
			"total": 41.5,
			"bye": false
		},
		"5": {
			"opp": "ATL",
			"home": false,
			"spread": 6,
			"total": 49.5,
			"bye": false
		},
		"6": {
			"opp": "CLE",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"7": {
			"opp": "CIN",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"8": {
			"opp": "BUF",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"9": {
			"opp": "JAC",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"10": {
			"opp": "LAC",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"11": {
			"opp": "CAR",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"12": {
			"opp": "HOU",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"13": {
			"opp": "",
			"home": false,
			"spread": null,
			"total": null,
			"bye": true
		},
		"14": {
			"opp": "TB",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"15": {
			"opp": "PIT",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"16": {
			"opp": "CLE",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"17": {
			"opp": "CIN",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"18": {
			"opp": "PIT",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		}
	},
	"JAC": {
		"1": {
			"opp": "CLE",
			"home": true,
			"spread": 8.5,
			"total": 40.5,
			"bye": false
		},
		"2": {
			"opp": "DEN",
			"home": false,
			"spread": -2.5,
			"total": 45.5,
			"bye": false
		},
		"3": {
			"opp": "NE",
			"home": true,
			"spread": 3,
			"total": 46.5,
			"bye": false
		},
		"4": {
			"opp": "CIN",
			"home": false,
			"spread": -2.5,
			"total": 51.5,
			"bye": false
		},
		"5": {
			"opp": "PHI",
			"home": true,
			"spread": 3,
			"total": 44.5,
			"bye": false
		},
		"6": {
			"opp": "HOU",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"7": {
			"opp": "",
			"home": false,
			"spread": null,
			"total": null,
			"bye": true
		},
		"8": {
			"opp": "IND",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"9": {
			"opp": "BAL",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"10": {
			"opp": "TEN",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"11": {
			"opp": "NYG",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"12": {
			"opp": "TEN",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"13": {
			"opp": "CHI",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"14": {
			"opp": "PIT",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"15": {
			"opp": "HOU",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"16": {
			"opp": "DAL",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"17": {
			"opp": "WAS",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"18": {
			"opp": "IND",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		}
	},
	"CLE": {
		"1": {
			"opp": "JAC",
			"home": false,
			"spread": -8.5,
			"total": 40.5,
			"bye": false
		},
		"2": {
			"opp": "TB",
			"home": false,
			"spread": -8.5,
			"total": 41.5,
			"bye": false
		},
		"3": {
			"opp": "CAR",
			"home": true,
			"spread": -2.5,
			"total": 41.5,
			"bye": false
		},
		"4": {
			"opp": "PIT",
			"home": true,
			"spread": -2.5,
			"total": 38.5,
			"bye": false
		},
		"5": {
			"opp": "NYJ",
			"home": false,
			"spread": -1.5,
			"total": 40.5,
			"bye": false
		},
		"6": {
			"opp": "BAL",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"7": {
			"opp": "TEN",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"8": {
			"opp": "PIT",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"9": {
			"opp": "NO",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"10": {
			"opp": "HOU",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"11": {
			"opp": "",
			"home": false,
			"spread": null,
			"total": null,
			"bye": true
		},
		"12": {
			"opp": "LV",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"13": {
			"opp": "CIN",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"14": {
			"opp": "ATL",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"15": {
			"opp": "NYG",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"16": {
			"opp": "BAL",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"17": {
			"opp": "IND",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"18": {
			"opp": "CIN",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		}
	},
	"PIT": {
		"1": {
			"opp": "ATL",
			"home": true,
			"spread": 6.5,
			"total": 40.5,
			"bye": false
		},
		"2": {
			"opp": "NE",
			"home": false,
			"spread": -4.5,
			"total": 41.5,
			"bye": false
		},
		"3": {
			"opp": "CIN",
			"home": true,
			"spread": -3.5,
			"total": 42.5,
			"bye": false
		},
		"4": {
			"opp": "CLE",
			"home": false,
			"spread": 2.5,
			"total": 38.5,
			"bye": false
		},
		"5": {
			"opp": "IND",
			"home": true,
			"spread": 1.5,
			"total": 44.5,
			"bye": false
		},
		"6": {
			"opp": "TB",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"7": {
			"opp": "NO",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"8": {
			"opp": "CLE",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"9": {
			"opp": "",
			"home": false,
			"spread": null,
			"total": null,
			"bye": true
		},
		"10": {
			"opp": "CIN",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"11": {
			"opp": "PHI",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"12": {
			"opp": "DEN",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"13": {
			"opp": "HOU",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"14": {
			"opp": "JAC",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"15": {
			"opp": "BAL",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"16": {
			"opp": "CAR",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"17": {
			"opp": "TEN",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"18": {
			"opp": "BAL",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		}
	},
	"ATL": {
		"1": {
			"opp": "PIT",
			"home": false,
			"spread": -6.5,
			"total": 40.5,
			"bye": false
		},
		"2": {
			"opp": "CAR",
			"home": true,
			"spread": -2.5,
			"total": 43.5,
			"bye": false
		},
		"3": {
			"opp": "GB",
			"home": false,
			"spread": -4.5,
			"total": 43.5,
			"bye": false
		},
		"4": {
			"opp": "NO",
			"home": false,
			"spread": -1.5,
			"total": 47.5,
			"bye": false
		},
		"5": {
			"opp": "BAL",
			"home": true,
			"spread": -6,
			"total": 49.5,
			"bye": false
		},
		"6": {
			"opp": "CHI",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"7": {
			"opp": "SF",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"8": {
			"opp": "TB",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"9": {
			"opp": "CIN",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"10": {
			"opp": "KC",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"11": {
			"opp": "",
			"home": false,
			"spread": null,
			"total": null,
			"bye": true
		},
		"12": {
			"opp": "MIN",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"13": {
			"opp": "DET",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"14": {
			"opp": "CLE",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"15": {
			"opp": "WAS",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"16": {
			"opp": "TB",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"17": {
			"opp": "NO",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"18": {
			"opp": "CAR",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		}
	},
	"TEN": {
		"1": {
			"opp": "NYJ",
			"home": true,
			"spread": 1.5,
			"total": 39.5,
			"bye": false
		},
		"2": {
			"opp": "PHI",
			"home": true,
			"spread": -7,
			"total": 39.5,
			"bye": false
		},
		"3": {
			"opp": "NYG",
			"home": false,
			"spread": -2.5,
			"total": 37.5,
			"bye": false
		},
		"4": {
			"opp": "BAL",
			"home": false,
			"spread": -11.5,
			"total": 41.5,
			"bye": false
		},
		"5": {
			"opp": "HOU",
			"home": true,
			"spread": -6.5,
			"total": 39.5,
			"bye": false
		},
		"6": {
			"opp": "IND",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"7": {
			"opp": "CLE",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"8": {
			"opp": "CIN",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"9": {
			"opp": "",
			"home": false,
			"spread": null,
			"total": null,
			"bye": true
		},
		"10": {
			"opp": "JAC",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"11": {
			"opp": "DAL",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"12": {
			"opp": "JAC",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"13": {
			"opp": "WAS",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"14": {
			"opp": "DET",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"15": {
			"opp": "IND",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"16": {
			"opp": "LV",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"17": {
			"opp": "PIT",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"18": {
			"opp": "HOU",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		}
	},
	"NYJ": {
		"1": {
			"opp": "TEN",
			"home": false,
			"spread": -1.5,
			"total": 39.5,
			"bye": false
		},
		"2": {
			"opp": "GB",
			"home": true,
			"spread": -3.5,
			"total": 44.5,
			"bye": false
		},
		"3": {
			"opp": "DET",
			"home": false,
			"spread": -7,
			"total": 49.5,
			"bye": false
		},
		"4": {
			"opp": "CHI",
			"home": false,
			"spread": -3.5,
			"total": 43.5,
			"bye": false
		},
		"5": {
			"opp": "CLE",
			"home": true,
			"spread": 1.5,
			"total": 40.5,
			"bye": false
		},
		"6": {
			"opp": "NE",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"7": {
			"opp": "MIA",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"8": {
			"opp": "LV",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"9": {
			"opp": "KC",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"10": {
			"opp": "BUF",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"11": {
			"opp": "LAC",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"12": {
			"opp": "MIA",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"13": {
			"opp": "",
			"home": false,
			"spread": null,
			"total": null,
			"bye": true
		},
		"14": {
			"opp": "DEN",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"15": {
			"opp": "ARI",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"16": {
			"opp": "NE",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"17": {
			"opp": "MIN",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"18": {
			"opp": "BUF",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		}
	},
	"LAC": {
		"1": {
			"opp": "ARI",
			"home": true,
			"spread": 8.5,
			"total": 47.5,
			"bye": false
		},
		"2": {
			"opp": "LV",
			"home": true,
			"spread": 6.5,
			"total": 43.5,
			"bye": false
		},
		"3": {
			"opp": "BUF",
			"home": false,
			"spread": -7,
			"total": 50.5,
			"bye": false
		},
		"4": {
			"opp": "SEA",
			"home": false,
			"spread": -7,
			"total": 42.5,
			"bye": false
		},
		"5": {
			"opp": "DEN",
			"home": true,
			"spread": -2.5,
			"total": 43.5,
			"bye": false
		},
		"6": {
			"opp": "KC",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"7": {
			"opp": "",
			"home": false,
			"spread": null,
			"total": null,
			"bye": true
		},
		"8": {
			"opp": "LAR",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"9": {
			"opp": "HOU",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"10": {
			"opp": "BAL",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"11": {
			"opp": "NYJ",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"12": {
			"opp": "NE",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"13": {
			"opp": "TB",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"14": {
			"opp": "LV",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"15": {
			"opp": "SF",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"16": {
			"opp": "MIA",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"17": {
			"opp": "KC",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"18": {
			"opp": "DEN",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		}
	},
	"ARI": {
		"1": {
			"opp": "LAC",
			"home": false,
			"spread": -8.5,
			"total": 47.5,
			"bye": false
		},
		"2": {
			"opp": "SEA",
			"home": true,
			"spread": -3.5,
			"total": 40.5,
			"bye": false
		},
		"3": {
			"opp": "SF",
			"home": false,
			"spread": -7.5,
			"total": 48.5,
			"bye": false
		},
		"4": {
			"opp": "NYG",
			"home": false,
			"spread": 2.5,
			"total": 44.5,
			"bye": false
		},
		"5": {
			"opp": "DET",
			"home": true,
			"spread": -5.5,
			"total": 52.5,
			"bye": false
		},
		"6": {
			"opp": "LAR",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"7": {
			"opp": "DEN",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"8": {
			"opp": "DAL",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"9": {
			"opp": "SEA",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"10": {
			"opp": "LAR",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"11": {
			"opp": "KC",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"12": {
			"opp": "WAS",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"13": {
			"opp": "PHI",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"14": {
			"opp": "",
			"home": false,
			"spread": null,
			"total": null,
			"bye": true
		},
		"15": {
			"opp": "NYJ",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"16": {
			"opp": "NO",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"17": {
			"opp": "LV",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"18": {
			"opp": "SF",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		}
	},
	"LV": {
		"1": {
			"opp": "MIA",
			"home": true,
			"spread": 3,
			"total": 40.5,
			"bye": false
		},
		"2": {
			"opp": "LAC",
			"home": false,
			"spread": -6.5,
			"total": 43.5,
			"bye": false
		},
		"3": {
			"opp": "NO",
			"home": false,
			"spread": -3.5,
			"total": 43.5,
			"bye": false
		},
		"4": {
			"opp": "KC",
			"home": true,
			"spread": -4.5,
			"total": 47.5,
			"bye": false
		},
		"5": {
			"opp": "NE",
			"home": false,
			"spread": -3.5,
			"total": 44.5,
			"bye": false
		},
		"6": {
			"opp": "BUF",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"7": {
			"opp": "LAR",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"8": {
			"opp": "NYJ",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"9": {
			"opp": "SF",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"10": {
			"opp": "SEA",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"11": {
			"opp": "DEN",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"12": {
			"opp": "CLE",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"13": {
			"opp": "",
			"home": false,
			"spread": null,
			"total": null,
			"bye": true
		},
		"14": {
			"opp": "LAC",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"15": {
			"opp": "DEN",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"16": {
			"opp": "TEN",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"17": {
			"opp": "ARI",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"18": {
			"opp": "KC",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		}
	},
	"MIA": {
		"1": {
			"opp": "LV",
			"home": false,
			"spread": -3,
			"total": 40.5,
			"bye": false
		},
		"2": {
			"opp": "SF",
			"home": false,
			"spread": -12.5,
			"total": 44.5,
			"bye": false
		},
		"3": {
			"opp": "KC",
			"home": true,
			"spread": -10,
			"total": 45.5,
			"bye": false
		},
		"4": {
			"opp": "MIN",
			"home": false,
			"spread": -10,
			"total": 38.5,
			"bye": false
		},
		"5": {
			"opp": "CIN",
			"home": true,
			"spread": -8.5,
			"total": 46.5,
			"bye": false
		},
		"6": {
			"opp": "",
			"home": false,
			"spread": null,
			"total": null,
			"bye": true
		},
		"7": {
			"opp": "NYJ",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"8": {
			"opp": "NE",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"9": {
			"opp": "DET",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"10": {
			"opp": "IND",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"11": {
			"opp": "BUF",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"12": {
			"opp": "NYJ",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"13": {
			"opp": "DEN",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"14": {
			"opp": "CHI",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"15": {
			"opp": "GB",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"16": {
			"opp": "LAC",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"17": {
			"opp": "BUF",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"18": {
			"opp": "NE",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		}
	},
	"MIN": {
		"1": {
			"opp": "GB",
			"home": true,
			"spread": 1.5,
			"total": 46.5,
			"bye": false
		},
		"2": {
			"opp": "CHI",
			"home": false,
			"spread": -4.5,
			"total": 46.5,
			"bye": false
		},
		"3": {
			"opp": "TB",
			"home": false,
			"spread": 1.5,
			"total": 42.5,
			"bye": false
		},
		"4": {
			"opp": "MIA",
			"home": true,
			"spread": 10,
			"total": 38.5,
			"bye": false
		},
		"5": {
			"opp": "NO",
			"home": false,
			"spread": 2.5,
			"total": 44.5,
			"bye": false
		},
		"6": {
			"opp": "",
			"home": false,
			"spread": null,
			"total": null,
			"bye": true
		},
		"7": {
			"opp": "IND",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"8": {
			"opp": "DET",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"9": {
			"opp": "BUF",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"10": {
			"opp": "GB",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"11": {
			"opp": "SF",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"12": {
			"opp": "ATL",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"13": {
			"opp": "CAR",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"14": {
			"opp": "NE",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"15": {
			"opp": "DET",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"16": {
			"opp": "WAS",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"17": {
			"opp": "NYJ",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"18": {
			"opp": "CHI",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		}
	},
	"GB": {
		"1": {
			"opp": "MIN",
			"home": false,
			"spread": -1.5,
			"total": 46.5,
			"bye": false
		},
		"2": {
			"opp": "NYJ",
			"home": false,
			"spread": 3.5,
			"total": 44.5,
			"bye": false
		},
		"3": {
			"opp": "ATL",
			"home": true,
			"spread": 4.5,
			"total": 43.5,
			"bye": false
		},
		"4": {
			"opp": "TB",
			"home": false,
			"spread": 3,
			"total": 38.5,
			"bye": false
		},
		"5": {
			"opp": "CHI",
			"home": true,
			"spread": 2.5,
			"total": 45.5,
			"bye": false
		},
		"6": {
			"opp": "DAL",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"7": {
			"opp": "DET",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"8": {
			"opp": "CAR",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"9": {
			"opp": "NE",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"10": {
			"opp": "MIN",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"11": {
			"opp": "",
			"home": false,
			"spread": null,
			"total": null,
			"bye": true
		},
		"12": {
			"opp": "LAR",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"13": {
			"opp": "NO",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"14": {
			"opp": "BUF",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"15": {
			"opp": "MIA",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"16": {
			"opp": "CHI",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"17": {
			"opp": "HOU",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"18": {
			"opp": "DET",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		}
	},
	"PHI": {
		"1": {
			"opp": "WAS",
			"home": true,
			"spread": 6,
			"total": 43.5,
			"bye": false
		},
		"2": {
			"opp": "TEN",
			"home": false,
			"spread": 7,
			"total": 39.5,
			"bye": false
		},
		"3": {
			"opp": "CHI",
			"home": false,
			"spread": 3.5,
			"total": 42.5,
			"bye": false
		},
		"4": {
			"opp": "LAR",
			"home": true,
			"spread": -3.5,
			"total": 42.5,
			"bye": false
		},
		"5": {
			"opp": "JAC",
			"home": false,
			"spread": -3,
			"total": 44.5,
			"bye": false
		},
		"6": {
			"opp": "CAR",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"7": {
			"opp": "DAL",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"8": {
			"opp": "WAS",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"9": {
			"opp": "NYG",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"10": {
			"opp": "",
			"home": false,
			"spread": null,
			"total": null,
			"bye": true
		},
		"11": {
			"opp": "PIT",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"12": {
			"opp": "DAL",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"13": {
			"opp": "ARI",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"14": {
			"opp": "IND",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"15": {
			"opp": "SEA",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"16": {
			"opp": "HOU",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"17": {
			"opp": "SF",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"18": {
			"opp": "NYG",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		}
	},
	"WAS": {
		"1": {
			"opp": "PHI",
			"home": false,
			"spread": -6,
			"total": 43.5,
			"bye": false
		},
		"2": {
			"opp": "DAL",
			"home": false,
			"spread": -3.5,
			"total": 51.5,
			"bye": false
		},
		"3": {
			"opp": "SEA",
			"home": true,
			"spread": -8.5,
			"total": 40.5,
			"bye": false
		},
		"4": {
			"opp": "IND",
			"home": true,
			"spread": -4.5,
			"total": 46.5,
			"bye": false
		},
		"5": {
			"opp": "NYG",
			"home": true,
			"spread": 2.5,
			"total": 43.5,
			"bye": false
		},
		"6": {
			"opp": "SF",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"7": {
			"opp": "",
			"home": false,
			"spread": null,
			"total": null,
			"bye": true
		},
		"8": {
			"opp": "PHI",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"9": {
			"opp": "LAR",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"10": {
			"opp": "NYG",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"11": {
			"opp": "CIN",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"12": {
			"opp": "ARI",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"13": {
			"opp": "TEN",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"14": {
			"opp": "HOU",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"15": {
			"opp": "ATL",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"16": {
			"opp": "MIN",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"17": {
			"opp": "JAC",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"18": {
			"opp": "DAL",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		}
	},
	"NYG": {
		"1": {
			"opp": "DAL",
			"home": true,
			"spread": -3,
			"total": 47.5,
			"bye": false
		},
		"2": {
			"opp": "LAR",
			"home": false,
			"spread": -6.5,
			"total": 47.5,
			"bye": false
		},
		"3": {
			"opp": "TEN",
			"home": true,
			"spread": 2.5,
			"total": 37.5,
			"bye": false
		},
		"4": {
			"opp": "ARI",
			"home": true,
			"spread": -2.5,
			"total": 44.5,
			"bye": false
		},
		"5": {
			"opp": "WAS",
			"home": false,
			"spread": -2.5,
			"total": 43.5,
			"bye": false
		},
		"6": {
			"opp": "NO",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"7": {
			"opp": "HOU",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"8": {
			"opp": "",
			"home": false,
			"spread": null,
			"total": null,
			"bye": true
		},
		"9": {
			"opp": "PHI",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"10": {
			"opp": "WAS",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"11": {
			"opp": "JAC",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"12": {
			"opp": "IND",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"13": {
			"opp": "SF",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"14": {
			"opp": "SEA",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"15": {
			"opp": "CLE",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"16": {
			"opp": "DET",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"17": {
			"opp": "DAL",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"18": {
			"opp": "PHI",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		}
	},
	"DAL": {
		"1": {
			"opp": "NYG",
			"home": false,
			"spread": 3,
			"total": 47.5,
			"bye": false
		},
		"2": {
			"opp": "WAS",
			"home": true,
			"spread": 3.5,
			"total": 51.5,
			"bye": false
		},
		"3": {
			"opp": "BAL",
			"home": true,
			"spread": -3,
			"total": 53.5,
			"bye": false
		},
		"4": {
			"opp": "HOU",
			"home": false,
			"spread": -3,
			"total": 48.5,
			"bye": false
		},
		"5": {
			"opp": "TB",
			"home": true,
			"spread": 9.5,
			"total": 47.5,
			"bye": false
		},
		"6": {
			"opp": "GB",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"7": {
			"opp": "PHI",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"8": {
			"opp": "ARI",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"9": {
			"opp": "IND",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"10": {
			"opp": "SF",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"11": {
			"opp": "TEN",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"12": {
			"opp": "PHI",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"13": {
			"opp": "SEA",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"14": {
			"opp": "",
			"home": false,
			"spread": null,
			"total": null,
			"bye": true
		},
		"15": {
			"opp": "LAR",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"16": {
			"opp": "JAC",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"17": {
			"opp": "NYG",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"18": {
			"opp": "WAS",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		}
	},
	"KC": {
		"1": {
			"opp": "DEN",
			"home": true,
			"spread": 2.5,
			"total": 42.5,
			"bye": false
		},
		"2": {
			"opp": "IND",
			"home": true,
			"spread": 6,
			"total": 46.5,
			"bye": false
		},
		"3": {
			"opp": "MIA",
			"home": false,
			"spread": 10,
			"total": 45.5,
			"bye": false
		},
		"4": {
			"opp": "LV",
			"home": false,
			"spread": 4.5,
			"total": 47.5,
			"bye": false
		},
		"5": {
			"opp": "",
			"home": false,
			"spread": null,
			"total": null,
			"bye": true
		},
		"6": {
			"opp": "LAC",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"7": {
			"opp": "SEA",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"8": {
			"opp": "DEN",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"9": {
			"opp": "NYJ",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"10": {
			"opp": "ATL",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"11": {
			"opp": "ARI",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"12": {
			"opp": "BUF",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"13": {
			"opp": "LAR",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"14": {
			"opp": "CIN",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"15": {
			"opp": "NE",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"16": {
			"opp": "SF",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"17": {
			"opp": "LAC",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"18": {
			"opp": "LV",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		}
	},
	"DEN": {
		"1": {
			"opp": "KC",
			"home": false,
			"spread": -2.5,
			"total": 42.5,
			"bye": false
		},
		"2": {
			"opp": "JAC",
			"home": true,
			"spread": 2.5,
			"total": 45.5,
			"bye": false
		},
		"3": {
			"opp": "LAR",
			"home": true,
			"spread": 1.5,
			"total": 43.5,
			"bye": false
		},
		"4": {
			"opp": "SF",
			"home": false,
			"spread": -3,
			"total": 48.5,
			"bye": false
		},
		"5": {
			"opp": "LAC",
			"home": false,
			"spread": 2.5,
			"total": 43.5,
			"bye": false
		},
		"6": {
			"opp": "SEA",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"7": {
			"opp": "ARI",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"8": {
			"opp": "KC",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"9": {
			"opp": "CAR",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"10": {
			"opp": "",
			"home": false,
			"spread": null,
			"total": null,
			"bye": true
		},
		"11": {
			"opp": "LV",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"12": {
			"opp": "PIT",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"13": {
			"opp": "MIA",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"14": {
			"opp": "NYJ",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"15": {
			"opp": "LV",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"16": {
			"opp": "BUF",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		},
		"17": {
			"opp": "NE",
			"home": false,
			"spread": null,
			"total": null,
			"bye": false
		},
		"18": {
			"opp": "LAC",
			"home": true,
			"spread": null,
			"total": null,
			"bye": false
		}
	}
};
function slateFor(team, week) {
	return SLATE[team]?.[String(week)] ?? null;
}
function teamImplied(slate) {
	if (!slate || slate.bye || slate.spread == null || slate.total == null) return null;
	return slate.total / 2 + slate.spread / 2;
}
function ownRecentImplied(team, weeks) {
	const values = [];
	for (const week of weeks) {
		const implied = teamImplied(slateFor(team, week));
		if (implied == null) return null;
		values.push(implied);
	}
	if (!values.length) return null;
	return values.reduce((sum, value) => sum + value, 0) / values.length;
}
/** Own trailing mean times games left. Bye scores 0. No positional mean. */
function thinRos(team, weekly, from = 4, through = 17) {
	let games = 0;
	for (let week = from; week <= through; week++) {
		const slate = slateFor(team, week);
		if (!slate || slate.bye) continue;
		games += 1;
	}
	const round = (n) => Math.round(n * games * 10) / 10;
	return {
		p20: round(weekly.p20),
		p50: round(weekly.ePts),
		p80: round(weekly.p80),
		ePts: round(weekly.ePts),
		weeksLeft: games
	};
}
var SHADOW = {
	"jahmyr-gibbs": {
		"usage": "Snap 75%. Targets 19%. Carries 78%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 55%. Goal line 58%. Last 3 20%.",
		"script": "Spread 3.5. Total 51.5. Implied 24.0. Pace 64.0.",
		"weather": "Sunday: 2 to 6 mph N. Patchy Fog then Chance Showers And Thunderstorms. Not in the score.",
		"opponent": "RB points allowed 15.5 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "32.5 from weeks 1-3 rates. Not in the score."
	},
	"bijan-robinson": {
		"usage": "Snap 67%. Targets 20%. Carries 63%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 79%. Goal line 71%. Last 3 22%.",
		"script": "Spread -1.5. Total 47.5. Implied 24.5. Pace 61.0.",
		"weather": "Dome. Weather ignored. Not in the score.",
		"opponent": "RB points allowed 12.0 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "22.8 from weeks 1-3 rates. Not in the score."
	},
	"jamarr-chase": {
		"usage": "Snap 94%. Targets 24%. Carries 0%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 19%. Goal line 14%. Last 3 24%.",
		"script": "Spread 2.5. Total 51.5. Implied 24.5. Pace 57.0.",
		"weather": "Sunday: 0 to 3 mph N. Mostly Sunny. Not in the score.",
		"opponent": "WR points allowed 9.2 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "18.7 from weeks 1-3 rates. Not in the score."
	},
	"puka-nacua": {
		"usage": "Snap 70%. Targets 32%. Carries 0%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 4%. Goal line 14%. Last 3 thin, fewer than 3 games.",
		"script": "Spread 3.5. Total 42.5. Implied 19.5. Pace 64.7.",
		"weather": "Sunday: 5 to 10 mph NE. Chance Rain Showers. Not in the score.",
		"opponent": "WR points allowed 12.6 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "18.1 from weeks 1-3 rates. Not in the score."
	},
	"jaxon-smith-njigba": {
		"usage": "Snap 81%. Targets 38%. Carries 0%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 23%. Goal line 13%. Last 3 40%.",
		"script": "Spread 7. Total 42.5. Implied 17.8. Pace 58.7.",
		"weather": "Sunday: 5 mph NNW. Mostly Sunny. Not in the score.",
		"opponent": "WR points allowed 9.0 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "33.4 from weeks 1-3 rates. Not in the score."
	},
	"christian-mccaffrey": {
		"usage": "Snap 63%. Targets 20%. Carries 44%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 37%. Goal line 56%. Last 3 20%.",
		"script": "Spread 3. Total 48.5. Implied 22.8. Pace 54.3.",
		"weather": "Sunday: 0 to 10 mph NW. Partly Sunny. Not in the score.",
		"opponent": "RB points allowed 12.8 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "16.3 from weeks 1-3 rates. Not in the score."
	},
	"amon-ra-st-brown": {
		"usage": "Snap 86%. Targets 32%. Carries 0%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 21%. Goal line 25%. Last 3 32%.",
		"script": "Spread 3.5. Total 51.5. Implied 24.0. Pace 64.0.",
		"weather": "Sunday: 2 to 6 mph N. Patchy Fog then Chance Showers And Thunderstorms. Not in the score.",
		"opponent": "WR points allowed 6.8 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "26.7 from weeks 1-3 rates. Not in the score."
	},
	"jonathan-taylor": {
		"usage": "Snap 89%. Targets 11%. Carries 80%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 48%. Goal line 83%. Last 3 11%.",
		"script": "Spread 4.5. Total 46.5. Implied 21.0. Pace 60.3.",
		"weather": "Sunday: 3 to 7 mph NE. Rain Showers Likely. Not in the score.",
		"opponent": "RB points allowed 5.3 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "28.0 from weeks 1-3 rates. Not in the score."
	},
	"ceedee-lamb": {
		"usage": "Snap 79%. Targets 24%. Carries 1%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 11%. Goal line 23%. Last 3 24%.",
		"script": "Spread -3. Total 48.5. Implied 25.8. Pace 58.0.",
		"weather": "Sunday: 10 to 15 mph NE. Chance Showers And Thunderstorms. Not in the score.",
		"opponent": "WR points allowed 11.2 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "16.8 from weeks 1-3 rates. Not in the score."
	},
	"ashton-jeanty": {
		"usage": "Snap 80%. Targets 17%. Carries 68%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 57%. Goal line 70%. Last 3 18%.",
		"script": "Spread -4.5. Total 47.5. Implied 26.0. Pace 61.7.",
		"weather": "Dome. Weather ignored. Not in the score.",
		"opponent": "RB points allowed 11.4 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "24.3 from weeks 1-3 rates. Not in the score."
	},
	"justin-jefferson": {
		"usage": "Snap 68%. Targets 23%. Carries 0%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 27%. Goal line 33%. Last 3 25%.",
		"script": "Spread 10. Total 38.5. Implied 14.3. Pace 52.7.",
		"weather": "Dome. Weather ignored. Not in the score.",
		"opponent": "WR points allowed 6.2 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "14.7 from weeks 1-3 rates. Not in the score."
	},
	"james-cook": {
		"usage": "Snap 71%. Targets 9%. Carries 64%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 39%. Goal line 33%. Last 3 9%.",
		"script": "Spread 7. Total 50.5. Implied 21.8. Pace 58.7.",
		"weather": "Sunday: 8 mph S. Mostly Sunny. Not in the score.",
		"opponent": "RB points allowed 7.7 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "15.1 from weeks 1-3 rates. Not in the score."
	},
	"devon-achane": {
		"usage": "Snap 56%. Targets 14%. Carries 44%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 37%. Goal line 50%. Last 3 16%.",
		"script": "Spread -10. Total 38.5. Implied 24.3. Pace 54.3.",
		"weather": "Dome. Weather ignored. Not in the score.",
		"opponent": "RB points allowed 8.9 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "9.6 from weeks 1-3 rates. Not in the score."
	},
	"omarion-hampton": {
		"usage": "Snap 54%. Targets 3%. Carries 62%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 36%. Goal line 60%. Last 3 3%.",
		"script": "Spread -7. Total 42.5. Implied 24.8. Pace 56.3.",
		"weather": "Sunday: 5 mph NNW. Mostly Sunny. Not in the score.",
		"opponent": "RB points allowed 9.0 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "10.9 from weeks 1-3 rates. Not in the score."
	},
	"saquon-barkley": {
		"usage": "Snap 53%. Targets 7%. Carries 45%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 20%. Goal line 33%. Last 3 7%.",
		"script": "Spread -3.5. Total 42.5. Implied 23.0. Pace 54.7.",
		"weather": "Sunday: 5 to 10 mph NE. Chance Rain Showers. Not in the score.",
		"opponent": "RB points allowed 7.5 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "6.9 from weeks 1-3 rates. Not in the score."
	},
	"chase-brown": {
		"usage": "Snap 71%. Targets 13%. Carries 72%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 33%. Goal line 43%. Last 3 13%.",
		"script": "Spread 2.5. Total 51.5. Implied 24.5. Pace 57.0.",
		"weather": "Sunday: 0 to 3 mph N. Mostly Sunny. Not in the score.",
		"opponent": "RB points allowed 7.3 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "17.3 from weeks 1-3 rates. Not in the score."
	},
	"brock-bowers": {
		"usage": "Snap 79%. Targets 39%. Carries 0%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 9%. Goal line 10%. Last 3 thin, fewer than 3 games.",
		"script": "Spread -4.5. Total 47.5. Implied 26.0. Pace 61.7.",
		"weather": "Dome. Weather ignored. Not in the score.",
		"opponent": "TE points allowed 8.0 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "26.1 from weeks 1-3 rates. Not in the score."
	},
	"drake-london": {
		"usage": "Snap 84%. Targets 24%. Carries 2%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 0%. Goal line 0%. Last 3 25%.",
		"script": "Spread -1.5. Total 47.5. Implied 24.5. Pace 61.0.",
		"weather": "Dome. Weather ignored. Not in the score.",
		"opponent": "WR points allowed 8.1 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "16.3 from weeks 1-3 rates. Not in the score."
	},
	"kenneth-walker-iii": {
		"usage": "Snap 74%. Targets 18%. Carries 71%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 56%. Goal line 70%. Last 3 17%.",
		"script": "Spread 4.5. Total 47.5. Implied 21.5. Pace 63.0.",
		"weather": "Dome. Weather ignored. Not in the score.",
		"opponent": "RB points allowed 8.0 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "27.8 from weeks 1-3 rates. Not in the score."
	},
	"aj-brown": {
		"usage": "Snap 44%. Targets 12%. Carries 0%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 0%. Goal line 0%. Last 3 thin, fewer than 3 games.",
		"script": "Spread -7. Total 50.5. Implied 28.8. Pace 57.0.",
		"weather": "Sunday: 8 mph S. Mostly Sunny. Not in the score.",
		"opponent": "WR points allowed 10.5 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "3.1 from weeks 1-3 rates. Not in the score."
	},
	"derrick-henry": {
		"usage": "Snap 58%. Targets 7%. Carries 68%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 57%. Goal line 60%. Last 3 6%.",
		"script": "Spread 11.5. Total 41.5. Implied 15.0. Pace 57.7.",
		"weather": "Sunday: 7 mph NE. Rain Showers Likely. Not in the score.",
		"opponent": "RB points allowed 12.1 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "13.2 from weeks 1-3 rates. Not in the score."
	},
	"nico-collins": {
		"usage": "Snap 72%. Targets 26%. Carries 3%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 9%. Goal line 0%. Last 3 thin, fewer than 3 games.",
		"script": "Spread 3. Total 48.5. Implied 22.8. Pace 63.7.",
		"weather": "Sunday: 10 to 15 mph NE. Chance Showers And Thunderstorms. Not in the score.",
		"opponent": "WR points allowed 8.1 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "15.7 from weeks 1-3 rates. Not in the score."
	},
	"trey-mcbride": {
		"usage": "Snap 86%. Targets 29%. Carries 0%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 22%. Goal line 33%. Last 3 31%.",
		"script": "Spread 2.5. Total 44.5. Implied 21.0. Pace 65.0.",
		"weather": "Sunday: 8 mph NE. Chance Rain Showers. Not in the score.",
		"opponent": "TE points allowed 6.4 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "22.0 from weeks 1-3 rates. Not in the score."
	},
	"jeremiyah-love": {
		"usage": "Snap 49%. Targets 10%. Carries 53%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 33%. Goal line 22%. Last 3 10%.",
		"script": "Spread 2.5. Total 44.5. Implied 21.0. Pace 65.0.",
		"weather": "Sunday: 8 mph NE. Chance Rain Showers. Not in the score.",
		"opponent": "RB points allowed 14.4 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "10.9 from weeks 1-3 rates. Not in the score."
	},
	"george-pickens": {
		"usage": "Snap 82%. Targets 24%. Carries 0%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 8%. Goal line 15%. Last 3 24%.",
		"script": "Spread -3. Total 48.5. Implied 25.8. Pace 58.0.",
		"weather": "Sunday: 10 to 15 mph NE. Chance Showers And Thunderstorms. Not in the score.",
		"opponent": "WR points allowed 11.2 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "13.0 from weeks 1-3 rates. Not in the score."
	},
	"rashee-rice": {
		"usage": "Snap 80%. Targets 17%. Carries 0%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 11%. Goal line 0%. Last 3 19%.",
		"script": "Spread 4.5. Total 47.5. Implied 21.5. Pace 63.0.",
		"weather": "Dome. Weather ignored. Not in the score.",
		"opponent": "WR points allowed 7.6 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "11.8 from weeks 1-3 rates. Not in the score."
	},
	"devonta-smith": {
		"usage": "Snap 94%. Targets 31%. Carries 0%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 8%. Goal line 0%. Last 3 30%.",
		"script": "Spread -3.5. Total 42.5. Implied 23.0. Pace 54.7.",
		"weather": "Sunday: 5 to 10 mph NE. Chance Rain Showers. Not in the score.",
		"opponent": "WR points allowed 9.0 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "20.2 from weeks 1-3 rates. Not in the score."
	},
	"chris-olave": {
		"usage": "Snap 85%. Targets 27%. Carries 0%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 11%. Goal line 10%. Last 3 28%.",
		"script": "Spread 1.5. Total 47.5. Implied 23.0. Pace 70.7.",
		"weather": "Dome. Weather ignored. Not in the score.",
		"opponent": "WR points allowed 11.5 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "21.3 from weeks 1-3 rates. Not in the score."
	},
	"josh-allen": {
		"usage": "Snap 100%. Targets 1%. Carries 31%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 25%. Goal line 42%. Last 3 1%.",
		"script": "Spread 7. Total 50.5. Implied 21.8. Pace 58.7.",
		"weather": "Sunday: 8 mph S. Mostly Sunny. Not in the score.",
		"opponent": "QB points allowed 11.2 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "33.1 from weeks 1-3 rates. Not in the score."
	},
	"breece-hall": {
		"usage": "Snap 57%. Targets 10%. Carries 60%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 35%. Goal line 40%. Last 3 10%.",
		"script": "Spread -3.5. Total 43.5. Implied 23.5. Pace 62.3.",
		"weather": "Sunday: 10 to 15 mph WNW. Sunny. Not in the score.",
		"opponent": "RB points allowed 10.0 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "12.5 from weeks 1-3 rates. Not in the score."
	},
	"kyren-williams": {
		"usage": "Snap 63%. Targets 11%. Carries 48%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 38%. Goal line 29%. Last 3 10%.",
		"script": "Spread 3.5. Total 42.5. Implied 19.5. Pace 64.7.",
		"weather": "Sunday: 5 to 10 mph NE. Chance Rain Showers. Not in the score.",
		"opponent": "RB points allowed 10.7 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "14.8 from weeks 1-3 rates. Not in the score."
	},
	"zay-flowers": {
		"usage": "Snap 31%. Targets 27%. Carries 1%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 6%. Goal line 0%. Last 3 thin, fewer than 3 games.",
		"script": "Spread 11.5. Total 41.5. Implied 15.0. Pace 57.7.",
		"weather": "Sunday: 7 mph NE. Rain Showers Likely. Not in the score.",
		"opponent": "WR points allowed 8.6 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "7.9 from weeks 1-3 rates. Not in the score."
	},
	"javonte-williams": {
		"usage": "Snap 76%. Targets 11%. Carries 62%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 39%. Goal line 46%. Last 3 12%.",
		"script": "Spread -3. Total 48.5. Implied 25.8. Pace 58.0.",
		"weather": "Sunday: 10 to 15 mph NE. Chance Showers And Thunderstorms. Not in the score.",
		"opponent": "RB points allowed 8.2 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "19.1 from weeks 1-3 rates. Not in the score."
	},
	"josh-jacobs": {
		"usage": "Missing: no 2026 skill row in nflverse weekly stats. Not in the score.",
		"script": "Spread 3. Total 38.5. Implied 17.8. Pace 57.3.",
		"weather": "Sunday: 7 mph SSE. Mostly Sunny then Isolated Showers And Thunderstorms. Not in the score.",
		"opponent": "RB points allowed 9.1 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "No prior games. Not in the score."
	},
	"travis-etienne-jr": {
		"usage": "Snap 50%. Targets 10%. Carries 38%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 20%. Goal line 20%. Last 3 9%.",
		"script": "Spread 1.5. Total 47.5. Implied 23.0. Pace 70.7.",
		"weather": "Dome. Weather ignored. Not in the score.",
		"opponent": "RB points allowed 5.8 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "8.7 from weeks 1-3 rates. Not in the score."
	},
	"tee-higgins": {
		"usage": "Snap 79%. Targets 22%. Carries 0%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 5%. Goal line 0%. Last 3 23%.",
		"script": "Spread 2.5. Total 51.5. Implied 24.5. Pace 57.0.",
		"weather": "Sunday: 0 to 3 mph N. Mostly Sunny. Not in the score.",
		"opponent": "WR points allowed 9.2 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "13.2 from weeks 1-3 rates. Not in the score."
	},
	"tetairoa-mcmillan": {
		"usage": "Snap 86%. Targets 19%. Carries 0%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 15%. Goal line 33%. Last 3 20%.",
		"script": "Spread -3.5. Total 51.5. Implied 27.5. Pace 63.0.",
		"weather": "Sunday: 2 to 6 mph N. Patchy Fog then Chance Showers And Thunderstorms. Not in the score.",
		"opponent": "WR points allowed 11.5 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "12.2 from weeks 1-3 rates. Not in the score."
	},
	"malik-nabers": {
		"usage": "Snap 68%. Targets 23%. Carries 0%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 14%. Goal line 0%. Last 3 24%.",
		"script": "Spread -2.5. Total 44.5. Implied 23.5. Pace 58.0.",
		"weather": "Sunday: 8 mph NE. Chance Rain Showers. Not in the score.",
		"opponent": "WR points allowed 12.5 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "10.2 from weeks 1-3 rates. Not in the score."
	},
	"emeka-egbuka": {
		"usage": "Snap 82%. Targets 20%. Carries 2%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 9%. Goal line 100%. Last 3 20%. Backup Jalon Daniels: 3.0 attempts per game, sack rate 0.00. Shadow points moved. Not in the score.",
		"script": "Spread -3. Total 38.5. Implied 20.8. Pace 55.0.",
		"weather": "Sunday: 7 mph SSE. Mostly Sunny then Isolated Showers And Thunderstorms. Not in the score.",
		"opponent": "WR points allowed 11.5 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "1.0 from weeks 1-3 rates. Not in the score. Backup Jalon Daniels: 3.0 attempts per game, sack rate 0.00. Shadow points moved. Not in the score."
	},
	"colston-loveland": {
		"usage": "Snap 84%. Targets 9%. Carries 0%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 7%. Goal line 0%. Last 3 9%. Backup Case Keenum: 34.0 attempts per game, sack rate 0.00. Shadow points moved. Not in the score.",
		"script": "Spread 3.5. Total 43.5. Implied 20.0. Pace 67.7.",
		"weather": "Sunday: 10 to 15 mph WNW. Sunny. Not in the score.",
		"opponent": "TE points allowed 5.8 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "5.2 from weeks 1-3 rates. Not in the score. Backup Case Keenum: 34.0 attempts per game, sack rate 0.00. Shadow points moved. Not in the score."
	},
	"ladd-mcconkey": {
		"usage": "Snap 61%. Targets 17%. Carries 0%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 7%. Goal line 0%. Last 3 17%.",
		"script": "Spread -7. Total 42.5. Implied 24.8. Pace 56.3.",
		"weather": "Sunday: 5 mph NNW. Mostly Sunny. Not in the score.",
		"opponent": "WR points allowed 5.6 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "6.9 from weeks 1-3 rates. Not in the score."
	},
	"garrett-wilson": {
		"usage": "Snap 86%. Targets 26%. Carries 0%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 9%. Goal line 20%. Last 3 27%.",
		"script": "Spread -3.5. Total 43.5. Implied 23.5. Pace 62.3.",
		"weather": "Sunday: 10 to 15 mph WNW. Sunny. Not in the score.",
		"opponent": "WR points allowed 9.1 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "19.4 from weeks 1-3 rates. Not in the score."
	},
	"cam-skattebo": {
		"usage": "Snap 66%. Targets 10%. Carries 55%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 41%. Goal line 60%. Last 3 10%.",
		"script": "Spread -2.5. Total 44.5. Implied 23.5. Pace 58.0.",
		"weather": "Sunday: 8 mph NE. Chance Rain Showers. Not in the score.",
		"opponent": "RB points allowed 9.0 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "12.4 from weeks 1-3 rates. Not in the score."
	},
	"jaylen-waddle": {
		"usage": "Snap 70%. Targets 22%. Carries 1%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 7%. Goal line 8%. Last 3 21%.",
		"script": "Spread -3. Total 48.5. Implied 25.8. Pace 53.7.",
		"weather": "Sunday: 0 to 10 mph NW. Partly Sunny. Not in the score.",
		"opponent": "WR points allowed 7.2 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "9.5 from weeks 1-3 rates. Not in the score."
	},
	"terry-mclaurin": {
		"usage": "Snap 77%. Targets 22%. Carries 0%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 6%. Goal line 13%. Last 3 22%.",
		"script": "Spread -4.5. Total 46.5. Implied 25.5. Pace 65.3.",
		"weather": "Sunday: 3 to 7 mph NE. Rain Showers Likely. Not in the score.",
		"opponent": "WR points allowed 9.3 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "13.9 from weeks 1-3 rates. Not in the score."
	},
	"davante-adams": {
		"usage": "Snap 67%. Targets 25%. Carries 0%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 8%. Goal line 0%. Last 3 26%.",
		"script": "Spread 3.5. Total 42.5. Implied 19.5. Pace 64.7.",
		"weather": "Sunday: 5 to 10 mph NE. Chance Rain Showers. Not in the score.",
		"opponent": "WR points allowed 12.6 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "15.5 from weeks 1-3 rates. Not in the score."
	},
	"luther-burden-iii": {
		"usage": "Snap 64%. Targets 23%. Carries 2%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 16%. Goal line 9%. Last 3 23%. Backup Case Keenum: 34.0 attempts per game, sack rate 0.00. Shadow points moved. Not in the score.",
		"script": "Spread 3.5. Total 43.5. Implied 20.0. Pace 67.7.",
		"weather": "Sunday: 10 to 15 mph WNW. Sunny. Not in the score.",
		"opponent": "WR points allowed 7.3 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "11.2 from weeks 1-3 rates. Not in the score. Backup Case Keenum: 34.0 attempts per game, sack rate 0.00. Shadow points moved. Not in the score."
	},
	"lamar-jackson": {
		"usage": "Snap 100%. Targets 0%. Carries 18%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 14%. Goal line 13%. Last 3 0%.",
		"script": "Spread 11.5. Total 41.5. Implied 15.0. Pace 57.7.",
		"weather": "Sunday: 7 mph NE. Rain Showers Likely. Not in the score.",
		"opponent": "QB points allowed 18.0 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "28.2 from weeks 1-3 rates. Not in the score."
	},
	"quinshon-judkins": {
		"usage": "Snap 61%. Targets 11%. Carries 56%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 33%. Goal line 25%. Last 3 11%.",
		"script": "Spread -2.5. Total 38.5. Implied 20.5. Pace 52.7.",
		"weather": "Missing: Thursday wind was not stored before kickoff. Not in the score.",
		"opponent": "RB points allowed 13.9 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "10.0 from weeks 1-3 rates. Not in the score."
	},
	"dandre-swift": {
		"usage": "Snap 65%. Targets 9%. Carries 51%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 34%. Goal line 55%. Last 3 9%. Backup Case Keenum: 34.0 attempts per game, sack rate 0.00. Shadow points moved. Not in the score.",
		"script": "Spread 3.5. Total 43.5. Implied 20.0. Pace 67.7.",
		"weather": "Sunday: 10 to 15 mph WNW. Sunny. Not in the score.",
		"opponent": "RB points allowed 14.8 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "15.2 from weeks 1-3 rates. Not in the score. Backup Case Keenum: 34.0 attempts per game, sack rate 0.00. Shadow points moved. Not in the score."
	},
	"david-montgomery": {
		"usage": "Snap 55%. Targets 6%. Carries 52%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 36%. Goal line 60%. Last 3 6%.",
		"script": "Spread 3. Total 48.5. Implied 22.8. Pace 63.7.",
		"weather": "Sunday: 10 to 15 mph NE. Chance Showers And Thunderstorms. Not in the score.",
		"opponent": "RB points allowed 10.6 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "11.0 from weeks 1-3 rates. Not in the score."
	},
	"bucky-irving": {
		"usage": "Snap 64%. Targets 15%. Carries 61%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 30%. Goal line 0%. Last 3 16%. Backup Jalon Daniels: 3.0 attempts per game, sack rate 0.00. Shadow points moved. Not in the score.",
		"script": "Spread -3. Total 38.5. Implied 20.8. Pace 55.0.",
		"weather": "Sunday: 7 mph SSE. Mostly Sunny then Isolated Showers And Thunderstorms. Not in the score.",
		"opponent": "RB points allowed 16.8 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "9.2 from weeks 1-3 rates. Not in the score. Backup Jalon Daniels: 3.0 attempts per game, sack rate 0.00. Shadow points moved. Not in the score."
	},
	"jameson-williams": {
		"usage": "Snap 88%. Targets 16%. Carries 0%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 2%. Goal line 0%. Last 3 15%.",
		"script": "Spread 3.5. Total 51.5. Implied 24.0. Pace 64.0.",
		"weather": "Sunday: 2 to 6 mph N. Patchy Fog then Chance Showers And Thunderstorms. Not in the score.",
		"opponent": "WR points allowed 6.8 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "10.3 from weeks 1-3 rates. Not in the score."
	},
	"dj-moore": {
		"usage": "Snap 57%. Targets 21%. Carries 1%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 7%. Goal line 0%. Last 3 22%.",
		"script": "Spread 7. Total 50.5. Implied 21.8. Pace 58.7.",
		"weather": "Sunday: 8 mph S. Mostly Sunny. Not in the score.",
		"opponent": "WR points allowed 7.3 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "10.5 from weeks 1-3 rates. Not in the score."
	},
	"mike-evans": {
		"usage": "Snap 54%. Targets 19%. Carries 0%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 7%. Goal line 11%. Last 3 19%.",
		"script": "Spread 3. Total 48.5. Implied 22.8. Pace 54.3.",
		"weather": "Sunday: 0 to 10 mph NW. Partly Sunny. Not in the score.",
		"opponent": "WR points allowed 11.5 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "8.1 from weeks 1-3 rates. Not in the score."
	},
	"jalen-hurts": {
		"usage": "Snap 97%. Targets 0%. Carries 21%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 12%. Goal line 17%. Last 3 0%.",
		"script": "Spread -3.5. Total 42.5. Implied 23.0. Pace 54.7.",
		"weather": "Sunday: 5 to 10 mph NE. Chance Rain Showers. Not in the score.",
		"opponent": "QB points allowed 18.8 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "22.0 from weeks 1-3 rates. Not in the score."
	},
	"george-kittle": {
		"usage": "Snap 60%. Targets 19%. Carries 0%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 17%. Goal line 0%. Last 3 20%.",
		"script": "Spread 3. Total 48.5. Implied 22.8. Pace 54.3.",
		"weather": "Sunday: 0 to 10 mph NW. Partly Sunny. Not in the score.",
		"opponent": "TE points allowed 6.8 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "10.2 from weeks 1-3 rates. Not in the score."
	},
	"marvin-harrison-jr": {
		"usage": "Snap 77%. Targets 8%. Carries 0%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 0%. Goal line 0%. Last 3 7%.",
		"script": "Spread 2.5. Total 44.5. Implied 21.0. Pace 65.0.",
		"weather": "Sunday: 8 mph NE. Chance Rain Showers. Not in the score.",
		"opponent": "WR points allowed 11.3 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "4.5 from weeks 1-3 rates. Not in the score."
	},
	"brian-thomas-jr": {
		"usage": "Snap 42%. Targets 15%. Carries 0%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 0%. Goal line 0%. Last 3 15%.",
		"script": "Spread -2.5. Total 51.5. Implied 27.0. Pace 55.3.",
		"weather": "Sunday: 0 to 3 mph N. Mostly Sunny. Not in the score.",
		"opponent": "WR points allowed 9.0 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "4.0 from weeks 1-3 rates. Not in the score."
	},
	"tyler-warren": {
		"usage": "Snap 92%. Targets 22%. Carries 2%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 11%. Goal line 17%. Last 3 22%.",
		"script": "Spread 4.5. Total 46.5. Implied 21.0. Pace 60.3.",
		"weather": "Sunday: 3 to 7 mph NE. Rain Showers Likely. Not in the score.",
		"opponent": "TE points allowed 15.6 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "16.6 from weeks 1-3 rates. Not in the score."
	},
	"rhamondre-stevenson": {
		"usage": "Snap 58%. Targets 13%. Carries 36%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 8%. Goal line 25%. Last 3 12%.",
		"script": "Spread -7. Total 50.5. Implied 28.8. Pace 57.0.",
		"weather": "Sunday: 8 mph S. Mostly Sunny. Not in the score.",
		"opponent": "RB points allowed 13.8 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "9.1 from weeks 1-3 rates. Not in the score."
	},
	"xavier-worthy": {
		"usage": "Snap 82%. Targets 15%. Carries 0%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 11%. Goal line 20%. Last 3 15%.",
		"script": "Spread 4.5. Total 47.5. Implied 21.5. Pace 63.0.",
		"weather": "Dome. Weather ignored. Not in the score.",
		"opponent": "WR points allowed 7.6 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "9.9 from weeks 1-3 rates. Not in the score."
	},
	"drake-maye": {
		"usage": "Snap 94%. Targets 0%. Carries 18%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 15%. Goal line 25%. Last 3 0%.",
		"script": "Spread -7. Total 50.5. Implied 28.8. Pace 57.0.",
		"weather": "Sunday: 8 mph S. Mostly Sunny. Not in the score.",
		"opponent": "QB points allowed 29.4 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "16.4 from weeks 1-3 rates. Not in the score."
	},
	"rome-odunze": {
		"usage": "Snap 72%. Targets 13%. Carries 0%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 5%. Goal line 9%. Last 3 13%. Backup Case Keenum: 34.0 attempts per game, sack rate 0.00. Shadow points moved. Not in the score.",
		"script": "Spread 3.5. Total 43.5. Implied 20.0. Pace 67.7.",
		"weather": "Sunday: 10 to 15 mph WNW. Sunny. Not in the score.",
		"opponent": "WR points allowed 7.3 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "7.1 from weeks 1-3 rates. Not in the score. Backup Case Keenum: 34.0 attempts per game, sack rate 0.00. Shadow points moved. Not in the score."
	},
	"jayden-daniels": {
		"usage": "Snap 78%. Targets 0%. Carries 19%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 13%. Goal line 0%. Last 3 thin, fewer than 3 games.",
		"script": "Spread -4.5. Total 46.5. Implied 25.5. Pace 65.3.",
		"weather": "Sunday: 3 to 7 mph NE. Rain Showers Likely. Not in the score.",
		"opponent": "QB points allowed 33.5 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "19.7 from weeks 1-3 rates. Not in the score."
	},
	"joe-burrow": {
		"usage": "Snap 100%. Targets 0%. Carries 12%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 14%. Goal line 0%. Last 3 0%.",
		"script": "Spread 2.5. Total 51.5. Implied 24.5. Pace 57.0.",
		"weather": "Sunday: 0 to 3 mph N. Mostly Sunny. Not in the score.",
		"opponent": "QB points allowed 23.8 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "20.7 from weeks 1-3 rates. Not in the score."
	},
	"sam-laporta": {
		"usage": "Snap 90%. Targets 17%. Carries 0%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 12%. Goal line 17%. Last 3 17%.",
		"script": "Spread 3.5. Total 51.5. Implied 24.0. Pace 64.0.",
		"weather": "Sunday: 2 to 6 mph N. Patchy Fog then Chance Showers And Thunderstorms. Not in the score.",
		"opponent": "TE points allowed 7.8 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "13.4 from weeks 1-3 rates. Not in the score."
	},
	"alvin-kamara": {
		"usage": "Snap 31%. Targets 9%. Carries 33%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 9%. Goal line 0%. Last 3 thin, fewer than 3 games.",
		"script": "Spread 1.5. Total 47.5. Implied 23.0. Pace 70.7.",
		"weather": "Dome. Weather ignored. Not in the score.",
		"opponent": "RB points allowed 5.8 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "4.6 from weeks 1-3 rates. Not in the score."
	},
	"chuba-hubbard": {
		"usage": "Snap 73%. Targets 7%. Carries 61%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 27%. Goal line 44%. Last 3 7%.",
		"script": "Spread -3.5. Total 51.5. Implied 27.5. Pace 63.0.",
		"weather": "Sunday: 2 to 6 mph N. Patchy Fog then Chance Showers And Thunderstorms. Not in the score.",
		"opponent": "RB points allowed 11.4 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "18.0 from weeks 1-3 rates. Not in the score."
	},
	"courtland-sutton": {
		"usage": "Snap 79%. Targets 17%. Carries 0%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 17%. Goal line 8%. Last 3 17%.",
		"script": "Spread -3. Total 48.5. Implied 25.8. Pace 53.7.",
		"weather": "Sunday: 0 to 10 mph NW. Partly Sunny. Not in the score.",
		"opponent": "WR points allowed 7.2 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "8.2 from weeks 1-3 rates. Not in the score."
	},
	"dk-metcalf": {
		"usage": "Snap 96%. Targets 21%. Carries 0%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 8%. Goal line missing from play-by-play. Last 3 21%.",
		"script": "Spread 2.5. Total 38.5. Implied 18.0. Pace 60.3.",
		"weather": "Missing: Thursday wind was not stored before kickoff. Not in the score.",
		"opponent": "WR points allowed 11.7 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "14.6 from weeks 1-3 rates. Not in the score."
	},
	"calvin-ridley": {
		"usage": "Snap 48%. Targets 5%. Carries 0%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 0%. Goal line 0%. Last 3 thin, fewer than 3 games.",
		"script": "Spread -11.5. Total 41.5. Implied 26.5. Pace 50.7.",
		"weather": "Sunday: 7 mph NE. Rain Showers Likely. Not in the score.",
		"opponent": "WR points allowed 11.0 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "1.3 from weeks 1-3 rates. Not in the score."
	},
	"isiah-pacheco": {
		"usage": "Missing: no 2026 skill row in nflverse weekly stats. Not in the score.",
		"script": "Spread 4.5. Total 47.5. Implied 21.5. Pace 63.0.",
		"weather": "Dome. Weather ignored. Not in the score.",
		"opponent": "RB points allowed 8.0 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "No prior games. Not in the score."
	},
	"tony-pollard": {
		"usage": "Snap 53%. Targets 8%. Carries 59%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 31%. Goal line 29%. Last 3 7%.",
		"script": "Spread -11.5. Total 41.5. Implied 26.5. Pace 50.7.",
		"weather": "Sunday: 7 mph NE. Rain Showers Likely. Not in the score.",
		"opponent": "RB points allowed 12.9 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "9.0 from weeks 1-3 rates. Not in the score."
	},
	"rj-harvey": {
		"usage": "Snap 44%. Targets 18%. Carries 13%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 7%. Goal line 8%. Last 3 thin, fewer than 3 games.",
		"script": "Spread -3. Total 48.5. Implied 25.8. Pace 53.7.",
		"weather": "Sunday: 0 to 10 mph NW. Partly Sunny. Not in the score.",
		"opponent": "RB points allowed 14.5 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "5.8 from weeks 1-3 rates. Not in the score."
	},
	"patrick-mahomes": {
		"usage": "Snap 100%. Targets 0%. Carries 11%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 6%. Goal line 0%. Last 3 0%.",
		"script": "Spread 4.5. Total 47.5. Implied 21.5. Pace 63.0.",
		"weather": "Dome. Weather ignored. Not in the score.",
		"opponent": "QB points allowed 23.8 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "25.4 from weeks 1-3 rates. Not in the score."
	},
	"justin-herbert": {
		"usage": "Snap 100%. Targets 0%. Carries 15%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 14%. Goal line 20%. Last 3 0%.",
		"script": "Spread -7. Total 42.5. Implied 24.8. Pace 56.3.",
		"weather": "Sunday: 5 mph NNW. Mostly Sunny. Not in the score.",
		"opponent": "QB points allowed 17.8 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "17.4 from weeks 1-3 rates. Not in the score."
	},
	"jordan-addison": {
		"usage": "Snap 90%. Targets 22%. Carries 0%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 7%. Goal line 0%. Last 3 21%. WR1 Justin Jefferson is Out. Shadow target share 22% to 36%. Not in the score.",
		"script": "Spread 10. Total 38.5. Implied 14.3. Pace 52.7.",
		"weather": "Dome. Weather ignored. Not in the score.",
		"opponent": "WR points allowed 6.2 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "25.1 from weeks 1-3 rates. Not in the score. WR1 Justin Jefferson is Out. Shadow target share 22% to 36%. Not in the score."
	},
	"carnell-tate": {
		"usage": "Snap 84%. Targets 23%. Carries 0%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 4%. Goal line 0%. Last 3 23%.",
		"script": "Spread -11.5. Total 41.5. Implied 26.5. Pace 50.7.",
		"weather": "Sunday: 7 mph NE. Rain Showers Likely. Not in the score.",
		"opponent": "WR points allowed 9.2 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "9.5 from weeks 1-3 rates. Not in the score."
	},
	"jauan-jennings": {
		"usage": "Snap 64%. Targets 6%. Carries 0%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 0%. Goal line 0%. Last 3 thin, fewer than 3 games. WR1 Justin Jefferson is Out. Shadow target share 6% to 9%. Not in the score.",
		"script": "Spread 10. Total 38.5. Implied 14.3. Pace 52.7.",
		"weather": "Dome. Weather ignored. Not in the score.",
		"opponent": "WR points allowed 8.5 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "3.9 from weeks 1-3 rates. Not in the score. WR1 Justin Jefferson is Out. Shadow target share 6% to 9%. Not in the score."
	},
	"dak-prescott": {
		"usage": "Snap 100%. Targets 0%. Carries 14%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 6%. Goal line 0%. Last 3 0%.",
		"script": "Spread -3. Total 48.5. Implied 25.8. Pace 58.0.",
		"weather": "Sunday: 10 to 15 mph NE. Chance Showers And Thunderstorms. Not in the score.",
		"opponent": "QB points allowed 28.1 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "22.3 from weeks 1-3 rates. Not in the score."
	},
	"khalil-shakir": {
		"usage": "Snap 58%. Targets 17%. Carries 0%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 14%. Goal line 8%. Last 3 17%.",
		"script": "Spread 7. Total 50.5. Implied 21.8. Pace 58.7.",
		"weather": "Sunday: 8 mph S. Mostly Sunny. Not in the score.",
		"opponent": "WR points allowed 10.2 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "7.9 from weeks 1-3 rates. Not in the score."
	},
	"ricky-pearsall": {
		"usage": "Missing: no 2026 skill row in nflverse weekly stats. Not in the score.",
		"script": "Spread 3. Total 48.5. Implied 22.8. Pace 54.3.",
		"weather": "Sunday: 0 to 10 mph NW. Partly Sunny. Not in the score.",
		"opponent": "WR points allowed 8.5 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "No prior games. Not in the score."
	},
	"keon-coleman": {
		"usage": "Snap 57%. Targets 10%. Carries 0%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 7%. Goal line 8%. Last 3 10%.",
		"script": "Spread 7. Total 50.5. Implied 21.8. Pace 58.7.",
		"weather": "Sunday: 8 mph S. Mostly Sunny. Not in the score.",
		"opponent": "WR points allowed 10.2 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "5.0 from weeks 1-3 rates. Not in the score."
	},
	"jonathon-brooks": {
		"usage": "Snap 25%. Targets 4%. Carries 20%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 12%. Goal line 0%. Last 3 thin, fewer than 3 games.",
		"script": "Spread -3.5. Total 51.5. Implied 27.5. Pace 63.0.",
		"weather": "Sunday: 2 to 6 mph N. Patchy Fog then Chance Showers And Thunderstorms. Not in the score.",
		"opponent": "RB points allowed 11.4 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "1.7 from weeks 1-3 rates. Not in the score."
	},
	"jerry-jeudy": {
		"usage": "Snap 61%. Targets 10%. Carries 0%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 0%. Goal line 0%. Last 3 thin, fewer than 3 games.",
		"script": "Spread -2.5. Total 38.5. Implied 20.5. Pace 52.7.",
		"weather": "Missing: Thursday wind was not stored before kickoff. Not in the score.",
		"opponent": "WR points allowed 8.2 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "3.6 from weeks 1-3 rates. Not in the score."
	},
	"braelon-allen": {
		"usage": "Snap 41%. Targets 5%. Carries 22%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 26%. Goal line 10%. Last 3 5%.",
		"script": "Spread -3.5. Total 43.5. Implied 23.5. Pace 62.3.",
		"weather": "Sunday: 10 to 15 mph WNW. Sunny. Not in the score.",
		"opponent": "RB points allowed 10.0 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "3.6 from weeks 1-3 rates. Not in the score."
	},
	"jaylen-warren": {
		"usage": "Snap 66%. Targets 12%. Carries 57%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 38%. Goal line missing from play-by-play. Last 3 12%.",
		"script": "Spread 2.5. Total 38.5. Implied 18.0. Pace 60.3.",
		"weather": "Missing: Thursday wind was not stored before kickoff. Not in the score.",
		"opponent": "RB points allowed 8.7 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "14.9 from weeks 1-3 rates. Not in the score."
	},
	"travis-kelce": {
		"usage": "Snap 78%. Targets 18%. Carries 0%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 6%. Goal line 0%. Last 3 17%.",
		"script": "Spread 4.5. Total 47.5. Implied 21.5. Pace 63.0.",
		"weather": "Dome. Weather ignored. Not in the score.",
		"opponent": "TE points allowed 14.5 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "13.7 from weeks 1-3 rates. Not in the score."
	},
	"bo-nix": {
		"usage": "Snap 100%. Targets 0%. Carries 18%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 10%. Goal line 15%. Last 3 0%.",
		"script": "Spread -3. Total 48.5. Implied 25.8. Pace 53.7.",
		"weather": "Sunday: 0 to 10 mph NW. Partly Sunny. Not in the score.",
		"opponent": "QB points allowed 17.8 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "19.7 from weeks 1-3 rates. Not in the score."
	},
	"stefon-diggs": {
		"usage": "Snap 58%. Targets 22%. Carries 0%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 13%. Goal line 13%. Last 3 22%.",
		"script": "Spread -4.5. Total 46.5. Implied 25.5. Pace 65.3.",
		"weather": "Sunday: 3 to 7 mph NE. Rain Showers Likely. Not in the score.",
		"opponent": "WR points allowed 10.5 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "11.8 from weeks 1-3 rates. Not in the score."
	},
	"chris-godwin": {
		"usage": "Snap 78%. Targets 11%. Carries 3%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 0%. Goal line 0%. Last 3 11%. Backup Jalon Daniels: 3.0 attempts per game, sack rate 0.00. Shadow points moved. Not in the score.",
		"script": "Spread -3. Total 38.5. Implied 20.8. Pace 55.0.",
		"weather": "Sunday: 7 mph SSE. Mostly Sunny then Isolated Showers And Thunderstorms. Not in the score.",
		"opponent": "WR points allowed 11.5 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "0.4 from weeks 1-3 rates. Not in the score. Backup Jalon Daniels: 3.0 attempts per game, sack rate 0.00. Shadow points moved. Not in the score."
	},
	"david-njoku": {
		"usage": "Snap 36%. Targets 15%. Carries 0%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 4%. Goal line 0%. Last 3 thin, fewer than 3 games.",
		"script": "Spread -7. Total 42.5. Implied 24.8. Pace 56.3.",
		"weather": "Sunday: 5 mph NNW. Mostly Sunny. Not in the score.",
		"opponent": "TE points allowed 3.9 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "3.1 from weeks 1-3 rates. Not in the score."
	},
	"baker-mayfield": {
		"usage": "Snap 98%. Targets 0%. Carries 17%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 22%. Goal line 0%. Last 3 0%. Backup Jalon Daniels: 3.0 attempts per game, sack rate 0.00. Shadow points moved. Not in the score.",
		"script": "Spread -3. Total 38.5. Implied 20.8. Pace 55.0.",
		"weather": "Sunday: 7 mph SSE. Mostly Sunny then Isolated Showers And Thunderstorms. Not in the score.",
		"opponent": "QB points allowed 22.1 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "19.7 from weeks 1-3 rates. Not in the score."
	},
	"tj-hockenson": {
		"usage": "Snap 73%. Targets 18%. Carries 0%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 13%. Goal line 0%. Last 3 18%.",
		"script": "Spread 10. Total 38.5. Implied 14.3. Pace 52.7.",
		"weather": "Dome. Weather ignored. Not in the score.",
		"opponent": "TE points allowed 8.8 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "10.4 from weeks 1-3 rates. Not in the score."
	},
	"jared-goff": {
		"usage": "Snap 100%. Targets 0%. Carries 11%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 2%. Goal line 0%. Last 3 0%.",
		"script": "Spread 3.5. Total 51.5. Implied 24.0. Pace 64.0.",
		"weather": "Sunday: 2 to 6 mph N. Patchy Fog then Chance Showers And Thunderstorms. Not in the score.",
		"opponent": "QB points allowed 17.2 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "23.2 from weeks 1-3 rates. Not in the score."
	},
	"jakobi-meyers": {
		"usage": "Snap 79%. Targets 14%. Carries 1%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 8%. Goal line 0%. Last 3 13%.",
		"script": "Spread -2.5. Total 51.5. Implied 27.0. Pace 55.3.",
		"weather": "Sunday: 0 to 3 mph N. Mostly Sunny. Not in the score.",
		"opponent": "WR points allowed 5.5 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "9.3 from weeks 1-3 rates. Not in the score."
	},
	"jordan-mason": {
		"usage": "Snap 45%. Targets 0%. Carries 44%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 27%. Goal line 33%. Last 3 thin, fewer than 3 games.",
		"script": "Spread 10. Total 38.5. Implied 14.3. Pace 52.7.",
		"weather": "Dome. Weather ignored. Not in the score.",
		"opponent": "RB points allowed 11.4 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "3.6 from weeks 1-3 rates. Not in the score."
	},
	"tyrone-tracy-jr": {
		"usage": "Snap 2%. Targets 0%. Carries 3%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 0%. Goal line 0%. Last 3 0%.",
		"script": "Spread -2.5. Total 44.5. Implied 23.5. Pace 58.0.",
		"weather": "Sunday: 8 mph NE. Chance Rain Showers. Not in the score.",
		"opponent": "RB points allowed 9.0 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "-0.3 from weeks 1-3 rates. Not in the score."
	},
	"jacory-croskey-merritt": {
		"usage": "Snap 48%. Targets 3%. Carries 49%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 16%. Goal line 13%. Last 3 3%.",
		"script": "Spread -4.5. Total 46.5. Implied 25.5. Pace 65.3.",
		"weather": "Sunday: 3 to 7 mph NE. Rain Showers Likely. Not in the score.",
		"opponent": "RB points allowed 15.6 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "6.5 from weeks 1-3 rates. Not in the score."
	},
	"rico-dowdle": {
		"usage": "Snap 42%. Targets 9%. Carries 34%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 8%. Goal line missing from play-by-play. Last 3 thin, fewer than 3 games.",
		"script": "Spread 2.5. Total 38.5. Implied 18.0. Pace 60.3.",
		"weather": "Missing: Thursday wind was not stored before kickoff. Not in the score.",
		"opponent": "RB points allowed 11.4 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "5.5 from weeks 1-3 rates. Not in the score."
	},
	"deebo-samuel": {
		"usage": "Snap 59%. Targets 13%. Carries 5%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 10%. Goal line 11%. Last 3 13%.",
		"script": "Spread 3. Total 48.5. Implied 22.8. Pace 54.3.",
		"weather": "Sunday: 0 to 10 mph NW. Partly Sunny. Not in the score.",
		"opponent": "WR points allowed 9.3 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "7.0 from weeks 1-3 rates. Not in the score."
	},
	"trevor-lawrence": {
		"usage": "Snap 94%. Targets 0%. Carries 9%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 4%. Goal line 0%. Last 3 0%.",
		"script": "Spread -2.5. Total 51.5. Implied 27.0. Pace 55.3.",
		"weather": "Sunday: 0 to 3 mph N. Mostly Sunny. Not in the score.",
		"opponent": "QB points allowed 29.9 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "20.2 from weeks 1-3 rates. Not in the score."
	},
	"cj-stroud": {
		"usage": "Snap 100%. Targets 0%. Carries 10%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 0%. Goal line 0%. Last 3 0%.",
		"script": "Spread 3. Total 48.5. Implied 22.8. Pace 63.7.",
		"weather": "Sunday: 10 to 15 mph NE. Chance Showers And Thunderstorms. Not in the score.",
		"opponent": "QB points allowed 28.0 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "19.0 from weeks 1-3 rates. Not in the score."
	},
	"kyler-murray": {
		"usage": "Snap 59%. Targets 0%. Carries 7%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 0%. Goal line 0%. Last 3 thin, fewer than 3 games.",
		"script": "Spread 10. Total 38.5. Implied 14.3. Pace 52.7.",
		"weather": "Dome. Weather ignored. Not in the score.",
		"opponent": "QB points allowed 32.4 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "9.8 from weeks 1-3 rates. Not in the score."
	},
	"aaron-jones-sr": {
		"usage": "Snap 69%. Targets 10%. Carries 61%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 27%. Goal line 33%. Last 3 8%.",
		"script": "Spread 10. Total 38.5. Implied 14.3. Pace 52.7.",
		"weather": "Dome. Weather ignored. Not in the score.",
		"opponent": "RB points allowed 11.4 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "11.6 from weeks 1-3 rates. Not in the score."
	},
	"wandale-robinson": {
		"usage": "Snap 66%. Targets 20%. Carries 0%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 12%. Goal line 14%. Last 3 18%.",
		"script": "Spread -11.5. Total 41.5. Implied 26.5. Pace 50.7.",
		"weather": "Sunday: 7 mph NE. Rain Showers Likely. Not in the score.",
		"opponent": "WR points allowed 12.5 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "7.3 from weeks 1-3 rates. Not in the score."
	},
	"michael-pittman-jr": {
		"usage": "Snap 81%. Targets 11%. Carries 0%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 0%. Goal line missing from play-by-play. Last 3 thin, fewer than 3 games.",
		"script": "Spread 2.5. Total 38.5. Implied 18.0. Pace 60.3.",
		"weather": "Missing: Thursday wind was not stored before kickoff. Not in the score.",
		"opponent": "WR points allowed 14.5 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "6.4 from weeks 1-3 rates. Not in the score."
	},
	"brock-purdy": {
		"usage": "Snap 95%. Targets 0%. Carries 13%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 3%. Goal line 11%. Last 3 0%.",
		"script": "Spread 3. Total 48.5. Implied 22.8. Pace 54.3.",
		"weather": "Sunday: 0 to 10 mph NW. Partly Sunny. Not in the score.",
		"opponent": "QB points allowed 24.9 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "26.4 from weeks 1-3 rates. Not in the score."
	},
	"josh-downs": {
		"usage": "Snap 80%. Targets 24%. Carries 0%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 15%. Goal line 0%. Last 3 24%.",
		"script": "Spread 4.5. Total 46.5. Implied 21.0. Pace 60.3.",
		"weather": "Sunday: 3 to 7 mph NE. Rain Showers Likely. Not in the score.",
		"opponent": "WR points allowed 14.5 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "14.1 from weeks 1-3 rates. Not in the score."
	},
	"dallas-goedert": {
		"usage": "Snap 60%. Targets 11%. Carries 0%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 8%. Goal line 0%. Last 3 thin, fewer than 3 games.",
		"script": "Spread -3.5. Total 42.5. Implied 23.0. Pace 54.7.",
		"weather": "Sunday: 5 to 10 mph NE. Chance Rain Showers. Not in the score.",
		"opponent": "TE points allowed 5.5 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "6.0 from weeks 1-3 rates. Not in the score."
	},
	"darnell-mooney": {
		"usage": "Snap 58%. Targets 10%. Carries 1%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 0%. Goal line 0%. Last 3 10%.",
		"script": "Spread -2.5. Total 44.5. Implied 23.5. Pace 58.0.",
		"weather": "Sunday: 8 mph NE. Chance Rain Showers. Not in the score.",
		"opponent": "WR points allowed 8.1 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "4.0 from weeks 1-3 rates. Not in the score."
	},
	"jordan-love": {
		"usage": "Snap 100%. Targets 0%. Carries 4%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 3%. Goal line 0%. Last 3 0%.",
		"script": "Spread 3. Total 38.5. Implied 17.8. Pace 57.3.",
		"weather": "Sunday: 7 mph SSE. Mostly Sunny then Isolated Showers And Thunderstorms. Not in the score.",
		"opponent": "QB points allowed 29.1 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "16.8 from weeks 1-3 rates. Not in the score."
	},
	"caleb-williams": {
		"usage": "Snap 93%. Targets 0%. Carries 21%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 9%. Goal line 9%. Last 3 thin, fewer than 3 games. Backup Case Keenum: 34.0 attempts per game, sack rate 0.00. Shadow points moved. Not in the score.",
		"script": "Spread 3.5. Total 43.5. Implied 20.0. Pace 67.7.",
		"weather": "Sunday: 10 to 15 mph WNW. Sunny. Not in the score.",
		"opponent": "QB points allowed 23.0 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "26.5 from weeks 1-3 rates. Not in the score."
	},
	"zach-charbonnet": {
		"usage": "Missing: no 2026 skill row in nflverse weekly stats. Not in the score.",
		"script": "Spread 7. Total 42.5. Implied 17.8. Pace 58.7.",
		"weather": "Sunday: 5 mph NNW. Mostly Sunny. Not in the score.",
		"opponent": "RB points allowed 11.5 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "No prior games. Not in the score."
	},
	"jaxson-dart": {
		"usage": "Snap 56%. Targets 0%. Carries 19%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 0%. Goal line 0%. Last 3 thin, fewer than 3 games.",
		"script": "Spread -2.5. Total 44.5. Implied 23.5. Pace 58.0.",
		"weather": "Sunday: 8 mph NE. Chance Rain Showers. Not in the score.",
		"opponent": "QB points allowed 30.6 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "14.7 from weeks 1-3 rates. Not in the score."
	},
	"mark-andrews": {
		"usage": "Snap 65%. Targets 24%. Carries 0%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 3%. Goal line 0%. Last 3 24%.",
		"script": "Spread 11.5. Total 41.5. Implied 15.0. Pace 57.7.",
		"weather": "Sunday: 7 mph NE. Rain Showers Likely. Not in the score.",
		"opponent": "TE points allowed 4.6 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "12.2 from weeks 1-3 rates. Not in the score."
	},
	"hunter-henry": {
		"usage": "Snap 79%. Targets 12%. Carries 0%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 8%. Goal line 0%. Last 3 13%.",
		"script": "Spread -7. Total 50.5. Implied 28.8. Pace 57.0.",
		"weather": "Sunday: 8 mph S. Mostly Sunny. Not in the score.",
		"opponent": "TE points allowed 5.3 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "5.4 from weeks 1-3 rates. Not in the score."
	},
	"tucker-kraft": {
		"usage": "Snap 80%. Targets 14%. Carries 0%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 3%. Goal line 0%. Last 3 13%.",
		"script": "Spread 3. Total 38.5. Implied 17.8. Pace 57.3.",
		"weather": "Sunday: 7 mph SSE. Mostly Sunny then Isolated Showers And Thunderstorms. Not in the score.",
		"opponent": "TE points allowed 11.6 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "7.5 from weeks 1-3 rates. Not in the score."
	},
	"jake-ferguson": {
		"usage": "Snap 68%. Targets 10%. Carries 0%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 11%. Goal line 8%. Last 3 10%.",
		"script": "Spread -3. Total 48.5. Implied 25.8. Pace 58.0.",
		"weather": "Sunday: 10 to 15 mph NE. Chance Showers And Thunderstorms. Not in the score.",
		"opponent": "TE points allowed 9.0 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "7.0 from weeks 1-3 rates. Not in the score."
	},
	"jk-dobbins": {
		"usage": "Snap 42%. Targets 2%. Carries 51%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 20%. Goal line 31%. Last 3 2%.",
		"script": "Spread -3. Total 48.5. Implied 25.8. Pace 53.7.",
		"weather": "Sunday: 0 to 10 mph NW. Partly Sunny. Not in the score.",
		"opponent": "RB points allowed 14.5 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "4.4 from weeks 1-3 rates. Not in the score."
	},
	"ray-davis": {
		"usage": "Snap 12%. Targets 0%. Carries 2%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 0%. Goal line 0%. Last 3 thin, fewer than 3 games.",
		"script": "Spread 7. Total 50.5. Implied 21.8. Pace 58.7.",
		"weather": "Sunday: 8 mph S. Mostly Sunny. Not in the score.",
		"opponent": "RB points allowed 7.7 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "-0.2 from weeks 1-3 rates. Not in the score."
	},
	"brandon-aiyuk": {
		"usage": "Missing: no 2026 skill row in nflverse weekly stats. Not in the score.",
		"script": "Spread 3. Total 48.5. Implied 22.8. Pace 54.3.",
		"weather": "Sunday: 0 to 10 mph NW. Partly Sunny. Not in the score.",
		"opponent": "WR points allowed 8.5 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "No prior games. Not in the score."
	},
	"christian-kirk": {
		"usage": "Missing: no 2026 skill row in nflverse weekly stats. Not in the score.",
		"script": "Spread 3. Total 48.5. Implied 22.8. Pace 63.7.",
		"weather": "Sunday: 10 to 15 mph NE. Chance Showers And Thunderstorms. Not in the score.",
		"opponent": "WR points allowed 8.1 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "No prior games. Not in the score."
	},
	"cedric-tillman": {
		"usage": "Missing: no 2026 skill row in nflverse weekly stats. Not in the score.",
		"script": "Spread -2.5. Total 38.5. Implied 20.5. Pace 52.7.",
		"weather": "Missing: Thursday wind was not stored before kickoff. Not in the score.",
		"opponent": "WR points allowed 8.2 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "No prior games. Not in the score."
	},
	"marshawn-lloyd": {
		"usage": "Snap 31%. Targets 5%. Carries 48%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 28%. Goal line 25%. Last 3 5%.",
		"script": "Spread 3. Total 38.5. Implied 17.8. Pace 57.3.",
		"weather": "Sunday: 7 mph SSE. Mostly Sunny then Isolated Showers And Thunderstorms. Not in the score.",
		"opponent": "RB points allowed 9.1 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "3.9 from weeks 1-3 rates. Not in the score."
	},
	"kyle-pitts-sr": {
		"usage": "Snap 53%. Targets 8%. Carries 0%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 0%. Goal line 0%. Last 3 7%.",
		"script": "Spread -1.5. Total 47.5. Implied 24.5. Pace 61.0.",
		"weather": "Dome. Weather ignored. Not in the score.",
		"opponent": "TE points allowed 14.4 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "2.7 from weeks 1-3 rates. Not in the score."
	},
	"evan-engram": {
		"usage": "Snap 58%. Targets 9%. Carries 0%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 3%. Goal line 0%. Last 3 9%.",
		"script": "Spread -3. Total 48.5. Implied 25.8. Pace 53.7.",
		"weather": "Sunday: 0 to 10 mph NW. Partly Sunny. Not in the score.",
		"opponent": "TE points allowed 13.3 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "3.7 from weeks 1-3 rates. Not in the score."
	},
	"tua-tagovailoa": {
		"usage": "Missing: no 2026 skill row in nflverse weekly stats. Not in the score.",
		"script": "Spread -10. Total 38.5. Implied 24.3. Pace 54.3.",
		"weather": "Dome. Weather ignored. Not in the score.",
		"opponent": "QB points allowed 14.9 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "No prior games. Not in the score."
	},
	"matthew-stafford": {
		"usage": "Snap 95%. Targets 0%. Carries 10%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 8%. Goal line 14%. Last 3 0%.",
		"script": "Spread 3.5. Total 42.5. Implied 19.5. Pace 64.7.",
		"weather": "Sunday: 5 to 10 mph NE. Chance Rain Showers. Not in the score.",
		"opponent": "QB points allowed 30.9 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "22.0 from weeks 1-3 rates. Not in the score."
	},
	"cam-ward": {
		"usage": "Snap 100%. Targets 0%. Carries 14%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 15%. Goal line 43%. Last 3 0%.",
		"script": "Spread -11.5. Total 41.5. Implied 26.5. Pace 50.7.",
		"weather": "Sunday: 7 mph NE. Rain Showers Likely. Not in the score.",
		"opponent": "QB points allowed 26.0 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "17.8 from weeks 1-3 rates. Not in the score."
	},
	"jalen-mcmillan": {
		"usage": "Snap 3%. Targets 3%. Carries 0%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 0%. Goal line 0%. Last 3 thin, fewer than 3 games. Backup Jalon Daniels: 3.0 attempts per game, sack rate 0.00. Shadow points moved. Not in the score.",
		"script": "Spread -3. Total 38.5. Implied 20.8. Pace 55.0.",
		"weather": "Sunday: 7 mph SSE. Mostly Sunny then Isolated Showers And Thunderstorms. Not in the score.",
		"opponent": "WR points allowed 11.5 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "-0.1 from weeks 1-3 rates. Not in the score. Backup Jalon Daniels: 3.0 attempts per game, sack rate 0.00. Shadow points moved. Not in the score."
	},
	"hollywood-brown": {
		"usage": "Snap 22%. Targets 0%. Carries 6%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 0%. Goal line 0%. Last 3 thin, fewer than 3 games. WR1 DeVonta Smith is Out. Shadow target share 0% to 0%. Not in the score.",
		"script": "Spread -3.5. Total 42.5. Implied 23.0. Pace 54.7.",
		"weather": "Sunday: 5 to 10 mph NE. Chance Rain Showers. Not in the score.",
		"opponent": "WR points allowed 7.6 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "-0.1 from weeks 1-3 rates. Not in the score. WR1 DeVonta Smith is Out. Shadow target share 0% to 0%. Not in the score."
	},
	"xavier-legette": {
		"usage": "Snap 52%. Targets 8%. Carries 0%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 3%. Goal line 0%. Last 3 thin, fewer than 3 games.",
		"script": "Spread -3.5. Total 51.5. Implied 27.5. Pace 63.0.",
		"weather": "Sunday: 2 to 6 mph N. Patchy Fog then Chance Showers And Thunderstorms. Not in the score.",
		"opponent": "WR points allowed 11.5 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "3.2 from weeks 1-3 rates. Not in the score."
	},
	"justin-fields": {
		"usage": "Missing: no 2026 skill row in nflverse weekly stats. Not in the score.",
		"script": "Spread -3.5. Total 43.5. Implied 23.5. Pace 62.3.",
		"weather": "Sunday: 10 to 15 mph WNW. Sunny. Not in the score.",
		"opponent": "QB points allowed 16.6 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "No prior games. Not in the score."
	},
	"nick-chubb": {
		"usage": "Missing: no 2026 skill row in nflverse weekly stats. Not in the score.",
		"script": "Spread 3. Total 48.5. Implied 22.8. Pace 63.7.",
		"weather": "Sunday: 10 to 15 mph NE. Chance Showers And Thunderstorms. Not in the score.",
		"opponent": "RB points allowed 10.6 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "No prior games. Not in the score."
	},
	"tank-bigsby": {
		"usage": "Snap 16%. Targets 3%. Carries 18%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 12%. Goal line 17%. Last 3 3%.",
		"script": "Spread -3.5. Total 42.5. Implied 23.0. Pace 54.7.",
		"weather": "Sunday: 5 to 10 mph NE. Chance Rain Showers. Not in the score.",
		"opponent": "RB points allowed 8.4 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "0.8 from weeks 1-3 rates. Not in the score."
	},
	"tyler-allgeier": {
		"usage": "Snap 53%. Targets 7%. Carries 31%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 17%. Goal line 11%. Last 3 7%.",
		"script": "Spread 2.5. Total 44.5. Implied 21.0. Pace 65.0.",
		"weather": "Sunday: 8 mph NE. Chance Rain Showers. Not in the score.",
		"opponent": "RB points allowed 12.0 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "6.0 from weeks 1-3 rates. Not in the score."
	},
	"kenyon-sadiq": {
		"usage": "Snap 45%. Targets 14%. Carries 1%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 4%. Goal line 10%. Last 3 14%.",
		"script": "Spread -3.5. Total 43.5. Implied 23.5. Pace 62.3.",
		"weather": "Sunday: 10 to 15 mph WNW. Sunny. Not in the score.",
		"opponent": "TE points allowed 4.5 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "5.4 from weeks 1-3 rates. Not in the score."
	},
	"jordyn-tyson": {
		"usage": "Missing: no 2026 skill row in nflverse weekly stats. Not in the score.",
		"script": "Spread 1.5. Total 47.5. Implied 23.0. Pace 70.7.",
		"weather": "Dome. Weather ignored. Not in the score.",
		"opponent": "WR points allowed 11.5 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "No prior games. Not in the score."
	},
	"makai-lemon": {
		"usage": "Snap 66%. Targets 10%. Carries 1%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 0%. Goal line 0%. Last 3 11%. WR1 DeVonta Smith is Out. Shadow target share 10% to 20%. Not in the score.",
		"script": "Spread -3.5. Total 42.5. Implied 23.0. Pace 54.7.",
		"weather": "Sunday: 5 to 10 mph NE. Chance Rain Showers. Not in the score.",
		"opponent": "WR points allowed 9.0 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "8.2 from weeks 1-3 rates. Not in the score. WR1 DeVonta Smith is Out. Shadow target share 10% to 20%. Not in the score."
	},
	"dezhaun-stribling": {
		"usage": "Missing: no 2026 skill row in nflverse weekly stats. Not in the score.",
		"script": "Spread 3. Total 48.5. Implied 22.8. Pace 54.3.",
		"weather": "Sunday: 0 to 10 mph NW. Partly Sunny. Not in the score.",
		"opponent": "WR points allowed 8.5 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "No prior games. Not in the score."
	},
	"jadarian-price": {
		"usage": "Snap 37%. Targets 7%. Carries 35%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 8%. Goal line 7%. Last 3 8%.",
		"script": "Spread 7. Total 42.5. Implied 17.8. Pace 58.7.",
		"weather": "Sunday: 5 mph NNW. Mostly Sunny. Not in the score.",
		"opponent": "RB points allowed 8.7 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "4.0 from weeks 1-3 rates. Not in the score."
	},
	"parker-washington": {
		"usage": "Snap 74%. Targets 28%. Carries 0%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 12%. Goal line 0%. Last 3 28%.",
		"script": "Spread -2.5. Total 51.5. Implied 27.0. Pace 55.3.",
		"weather": "Sunday: 0 to 3 mph N. Mostly Sunny. Not in the score.",
		"opponent": "WR points allowed 9.0 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "16.1 from weeks 1-3 rates. Not in the score."
	},
	"brenton-strange": {
		"usage": "Snap 76%. Targets 12%. Carries 0%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 8%. Goal line 0%. Last 3 12%.",
		"script": "Spread -2.5. Total 51.5. Implied 27.0. Pace 55.3.",
		"weather": "Sunday: 0 to 3 mph N. Mostly Sunny. Not in the score.",
		"opponent": "TE points allowed 13.3 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "7.2 from weeks 1-3 rates. Not in the score."
	},
	"isaiah-likely": {
		"usage": "Snap 67%. Targets 28%. Carries 0%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 18%. Goal line 20%. Last 3 27%.",
		"script": "Spread -2.5. Total 44.5. Implied 23.5. Pace 58.0.",
		"weather": "Sunday: 8 mph NE. Chance Rain Showers. Not in the score.",
		"opponent": "TE points allowed 4.6 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "14.8 from weeks 1-3 rates. Not in the score."
	},
	"dalton-kincaid": {
		"usage": "Snap 68%. Targets 20%. Carries 0%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 4%. Goal line 0%. Last 3 19%.",
		"script": "Spread 7. Total 50.5. Implied 21.8. Pace 58.7.",
		"weather": "Sunday: 8 mph S. Mostly Sunny. Not in the score.",
		"opponent": "TE points allowed 4.3 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "13.5 from weeks 1-3 rates. Not in the score."
	},
	"tyler-shough": {
		"usage": "Snap 100%. Targets 0%. Carries 18%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 14%. Goal line 20%. Last 3 0%.",
		"script": "Spread 1.5. Total 47.5. Implied 23.0. Pace 70.7.",
		"weather": "Dome. Weather ignored. Not in the score.",
		"opponent": "QB points allowed 20.6 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "29.7 from weeks 1-3 rates. Not in the score."
	},
	"geno-smith": {
		"usage": "Snap 100%. Targets 0%. Carries 15%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 4%. Goal line 0%. Last 3 0%.",
		"script": "Spread -3.5. Total 43.5. Implied 23.5. Pace 62.3.",
		"weather": "Sunday: 10 to 15 mph WNW. Sunny. Not in the score.",
		"opponent": "QB points allowed 14.4 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "22.0 from weeks 1-3 rates. Not in the score."
	},
	"michael-penix-jr": {
		"usage": "Snap 100%. Targets 0%. Carries 5%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 0%. Goal line 0%. Last 3 thin, fewer than 3 games.",
		"script": "Spread -1.5. Total 47.5. Implied 24.5. Pace 61.0.",
		"weather": "Dome. Weather ignored. Not in the score.",
		"opponent": "QB points allowed 26.4 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "19.3 from weeks 1-3 rates. Not in the score."
	},
	"jj-mccarthy": {
		"usage": "Missing: no 2026 skill row in nflverse weekly stats. Not in the score.",
		"script": "Spread 10. Total 38.5. Implied 14.3. Pace 52.7.",
		"weather": "Dome. Weather ignored. Not in the score.",
		"opponent": "QB points allowed 23.1 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "No prior games. Not in the score."
	},
	"sam-darnold": {
		"usage": "Snap 55%. Targets 0%. Carries 3%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 0%. Goal line 0%. Last 3 thin, fewer than 3 games.",
		"script": "Spread 7. Total 42.5. Implied 17.8. Pace 58.7.",
		"weather": "Sunday: 5 mph NNW. Mostly Sunny. Not in the score.",
		"opponent": "QB points allowed 27.9 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "12.6 from weeks 1-3 rates. Not in the score."
	},
	"fernando-mendoza": {
		"usage": "Missing: no 2026 skill row in nflverse weekly stats. Not in the score.",
		"script": "Spread 4.5. Total 46.5. Implied 21.0. Pace 60.3.",
		"weather": "Sunday: 3 to 7 mph NE. Rain Showers Likely. Not in the score.",
		"opponent": "QB points allowed 39.9 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "No prior games. Not in the score."
	},
	"dylan-sampson": {
		"usage": "Snap 0%. Targets 0%. Carries 0%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 0%. Goal line 0%. Last 3 thin, fewer than 3 games.",
		"script": "Spread -2.5. Total 38.5. Implied 20.5. Pace 52.7.",
		"weather": "Missing: Thursday wind was not stored before kickoff. Not in the score.",
		"opponent": "RB points allowed 13.9 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "0.0 from weeks 1-3 rates. Not in the score."
	},
	"broncos-dst": {
		"usage": "Missing: no 2026 skill row in nflverse weekly stats. Not in the score.",
		"script": "Spread -3. Total 48.5. Implied 25.8. Pace 53.7.",
		"weather": "Sunday: 0 to 10 mph NW. Partly Sunny. Not in the score.",
		"opponent": "Mykel Williams DE Out (interior run defender); James Thompson Jr. DT Out (interior run defender); Nick Bosa DE Out (interior run defender). Practice participation is not in the ESPN injury feed. Not in the score.",
		"brain": "No prior games. Not in the score."
	},
	"ravens-dst": {
		"usage": "Missing: no 2026 skill row in nflverse weekly stats. Not in the score.",
		"script": "Spread 11.5. Total 41.5. Implied 15.0. Pace 57.7.",
		"weather": "Sunday: 7 mph NE. Rain Showers Likely. Not in the score.",
		"opponent": "No opposing shadow corner, tackle, or interior defender listed Out. Practice participation is not in the ESPN injury feed. Not in the score.",
		"brain": "No prior games. Not in the score."
	},
	"steelers-dst": {
		"usage": "Missing: no 2026 skill row in nflverse weekly stats. Not in the score.",
		"script": "Spread 2.5. Total 38.5. Implied 18.0. Pace 60.3.",
		"weather": "Missing: Thursday wind was not stored before kickoff. Not in the score.",
		"opponent": "No opposing shadow corner, tackle, or interior defender listed Out. Practice participation is not in the ESPN injury feed. Not in the score.",
		"brain": "No prior games. Not in the score."
	},
	"vikings-dst": {
		"usage": "Missing: no 2026 skill row in nflverse weekly stats. Not in the score.",
		"script": "Spread 10. Total 38.5. Implied 14.3. Pace 52.7.",
		"weather": "Dome. Weather ignored. Not in the score.",
		"opponent": "Robert Beal Jr. DE Out (interior run defender); Storm Duck CB Out (shadow corner). Practice participation is not in the ESPN injury feed. Not in the score.",
		"brain": "No prior games. Not in the score."
	},
	"eagles-dst": {
		"usage": "Missing: no 2026 skill row in nflverse weekly stats. Not in the score.",
		"script": "Spread -3.5. Total 42.5. Implied 23.0. Pace 54.7.",
		"weather": "Sunday: 5 to 10 mph NE. Chance Rain Showers. Not in the score.",
		"opponent": "Jaylen Watson CB Out (shadow corner); Aaron Donald DT Out (interior run defender). Practice participation is not in the ESPN injury feed. Not in the score.",
		"brain": "No prior games. Not in the score."
	},
	"49ers-dst": {
		"usage": "Missing: no 2026 skill row in nflverse weekly stats. Not in the score.",
		"script": "Spread 3. Total 48.5. Implied 22.8. Pace 54.3.",
		"weather": "Sunday: 0 to 10 mph NW. Partly Sunny. Not in the score.",
		"opponent": "No opposing shadow corner, tackle, or interior defender listed Out. Practice participation is not in the ESPN injury feed. Not in the score.",
		"brain": "No prior games. Not in the score."
	},
	"packers-dst": {
		"usage": "Missing: no 2026 skill row in nflverse weekly stats. Not in the score.",
		"script": "Spread 3. Total 38.5. Implied 17.8. Pace 57.3.",
		"weather": "Sunday: 7 mph SSE. Mostly Sunny then Isolated Showers And Thunderstorms. Not in the score.",
		"opponent": "Benjamin Morrison CB Out (shadow corner). Practice participation is not in the ESPN injury feed. Not in the score.",
		"brain": "No prior games. Not in the score."
	},
	"texans-dst": {
		"usage": "Missing: no 2026 skill row in nflverse weekly stats. Not in the score.",
		"script": "Spread 3. Total 48.5. Implied 22.8. Pace 63.7.",
		"weather": "Sunday: 10 to 15 mph NE. Chance Showers And Thunderstorms. Not in the score.",
		"opponent": "Cobie Durant CB Out (shadow corner). Practice participation is not in the ESPN injury feed. Not in the score.",
		"brain": "No prior games. Not in the score."
	},
	"bills-dst": {
		"usage": "Missing: no 2026 skill row in nflverse weekly stats. Not in the score.",
		"script": "Spread 7. Total 50.5. Implied 21.8. Pace 58.7.",
		"weather": "Sunday: 8 mph S. Mostly Sunny. Not in the score.",
		"opponent": "Channing Canada CB Out (shadow corner); Christian Barmore DT Out (interior run defender); Christian Gonzalez CB Out (shadow corner). Practice participation is not in the ESPN injury feed. Not in the score.",
		"brain": "No prior games. Not in the score."
	},
	"seahawks-dst": {
		"usage": "Missing: no 2026 skill row in nflverse weekly stats. Not in the score.",
		"script": "Spread 7. Total 42.5. Implied 17.8. Pace 58.7.",
		"weather": "Sunday: 5 mph NNW. Mostly Sunny. Not in the score.",
		"opponent": "Dalvin Tomlinson DT Out (interior run defender). Practice participation is not in the ESPN injury feed. Not in the score.",
		"brain": "No prior games. Not in the score."
	},
	"lions-dst": {
		"usage": "Missing: no 2026 skill row in nflverse weekly stats. Not in the score.",
		"script": "Spread 3.5. Total 51.5. Implied 24.0. Pace 64.0.",
		"weather": "Sunday: 2 to 6 mph N. Patchy Fog then Chance Showers And Thunderstorms. Not in the score.",
		"opponent": "No opposing shadow corner, tackle, or interior defender listed Out. Practice participation is not in the ESPN injury feed. Not in the score.",
		"brain": "No prior games. Not in the score."
	},
	"chargers-dst": {
		"usage": "Missing: no 2026 skill row in nflverse weekly stats. Not in the score.",
		"script": "Spread -7. Total 42.5. Implied 24.8. Pace 56.3.",
		"weather": "Sunday: 5 mph NNW. Mostly Sunny. Not in the score.",
		"opponent": "No opposing shadow corner, tackle, or interior defender listed Out. Practice participation is not in the ESPN injury feed. Not in the score.",
		"brain": "No prior games. Not in the score."
	},
	"patriots-dst": {
		"usage": "Missing: no 2026 skill row in nflverse weekly stats. Not in the score.",
		"script": "Spread -7. Total 50.5. Implied 28.8. Pace 57.0.",
		"weather": "Sunday: 8 mph S. Mostly Sunny. Not in the score.",
		"opponent": "No opposing shadow corner, tackle, or interior defender listed Out. Practice participation is not in the ESPN injury feed. Not in the score.",
		"brain": "No prior games. Not in the score."
	},
	"chiefs-dst": {
		"usage": "Missing: no 2026 skill row in nflverse weekly stats. Not in the score.",
		"script": "Spread 4.5. Total 47.5. Implied 21.5. Pace 63.0.",
		"weather": "Dome. Weather ignored. Not in the score.",
		"opponent": "No opposing shadow corner, tackle, or interior defender listed Out. Practice participation is not in the ESPN injury feed. Not in the score.",
		"brain": "No prior games. Not in the score."
	},
	"rams-dst": {
		"usage": "Missing: no 2026 skill row in nflverse weekly stats. Not in the score.",
		"script": "Spread 3.5. Total 42.5. Implied 19.5. Pace 64.7.",
		"weather": "Sunday: 5 to 10 mph NE. Chance Rain Showers. Not in the score.",
		"opponent": "Fred Johnson OT Out (starting tackle). Practice participation is not in the ESPN injury feed. Not in the score.",
		"brain": "No prior games. Not in the score."
	},
	"jaguars-dst": {
		"usage": "Missing: no 2026 skill row in nflverse weekly stats. Not in the score.",
		"script": "Spread -2.5. Total 51.5. Implied 27.0. Pace 55.3.",
		"weather": "Sunday: 0 to 3 mph N. Mostly Sunny. Not in the score.",
		"opponent": "No opposing shadow corner, tackle, or interior defender listed Out. Practice participation is not in the ESPN injury feed. Not in the score.",
		"brain": "No prior games. Not in the score."
	},
	"mike-washington-jr": {
		"usage": "Snap 18%. Targets 1%. Carries 16%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 6%. Goal line 0%. Last 3 1%.",
		"script": "Spread -4.5. Total 47.5. Implied 26.0. Pace 61.7.",
		"weather": "Dome. Weather ignored. Not in the score.",
		"opponent": "RB points allowed 9.1 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "0.8 from weeks 1-3 rates. Not in the score."
	},
	"jonah-coleman": {
		"usage": "Snap 23%. Targets 5%. Carries 23%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 10%. Goal line 8%. Last 3 thin, fewer than 3 games.",
		"script": "Spread -3. Total 48.5. Implied 25.8. Pace 53.7.",
		"weather": "Sunday: 0 to 10 mph NW. Partly Sunny. Not in the score.",
		"opponent": "RB points allowed 11.5 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "1.9 from weeks 1-3 rates. Not in the score."
	},
	"blake-corum": {
		"usage": "Snap 32%. Targets 4%. Carries 35%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 4%. Goal line 0%. Last 3 3%.",
		"script": "Spread 3.5. Total 42.5. Implied 19.5. Pace 64.7.",
		"weather": "Sunday: 5 to 10 mph NE. Chance Rain Showers. Not in the score.",
		"opponent": "RB points allowed 10.7 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "3.6 from weeks 1-3 rates. Not in the score."
	},
	"bhayshul-tuten": {
		"usage": "Snap 49%. Targets 6%. Carries 51%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 28%. Goal line 43%. Last 3 6%.",
		"script": "Spread -2.5. Total 51.5. Implied 27.0. Pace 55.3.",
		"weather": "Sunday: 0 to 3 mph N. Mostly Sunny. Not in the score.",
		"opponent": "RB points allowed 8.4 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "8.4 from weeks 1-3 rates. Not in the score."
	},
	"woody-marks": {
		"usage": "Snap 45%. Targets 7%. Carries 31%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 23%. Goal line 20%. Last 3 6%.",
		"script": "Spread 3. Total 48.5. Implied 22.8. Pace 63.7.",
		"weather": "Sunday: 10 to 15 mph NE. Chance Showers And Thunderstorms. Not in the score.",
		"opponent": "RB points allowed 10.6 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "5.6 from weeks 1-3 rates. Not in the score."
	},
	"isaac-guerendo": {
		"usage": "Missing: no 2026 skill row in nflverse weekly stats. Not in the score.",
		"script": "Spread 3. Total 48.5. Implied 22.8. Pace 54.3.",
		"weather": "Sunday: 0 to 10 mph NW. Partly Sunny. Not in the score.",
		"opponent": "RB points allowed 12.8 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "No prior games. Not in the score."
	},
	"justice-hill": {
		"usage": "Snap 42%. Targets 4%. Carries 13%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 0%. Goal line 0%. Last 3 3%.",
		"script": "Spread 11.5. Total 41.5. Implied 15.0. Pace 57.7.",
		"weather": "Sunday: 7 mph NE. Rain Showers Likely. Not in the score.",
		"opponent": "RB points allowed 12.1 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "2.0 from weeks 1-3 rates. Not in the score."
	},
	"kimani-vidal": {
		"usage": "Snap 18%. Targets 5%. Carries 2%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 4%. Goal line 0%. Last 3 thin, fewer than 3 games.",
		"script": "Spread -7. Total 42.5. Implied 24.8. Pace 56.3.",
		"weather": "Sunday: 5 mph NNW. Mostly Sunny. Not in the score.",
		"opponent": "RB points allowed 9.0 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "0.3 from weeks 1-3 rates. Not in the score."
	},
	"roschon-johnson": {
		"usage": "Snap 0%. Targets 0%. Carries 0%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 0%. Goal line 0%. Last 3 thin, fewer than 3 games. Backup Case Keenum: 34.0 attempts per game, sack rate 0.00. Shadow points moved. Not in the score.",
		"script": "Spread 3.5. Total 43.5. Implied 20.0. Pace 67.7.",
		"weather": "Sunday: 10 to 15 mph WNW. Sunny. Not in the score.",
		"opponent": "RB points allowed 14.8 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "0.0 from weeks 1-3 rates. Not in the score. Backup Case Keenum: 34.0 attempts per game, sack rate 0.00. Shadow points moved. Not in the score."
	},
	"jaydon-blue": {
		"usage": "Missing: no 2026 skill row in nflverse weekly stats. Not in the score.",
		"script": "Spread -3. Total 48.5. Implied 25.8. Pace 58.0.",
		"weather": "Sunday: 10 to 15 mph NE. Chance Showers And Thunderstorms. Not in the score.",
		"opponent": "RB points allowed 8.2 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "No prior games. Not in the score."
	},
	"adonai-mitchell": {
		"usage": "Snap 75%. Targets 23%. Carries 0%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 4%. Goal line 0%. Last 3 thin, fewer than 3 games.",
		"script": "Spread -3.5. Total 43.5. Implied 23.5. Pace 62.3.",
		"weather": "Sunday: 10 to 15 mph WNW. Sunny. Not in the score.",
		"opponent": "WR points allowed 14.5 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "13.3 from weeks 1-3 rates. Not in the score."
	},
	"troy-franklin": {
		"usage": "Snap 24%. Targets 4%. Carries 1%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 3%. Goal line 0%. Last 3 4%.",
		"script": "Spread -3. Total 48.5. Implied 25.8. Pace 53.7.",
		"weather": "Sunday: 0 to 10 mph NW. Partly Sunny. Not in the score.",
		"opponent": "WR points allowed 7.2 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "0.6 from weeks 1-3 rates. Not in the score."
	},
	"jalen-coker": {
		"usage": "Snap 65%. Targets 18%. Carries 0%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 15%. Goal line 11%. Last 3 19%.",
		"script": "Spread -3.5. Total 51.5. Implied 27.5. Pace 63.0.",
		"weather": "Sunday: 2 to 6 mph N. Patchy Fog then Chance Showers And Thunderstorms. Not in the score.",
		"opponent": "WR points allowed 11.5 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "10.4 from weeks 1-3 rates. Not in the score."
	},
	"kc-concepcion": {
		"usage": "Snap 74%. Targets 24%. Carries 5%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 10%. Goal line 0%. Last 3 24%.",
		"script": "Spread -2.5. Total 38.5. Implied 20.5. Pace 52.7.",
		"weather": "Missing: Thursday wind was not stored before kickoff. Not in the score.",
		"opponent": "WR points allowed 7.5 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "10.4 from weeks 1-3 rates. Not in the score."
	},
	"omar-cooper-jr": {
		"usage": "Snap 7%. Targets 4%. Carries 0%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 0%. Goal line 0%. Last 3 thin, fewer than 3 games.",
		"script": "Spread -3.5. Total 43.5. Implied 23.5. Pace 62.3.",
		"weather": "Sunday: 10 to 15 mph WNW. Sunny. Not in the score.",
		"opponent": "WR points allowed 14.5 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "0.1 from weeks 1-3 rates. Not in the score."
	},
	"denzel-boston": {
		"usage": "Snap 91%. Targets 18%. Carries 0%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 19%. Goal line 25%. Last 3 18%.",
		"script": "Spread -2.5. Total 38.5. Implied 20.5. Pace 52.7.",
		"weather": "Missing: Thursday wind was not stored before kickoff. Not in the score.",
		"opponent": "WR points allowed 9.0 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "13.9 from weeks 1-3 rates. Not in the score."
	},
	"chris-bell": {
		"usage": "Snap 55%. Targets 12%. Carries 0%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 0%. Goal line 0%. Last 3 10%.",
		"script": "Spread -10. Total 38.5. Implied 24.3. Pace 54.3.",
		"weather": "Dome. Weather ignored. Not in the score.",
		"opponent": "WR points allowed 7.6 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "3.5 from weeks 1-3 rates. Not in the score."
	},
	"ted-hurst": {
		"usage": "Snap 75%. Targets 13%. Carries 0%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 9%. Goal line 0%. Last 3 13%. Backup Jalon Daniels: 3.0 attempts per game, sack rate 0.00. Shadow points moved. Not in the score.",
		"script": "Spread -3. Total 38.5. Implied 20.8. Pace 55.0.",
		"weather": "Sunday: 7 mph SSE. Mostly Sunny then Isolated Showers And Thunderstorms. Not in the score.",
		"opponent": "WR points allowed 8.1 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "0.6 from weeks 1-3 rates. Not in the score. Backup Jalon Daniels: 3.0 attempts per game, sack rate 0.00. Shadow points moved. Not in the score."
	},
	"cade-otton": {
		"usage": "Snap 94%. Targets 17%. Carries 0%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 9%. Goal line 0%. Last 3 17%. Backup Jalon Daniels: 3.0 attempts per game, sack rate 0.00. Shadow points moved. Not in the score.",
		"script": "Spread -3. Total 38.5. Implied 20.8. Pace 55.0.",
		"weather": "Sunday: 7 mph SSE. Mostly Sunny then Isolated Showers And Thunderstorms. Not in the score.",
		"opponent": "TE points allowed 3.9 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "0.9 from weeks 1-3 rates. Not in the score. Backup Jalon Daniels: 3.0 attempts per game, sack rate 0.00. Shadow points moved. Not in the score."
	},
	"pat-freiermuth": {
		"usage": "Snap 66%. Targets 12%. Carries 3%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 15%. Goal line missing from play-by-play. Last 3 12%.",
		"script": "Spread 2.5. Total 38.5. Implied 18.0. Pace 60.3.",
		"weather": "Missing: Thursday wind was not stored before kickoff. Not in the score.",
		"opponent": "TE points allowed 7.0 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "6.7 from weeks 1-3 rates. Not in the score."
	},
	"dalton-schultz": {
		"usage": "Snap 63%. Targets 21%. Carries 0%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 5%. Goal line 0%. Last 3 19%.",
		"script": "Spread 3. Total 48.5. Implied 22.8. Pace 63.7.",
		"weather": "Sunday: 10 to 15 mph NE. Chance Showers And Thunderstorms. Not in the score.",
		"opponent": "TE points allowed 9.5 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "10.2 from weeks 1-3 rates. Not in the score."
	},
	"juwan-johnson": {
		"usage": "Snap 66%. Targets 14%. Carries 0%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 17%. Goal line 20%. Last 3 14%.",
		"script": "Spread 1.5. Total 47.5. Implied 23.0. Pace 70.7.",
		"weather": "Dome. Weather ignored. Not in the score.",
		"opponent": "TE points allowed 8.1 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "10.8 from weeks 1-3 rates. Not in the score."
	},
	"tyler-higbee": {
		"usage": "Snap 45%. Targets 16%. Carries 0%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 8%. Goal line 14%. Last 3 thin, fewer than 3 games.",
		"script": "Spread 3.5. Total 42.5. Implied 19.5. Pace 64.7.",
		"weather": "Sunday: 5 to 10 mph NE. Chance Rain Showers. Not in the score.",
		"opponent": "TE points allowed 4.0 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "6.0 from weeks 1-3 rates. Not in the score."
	},
	"noah-fant": {
		"usage": "Snap 47%. Targets 9%. Carries 0%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 9%. Goal line 10%. Last 3 8%.",
		"script": "Spread 1.5. Total 47.5. Implied 23.0. Pace 70.7.",
		"weather": "Dome. Weather ignored. Not in the score.",
		"opponent": "TE points allowed 7.3 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "4.9 from weeks 1-3 rates. Not in the score."
	},
	"chig-okonkwo": {
		"usage": "Snap 56%. Targets 9%. Carries 0%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 0%. Goal line 0%. Last 3 thin, fewer than 3 games.",
		"script": "Spread -4.5. Total 46.5. Implied 25.5. Pace 65.3.",
		"weather": "Sunday: 3 to 7 mph NE. Rain Showers Likely. Not in the score.",
		"opponent": "TE points allowed 5.7 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "4.0 from weeks 1-3 rates. Not in the score."
	},
	"taysom-hill": {
		"usage": "Missing: no 2026 skill row in nflverse weekly stats. Not in the score.",
		"script": "Spread 1.5. Total 47.5. Implied 23.0. Pace 70.7.",
		"weather": "Dome. Weather ignored. Not in the score.",
		"opponent": "TE points allowed 8.1 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "No prior games. Not in the score."
	},
	"matthew-golden": {
		"usage": "Snap 83%. Targets 24%. Carries 0%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 14%. Goal line 0%. Last 3 24%.",
		"script": "Spread 3. Total 38.5. Implied 17.8. Pace 57.3.",
		"weather": "Sunday: 7 mph SSE. Mostly Sunny then Isolated Showers And Thunderstorms. Not in the score.",
		"opponent": "WR points allowed 7.5 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "14.6 from weeks 1-3 rates. Not in the score."
	},
	"jayden-reed": {
		"usage": "Snap 30%. Targets 11%. Carries 0%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 3%. Goal line 0%. Last 3 thin, fewer than 3 games.",
		"script": "Spread 3. Total 38.5. Implied 17.8. Pace 57.3.",
		"weather": "Sunday: 7 mph SSE. Mostly Sunny then Isolated Showers And Thunderstorms. Not in the score.",
		"opponent": "WR points allowed 7.5 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "2.1 from weeks 1-3 rates. Not in the score."
	},
	"dontayvion-wicks": {
		"usage": "Snap 80%. Targets 17%. Carries 0%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 16%. Goal line 17%. Last 3 17%. WR1 DeVonta Smith is Out. Shadow target share 17% to 34%. Not in the score.",
		"script": "Spread -3.5. Total 42.5. Implied 23.0. Pace 54.7.",
		"weather": "Sunday: 5 to 10 mph NE. Chance Rain Showers. Not in the score.",
		"opponent": "WR points allowed 7.5 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "21.2 from weeks 1-3 rates. Not in the score. WR1 DeVonta Smith is Out. Shadow target share 17% to 34%. Not in the score."
	},
	"romeo-doubs": {
		"usage": "Snap 65%. Targets 13%. Carries 0%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 8%. Goal line 0%. Last 3 13%.",
		"script": "Spread -7. Total 50.5. Implied 28.8. Pace 57.0.",
		"weather": "Sunday: 8 mph S. Mostly Sunny. Not in the score.",
		"opponent": "WR points allowed 7.5 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "5.2 from weeks 1-3 rates. Not in the score."
	},
	"keenan-allen": {
		"usage": "Snap 64%. Targets 20%. Carries 0%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 11%. Goal line 0%. Last 3 20%.",
		"script": "Spread 4.5. Total 46.5. Implied 21.0. Pace 60.3.",
		"weather": "Sunday: 3 to 7 mph NE. Rain Showers Likely. Not in the score.",
		"opponent": "WR points allowed 7.3 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "9.5 from weeks 1-3 rates. Not in the score."
	},
	"cooper-kupp": {
		"usage": "Snap 63%. Targets 10%. Carries 0%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 3%. Goal line 0%. Last 3 10%.",
		"script": "Spread 7. Total 42.5. Implied 17.8. Pace 58.7.",
		"weather": "Sunday: 5 mph NNW. Mostly Sunny. Not in the score.",
		"opponent": "WR points allowed 9.0 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "6.0 from weeks 1-3 rates. Not in the score."
	},
	"amari-cooper": {
		"usage": "Missing: no 2026 skill row in nflverse weekly stats. Not in the score.",
		"script": "Spread -4.5. Total 47.5. Implied 26.0. Pace 61.7.",
		"weather": "Dome. Weather ignored. Not in the score.",
		"opponent": "WR points allowed 5.5 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "No prior games. Not in the score."
	},
	"michael-carter": {
		"usage": "Missing: no 2026 skill row in nflverse weekly stats. Not in the score.",
		"script": "Spread 2.5. Total 44.5. Implied 21.0. Pace 65.0.",
		"weather": "Sunday: 8 mph NE. Chance Rain Showers. Not in the score.",
		"opponent": "RB points allowed 14.4 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "No prior games. Not in the score."
	},
	"diontae-johnson": {
		"usage": "Missing: no 2026 skill row in nflverse weekly stats. Not in the score.",
		"script": "Spread -2.5. Total 38.5. Implied 20.5. Pace 52.7.",
		"weather": "Missing: Thursday wind was not stored before kickoff. Not in the score.",
		"opponent": "WR points allowed 8.2 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "No prior games. Not in the score."
	},
	"rashid-shaheed": {
		"usage": "Snap 56%. Targets 13%. Carries 1%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 3%. Goal line 0%. Last 3 14%.",
		"script": "Spread 7. Total 42.5. Implied 17.8. Pace 58.7.",
		"weather": "Sunday: 5 mph NNW. Mostly Sunny. Not in the score.",
		"opponent": "WR points allowed 11.5 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "5.2 from weeks 1-3 rates. Not in the score."
	},
	"marvin-mims-jr": {
		"usage": "Snap 18%. Targets 0%. Carries 0%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 0%. Goal line 0%. Last 3 thin, fewer than 3 games.",
		"script": "Spread -3. Total 48.5. Implied 25.8. Pace 53.7.",
		"weather": "Sunday: 0 to 10 mph NW. Partly Sunny. Not in the score.",
		"opponent": "WR points allowed 7.2 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "-0.1 from weeks 1-3 rates. Not in the score."
	},
	"deandre-hopkins": {
		"usage": "Missing: no 2026 skill row in nflverse weekly stats. Not in the score.",
		"script": "Spread 11.5. Total 41.5. Implied 15.0. Pace 57.7.",
		"weather": "Sunday: 7 mph NE. Rain Showers Likely. Not in the score.",
		"opponent": "WR points allowed 8.6 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "No prior games. Not in the score."
	},
	"adam-thielen": {
		"usage": "Missing: no 2026 skill row in nflverse weekly stats. Not in the score.",
		"script": "Spread 10. Total 38.5. Implied 14.3. Pace 52.7.",
		"weather": "Dome. Weather ignored. Not in the score.",
		"opponent": "WR points allowed 6.2 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "No prior games. Not in the score."
	},
	"tyler-lockett": {
		"usage": "Missing: no 2026 skill row in nflverse weekly stats. Not in the score.",
		"script": "Spread -11.5. Total 41.5. Implied 26.5. Pace 50.7.",
		"weather": "Sunday: 7 mph NE. Rain Showers Likely. Not in the score.",
		"opponent": "WR points allowed 11.0 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "No prior games. Not in the score."
	},
	"quentin-johnston": {
		"usage": "Snap 82%. Targets 19%. Carries 1%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 0%. Goal line 0%. Last 3 19%.",
		"script": "Spread -7. Total 42.5. Implied 24.8. Pace 56.3.",
		"weather": "Sunday: 5 mph NNW. Mostly Sunny. Not in the score.",
		"opponent": "WR points allowed 5.6 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "8.5 from weeks 1-3 rates. Not in the score."
	},
	"joshua-palmer": {
		"usage": "Missing: no 2026 skill row in nflverse weekly stats. Not in the score.",
		"script": "Spread -7. Total 42.5. Implied 24.8. Pace 56.3.",
		"weather": "Sunday: 5 mph NNW. Mostly Sunny. Not in the score.",
		"opponent": "WR points allowed 5.6 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "No prior games. Not in the score."
	},
	"treveyon-henderson": {
		"usage": "Snap 49%. Targets 2%. Carries 44%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 8%. Goal line 0%. Last 3 thin, fewer than 3 games.",
		"script": "Spread -7. Total 50.5. Implied 28.8. Pace 57.0.",
		"weather": "Sunday: 8 mph S. Mostly Sunny. Not in the score.",
		"opponent": "RB points allowed 13.8 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "6.5 from weeks 1-3 rates. Not in the score."
	},
	"kareem-hunt": {
		"usage": "Missing: no 2026 skill row in nflverse weekly stats. Not in the score.",
		"script": "Spread 4.5. Total 47.5. Implied 21.5. Pace 63.0.",
		"weather": "Dome. Weather ignored. Not in the score.",
		"opponent": "RB points allowed 8.0 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "No prior games. Not in the score."
	},
	"najee-harris": {
		"usage": "Snap 18%. Targets 0%. Carries 24%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 14%. Goal line 20%. Last 3 thin, fewer than 3 games.",
		"script": "Spread -2.5. Total 44.5. Implied 23.5. Pace 58.0.",
		"weather": "Sunday: 8 mph NE. Chance Rain Showers. Not in the score.",
		"opponent": "RB points allowed 9.0 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "0.7 from weeks 1-3 rates. Not in the score."
	},
	"austin-ekeler": {
		"usage": "Missing: no 2026 skill row in nflverse weekly stats. Not in the score.",
		"script": "Spread -4.5. Total 46.5. Implied 25.5. Pace 65.3.",
		"weather": "Sunday: 3 to 7 mph NE. Rain Showers Likely. Not in the score.",
		"opponent": "RB points allowed 15.6 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "No prior games. Not in the score."
	},
	"tyjae-spears": {
		"usage": "Snap 44%. Targets 7%. Carries 20%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 4%. Goal line 0%. Last 3 8%.",
		"script": "Spread -11.5. Total 41.5. Implied 26.5. Pace 50.7.",
		"weather": "Sunday: 7 mph NE. Rain Showers Likely. Not in the score.",
		"opponent": "RB points allowed 12.9 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "3.3 from weeks 1-3 rates. Not in the score."
	},
	"jaylen-wright": {
		"usage": "Snap 6%. Targets 0%. Carries 7%. Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps. Red zone 11%. Goal line 0%. Last 3 thin, fewer than 3 games.",
		"script": "Spread -10. Total 38.5. Implied 24.3. Pace 54.3.",
		"weather": "Dome. Weather ignored. Not in the score.",
		"opponent": "RB points allowed 8.9 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "-0.2 from weeks 1-3 rates. Not in the score."
	},
	"jawhar-jordan": {
		"usage": "Missing: no 2026 skill row in nflverse weekly stats. Not in the score.",
		"script": "Spread 3. Total 48.5. Implied 22.8. Pace 63.7.",
		"weather": "Sunday: 10 to 15 mph NE. Chance Showers And Thunderstorms. Not in the score.",
		"opponent": "RB points allowed 10.6 after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.",
		"brain": "No prior games. Not in the score."
	}
};
function usageOf(features) {
	return {
		snap: features.snap * 100,
		route: features.routeShare * 100,
		targetShare: features.targetShare * 100,
		rushShare: features.carryShare * 100,
		rzShare: features.rzShare * 100
	};
}
function roleLine(p) {
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
function confidenceOf(p) {
	let c = 1;
	if (p.status === "IR" || p.status === "O" || p.status === "SSPD") return .55;
	if (p.status === "D") c -= .18;
	if (p.status === "Q") c -= .1;
	if (p.pos === "RB" && p.usage < 58) c -= .12;
	if (p.pos === "RB" && p.age >= 29) c -= .08;
	if (p.pos === "WR" && p.age >= 32) c -= .08;
	if (p.health < 70) c -= .1;
	if (p.rook) c -= .08;
	if (p.news?.toLowerCase().includes("new")) c -= .1;
	return clamp(c, .55, 1);
}
function confidenceLabel(c, weeklyGap) {
	if (weeklyGap !== void 0 && Math.abs(weeklyGap) < 1.5) return "Coin-flip";
	if (c >= .86) return "High";
	if (c >= .7) return "Med";
	return "Coin-flip";
}
function cardBadges(p, week, slate, shadowRow) {
	const usage = shadowRow?.usage ?? "";
	const snap = usage.match(/Snap ([^.]+)/)?.[1] ?? "missing";
	const targets = usage.match(/Targets ([^.]+)/)?.[1] ?? "missing";
	const goal = usage.match(/Goal line ([^.]+)/)?.[1] ?? "missing";
	const now = teamImplied(slate);
	const recent = ownRecentImplied(p.team, [
		week - 3,
		week - 2,
		week - 1
	].filter((value) => value >= 1));
	const total = now == null || recent == null ? "Team total missing." : `Team total ${now.toFixed(1)} vs last three ${recent.toFixed(1)}.`;
	const freeze = FREEZE_ROWS.find((row) => row.week === week);
	return [
		{
			name: "Badges",
			value: `Snap ${snap}. Targets ${targets}. Goal line ${goal}. ${total}`
		},
		{
			name: "Brain",
			value: "disabled, validation failed."
		},
		{
			name: "Rest of season",
			value: "Thin. Own trailing mean times games left. Bye is 0. No star mean. The odd-week shrink weight is not on this number."
		},
		{
			name: "Provenance",
			value: `Model ${STORED_WEIGHTS.version}. Weights ${STORED_WEIGHTS.usageLast3.toFixed(2)}. Freeze ${freeze?.at ?? "STALE"}. Odds freeze STALE. Injury freeze STALE. B1 disabled. It lost to the trailing average and is not a bar.`
		}
	];
}
function toPlayerState(p, week = CURRENT_WEEK) {
	const slate = slateFor(p.team, week);
	const onBye = slate ? slate.bye : p.bye === week;
	const out = p.status === "O" || p.status === "IR" || p.status === "SSPD" || onBye;
	const trail = trailOf(p.id);
	const live = cardUsesBrain();
	const brain = projectFromRaw(p, week);
	const shadowRow = SHADOW[p.id];
	const card = live ? {
		p20: brain.range.p20,
		p50: brain.range.p50,
		p80: brain.range.p80,
		ePts: brain.points
	} : trail.kind === "none" || out ? {
		p20: 0,
		p50: 0,
		p80: 0,
		ePts: 0
	} : {
		p20: round1(trail.floor),
		p50: round1(trail.mean),
		p80: round1(trail.ceiling),
		ePts: round1(trail.mean)
	};
	const weekly = card;
	const ros = trail.kind === "none" || live ? {
		...card,
		ePts: live ? brain.points * 16 : 0,
		p20: live ? brain.range.p20 * 16 : 0,
		p50: live ? brain.points * 16 : 0,
		p80: live ? brain.range.p80 * 16 : 0,
		weeksLeft: 16
	} : thinRos(p.team, card, week, 17);
	const c = out ? .55 : confidenceOf(p);
	const label = trail.kind === "thin" || !live ? "Med" : confidenceLabel(c);
	const reason = trail.kind === "none" ? trail.reason : out ? `BASELINE. ${onBye ? "Bye." : "Out."} Not started.` : trail.kind === "thin" ? `BASELINE. Thin, ${trail.points.length} scored week${trail.points.length === 1 ? "" : "s"}: ${trail.points.join(", ")}.${trail.reason.startsWith("joined as") ? ` ${trail.reason}.` : ""}` : `BASELINE. Last three pregame weeks ${trail.points.join(", ")}.`;
	const rosNote = trail.kind === "none" || out ? "" : ` ROS thin: own mean × ${ros.weeksLeft} games, bye 0.`;
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
		shadow: cardBadges(p, week, slate, shadowRow)
	};
}
function attachVor(players) {
	const byPos = /* @__PURE__ */ new Map();
	for (const p of players) {
		const list = byPos.get(p.pos) ?? [];
		list.push(p);
		byPos.set(p.pos, list);
	}
	for (const [pos, list] of byPos) {
		const rosSorted = [...list].sort((a, b) => b.ros.ePts - a.ros.ePts);
		const weekSorted = [...list].sort((a, b) => b.weekly.ePts - a.weekly.ePts);
		const rosIdx = Math.min(rosSorted.length - 1, Math.max(0, REPLACEMENT_RANK[pos] - 1));
		const weekIdx = Math.min(weekSorted.length - 1, Math.max(0, Math.round(REPLACEMENT_RANK[pos] * .55) - 1));
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
function playerMap(players) {
	return new Map(players.map((p) => [p.id, p]));
}
function gradeTrade(you, them, weekYou) {
	let letter = "C";
	if (you >= 8 && weekYou >= -.5) letter = "A";
	else if (you >= 4 && weekYou >= -1.5) letter = "B";
	else if (you >= 1) letter = "C";
	else if (you >= -3) letter = "D";
	else letter = "F";
	let verdict = "Decline";
	if (you >= 3 && them >= -10) verdict = "Accept";
	else if (you >= 2 && them >= -6) verdict = "Send";
	else if (you > 0) verdict = "Counter";
	return {
		letter,
		verdict
	};
}
function sideVor(roster, ir, mode) {
	return optimalLineup(roster, ir, mode).starters.reduce((s, seat) => s + (seat.player?.rosVor ?? 0), 0);
}
function evaluateTrade(me, partner, players, giveIds, getIds, mode, ctx) {
	const mine = teamPlayers(me, players).filter((p) => !me.ir.includes(p.id));
	const theirs = teamPlayers(partner, players).filter((p) => !partner.ir.includes(p.id));
	const give = giveIds.map((id) => players.get(id)).filter((p) => Boolean(p));
	const get = getIds.map((id) => players.get(id)).filter((p) => Boolean(p));
	if ([...give, ...get].some((player) => player.trail === "none")) return {
		you: 0,
		them: 0,
		weekYou: 0,
		nra: 0,
		fair: false,
		cut: null,
		consolidation: 0,
		letter: "F",
		verdict: "Decline",
		why: "NO TRAIL. Off the trade grade."
	};
	const myBefore = sideVor(mine, me.ir, mode);
	const theirBefore = sideVor(theirs, partner.ir, mode);
	const weekBefore = optimalLineup(mine, me.ir, mode).projected;
	let myAfterRoster = [...mine.filter((p) => !giveIds.includes(p.id)), ...get];
	let theirAfterRoster = [...theirs.filter((p) => !getIds.includes(p.id)), ...give];
	let cut = null;
	if (myAfterRoster.length > 18) {
		cut = [...myAfterRoster].sort((a, b) => a.rosVor - b.rosVor)[0] ?? null;
		if (cut) myAfterRoster = myAfterRoster.filter((p) => p.id !== cut.id);
	}
	if (theirAfterRoster.length > 18) {
		const theirCut = [...theirAfterRoster].sort((a, b) => a.rosVor - b.rosVor)[0];
		if (theirCut) theirAfterRoster = theirAfterRoster.filter((p) => p.id !== theirCut.id);
	}
	const myAfter = sideVor(myAfterRoster, me.ir, mode);
	const theirAfter = sideVor(theirAfterRoster, partner.ir, mode);
	const weekAfter = optimalLineup(myAfterRoster, me.ir, mode).projected;
	const bestReceived = get.slice().sort((a, b) => b.rosVor - a.rosVor)[0];
	const bestSent = give.slice().sort((a, b) => b.rosVor - a.rosVor)[0];
	const youConsol = get.length < give.length && bestReceived ? CONSOLIDATION_BONUS * Math.max(0, bestReceived.rosVor) : 0;
	const themConsol = give.length < get.length && bestSent ? CONSOLIDATION_BONUS * Math.max(0, bestSent.rosVor) : 0;
	const you = round1(myAfter - myBefore - (cut ? Math.max(0, cut.rosVor) * .25 : 0) + youConsol);
	const them = round1(theirAfter - theirBefore + themConsol);
	const weekYou = round1(weekAfter - weekBefore);
	const nra = round1(you - them);
	const combined = Math.abs(you) + Math.abs(them) + 1;
	const fair = Math.abs(nra) <= TRADE_FAIR_BAND * combined;
	const graded = gradeTrade(you, them, weekYou);
	const beforePos = /* @__PURE__ */ new Map();
	const afterPos = /* @__PURE__ */ new Map();
	for (const seat of optimalLineup(mine, me.ir, mode).starters) if (seat.player) beforePos.set(seat.player.pos, (beforePos.get(seat.player.pos) ?? 0) + 1);
	for (const seat of optimalLineup(myAfterRoster, me.ir, mode).starters) if (seat.player) afterPos.set(seat.player.pos, (afterPos.get(seat.player.pos) ?? 0) + 1);
	const thinner = [
		"QB",
		"RB",
		"WR",
		"TE"
	].some((pos) => (afterPos.get(pos) ?? 0) < (beforePos.get(pos) ?? 0));
	if (ctx?.partnerTop3 && thinner) {
		graded.verdict = "Decline";
		if (graded.letter === "A" || graded.letter === "B" || graded.letter === "C") graded.letter = "D";
	}
	const why = [
		`${graded.letter} · ${graded.verdict}.`,
		ctx?.partnerTop3 && thinner ? "Rejected: they are top 3 in points and this thins a starting position. Heuristic." : "",
		`Rest-of-season lineup ${you >= 0 ? "+" : ""}${you.toFixed(1)} for you, ${them >= 0 ? "+" : ""}${them.toFixed(1)} for them.`,
		`This week ${weekYou >= 0 ? "+" : ""}${weekYou.toFixed(1)}.`,
		cut ? `You would have to cut ${cut.name}.` : fair ? "Inside the 8% fair band. Heuristic." : "Outside the 8% fair band. Heuristic, so counter before you accept."
	].filter(Boolean).join(" ");
	return {
		you,
		them,
		weekYou,
		nra,
		fair,
		cut,
		consolidation: round1(youConsol),
		...graded,
		why
	};
}
function findTrades(me, league, players, mode) {
	const myAssets = [...teamPlayers(me, players).filter((p) => !me.ir.includes(p.id) && p.pos !== "DST" && p.trail !== "none")].sort((a, b) => b.rosVor - a.rosVor).slice(0, 8);
	const top3 = new Set([...league.teams].sort((a, b) => b.pf - a.pf).slice(0, 3).map((t) => t.id));
	const ideas = [];
	for (const partner of league.teams.filter((t) => t.id !== me.id)) {
		const theirAssets = [...teamPlayers(partner, players).filter((p) => !partner.ir.includes(p.id) && p.pos !== "DST" && p.trail !== "none")].sort((a, b) => b.rosVor - a.rosVor).slice(0, 6);
		for (const get of theirAssets) for (const give of myAssets) {
			if (give.pos === get.pos && Math.abs(give.rosVor - get.rosVor) < 4) continue;
			const evald = evaluateTrade(me, partner, players, [give.id], [get.id], mode, { partnerTop3: top3.has(partner.id) });
			const worthWeek = evald.weekYou > -1.5 || evald.you > 8;
			if (evald.you > 2 && evald.them > -8 && worthWeek && evald.verdict !== "Decline") ideas.push({
				partner,
				give: [give],
				get: [get],
				eval: evald
			});
		}
	}
	return ideas.sort((a, b) => b.eval.you - a.eval.you || Math.abs(a.eval.nra) - Math.abs(b.eval.nra)).slice(0, 5);
}
function availablePlayers(league, players) {
	const rostered = new Set(league.teams.flatMap((t) => [...t.roster, ...t.ir]));
	return [...players.values()].filter((p) => !rostered.has(p.id));
}
function posCount(roster, pos) {
	return roster.filter((p) => p.pos === pos).length;
}
function canAdd(roster, add, drop) {
	return posCount(drop ? roster.filter((p) => p.id !== drop.id) : roster, add.pos) + 1 <= ROSTER_MAX[add.pos === "DST" ? "dst" : add.pos === "QB" ? "qb" : add.pos === "RB" ? "rb" : add.pos === "WR" ? "wr" : "te"];
}
function weekScore(player, week) {
	if (player.trail === "none") return 0;
	if (player.status === "O" || player.status === "IR" || player.status === "SSPD") return 0;
	if (slateFor(player.nflTeam, week)?.bye || player.bye === week) return 0;
	return player.weekly.ePts;
}
function rosterPoints(roster, ir, mode, week) {
	let unpriced = false;
	const adjusted = roster.map((player) => {
		const pts = weekScore(player, week);
		if (pts == null) unpriced = true;
		const n = pts ?? 0;
		const bye = slateFor(player.nflTeam, week)?.bye || player.bye === week;
		return {
			...player,
			status: bye ? "Bye" : player.status,
			weekly: {
				...player.weekly,
				ePts: n,
				p20: n * .72,
				p50: n,
				p80: n * 1.35
			}
		};
	});
	if (unpriced) return null;
	return optimalLineup(adjusted, ir, mode).projected;
}
function lineupPoints(roster, ir, mode) {
	return optimalLineup(roster, ir, mode).projected;
}
function lineupRos(roster, ir, mode) {
	return optimalLineup(roster, ir, mode).starters.reduce((sum, seat) => sum + (seat.player?.ros.ePts ?? 0), 0);
}
function waiverTargets(team, league, players, mode) {
	const mine = teamPlayers(team, players).filter((p) => !team.ir.includes(p.id));
	const wireNames = new Set((league.freeAgents ?? []).map((p) => normalizeName(p.name)));
	const dropped = new Set((league.activity ?? []).filter((a) => a.status === "EXECUTED").flatMap((a) => a.moves.filter((m) => m.action === "DROP").map((m) => normalizeName(m.name))));
	let available = availablePlayers(league, players);
	if (wireNames.size) {
		const onWire = available.filter((p) => wireNames.has(normalizeName(p.name)) || p.pos === "DST");
		if (onWire.length) available = onWire;
	}
	lineupPoints(mine, team.ir, mode);
	const baseRos = lineupRos(mine, team.ir, mode);
	const priorityCost = PRIORITY_COST[team.waivers] ?? 1;
	const claims = [];
	const dropCandidates = [...mine].filter((p) => p.trail !== "none" && !p.undroppable && p.status !== "IR" && p.status !== "O").sort((a, b) => a.weekly.ePts - b.weekly.ePts || a.rosVor - b.rosVor);
	for (const add of available.slice().sort((a, b) => b.weekly.ePts - a.weekly.ePts || b.adjVor - a.adjVor).slice(0, 50)) {
		if (add.trail === "none") continue;
		if (add.source !== "counting" && add.pos !== "DST" && add.adp12 > 140) continue;
		const drop = mine.length >= 18 ? dropCandidates.find((d) => d.id !== add.id && canAdd(mine, add, d) && d.weekly.ePts <= add.weekly.ePts + 1) ?? null : null;
		if (mine.length >= 18 && !drop) continue;
		if (drop?.undroppable) continue;
		const nextRoster = drop ? [...mine.filter((p) => p.id !== drop.id), add] : [...mine, add];
		lineupPoints(nextRoster, team.ir, mode);
		const rosDelta = lineupRos(nextRoster, team.ir, mode) - baseRos;
		const legs = [
			0,
			1,
			2
		].map((i) => {
			const week = league.week + i;
			const withAdd = rosterPoints(nextRoster, team.ir, mode, week);
			const without = rosterPoints(mine, team.ir, mode, week);
			if (withAdd == null || without == null) return null;
			return withAdd - without;
		});
		const priced = legs.filter((n) => n != null);
		const weekDelta = priced.reduce((s, n) => s + n, 0);
		const oneWeek = priced.length === 1 || legs[0] != null && legs[0] > 1 && (legs[1] ?? 0) < .4 && (legs[2] ?? 0) < .4;
		let claimValue = round1(weekDelta * 1.6 + rosDelta * .06 - priorityCost * .35);
		const fresh = dropped.has(normalizeName(add.name));
		if (fresh) claimValue = round1(claimValue + 1.5);
		const stream = oneWeek || add.pos === "DST" && priced.filter((d) => d > 0).length < 3;
		if (claimValue < .4 && !stream && !fresh) continue;
		const advice = fresh && weekDelta >= 2 ? "Burn" : add.pos === "RB" && add.adjVor > 25 && team.waivers <= 2 ? "Burn" : stream || team.waivers <= 3 && weekDelta < 3 && rosDelta < 8 ? "Wait" : weekDelta >= 2 ? "Burn" : "Wait";
		const slateNote = [
			0,
			1,
			2
		].map((i) => {
			const week = league.week + i;
			const slate = slateFor(add.nflTeam, week);
			if (!slate) return `W${week} no slate`;
			if (slate.bye) return `W${week} bye`;
			return `W${week} ${slate.home ? "vs" : "@"} ${slate.opp} total ${slate.total ?? "n/a"} spread ${slate.spread ?? "n/a"}`;
		}).join(". ");
		claims.push({
			player: add,
			drop: drop && mine.length >= 18 ? drop : null,
			claimValue,
			weekPts: round1(add.weekly.ePts),
			rosVor: add.rosVor,
			priorityCost,
			advice,
			stream,
			reason: `${stream ? "Stream. " : ""}${fresh ? "Just dropped. " : ""}${slateNote}. Priced weeks ${weekDelta >= 0 ? "+" : ""}${weekDelta.toFixed(1)} versus the trailing average, rest-of-season ${rosDelta >= 0 ? "+" : ""}${rosDelta.toFixed(1)}${drop ? ` after cutting ${drop.name}` : ""}.`
		});
	}
	return claims.sort((a, b) => b.claimValue - a.claimValue).slice(0, 8);
}
function claimFactorSensitivity(players) {
	const lists = [
		.4,
		.55,
		.7
	].map((factor) => players.filter((player) => player.trail !== "none" && player.pos !== "DST").map((player) => {
		const mates = players.filter((row) => row.pos === player.pos && row.trail !== "none").sort((a, b) => b.weekly.ePts - a.weekly.ePts);
		const index = Math.min(mates.length - 1, Math.max(0, Math.round(REPLACEMENT_RANK[player.pos] * factor) - 1));
		return {
			id: player.id,
			value: player.weekly.ePts - (mates[index]?.weekly.ePts ?? 0)
		};
	}).sort((a, b) => b.value - a.value).slice(0, 10).map((row) => row.id).join("|"));
	const moved = new Set(lists).size > 1;
	return {
		moved,
		note: moved ? "Top 10 claims move between 40 and 70 percent. The 55 percent factor stays off FLEX and OP." : "Top 10 claims do not move between 40 and 70 percent. The 55 percent factor stays heuristic and off the slot fill."
	};
}
function buildPool(extra = []) {
	const ids = new Set(PLAYERS.map((p) => p.id));
	return attachVor([...PLAYERS, ...extra.filter((p) => !ids.has(p.id))].map((p) => toPlayerState(p)));
}
function buildDesk(input) {
	const players = buildPool(input.extra);
	const map = playerMap(players);
	const league = input.league;
	const me = league.teams.find((t) => t.id === input.myTeamId) ?? league.teams.find((t) => t.isYou);
	const mine = me ? teamPlayers(me, map) : [];
	const matchup = league.matchups.find((m) => m.week === league.week && (m.homeId === me?.id || m.awayId === me?.id));
	const opponent = matchup ? league.teams.find((t) => t.id === (matchup.homeId === me?.id ? matchup.awayId : matchup.homeId)) : void 0;
	const theirs = opponent ? teamPlayers(opponent, map) : [];
	const locked = input.keeperLocked ?? league.keepersLocked ?? true;
	const selected = locked && me?.keepers.length ? [...me.keepers] : input.selectedKeepers.length ? input.selectedKeepers : league.keepersLocked ? [...DEFAULT_KEEPER_IDS] : [];
	const evals0 = me ? eligibleFor(me, map) : [];
	const evals = applySelection(evals0, selected);
	const pairs = rankPairs(evals0);
	const selectedPair = pairs.find((p) => selected.includes(p.a.player.id) && selected.includes(p.b.player.id)) ?? pairs[0] ?? null;
	const a = evals.find((e) => e.player.id === selected[0]);
	const b = evals.find((e) => e.player.id === selected[1]);
	const gate = a && b ? legalPair(a, b) : {
		ok: false,
		why: "Select two keepers of different positions."
	};
	const keeperOff = new Set(allKeptIds(league));
	for (const id of selected) keeperOff.add(id);
	const rostered = new Set(league.teams.flatMap((t) => [...t.roster, ...t.ir]));
	const taken = /* @__PURE__ */ new Set([...input.takenManual, ...keeperOff]);
	const available = players.filter((p) => !taken.has(p.id));
	const keptMine = mine.filter((p) => selected.includes(p.id));
	const assigned = {
		...me?.keeperCost ?? {},
		...Object.fromEntries(evals.filter((e) => selected.includes(e.player.id)).map((e) => [e.player.id, e.assigned]))
	};
	if (locked && me) for (const [id, round] of Object.entries(me.keeperCost)) assigned[id] = round;
	const board = me ? draftBoard(available, me, keptMine, selected, 9, assigned) : {
		recs: [],
		holes: null,
		next: null,
		onClock: false,
		burned: []
	};
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
	const trades = me ? findTrades(me, league, map, mode) : [];
	const chip = freezeChip(league.espnLeagueId || "1014874", league.week);
	const moves = me ? lineupMoves(me, lineup, map) : [];
	const espnProj = me ? espnPoints(me, map) : null;
	const spread = rangeOf(lineup);
	const oppSpread = rangeOf(theirFinal);
	const win = slateWinProb(lineup, theirFinal);
	const espnWin = matchupWin(espnProj ?? lineup.projected, theirFinal.projected, spread, oppSpread);
	const phase = league.source === "espn" && mine.length > 8 ? "season" : phaseNow();
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
		win
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
		trades,
		moves,
		brainChip: chip,
		baseline: "BASELINE",
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
		keepersLocked: locked
	};
}
function useDesk() {
	const league = useBush((s) => s.league);
	const myTeamId = useBush((s) => s.myTeamId);
	const extra = useBush((s) => s.extraPlayers);
	const selectedKeepers = useBush((s) => s.selectedKeepers);
	const takenManual = useBush((s) => s.takenManual);
	const hideTaken = useBush((s) => s.hideTaken);
	const mode = useBush((s) => s.lineupMode);
	const espn = useBush((s) => s.espn);
	const view = useBush((s) => s.view);
	const pins = useBush((s) => s.pins);
	const notes = useBush((s) => s.notes);
	const keeperLocked = useBush((s) => s.keeperLocked);
	return {
		...(0, import_react.useMemo)(() => buildDesk({
			league,
			myTeamId,
			extra,
			selectedKeepers,
			takenManual,
			hideTaken,
			mode,
			espnConnected: league.source === "espn",
			view,
			keeperLocked: keeperLocked || league.keepersLocked
		}), [
			league,
			myTeamId,
			extra,
			selectedKeepers,
			takenManual,
			hideTaken,
			mode,
			view,
			keeperLocked
		]),
		pins,
		notes,
		espn
	};
}
//#endregion
export { useDesk as a, evaluateTrade as i, claimFactorSensitivity as n, copyToLm as r, Badge as t };

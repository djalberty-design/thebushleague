import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { D as cn, b as TRADE_DEADLINE_AT } from "./league-BHDWdH1h.mjs";
import { n as useBush } from "./router-C2UZVP6N.mjs";
import { a as CardTitle, i as CardHeader, n as CardBody, o as PageHeader, r as CardDesc, t as Card } from "./card-Dm6C-zs6.mjs";
import { t as Button } from "./createSsrRpc-kaWDhsSj.mjs";
import { a as useDesk, i as evaluateTrade, t as Badge } from "./use-desk-RllCwzEH.mjs";
import { t as OsBrief } from "./brief-BvjivZIc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/trades-BpJERCJj.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function TradesPage() {
	const { me, mine, trades, map, opponent, league, mode } = useDesk();
	const partnerId = useBush((s) => s.tradePartnerId);
	const giveIds = useBush((s) => s.giveIds);
	const getIds = useBush((s) => s.getIds);
	const setTrade = useBush((s) => s.setTrade);
	const closed = Date.now() > TRADE_DEADLINE_AT;
	const partner = league.teams.find((t) => t.id === partnerId) ?? opponent ?? league.teams.find((t) => !t.isYou);
	const theirRoster = (0, import_react.useMemo)(() => {
		if (!partner) return [];
		return partner.roster.map((id) => map.get(id)).filter(Boolean);
	}, [partner, map]);
	const top3 = new Set([...league.teams].sort((a, b) => b.pf - a.pf).slice(0, 3).map((t) => t.id));
	const evald = me && partner && giveIds.length && getIds.length ? evaluateTrade(me, partner, map, giveIds, getIds, mode, { partnerTop3: top3.has(partner.id) }) : null;
	function toggle(list, id) {
		if (!partner) return;
		if (list === "give") {
			const next = giveIds.includes(id) ? giveIds.filter((x) => x !== id) : [...giveIds, id].slice(0, 3);
			setTrade(partner.id, next, getIds);
		} else {
			const next = getIds.includes(id) ? getIds.filter((x) => x !== id) : [...getIds, id].slice(0, 3);
			setTrade(partner.id, giveIds, next);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			kicker: "No review period · deadline Dec 4, 3:00 AM",
			title: "Trades",
			desc: "Every one-for-one is scored on your lineup for the rest of the season and for this week, then graded. A is a clear gain that does not wreck the week. F loses. Accept a deal that grades A–C. Send a B or better. Counter a C that is unfair. Decline a D or F."
		}),
		closed && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mb-4 rounded-lg border border-warn/40 bg-warn/10 px-4 py-3 text-sm text-warn",
			children: "Finder is hidden after the deadline. Analyzer stays for recaps."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-4 flex flex-wrap gap-2",
			children: league.teams.filter((t) => !t.isYou).map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "sm",
				variant: partner?.id === t.id ? "default" : "outline",
				onClick: () => setTrade(t.id, [], []),
				children: t.abbrev
			}, t.id))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6 grid gap-6 lg:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "You send" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDesc, { children: me?.name })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardBody, {
				className: "grid gap-1",
				children: mine.filter((p) => p.pos !== "DST").map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => toggle("give", p.id),
					className: cn("flex justify-between rounded-md px-2 py-2 text-sm", giveIds.includes(p.id) && "bg-bg-subtle"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						p.pos,
						" ",
						p.name
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono text-xs tabular text-muted",
						children: p.adjVor.toFixed(0)
					})]
				}, p.id))
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "You get" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDesc, { children: partner?.name ?? "Pick a team" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardBody, {
				className: "grid gap-1",
				children: [theirRoster.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => toggle("get", p.id),
					className: cn("flex justify-between rounded-md px-2 py-2 text-sm", getIds.includes(p.id) && "bg-bg-subtle"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						p.pos,
						" ",
						p.name
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono text-xs tabular text-muted",
						children: p.adjVor.toFixed(0)
					})]
				}, p.id)), !theirRoster.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-subtle",
					children: "Projected keepers only until ESPN or paste fills the roster."
				})]
			})] })]
		}),
		evald && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
			className: "mb-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardBody, {
				className: "flex flex-wrap items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] tracking-widest text-muted uppercase",
						children: "TradeNRA"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "font-display text-3xl tabular",
						children: [evald.nra >= 0 ? "+" : "", evald.nra.toFixed(1)]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: evald.why
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
					tone: evald.letter === "A" || evald.letter === "B" ? "start" : evald.letter === "F" ? "sit" : "warn",
					children: [
						evald.letter,
						" · ",
						evald.verdict
					]
				})]
			})
		}),
		!closed && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "mb-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Finder" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDesc, { children: "Five packages on rest-of-season points. The 8% band and the top-3 rule are heuristic." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardBody, {
				className: "grid gap-2",
				children: [trades.map((t, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setTrade(t.partner.id, t.give.map((p) => p.id), t.get.map((p) => p.id)),
					className: "rounded-lg border border-border px-4 py-3 text-left hover:bg-bg-subtle",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm font-medium",
						children: [
							t.give.map((p) => p.name).join(", "),
							" → ",
							t.get.map((p) => p.name).join(", "),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-subtle",
								children: [" · ", t.partner.abbrev]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2 flex flex-wrap items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
							tone: t.eval.letter === "A" || t.eval.letter === "B" ? "start" : t.eval.letter === "F" || t.eval.letter === "D" ? "sit" : "warn",
							children: [
								t.eval.letter,
								" · ",
								t.eval.verdict
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-mono text-xs tabular text-muted",
							children: [
								"You ",
								t.eval.you >= 0 ? "+" : "",
								t.eval.you.toFixed(1),
								" · them ",
								t.eval.them >= 0 ? "+" : "",
								t.eval.them.toFixed(1),
								" · week ",
								t.eval.weekYou >= 0 ? "+" : "",
								t.eval.weekYou.toFixed(1),
								t.eval.fair ? " · fair" : ""
							]
						})]
					})]
				}, `${t.partner.id}-${i}`)), !trades.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-subtle",
					children: "Need opposing rosters from ESPN or paste to scan packages."
				})]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OsBrief, {
			kind: "trade",
			prompt: evald ? `NRA ${evald.nra} you ${evald.you} them ${evald.them} ${evald.why}` : "No deal loaded."
		})
	] });
}
//#endregion
export { TradesPage as component };

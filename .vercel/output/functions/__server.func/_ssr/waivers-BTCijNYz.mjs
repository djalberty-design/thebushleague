import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { a as CardTitle, i as CardHeader, n as CardBody, o as PageHeader, r as CardDesc, t as Card } from "./card-Dm6C-zs6.mjs";
import { a as useDesk, n as claimFactorSensitivity, t as Badge } from "./use-desk-RllCwzEH.mjs";
import { t as PlayerDrawer } from "./player-drawer-CCj62tcF.mjs";
import { t as OsBrief } from "./brief-BvjivZIc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/waivers-BTCijNYz.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function WaiversPage() {
	const { waivers, me, league, players } = useDesk();
	const sensitivity = claimFactorSensitivity([...players.values()]);
	const [open, setOpen] = (0, import_react.useState)(null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			kicker: "Inverse standings · 1-day period · not FAAB",
			title: "Waivers",
			desc: "FLEX and OP fill by expected points. A claim's replacement is the best free agent at that position. The old 55 percent factor is not used to fill a slot."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
			className: "mb-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardBody, {
				className: "flex flex-wrap items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] tracking-widest text-muted uppercase",
					children: "Your priority"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "font-display text-3xl tabular",
					children: ["#", me?.waivers ?? "—"]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "max-w-sm text-sm text-subtle",
					children: "Slot 1 costs 12 ROS points of priority. Weeks 1–4: rarely burn #1 on a streamer. League-winning RB inheritance: burn immediately."
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "mb-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Wire" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDesc, { children: "Top available players in this ESPN league, by percent owned. Not the same as the claim rank below." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardBody, {
				className: "grid gap-2",
				children: [(league.freeAgents ?? []).length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-subtle",
					children: "No free-agent list saved for this league yet."
				}), (league.freeAgents ?? []).slice(0, 15).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-3 border-b border-border py-2 text-sm last:border-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						p.name,
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-subtle",
							children: [
								p.pos,
								" · ",
								p.nfl
							]
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-xs text-muted tabular",
						children: [
							p.waiver ? "Waiver" : "FA",
							" · ",
							p.owned.toFixed(0),
							"%"
						]
					})]
				}, `${p.name}-${p.nfl}`))]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "mb-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Recent moves" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDesc, { children: "Adds, drops, and waivers ESPN has already processed. Lineup swaps are not listed." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardBody, {
				className: "grid gap-2",
				children: [(league.activity ?? []).length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-subtle",
					children: "No moves stored."
				}), (league.activity ?? []).slice(0, 12).map((a) => {
					const club = league.teams.find((t) => t.id === a.teamId);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted",
								children: club?.abbrev ?? "Club"
							}),
							" ",
							a.moves.map((m) => `${m.action.toLowerCase()} ${m.name}`).join(", "),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-subtle",
								children: [
									" · ",
									a.kind.toLowerCase(),
									a.status === "PENDING" ? " pending" : ""
								]
							})
						]
					}, `${a.at}-${a.teamId}-${a.moves.map((m) => m.name).join()}`);
				})]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Ranked claims" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardDesc, { children: [sensitivity.note, " Ranked by expected points, not VOR."] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardBody, {
			className: "grid gap-3",
			children: [waivers.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-subtle",
				children: "No claims beat replacement after priority cost."
			}), waivers.map((w) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => setOpen(w.player),
				className: "rounded-lg border border-border px-4 py-3 text-left hover:bg-bg-subtle",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm font-medium",
							children: [
								w.player.name,
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-subtle",
									children: w.player.pos
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-muted",
							children: w.reason
						}),
						w.drop && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-xs text-subtle",
							children: ["Drop ", w.drop.name]
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-right",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							tone: w.advice === "Burn" ? "start" : "warn",
							children: w.advice
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 font-mono text-xs tabular text-muted",
							children: [
								w.claimValue.toFixed(1),
								" · week ",
								w.weekPts.toFixed(1),
								" · ROS ",
								w.rosVor.toFixed(0)
							]
						})]
					})]
				})
			}, w.player.id))]
		})] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OsBrief, {
				kind: "waiver",
				prompt: waivers.slice(0, 5).map((w) => `${w.advice} ${w.player.name} drop ${w.drop?.name ?? "none"} claim ${w.claimValue} week ${w.weekPts}`).join("\n")
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayerDrawer, {
			player: open,
			open: Boolean(open),
			onOpenChange: () => setOpen(null)
		})
	] });
}
//#endregion
export { WaiversPage as component };

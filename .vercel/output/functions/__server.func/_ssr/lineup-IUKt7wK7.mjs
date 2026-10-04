import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { D as cn } from "./league-BHDWdH1h.mjs";
import { n as useBush } from "./router-C2UZVP6N.mjs";
import { a as CardTitle, i as CardHeader, n as CardBody, o as PageHeader, r as CardDesc, t as Card } from "./card-Dm6C-zs6.mjs";
import { t as Button } from "./createSsrRpc-kaWDhsSj.mjs";
import { a as useDesk } from "./use-desk-RllCwzEH.mjs";
import { t as ConfidenceBadge } from "./grade-badge-B1MOBrl2.mjs";
import { t as PlayerDrawer } from "./player-drawer-CCj62tcF.mjs";
import { t as OsBrief } from "./brief-BvjivZIc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/lineup-IUKt7wK7.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function LineupPage() {
	const { lineup, theirLineup, opponent, me, mode, mine, map, moves, brainChip, league } = useDesk();
	const setMode = useBush((s) => s.setLineupMode);
	const stored = useBush((s) => s.lineupMode);
	const [open, setOpen] = (0, import_react.useState)(null);
	const empty = lineup.starters.filter((s) => !s.player);
	const modelIds = new Set(lineup.starters.map((s) => s.player?.id).filter(Boolean));
	const espnStarters = (me?.slots ?? []).filter((s) => s.slot !== "BE" && s.slot !== "IR");
	const espnDiffs = espnStarters.filter((s) => !modelIds.has(s.id));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			kicker: `${me?.name ?? "Let Maye Cook"} vs ${opponent?.name ?? "opponent"}`,
			title: "Lineup",
			desc: "The model fills QB, 2 RB, 3 WR, TE, FLEX, OP, DST. If ESPN has someone else in, the swap list is the move. Under 1.5 points is a coin-flip."
		}),
		empty.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mb-4 rounded-lg border border-sit/40 bg-sit/10 px-4 py-3 text-sm text-sit",
			children: [
				"Empty starter: ",
				empty.map((s) => s.slot).join(", "),
				". An empty slot is worse than a bad start."
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 flex flex-wrap gap-3 text-xs",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-warn",
				children: "BASELINE"
			}), brainChip ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-subtle",
				children: brainChip.label
			}) : null]
		}),
		(() => {
			const byes = mine.filter((p) => p.bye >= league.week && p.bye < league.week + 4);
			if (!byes.length) return null;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mb-4 text-sm text-subtle",
				children: ["Byes next four weeks: ", byes.map((p) => `${p.name} W${p.bye}`).join(" · ")]
			});
		})(),
		moves.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "mb-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Make these swaps" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDesc, { children: "ESPN's current starters versus the lineup that scores higher in this mode." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardBody, {
				className: "grid gap-2",
				children: moves.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted",
							children: m.slot
						}),
						" Start ",
						m.start.name,
						m.sit ? ` over ${m.sit.name}` : "",
						".",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "tabular text-subtle",
							children: [
								m.delta >= 0 ? "+" : "",
								m.delta.toFixed(1),
								" pts"
							]
						})
					]
				}, `${m.slot}-${m.start.id}`))
			})]
		}),
		espnStarters.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "mb-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "ESPN lineup" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDesc, { children: espnDiffs.length ? `${espnDiffs.length} starter${espnDiffs.length === 1 ? "" : "s"} in ESPN ${espnDiffs.length === 1 ? "is" : "are"} not in the model lineup.` : "ESPN matches the model starters." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardBody, {
				className: "flex flex-wrap gap-2",
				children: espnStarters.map((s) => {
					const player = map.get(s.id);
					const off = !modelIds.has(s.id);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => player && setOpen(player),
						className: cn("rounded-md border px-3 py-2 text-left text-sm", off ? "border-warn/50 bg-warn/10" : "border-border"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] tracking-widest text-muted uppercase",
							children: s.slot
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mt-1 block",
							children: player?.name ?? s.id
						})]
					}, `${s.slot}-${s.id}`);
				})
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-4 flex flex-wrap gap-2",
			children: [
				"auto",
				"favorite",
				"tossup",
				"underdog"
			].map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "sm",
				variant: stored === m ? "default" : "outline",
				onClick: () => setMode(m),
				children: m === "auto" ? `Auto (${mode})` : m
			}, m))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6 grid gap-3 sm:grid-cols-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardBody, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] tracking-widest text-muted uppercase",
						children: "You"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 font-display text-3xl tabular",
						children: lineup.projected.toFixed(1)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-subtle",
						children: [
							"Recent low ",
							lineup.p20.toFixed(1),
							" · recent high ",
							lineup.p80.toFixed(1)
						]
					})
				] }) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardBody, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] tracking-widest text-muted uppercase",
						children: opponent?.abbrev ?? "OPP"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 font-display text-3xl tabular",
						children: theirLineup.projected.toFixed(1)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-subtle",
						children: lineup.twoQb ? "Two QBs via OP" : "Single QB"
					})
				] }) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardBody, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] tracking-widest text-muted uppercase",
						children: "Mode"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 font-display text-3xl",
						children: mode
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-subtle",
						children: "Favorite uses recent low. Underdog uses recent high. Toss-up uses expected. Margin 8 and 65/35 are heuristic."
					})
				] }) })
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-6 lg:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Starters" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDesc, { children: "Locked at each player's gametime." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardBody, {
				className: "grid gap-2",
				children: lineup.starters.map((seat, i) => {
					const coin = seat.player ? lineup.debates.some((d) => d.starter.id === seat.player?.id && Math.abs(d.delta) < 1.5) : false;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => seat.player && setOpen(seat.player),
						className: cn("flex min-h-11 items-center justify-between rounded-md px-2 py-2 text-left hover:bg-bg-subtle", coin && "text-muted"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "w-10 font-mono text-[10px] tracking-wider text-muted",
								children: seat.slot
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-sm font-medium",
									children: [
										seat.player?.name ?? "Empty",
										coin ? " · coin-flip" : "",
										seat.player?.trail === "none" ? " · NO TRAIL" : "",
										seat.player?.trail === "thin" ? " · thin" : ""
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-subtle",
									children: seat.player ? `${seat.player.nflTeam} · recent low ${seat.player.weekly.p20.toFixed(1)} · expected ${seat.player.weekly.ePts.toFixed(1)} · recent high ${seat.player.weekly.p80.toFixed(1)}` : "Need a body"
								}),
								seat.player?.reason && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted",
									children: seat.player.reason
								})
							] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-sm tabular",
							children: seat.player ? seat.player.weekly.ePts.toFixed(1) : "—"
						})]
					}, `${seat.slot}-${i}`);
				})
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Bench + IR" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDesc, { children: "Debates inside 2.8 mode points." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardBody, {
					className: "grid gap-2",
					children: [lineup.bench.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setOpen(p),
						className: "flex justify-between px-2 py-1.5 text-left text-sm hover:bg-bg-subtle",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							p.pos,
							" ",
							p.name
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono tabular text-muted",
							children: p.weekly.ePts.toFixed(1)
						})]
					}, p.id)), lineup.ir.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "px-2 text-xs text-warn",
						children: ["IR · ", p.name]
					}, p.id))]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Debates" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardBody, {
					className: "grid gap-3",
					children: [lineup.debates.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-subtle",
						children: "No coin-flips. Start the listed lineup."
					}), lineup.debates.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-md bg-bg px-3 py-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm",
								children: [
									d.starter.name,
									" vs ",
									d.bench.name
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfidenceBadge, { label: d.confidence })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-subtle",
							children: [
								"Delta ",
								d.delta >= 0 ? "+" : "",
								d.delta.toFixed(1)
							]
						})]
					}, d.starter.id))]
				})] })]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OsBrief, {
				kind: "startsit",
				prompt: `Mode ${mode}. You ${lineup.projected} vs ${theirLineup.projected}. Starters: ${lineup.starters.map((s) => `${s.slot} ${s.player?.name}`).join(", ")}`
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
export { LineupPage as component };

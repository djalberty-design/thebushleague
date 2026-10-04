import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { D as cn } from "./league-BHDWdH1h.mjs";
import { a as Star, u as Check } from "../_libs/lucide-react.mjs";
import { n as useBush } from "./router-C2UZVP6N.mjs";
import { a as CardTitle, i as CardHeader, n as CardBody, o as PageHeader, r as CardDesc, t as Card } from "./card-Dm6C-zs6.mjs";
import { t as Button } from "./createSsrRpc-kaWDhsSj.mjs";
import { a as useDesk } from "./use-desk-RllCwzEH.mjs";
import { r as PosMark } from "./grade-badge-B1MOBrl2.mjs";
import { t as PlayerDrawer } from "./player-drawer-CCj62tcF.mjs";
import { t as OsBrief } from "./brief-BvjivZIc.mjs";
import { n as SwitchThumb, t as Switch$1 } from "../_libs/radix-ui__react-switch.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/draft-MVEIZutY.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Switch({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch$1, {
		className: cn("inline-flex h-6 w-10 shrink-0 items-center rounded-full border border-border bg-bg-subtle transition-colors data-[state=checked]:bg-accent", className),
		...props,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SwitchThumb, { className: "block size-4 translate-x-0.5 rounded-full bg-muted transition-transform data-[state=checked]:translate-x-4 data-[state=checked]:bg-accent-fg" })
	});
}
function PlayerRow({ player, rank, taken, pinned, onOpen, onPin, onTake, compact, right }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("group grid items-center gap-2 rounded-lg px-2 py-2 transition-colors duration-150 hover:bg-bg-subtle", compact ? "grid-cols-[1.5rem_minmax(0,1fr)_auto]" : "grid-cols-[1.75rem_2rem_minmax(0,1fr)_auto_auto] md:grid-cols-[1.75rem_2rem_minmax(0,1fr)_4.5rem_4rem_4rem_auto]", taken && "opacity-45"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-mono text-xs tabular text-subtle",
				children: rank ?? "—"
			}),
			!compact && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PosMark, { pos: player.pos }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: onOpen,
				className: "min-w-0 text-left",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-baseline gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cn("truncate text-sm font-medium text-fg", taken && "line-through"),
							children: player.name
						}),
						player.rook && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] tracking-wide text-accent",
							children: "R"
						}),
						player.status && player.status !== "Active" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] font-medium text-warn",
							children: player.status
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2 text-[11px] text-subtle",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: player.nflTeam }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							player.home ? "vs" : "@",
							" ",
							player.opp
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Bye ", player.bye] })
					]
				})]
			}),
			!compact && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "hidden font-mono text-xs tabular text-muted md:inline",
					children: player.weekly.ePts.toFixed(1)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-mono text-xs tabular text-muted",
					children: player.adjVor.toFixed(0)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "hidden font-mono text-xs tabular text-muted md:inline",
					children: player.confidenceLabel
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-end gap-1",
				children: [
					right && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono text-xs tabular text-accent",
						children: right
					}),
					onPin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-label": pinned ? "Unpin" : "Pin",
						onClick: onPin,
						className: cn("rounded-sm p-1.5 text-subtle hover:text-fg", pinned && "text-accent"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, {
							className: "size-3.5",
							fill: pinned ? "currentColor" : "none"
						})
					}),
					onTake && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-label": taken ? "Undraft" : "Mark drafted",
						onClick: onTake,
						className: "rounded-sm p-1.5 text-subtle hover:text-fg",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3.5" })
					})
				]
			})
		]
	});
}
function DraftPage() {
	const { board, viewList, taken, keeperOff, me, pins, capital, league } = useDesk();
	const setView = useBush((s) => s.setView);
	const view = useBush((s) => s.view);
	const hideTaken = useBush((s) => s.hideTaken);
	const setHideTaken = useBush((s) => s.setHideTaken);
	const toggleTaken = useBush((s) => s.toggleTaken);
	const togglePin = useBush((s) => s.togglePin);
	const [open, setOpen] = (0, import_react.useState)(null);
	const recs = board.recs;
	const next = board.next;
	const holes = board.holes;
	const picks = league.draftPicks ?? [];
	const minePicks = picks.filter((p) => p.teamId === me?.id);
	const abbrev = (id) => league.teams.find((t) => t.id === id)?.abbrev ?? String(id);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			kicker: `Snake · slot ${me?.draftSlot ?? 9} · 60s · no pick trades`,
			title: "Draft room",
			desc: `${keeperOff.size} keepers already off the board. Their rounds are burned. Kickers never recommended. DST only late.`
		}),
		picks.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "mb-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Draft results" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardDesc, { children: [
				picks.length,
				" picks stored from ESPN. Yours: ",
				minePicks.map((p) => `${p.round}.${String(p.pick).padStart(2, "0")} ${p.name}`).join(" · ") || "none",
				"."
			] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardBody, {
				className: "max-h-80 overflow-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-left text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "text-[11px] tracking-widest text-muted uppercase",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-2 pr-3 font-medium",
								children: "Pick"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-2 pr-3 font-medium",
								children: "Team"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-2 font-medium",
								children: "Player"
							})
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: picks.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: cn("border-t border-border", p.teamId === me?.id && "bg-bg-subtle"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "py-2 pr-3 tabular",
								children: [
									p.round,
									".",
									String(p.pick).padStart(2, "0")
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "py-2 pr-3",
								children: abbrev(p.teamId)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "py-2",
								children: [
									p.name,
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-subtle",
										children: p.pos
									}),
									p.keeper ? " · keeper" : ""
								]
							})
						]
					}, `${p.overall}-${p.name}`)) })]
				})
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 rounded-xl border border-accent/40 bg-bg-elevated px-4 py-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] tracking-[0.16em] text-accent uppercase",
					children: next ? `Next pick ${next.label} · overall ${next.overall}` : "No picks remaining"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 font-display text-2xl tracking-tight",
					children: recs[0] ? recs[0].player.name : "Board empty"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-sm text-muted",
					children: ["Alts: ", recs.slice(1, 3).map((r) => r.player.name).join(" · ") || "—"]
				}),
				holes && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-xs text-subtle",
					children: [
						"Holes · QB ",
						holes.qb,
						" · RB ",
						holes.rb,
						" · WR ",
						holes.wr,
						" · TE ",
						holes.te,
						" · FLEX ",
						holes.flex,
						" · OP ",
						holes.op,
						" · DST ",
						holes.dst,
						board.burned?.length ? ` · burned R${[...board.burned].sort((a, b) => a - b).join(" & R")}` : "",
						capital.length ? ` · next ${capital.slice(0, 4).map((p) => p.label).join(" → ")}` : ""
					]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 flex flex-wrap items-center gap-2",
			children: [[
				"ALL",
				"QB",
				"RB",
				"WR",
				"TE",
				"FLEX",
				"OP",
				"DST"
			].map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "sm",
				variant: view === v ? "default" : "outline",
				onClick: () => setView(v),
				children: v
			}, v)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "flex items-center gap-2 text-xs text-muted sm:ml-auto",
				children: ["Hide off-board", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
					checked: hideTaken,
					onCheckedChange: setHideTaken
				})]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-6 lg:grid-cols-[1.2fr_0.8fr]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Remaining board" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardDesc, { children: [keeperOff.size, " keepers marked KEEP and removed. Hide-off-board is on by default. Never draft a kicker."] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardBody, {
				className: "grid gap-0.5",
				children: viewList.slice(0, 40).map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayerRow, {
					player: p,
					rank: i + 1,
					taken: taken.has(p.id),
					pinned: pins.includes(p.id),
					onOpen: () => setOpen(p),
					onPin: () => togglePin(p.id),
					onTake: () => toggleTaken(p.id),
					right: keeperOff.has(p.id) ? "KEEP" : void 0
				}, p.id))
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Queue" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDesc, { children: "Top 8 by DraftValue with keepers off the board." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardBody, {
					className: "grid gap-2",
					children: recs.slice(0, 8).map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setOpen(r.player),
						className: cn("rounded-md px-3 py-2 text-left hover:bg-bg-subtle", i === 0 && "bg-bg-subtle"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-sm font-medium",
								children: [
									i + 1,
									". ",
									r.player.name
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-xs tabular text-accent",
								children: r.value.toFixed(1)
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-subtle",
							children: r.why
						})]
					}, r.player.id))
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OsBrief, {
					kind: "draft",
					prompt: recs.slice(0, 5).map((r) => `${r.player.name} ${r.player.pos} value ${r.value} adp10 ${r.player.adp10} ${r.why}`).join("\n")
				})]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayerDrawer, {
			player: open,
			open: Boolean(open),
			onOpenChange: () => setOpen(null)
		})
	] });
}
//#endregion
export { DraftPage as component };

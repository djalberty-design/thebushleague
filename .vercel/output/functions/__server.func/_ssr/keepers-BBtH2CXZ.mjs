import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { D as cn } from "./league-BHDWdH1h.mjs";
import { a as CardTitle, i as CardHeader, n as CardBody, o as PageHeader, r as CardDesc, t as Card } from "./card-Dm6C-zs6.mjs";
import { t as Button } from "./createSsrRpc-kaWDhsSj.mjs";
import { a as useDesk, r as copyToLm, t as Badge } from "./use-desk-RllCwzEH.mjs";
import { n as KeepBadge, r as PosMark } from "./grade-badge-B1MOBrl2.mjs";
import { t as PlayerDrawer } from "./player-drawer-CCj62tcF.mjs";
import { t as OsBrief } from "./brief-BvjivZIc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/keepers-BBtH2CXZ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function KeepersPage() {
	const { evals, selectedPair, pairLegal, selected, me, leagueKeepers, capital, returning, keeperOff, keepersLocked, players } = useDesk();
	const [open, setOpen] = (0, import_react.useState)(null);
	const [copied, setCopied] = (0, import_react.useState)(false);
	const keptCount = keeperOff.size;
	const emptySlots = leagueKeepers.reduce((n, t) => n + t.empty, 0);
	const steals = leagueKeepers.flatMap((t) => t.seats.map((s) => ({
		...s,
		team: t.team.name
	}))).sort((a, b) => b.surplus - a.surplus).slice(0, 4);
	const boardTop = [...players].filter((p) => !keeperOff.has(p.id)).sort((a, b) => a.adp10 - b.adp10).slice(0, 10);
	const prompt = [
		`Locked keepers ${keptCount}. Empty slots ${emptySlots}.`,
		...leagueKeepers.flatMap((t) => t.seats.map((s) => `${t.team.name}: ${s.player?.name ?? s.id} ${s.player?.pos ?? ""} ${s.espnLabel} surplus ${s.surplus} ${s.labelGrade}`)),
		`Your remaining capital: ${capital.slice(0, 8).map((p) => p.label).join(", ")}`
	].join("\n");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			kicker: "Locked from ESPN · 2 keepers · cost is the burned pick",
			title: "League keepers",
			desc: "These names are already off the 2026 board. The round next to each player is taken as the keeper cost — that team does not pick in that round.",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "outline",
				onClick: () => {
					if (!selectedPair) return;
					navigator.clipboard.writeText(copyToLm(me?.name ?? "Let Maye Cook", selectedPair));
					setCopied(true);
					setTimeout(() => setCopied(false), 1500);
				},
				children: copied ? "Copied" : "Copy to LM"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				disabled: true,
				children: keepersLocked ? "Locked in ESPN" : "Lock pair"
			})] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6 grid gap-3 sm:grid-cols-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardBody, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] tracking-[0.16em] text-muted uppercase",
						children: "Off the board"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 font-display text-3xl tabular tracking-tight",
						children: keptCount
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-xs text-subtle",
						children: [emptySlots, " keeper slots left empty — extra draft picks"]
					})
				] }) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardBody, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] tracking-[0.16em] text-muted uppercase",
						children: "Your burned picks"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 font-display text-3xl tabular tracking-tight",
						children: selectedPair ? [selectedPair.a.assigned, selectedPair.b.assigned].sort((a, b) => a - b).map((r) => `R${r}`).join(" · ") : "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-subtle",
						children: "McMillan 4.02 · Warren 5.09"
					})
				] }) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardBody, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] tracking-[0.16em] text-muted uppercase",
						children: "Your next pick"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 font-display text-3xl tabular tracking-tight",
						children: capital[0]?.label ?? "1.09"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-xs text-subtle",
						children: [
							"Then ",
							capital[1]?.label ?? "2.02",
							" · ",
							capital[2]?.label ?? "3.09"
						]
					})
				] }) })
			]
		}),
		selectedPair && pairLegal && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-6 grid gap-3 sm:grid-cols-2",
			children: [selectedPair.a, selectedPair.b].slice().sort((x, y) => x.assigned - y.assigned).map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => setOpen(k.player),
				className: "text-left",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardBody, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeepBadge, { label: k.label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-xs tabular text-accent",
							children: k.assigned === 4 ? "Rd 4, Pick 2" : k.assigned === 5 ? "Rd 5, Pick 9" : `R${k.assigned}`
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 font-display text-2xl tracking-tight",
						children: k.player.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-sm text-muted",
						children: [
							k.player.pos,
							" · ",
							k.player.nflTeam,
							k.player.status && k.player.status !== "Active" ? ` · ${k.player.status}` : ""
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 font-mono text-xs tabular text-accent",
						children: [
							"Surplus ",
							k.surplus >= 0 ? "+" : "",
							k.surplus.toFixed(1),
							" · AdjVOR ",
							k.adjVor.toFixed(0)
						]
					})
				] }) })
			}, k.player.id))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "mb-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Remaining capital" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDesc, { children: "Rounds 4 and 5 are gone. Sixteen picks still fire, snake slot 9." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardBody, {
				className: "flex flex-wrap gap-2",
				children: capital.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: cn("rounded-md border border-border px-2.5 py-1 font-mono text-xs tabular", p.round <= 3 ? "border-accent/50 text-accent" : "text-muted"),
					children: p.label
				}, p.overall))
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3",
			children: leagueKeepers.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: cn(row.team.isYou && "border-accent/50"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
					className: "pb-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
							className: "text-base",
							children: row.team.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardDesc, { children: [
							"Slot ",
							row.team.draftSlot,
							row.team.isYou ? " · you" : "",
							" · surplus ",
							row.totalSurplus >= 0 ? "+" : "",
							row.totalSurplus.toFixed(0)
						] })] }), row.team.isYou ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							tone: "accent",
							children: "You"
						}) : row.empty ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
							tone: "warn",
							children: [row.empty, " open"]
						}) : null]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardBody, {
					className: "grid gap-0 pt-0",
					children: [row.seats.map((seat) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => seat.player && setOpen(seat.player),
						className: "flex items-center gap-2 border-t border-border py-2.5 text-left first:border-t-0",
						children: [
							seat.player ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PosMark, { pos: seat.player.pos }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-8" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "block truncate text-sm font-medium",
									children: [seat.player?.name ?? seat.id, seat.player?.status && seat.player.status !== "Active" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "ml-1.5 text-[10px] font-medium text-warn",
										children: seat.player.status
									}) : null]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "block text-[11px] text-subtle",
									children: [
										seat.player?.nflTeam ?? "",
										" ",
										seat.player?.pos ?? "",
										" · surplus ",
										seat.surplus >= 0 ? "+" : "",
										seat.surplus.toFixed(0)
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "shrink-0 text-right",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block font-mono text-[11px] tabular text-accent",
									children: seat.espnLabel
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block font-mono text-[10px] tabular text-subtle",
									children: seat.label
								})]
							})
						]
					}, seat.id)), Array.from({ length: row.empty }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "border-t border-border py-2.5 text-sm text-subtle",
						children: "Not selected — that pick stays in the draft"
					}, `empty-${i}`))]
				})]
			}, row.team.id))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6 grid gap-6 lg:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Biggest steals" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDesc, { children: "Surplus is pick value at ADP minus the burned round. Judkins at R14 is the board-breaker." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardBody, {
				className: "grid gap-2",
				children: steals.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => s.player && setOpen(s.player),
					className: "flex items-center justify-between gap-3 rounded-md px-2 py-2 text-left hover:bg-bg-subtle",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block text-sm font-medium",
						children: s.player?.name ?? s.id
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "block text-[11px] text-subtle",
						children: [
							s.team,
							" · ",
							s.espnLabel
						]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-mono text-xs tabular text-accent",
						children: [s.surplus >= 0 ? "+" : "", s.surplus.toFixed(1)]
					})]
				}, `${s.team}-${s.id}`))
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "What 1.01 sees" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDesc, { children: "Tommy kept nobody. Gibbs, Bijan, Chase are back in the pool. Your 1.09 is the 9th bite." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardBody, {
				className: "grid gap-1",
				children: boardTop.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setOpen(p),
					className: "flex items-center justify-between gap-3 rounded-md px-2 py-1.5 text-left hover:bg-bg-subtle",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "flex min-w-0 items-baseline gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "w-5 font-mono text-[11px] tabular text-subtle",
								children: i + 1
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "truncate text-sm",
								children: p.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] text-subtle",
								children: p.pos
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-mono text-[11px] tabular text-muted",
						children: ["ADP ", p.adp10.toFixed(0)]
					})]
				}, p.id))
			})] })]
		}),
		returning.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "mb-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Thrown back from Let Maye Cook" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDesc, { children: "2025 roster names that were not kept. They return to the draft pool — including the R1–4 bans." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardBody, {
				className: "flex flex-wrap gap-2",
				children: returning.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setOpen(p),
					className: "rounded-md border border-border px-2.5 py-1 text-xs hover:bg-bg-subtle",
					children: [
						p.name,
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-subtle",
							children: p.pos
						})
					]
				}, p.id))
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "mb-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Your 2025 eligibility sheet" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDesc, { children: "Locked pair is McMillan + Warren. The rest of this list is history — they go back in the pool." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardBody, {
				className: "overflow-x-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-left text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "text-[10px] tracking-widest text-subtle uppercase",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "pb-2 font-medium",
								children: "Player"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "pb-2 font-medium",
								children: "Pos"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "pb-2 font-medium",
								children: "Cost"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "pb-2 font-medium",
								children: "Surplus"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "pb-2 font-medium",
								children: "AdjVOR"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "pb-2 font-medium",
								children: "Status"
							})
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: evals.map((k) => {
						const on = selected.includes(k.player.id);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: cn("border-t border-border", !k.eligible && "opacity-40", on && "bg-bg-subtle"),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-2.5",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										className: "text-left",
										onClick: () => setOpen(k.player),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-medium",
											children: k.player.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "mt-0.5 block text-xs text-subtle",
											children: on ? "Locked keeper — off the board" : k.reason
										})]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "font-mono text-xs",
									children: k.player.pos
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "font-mono tabular",
									children: on ? `R${k.assigned}` : k.sticker ? `R${k.sticker}` : "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "font-mono tabular",
									children: [k.surplus >= 0 ? "+" : "", k.surplus.toFixed(1)]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "font-mono tabular",
									children: k.adjVor.toFixed(0)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: on ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeepBadge, { label: k.label }) : k.eligible ? "Returns" : "—" })
							]
						}, k.player.id);
					}) })]
				})
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OsBrief, {
			kind: "keeper",
			prompt
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayerDrawer, {
			player: open,
			open: Boolean(open),
			onOpenChange: () => setOpen(null)
		})
	] });
}
//#endregion
export { KeepersPage as component };

import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { c as KEEPER_LOCK_AT, o as DRAFT_START_AT } from "./league-BHDWdH1h.mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { a as CardTitle, i as CardHeader, n as CardBody, o as PageHeader, r as CardDesc, t as Card } from "./card-Dm6C-zs6.mjs";
import { t as Button } from "./createSsrRpc-kaWDhsSj.mjs";
import { a as useDesk } from "./use-desk-RllCwzEH.mjs";
import { t as ConfidenceBadge } from "./grade-badge-B1MOBrl2.mjs";
import { n as fetchNflScoreboard } from "./client-CRDajc_3.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DNaa9LMO.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function countdown(from) {
	const diff = Math.max(0, from - Date.now());
	return {
		d: Math.floor(diff / 864e5),
		h: Math.floor(diff % 864e5 / 36e5),
		m: Math.floor(diff % 36e5 / 6e4),
		done: diff === 0
	};
}
function Home() {
	const { me, lineup, opponent, theirLineup, actions, phase, selectedPair, pairLegal, mode, league, win, brainChip } = useDesk();
	const [lock, setLock] = (0, import_react.useState)(countdown(KEEPER_LOCK_AT));
	const [draft, setDraft] = (0, import_react.useState)(countdown(DRAFT_START_AT));
	(0, import_react.useEffect)(() => {
		const tick = () => {
			setLock(countdown(KEEPER_LOCK_AT));
			setDraft(countdown(DRAFT_START_AT));
		};
		tick();
		const id = setInterval(tick, 3e4);
		return () => clearInterval(id);
	}, []);
	const board = useQuery({
		queryKey: ["nfl-board", league.week],
		queryFn: () => fetchNflScoreboard({ data: { week: league.week } })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			kicker: `${me?.name ?? league.name} · Week ${league.week}`,
			title: "Command",
			desc: "One scorer for the lineup, the wire, and trades. Counting stats go through Bush League points. A missing feed stamps STALE. Under 1.5 points is a coin-flip."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 flex flex-wrap items-center justify-between gap-3 text-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-warn",
					children: "BASELINE"
				}), brainChip ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-subtle",
					children: brainChip.label
				}) : null]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/grade",
					className: "min-h-11 text-accent",
					children: "Brain record"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					className: "min-h-11 text-accent",
					href: `https://fantasy.espn.com/football/team?leagueId=${league.espnLeagueId}&seasonId=${league.season}`,
					children: "Open ESPN"
				})]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-6 grid gap-3 sm:grid-cols-3",
			children: (phase === "season" ? [
				{
					k: "Week",
					v: String(league.week),
					s: league.name
				},
				{
					k: "Record",
					v: me ? `${me.record.w}-${me.record.l}${me.record.t ? `-${me.record.t}` : ""}` : "—",
					s: me?.name ?? "Pick your club in Setup"
				},
				{
					k: "Three-point sample",
					v: win != null ? `${Math.round(win * 100)}%` : "—",
					s: opponent ? `vs ${opponent.name} · not a win chance · ${mode}` : "No opponent synced"
				}
			] : [
				{
					k: "Keeper lock",
					v: lock.done ? "Locked" : `${lock.d}d ${lock.h}h`,
					s: "Tue 7:30 PM ET"
				},
				{
					k: "Draft",
					v: draft.done ? "Live" : `${draft.d}d ${draft.h}h`,
					s: "Tue 8:30 PM · 60s clock"
				},
				{
					k: "Locked pair",
					v: selectedPair ? `${selectedPair.a.player.name.split(" ").slice(-1)[0]} + ${selectedPair.b.player.name.split(" ").slice(-1)[0]}` : "—",
					s: pairLegal ? "McMillan R4.02 · Warren R5.09" : "Illegal pair"
				}
			]).map((stat) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardBody, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] tracking-[0.16em] text-muted uppercase",
					children: stat.k
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 font-display text-3xl tabular tracking-tight",
					children: stat.v
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-xs text-subtle",
					children: stat.s
				})
			] }) }, stat.k))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-6 lg:grid-cols-[1.2fr_0.8fr]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Do this" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDesc, { children: "Three actions. Each one has a flip condition." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardBody, {
				className: "grid gap-4",
				children: actions.map((a, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: a.href,
					className: "block rounded-lg border border-border bg-bg px-4 py-4 hover:bg-bg-subtle",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-[11px] tracking-[0.16em] text-accent uppercase",
								children: [
									i + 1,
									". ",
									a.title
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 font-display text-xl tracking-tight",
								children: a.doThis
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm leading-relaxed text-muted",
								children: a.why
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 text-xs text-subtle",
								children: ["Flip: ", a.flip]
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "shrink-0 text-right",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfidenceBadge, { label: a.confidence }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 font-mono text-xs tabular text-muted",
								children: a.gain
							})]
						})]
					})
				}, a.id))
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: phase === "keepers" ? "Board after keepers" : "Matchup snapshot" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDesc, { children: phase === "keepers" ? "16 names off. Tommy kept nobody and owns 1.01. Your first bite is 1.09." : `${opponent ? `vs ${opponent.name}` : "No opponent yet"} · mode ${mode}` })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardBody, { children: phase === "keepers" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-subtle",
						children: "Pick 1.09"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-3xl tracking-tight",
						children: actions.find((a) => a.id === "first-pick")?.doThis ?? "Rebuild the board at 7:30"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						variant: "outline",
						className: "mt-4 w-full",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/draft",
							children: "Open draft room"
						})
					})
				] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-end justify-between",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-subtle",
								children: "You"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-4xl tabular",
								children: lineup.projected.toFixed(1)
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm text-muted",
								children: [
									"Recent low ",
									lineup.p20.toFixed(0),
									" · recent high ",
									lineup.p80.toFixed(0)
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-right",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-subtle",
									children: opponent?.abbrev ?? "OPP"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-display text-4xl tabular",
									children: theirLineup.projected.toFixed(1)
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-3 text-sm text-muted",
						children: [
							"Best lineup ",
							lineup.projected.toFixed(1),
							". Recent low ",
							lineup.p20.toFixed(0),
							", recent high ",
							lineup.p80.toFixed(0),
							"."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						variant: "outline",
						className: "mt-4 w-full",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/lineup",
							children: "Set the lineup"
						})
					})
				] }) })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "NFL board" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDesc, { children: "Week 1 kick windows. Individual lock at gametime." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardBody, {
					className: "grid gap-2",
					children: [(board.data?.games ?? []).slice(0, 6).map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: g.short }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-xs text-subtle",
							children: g.status || new Date(g.date).toLocaleString()
						})]
					}, g.short)), !board.data?.games?.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-subtle",
						children: "Scoreboard loads when ESPN publishes Week 1."
					})]
				})] })]
			})]
		})
	] });
}
//#endregion
export { Home as component };

import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { D as cn, T as buildManualLeague } from "./league-BHDWdH1h.mjs";
import { n as useBush } from "./router-C2UZVP6N.mjs";
import { a as CardTitle, i as CardHeader, n as CardBody, o as PageHeader, r as CardDesc, t as Card } from "./card-Dm6C-zs6.mjs";
import { t as Button } from "./createSsrRpc-kaWDhsSj.mjs";
import { n as Textarea, t as Input } from "./input-BLN_RW2I.mjs";
import { r as parsePastedRoster, t as connectEspnLeague } from "./client-CRDajc_3.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/setup-FJ1QPh3b.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Label({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
		className: cn("text-xs font-medium tracking-wide text-muted", className),
		...props
	});
}
function SetupPage() {
	const espn = useBush((s) => s.espn);
	const setEspn = useBush((s) => s.setEspn);
	const setLeague = useBush((s) => s.setLeague);
	const resetSeed = useBush((s) => s.resetSeed);
	const league = useBush((s) => s.league);
	const library = useBush((s) => s.library);
	const activeId = useBush((s) => s.activeId);
	const myTeamId = useBush((s) => s.myTeamId);
	const switchLeague = useBush((s) => s.switchLeague);
	const removeLeague = useBush((s) => s.removeLeague);
	const claimTeam = useBush((s) => s.claimTeam);
	const pasteText = useBush((s) => s.pasteText);
	const setPasteText = useBush((s) => s.setPasteText);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [msg, setMsg] = (0, import_react.useState)(null);
	const [newName, setNewName] = (0, import_react.useState)("");
	const [teamTouched, setTeamTouched] = (0, import_react.useState)(false);
	async function refreshSaved() {
		setBusy(true);
		setMsg(null);
		const ids = ["1014874", "210326445"];
		const notes = [];
		for (const leagueId of ids) {
			const res = await connectEspnLeague({ data: {
				leagueId,
				season: espn.season,
				swid: espn.swid || void 0,
				espnS2: espn.espnS2 || void 0,
				teamId: null
			} });
			if (!res.ok) {
				setBusy(false);
				setMsg(res.error);
				return;
			}
			setLeague(res.league, res.myTeamId, res.extraPlayers);
			notes.push(res.league.name);
		}
		setBusy(false);
		setMsg(`Refreshed ${notes.join(" and ")}. Login stays on this desk.`);
	}
	async function connect() {
		setBusy(true);
		setMsg(null);
		const leagueId = espn.leagueId.trim() || "1014874";
		const teamId = !teamTouched && leagueId !== "1014874" ? null : espn.teamId;
		const res = await connectEspnLeague({ data: {
			leagueId,
			season: espn.season,
			swid: espn.swid || void 0,
			espnS2: espn.espnS2 || void 0,
			teamId
		} });
		setBusy(false);
		if (!res.ok) setMsg(res.error);
		else {
			setLeague(res.league, res.myTeamId, res.extraPlayers);
			setMsg(res.warnings.filter(Boolean).join(" ") || `Synced ${res.league.name}.`);
		}
	}
	function rosterMessage(parsed, lead) {
		const miss = parsed.unmatched.length ? ` Not matched: ${parsed.unmatched.slice(0, 6).join(", ")}.` : "";
		setMsg(`${lead}${miss}`);
	}
	function applyPaste() {
		const parsed = parsePastedRoster(pasteText);
		if (!parsed.ids.length) {
			setMsg(parsed.unmatched.length ? `No matching names. Check spelling: ${parsed.unmatched.slice(0, 6).join(", ")}.` : "Paste one player per line.");
			return;
		}
		const teams = league.teams.some((t) => t.isYou) ? league.teams.map((t) => t.isYou ? {
			...t,
			roster: parsed.ids
		} : t) : [...league.teams.map((t) => ({
			...t,
			isYou: false
		})), {
			id: myTeamId || 1,
			name: "My team",
			abbrev: "ME",
			owner: "You",
			isYou: true,
			draftSlot: 1,
			record: {
				w: 0,
				l: 0,
				t: 0
			},
			pf: 0,
			pa: 0,
			roster: parsed.ids,
			ir: [],
			draft: {},
			keepers: [],
			keeperCost: {},
			projectedKeepers: [],
			waivers: 1
		}];
		setLeague({
			...league,
			teams,
			source: league.source === "espn" ? "espn" : "paste",
			lastUpdated: Date.now()
		}, myTeamId || 1, parsed.extra.length ? parsed.extra : void 0);
		rosterMessage(parsed, `Loaded ${parsed.ids.length} players onto ${league.name}.`);
	}
	function addPastedLeague() {
		const parsed = parsePastedRoster(pasteText);
		if (!parsed.ids.length) {
			setMsg(parsed.unmatched.length ? `No matching names. Check spelling: ${parsed.unmatched.slice(0, 6).join(", ")}.` : "Paste one player per line.");
			return;
		}
		const built = buildManualLeague({
			name: newName,
			rosterIds: parsed.ids
		});
		setLeague(built, 1, parsed.extra);
		setNewName("");
		rosterMessage(parsed, `Added ${built.name} with ${parsed.ids.length} players. Lineup works now. Trades need the other rosters, so connect ESPN when you can.`);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			kicker: "Same scoring on every league",
			title: "Leagues",
			desc: "Keep The Bush League and add as many others as you want. One ESPN login covers all of them. On a phone, paste a roster instead."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "mb-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Your leagues" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardDesc, { children: [library.length, " saved. The open league is what Command, Lineup, and Waivers use."] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardBody, {
				className: "grid gap-2",
				children: library.map((slot) => {
					const you = slot.league.teams.find((t) => t.id === slot.myTeamId) ?? slot.league.teams.find((t) => t.isYou);
					const on = slot.id === activeId;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: cn("flex flex-wrap items-center gap-3 rounded-md border px-3 py-3", on ? "border-accent/60 bg-bg-subtle" : "border-border"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate text-sm font-medium",
									children: slot.league.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-subtle",
									children: [
										you?.name ?? "Pick your club",
										" · ",
										slot.league.teams.length,
										" teams · ",
										slot.league.source,
										on ? " · open" : ""
									]
								})]
							}),
							!on && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								onClick: () => switchLeague(slot.id),
								children: "Open"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								disabled: library.length <= 1,
								onClick: () => removeLeague(slot.id),
								children: "Remove"
							})
						]
					}, slot.id);
				})
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-6 lg:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Add or refresh from ESPN" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDesc, { children: "Login is saved on this desk for The Bush League and TW Fantasy. Refresh does not need the cookies again. A new league still needs its ID." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardBody, {
				className: "grid gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "lid",
						children: "League ID"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "lid",
						value: espn.leagueId,
						onChange: (e) => setEspn({ leagueId: e.target.value })
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "tid",
						children: "Team ID"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "tid",
						inputMode: "numeric",
						value: espn.teamId ?? "",
						placeholder: "Blank — pick your club after connect",
						onChange: (e) => {
							setTeamTouched(true);
							const raw = e.target.value.trim();
							setEspn({ teamId: raw ? Number(raw) || null : null });
						}
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "swid",
						children: "SWID"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "swid",
						value: espn.swid,
						onChange: (e) => setEspn({ swid: e.target.value }),
						placeholder: "{...}"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "s2",
						children: "espn_s2"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "s2",
						value: espn.espnS2,
						onChange: (e) => setEspn({ espnS2: e.target.value })
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								onClick: () => void refreshSaved(),
								disabled: busy,
								children: busy ? "Refreshing…" : "Refresh both leagues"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								onClick: () => void connect(),
								disabled: busy,
								children: "Connect this league"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								onClick: resetSeed,
								children: "Reset Bush League"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-subtle",
						children: [
							"Open now: ",
							league.name,
							" · ",
							league.source
						]
					})
				]
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Paste a roster" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDesc, { children: "One player per line. This is the phone path. No cookies." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardBody, {
				className: "grid gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						value: pasteText,
						onChange: (e) => setPasteText(e.target.value),
						className: "min-h-40",
						placeholder: "CeeDee Lamb\nJahmyr Gibbs\nTyler Warren"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "lname",
						children: "Name for a new league"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "lname",
						value: newName,
						onChange: (e) => setNewName(e.target.value),
						placeholder: "Work league"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							onClick: applyPaste,
							children: ["Update ", league.name]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: addPastedLeague,
							children: "Add as new league"
						})]
					})
				]
			})] })]
		}),
		league.teams.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "mt-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, { children: ["Your club in ", league.name] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDesc, { children: "Lineup and waivers follow this team. Bush League should be Let Maye Cook." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardBody, {
				className: "flex flex-wrap gap-2",
				children: league.teams.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: t.id === myTeamId ? "default" : "outline",
					onClick: () => claimTeam(t.id),
					children: t.name
				}, t.id))
			})]
		}),
		msg && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-4 text-sm text-muted",
			children: msg
		})
	] });
}
//#endregion
export { SetupPage as component };

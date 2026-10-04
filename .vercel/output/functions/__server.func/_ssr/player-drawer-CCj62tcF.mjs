import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { i as SheetContent, n as useBush, r as Sheet } from "./router-C2UZVP6N.mjs";
import { t as ConfidenceBadge } from "./grade-badge-B1MOBrl2.mjs";
import { n as Textarea } from "./input-BLN_RW2I.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/player-drawer-CCj62tcF.js
var import_jsx_runtime = require_jsx_runtime();
function PlayerDrawer({ player, open, onOpenChange }) {
	const notes = useBush((s) => s.notes);
	const setNote = useBush((s) => s.setNote);
	if (!player) return null;
	const stats = [
		["Week E[Pts]", player.weekly.ePts.toFixed(1)],
		["Recent low / high", `${player.weekly.p20.toFixed(1)} / ${player.weekly.p80.toFixed(1)}`],
		["ROS E[Pts]", player.ros.ePts.toFixed(0)],
		["ROS VOR", player.rosVor.toFixed(0)],
		["AdjVOR", player.adjVor.toFixed(0)],
		["ADP 10", player.adp10.toFixed(1)],
		["C", player.confidence.toFixed(2)],
		["Bye", String(player.bye)]
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetContent, {
			title: player.name,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 flex flex-col gap-5 overflow-y-auto pr-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs tracking-wide text-muted",
								children: [
									player.pos,
									" · ",
									player.nflTeam,
									" · ",
									player.home ? "vs" : "@",
									" ",
									player.opp
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 font-display text-2xl tracking-tight",
								children: player.name
							}),
							player.news && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm text-warn",
								children: player.news
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfidenceBadge, { label: player.confidenceLabel })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-2 gap-2",
						children: stats.map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-md bg-bg px-3 py-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[10px] tracking-widest text-subtle uppercase",
								children: k
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-mono text-sm tabular",
								children: v
							})]
						}, k))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[10px] tracking-widest text-subtle uppercase",
							children: "Why"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm leading-relaxed text-muted",
							children: player.reason
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 text-xs text-subtle",
							children: [
								"Recent low ",
								player.weekly.p20.toFixed(1),
								" · expected ",
								player.weekly.ePts.toFixed(1),
								" · recent high ",
								player.weekly.p80.toFixed(1)
							]
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[10px] tracking-widest text-subtle uppercase",
						children: "Shadow · not in the score"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2 grid gap-1",
						children: player.shadow.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted",
							children: [
								row.name,
								": ",
								row.value
							]
						}, row.name))
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-1 text-[10px] tracking-widest text-subtle uppercase",
						children: "Note"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						value: notes[player.id] ?? "",
						onChange: (e) => setNote(player.id, e.target.value),
						placeholder: "Private note"
					})] })
				]
			})
		})
	});
}
//#endregion
export { PlayerDrawer as t };

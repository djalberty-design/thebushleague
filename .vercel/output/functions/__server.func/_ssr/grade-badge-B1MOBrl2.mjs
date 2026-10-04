import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { D as cn } from "./league-BHDWdH1h.mjs";
import { t as Badge } from "./use-desk-RllCwzEH.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/grade-badge-B1MOBrl2.js
var import_jsx_runtime = require_jsx_runtime();
function KeepBadge({ label, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		tone: label === "Lock" || label === "Strong" ? "start" : label === "Situational" ? "warn" : label === "Fringe" ? "muted" : "sit",
		className: cn("min-w-8 justify-center font-mono tabular", className),
		children: label
	});
}
function ConfidenceBadge({ label, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		tone: label === "High" ? "start" : label === "Med" ? "warn" : "muted",
		className: cn("justify-center font-mono tabular", className),
		children: label
	});
}
function PosMark({ pos }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "inline-flex w-8 justify-center font-mono text-[10px] font-medium tracking-wider text-muted",
		children: pos
	});
}
//#endregion
export { KeepBadge as n, PosMark as r, ConfidenceBadge as t };

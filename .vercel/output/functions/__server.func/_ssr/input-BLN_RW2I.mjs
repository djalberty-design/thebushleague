import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { D as cn } from "./league-BHDWdH1h.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/input-BLN_RW2I.js
var import_jsx_runtime = require_jsx_runtime();
function Input({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		className: cn("h-10 w-full rounded-md border border-border bg-bg px-3 text-sm text-fg placeholder:text-subtle outline-none transition-colors duration-150 focus:border-border-strong focus:ring-2 focus:ring-ring/40", className),
		...props
	});
}
function Textarea({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: cn("min-h-24 w-full rounded-md border border-border bg-bg px-3 py-2 text-sm text-fg placeholder:text-subtle outline-none focus:border-border-strong focus:ring-2 focus:ring-ring/40", className),
		...props
	});
}
//#endregion
export { Textarea as n, Input as t };

import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as createServerFn } from "./ssr.mjs";
import { n as createSsrRpc, t as Button } from "./createSsrRpc-kaWDhsSj.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/brief-BvjivZIc.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var analyzeDecision = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("2c4a5daae470e9f69d839ff1fc1842a475dc8d0ae656e44f0de8a56d10cc87df"));
function OsBrief({ kind, prompt }) {
	const [text, setText] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	async function run() {
		setBusy(true);
		setError(null);
		const res = await analyzeDecision({ data: {
			kind,
			prompt
		} });
		setBusy(false);
		if (!res.ok) setError(res.error);
		else setText(res.text);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-lg border border-border bg-bg px-4 py-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs tracking-widest text-subtle uppercase",
					children: "OS brief"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					variant: "outline",
					onClick: () => void run(),
					disabled: busy,
					children: busy ? "Writing…" : text ? "Rewrite" : "Ask Grok"
				})]
			}),
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-sit",
				children: error
			}),
			text && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 whitespace-pre-wrap text-sm leading-relaxed text-muted",
				children: text
			})
		]
	});
}
//#endregion
export { OsBrief as t };

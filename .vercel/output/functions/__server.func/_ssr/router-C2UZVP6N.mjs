import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { _ as lazyRouteComponent, b as Link, d as Scripts, f as HeadContent, g as Outlet, h as createRouter, p as useRouterState, v as createFileRoute, x as useRouter, y as createRootRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { A as slugify, D as cn, O as normalizeName, a as DRAFT_ORDER, h as PLAYERS, p as NFL_TEAMS, w as applyLockedKeepers } from "./league-BHDWdH1h.mjs";
import { r as __exportAll, t as ESPN_TAPE } from "./espn-tape-C8F9iuS2.mjs";
import { c as LayoutDashboard, d as Cable, f as Bookmark, i as Swords, l as Ellipsis, n as UserRoundPlus, o as ScrollText, p as ArrowLeftRight, r as TriangleAlert, s as ListOrdered, t as X } from "../_libs/lucide-react.mjs";
import { n as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { a as union, i as string, n as number, r as object, t as literal } from "../_libs/zod.mjs";
import { a as DialogPortal, i as DialogOverlay, n as DialogClose, o as DialogTitle, r as DialogContent, s as DialogTrigger, t as Dialog } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { a as Trigger, i as Root3, n as Portal, r as Provider, t as Content2 } from "../_libs/@radix-ui/react-tooltip+[...].mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-C2UZVP6N.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-red-500",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-zinc-500 dark:text-zinc-400",
				children: error.message || "An unexpected error occurred. Try reloading the page."
			})
		]
	});
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	if (typeof window === "undefined") return () => {};
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	const parentOrigin = resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		if (envelope.data.type === "hello") {
			if (!HelloSchema.safeParse(event.data).success) return;
			announce();
			return;
		}
		if (envelope.data.type === "navigate") {
			const parsed = NavigateSchema.safeParse(event.data);
			if (!parsed.success) return;
			navigate(parsed.data.path);
			queueMicrotask(reportLocation);
			return;
		}
		if (envelope.data.type === "history") {
			const parsed = HistorySchema.safeParse(event.data);
			if (!parsed.success) return;
			if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
			window.history.go(parsed.data.delta);
		}
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
var TooltipProvider = Provider;
var Tooltip = Root3;
var TooltipTrigger = Trigger;
function TooltipContent({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
		sideOffset: 6,
		className: cn("z-50 rounded-md border border-border bg-bg-elevated px-2.5 py-1.5 text-xs text-fg shadow-none", className),
		...props
	}) });
}
var Sheet = Dialog;
var SheetTrigger = DialogTrigger;
function SheetContent({ className, children, side = "right", title, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, { className: "fixed inset-0 z-50 bg-bg/70 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
		className: cn("fixed z-50 border-border bg-bg-elevated p-5 shadow-none", side === "right" && "inset-y-0 right-0 h-full w-[min(100%,22rem)] border-l data-[state=open]:animate-in data-[state=open]:slide-in-from-right", side === "left" && "inset-y-0 left-0 h-full w-[min(100%,18rem)] border-r", side === "bottom" && "inset-x-0 bottom-0 rounded-t-xl border-t", className),
		...props,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
				className: title ? "font-display text-lg text-fg" : "sr-only",
				children: title ?? "Panel"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogClose, {
				className: "absolute top-4 right-4 rounded-sm p-1 text-muted hover:text-fg",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
			}),
			children
		]
	})] });
}
var ESPN_SNAPSHOT = [{
	"espnLeagueId": "1014874",
	"name": "The Bush League",
	"season": 2026,
	"week": 4,
	"myTeamId": 1,
	"keepersLocked": true,
	"teams": [
		{
			"id": 1,
			"name": "Let Maye Cook",
			"abbrev": "MAYE",
			"owner": "DJ Alberty",
			"w": 1,
			"l": 2,
			"t": 0,
			"pf": 491.7,
			"pa": 548.5,
			"waivers": 7,
			"you": true,
			"players": [
				{
					"name": "Drake Maye",
					"pos": "QB",
					"nfl": "NE",
					"ir": false
				},
				{
					"name": "Ashton Jeanty",
					"pos": "RB",
					"nfl": "LV",
					"ir": false
				},
				{
					"name": "Tetairoa McMillan",
					"pos": "WR",
					"nfl": "CAR",
					"ir": false
				},
				{
					"name": "Tyler Warren",
					"pos": "TE",
					"nfl": "IND",
					"ir": false
				},
				{
					"name": "Tee Higgins",
					"pos": "WR",
					"nfl": "CIN",
					"ir": false
				},
				{
					"name": "Kyler Murray",
					"pos": "QB",
					"nfl": "MIN",
					"ir": false
				},
				{
					"name": "Bhayshul Tuten",
					"pos": "RB",
					"nfl": "JAC",
					"ir": false
				},
				{
					"name": "Brian Thomas Jr.",
					"pos": "WR",
					"nfl": "JAC",
					"ir": false
				},
				{
					"name": "Wan'Dale Robinson",
					"pos": "WR",
					"nfl": "TEN",
					"ir": false
				},
				{
					"name": "Kyle Monangai",
					"pos": "RB",
					"nfl": "CHI",
					"ir": false
				},
				{
					"name": "Kenyon Sadiq",
					"pos": "TE",
					"nfl": "NYJ",
					"ir": false
				},
				{
					"name": "Patriots DST",
					"pos": "DST",
					"nfl": "NE",
					"ir": false
				},
				{
					"name": "Caleb Douglas",
					"pos": "WR",
					"nfl": "MIA",
					"ir": false
				},
				{
					"name": "Carnell Tate",
					"pos": "WR",
					"nfl": "TEN",
					"ir": false
				},
				{
					"name": "Cam Ward",
					"pos": "QB",
					"nfl": "TEN",
					"ir": false
				},
				{
					"name": "TreVeyon Henderson",
					"pos": "RB",
					"nfl": "NE",
					"ir": false
				},
				{
					"name": "Ollie Gordon II",
					"pos": "RB",
					"nfl": "MIA",
					"ir": false
				},
				{
					"name": "Raiders DST",
					"pos": "DST",
					"nfl": "LV",
					"ir": false
				}
			]
		},
		{
			"id": 2,
			"name": "Great Value Belichick",
			"abbrev": "GVB",
			"owner": "Eric eats Eggs",
			"w": 1,
			"l": 2,
			"t": 0,
			"pf": 474.1,
			"pa": 647.8,
			"waivers": 8,
			"you": false,
			"players": [
				{
					"name": "Bijan Robinson",
					"pos": "RB",
					"nfl": "ATL",
					"ir": false
				},
				{
					"name": "James Cook III",
					"pos": "RB",
					"nfl": "BUF",
					"ir": false
				},
				{
					"name": "Justin Herbert",
					"pos": "QB",
					"nfl": "LAC",
					"ir": false
				},
				{
					"name": "Malik Nabers",
					"pos": "WR",
					"nfl": "NYG",
					"ir": false
				},
				{
					"name": "Colston Loveland",
					"pos": "TE",
					"nfl": "CHI",
					"ir": false
				},
				{
					"name": "Rome Odunze",
					"pos": "WR",
					"nfl": "CHI",
					"ir": false
				},
				{
					"name": "David Montgomery",
					"pos": "RB",
					"nfl": "HOU",
					"ir": false
				},
				{
					"name": "Michael Wilson",
					"pos": "WR",
					"nfl": "ARI",
					"ir": false
				},
				{
					"name": "Jakobi Meyers",
					"pos": "WR",
					"nfl": "JAC",
					"ir": false
				},
				{
					"name": "Jordyn Tyson",
					"pos": "WR",
					"nfl": "NO",
					"ir": true
				},
				{
					"name": "Jonah Coleman",
					"pos": "RB",
					"nfl": "DEN",
					"ir": false
				},
				{
					"name": "Geno Smith",
					"pos": "QB",
					"nfl": "NYJ",
					"ir": false
				},
				{
					"name": "Tyler Allgeier",
					"pos": "RB",
					"nfl": "ARI",
					"ir": false
				},
				{
					"name": "Jalen Coker",
					"pos": "WR",
					"nfl": "CAR",
					"ir": false
				},
				{
					"name": "Bryce Young",
					"pos": "QB",
					"nfl": "CAR",
					"ir": false
				},
				{
					"name": "Braelon Allen",
					"pos": "RB",
					"nfl": "NYJ",
					"ir": false
				},
				{
					"name": "Terrance Ferguson",
					"pos": "TE",
					"nfl": "LAR",
					"ir": false
				},
				{
					"name": "Steelers DST",
					"pos": "DST",
					"nfl": "PIT",
					"ir": false
				},
				{
					"name": "Brenton Strange",
					"pos": "TE",
					"nfl": "JAC",
					"ir": false
				}
			]
		},
		{
			"id": 3,
			"name": "Tommy Ain`t Got No Job",
			"abbrev": "TH08",
			"owner": "th1232",
			"w": 1,
			"l": 2,
			"t": 0,
			"pf": 540.5,
			"pa": 702.5,
			"waivers": 2,
			"you": false,
			"players": [
				{
					"name": "Josh Allen",
					"pos": "QB",
					"nfl": "BUF",
					"ir": false
				},
				{
					"name": "Bo Nix",
					"pos": "QB",
					"nfl": "DEN",
					"ir": false
				},
				{
					"name": "Saquon Barkley",
					"pos": "RB",
					"nfl": "PHI",
					"ir": false
				},
				{
					"name": "Zay Flowers",
					"pos": "WR",
					"nfl": "BAL",
					"ir": false
				},
				{
					"name": "Ladd McConkey",
					"pos": "WR",
					"nfl": "LAC",
					"ir": false
				},
				{
					"name": "Bucky Irving",
					"pos": "RB",
					"nfl": "TB",
					"ir": false
				},
				{
					"name": "Jadarian Price",
					"pos": "RB",
					"nfl": "SEA",
					"ir": false
				},
				{
					"name": "Alec Pierce",
					"pos": "WR",
					"nfl": "IND",
					"ir": false
				},
				{
					"name": "Travis Kelce",
					"pos": "TE",
					"nfl": "KC",
					"ir": false
				},
				{
					"name": "Sam Darnold",
					"pos": "QB",
					"nfl": "SEA",
					"ir": false
				},
				{
					"name": "Romeo Doubs",
					"pos": "WR",
					"nfl": "NE",
					"ir": false
				},
				{
					"name": "Jordan Mason",
					"pos": "RB",
					"nfl": "MIN",
					"ir": true
				},
				{
					"name": "Hunter Henry",
					"pos": "TE",
					"nfl": "NE",
					"ir": false
				},
				{
					"name": "Texans DST",
					"pos": "DST",
					"nfl": "HOU",
					"ir": false
				},
				{
					"name": "Tre Tucker",
					"pos": "WR",
					"nfl": "LV",
					"ir": false
				},
				{
					"name": "Michael Penix Jr.",
					"pos": "QB",
					"nfl": "ATL",
					"ir": false
				},
				{
					"name": "Dontayvion Wicks",
					"pos": "WR",
					"nfl": "PHI",
					"ir": false
				},
				{
					"name": "Keenan Allen",
					"pos": "WR",
					"nfl": "IND",
					"ir": false
				},
				{
					"name": "Malik Washington",
					"pos": "WR",
					"nfl": "MIA",
					"ir": false
				}
			]
		},
		{
			"id": 6,
			"name": "Lamar's LinkedIn Warriors ",
			"abbrev": "LLW",
			"owner": "ESPNFAN2110365779",
			"w": 1,
			"l": 2,
			"t": 0,
			"pf": 604.4,
			"pa": 576.8,
			"waivers": 4,
			"you": false,
			"players": [
				{
					"name": "Lamar Jackson",
					"pos": "QB",
					"nfl": "BAL",
					"ir": false
				},
				{
					"name": "Jalen Hurts",
					"pos": "QB",
					"nfl": "PHI",
					"ir": false
				},
				{
					"name": "Justin Jefferson",
					"pos": "WR",
					"nfl": "MIN",
					"ir": false
				},
				{
					"name": "Trey McBride",
					"pos": "TE",
					"nfl": "ARI",
					"ir": false
				},
				{
					"name": "Breece Hall",
					"pos": "RB",
					"nfl": "NYJ",
					"ir": false
				},
				{
					"name": "Terry McLaurin",
					"pos": "WR",
					"nfl": "WAS",
					"ir": false
				},
				{
					"name": "Courtland Sutton",
					"pos": "WR",
					"nfl": "DEN",
					"ir": false
				},
				{
					"name": "Marvin Harrison Jr.",
					"pos": "WR",
					"nfl": "ARI",
					"ir": false
				},
				{
					"name": "DK Metcalf",
					"pos": "WR",
					"nfl": "PIT",
					"ir": false
				},
				{
					"name": "Chuba Hubbard",
					"pos": "RB",
					"nfl": "CAR",
					"ir": false
				},
				{
					"name": "C.J. Stroud",
					"pos": "QB",
					"nfl": "HOU",
					"ir": false
				},
				{
					"name": "KC Concepcion",
					"pos": "WR",
					"nfl": "CLE",
					"ir": false
				},
				{
					"name": "Tucker Kraft",
					"pos": "TE",
					"nfl": "GB",
					"ir": false
				},
				{
					"name": "Quinshon Judkins",
					"pos": "RB",
					"nfl": "CLE",
					"ir": false
				},
				{
					"name": "Zachariah Branch",
					"pos": "WR",
					"nfl": "ATL",
					"ir": false
				},
				{
					"name": "T.J. Hockenson",
					"pos": "TE",
					"nfl": "MIN",
					"ir": false
				},
				{
					"name": "49ers DST",
					"pos": "DST",
					"nfl": "SF",
					"ir": false
				},
				{
					"name": "Case Keenum",
					"pos": "QB",
					"nfl": "CHI",
					"ir": false
				}
			]
		},
		{
			"id": 7,
			"name": "Yuck Fou",
			"abbrev": "FU",
			"owner": "pvaretimos",
			"w": 2,
			"l": 1,
			"t": 0,
			"pf": 700.7,
			"pa": 525.5,
			"waivers": 6,
			"you": false,
			"players": [
				{
					"name": "Puka Nacua",
					"pos": "WR",
					"nfl": "LAR",
					"ir": false
				},
				{
					"name": "Christian McCaffrey",
					"pos": "RB",
					"nfl": "SF",
					"ir": false
				},
				{
					"name": "Kenneth Walker III",
					"pos": "RB",
					"nfl": "KC",
					"ir": false
				},
				{
					"name": "Omarion Hampton",
					"pos": "RB",
					"nfl": "LAC",
					"ir": false
				},
				{
					"name": "Garrett Wilson",
					"pos": "WR",
					"nfl": "NYJ",
					"ir": false
				},
				{
					"name": "Jordan Love",
					"pos": "QB",
					"nfl": "GB",
					"ir": false
				},
				{
					"name": "Jared Goff",
					"pos": "QB",
					"nfl": "DET",
					"ir": false
				},
				{
					"name": "Harold Fannin Jr.",
					"pos": "TE",
					"nfl": "CLE",
					"ir": false
				},
				{
					"name": "Chris Olave",
					"pos": "WR",
					"nfl": "NO",
					"ir": false
				},
				{
					"name": "Tyler Shough",
					"pos": "QB",
					"nfl": "NO",
					"ir": false
				},
				{
					"name": "Rico Dowdle",
					"pos": "RB",
					"nfl": "PIT",
					"ir": false
				},
				{
					"name": "Chris Godwin Jr.",
					"pos": "WR",
					"nfl": "TB",
					"ir": false
				},
				{
					"name": "Dalton Kincaid",
					"pos": "TE",
					"nfl": "BUF",
					"ir": false
				},
				{
					"name": "RJ Harvey",
					"pos": "RB",
					"nfl": "DEN",
					"ir": true
				},
				{
					"name": "Deebo Samuel Sr.",
					"pos": "WR",
					"nfl": "SF",
					"ir": false
				},
				{
					"name": "Rashid Shaheed",
					"pos": "WR",
					"nfl": "SEA",
					"ir": false
				},
				{
					"name": "Chargers DST",
					"pos": "DST",
					"nfl": "LAC",
					"ir": false
				},
				{
					"name": "Devaughn Vele",
					"pos": "WR",
					"nfl": "NO",
					"ir": false
				},
				{
					"name": "Emanuel Wilson",
					"pos": "RB",
					"nfl": "SEA",
					"ir": false
				}
			]
		},
		{
			"id": 8,
			"name": "6 Ways from Sunday",
			"abbrev": "BEVS",
			"owner": "Andy_bev",
			"w": 3,
			"l": 0,
			"t": 0,
			"pf": 670.5,
			"pa": 607.7,
			"waivers": 9,
			"you": false,
			"players": [
				{
					"name": "Jaxon Smith-Njigba",
					"pos": "WR",
					"nfl": "SEA",
					"ir": false
				},
				{
					"name": "Joe Burrow",
					"pos": "QB",
					"nfl": "CIN",
					"ir": false
				},
				{
					"name": "Brock Bowers",
					"pos": "TE",
					"nfl": "LV",
					"ir": false
				},
				{
					"name": "Chase Brown",
					"pos": "RB",
					"nfl": "CIN",
					"ir": false
				},
				{
					"name": "Travis Etienne Jr.",
					"pos": "RB",
					"nfl": "NO",
					"ir": false
				},
				{
					"name": "Luther Burden III",
					"pos": "WR",
					"nfl": "CHI",
					"ir": false
				},
				{
					"name": "Parker Washington",
					"pos": "WR",
					"nfl": "JAC",
					"ir": false
				},
				{
					"name": "Trevor Lawrence",
					"pos": "QB",
					"nfl": "JAC",
					"ir": false
				},
				{
					"name": "Rashee Rice",
					"pos": "WR",
					"nfl": "KC",
					"ir": false
				},
				{
					"name": "Christian Watson",
					"pos": "WR",
					"nfl": "GB",
					"ir": false
				},
				{
					"name": "J.K. Dobbins",
					"pos": "RB",
					"nfl": "DEN",
					"ir": false
				},
				{
					"name": "Blake Corum",
					"pos": "RB",
					"nfl": "LAR",
					"ir": false
				},
				{
					"name": "Josh Downs",
					"pos": "WR",
					"nfl": "IND",
					"ir": false
				},
				{
					"name": "Jacoby Brissett",
					"pos": "QB",
					"nfl": "ARI",
					"ir": false
				},
				{
					"name": "Zach Charbonnet",
					"pos": "RB",
					"nfl": "SEA",
					"ir": true
				},
				{
					"name": "Marcus Mariota",
					"pos": "QB",
					"nfl": "WAS",
					"ir": false
				},
				{
					"name": "Emmett Johnson",
					"pos": "RB",
					"nfl": "KC",
					"ir": false
				},
				{
					"name": "Kendre Miller",
					"pos": "RB",
					"nfl": "NO",
					"ir": false
				},
				{
					"name": "Ravens DST",
					"pos": "DST",
					"nfl": "BAL",
					"ir": false
				}
			]
		},
		{
			"id": 9,
			"name": "Baby Got Dak",
			"abbrev": "ANG",
			"owner": "Along Came Molly",
			"w": 1,
			"l": 2,
			"t": 0,
			"pf": 511.2,
			"pa": 620.1,
			"waivers": 1,
			"you": false,
			"players": [
				{
					"name": "Dak Prescott",
					"pos": "QB",
					"nfl": "DAL",
					"ir": false
				},
				{
					"name": "Brock Purdy",
					"pos": "QB",
					"nfl": "SF",
					"ir": false
				},
				{
					"name": "Jeremiyah Love",
					"pos": "RB",
					"nfl": "ARI",
					"ir": false
				},
				{
					"name": "A.J. Brown",
					"pos": "WR",
					"nfl": "NE",
					"ir": true
				},
				{
					"name": "Jaylen Waddle",
					"pos": "WR",
					"nfl": "DEN",
					"ir": false
				},
				{
					"name": "Rhamondre Stevenson",
					"pos": "RB",
					"nfl": "NE",
					"ir": false
				},
				{
					"name": "Emeka Egbuka",
					"pos": "WR",
					"nfl": "TB",
					"ir": false
				},
				{
					"name": "Jacory Croskey-Merritt",
					"pos": "RB",
					"nfl": "WAS",
					"ir": false
				},
				{
					"name": "Matthew Golden",
					"pos": "WR",
					"nfl": "GB",
					"ir": false
				},
				{
					"name": "Jake Ferguson",
					"pos": "TE",
					"nfl": "DAL",
					"ir": false
				},
				{
					"name": "Malik Willis",
					"pos": "QB",
					"nfl": "MIA",
					"ir": false
				},
				{
					"name": "MarShawn Lloyd",
					"pos": "RB",
					"nfl": "GB",
					"ir": false
				},
				{
					"name": "Xavier Worthy",
					"pos": "WR",
					"nfl": "KC",
					"ir": false
				},
				{
					"name": "Deshaun Watson",
					"pos": "QB",
					"nfl": "CLE",
					"ir": false
				},
				{
					"name": "Denzel Boston",
					"pos": "WR",
					"nfl": "CLE",
					"ir": false
				},
				{
					"name": "Mike Gesicki",
					"pos": "TE",
					"nfl": "CIN",
					"ir": false
				},
				{
					"name": "Adonai Mitchell",
					"pos": "WR",
					"nfl": "NYJ",
					"ir": false
				},
				{
					"name": "Alvin Kamara",
					"pos": "RB",
					"nfl": "NO",
					"ir": false
				},
				{
					"name": "Bengals DST",
					"pos": "DST",
					"nfl": "CIN",
					"ir": false
				}
			]
		},
		{
			"id": 10,
			"name": "Nabers think im sellin dope ",
			"abbrev": "NSD",
			"owner": "ESPNFAN4712698577",
			"w": 2,
			"l": 1,
			"t": 0,
			"pf": 666.2,
			"pa": 614,
			"waivers": 5,
			"you": false,
			"players": [
				{
					"name": "Jahmyr Gibbs",
					"pos": "RB",
					"nfl": "DET",
					"ir": false
				},
				{
					"name": "Caleb Williams",
					"pos": "QB",
					"nfl": "CHI",
					"ir": false
				},
				{
					"name": "CeeDee Lamb",
					"pos": "WR",
					"nfl": "DAL",
					"ir": false
				},
				{
					"name": "George Pickens",
					"pos": "WR",
					"nfl": "DAL",
					"ir": false
				},
				{
					"name": "Kyren Williams",
					"pos": "RB",
					"nfl": "LAR",
					"ir": false
				},
				{
					"name": "Jameson Williams",
					"pos": "WR",
					"nfl": "DET",
					"ir": false
				},
				{
					"name": "DJ Moore",
					"pos": "WR",
					"nfl": "BUF",
					"ir": false
				},
				{
					"name": "Daniel Jones",
					"pos": "QB",
					"nfl": "IND",
					"ir": false
				},
				{
					"name": "Sam LaPorta",
					"pos": "TE",
					"nfl": "DET",
					"ir": false
				},
				{
					"name": "Kenny Gainwell",
					"pos": "RB",
					"nfl": "TB",
					"ir": false
				},
				{
					"name": "Mike Evans",
					"pos": "WR",
					"nfl": "SF",
					"ir": false
				},
				{
					"name": "Isaiah Likely",
					"pos": "TE",
					"nfl": "NYG",
					"ir": false
				},
				{
					"name": "Makai Lemon",
					"pos": "WR",
					"nfl": "PHI",
					"ir": false
				},
				{
					"name": "Fernando Mendoza",
					"pos": "QB",
					"nfl": "LV",
					"ir": false
				},
				{
					"name": "Kyle Pitts Sr.",
					"pos": "TE",
					"nfl": "ATL",
					"ir": false
				},
				{
					"name": "Seahawks DST",
					"pos": "DST",
					"nfl": "SEA",
					"ir": false
				},
				{
					"name": "Calvin Ridley",
					"pos": "WR",
					"nfl": "TEN",
					"ir": false
				},
				{
					"name": "Kirk Cousins",
					"pos": "QB",
					"nfl": "LV",
					"ir": false
				}
			]
		},
		{
			"id": 11,
			"name": "Do It For State",
			"abbrev": "DIFS",
			"owner": "jennhull86",
			"w": 1,
			"l": 2,
			"t": 0,
			"pf": 541.7,
			"pa": 540.4,
			"waivers": 3,
			"you": false,
			"players": [
				{
					"name": "Jayden Daniels",
					"pos": "QB",
					"nfl": "WAS",
					"ir": false
				},
				{
					"name": "Jonathan Taylor",
					"pos": "RB",
					"nfl": "IND",
					"ir": false
				},
				{
					"name": "Drake London",
					"pos": "WR",
					"nfl": "ATL",
					"ir": false
				},
				{
					"name": "Nico Collins",
					"pos": "WR",
					"nfl": "HOU",
					"ir": false
				},
				{
					"name": "Javonte Williams",
					"pos": "RB",
					"nfl": "DAL",
					"ir": false
				},
				{
					"name": "DeVonta Smith",
					"pos": "WR",
					"nfl": "PHI",
					"ir": false
				},
				{
					"name": "Baker Mayfield",
					"pos": "QB",
					"nfl": "TB",
					"ir": true
				},
				{
					"name": "Michael Pittman Jr.",
					"pos": "WR",
					"nfl": "PIT",
					"ir": false
				},
				{
					"name": "Dallas Goedert",
					"pos": "TE",
					"nfl": "PHI",
					"ir": false
				},
				{
					"name": "Tony Pollard",
					"pos": "RB",
					"nfl": "TEN",
					"ir": false
				},
				{
					"name": "Jordan Addison",
					"pos": "WR",
					"nfl": "MIN",
					"ir": false
				},
				{
					"name": "Stefon Diggs",
					"pos": "WR",
					"nfl": "WAS",
					"ir": false
				},
				{
					"name": "Rachaad White",
					"pos": "RB",
					"nfl": "WAS",
					"ir": false
				},
				{
					"name": "Mark Andrews",
					"pos": "TE",
					"nfl": "BAL",
					"ir": false
				},
				{
					"name": "Khalil Shakir",
					"pos": "WR",
					"nfl": "BUF",
					"ir": false
				},
				{
					"name": "Woody Marks",
					"pos": "RB",
					"nfl": "HOU",
					"ir": false
				},
				{
					"name": "Chiefs DST",
					"pos": "DST",
					"nfl": "KC",
					"ir": false
				},
				{
					"name": "Bills DST",
					"pos": "DST",
					"nfl": "BUF",
					"ir": false
				},
				{
					"name": "Kalif Raymond",
					"pos": "WR",
					"nfl": "CHI",
					"ir": false
				}
			]
		},
		{
			"id": 13,
			"name": "DONKY PUNCHRS",
			"abbrev": "DKPZ",
			"owner": "seanwellington014",
			"w": 2,
			"l": 1,
			"t": 0,
			"pf": 744.9,
			"pa": 562.5,
			"waivers": 10,
			"you": false,
			"players": [
				{
					"name": "Ja'Marr Chase",
					"pos": "WR",
					"nfl": "CIN",
					"ir": false
				},
				{
					"name": "Amon-Ra St. Brown",
					"pos": "WR",
					"nfl": "DET",
					"ir": false
				},
				{
					"name": "Derrick Henry",
					"pos": "RB",
					"nfl": "BAL",
					"ir": false
				},
				{
					"name": "Patrick Mahomes",
					"pos": "QB",
					"nfl": "KC",
					"ir": false
				},
				{
					"name": "Davante Adams",
					"pos": "WR",
					"nfl": "LAR",
					"ir": false
				},
				{
					"name": "D'Andre Swift",
					"pos": "RB",
					"nfl": "CHI",
					"ir": false
				},
				{
					"name": "Jaylen Warren",
					"pos": "RB",
					"nfl": "PIT",
					"ir": false
				},
				{
					"name": "George Kittle",
					"pos": "TE",
					"nfl": "SF",
					"ir": false
				},
				{
					"name": "Matthew Stafford",
					"pos": "QB",
					"nfl": "LAR",
					"ir": false
				},
				{
					"name": "Cam Skattebo",
					"pos": "RB",
					"nfl": "NYG",
					"ir": false
				},
				{
					"name": "Quentin Johnston",
					"pos": "WR",
					"nfl": "LAC",
					"ir": false
				},
				{
					"name": "Josh Jacobs",
					"pos": "RB",
					"nfl": "GB",
					"ir": false
				},
				{
					"name": "Aaron Jones Sr.",
					"pos": "RB",
					"nfl": "MIN",
					"ir": false
				},
				{
					"name": "Aaron Rodgers",
					"pos": "QB",
					"nfl": "PIT",
					"ir": false
				},
				{
					"name": "Juwan Johnson",
					"pos": "TE",
					"nfl": "NO",
					"ir": false
				},
				{
					"name": "Vikings DST",
					"pos": "DST",
					"nfl": "MIN",
					"ir": false
				},
				{
					"name": "Jameis Winston",
					"pos": "QB",
					"nfl": "NYG",
					"ir": false
				},
				{
					"name": "Broncos DST",
					"pos": "DST",
					"nfl": "DEN",
					"ir": false
				}
			]
		}
	],
	"matchups": [
		{
			"week": 1,
			"homeId": 3,
			"awayId": 6
		},
		{
			"week": 1,
			"homeId": 8,
			"awayId": 1
		},
		{
			"week": 1,
			"homeId": 10,
			"awayId": 9
		},
		{
			"week": 1,
			"homeId": 2,
			"awayId": 11
		},
		{
			"week": 1,
			"homeId": 7,
			"awayId": 13
		},
		{
			"week": 2,
			"homeId": 6,
			"awayId": 1
		},
		{
			"week": 2,
			"homeId": 9,
			"awayId": 3
		},
		{
			"week": 2,
			"homeId": 11,
			"awayId": 8
		},
		{
			"week": 2,
			"homeId": 13,
			"awayId": 10
		},
		{
			"week": 2,
			"homeId": 7,
			"awayId": 2
		},
		{
			"week": 3,
			"homeId": 9,
			"awayId": 6
		},
		{
			"week": 3,
			"homeId": 1,
			"awayId": 11
		},
		{
			"week": 3,
			"homeId": 3,
			"awayId": 13
		},
		{
			"week": 3,
			"homeId": 8,
			"awayId": 7
		},
		{
			"week": 3,
			"homeId": 10,
			"awayId": 2
		},
		{
			"week": 4,
			"homeId": 6,
			"awayId": 11
		},
		{
			"week": 4,
			"homeId": 13,
			"awayId": 9
		},
		{
			"week": 4,
			"homeId": 7,
			"awayId": 1
		},
		{
			"week": 4,
			"homeId": 2,
			"awayId": 3
		},
		{
			"week": 4,
			"homeId": 10,
			"awayId": 8
		},
		{
			"week": 5,
			"homeId": 13,
			"awayId": 6
		},
		{
			"week": 5,
			"homeId": 11,
			"awayId": 7
		},
		{
			"week": 5,
			"homeId": 9,
			"awayId": 2
		},
		{
			"week": 5,
			"homeId": 1,
			"awayId": 10
		},
		{
			"week": 5,
			"homeId": 3,
			"awayId": 8
		},
		{
			"week": 6,
			"homeId": 6,
			"awayId": 7
		},
		{
			"week": 6,
			"homeId": 2,
			"awayId": 13
		},
		{
			"week": 6,
			"homeId": 10,
			"awayId": 11
		},
		{
			"week": 6,
			"homeId": 8,
			"awayId": 9
		},
		{
			"week": 6,
			"homeId": 3,
			"awayId": 1
		},
		{
			"week": 7,
			"homeId": 2,
			"awayId": 6
		},
		{
			"week": 7,
			"homeId": 7,
			"awayId": 10
		},
		{
			"week": 7,
			"homeId": 13,
			"awayId": 8
		},
		{
			"week": 7,
			"homeId": 11,
			"awayId": 3
		},
		{
			"week": 7,
			"homeId": 9,
			"awayId": 1
		},
		{
			"week": 8,
			"homeId": 6,
			"awayId": 10
		},
		{
			"week": 8,
			"homeId": 8,
			"awayId": 2
		},
		{
			"week": 8,
			"homeId": 3,
			"awayId": 7
		},
		{
			"week": 8,
			"homeId": 1,
			"awayId": 13
		},
		{
			"week": 8,
			"homeId": 9,
			"awayId": 11
		},
		{
			"week": 9,
			"homeId": 8,
			"awayId": 6
		},
		{
			"week": 9,
			"homeId": 10,
			"awayId": 3
		},
		{
			"week": 9,
			"homeId": 2,
			"awayId": 1
		},
		{
			"week": 9,
			"homeId": 7,
			"awayId": 9
		},
		{
			"week": 9,
			"homeId": 13,
			"awayId": 11
		},
		{
			"week": 10,
			"homeId": 6,
			"awayId": 3
		},
		{
			"week": 10,
			"homeId": 1,
			"awayId": 8
		},
		{
			"week": 10,
			"homeId": 9,
			"awayId": 10
		},
		{
			"week": 10,
			"homeId": 11,
			"awayId": 2
		},
		{
			"week": 10,
			"homeId": 13,
			"awayId": 7
		},
		{
			"week": 11,
			"homeId": 1,
			"awayId": 6
		},
		{
			"week": 11,
			"homeId": 3,
			"awayId": 9
		},
		{
			"week": 11,
			"homeId": 8,
			"awayId": 11
		},
		{
			"week": 11,
			"homeId": 10,
			"awayId": 13
		},
		{
			"week": 11,
			"homeId": 2,
			"awayId": 7
		},
		{
			"week": 12,
			"homeId": 6,
			"awayId": 9
		},
		{
			"week": 12,
			"homeId": 11,
			"awayId": 1
		},
		{
			"week": 12,
			"homeId": 13,
			"awayId": 3
		},
		{
			"week": 12,
			"homeId": 7,
			"awayId": 8
		},
		{
			"week": 12,
			"homeId": 2,
			"awayId": 10
		},
		{
			"week": 13,
			"homeId": 11,
			"awayId": 6
		},
		{
			"week": 13,
			"homeId": 9,
			"awayId": 13
		},
		{
			"week": 13,
			"homeId": 1,
			"awayId": 7
		},
		{
			"week": 13,
			"homeId": 3,
			"awayId": 2
		},
		{
			"week": 13,
			"homeId": 8,
			"awayId": 10
		},
		{
			"week": 14,
			"homeId": 6,
			"awayId": 13
		},
		{
			"week": 14,
			"homeId": 7,
			"awayId": 11
		},
		{
			"week": 14,
			"homeId": 2,
			"awayId": 9
		},
		{
			"week": 14,
			"homeId": 10,
			"awayId": 1
		},
		{
			"week": 14,
			"homeId": 8,
			"awayId": 3
		}
	]
}, {
	"espnLeagueId": "210326445",
	"name": "TW Fantasy",
	"season": 2026,
	"week": 4,
	"myTeamId": 1,
	"keepersLocked": false,
	"teams": [
		{
			"id": 1,
			"name": "Utility Man",
			"abbrev": "GRID",
			"owner": "DJ Alberty",
			"w": 0,
			"l": 3,
			"t": 0,
			"pf": 439.9,
			"pa": 631.9,
			"waivers": 9,
			"you": true,
			"players": [
				{
					"name": "Drake Maye",
					"pos": "QB",
					"nfl": "NE",
					"ir": false
				},
				{
					"name": "Ashton Jeanty",
					"pos": "RB",
					"nfl": "LV",
					"ir": false
				},
				{
					"name": "Malik Nabers",
					"pos": "WR",
					"nfl": "NYG",
					"ir": false
				},
				{
					"name": "Tetairoa McMillan",
					"pos": "WR",
					"nfl": "CAR",
					"ir": false
				},
				{
					"name": "Rhamondre Stevenson",
					"pos": "RB",
					"nfl": "NE",
					"ir": false
				},
				{
					"name": "Tyler Warren",
					"pos": "TE",
					"nfl": "IND",
					"ir": false
				},
				{
					"name": "Carnell Tate",
					"pos": "WR",
					"nfl": "TEN",
					"ir": false
				},
				{
					"name": "Alec Pierce",
					"pos": "WR",
					"nfl": "IND",
					"ir": false
				},
				{
					"name": "Jacory Croskey-Merritt",
					"pos": "RB",
					"nfl": "WAS",
					"ir": false
				},
				{
					"name": "Jordan Mason",
					"pos": "RB",
					"nfl": "MIN",
					"ir": false
				},
				{
					"name": "Romeo Doubs",
					"pos": "WR",
					"nfl": "NE",
					"ir": false
				},
				{
					"name": "Cam Ward",
					"pos": "QB",
					"nfl": "TEN",
					"ir": false
				},
				{
					"name": "Zach Charbonnet",
					"pos": "RB",
					"nfl": "SEA",
					"ir": false
				},
				{
					"name": "Jordyn Tyson",
					"pos": "WR",
					"nfl": "NO",
					"ir": true
				},
				{
					"name": "Patriots DST",
					"pos": "DST",
					"nfl": "NE",
					"ir": false
				},
				{
					"name": "Alvin Kamara",
					"pos": "RB",
					"nfl": "NO",
					"ir": false
				},
				{
					"name": "Dalton Schultz",
					"pos": "TE",
					"nfl": "HOU",
					"ir": false
				},
				{
					"name": "Geno Smith",
					"pos": "QB",
					"nfl": "NYJ",
					"ir": false
				},
				{
					"name": "Vikings DST",
					"pos": "DST",
					"nfl": "MIN",
					"ir": false
				}
			]
		},
		{
			"id": 2,
			"name": "Light Duties",
			"abbrev": "PC",
			"owner": "ppcoco",
			"w": 1,
			"l": 2,
			"t": 0,
			"pf": 598.4,
			"pa": 556.8,
			"waivers": 5,
			"you": false,
			"players": [
				{
					"name": "Jahmyr Gibbs",
					"pos": "RB",
					"nfl": "DET",
					"ir": false
				},
				{
					"name": "Bo Nix",
					"pos": "QB",
					"nfl": "DEN",
					"ir": false
				},
				{
					"name": "Justin Herbert",
					"pos": "QB",
					"nfl": "LAC",
					"ir": false
				},
				{
					"name": "Kyren Williams",
					"pos": "RB",
					"nfl": "LAR",
					"ir": false
				},
				{
					"name": "Davante Adams",
					"pos": "WR",
					"nfl": "LAR",
					"ir": false
				},
				{
					"name": "DJ Moore",
					"pos": "WR",
					"nfl": "BUF",
					"ir": false
				},
				{
					"name": "Courtland Sutton",
					"pos": "WR",
					"nfl": "DEN",
					"ir": false
				},
				{
					"name": "Sam Darnold",
					"pos": "QB",
					"nfl": "SEA",
					"ir": false
				},
				{
					"name": "Dallas Goedert",
					"pos": "TE",
					"nfl": "PHI",
					"ir": false
				},
				{
					"name": "Kenny Gainwell",
					"pos": "RB",
					"nfl": "TB",
					"ir": false
				},
				{
					"name": "Mark Andrews",
					"pos": "TE",
					"nfl": "BAL",
					"ir": false
				},
				{
					"name": "Xavier Worthy",
					"pos": "WR",
					"nfl": "KC",
					"ir": false
				},
				{
					"name": "Deebo Samuel Sr.",
					"pos": "WR",
					"nfl": "SF",
					"ir": false
				},
				{
					"name": "Tyjae Spears",
					"pos": "RB",
					"nfl": "TEN",
					"ir": false
				},
				{
					"name": "Lions DST",
					"pos": "DST",
					"nfl": "DET",
					"ir": false
				},
				{
					"name": "Adonai Mitchell",
					"pos": "WR",
					"nfl": "NYJ",
					"ir": false
				},
				{
					"name": "Dylan Sampson",
					"pos": "RB",
					"nfl": "CLE",
					"ir": false
				},
				{
					"name": "Cole Kmet",
					"pos": "TE",
					"nfl": "CHI",
					"ir": false
				}
			]
		},
		{
			"id": 4,
			"name": "breKOHLner",
			"abbrev": "JLK",
			"owner": "J. Kohlenbrener",
			"w": 1,
			"l": 1,
			"t": 0,
			"pf": 406.2,
			"pa": 499.9,
			"waivers": 6,
			"you": false,
			"players": [
				{
					"name": "Jaxon Smith-Njigba",
					"pos": "WR",
					"nfl": "SEA",
					"ir": false
				},
				{
					"name": "Jonathan Taylor",
					"pos": "RB",
					"nfl": "IND",
					"ir": false
				},
				{
					"name": "Saquon Barkley",
					"pos": "RB",
					"nfl": "PHI",
					"ir": false
				},
				{
					"name": "Brock Purdy",
					"pos": "QB",
					"nfl": "SF",
					"ir": false
				},
				{
					"name": "Colston Loveland",
					"pos": "TE",
					"nfl": "CHI",
					"ir": false
				},
				{
					"name": "Jaylen Waddle",
					"pos": "WR",
					"nfl": "DEN",
					"ir": false
				},
				{
					"name": "Bhayshul Tuten",
					"pos": "RB",
					"nfl": "JAC",
					"ir": false
				},
				{
					"name": "Parker Washington",
					"pos": "WR",
					"nfl": "JAC",
					"ir": false
				},
				{
					"name": "MarShawn Lloyd",
					"pos": "RB",
					"nfl": "GB",
					"ir": false
				},
				{
					"name": "De'Zhaun Stribling",
					"pos": "WR",
					"nfl": "SF",
					"ir": false
				},
				{
					"name": "Stefon Diggs",
					"pos": "WR",
					"nfl": "WAS",
					"ir": false
				},
				{
					"name": "Aaron Jones Sr.",
					"pos": "RB",
					"nfl": "MIN",
					"ir": false
				},
				{
					"name": "Fernando Mendoza",
					"pos": "QB",
					"nfl": "LV",
					"ir": false
				},
				{
					"name": "Josh Downs",
					"pos": "WR",
					"nfl": "IND",
					"ir": false
				},
				{
					"name": "Denzel Boston",
					"pos": "WR",
					"nfl": "CLE",
					"ir": false
				},
				{
					"name": "Jonah Coleman",
					"pos": "RB",
					"nfl": "DEN",
					"ir": false
				},
				{
					"name": "Bears DST",
					"pos": "DST",
					"nfl": "CHI",
					"ir": false
				},
				{
					"name": "Tank Dell",
					"pos": "WR",
					"nfl": "HOU",
					"ir": true
				},
				{
					"name": "Michael Penix Jr.",
					"pos": "QB",
					"nfl": "ATL",
					"ir": false
				}
			]
		},
		{
			"id": 5,
			"name": "Kittle Miss Sunshine",
			"abbrev": "JC",
			"owner": "jazzy0000",
			"w": 1,
			"l": 2,
			"t": 0,
			"pf": 556.8,
			"pa": 598.4,
			"waivers": 3,
			"you": false,
			"players": [
				{
					"name": "Ja'Marr Chase",
					"pos": "WR",
					"nfl": "CIN",
					"ir": false
				},
				{
					"name": "Nico Collins",
					"pos": "WR",
					"nfl": "HOU",
					"ir": true
				},
				{
					"name": "Patrick Mahomes",
					"pos": "QB",
					"nfl": "KC",
					"ir": false
				},
				{
					"name": "Garrett Wilson",
					"pos": "WR",
					"nfl": "NYJ",
					"ir": false
				},
				{
					"name": "Quinshon Judkins",
					"pos": "RB",
					"nfl": "CLE",
					"ir": false
				},
				{
					"name": "George Kittle",
					"pos": "TE",
					"nfl": "SF",
					"ir": false
				},
				{
					"name": "Tony Pollard",
					"pos": "RB",
					"nfl": "TEN",
					"ir": false
				},
				{
					"name": "Rams DST",
					"pos": "DST",
					"nfl": "LAR",
					"ir": false
				},
				{
					"name": "Chuba Hubbard",
					"pos": "RB",
					"nfl": "CAR",
					"ir": false
				},
				{
					"name": "Wan'Dale Robinson",
					"pos": "WR",
					"nfl": "TEN",
					"ir": false
				},
				{
					"name": "Kyle Monangai",
					"pos": "RB",
					"nfl": "CHI",
					"ir": false
				},
				{
					"name": "Rachaad White",
					"pos": "RB",
					"nfl": "WAS",
					"ir": false
				},
				{
					"name": "Keenan Allen",
					"pos": "WR",
					"nfl": "IND",
					"ir": false
				},
				{
					"name": "Kirk Cousins",
					"pos": "QB",
					"nfl": "LV",
					"ir": false
				},
				{
					"name": "Devaughn Vele",
					"pos": "WR",
					"nfl": "NO",
					"ir": false
				},
				{
					"name": "Marcus Mariota",
					"pos": "QB",
					"nfl": "WAS",
					"ir": false
				},
				{
					"name": "Malik Washington",
					"pos": "WR",
					"nfl": "MIA",
					"ir": false
				},
				{
					"name": "Emanuel Wilson",
					"pos": "RB",
					"nfl": "SEA",
					"ir": false
				},
				{
					"name": "Case Keenum",
					"pos": "QB",
					"nfl": "CHI",
					"ir": false
				}
			]
		},
		{
			"id": 7,
			"name": "KTischler",
			"abbrev": "KT",
			"owner": "KTischler",
			"w": 3,
			"l": 0,
			"t": 0,
			"pf": 540.3,
			"pa": 404.8,
			"waivers": 11,
			"you": false,
			"players": [
				{
					"name": "Christian McCaffrey",
					"pos": "RB",
					"nfl": "SF",
					"ir": false
				},
				{
					"name": "CeeDee Lamb",
					"pos": "WR",
					"nfl": "DAL",
					"ir": false
				},
				{
					"name": "Dak Prescott",
					"pos": "QB",
					"nfl": "DAL",
					"ir": false
				},
				{
					"name": "Matthew Stafford",
					"pos": "QB",
					"nfl": "LAR",
					"ir": false
				},
				{
					"name": "David Montgomery",
					"pos": "RB",
					"nfl": "HOU",
					"ir": false
				},
				{
					"name": "Ladd McConkey",
					"pos": "WR",
					"nfl": "LAC",
					"ir": false
				},
				{
					"name": "Jameson Williams",
					"pos": "WR",
					"nfl": "DET",
					"ir": false
				},
				{
					"name": "Kyle Pitts Sr.",
					"pos": "TE",
					"nfl": "ATL",
					"ir": false
				},
				{
					"name": "J.K. Dobbins",
					"pos": "RB",
					"nfl": "DEN",
					"ir": false
				},
				{
					"name": "Seahawks DST",
					"pos": "DST",
					"nfl": "SEA",
					"ir": false
				},
				{
					"name": "Khalil Shakir",
					"pos": "WR",
					"nfl": "BUF",
					"ir": false
				},
				{
					"name": "Josh Jacobs",
					"pos": "RB",
					"nfl": "GB",
					"ir": false
				},
				{
					"name": "Makai Lemon",
					"pos": "WR",
					"nfl": "PHI",
					"ir": false
				},
				{
					"name": "Aaron Rodgers",
					"pos": "QB",
					"nfl": "PIT",
					"ir": false
				},
				{
					"name": "Mike Washington Jr.",
					"pos": "RB",
					"nfl": "LV",
					"ir": false
				},
				{
					"name": "Kaelon Black",
					"pos": "RB",
					"nfl": "SF",
					"ir": false
				},
				{
					"name": "Ja'Kobi Lane",
					"pos": "WR",
					"nfl": "BAL",
					"ir": true
				},
				{
					"name": "Jaylen Wright",
					"pos": "RB",
					"nfl": "MIA",
					"ir": false
				},
				{
					"name": "Kenyon Sadiq",
					"pos": "TE",
					"nfl": "NYJ",
					"ir": false
				}
			]
		},
		{
			"id": 8,
			"name": "Current State",
			"abbrev": "SST",
			"owner": "espn45809475",
			"w": 3,
			"l": 0,
			"t": 0,
			"pf": 575.5,
			"pa": 473.8,
			"waivers": 10,
			"you": false,
			"players": [
				{
					"name": "Puka Nacua",
					"pos": "WR",
					"nfl": "LAR",
					"ir": false
				},
				{
					"name": "Derrick Henry",
					"pos": "RB",
					"nfl": "BAL",
					"ir": false
				},
				{
					"name": "Omarion Hampton",
					"pos": "RB",
					"nfl": "LAC",
					"ir": false
				},
				{
					"name": "Zay Flowers",
					"pos": "WR",
					"nfl": "BAL",
					"ir": false
				},
				{
					"name": "Cam Skattebo",
					"pos": "RB",
					"nfl": "NYG",
					"ir": false
				},
				{
					"name": "Jared Goff",
					"pos": "QB",
					"nfl": "DET",
					"ir": false
				},
				{
					"name": "Sam LaPorta",
					"pos": "TE",
					"nfl": "DET",
					"ir": false
				},
				{
					"name": "Rico Dowdle",
					"pos": "RB",
					"nfl": "PIT",
					"ir": false
				},
				{
					"name": "Jordan Addison",
					"pos": "WR",
					"nfl": "MIN",
					"ir": false
				},
				{
					"name": "KC Concepcion",
					"pos": "WR",
					"nfl": "CLE",
					"ir": false
				},
				{
					"name": "Woody Marks",
					"pos": "RB",
					"nfl": "HOU",
					"ir": false
				},
				{
					"name": "Travis Kelce",
					"pos": "TE",
					"nfl": "KC",
					"ir": false
				},
				{
					"name": "Deshaun Watson",
					"pos": "QB",
					"nfl": "CLE",
					"ir": false
				},
				{
					"name": "Chargers DST",
					"pos": "DST",
					"nfl": "LAC",
					"ir": false
				},
				{
					"name": "Dontayvion Wicks",
					"pos": "WR",
					"nfl": "PHI",
					"ir": false
				},
				{
					"name": "Demarcus Robinson",
					"pos": "WR",
					"nfl": "SF",
					"ir": false
				},
				{
					"name": "Tyreek Hill",
					"pos": "WR",
					"nfl": "FA",
					"ir": false
				},
				{
					"name": "Ollie Gordon II",
					"pos": "RB",
					"nfl": "MIA",
					"ir": false
				}
			]
		},
		{
			"id": 9,
			"name": "Do or Die Trying",
			"abbrev": "TTT",
			"owner": "TSHosmer",
			"w": 2,
			"l": 0,
			"t": 0,
			"pf": 479.2,
			"pa": 351.4,
			"waivers": 8,
			"you": false,
			"players": [
				{
					"name": "Bijan Robinson",
					"pos": "RB",
					"nfl": "ATL",
					"ir": false
				},
				{
					"name": "James Cook III",
					"pos": "RB",
					"nfl": "BUF",
					"ir": false
				},
				{
					"name": "Trey McBride",
					"pos": "TE",
					"nfl": "ARI",
					"ir": false
				},
				{
					"name": "Chris Olave",
					"pos": "WR",
					"nfl": "NO",
					"ir": false
				},
				{
					"name": "DeVonta Smith",
					"pos": "WR",
					"nfl": "PHI",
					"ir": false
				},
				{
					"name": "Tee Higgins",
					"pos": "WR",
					"nfl": "CIN",
					"ir": false
				},
				{
					"name": "Jaylen Warren",
					"pos": "RB",
					"nfl": "PIT",
					"ir": false
				},
				{
					"name": "Jordan Love",
					"pos": "QB",
					"nfl": "GB",
					"ir": false
				},
				{
					"name": "Texans DST",
					"pos": "DST",
					"nfl": "HOU",
					"ir": false
				},
				{
					"name": "C.J. Stroud",
					"pos": "QB",
					"nfl": "HOU",
					"ir": false
				},
				{
					"name": "Matthew Golden",
					"pos": "WR",
					"nfl": "GB",
					"ir": false
				},
				{
					"name": "RJ Harvey",
					"pos": "RB",
					"nfl": "DEN",
					"ir": false
				},
				{
					"name": "Bryce Young",
					"pos": "QB",
					"nfl": "CAR",
					"ir": false
				},
				{
					"name": "Chris Godwin Jr.",
					"pos": "WR",
					"nfl": "TB",
					"ir": false
				},
				{
					"name": "Tyler Allgeier",
					"pos": "RB",
					"nfl": "ARI",
					"ir": false
				},
				{
					"name": "Brenton Strange",
					"pos": "TE",
					"nfl": "JAC",
					"ir": false
				},
				{
					"name": "Keaton Mitchell",
					"pos": "RB",
					"nfl": "LAC",
					"ir": false
				},
				{
					"name": "Rashod Bateman",
					"pos": "WR",
					"nfl": "BAL",
					"ir": false
				}
			]
		},
		{
			"id": 10,
			"name": "Hub’sHardCount",
			"abbrev": "HUb",
			"owner": "ESPNFAN8970635387",
			"w": 0,
			"l": 2,
			"t": 0,
			"pf": 309.4,
			"pa": 434.4,
			"waivers": 1,
			"you": false,
			"players": [
				{
					"name": "Joe Burrow",
					"pos": "QB",
					"nfl": "CIN",
					"ir": false
				},
				{
					"name": "Trevor Lawrence",
					"pos": "QB",
					"nfl": "JAC",
					"ir": false
				},
				{
					"name": "Rashee Rice",
					"pos": "WR",
					"nfl": "KC",
					"ir": false
				},
				{
					"name": "Chase Brown",
					"pos": "RB",
					"nfl": "CIN",
					"ir": false
				},
				{
					"name": "George Pickens",
					"pos": "WR",
					"nfl": "DAL",
					"ir": false
				},
				{
					"name": "Steelers DST",
					"pos": "DST",
					"nfl": "PIT",
					"ir": false
				},
				{
					"name": "Jadarian Price",
					"pos": "RB",
					"nfl": "SEA",
					"ir": false
				},
				{
					"name": "DK Metcalf",
					"pos": "WR",
					"nfl": "PIT",
					"ir": false
				},
				{
					"name": "Daniel Jones",
					"pos": "QB",
					"nfl": "IND",
					"ir": false
				},
				{
					"name": "Jake Ferguson",
					"pos": "TE",
					"nfl": "DAL",
					"ir": false
				},
				{
					"name": "Brian Thomas Jr.",
					"pos": "WR",
					"nfl": "JAC",
					"ir": false
				},
				{
					"name": "Blake Corum",
					"pos": "RB",
					"nfl": "LAR",
					"ir": false
				},
				{
					"name": "T.J. Hockenson",
					"pos": "TE",
					"nfl": "MIN",
					"ir": false
				},
				{
					"name": "Rashid Shaheed",
					"pos": "WR",
					"nfl": "SEA",
					"ir": false
				},
				{
					"name": "Juwan Johnson",
					"pos": "TE",
					"nfl": "NO",
					"ir": false
				},
				{
					"name": "Tre Tucker",
					"pos": "WR",
					"nfl": "LV",
					"ir": false
				},
				{
					"name": "Tua Tagovailoa",
					"pos": "QB",
					"nfl": "ATL",
					"ir": false
				},
				{
					"name": "Tank Bigsby",
					"pos": "RB",
					"nfl": "PHI",
					"ir": false
				}
			]
		},
		{
			"id": 11,
			"name": "Daniel's Driven Team",
			"abbrev": "DDT",
			"owner": "ESPNFAN0808212593",
			"w": 1,
			"l": 2,
			"t": 0,
			"pf": 577.6,
			"pa": 550.3,
			"waivers": 4,
			"you": false,
			"players": [
				{
					"name": "Josh Allen",
					"pos": "QB",
					"nfl": "BUF",
					"ir": false
				},
				{
					"name": "Justin Jefferson",
					"pos": "WR",
					"nfl": "MIN",
					"ir": false
				},
				{
					"name": "Drake London",
					"pos": "WR",
					"nfl": "ATL",
					"ir": false
				},
				{
					"name": "Caleb Williams",
					"pos": "QB",
					"nfl": "CHI",
					"ir": false
				},
				{
					"name": "Breece Hall",
					"pos": "RB",
					"nfl": "NYJ",
					"ir": false
				},
				{
					"name": "Bucky Irving",
					"pos": "RB",
					"nfl": "TB",
					"ir": false
				},
				{
					"name": "D'Andre Swift",
					"pos": "RB",
					"nfl": "CHI",
					"ir": false
				},
				{
					"name": "Michael Pittman Jr.",
					"pos": "WR",
					"nfl": "PIT",
					"ir": false
				},
				{
					"name": "Tyler Shough",
					"pos": "QB",
					"nfl": "NO",
					"ir": false
				},
				{
					"name": "Tucker Kraft",
					"pos": "TE",
					"nfl": "GB",
					"ir": false
				},
				{
					"name": "Christian Watson",
					"pos": "WR",
					"nfl": "GB",
					"ir": false
				},
				{
					"name": "Jayden Reed",
					"pos": "WR",
					"nfl": "GB",
					"ir": false
				},
				{
					"name": "Isaiah Likely",
					"pos": "TE",
					"nfl": "NYG",
					"ir": false
				},
				{
					"name": "Jalen Coker",
					"pos": "WR",
					"nfl": "CAR",
					"ir": false
				},
				{
					"name": "Jalen McMillan",
					"pos": "WR",
					"nfl": "TB",
					"ir": false
				},
				{
					"name": "Eagles DST",
					"pos": "DST",
					"nfl": "PHI",
					"ir": false
				},
				{
					"name": "Caleb Douglas",
					"pos": "WR",
					"nfl": "MIA",
					"ir": false
				},
				{
					"name": "Najee Harris",
					"pos": "RB",
					"nfl": "NYG",
					"ir": false
				}
			]
		},
		{
			"id": 12,
			"name": "B-rad's Brilliant Team",
			"abbrev": "BBT",
			"owner": "hockeyboy142",
			"w": 1,
			"l": 2,
			"t": 0,
			"pf": 540.3,
			"pa": 583.9,
			"waivers": 2,
			"you": false,
			"players": [
				{
					"name": "Lamar Jackson",
					"pos": "QB",
					"nfl": "BAL",
					"ir": false
				},
				{
					"name": "Jalen Hurts",
					"pos": "QB",
					"nfl": "PHI",
					"ir": false
				},
				{
					"name": "Kenneth Walker III",
					"pos": "RB",
					"nfl": "KC",
					"ir": false
				},
				{
					"name": "Brock Bowers",
					"pos": "TE",
					"nfl": "LV",
					"ir": false
				},
				{
					"name": "Travis Etienne Jr.",
					"pos": "RB",
					"nfl": "NO",
					"ir": false
				},
				{
					"name": "Emeka Egbuka",
					"pos": "WR",
					"nfl": "TB",
					"ir": false
				},
				{
					"name": "Rome Odunze",
					"pos": "WR",
					"nfl": "CHI",
					"ir": false
				},
				{
					"name": "Luther Burden III",
					"pos": "WR",
					"nfl": "CHI",
					"ir": false
				},
				{
					"name": "Jonathon Brooks",
					"pos": "RB",
					"nfl": "CAR",
					"ir": false
				},
				{
					"name": "Baker Mayfield",
					"pos": "QB",
					"nfl": "TB",
					"ir": false
				},
				{
					"name": "Michael Wilson",
					"pos": "WR",
					"nfl": "ARI",
					"ir": false
				},
				{
					"name": "Jakobi Meyers",
					"pos": "WR",
					"nfl": "JAC",
					"ir": false
				},
				{
					"name": "Quentin Johnston",
					"pos": "WR",
					"nfl": "LAC",
					"ir": false
				},
				{
					"name": "Dalton Kincaid",
					"pos": "TE",
					"nfl": "BUF",
					"ir": false
				},
				{
					"name": "Ravens DST",
					"pos": "DST",
					"nfl": "BAL",
					"ir": false
				},
				{
					"name": "Travis Hunter",
					"pos": "WR",
					"nfl": "JAC",
					"ir": false
				},
				{
					"name": "Chiefs DST",
					"pos": "DST",
					"nfl": "KC",
					"ir": false
				},
				{
					"name": "Braelon Allen",
					"pos": "RB",
					"nfl": "NYJ",
					"ir": false
				}
			]
		},
		{
			"id": 13,
			"name": "Charlie's Competitive Team",
			"abbrev": "CCT",
			"owner": "charliebasketballpro",
			"w": 2,
			"l": 1,
			"t": 0,
			"pf": 510,
			"pa": 448.1,
			"waivers": 7,
			"you": false,
			"players": [
				{
					"name": "Jayden Daniels",
					"pos": "QB",
					"nfl": "WAS",
					"ir": false
				},
				{
					"name": "Amon-Ra St. Brown",
					"pos": "WR",
					"nfl": "DET",
					"ir": false
				},
				{
					"name": "Jeremiyah Love",
					"pos": "RB",
					"nfl": "ARI",
					"ir": false
				},
				{
					"name": "A.J. Brown",
					"pos": "WR",
					"nfl": "NE",
					"ir": false
				},
				{
					"name": "Javonte Williams",
					"pos": "RB",
					"nfl": "DAL",
					"ir": false
				},
				{
					"name": "Terry McLaurin",
					"pos": "WR",
					"nfl": "WAS",
					"ir": false
				},
				{
					"name": "Kyler Murray",
					"pos": "QB",
					"nfl": "MIN",
					"ir": false
				},
				{
					"name": "Harold Fannin Jr.",
					"pos": "TE",
					"nfl": "CLE",
					"ir": false
				},
				{
					"name": "Marvin Harrison Jr.",
					"pos": "WR",
					"nfl": "ARI",
					"ir": false
				},
				{
					"name": "TreVeyon Henderson",
					"pos": "RB",
					"nfl": "NE",
					"ir": false
				},
				{
					"name": "Mike Evans",
					"pos": "WR",
					"nfl": "SF",
					"ir": false
				},
				{
					"name": "Malik Willis",
					"pos": "QB",
					"nfl": "MIA",
					"ir": false
				},
				{
					"name": "Jacoby Brissett",
					"pos": "QB",
					"nfl": "ARI",
					"ir": false
				},
				{
					"name": "Hunter Henry",
					"pos": "TE",
					"nfl": "NE",
					"ir": false
				},
				{
					"name": "Broncos DST",
					"pos": "DST",
					"nfl": "DEN",
					"ir": false
				},
				{
					"name": "Brian Robinson Jr.",
					"pos": "RB",
					"nfl": "ATL",
					"ir": false
				},
				{
					"name": "Browns DST",
					"pos": "DST",
					"nfl": "CLE",
					"ir": false
				},
				{
					"name": "Ray Davis",
					"pos": "RB",
					"nfl": "BUF",
					"ir": false
				}
			]
		}
	],
	"matchups": [
		{
			"week": 1,
			"homeId": 11,
			"awayId": 4
		},
		{
			"week": 1,
			"homeId": 1,
			"awayId": 9
		},
		{
			"week": 1,
			"homeId": 12,
			"awayId": 5
		},
		{
			"week": 1,
			"homeId": 2,
			"awayId": 8
		},
		{
			"week": 1,
			"homeId": 13,
			"awayId": 7
		},
		{
			"week": 2,
			"homeId": 9,
			"awayId": 10
		},
		{
			"week": 2,
			"homeId": 5,
			"awayId": 11
		},
		{
			"week": 2,
			"homeId": 8,
			"awayId": 1
		},
		{
			"week": 2,
			"homeId": 7,
			"awayId": 12
		},
		{
			"week": 2,
			"homeId": 13,
			"awayId": 2
		},
		{
			"week": 3,
			"homeId": 4,
			"awayId": 5
		},
		{
			"week": 3,
			"homeId": 10,
			"awayId": 8
		},
		{
			"week": 3,
			"homeId": 11,
			"awayId": 7
		},
		{
			"week": 3,
			"homeId": 1,
			"awayId": 13
		},
		{
			"week": 3,
			"homeId": 12,
			"awayId": 2
		},
		{
			"week": 4,
			"homeId": 8,
			"awayId": 9
		},
		{
			"week": 4,
			"homeId": 7,
			"awayId": 4
		},
		{
			"week": 4,
			"homeId": 13,
			"awayId": 10
		},
		{
			"week": 4,
			"homeId": 2,
			"awayId": 11
		},
		{
			"week": 4,
			"homeId": 12,
			"awayId": 1
		},
		{
			"week": 5,
			"homeId": 5,
			"awayId": 7
		},
		{
			"week": 5,
			"homeId": 9,
			"awayId": 13
		},
		{
			"week": 5,
			"homeId": 4,
			"awayId": 2
		},
		{
			"week": 5,
			"homeId": 10,
			"awayId": 12
		},
		{
			"week": 5,
			"homeId": 11,
			"awayId": 1
		},
		{
			"week": 6,
			"homeId": 13,
			"awayId": 8
		},
		{
			"week": 6,
			"homeId": 2,
			"awayId": 5
		},
		{
			"week": 6,
			"homeId": 12,
			"awayId": 9
		},
		{
			"week": 6,
			"homeId": 1,
			"awayId": 4
		},
		{
			"week": 6,
			"homeId": 11,
			"awayId": 10
		},
		{
			"week": 7,
			"homeId": 7,
			"awayId": 2
		},
		{
			"week": 7,
			"homeId": 8,
			"awayId": 12
		},
		{
			"week": 7,
			"homeId": 5,
			"awayId": 1
		},
		{
			"week": 7,
			"homeId": 9,
			"awayId": 11
		},
		{
			"week": 7,
			"homeId": 4,
			"awayId": 10
		},
		{
			"week": 8,
			"homeId": 12,
			"awayId": 13
		},
		{
			"week": 8,
			"homeId": 1,
			"awayId": 7
		},
		{
			"week": 8,
			"homeId": 11,
			"awayId": 8
		},
		{
			"week": 8,
			"homeId": 10,
			"awayId": 5
		},
		{
			"week": 8,
			"homeId": 4,
			"awayId": 9
		},
		{
			"week": 9,
			"homeId": 2,
			"awayId": 1
		},
		{
			"week": 9,
			"homeId": 13,
			"awayId": 11
		},
		{
			"week": 9,
			"homeId": 7,
			"awayId": 10
		},
		{
			"week": 9,
			"homeId": 8,
			"awayId": 4
		},
		{
			"week": 9,
			"homeId": 5,
			"awayId": 9
		},
		{
			"week": 10,
			"homeId": 11,
			"awayId": 12
		},
		{
			"week": 10,
			"homeId": 10,
			"awayId": 2
		},
		{
			"week": 10,
			"homeId": 4,
			"awayId": 13
		},
		{
			"week": 10,
			"homeId": 9,
			"awayId": 7
		},
		{
			"week": 10,
			"homeId": 5,
			"awayId": 8
		},
		{
			"week": 11,
			"homeId": 1,
			"awayId": 10
		},
		{
			"week": 11,
			"homeId": 12,
			"awayId": 4
		},
		{
			"week": 11,
			"homeId": 2,
			"awayId": 9
		},
		{
			"week": 11,
			"homeId": 13,
			"awayId": 5
		},
		{
			"week": 11,
			"homeId": 7,
			"awayId": 8
		},
		{
			"week": 12,
			"homeId": 4,
			"awayId": 11
		},
		{
			"week": 12,
			"homeId": 9,
			"awayId": 1
		},
		{
			"week": 12,
			"homeId": 5,
			"awayId": 12
		},
		{
			"week": 12,
			"homeId": 8,
			"awayId": 2
		},
		{
			"week": 12,
			"homeId": 7,
			"awayId": 13
		},
		{
			"week": 13,
			"homeId": 10,
			"awayId": 9
		},
		{
			"week": 13,
			"homeId": 11,
			"awayId": 5
		},
		{
			"week": 13,
			"homeId": 1,
			"awayId": 8
		},
		{
			"week": 13,
			"homeId": 12,
			"awayId": 7
		},
		{
			"week": 13,
			"homeId": 2,
			"awayId": 13
		},
		{
			"week": 14,
			"homeId": 5,
			"awayId": 4
		},
		{
			"week": 14,
			"homeId": 8,
			"awayId": 10
		},
		{
			"week": 14,
			"homeId": 7,
			"awayId": 11
		},
		{
			"week": 14,
			"homeId": 13,
			"awayId": 1
		},
		{
			"week": 14,
			"homeId": 2,
			"awayId": 12
		}
	]
}];
function cleanName(name) {
	return name.replace(/`/g, "'").trim();
}
function stub(p) {
	const meta = NFL_TEAMS[p.nfl];
	return {
		id: slugify(p.name),
		name: p.name,
		pos: p.pos,
		team: p.nfl || "FA",
		bye: meta?.bye ?? 10,
		adp12: 160,
		rosPpr: 70,
		weekPpr: 6,
		rec: p.pos === "WR" || p.pos === "TE" ? 40 : 8,
		usage: 55,
		consistency: 50,
		upside: 50,
		health: 80,
		sos: 50,
		trend: 50,
		matchup: 50,
		age: 26,
		opp: meta?.opp ?? "—",
		home: meta?.home ?? true
	};
}
function resolve(p, extra) {
	const n = normalizeName(p.name);
	const found = PLAYERS.find((x) => normalizeName(x.name) === n && x.pos === p.pos) ?? PLAYERS.find((x) => normalizeName(x.name) === n);
	if (found) return found.id;
	const id = slugify(p.name);
	if (!extra.some((e) => e.id === id)) extra.push(stub(p));
	return id;
}
function buildSnapshotLeague(snap) {
	const extra = [];
	const teams = snap.teams.map((t) => {
		const name = cleanName(t.name);
		const roster = [];
		const ir = [];
		const localNames = /* @__PURE__ */ new Map();
		for (const p of t.players) {
			const id = resolve(p, extra);
			localNames.set(normalizeName(p.name), id);
			if (p.ir) ir.push(id);
			else roster.push(id);
		}
		const slots = (ESPN_TAPE[snap.espnLeagueId]?.slots ?? []).filter((s) => s.teamId === t.id).map((s) => ({
			id: localNames.get(normalizeName(s.name)) ?? slugify(s.name),
			slot: s.slot
		}));
		const draft = DRAFT_ORDER.find((d) => normalizeName(cleanName(d.name)) === normalizeName(name));
		return {
			id: t.id,
			name,
			abbrev: t.abbrev,
			owner: t.owner,
			isYou: t.you,
			draftSlot: draft?.pick ?? t.id,
			record: {
				w: t.w,
				l: t.l,
				t: t.t
			},
			pf: t.pf,
			pa: t.pa,
			roster,
			ir,
			draft: {},
			keepers: [],
			keeperCost: {},
			projectedKeepers: [],
			waivers: t.waivers,
			slots
		};
	});
	const tape = ESPN_TAPE[snap.espnLeagueId];
	return {
		myTeamId: snap.myTeamId,
		extra,
		league: {
			id: `espn-${snap.espnLeagueId}`,
			name: snap.name,
			season: snap.season,
			week: snap.week,
			teams: snap.keepersLocked ? applyLockedKeepers(teams) : teams,
			matchups: snap.matchups,
			source: "espn",
			espnLeagueId: snap.espnLeagueId,
			lastUpdated: Date.now(),
			stale: false,
			keepersLocked: snap.keepersLocked,
			draftPicks: tape?.picks ?? [],
			activity: tape?.activity ?? [],
			freeAgents: tape?.freeAgents ?? []
		}
	};
}
function syncedLeagues() {
	return ESPN_SNAPSHOT.map(buildSnapshotLeague);
}
var initialLibrary = syncedLeagues().map(slotFromLive);
var bush = initialLibrary[0];
var defaultEspn = {
	leagueId: bush.league.espnLeagueId || "1014874",
	season: bush.league.season || 2026,
	swid: "",
	espnS2: "",
	teamId: bush.myTeamId
};
function slotFromLive(built) {
	const you = built.league.teams.find((t) => t.id === built.myTeamId);
	return {
		id: built.league.espnLeagueId,
		league: built.league,
		myTeamId: built.myTeamId,
		extraPlayers: built.extra,
		selectedKeepers: built.league.keepersLocked ? [...you?.keepers ?? []] : [],
		keeperLocked: built.league.keepersLocked,
		takenManual: [],
		hideTaken: true,
		pins: [],
		tradePartnerId: null,
		giveIds: [],
		getIds: [],
		pasteText: ""
	};
}
function freshBushSlot() {
	return slotFromLive(syncedLeagues()[0]);
}
function toSlot(s) {
	return {
		id: s.league.espnLeagueId || s.league.id,
		league: s.league,
		myTeamId: s.myTeamId,
		extraPlayers: s.extraPlayers,
		selectedKeepers: s.selectedKeepers,
		keeperLocked: s.keeperLocked,
		takenManual: s.takenManual,
		hideTaken: s.hideTaken,
		pins: s.pins,
		tradePartnerId: s.tradePartnerId,
		giveIds: s.giveIds,
		getIds: s.getIds,
		pasteText: s.pasteText
	};
}
function applySlot(slot) {
	return {
		activeId: slot.id,
		league: slot.league,
		myTeamId: slot.myTeamId,
		extraPlayers: slot.extraPlayers,
		selectedKeepers: slot.selectedKeepers,
		keeperLocked: slot.keeperLocked,
		takenManual: slot.takenManual,
		hideTaken: slot.hideTaken,
		pins: slot.pins,
		tradePartnerId: slot.tradePartnerId,
		giveIds: slot.giveIds,
		getIds: slot.getIds,
		pasteText: slot.pasteText
	};
}
function upsertLibrary(library, slot) {
	const list = library ?? [];
	const i = list.findIndex((x) => x.id === slot.id);
	if (i === -1) return [...list, slot];
	const next = list.slice();
	next[i] = slot;
	return next;
}
var useBush = create()(persist((set, get) => {
	const write = (patch) => {
		const cur = {
			...get(),
			...patch
		};
		const slot = toSlot(cur);
		set({
			...patch,
			library: upsertLibrary(cur.library, slot),
			activeId: slot.id
		});
	};
	return {
		hydrated: false,
		espn: { ...defaultEspn },
		library: initialLibrary,
		activeId: bush.id,
		league: bush.league,
		myTeamId: bush.myTeamId,
		extraPlayers: bush.extraPlayers,
		selectedKeepers: bush.selectedKeepers,
		keeperLocked: bush.keeperLocked,
		takenManual: bush.takenManual,
		hideTaken: bush.hideTaken,
		pins: bush.pins,
		notes: {},
		lineupMode: "auto",
		view: "ALL",
		giveIds: bush.giveIds,
		getIds: bush.getIds,
		tradePartnerId: bush.tradePartnerId,
		pasteText: bush.pasteText,
		setHydrated: (v) => set({ hydrated: v }),
		setEspn: (e) => set({ espn: {
			...get().espn,
			...e
		} }),
		setLeague: (league, myTeamId, extra) => {
			const cur = get();
			const id = league.espnLeagueId || league.id;
			const existing = cur.library.find((s) => s.id === id);
			const you = league.teams.find((t) => t.isYou);
			const nextId = myTeamId && league.teams.some((t) => t.id === myTeamId) ? myTeamId : you?.id ?? existing?.myTeamId ?? 0;
			const same = cur.activeId === id;
			const base = {
				id,
				league,
				myTeamId: nextId,
				extraPlayers: extra ?? (same ? cur.extraPlayers : existing?.extraPlayers ?? []),
				selectedKeepers: league.keepersLocked ? you?.keepers ?? [] : same ? cur.selectedKeepers : [],
				keeperLocked: league.keepersLocked,
				takenManual: same ? cur.takenManual : existing?.takenManual ?? [],
				hideTaken: same ? cur.hideTaken : existing?.hideTaken ?? true,
				pins: same ? cur.pins : existing?.pins ?? [],
				tradePartnerId: same ? cur.tradePartnerId : null,
				giveIds: same ? cur.giveIds : [],
				getIds: same ? cur.getIds : [],
				pasteText: same ? cur.pasteText : existing?.pasteText ?? ""
			};
			set({
				library: upsertLibrary(upsertLibrary(cur.library, toSlot(cur)), base),
				...applySlot(base),
				espn: {
					...cur.espn,
					leagueId: league.espnLeagueId,
					teamId: base.myTeamId || null
				}
			});
		},
		switchLeague: (id) => {
			const cur = get();
			if (!id || id === cur.activeId) return;
			const library = upsertLibrary(cur.library, toSlot(cur));
			const next = library.find((s) => s.id === id);
			if (!next) return;
			set({
				library,
				...applySlot(next),
				espn: {
					...cur.espn,
					leagueId: next.league.espnLeagueId,
					teamId: next.myTeamId || null
				}
			});
		},
		removeLeague: (id) => {
			const cur = get();
			const current = cur.library ?? [];
			if (current.length <= 1) return;
			const library = current.filter((s) => s.id !== id);
			if (cur.activeId !== id) {
				set({ library });
				return;
			}
			const next = library[0];
			set({
				library,
				...applySlot(next),
				espn: {
					...cur.espn,
					leagueId: next.league.espnLeagueId,
					teamId: next.myTeamId || null
				}
			});
		},
		claimTeam: (teamId) => {
			const cur = get();
			const league = {
				...cur.league,
				teams: cur.league.teams.map((t) => ({
					...t,
					isYou: t.id === teamId
				}))
			};
			write({
				league,
				myTeamId: teamId,
				espn: {
					...cur.espn,
					teamId
				}
			});
		},
		resetSeed: () => {
			const cur = get();
			const slot = freshBushSlot();
			set({
				library: upsertLibrary(cur.library, slot),
				...applySlot(slot),
				espn: {
					...cur.espn,
					leagueId: slot.id,
					teamId: slot.myTeamId
				}
			});
		},
		toggleKeeper: (id) => {
			if (get().keeperLocked) return;
			const cur = get().selectedKeepers;
			const selectedKeepers = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id].slice(-2);
			write({ selectedKeepers });
		},
		setKeepers: (ids) => {
			if (get().keeperLocked) return;
			write({ selectedKeepers: ids.slice(0, 2) });
		},
		setKeeperLocked: (v) => write({ keeperLocked: v }),
		toggleTaken: (id) => {
			const cur = get().takenManual;
			const takenManual = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id];
			write({ takenManual });
		},
		setHideTaken: (v) => write({ hideTaken: v }),
		togglePin: (id) => {
			const cur = get().pins;
			const pins = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id];
			write({ pins });
		},
		setNote: (id, note) => set({ notes: {
			...get().notes,
			[id]: note
		} }),
		setLineupMode: (m) => set({ lineupMode: m }),
		setView: (v) => set({ view: v }),
		setTrade: (partnerId, give, getIds) => write({
			tradePartnerId: partnerId,
			giveIds: give,
			getIds
		}),
		setPasteText: (t) => write({ pasteText: t })
	};
}, {
	name: "bush-os-v2",
	version: 5,
	skipHydration: true,
	migrate: (persisted, fromVersion) => {
		if (!persisted || typeof persisted !== "object") return persisted;
		const s = persisted;
		if ((fromVersion ?? 0) < 5) {
			const library = syncedLeagues().map(slotFromLive);
			const active = library[0];
			return {
				...s,
				library,
				...applySlot(active),
				espn: {
					leagueId: active.league.espnLeagueId,
					season: active.league.season,
					swid: "",
					espnS2: "",
					teamId: active.myTeamId
				},
				notes: s.notes ?? {}
			};
		}
		if (s.library?.length && s.activeId) return s;
		const slot = freshBushSlot();
		return {
			...s,
			library: [slot],
			...applySlot(slot)
		};
	},
	partialize: (s) => ({
		espn: {
			leagueId: s.espn.leagueId,
			season: s.espn.season,
			swid: "",
			espnS2: "",
			teamId: s.espn.teamId
		},
		library: s.library,
		activeId: s.activeId,
		myTeamId: s.myTeamId,
		league: s.league,
		extraPlayers: s.extraPlayers,
		selectedKeepers: s.selectedKeepers,
		keeperLocked: s.keeperLocked,
		takenManual: s.takenManual,
		hideTaken: s.hideTaken,
		pins: s.pins,
		notes: s.notes,
		lineupMode: s.lineupMode,
		view: s.view,
		pasteText: s.pasteText,
		giveIds: s.giveIds,
		getIds: s.getIds,
		tradePartnerId: s.tradePartnerId
	})
}));
var PRIMARY = [
	{
		to: "/",
		label: "Command",
		icon: LayoutDashboard
	},
	{
		to: "/lineup",
		label: "Lineup",
		icon: Swords
	},
	{
		to: "/waivers",
		label: "Waivers",
		icon: UserRoundPlus
	},
	{
		to: "/trades",
		label: "Trades",
		icon: ArrowLeftRight
	}
];
var MORE = [
	{
		to: "/keepers",
		label: "Keepers",
		icon: Bookmark
	},
	{
		to: "/draft",
		label: "Draft",
		icon: ListOrdered
	},
	{
		to: "/rules",
		label: "Rules",
		icon: ScrollText
	},
	{
		to: "/grade",
		label: "Brain",
		icon: ScrollText
	},
	{
		to: "/setup",
		label: "Setup",
		icon: Cable
	}
];
function NavLink({ to, label, icon: Icon, collapsed }) {
	const active = useRouterState({ select: (s) => s.location.pathname }) === to;
	const inner = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to,
		className: cn("flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors duration-150", collapsed && "justify-center px-0", active ? "bg-bg-subtle text-fg" : "text-muted hover:bg-bg-subtle hover:text-fg"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4 shrink-0" }), !collapsed && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: label })]
	});
	if (!collapsed) return inner;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tooltip, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipTrigger, {
		asChild: true,
		children: inner
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipContent, {
		side: "right",
		children: label
	})] });
}
function LeagueSwitch({ className }) {
	const library = useBush((s) => s.library);
	const activeId = useBush((s) => s.activeId);
	const switchLeague = useBush((s) => s.switchLeague);
	const league = useBush((s) => s.league);
	if (!library.length) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: cn("block", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "mb-1 block px-1 text-[10px] tracking-[0.16em] text-subtle uppercase",
			children: "League"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
			"aria-label": "Active league",
			className: "h-11 w-full rounded-md border border-border bg-bg px-2 text-sm text-fg",
			value: library.some((s) => s.id === activeId) ? activeId : league.espnLeagueId,
			onChange: (e) => switchLeague(e.target.value),
			children: library.map((slot) => {
				const you = slot.league.teams.find((t) => t.id === slot.myTeamId);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
					value: slot.id,
					children: [
						you?.name ?? "Club",
						" · ",
						slot.league.name
					]
				}, slot.id);
			})
		})]
	});
}
function AppShell({ children }) {
	(0, import_react.useEffect)(() => {
		useBush.persist.rehydrate();
		useBush.getState().setHydrated(true);
	}, []);
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const [moreOpen, setMoreOpen] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipProvider, {
		delayDuration: 200,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex min-h-dvh bg-bg text-fg",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: "sticky top-0 hidden h-dvh w-56 shrink-0 flex-col border-r border-border px-3 py-5 md:flex",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/",
							className: "px-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-display text-2xl font-semibold tracking-wide",
								children: "BUSH LEAGUE"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs tracking-[0.22em] text-accent uppercase",
								children: "OS"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LeagueSwitch, { className: "mt-3 mb-6 px-0" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
							className: "flex flex-1 flex-col gap-1",
							children: [
								PRIMARY.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavLink, { ...item }, item.to)),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "my-3 h-px bg-border" }),
								MORE.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavLink, { ...item }, item.to))
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "px-3 text-xs leading-relaxed text-subtle",
							children: "Lineup · wire · trades. Same scoring."
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex min-w-0 flex-1 flex-col",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
						className: "sticky top-0 z-30 border-b border-border bg-bg/90 px-4 py-3 backdrop-blur-sm md:hidden",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/",
								className: "font-display text-xl font-semibold tracking-wide",
								children: "BUSH LEAGUE OS"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs tracking-widest text-muted uppercase",
								children: pathname === "/" ? "Command" : pathname.slice(1)
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LeagueSwitch, { className: "mt-2" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
						className: "mx-auto w-full max-w-6xl flex-1 px-4 py-6 pb-24 md:px-8 md:pb-10",
						children
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
					className: "fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-border bg-bg/95 px-1 py-1 backdrop-blur-sm md:hidden",
					children: [PRIMARY.map((item) => {
						const active = pathname === item.to;
						const Icon = item.icon;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: item.to,
							className: cn("flex min-h-12 flex-col items-center justify-center gap-0.5 text-[10px] tracking-wide", active ? "text-fg" : "text-muted"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4" }), item.label]
						}, item.to);
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Sheet, {
						open: moreOpen,
						onOpenChange: setMoreOpen,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetTrigger, {
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								className: cn("flex min-h-12 flex-col items-center justify-center gap-0.5 text-[10px] tracking-wide", MORE.some((m) => m.to === pathname) ? "text-fg" : "text-muted"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ellipsis, { className: "size-4" }), "More"]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetContent, {
							side: "bottom",
							title: "Desk",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-4 grid gap-1 pb-6",
								children: MORE.map((item) => {
									const Icon = item.icon;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: item.to,
										onClick: () => setMoreOpen(false),
										className: "flex min-h-12 items-center gap-3 rounded-md px-3 text-sm hover:bg-bg-subtle",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4 text-muted" }), item.label]
									}, item.to);
								})
							})
						})]
					})]
				})
			]
		})
	});
}
var styles_default = "/assets/styles-DVuLU0zz.css";
var APP_NAME = "Bush League OS";
var queryClient = new QueryClient();
var Route$9 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: APP_NAME },
			{
				name: "theme-color",
				content: "#0F2744"
			},
			{
				name: "description",
				content: "Championship OS for The Bush League — keepers, draft, lineup, waivers, and trades in exact league scoring."
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			}
		]
	}),
	component: () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		className: "antialiased",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(QueryClientProvider, {
				client: queryClient,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
					theme: "dark",
					position: "bottom-right"
				})]
			}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
		] })]
	})
});
var $$splitComponentImporter$8 = () => import("./routes-DNaa9LMO.mjs");
var Route$8 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter$8, "component") });
var $$splitComponentImporter$7 = () => import("./draft-MVEIZutY.mjs");
var Route$7 = createFileRoute("/draft")({ component: lazyRouteComponent($$splitComponentImporter$7, "component") });
var $$splitComponentImporter$6 = () => import("./grade-42s6NW0X.mjs");
var Route$6 = createFileRoute("/grade")({ component: lazyRouteComponent($$splitComponentImporter$6, "component") });
var $$splitComponentImporter$5 = () => import("./keepers-BBtH2CXZ.mjs");
var Route$5 = createFileRoute("/keepers")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
var $$splitComponentImporter$4 = () => import("./lineup-IUKt7wK7.mjs");
var Route$4 = createFileRoute("/lineup")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("./rules-d19s3jcP.mjs");
var Route$3 = createFileRoute("/rules")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./setup-FJ1QPh3b.mjs");
var Route$2 = createFileRoute("/setup")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./trades-BpJERCJj.mjs");
var Route$1 = createFileRoute("/trades")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./waivers-BTCijNYz.mjs");
var Route = createFileRoute("/waivers")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var rootRouteChildren = {
	IndexRoute: Route$8.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$9
	}),
	DraftRoute: Route$7.update({
		id: "/draft",
		path: "/draft",
		getParentRoute: () => Route$9
	}),
	GradeRoute: Route$6.update({
		id: "/grade",
		path: "/grade",
		getParentRoute: () => Route$9
	}),
	KeepersRoute: Route$5.update({
		id: "/keepers",
		path: "/keepers",
		getParentRoute: () => Route$9
	}),
	LineupRoute: Route$4.update({
		id: "/lineup",
		path: "/lineup",
		getParentRoute: () => Route$9
	}),
	RulesRoute: Route$3.update({
		id: "/rules",
		path: "/rules",
		getParentRoute: () => Route$9
	}),
	SetupRoute: Route$2.update({
		id: "/setup",
		path: "/setup",
		getParentRoute: () => Route$9
	}),
	TradesRoute: Route$1.update({
		id: "/trades",
		path: "/trades",
		getParentRoute: () => Route$9
	}),
	WaiversRoute: Route.update({
		id: "/waivers",
		path: "/waivers",
		getParentRoute: () => Route$9
	})
};
var routeTree = Route$9._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { SheetContent as i, useBush as n, Sheet as r, router_exports as t };

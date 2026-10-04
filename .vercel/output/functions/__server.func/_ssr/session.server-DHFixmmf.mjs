import { readFileSync } from "node:fs";
//#region node_modules/.nitro/vite/services/ssr/assets/session.server-DHFixmmf.js
function readEspnSession() {
	try {
		const raw = JSON.parse(readFileSync("/workspace/.espn/session.json", "utf8"));
		if (!raw.swid || !raw.espnS2) return null;
		return {
			swid: raw.swid,
			espnS2: raw.espnS2,
			season: raw.season ?? 2026,
			leagues: raw.leagues ?? []
		};
	} catch {
		return null;
	}
}
//#endregion
export { readEspnSession };

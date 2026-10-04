import { t as createServerFn } from "./ssr.mjs";
import { O as normalizeName, h as PLAYERS } from "./league-BHDWdH1h.mjs";
import { n as createSsrRpc } from "./createSsrRpc-kaWDhsSj.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/client-CRDajc_3.js
var connectEspnLeague = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("1da17e3c82e77dbc7828745aa2f20e8ec6aaff58ca0545986ab445c503bfe317"));
var fetchNflScoreboard = createServerFn({ method: "GET" }).validator((input) => input ?? {}).handler(createSsrRpc("525fbefa77bb16cd18ce4473cafdf8b5f630d3d1f5005ce9d16ec4c35b9e3ca8"));
function parsePastedRoster(text) {
	const lines = text.split(/\n|,/).map((l) => l.trim()).filter(Boolean).filter((l) => !/^roster|keepers|waiver|ir$/i.test(l));
	const ids = [];
	const extra = [];
	const costs = {};
	const unmatched = [];
	for (const line of lines) {
		const costMatch = line.match(/^(.*?)(?:\s*[,\-–]\s*|\s+)(?:R(?:ound)?\s*)?(\d{1,2})$/i);
		const name = (costMatch ? costMatch[1] : line).replace(/\s+\((QB|RB|WR|TE|DST)\)/i, "").trim();
		const round = costMatch ? Number(costMatch[2]) : null;
		const n = normalizeName(name);
		const found = PLAYERS.find((p) => normalizeName(p.name) === n) ?? PLAYERS.find((p) => normalizeName(p.name).includes(n));
		if (found) {
			ids.push(found.id);
			if (round) costs[found.id] = round;
		} else if (name.length > 1) unmatched.push(name);
	}
	return {
		ids,
		extra,
		costs,
		unmatched
	};
}
//#endregion
export { fetchNflScoreboard as n, parsePastedRoster as r, connectEspnLeague as t };

import { t as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-A6pJPYTF.mjs";
import { A as slugify, O as normalizeName, d as LEAGUE_ID, h as PLAYERS, p as NFL_TEAMS, w as applyLockedKeepers } from "./league-BHDWdH1h.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/client-sJq2z0mR.js
var ESPN_BASE = "https://lm-api-reads.fantasy.espn.com/apis/v3/games/ffl/seasons";
var SCOREBOARD = "https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard";
var SLOT_LABEL = {
	0: "QB",
	2: "RB",
	4: "WR",
	6: "TE",
	7: "OP",
	16: "DST",
	20: "BE",
	21: "IR",
	23: "FLEX"
};
async function sessionCookies(given) {
	if (given?.swid && given?.espnS2) return given;
	const { readEspnSession } = await import("./session.server-DHFixmmf.mjs");
	const saved = readEspnSession();
	return {
		swid: given?.swid || saved?.swid,
		espnS2: given?.espnS2 || saved?.espnS2
	};
}
var POS_BY_ID = {
	1: "QB",
	2: "RB",
	3: "WR",
	4: "TE",
	5: "K",
	16: "DST"
};
async function espnFetch(path, cookies, extra) {
	const headers = {
		Accept: "application/json",
		...extra
	};
	const parts = [];
	if (cookies?.swid) parts.push(`SWID=${cookies.swid}`);
	if (cookies?.espnS2) parts.push(`espn_s2=${cookies.espnS2}`);
	if (parts.length) headers.Cookie = parts.join("; ");
	const res = await fetch(path, {
		headers,
		redirect: "manual"
	});
	if (res.status === 401 || res.status === 403) throw new Error("ESPN blocked the request — private leagues need SWID and espn_s2. Use paste mode.");
	if (!res.ok) throw new Error(`ESPN returned ${res.status}. Check the league ID and season.`);
	return res.json();
}
function findPoolPlayer(name, pos, team) {
	const n = normalizeName(name);
	return PLAYERS.find((p) => normalizeName(p.name) === n && p.pos === pos) ?? PLAYERS.find((p) => normalizeName(p.name) === n) ?? PLAYERS.find((p) => normalizeName(p.name).includes(n) && p.team === team);
}
function stubFromEspn(name, pos, team, owned) {
	const meta = NFL_TEAMS[team];
	const usage = Math.min(90, 40 + owned / 2);
	return {
		id: slugify(name),
		name,
		pos,
		team: team || "FA",
		bye: meta?.bye ?? 10,
		adp12: Math.max(1, 200 - owned),
		rosPpr: 40 + owned * .8,
		weekPpr: 4 + owned * .08,
		rec: pos === "WR" || pos === "TE" ? owned * .6 : 10,
		usage,
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
var ESPN_TEAM = {
	1: "ATL",
	2: "BUF",
	3: "CHI",
	4: "CIN",
	5: "CLE",
	6: "DAL",
	7: "DEN",
	8: "DET",
	9: "GB",
	10: "TEN",
	11: "IND",
	12: "KC",
	13: "LV",
	14: "LAR",
	15: "MIA",
	16: "MIN",
	17: "NE",
	18: "NO",
	19: "NYG",
	20: "NYJ",
	21: "PHI",
	22: "ARI",
	23: "PIT",
	24: "LAC",
	25: "SF",
	26: "SEA",
	27: "TB",
	28: "WAS",
	29: "CAR",
	30: "JAC",
	33: "BAL",
	34: "HOU"
};
function tapeName(idName, id) {
	return idName.get(id)?.name ?? `Player ${id}`;
}
async function pullTape(leagueId, year, cookies, idName) {
	const root = `${ESPN_BASE}/${year}/segments/0/leagues/${leagueId}`;
	const draft = await espnFetch(`${root}?view=mDraftDetail`, cookies);
	const tx = await espnFetch(`${root}?view=mTransactions2`, cookies);
	const filter = JSON.stringify({ players: {
		filterStatus: { value: ["FREEAGENT", "WAIVERS"] },
		limit: 40,
		sortPercOwned: {
			sortAsc: false,
			sortPriority: 1
		}
	} });
	const fa = await espnFetch(`${root}?view=kona_player_info`, cookies, { "x-fantasy-filter": filter });
	const freeAgents = [];
	for (const row of fa.players ?? []) {
		const pl = row.player ?? row;
		const rawPos = POS_BY_ID[Number(pl.defaultPositionId)] ?? "WR";
		if (rawPos === "K") continue;
		const name = String(pl.fullName ?? "Unknown").replace(/D\/ST$/, "DST");
		const nfl = ESPN_TEAM[Number(pl.proTeamId)] ?? "FA";
		const id = Number(pl.id ?? 0);
		if (id) idName.set(id, {
			name,
			pos: rawPos
		});
		freeAgents.push({
			name,
			pos: rawPos,
			nfl,
			owned: Number(pl.ownership?.percentOwned ?? 0),
			waiver: String(row.status ?? "").includes("WAIVER")
		});
	}
	const picks = (draft.draftDetail?.picks ?? []).map((p) => {
		const id = Number(p.playerId ?? 0);
		return {
			overall: Number(p.overallPickNumber ?? 0),
			round: Number(p.roundId ?? 0),
			pick: Number(p.roundPickNumber ?? 0),
			teamId: Number(p.teamId ?? 0),
			name: tapeName(idName, id),
			pos: idName.get(id)?.pos ?? "WR",
			keeper: Boolean(p.keeper)
		};
	});
	const activity = [];
	for (const t of tx.transactions ?? []) {
		const kind = String(t.type ?? "");
		const status = String(t.status ?? "");
		if (![
			"WAIVER",
			"FREEAGENT",
			"TRADE",
			"TRADE_ACCEPT"
		].includes(kind)) continue;
		if (status !== "EXECUTED" && status !== "PENDING") continue;
		const moves = (t.items ?? []).filter((it) => [
			"ADD",
			"DROP",
			"TRADE"
		].includes(String(it.type))).map((it) => ({
			action: String(it.type),
			name: tapeName(idName, Number(it.playerId ?? 0))
		}));
		if (!moves.length) continue;
		activity.push({
			kind,
			status,
			teamId: Number(t.teamId ?? 0),
			at: Number(t.processDate ?? t.proposedDate ?? 0),
			moves
		});
	}
	return {
		draftPicks: picks,
		activity: activity.slice(0, 30),
		freeAgents
	};
}
var connectEspnLeague_createServerFn_handler = createServerRpc({
	id: "1da17e3c82e77dbc7828745aa2f20e8ec6aaff58ca0545986ab445c503bfe317",
	name: "connectEspnLeague",
	filename: "src/lib/espn/client.ts"
}, (opts) => connectEspnLeague.__executeServer(opts));
var connectEspnLeague = createServerFn({ method: "POST" }).validator((input) => input).handler(connectEspnLeague_createServerFn_handler, async ({ data }) => {
	const leagueId = data.leagueId.trim() || "1014874";
	if (!/^\d{3,12}$/.test(leagueId)) return {
		ok: false,
		error: "League ID should be the number from your ESPN URL."
	};
	const year = data.season || 2026;
	const url = `${ESPN_BASE}/${year}/segments/0/leagues/${leagueId}?${[
		"mTeam",
		"mRoster",
		"mSettings",
		"mStandings",
		"mMatchup",
		"mDraftDetail"
	].map((v) => `view=${v}`).join("&")}`;
	const cookies = await sessionCookies({
		swid: data.swid,
		espnS2: data.espnS2
	});
	try {
		const raw = await espnFetch(url, cookies);
		const settings = raw.settings;
		const teamsRaw = raw.teams ?? [];
		const members = raw.members ?? [];
		const warnings = [];
		const extraPlayers = [];
		const idName = /* @__PURE__ */ new Map();
		const teams = teamsRaw.map((t, idx) => {
			const entries = t.roster?.entries ?? [];
			const roster = [];
			const ir = [];
			const slots = [];
			for (const entry of entries) {
				const line = Number(entry.lineupSlotId ?? 20);
				const player = entry.playerPoolEntry?.player;
				if (!player) continue;
				const name = String(player.fullName ?? "").replace(/D\/ST$/, "DST");
				const rawPos = POS_BY_ID[Number(player.defaultPositionId)] ?? "WR";
				if (rawPos === "K") continue;
				const pos = rawPos;
				const espnId = Number(player.id ?? entry.playerId ?? 0);
				if (espnId) idName.set(espnId, {
					name,
					pos
				});
				const teamAbbr = ESPN_TEAM[Number(player.proTeamId)] ?? "";
				const owned = Number(player.ownership?.percentOwned ?? 50);
				let mapped = findPoolPlayer(name, pos, teamAbbr);
				if (!mapped) {
					mapped = stubFromEspn(name, pos, teamAbbr, owned);
					extraPlayers.push(mapped);
				}
				if (line === 21) ir.push(mapped.id);
				else roster.push(mapped.id);
				slots.push({
					id: mapped.id,
					slot: SLOT_LABEL[line] ?? "BE"
				});
			}
			const record = t.record;
			const owners = t.owners ?? [];
			const member = members.find((m) => owners.includes(m.id));
			const ownerId = (cookies.swid ?? "").toLowerCase();
			const you = Boolean(ownerId && owners.some((o) => o.toLowerCase() === ownerId));
			return {
				id: Number(t.id ?? idx + 1),
				name: String(t.name ?? `Team ${idx + 1}`),
				abbrev: String(t.abbrev ?? `T${idx + 1}`),
				owner: you ? "DJ Alberty" : member?.displayName ?? member?.firstName ?? "Manager",
				isYou: you,
				draftSlot: Number(t.draftDayProjectedRank ?? idx + 1),
				record: {
					w: record?.overall?.wins ?? 0,
					l: record?.overall?.losses ?? 0,
					t: record?.overall?.ties ?? 0
				},
				pf: Number(record?.overall?.pointsFor ?? 0),
				pa: Number(record?.overall?.pointsAgainst ?? 0),
				roster,
				ir,
				draft: {},
				keepers: [],
				keeperCost: {},
				projectedKeepers: [],
				waivers: Number(t.waiverRank ?? idx + 1),
				slots
			};
		});
		const schedule = raw.schedule ?? [];
		const week = Number(raw.scoringPeriodId ?? 1);
		const current = schedule.filter((m) => Number(m.matchupPeriodId) === week);
		const matchups = (current.length ? current : schedule.filter((m) => Number(m.matchupPeriodId) === 1)).map((m) => ({
			week: Number(m.matchupPeriodId ?? 1),
			homeId: Number(m.home?.teamId ?? 0),
			awayId: Number(m.away?.teamId ?? 0)
		})).filter((m) => m.homeId && m.awayId);
		const wantedId = data.teamId ?? null;
		const isBush = leagueId === LEAGUE_ID;
		let my = wantedId != null ? teams.find((t) => t.id === wantedId) : void 0;
		if (!my) my = teams.find((t) => t.isYou);
		if (!my && isBush) my = teams.find((t) => /maye cook/i.test(t.name));
		const marked = teams.map((t) => ({
			...t,
			isYou: my ? t.id === my.id : false
		}));
		const leagueTeams = isBush ? applyLockedKeepers(marked) : marked;
		if (!teams.length) warnings.push("League connected, but no teams came back.");
		else if (!my) warnings.push("Connected. Pick your club on Setup. Team ID was blank or not in this league.");
		else if (isBush) warnings.push("Bush League keepers stay locked. Live rosters replace the seed.");
		else warnings.push(`Synced ${teams.length} teams. Same scoring as The Bush League.`);
		const settingsName = String(settings?.name ?? `ESPN ${leagueId}`);
		const league = {
			id: `espn-${leagueId}`,
			name: settingsName,
			season: year,
			week,
			teams: leagueTeams,
			matchups,
			source: "espn",
			espnLeagueId: leagueId,
			lastUpdated: Date.now(),
			stale: false,
			keepersLocked: isBush
		};
		const tape = await pullTape(leagueId, year, cookies, idName).catch(() => null);
		const baked = (await import("./espn-tape-C8F9iuS2.mjs").then((n) => n.n)).ESPN_TAPE[leagueId];
		const unnamed = tape?.draftPicks.filter((p) => p.name.startsWith("Player ")).length ?? 99;
		league.draftPicks = tape && unnamed < 8 ? tape.draftPicks : baked?.picks ?? tape?.draftPicks ?? [];
		league.activity = tape?.activity.length ? tape.activity : baked?.activity ?? [];
		league.freeAgents = tape?.freeAgents.length ? tape.freeAgents : baked?.freeAgents ?? [];
		return {
			ok: true,
			league,
			myTeamId: my?.id ?? 0,
			warnings,
			extraPlayers
		};
	} catch (err) {
		return {
			ok: false,
			error: err instanceof Error ? err.message : "Could not reach ESPN."
		};
	}
});
var fetchNflScoreboard_createServerFn_handler = createServerRpc({
	id: "525fbefa77bb16cd18ce4473cafdf8b5f630d3d1f5005ce9d16ec4c35b9e3ca8",
	name: "fetchNflScoreboard",
	filename: "src/lib/espn/client.ts"
}, (opts) => fetchNflScoreboard.__executeServer(opts));
var fetchNflScoreboard = createServerFn({ method: "GET" }).validator((input) => input ?? {}).handler(fetchNflScoreboard_createServerFn_handler, async ({ data }) => {
	try {
		const week = data?.week && data.week > 0 ? data.week : 1;
		const res = await fetch(`${SCOREBOARD}?seasontype=2&week=${week}`, { headers: { Accept: "application/json" } });
		if (!res.ok) return {
			ok: false,
			games: []
		};
		return {
			ok: true,
			games: ((await res.json()).events ?? []).map((e) => ({
				name: e.name,
				short: e.shortName ?? e.name,
				status: e.status?.type?.detail ?? "",
				date: e.date
			}))
		};
	} catch {
		return {
			ok: false,
			games: []
		};
	}
});
//#endregion
export { connectEspnLeague_createServerFn_handler, fetchNflScoreboard_createServerFn_handler };

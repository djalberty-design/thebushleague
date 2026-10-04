import { createServerFn } from "@tanstack/react-start";
import { normalizeName, slugify } from "@/lib/utils";
import { PLAYERS } from "@/lib/fantasy/players";
import { NFL_TEAMS, SEASON_YEAR } from "@/lib/fantasy/teams";
import { LEAGUE_ID } from "@/lib/fantasy/config";
import { applyLockedKeepers } from "@/lib/fantasy/league";
import type { FreeAgentRecord, League, LeagueActivity, Pos, RawPlayer, Team, DraftPickRecord } from "@/lib/fantasy/types";

const ESPN_BASE = "https://lm-api-reads.fantasy.espn.com/apis/v3/games/ffl/seasons";
const SCOREBOARD = "https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard";

const SLOT_LABEL: Record<number, string> = {
  0: "QB", 2: "RB", 4: "WR", 6: "TE", 7: "OP", 16: "DST", 20: "BE", 21: "IR", 23: "FLEX",
};

async function sessionCookies(given?: { swid?: string; espnS2?: string }) {
  if (given?.swid && given?.espnS2) return given;
  const { readEspnSession } = await import("./session.server");
  const saved = readEspnSession();
  return { swid: given?.swid || saved?.swid, espnS2: given?.espnS2 || saved?.espnS2 };
}

export type EspnConnectInput = {
  leagueId: string;
  season: number;
  swid?: string;
  espnS2?: string;
  teamId?: number | null;
};

export type EspnConnectResult =
  | { ok: true; league: League; myTeamId: number; warnings: string[]; extraPlayers: RawPlayer[] }
  | { ok: false; error: string };

const POS_BY_ID: Record<number, Pos | "K"> = { 1: "QB", 2: "RB", 3: "WR", 4: "TE", 5: "K", 16: "DST" };

async function espnFetch(path: string, cookies?: { swid?: string; espnS2?: string }, extra?: Record<string, string>) {
  const headers: Record<string, string> = { Accept: "application/json", ...extra };
  const parts: string[] = [];
  if (cookies?.swid) parts.push(`SWID=${cookies.swid}`);
  if (cookies?.espnS2) parts.push(`espn_s2=${cookies.espnS2}`);
  if (parts.length) headers.Cookie = parts.join("; ");
  const res = await fetch(path, { headers, redirect: "manual" });
  if (res.status === 401 || res.status === 403) {
    throw new Error("ESPN blocked the request — private leagues need SWID and espn_s2. Use paste mode.");
  }
  if (!res.ok) throw new Error(`ESPN returned ${res.status}. Check the league ID and season.`);
  return res.json() as Promise<Record<string, unknown>>;
}

function findPoolPlayer(name: string, pos: Pos, team: string) {
  const n = normalizeName(name);
  return (
    PLAYERS.find((p) => normalizeName(p.name) === n && p.pos === pos) ??
    PLAYERS.find((p) => normalizeName(p.name) === n) ??
    PLAYERS.find((p) => normalizeName(p.name).includes(n) && p.team === team)
  );
}

function stubFromEspn(name: string, pos: Pos, team: string, owned: number): RawPlayer {
  const meta = NFL_TEAMS[team];
  const usage = Math.min(90, 40 + owned / 2);
  return {
    id: slugify(name),
    name,
    pos,
    team: team || "FA",
    bye: meta?.bye ?? 10,
    adp12: Math.max(1, 200 - owned),
    rosPpr: 40 + owned * 0.8,
    weekPpr: 4 + owned * 0.08,
    rec: pos === "WR" || pos === "TE" ? owned * 0.6 : 10,
    usage,
    consistency: 50,
    upside: 50,
    health: 80,
    sos: 50,
    trend: 50,
    matchup: 50,
    age: 26,
    opp: meta?.opp ?? "—",
    home: meta?.home ?? true,
  };
}

const ESPN_TEAM: Record<number, string> = {
  1: "ATL", 2: "BUF", 3: "CHI", 4: "CIN", 5: "CLE", 6: "DAL", 7: "DEN", 8: "DET",
  9: "GB", 10: "TEN", 11: "IND", 12: "KC", 13: "LV", 14: "LAR", 15: "MIA", 16: "MIN",
  17: "NE", 18: "NO", 19: "NYG", 20: "NYJ", 21: "PHI", 22: "ARI", 23: "PIT", 24: "LAC",
  25: "SF", 26: "SEA", 27: "TB", 28: "WAS", 29: "CAR", 30: "JAC", 33: "BAL", 34: "HOU",
};

function tapeName(idName: Map<number, { name: string; pos: string }>, id: number) {
  return idName.get(id)?.name ?? `Player ${id}`;
}

async function pullTape(
  leagueId: string,
  year: number,
  cookies: { swid?: string; espnS2?: string },
  idName: Map<number, { name: string; pos: string }>,
) {
  const root = `${ESPN_BASE}/${year}/segments/0/leagues/${leagueId}`;
  const draft = await espnFetch(`${root}?view=mDraftDetail`, cookies);
  const tx = await espnFetch(`${root}?view=mTransactions2`, cookies);
  const filter = JSON.stringify({
    players: {
      filterStatus: { value: ["FREEAGENT", "WAIVERS"] },
      limit: 40,
      sortPercOwned: { sortAsc: false, sortPriority: 1 },
    },
  });
  const fa = await espnFetch(`${root}?view=kona_player_info`, cookies, { "x-fantasy-filter": filter });
  const freeAgents: FreeAgentRecord[] = [];
  for (const row of (fa.players as Record<string, unknown>[] | undefined) ?? []) {
    const pl = (row.player as Record<string, unknown> | undefined) ?? row;
    const rawPos = POS_BY_ID[Number(pl.defaultPositionId)] ?? "WR";
    if (rawPos === "K") continue;
    const name = String(pl.fullName ?? "Unknown").replace(/D\/ST$/, "DST");
    const nfl = ESPN_TEAM[Number(pl.proTeamId)] ?? "FA";
    const id = Number(pl.id ?? 0);
    if (id) idName.set(id, { name, pos: rawPos });
    freeAgents.push({
      name,
      pos: rawPos,
      nfl,
      owned: Number((pl.ownership as { percentOwned?: number } | undefined)?.percentOwned ?? 0),
      waiver: String(row.status ?? "").includes("WAIVER"),
    });
  }
  const picks = ((draft.draftDetail as { picks?: Record<string, unknown>[] } | undefined)?.picks ?? []).map((p) => {
    const id = Number(p.playerId ?? 0);
    return {
      overall: Number(p.overallPickNumber ?? 0),
      round: Number(p.roundId ?? 0),
      pick: Number(p.roundPickNumber ?? 0),
      teamId: Number(p.teamId ?? 0),
      name: tapeName(idName, id),
      pos: idName.get(id)?.pos ?? "WR",
      keeper: Boolean(p.keeper),
    } satisfies DraftPickRecord;
  });
  const activity: LeagueActivity[] = [];
  for (const t of (tx.transactions as Record<string, unknown>[] | undefined) ?? []) {
    const kind = String(t.type ?? "");
    const status = String(t.status ?? "");
    if (!["WAIVER", "FREEAGENT", "TRADE", "TRADE_ACCEPT"].includes(kind)) continue;
    if (status !== "EXECUTED" && status !== "PENDING") continue;
    const moves = ((t.items as Record<string, unknown>[] | undefined) ?? [])
      .filter((it) => ["ADD", "DROP", "TRADE"].includes(String(it.type)))
      .map((it) => ({ action: String(it.type), name: tapeName(idName, Number(it.playerId ?? 0)) }));
    if (!moves.length) continue;
    activity.push({
      kind,
      status,
      teamId: Number(t.teamId ?? 0),
      at: Number(t.processDate ?? t.proposedDate ?? 0),
      moves,
    });
  }
  return { draftPicks: picks, activity: activity.slice(0, 30), freeAgents };
}

export const connectEspnLeague = createServerFn({ method: "POST" })
  .validator((input: EspnConnectInput) => input)
  .handler(async ({ data }): Promise<EspnConnectResult> => {
    const leagueId = data.leagueId.trim() || LEAGUE_ID;
    if (!/^\d{3,12}$/.test(leagueId)) return { ok: false, error: "League ID should be the number from your ESPN URL." };
    const year = data.season || SEASON_YEAR;
    const views = ["mTeam", "mRoster", "mSettings", "mStandings", "mMatchup", "mDraftDetail"];
    const url = `${ESPN_BASE}/${year}/segments/0/leagues/${leagueId}?${views.map((v) => `view=${v}`).join("&")}`;
    const cookies = await sessionCookies({ swid: data.swid, espnS2: data.espnS2 });
    try {
      const raw = await espnFetch(url, cookies);
      const settings = raw.settings as Record<string, unknown> | undefined;
      const teamsRaw = (raw.teams as Record<string, unknown>[] | undefined) ?? [];
      const members = (raw.members as { id: string; displayName?: string; firstName?: string }[] | undefined) ?? [];
      const warnings: string[] = [];
      const extraPlayers: RawPlayer[] = [];
      const idName = new Map<number, { name: string; pos: string }>();

      const teams: Team[] = teamsRaw.map((t, idx) => {
        const rosterObj = t.roster as { entries?: Record<string, unknown>[] } | undefined;
        const entries = rosterObj?.entries ?? [];
        const roster: string[] = [];
        const ir: string[] = [];
        const slots: { id: string; slot: string }[] = [];
        for (const entry of entries) {
          const line = Number(entry.lineupSlotId ?? 20);
          const playerPool = entry.playerPoolEntry as { player?: Record<string, unknown> } | undefined;
          const player = playerPool?.player;
          if (!player) continue;
          const name = String(player.fullName ?? "").replace(/D\/ST$/, "DST");
          const rawPos = POS_BY_ID[Number(player.defaultPositionId)] ?? "WR";
          if (rawPos === "K") continue;
          const pos = rawPos;
          const espnId = Number(player.id ?? entry.playerId ?? 0);
          if (espnId) idName.set(espnId, { name, pos });
          const teamAbbr = ESPN_TEAM[Number(player.proTeamId)] ?? "";
          const owned = Number((player.ownership as { percentOwned?: number } | undefined)?.percentOwned ?? 50);
          let mapped = findPoolPlayer(name, pos, teamAbbr);
          if (!mapped) {
            mapped = stubFromEspn(name, pos, teamAbbr, owned);
            extraPlayers.push(mapped);
          }
          if (line === 21) ir.push(mapped.id);
          else roster.push(mapped.id);
          slots.push({ id: mapped.id, slot: SLOT_LABEL[line] ?? "BE" });
        }
        const record = t.record as { overall?: { wins?: number; losses?: number; ties?: number; pointsFor?: number; pointsAgainst?: number } } | undefined;
        const owners = (t.owners as string[] | undefined) ?? [];
        const member = members.find((m) => owners.includes(m.id));
        const ownerId = (cookies.swid ?? "").toLowerCase();
        const you = Boolean(ownerId && owners.some((o) => o.toLowerCase() === ownerId));
        return {
          id: Number(t.id ?? idx + 1),
          name: String(t.name ?? `Team ${idx + 1}`),
          abbrev: String(t.abbrev ?? `T${idx + 1}`),
          owner: you ? "DJ Alberty" : (member?.displayName ?? member?.firstName ?? "Manager"),
          isYou: you,
          draftSlot: Number(t.draftDayProjectedRank ?? idx + 1),
          record: {
            w: record?.overall?.wins ?? 0,
            l: record?.overall?.losses ?? 0,
            t: record?.overall?.ties ?? 0,
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
          slots,
        };
      });

      const schedule = (raw.schedule as Record<string, unknown>[] | undefined) ?? [];
      const week = Number(raw.scoringPeriodId ?? 1);
      const current = schedule.filter((m) => Number(m.matchupPeriodId) === week);
      const source = current.length ? current : schedule.filter((m) => Number(m.matchupPeriodId) === 1);
      const matchups = source
        .map((m) => ({
          week: Number(m.matchupPeriodId ?? 1),
          homeId: Number((m.home as { teamId?: number })?.teamId ?? 0),
          awayId: Number((m.away as { teamId?: number })?.teamId ?? 0),
        }))
        .filter((m) => m.homeId && m.awayId);

      const wantedId = data.teamId ?? null;
      const isBush = leagueId === LEAGUE_ID;
      let my = wantedId != null ? teams.find((t) => t.id === wantedId) : undefined;
      if (!my) my = teams.find((t) => t.isYou);
      if (!my && isBush) my = teams.find((t) => /maye cook/i.test(t.name));
      const marked = teams.map((t) => ({ ...t, isYou: my ? t.id === my.id : false }));
      const leagueTeams = isBush ? applyLockedKeepers(marked) : marked;
      if (!teams.length) warnings.push("League connected, but no teams came back.");
      else if (!my) warnings.push("Connected. Pick your club on Setup. Team ID was blank or not in this league.");
      else if (isBush) warnings.push("Bush League keepers stay locked. Live rosters replace the seed.");
      else warnings.push(`Synced ${teams.length} teams. Same scoring as The Bush League.`);

      const settingsName = String((settings?.name as string | undefined) ?? `ESPN ${leagueId}`);
      const league: League = {
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
        keepersLocked: isBush,
      };
      const tape = await pullTape(leagueId, year, cookies, idName).catch(() => null);
      const baked = (await import("@/lib/fantasy/espn-tape")).ESPN_TAPE[leagueId];
      const unnamed = tape?.draftPicks.filter((p) => p.name.startsWith("Player ")).length ?? 99;
      league.draftPicks = tape && unnamed < 8 ? tape.draftPicks : (baked?.picks ?? tape?.draftPicks ?? []);
      league.activity = tape?.activity.length ? tape.activity : (baked?.activity ?? []);
      league.freeAgents = tape?.freeAgents.length ? tape.freeAgents : (baked?.freeAgents ?? []);
      return { ok: true, league, myTeamId: my?.id ?? 0, warnings, extraPlayers };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not reach ESPN.";
      return { ok: false, error: message };
    }
  });

export const fetchNflScoreboard = createServerFn({ method: "GET" })
  .validator((input: { week?: number } | undefined) => input ?? {})
  .handler(async ({ data }) => {
  try {
    const week = data?.week && data.week > 0 ? data.week : 1;
    const res = await fetch(`${SCOREBOARD}?seasontype=2&week=${week}`, { headers: { Accept: "application/json" } });
    if (!res.ok) return { ok: false as const, games: [] as { name: string; short: string; status: string; date: string }[] };
    const json = (await res.json()) as {
      events?: { name: string; shortName?: string; date: string; status?: { type?: { detail?: string } } }[];
    };
    const games = (json.events ?? []).map((e) => ({
      name: e.name,
      short: e.shortName ?? e.name,
      status: e.status?.type?.detail ?? "",
      date: e.date,
    }));
    return { ok: true as const, games };
  } catch {
    return { ok: false as const, games: [] as { name: string; short: string; status: string; date: string }[] };
  }
});

export function parsePastedRoster(text: string) {
  const lines = text
    .split(/\n|,/)
    .map((l) => l.trim())
    .filter(Boolean)
    .filter((l) => !/^roster|keepers|waiver|ir$/i.test(l));
  const ids: string[] = [];
  const extra: RawPlayer[] = [];
  const costs: Record<string, number> = {};
  const unmatched: string[] = [];
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
  return { ids, extra, costs, unmatched };
}

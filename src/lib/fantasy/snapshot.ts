import { DRAFT_ORDER } from "./config";
import { ESPN_TAPE } from "./espn-tape";
import { ESPN_SNAPSHOT, type SnapLeague, type SnapPlayer } from "./espn-snapshot";
import { applyLockedKeepers } from "./league";
import { PLAYERS } from "./players";
import { NFL_TEAMS } from "./teams";
import type { League, RawPlayer, Team } from "./types";
import { normalizeName, slugify } from "@/lib/utils";

function cleanName(name: string) {
  return name.replace(/`/g, "'").trim();
}

function stub(p: SnapPlayer): RawPlayer {
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
    home: meta?.home ?? true,
  };
}

function resolve(p: SnapPlayer, extra: RawPlayer[]) {
  const n = normalizeName(p.name);
  const found =
    PLAYERS.find((x) => normalizeName(x.name) === n && x.pos === p.pos) ??
    PLAYERS.find((x) => normalizeName(x.name) === n);
  if (found) return found.id;
  const id = slugify(p.name);
  if (!extra.some((e) => e.id === id)) extra.push(stub(p));
  return id;
}

export function buildSnapshotLeague(snap: SnapLeague) {
  const extra: RawPlayer[] = [];
  const teams: Team[] = snap.teams.map((t) => {
    const name = cleanName(t.name);
    const roster: string[] = [];
    const ir: string[] = [];
    const localNames = new Map<string, string>();
    for (const p of t.players) {
      const id = resolve(p, extra);
      localNames.set(normalizeName(p.name), id);
      if (p.ir) ir.push(id);
      else roster.push(id);
    }
    const tape = ESPN_TAPE[snap.espnLeagueId];
    const slots = (tape?.slots ?? [])
      .filter((s) => s.teamId === t.id)
      .map((s) => ({
        id: localNames.get(normalizeName(s.name)) ?? slugify(s.name),
        slot: s.slot,
      }));
    const draft = DRAFT_ORDER.find((d) => normalizeName(cleanName(d.name)) === normalizeName(name));
    return {
      id: t.id,
      name,
      abbrev: t.abbrev,
      owner: t.owner,
      isYou: t.you,
      draftSlot: draft?.pick ?? t.id,
      record: { w: t.w, l: t.l, t: t.t },
      pf: t.pf,
      pa: t.pa,
      roster,
      ir,
      draft: {},
      keepers: [],
      keeperCost: {},
      projectedKeepers: [],
      waivers: t.waivers,
      slots,
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
      source: "espn" as const,
      espnLeagueId: snap.espnLeagueId,
      lastUpdated: Date.now(),
      stale: false,
      keepersLocked: snap.keepersLocked,
      draftPicks: tape?.picks ?? [],
      activity: tape?.activity ?? [],
      freeAgents: tape?.freeAgents ?? [],
    } satisfies League,
  };
}

export function syncedLeagues() {
  return ESPN_SNAPSHOT.map(buildSnapshotLeague);
}

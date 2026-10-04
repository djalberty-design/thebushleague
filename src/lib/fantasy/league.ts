import {
  CURRENT_WEEK,
  DEFAULT_KEEPER_IDS,
  DRAFT_ORDER,
  LEAGUE_ID,
  LEAGUE_NAME,
  SEASON_YEAR,
  USER_ELIGIBLE,
  USER_IR_IDS,
  USER_ROSTER_IDS,
  USER_TEAM_NAME,
} from "./config";
import type { League, Team } from "./types";
import { normalizeName } from "@/lib/utils";

export interface LockedKeeper {
  id: string;
  round: number;
}

export interface LockedTeamKeepers {
  team: string;
  keepers: LockedKeeper[];
}

/** ESPN League Keepers as locked 2026-09-06. Cost is the burned snake round. */
export const LOCKED_KEEPERS: LockedTeamKeepers[] = [
  {
    team: "Let Maye Cook",
    keepers: [
      { id: "tyler-warren", round: 5 },
      { id: "tetairoa-mcmillan", round: 4 },
    ],
  },
  {
    team: "Great Value Belichick",
    keepers: [
      { id: "rome-odunze", round: 6 },
      { id: "jaxson-dart", round: 15 },
    ],
  },
  { team: "Tommy Ain't Got No Job", keepers: [] },
  {
    team: "Lamar's LinkedIn Warriors",
    keepers: [{ id: "quinshon-judkins", round: 14 }],
  },
  {
    team: "Yuck Fou",
    keepers: [
      { id: "jordan-love", round: 6 },
      { id: "chris-olave", round: 9 },
    ],
  },
  {
    team: "6 Ways from Sunday",
    keepers: [
      { id: "trevor-lawrence", round: 8 },
      { id: "rashee-rice", round: 9 },
    ],
  },
  {
    team: "Baby Got Dak",
    keepers: [
      { id: "emeka-egbuka", round: 7 },
      { id: "jacory-croskey-merritt", round: 8 },
    ],
  },
  {
    team: "Nabers think im sellin dope",
    keepers: [{ id: "kyle-pitts-sr", round: 15 }],
  },
  {
    team: "Do It For State",
    keepers: [
      { id: "devonta-smith", round: 6 },
      { id: "tyrone-tracy-jr", round: 7 },
    ],
  },
  {
    team: "DONKY PUNCHRS",
    keepers: [
      { id: "cam-skattebo", round: 10 },
      { id: "matthew-stafford", round: 9 },
    ],
  },
];

export const LOCKED_KEEPER_IDS = LOCKED_KEEPERS.flatMap((t) => t.keepers.map((k) => k.id));

export function lockedKeepersFor(teamName: string): LockedKeeper[] {
  const n = normalizeName(teamName);
  return LOCKED_KEEPERS.find((k) => normalizeName(k.team) === n)?.keepers ?? [];
}

export function applyLockedKeepers(teams: Team[]): Team[] {
  return teams.map((t) => {
    const spec = LOCKED_KEEPERS.find((k) => normalizeName(k.team) === normalizeName(t.name));
    if (!spec) return t;
    const ids = spec.keepers.map((k) => k.id);
    const keeperCost = Object.fromEntries(spec.keepers.map((k) => [k.id, k.round]));
    const isYou = t.isYou || normalizeName(t.name) === normalizeName(USER_TEAM_NAME);
    return {
      ...t,
      keepers: ids,
      keeperCost,
      projectedKeepers: ids,
      roster: isYou ? (t.roster.length ? uniqueRoster(t.roster, ids) : [...USER_ROSTER_IDS]) : t.roster.length ? uniqueRoster(t.roster, ids) : ids,
    };
  });
}

function uniqueRoster(roster: string[], keepers: string[]) {
  return [...new Set([...keepers, ...roster])];
}

export function buildManualLeague(input: { name: string; rosterIds: string[]; espnLeagueId?: string }): League {
  const espnLeagueId = input.espnLeagueId ?? `paste-${Date.now()}`;
  const me: Team = {
    id: 1,
    name: "My team",
    abbrev: "ME",
    owner: "You",
    isYou: true,
    draftSlot: 1,
    record: { w: 0, l: 0, t: 0 },
    pf: 0,
    pa: 0,
    roster: input.rosterIds,
    ir: [],
    draft: {},
    keepers: [],
    keeperCost: {},
    projectedKeepers: [],
    waivers: 1,
  };
  return {
    id: `local-${espnLeagueId}`,
    name: input.name.trim() || "Untitled league",
    season: SEASON_YEAR,
    week: CURRENT_WEEK,
    teams: [me],
    matchups: [],
    source: "paste",
    espnLeagueId,
    lastUpdated: Date.now(),
    stale: false,
    keepersLocked: false,
  };
}

function userKeeperCost(): Record<string, number> {
  const locked = lockedKeepersFor(USER_TEAM_NAME);
  if (locked.length) return Object.fromEntries(locked.map((k) => [k.id, k.round]));
  return Object.fromEntries(USER_ELIGIBLE.map((e) => [e.id, e.sticker]));
}

export function buildBushLeague(): League {
  const teams: Team[] = DRAFT_ORDER.map((meta) => {
    const isYou = meta.pick === 9;
    const locked = lockedKeepersFor(meta.name);
    const ids = locked.map((k) => k.id);
    const keeperCost = Object.fromEntries(locked.map((k) => [k.id, k.round]));
    return {
      id: meta.pick,
      name: meta.name,
      abbrev: meta.abbrev,
      owner: meta.owner,
      isYou,
      draftSlot: meta.pick,
      record: { w: 0, l: 0, t: 0 },
      pf: 0,
      pa: 0,
      roster: isYou ? [...USER_ROSTER_IDS] : ids,
      ir: isYou ? [...USER_IR_IDS] : [],
      draft: {},
      keepers: ids,
      keeperCost: isYou && !ids.length ? userKeeperCost() : keeperCost,
      projectedKeepers: ids,
      waivers: 11 - meta.pick,
    };
  });

  return {
    id: `espn-${LEAGUE_ID}`,
    name: LEAGUE_NAME,
    season: SEASON_YEAR,
    week: CURRENT_WEEK,
    teams,
    matchups: [
      { week: 1, homeId: 9, awayId: 2 },
      { week: 1, homeId: 1, awayId: 10 },
      { week: 1, homeId: 3, awayId: 8 },
      { week: 1, homeId: 4, awayId: 7 },
      { week: 1, homeId: 5, awayId: 6 },
    ],
    source: "seed",
    espnLeagueId: LEAGUE_ID,
    lastUpdated: Date.now(),
    stale: false,
    keepersLocked: true,
  };
}

export const BUSH_LEAGUE = buildBushLeague();
export const MY_TEAM_ID = 9;

export function myTeam(league: League) {
  return league.teams.find((t) => t.isYou) ?? league.teams.find((t) => t.id === MY_TEAM_ID) ?? league.teams[8];
}

export const USER_TEAM = USER_TEAM_NAME;
export const LOCKED_USER_KEEPER_IDS = [...DEFAULT_KEEPER_IDS];

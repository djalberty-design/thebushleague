import { create } from "zustand";
import { persist } from "zustand/middleware";
import { LEAGUE_ID, SEASON_YEAR } from "./fantasy/config";
import { syncedLeagues } from "./fantasy/snapshot";
import type { EspnCreds, League, LineupMode, RawPlayer } from "./fantasy/types";

export interface LeagueSlot {
  id: string;
  league: League;
  myTeamId: number;
  extraPlayers: RawPlayer[];
  selectedKeepers: string[];
  keeperLocked: boolean;
  takenManual: string[];
  hideTaken: boolean;
  pins: string[];
  tradePartnerId: number | null;
  giveIds: string[];
  getIds: string[];
  pasteText: string;
}

interface BushState {
  hydrated: boolean;
  espn: EspnCreds;
  library: LeagueSlot[];
  activeId: string;
  league: League;
  myTeamId: number;
  extraPlayers: RawPlayer[];
  selectedKeepers: string[];
  keeperLocked: boolean;
  takenManual: string[];
  hideTaken: boolean;
  pins: string[];
  notes: Record<string, string>;
  lineupMode: LineupMode | "auto";
  view: string;
  giveIds: string[];
  getIds: string[];
  tradePartnerId: number | null;
  pasteText: string;
  setHydrated: (v: boolean) => void;
  setEspn: (e: Partial<EspnCreds>) => void;
  setLeague: (league: League, myTeamId?: number, extra?: RawPlayer[]) => void;
  switchLeague: (id: string) => void;
  removeLeague: (id: string) => void;
  claimTeam: (teamId: number) => void;
  resetSeed: () => void;
  toggleKeeper: (id: string) => void;
  setKeepers: (ids: string[]) => void;
  setKeeperLocked: (v: boolean) => void;
  toggleTaken: (id: string) => void;
  setHideTaken: (v: boolean) => void;
  togglePin: (id: string) => void;
  setNote: (id: string, note: string) => void;
  setLineupMode: (m: LineupMode | "auto") => void;
  setView: (v: string) => void;
  setTrade: (partnerId: number | null, give: string[], get: string[]) => void;
  setPasteText: (t: string) => void;
}

const initialLibrary = syncedLeagues().map(slotFromLive);
const bush = initialLibrary[0];

const defaultEspn: EspnCreds = {
  leagueId: bush.league.espnLeagueId || LEAGUE_ID,
  season: bush.league.season || SEASON_YEAR,
  swid: "",
  espnS2: "",
  teamId: bush.myTeamId,
};

function slotFromLive(built: ReturnType<typeof syncedLeagues>[number]): LeagueSlot {
  const you = built.league.teams.find((t) => t.id === built.myTeamId);
  return {
    id: built.league.espnLeagueId,
    league: built.league,
    myTeamId: built.myTeamId,
    extraPlayers: built.extra,
    selectedKeepers: built.league.keepersLocked ? [...(you?.keepers ?? [])] : [],
    keeperLocked: built.league.keepersLocked,
    takenManual: [],
    hideTaken: true,
    pins: [],
    tradePartnerId: null,
    giveIds: [],
    getIds: [],
    pasteText: "",
  };
}

function freshBushSlot(): LeagueSlot {
  return slotFromLive(syncedLeagues()[0]);
}

function toSlot(s: {
  league: League;
  myTeamId: number;
  extraPlayers: RawPlayer[];
  selectedKeepers: string[];
  keeperLocked: boolean;
  takenManual: string[];
  hideTaken: boolean;
  pins: string[];
  tradePartnerId: number | null;
  giveIds: string[];
  getIds: string[];
  pasteText: string;
}): LeagueSlot {
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
    pasteText: s.pasteText,
  };
}

function applySlot(slot: LeagueSlot) {
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
    pasteText: slot.pasteText,
  };
}

function upsertLibrary(library: LeagueSlot[] | undefined, slot: LeagueSlot) {
  const list = library ?? [];
  const i = list.findIndex((x) => x.id === slot.id);
  if (i === -1) return [...list, slot];
  const next = list.slice();
  next[i] = slot;
  return next;
}

export const useBush = create<BushState>()(
  persist(
    (set, get) => {
      const write = (patch: Partial<BushState>) => {
        const cur = { ...get(), ...patch };
        const slot = toSlot(cur);
        set({ ...patch, library: upsertLibrary(cur.library, slot), activeId: slot.id });
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
        setEspn: (e) => set({ espn: { ...get().espn, ...e } }),
        setLeague: (league, myTeamId, extra) => {
          const cur = get();
          const id = league.espnLeagueId || league.id;
          const existing = cur.library.find((s) => s.id === id);
          const you = league.teams.find((t) => t.isYou);
          const nextId = myTeamId && league.teams.some((t) => t.id === myTeamId) ? myTeamId : (you?.id ?? existing?.myTeamId ?? 0);
          const same = cur.activeId === id;
          const base: LeagueSlot = {
            id,
            league,
            myTeamId: nextId,
            extraPlayers: extra ?? (same ? cur.extraPlayers : (existing?.extraPlayers ?? [])),
            selectedKeepers: league.keepersLocked ? (you?.keepers ?? []) : same ? cur.selectedKeepers : [],
            keeperLocked: league.keepersLocked,
            takenManual: same ? cur.takenManual : (existing?.takenManual ?? []),
            hideTaken: same ? cur.hideTaken : (existing?.hideTaken ?? true),
            pins: same ? cur.pins : (existing?.pins ?? []),
            tradePartnerId: same ? cur.tradePartnerId : null,
            giveIds: same ? cur.giveIds : [],
            getIds: same ? cur.getIds : [],
            pasteText: same ? cur.pasteText : (existing?.pasteText ?? ""),
          };
          const library = upsertLibrary(upsertLibrary(cur.library, toSlot(cur)), base);
          set({
            library,
            ...applySlot(base),
            espn: { ...cur.espn, leagueId: league.espnLeagueId, teamId: base.myTeamId || null },
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
            espn: { ...cur.espn, leagueId: next.league.espnLeagueId, teamId: next.myTeamId || null },
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
            espn: { ...cur.espn, leagueId: next.league.espnLeagueId, teamId: next.myTeamId || null },
          });
        },
        claimTeam: (teamId) => {
          const cur = get();
          const league = {
            ...cur.league,
            teams: cur.league.teams.map((t) => ({ ...t, isYou: t.id === teamId })),
          };
          write({ league, myTeamId: teamId, espn: { ...cur.espn, teamId } });
        },
        resetSeed: () => {
          const cur = get();
          const slot = freshBushSlot();
          const library = upsertLibrary(cur.library, slot);
          set({
            library,
            ...applySlot(slot),
            espn: { ...cur.espn, leagueId: slot.id, teamId: slot.myTeamId },
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
        setNote: (id, note) => set({ notes: { ...get().notes, [id]: note } }),
        setLineupMode: (m) => set({ lineupMode: m }),
        setView: (v) => set({ view: v }),
        setTrade: (partnerId, give, getIds) => write({ tradePartnerId: partnerId, giveIds: give, getIds }),
        setPasteText: (t) => write({ pasteText: t }),
      };
    },
    {
      name: "bush-os-v2",
      version: 5,
      skipHydration: true,
      migrate: (persisted, fromVersion) => {
        if (!persisted || typeof persisted !== "object") return persisted as BushState;
        const s = persisted as Partial<BushState>;
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
              teamId: active.myTeamId,
            },
            notes: s.notes ?? {},
          } as BushState;
        }
        if (s.library?.length && s.activeId) return s as BushState;
        const slot = freshBushSlot();
        return { ...s, library: [slot], ...applySlot(slot) } as BushState;
      },
      partialize: (s) => ({
        espn: { leagueId: s.espn.leagueId, season: s.espn.season, swid: "", espnS2: "", teamId: s.espn.teamId },
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
        tradePartnerId: s.tradePartnerId,
      }),
    },
  ),
);

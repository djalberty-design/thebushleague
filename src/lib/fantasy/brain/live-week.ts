import type { PlayerState } from "../types";
import type { LedgerRow } from "./ledger";
import { DRAFT_ID, MODEL_VERSION, SCORER_HASH, SCORER_VERSION } from "./scorer-hash";

export const CONFIRMATION_LABEL = "CONFIRMATION — DOES NOT OPEN GATE";

export interface ConfirmRow {
  playerId: string;
  bye: boolean;
  played: boolean;
  projected: number;
  actual: number;
  kick: "sunday" | "monday";
}

/** Byes stay out of the error. A player who does not play is a lineup zero, not a miss. */
export function confirmationError(rows: ConfirmRow[]) {
  const errorRows = rows.filter((row) => !row.bye && row.played);
  const mae = errorRows.length
    ? errorRows.reduce((sum, row) => sum + Math.abs(row.actual - row.projected), 0) / errorRows.length
    : null;
  return {
    label: CONFIRMATION_LABEL,
    opensGate: false as const,
    mae,
    errorRows: errorRows.length,
    byesLeftOut: rows.filter((row) => row.bye).length,
    didNotPlay: rows.filter((row) => !row.bye && !row.played).map((row) => ({
      playerId: row.playerId,
      lineupZero: true,
      modelMiss: false,
    })),
  };
}

export function buildMondayConfirmation(freeze: { inactiveList?: readonly unknown[] } | null) {
  const hasList = Array.isArray(freeze?.inactiveList);
  return {
    id: "monday-w4-confirmation",
    label: CONFIRMATION_LABEL,
    opensGate: false as const,
    contaminated: !hasList,
    contamination: hasList ? null : "The pre-kickoff freeze has no inactive list. Monday's file is contaminated.",
    sundayOnly: true,
    week5Rows: 0,
    rewrote2025: false,
    scored: [] as ConfirmRow[],
  };
}

/** Tuesday is a new file. It is not final until Monday night is in it, and it never replaces Monday. */
export function buildTuesdayFinal(mondayId: string, rows: ConfirmRow[]) {
  const includesMondayNight = rows.some((row) => row.kick === "monday");
  return {
    id: "tuesday-w4-final",
    version: 2,
    mondayFile: mondayId,
    overwritesMonday: false as const,
    includesMondayNight,
    final: includesMondayNight,
    opensGate: false as const,
    scored: includesMondayNight ? rows : [],
    reason: includesMondayNight
      ? "Final week-4 actuals, including Monday night. The Monday confirmation file was not overwritten."
      : "Monday night has not been played. This file is not the final week-4 grade.",
  };
}

export interface PrelimInput {
  playerId: string;
  pos: LedgerRow["pos"];
  team: string;
  b0: number;
  bye: boolean;
  noTrail: boolean;
  scoredWeeks: number;
  spread: number | null;
  total: number | null;
}

export interface PrelimRow extends PrelimInput {
  price: number;
  canStart: boolean;
  thinSample: boolean;
  bucket: "priced" | "speculative";
  scaled: false;
  codeHash: string;
}

/** Numeric price is the trailing average. A posted line is stored and does not scale. B1 stays off. */
export function pricePrelimRow(row: PrelimInput): PrelimRow {
  const thinSample = row.scoredWeeks <= 3;
  if (row.noTrail) {
    return { ...row, price: 0, canStart: false, thinSample, bucket: "speculative", scaled: false, codeHash: SCORER_HASH };
  }
  return {
    ...row,
    price: row.bye ? 0 : row.b0,
    canStart: !row.bye,
    thinSample,
    bucket: "priced",
    scaled: false,
    codeHash: SCORER_HASH,
  };
}

export function buildWeek5Prelim(tuesdayFinal: boolean, includesMondayNight: boolean, rows: PrelimInput[]) {
  if (!tuesdayFinal || !includesMondayNight) {
    throw new Error("Week-5 prelim is refused until the Tuesday file includes Monday night.");
  }
  const priced = rows.map(pricePrelimRow);
  const board = [
    ...priced.filter((row) => row.bucket === "priced"),
    ...priced.filter((row) => row.bucket === "speculative"),
  ];
  return {
    id: "week-5-prelim",
    ready: true,
    usesSundayDraft: false,
    draftId: DRAFT_ID,
    opensGate: false as const,
    rows: board,
  };
}

export interface GameLock {
  window: "thursday" | "sunday-early";
  locked: true;
  timestamp: string;
  availabilitySource: string;
  modelVersion: string;
  scorerVersion: string;
  weight: 0.6;
  rowCount: number;
  codeHash: string;
  playerListFrozen: false;
  opensGate: false;
  rows: Array<LedgerRow & { codeHash: string; thinSample: boolean; scoredWeeks: number }>;
  statusRows: { playerId: string; status: string; at: string }[];
}

export function lockGameWindow(input: {
  window: "thursday" | "sunday-early";
  slate: { playerId: string }[];
  rows: Array<LedgerRow & { scoredWeeks: number }>;
  now: string;
  availabilitySource: string;
  alreadyLocked?: boolean;
}): GameLock {
  if (input.alreadyLocked) throw new Error("Edit after lock is refused.");
  if (!input.slate.length || input.rows.length !== input.slate.length) throw new Error("Partial write refused.");
  const ids = input.rows.map((row) => row.playerId);
  if (new Set(ids).size !== ids.length) throw new Error("Duplicate player.");
  const got = new Set(ids);
  if (input.slate.some((player) => !got.has(player.playerId))) throw new Error("Partial write refused.");
  const rows = input.rows.map((row) => ({
    ...row,
    codeHash: SCORER_HASH,
    thinSample: row.scoredWeeks <= 3,
  }));
  return {
    window: input.window,
    locked: true,
    timestamp: input.now,
    availabilitySource: input.availabilitySource,
    modelVersion: MODEL_VERSION,
    scorerVersion: SCORER_VERSION,
    weight: 0.6,
    rowCount: rows.length,
    codeHash: SCORER_HASH,
    playerListFrozen: false,
    opensGate: false,
    rows,
    statusRows: [],
  };
}

/** A later injury is a status row. The locked projection is the same object. */
export function addStatusRow(lock: GameLock, status: { playerId: string; status: string; at: string }): GameLock {
  if (!lock.rows.some((row) => row.playerId === status.playerId)) {
    throw new Error("A status row does not add a player or edit a projection.");
  }
  return { ...lock, rows: lock.rows, statusRows: [...lock.statusRows, status] };
}

export function fillPopulationPrior(row: { thinSample: boolean }): never {
  if (row.thinSample) throw new Error("THIN SAMPLE. Nothing downstream may fill a population prior.");
  throw new Error("No population prior is applied.");
}

const FITS: Record<string, (player: PlayerState) => boolean> = {
  QB: (player) => player.pos === "QB",
  RB: (player) => player.pos === "RB",
  WR: (player) => player.pos === "WR",
  TE: (player) => player.pos === "TE",
  FLEX: (player) => player.pos === "RB" || player.pos === "WR" || player.pos === "TE",
  OP: (player) => player.pos !== "DST",
  DST: (player) => player.pos === "DST",
};

/** Scoring cannot clear the contamination stamp and cannot open the gate. */
export function scoreSundayConfirmation(
  actuals: ConfirmRow[],
) {
  const graded = confirmationError(actuals.filter((row) => row.kick === "sunday"));
  return {
    id: "monday-w4-confirmation",
    label: CONFIRMATION_LABEL,
    opensGate: false as const,
    contaminated: true as const,
    week5Rows: 0,
    rewrote2025: false,
    tuned: false,
    mae: graded.mae,
    byesLeftOut: graded.byesLeftOut,
    didNotPlay: graded.didNotPlay,
    scored: actuals.filter((row) => row.kick === "sunday" && !row.bye && row.played).map((row) => ({
      playerId: row.playerId,
      actual: row.actual,
      projected: row.projected,
    })),
  };
}

export const THURSDAY_KICK = Date.parse("2026-10-08T20:15:00-04:00");

/** About 90 minutes before Thursday. Roster status already on disk is refused. */
export function storeThursdayInactives(
  now: number,
  list: { playerId: string; status: string }[],
  source: string,
) {
  const minutesBefore = (THURSDAY_KICK - now) / 60000;
  if (source === "player-status-on-disk") {
    throw new Error("The player status already on disk is not the inactive list.");
  }
  if (minutesBefore < 75 || minutesBefore > 105) {
    throw new Error("The inactive list is stored about 90 minutes before Thursday kickoff. This is not that time.");
  }
  return {
    captured: true,
    at: new Date(now).toISOString(),
    inactiveList: list,
    source,
    opensGate: false as const,
    writtenIntoSundayFreeze: false,
  };
}

export function isInactive(player: PlayerState) {
  return player.status === "O" || player.status === "IR" || player.status === "SSPD";
}

/** Next legal body from the trailing average. About 90 minutes before kickoff. Not the brain. */
export function inactiveSwaps(roster: PlayerState[], slots: { id: string; slot: string }[]) {
  const startSlots = new Set(["QB", "RB", "WR", "TE", "FLEX", "OP", "DST"]);
  const starterIds = new Set(slots.filter((seat) => startSlots.has(seat.slot)).map((seat) => seat.id));
  const swaps: { slot: string; sit: PlayerState; start: PlayerState; b0: number }[] = [];
  for (const seat of slots) {
    if (!startSlots.has(seat.slot)) continue;
    const sit = roster.find((player) => player.id === seat.id);
    if (!sit || !isInactive(sit)) continue;
    const fit = FITS[seat.slot];
    const next = roster
      .filter((player) => !starterIds.has(player.id) && fit?.(player) && player.trail !== "none" && !isInactive(player) && player.status !== "Bye")
      .sort((a, b) => b.weekly.ePts - a.weekly.ePts)[0];
    if (!next) continue;
    swaps.push({ slot: seat.slot, sit, start: next, b0: next.weekly.ePts });
  }
  return swaps;
}

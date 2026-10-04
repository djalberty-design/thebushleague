import { WEEK5_LEDGER } from "./stored/ledger";
import { SCORER_HASH } from "./scorer-hash";

Object.freeze(WEEK5_LEDGER);
Object.freeze(WEEK5_LEDGER.rows);

export interface LedgerRow {
  playerId: string;
  pos: "QB" | "RB" | "WR" | "TE";
  team: string;
  b0: number;
  b2: number;
  noTrail: boolean;
  bye: boolean;
  compare: boolean;
  codeHash?: string;
  scoredWeeks?: number;
}

export interface LockedLedger {
  week: 5;
  season: 2026;
  locked: true;
  lockedAt: string;
  weight: 0.6;
  codeHash: string;
  rows: Array<LedgerRow & { codeHash: string }>;
  opensGate: false;
}

/** The slate is whoever is active at lock. A debut is not checked against an old list. */
export function lockWeek5Ledger(slate: { playerId: string }[], rows: LedgerRow[], now: string): LockedLedger {
  if (WEEK5_LEDGER.locked) throw new Error("Week 5 ledger is locked. No edit after lock.");
  if (!slate.length || rows.length !== slate.length) throw new Error("Partial write refused. Every active skill player on the slate needs a row.");
  const ids = rows.map((row) => row.playerId);
  if (new Set(ids).size !== ids.length) throw new Error("Duplicate player. One row per skill player.");
  const got = new Set(ids);
  if (slate.some((player) => !got.has(player.playerId))) throw new Error("Partial write refused. A slate player has no row.");
  for (const row of rows) {
    if (row.noTrail && (row.b0 !== 0 || row.b2 !== 0 || row.compare)) {
      throw new Error("A debut is NO TRAIL, projected 0, and out of the comparison.");
    }
    if (!Number.isFinite(row.b0) || !Number.isFinite(row.b2)) throw new Error("B0 and B2 are required at lock.");
  }
  return {
    week: 5,
    season: 2026,
    locked: true,
    lockedAt: now,
    weight: 0.6,
    codeHash: SCORER_HASH,
    rows: rows.map((row) => ({ ...row, codeHash: row.codeHash ?? SCORER_HASH })),
    opensGate: false,
  };
}

/** The locked file is not edited. Calling this is the refusal. */
export function editLockedLedger(): never {
  throw new Error("Week 5 ledger is immutable. No edit after lock.");
}

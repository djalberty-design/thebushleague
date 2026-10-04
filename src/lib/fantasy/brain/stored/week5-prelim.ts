import { DRAFT_ID } from "../scorer-hash";

/** Waiver file. Not the Sunday draft. Empty until Tuesday's final pass exists. */
export const WEEK5_PRELIM = {
  id: "week-5-prelim",
  due: "2026-10-06T12:00:00-04:00",
  ready: false,
  usesSundayDraft: false,
  draftId: DRAFT_ID,
  opensGate: false,
  rows: [] as { playerId: string; price: number; bucket: "priced" | "speculative"; canStart: boolean }[],
  reason: "Not built. Waiver claims do not use the Sunday draft. A debut is NO TRAIL, projected 0, and cannot start. A missing line stays the trailing average. B1 does not scale the price.",
} as const;

import { DRAFT_ID } from "../scorer-hash";

/** Thursday and Sunday are separate locks. Neither has fired. The Sunday draft stays unlocked. */
export const WEEK5_LOCKS = {
  draftId: DRAFT_ID,
  draftLocked: false,
  thursday: null as null | { timestamp: string; rowCount: number; codeHash: string },
  sundayEarly: null as null | { timestamp: string; rowCount: number; codeHash: string },
  thursdayDue: "2026-10-08T19:00:00-04:00",
  sundayDue: "2026-10-11T11:30:00-04:00",
  playerListFrozen: false,
  note: "A lock freezes the prediction, the weight, and the time for that game. It does not freeze the player list. A later injury is a status row.",
} as const;

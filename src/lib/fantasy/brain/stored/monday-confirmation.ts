/** Sunday-only grade. Written as its own file. It does not open the gate and it holds no week-5 rows. */
export const MONDAY_CONFIRMATION = {
  id: "monday-w4-confirmation",
  due: "2026-10-05T06:00:00-04:00",
  label: "CONFIRMATION — DOES NOT OPEN GATE",
  opensGate: false,
  contaminated: true,
  contamination: "The pre-kickoff freeze has a timestamp and a weight version. It does not store an inactive list. Monday's file is contaminated.",
  freezeIds: ["1014874-w4-sun", "210326445-w4-sun"],
  sundayOnly: true,
  week5Rows: 0,
  rewrote2025: false,
  scored: [] as { playerId: string; actual: number; projected: number }[],
  actualsOnDisk: 0,
  tuned: false,
  reason: "Scored against the stored Sunday projection. No Sunday actual is on disk, so no row was written. The contamination stamp stays. This file was not used to tune.",
} as const;

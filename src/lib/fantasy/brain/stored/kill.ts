/** Fixed before any 2026 forward week is scored. The grader reads this file. */
export const KILL_RULE = {
  at: "end of week 10",
  pool: "2026 forward weeks plus the odd-week result",
  test: "If the week-block lower bound is still not above zero, retire the brain's card ambitions and stop spending build time on it.",
  rollback: "Do not wire a one-week rollback. That trap was already rejected.",
  bars: "The bars stay 0.25 on the error gap and a lower bound above zero. Do not lower either because 0.15 missed.",
  opensGate: false,
  sunday: "Monday 6:00 AM ET grades Sunday-only players in its own file. That file is marked CONFIRMATION — DOES NOT OPEN GATE. Tuesday 6:00 AM ET is the final week-4 file and includes Monday night. It does not overwrite Monday. Byes stay out of the error. A player who does not play is a zero in the lineup, not a model miss.",
} as const;

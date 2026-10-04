/** Final week-4 file. It does not overwrite Monday. It is not final until Monday night is in it. */
export const TUESDAY_FINAL = {
  id: "tuesday-w4-final",
  due: "2026-10-06T06:00:00-04:00",
  version: 2,
  mondayFile: "monday-w4-confirmation",
  overwritesMonday: false,
  includesMondayNight: false,
  final: false,
  opensGate: false,
  scored: [] as { playerId: string; kick: "sunday" | "monday" }[],
  reason: "Monday night has not been played. This file is not the final week-4 grade.",
} as const;

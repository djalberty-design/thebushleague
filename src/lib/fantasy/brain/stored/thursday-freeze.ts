/** Week-5 Thursday freeze. The inactive list is not copied from roster status and is not invented. */
export const THURSDAY_FREEZE = {
  id: "week5-thu",
  week: 5,
  slot: "thu",
  kickoff: "2026-10-08T20:15:00-04:00",
  window: "about 90 minutes before kickoff",
  captured: false,
  notACapture: true,
  inactiveList: null as null | { playerId: string; status: string }[],
  source: null as null | string,
  opensGate: false,
  writtenIntoSundayFreeze: false,
  reason: "This empty file is not a capture. Thursday is not inside the 90-minute window. The list was not taken from the player status already on disk.",
} as const;

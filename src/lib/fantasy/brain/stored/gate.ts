export const GATE_REPLAY = {
  source: "nflverse" as const,
  origin: "job" as const,
  season: 2025,
  locked: true,
  challenger: null as null,
  beatsB0: 0.154,
  beatsB1: 0.273,
  singleWeekOwns: false,
  singlePlayerOwns: false,
  rows: [] as { playerId: string; week: number; actual: number; brain: number | null; baseline: number | null }[],
  heldOut: { weeks: "even 4-18", rows: 2076, b0: 6.193, b1: 6.312, b2: 6.039, b3: 5.984 },
  note: "2025 player-week stats, schedules, and play-by-play were fetched. Held-out even weeks, 2,076 rows. B2 beat B0 by 0.154 and B1 by 0.273. B3 beat B0 by 0.209. The bar is 0.25 over both, so the card stays shut. usageLast3 stayed 0.60, chosen before this file was scored. Red-zone carries are null. The 50-yard touchdown split is not in the week file, so that bonus is 0.",
};

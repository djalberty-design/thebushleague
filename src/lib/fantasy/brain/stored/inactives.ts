/** Pre-kickoff inactive swap. ESPN status already on the player. Not a new feed and not the brain. */
export const INACTIVE_AUDIT = {
  usesBrain: false,
  windowMinutes: 90,
  source: "Player status already on disk. The swap is the next legal bench player by the trailing average.",
  storedStartsUnder3: 0,
  thursdayGradesChecked: 9,
  reason: "Week-4 starter slots are stored. Actual points on those starters exist only for the nine Thursday grades. None of those nine scored under 3. Weeks 1–3 start/sit actuals are not on disk, so they were not counted.",
} as const;

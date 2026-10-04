import { FREEZE_ROWS } from "./stored/freezes";

export function newestFreeze(leagueId: string, week: number) {
  return FREEZE_ROWS.filter((row) => row.leagueId === leagueId && row.week === week).sort((a, b) => (a.at < b.at ? 1 : -1))[0] ?? null;
}

export function freezeChip(leagueId: string, week: number) {
  const freeze = newestFreeze(leagueId, week);
  if (!freeze) return null;
  const time = new Date(freeze.at).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone: "America/New_York" });
  const name = freeze.slot === "thu" ? "Thu" : freeze.slot === "sun" ? "Sun" : "Inactives";
  return { label: `${name} freeze · ${time}`, stale: false, id: freeze.id };
}

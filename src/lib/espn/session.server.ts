import { readFileSync } from "node:fs";

export function readEspnSession(): { swid: string; espnS2: string; season: number; leagues: string[] } | null {
  try {
    const raw = JSON.parse(readFileSync("/workspace/.espn/session.json", "utf8")) as {
      swid?: string;
      espnS2?: string;
      season?: number;
      leagues?: string[];
    };
    if (!raw.swid || !raw.espnS2) return null;
    return {
      swid: raw.swid,
      espnS2: raw.espnS2,
      season: raw.season ?? 2026,
      leagues: raw.leagues ?? [],
    };
  } catch {
    return null;
  }
}

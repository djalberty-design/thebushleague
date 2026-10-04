import { GATE_REPLAY } from "./stored/gate";

export interface CardReplay {
  source: string;
  origin: string;
  season?: number;
  locked?: boolean;
  challenger?: "B0" | "B1" | "B2" | "B3" | null;
  beatsB0?: number;
  beatsB1?: number;
  singleWeekOwns?: boolean;
  singlePlayerOwns?: boolean;
  rows?: readonly { playerId: string; week: number; actual: number; brain: number | null; baseline: number | null }[];
}

export function liveFeeds() {
  return {
    usage: "last 3 games when the player has them, otherwise thin",
    odds: "nflverse schedule line",
    weather: "missing",
    injuries: "ESPN roster status; opponent role feed missing",
  };
}

export function cardUsesBrain(record: CardReplay = GATE_REPLAY) {
  if (!record.locked || record.season !== 2025) return false;
  if (record.challenger !== "B2" && record.challenger !== "B3") return false;
  // B1 is disabled. Beating it is not a bar. The stored 2025 gate still has no challenger.
  if ((record.beatsB0 ?? 0) < 0.25) return false;
  if (record.singleWeekOwns || record.singlePlayerOwns) return false;
  return true;
}

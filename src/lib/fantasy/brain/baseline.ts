import { TRAILING } from "./stored/baseline";

export function trailingAverage(playerId: string) {
  const value = TRAILING[playerId];
  return typeof value === "number" ? value : null;
}

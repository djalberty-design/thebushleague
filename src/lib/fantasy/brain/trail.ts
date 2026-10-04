import { TRAILS } from "./stored/trails";

export type TrailKind = "none" | "thin" | "full";

export function trailOf(id: string) {
  const row = TRAILS[id];
  const points = row?.points ?? [];
  if (!row?.gsis || points.length === 0) {
    return { kind: "none" as TrailKind, points: [] as number[], floor: 0, mean: 0, ceiling: 0, reason: row?.reason ?? "NO TRAIL. Off the start list." };
  }
  const floor = Math.min(...points);
  const ceiling = Math.max(...points);
  const mean = points.reduce((sum, n) => sum + n, 0) / points.length;
  return { kind: (points.length >= 3 ? "full" : "thin") as TrailKind, points, floor, mean, ceiling, reason: row.reason ?? "" };
}
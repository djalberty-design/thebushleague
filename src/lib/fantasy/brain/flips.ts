import { cardUsesBrain } from "./ingest";

export interface FlipPlayer {
  id: string;
  pos: "QB" | "RB" | "WR" | "TE";
  b0: number;
  b2: number;
  actual?: number;
}

export interface FlipReport {
  teams: number;
  flips: number;
  teamWeeks: number;
  pointsPerTeamWeek: number | null;
  opensGate: false;
}

const GAP = 1.5;
const TEAMS = 10;
const NEED: Record<FlipPlayer["pos"], number> = { QB: 2, RB: 5, WR: 6, TE: 2 };
const SLOTS: { slot: string; eligible: FlipPlayer["pos"][] }[] = [
  { slot: "RB", eligible: ["RB"] },
  { slot: "RB", eligible: ["RB"] },
  { slot: "WR", eligible: ["WR"] },
  { slot: "WR", eligible: ["WR"] },
  { slot: "WR", eligible: ["WR"] },
  { slot: "FLEX", eligible: ["RB", "WR", "TE"] },
  { slot: "OP", eligible: ["QB", "RB", "WR", "TE"] },
];

/** Not the roster recipe. The real count is stored/qb-starts.ts. This does not open the gate. */
export function syntheticFlips(players: FlipPlayer[]): FlipReport {
  const remaining = [...players].sort((a, b) => b.b0 - a.b0 || a.id.localeCompare(b.id));
  const rosters: FlipPlayer[][] = Array.from({ length: TEAMS }, () => []);
  const need = Array.from({ length: TEAMS }, () => ({ ...NEED }));
  let seat = 0;
  let direction = 1;
  let idle = 0;
  while (remaining.length && idle < TEAMS) {
    const open = need[seat];
    const index = rosters[seat].length >= 15 ? -1 : remaining.findIndex((player) => open[player.pos] > 0);
    if (index < 0) idle += 1;
    else {
      idle = 0;
      const [player] = remaining.splice(index, 1);
      rosters[seat].push(player);
      open[player.pos] -= 1;
    }
    seat += direction;
    if (seat >= TEAMS || seat < 0) {
      direction *= -1;
      seat += direction;
    }
  }

  let flips = 0;
  let points = 0;
  let scored = 0;
  for (const roster of rosters) {
    if (!roster.length) continue;
    const b0 = fill(roster, "b0");
    const b2 = fill(roster, "b2");
    for (let i = 0; i < SLOTS.length; i++) {
      const left = b0[i];
      const right = b2[i];
      if (!left || !right || left.id === right.id) continue;
      const opposite = (left.b0 - right.b0) * (left.b2 - right.b2) < 0;
      if (opposite && Math.abs(left.b0 - right.b0) > GAP && Math.abs(left.b2 - right.b2) > GAP) flips += 1;
    }
    if (b0.every((player) => player?.actual != null) && b2.every((player) => player?.actual != null)) {
      const a0 = b0.reduce((sum, player) => sum + (player?.actual ?? 0), 0);
      const a2 = b2.reduce((sum, player) => sum + (player?.actual ?? 0), 0);
      points += a2 - a0;
      scored += 1;
    }
  }
  return {
    teams: TEAMS,
    flips,
    teamWeeks: rosters.filter((roster) => roster.length).length,
    pointsPerTeamWeek: scored ? points / scored : null,
    opensGate: false,
  };
}

function fill(roster: FlipPlayer[], key: "b0" | "b2") {
  const used = new Set<string>();
  const ranked = [...roster].sort((a, b) => b[key] - a[key] || a.id.localeCompare(b.id));
  return SLOTS.map((slot) => {
    const player = ranked.find((candidate) => !used.has(candidate.id) && slot.eligible.includes(candidate.pos)) ?? null;
    if (player) used.add(player.id);
    return player;
  });
}

/** The metric is specified. It is not a gate. */
export function flipOpensGate() {
  return syntheticFlips([]).opensGate || cardUsesBrain();
}

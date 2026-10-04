import assert from "node:assert/strict";
import { test } from "node:test";
import { assignCosts, allKeptIds, buildLeagueKeepers, legalPair, lockedCount } from "./keepers";
import { pickValueRound } from "./pick-value";
import { remainingPicks } from "./draft";
import { BUSH_LEAGUE, LOCKED_KEEPER_IDS, LOCKED_KEEPERS, applyLockedKeepers } from "./league";
import { PLAYERS } from "./players";
import { buildDesk } from "./engine";
import { DEFAULT_KEEPER_IDS } from "./config";

test("locked keepers do not wipe a full roster", () => {
  const me = BUSH_LEAGUE.teams.find((t) => t.isYou)!;
  const [next] = applyLockedKeepers([{ ...me, roster: ["tyler-warren", "ceedee-lamb", "jahmyr-gibbs"] }]);
  assert.ok(next.roster.includes("ceedee-lamb"));
  assert.ok(next.roster.includes("jahmyr-gibbs"));
  assert.equal(next.keeperCost["tyler-warren"], 5);
  assert.equal(next.keeperCost["tetairoa-mcmillan"], 4);
});

test("Warren R4 + Robinson R15 assign R4 and R15", () => {
  const out = assignCosts([
    { id: "tyler-warren", sticker: 4 },
    { id: "wandale-robinson", sticker: 15 },
  ]);
  const warren = out.find((x) => x.id === "tyler-warren")!;
  const wandale = out.find((x) => x.id === "wandale-robinson")!;
  assert.equal(warren.assigned, 4);
  assert.equal(wandale.assigned, 15);
});

test("Warren R4 + McMillan R4 assign R4 and R5; McMillan uses PickValue 26", () => {
  const out = assignCosts([
    { id: "tyler-warren", sticker: 4 },
    { id: "tetairoa-mcmillan", sticker: 4 },
  ]);
  const assigned = out.map((x) => x.assigned).sort((a, b) => a - b);
  assert.deepEqual(assigned, [4, 5]);
  const mac = out.find((x) => x.id === "tetairoa-mcmillan")!;
  assert.equal(pickValueRound(mac.assigned), 26);
  assert.equal(pickValueRound(4), 35);
});

test("Robinson WR + McMillan WR is illegal", () => {
  const gate = legalPair(
    { player: { id: "wandale-robinson", pos: "WR" } as never, eligible: true } as never,
    { player: { id: "tetairoa-mcmillan", pos: "WR" } as never, eligible: true } as never,
  );
  assert.equal(gate.ok, false);
});

test("after Warren + Robinson, first pick is 1.09", () => {
  const me = BUSH_LEAGUE.teams.find((t) => t.isYou)!;
  const picks = remainingPicks(me, ["tyler-warren", "wandale-robinson"], 1, {
    "tyler-warren": 4,
    "wandale-robinson": 15,
  });
  assert.equal(picks[0]?.label, "1.09");
});

test("every locked keeper exists in the player pool", () => {
  const ids = new Set(PLAYERS.map((p) => p.id));
  const missing = LOCKED_KEEPER_IDS.filter((id) => !ids.has(id));
  assert.deepEqual(missing, []);
});

test("ESPN lock is 16 keepers across 10 teams with 4 empty slots", () => {
  assert.equal(lockedCount(), 16);
  assert.equal(LOCKED_KEEPERS.length, 10);
  const empty = LOCKED_KEEPERS.reduce((n, t) => n + (2 - t.keepers.length), 0);
  assert.equal(empty, 4);
  const tommy = LOCKED_KEEPERS.find((t) => t.team.startsWith("Tommy"))!;
  assert.equal(tommy.keepers.length, 0);
});

test("locked McMillan R4 + Warren R5 burn 4.02 and 5.09; first pick is 1.09", () => {
  const me = BUSH_LEAGUE.teams.find((t) => t.isYou)!;
  assert.deepEqual([...me.keepers].sort(), [...DEFAULT_KEEPER_IDS].sort());
  assert.equal(me.keeperCost["tetairoa-mcmillan"], 4);
  assert.equal(me.keeperCost["tyler-warren"], 5);
  const picks = remainingPicks(me, me.keepers, 1, me.keeperCost);
  assert.equal(picks[0]?.label, "1.09");
  assert.equal(picks.find((p) => p.round === 4), undefined);
  assert.equal(picks.find((p) => p.round === 5), undefined);
  assert.equal(picks.find((p) => p.round === 2)?.label, "2.02");
});

test("desk removes all 16 keepers and leaves superstars in the pool", () => {
  const desk = buildDesk({
    league: BUSH_LEAGUE,
    myTeamId: 9,
    extra: [],
    selectedKeepers: [...DEFAULT_KEEPER_IDS],
    takenManual: [],
    hideTaken: true,
    mode: "auto",
    espnConnected: false,
    view: "ALL",
    keeperLocked: true,
  });
  const kept = allKeptIds(BUSH_LEAGUE);
  assert.equal(kept.length, 16);
  assert.equal(desk.keeperOff.size, 16);
  for (const id of kept) assert.equal(desk.taken.has(id), true);
  assert.equal(desk.taken.has("jahmyr-gibbs"), false);
  assert.equal(desk.taken.has("bijan-robinson"), false);
  assert.equal(desk.taken.has("jamarr-chase"), false);
  assert.equal(desk.taken.has("christian-mccaffrey"), false);
  assert.equal(desk.taken.has("quinshon-judkins"), true);
  assert.equal(desk.taken.has("rashee-rice"), true);
  assert.equal(desk.board.burned.slice().sort((a, b) => a - b).join(","), "4,5");
  assert.equal(desk.board.next?.label, "1.09");
  const rows = buildLeagueKeepers(BUSH_LEAGUE, desk.map);
  const you = rows.find((r) => r.team.isYou)!;
  assert.equal(you.seats.length, 2);
  assert.ok(you.seats.some((s) => s.espnLabel === "Rd 4, Pick 2"));
  assert.ok(you.seats.some((s) => s.espnLabel === "Rd 5, Pick 9"));
  const judkins = rows.flatMap((r) => r.seats).find((s) => s.id === "quinshon-judkins")!;
  assert.equal(judkins.espnLabel, "Rd 14, Pick 8");
  assert.ok(judkins.surplus > 20);
});

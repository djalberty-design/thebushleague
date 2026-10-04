import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { correctWeights, gridUsageLast3 } from "./correct.ts";
import { projectOffense, scoreOffense } from "../scoring.ts";
import { availabilityFrom } from "./availability.ts";
import { cardUsesBrain } from "./ingest.ts";
import { replay } from "./grade.ts";
import { REPLAY_RECORD } from "./stored/replay.ts";
import { getWeights } from "./weights-store.ts";
import { commitDecision } from "./commit.ts";
import { GRADE_ROWS } from "./stored/grades.ts";
import { STORED_WEIGHTS } from "./stored/weights.ts";
import { projectFromRaw } from "./project.ts";
import type { GradeRow } from "./types.ts";
import { PARITY } from "./stored/parity.ts";
import { B1_DISABLED } from "./slate-lookup.ts";
import { DEFAULT_WEIGHTS } from "./weights.ts";
import { TERCILE } from "./stored/tercile.ts";
import { WEEK5_LEDGER } from "./stored/ledger.ts";
import { PLAYED_ONLY } from "./stored/played-only.ts";
import { QB_STARTS } from "./stored/qb-starts.ts";
import { editLockedLedger, lockWeek5Ledger } from "./ledger.ts";
import { flipOpensGate, syntheticFlips } from "./flips.ts";
import { optimalLineup } from "../lineup.ts";
import { evaluateTrade } from "../trades.ts";
import type { PlayerState, Team } from "../types.ts";
import { SCORER_HASH } from "./scorer-hash.ts";
import { MONDAY_CONFIRMATION } from "./stored/monday-confirmation.ts";
import { TUESDAY_FINAL } from "./stored/tuesday-final.ts";
import { WEEK5_PRELIM } from "./stored/week5-prelim.ts";
import { ROSTER_AUDIT } from "./stored/roster-audit.ts";
import {
  addStatusRow,
  buildTuesdayFinal,
  buildWeek5Prelim,
  confirmationError,
  fillPopulationPrior,
  inactiveSwaps,
  lockGameWindow,
  pricePrelimRow,
  scoreSundayConfirmation,
  storeThursdayInactives,
  THURSDAY_KICK,
} from "./live-week.ts";
import { THURSDAY_FREEZE } from "./stored/thursday-freeze.ts";
import { CLAIM_MULTIPLIER, CLAIM_SORT, compareClaims, rankClaimPoints, waiverTargets } from "../waivers.ts";
import type { League } from "../types.ts";

function miss(week: number, i: number, last3Closer = true): GradeRow {
  return {
    leagueId: "1014874",
    leagueIds: ["1014874"],
    week,
    slot: "sun",
    playerId: `${week}-${i}`,
    pos: "WR",
    projected: {} as GradeRow["projected"],
    actualPoints: 10,
    ePts: 10,
    baseline: 14,
    p20: 4,
    p80: 16,
    projectedTargets: 9,
    actualTargets: 5,
    projectedCarries: 1,
    actualCarries: 1,
    teamPlaysError: 0,
    questionable: false,
    playedSnapRatio: 1,
    windProjectedCalm: false,
    last3Closer,
    tag: "usage",
  };
}

const baseSketch = {
  pos: "WR" as const,
  plays: 64,
  passRate: 0.58,
  rushRate: 0.42,
  qbShare: 1,
  carryShare: 0.02,
  snap: 0.85,
  ypc: 4,
  ypt: 8.2,
  tdPerRush: 0.03,
  tdPerTarget: 0.045,
  cmp: 0.65,
  sackRate: 0.06,
  explosive: 0.12,
  wind: 0,
  rain: false,
  windPassCut: 0.08,
  efficiencyRegress: 0.5,
};

describe("brain", () => {
  it("pays targets and first downs", () => {
    const high = scoreOffense(projectOffense({ ...baseSketch, targetShare: 0.28 }));
    const low = scoreOffense(projectOffense({ ...baseSketch, targetShare: 0.14 }));
    assert.ok(high > low + 1);
  });

  it("zeros an inactive", () => {
    const view = availabilityFrom({ status: "O" }, DEFAULT_WEIGHTS);
    assert.equal(view.snapMult, 0);
    const raw = {
      id: "x",
      name: "Out",
      pos: "WR" as const,
      team: "KC",
      bye: 14,
      adp12: 20,
      age: 25,
      rec: 90,
      usage: 80,
      consistency: 70,
      upside: 70,
      health: 100,
      sos: 50,
      trend: 50,
      matchup: 50,
      weekPpr: 14,
      rosPpr: 180,
      opp: "DEN",
      home: true,
      status: "O" as const,
    };
    assert.equal(projectFromRaw(raw, 4).points, 0);
  });

  it("does not take the retired weekly step", () => {
    const one = correctWeights([miss(4, 1)], DEFAULT_WEIGHTS);
    assert.equal(one.corrections.length, 0);
    const rows = [...Array.from({ length: 6 }, (_, i) => miss(3, i)), ...Array.from({ length: 6 }, (_, i) => miss(4, i))];
    const moved = correctWeights(rows, DEFAULT_WEIGHTS);
    assert.equal(moved.corrections.length, 0);
    assert.equal(moved.weights.usageLast3, 0.6);
    assert.equal(gridUsageLast3(() => 5, 0.6, 1).write, false);
    const adopted = gridUsageLast3((weight) => (weight === 0.75 ? 4 : 5), 0.6, 2);
    assert.equal(adopted.write, true);
    assert.equal(adopted.value, 0.75);
  });

  it("does not put an in-repo constant on the card", () => {
    const math = replay([{ actual: 10, brain: 10, baseline: 20 }]);
    assert.equal(math.brainOnCard, true);
    assert.equal(
      cardUsesBrain({
        source: "constant",
        origin: "repo",
        rows: [{ playerId: "a", week: 1, actual: 10, brain: 10, baseline: 20 }],
      }),
      false,
    );
    assert.equal(cardUsesBrain(), false);
    assert.equal(cardUsesBrain(REPLAY_RECORD as never), false);
    assert.equal(
      cardUsesBrain({
        source: "nflverse",
        origin: "job",
        season: 2026,
        locked: true,
        challenger: "B2",
        beatsB0: 1,
        beatsB1: 1,
        rows: [],
      }),
      false,
    );
    assert.equal(
      cardUsesBrain({
        source: "nflverse",
        origin: "job",
        season: 2025,
        locked: true,
        challenger: "B2",
        beatsB0: 0.3,
        beatsB1: -1,
        singleWeekOwns: false,
        singlePlayerOwns: false,
      }),
      true,
    );
    assert.equal(B1_DISABLED, true);
    assert.equal(PARITY.passed, true);
    assert.ok(PARITY.meanAbs <= 0.05);
    assert.ok(PARITY.maxAbs <= 0.25);
    assert.equal(cardUsesBrain(), false);
  });

  it("a usage correction changes the next target share", () => {
    const moved = { weights: { ...STORED_WEIGHTS, usageLast3: 0.8, usageSeason: 0.2 } };
    const receiver = {
      id: "x",
      name: "X",
      pos: "WR" as const,
      team: "KC",
      bye: 14,
      adp12: 20,
      age: 25,
      rec: 90,
      usage: 80,
      consistency: 70,
      upside: 70,
      health: 100,
      sos: 50,
      trend: 50,
      matchup: 50,
      weekPpr: 14,
      rosPpr: 180,
      opp: "DEN",
      home: true,
    };
    assert.equal(getWeights().usageLast3, STORED_WEIGHTS.usageLast3);
    const before = projectFromRaw(receiver, 4, STORED_WEIGHTS, { last3Target: 0.32, games: 4 }).features.usage.targetShare;
    const after = projectFromRaw(receiver, 4, moved.weights, { last3Target: 0.32, games: 4 }).features.usage.targetShare;
    assert.notEqual(before, after);
    assert.equal(getWeights().usageLast3, 0.6);
    const decision = commitDecision(GRADE_ROWS, STORED_WEIGHTS);
    assert.equal(decision.write, false);
    assert.equal(decision.weights.usageLast3, 0.6);
  });

  it("keeps the card shut and the rest-of-season shrink off", () => {
    assert.equal(cardUsesBrain(), false);
    assert.equal(TERCILE.publish276, false);
    assert.equal(TERCILE.mayeWeekly, 13.6);
    assert.equal(TERCILE.mayeThin, 176.8);
    assert.ok(TERCILE.terciles[0].gap < -1.5);
    assert.equal(TERCILE.weightForm.kept, false);
    assert.equal(TERCILE.weightForm.appliedThisWeek, false);
    assert.equal(WEEK5_LEDGER.locked, false);
    assert.equal(WEEK5_LEDGER.partial, false);
    assert.equal(WEEK5_LEDGER.slateAvailable, true);
    assert.ok(WEEK5_LEDGER.rows.length > 400);
    assert.equal(WEEK5_LEDGER.opensGate, false);
    assert.equal(WEEK5_LEDGER.frozenPlayerList, false);
    const debut = { playerId: "debut-qb", pos: "QB" as const, team: "NE", b0: 0, b2: 0, noTrail: true, bye: false, compare: false };
    const locked = lockWeek5Ledger([{ playerId: "debut-qb" }], [debut], "2026-10-08");
    assert.equal(locked.rows[0].noTrail, true);
    assert.equal(locked.opensGate, false);
    assert.throws(() => lockWeek5Ledger([{ playerId: "a" }, { playerId: "b" }], [debut], "2026-10-08"));
    assert.throws(() => editLockedLedger());
    assert.equal(PLAYED_ONLY.onCard, false);
    assert.equal(PLAYED_ONLY.terciles[0].nonPersistent, true);
    assert.equal(QB_STARTS.recipe.includes("not the recipe"), true);
    assert.equal(QB_STARTS.opensGate, false);
    assert.equal(QB_STARTS.secondQuarterback, 20);
    const flips = syntheticFlips([{ id: "a", pos: "RB", b0: 20, b2: 8 }, { id: "b", pos: "RB", b0: 8, b2: 20 }]);
    assert.equal(flips.opensGate, false);
    assert.equal(flipOpensGate(), false);
    assert.equal(STORED_WEIGHTS.usageLast3, 0.6);
  });

  it("fills flex on raw expected points", () => {
    const player = (id: string, pos: PlayerState["pos"], ePts: number, p20: number): PlayerState =>
      ({ id, pos, status: "Active", weekly: { ePts, p20, p50: ePts, p80: ePts } }) as PlayerState;
    const lineup = optimalLineup(
      [
        player("qb", "QB", 18, 18),
        player("rb1", "RB", 16, 16),
        player("rb2", "RB", 15, 15),
        player("wr1", "WR", 14, 14),
        player("wr2", "WR", 13, 13),
        player("wr3", "WR", 12, 12),
        player("te", "TE", 9, 9),
        player("flex-wr", "WR", 11, 14),
        player("flex-rb", "RB", 17, 4),
        player("dst", "DST", 6, 6),
      ],
      [],
      "favorite",
    );
    assert.equal(lineup.starters.find((seat) => seat.slot === "FLEX")?.player?.id, "flex-rb");
    assert.equal(lineup.starters.find((seat) => seat.slot === "RB")?.player?.id, "rb1");
  });

  it("does not grade a trade on the rest-of-season number", () => {
    const player = (id: string, ePts: number, scored: number, ros = 176.8): PlayerState =>
      ({
        id,
        name: id,
        pos: "WR",
        trail: "full",
        scoredWeeks: scored,
        status: "Active",
        weekly: { ePts, p20: ePts, p50: ePts, p80: ePts },
        ros: { ePts: ros, p20: ros, p50: ros, p80: ros, weeksLeft: 13 },
        rosVor: ros,
      }) as PlayerState;
    const club = (id: number, roster: string[]): Team =>
      ({ id, roster, ir: [], pf: 0, name: "t", abbrev: "T", owner: "o", isYou: false, draftSlot: 1, record: { w: 0, l: 0, t: 0 }, pa: 0, draft: {}, keepers: [], keeperCost: {}, projectedKeepers: [], waivers: 1 }) as Team;
    const mine = new Map<string, PlayerState>([
      ["mine", player("mine", 10, 4)],
      ["theirs", player("theirs", 20, 4, 176.8)],
    ]);
    const first = evaluateTrade(club(1, ["mine"]), club(2, ["theirs"]), mine, ["mine"], ["theirs"], "tossup");
    mine.set("theirs", player("theirs", 20, 4, 0));
    const stripped = evaluateTrade(club(1, ["mine"]), club(2, ["theirs"]), mine, ["mine"], ["theirs"], "tossup");
    assert.equal(first.letter, stripped.letter);
    assert.equal(first.verdict, stripped.verdict);
    assert.equal(first.weekYou, stripped.weekYou);
    assert.equal(first.verdict, "Accept");
    assert.equal(first.why.includes("176.8"), false);
    const thin = new Map<string, PlayerState>([
      ["mine", player("mine", 10, 3)],
      ["theirs", player("theirs", 20, 4)],
    ]);
    const sample = evaluateTrade(club(1, ["mine"]), club(2, ["theirs"]), thin, ["mine"], ["theirs"], "tossup");
    assert.equal(sample.thinSample, true);
    assert.equal(sample.verdict, "Coin-flip");
    assert.equal(sample.why.includes("THIN SAMPLE"), true);
    const bye = new Map<string, PlayerState>([
      ["elite", { ...player("elite", 28, 4), status: "Bye", bye: 4 } as PlayerState],
      ["scrub", player("scrub", 14, 4)],
    ]);
    const conflict = evaluateTrade(club(1, ["elite"]), club(2, ["scrub"]), bye, ["elite"], ["scrub"], "tossup");
    assert.equal(conflict.byeConflict, true);
    assert.notEqual(conflict.verdict, "Accept");
    assert.equal(conflict.weekYou, 0);
    assert.equal(conflict.why.includes("CURRENT WEEK BYE CONFLICT"), true);
    assert.equal(conflict.why.includes("176.8"), false);
  });

  it("keeps the live week off the gate", () => {
    assert.equal(cardUsesBrain(), false);
    assert.equal(STORED_WEIGHTS.usageLast3, 0.6);
    assert.equal(WEEK5_LEDGER.id, "W5_PRELOCK_DRAFT_2026-10-04");
    assert.equal(WEEK5_LEDGER.locked, false);
    assert.equal(WEEK5_LEDGER.rows.length, 461);
    assert.ok(WEEK5_LEDGER.rows.every((row) => row.codeHash === SCORER_HASH));
    assert.equal(MONDAY_CONFIRMATION.opensGate, false);
    assert.equal(MONDAY_CONFIRMATION.contaminated, true);
    assert.equal(MONDAY_CONFIRMATION.week5Rows, 0);
    assert.equal(MONDAY_CONFIRMATION.label.includes("DOES NOT OPEN GATE"), true);
    assert.equal(TUESDAY_FINAL.overwritesMonday, false);
    assert.equal(TUESDAY_FINAL.includesMondayNight, false);
    assert.equal(TUESDAY_FINAL.final, false);
    assert.equal(WEEK5_PRELIM.ready, false);
    assert.equal(WEEK5_PRELIM.usesSundayDraft, false);
    assert.equal(ROSTER_AUDIT.sizeSetting, 11);
    assert.equal(ROSTER_AUDIT.flipRan, false);
    assert.equal(ROSTER_AUDIT.inactiveTeams, 0);
    assert.equal(ROSTER_AUDIT.emptyRosters, 0);
    assert.equal(QB_STARTS.flipRan, false);
    assert.equal(QB_STARTS.useAsRecipe, false);
    const err = confirmationError([
      { playerId: "bye", bye: true, played: false, projected: 10, actual: 0, kick: "sunday" },
      { playerId: "sit", bye: false, played: false, projected: 10, actual: 0, kick: "sunday" },
      { playerId: "play", bye: false, played: true, projected: 10, actual: 12, kick: "sunday" },
    ]);
    assert.equal(err.opensGate, false);
    assert.equal(err.byesLeftOut, 1);
    assert.equal(err.errorRows, 1);
    assert.equal(err.mae, 2);
    assert.equal(err.didNotPlay[0]?.modelMiss, false);
    const waiting = buildTuesdayFinal(MONDAY_CONFIRMATION.id, []);
    assert.equal(waiting.final, false);
    assert.equal(waiting.overwritesMonday, false);
    const done = buildTuesdayFinal(MONDAY_CONFIRMATION.id, [
      { playerId: "mnf", bye: false, played: true, projected: 8, actual: 9, kick: "monday" },
    ]);
    assert.equal(done.final, true);
    assert.equal(done.includesMondayNight, true);
    assert.equal(done.mondayFile, MONDAY_CONFIRMATION.id);
    assert.throws(() => buildWeek5Prelim(false, false, []));
    const row = { playerId: "a", pos: "WR" as const, team: "KC", b0: 12, bye: false, noTrail: false, scoredWeeks: 4, spread: null, total: null };
    assert.equal(pricePrelimRow(row).price, 12);
    assert.equal(pricePrelimRow({ ...row, spread: -3, total: 47 }).price, 12);
    assert.equal(pricePrelimRow({ ...row, bye: true }).price, 0);
    const debutPrice = pricePrelimRow({ ...row, noTrail: true, b0: 0, scoredWeeks: 0 });
    assert.equal(debutPrice.canStart, false);
    assert.equal(debutPrice.bucket, "speculative");
    const debut = { id: "debut", pos: "QB", status: "Active", trail: "none", weekly: { ePts: 40, p20: 40, p50: 40, p80: 40 } } as PlayerState;
    const real = { id: "real", pos: "QB", status: "Active", trail: "full", weekly: { ePts: 10, p20: 10, p50: 10, p80: 10 } } as PlayerState;
    assert.equal(optimalLineup([debut, real], [], "tossup").starters.find((seat) => seat.slot === "QB")?.player?.id, "real");
    assert.equal(optimalLineup([debut], [], "tossup").starters.find((seat) => seat.slot === "QB")?.player ?? null, null);
    const slate = [{ playerId: "a" }];
    const body = [{ playerId: "a", pos: "WR" as const, team: "KC", b0: 9, b2: 8, noTrail: false, bye: false, compare: true, scoredWeeks: 2 }];
    const locked = lockGameWindow({ window: "thursday", slate, rows: body, now: "2026-10-08T19:00:00-04:00", availabilitySource: "espn-on-disk" });
    assert.equal(locked.weight, 0.6);
    assert.ok(locked.rows.every((line) => line.codeHash === SCORER_HASH));
    assert.equal(locked.playerListFrozen, false);
    assert.equal(locked.rows[0]?.thinSample, true);
    const projection = locked.rows[0]?.b0;
    const withStatus = addStatusRow(locked, { playerId: "a", status: "O", at: "2026-10-08T18:00:00-04:00" });
    assert.equal(withStatus.rows[0]?.b0, projection);
    assert.equal(withStatus.statusRows.length, 1);
    assert.throws(() => lockGameWindow({ window: "thursday", slate, rows: body, now: "later", availabilitySource: "espn-on-disk", alreadyLocked: true }));
    assert.throws(() => lockGameWindow({ window: "sunday-early", slate: [{ playerId: "a" }, { playerId: "b" }], rows: body, now: "x", availabilitySource: "espn-on-disk" }));
    assert.throws(() => fillPopulationPrior({ thinSample: true }));
    const out = { id: "out", name: "Out", pos: "WR", status: "O", trail: "full", weekly: { ePts: 1, p20: 1, p50: 1, p80: 1 } } as PlayerState;
    const next = { id: "next", name: "Next", pos: "WR", status: "Active", trail: "full", weekly: { ePts: 11, p20: 11, p50: 11, p80: 11 } } as PlayerState;
    const swap = inactiveSwaps([out, next], [{ id: "out", slot: "WR" }]);
    assert.equal(swap[0]?.start.id, "next");
    assert.equal(swap[0]?.b0, 11);
  });

  it("does not let rest of season move a claim, and does not clear the Monday stamp", () => {
    const player = (id: string, ePts: number, ros: number): PlayerState =>
      ({
        id,
        name: id,
        pos: "WR",
        nflTeam: "KC",
        bye: 14,
        status: "Active",
        trail: "full",
        source: "counting",
        adp12: 40,
        undroppable: false,
        weekly: { ePts, p20: ePts, p50: ePts, p80: ePts },
        ros: { ePts: ros, p20: ros, p50: ros, p80: ros, weeksLeft: 13 },
        rosVor: ros,
        adjVor: ros,
      }) as PlayerState;
    const club = (roster: string[]): Team =>
      ({ id: 1, roster, ir: [], waivers: 5, pf: 0, name: "t", abbrev: "T", owner: "o", isYou: true, draftSlot: 1, record: { w: 0, l: 0, t: 0 }, pa: 0, draft: {}, keepers: [], keeperCost: {}, projectedKeepers: [] }) as Team;
    const league = {
      id: "x",
      name: "x",
      season: 2026,
      week: 4,
      teams: [club(["mine"])],
      matchups: [],
      source: "seed",
      espnLeagueId: "x",
      lastUpdated: null,
      stale: false,
      keepersLocked: true,
      activity: [],
      freeAgents: [
        { name: "low-week", pos: "WR", nfl: "KC", owned: 5, waiver: true },
        { name: "high-week", pos: "WR", nfl: "KC", owned: 5, waiver: true },
        { name: "loss-dst", pos: "DST", nfl: "JAC", owned: 5, waiver: true },
      ],
    } as League;
    const rank = (rosLow: number, rosHigh: number) => {
      const loss = player("loss-dst", -8, 40);
      loss.pos = "DST";
      const map = new Map<string, PlayerState>([
        ["mine", player("mine", 10, 40)],
        ["low-week", player("low-week", 8, rosLow)],
        ["high-week", player("high-week", 16, rosHigh)],
        ["loss-dst", loss],
      ]);
      return waiverTargets(club(["mine"]), league, map, "tossup");
    };
    const withSeason = rank(400, 10).map((claim) => `${claim.player.id}:${claim.claimValue}`).join("|");
    const withoutSeason = rank(0, 0).map((claim) => `${claim.player.id}:${claim.claimValue}`).join("|");
    assert.equal(withSeason, withoutSeason);
    assert.equal(withSeason.startsWith("high-week"), true);
    assert.equal(rank(400, 10).some((claim) => claim.claimValue < 0 || claim.player.id === "loss-dst"), false);
    assert.equal(CLAIM_SORT.restOfSeason, 0);
    assert.equal(CLAIM_MULTIPLIER, 1);
    assert.equal(CLAIM_SORT.multiplier, 1);
    const wide = [
      { id: "sixteen", points: 16, priority: 99 },
      { id: "eight", points: 8, priority: 1 },
    ];
    assert.equal(rankClaimPoints(wide, 1)[0]?.id, "sixteen");
    assert.equal(rankClaimPoints(wide, 1)[0]?.points, 16);
    assert.equal(
      rankClaimPoints(wide, 1).map((row) => row.id).join(),
      rankClaimPoints(wide, CLAIM_MULTIPLIER).map((row) => row.id).join(),
    );
    assert.ok(compareClaims({ points: 8, priority: 1 }, { points: 16, priority: 99 }) > 0);
    assert.ok(compareClaims({ points: 10, priority: 10 }, { points: 9.2, priority: 1 }) > 0);
    assert.equal(MONDAY_CONFIRMATION.contaminated, true);
    assert.equal(MONDAY_CONFIRMATION.actualsOnDisk, 0);
    assert.equal(MONDAY_CONFIRMATION.scored.length, 0);
    const scored = scoreSundayConfirmation([
      { playerId: "played", bye: false, played: true, projected: 10, actual: 12, kick: "sunday" },
    ]);
    assert.equal(scored.contaminated, true);
    assert.equal(scored.opensGate, false);
    assert.equal(scored.week5Rows, 0);
    assert.equal(scored.tuned, false);
    assert.equal(WEEK5_PRELIM.rows.length, 0);
    assert.equal(WEEK5_PRELIM.ready, false);
    assert.equal(THURSDAY_FREEZE.captured, false);
    assert.equal(THURSDAY_FREEZE.notACapture, true);
    assert.equal(THURSDAY_FREEZE.inactiveList, null);
    assert.throws(() => storeThursdayInactives(Date.parse("2026-10-04T05:57:00-04:00"), [], "pre-kickoff"));
    assert.throws(() => storeThursdayInactives(THURSDAY_KICK - 90 * 60 * 1000, [{ playerId: "a", status: "O" }], "player-status-on-disk"));
    const stored = storeThursdayInactives(THURSDAY_KICK - 90 * 60 * 1000, [{ playerId: "a", status: "O" }], "pre-kickoff");
    assert.equal(stored.captured, true);
    assert.equal(stored.writtenIntoSundayFreeze, false);
    assert.equal(THURSDAY_FREEZE.captured, false);
  });
});

import { readFileSync, writeFileSync } from "node:fs";
import { ESPN_SNAPSHOT } from "../src/lib/fantasy/espn-snapshot";
import { PLAYERS } from "../src/lib/fantasy/players";
import { projectOffense, scoreDst, scoreOffense } from "../src/lib/fantasy/scoring";
import { environmentFrom } from "../src/lib/fantasy/brain/environment";
import { assignTag } from "../src/lib/fantasy/brain/grade";
import { DEFAULT_WEIGHTS } from "../src/lib/fantasy/brain/weights";
import { SLATE } from "../src/lib/fantasy/brain/stored/slate";
import { slugify } from "../src/lib/utils";
import type { CountStats, DstStats, Pos } from "../src/lib/fantasy/types";

interface WeekRow {
  stats: CountStats;
  targets: number;
  carries: number;
  attempts: number;
  snap: number | null;
  air?: number;
}
interface Ident {
  gsis: string;
  name: string;
  pos: Pos;
  team: string;
  weeks: Record<string, WeekRow>;
}
interface DstIdent {
  id: string;
  team: string;
  week: number;
  stats: DstStats;
}

const pack = JSON.parse(readFileSync("/tmp/nfl/identity.json", "utf8")) as {
  players: Ident[];
  dst: DstIdent[];
  scoredTeams: Record<string, string[]>;
};
const feeds = JSON.parse(readFileSync("/tmp/nfl/feeds.json", "utf8")) as {
  redZone: Record<string, { redZone: number | null; goalLine: number | null }>;
  injuries: { name: string; pos: string; team: string; status: string; role: string | null }[];
  weather: Record<string, { dome: boolean; wind: string | null; rain: boolean | null; reason: string }>;
  routesReason: string;
};

function norm(value: string) {
  return value
    .toLowerCase()
    .replace(/[.'’]/g, "")
    .replace(/\b(jr|sr|iii|ii|iv)\b/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

const scored = new Map<string, Map<number, number>>();
const teamWeek = new Map<string, Map<number, { att: number; car: number; points: number }>>();
function teamBucket(team: string, week: number) {
  const byTeam = teamWeek.get(team) ?? new Map();
  teamWeek.set(team, byTeam);
  const row = byTeam.get(week) ?? { att: 0, car: 0, points: 0 };
  byTeam.set(week, row);
  return row;
}

for (const player of pack.players) {
  const map = new Map<number, number>();
  for (const [weekKey, row] of Object.entries(player.weeks)) {
    const week = Number(weekKey);
    const points = scoreOffense(row.stats);
    map.set(week, Math.round(points * 10) / 10);
    const bucket = teamBucket(player.team, week);
    bucket.att += row.attempts;
    bucket.car += row.carries;
    bucket.points += points;
  }
  scored.set(player.gsis, map);
}
const dstPoints = new Map<string, Map<number, number>>();
for (const row of pack.dst) {
  const map = dstPoints.get(row.id) ?? new Map();
  map.set(row.week, Math.round(scoreDst(row.stats) * 10) / 10);
  dstPoints.set(row.id, map);
}

const byKey = new Map<string, Ident[]>();
const byName = new Map<string, Ident[]>();
for (const player of pack.players) {
  const key = `${norm(player.name)}|${player.pos}|${player.team}`;
  byKey.set(key, [...(byKey.get(key) ?? []), player]);
  const name = `${norm(player.name)}|${player.pos}`;
  byName.set(name, [...(byName.get(name) ?? []), player]);
}

function matchSkill(name: string, pos: Pos, team: string) {
  const aliased = norm(name) === "hollywood brown" ? "Marquise Brown" : name;
  const exact = byKey.get(`${norm(aliased)}|${pos}|${team}`) ?? [];
  if (exact.length === 1) return exact[0];
  const loose = byName.get(`${norm(aliased)}|${pos}`) ?? [];
  if (loose.length === 1) return loose[0];
  return loose.find((row) => row.team === team) ?? null;
}

function lastActuals(_team: string, weeks: Map<number, number>) {
  const done = [...weeks.entries()]
    .filter(([week]) => week >= 1 && week <= 3)
    .sort((a, b) => a[0] - b[0])
    .map(([, points]) => points);
  return done.slice(-3);
}

function teamPace(team: string) {
  const weeks = [1, 2, 3].map((week) => teamWeek.get(team)?.get(week)).filter((row): row is { att: number; car: number; points: number } => Boolean(row));
  if (!weeks.length) return null;
  return weeks.reduce((sum, row) => sum + row.att + row.car, 0) / weeks.length;
}

function windMph(text: string | null) {
  if (!text) return null;
  const nums = [...text.matchAll(/(\d+)/g)].map((match) => Number(match[1]));
  return nums.length ? Math.max(...nums) : null;
}

const trails: Record<string, { gsis: string | null; points: number[]; reason: string }> = {};
const shadows: Record<string, { usage: string; script: string; weather: string; opponent: string; brain: string }> = {};
let missed = 0;

function priorShares(player: Ident) {
  let targets = 0;
  let carries = 0;
  let att = 0;
  let car = 0;
  const snaps: number[] = [];
  const shares: number[] = [];
  for (const week of [1, 2, 3]) {
    const row = player.weeks[String(week)];
    if (!row) continue;
    const bucket = teamWeek.get(player.team)?.get(week);
    targets += row.targets;
    carries += row.carries;
    att += bucket?.att ?? 0;
    car += bucket?.car ?? 0;
    if (row.snap != null) snaps.push(row.snap);
    if (bucket && bucket.att > 0) shares.push(row.targets / bucket.att);
  }
  const games = [1, 2, 3].filter((week) => player.weeks[String(week)]).length;
  return {
    games,
    targetShare: att ? targets / att : 0,
    carryShare: car ? carries / car : 0,
    snap: snaps.length ? snaps.reduce((s, n) => s + n, 0) / snaps.length : null,
    last3Target: games >= 3 ? shares.slice(-3).reduce((s, n) => s + n, 0) / shares.length : null,
    seasonTarget: att ? targets / att : null,
  };
}

const YPT = { QB: 7.4, RB: 6.4, WR: 8.1, TE: 7.2 } as const;
const TD_TARGET = { QB: 0.048, RB: 0.03, WR: 0.045, TE: 0.05 } as const;
const rzValues = Object.values(feeds.redZone).map((row) => row.redZone).filter((value): value is number => value != null);
const glValues = Object.values(feeds.redZone).map((row) => row.goalLine).filter((value): value is number => value != null);
const rzMean = rzValues.length ? rzValues.reduce((sum, value) => sum + value, 0) / rzValues.length : null;
const glMean = glValues.length ? glValues.reduce((sum, value) => sum + value, 0) / glValues.length : null;
const ROUTES = "Missing: https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_2026.csv returned 404. The parquet file returned 404. Routes were not invented from snaps.";

function scaleTd(rate: number, gsis: string) {
  const zone = feeds.redZone[gsis];
  if (!zone || (zone.redZone == null && zone.goalLine == null) || rzMean == null) return rate;
  let lift = 1;
  if (zone.redZone != null) lift += zone.redZone - rzMean;
  if (zone.goalLine != null && glMean != null) lift += zone.goalLine - glMean;
  return rate * Math.min(1.5, Math.max(0.6, lift));
}

function ratesFor(player: Ident) {
  const rows = [1, 2, 3].map((week) => player.weeks[String(week)]).filter((row): row is WeekRow => Boolean(row));
  const games = rows.length;
  const toward = games >= 3 ? 0.5 : games === 2 ? 0.65 : 0.8;
  const sum = rows.reduce(
    (total, row) => ({
      ry: total.ry + row.stats.ry,
      ra: total.ra + row.stats.ra,
      rey: total.rey + row.stats.rey,
      ret: total.ret + row.stats.ret,
      py: total.py + row.stats.py,
      pc: total.pc + row.stats.pc,
      att: total.att + row.attempts,
      sk: total.sk + row.stats.sk,
      rtd: total.rtd + row.stats.rtd,
      retd: total.retd + row.stats.retd,
      ptd: total.ptd + row.stats.ptd,
      air: total.air + (row.air ?? 0),
      airWeeks: total.airWeeks + (row.air == null ? 0 : 1),
    }),
    { ry: 0, ra: 0, rey: 0, ret: 0, py: 0, pc: 0, att: 0, sk: 0, rtd: 0, retd: 0, ptd: 0, air: 0, airWeeks: 0 },
  );
  const yptMean = YPT[player.pos as keyof typeof YPT] ?? 8.1;
  const tdMean = TD_TARGET[player.pos as keyof typeof TD_TARGET] ?? 0.045;
  const airDen = player.pos === "QB" ? sum.att : sum.ret;
  return {
    games,
    toward,
    ypc: sum.ra ? sum.ry / sum.ra : 4.2,
    ypt: player.pos === "QB" ? (sum.pc ? sum.py / sum.pc : yptMean) : sum.ret ? sum.rey / sum.ret : yptMean,
    cmp: sum.att ? sum.pc / sum.att : 0.645,
    sack: sum.att + sum.sk ? sum.sk / (sum.att + sum.sk) : 0.065,
    tdRush: scaleTd(sum.ra ? sum.rtd / sum.ra : 0.04, player.gsis),
    tdTarget: scaleTd(player.pos === "QB" ? (sum.att ? sum.ptd / sum.att : tdMean) : sum.ret ? sum.retd / sum.ret : tdMean, player.gsis),
    airYpt: sum.airWeeks && airDen ? sum.air / airDen : null,
    attempts: sum.att,
    sacks: sum.sk,
  };
}

function backupVolume(team: string) {
  const qbs = pack.players
    .filter((row) => row.team === team && row.pos === "QB")
    .map((row) => ({ row, rates: ratesFor(row) }))
    .sort((a, b) => b.rates.attempts - a.rates.attempts);
  const starter = qbs[0];
  if (!starter) return null;
  const starterOut = feeds.injuries.some((row) => row.team === team && row.status === "Out" && norm(row.name) === norm(starter.row.name));
  if (!starterOut) return null;
  const backup = qbs.slice(1).find((row) => row.rates.attempts > 0 && row.rates.games > 0);
  if (!backup) return { attempts: null as number | null, sack: null as number | null, note: `${starter.row.name} is Out. No backup prior. Shadow points did not move.` };
  const perGame = backup.rates.attempts / backup.rates.games;
  return {
    attempts: perGame,
    sack: backup.rates.sack,
    note: `Backup ${backup.row.name}: ${perGame.toFixed(1)} attempts per game, sack rate ${backup.rates.sack.toFixed(2)}. Shadow points moved. Not in the score.`,
  };
}

function shadowFor(id: string, player: Ident | null, pos: Pos, team: string) {
  const slate = SLATE[team]?.["4"];
  const playedThursday = (pack.scoredTeams["4"] ?? []).includes(team);
  const pace = teamPace(team);
  const stadium = slate?.home ? team : slate?.opp;
  const forecast = stadium ? feeds.weather[stadium] : undefined;
  const wind = playedThursday || !forecast || forecast.dome ? null : windMph(forecast.wind);
  const env = environmentFrom(
    { spread: slate?.spread ?? null, total: slate?.total ?? null, pace, wind, rain: forecast?.rain === true, dome: forecast?.dome },
    DEFAULT_WEIGHTS,
  );
  const prior = player ? priorShares(player) : null;
  const zone = player ? feeds.redZone[player.gsis] : undefined;
  const outNames = new Set(feeds.injuries.filter((row) => row.team === team && row.status === "Out").map((row) => norm(row.name)));
  let targetShare = prior?.targetShare ?? 0;
  let chemistry = "";
  if (prior && pos === "WR") {
    const mates = pack.players.filter((row) => row.team === team && row.pos === "WR").map((row) => ({ row, share: priorShares(row).targetShare })).sort((a, b) => b.share - a.share);
    const leader = mates[0];
    if (leader && outNames.has(norm(leader.row.name)) && leader.row.gsis !== player.gsis) {
      const others = mates.filter((row) => row.row.gsis !== leader.row.gsis);
      const rest = others.reduce((sum, row) => sum + row.share, 0);
      const mine = others.find((row) => row.row.gsis === player.gsis)?.share ?? 0;
      if (rest > 0) {
        targetShare = mine + leader.share * (mine / rest);
        chemistry = ` WR1 ${leader.row.name} is Out. Shadow target share ${Math.round(mine * 100)}% to ${Math.round(targetShare * 100)}%. Not in the score.`;
      }
    }
  }
  const starterNote = backupVolume(team);
  let brain = "No prior games. Not in the score.";
  if (prior && prior.games > 0 && pos !== "DST") {
    if (prior.snap == null || pace == null) {
      brain = `${prior.snap == null ? "Snap share missing." : "Team pace missing."} Shadow points not priced. Not in the score.`;
    } else {
      const rates = ratesFor(player);
      const stats = projectOffense({
        pos: pos as "QB" | "RB" | "WR" | "TE",
        plays: pace,
        passRate: env.passRate,
        rushRate: env.rushRate,
        qbShare: pos === "QB" ? 0.98 : 1,
        carryShare: pos === "QB" ? Math.min(0.2, prior.carryShare) : prior.carryShare,
        targetShare: pos === "QB" ? 0 : targetShare,
        snap: prior.snap,
        ypc: rates.ypc,
        ypt: rates.ypt,
        tdPerRush: rates.tdRush,
        tdPerTarget: rates.tdTarget,
        cmp: rates.cmp,
        sackRate: starterNote?.sack ?? rates.sack,
        explosive: 0,
        airYpt: rates.airYpt,
        attempts: pos === "QB" || pos === "DST" ? null : starterNote?.attempts,
        wind,
        rain: forecast?.rain === true,
        windPassCut: DEFAULT_WEIGHTS.windPassCut,
        efficiencyRegress: rates.toward,
      });
      const note = !starterNote ? "" : starterNote.attempts == null || (pos !== "QB" && pos !== "DST") ? ` ${starterNote.note}` : "";
      brain = `${scoreOffense(stats).toFixed(1)} from weeks 1-3 rates. Not in the score.${chemistry}${note}`;
    }
  }
  const usage = prior
    ? `Snap ${prior.snap == null ? "missing from snap counts" : `${Math.round(prior.snap * 100)}%`}. Targets ${Math.round((prior.targetShare) * 100)}%. Carries ${Math.round(prior.carryShare * 100)}%. ${ROUTES} Red zone ${zone?.redZone == null ? "missing from play-by-play" : `${Math.round(zone.redZone * 100)}%`}. Goal line ${zone?.goalLine == null ? "missing from play-by-play" : `${Math.round(zone.goalLine * 100)}%`}. Last 3 ${prior.last3Target == null ? "thin, fewer than 3 games" : `${Math.round(prior.last3Target * 100)}%`}.${chemistry}${starterNote ? ` ${starterNote.note}` : ""}`
    : "Missing: no 2026 skill row in nflverse weekly stats. Not in the score.";
  const script = !slate
    ? "Missing: no week-4 slate row."
    : `Spread ${slate.spread ?? "missing"}. Total ${slate.total ?? "missing"}. Implied ${env.implied == null ? "missing" : env.implied.toFixed(1)}. Pace ${pace == null ? "missing" : pace.toFixed(1)}.`;
  const oppOuts = feeds.injuries.filter((row) => row.team === slate?.opp && row.status === "Out" && row.role);
  shadows[id] = {
    usage,
    script,
    weather: playedThursday
      ? "Missing: Thursday wind was not stored before kickoff. Not in the score."
      : forecast
        ? `${forecast.reason} Not in the score.`
        : "Missing: NWS forecast was not returned for this stadium. Not in the score.",
    opponent: oppOuts.length
      ? `${oppOuts.map((row) => `${row.name} ${row.pos} Out (${row.role})`).join("; ")}. Practice participation is not in the ESPN injury feed. Not in the score.`
      : "No opposing shadow corner, tackle, or interior defender listed Out. Practice participation is not in the ESPN injury feed. Not in the score.",
    brain,
  };
}

for (const player of PLAYERS) {
  if (player.pos === "DST") {
    const map = dstPoints.get(player.id);
    const points = map ? lastActuals(player.team, map) : [];
    trails[player.id] = { gsis: map ? player.id : null, points, reason: map ? "joined" : "NO TRAIL. No 2026 skill row. Off the start list." };
    if (!map) missed += 1;
    shadowFor(player.id, null, "DST", player.team);
    continue;
  }
  const hit = matchSkill(player.name, player.pos, player.team);
  if (!hit) {
    missed += 1;
    trails[player.id] = { gsis: null, points: [], reason: "NO TRAIL. No 2026 skill row. Off the start list." };
    shadowFor(player.id, null, player.pos, player.team);
    continue;
  }
  trails[player.id] = { gsis: hit.gsis, points: lastActuals(hit.team, scored.get(hit.gsis) ?? new Map()), reason: norm(player.name) === "hollywood brown" ? "joined as Marquise Brown" : "joined" };
  shadowFor(player.id, hit, player.pos, hit.team);
}

const offenseRank = [...teamWeek.entries()]
  .map(([team, weeks]) => {
    const vals = [1, 2, 3].map((week) => weeks.get(week)?.points ?? 0);
    return { team, points: vals.reduce((s, n) => s + n, 0) / 3 };
  })
  .sort((a, b) => a.points - b.points);
const bottom5 = new Set(offenseRank.slice(0, 5).map((row) => row.team));

const allowed = new Map<string, number[]>();
for (const player of pack.players) {
  for (const [weekKey, row] of Object.entries(player.weeks)) {
    const week = Number(weekKey);
    if (week > 3) continue;
    const slate = SLATE[player.team]?.[String(week)];
    if (!slate || bottom5.has(player.team)) continue;
    const points = scored.get(player.gsis)?.get(week);
    if (points == null) continue;
    const key = `${slate.opp}|${player.pos}`;
    allowed.set(key, [...(allowed.get(key) ?? []), points]);
  }
}
for (const [id, shadow] of Object.entries(shadows)) {
  const trail = trails[id];
  const player = PLAYERS.find((row) => row.id === id);
  if (!player || player.pos === "DST") continue;
  const slate = SLATE[player.team]?.["4"];
  const samples = slate ? allowed.get(`${slate.opp}|${player.pos}`) : null;
  if (samples?.length) {
    const mean = samples.reduce((s, n) => s + n, 0) / samples.length;
    shadow.opponent = `${player.pos} points allowed ${mean.toFixed(1)} after dropping bottom-5 offenses. Opponent injury feed missing. Not in the score.`;
  }
}

const freeze: {
  leagueId: string;
  playerId: string;
  opponent: string;
  projected: CountStats | DstStats;
  floor: number;
  expected: number;
  ceiling: number;
  decision: "start" | "sit";
  reason: string;
  weightVersion: string;
}[] = [];
const grades: {
  leagueId: string;
  week: number;
  slot: "sun";
  playerId: string;
  pos: Pos;
  projected: CountStats | DstStats;
  actualPoints: number;
  ePts: number | null;
  baseline: number;
  p20: number;
  p80: number;
  projectedTargets: number;
  actualTargets: number;
  projectedCarries: number;
  actualCarries: number;
  teamPlaysError: number;
  questionable: boolean;
  playedSnapRatio: number | null;
  windProjectedCalm: boolean | null;
  leagueIds: string[];
  tag: "usage" | "script" | "injury" | "weather" | "touchdown variance" | "unknown";
}[] = [];

function rangeOf(points: number[]) {
  if (!points.length) return null;
  const floor = Math.min(...points);
  const ceiling = Math.max(...points);
  const expected = points.reduce((s, n) => s + n, 0) / points.length;
  return { floor, expected, ceiling };
}

function projectRow(player: Ident | null, pos: Pos): { stats: CountStats | DstStats; priced: boolean } {
  const empty = { sack: 0, int: 0, fr: 0, ff: 0, safety: 0, td: 0, block: 0, tw: 0, pa: 0, ya: 0 };
  if (!player || pos === "DST") return { stats: empty, priced: false };
  const prior = priorShares(player);
  const pace = teamPace(player.team);
  const slate = SLATE[player.team]?.["4"];
  const playedThursday = (pack.scoredTeams["4"] ?? []).includes(player.team);
  const stadium = slate?.home ? player.team : slate?.opp;
  const forecast = stadium ? feeds.weather[stadium] : undefined;
  const wind = playedThursday || !forecast || forecast.dome ? null : windMph(forecast.wind);
  const env = environmentFrom({ spread: slate?.spread ?? null, total: slate?.total ?? null, pace, wind, rain: forecast?.rain === true, dome: forecast?.dome }, DEFAULT_WEIGHTS);
  if (!prior.games || prior.snap == null || pace == null) {
    return { stats: { py: 0, pc: 0, inc: 0, ptd: 0, ptd50: 0, pfd: 0, int: 0, p2: 0, p300: 0, p400: 0, sk: 0, ry: 0, ra: 0, rtd: 0, rtd50: 0, rfd: 0, r2: 0, ry100: 0, ry200: 0, rey: 0, rec: 0, retd: 0, retd50: 0, refd: 0, rec2: 0, rey100: 0, rey200: 0, ret: 0, fuml: 0 }, priced: false };
  }
  const rates = ratesFor(player);
  return {
    priced: true,
    stats: projectOffense({
      pos: pos as "QB" | "RB" | "WR" | "TE",
      plays: pace,
      passRate: env.passRate,
      rushRate: env.rushRate,
      qbShare: pos === "QB" ? 0.98 : 1,
      carryShare: pos === "QB" ? Math.min(0.2, prior.carryShare) : prior.carryShare,
      targetShare: pos === "QB" ? 0 : prior.targetShare,
      snap: prior.snap,
      ypc: rates.ypc,
      ypt: rates.ypt,
      tdPerRush: rates.tdRush,
      tdPerTarget: rates.tdTarget,
      cmp: rates.cmp,
      sackRate: rates.sack,
      explosive: 0,
      airYpt: rates.airYpt,
      attempts: null,
      wind,
      rain: false,
      windPassCut: DEFAULT_WEIGHTS.windPassCut,
      efficiencyRegress: rates.toward,
    }),
  };
}

for (const league of ESPN_SNAPSHOT) {
  for (const club of league.teams) {
    const rows = club.players.map((player) => {
      const id = slugify(player.name);
      const pool = PLAYERS.find((row) => row.id === id) ?? matchSkill(player.name, player.pos, player.nfl);
      const trail = trails[id] ?? (pool && "id" in pool ? trails[pool.id] : undefined);
      const ident = pack.players.find((row) => row.gsis === trail?.gsis) ?? matchSkill(player.name, player.pos, player.nfl);
      const points = trail?.points ?? (ident ? lastActuals(ident.team, scored.get(ident.gsis) ?? new Map()) : []);
      const span = rangeOf(points);
      return { id, pos: player.pos, team: player.nfl, out: player.ir, span, ident, points };
    });
    const starters = new Set<string>();
    const open = rows.filter((row) => row.span && !row.out);
    const take = (pred: (row: (typeof rows)[number]) => boolean, n: number) => {
      const picked = open.filter((row) => !starters.has(row.id) && pred(row)).sort((a, b) => (b.span?.expected ?? 0) - (a.span?.expected ?? 0)).slice(0, n);
      for (const row of picked) starters.add(row.id);
    };
    take((row) => row.pos === "QB", 1);
    take((row) => row.pos === "RB", 2);
    take((row) => row.pos === "WR", 3);
    take((row) => row.pos === "TE", 1);
    take((row) => ["RB", "WR", "TE"].includes(row.pos), 1);
    take((row) => ["QB", "RB", "WR", "TE"].includes(row.pos), 1);
    take((row) => row.pos === "DST", 1);
    for (const row of rows) {
      const projected = projectRow(row.ident, row.pos);
      const reason = row.span
        ? `BASELINE. Weeks 1-3 only. ${row.points.length < 3 ? "Thin. " : ""}${row.points.join(", ")}.`
        : "NO TRAIL. Off the start list.";
      freeze.push({
        leagueId: league.espnLeagueId,
        playerId: row.id,
        opponent: SLATE[row.team]?.["4"]?.opp ?? "",
        projected: projected.stats,
        floor: row.span?.floor ?? 0,
        expected: row.span?.expected ?? 0,
        ceiling: row.span?.ceiling ?? 0,
        decision: starters.has(row.id) ? "start" : "sit",
        reason,
        weightVersion: DEFAULT_WEIGHTS.version,
      });
      const week4 = row.ident?.weeks["4"];
      const played = week4 && (pack.scoredTeams["4"] ?? []).includes(row.team);
      if (!played || !week4 || !row.span) continue;
      const actual = scoreOffense(week4.stats);
      const brain = projected.priced ? scoreOffense(projected.stats as CountStats) : null;
      const base = [1, 2, 3].map((week) => scored.get(row.ident!.gsis)?.get(week)).filter((n): n is number => n != null);
      const baseline = base.length ? base.reduce((s, n) => s + n, 0) / base.length : row.span.expected;
      const rel = (actualCount: number, projectedCount: number) => {
        if (actualCount === 0 && projectedCount === 0) return 0;
        return Math.abs(actualCount - projectedCount) / Math.max(actualCount, projectedCount);
      };
      const targetError = rel(week4.targets, "ret" in projected.stats ? projected.stats.ret : 0);
      const carryError = rel(week4.carries, "ra" in projected.stats ? projected.stats.ra : 0);
      grades.push({
        leagueId: league.espnLeagueId,
        leagueIds: [league.espnLeagueId],
        week: 4,
        slot: "sun",
        playerId: row.id,
        pos: row.pos,
        projected: projected.stats,
        actualPoints: Math.round(actual * 10) / 10,
        ePts: brain == null ? null : Math.round(brain * 10) / 10,
        baseline: Math.round(baseline * 10) / 10,
        p20: Math.round(row.span.floor * 10) / 10,
        p80: Math.round(row.span.ceiling * 10) / 10,
        projectedTargets: "ret" in projected.stats ? projected.stats.ret : 0,
        actualTargets: week4.targets,
        projectedCarries: "ra" in projected.stats ? projected.stats.ra : 0,
        actualCarries: week4.carries,
        teamPlaysError: 0,
        questionable: false,
        playedSnapRatio: week4.snap,
        windProjectedCalm: null,
        tag: brain == null ? "unknown" : assignTag({
          targetError,
          carryError,
          scriptError: 0,
          injuryMiss: false,
          weatherMiss: false,
          pointsError: Math.abs(actual - brain),
          usageClose: targetError < 0.25 && carryError < 0.25,
        }),
      });
    }
  }
}

const uniqueGrades = [...grades.reduce((map, row) => {
  const existing = map.get(row.playerId);
  if (!existing) map.set(row.playerId, row);
  else if (!existing.leagueIds.includes(row.leagueId)) existing.leagueIds.push(row.leagueId);
  return map;
}, new Map<string, (typeof grades)[number]>()).values()];

const writtenAt = new Date().toISOString();
const dir = "src/lib/fantasy/brain/stored";
writeFileSync(`${dir}/trails.ts`, `export const TRAILS: Record<string, { gsis: string | null; points: number[]; reason: string }> = ${JSON.stringify(trails)};\n`);
writeFileSync(`${dir}/shadow.ts`, `export const SHADOW: Record<string, { usage: string; script: string; weather: string; opponent: string; brain: string }> = ${JSON.stringify(shadows)};\n`);
writeFileSync(`${dir}/sunday-freeze.ts`, `export const SUNDAY_FREEZE = ${JSON.stringify(freeze)} as const;\n`);
writeFileSync(
  `${dir}/grades.ts`,
  `import type { CorrectionRow, GradeRow } from "../types";\nexport const GRADE_ROWS: GradeRow[] = ${JSON.stringify(uniqueGrades)};\nexport const CORRECTIONS: CorrectionRow[] = [];\n`,
);
writeFileSync(
  `${dir}/freezes.ts`,
  `import type { FreezeMeta } from "../types";\nexport const FREEZE_ROWS: FreezeMeta[] = ${JSON.stringify([
    { id: "1014874-w4-sun", leagueId: "1014874", week: 4, slot: "sun", at: writtenAt, weightVersion: DEFAULT_WEIGHTS.version },
    { id: "210326445-w4-sun", leagueId: "210326445", week: 4, slot: "sun", at: writtenAt, weightVersion: DEFAULT_WEIGHTS.version },
  ])};\n`,
);
writeFileSync(
  `${dir}/weights.ts`,
  `import type { BrainWeights } from "../weights";\nexport const STORED_WEIGHTS: BrainWeights = ${JSON.stringify({ ...DEFAULT_WEIGHTS, frozen: {} })};\n`,
);
writeFileSync(
  `${dir}/gate.ts`,
  `export const GATE_REPLAY = { source: "nflverse", origin: "job", season: 2026, rows: [] as { playerId: string; week: number; actual: number; brain: number; baseline: number }[], note: "Weeks 4-7 are not complete. Thursday's loss does not open the gate." };\n`,
);

const usable = Object.values(trails).filter((row) => row.points.length > 0).length;
const leaked = uniqueGrades.filter((row) => row.p80 === row.actualPoints || row.p20 === row.actualPoints);
const calmFilled = uniqueGrades.filter((row) => row.windProjectedCalm === true);
const snapFilled = uniqueGrades.filter((row) => row.playedSnapRatio === 1 && row.playerId === "filled");
console.log(JSON.stringify({ pool: PLAYERS.length, missedJoin: missed, usable, freeze: freeze.length, grades: uniqueGrades.length, leaked: leaked.map((row) => row.playerId), calmFilled: calmFilled.length, snapFilled: snapFilled.length, writtenAt, metcalf: uniqueGrades.find((row) => row.playerId === "dk-metcalf") }, null, 2));

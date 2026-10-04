import { scoreOffense } from "../scoring";
import type { CountStats } from "../types";

/** Frozen inputs from the Python replay. The bugs below are copied on purpose. */
export interface ReplayRow {
  id: string;
  pos: string;
  team: string;
  week: number;
  points: number;
  att: number;
  car: number;
  ret: number;
  py: number;
  pc: number;
  inc: number;
  ptd: number;
  pfd: number;
  int: number;
  sk: number;
  ry: number;
  ra: number;
  rtd: number;
  rfd: number;
  rey: number;
  rec: number;
  retd: number;
  refd: number;
}

export interface ReplayGame {
  team: string;
  week: number;
  spread: number;
  total: number;
}

const KEYS = ["py", "pc", "inc", "ptd", "ptd50", "pfd", "int", "p2", "p300", "p400", "sk", "ry", "ra", "rtd", "rtd50", "rfd", "r2", "ry100", "ry200", "rey", "rec", "retd", "retd50", "refd", "rec2", "rey100", "rey200", "ret", "fuml"] as const;

export interface ReplayParts {
  points: number;
  teamPlays: number;
  targets: number;
  carries: number;
  receptions: number;
  firstDowns: number;
  stats: CountStats;
}

export interface ReplayIndex {
  byPlayer: Map<string, ReplayRow[]>;
  teamWeek: Map<string, { att: number; car: number }>;
  games: Map<string, { spread: number; total: number }>;
  byPos: Map<string, ReplayRow[]>;
}

function key(team: string, week: number) {
  return `${team}|${week}`;
}

export function indexReplay(weeks: ReplayRow[], games: ReplayGame[]): ReplayIndex {
  const byPlayer = new Map<string, ReplayRow[]>();
  const teamWeek = new Map<string, { att: number; car: number }>();
  const byPos = new Map<string, ReplayRow[]>();
  for (const row of weeks) {
    const list = byPlayer.get(row.id) ?? [];
    list.push(row);
    byPlayer.set(row.id, list);
    const bucket = teamWeek.get(key(row.team, row.week)) ?? { att: 0, car: 0 };
    bucket.att += row.att;
    bucket.car += row.car;
    teamWeek.set(key(row.team, row.week), bucket);
    const posRows = byPos.get(row.pos) ?? [];
    posRows.push(row);
    byPos.set(row.pos, posRows);
  }
  for (const list of byPlayer.values()) list.sort((a, b) => a.week - b.week);
  const gameMap = new Map<string, { spread: number; total: number }>();
  for (const game of games) gameMap.set(key(game.team, game.week), { spread: game.spread, total: game.total });
  return { byPlayer, teamWeek, games: gameMap, byPos };
}

function half(player: number, mean: number) {
  return 0.5 * player + 0.5 * mean;
}

function meanRate(rows: ReplayRow[], numKey: keyof ReplayRow, denKey: keyof ReplayRow, fallback: number) {
  let n = 0;
  let d = 0;
  for (const row of rows) {
    n += Number(row[numKey]);
    d += Number(row[denKey]);
  }
  return d ? n / d : fallback;
}

function bonus(mean: number, threshold: number, spread: number) {
  if (mean <= 0) return 0;
  const z = (threshold - mean) / Math.max(12, spread);
  return Math.min(0.85, Math.max(0, 1 / (1 + Math.exp(z * 1.7))));
}

function share(rows: ReplayRow[], kind: "target" | "carry", teamWeek: ReplayIndex["teamWeek"]) {
  let opp = 0;
  let mine = 0;
  for (const row of rows) {
    const bucket = teamWeek.get(key(row.team, row.week));
    opp += kind === "target" ? bucket?.att ?? 0 : bucket?.car ?? 0;
    mine += kind === "target" ? row.ret : row.car;
  }
  if (opp <= 0) return null;
  return mine / opp;
}

/** Python `project`, including the rates it computes and then does not use. */
export function projectReplay(index: ReplayIndex, priors: ReplayRow[], pos: string, teamName: string, week: number, weight: number): ReplayParts | null {
  const season = priors;
  const last = priors.slice(-3);
  const gamesN = season.length;
  const seasonTarget = share(season, "target", index.teamWeek);
  const seasonCarry = share(season, "carry", index.teamWeek);
  const lastTarget = share(last, "target", index.teamWeek);
  const lastCarry = share(last, "carry", index.teamWeek);
  const targetShare = gamesN > 3 && lastTarget != null && seasonTarget != null ? weight * lastTarget + (1 - weight) * seasonTarget : seasonTarget;
  const carryShare = gamesN > 3 && lastCarry != null && seasonCarry != null ? weight * lastCarry + (1 - weight) * seasonCarry : seasonCarry;
  const seen = new Set<string>();
  const paces: number[] = [];
  for (const row of season) {
    const mark = key(row.team, row.week);
    if (seen.has(mark)) continue;
    seen.add(mark);
    const bucket = index.teamWeek.get(mark);
    paces.push((bucket?.att ?? 0) + (bucket?.car ?? 0));
  }
  if (!paces.length) return null;
  const league: number[] = [];
  for (const [mark, bucket] of index.teamWeek) {
    const wk = Number(mark.slice(mark.lastIndexOf("|") + 1));
    if (wk < week && bucket.att + bucket.car > 0) league.push(bucket.att + bucket.car);
  }
  if (!league.length) return null;
  const teamPlays = 0.7 * (paces.reduce((sum, n) => sum + n, 0) / paces.length) + 0.3 * (league.reduce((sum, n) => sum + n, 0) / league.length);
  const game = index.games.get(key(teamName, week));
  const spread = game ? game.spread : null;
  let passRate = 0.57;
  if (spread != null && spread >= 7) passRate += 0.08;
  if (spread != null && spread <= -7) passRate -= 0.08;
  passRate = Math.min(0.72, Math.max(0.45, passRate));
  const rushRate = 1 - passRate;
  const attempts = season.reduce((sum, row) => sum + row.att, 0);
  if (pos !== "QB" && targetShare == null && carryShare == null) return null;
  if (pos === "QB" && carryShare == null && attempts === 0) return null;

  const posRows = (index.byPos.get(pos) ?? []).filter((row) => row.week < week);
  let py = 0, pc = 0, att = 0, sk = 0, ry = 0, ra = 0, rey = 0, ret = 0, rec = 0, rtd = 0, retd = 0, ptd = 0, rfd = 0, refd = 0, pfd = 0, interceptions = 0;
  for (const row of season) {
    py += row.py; pc += row.pc; att += row.att; sk += row.sk; ry += row.ry; ra += row.ra;
    rey += row.rey; ret += row.ret; rec += row.rec; rtd += row.rtd; retd += row.retd; ptd += row.ptd;
    rfd += row.rfd; refd += row.refd; pfd += row.pfd; interceptions += row.int;
  }
  const ypc = half(ra ? ry / ra : meanRate(posRows, "ry", "ra", 4.2), meanRate(posRows, "ry", "ra", 4.2));
  const yptMean = pos === "QB" ? meanRate(posRows, "py", "pc", 11) : meanRate(posRows, "rey", "rec", 8);
  const yptPlayer = pos === "QB" && pc ? py / pc : rec ? rey / rec : yptMean;
  const ypt = half(yptPlayer, yptMean);
  const cmpMeanN = posRows.reduce((sum, row) => sum + row.pc, 0);
  const cmpMeanD = posRows.reduce((sum, row) => sum + row.att, 0);
  const cmpMean = cmpMeanD ? cmpMeanN / cmpMeanD : 0.645;
  const cmp = half(att ? pc / att : cmpMean, cmpMean);
  const sack = half(att + sk ? sk / (att + sk) : 0.065, 0.065);
  const tdRush = half(ra ? rtd / ra : 0.04, meanRate(posRows, "rtd", "ra", 0.04));
  const tdTarget = half(pos === "QB" && att ? ptd / att : ret ? retd / ret : 0.045, pos === "QB" ? 0.045 : meanRate(posRows, "retd", "ret", 0.045));
  const fdRush = half(ra ? rfd / ra : 0.22, meanRate(posRows, "rfd", "ra", 0.22));
  const fdRec = half(rec ? refd / rec : 0.6, meanRate(posRows, "refd", "rec", 0.6));
  const fdPass = half(pc ? pfd / pc : 0.38, 0.38);
  const targets = targetShare == null || pos === "QB" ? 0 : teamPlays * passRate * targetShare;
  const carries = carryShare == null ? 0 : teamPlays * rushRate * carryShare;
  const stats = Object.fromEntries(KEYS.map((name) => [name, 0])) as unknown as CountStats;
  if (pos === "QB") {
    const attHat = teamPlays * passRate;
    const cmpRate = Math.min(0.78, Math.max(0.45, cmp));
    const pcHat = attHat * cmpRate;
    const pyHat = pcHat * (pc ? py / pc : 7.4);
    stats.pc = pcHat;
    stats.inc = attHat - pcHat;
    stats.py = pyHat;
    stats.ptd = attHat * (att ? ptd / att : 0.048);
    stats.pfd = pcHat * fdPass;
    stats.int = attHat * (att ? interceptions / att : 0.022);
    stats.sk = attHat * sack;
    stats.ra = carries;
    stats.ry = carries * ypc;
    stats.rtd = carries * tdRush;
    stats.rfd = carries * fdRush;
    stats.ret = 0;
    stats.p300 = bonus(stats.py, 300, 55);
    stats.p400 = bonus(stats.py, 400, 55);
  } else {
    const recHat = targets * half(ret ? rec / ret : 0.65, meanRate(posRows, "rec", "ret", 0.65));
    stats.ra = carries;
    stats.ry = carries * ypc;
    stats.rtd = carries * tdRush;
    stats.rfd = carries * fdRush;
    stats.ret = targets;
    stats.rec = recHat;
    stats.rey = recHat * (rec ? rey / rec : ypt);
    stats.retd = targets * tdTarget;
    stats.refd = recHat * fdRec;
    stats.ry100 = bonus(stats.ry, 100, 38);
    stats.rey100 = bonus(stats.rey, 100, 32);
  }
  return {
    points: scoreOffense(stats),
    teamPlays,
    targets,
    carries,
    receptions: stats.rec,
    firstDowns: stats.rfd + stats.refd + stats.pfd,
    stats,
  };
}

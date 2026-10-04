export type Pos = "QB" | "RB" | "WR" | "TE" | "DST";
export type FlexPos = Pos | "ALL" | "FLEX" | "OP";
export type Slot = "QB" | "RB" | "WR" | "TE" | "FLEX" | "OP" | "DST";
export type InjuryStatus = "Q" | "D" | "O" | "IR" | "SSPD" | "Bye" | null;
export type ConfidenceLabel = "High" | "Med" | "Coin-flip";
export type KeepLabel = "Lock" | "Strong" | "Situational" | "Fringe" | "Cut";
export type LineupMode = "favorite" | "tossup" | "underdog";
export type Phase = "keepers" | "draft" | "season" | "deadline" | "playoffs";

export const POSITIONS: Pos[] = ["QB", "RB", "WR", "TE", "DST"];
export const SKILL_POS: Pos[] = ["QB", "RB", "WR", "TE"];

export interface CountStats {
  py: number;
  pc: number;
  inc: number;
  ptd: number;
  ptd50: number;
  pfd: number;
  int: number;
  p2: number;
  p300: number;
  p400: number;
  sk: number;
  ry: number;
  ra: number;
  rtd: number;
  rtd50: number;
  rfd: number;
  r2: number;
  ry100: number;
  ry200: number;
  rey: number;
  rec: number;
  retd: number;
  retd50: number;
  refd: number;
  rec2: number;
  rey100: number;
  rey200: number;
  ret: number;
  fuml: number;
}

export interface DstStats {
  sack: number;
  int: number;
  fr: number;
  ff: number;
  safety: number;
  td: number;
  block: number;
  tw: number;
  pa: number;
  ya: number;
}

export interface Range {
  p20: number;
  p50: number;
  p80: number;
  ePts: number;
}

export interface Usage {
  snap: number;
  route: number;
  targetShare: number;
  rushShare: number;
  rzShare: number;
}

export interface RawPlayer {
  id: string;
  name: string;
  pos: Pos;
  team: string;
  bye: number;
  adp12: number;
  age: number;
  rec: number;
  usage: number;
  consistency: number;
  upside: number;
  health: number;
  sos: number;
  trend: number;
  matchup: number;
  weekPpr: number;
  rosPpr: number;
  opp: string;
  home: boolean;
  rook?: boolean;
  status?: InjuryStatus;
  news?: string;
  undroppable?: boolean;
}

export interface PlayerState {
  id: string;
  name: string;
  pos: Pos;
  nflTeam: string;
  bye: number;
  status: InjuryStatus | "Active";
  usage: Usage;
  weekly: Range;
  ros: Range & { weeksLeft: number };
  weeklyVor: number;
  rosVor: number;
  adjVor: number;
  confidence: number;
  confidenceLabel: ConfidenceLabel;
  adp12: number;
  adp10: number;
  age: number;
  opp: string;
  home: boolean;
  rook?: boolean;
  news?: string;
  role: string;
  source: "counting" | "converted";
  undroppable: boolean;
  stats: CountStats | DstStats;
  reason: string;
  stale: boolean;
  shadow: { name: string; value: string }[];
  trail: "none" | "thin" | "full";
  scoredWeeks?: number;
}

export interface Team {
  id: number;
  name: string;
  abbrev: string;
  owner: string;
  isYou: boolean;
  draftSlot: number;
  record: { w: number; l: number; t: number };
  pf: number;
  pa: number;
  roster: string[];
  ir: string[];
  draft: Record<string, number>;
  keepers: string[];
  keeperCost: Record<string, number>;
  projectedKeepers: string[];
  waivers: number;
  slots?: { id: string; slot: string }[];
}

export interface Matchup {
  week: number;
  homeId: number;
  awayId: number;
}

export interface DraftPickRecord {
  overall: number;
  round: number;
  pick: number;
  teamId: number;
  name: string;
  pos: string;
  keeper: boolean;
}

export interface LeagueActivity {
  kind: string;
  status: string;
  teamId: number;
  at: number;
  moves: { action: string; name: string }[];
}

export interface FreeAgentRecord {
  name: string;
  pos: Pos;
  nfl: string;
  owned: number;
  waiver: boolean;
}

export interface League {
  id: string;
  name: string;
  season: number;
  week: number;
  teams: Team[];
  matchups: Matchup[];
  source: "seed" | "espn" | "paste";
  espnLeagueId: string;
  lastUpdated: number | null;
  stale: boolean;
  keepersLocked: boolean;
  draftPicks?: DraftPickRecord[];
  activity?: LeagueActivity[];
  freeAgents?: FreeAgentRecord[];
}

export interface EspnCreds {
  leagueId: string;
  season: number;
  swid: string;
  espnS2: string;
  teamId: number | null;
}

export interface ActionRec {
  id: string;
  title: string;
  doThis: string;
  why: string;
  gain: string;
  confidence: ConfidenceLabel;
  flip: string;
  href: string;
}

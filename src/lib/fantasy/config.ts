export const LEAGUE_NAME = "The Bush League";
export const PRODUCT_NAME = "Bush League OS";
export const LEAGUE_ID = "1014874";
export const LEAGUES = [
  { id: "1014874", name: "The Bush League", espnTeamId: 1, seedSlot: 9, teamName: "Let Maye Cook" },
  { id: "210326445", name: "TW Fantasy", espnTeamId: 1, seedSlot: 1, teamName: "Utility Man" },
] as const;
export const SEASON_YEAR = 2026;
export const TEAMS = 10;
export const DRAFT_ROUNDS = 18;
export const USER_TEAM_NAME = "Let Maye Cook";
export const USER_MANAGER = "DJ Alberty";
export const USER_DRAFT_SLOT = 9;

export const KEEPER_LOCK_AT = Date.parse("2026-09-08T19:30:00-04:00");
export const DRAFT_START_AT = Date.parse("2026-09-08T20:30:00-04:00");
export const TRADE_DEADLINE_AT = Date.parse("2026-12-04T03:00:00-05:00");
export const WEEK1_KICKOFF = Date.parse("2026-09-10T20:20:00-04:00");

export function weekFromDate(now = Date.now()) {
  if (now < WEEK1_KICKOFF) return 1;
  return Math.min(18, Math.max(1, Math.floor((now - WEEK1_KICKOFF) / (7 * 86400000)) + 1));
}

export const CURRENT_WEEK = weekFromDate();
export const REGULAR_SEASON_WEEKS = 14;
export const PLAYOFF_TEAMS = 6;
export const PLAYOFF_WEEKS = [15, 16, 17] as const;

export const STARTERS = {
  qb: 1,
  rb: 2,
  wr: 3,
  te: 1,
  flex: 1,
  op: 1,
  dst: 1,
  k: 0,
} as const;

export const BENCH = 8;
export const IR_SLOTS = 1;
export const ACTIVE_ROSTER = 18;

export const ROSTER_MAX = {
  qb: 4,
  rb: 8,
  wr: 8,
  te: 3,
  dst: 3,
  k: 3,
} as const;

export const FLEX_ELIGIBLE = ["RB", "WR", "TE"] as const;
export const OP_ELIGIBLE = ["QB", "RB", "WR", "TE"] as const;

export const REPLACEMENT_RANK = {
  QB: 14,
  RB: 26,
  WR: 37,
  TE: 12,
  DST: 11,
} as const;

export const PPR_FALLBACK_MULT = {
  QB: 1.05,
  RB: 1.12,
  WR: 1.18,
  TE: 1.15,
  DST: 1,
} as const;

export const NEED_BOOST = {
  emptyStarter: 0.25,
  emptyFlex: 0.15,
  emptyOp: 0.15,
  byeInsurance: 0.05,
} as const;

export const BYE_STACK_PENALTY = 0.08;
export const KEEP_VOR_WEIGHT = 0.55;
export const KEEP_SURPLUS_WEIGHT = 0.45;
export const BALANCE_BONUS_MAX = 8;
export const CORRELATION_PENALTY_MAX = 6;
export const FAVORITE_MARGIN = 8;
export const COIN_FLIP_WEEKLY = 1.5;
export const TRADE_FAIR_BAND = 0.08;
export const CONSOLIDATION_BONUS = 0.12;
export const DISAGREE_HAIRCUT = 0.08;
export const STALE_HOURS = 6;
export const WEEKS_LEFT = 16;

export const PRIORITY_COST: Record<number, number> = {
  1: 12,
  2: 8,
  3: 5,
  4: 3,
  5: 2,
  6: 1.5,
  7: 1,
  8: 0.5,
  9: 0.25,
  10: 0,
};

export const PICK_VALUE_BY_ROUND: Record<number, number> = {
  1: 100,
  2: 68,
  3: 48,
  4: 35,
  5: 26,
  6: 19,
  7: 14,
  8: 11,
  9: 8.5,
  10: 6.5,
  11: 5.0,
  12: 3.8,
  13: 2.9,
  14: 2.2,
  15: 1.6,
  16: 1.0,
  17: 1.0,
  18: 1.0,
};

export const INELIGIBLE_KEEP_IDS = [
  "jaxon-smith-njigba",
  "drake-maye",
  "ladd-mcconkey",
  "dallas-goedert",
  "travis-kelce",
  "chase-brown",
  "courtland-sutton",
  "tj-hockenson",
  "trey-mcbride",
  "justin-fields",
  "jerry-jeudy",
  "sam-darnold",
  "jared-goff",
  "bucky-irving",
  "malik-nabers",
  "baker-mayfield",
  "brian-thomas-jr",
  "bo-nix",
  "zach-charbonnet",
  "jameson-williams",
] as const;

export const USER_INELIGIBLE_IDS = [
  "drake-maye",
  "james-cook",
  "ceedee-lamb",
  "amon-ra-st-brown",
  "joe-burrow",
  "jaxon-smith-njigba",
] as const;

export const USER_ELIGIBLE: { id: string; sticker: number }[] = [
  { id: "wandale-robinson", sticker: 15 },
  { id: "patriots-dst", sticker: 15 },
  { id: "dylan-sampson", sticker: 15 },
  { id: "brandon-aiyuk", sticker: 15 },
  { id: "brenton-strange", sticker: 11 },
  { id: "jaylen-warren", sticker: 9 },
  { id: "cj-stroud", sticker: 7 },
  { id: "tyler-warren", sticker: 5 },
  { id: "woody-marks", sticker: 4 },
  { id: "bills-dst", sticker: 4 },
  { id: "tetairoa-mcmillan", sticker: 4 },
  { id: "michael-carter", sticker: 4 },
  { id: "jawhar-jordan", sticker: 4 },
];

export const DEFAULT_KEEPER_IDS = ["tyler-warren", "tetairoa-mcmillan"] as const;

export const DRAFT_ORDER: { pick: number; name: string; owner: string; abbrev: string }[] = [
  { pick: 1, name: "Tommy Ain't Got No Job", owner: "Thomas Hannon", abbrev: "TAJ" },
  { pick: 2, name: "Nabers think im sellin dope", owner: "AJ Selemba", abbrev: "NAB" },
  { pick: 3, name: "Lamar's LinkedIn Warriors", owner: "Tyler Sheley", abbrev: "LLW" },
  { pick: 4, name: "Do It For State", owner: "Jennifer Hull", abbrev: "DIF" },
  { pick: 5, name: "Great Value Belichick", owner: "Brandon Muller", abbrev: "GVB" },
  { pick: 6, name: "Baby Got Dak", owner: "Angelina Conniff", abbrev: "BGD" },
  { pick: 7, name: "Yuck Fou", owner: "Peter Varetimos", abbrev: "YFO" },
  { pick: 8, name: "DONKY PUNCHRS", owner: "Sean Wellington", abbrev: "DKY" },
  { pick: 9, name: USER_TEAM_NAME, owner: USER_MANAGER, abbrev: "LMC" },
  { pick: 10, name: "6 Ways from Sunday", owner: "Andy Bevilacqua", abbrev: "6WF" },
];

export const USER_ROSTER_IDS = [
  "drake-maye",
  "joe-burrow",
  "cj-stroud",
  "james-cook",
  "jaylen-warren",
  "woody-marks",
  "dylan-sampson",
  "michael-carter",
  "jawhar-jordan",
  "ceedee-lamb",
  "amon-ra-st-brown",
  "jaxon-smith-njigba",
  "tetairoa-mcmillan",
  "wandale-robinson",
  "tyler-warren",
  "brenton-strange",
  "patriots-dst",
  "bills-dst",
] as const;

export const USER_IR_IDS = ["brandon-aiyuk"] as const;

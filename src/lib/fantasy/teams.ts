export interface NflTeam {
  abbr: string;
  city: string;
  name: string;
  bye: number;
  opp: string;
  home: boolean;
}

export const NFL_TEAMS: Record<string, NflTeam> = {
  ARI: { abbr: "ARI", city: "Arizona", name: "Cardinals", bye: 14, opp: "LAC", home: false },
  ATL: { abbr: "ATL", city: "Atlanta", name: "Falcons", bye: 11, opp: "PIT", home: false },
  BAL: { abbr: "BAL", city: "Baltimore", name: "Ravens", bye: 13, opp: "IND", home: false },
  BUF: { abbr: "BUF", city: "Buffalo", name: "Bills", bye: 7, opp: "HOU", home: false },
  CAR: { abbr: "CAR", city: "Carolina", name: "Panthers", bye: 5, opp: "CHI", home: true },
  CHI: { abbr: "CHI", city: "Chicago", name: "Bears", bye: 10, opp: "CAR", home: false },
  CIN: { abbr: "CIN", city: "Cincinnati", name: "Bengals", bye: 6, opp: "TB", home: true },
  CLE: { abbr: "CLE", city: "Cleveland", name: "Browns", bye: 11, opp: "JAC", home: false },
  DAL: { abbr: "DAL", city: "Dallas", name: "Cowboys", bye: 14, opp: "NYG", home: false },
  DEN: { abbr: "DEN", city: "Denver", name: "Broncos", bye: 10, opp: "KC", home: false },
  DET: { abbr: "DET", city: "Detroit", name: "Lions", bye: 6, opp: "NO", home: true },
  GB: { abbr: "GB", city: "Green Bay", name: "Packers", bye: 11, opp: "MIN", home: false },
  HOU: { abbr: "HOU", city: "Houston", name: "Texans", bye: 8, opp: "BUF", home: true },
  IND: { abbr: "IND", city: "Indianapolis", name: "Colts", bye: 13, opp: "BAL", home: true },
  JAC: { abbr: "JAC", city: "Jacksonville", name: "Jaguars", bye: 7, opp: "CLE", home: true },
  KC: { abbr: "KC", city: "Kansas City", name: "Chiefs", bye: 5, opp: "DEN", home: true },
  LAC: { abbr: "LAC", city: "Los Angeles", name: "Chargers", bye: 7, opp: "ARI", home: true },
  LAR: { abbr: "LAR", city: "Los Angeles", name: "Rams", bye: 11, opp: "SF", home: true },
  LV: { abbr: "LV", city: "Las Vegas", name: "Raiders", bye: 13, opp: "MIA", home: true },
  MIA: { abbr: "MIA", city: "Miami", name: "Dolphins", bye: 6, opp: "LV", home: false },
  MIN: { abbr: "MIN", city: "Minnesota", name: "Vikings", bye: 6, opp: "GB", home: true },
  NE: { abbr: "NE", city: "New England", name: "Patriots", bye: 11, opp: "SEA", home: false },
  NO: { abbr: "NO", city: "New Orleans", name: "Saints", bye: 8, opp: "DET", home: false },
  NYG: { abbr: "NYG", city: "New York", name: "Giants", bye: 8, opp: "DAL", home: true },
  NYJ: { abbr: "NYJ", city: "New York", name: "Jets", bye: 13, opp: "TEN", home: false },
  PHI: { abbr: "PHI", city: "Philadelphia", name: "Eagles", bye: 10, opp: "WAS", home: true },
  PIT: { abbr: "PIT", city: "Pittsburgh", name: "Steelers", bye: 9, opp: "ATL", home: true },
  SEA: { abbr: "SEA", city: "Seattle", name: "Seahawks", bye: 11, opp: "NE", home: true },
  SF: { abbr: "SF", city: "San Francisco", name: "49ers", bye: 8, opp: "LAR", home: false },
  TB: { abbr: "TB", city: "Tampa Bay", name: "Buccaneers", bye: 10, opp: "CIN", home: false },
  TEN: { abbr: "TEN", city: "Tennessee", name: "Titans", bye: 9, opp: "NYJ", home: true },
  WAS: { abbr: "WAS", city: "Washington", name: "Commanders", bye: 7, opp: "PHI", home: false },
};

export const WEEK1_KICKOFF = Date.parse("2026-09-09T20:20:00-04:00");
export const SEASON_YEAR = 2026;
export const CURRENT_WEEK = 1;

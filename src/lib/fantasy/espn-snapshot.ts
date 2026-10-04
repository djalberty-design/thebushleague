import type { Pos } from "./types";

export interface SnapPlayer {
  name: string;
  pos: Pos;
  nfl: string;
  ir: boolean;
}

export interface SnapTeam {
  id: number;
  name: string;
  abbrev: string;
  owner: string;
  w: number;
  l: number;
  t: number;
  pf: number;
  pa: number;
  waivers: number;
  you: boolean;
  players: SnapPlayer[];
}

export interface SnapLeague {
  espnLeagueId: string;
  name: string;
  season: number;
  week: number;
  myTeamId: number;
  keepersLocked: boolean;
  teams: SnapTeam[];
  matchups: { week: number; homeId: number; awayId: number }[];
}

export const ESPN_SNAPSHOT: SnapLeague[] = [
  {
    "espnLeagueId": "1014874",
    "name": "The Bush League",
    "season": 2026,
    "week": 4,
    "myTeamId": 1,
    "keepersLocked": true,
    "teams": [
      {
        "id": 1,
        "name": "Let Maye Cook",
        "abbrev": "MAYE",
        "owner": "DJ Alberty",
        "w": 1,
        "l": 2,
        "t": 0,
        "pf": 491.7,
        "pa": 548.5,
        "waivers": 7,
        "you": true,
        "players": [
          {
            "name": "Drake Maye",
            "pos": "QB",
            "nfl": "NE",
            "ir": false
          },
          {
            "name": "Ashton Jeanty",
            "pos": "RB",
            "nfl": "LV",
            "ir": false
          },
          {
            "name": "Tetairoa McMillan",
            "pos": "WR",
            "nfl": "CAR",
            "ir": false
          },
          {
            "name": "Tyler Warren",
            "pos": "TE",
            "nfl": "IND",
            "ir": false
          },
          {
            "name": "Tee Higgins",
            "pos": "WR",
            "nfl": "CIN",
            "ir": false
          },
          {
            "name": "Kyler Murray",
            "pos": "QB",
            "nfl": "MIN",
            "ir": false
          },
          {
            "name": "Bhayshul Tuten",
            "pos": "RB",
            "nfl": "JAC",
            "ir": false
          },
          {
            "name": "Brian Thomas Jr.",
            "pos": "WR",
            "nfl": "JAC",
            "ir": false
          },
          {
            "name": "Wan'Dale Robinson",
            "pos": "WR",
            "nfl": "TEN",
            "ir": false
          },
          {
            "name": "Kyle Monangai",
            "pos": "RB",
            "nfl": "CHI",
            "ir": false
          },
          {
            "name": "Kenyon Sadiq",
            "pos": "TE",
            "nfl": "NYJ",
            "ir": false
          },
          {
            "name": "Patriots DST",
            "pos": "DST",
            "nfl": "NE",
            "ir": false
          },
          {
            "name": "Caleb Douglas",
            "pos": "WR",
            "nfl": "MIA",
            "ir": false
          },
          {
            "name": "Carnell Tate",
            "pos": "WR",
            "nfl": "TEN",
            "ir": false
          },
          {
            "name": "Cam Ward",
            "pos": "QB",
            "nfl": "TEN",
            "ir": false
          },
          {
            "name": "TreVeyon Henderson",
            "pos": "RB",
            "nfl": "NE",
            "ir": false
          },
          {
            "name": "Ollie Gordon II",
            "pos": "RB",
            "nfl": "MIA",
            "ir": false
          },
          {
            "name": "Raiders DST",
            "pos": "DST",
            "nfl": "LV",
            "ir": false
          }
        ]
      },
      {
        "id": 2,
        "name": "Great Value Belichick",
        "abbrev": "GVB",
        "owner": "Eric eats Eggs",
        "w": 1,
        "l": 2,
        "t": 0,
        "pf": 474.1,
        "pa": 647.8,
        "waivers": 8,
        "you": false,
        "players": [
          {
            "name": "Bijan Robinson",
            "pos": "RB",
            "nfl": "ATL",
            "ir": false
          },
          {
            "name": "James Cook III",
            "pos": "RB",
            "nfl": "BUF",
            "ir": false
          },
          {
            "name": "Justin Herbert",
            "pos": "QB",
            "nfl": "LAC",
            "ir": false
          },
          {
            "name": "Malik Nabers",
            "pos": "WR",
            "nfl": "NYG",
            "ir": false
          },
          {
            "name": "Colston Loveland",
            "pos": "TE",
            "nfl": "CHI",
            "ir": false
          },
          {
            "name": "Rome Odunze",
            "pos": "WR",
            "nfl": "CHI",
            "ir": false
          },
          {
            "name": "David Montgomery",
            "pos": "RB",
            "nfl": "HOU",
            "ir": false
          },
          {
            "name": "Michael Wilson",
            "pos": "WR",
            "nfl": "ARI",
            "ir": false
          },
          {
            "name": "Jakobi Meyers",
            "pos": "WR",
            "nfl": "JAC",
            "ir": false
          },
          {
            "name": "Jordyn Tyson",
            "pos": "WR",
            "nfl": "NO",
            "ir": true
          },
          {
            "name": "Jonah Coleman",
            "pos": "RB",
            "nfl": "DEN",
            "ir": false
          },
          {
            "name": "Geno Smith",
            "pos": "QB",
            "nfl": "NYJ",
            "ir": false
          },
          {
            "name": "Tyler Allgeier",
            "pos": "RB",
            "nfl": "ARI",
            "ir": false
          },
          {
            "name": "Jalen Coker",
            "pos": "WR",
            "nfl": "CAR",
            "ir": false
          },
          {
            "name": "Bryce Young",
            "pos": "QB",
            "nfl": "CAR",
            "ir": false
          },
          {
            "name": "Braelon Allen",
            "pos": "RB",
            "nfl": "NYJ",
            "ir": false
          },
          {
            "name": "Terrance Ferguson",
            "pos": "TE",
            "nfl": "LAR",
            "ir": false
          },
          {
            "name": "Steelers DST",
            "pos": "DST",
            "nfl": "PIT",
            "ir": false
          },
          {
            "name": "Brenton Strange",
            "pos": "TE",
            "nfl": "JAC",
            "ir": false
          }
        ]
      },
      {
        "id": 3,
        "name": "Tommy Ain`t Got No Job",
        "abbrev": "TH08",
        "owner": "th1232",
        "w": 1,
        "l": 2,
        "t": 0,
        "pf": 540.5,
        "pa": 702.5,
        "waivers": 2,
        "you": false,
        "players": [
          {
            "name": "Josh Allen",
            "pos": "QB",
            "nfl": "BUF",
            "ir": false
          },
          {
            "name": "Bo Nix",
            "pos": "QB",
            "nfl": "DEN",
            "ir": false
          },
          {
            "name": "Saquon Barkley",
            "pos": "RB",
            "nfl": "PHI",
            "ir": false
          },
          {
            "name": "Zay Flowers",
            "pos": "WR",
            "nfl": "BAL",
            "ir": false
          },
          {
            "name": "Ladd McConkey",
            "pos": "WR",
            "nfl": "LAC",
            "ir": false
          },
          {
            "name": "Bucky Irving",
            "pos": "RB",
            "nfl": "TB",
            "ir": false
          },
          {
            "name": "Jadarian Price",
            "pos": "RB",
            "nfl": "SEA",
            "ir": false
          },
          {
            "name": "Alec Pierce",
            "pos": "WR",
            "nfl": "IND",
            "ir": false
          },
          {
            "name": "Travis Kelce",
            "pos": "TE",
            "nfl": "KC",
            "ir": false
          },
          {
            "name": "Sam Darnold",
            "pos": "QB",
            "nfl": "SEA",
            "ir": false
          },
          {
            "name": "Romeo Doubs",
            "pos": "WR",
            "nfl": "NE",
            "ir": false
          },
          {
            "name": "Jordan Mason",
            "pos": "RB",
            "nfl": "MIN",
            "ir": true
          },
          {
            "name": "Hunter Henry",
            "pos": "TE",
            "nfl": "NE",
            "ir": false
          },
          {
            "name": "Texans DST",
            "pos": "DST",
            "nfl": "HOU",
            "ir": false
          },
          {
            "name": "Tre Tucker",
            "pos": "WR",
            "nfl": "LV",
            "ir": false
          },
          {
            "name": "Michael Penix Jr.",
            "pos": "QB",
            "nfl": "ATL",
            "ir": false
          },
          {
            "name": "Dontayvion Wicks",
            "pos": "WR",
            "nfl": "PHI",
            "ir": false
          },
          {
            "name": "Keenan Allen",
            "pos": "WR",
            "nfl": "IND",
            "ir": false
          },
          {
            "name": "Malik Washington",
            "pos": "WR",
            "nfl": "MIA",
            "ir": false
          }
        ]
      },
      {
        "id": 6,
        "name": "Lamar's LinkedIn Warriors ",
        "abbrev": "LLW",
        "owner": "ESPNFAN2110365779",
        "w": 1,
        "l": 2,
        "t": 0,
        "pf": 604.4,
        "pa": 576.8,
        "waivers": 4,
        "you": false,
        "players": [
          {
            "name": "Lamar Jackson",
            "pos": "QB",
            "nfl": "BAL",
            "ir": false
          },
          {
            "name": "Jalen Hurts",
            "pos": "QB",
            "nfl": "PHI",
            "ir": false
          },
          {
            "name": "Justin Jefferson",
            "pos": "WR",
            "nfl": "MIN",
            "ir": false
          },
          {
            "name": "Trey McBride",
            "pos": "TE",
            "nfl": "ARI",
            "ir": false
          },
          {
            "name": "Breece Hall",
            "pos": "RB",
            "nfl": "NYJ",
            "ir": false
          },
          {
            "name": "Terry McLaurin",
            "pos": "WR",
            "nfl": "WAS",
            "ir": false
          },
          {
            "name": "Courtland Sutton",
            "pos": "WR",
            "nfl": "DEN",
            "ir": false
          },
          {
            "name": "Marvin Harrison Jr.",
            "pos": "WR",
            "nfl": "ARI",
            "ir": false
          },
          {
            "name": "DK Metcalf",
            "pos": "WR",
            "nfl": "PIT",
            "ir": false
          },
          {
            "name": "Chuba Hubbard",
            "pos": "RB",
            "nfl": "CAR",
            "ir": false
          },
          {
            "name": "C.J. Stroud",
            "pos": "QB",
            "nfl": "HOU",
            "ir": false
          },
          {
            "name": "KC Concepcion",
            "pos": "WR",
            "nfl": "CLE",
            "ir": false
          },
          {
            "name": "Tucker Kraft",
            "pos": "TE",
            "nfl": "GB",
            "ir": false
          },
          {
            "name": "Quinshon Judkins",
            "pos": "RB",
            "nfl": "CLE",
            "ir": false
          },
          {
            "name": "Zachariah Branch",
            "pos": "WR",
            "nfl": "ATL",
            "ir": false
          },
          {
            "name": "T.J. Hockenson",
            "pos": "TE",
            "nfl": "MIN",
            "ir": false
          },
          {
            "name": "49ers DST",
            "pos": "DST",
            "nfl": "SF",
            "ir": false
          },
          {
            "name": "Case Keenum",
            "pos": "QB",
            "nfl": "CHI",
            "ir": false
          }
        ]
      },
      {
        "id": 7,
        "name": "Yuck Fou",
        "abbrev": "FU",
        "owner": "pvaretimos",
        "w": 2,
        "l": 1,
        "t": 0,
        "pf": 700.7,
        "pa": 525.5,
        "waivers": 6,
        "you": false,
        "players": [
          {
            "name": "Puka Nacua",
            "pos": "WR",
            "nfl": "LAR",
            "ir": false
          },
          {
            "name": "Christian McCaffrey",
            "pos": "RB",
            "nfl": "SF",
            "ir": false
          },
          {
            "name": "Kenneth Walker III",
            "pos": "RB",
            "nfl": "KC",
            "ir": false
          },
          {
            "name": "Omarion Hampton",
            "pos": "RB",
            "nfl": "LAC",
            "ir": false
          },
          {
            "name": "Garrett Wilson",
            "pos": "WR",
            "nfl": "NYJ",
            "ir": false
          },
          {
            "name": "Jordan Love",
            "pos": "QB",
            "nfl": "GB",
            "ir": false
          },
          {
            "name": "Jared Goff",
            "pos": "QB",
            "nfl": "DET",
            "ir": false
          },
          {
            "name": "Harold Fannin Jr.",
            "pos": "TE",
            "nfl": "CLE",
            "ir": false
          },
          {
            "name": "Chris Olave",
            "pos": "WR",
            "nfl": "NO",
            "ir": false
          },
          {
            "name": "Tyler Shough",
            "pos": "QB",
            "nfl": "NO",
            "ir": false
          },
          {
            "name": "Rico Dowdle",
            "pos": "RB",
            "nfl": "PIT",
            "ir": false
          },
          {
            "name": "Chris Godwin Jr.",
            "pos": "WR",
            "nfl": "TB",
            "ir": false
          },
          {
            "name": "Dalton Kincaid",
            "pos": "TE",
            "nfl": "BUF",
            "ir": false
          },
          {
            "name": "RJ Harvey",
            "pos": "RB",
            "nfl": "DEN",
            "ir": true
          },
          {
            "name": "Deebo Samuel Sr.",
            "pos": "WR",
            "nfl": "SF",
            "ir": false
          },
          {
            "name": "Rashid Shaheed",
            "pos": "WR",
            "nfl": "SEA",
            "ir": false
          },
          {
            "name": "Chargers DST",
            "pos": "DST",
            "nfl": "LAC",
            "ir": false
          },
          {
            "name": "Devaughn Vele",
            "pos": "WR",
            "nfl": "NO",
            "ir": false
          },
          {
            "name": "Emanuel Wilson",
            "pos": "RB",
            "nfl": "SEA",
            "ir": false
          }
        ]
      },
      {
        "id": 8,
        "name": "6 Ways from Sunday",
        "abbrev": "BEVS",
        "owner": "Andy_bev",
        "w": 3,
        "l": 0,
        "t": 0,
        "pf": 670.5,
        "pa": 607.7,
        "waivers": 9,
        "you": false,
        "players": [
          {
            "name": "Jaxon Smith-Njigba",
            "pos": "WR",
            "nfl": "SEA",
            "ir": false
          },
          {
            "name": "Joe Burrow",
            "pos": "QB",
            "nfl": "CIN",
            "ir": false
          },
          {
            "name": "Brock Bowers",
            "pos": "TE",
            "nfl": "LV",
            "ir": false
          },
          {
            "name": "Chase Brown",
            "pos": "RB",
            "nfl": "CIN",
            "ir": false
          },
          {
            "name": "Travis Etienne Jr.",
            "pos": "RB",
            "nfl": "NO",
            "ir": false
          },
          {
            "name": "Luther Burden III",
            "pos": "WR",
            "nfl": "CHI",
            "ir": false
          },
          {
            "name": "Parker Washington",
            "pos": "WR",
            "nfl": "JAC",
            "ir": false
          },
          {
            "name": "Trevor Lawrence",
            "pos": "QB",
            "nfl": "JAC",
            "ir": false
          },
          {
            "name": "Rashee Rice",
            "pos": "WR",
            "nfl": "KC",
            "ir": false
          },
          {
            "name": "Christian Watson",
            "pos": "WR",
            "nfl": "GB",
            "ir": false
          },
          {
            "name": "J.K. Dobbins",
            "pos": "RB",
            "nfl": "DEN",
            "ir": false
          },
          {
            "name": "Blake Corum",
            "pos": "RB",
            "nfl": "LAR",
            "ir": false
          },
          {
            "name": "Josh Downs",
            "pos": "WR",
            "nfl": "IND",
            "ir": false
          },
          {
            "name": "Jacoby Brissett",
            "pos": "QB",
            "nfl": "ARI",
            "ir": false
          },
          {
            "name": "Zach Charbonnet",
            "pos": "RB",
            "nfl": "SEA",
            "ir": true
          },
          {
            "name": "Marcus Mariota",
            "pos": "QB",
            "nfl": "WAS",
            "ir": false
          },
          {
            "name": "Emmett Johnson",
            "pos": "RB",
            "nfl": "KC",
            "ir": false
          },
          {
            "name": "Kendre Miller",
            "pos": "RB",
            "nfl": "NO",
            "ir": false
          },
          {
            "name": "Ravens DST",
            "pos": "DST",
            "nfl": "BAL",
            "ir": false
          }
        ]
      },
      {
        "id": 9,
        "name": "Baby Got Dak",
        "abbrev": "ANG",
        "owner": "Along Came Molly",
        "w": 1,
        "l": 2,
        "t": 0,
        "pf": 511.2,
        "pa": 620.1,
        "waivers": 1,
        "you": false,
        "players": [
          {
            "name": "Dak Prescott",
            "pos": "QB",
            "nfl": "DAL",
            "ir": false
          },
          {
            "name": "Brock Purdy",
            "pos": "QB",
            "nfl": "SF",
            "ir": false
          },
          {
            "name": "Jeremiyah Love",
            "pos": "RB",
            "nfl": "ARI",
            "ir": false
          },
          {
            "name": "A.J. Brown",
            "pos": "WR",
            "nfl": "NE",
            "ir": true
          },
          {
            "name": "Jaylen Waddle",
            "pos": "WR",
            "nfl": "DEN",
            "ir": false
          },
          {
            "name": "Rhamondre Stevenson",
            "pos": "RB",
            "nfl": "NE",
            "ir": false
          },
          {
            "name": "Emeka Egbuka",
            "pos": "WR",
            "nfl": "TB",
            "ir": false
          },
          {
            "name": "Jacory Croskey-Merritt",
            "pos": "RB",
            "nfl": "WAS",
            "ir": false
          },
          {
            "name": "Matthew Golden",
            "pos": "WR",
            "nfl": "GB",
            "ir": false
          },
          {
            "name": "Jake Ferguson",
            "pos": "TE",
            "nfl": "DAL",
            "ir": false
          },
          {
            "name": "Malik Willis",
            "pos": "QB",
            "nfl": "MIA",
            "ir": false
          },
          {
            "name": "MarShawn Lloyd",
            "pos": "RB",
            "nfl": "GB",
            "ir": false
          },
          {
            "name": "Xavier Worthy",
            "pos": "WR",
            "nfl": "KC",
            "ir": false
          },
          {
            "name": "Deshaun Watson",
            "pos": "QB",
            "nfl": "CLE",
            "ir": false
          },
          {
            "name": "Denzel Boston",
            "pos": "WR",
            "nfl": "CLE",
            "ir": false
          },
          {
            "name": "Mike Gesicki",
            "pos": "TE",
            "nfl": "CIN",
            "ir": false
          },
          {
            "name": "Adonai Mitchell",
            "pos": "WR",
            "nfl": "NYJ",
            "ir": false
          },
          {
            "name": "Alvin Kamara",
            "pos": "RB",
            "nfl": "NO",
            "ir": false
          },
          {
            "name": "Bengals DST",
            "pos": "DST",
            "nfl": "CIN",
            "ir": false
          }
        ]
      },
      {
        "id": 10,
        "name": "Nabers think im sellin dope ",
        "abbrev": "NSD",
        "owner": "ESPNFAN4712698577",
        "w": 2,
        "l": 1,
        "t": 0,
        "pf": 666.2,
        "pa": 614.0,
        "waivers": 5,
        "you": false,
        "players": [
          {
            "name": "Jahmyr Gibbs",
            "pos": "RB",
            "nfl": "DET",
            "ir": false
          },
          {
            "name": "Caleb Williams",
            "pos": "QB",
            "nfl": "CHI",
            "ir": false
          },
          {
            "name": "CeeDee Lamb",
            "pos": "WR",
            "nfl": "DAL",
            "ir": false
          },
          {
            "name": "George Pickens",
            "pos": "WR",
            "nfl": "DAL",
            "ir": false
          },
          {
            "name": "Kyren Williams",
            "pos": "RB",
            "nfl": "LAR",
            "ir": false
          },
          {
            "name": "Jameson Williams",
            "pos": "WR",
            "nfl": "DET",
            "ir": false
          },
          {
            "name": "DJ Moore",
            "pos": "WR",
            "nfl": "BUF",
            "ir": false
          },
          {
            "name": "Daniel Jones",
            "pos": "QB",
            "nfl": "IND",
            "ir": false
          },
          {
            "name": "Sam LaPorta",
            "pos": "TE",
            "nfl": "DET",
            "ir": false
          },
          {
            "name": "Kenny Gainwell",
            "pos": "RB",
            "nfl": "TB",
            "ir": false
          },
          {
            "name": "Mike Evans",
            "pos": "WR",
            "nfl": "SF",
            "ir": false
          },
          {
            "name": "Isaiah Likely",
            "pos": "TE",
            "nfl": "NYG",
            "ir": false
          },
          {
            "name": "Makai Lemon",
            "pos": "WR",
            "nfl": "PHI",
            "ir": false
          },
          {
            "name": "Fernando Mendoza",
            "pos": "QB",
            "nfl": "LV",
            "ir": false
          },
          {
            "name": "Kyle Pitts Sr.",
            "pos": "TE",
            "nfl": "ATL",
            "ir": false
          },
          {
            "name": "Seahawks DST",
            "pos": "DST",
            "nfl": "SEA",
            "ir": false
          },
          {
            "name": "Calvin Ridley",
            "pos": "WR",
            "nfl": "TEN",
            "ir": false
          },
          {
            "name": "Kirk Cousins",
            "pos": "QB",
            "nfl": "LV",
            "ir": false
          }
        ]
      },
      {
        "id": 11,
        "name": "Do It For State",
        "abbrev": "DIFS",
        "owner": "jennhull86",
        "w": 1,
        "l": 2,
        "t": 0,
        "pf": 541.7,
        "pa": 540.4,
        "waivers": 3,
        "you": false,
        "players": [
          {
            "name": "Jayden Daniels",
            "pos": "QB",
            "nfl": "WAS",
            "ir": false
          },
          {
            "name": "Jonathan Taylor",
            "pos": "RB",
            "nfl": "IND",
            "ir": false
          },
          {
            "name": "Drake London",
            "pos": "WR",
            "nfl": "ATL",
            "ir": false
          },
          {
            "name": "Nico Collins",
            "pos": "WR",
            "nfl": "HOU",
            "ir": false
          },
          {
            "name": "Javonte Williams",
            "pos": "RB",
            "nfl": "DAL",
            "ir": false
          },
          {
            "name": "DeVonta Smith",
            "pos": "WR",
            "nfl": "PHI",
            "ir": false
          },
          {
            "name": "Baker Mayfield",
            "pos": "QB",
            "nfl": "TB",
            "ir": true
          },
          {
            "name": "Michael Pittman Jr.",
            "pos": "WR",
            "nfl": "PIT",
            "ir": false
          },
          {
            "name": "Dallas Goedert",
            "pos": "TE",
            "nfl": "PHI",
            "ir": false
          },
          {
            "name": "Tony Pollard",
            "pos": "RB",
            "nfl": "TEN",
            "ir": false
          },
          {
            "name": "Jordan Addison",
            "pos": "WR",
            "nfl": "MIN",
            "ir": false
          },
          {
            "name": "Stefon Diggs",
            "pos": "WR",
            "nfl": "WAS",
            "ir": false
          },
          {
            "name": "Rachaad White",
            "pos": "RB",
            "nfl": "WAS",
            "ir": false
          },
          {
            "name": "Mark Andrews",
            "pos": "TE",
            "nfl": "BAL",
            "ir": false
          },
          {
            "name": "Khalil Shakir",
            "pos": "WR",
            "nfl": "BUF",
            "ir": false
          },
          {
            "name": "Woody Marks",
            "pos": "RB",
            "nfl": "HOU",
            "ir": false
          },
          {
            "name": "Chiefs DST",
            "pos": "DST",
            "nfl": "KC",
            "ir": false
          },
          {
            "name": "Bills DST",
            "pos": "DST",
            "nfl": "BUF",
            "ir": false
          },
          {
            "name": "Kalif Raymond",
            "pos": "WR",
            "nfl": "CHI",
            "ir": false
          }
        ]
      },
      {
        "id": 13,
        "name": "DONKY PUNCHRS",
        "abbrev": "DKPZ",
        "owner": "seanwellington014",
        "w": 2,
        "l": 1,
        "t": 0,
        "pf": 744.9,
        "pa": 562.5,
        "waivers": 10,
        "you": false,
        "players": [
          {
            "name": "Ja'Marr Chase",
            "pos": "WR",
            "nfl": "CIN",
            "ir": false
          },
          {
            "name": "Amon-Ra St. Brown",
            "pos": "WR",
            "nfl": "DET",
            "ir": false
          },
          {
            "name": "Derrick Henry",
            "pos": "RB",
            "nfl": "BAL",
            "ir": false
          },
          {
            "name": "Patrick Mahomes",
            "pos": "QB",
            "nfl": "KC",
            "ir": false
          },
          {
            "name": "Davante Adams",
            "pos": "WR",
            "nfl": "LAR",
            "ir": false
          },
          {
            "name": "D'Andre Swift",
            "pos": "RB",
            "nfl": "CHI",
            "ir": false
          },
          {
            "name": "Jaylen Warren",
            "pos": "RB",
            "nfl": "PIT",
            "ir": false
          },
          {
            "name": "George Kittle",
            "pos": "TE",
            "nfl": "SF",
            "ir": false
          },
          {
            "name": "Matthew Stafford",
            "pos": "QB",
            "nfl": "LAR",
            "ir": false
          },
          {
            "name": "Cam Skattebo",
            "pos": "RB",
            "nfl": "NYG",
            "ir": false
          },
          {
            "name": "Quentin Johnston",
            "pos": "WR",
            "nfl": "LAC",
            "ir": false
          },
          {
            "name": "Josh Jacobs",
            "pos": "RB",
            "nfl": "GB",
            "ir": false
          },
          {
            "name": "Aaron Jones Sr.",
            "pos": "RB",
            "nfl": "MIN",
            "ir": false
          },
          {
            "name": "Aaron Rodgers",
            "pos": "QB",
            "nfl": "PIT",
            "ir": false
          },
          {
            "name": "Juwan Johnson",
            "pos": "TE",
            "nfl": "NO",
            "ir": false
          },
          {
            "name": "Vikings DST",
            "pos": "DST",
            "nfl": "MIN",
            "ir": false
          },
          {
            "name": "Jameis Winston",
            "pos": "QB",
            "nfl": "NYG",
            "ir": false
          },
          {
            "name": "Broncos DST",
            "pos": "DST",
            "nfl": "DEN",
            "ir": false
          }
        ]
      }
    ],
    "matchups": [
      {
        "week": 1,
        "homeId": 3,
        "awayId": 6
      },
      {
        "week": 1,
        "homeId": 8,
        "awayId": 1
      },
      {
        "week": 1,
        "homeId": 10,
        "awayId": 9
      },
      {
        "week": 1,
        "homeId": 2,
        "awayId": 11
      },
      {
        "week": 1,
        "homeId": 7,
        "awayId": 13
      },
      {
        "week": 2,
        "homeId": 6,
        "awayId": 1
      },
      {
        "week": 2,
        "homeId": 9,
        "awayId": 3
      },
      {
        "week": 2,
        "homeId": 11,
        "awayId": 8
      },
      {
        "week": 2,
        "homeId": 13,
        "awayId": 10
      },
      {
        "week": 2,
        "homeId": 7,
        "awayId": 2
      },
      {
        "week": 3,
        "homeId": 9,
        "awayId": 6
      },
      {
        "week": 3,
        "homeId": 1,
        "awayId": 11
      },
      {
        "week": 3,
        "homeId": 3,
        "awayId": 13
      },
      {
        "week": 3,
        "homeId": 8,
        "awayId": 7
      },
      {
        "week": 3,
        "homeId": 10,
        "awayId": 2
      },
      {
        "week": 4,
        "homeId": 6,
        "awayId": 11
      },
      {
        "week": 4,
        "homeId": 13,
        "awayId": 9
      },
      {
        "week": 4,
        "homeId": 7,
        "awayId": 1
      },
      {
        "week": 4,
        "homeId": 2,
        "awayId": 3
      },
      {
        "week": 4,
        "homeId": 10,
        "awayId": 8
      },
      {
        "week": 5,
        "homeId": 13,
        "awayId": 6
      },
      {
        "week": 5,
        "homeId": 11,
        "awayId": 7
      },
      {
        "week": 5,
        "homeId": 9,
        "awayId": 2
      },
      {
        "week": 5,
        "homeId": 1,
        "awayId": 10
      },
      {
        "week": 5,
        "homeId": 3,
        "awayId": 8
      },
      {
        "week": 6,
        "homeId": 6,
        "awayId": 7
      },
      {
        "week": 6,
        "homeId": 2,
        "awayId": 13
      },
      {
        "week": 6,
        "homeId": 10,
        "awayId": 11
      },
      {
        "week": 6,
        "homeId": 8,
        "awayId": 9
      },
      {
        "week": 6,
        "homeId": 3,
        "awayId": 1
      },
      {
        "week": 7,
        "homeId": 2,
        "awayId": 6
      },
      {
        "week": 7,
        "homeId": 7,
        "awayId": 10
      },
      {
        "week": 7,
        "homeId": 13,
        "awayId": 8
      },
      {
        "week": 7,
        "homeId": 11,
        "awayId": 3
      },
      {
        "week": 7,
        "homeId": 9,
        "awayId": 1
      },
      {
        "week": 8,
        "homeId": 6,
        "awayId": 10
      },
      {
        "week": 8,
        "homeId": 8,
        "awayId": 2
      },
      {
        "week": 8,
        "homeId": 3,
        "awayId": 7
      },
      {
        "week": 8,
        "homeId": 1,
        "awayId": 13
      },
      {
        "week": 8,
        "homeId": 9,
        "awayId": 11
      },
      {
        "week": 9,
        "homeId": 8,
        "awayId": 6
      },
      {
        "week": 9,
        "homeId": 10,
        "awayId": 3
      },
      {
        "week": 9,
        "homeId": 2,
        "awayId": 1
      },
      {
        "week": 9,
        "homeId": 7,
        "awayId": 9
      },
      {
        "week": 9,
        "homeId": 13,
        "awayId": 11
      },
      {
        "week": 10,
        "homeId": 6,
        "awayId": 3
      },
      {
        "week": 10,
        "homeId": 1,
        "awayId": 8
      },
      {
        "week": 10,
        "homeId": 9,
        "awayId": 10
      },
      {
        "week": 10,
        "homeId": 11,
        "awayId": 2
      },
      {
        "week": 10,
        "homeId": 13,
        "awayId": 7
      },
      {
        "week": 11,
        "homeId": 1,
        "awayId": 6
      },
      {
        "week": 11,
        "homeId": 3,
        "awayId": 9
      },
      {
        "week": 11,
        "homeId": 8,
        "awayId": 11
      },
      {
        "week": 11,
        "homeId": 10,
        "awayId": 13
      },
      {
        "week": 11,
        "homeId": 2,
        "awayId": 7
      },
      {
        "week": 12,
        "homeId": 6,
        "awayId": 9
      },
      {
        "week": 12,
        "homeId": 11,
        "awayId": 1
      },
      {
        "week": 12,
        "homeId": 13,
        "awayId": 3
      },
      {
        "week": 12,
        "homeId": 7,
        "awayId": 8
      },
      {
        "week": 12,
        "homeId": 2,
        "awayId": 10
      },
      {
        "week": 13,
        "homeId": 11,
        "awayId": 6
      },
      {
        "week": 13,
        "homeId": 9,
        "awayId": 13
      },
      {
        "week": 13,
        "homeId": 1,
        "awayId": 7
      },
      {
        "week": 13,
        "homeId": 3,
        "awayId": 2
      },
      {
        "week": 13,
        "homeId": 8,
        "awayId": 10
      },
      {
        "week": 14,
        "homeId": 6,
        "awayId": 13
      },
      {
        "week": 14,
        "homeId": 7,
        "awayId": 11
      },
      {
        "week": 14,
        "homeId": 2,
        "awayId": 9
      },
      {
        "week": 14,
        "homeId": 10,
        "awayId": 1
      },
      {
        "week": 14,
        "homeId": 8,
        "awayId": 3
      }
    ]
  },
  {
    "espnLeagueId": "210326445",
    "name": "TW Fantasy",
    "season": 2026,
    "week": 4,
    "myTeamId": 1,
    "keepersLocked": false,
    "teams": [
      {
        "id": 1,
        "name": "Utility Man",
        "abbrev": "GRID",
        "owner": "DJ Alberty",
        "w": 0,
        "l": 3,
        "t": 0,
        "pf": 439.9,
        "pa": 631.9,
        "waivers": 9,
        "you": true,
        "players": [
          {
            "name": "Drake Maye",
            "pos": "QB",
            "nfl": "NE",
            "ir": false
          },
          {
            "name": "Ashton Jeanty",
            "pos": "RB",
            "nfl": "LV",
            "ir": false
          },
          {
            "name": "Malik Nabers",
            "pos": "WR",
            "nfl": "NYG",
            "ir": false
          },
          {
            "name": "Tetairoa McMillan",
            "pos": "WR",
            "nfl": "CAR",
            "ir": false
          },
          {
            "name": "Rhamondre Stevenson",
            "pos": "RB",
            "nfl": "NE",
            "ir": false
          },
          {
            "name": "Tyler Warren",
            "pos": "TE",
            "nfl": "IND",
            "ir": false
          },
          {
            "name": "Carnell Tate",
            "pos": "WR",
            "nfl": "TEN",
            "ir": false
          },
          {
            "name": "Alec Pierce",
            "pos": "WR",
            "nfl": "IND",
            "ir": false
          },
          {
            "name": "Jacory Croskey-Merritt",
            "pos": "RB",
            "nfl": "WAS",
            "ir": false
          },
          {
            "name": "Jordan Mason",
            "pos": "RB",
            "nfl": "MIN",
            "ir": false
          },
          {
            "name": "Romeo Doubs",
            "pos": "WR",
            "nfl": "NE",
            "ir": false
          },
          {
            "name": "Cam Ward",
            "pos": "QB",
            "nfl": "TEN",
            "ir": false
          },
          {
            "name": "Zach Charbonnet",
            "pos": "RB",
            "nfl": "SEA",
            "ir": false
          },
          {
            "name": "Jordyn Tyson",
            "pos": "WR",
            "nfl": "NO",
            "ir": true
          },
          {
            "name": "Patriots DST",
            "pos": "DST",
            "nfl": "NE",
            "ir": false
          },
          {
            "name": "Alvin Kamara",
            "pos": "RB",
            "nfl": "NO",
            "ir": false
          },
          {
            "name": "Dalton Schultz",
            "pos": "TE",
            "nfl": "HOU",
            "ir": false
          },
          {
            "name": "Geno Smith",
            "pos": "QB",
            "nfl": "NYJ",
            "ir": false
          },
          {
            "name": "Vikings DST",
            "pos": "DST",
            "nfl": "MIN",
            "ir": false
          }
        ]
      },
      {
        "id": 2,
        "name": "Light Duties",
        "abbrev": "PC",
        "owner": "ppcoco",
        "w": 1,
        "l": 2,
        "t": 0,
        "pf": 598.4,
        "pa": 556.8,
        "waivers": 5,
        "you": false,
        "players": [
          {
            "name": "Jahmyr Gibbs",
            "pos": "RB",
            "nfl": "DET",
            "ir": false
          },
          {
            "name": "Bo Nix",
            "pos": "QB",
            "nfl": "DEN",
            "ir": false
          },
          {
            "name": "Justin Herbert",
            "pos": "QB",
            "nfl": "LAC",
            "ir": false
          },
          {
            "name": "Kyren Williams",
            "pos": "RB",
            "nfl": "LAR",
            "ir": false
          },
          {
            "name": "Davante Adams",
            "pos": "WR",
            "nfl": "LAR",
            "ir": false
          },
          {
            "name": "DJ Moore",
            "pos": "WR",
            "nfl": "BUF",
            "ir": false
          },
          {
            "name": "Courtland Sutton",
            "pos": "WR",
            "nfl": "DEN",
            "ir": false
          },
          {
            "name": "Sam Darnold",
            "pos": "QB",
            "nfl": "SEA",
            "ir": false
          },
          {
            "name": "Dallas Goedert",
            "pos": "TE",
            "nfl": "PHI",
            "ir": false
          },
          {
            "name": "Kenny Gainwell",
            "pos": "RB",
            "nfl": "TB",
            "ir": false
          },
          {
            "name": "Mark Andrews",
            "pos": "TE",
            "nfl": "BAL",
            "ir": false
          },
          {
            "name": "Xavier Worthy",
            "pos": "WR",
            "nfl": "KC",
            "ir": false
          },
          {
            "name": "Deebo Samuel Sr.",
            "pos": "WR",
            "nfl": "SF",
            "ir": false
          },
          {
            "name": "Tyjae Spears",
            "pos": "RB",
            "nfl": "TEN",
            "ir": false
          },
          {
            "name": "Lions DST",
            "pos": "DST",
            "nfl": "DET",
            "ir": false
          },
          {
            "name": "Adonai Mitchell",
            "pos": "WR",
            "nfl": "NYJ",
            "ir": false
          },
          {
            "name": "Dylan Sampson",
            "pos": "RB",
            "nfl": "CLE",
            "ir": false
          },
          {
            "name": "Cole Kmet",
            "pos": "TE",
            "nfl": "CHI",
            "ir": false
          }
        ]
      },
      {
        "id": 4,
        "name": "breKOHLner",
        "abbrev": "JLK",
        "owner": "J. Kohlenbrener",
        "w": 1,
        "l": 1,
        "t": 0,
        "pf": 406.2,
        "pa": 499.9,
        "waivers": 6,
        "you": false,
        "players": [
          {
            "name": "Jaxon Smith-Njigba",
            "pos": "WR",
            "nfl": "SEA",
            "ir": false
          },
          {
            "name": "Jonathan Taylor",
            "pos": "RB",
            "nfl": "IND",
            "ir": false
          },
          {
            "name": "Saquon Barkley",
            "pos": "RB",
            "nfl": "PHI",
            "ir": false
          },
          {
            "name": "Brock Purdy",
            "pos": "QB",
            "nfl": "SF",
            "ir": false
          },
          {
            "name": "Colston Loveland",
            "pos": "TE",
            "nfl": "CHI",
            "ir": false
          },
          {
            "name": "Jaylen Waddle",
            "pos": "WR",
            "nfl": "DEN",
            "ir": false
          },
          {
            "name": "Bhayshul Tuten",
            "pos": "RB",
            "nfl": "JAC",
            "ir": false
          },
          {
            "name": "Parker Washington",
            "pos": "WR",
            "nfl": "JAC",
            "ir": false
          },
          {
            "name": "MarShawn Lloyd",
            "pos": "RB",
            "nfl": "GB",
            "ir": false
          },
          {
            "name": "De'Zhaun Stribling",
            "pos": "WR",
            "nfl": "SF",
            "ir": false
          },
          {
            "name": "Stefon Diggs",
            "pos": "WR",
            "nfl": "WAS",
            "ir": false
          },
          {
            "name": "Aaron Jones Sr.",
            "pos": "RB",
            "nfl": "MIN",
            "ir": false
          },
          {
            "name": "Fernando Mendoza",
            "pos": "QB",
            "nfl": "LV",
            "ir": false
          },
          {
            "name": "Josh Downs",
            "pos": "WR",
            "nfl": "IND",
            "ir": false
          },
          {
            "name": "Denzel Boston",
            "pos": "WR",
            "nfl": "CLE",
            "ir": false
          },
          {
            "name": "Jonah Coleman",
            "pos": "RB",
            "nfl": "DEN",
            "ir": false
          },
          {
            "name": "Bears DST",
            "pos": "DST",
            "nfl": "CHI",
            "ir": false
          },
          {
            "name": "Tank Dell",
            "pos": "WR",
            "nfl": "HOU",
            "ir": true
          },
          {
            "name": "Michael Penix Jr.",
            "pos": "QB",
            "nfl": "ATL",
            "ir": false
          }
        ]
      },
      {
        "id": 5,
        "name": "Kittle Miss Sunshine",
        "abbrev": "JC",
        "owner": "jazzy0000",
        "w": 1,
        "l": 2,
        "t": 0,
        "pf": 556.8,
        "pa": 598.4,
        "waivers": 3,
        "you": false,
        "players": [
          {
            "name": "Ja'Marr Chase",
            "pos": "WR",
            "nfl": "CIN",
            "ir": false
          },
          {
            "name": "Nico Collins",
            "pos": "WR",
            "nfl": "HOU",
            "ir": true
          },
          {
            "name": "Patrick Mahomes",
            "pos": "QB",
            "nfl": "KC",
            "ir": false
          },
          {
            "name": "Garrett Wilson",
            "pos": "WR",
            "nfl": "NYJ",
            "ir": false
          },
          {
            "name": "Quinshon Judkins",
            "pos": "RB",
            "nfl": "CLE",
            "ir": false
          },
          {
            "name": "George Kittle",
            "pos": "TE",
            "nfl": "SF",
            "ir": false
          },
          {
            "name": "Tony Pollard",
            "pos": "RB",
            "nfl": "TEN",
            "ir": false
          },
          {
            "name": "Rams DST",
            "pos": "DST",
            "nfl": "LAR",
            "ir": false
          },
          {
            "name": "Chuba Hubbard",
            "pos": "RB",
            "nfl": "CAR",
            "ir": false
          },
          {
            "name": "Wan'Dale Robinson",
            "pos": "WR",
            "nfl": "TEN",
            "ir": false
          },
          {
            "name": "Kyle Monangai",
            "pos": "RB",
            "nfl": "CHI",
            "ir": false
          },
          {
            "name": "Rachaad White",
            "pos": "RB",
            "nfl": "WAS",
            "ir": false
          },
          {
            "name": "Keenan Allen",
            "pos": "WR",
            "nfl": "IND",
            "ir": false
          },
          {
            "name": "Kirk Cousins",
            "pos": "QB",
            "nfl": "LV",
            "ir": false
          },
          {
            "name": "Devaughn Vele",
            "pos": "WR",
            "nfl": "NO",
            "ir": false
          },
          {
            "name": "Marcus Mariota",
            "pos": "QB",
            "nfl": "WAS",
            "ir": false
          },
          {
            "name": "Malik Washington",
            "pos": "WR",
            "nfl": "MIA",
            "ir": false
          },
          {
            "name": "Emanuel Wilson",
            "pos": "RB",
            "nfl": "SEA",
            "ir": false
          },
          {
            "name": "Case Keenum",
            "pos": "QB",
            "nfl": "CHI",
            "ir": false
          }
        ]
      },
      {
        "id": 7,
        "name": "KTischler",
        "abbrev": "KT",
        "owner": "KTischler",
        "w": 3,
        "l": 0,
        "t": 0,
        "pf": 540.3,
        "pa": 404.8,
        "waivers": 11,
        "you": false,
        "players": [
          {
            "name": "Christian McCaffrey",
            "pos": "RB",
            "nfl": "SF",
            "ir": false
          },
          {
            "name": "CeeDee Lamb",
            "pos": "WR",
            "nfl": "DAL",
            "ir": false
          },
          {
            "name": "Dak Prescott",
            "pos": "QB",
            "nfl": "DAL",
            "ir": false
          },
          {
            "name": "Matthew Stafford",
            "pos": "QB",
            "nfl": "LAR",
            "ir": false
          },
          {
            "name": "David Montgomery",
            "pos": "RB",
            "nfl": "HOU",
            "ir": false
          },
          {
            "name": "Ladd McConkey",
            "pos": "WR",
            "nfl": "LAC",
            "ir": false
          },
          {
            "name": "Jameson Williams",
            "pos": "WR",
            "nfl": "DET",
            "ir": false
          },
          {
            "name": "Kyle Pitts Sr.",
            "pos": "TE",
            "nfl": "ATL",
            "ir": false
          },
          {
            "name": "J.K. Dobbins",
            "pos": "RB",
            "nfl": "DEN",
            "ir": false
          },
          {
            "name": "Seahawks DST",
            "pos": "DST",
            "nfl": "SEA",
            "ir": false
          },
          {
            "name": "Khalil Shakir",
            "pos": "WR",
            "nfl": "BUF",
            "ir": false
          },
          {
            "name": "Josh Jacobs",
            "pos": "RB",
            "nfl": "GB",
            "ir": false
          },
          {
            "name": "Makai Lemon",
            "pos": "WR",
            "nfl": "PHI",
            "ir": false
          },
          {
            "name": "Aaron Rodgers",
            "pos": "QB",
            "nfl": "PIT",
            "ir": false
          },
          {
            "name": "Mike Washington Jr.",
            "pos": "RB",
            "nfl": "LV",
            "ir": false
          },
          {
            "name": "Kaelon Black",
            "pos": "RB",
            "nfl": "SF",
            "ir": false
          },
          {
            "name": "Ja'Kobi Lane",
            "pos": "WR",
            "nfl": "BAL",
            "ir": true
          },
          {
            "name": "Jaylen Wright",
            "pos": "RB",
            "nfl": "MIA",
            "ir": false
          },
          {
            "name": "Kenyon Sadiq",
            "pos": "TE",
            "nfl": "NYJ",
            "ir": false
          }
        ]
      },
      {
        "id": 8,
        "name": "Current State",
        "abbrev": "SST",
        "owner": "espn45809475",
        "w": 3,
        "l": 0,
        "t": 0,
        "pf": 575.5,
        "pa": 473.8,
        "waivers": 10,
        "you": false,
        "players": [
          {
            "name": "Puka Nacua",
            "pos": "WR",
            "nfl": "LAR",
            "ir": false
          },
          {
            "name": "Derrick Henry",
            "pos": "RB",
            "nfl": "BAL",
            "ir": false
          },
          {
            "name": "Omarion Hampton",
            "pos": "RB",
            "nfl": "LAC",
            "ir": false
          },
          {
            "name": "Zay Flowers",
            "pos": "WR",
            "nfl": "BAL",
            "ir": false
          },
          {
            "name": "Cam Skattebo",
            "pos": "RB",
            "nfl": "NYG",
            "ir": false
          },
          {
            "name": "Jared Goff",
            "pos": "QB",
            "nfl": "DET",
            "ir": false
          },
          {
            "name": "Sam LaPorta",
            "pos": "TE",
            "nfl": "DET",
            "ir": false
          },
          {
            "name": "Rico Dowdle",
            "pos": "RB",
            "nfl": "PIT",
            "ir": false
          },
          {
            "name": "Jordan Addison",
            "pos": "WR",
            "nfl": "MIN",
            "ir": false
          },
          {
            "name": "KC Concepcion",
            "pos": "WR",
            "nfl": "CLE",
            "ir": false
          },
          {
            "name": "Woody Marks",
            "pos": "RB",
            "nfl": "HOU",
            "ir": false
          },
          {
            "name": "Travis Kelce",
            "pos": "TE",
            "nfl": "KC",
            "ir": false
          },
          {
            "name": "Deshaun Watson",
            "pos": "QB",
            "nfl": "CLE",
            "ir": false
          },
          {
            "name": "Chargers DST",
            "pos": "DST",
            "nfl": "LAC",
            "ir": false
          },
          {
            "name": "Dontayvion Wicks",
            "pos": "WR",
            "nfl": "PHI",
            "ir": false
          },
          {
            "name": "Demarcus Robinson",
            "pos": "WR",
            "nfl": "SF",
            "ir": false
          },
          {
            "name": "Tyreek Hill",
            "pos": "WR",
            "nfl": "FA",
            "ir": false
          },
          {
            "name": "Ollie Gordon II",
            "pos": "RB",
            "nfl": "MIA",
            "ir": false
          }
        ]
      },
      {
        "id": 9,
        "name": "Do or Die Trying",
        "abbrev": "TTT",
        "owner": "TSHosmer",
        "w": 2,
        "l": 0,
        "t": 0,
        "pf": 479.2,
        "pa": 351.4,
        "waivers": 8,
        "you": false,
        "players": [
          {
            "name": "Bijan Robinson",
            "pos": "RB",
            "nfl": "ATL",
            "ir": false
          },
          {
            "name": "James Cook III",
            "pos": "RB",
            "nfl": "BUF",
            "ir": false
          },
          {
            "name": "Trey McBride",
            "pos": "TE",
            "nfl": "ARI",
            "ir": false
          },
          {
            "name": "Chris Olave",
            "pos": "WR",
            "nfl": "NO",
            "ir": false
          },
          {
            "name": "DeVonta Smith",
            "pos": "WR",
            "nfl": "PHI",
            "ir": false
          },
          {
            "name": "Tee Higgins",
            "pos": "WR",
            "nfl": "CIN",
            "ir": false
          },
          {
            "name": "Jaylen Warren",
            "pos": "RB",
            "nfl": "PIT",
            "ir": false
          },
          {
            "name": "Jordan Love",
            "pos": "QB",
            "nfl": "GB",
            "ir": false
          },
          {
            "name": "Texans DST",
            "pos": "DST",
            "nfl": "HOU",
            "ir": false
          },
          {
            "name": "C.J. Stroud",
            "pos": "QB",
            "nfl": "HOU",
            "ir": false
          },
          {
            "name": "Matthew Golden",
            "pos": "WR",
            "nfl": "GB",
            "ir": false
          },
          {
            "name": "RJ Harvey",
            "pos": "RB",
            "nfl": "DEN",
            "ir": false
          },
          {
            "name": "Bryce Young",
            "pos": "QB",
            "nfl": "CAR",
            "ir": false
          },
          {
            "name": "Chris Godwin Jr.",
            "pos": "WR",
            "nfl": "TB",
            "ir": false
          },
          {
            "name": "Tyler Allgeier",
            "pos": "RB",
            "nfl": "ARI",
            "ir": false
          },
          {
            "name": "Brenton Strange",
            "pos": "TE",
            "nfl": "JAC",
            "ir": false
          },
          {
            "name": "Keaton Mitchell",
            "pos": "RB",
            "nfl": "LAC",
            "ir": false
          },
          {
            "name": "Rashod Bateman",
            "pos": "WR",
            "nfl": "BAL",
            "ir": false
          }
        ]
      },
      {
        "id": 10,
        "name": "Hub\u2019sHardCount",
        "abbrev": "HUb",
        "owner": "ESPNFAN8970635387",
        "w": 0,
        "l": 2,
        "t": 0,
        "pf": 309.4,
        "pa": 434.4,
        "waivers": 1,
        "you": false,
        "players": [
          {
            "name": "Joe Burrow",
            "pos": "QB",
            "nfl": "CIN",
            "ir": false
          },
          {
            "name": "Trevor Lawrence",
            "pos": "QB",
            "nfl": "JAC",
            "ir": false
          },
          {
            "name": "Rashee Rice",
            "pos": "WR",
            "nfl": "KC",
            "ir": false
          },
          {
            "name": "Chase Brown",
            "pos": "RB",
            "nfl": "CIN",
            "ir": false
          },
          {
            "name": "George Pickens",
            "pos": "WR",
            "nfl": "DAL",
            "ir": false
          },
          {
            "name": "Steelers DST",
            "pos": "DST",
            "nfl": "PIT",
            "ir": false
          },
          {
            "name": "Jadarian Price",
            "pos": "RB",
            "nfl": "SEA",
            "ir": false
          },
          {
            "name": "DK Metcalf",
            "pos": "WR",
            "nfl": "PIT",
            "ir": false
          },
          {
            "name": "Daniel Jones",
            "pos": "QB",
            "nfl": "IND",
            "ir": false
          },
          {
            "name": "Jake Ferguson",
            "pos": "TE",
            "nfl": "DAL",
            "ir": false
          },
          {
            "name": "Brian Thomas Jr.",
            "pos": "WR",
            "nfl": "JAC",
            "ir": false
          },
          {
            "name": "Blake Corum",
            "pos": "RB",
            "nfl": "LAR",
            "ir": false
          },
          {
            "name": "T.J. Hockenson",
            "pos": "TE",
            "nfl": "MIN",
            "ir": false
          },
          {
            "name": "Rashid Shaheed",
            "pos": "WR",
            "nfl": "SEA",
            "ir": false
          },
          {
            "name": "Juwan Johnson",
            "pos": "TE",
            "nfl": "NO",
            "ir": false
          },
          {
            "name": "Tre Tucker",
            "pos": "WR",
            "nfl": "LV",
            "ir": false
          },
          {
            "name": "Tua Tagovailoa",
            "pos": "QB",
            "nfl": "ATL",
            "ir": false
          },
          {
            "name": "Tank Bigsby",
            "pos": "RB",
            "nfl": "PHI",
            "ir": false
          }
        ]
      },
      {
        "id": 11,
        "name": "Daniel's Driven Team",
        "abbrev": "DDT",
        "owner": "ESPNFAN0808212593",
        "w": 1,
        "l": 2,
        "t": 0,
        "pf": 577.6,
        "pa": 550.3,
        "waivers": 4,
        "you": false,
        "players": [
          {
            "name": "Josh Allen",
            "pos": "QB",
            "nfl": "BUF",
            "ir": false
          },
          {
            "name": "Justin Jefferson",
            "pos": "WR",
            "nfl": "MIN",
            "ir": false
          },
          {
            "name": "Drake London",
            "pos": "WR",
            "nfl": "ATL",
            "ir": false
          },
          {
            "name": "Caleb Williams",
            "pos": "QB",
            "nfl": "CHI",
            "ir": false
          },
          {
            "name": "Breece Hall",
            "pos": "RB",
            "nfl": "NYJ",
            "ir": false
          },
          {
            "name": "Bucky Irving",
            "pos": "RB",
            "nfl": "TB",
            "ir": false
          },
          {
            "name": "D'Andre Swift",
            "pos": "RB",
            "nfl": "CHI",
            "ir": false
          },
          {
            "name": "Michael Pittman Jr.",
            "pos": "WR",
            "nfl": "PIT",
            "ir": false
          },
          {
            "name": "Tyler Shough",
            "pos": "QB",
            "nfl": "NO",
            "ir": false
          },
          {
            "name": "Tucker Kraft",
            "pos": "TE",
            "nfl": "GB",
            "ir": false
          },
          {
            "name": "Christian Watson",
            "pos": "WR",
            "nfl": "GB",
            "ir": false
          },
          {
            "name": "Jayden Reed",
            "pos": "WR",
            "nfl": "GB",
            "ir": false
          },
          {
            "name": "Isaiah Likely",
            "pos": "TE",
            "nfl": "NYG",
            "ir": false
          },
          {
            "name": "Jalen Coker",
            "pos": "WR",
            "nfl": "CAR",
            "ir": false
          },
          {
            "name": "Jalen McMillan",
            "pos": "WR",
            "nfl": "TB",
            "ir": false
          },
          {
            "name": "Eagles DST",
            "pos": "DST",
            "nfl": "PHI",
            "ir": false
          },
          {
            "name": "Caleb Douglas",
            "pos": "WR",
            "nfl": "MIA",
            "ir": false
          },
          {
            "name": "Najee Harris",
            "pos": "RB",
            "nfl": "NYG",
            "ir": false
          }
        ]
      },
      {
        "id": 12,
        "name": "B-rad's Brilliant Team",
        "abbrev": "BBT",
        "owner": "hockeyboy142",
        "w": 1,
        "l": 2,
        "t": 0,
        "pf": 540.3,
        "pa": 583.9,
        "waivers": 2,
        "you": false,
        "players": [
          {
            "name": "Lamar Jackson",
            "pos": "QB",
            "nfl": "BAL",
            "ir": false
          },
          {
            "name": "Jalen Hurts",
            "pos": "QB",
            "nfl": "PHI",
            "ir": false
          },
          {
            "name": "Kenneth Walker III",
            "pos": "RB",
            "nfl": "KC",
            "ir": false
          },
          {
            "name": "Brock Bowers",
            "pos": "TE",
            "nfl": "LV",
            "ir": false
          },
          {
            "name": "Travis Etienne Jr.",
            "pos": "RB",
            "nfl": "NO",
            "ir": false
          },
          {
            "name": "Emeka Egbuka",
            "pos": "WR",
            "nfl": "TB",
            "ir": false
          },
          {
            "name": "Rome Odunze",
            "pos": "WR",
            "nfl": "CHI",
            "ir": false
          },
          {
            "name": "Luther Burden III",
            "pos": "WR",
            "nfl": "CHI",
            "ir": false
          },
          {
            "name": "Jonathon Brooks",
            "pos": "RB",
            "nfl": "CAR",
            "ir": false
          },
          {
            "name": "Baker Mayfield",
            "pos": "QB",
            "nfl": "TB",
            "ir": false
          },
          {
            "name": "Michael Wilson",
            "pos": "WR",
            "nfl": "ARI",
            "ir": false
          },
          {
            "name": "Jakobi Meyers",
            "pos": "WR",
            "nfl": "JAC",
            "ir": false
          },
          {
            "name": "Quentin Johnston",
            "pos": "WR",
            "nfl": "LAC",
            "ir": false
          },
          {
            "name": "Dalton Kincaid",
            "pos": "TE",
            "nfl": "BUF",
            "ir": false
          },
          {
            "name": "Ravens DST",
            "pos": "DST",
            "nfl": "BAL",
            "ir": false
          },
          {
            "name": "Travis Hunter",
            "pos": "WR",
            "nfl": "JAC",
            "ir": false
          },
          {
            "name": "Chiefs DST",
            "pos": "DST",
            "nfl": "KC",
            "ir": false
          },
          {
            "name": "Braelon Allen",
            "pos": "RB",
            "nfl": "NYJ",
            "ir": false
          }
        ]
      },
      {
        "id": 13,
        "name": "Charlie's Competitive Team",
        "abbrev": "CCT",
        "owner": "charliebasketballpro",
        "w": 2,
        "l": 1,
        "t": 0,
        "pf": 510.0,
        "pa": 448.1,
        "waivers": 7,
        "you": false,
        "players": [
          {
            "name": "Jayden Daniels",
            "pos": "QB",
            "nfl": "WAS",
            "ir": false
          },
          {
            "name": "Amon-Ra St. Brown",
            "pos": "WR",
            "nfl": "DET",
            "ir": false
          },
          {
            "name": "Jeremiyah Love",
            "pos": "RB",
            "nfl": "ARI",
            "ir": false
          },
          {
            "name": "A.J. Brown",
            "pos": "WR",
            "nfl": "NE",
            "ir": false
          },
          {
            "name": "Javonte Williams",
            "pos": "RB",
            "nfl": "DAL",
            "ir": false
          },
          {
            "name": "Terry McLaurin",
            "pos": "WR",
            "nfl": "WAS",
            "ir": false
          },
          {
            "name": "Kyler Murray",
            "pos": "QB",
            "nfl": "MIN",
            "ir": false
          },
          {
            "name": "Harold Fannin Jr.",
            "pos": "TE",
            "nfl": "CLE",
            "ir": false
          },
          {
            "name": "Marvin Harrison Jr.",
            "pos": "WR",
            "nfl": "ARI",
            "ir": false
          },
          {
            "name": "TreVeyon Henderson",
            "pos": "RB",
            "nfl": "NE",
            "ir": false
          },
          {
            "name": "Mike Evans",
            "pos": "WR",
            "nfl": "SF",
            "ir": false
          },
          {
            "name": "Malik Willis",
            "pos": "QB",
            "nfl": "MIA",
            "ir": false
          },
          {
            "name": "Jacoby Brissett",
            "pos": "QB",
            "nfl": "ARI",
            "ir": false
          },
          {
            "name": "Hunter Henry",
            "pos": "TE",
            "nfl": "NE",
            "ir": false
          },
          {
            "name": "Broncos DST",
            "pos": "DST",
            "nfl": "DEN",
            "ir": false
          },
          {
            "name": "Brian Robinson Jr.",
            "pos": "RB",
            "nfl": "ATL",
            "ir": false
          },
          {
            "name": "Browns DST",
            "pos": "DST",
            "nfl": "CLE",
            "ir": false
          },
          {
            "name": "Ray Davis",
            "pos": "RB",
            "nfl": "BUF",
            "ir": false
          }
        ]
      }
    ],
    "matchups": [
      {
        "week": 1,
        "homeId": 11,
        "awayId": 4
      },
      {
        "week": 1,
        "homeId": 1,
        "awayId": 9
      },
      {
        "week": 1,
        "homeId": 12,
        "awayId": 5
      },
      {
        "week": 1,
        "homeId": 2,
        "awayId": 8
      },
      {
        "week": 1,
        "homeId": 13,
        "awayId": 7
      },
      {
        "week": 2,
        "homeId": 9,
        "awayId": 10
      },
      {
        "week": 2,
        "homeId": 5,
        "awayId": 11
      },
      {
        "week": 2,
        "homeId": 8,
        "awayId": 1
      },
      {
        "week": 2,
        "homeId": 7,
        "awayId": 12
      },
      {
        "week": 2,
        "homeId": 13,
        "awayId": 2
      },
      {
        "week": 3,
        "homeId": 4,
        "awayId": 5
      },
      {
        "week": 3,
        "homeId": 10,
        "awayId": 8
      },
      {
        "week": 3,
        "homeId": 11,
        "awayId": 7
      },
      {
        "week": 3,
        "homeId": 1,
        "awayId": 13
      },
      {
        "week": 3,
        "homeId": 12,
        "awayId": 2
      },
      {
        "week": 4,
        "homeId": 8,
        "awayId": 9
      },
      {
        "week": 4,
        "homeId": 7,
        "awayId": 4
      },
      {
        "week": 4,
        "homeId": 13,
        "awayId": 10
      },
      {
        "week": 4,
        "homeId": 2,
        "awayId": 11
      },
      {
        "week": 4,
        "homeId": 12,
        "awayId": 1
      },
      {
        "week": 5,
        "homeId": 5,
        "awayId": 7
      },
      {
        "week": 5,
        "homeId": 9,
        "awayId": 13
      },
      {
        "week": 5,
        "homeId": 4,
        "awayId": 2
      },
      {
        "week": 5,
        "homeId": 10,
        "awayId": 12
      },
      {
        "week": 5,
        "homeId": 11,
        "awayId": 1
      },
      {
        "week": 6,
        "homeId": 13,
        "awayId": 8
      },
      {
        "week": 6,
        "homeId": 2,
        "awayId": 5
      },
      {
        "week": 6,
        "homeId": 12,
        "awayId": 9
      },
      {
        "week": 6,
        "homeId": 1,
        "awayId": 4
      },
      {
        "week": 6,
        "homeId": 11,
        "awayId": 10
      },
      {
        "week": 7,
        "homeId": 7,
        "awayId": 2
      },
      {
        "week": 7,
        "homeId": 8,
        "awayId": 12
      },
      {
        "week": 7,
        "homeId": 5,
        "awayId": 1
      },
      {
        "week": 7,
        "homeId": 9,
        "awayId": 11
      },
      {
        "week": 7,
        "homeId": 4,
        "awayId": 10
      },
      {
        "week": 8,
        "homeId": 12,
        "awayId": 13
      },
      {
        "week": 8,
        "homeId": 1,
        "awayId": 7
      },
      {
        "week": 8,
        "homeId": 11,
        "awayId": 8
      },
      {
        "week": 8,
        "homeId": 10,
        "awayId": 5
      },
      {
        "week": 8,
        "homeId": 4,
        "awayId": 9
      },
      {
        "week": 9,
        "homeId": 2,
        "awayId": 1
      },
      {
        "week": 9,
        "homeId": 13,
        "awayId": 11
      },
      {
        "week": 9,
        "homeId": 7,
        "awayId": 10
      },
      {
        "week": 9,
        "homeId": 8,
        "awayId": 4
      },
      {
        "week": 9,
        "homeId": 5,
        "awayId": 9
      },
      {
        "week": 10,
        "homeId": 11,
        "awayId": 12
      },
      {
        "week": 10,
        "homeId": 10,
        "awayId": 2
      },
      {
        "week": 10,
        "homeId": 4,
        "awayId": 13
      },
      {
        "week": 10,
        "homeId": 9,
        "awayId": 7
      },
      {
        "week": 10,
        "homeId": 5,
        "awayId": 8
      },
      {
        "week": 11,
        "homeId": 1,
        "awayId": 10
      },
      {
        "week": 11,
        "homeId": 12,
        "awayId": 4
      },
      {
        "week": 11,
        "homeId": 2,
        "awayId": 9
      },
      {
        "week": 11,
        "homeId": 13,
        "awayId": 5
      },
      {
        "week": 11,
        "homeId": 7,
        "awayId": 8
      },
      {
        "week": 12,
        "homeId": 4,
        "awayId": 11
      },
      {
        "week": 12,
        "homeId": 9,
        "awayId": 1
      },
      {
        "week": 12,
        "homeId": 5,
        "awayId": 12
      },
      {
        "week": 12,
        "homeId": 8,
        "awayId": 2
      },
      {
        "week": 12,
        "homeId": 7,
        "awayId": 13
      },
      {
        "week": 13,
        "homeId": 10,
        "awayId": 9
      },
      {
        "week": 13,
        "homeId": 11,
        "awayId": 5
      },
      {
        "week": 13,
        "homeId": 1,
        "awayId": 8
      },
      {
        "week": 13,
        "homeId": 12,
        "awayId": 7
      },
      {
        "week": 13,
        "homeId": 2,
        "awayId": 13
      },
      {
        "week": 14,
        "homeId": 5,
        "awayId": 4
      },
      {
        "week": 14,
        "homeId": 8,
        "awayId": 10
      },
      {
        "week": 14,
        "homeId": 7,
        "awayId": 11
      },
      {
        "week": 14,
        "homeId": 13,
        "awayId": 1
      },
      {
        "week": 14,
        "homeId": 2,
        "awayId": 12
      }
    ]
  }
];

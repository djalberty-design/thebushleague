import type { Pos } from "./types";

export interface TapePick {
  overall: number;
  round: number;
  pick: number;
  teamId: number;
  name: string;
  pos: Pos | "K";
  keeper: boolean;
}

export interface TapeMove {
  action: string;
  name: string;
}

export interface TapeActivity {
  kind: string;
  status: string;
  teamId: number;
  at: number;
  moves: TapeMove[];
}

export interface TapeAgent {
  name: string;
  pos: Pos;
  nfl: string;
  owned: number;
  waiver: boolean;
}

export interface TapeSlot {
  teamId: number;
  name: string;
  slot: string;
}

export interface LeagueTape {
  picks: TapePick[];
  activity: TapeActivity[];
  freeAgents: TapeAgent[];
  slots: TapeSlot[];
}

export const ESPN_TAPE = {
  "1014874": {
    "picks": [
      {
        "overall": 1,
        "round": 1,
        "pick": 1,
        "teamId": 3,
        "name": "Josh Allen",
        "pos": "QB",
        "keeper": false
      },
      {
        "overall": 2,
        "round": 1,
        "pick": 2,
        "teamId": 10,
        "name": "Jahmyr Gibbs",
        "pos": "RB",
        "keeper": false
      },
      {
        "overall": 3,
        "round": 1,
        "pick": 3,
        "teamId": 6,
        "name": "Lamar Jackson",
        "pos": "QB",
        "keeper": false
      },
      {
        "overall": 4,
        "round": 1,
        "pick": 4,
        "teamId": 11,
        "name": "Jayden Daniels",
        "pos": "QB",
        "keeper": false
      },
      {
        "overall": 5,
        "round": 1,
        "pick": 5,
        "teamId": 2,
        "name": "Bijan Robinson",
        "pos": "RB",
        "keeper": false
      },
      {
        "overall": 6,
        "round": 1,
        "pick": 6,
        "teamId": 9,
        "name": "Dak Prescott",
        "pos": "QB",
        "keeper": false
      },
      {
        "overall": 7,
        "round": 1,
        "pick": 7,
        "teamId": 7,
        "name": "Puka Nacua",
        "pos": "WR",
        "keeper": false
      },
      {
        "overall": 8,
        "round": 1,
        "pick": 8,
        "teamId": 13,
        "name": "Ja'Marr Chase",
        "pos": "WR",
        "keeper": false
      },
      {
        "overall": 9,
        "round": 1,
        "pick": 9,
        "teamId": 1,
        "name": "Drake Maye",
        "pos": "QB",
        "keeper": false
      },
      {
        "overall": 10,
        "round": 1,
        "pick": 10,
        "teamId": 8,
        "name": "Jaxon Smith-Njigba",
        "pos": "WR",
        "keeper": false
      },
      {
        "overall": 11,
        "round": 2,
        "pick": 1,
        "teamId": 8,
        "name": "Joe Burrow",
        "pos": "QB",
        "keeper": false
      },
      {
        "overall": 12,
        "round": 2,
        "pick": 2,
        "teamId": 1,
        "name": "De'Von Achane",
        "pos": "RB",
        "keeper": false
      },
      {
        "overall": 13,
        "round": 2,
        "pick": 3,
        "teamId": 13,
        "name": "Amon-Ra St. Brown",
        "pos": "WR",
        "keeper": false
      },
      {
        "overall": 14,
        "round": 2,
        "pick": 4,
        "teamId": 7,
        "name": "Christian McCaffrey",
        "pos": "RB",
        "keeper": false
      },
      {
        "overall": 15,
        "round": 2,
        "pick": 5,
        "teamId": 9,
        "name": "Brock Purdy",
        "pos": "QB",
        "keeper": false
      },
      {
        "overall": 16,
        "round": 2,
        "pick": 6,
        "teamId": 2,
        "name": "James Cook III",
        "pos": "RB",
        "keeper": false
      },
      {
        "overall": 17,
        "round": 2,
        "pick": 7,
        "teamId": 11,
        "name": "Jonathan Taylor",
        "pos": "RB",
        "keeper": false
      },
      {
        "overall": 18,
        "round": 2,
        "pick": 8,
        "teamId": 6,
        "name": "Jalen Hurts",
        "pos": "QB",
        "keeper": false
      },
      {
        "overall": 19,
        "round": 2,
        "pick": 9,
        "teamId": 10,
        "name": "Caleb Williams",
        "pos": "QB",
        "keeper": false
      },
      {
        "overall": 20,
        "round": 2,
        "pick": 10,
        "teamId": 3,
        "name": "Bo Nix",
        "pos": "QB",
        "keeper": false
      },
      {
        "overall": 21,
        "round": 3,
        "pick": 1,
        "teamId": 3,
        "name": "Saquon Barkley",
        "pos": "RB",
        "keeper": false
      },
      {
        "overall": 22,
        "round": 3,
        "pick": 2,
        "teamId": 10,
        "name": "CeeDee Lamb",
        "pos": "WR",
        "keeper": false
      },
      {
        "overall": 23,
        "round": 3,
        "pick": 3,
        "teamId": 6,
        "name": "Justin Jefferson",
        "pos": "WR",
        "keeper": false
      },
      {
        "overall": 24,
        "round": 3,
        "pick": 4,
        "teamId": 11,
        "name": "Drake London",
        "pos": "WR",
        "keeper": false
      },
      {
        "overall": 25,
        "round": 3,
        "pick": 5,
        "teamId": 2,
        "name": "Justin Herbert",
        "pos": "QB",
        "keeper": false
      },
      {
        "overall": 26,
        "round": 3,
        "pick": 6,
        "teamId": 9,
        "name": "Jeremiyah Love",
        "pos": "RB",
        "keeper": false
      },
      {
        "overall": 27,
        "round": 3,
        "pick": 7,
        "teamId": 7,
        "name": "Kenneth Walker III",
        "pos": "RB",
        "keeper": false
      },
      {
        "overall": 28,
        "round": 3,
        "pick": 8,
        "teamId": 13,
        "name": "Derrick Henry",
        "pos": "RB",
        "keeper": false
      },
      {
        "overall": 29,
        "round": 3,
        "pick": 9,
        "teamId": 1,
        "name": "Ashton Jeanty",
        "pos": "RB",
        "keeper": false
      },
      {
        "overall": 30,
        "round": 3,
        "pick": 10,
        "teamId": 8,
        "name": "Brock Bowers",
        "pos": "TE",
        "keeper": false
      },
      {
        "overall": 31,
        "round": 4,
        "pick": 1,
        "teamId": 8,
        "name": "Chase Brown",
        "pos": "RB",
        "keeper": false
      },
      {
        "overall": 32,
        "round": 4,
        "pick": 2,
        "teamId": 1,
        "name": "Tetairoa McMillan",
        "pos": "WR",
        "keeper": true
      },
      {
        "overall": 33,
        "round": 4,
        "pick": 3,
        "teamId": 13,
        "name": "Patrick Mahomes",
        "pos": "QB",
        "keeper": false
      },
      {
        "overall": 34,
        "round": 4,
        "pick": 4,
        "teamId": 7,
        "name": "Omarion Hampton",
        "pos": "RB",
        "keeper": false
      },
      {
        "overall": 35,
        "round": 4,
        "pick": 5,
        "teamId": 9,
        "name": "A.J. Brown",
        "pos": "WR",
        "keeper": false
      },
      {
        "overall": 36,
        "round": 4,
        "pick": 6,
        "teamId": 2,
        "name": "Malik Nabers",
        "pos": "WR",
        "keeper": false
      },
      {
        "overall": 37,
        "round": 4,
        "pick": 7,
        "teamId": 11,
        "name": "Nico Collins",
        "pos": "WR",
        "keeper": false
      },
      {
        "overall": 38,
        "round": 4,
        "pick": 8,
        "teamId": 6,
        "name": "Trey McBride",
        "pos": "TE",
        "keeper": false
      },
      {
        "overall": 39,
        "round": 4,
        "pick": 9,
        "teamId": 10,
        "name": "George Pickens",
        "pos": "WR",
        "keeper": false
      },
      {
        "overall": 40,
        "round": 4,
        "pick": 10,
        "teamId": 3,
        "name": "Zay Flowers",
        "pos": "WR",
        "keeper": false
      },
      {
        "overall": 41,
        "round": 5,
        "pick": 1,
        "teamId": 3,
        "name": "Ladd McConkey",
        "pos": "WR",
        "keeper": false
      },
      {
        "overall": 42,
        "round": 5,
        "pick": 2,
        "teamId": 10,
        "name": "Kyren Williams",
        "pos": "RB",
        "keeper": false
      },
      {
        "overall": 43,
        "round": 5,
        "pick": 3,
        "teamId": 6,
        "name": "Breece Hall",
        "pos": "RB",
        "keeper": false
      },
      {
        "overall": 44,
        "round": 5,
        "pick": 4,
        "teamId": 11,
        "name": "Javonte Williams",
        "pos": "RB",
        "keeper": false
      },
      {
        "overall": 45,
        "round": 5,
        "pick": 5,
        "teamId": 2,
        "name": "Colston Loveland",
        "pos": "TE",
        "keeper": false
      },
      {
        "overall": 46,
        "round": 5,
        "pick": 6,
        "teamId": 9,
        "name": "Jaylen Waddle",
        "pos": "WR",
        "keeper": false
      },
      {
        "overall": 47,
        "round": 5,
        "pick": 7,
        "teamId": 7,
        "name": "Garrett Wilson",
        "pos": "WR",
        "keeper": false
      },
      {
        "overall": 48,
        "round": 5,
        "pick": 8,
        "teamId": 13,
        "name": "Davante Adams",
        "pos": "WR",
        "keeper": false
      },
      {
        "overall": 49,
        "round": 5,
        "pick": 9,
        "teamId": 1,
        "name": "Tyler Warren",
        "pos": "TE",
        "keeper": true
      },
      {
        "overall": 50,
        "round": 5,
        "pick": 10,
        "teamId": 8,
        "name": "Travis Etienne Jr.",
        "pos": "RB",
        "keeper": false
      },
      {
        "overall": 51,
        "round": 6,
        "pick": 1,
        "teamId": 8,
        "name": "Luther Burden III",
        "pos": "WR",
        "keeper": false
      },
      {
        "overall": 52,
        "round": 6,
        "pick": 2,
        "teamId": 1,
        "name": "Tee Higgins",
        "pos": "WR",
        "keeper": false
      },
      {
        "overall": 53,
        "round": 6,
        "pick": 3,
        "teamId": 13,
        "name": "D'Andre Swift",
        "pos": "RB",
        "keeper": false
      },
      {
        "overall": 54,
        "round": 6,
        "pick": 4,
        "teamId": 7,
        "name": "Jordan Love",
        "pos": "QB",
        "keeper": true
      },
      {
        "overall": 55,
        "round": 6,
        "pick": 5,
        "teamId": 9,
        "name": "Rhamondre Stevenson",
        "pos": "RB",
        "keeper": false
      },
      {
        "overall": 56,
        "round": 6,
        "pick": 6,
        "teamId": 2,
        "name": "Rome Odunze",
        "pos": "WR",
        "keeper": true
      },
      {
        "overall": 57,
        "round": 6,
        "pick": 7,
        "teamId": 11,
        "name": "DeVonta Smith",
        "pos": "WR",
        "keeper": true
      },
      {
        "overall": 58,
        "round": 6,
        "pick": 8,
        "teamId": 6,
        "name": "Terry McLaurin",
        "pos": "WR",
        "keeper": false
      },
      {
        "overall": 59,
        "round": 6,
        "pick": 9,
        "teamId": 10,
        "name": "Jameson Williams",
        "pos": "WR",
        "keeper": false
      },
      {
        "overall": 60,
        "round": 6,
        "pick": 10,
        "teamId": 3,
        "name": "Bucky Irving",
        "pos": "RB",
        "keeper": false
      },
      {
        "overall": 61,
        "round": 7,
        "pick": 1,
        "teamId": 3,
        "name": "Jadarian Price",
        "pos": "RB",
        "keeper": false
      },
      {
        "overall": 62,
        "round": 7,
        "pick": 2,
        "teamId": 10,
        "name": "DJ Moore",
        "pos": "WR",
        "keeper": false
      },
      {
        "overall": 63,
        "round": 7,
        "pick": 3,
        "teamId": 6,
        "name": "Courtland Sutton",
        "pos": "WR",
        "keeper": false
      },
      {
        "overall": 64,
        "round": 7,
        "pick": 4,
        "teamId": 11,
        "name": "Tyrone Tracy Jr.",
        "pos": "RB",
        "keeper": true
      },
      {
        "overall": 65,
        "round": 7,
        "pick": 5,
        "teamId": 2,
        "name": "David Montgomery",
        "pos": "RB",
        "keeper": false
      },
      {
        "overall": 66,
        "round": 7,
        "pick": 6,
        "teamId": 9,
        "name": "Emeka Egbuka",
        "pos": "WR",
        "keeper": true
      },
      {
        "overall": 67,
        "round": 7,
        "pick": 7,
        "teamId": 7,
        "name": "Jared Goff",
        "pos": "QB",
        "keeper": false
      },
      {
        "overall": 68,
        "round": 7,
        "pick": 8,
        "teamId": 13,
        "name": "Jaylen Warren",
        "pos": "RB",
        "keeper": false
      },
      {
        "overall": 69,
        "round": 7,
        "pick": 9,
        "teamId": 1,
        "name": "Kyler Murray",
        "pos": "QB",
        "keeper": false
      },
      {
        "overall": 70,
        "round": 7,
        "pick": 10,
        "teamId": 8,
        "name": "Parker Washington",
        "pos": "WR",
        "keeper": false
      },
      {
        "overall": 71,
        "round": 8,
        "pick": 1,
        "teamId": 8,
        "name": "Trevor Lawrence",
        "pos": "QB",
        "keeper": true
      },
      {
        "overall": 72,
        "round": 8,
        "pick": 2,
        "teamId": 1,
        "name": "Bhayshul Tuten",
        "pos": "RB",
        "keeper": false
      },
      {
        "overall": 73,
        "round": 8,
        "pick": 3,
        "teamId": 13,
        "name": "George Kittle",
        "pos": "TE",
        "keeper": false
      },
      {
        "overall": 74,
        "round": 8,
        "pick": 4,
        "teamId": 7,
        "name": "Harold Fannin Jr.",
        "pos": "TE",
        "keeper": false
      },
      {
        "overall": 75,
        "round": 8,
        "pick": 5,
        "teamId": 9,
        "name": "Jacory Croskey-Merritt",
        "pos": "RB",
        "keeper": true
      },
      {
        "overall": 76,
        "round": 8,
        "pick": 6,
        "teamId": 2,
        "name": "Carnell Tate",
        "pos": "WR",
        "keeper": false
      },
      {
        "overall": 77,
        "round": 8,
        "pick": 7,
        "teamId": 11,
        "name": "Baker Mayfield",
        "pos": "QB",
        "keeper": false
      },
      {
        "overall": 78,
        "round": 8,
        "pick": 8,
        "teamId": 6,
        "name": "Marvin Harrison Jr.",
        "pos": "WR",
        "keeper": false
      },
      {
        "overall": 79,
        "round": 8,
        "pick": 9,
        "teamId": 10,
        "name": "Daniel Jones",
        "pos": "QB",
        "keeper": false
      },
      {
        "overall": 80,
        "round": 8,
        "pick": 10,
        "teamId": 3,
        "name": "Alec Pierce",
        "pos": "WR",
        "keeper": false
      },
      {
        "overall": 81,
        "round": 9,
        "pick": 1,
        "teamId": 3,
        "name": "Travis Kelce",
        "pos": "TE",
        "keeper": false
      },
      {
        "overall": 82,
        "round": 9,
        "pick": 2,
        "teamId": 10,
        "name": "Sam LaPorta",
        "pos": "TE",
        "keeper": false
      },
      {
        "overall": 83,
        "round": 9,
        "pick": 3,
        "teamId": 6,
        "name": "DK Metcalf",
        "pos": "WR",
        "keeper": false
      },
      {
        "overall": 84,
        "round": 9,
        "pick": 4,
        "teamId": 11,
        "name": "Michael Pittman Jr.",
        "pos": "WR",
        "keeper": false
      },
      {
        "overall": 85,
        "round": 9,
        "pick": 5,
        "teamId": 2,
        "name": "TreVeyon Henderson",
        "pos": "RB",
        "keeper": false
      },
      {
        "overall": 86,
        "round": 9,
        "pick": 6,
        "teamId": 9,
        "name": "Matthew Golden",
        "pos": "WR",
        "keeper": false
      },
      {
        "overall": 87,
        "round": 9,
        "pick": 7,
        "teamId": 7,
        "name": "Chris Olave",
        "pos": "WR",
        "keeper": true
      },
      {
        "overall": 88,
        "round": 9,
        "pick": 8,
        "teamId": 13,
        "name": "Matthew Stafford",
        "pos": "QB",
        "keeper": true
      },
      {
        "overall": 89,
        "round": 9,
        "pick": 9,
        "teamId": 1,
        "name": "Brian Thomas Jr.",
        "pos": "WR",
        "keeper": false
      },
      {
        "overall": 90,
        "round": 9,
        "pick": 10,
        "teamId": 8,
        "name": "Rashee Rice",
        "pos": "WR",
        "keeper": true
      },
      {
        "overall": 91,
        "round": 10,
        "pick": 1,
        "teamId": 8,
        "name": "Christian Watson",
        "pos": "WR",
        "keeper": false
      },
      {
        "overall": 92,
        "round": 10,
        "pick": 2,
        "teamId": 1,
        "name": "Wan'Dale Robinson",
        "pos": "WR",
        "keeper": false
      },
      {
        "overall": 93,
        "round": 10,
        "pick": 3,
        "teamId": 13,
        "name": "Cam Skattebo",
        "pos": "RB",
        "keeper": true
      },
      {
        "overall": 94,
        "round": 10,
        "pick": 4,
        "teamId": 7,
        "name": "Tyler Shough",
        "pos": "QB",
        "keeper": false
      },
      {
        "overall": 95,
        "round": 10,
        "pick": 5,
        "teamId": 9,
        "name": "Jake Ferguson",
        "pos": "TE",
        "keeper": false
      },
      {
        "overall": 96,
        "round": 10,
        "pick": 6,
        "teamId": 2,
        "name": "Michael Wilson",
        "pos": "WR",
        "keeper": false
      },
      {
        "overall": 97,
        "round": 10,
        "pick": 7,
        "teamId": 11,
        "name": "Dallas Goedert",
        "pos": "TE",
        "keeper": false
      },
      {
        "overall": 98,
        "round": 10,
        "pick": 8,
        "teamId": 6,
        "name": "Chuba Hubbard",
        "pos": "RB",
        "keeper": false
      },
      {
        "overall": 99,
        "round": 10,
        "pick": 9,
        "teamId": 10,
        "name": "Kenny Gainwell",
        "pos": "RB",
        "keeper": false
      },
      {
        "overall": 100,
        "round": 10,
        "pick": 10,
        "teamId": 3,
        "name": "Sam Darnold",
        "pos": "QB",
        "keeper": false
      },
      {
        "overall": 101,
        "round": 11,
        "pick": 1,
        "teamId": 3,
        "name": "Jayden Reed",
        "pos": "WR",
        "keeper": false
      },
      {
        "overall": 102,
        "round": 11,
        "pick": 2,
        "teamId": 10,
        "name": "Mike Evans",
        "pos": "WR",
        "keeper": false
      },
      {
        "overall": 103,
        "round": 11,
        "pick": 3,
        "teamId": 6,
        "name": "C.J. Stroud",
        "pos": "QB",
        "keeper": false
      },
      {
        "overall": 104,
        "round": 11,
        "pick": 4,
        "teamId": 11,
        "name": "Tony Pollard",
        "pos": "RB",
        "keeper": false
      },
      {
        "overall": 105,
        "round": 11,
        "pick": 5,
        "teamId": 2,
        "name": "Cam Ward",
        "pos": "QB",
        "keeper": false
      },
      {
        "overall": 106,
        "round": 11,
        "pick": 6,
        "teamId": 9,
        "name": "Malik Willis",
        "pos": "QB",
        "keeper": false
      },
      {
        "overall": 107,
        "round": 11,
        "pick": 7,
        "teamId": 7,
        "name": "Rico Dowdle",
        "pos": "RB",
        "keeper": false
      },
      {
        "overall": 108,
        "round": 11,
        "pick": 8,
        "teamId": 13,
        "name": "Quentin Johnston",
        "pos": "WR",
        "keeper": false
      },
      {
        "overall": 109,
        "round": 11,
        "pick": 9,
        "teamId": 1,
        "name": "Bryce Young",
        "pos": "QB",
        "keeper": false
      },
      {
        "overall": 110,
        "round": 11,
        "pick": 10,
        "teamId": 8,
        "name": "Jonathon Brooks",
        "pos": "RB",
        "keeper": false
      },
      {
        "overall": 111,
        "round": 12,
        "pick": 1,
        "teamId": 8,
        "name": "J.K. Dobbins",
        "pos": "RB",
        "keeper": false
      },
      {
        "overall": 112,
        "round": 12,
        "pick": 2,
        "teamId": 1,
        "name": "Kyle Monangai",
        "pos": "RB",
        "keeper": false
      },
      {
        "overall": 113,
        "round": 12,
        "pick": 3,
        "teamId": 13,
        "name": "Josh Jacobs",
        "pos": "RB",
        "keeper": false
      },
      {
        "overall": 114,
        "round": 12,
        "pick": 4,
        "teamId": 7,
        "name": "Chris Godwin Jr.",
        "pos": "WR",
        "keeper": false
      },
      {
        "overall": 115,
        "round": 12,
        "pick": 5,
        "teamId": 9,
        "name": "MarShawn Lloyd",
        "pos": "RB",
        "keeper": false
      },
      {
        "overall": 116,
        "round": 12,
        "pick": 6,
        "teamId": 2,
        "name": "De'Zhaun Stribling",
        "pos": "WR",
        "keeper": false
      },
      {
        "overall": 117,
        "round": 12,
        "pick": 7,
        "teamId": 11,
        "name": "Jordan Addison",
        "pos": "WR",
        "keeper": false
      },
      {
        "overall": 118,
        "round": 12,
        "pick": 8,
        "teamId": 6,
        "name": "KC Concepcion",
        "pos": "WR",
        "keeper": false
      },
      {
        "overall": 119,
        "round": 12,
        "pick": 9,
        "teamId": 10,
        "name": "Isaiah Likely",
        "pos": "TE",
        "keeper": false
      },
      {
        "overall": 120,
        "round": 12,
        "pick": 10,
        "teamId": 3,
        "name": "Romeo Doubs",
        "pos": "WR",
        "keeper": false
      },
      {
        "overall": 121,
        "round": 13,
        "pick": 1,
        "teamId": 3,
        "name": "Jordan Mason",
        "pos": "RB",
        "keeper": false
      },
      {
        "overall": 122,
        "round": 13,
        "pick": 2,
        "teamId": 10,
        "name": "Makai Lemon",
        "pos": "WR",
        "keeper": false
      },
      {
        "overall": 123,
        "round": 13,
        "pick": 3,
        "teamId": 6,
        "name": "Tucker Kraft",
        "pos": "TE",
        "keeper": false
      },
      {
        "overall": 124,
        "round": 13,
        "pick": 4,
        "teamId": 11,
        "name": "Stefon Diggs",
        "pos": "WR",
        "keeper": false
      },
      {
        "overall": 125,
        "round": 13,
        "pick": 5,
        "teamId": 2,
        "name": "Jakobi Meyers",
        "pos": "WR",
        "keeper": false
      },
      {
        "overall": 126,
        "round": 13,
        "pick": 6,
        "teamId": 9,
        "name": "Xavier Worthy",
        "pos": "WR",
        "keeper": false
      },
      {
        "overall": 127,
        "round": 13,
        "pick": 7,
        "teamId": 7,
        "name": "Dalton Kincaid",
        "pos": "TE",
        "keeper": false
      },
      {
        "overall": 128,
        "round": 13,
        "pick": 8,
        "teamId": 13,
        "name": "Aaron Jones Sr.",
        "pos": "RB",
        "keeper": false
      },
      {
        "overall": 129,
        "round": 13,
        "pick": 9,
        "teamId": 1,
        "name": "Jalen Coker",
        "pos": "WR",
        "keeper": false
      },
      {
        "overall": 130,
        "round": 13,
        "pick": 10,
        "teamId": 8,
        "name": "Blake Corum",
        "pos": "RB",
        "keeper": false
      },
      {
        "overall": 131,
        "round": 14,
        "pick": 1,
        "teamId": 8,
        "name": "Josh Downs",
        "pos": "WR",
        "keeper": false
      },
      {
        "overall": 132,
        "round": 14,
        "pick": 2,
        "teamId": 1,
        "name": "Kenyon Sadiq",
        "pos": "TE",
        "keeper": false
      },
      {
        "overall": 133,
        "round": 14,
        "pick": 3,
        "teamId": 13,
        "name": "Aaron Rodgers",
        "pos": "QB",
        "keeper": false
      },
      {
        "overall": 134,
        "round": 14,
        "pick": 4,
        "teamId": 7,
        "name": "RJ Harvey",
        "pos": "RB",
        "keeper": false
      },
      {
        "overall": 135,
        "round": 14,
        "pick": 5,
        "teamId": 9,
        "name": "Terrance Ferguson",
        "pos": "TE",
        "keeper": false
      },
      {
        "overall": 136,
        "round": 14,
        "pick": 6,
        "teamId": 2,
        "name": "Jordyn Tyson",
        "pos": "WR",
        "keeper": false
      },
      {
        "overall": 137,
        "round": 14,
        "pick": 7,
        "teamId": 11,
        "name": "Rachaad White",
        "pos": "RB",
        "keeper": false
      },
      {
        "overall": 138,
        "round": 14,
        "pick": 8,
        "teamId": 6,
        "name": "Quinshon Judkins",
        "pos": "RB",
        "keeper": true
      },
      {
        "overall": 139,
        "round": 14,
        "pick": 9,
        "teamId": 10,
        "name": "Fernando Mendoza",
        "pos": "QB",
        "keeper": false
      },
      {
        "overall": 140,
        "round": 14,
        "pick": 10,
        "teamId": 3,
        "name": "Hunter Henry",
        "pos": "TE",
        "keeper": false
      },
      {
        "overall": 141,
        "round": 15,
        "pick": 1,
        "teamId": 3,
        "name": "Texans DST",
        "pos": "DST",
        "keeper": false
      },
      {
        "overall": 142,
        "round": 15,
        "pick": 2,
        "teamId": 10,
        "name": "Kyle Pitts Sr.",
        "pos": "TE",
        "keeper": true
      },
      {
        "overall": 143,
        "round": 15,
        "pick": 3,
        "teamId": 6,
        "name": "Carson Beck",
        "pos": "QB",
        "keeper": false
      },
      {
        "overall": 144,
        "round": 15,
        "pick": 4,
        "teamId": 11,
        "name": "Mark Andrews",
        "pos": "TE",
        "keeper": false
      },
      {
        "overall": 145,
        "round": 15,
        "pick": 5,
        "teamId": 2,
        "name": "Jaxson Dart",
        "pos": "QB",
        "keeper": true
      },
      {
        "overall": 146,
        "round": 15,
        "pick": 6,
        "teamId": 9,
        "name": "Tank Bigsby",
        "pos": "RB",
        "keeper": false
      },
      {
        "overall": 147,
        "round": 15,
        "pick": 7,
        "teamId": 7,
        "name": "Deebo Samuel Sr.",
        "pos": "WR",
        "keeper": false
      },
      {
        "overall": 148,
        "round": 15,
        "pick": 8,
        "teamId": 13,
        "name": "Jerry Jeudy",
        "pos": "WR",
        "keeper": false
      },
      {
        "overall": 149,
        "round": 15,
        "pick": 9,
        "teamId": 1,
        "name": "Woody Marks",
        "pos": "RB",
        "keeper": false
      },
      {
        "overall": 150,
        "round": 15,
        "pick": 10,
        "teamId": 8,
        "name": "Jacoby Brissett",
        "pos": "QB",
        "keeper": false
      },
      {
        "overall": 151,
        "round": 16,
        "pick": 1,
        "teamId": 8,
        "name": "Zach Charbonnet",
        "pos": "RB",
        "keeper": false
      },
      {
        "overall": 152,
        "round": 16,
        "pick": 2,
        "teamId": 1,
        "name": "Patriots DST",
        "pos": "DST",
        "keeper": false
      },
      {
        "overall": 153,
        "round": 16,
        "pick": 3,
        "teamId": 13,
        "name": "Rams DST",
        "pos": "DST",
        "keeper": false
      },
      {
        "overall": 154,
        "round": 16,
        "pick": 4,
        "teamId": 7,
        "name": "Rashid Shaheed",
        "pos": "WR",
        "keeper": false
      },
      {
        "overall": 155,
        "round": 16,
        "pick": 5,
        "teamId": 9,
        "name": "Deshaun Watson",
        "pos": "QB",
        "keeper": false
      },
      {
        "overall": 156,
        "round": 16,
        "pick": 6,
        "teamId": 2,
        "name": "Jalen McMillan",
        "pos": "WR",
        "keeper": false
      },
      {
        "overall": 157,
        "round": 16,
        "pick": 7,
        "teamId": 11,
        "name": "Broncos DST",
        "pos": "DST",
        "keeper": false
      },
      {
        "overall": 158,
        "round": 16,
        "pick": 8,
        "teamId": 6,
        "name": "Steelers DST",
        "pos": "DST",
        "keeper": false
      },
      {
        "overall": 159,
        "round": 16,
        "pick": 9,
        "teamId": 10,
        "name": "Seahawks DST",
        "pos": "DST",
        "keeper": false
      },
      {
        "overall": 160,
        "round": 16,
        "pick": 10,
        "teamId": 3,
        "name": "Tre Tucker",
        "pos": "WR",
        "keeper": false
      },
      {
        "overall": 161,
        "round": 17,
        "pick": 1,
        "teamId": 3,
        "name": "Kayshon Boutte",
        "pos": "WR",
        "keeper": false
      },
      {
        "overall": 162,
        "round": 17,
        "pick": 2,
        "teamId": 10,
        "name": "Travis Hunter",
        "pos": "WR",
        "keeper": false
      },
      {
        "overall": 163,
        "round": 17,
        "pick": 3,
        "teamId": 6,
        "name": "Zachariah Branch",
        "pos": "WR",
        "keeper": false
      },
      {
        "overall": 164,
        "round": 17,
        "pick": 4,
        "teamId": 11,
        "name": "Tyjae Spears",
        "pos": "RB",
        "keeper": false
      },
      {
        "overall": 165,
        "round": 17,
        "pick": 5,
        "teamId": 2,
        "name": "Jonah Coleman",
        "pos": "RB",
        "keeper": false
      },
      {
        "overall": 166,
        "round": 17,
        "pick": 6,
        "teamId": 9,
        "name": "Denzel Boston",
        "pos": "WR",
        "keeper": false
      },
      {
        "overall": 167,
        "round": 17,
        "pick": 7,
        "teamId": 7,
        "name": "Chris Rodriguez Jr.",
        "pos": "RB",
        "keeper": false
      },
      {
        "overall": 168,
        "round": 17,
        "pick": 8,
        "teamId": 13,
        "name": "Juwan Johnson",
        "pos": "TE",
        "keeper": false
      },
      {
        "overall": 169,
        "round": 17,
        "pick": 9,
        "teamId": 1,
        "name": "Caleb Douglas",
        "pos": "WR",
        "keeper": false
      },
      {
        "overall": 170,
        "round": 17,
        "pick": 10,
        "teamId": 8,
        "name": "Ravens DST",
        "pos": "DST",
        "keeper": false
      },
      {
        "overall": 171,
        "round": 18,
        "pick": 1,
        "teamId": 8,
        "name": "Shedeur Sanders",
        "pos": "QB",
        "keeper": false
      },
      {
        "overall": 172,
        "round": 18,
        "pick": 2,
        "teamId": 1,
        "name": "Tyler Allgeier",
        "pos": "RB",
        "keeper": false
      },
      {
        "overall": 173,
        "round": 18,
        "pick": 3,
        "teamId": 13,
        "name": "Vikings DST",
        "pos": "DST",
        "keeper": false
      },
      {
        "overall": 174,
        "round": 18,
        "pick": 4,
        "teamId": 7,
        "name": "Chargers DST",
        "pos": "DST",
        "keeper": false
      },
      {
        "overall": 175,
        "round": 18,
        "pick": 5,
        "teamId": 9,
        "name": "Cowboys DST",
        "pos": "DST",
        "keeper": false
      },
      {
        "overall": 176,
        "round": 18,
        "pick": 6,
        "teamId": 2,
        "name": "Eagles DST",
        "pos": "DST",
        "keeper": false
      },
      {
        "overall": 177,
        "round": 18,
        "pick": 7,
        "teamId": 11,
        "name": "Khalil Shakir",
        "pos": "WR",
        "keeper": false
      },
      {
        "overall": 178,
        "round": 18,
        "pick": 8,
        "teamId": 6,
        "name": "T.J. Hockenson",
        "pos": "TE",
        "keeper": false
      },
      {
        "overall": 179,
        "round": 18,
        "pick": 9,
        "teamId": 10,
        "name": "Calvin Ridley",
        "pos": "WR",
        "keeper": false
      },
      {
        "overall": 180,
        "round": 18,
        "pick": 10,
        "teamId": 3,
        "name": "Michael Penix Jr.",
        "pos": "QB",
        "keeper": false
      }
    ],
    "activity": [
      {
        "kind": "FREEAGENT",
        "status": "EXECUTED",
        "teamId": 11,
        "at": 1790894586972,
        "moves": [
          {
            "action": "ADD",
            "name": "Bills DST"
          },
          {
            "action": "DROP",
            "name": "Broncos DST"
          }
        ]
      },
      {
        "kind": "WAIVER",
        "status": "EXECUTED",
        "teamId": 2,
        "at": 1790754081585,
        "moves": [
          {
            "action": "ADD",
            "name": "Brenton Strange"
          },
          {
            "action": "DROP",
            "name": "Oronde Gadsden"
          }
        ]
      },
      {
        "kind": "WAIVER",
        "status": "EXECUTED",
        "teamId": 2,
        "at": 1790754081583,
        "moves": [
          {
            "action": "ADD",
            "name": "Steelers DST"
          },
          {
            "action": "DROP",
            "name": "Eagles DST"
          }
        ]
      },
      {
        "kind": "FREEAGENT",
        "status": "EXECUTED",
        "teamId": 1,
        "at": 1790821622927,
        "moves": [
          {
            "action": "ADD",
            "name": "Raiders DST"
          },
          {
            "action": "DROP",
            "name": "Kaelon Black"
          }
        ]
      },
      {
        "kind": "WAIVER",
        "status": "EXECUTED",
        "teamId": 8,
        "at": 1790754081585,
        "moves": [
          {
            "action": "ADD",
            "name": "Ravens DST"
          },
          {
            "action": "DROP",
            "name": "Panthers DST"
          }
        ]
      },
      {
        "kind": "WAIVER",
        "status": "EXECUTED",
        "teamId": 13,
        "at": 1791011168246,
        "moves": [
          {
            "action": "ADD",
            "name": "Broncos DST"
          },
          {
            "action": "DROP",
            "name": "Rams DST"
          }
        ]
      },
      {
        "kind": "FREEAGENT",
        "status": "EXECUTED",
        "teamId": 3,
        "at": 1790874256743,
        "moves": [
          {
            "action": "ADD",
            "name": "Keenan Allen"
          },
          {
            "action": "DROP",
            "name": "Kayshon Boutte"
          }
        ]
      },
      {
        "kind": "FREEAGENT",
        "status": "EXECUTED",
        "teamId": 3,
        "at": 1790874444768,
        "moves": [
          {
            "action": "ADD",
            "name": "Malik Washington"
          },
          {
            "action": "DROP",
            "name": "Jayden Reed"
          }
        ]
      },
      {
        "kind": "WAIVER",
        "status": "PENDING",
        "teamId": 1,
        "at": 1790678439948,
        "moves": [
          {
            "action": "ADD",
            "name": "Ollie Gordon II"
          },
          {
            "action": "DROP",
            "name": "De'Von Achane"
          }
        ]
      },
      {
        "kind": "WAIVER",
        "status": "EXECUTED",
        "teamId": 1,
        "at": 1790754081584,
        "moves": [
          {
            "action": "ADD",
            "name": "Ollie Gordon II"
          },
          {
            "action": "DROP",
            "name": "De'Von Achane"
          }
        ]
      },
      {
        "kind": "FREEAGENT",
        "status": "EXECUTED",
        "teamId": 11,
        "at": 1790894657907,
        "moves": [
          {
            "action": "ADD",
            "name": "Kalif Raymond"
          },
          {
            "action": "DROP",
            "name": "Pat Freiermuth"
          }
        ]
      },
      {
        "kind": "WAIVER",
        "status": "EXECUTED",
        "teamId": 8,
        "at": 1790754081584,
        "moves": [
          {
            "action": "ADD",
            "name": "Kendre Miller"
          },
          {
            "action": "DROP",
            "name": "Dalton Schultz"
          }
        ]
      },
      {
        "kind": "FREEAGENT",
        "status": "EXECUTED",
        "teamId": 6,
        "at": 1790890412711,
        "moves": [
          {
            "action": "ADD",
            "name": "Case Keenum"
          },
          {
            "action": "DROP",
            "name": "Carson Beck"
          }
        ]
      }
    ],
    "freeAgents": [
      {
        "name": "Rams DST",
        "pos": "DST",
        "nfl": "LAR",
        "owned": 84.7,
        "waiver": true
      },
      {
        "name": "Eagles DST",
        "pos": "DST",
        "nfl": "PHI",
        "owned": 65.3,
        "waiver": false
      },
      {
        "name": "Dalton Schultz",
        "pos": "TE",
        "nfl": "HOU",
        "owned": 58.2,
        "waiver": false
      },
      {
        "name": "De'Von Achane",
        "pos": "RB",
        "nfl": "MIA",
        "owned": 51.6,
        "waiver": false
      },
      {
        "name": "Jonathon Brooks",
        "pos": "RB",
        "nfl": "CAR",
        "owned": 50.0,
        "waiver": false
      },
      {
        "name": "Browns DST",
        "pos": "DST",
        "nfl": "CLE",
        "owned": 41.4,
        "waiver": true
      },
      {
        "name": "Tyjae Spears",
        "pos": "RB",
        "nfl": "TEN",
        "owned": 41.1,
        "waiver": false
      },
      {
        "name": "Lions DST",
        "pos": "DST",
        "nfl": "DET",
        "owned": 40.9,
        "waiver": false
      },
      {
        "name": "Jayden Reed",
        "pos": "WR",
        "nfl": "GB",
        "owned": 38.9,
        "waiver": false
      },
      {
        "name": "Travis Hunter",
        "pos": "WR",
        "nfl": "JAC",
        "owned": 38.5,
        "waiver": false
      },
      {
        "name": "Jaxson Dart",
        "pos": "QB",
        "nfl": "NYG",
        "owned": 35.7,
        "waiver": false
      },
      {
        "name": "Kaelon Black",
        "pos": "RB",
        "nfl": "SF",
        "owned": 35.2,
        "waiver": false
      },
      {
        "name": "Bears DST",
        "pos": "DST",
        "nfl": "CHI",
        "owned": 34.4,
        "waiver": false
      },
      {
        "name": "Darren Waller",
        "pos": "TE",
        "nfl": "CAR",
        "owned": 31.3,
        "waiver": false
      },
      {
        "name": "De'Zhaun Stribling",
        "pos": "WR",
        "nfl": "SF",
        "owned": 28.9,
        "waiver": false
      },
      {
        "name": "Jaguars DST",
        "pos": "DST",
        "nfl": "JAC",
        "owned": 28.3,
        "waiver": false
      },
      {
        "name": "Tank Dell",
        "pos": "WR",
        "nfl": "HOU",
        "owned": 28.3,
        "waiver": false
      },
      {
        "name": "Packers DST",
        "pos": "DST",
        "nfl": "GB",
        "owned": 28.0,
        "waiver": false
      },
      {
        "name": "Brian Robinson Jr.",
        "pos": "RB",
        "nfl": "ATL",
        "owned": 27.2,
        "waiver": false
      },
      {
        "name": "Tyreek Hill",
        "pos": "WR",
        "nfl": "FA",
        "owned": 26.9,
        "waiver": false
      },
      {
        "name": "Jaylen Wright",
        "pos": "RB",
        "nfl": "MIA",
        "owned": 25.4,
        "waiver": false
      },
      {
        "name": "Rashod Bateman",
        "pos": "WR",
        "nfl": "BAL",
        "owned": 24.6,
        "waiver": false
      },
      {
        "name": "Isiah Pacheco",
        "pos": "RB",
        "nfl": "DET",
        "owned": 22.9,
        "waiver": false
      },
      {
        "name": "Mike Washington Jr.",
        "pos": "RB",
        "nfl": "LV",
        "owned": 21.5,
        "waiver": false
      },
      {
        "name": "Buccaneers DST",
        "pos": "DST",
        "nfl": "TB",
        "owned": 20.7,
        "waiver": false
      },
      {
        "name": "Pat Freiermuth",
        "pos": "TE",
        "nfl": "PIT",
        "owned": 19.8,
        "waiver": true
      },
      {
        "name": "Keaton Mitchell",
        "pos": "RB",
        "nfl": "LAC",
        "owned": 18.2,
        "waiver": false
      },
      {
        "name": "Chris Rodriguez Jr.",
        "pos": "RB",
        "nfl": "JAC",
        "owned": 17.5,
        "waiver": false
      },
      {
        "name": "Jalen McMillan",
        "pos": "WR",
        "nfl": "TB",
        "owned": 16.8,
        "waiver": false
      },
      {
        "name": "Tank Bigsby",
        "pos": "RB",
        "nfl": "PHI",
        "owned": 15.9,
        "waiver": false
      },
      {
        "name": "Jerry Jeudy",
        "pos": "WR",
        "nfl": "CLE",
        "owned": 15.2,
        "waiver": true
      },
      {
        "name": "Panthers DST",
        "pos": "DST",
        "nfl": "CAR",
        "owned": 13.8,
        "waiver": false
      },
      {
        "name": "Mack Hollins",
        "pos": "WR",
        "nfl": "NE",
        "owned": 12.8,
        "waiver": false
      },
      {
        "name": "Cooper Kupp",
        "pos": "WR",
        "nfl": "SEA",
        "owned": 12.6,
        "waiver": false
      },
      {
        "name": "Michael Mayer",
        "pos": "TE",
        "nfl": "LV",
        "owned": 12.3,
        "waiver": false
      },
      {
        "name": "Justice Hill",
        "pos": "RB",
        "nfl": "BAL",
        "owned": 12.1,
        "waiver": false
      },
      {
        "name": "Jets DST",
        "pos": "DST",
        "nfl": "NYJ",
        "owned": 11.4,
        "waiver": false
      },
      {
        "name": "George Holani",
        "pos": "RB",
        "nfl": "SEA",
        "owned": 11.3,
        "waiver": false
      },
      {
        "name": "Dylan Sampson",
        "pos": "RB",
        "nfl": "CLE",
        "owned": 9.9,
        "waiver": true
      },
      {
        "name": "Kayshon Boutte",
        "pos": "WR",
        "nfl": "HOU",
        "owned": 9.1,
        "waiver": false
      }
    ],
    "slots": [
      {
        "teamId": 1,
        "name": "Drake Maye",
        "slot": "QB"
      },
      {
        "teamId": 1,
        "name": "Ashton Jeanty",
        "slot": "FLEX"
      },
      {
        "teamId": 1,
        "name": "Tetairoa McMillan",
        "slot": "WR"
      },
      {
        "teamId": 1,
        "name": "Tyler Warren",
        "slot": "TE"
      },
      {
        "teamId": 1,
        "name": "Tee Higgins",
        "slot": "WR"
      },
      {
        "teamId": 1,
        "name": "Kyler Murray",
        "slot": "OP"
      },
      {
        "teamId": 1,
        "name": "Bhayshul Tuten",
        "slot": "RB"
      },
      {
        "teamId": 1,
        "name": "Brian Thomas Jr.",
        "slot": "BE"
      },
      {
        "teamId": 1,
        "name": "Wan'Dale Robinson",
        "slot": "BE"
      },
      {
        "teamId": 1,
        "name": "Kyle Monangai",
        "slot": "BE"
      },
      {
        "teamId": 1,
        "name": "Kenyon Sadiq",
        "slot": "BE"
      },
      {
        "teamId": 1,
        "name": "Patriots DST",
        "slot": "BE"
      },
      {
        "teamId": 1,
        "name": "Caleb Douglas",
        "slot": "BE"
      },
      {
        "teamId": 1,
        "name": "Carnell Tate",
        "slot": "WR"
      },
      {
        "teamId": 1,
        "name": "Cam Ward",
        "slot": "BE"
      },
      {
        "teamId": 1,
        "name": "TreVeyon Henderson",
        "slot": "RB"
      },
      {
        "teamId": 1,
        "name": "Ollie Gordon II",
        "slot": "BE"
      },
      {
        "teamId": 1,
        "name": "Raiders DST",
        "slot": "DST"
      },
      {
        "teamId": 2,
        "name": "Bijan Robinson",
        "slot": "RB"
      },
      {
        "teamId": 2,
        "name": "James Cook III",
        "slot": "RB"
      },
      {
        "teamId": 2,
        "name": "Justin Herbert",
        "slot": "BE"
      },
      {
        "teamId": 2,
        "name": "Malik Nabers",
        "slot": "WR"
      },
      {
        "teamId": 2,
        "name": "Colston Loveland",
        "slot": "TE"
      },
      {
        "teamId": 2,
        "name": "Rome Odunze",
        "slot": "BE"
      },
      {
        "teamId": 2,
        "name": "David Montgomery",
        "slot": "FLEX"
      },
      {
        "teamId": 2,
        "name": "Michael Wilson",
        "slot": "WR"
      },
      {
        "teamId": 2,
        "name": "Jakobi Meyers",
        "slot": "BE"
      },
      {
        "teamId": 2,
        "name": "Jordyn Tyson",
        "slot": "IR"
      },
      {
        "teamId": 2,
        "name": "Jonah Coleman",
        "slot": "BE"
      },
      {
        "teamId": 2,
        "name": "Geno Smith",
        "slot": "OP"
      },
      {
        "teamId": 2,
        "name": "Tyler Allgeier",
        "slot": "BE"
      },
      {
        "teamId": 2,
        "name": "Jalen Coker",
        "slot": "WR"
      },
      {
        "teamId": 2,
        "name": "Bryce Young",
        "slot": "QB"
      },
      {
        "teamId": 2,
        "name": "Braelon Allen",
        "slot": "BE"
      },
      {
        "teamId": 2,
        "name": "Terrance Ferguson",
        "slot": "BE"
      },
      {
        "teamId": 2,
        "name": "Steelers DST",
        "slot": "DST"
      },
      {
        "teamId": 2,
        "name": "Brenton Strange",
        "slot": "BE"
      },
      {
        "teamId": 3,
        "name": "Josh Allen",
        "slot": "QB"
      },
      {
        "teamId": 3,
        "name": "Bo Nix",
        "slot": "OP"
      },
      {
        "teamId": 3,
        "name": "Saquon Barkley",
        "slot": "RB"
      },
      {
        "teamId": 3,
        "name": "Zay Flowers",
        "slot": "WR"
      },
      {
        "teamId": 3,
        "name": "Ladd McConkey",
        "slot": "WR"
      },
      {
        "teamId": 3,
        "name": "Bucky Irving",
        "slot": "RB"
      },
      {
        "teamId": 3,
        "name": "Jadarian Price",
        "slot": "BE"
      },
      {
        "teamId": 3,
        "name": "Alec Pierce",
        "slot": "BE"
      },
      {
        "teamId": 3,
        "name": "Travis Kelce",
        "slot": "TE"
      },
      {
        "teamId": 3,
        "name": "Sam Darnold",
        "slot": "BE"
      },
      {
        "teamId": 3,
        "name": "Romeo Doubs",
        "slot": "WR"
      },
      {
        "teamId": 3,
        "name": "Jordan Mason",
        "slot": "IR"
      },
      {
        "teamId": 3,
        "name": "Hunter Henry",
        "slot": "BE"
      },
      {
        "teamId": 3,
        "name": "Texans DST",
        "slot": "DST"
      },
      {
        "teamId": 3,
        "name": "Tre Tucker",
        "slot": "BE"
      },
      {
        "teamId": 3,
        "name": "Michael Penix Jr.",
        "slot": "BE"
      },
      {
        "teamId": 3,
        "name": "Dontayvion Wicks",
        "slot": "FLEX"
      },
      {
        "teamId": 3,
        "name": "Keenan Allen",
        "slot": "BE"
      },
      {
        "teamId": 3,
        "name": "Malik Washington",
        "slot": "BE"
      },
      {
        "teamId": 6,
        "name": "Lamar Jackson",
        "slot": "QB"
      },
      {
        "teamId": 6,
        "name": "Jalen Hurts",
        "slot": "OP"
      },
      {
        "teamId": 6,
        "name": "Justin Jefferson",
        "slot": "WR"
      },
      {
        "teamId": 6,
        "name": "Trey McBride",
        "slot": "TE"
      },
      {
        "teamId": 6,
        "name": "Breece Hall",
        "slot": "BE"
      },
      {
        "teamId": 6,
        "name": "Terry McLaurin",
        "slot": "WR"
      },
      {
        "teamId": 6,
        "name": "Courtland Sutton",
        "slot": "FLEX"
      },
      {
        "teamId": 6,
        "name": "Marvin Harrison Jr.",
        "slot": "BE"
      },
      {
        "teamId": 6,
        "name": "DK Metcalf",
        "slot": "WR"
      },
      {
        "teamId": 6,
        "name": "Chuba Hubbard",
        "slot": "RB"
      },
      {
        "teamId": 6,
        "name": "C.J. Stroud",
        "slot": "BE"
      },
      {
        "teamId": 6,
        "name": "KC Concepcion",
        "slot": "BE"
      },
      {
        "teamId": 6,
        "name": "Tucker Kraft",
        "slot": "BE"
      },
      {
        "teamId": 6,
        "name": "Quinshon Judkins",
        "slot": "RB"
      },
      {
        "teamId": 6,
        "name": "Zachariah Branch",
        "slot": "BE"
      },
      {
        "teamId": 6,
        "name": "T.J. Hockenson",
        "slot": "BE"
      },
      {
        "teamId": 6,
        "name": "49ers DST",
        "slot": "DST"
      },
      {
        "teamId": 6,
        "name": "Case Keenum",
        "slot": "BE"
      },
      {
        "teamId": 7,
        "name": "Puka Nacua",
        "slot": "WR"
      },
      {
        "teamId": 7,
        "name": "Christian McCaffrey",
        "slot": "RB"
      },
      {
        "teamId": 7,
        "name": "Kenneth Walker III",
        "slot": "RB"
      },
      {
        "teamId": 7,
        "name": "Omarion Hampton",
        "slot": "FLEX"
      },
      {
        "teamId": 7,
        "name": "Garrett Wilson",
        "slot": "WR"
      },
      {
        "teamId": 7,
        "name": "Jordan Love",
        "slot": "BE"
      },
      {
        "teamId": 7,
        "name": "Jared Goff",
        "slot": "OP"
      },
      {
        "teamId": 7,
        "name": "Harold Fannin Jr.",
        "slot": "BE"
      },
      {
        "teamId": 7,
        "name": "Chris Olave",
        "slot": "WR"
      },
      {
        "teamId": 7,
        "name": "Tyler Shough",
        "slot": "QB"
      },
      {
        "teamId": 7,
        "name": "Rico Dowdle",
        "slot": "BE"
      },
      {
        "teamId": 7,
        "name": "Chris Godwin Jr.",
        "slot": "BE"
      },
      {
        "teamId": 7,
        "name": "Dalton Kincaid",
        "slot": "TE"
      },
      {
        "teamId": 7,
        "name": "RJ Harvey",
        "slot": "IR"
      },
      {
        "teamId": 7,
        "name": "Deebo Samuel Sr.",
        "slot": "BE"
      },
      {
        "teamId": 7,
        "name": "Rashid Shaheed",
        "slot": "BE"
      },
      {
        "teamId": 7,
        "name": "Chargers DST",
        "slot": "DST"
      },
      {
        "teamId": 7,
        "name": "Devaughn Vele",
        "slot": "BE"
      },
      {
        "teamId": 7,
        "name": "Emanuel Wilson",
        "slot": "BE"
      },
      {
        "teamId": 8,
        "name": "Jaxon Smith-Njigba",
        "slot": "WR"
      },
      {
        "teamId": 8,
        "name": "Joe Burrow",
        "slot": "QB"
      },
      {
        "teamId": 8,
        "name": "Brock Bowers",
        "slot": "TE"
      },
      {
        "teamId": 8,
        "name": "Chase Brown",
        "slot": "RB"
      },
      {
        "teamId": 8,
        "name": "Travis Etienne Jr.",
        "slot": "BE"
      },
      {
        "teamId": 8,
        "name": "Luther Burden III",
        "slot": "BE"
      },
      {
        "teamId": 8,
        "name": "Parker Washington",
        "slot": "FLEX"
      },
      {
        "teamId": 8,
        "name": "Trevor Lawrence",
        "slot": "OP"
      },
      {
        "teamId": 8,
        "name": "Rashee Rice",
        "slot": "WR"
      },
      {
        "teamId": 8,
        "name": "Christian Watson",
        "slot": "WR"
      },
      {
        "teamId": 8,
        "name": "J.K. Dobbins",
        "slot": "RB"
      },
      {
        "teamId": 8,
        "name": "Blake Corum",
        "slot": "BE"
      },
      {
        "teamId": 8,
        "name": "Josh Downs",
        "slot": "BE"
      },
      {
        "teamId": 8,
        "name": "Jacoby Brissett",
        "slot": "BE"
      },
      {
        "teamId": 8,
        "name": "Zach Charbonnet",
        "slot": "IR"
      },
      {
        "teamId": 8,
        "name": "Marcus Mariota",
        "slot": "BE"
      },
      {
        "teamId": 8,
        "name": "Emmett Johnson",
        "slot": "BE"
      },
      {
        "teamId": 8,
        "name": "Kendre Miller",
        "slot": "BE"
      },
      {
        "teamId": 8,
        "name": "Ravens DST",
        "slot": "DST"
      },
      {
        "teamId": 9,
        "name": "Dak Prescott",
        "slot": "QB"
      },
      {
        "teamId": 9,
        "name": "Brock Purdy",
        "slot": "OP"
      },
      {
        "teamId": 9,
        "name": "Jeremiyah Love",
        "slot": "RB"
      },
      {
        "teamId": 9,
        "name": "A.J. Brown",
        "slot": "IR"
      },
      {
        "teamId": 9,
        "name": "Jaylen Waddle",
        "slot": "WR"
      },
      {
        "teamId": 9,
        "name": "Rhamondre Stevenson",
        "slot": "RB"
      },
      {
        "teamId": 9,
        "name": "Emeka Egbuka",
        "slot": "WR"
      },
      {
        "teamId": 9,
        "name": "Jacory Croskey-Merritt",
        "slot": "BE"
      },
      {
        "teamId": 9,
        "name": "Matthew Golden",
        "slot": "WR"
      },
      {
        "teamId": 9,
        "name": "Jake Ferguson",
        "slot": "TE"
      },
      {
        "teamId": 9,
        "name": "Malik Willis",
        "slot": "BE"
      },
      {
        "teamId": 9,
        "name": "MarShawn Lloyd",
        "slot": "BE"
      },
      {
        "teamId": 9,
        "name": "Xavier Worthy",
        "slot": "BE"
      },
      {
        "teamId": 9,
        "name": "Deshaun Watson",
        "slot": "BE"
      },
      {
        "teamId": 9,
        "name": "Denzel Boston",
        "slot": "BE"
      },
      {
        "teamId": 9,
        "name": "Mike Gesicki",
        "slot": "BE"
      },
      {
        "teamId": 9,
        "name": "Adonai Mitchell",
        "slot": "BE"
      },
      {
        "teamId": 9,
        "name": "Alvin Kamara",
        "slot": "FLEX"
      },
      {
        "teamId": 9,
        "name": "Bengals DST",
        "slot": "DST"
      },
      {
        "teamId": 10,
        "name": "Jahmyr Gibbs",
        "slot": "RB"
      },
      {
        "teamId": 10,
        "name": "Caleb Williams",
        "slot": "BE"
      },
      {
        "teamId": 10,
        "name": "CeeDee Lamb",
        "slot": "WR"
      },
      {
        "teamId": 10,
        "name": "George Pickens",
        "slot": "WR"
      },
      {
        "teamId": 10,
        "name": "Kyren Williams",
        "slot": "RB"
      },
      {
        "teamId": 10,
        "name": "Jameson Williams",
        "slot": "BE"
      },
      {
        "teamId": 10,
        "name": "DJ Moore",
        "slot": "WR"
      },
      {
        "teamId": 10,
        "name": "Daniel Jones",
        "slot": "QB"
      },
      {
        "teamId": 10,
        "name": "Sam LaPorta",
        "slot": "TE"
      },
      {
        "teamId": 10,
        "name": "Kenny Gainwell",
        "slot": "BE"
      },
      {
        "teamId": 10,
        "name": "Mike Evans",
        "slot": "BE"
      },
      {
        "teamId": 10,
        "name": "Isaiah Likely",
        "slot": "FLEX"
      },
      {
        "teamId": 10,
        "name": "Makai Lemon",
        "slot": "BE"
      },
      {
        "teamId": 10,
        "name": "Fernando Mendoza",
        "slot": "BE"
      },
      {
        "teamId": 10,
        "name": "Kyle Pitts Sr.",
        "slot": "BE"
      },
      {
        "teamId": 10,
        "name": "Seahawks DST",
        "slot": "DST"
      },
      {
        "teamId": 10,
        "name": "Calvin Ridley",
        "slot": "BE"
      },
      {
        "teamId": 10,
        "name": "Kirk Cousins",
        "slot": "OP"
      },
      {
        "teamId": 11,
        "name": "Jayden Daniels",
        "slot": "QB"
      },
      {
        "teamId": 11,
        "name": "Jonathan Taylor",
        "slot": "RB"
      },
      {
        "teamId": 11,
        "name": "Drake London",
        "slot": "WR"
      },
      {
        "teamId": 11,
        "name": "Nico Collins",
        "slot": "BE"
      },
      {
        "teamId": 11,
        "name": "Javonte Williams",
        "slot": "RB"
      },
      {
        "teamId": 11,
        "name": "DeVonta Smith",
        "slot": "WR"
      },
      {
        "teamId": 11,
        "name": "Baker Mayfield",
        "slot": "IR"
      },
      {
        "teamId": 11,
        "name": "Michael Pittman Jr.",
        "slot": "BE"
      },
      {
        "teamId": 11,
        "name": "Dallas Goedert",
        "slot": "BE"
      },
      {
        "teamId": 11,
        "name": "Tony Pollard",
        "slot": "BE"
      },
      {
        "teamId": 11,
        "name": "Jordan Addison",
        "slot": "FLEX"
      },
      {
        "teamId": 11,
        "name": "Stefon Diggs",
        "slot": "WR"
      },
      {
        "teamId": 11,
        "name": "Rachaad White",
        "slot": "BE"
      },
      {
        "teamId": 11,
        "name": "Mark Andrews",
        "slot": "TE"
      },
      {
        "teamId": 11,
        "name": "Khalil Shakir",
        "slot": "BE"
      },
      {
        "teamId": 11,
        "name": "Woody Marks",
        "slot": "BE"
      },
      {
        "teamId": 11,
        "name": "Chiefs DST",
        "slot": "BE"
      },
      {
        "teamId": 11,
        "name": "Bills DST",
        "slot": "DST"
      },
      {
        "teamId": 11,
        "name": "Kalif Raymond",
        "slot": "OP"
      },
      {
        "teamId": 13,
        "name": "Ja'Marr Chase",
        "slot": "WR"
      },
      {
        "teamId": 13,
        "name": "Amon-Ra St. Brown",
        "slot": "WR"
      },
      {
        "teamId": 13,
        "name": "Derrick Henry",
        "slot": "RB"
      },
      {
        "teamId": 13,
        "name": "Patrick Mahomes",
        "slot": "OP"
      },
      {
        "teamId": 13,
        "name": "Davante Adams",
        "slot": "WR"
      },
      {
        "teamId": 13,
        "name": "D'Andre Swift",
        "slot": "FLEX"
      },
      {
        "teamId": 13,
        "name": "Jaylen Warren",
        "slot": "BE"
      },
      {
        "teamId": 13,
        "name": "George Kittle",
        "slot": "BE"
      },
      {
        "teamId": 13,
        "name": "Matthew Stafford",
        "slot": "QB"
      },
      {
        "teamId": 13,
        "name": "Cam Skattebo",
        "slot": "RB"
      },
      {
        "teamId": 13,
        "name": "Quentin Johnston",
        "slot": "BE"
      },
      {
        "teamId": 13,
        "name": "Josh Jacobs",
        "slot": "BE"
      },
      {
        "teamId": 13,
        "name": "Aaron Jones Sr.",
        "slot": "BE"
      },
      {
        "teamId": 13,
        "name": "Aaron Rodgers",
        "slot": "BE"
      },
      {
        "teamId": 13,
        "name": "Juwan Johnson",
        "slot": "TE"
      },
      {
        "teamId": 13,
        "name": "Vikings DST",
        "slot": "DST"
      },
      {
        "teamId": 13,
        "name": "Jameis Winston",
        "slot": "BE"
      },
      {
        "teamId": 13,
        "name": "Broncos DST",
        "slot": "BE"
      }
    ]
  },
  "210326445": {
    "picks": [
      {
        "overall": 1,
        "round": 1,
        "pick": 1,
        "teamId": 11,
        "name": "Josh Allen",
        "pos": "QB",
        "keeper": false
      },
      {
        "overall": 2,
        "round": 1,
        "pick": 2,
        "teamId": 1,
        "name": "Drake Maye",
        "pos": "QB",
        "keeper": false
      },
      {
        "overall": 3,
        "round": 1,
        "pick": 3,
        "teamId": 2,
        "name": "Jahmyr Gibbs",
        "pos": "RB",
        "keeper": false
      },
      {
        "overall": 4,
        "round": 1,
        "pick": 4,
        "teamId": 8,
        "name": "Puka Nacua",
        "pos": "WR",
        "keeper": false
      },
      {
        "overall": 5,
        "round": 1,
        "pick": 5,
        "teamId": 9,
        "name": "Bijan Robinson",
        "pos": "RB",
        "keeper": false
      },
      {
        "overall": 6,
        "round": 1,
        "pick": 6,
        "teamId": 13,
        "name": "Jayden Daniels",
        "pos": "QB",
        "keeper": false
      },
      {
        "overall": 7,
        "round": 1,
        "pick": 7,
        "teamId": 10,
        "name": "Joe Burrow",
        "pos": "QB",
        "keeper": false
      },
      {
        "overall": 8,
        "round": 1,
        "pick": 8,
        "teamId": 5,
        "name": "Ja'Marr Chase",
        "pos": "WR",
        "keeper": false
      },
      {
        "overall": 9,
        "round": 1,
        "pick": 9,
        "teamId": 4,
        "name": "Jaxon Smith-Njigba",
        "pos": "WR",
        "keeper": false
      },
      {
        "overall": 10,
        "round": 1,
        "pick": 10,
        "teamId": 12,
        "name": "Lamar Jackson",
        "pos": "QB",
        "keeper": false
      },
      {
        "overall": 11,
        "round": 1,
        "pick": 11,
        "teamId": 7,
        "name": "Christian McCaffrey",
        "pos": "RB",
        "keeper": false
      },
      {
        "overall": 12,
        "round": 2,
        "pick": 1,
        "teamId": 7,
        "name": "CeeDee Lamb",
        "pos": "WR",
        "keeper": false
      },
      {
        "overall": 13,
        "round": 2,
        "pick": 2,
        "teamId": 12,
        "name": "Jalen Hurts",
        "pos": "QB",
        "keeper": false
      },
      {
        "overall": 14,
        "round": 2,
        "pick": 3,
        "teamId": 4,
        "name": "Jonathan Taylor",
        "pos": "RB",
        "keeper": false
      },
      {
        "overall": 15,
        "round": 2,
        "pick": 4,
        "teamId": 5,
        "name": "De'Von Achane",
        "pos": "RB",
        "keeper": false
      },
      {
        "overall": 16,
        "round": 2,
        "pick": 5,
        "teamId": 10,
        "name": "Trevor Lawrence",
        "pos": "QB",
        "keeper": false
      },
      {
        "overall": 17,
        "round": 2,
        "pick": 6,
        "teamId": 13,
        "name": "Amon-Ra St. Brown",
        "pos": "WR",
        "keeper": false
      },
      {
        "overall": 18,
        "round": 2,
        "pick": 7,
        "teamId": 9,
        "name": "James Cook III",
        "pos": "RB",
        "keeper": false
      },
      {
        "overall": 19,
        "round": 2,
        "pick": 8,
        "teamId": 8,
        "name": "Derrick Henry",
        "pos": "RB",
        "keeper": false
      },
      {
        "overall": 20,
        "round": 2,
        "pick": 9,
        "teamId": 2,
        "name": "Bo Nix",
        "pos": "QB",
        "keeper": false
      },
      {
        "overall": 21,
        "round": 2,
        "pick": 10,
        "teamId": 1,
        "name": "Jaxson Dart",
        "pos": "QB",
        "keeper": false
      },
      {
        "overall": 22,
        "round": 2,
        "pick": 11,
        "teamId": 11,
        "name": "Justin Jefferson",
        "pos": "WR",
        "keeper": false
      },
      {
        "overall": 23,
        "round": 3,
        "pick": 1,
        "teamId": 11,
        "name": "Drake London",
        "pos": "WR",
        "keeper": false
      },
      {
        "overall": 24,
        "round": 3,
        "pick": 2,
        "teamId": 1,
        "name": "Ashton Jeanty",
        "pos": "RB",
        "keeper": false
      },
      {
        "overall": 25,
        "round": 3,
        "pick": 3,
        "teamId": 2,
        "name": "Justin Herbert",
        "pos": "QB",
        "keeper": false
      },
      {
        "overall": 26,
        "round": 3,
        "pick": 4,
        "teamId": 8,
        "name": "Omarion Hampton",
        "pos": "RB",
        "keeper": false
      },
      {
        "overall": 27,
        "round": 3,
        "pick": 5,
        "teamId": 9,
        "name": "Trey McBride",
        "pos": "TE",
        "keeper": false
      },
      {
        "overall": 28,
        "round": 3,
        "pick": 6,
        "teamId": 13,
        "name": "Jeremiyah Love",
        "pos": "RB",
        "keeper": false
      },
      {
        "overall": 29,
        "round": 3,
        "pick": 7,
        "teamId": 10,
        "name": "Rashee Rice",
        "pos": "WR",
        "keeper": false
      },
      {
        "overall": 30,
        "round": 3,
        "pick": 8,
        "teamId": 5,
        "name": "Nico Collins",
        "pos": "WR",
        "keeper": false
      },
      {
        "overall": 31,
        "round": 3,
        "pick": 9,
        "teamId": 4,
        "name": "Saquon Barkley",
        "pos": "RB",
        "keeper": false
      },
      {
        "overall": 32,
        "round": 3,
        "pick": 10,
        "teamId": 12,
        "name": "Kenneth Walker III",
        "pos": "RB",
        "keeper": false
      },
      {
        "overall": 33,
        "round": 3,
        "pick": 11,
        "teamId": 7,
        "name": "Dak Prescott",
        "pos": "QB",
        "keeper": false
      },
      {
        "overall": 34,
        "round": 4,
        "pick": 1,
        "teamId": 7,
        "name": "Matthew Stafford",
        "pos": "QB",
        "keeper": false
      },
      {
        "overall": 35,
        "round": 4,
        "pick": 2,
        "teamId": 12,
        "name": "Brock Bowers",
        "pos": "TE",
        "keeper": false
      },
      {
        "overall": 36,
        "round": 4,
        "pick": 3,
        "teamId": 4,
        "name": "Brock Purdy",
        "pos": "QB",
        "keeper": false
      },
      {
        "overall": 37,
        "round": 4,
        "pick": 4,
        "teamId": 5,
        "name": "Patrick Mahomes",
        "pos": "QB",
        "keeper": false
      },
      {
        "overall": 38,
        "round": 4,
        "pick": 5,
        "teamId": 10,
        "name": "Chase Brown",
        "pos": "RB",
        "keeper": false
      },
      {
        "overall": 39,
        "round": 4,
        "pick": 6,
        "teamId": 13,
        "name": "A.J. Brown",
        "pos": "WR",
        "keeper": false
      },
      {
        "overall": 40,
        "round": 4,
        "pick": 7,
        "teamId": 9,
        "name": "Chris Olave",
        "pos": "WR",
        "keeper": false
      },
      {
        "overall": 41,
        "round": 4,
        "pick": 8,
        "teamId": 8,
        "name": "Zay Flowers",
        "pos": "WR",
        "keeper": false
      },
      {
        "overall": 42,
        "round": 4,
        "pick": 9,
        "teamId": 2,
        "name": "Kyren Williams",
        "pos": "RB",
        "keeper": false
      },
      {
        "overall": 43,
        "round": 4,
        "pick": 10,
        "teamId": 1,
        "name": "Malik Nabers",
        "pos": "WR",
        "keeper": false
      },
      {
        "overall": 44,
        "round": 4,
        "pick": 11,
        "teamId": 11,
        "name": "Caleb Williams",
        "pos": "QB",
        "keeper": false
      },
      {
        "overall": 45,
        "round": 5,
        "pick": 1,
        "teamId": 11,
        "name": "Breece Hall",
        "pos": "RB",
        "keeper": false
      },
      {
        "overall": 46,
        "round": 5,
        "pick": 2,
        "teamId": 1,
        "name": "Tetairoa McMillan",
        "pos": "WR",
        "keeper": false
      },
      {
        "overall": 47,
        "round": 5,
        "pick": 3,
        "teamId": 2,
        "name": "Davante Adams",
        "pos": "WR",
        "keeper": false
      },
      {
        "overall": 48,
        "round": 5,
        "pick": 4,
        "teamId": 8,
        "name": "Cam Skattebo",
        "pos": "RB",
        "keeper": false
      },
      {
        "overall": 49,
        "round": 5,
        "pick": 5,
        "teamId": 9,
        "name": "DeVonta Smith",
        "pos": "WR",
        "keeper": false
      },
      {
        "overall": 50,
        "round": 5,
        "pick": 6,
        "teamId": 13,
        "name": "Javonte Williams",
        "pos": "RB",
        "keeper": false
      },
      {
        "overall": 51,
        "round": 5,
        "pick": 7,
        "teamId": 10,
        "name": "George Pickens",
        "pos": "WR",
        "keeper": false
      },
      {
        "overall": 52,
        "round": 5,
        "pick": 8,
        "teamId": 5,
        "name": "Garrett Wilson",
        "pos": "WR",
        "keeper": false
      },
      {
        "overall": 53,
        "round": 5,
        "pick": 9,
        "teamId": 4,
        "name": "Colston Loveland",
        "pos": "TE",
        "keeper": false
      },
      {
        "overall": 54,
        "round": 5,
        "pick": 10,
        "teamId": 12,
        "name": "Travis Etienne Jr.",
        "pos": "RB",
        "keeper": false
      },
      {
        "overall": 55,
        "round": 5,
        "pick": 11,
        "teamId": 7,
        "name": "David Montgomery",
        "pos": "RB",
        "keeper": false
      },
      {
        "overall": 56,
        "round": 6,
        "pick": 1,
        "teamId": 7,
        "name": "Ladd McConkey",
        "pos": "WR",
        "keeper": false
      },
      {
        "overall": 57,
        "round": 6,
        "pick": 2,
        "teamId": 12,
        "name": "Emeka Egbuka",
        "pos": "WR",
        "keeper": false
      },
      {
        "overall": 58,
        "round": 6,
        "pick": 3,
        "teamId": 4,
        "name": "Jaylen Waddle",
        "pos": "WR",
        "keeper": false
      },
      {
        "overall": 59,
        "round": 6,
        "pick": 4,
        "teamId": 5,
        "name": "Quinshon Judkins",
        "pos": "RB",
        "keeper": false
      },
      {
        "overall": 60,
        "round": 6,
        "pick": 5,
        "teamId": 10,
        "name": "Steelers DST",
        "pos": "DST",
        "keeper": false
      },
      {
        "overall": 61,
        "round": 6,
        "pick": 6,
        "teamId": 13,
        "name": "Terry McLaurin",
        "pos": "WR",
        "keeper": false
      },
      {
        "overall": 62,
        "round": 6,
        "pick": 7,
        "teamId": 9,
        "name": "Tee Higgins",
        "pos": "WR",
        "keeper": false
      },
      {
        "overall": 63,
        "round": 6,
        "pick": 8,
        "teamId": 8,
        "name": "Jared Goff",
        "pos": "QB",
        "keeper": false
      },
      {
        "overall": 64,
        "round": 6,
        "pick": 9,
        "teamId": 2,
        "name": "DJ Moore",
        "pos": "WR",
        "keeper": false
      },
      {
        "overall": 65,
        "round": 6,
        "pick": 10,
        "teamId": 1,
        "name": "Rhamondre Stevenson",
        "pos": "RB",
        "keeper": false
      },
      {
        "overall": 66,
        "round": 6,
        "pick": 11,
        "teamId": 11,
        "name": "Bucky Irving",
        "pos": "RB",
        "keeper": false
      },
      {
        "overall": 67,
        "round": 7,
        "pick": 1,
        "teamId": 11,
        "name": "D'Andre Swift",
        "pos": "RB",
        "keeper": false
      },
      {
        "overall": 68,
        "round": 7,
        "pick": 2,
        "teamId": 1,
        "name": "Tyler Warren",
        "pos": "TE",
        "keeper": false
      },
      {
        "overall": 69,
        "round": 7,
        "pick": 3,
        "teamId": 2,
        "name": "Courtland Sutton",
        "pos": "WR",
        "keeper": false
      },
      {
        "overall": 70,
        "round": 7,
        "pick": 4,
        "teamId": 8,
        "name": "Sam LaPorta",
        "pos": "TE",
        "keeper": false
      },
      {
        "overall": 71,
        "round": 7,
        "pick": 5,
        "teamId": 9,
        "name": "Jaylen Warren",
        "pos": "RB",
        "keeper": false
      },
      {
        "overall": 72,
        "round": 7,
        "pick": 6,
        "teamId": 13,
        "name": "Kyler Murray",
        "pos": "QB",
        "keeper": false
      },
      {
        "overall": 73,
        "round": 7,
        "pick": 7,
        "teamId": 10,
        "name": "Jadarian Price",
        "pos": "RB",
        "keeper": false
      },
      {
        "overall": 74,
        "round": 7,
        "pick": 8,
        "teamId": 5,
        "name": "George Kittle",
        "pos": "TE",
        "keeper": false
      },
      {
        "overall": 75,
        "round": 7,
        "pick": 9,
        "teamId": 4,
        "name": "Bhayshul Tuten",
        "pos": "RB",
        "keeper": false
      },
      {
        "overall": 76,
        "round": 7,
        "pick": 10,
        "teamId": 12,
        "name": "Rome Odunze",
        "pos": "WR",
        "keeper": false
      },
      {
        "overall": 77,
        "round": 7,
        "pick": 11,
        "teamId": 7,
        "name": "Jameson Williams",
        "pos": "WR",
        "keeper": false
      },
      {
        "overall": 78,
        "round": 8,
        "pick": 1,
        "teamId": 7,
        "name": "Kyle Pitts Sr.",
        "pos": "TE",
        "keeper": false
      },
      {
        "overall": 79,
        "round": 8,
        "pick": 2,
        "teamId": 12,
        "name": "Luther Burden III",
        "pos": "WR",
        "keeper": false
      },
      {
        "overall": 80,
        "round": 8,
        "pick": 3,
        "teamId": 4,
        "name": "Parker Washington",
        "pos": "WR",
        "keeper": false
      },
      {
        "overall": 81,
        "round": 8,
        "pick": 4,
        "teamId": 5,
        "name": "Tony Pollard",
        "pos": "RB",
        "keeper": false
      },
      {
        "overall": 82,
        "round": 8,
        "pick": 5,
        "teamId": 10,
        "name": "DK Metcalf",
        "pos": "WR",
        "keeper": false
      },
      {
        "overall": 83,
        "round": 8,
        "pick": 6,
        "teamId": 13,
        "name": "Harold Fannin Jr.",
        "pos": "TE",
        "keeper": false
      },
      {
        "overall": 84,
        "round": 8,
        "pick": 7,
        "teamId": 9,
        "name": "Jordan Love",
        "pos": "QB",
        "keeper": false
      },
      {
        "overall": 85,
        "round": 8,
        "pick": 8,
        "teamId": 8,
        "name": "Rico Dowdle",
        "pos": "RB",
        "keeper": false
      },
      {
        "overall": 86,
        "round": 8,
        "pick": 9,
        "teamId": 2,
        "name": "Sam Darnold",
        "pos": "QB",
        "keeper": false
      },
      {
        "overall": 87,
        "round": 8,
        "pick": 10,
        "teamId": 1,
        "name": "Carnell Tate",
        "pos": "WR",
        "keeper": false
      },
      {
        "overall": 88,
        "round": 8,
        "pick": 11,
        "teamId": 11,
        "name": "Michael Pittman Jr.",
        "pos": "WR",
        "keeper": false
      },
      {
        "overall": 89,
        "round": 9,
        "pick": 1,
        "teamId": 11,
        "name": "Tyler Shough",
        "pos": "QB",
        "keeper": false
      },
      {
        "overall": 90,
        "round": 9,
        "pick": 2,
        "teamId": 1,
        "name": "Alec Pierce",
        "pos": "WR",
        "keeper": false
      },
      {
        "overall": 91,
        "round": 9,
        "pick": 3,
        "teamId": 2,
        "name": "Dallas Goedert",
        "pos": "TE",
        "keeper": false
      },
      {
        "overall": 92,
        "round": 9,
        "pick": 4,
        "teamId": 8,
        "name": "Jordan Addison",
        "pos": "WR",
        "keeper": false
      },
      {
        "overall": 93,
        "round": 9,
        "pick": 5,
        "teamId": 9,
        "name": "Texans DST",
        "pos": "DST",
        "keeper": false
      },
      {
        "overall": 94,
        "round": 9,
        "pick": 6,
        "teamId": 13,
        "name": "Marvin Harrison Jr.",
        "pos": "WR",
        "keeper": false
      },
      {
        "overall": 95,
        "round": 9,
        "pick": 7,
        "teamId": 10,
        "name": "Daniel Jones",
        "pos": "QB",
        "keeper": false
      },
      {
        "overall": 96,
        "round": 9,
        "pick": 8,
        "teamId": 5,
        "name": "Rams DST",
        "pos": "DST",
        "keeper": false
      },
      {
        "overall": 97,
        "round": 9,
        "pick": 9,
        "teamId": 4,
        "name": "MarShawn Lloyd",
        "pos": "RB",
        "keeper": false
      },
      {
        "overall": 98,
        "round": 9,
        "pick": 10,
        "teamId": 12,
        "name": "Jonathon Brooks",
        "pos": "RB",
        "keeper": false
      },
      {
        "overall": 99,
        "round": 9,
        "pick": 11,
        "teamId": 7,
        "name": "J.K. Dobbins",
        "pos": "RB",
        "keeper": false
      },
      {
        "overall": 100,
        "round": 10,
        "pick": 1,
        "teamId": 7,
        "name": "Seahawks DST",
        "pos": "DST",
        "keeper": false
      },
      {
        "overall": 101,
        "round": 10,
        "pick": 2,
        "teamId": 12,
        "name": "Baker Mayfield",
        "pos": "QB",
        "keeper": false
      },
      {
        "overall": 102,
        "round": 10,
        "pick": 3,
        "teamId": 4,
        "name": "De'Zhaun Stribling",
        "pos": "WR",
        "keeper": false
      },
      {
        "overall": 103,
        "round": 10,
        "pick": 4,
        "teamId": 5,
        "name": "Chuba Hubbard",
        "pos": "RB",
        "keeper": false
      },
      {
        "overall": 104,
        "round": 10,
        "pick": 5,
        "teamId": 10,
        "name": "Jake Ferguson",
        "pos": "TE",
        "keeper": false
      },
      {
        "overall": 105,
        "round": 10,
        "pick": 6,
        "teamId": 13,
        "name": "TreVeyon Henderson",
        "pos": "RB",
        "keeper": false
      },
      {
        "overall": 106,
        "round": 10,
        "pick": 7,
        "teamId": 9,
        "name": "C.J. Stroud",
        "pos": "QB",
        "keeper": false
      },
      {
        "overall": 107,
        "round": 10,
        "pick": 8,
        "teamId": 8,
        "name": "KC Concepcion",
        "pos": "WR",
        "keeper": false
      },
      {
        "overall": 108,
        "round": 10,
        "pick": 9,
        "teamId": 2,
        "name": "Kenny Gainwell",
        "pos": "RB",
        "keeper": false
      },
      {
        "overall": 109,
        "round": 10,
        "pick": 10,
        "teamId": 1,
        "name": "Jacory Croskey-Merritt",
        "pos": "RB",
        "keeper": false
      },
      {
        "overall": 110,
        "round": 10,
        "pick": 11,
        "teamId": 11,
        "name": "Tucker Kraft",
        "pos": "TE",
        "keeper": false
      },
      {
        "overall": 111,
        "round": 11,
        "pick": 1,
        "teamId": 11,
        "name": "Christian Watson",
        "pos": "WR",
        "keeper": false
      },
      {
        "overall": 112,
        "round": 11,
        "pick": 2,
        "teamId": 1,
        "name": "Jordan Mason",
        "pos": "RB",
        "keeper": false
      },
      {
        "overall": 113,
        "round": 11,
        "pick": 3,
        "teamId": 2,
        "name": "Mark Andrews",
        "pos": "TE",
        "keeper": false
      },
      {
        "overall": 114,
        "round": 11,
        "pick": 4,
        "teamId": 8,
        "name": "Woody Marks",
        "pos": "RB",
        "keeper": false
      },
      {
        "overall": 115,
        "round": 11,
        "pick": 5,
        "teamId": 9,
        "name": "Matthew Golden",
        "pos": "WR",
        "keeper": false
      },
      {
        "overall": 116,
        "round": 11,
        "pick": 6,
        "teamId": 13,
        "name": "Mike Evans",
        "pos": "WR",
        "keeper": false
      },
      {
        "overall": 117,
        "round": 11,
        "pick": 7,
        "teamId": 10,
        "name": "Brian Thomas Jr.",
        "pos": "WR",
        "keeper": false
      },
      {
        "overall": 118,
        "round": 11,
        "pick": 8,
        "teamId": 5,
        "name": "Wan'Dale Robinson",
        "pos": "WR",
        "keeper": false
      },
      {
        "overall": 119,
        "round": 11,
        "pick": 9,
        "teamId": 4,
        "name": "Stefon Diggs",
        "pos": "WR",
        "keeper": false
      },
      {
        "overall": 120,
        "round": 11,
        "pick": 10,
        "teamId": 12,
        "name": "Michael Wilson",
        "pos": "WR",
        "keeper": false
      },
      {
        "overall": 121,
        "round": 11,
        "pick": 11,
        "teamId": 7,
        "name": "Khalil Shakir",
        "pos": "WR",
        "keeper": false
      },
      {
        "overall": 122,
        "round": 12,
        "pick": 1,
        "teamId": 7,
        "name": "Josh Jacobs",
        "pos": "RB",
        "keeper": false
      },
      {
        "overall": 123,
        "round": 12,
        "pick": 2,
        "teamId": 12,
        "name": "Jakobi Meyers",
        "pos": "WR",
        "keeper": false
      },
      {
        "overall": 124,
        "round": 12,
        "pick": 3,
        "teamId": 4,
        "name": "Aaron Jones Sr.",
        "pos": "RB",
        "keeper": false
      },
      {
        "overall": 125,
        "round": 12,
        "pick": 4,
        "teamId": 5,
        "name": "Kyle Monangai",
        "pos": "RB",
        "keeper": false
      },
      {
        "overall": 126,
        "round": 12,
        "pick": 5,
        "teamId": 10,
        "name": "Blake Corum",
        "pos": "RB",
        "keeper": false
      },
      {
        "overall": 127,
        "round": 12,
        "pick": 6,
        "teamId": 13,
        "name": "Malik Willis",
        "pos": "QB",
        "keeper": false
      },
      {
        "overall": 128,
        "round": 12,
        "pick": 7,
        "teamId": 9,
        "name": "RJ Harvey",
        "pos": "RB",
        "keeper": false
      },
      {
        "overall": 129,
        "round": 12,
        "pick": 8,
        "teamId": 8,
        "name": "Travis Kelce",
        "pos": "TE",
        "keeper": false
      },
      {
        "overall": 130,
        "round": 12,
        "pick": 9,
        "teamId": 2,
        "name": "Xavier Worthy",
        "pos": "WR",
        "keeper": false
      },
      {
        "overall": 131,
        "round": 12,
        "pick": 10,
        "teamId": 1,
        "name": "Romeo Doubs",
        "pos": "WR",
        "keeper": false
      },
      {
        "overall": 132,
        "round": 12,
        "pick": 11,
        "teamId": 11,
        "name": "Jayden Reed",
        "pos": "WR",
        "keeper": false
      },
      {
        "overall": 133,
        "round": 13,
        "pick": 1,
        "teamId": 11,
        "name": "Isaiah Likely",
        "pos": "TE",
        "keeper": false
      },
      {
        "overall": 134,
        "round": 13,
        "pick": 2,
        "teamId": 1,
        "name": "Cam Ward",
        "pos": "QB",
        "keeper": false
      },
      {
        "overall": 135,
        "round": 13,
        "pick": 3,
        "teamId": 2,
        "name": "Deebo Samuel Sr.",
        "pos": "WR",
        "keeper": false
      },
      {
        "overall": 136,
        "round": 13,
        "pick": 4,
        "teamId": 8,
        "name": "Kimani Vidal",
        "pos": "RB",
        "keeper": false
      },
      {
        "overall": 137,
        "round": 13,
        "pick": 5,
        "teamId": 9,
        "name": "Bryce Young",
        "pos": "QB",
        "keeper": false
      },
      {
        "overall": 138,
        "round": 13,
        "pick": 6,
        "teamId": 13,
        "name": "Jacoby Brissett",
        "pos": "QB",
        "keeper": false
      },
      {
        "overall": 139,
        "round": 13,
        "pick": 7,
        "teamId": 10,
        "name": "T.J. Hockenson",
        "pos": "TE",
        "keeper": false
      },
      {
        "overall": 140,
        "round": 13,
        "pick": 8,
        "teamId": 5,
        "name": "Geno Smith",
        "pos": "QB",
        "keeper": false
      },
      {
        "overall": 141,
        "round": 13,
        "pick": 9,
        "teamId": 4,
        "name": "Fernando Mendoza",
        "pos": "QB",
        "keeper": false
      },
      {
        "overall": 142,
        "round": 13,
        "pick": 10,
        "teamId": 12,
        "name": "Quentin Johnston",
        "pos": "WR",
        "keeper": false
      },
      {
        "overall": 143,
        "round": 13,
        "pick": 11,
        "teamId": 7,
        "name": "Makai Lemon",
        "pos": "WR",
        "keeper": false
      },
      {
        "overall": 144,
        "round": 14,
        "pick": 1,
        "teamId": 7,
        "name": "Terrance Ferguson",
        "pos": "TE",
        "keeper": false
      },
      {
        "overall": 145,
        "round": 14,
        "pick": 2,
        "teamId": 12,
        "name": "Dalton Kincaid",
        "pos": "TE",
        "keeper": false
      },
      {
        "overall": 146,
        "round": 14,
        "pick": 3,
        "teamId": 4,
        "name": "Josh Downs",
        "pos": "WR",
        "keeper": false
      },
      {
        "overall": 147,
        "round": 14,
        "pick": 4,
        "teamId": 5,
        "name": "Rachaad White",
        "pos": "RB",
        "keeper": false
      },
      {
        "overall": 148,
        "round": 14,
        "pick": 5,
        "teamId": 10,
        "name": "Rashid Shaheed",
        "pos": "WR",
        "keeper": false
      },
      {
        "overall": 149,
        "round": 14,
        "pick": 6,
        "teamId": 13,
        "name": "Hunter Henry",
        "pos": "TE",
        "keeper": false
      },
      {
        "overall": 150,
        "round": 14,
        "pick": 7,
        "teamId": 9,
        "name": "Chris Godwin Jr.",
        "pos": "WR",
        "keeper": false
      },
      {
        "overall": 151,
        "round": 14,
        "pick": 8,
        "teamId": 8,
        "name": "Calvin Ridley",
        "pos": "WR",
        "keeper": false
      },
      {
        "overall": 152,
        "round": 14,
        "pick": 9,
        "teamId": 2,
        "name": "Tyjae Spears",
        "pos": "RB",
        "keeper": false
      },
      {
        "overall": 153,
        "round": 14,
        "pick": 10,
        "teamId": 1,
        "name": "Kenyon Sadiq",
        "pos": "TE",
        "keeper": false
      },
      {
        "overall": 154,
        "round": 14,
        "pick": 11,
        "teamId": 11,
        "name": "Jalen Coker",
        "pos": "WR",
        "keeper": false
      },
      {
        "overall": 155,
        "round": 15,
        "pick": 1,
        "teamId": 11,
        "name": "Jalen McMillan",
        "pos": "WR",
        "keeper": false
      },
      {
        "overall": 156,
        "round": 15,
        "pick": 2,
        "teamId": 1,
        "name": "Zach Charbonnet",
        "pos": "RB",
        "keeper": false
      },
      {
        "overall": 157,
        "round": 15,
        "pick": 3,
        "teamId": 2,
        "name": "Lions DST",
        "pos": "DST",
        "keeper": false
      },
      {
        "overall": 158,
        "round": 15,
        "pick": 4,
        "teamId": 8,
        "name": "Chris Rodriguez Jr.",
        "pos": "RB",
        "keeper": false
      },
      {
        "overall": 159,
        "round": 15,
        "pick": 5,
        "teamId": 9,
        "name": "Tyler Allgeier",
        "pos": "RB",
        "keeper": false
      },
      {
        "overall": 160,
        "round": 15,
        "pick": 6,
        "teamId": 13,
        "name": "Broncos DST",
        "pos": "DST",
        "keeper": false
      },
      {
        "overall": 161,
        "round": 15,
        "pick": 7,
        "teamId": 10,
        "name": "Juwan Johnson",
        "pos": "TE",
        "keeper": false
      },
      {
        "overall": 162,
        "round": 15,
        "pick": 8,
        "teamId": 5,
        "name": "Keenan Allen",
        "pos": "WR",
        "keeper": false
      },
      {
        "overall": 163,
        "round": 15,
        "pick": 9,
        "teamId": 4,
        "name": "Denzel Boston",
        "pos": "WR",
        "keeper": false
      },
      {
        "overall": 164,
        "round": 15,
        "pick": 10,
        "teamId": 12,
        "name": "Ravens DST",
        "pos": "DST",
        "keeper": false
      },
      {
        "overall": 165,
        "round": 15,
        "pick": 11,
        "teamId": 7,
        "name": "Aaron Rodgers",
        "pos": "QB",
        "keeper": false
      },
      {
        "overall": 166,
        "round": 16,
        "pick": 1,
        "teamId": 7,
        "name": "Mike Washington Jr.",
        "pos": "RB",
        "keeper": false
      },
      {
        "overall": 167,
        "round": 16,
        "pick": 2,
        "teamId": 12,
        "name": "Travis Hunter",
        "pos": "WR",
        "keeper": false
      },
      {
        "overall": 168,
        "round": 16,
        "pick": 3,
        "teamId": 4,
        "name": "Jonah Coleman",
        "pos": "RB",
        "keeper": false
      },
      {
        "overall": 169,
        "round": 16,
        "pick": 4,
        "teamId": 5,
        "name": "Jerry Jeudy",
        "pos": "WR",
        "keeper": false
      },
      {
        "overall": 170,
        "round": 16,
        "pick": 5,
        "teamId": 10,
        "name": "Tre Tucker",
        "pos": "WR",
        "keeper": false
      },
      {
        "overall": 171,
        "round": 16,
        "pick": 6,
        "teamId": 13,
        "name": "Brian Robinson Jr.",
        "pos": "RB",
        "keeper": false
      },
      {
        "overall": 172,
        "round": 16,
        "pick": 7,
        "teamId": 9,
        "name": "Brenton Strange",
        "pos": "TE",
        "keeper": false
      },
      {
        "overall": 173,
        "round": 16,
        "pick": 8,
        "teamId": 8,
        "name": "Deshaun Watson",
        "pos": "QB",
        "keeper": false
      },
      {
        "overall": 174,
        "round": 16,
        "pick": 9,
        "teamId": 2,
        "name": "Adonai Mitchell",
        "pos": "WR",
        "keeper": false
      },
      {
        "overall": 175,
        "round": 16,
        "pick": 10,
        "teamId": 1,
        "name": "Jordyn Tyson",
        "pos": "WR",
        "keeper": false
      },
      {
        "overall": 176,
        "round": 16,
        "pick": 11,
        "teamId": 11,
        "name": "Eagles DST",
        "pos": "DST",
        "keeper": false
      },
      {
        "overall": 177,
        "round": 17,
        "pick": 1,
        "teamId": 11,
        "name": "Caleb Douglas",
        "pos": "WR",
        "keeper": false
      },
      {
        "overall": 178,
        "round": 17,
        "pick": 2,
        "teamId": 1,
        "name": "Patriots DST",
        "pos": "DST",
        "keeper": false
      },
      {
        "overall": 179,
        "round": 17,
        "pick": 3,
        "teamId": 2,
        "name": "Jalen Nailor",
        "pos": "WR",
        "keeper": false
      },
      {
        "overall": 180,
        "round": 17,
        "pick": 4,
        "teamId": 8,
        "name": "Chargers DST",
        "pos": "DST",
        "keeper": false
      },
      {
        "overall": 181,
        "round": 17,
        "pick": 5,
        "teamId": 9,
        "name": "Keaton Mitchell",
        "pos": "RB",
        "keeper": false
      },
      {
        "overall": 182,
        "round": 17,
        "pick": 6,
        "teamId": 13,
        "name": "Browns DST",
        "pos": "DST",
        "keeper": false
      },
      {
        "overall": 183,
        "round": 17,
        "pick": 7,
        "teamId": 10,
        "name": "Tua Tagovailoa",
        "pos": "QB",
        "keeper": false
      },
      {
        "overall": 184,
        "round": 17,
        "pick": 8,
        "teamId": 5,
        "name": "Kayshon Boutte",
        "pos": "WR",
        "keeper": false
      },
      {
        "overall": 185,
        "round": 17,
        "pick": 9,
        "teamId": 4,
        "name": "Bears DST",
        "pos": "DST",
        "keeper": false
      },
      {
        "overall": 186,
        "round": 17,
        "pick": 10,
        "teamId": 12,
        "name": "Chiefs DST",
        "pos": "DST",
        "keeper": false
      },
      {
        "overall": 187,
        "round": 17,
        "pick": 11,
        "teamId": 7,
        "name": "Kaelon Black",
        "pos": "RB",
        "keeper": false
      },
      {
        "overall": 188,
        "round": 18,
        "pick": 1,
        "teamId": 7,
        "name": "Ja'Kobi Lane",
        "pos": "WR",
        "keeper": false
      },
      {
        "overall": 189,
        "round": 18,
        "pick": 2,
        "teamId": 12,
        "name": "Braelon Allen",
        "pos": "RB",
        "keeper": false
      },
      {
        "overall": 190,
        "round": 18,
        "pick": 3,
        "teamId": 4,
        "name": "Tank Dell",
        "pos": "WR",
        "keeper": false
      },
      {
        "overall": 191,
        "round": 18,
        "pick": 4,
        "teamId": 5,
        "name": "Justice Hill",
        "pos": "RB",
        "keeper": false
      },
      {
        "overall": 192,
        "round": 18,
        "pick": 5,
        "teamId": 10,
        "name": "Tank Bigsby",
        "pos": "RB",
        "keeper": false
      },
      {
        "overall": 193,
        "round": 18,
        "pick": 6,
        "teamId": 13,
        "name": "Ray Davis",
        "pos": "RB",
        "keeper": false
      },
      {
        "overall": 194,
        "round": 18,
        "pick": 7,
        "teamId": 9,
        "name": "Rashod Bateman",
        "pos": "WR",
        "keeper": false
      },
      {
        "overall": 195,
        "round": 18,
        "pick": 8,
        "teamId": 8,
        "name": "Dontayvion Wicks",
        "pos": "WR",
        "keeper": false
      },
      {
        "overall": 196,
        "round": 18,
        "pick": 9,
        "teamId": 2,
        "name": "Dylan Sampson",
        "pos": "RB",
        "keeper": false
      },
      {
        "overall": 197,
        "round": 18,
        "pick": 10,
        "teamId": 1,
        "name": "Seth McGowan",
        "pos": "RB",
        "keeper": false
      },
      {
        "overall": 198,
        "round": 18,
        "pick": 11,
        "teamId": 11,
        "name": "Najee Harris",
        "pos": "RB",
        "keeper": false
      }
    ],
    "activity": [
      {
        "kind": "WAIVER",
        "status": "PENDING",
        "teamId": 1,
        "at": 1790706718192,
        "moves": [
          {
            "action": "ADD",
            "name": "J.J. McCarthy"
          },
          {
            "action": "DROP",
            "name": "Jameis Winston"
          }
        ]
      },
      {
        "kind": "WAIVER",
        "status": "EXECUTED",
        "teamId": 1,
        "at": 1790752028292,
        "moves": [
          {
            "action": "ADD",
            "name": "J.J. McCarthy"
          },
          {
            "action": "DROP",
            "name": "Jameis Winston"
          }
        ]
      },
      {
        "kind": "WAIVER",
        "status": "EXECUTED",
        "teamId": 7,
        "at": 1790752028293,
        "moves": [
          {
            "action": "ADD",
            "name": "Kenyon Sadiq"
          },
          {
            "action": "DROP",
            "name": "Cade Otton"
          }
        ]
      },
      {
        "kind": "FREEAGENT",
        "status": "EXECUTED",
        "teamId": 5,
        "at": 1790876370919,
        "moves": [
          {
            "action": "ADD",
            "name": "Emanuel Wilson"
          }
        ]
      },
      {
        "kind": "WAIVER",
        "status": "EXECUTED",
        "teamId": 7,
        "at": 1790752028292,
        "moves": [
          {
            "action": "ADD",
            "name": "Jaylen Wright"
          }
        ]
      },
      {
        "kind": "FREEAGENT",
        "status": "EXECUTED",
        "teamId": 5,
        "at": 1790876271951,
        "moves": [
          {
            "action": "ADD",
            "name": "Marcus Mariota"
          }
        ]
      },
      {
        "kind": "FREEAGENT",
        "status": "EXECUTED",
        "teamId": 8,
        "at": 1790810910013,
        "moves": [
          {
            "action": "ADD",
            "name": "Ollie Gordon II"
          },
          {
            "action": "DROP",
            "name": "Kimani Vidal"
          }
        ]
      },
      {
        "kind": "WAIVER",
        "status": "EXECUTED",
        "teamId": 8,
        "at": 1790752028293,
        "moves": [
          {
            "action": "ADD",
            "name": "Tyreek Hill"
          },
          {
            "action": "DROP",
            "name": "Calvin Ridley"
          }
        ]
      },
      {
        "kind": "FREEAGENT",
        "status": "EXECUTED",
        "teamId": 1,
        "at": 1790821824532,
        "moves": [
          {
            "action": "ADD",
            "name": "Vikings DST"
          },
          {
            "action": "DROP",
            "name": "Bengals DST"
          }
        ]
      },
      {
        "kind": "FREEAGENT",
        "status": "EXECUTED",
        "teamId": 1,
        "at": 1790821697293,
        "moves": [
          {
            "action": "ADD",
            "name": "Geno Smith"
          },
          {
            "action": "DROP",
            "name": "J.J. McCarthy"
          }
        ]
      },
      {
        "kind": "FREEAGENT",
        "status": "EXECUTED",
        "teamId": 5,
        "at": 1790876413389,
        "moves": [
          {
            "action": "ADD",
            "name": "Case Keenum"
          },
          {
            "action": "DROP",
            "name": "Justice Hill"
          }
        ]
      },
      {
        "kind": "FREEAGENT",
        "status": "EXECUTED",
        "teamId": 5,
        "at": 1790876347001,
        "moves": [
          {
            "action": "ADD",
            "name": "Malik Washington"
          }
        ]
      }
    ],
    "freeAgents": [
      {
        "name": "De'Von Achane",
        "pos": "RB",
        "nfl": "MIA",
        "owned": 51.6,
        "waiver": false
      },
      {
        "name": "Kalif Raymond",
        "pos": "WR",
        "nfl": "CHI",
        "owned": 50.7,
        "waiver": false
      },
      {
        "name": "49ers DST",
        "pos": "DST",
        "nfl": "SF",
        "owned": 48.9,
        "waiver": false
      },
      {
        "name": "Bills DST",
        "pos": "DST",
        "nfl": "BUF",
        "owned": 44.8,
        "waiver": false
      },
      {
        "name": "Jaxson Dart",
        "pos": "QB",
        "nfl": "NYG",
        "owned": 35.7,
        "waiver": false
      },
      {
        "name": "Darren Waller",
        "pos": "TE",
        "nfl": "CAR",
        "owned": 31.3,
        "waiver": false
      },
      {
        "name": "Jaguars DST",
        "pos": "DST",
        "nfl": "JAC",
        "owned": 28.3,
        "waiver": false
      },
      {
        "name": "Packers DST",
        "pos": "DST",
        "nfl": "GB",
        "owned": 28.0,
        "waiver": false
      },
      {
        "name": "Isiah Pacheco",
        "pos": "RB",
        "nfl": "DET",
        "owned": 22.9,
        "waiver": false
      },
      {
        "name": "Terrance Ferguson",
        "pos": "TE",
        "nfl": "LAR",
        "owned": 21.0,
        "waiver": false
      },
      {
        "name": "Buccaneers DST",
        "pos": "DST",
        "nfl": "TB",
        "owned": 20.7,
        "waiver": false
      },
      {
        "name": "Emmett Johnson",
        "pos": "RB",
        "nfl": "KC",
        "owned": 20.5,
        "waiver": false
      },
      {
        "name": "Pat Freiermuth",
        "pos": "TE",
        "nfl": "PIT",
        "owned": 19.8,
        "waiver": true
      },
      {
        "name": "Bengals DST",
        "pos": "DST",
        "nfl": "CIN",
        "owned": 18.2,
        "waiver": false
      },
      {
        "name": "Chris Rodriguez Jr.",
        "pos": "RB",
        "nfl": "JAC",
        "owned": 17.5,
        "waiver": false
      },
      {
        "name": "Kendre Miller",
        "pos": "RB",
        "nfl": "NO",
        "owned": 16.7,
        "waiver": false
      },
      {
        "name": "Jerry Jeudy",
        "pos": "WR",
        "nfl": "CLE",
        "owned": 15.2,
        "waiver": true
      },
      {
        "name": "Panthers DST",
        "pos": "DST",
        "nfl": "CAR",
        "owned": 13.8,
        "waiver": false
      },
      {
        "name": "Mack Hollins",
        "pos": "WR",
        "nfl": "NE",
        "owned": 12.8,
        "waiver": false
      },
      {
        "name": "Cooper Kupp",
        "pos": "WR",
        "nfl": "SEA",
        "owned": 12.6,
        "waiver": false
      },
      {
        "name": "Michael Mayer",
        "pos": "TE",
        "nfl": "LV",
        "owned": 12.3,
        "waiver": false
      },
      {
        "name": "Justice Hill",
        "pos": "RB",
        "nfl": "BAL",
        "owned": 12.1,
        "waiver": false
      },
      {
        "name": "Calvin Ridley",
        "pos": "WR",
        "nfl": "TEN",
        "owned": 12.0,
        "waiver": false
      },
      {
        "name": "Raiders DST",
        "pos": "DST",
        "nfl": "LV",
        "owned": 11.4,
        "waiver": false
      },
      {
        "name": "Jets DST",
        "pos": "DST",
        "nfl": "NYJ",
        "owned": 11.4,
        "waiver": false
      },
      {
        "name": "George Holani",
        "pos": "RB",
        "nfl": "SEA",
        "owned": 11.3,
        "waiver": false
      },
      {
        "name": "Mike Gesicki",
        "pos": "TE",
        "nfl": "CIN",
        "owned": 9.6,
        "waiver": false
      },
      {
        "name": "Kayshon Boutte",
        "pos": "WR",
        "nfl": "HOU",
        "owned": 9.1,
        "waiver": false
      },
      {
        "name": "Chris Brooks",
        "pos": "RB",
        "nfl": "GB",
        "owned": 8.9,
        "waiver": false
      },
      {
        "name": "AJ Barner",
        "pos": "TE",
        "nfl": "SEA",
        "owned": 8.3,
        "waiver": false
      },
      {
        "name": "Isaiah Davis",
        "pos": "RB",
        "nfl": "NYJ",
        "owned": 8.1,
        "waiver": false
      },
      {
        "name": "Giants DST",
        "pos": "DST",
        "nfl": "NYG",
        "owned": 8.1,
        "waiver": false
      },
      {
        "name": "Samaje Perine",
        "pos": "RB",
        "nfl": "CIN",
        "owned": 7.7,
        "waiver": false
      },
      {
        "name": "Malachi Fields",
        "pos": "WR",
        "nfl": "NYG",
        "owned": 7.7,
        "waiver": false
      },
      {
        "name": "Oronde Gadsden",
        "pos": "TE",
        "nfl": "LAC",
        "owned": 7.0,
        "waiver": false
      },
      {
        "name": "Jalen Nailor",
        "pos": "WR",
        "nfl": "LV",
        "owned": 6.8,
        "waiver": false
      },
      {
        "name": "Jauan Jennings",
        "pos": "WR",
        "nfl": "MIN",
        "owned": 6.5,
        "waiver": false
      },
      {
        "name": "Antonio Williams",
        "pos": "WR",
        "nfl": "WAS",
        "owned": 6.5,
        "waiver": false
      },
      {
        "name": "Cowboys DST",
        "pos": "DST",
        "nfl": "DAL",
        "owned": 6.4,
        "waiver": false
      },
      {
        "name": "Kaleb Johnson",
        "pos": "RB",
        "nfl": "GB",
        "owned": 6.2,
        "waiver": false
      }
    ],
    "slots": [
      {
        "teamId": 1,
        "name": "Drake Maye",
        "slot": "QB"
      },
      {
        "teamId": 1,
        "name": "Ashton Jeanty",
        "slot": "RB"
      },
      {
        "teamId": 1,
        "name": "Malik Nabers",
        "slot": "WR"
      },
      {
        "teamId": 1,
        "name": "Tetairoa McMillan",
        "slot": "WR"
      },
      {
        "teamId": 1,
        "name": "Rhamondre Stevenson",
        "slot": "RB"
      },
      {
        "teamId": 1,
        "name": "Tyler Warren",
        "slot": "TE"
      },
      {
        "teamId": 1,
        "name": "Carnell Tate",
        "slot": "WR"
      },
      {
        "teamId": 1,
        "name": "Alec Pierce",
        "slot": "BE"
      },
      {
        "teamId": 1,
        "name": "Jacory Croskey-Merritt",
        "slot": "BE"
      },
      {
        "teamId": 1,
        "name": "Jordan Mason",
        "slot": "BE"
      },
      {
        "teamId": 1,
        "name": "Romeo Doubs",
        "slot": "BE"
      },
      {
        "teamId": 1,
        "name": "Cam Ward",
        "slot": "BE"
      },
      {
        "teamId": 1,
        "name": "Zach Charbonnet",
        "slot": "BE"
      },
      {
        "teamId": 1,
        "name": "Jordyn Tyson",
        "slot": "IR"
      },
      {
        "teamId": 1,
        "name": "Patriots DST",
        "slot": "BE"
      },
      {
        "teamId": 1,
        "name": "Alvin Kamara",
        "slot": "FLEX"
      },
      {
        "teamId": 1,
        "name": "Dalton Schultz",
        "slot": "BE"
      },
      {
        "teamId": 1,
        "name": "Geno Smith",
        "slot": "OP"
      },
      {
        "teamId": 1,
        "name": "Vikings DST",
        "slot": "DST"
      },
      {
        "teamId": 2,
        "name": "Jahmyr Gibbs",
        "slot": "RB"
      },
      {
        "teamId": 2,
        "name": "Bo Nix",
        "slot": "BE"
      },
      {
        "teamId": 2,
        "name": "Justin Herbert",
        "slot": "QB"
      },
      {
        "teamId": 2,
        "name": "Kyren Williams",
        "slot": "RB"
      },
      {
        "teamId": 2,
        "name": "Davante Adams",
        "slot": "WR"
      },
      {
        "teamId": 2,
        "name": "DJ Moore",
        "slot": "WR"
      },
      {
        "teamId": 2,
        "name": "Courtland Sutton",
        "slot": "FLEX"
      },
      {
        "teamId": 2,
        "name": "Sam Darnold",
        "slot": "OP"
      },
      {
        "teamId": 2,
        "name": "Dallas Goedert",
        "slot": "BE"
      },
      {
        "teamId": 2,
        "name": "Kenny Gainwell",
        "slot": "BE"
      },
      {
        "teamId": 2,
        "name": "Mark Andrews",
        "slot": "TE"
      },
      {
        "teamId": 2,
        "name": "Xavier Worthy",
        "slot": "BE"
      },
      {
        "teamId": 2,
        "name": "Deebo Samuel Sr.",
        "slot": "WR"
      },
      {
        "teamId": 2,
        "name": "Tyjae Spears",
        "slot": "BE"
      },
      {
        "teamId": 2,
        "name": "Lions DST",
        "slot": "DST"
      },
      {
        "teamId": 2,
        "name": "Adonai Mitchell",
        "slot": "BE"
      },
      {
        "teamId": 2,
        "name": "Dylan Sampson",
        "slot": "BE"
      },
      {
        "teamId": 2,
        "name": "Cole Kmet",
        "slot": "BE"
      },
      {
        "teamId": 4,
        "name": "Jaxon Smith-Njigba",
        "slot": "WR"
      },
      {
        "teamId": 4,
        "name": "Jonathan Taylor",
        "slot": "RB"
      },
      {
        "teamId": 4,
        "name": "Saquon Barkley",
        "slot": "RB"
      },
      {
        "teamId": 4,
        "name": "Brock Purdy",
        "slot": "QB"
      },
      {
        "teamId": 4,
        "name": "Colston Loveland",
        "slot": "TE"
      },
      {
        "teamId": 4,
        "name": "Jaylen Waddle",
        "slot": "BE"
      },
      {
        "teamId": 4,
        "name": "Bhayshul Tuten",
        "slot": "BE"
      },
      {
        "teamId": 4,
        "name": "Parker Washington",
        "slot": "WR"
      },
      {
        "teamId": 4,
        "name": "MarShawn Lloyd",
        "slot": "BE"
      },
      {
        "teamId": 4,
        "name": "De'Zhaun Stribling",
        "slot": "BE"
      },
      {
        "teamId": 4,
        "name": "Stefon Diggs",
        "slot": "BE"
      },
      {
        "teamId": 4,
        "name": "Aaron Jones Sr.",
        "slot": "FLEX"
      },
      {
        "teamId": 4,
        "name": "Fernando Mendoza",
        "slot": "BE"
      },
      {
        "teamId": 4,
        "name": "Josh Downs",
        "slot": "WR"
      },
      {
        "teamId": 4,
        "name": "Denzel Boston",
        "slot": "BE"
      },
      {
        "teamId": 4,
        "name": "Jonah Coleman",
        "slot": "BE"
      },
      {
        "teamId": 4,
        "name": "Bears DST",
        "slot": "DST"
      },
      {
        "teamId": 4,
        "name": "Tank Dell",
        "slot": "IR"
      },
      {
        "teamId": 4,
        "name": "Michael Penix Jr.",
        "slot": "OP"
      },
      {
        "teamId": 5,
        "name": "Ja'Marr Chase",
        "slot": "WR"
      },
      {
        "teamId": 5,
        "name": "Nico Collins",
        "slot": "IR"
      },
      {
        "teamId": 5,
        "name": "Patrick Mahomes",
        "slot": "QB"
      },
      {
        "teamId": 5,
        "name": "Garrett Wilson",
        "slot": "WR"
      },
      {
        "teamId": 5,
        "name": "Quinshon Judkins",
        "slot": "FLEX"
      },
      {
        "teamId": 5,
        "name": "George Kittle",
        "slot": "TE"
      },
      {
        "teamId": 5,
        "name": "Tony Pollard",
        "slot": "RB"
      },
      {
        "teamId": 5,
        "name": "Rams DST",
        "slot": "DST"
      },
      {
        "teamId": 5,
        "name": "Chuba Hubbard",
        "slot": "RB"
      },
      {
        "teamId": 5,
        "name": "Wan'Dale Robinson",
        "slot": "BE"
      },
      {
        "teamId": 5,
        "name": "Kyle Monangai",
        "slot": "BE"
      },
      {
        "teamId": 5,
        "name": "Rachaad White",
        "slot": "BE"
      },
      {
        "teamId": 5,
        "name": "Keenan Allen",
        "slot": "BE"
      },
      {
        "teamId": 5,
        "name": "Kirk Cousins",
        "slot": "OP"
      },
      {
        "teamId": 5,
        "name": "Devaughn Vele",
        "slot": "WR"
      },
      {
        "teamId": 5,
        "name": "Marcus Mariota",
        "slot": "BE"
      },
      {
        "teamId": 5,
        "name": "Malik Washington",
        "slot": "BE"
      },
      {
        "teamId": 5,
        "name": "Emanuel Wilson",
        "slot": "BE"
      },
      {
        "teamId": 5,
        "name": "Case Keenum",
        "slot": "BE"
      },
      {
        "teamId": 7,
        "name": "Christian McCaffrey",
        "slot": "RB"
      },
      {
        "teamId": 7,
        "name": "CeeDee Lamb",
        "slot": "WR"
      },
      {
        "teamId": 7,
        "name": "Dak Prescott",
        "slot": "QB"
      },
      {
        "teamId": 7,
        "name": "Matthew Stafford",
        "slot": "OP"
      },
      {
        "teamId": 7,
        "name": "David Montgomery",
        "slot": "RB"
      },
      {
        "teamId": 7,
        "name": "Ladd McConkey",
        "slot": "WR"
      },
      {
        "teamId": 7,
        "name": "Jameson Williams",
        "slot": "WR"
      },
      {
        "teamId": 7,
        "name": "Kyle Pitts Sr.",
        "slot": "BE"
      },
      {
        "teamId": 7,
        "name": "J.K. Dobbins",
        "slot": "FLEX"
      },
      {
        "teamId": 7,
        "name": "Seahawks DST",
        "slot": "DST"
      },
      {
        "teamId": 7,
        "name": "Khalil Shakir",
        "slot": "BE"
      },
      {
        "teamId": 7,
        "name": "Josh Jacobs",
        "slot": "BE"
      },
      {
        "teamId": 7,
        "name": "Makai Lemon",
        "slot": "BE"
      },
      {
        "teamId": 7,
        "name": "Aaron Rodgers",
        "slot": "BE"
      },
      {
        "teamId": 7,
        "name": "Mike Washington Jr.",
        "slot": "BE"
      },
      {
        "teamId": 7,
        "name": "Kaelon Black",
        "slot": "BE"
      },
      {
        "teamId": 7,
        "name": "Ja'Kobi Lane",
        "slot": "IR"
      },
      {
        "teamId": 7,
        "name": "Jaylen Wright",
        "slot": "BE"
      },
      {
        "teamId": 7,
        "name": "Kenyon Sadiq",
        "slot": "TE"
      },
      {
        "teamId": 8,
        "name": "Puka Nacua",
        "slot": "WR"
      },
      {
        "teamId": 8,
        "name": "Derrick Henry",
        "slot": "RB"
      },
      {
        "teamId": 8,
        "name": "Omarion Hampton",
        "slot": "RB"
      },
      {
        "teamId": 8,
        "name": "Zay Flowers",
        "slot": "WR"
      },
      {
        "teamId": 8,
        "name": "Cam Skattebo",
        "slot": "FLEX"
      },
      {
        "teamId": 8,
        "name": "Jared Goff",
        "slot": "QB"
      },
      {
        "teamId": 8,
        "name": "Sam LaPorta",
        "slot": "BE"
      },
      {
        "teamId": 8,
        "name": "Rico Dowdle",
        "slot": "BE"
      },
      {
        "teamId": 8,
        "name": "Jordan Addison",
        "slot": "WR"
      },
      {
        "teamId": 8,
        "name": "KC Concepcion",
        "slot": "BE"
      },
      {
        "teamId": 8,
        "name": "Woody Marks",
        "slot": "BE"
      },
      {
        "teamId": 8,
        "name": "Travis Kelce",
        "slot": "TE"
      },
      {
        "teamId": 8,
        "name": "Deshaun Watson",
        "slot": "OP"
      },
      {
        "teamId": 8,
        "name": "Chargers DST",
        "slot": "DST"
      },
      {
        "teamId": 8,
        "name": "Dontayvion Wicks",
        "slot": "BE"
      },
      {
        "teamId": 8,
        "name": "Demarcus Robinson",
        "slot": "BE"
      },
      {
        "teamId": 8,
        "name": "Tyreek Hill",
        "slot": "BE"
      },
      {
        "teamId": 8,
        "name": "Ollie Gordon II",
        "slot": "BE"
      },
      {
        "teamId": 9,
        "name": "Bijan Robinson",
        "slot": "RB"
      },
      {
        "teamId": 9,
        "name": "James Cook III",
        "slot": "RB"
      },
      {
        "teamId": 9,
        "name": "Trey McBride",
        "slot": "TE"
      },
      {
        "teamId": 9,
        "name": "Chris Olave",
        "slot": "WR"
      },
      {
        "teamId": 9,
        "name": "DeVonta Smith",
        "slot": "WR"
      },
      {
        "teamId": 9,
        "name": "Tee Higgins",
        "slot": "WR"
      },
      {
        "teamId": 9,
        "name": "Jaylen Warren",
        "slot": "FLEX"
      },
      {
        "teamId": 9,
        "name": "Jordan Love",
        "slot": "OP"
      },
      {
        "teamId": 9,
        "name": "Texans DST",
        "slot": "DST"
      },
      {
        "teamId": 9,
        "name": "C.J. Stroud",
        "slot": "BE"
      },
      {
        "teamId": 9,
        "name": "Matthew Golden",
        "slot": "BE"
      },
      {
        "teamId": 9,
        "name": "RJ Harvey",
        "slot": "BE"
      },
      {
        "teamId": 9,
        "name": "Bryce Young",
        "slot": "QB"
      },
      {
        "teamId": 9,
        "name": "Chris Godwin Jr.",
        "slot": "BE"
      },
      {
        "teamId": 9,
        "name": "Tyler Allgeier",
        "slot": "BE"
      },
      {
        "teamId": 9,
        "name": "Brenton Strange",
        "slot": "BE"
      },
      {
        "teamId": 9,
        "name": "Keaton Mitchell",
        "slot": "BE"
      },
      {
        "teamId": 9,
        "name": "Rashod Bateman",
        "slot": "BE"
      },
      {
        "teamId": 10,
        "name": "Joe Burrow",
        "slot": "QB"
      },
      {
        "teamId": 10,
        "name": "Trevor Lawrence",
        "slot": "OP"
      },
      {
        "teamId": 10,
        "name": "Rashee Rice",
        "slot": "WR"
      },
      {
        "teamId": 10,
        "name": "Chase Brown",
        "slot": "RB"
      },
      {
        "teamId": 10,
        "name": "George Pickens",
        "slot": "WR"
      },
      {
        "teamId": 10,
        "name": "Steelers DST",
        "slot": "DST"
      },
      {
        "teamId": 10,
        "name": "Jadarian Price",
        "slot": "BE"
      },
      {
        "teamId": 10,
        "name": "DK Metcalf",
        "slot": "WR"
      },
      {
        "teamId": 10,
        "name": "Daniel Jones",
        "slot": "BE"
      },
      {
        "teamId": 10,
        "name": "Jake Ferguson",
        "slot": "TE"
      },
      {
        "teamId": 10,
        "name": "Brian Thomas Jr.",
        "slot": "BE"
      },
      {
        "teamId": 10,
        "name": "Blake Corum",
        "slot": "RB"
      },
      {
        "teamId": 10,
        "name": "T.J. Hockenson",
        "slot": "BE"
      },
      {
        "teamId": 10,
        "name": "Rashid Shaheed",
        "slot": "BE"
      },
      {
        "teamId": 10,
        "name": "Juwan Johnson",
        "slot": "FLEX"
      },
      {
        "teamId": 10,
        "name": "Tre Tucker",
        "slot": "BE"
      },
      {
        "teamId": 10,
        "name": "Tua Tagovailoa",
        "slot": "BE"
      },
      {
        "teamId": 10,
        "name": "Tank Bigsby",
        "slot": "BE"
      },
      {
        "teamId": 11,
        "name": "Josh Allen",
        "slot": "QB"
      },
      {
        "teamId": 11,
        "name": "Justin Jefferson",
        "slot": "WR"
      },
      {
        "teamId": 11,
        "name": "Drake London",
        "slot": "WR"
      },
      {
        "teamId": 11,
        "name": "Caleb Williams",
        "slot": "OP"
      },
      {
        "teamId": 11,
        "name": "Breece Hall",
        "slot": "RB"
      },
      {
        "teamId": 11,
        "name": "Bucky Irving",
        "slot": "RB"
      },
      {
        "teamId": 11,
        "name": "D'Andre Swift",
        "slot": "FLEX"
      },
      {
        "teamId": 11,
        "name": "Michael Pittman Jr.",
        "slot": "WR"
      },
      {
        "teamId": 11,
        "name": "Tyler Shough",
        "slot": "BE"
      },
      {
        "teamId": 11,
        "name": "Tucker Kraft",
        "slot": "TE"
      },
      {
        "teamId": 11,
        "name": "Christian Watson",
        "slot": "BE"
      },
      {
        "teamId": 11,
        "name": "Jayden Reed",
        "slot": "BE"
      },
      {
        "teamId": 11,
        "name": "Isaiah Likely",
        "slot": "BE"
      },
      {
        "teamId": 11,
        "name": "Jalen Coker",
        "slot": "BE"
      },
      {
        "teamId": 11,
        "name": "Jalen McMillan",
        "slot": "BE"
      },
      {
        "teamId": 11,
        "name": "Eagles DST",
        "slot": "DST"
      },
      {
        "teamId": 11,
        "name": "Caleb Douglas",
        "slot": "BE"
      },
      {
        "teamId": 11,
        "name": "Najee Harris",
        "slot": "BE"
      },
      {
        "teamId": 12,
        "name": "Lamar Jackson",
        "slot": "QB"
      },
      {
        "teamId": 12,
        "name": "Jalen Hurts",
        "slot": "OP"
      },
      {
        "teamId": 12,
        "name": "Kenneth Walker III",
        "slot": "RB"
      },
      {
        "teamId": 12,
        "name": "Brock Bowers",
        "slot": "TE"
      },
      {
        "teamId": 12,
        "name": "Travis Etienne Jr.",
        "slot": "BE"
      },
      {
        "teamId": 12,
        "name": "Emeka Egbuka",
        "slot": "WR"
      },
      {
        "teamId": 12,
        "name": "Rome Odunze",
        "slot": "WR"
      },
      {
        "teamId": 12,
        "name": "Luther Burden III",
        "slot": "WR"
      },
      {
        "teamId": 12,
        "name": "Jonathon Brooks",
        "slot": "BE"
      },
      {
        "teamId": 12,
        "name": "Baker Mayfield",
        "slot": "BE"
      },
      {
        "teamId": 12,
        "name": "Michael Wilson",
        "slot": "FLEX"
      },
      {
        "teamId": 12,
        "name": "Jakobi Meyers",
        "slot": "BE"
      },
      {
        "teamId": 12,
        "name": "Quentin Johnston",
        "slot": "BE"
      },
      {
        "teamId": 12,
        "name": "Dalton Kincaid",
        "slot": "BE"
      },
      {
        "teamId": 12,
        "name": "Ravens DST",
        "slot": "DST"
      },
      {
        "teamId": 12,
        "name": "Travis Hunter",
        "slot": "BE"
      },
      {
        "teamId": 12,
        "name": "Chiefs DST",
        "slot": "BE"
      },
      {
        "teamId": 12,
        "name": "Braelon Allen",
        "slot": "RB"
      },
      {
        "teamId": 13,
        "name": "Jayden Daniels",
        "slot": "BE"
      },
      {
        "teamId": 13,
        "name": "Amon-Ra St. Brown",
        "slot": "WR"
      },
      {
        "teamId": 13,
        "name": "Jeremiyah Love",
        "slot": "RB"
      },
      {
        "teamId": 13,
        "name": "A.J. Brown",
        "slot": "BE"
      },
      {
        "teamId": 13,
        "name": "Javonte Williams",
        "slot": "RB"
      },
      {
        "teamId": 13,
        "name": "Terry McLaurin",
        "slot": "WR"
      },
      {
        "teamId": 13,
        "name": "Kyler Murray",
        "slot": "QB"
      },
      {
        "teamId": 13,
        "name": "Harold Fannin Jr.",
        "slot": "TE"
      },
      {
        "teamId": 13,
        "name": "Marvin Harrison Jr.",
        "slot": "BE"
      },
      {
        "teamId": 13,
        "name": "TreVeyon Henderson",
        "slot": "FLEX"
      },
      {
        "teamId": 13,
        "name": "Mike Evans",
        "slot": "WR"
      },
      {
        "teamId": 13,
        "name": "Malik Willis",
        "slot": "OP"
      },
      {
        "teamId": 13,
        "name": "Jacoby Brissett",
        "slot": "BE"
      },
      {
        "teamId": 13,
        "name": "Hunter Henry",
        "slot": "BE"
      },
      {
        "teamId": 13,
        "name": "Broncos DST",
        "slot": "DST"
      },
      {
        "teamId": 13,
        "name": "Brian Robinson Jr.",
        "slot": "BE"
      },
      {
        "teamId": 13,
        "name": "Browns DST",
        "slot": "BE"
      },
      {
        "teamId": 13,
        "name": "Ray Davis",
        "slot": "BE"
      }
    ]
  }
} as Record<string, LeagueTape>;

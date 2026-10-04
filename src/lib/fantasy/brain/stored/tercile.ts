export const TERCILE = {
  "evenWeeksBurned": true,
  "nearBand": 1.5,
  "nearRule": "Near means the tercile actual mean is within 1.5 of its prediction. Lower means it is more than 1.5 under. Only near would print 276, labeled fit-sample. The band is the coin-flip gap and was fixed before these means were read.",
  "weight": 0.3,
  "prior": 24.517,
  "prediction": "0.30 times the weeks 1-3 mean plus 0.70 times 24.517.",
  "actual": "Mean of weeks 7, 9, 11, 13, 15, and 17. A missing week is 0.",
  "publish276": false,
  "mayeWeekly": 13.6,
  "mayeThin": 176.8,
  "mayeShrinkNotPrinted": 276,
  "reason": "Bottom tercile actual 12.467 versus prediction 22.332. It landed lower. 276 is not printed.",
  "weightForm": {
    "expression": "games / (games + 7)",
    "atThreeGames": 0.3,
    "kept": false,
    "appliedThisWeek": false,
    "reason": "The tercile did not hold, so this form is not kept and not applied."
  },
  "playedEveryTargetWeek": {
    "n": 3,
    "predictedMean": 22.294,
    "actualMean": 17.159,
    "gap": -5.135,
    "note": "Same bottom tercile, weeks they actually played only. Not the decision. The decision includes missed games as zero."
  },
  "terciles": [
    {
      "name": "bottom",
      "n": 10,
      "earlyMean": 17.232,
      "predictedMean": 22.332,
      "actualMean": 12.467,
      "gap": -9.865,
      "missedWeeks": 20,
      "verdict": "lower",
      "players": [
        {
          "id": "00-0040676",
          "name": "Cam Ward",
          "team": "TEN",
          "games": 3,
          "early": 10.633,
          "predicted": 20.352,
          "actual": 16.317,
          "missed": 0
        },
        {
          "id": "00-0026158",
          "name": "Joe Flacco",
          "team": "CIN",
          "games": 3,
          "early": 14.517,
          "predicted": 21.517,
          "actual": 18.642,
          "missed": 2
        },
        {
          "id": "00-0039923",
          "name": "J.J. McCarthy",
          "team": "MIN",
          "games": 2,
          "early": 14.725,
          "predicted": 21.579,
          "actual": 11.425,
          "missed": 3
        },
        {
          "id": "00-0039163",
          "name": "C.J. Stroud",
          "team": "HOU",
          "games": 3,
          "early": 17.283,
          "predicted": 22.347,
          "actual": 16.717,
          "missed": 1
        },
        {
          "id": "00-0035100",
          "name": "Jake Browning",
          "team": "CIN",
          "games": 2,
          "early": 18.125,
          "predicted": 22.599,
          "actual": 0.0,
          "missed": 6
        },
        {
          "id": "00-0028118",
          "name": "Tyrod Taylor",
          "team": "NYJ",
          "games": 2,
          "early": 18.525,
          "predicted": 22.719,
          "actual": 5.633,
          "missed": 4
        },
        {
          "id": "00-0039917",
          "name": "Michael Penix Jr.",
          "team": "ATL",
          "games": 3,
          "early": 18.75,
          "predicted": 22.787,
          "actual": 11.142,
          "missed": 3
        },
        {
          "id": "00-0036212",
          "name": "Tua Tagovailoa",
          "team": "MIA",
          "games": 3,
          "early": 19.083,
          "predicted": 22.887,
          "actual": 9.633,
          "missed": 1
        },
        {
          "id": "00-0034869",
          "name": "Sam Darnold",
          "team": "SEA",
          "games": 3,
          "early": 20.083,
          "predicted": 23.187,
          "actual": 17.817,
          "missed": 0
        },
        {
          "id": "00-0023459",
          "name": "Aaron Rodgers",
          "team": "PIT",
          "games": 3,
          "early": 20.6,
          "predicted": 23.342,
          "actual": 17.342,
          "missed": 0
        }
      ]
    },
    {
      "name": "middle",
      "n": 11,
      "earlyMean": 23.628,
      "predictedMean": 24.25,
      "actualMean": 17.67,
      "gap": -6.581,
      "missedWeeks": 22,
      "verdict": "lower",
      "players": [
        {
          "id": "00-0039732",
          "name": "Bo Nix",
          "team": "DEN",
          "games": 3,
          "early": 20.983,
          "predicted": 23.457,
          "actual": 34.75,
          "missed": 0
        },
        {
          "id": "00-0036971",
          "name": "Trevor Lawrence",
          "team": "JAC",
          "games": 3,
          "early": 21.383,
          "predicted": 23.577,
          "actual": 34.142,
          "missed": 0
        },
        {
          "id": "00-0026498",
          "name": "Matthew Stafford",
          "team": "LAR",
          "games": 3,
          "early": 22.783,
          "predicted": 23.997,
          "actual": 27.392,
          "missed": 0
        },
        {
          "id": "00-0039150",
          "name": "Bryce Young",
          "team": "CAR",
          "games": 3,
          "early": 22.817,
          "predicted": 24.007,
          "actual": 23.208,
          "missed": 0
        },
        {
          "id": "00-0036264",
          "name": "Jordan Love",
          "team": "GB",
          "games": 3,
          "early": 23.117,
          "predicted": 24.097,
          "actual": 20.017,
          "missed": 1
        },
        {
          "id": "00-0035228",
          "name": "Kyler Murray",
          "team": "ARI",
          "games": 3,
          "early": 23.467,
          "predicted": 24.202,
          "actual": 0.0,
          "missed": 6
        },
        {
          "id": "00-0030565",
          "name": "Geno Smith",
          "team": "LV",
          "games": 3,
          "early": 24.083,
          "predicted": 24.387,
          "actual": 14.967,
          "missed": 1
        },
        {
          "id": "00-0039376",
          "name": "Spencer Rattler",
          "team": "NO",
          "games": 3,
          "early": 24.117,
          "predicted": 24.397,
          "actual": 2.542,
          "missed": 4
        },
        {
          "id": "00-0033077",
          "name": "Dak Prescott",
          "team": "DAL",
          "games": 3,
          "early": 24.433,
          "predicted": 24.492,
          "actual": 29.675,
          "missed": 0
        },
        {
          "id": "00-0029263",
          "name": "Russell Wilson",
          "team": "NYG",
          "games": 3,
          "early": 25.8,
          "predicted": 24.902,
          "actual": 0.0,
          "missed": 6
        },
        {
          "id": "00-0039910",
          "name": "Jayden Daniels",
          "team": "WAS",
          "games": 2,
          "early": 26.925,
          "predicted": 25.239,
          "actual": 7.675,
          "missed": 4
        }
      ]
    },
    {
      "name": "top",
      "n": 11,
      "earlyMean": 32.028,
      "predictedMean": 26.77,
      "actualMean": 21.201,
      "gap": -5.569,
      "missedWeeks": 11,
      "verdict": "lower",
      "players": [
        {
          "id": "00-0036972",
          "name": "Mac Jones",
          "team": "SF",
          "games": 2,
          "early": 27.725,
          "predicted": 25.479,
          "actual": 6.808,
          "missed": 2
        },
        {
          "id": "00-0034855",
          "name": "Baker Mayfield",
          "team": "TB",
          "games": 3,
          "early": 29.617,
          "predicted": 26.047,
          "actual": 19.767,
          "missed": 1
        },
        {
          "id": "00-0033106",
          "name": "Jared Goff",
          "team": "DET",
          "games": 3,
          "early": 29.85,
          "predicted": 26.117,
          "actual": 21.908,
          "missed": 0
        },
        {
          "id": "00-0033873",
          "name": "Patrick Mahomes",
          "team": "KC",
          "games": 3,
          "early": 30.05,
          "predicted": 26.177,
          "actual": 21.833,
          "missed": 1
        },
        {
          "id": "00-0039851",
          "name": "Drake Maye",
          "team": "NE",
          "games": 3,
          "early": 30.583,
          "predicted": 26.337,
          "actual": 31.492,
          "missed": 0
        },
        {
          "id": "00-0036355",
          "name": "Justin Herbert",
          "team": "LAC",
          "games": 3,
          "early": 31.267,
          "predicted": 26.542,
          "actual": 24.517,
          "missed": 0
        },
        {
          "id": "00-0036389",
          "name": "Jalen Hurts",
          "team": "PHI",
          "games": 3,
          "early": 31.883,
          "predicted": 26.727,
          "actual": 21.233,
          "missed": 1
        },
        {
          "id": "00-0039918",
          "name": "Caleb Williams",
          "team": "CHI",
          "games": 3,
          "early": 32.35,
          "predicted": 26.867,
          "actual": 27.258,
          "missed": 0
        },
        {
          "id": "00-0034796",
          "name": "Lamar Jackson",
          "team": "BAL",
          "games": 3,
          "early": 35.233,
          "predicted": 27.732,
          "actual": 12.125,
          "missed": 2
        },
        {
          "id": "00-0035710",
          "name": "Daniel Jones",
          "team": "IND",
          "games": 3,
          "early": 36.6,
          "predicted": 28.142,
          "actual": 13.525,
          "missed": 3
        },
        {
          "id": "00-0034857",
          "name": "Josh Allen",
          "team": "BUF",
          "games": 3,
          "early": 37.15,
          "predicted": 28.307,
          "actual": 32.75,
          "missed": 1
        }
      ]
    }
  ]
}

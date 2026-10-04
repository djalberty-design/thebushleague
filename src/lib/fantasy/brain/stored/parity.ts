export const PARITY = {
  "rows": 2076,
  "nulls": 0,
  "meanAbs": 2.5903866934143074e-18,
  "maxAbs": 3.552713678800501e-15,
  "passed": true,
  "failures": [],
  "weight": 0.6,
  "redZone": null,
  "bonus50": 0,
  "research": "6.04 and 5.98 stay research until this pass is true. The locked even-week file was not rewritten.",
  "odd": {
    "ran": true,
    "preRegistered": "Week-block delta is the mean of |actual-B0| minus |actual-B2|. The lower bound is that mean minus 1.96 standard errors across weeks. It has to clear zero. The MAE gap has to clear 0.25. The even-week decision count has to be positive. A pass still does not open the card.",
    "weeks": [
      {
        "week": 5,
        "n": 297,
        "delta": -0.076
      },
      {
        "week": 7,
        "n": 326,
        "delta": 0.113
      },
      {
        "week": 9,
        "n": 303,
        "delta": 0.162
      },
      {
        "week": 11,
        "n": 318,
        "delta": 0.123
      },
      {
        "week": 13,
        "n": 344,
        "delta": -0.12
      },
      {
        "week": 15,
        "n": 344,
        "delta": 0.099
      },
      {
        "week": 17,
        "n": 352,
        "delta": 0.371
      }
    ],
    "lowerBound": -0.024,
    "maeB0": 6.117,
    "maeB2": 6.018,
    "gap": 0.099,
    "decisionCount": 1026,
    "passed": false,
    "opensGate": false
  }
}

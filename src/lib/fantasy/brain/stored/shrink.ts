export const SHRINK = {
  "applied": false,
  "evenWeeksBurned": true,
  "feature": "Bush mean of weeks 1-3. Week 2 is included because it is before the held-out half.",
  "target": "Bush mean of odd weeks 7, 9, 11, 13, 15, and 17. Even weeks 4-18 were not read.",
  "priorRule": "Mean of that pregame role's weeks 1-3 means, including quarterbacks with no target weeks.",
  "starter": {
    "role": "most pass attempts on his club in weeks 1-3",
    "weight": 0.3,
    "prior": 24.517,
    "n": 29,
    "priorN": 32,
    "mae": 5.243,
    "applied": false
  },
  "backup": {
    "role": "every other quarterback with a week 1-3 attempt",
    "weight": 0.7,
    "prior": 6.13,
    "n": 14,
    "priorN": 22,
    "mae": 11.188,
    "applied": false
  }
}

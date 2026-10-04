export const PLAYED_ONLY = {
  "onCard": false,
  "opensGate": false,
  "prediction": "0.30 times the weeks 1-3 mean plus 0.70 times 24.517. Not a new prior.",
  "nonPersistentRule": "Played-only mean 3 or more under that prediction means the early level is non-persistent.",
  "priorSeason": "2024 starters, same tercile cut on their own weeks 1-3, weeks 7 through 17. Same Bush score. Shadow only. Not a model feed and not a substitute prior.",
  "terciles": [
    {
      "name": "bottom",
      "n": 10,
      "predictedMean": 22.332,
      "gamesPlayedRate": 0.667,
      "playedOnlyMean": 19.232,
      "playedOnlyGap": -3.099,
      "nonPersistent": true,
      "priorSeasonGamesPlayedRate": 0.579,
      "priorSeasonPlayedOnlyMean": 17.275
    },
    {
      "name": "middle",
      "n": 11,
      "predictedMean": 24.25,
      "gamesPlayedRate": 0.667,
      "playedOnlyMean": 24.644,
      "playedOnlyGap": 0.394,
      "nonPersistent": false,
      "priorSeasonGamesPlayedRate": 0.752,
      "priorSeasonPlayedOnlyMean": 23.127
    },
    {
      "name": "top",
      "n": 11,
      "predictedMean": 26.77,
      "gamesPlayedRate": 0.833,
      "playedOnlyMean": 25.03,
      "playedOnlyGap": -1.741,
      "nonPersistent": false,
      "priorSeasonGamesPlayedRate": 0.843,
      "priorSeasonPlayedOnlyMean": 30.628
    }
  ]
}

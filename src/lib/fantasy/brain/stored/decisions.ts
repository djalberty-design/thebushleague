export const DECISIONS = {
  "rows": 2076,
  "threshold": 1.5,
  "disagree": 1026,
  "share": 0.494,
  "b2Higher": {
    "n": 582,
    "actualSum": 7800.35,
    "trailingSum": 5932.225,
    "actualMinusTrailing": 1868.125
  },
  "b0Higher": {
    "n": 444,
    "actualSum": 6541,
    "trailingSum": 8689.75,
    "actualMinusTrailing": -2148.75
  },
  "netActual": 4016.875,
  "errorSaved": 302.933,
  "definition": "A disagreement is |B2-B0| > 1.5. netActual is the sum of (actual-trailing) when B2 is higher, minus that sum when B0 is higher. errorSaved is the absolute-error points B2 saves on those rows. This does not open the gate.",
  "opensGate": false
}

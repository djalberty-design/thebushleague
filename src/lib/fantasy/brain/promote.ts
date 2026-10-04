export function promoteShadow(input: { playerWeeks: number; recentMaeCut: number; priorMaeCut: number }) {
  if (input.playerWeeks < 40) return false;
  if (input.recentMaeCut <= 0) return false;
  if (input.priorMaeCut < 0) return false;
  return true;
}

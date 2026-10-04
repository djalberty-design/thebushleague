import { useMemo } from "react";
import { useBush } from "@/lib/store";
import { buildDesk } from "./engine";

export function useDesk() {
  const league = useBush((s) => s.league);
  const myTeamId = useBush((s) => s.myTeamId);
  const extra = useBush((s) => s.extraPlayers);
  const selectedKeepers = useBush((s) => s.selectedKeepers);
  const takenManual = useBush((s) => s.takenManual);
  const hideTaken = useBush((s) => s.hideTaken);
  const mode = useBush((s) => s.lineupMode);
  const espn = useBush((s) => s.espn);
  const view = useBush((s) => s.view);
  const pins = useBush((s) => s.pins);
  const notes = useBush((s) => s.notes);
  const keeperLocked = useBush((s) => s.keeperLocked);

  const desk = useMemo(
    () =>
      buildDesk({
        league,
        myTeamId,
        extra,
        selectedKeepers,
        takenManual,
        hideTaken,
        mode,
        espnConnected: league.source === "espn",
        view,
        keeperLocked: keeperLocked || league.keepersLocked,
      }),
    [league, myTeamId, extra, selectedKeepers, takenManual, hideTaken, mode, view, keeperLocked],
  );

  return { ...desk, pins, notes, espn };
}
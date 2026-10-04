import { Sheet, SheetContent } from "@/components/ui/sheet";
import { ConfidenceBadge } from "@/components/grade-badge";
import { Textarea } from "@/components/ui/input";
import type { PlayerState } from "@/lib/fantasy/types";
import { useBush } from "@/lib/store";

export function PlayerDrawer({
  player,
  open,
  onOpenChange,
}: {
  player: PlayerState | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const notes = useBush((s) => s.notes);
  const setNote = useBush((s) => s.setNote);
  if (!player) return null;

  const stats = [
    ["Week E[Pts]", player.weekly.ePts.toFixed(1)],
    ["Recent low / high", `${player.weekly.p20.toFixed(1)} / ${player.weekly.p80.toFixed(1)}`],
    ["ROS thin", player.ros.ePts.toFixed(0)],
    ["ROS VOR", player.rosVor.toFixed(0)],
    ["AdjVOR", player.adjVor.toFixed(0)],
    ["ADP 10", player.adp10.toFixed(1)],
    ["C", player.confidence.toFixed(2)],
    ["Bye", String(player.bye)],
  ];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent title={player.name}>
        <div className="mt-6 flex flex-col gap-5 overflow-y-auto pr-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs tracking-wide text-muted">
                {player.pos} · {player.nflTeam} · {player.home ? "vs" : "@"} {player.opp}
              </p>
              <p className="mt-2 font-display text-2xl tracking-tight">{player.name}</p>
              {player.news && <p className="mt-2 text-sm text-warn">{player.news}</p>}
            </div>
            <ConfidenceBadge label={player.confidenceLabel} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            {stats.map(([k, v]) => (
              <div key={k} className="rounded-md bg-bg px-3 py-2">
                <p className="text-[10px] tracking-widest text-subtle uppercase">{k}</p>
                <p className="font-mono text-sm tabular">{v}</p>
              </div>
            ))}
          </div>
          <div>
            <p className="text-[10px] tracking-widest text-subtle uppercase">Why</p>
            <p className="mt-1 text-sm leading-relaxed text-muted">{player.reason}</p>
            <p className="mt-2 text-xs text-subtle">
              Recent low {player.weekly.p20.toFixed(1)} · expected {player.weekly.ePts.toFixed(1)} · recent high {player.weekly.p80.toFixed(1)}
            </p>
          </div>
          <div>
            <p className="text-[10px] tracking-widest text-subtle uppercase">Shadow · not in the score</p>
            <div className="mt-2 grid gap-1">
              {player.shadow.map((row) => (
                <p key={row.name} className="text-sm text-muted">
                  {row.name}: {row.value}
                </p>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-1 text-[10px] tracking-widest text-subtle uppercase">Note</p>
            <Textarea
              value={notes[player.id] ?? ""}
              onChange={(e) => setNote(player.id, e.target.value)}
              placeholder="Private note"
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

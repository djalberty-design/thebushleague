import { Star, Check } from "lucide-react";
import { PosMark } from "@/components/grade-badge";
import type { PlayerState } from "@/lib/fantasy/types";
import { cn } from "@/lib/utils";

export function PlayerRow({
  player,
  rank,
  taken,
  pinned,
  onOpen,
  onPin,
  onTake,
  compact,
  right,
}: {
  player: PlayerState;
  rank?: number;
  taken?: boolean;
  pinned?: boolean;
  onOpen?: () => void;
  onPin?: () => void;
  onTake?: () => void;
  compact?: boolean;
  right?: string;
}) {
  return (
    <div
      className={cn(
        "group grid items-center gap-2 rounded-lg px-2 py-2 transition-colors duration-150 hover:bg-bg-subtle",
        compact
          ? "grid-cols-[1.5rem_minmax(0,1fr)_auto]"
          : "grid-cols-[1.75rem_2rem_minmax(0,1fr)_auto_auto] md:grid-cols-[1.75rem_2rem_minmax(0,1fr)_4.5rem_4rem_4rem_auto]",
        taken && "opacity-45",
      )}
    >
      <span className="font-mono text-xs tabular text-subtle">{rank ?? "—"}</span>
      {!compact && <PosMark pos={player.pos} />}
      <button type="button" onClick={onOpen} className="min-w-0 text-left">
        <div className="flex items-baseline gap-2">
          <span className={cn("truncate text-sm font-medium text-fg", taken && "line-through")}>{player.name}</span>
          {player.rook && <span className="text-[10px] tracking-wide text-accent">R</span>}
          {player.status && player.status !== "Active" && (
            <span className="text-[10px] font-medium text-warn">{player.status}</span>
          )}
        </div>
        <div className="flex gap-2 text-[11px] text-subtle">
          <span>{player.nflTeam}</span>
          <span>
            {player.home ? "vs" : "@"} {player.opp}
          </span>
          <span>Bye {player.bye}</span>
        </div>
      </button>
      {!compact && (
        <>
          <span className="hidden font-mono text-xs tabular text-muted md:inline">{player.weekly.ePts.toFixed(1)}</span>
          <span className="font-mono text-xs tabular text-muted">{player.adjVor.toFixed(0)}</span>
          <span className="hidden font-mono text-xs tabular text-muted md:inline">{player.confidenceLabel}</span>
        </>
      )}
      <div className="flex items-center justify-end gap-1">
        {right && <span className="font-mono text-xs tabular text-accent">{right}</span>}
        {onPin && (
          <button
            type="button"
            aria-label={pinned ? "Unpin" : "Pin"}
            onClick={onPin}
            className={cn("rounded-sm p-1.5 text-subtle hover:text-fg", pinned && "text-accent")}
          >
            <Star className="size-3.5" fill={pinned ? "currentColor" : "none"} />
          </button>
        )}
        {onTake && (
          <button type="button" aria-label={taken ? "Undraft" : "Mark drafted"} onClick={onTake} className="rounded-sm p-1.5 text-subtle hover:text-fg">
            <Check className="size-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

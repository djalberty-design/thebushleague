import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Card, CardBody, CardHeader, CardTitle, CardDesc } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ConfidenceBadge } from "@/components/grade-badge";
import { PlayerDrawer } from "@/components/player-drawer";
import { OsBrief } from "@/components/brief";
import { useDesk } from "@/lib/fantasy/use-desk";
import { useBush } from "@/lib/store";
import type { LineupMode, PlayerState } from "@/lib/fantasy/types";
import { inactiveSwaps } from "@/lib/fantasy/brain/live-week";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/lineup")({ component: LineupPage });

function LineupPage() {
  const { lineup, theirLineup, opponent, me, mode, mine, map, moves, brainChip, league } = useDesk();
  const setMode = useBush((s) => s.setLineupMode);
  const stored = useBush((s) => s.lineupMode);
  const [open, setOpen] = useState<PlayerState | null>(null);
  const empty = lineup.starters.filter((s) => !s.player);
  const modelIds = new Set(lineup.starters.map((s) => s.player?.id).filter(Boolean));
  const espnStarters = (me?.slots ?? []).filter((s) => s.slot !== "BE" && s.slot !== "IR");
  const espnDiffs = espnStarters.filter((s) => !modelIds.has(s.id));
  const swaps = inactiveSwaps(mine, me?.slots ?? []);

  return (
    <div>
      <PageHeader
        kicker={`${me?.name ?? "Let Maye Cook"} vs ${opponent?.name ?? "opponent"}`}
        title="Lineup"
        desc="The model fills QB, 2 RB, 3 WR, TE, FLEX, OP, DST. If ESPN has someone else in, the swap list is the move. Under 1.5 points is a coin-flip."
      />

      {empty.length > 0 && (
        <p className="mb-4 rounded-lg border border-sit/40 bg-sit/10 px-4 py-3 text-sm text-sit">
          Empty starter: {empty.map((s) => s.slot).join(", ")}. An empty slot is worse than a bad start.
        </p>
      )}

      <div className="mb-4 flex flex-wrap gap-3 text-xs">
        <p className="text-warn">BASELINE, brain disabled, validation failed.</p>
        {brainChip ? <p className="text-subtle">{brainChip.label}</p> : <p className="text-subtle">Freeze STALE</p>}
      </div>
      {(() => {
        const byes = mine.filter((p) => p.bye >= league.week && p.bye < league.week + 4);
        if (!byes.length) return null;
        return (
          <p className="mb-4 text-sm text-subtle">
            Byes next four weeks: {byes.map((p) => `${p.name} W${p.bye}`).join(" · ")}
          </p>
        );
      })()}
      {moves.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Make these swaps</CardTitle>
            <CardDesc>ESPN's current starters versus the lineup that scores higher in this mode.</CardDesc>
          </CardHeader>
          <CardBody className="grid gap-2">
            {moves.map((m) => (
              <p key={`${m.slot}-${m.start.id}`} className="text-sm">
                <span className="text-muted">{m.slot}</span> Start {m.start.name}
                {m.sit ? ` over ${m.sit.name}` : ""}.{" "}
                <span className="tabular text-subtle">{m.delta >= 0 ? "+" : ""}{m.delta.toFixed(1)} pts</span>
              </p>
            ))}
          </CardBody>
        </Card>
      )}

      {espnStarters.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>ESPN lineup</CardTitle>
            <CardDesc>
              {espnDiffs.length
                ? `${espnDiffs.length} starter${espnDiffs.length === 1 ? "" : "s"} in ESPN ${espnDiffs.length === 1 ? "is" : "are"} not in the model lineup.`
                : "ESPN matches the model starters."}
            </CardDesc>
          </CardHeader>
          <CardBody className="flex flex-wrap gap-2">
            {espnStarters.map((s) => {
              const player = map.get(s.id);
              const off = !modelIds.has(s.id);
              return (
                <button
                  key={`${s.slot}-${s.id}`}
                  type="button"
                  onClick={() => player && setOpen(player)}
                  className={cn(
                    "rounded-md border px-3 py-2 text-left text-sm",
                    off ? "border-warn/50 bg-warn/10" : "border-border",
                  )}
                >
                  <span className="text-[10px] tracking-widest text-muted uppercase">{s.slot}</span>
                  <span className="mt-1 block">{player?.name ?? s.id}</span>
                </button>
              );
            })}
          </CardBody>
        </Card>
      )}

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Inactive, about 90 minutes out</CardTitle>
          <CardDesc>Next legal swap from the trailing average. ESPN status already on the player. Not the brain.</CardDesc>
        </CardHeader>
        <CardBody className="grid gap-2 text-sm">
          {swaps.length === 0 && <p className="text-subtle">No stored starter is inactive. Nothing was invented.</p>}
          {swaps.map((swap) => (
            <p key={`${swap.slot}-${swap.sit.id}`}>
              {swap.slot}: {swap.sit.name} is inactive. Next legal is {swap.start.name} at {swap.b0.toFixed(1)}.
            </p>
          ))}
        </CardBody>
      </Card>

      <div className="mb-4 flex flex-wrap gap-2">
        {(["auto", "favorite", "tossup", "underdog"] as const).map((m) => (
          <Button key={m} size="sm" variant={stored === m ? "default" : "outline"} onClick={() => setMode(m)}>
            {m === "auto" ? `Auto (${mode})` : m}
          </Button>
        ))}
      </div>

      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <Card>
          <CardBody>
            <p className="text-[11px] tracking-widest text-muted uppercase">You</p>
            <p className="mt-2 font-display text-3xl tabular">{lineup.projected.toFixed(1)}</p>
            <p className="text-xs text-subtle">Recent low {lineup.p20.toFixed(1)} · recent high {lineup.p80.toFixed(1)}</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <p className="text-[11px] tracking-widest text-muted uppercase">{opponent?.abbrev ?? "OPP"}</p>
            <p className="mt-2 font-display text-3xl tabular">{theirLineup.projected.toFixed(1)}</p>
            <p className="text-xs text-subtle">{lineup.twoQb ? "Two QBs via OP" : "Single QB"}</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <p className="text-[11px] tracking-widest text-muted uppercase">Mode</p>
            <p className="mt-2 font-display text-3xl">{mode}</p>
            <p className="text-xs text-subtle">Favorite uses recent low. Underdog uses recent high. Toss-up uses expected. Margin 8 and 65/35 are heuristic.</p>
          </CardBody>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Starters</CardTitle>
            <CardDesc>Locked at each player's gametime.</CardDesc>
          </CardHeader>
          <CardBody className="grid gap-2">
            {lineup.starters.map((seat, i) => {
              const coin = seat.player ? lineup.debates.some((d) => d.starter.id === seat.player?.id && Math.abs(d.delta) < 1.5) : false;
              return (
              <button
                key={`${seat.slot}-${i}`}
                type="button"
                onClick={() => seat.player && setOpen(seat.player)}
                className={cn("flex min-h-11 items-center justify-between rounded-md px-2 py-2 text-left hover:bg-bg-subtle", coin && "text-muted")}
              >
                <div className="flex items-center gap-3">
                  <span className="w-10 font-mono text-[10px] tracking-wider text-muted">{seat.slot}</span>
                  <div>
                    <p className="text-sm font-medium">{seat.player?.name ?? "Empty"}{coin ? " · coin-flip" : ""}{seat.player?.trail === "none" ? " · NO TRAIL" : ""}{seat.player?.trail === "thin" ? " · thin" : ""}</p>
                    <p className="text-xs text-subtle">
                      {seat.player ? `${seat.player.nflTeam} · recent low ${seat.player.weekly.p20.toFixed(1)} · expected ${seat.player.weekly.ePts.toFixed(1)} · recent high ${seat.player.weekly.p80.toFixed(1)}` : "Need a body"}
                    </p>
                    {seat.player?.reason && <p className="text-xs text-muted">{seat.player.reason}</p>}
                  </div>
                </div>
                <span className="font-mono text-sm tabular">{seat.player ? seat.player.weekly.ePts.toFixed(1) : "—"}</span>
              </button>
              );
            })}
          </CardBody>
        </Card>
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Bench + IR</CardTitle>
              <CardDesc>Debates inside 2.8 mode points.</CardDesc>
            </CardHeader>
            <CardBody className="grid gap-2">
              {lineup.bench.map((p) => (
                <button key={p.id} type="button" onClick={() => setOpen(p)} className="flex justify-between px-2 py-1.5 text-left text-sm hover:bg-bg-subtle">
                  <span>
                    {p.pos} {p.name}
                  </span>
                  <span className="font-mono tabular text-muted">{p.weekly.ePts.toFixed(1)}</span>
                </button>
              ))}
              {lineup.ir.map((p) => (
                <p key={p.id} className="px-2 text-xs text-warn">
                  IR · {p.name}
                </p>
              ))}
            </CardBody>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Debates</CardTitle>
            </CardHeader>
            <CardBody className="grid gap-3">
              {lineup.debates.length === 0 && <p className="text-sm text-subtle">No coin-flips. Start the listed lineup.</p>}
              {lineup.debates.map((d) => (
                <div key={d.starter.id} className="rounded-md bg-bg px-3 py-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm">
                      {d.starter.name} vs {d.bench.name}
                    </p>
                    <ConfidenceBadge label={d.confidence} />
                  </div>
                  <p className="text-xs text-subtle">Delta {d.delta >= 0 ? "+" : ""}{d.delta.toFixed(1)}</p>
                </div>
              ))}
            </CardBody>
          </Card>
        </div>
      </div>
      <div className="mt-6">
        <OsBrief
          kind="startsit"
          prompt={`Mode ${mode}. You ${lineup.projected} vs ${theirLineup.projected}. Starters: ${lineup.starters.map((s) => `${s.slot} ${s.player?.name}`).join(", ")}`}
        />
      </div>
      <PlayerDrawer player={open} open={Boolean(open)} onOpenChange={() => setOpen(null)} />
    </div>
  );
}

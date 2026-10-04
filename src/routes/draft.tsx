import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Card, CardBody, CardHeader, CardTitle, CardDesc } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { PlayerRow } from "@/components/player-row";
import { PlayerDrawer } from "@/components/player-drawer";
import { OsBrief } from "@/components/brief";
import { useDesk } from "@/lib/fantasy/use-desk";
import { useBush } from "@/lib/store";
import type { PlayerState } from "@/lib/fantasy/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/draft")({ component: DraftPage });

function DraftPage() {
  const { board, viewList, taken, keeperOff, me, pins, capital, league } = useDesk();
  const setView = useBush((s) => s.setView);
  const view = useBush((s) => s.view);
  const hideTaken = useBush((s) => s.hideTaken);
  const setHideTaken = useBush((s) => s.setHideTaken);
  const toggleTaken = useBush((s) => s.toggleTaken);
  const togglePin = useBush((s) => s.togglePin);
  const [open, setOpen] = useState<PlayerState | null>(null);
  const recs = board.recs;
  const next = board.next;
  const holes = board.holes;

  const picks = league.draftPicks ?? [];
  const minePicks = picks.filter((p) => p.teamId === me?.id);
  const abbrev = (id: number) => league.teams.find((t) => t.id === id)?.abbrev ?? String(id);

  return (
    <div>
      <PageHeader
        kicker={`Snake · slot ${me?.draftSlot ?? 9} · 60s · no pick trades`}
        title="Draft room"
        desc={`${keeperOff.size} keepers already off the board. Their rounds are burned. Kickers never recommended. DST only late.`}
      />

      {picks.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Draft results</CardTitle>
            <CardDesc>
              {picks.length} picks stored from ESPN. Yours: {minePicks.map((p) => `${p.round}.${String(p.pick).padStart(2, "0")} ${p.name}`).join(" · ") || "none"}.
            </CardDesc>
          </CardHeader>
          <CardBody className="max-h-80 overflow-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-[11px] tracking-widest text-muted uppercase">
                <tr>
                  <th className="py-2 pr-3 font-medium">Pick</th>
                  <th className="py-2 pr-3 font-medium">Team</th>
                  <th className="py-2 font-medium">Player</th>
                </tr>
              </thead>
              <tbody>
                {picks.map((p) => (
                  <tr key={`${p.overall}-${p.name}`} className={cn("border-t border-border", p.teamId === me?.id && "bg-bg-subtle")}>
                    <td className="py-2 pr-3 tabular">{p.round}.{String(p.pick).padStart(2, "0")}</td>
                    <td className="py-2 pr-3">{abbrev(p.teamId)}</td>
                    <td className="py-2">
                      {p.name} <span className="text-subtle">{p.pos}</span>
                      {p.keeper ? " · keeper" : ""}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardBody>
        </Card>
      )}

      <div className="mb-4 rounded-xl border border-accent/40 bg-bg-elevated px-4 py-3">
        <p className="text-[11px] tracking-[0.16em] text-accent uppercase">
          {next ? `Next pick ${next.label} · overall ${next.overall}` : "No picks remaining"}
        </p>
        <p className="mt-1 font-display text-2xl tracking-tight">
          {recs[0] ? recs[0].player.name : "Board empty"}
        </p>
        <p className="mt-1 text-sm text-muted">
          Alts: {recs.slice(1, 3).map((r) => r.player.name).join(" · ") || "—"}
        </p>
        {holes && (
          <p className="mt-2 text-xs text-subtle">
            Holes · QB {holes.qb} · RB {holes.rb} · WR {holes.wr} · TE {holes.te} · FLEX {holes.flex} · OP {holes.op} · DST {holes.dst}
            {board.burned?.length ? ` · burned R${[...board.burned].sort((a, b) => a - b).join(" & R")}` : ""}
            {capital.length ? ` · next ${capital.slice(0, 4).map((p) => p.label).join(" → ")}` : ""}
          </p>
        )}
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        {["ALL", "QB", "RB", "WR", "TE", "FLEX", "OP", "DST"].map((v) => (
          <Button key={v} size="sm" variant={view === v ? "default" : "outline"} onClick={() => setView(v)}>
            {v}
          </Button>
        ))}
        <label className="flex items-center gap-2 text-xs text-muted sm:ml-auto">
          Hide off-board
          <Switch checked={hideTaken} onCheckedChange={setHideTaken} />
        </label>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle>Remaining board</CardTitle>
            <CardDesc>
              {keeperOff.size} keepers marked KEEP and removed. Hide-off-board is on by default. Never draft a kicker.
            </CardDesc>
          </CardHeader>
          <CardBody className="grid gap-0.5">
            {viewList.slice(0, 40).map((p, i) => (
              <PlayerRow
                key={p.id}
                player={p}
                rank={i + 1}
                taken={taken.has(p.id)}
                pinned={pins.includes(p.id)}
                onOpen={() => setOpen(p)}
                onPin={() => togglePin(p.id)}
                onTake={() => toggleTaken(p.id)}
                right={keeperOff.has(p.id) ? "KEEP" : undefined}
              />
            ))}
          </CardBody>
        </Card>
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Queue</CardTitle>
              <CardDesc>Top 8 by DraftValue with keepers off the board.</CardDesc>
            </CardHeader>
            <CardBody className="grid gap-2">
              {recs.slice(0, 8).map((r, i) => (
                <button
                  key={r.player.id}
                  type="button"
                  onClick={() => setOpen(r.player)}
                  className={cn("rounded-md px-3 py-2 text-left hover:bg-bg-subtle", i === 0 && "bg-bg-subtle")}
                >
                  <div className="flex justify-between gap-2">
                    <span className="text-sm font-medium">
                      {i + 1}. {r.player.name}
                    </span>
                    <span className="font-mono text-xs tabular text-accent">{r.value.toFixed(1)}</span>
                  </div>
                  <p className="text-xs text-subtle">{r.why}</p>
                </button>
              ))}
            </CardBody>
          </Card>
          <OsBrief
            kind="draft"
            prompt={recs
              .slice(0, 5)
              .map((r) => `${r.player.name} ${r.player.pos} value ${r.value} adp10 ${r.player.adp10} ${r.why}`)
              .join("\n")}
          />
        </div>
      </div>
      <PlayerDrawer player={open} open={Boolean(open)} onOpenChange={() => setOpen(null)} />
    </div>
  );
}

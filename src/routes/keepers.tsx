import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Card, CardBody, CardHeader, CardTitle, CardDesc } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { KeepBadge, PosMark } from "@/components/grade-badge";
import { OsBrief } from "@/components/brief";
import { PlayerDrawer } from "@/components/player-drawer";
import { useDesk } from "@/lib/fantasy/use-desk";
import { copyToLm } from "@/lib/fantasy/keepers";
import type { PlayerState } from "@/lib/fantasy/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/keepers")({ component: KeepersPage });

function KeepersPage() {
  const { evals, selectedPair, pairLegal, selected, me, leagueKeepers, capital, returning, keeperOff, keepersLocked, players } =
    useDesk();
  const [open, setOpen] = useState<PlayerState | null>(null);
  const [copied, setCopied] = useState(false);

  const keptCount = keeperOff.size;
  const emptySlots = leagueKeepers.reduce((n, t) => n + t.empty, 0);
  const steals = leagueKeepers
    .flatMap((t) => t.seats.map((s) => ({ ...s, team: t.team.name })))
    .sort((a, b) => b.surplus - a.surplus)
    .slice(0, 4);

  const boardTop = [...players]
    .filter((p) => !keeperOff.has(p.id))
    .sort((a, b) => a.adp10 - b.adp10)
    .slice(0, 10);

  const prompt = [
    `Locked keepers ${keptCount}. Empty slots ${emptySlots}.`,
    ...leagueKeepers.flatMap((t) =>
      t.seats.map(
        (s) =>
          `${t.team.name}: ${s.player?.name ?? s.id} ${s.player?.pos ?? ""} ${s.espnLabel} surplus ${s.surplus} ${s.labelGrade}`,
      ),
    ),
    `Your remaining capital: ${capital.slice(0, 8).map((p) => p.label).join(", ")}`,
  ].join("\n");

  return (
    <div>
      <PageHeader
        kicker="Locked from ESPN · 2 keepers · cost is the burned pick"
        title="League keepers"
        desc="These names are already off the 2026 board. The round next to each player is taken as the keeper cost — that team does not pick in that round."
        actions={
          <>
            <Button
              variant="outline"
              onClick={() => {
                if (!selectedPair) return;
                void navigator.clipboard.writeText(copyToLm(me?.name ?? "Let Maye Cook", selectedPair));
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
              }}
            >
              {copied ? "Copied" : "Copy to LM"}
            </Button>
            <Button disabled>{keepersLocked ? "Locked in ESPN" : "Lock pair"}</Button>
          </>
        }
      />

      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <Card>
          <CardBody>
            <p className="text-[11px] tracking-[0.16em] text-muted uppercase">Off the board</p>
            <p className="mt-2 font-display text-3xl tabular tracking-tight">{keptCount}</p>
            <p className="mt-1 text-xs text-subtle">{emptySlots} keeper slots left empty — extra draft picks</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <p className="text-[11px] tracking-[0.16em] text-muted uppercase">Your burned picks</p>
            <p className="mt-2 font-display text-3xl tabular tracking-tight">
              {selectedPair
                ? [selectedPair.a.assigned, selectedPair.b.assigned]
                    .sort((a, b) => a - b)
                    .map((r) => `R${r}`)
                    .join(" · ")
                : "—"}
            </p>
            <p className="mt-1 text-xs text-subtle">McMillan 4.02 · Warren 5.09</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <p className="text-[11px] tracking-[0.16em] text-muted uppercase">Your next pick</p>
            <p className="mt-2 font-display text-3xl tabular tracking-tight">{capital[0]?.label ?? "1.09"}</p>
            <p className="mt-1 text-xs text-subtle">Then {capital[1]?.label ?? "2.02"} · {capital[2]?.label ?? "3.09"}</p>
          </CardBody>
        </Card>
      </div>

      {selectedPair && pairLegal && (
        <div className="mb-6 grid gap-3 sm:grid-cols-2">
          {[selectedPair.a, selectedPair.b]
            .slice()
            .sort((x, y) => x.assigned - y.assigned)
            .map((k) => (
              <button key={k.player.id} type="button" onClick={() => setOpen(k.player)} className="text-left">
                <Card>
                  <CardBody>
                    <div className="flex items-center justify-between gap-2">
                      <KeepBadge label={k.label} />
                      <span className="font-mono text-xs tabular text-accent">
                        {k.assigned === 4 ? "Rd 4, Pick 2" : k.assigned === 5 ? "Rd 5, Pick 9" : `R${k.assigned}`}
                      </span>
                    </div>
                    <p className="mt-2 font-display text-2xl tracking-tight">{k.player.name}</p>
                    <p className="mt-1 text-sm text-muted">
                      {k.player.pos} · {k.player.nflTeam}
                      {k.player.status && k.player.status !== "Active" ? ` · ${k.player.status}` : ""}
                    </p>
                    <p className="mt-2 font-mono text-xs tabular text-accent">
                      Surplus {k.surplus >= 0 ? "+" : ""}
                      {k.surplus.toFixed(1)} · AdjVOR {k.adjVor.toFixed(0)}
                    </p>
                  </CardBody>
                </Card>
              </button>
            ))}
        </div>
      )}

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Remaining capital</CardTitle>
          <CardDesc>Rounds 4 and 5 are gone. Sixteen picks still fire, snake slot 9.</CardDesc>
        </CardHeader>
        <CardBody className="flex flex-wrap gap-2">
          {capital.map((p) => (
            <span
              key={p.overall}
              className={cn(
                "rounded-md border border-border px-2.5 py-1 font-mono text-xs tabular",
                p.round <= 3 ? "border-accent/50 text-accent" : "text-muted",
              )}
            >
              {p.label}
            </span>
          ))}
        </CardBody>
      </Card>

      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {leagueKeepers.map((row) => (
          <Card key={row.team.id} className={cn(row.team.isYou && "border-accent/50")}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <CardTitle className="text-base">{row.team.name}</CardTitle>
                  <CardDesc>
                    Slot {row.team.draftSlot}
                    {row.team.isYou ? " · you" : ""} · surplus {row.totalSurplus >= 0 ? "+" : ""}
                    {row.totalSurplus.toFixed(0)}
                  </CardDesc>
                </div>
                {row.team.isYou ? <Badge tone="accent">You</Badge> : row.empty ? <Badge tone="warn">{row.empty} open</Badge> : null}
              </div>
            </CardHeader>
            <CardBody className="grid gap-0 pt-0">
              {row.seats.map((seat) => (
                <button
                  key={seat.id}
                  type="button"
                  onClick={() => seat.player && setOpen(seat.player)}
                  className="flex items-center gap-2 border-t border-border py-2.5 text-left first:border-t-0"
                >
                  {seat.player ? <PosMark pos={seat.player.pos} /> : <span className="w-8" />}
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">
                      {seat.player?.name ?? seat.id}
                      {seat.player?.status && seat.player.status !== "Active" ? (
                        <span className="ml-1.5 text-[10px] font-medium text-warn">{seat.player.status}</span>
                      ) : null}
                    </span>
                    <span className="block text-[11px] text-subtle">
                      {seat.player?.nflTeam ?? ""} {seat.player?.pos ?? ""} · surplus {seat.surplus >= 0 ? "+" : ""}
                      {seat.surplus.toFixed(0)}
                    </span>
                  </span>
                  <span className="shrink-0 text-right">
                    <span className="block font-mono text-[11px] tabular text-accent">{seat.espnLabel}</span>
                    <span className="block font-mono text-[10px] tabular text-subtle">{seat.label}</span>
                  </span>
                </button>
              ))}
              {Array.from({ length: row.empty }).map((_, i) => (
                <div key={`empty-${i}`} className="border-t border-border py-2.5 text-sm text-subtle">
                  Not selected — that pick stays in the draft
                </div>
              ))}
            </CardBody>
          </Card>
        ))}
      </div>

      <div className="mb-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Biggest steals</CardTitle>
            <CardDesc>Surplus is pick value at ADP minus the burned round. Judkins at R14 is the board-breaker.</CardDesc>
          </CardHeader>
          <CardBody className="grid gap-2">
            {steals.map((s) => (
              <button
                key={`${s.team}-${s.id}`}
                type="button"
                onClick={() => s.player && setOpen(s.player)}
                className="flex items-center justify-between gap-3 rounded-md px-2 py-2 text-left hover:bg-bg-subtle"
              >
                <span>
                  <span className="block text-sm font-medium">{s.player?.name ?? s.id}</span>
                  <span className="block text-[11px] text-subtle">
                    {s.team} · {s.espnLabel}
                  </span>
                </span>
                <span className="font-mono text-xs tabular text-accent">
                  {s.surplus >= 0 ? "+" : ""}
                  {s.surplus.toFixed(1)}
                </span>
              </button>
            ))}
          </CardBody>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>What 1.01 sees</CardTitle>
            <CardDesc>Tommy kept nobody. Gibbs, Bijan, Chase are back in the pool. Your 1.09 is the 9th bite.</CardDesc>
          </CardHeader>
          <CardBody className="grid gap-1">
            {boardTop.map((p, i) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setOpen(p)}
                className="flex items-center justify-between gap-3 rounded-md px-2 py-1.5 text-left hover:bg-bg-subtle"
              >
                <span className="flex min-w-0 items-baseline gap-2">
                  <span className="w-5 font-mono text-[11px] tabular text-subtle">{i + 1}</span>
                  <span className="truncate text-sm">{p.name}</span>
                  <span className="text-[11px] text-subtle">{p.pos}</span>
                </span>
                <span className="font-mono text-[11px] tabular text-muted">ADP {p.adp10.toFixed(0)}</span>
              </button>
            ))}
          </CardBody>
        </Card>
      </div>

      {returning.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Thrown back from Let Maye Cook</CardTitle>
            <CardDesc>2025 roster names that were not kept. They return to the draft pool — including the R1–4 bans.</CardDesc>
          </CardHeader>
          <CardBody className="flex flex-wrap gap-2">
            {returning.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setOpen(p)}
                className="rounded-md border border-border px-2.5 py-1 text-xs hover:bg-bg-subtle"
              >
                {p.name} <span className="text-subtle">{p.pos}</span>
              </button>
            ))}
          </CardBody>
        </Card>
      )}

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Your 2025 eligibility sheet</CardTitle>
          <CardDesc>Locked pair is McMillan + Warren. The rest of this list is history — they go back in the pool.</CardDesc>
        </CardHeader>
        <CardBody className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-[10px] tracking-widest text-subtle uppercase">
              <tr>
                <th className="pb-2 font-medium">Player</th>
                <th className="pb-2 font-medium">Pos</th>
                <th className="pb-2 font-medium">Cost</th>
                <th className="pb-2 font-medium">Surplus</th>
                <th className="pb-2 font-medium">AdjVOR</th>
                <th className="pb-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {evals.map((k) => {
                const on = selected.includes(k.player.id);
                return (
                  <tr
                    key={k.player.id}
                    className={cn("border-t border-border", !k.eligible && "opacity-40", on && "bg-bg-subtle")}
                  >
                    <td className="py-2.5">
                      <button type="button" className="text-left" onClick={() => setOpen(k.player)}>
                        <span className="font-medium">{k.player.name}</span>
                        <span className="mt-0.5 block text-xs text-subtle">{on ? "Locked keeper — off the board" : k.reason}</span>
                      </button>
                    </td>
                    <td className="font-mono text-xs">{k.player.pos}</td>
                    <td className="font-mono tabular">{on ? `R${k.assigned}` : k.sticker ? `R${k.sticker}` : "—"}</td>
                    <td className="font-mono tabular">
                      {k.surplus >= 0 ? "+" : ""}
                      {k.surplus.toFixed(1)}
                    </td>
                    <td className="font-mono tabular">{k.adjVor.toFixed(0)}</td>
                    <td>{on ? <KeepBadge label={k.label} /> : k.eligible ? "Returns" : "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardBody>
      </Card>

      <OsBrief kind="keeper" prompt={prompt} />
      <PlayerDrawer player={open} open={Boolean(open)} onOpenChange={() => setOpen(null)} />
    </div>
  );
}

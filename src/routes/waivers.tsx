import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Card, CardBody, CardHeader, CardTitle, CardDesc } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlayerDrawer } from "@/components/player-drawer";
import { OsBrief } from "@/components/brief";
import { useDesk } from "@/lib/fantasy/use-desk";
import { claimFactorSensitivity } from "@/lib/fantasy/waivers";
import type { PlayerState } from "@/lib/fantasy/types";

export const Route = createFileRoute("/waivers")({ component: WaiversPage });

function WaiversPage() {
  const { waivers, speculative, me, league, players } = useDesk();
  const sensitivity = claimFactorSensitivity([...players.values()]);
  const [open, setOpen] = useState<PlayerState | null>(null);

  return (
    <div>
      <PageHeader
        kicker="Inverse standings · 1-day period · not FAAB"
        title="Waivers"
        desc="FLEX and OP fill by expected points. A claim's replacement is the best free agent at that position in this league. Week-5 prelim is not ready, so this is not the Sunday draft and it is not scaled by a Vegas line."
      />

      <Card className="mb-6">
        <CardBody className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[11px] tracking-widest text-muted uppercase">Your priority</p>
            <p className="font-display text-3xl tabular">#{me?.waivers ?? "—"}</p>
          </div>
          <p className="max-w-sm text-sm text-subtle">
            Slot 1 is first in the waiver order. The claim number is the next three weeks of trailing average, with byes at 0. Priority is a heuristic and only breaks a tie under 1.5.
          </p>
        </CardBody>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Wire</CardTitle>
          <CardDesc>Top available players in this ESPN league, by percent owned. Not the same as the claim rank below.</CardDesc>
        </CardHeader>
        <CardBody className="grid gap-2">
          {(league.freeAgents ?? []).length === 0 && <p className="text-sm text-subtle">No free-agent list saved for this league yet.</p>}
          {(league.freeAgents ?? []).slice(0, 15).map((p) => (
            <div key={`${p.name}-${p.nfl}`} className="flex items-center justify-between gap-3 border-b border-border py-2 text-sm last:border-0">
              <span>
                {p.name} <span className="text-subtle">{p.pos} · {p.nfl}</span>
              </span>
              <span className="text-xs text-muted tabular">{p.waiver ? "Waiver" : "FA"} · {p.owned.toFixed(0)}%</span>
            </div>
          ))}
        </CardBody>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Recent moves</CardTitle>
          <CardDesc>Adds, drops, and waivers ESPN has already processed. Lineup swaps are not listed.</CardDesc>
        </CardHeader>
        <CardBody className="grid gap-2">
          {(league.activity ?? []).length === 0 && <p className="text-sm text-subtle">No moves stored.</p>}
          {(league.activity ?? []).slice(0, 12).map((a) => {
            const club = league.teams.find((t) => t.id === a.teamId);
            return (
              <p key={`${a.at}-${a.teamId}-${a.moves.map((m) => m.name).join()}`} className="text-sm">
                <span className="text-muted">{club?.abbrev ?? "Club"}</span>{" "}
                {a.moves.map((m) => `${m.action.toLowerCase()} ${m.name}`).join(", ")}
                <span className="text-subtle"> · {a.kind.toLowerCase()}{a.status === "PENDING" ? " pending" : ""}</span>
              </p>
            );
          })}
        </CardBody>
      </Card>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Speculative</CardTitle>
          <CardDesc>NO TRAIL. No points and no rank above a priced player. A debut cannot start.</CardDesc>
        </CardHeader>
        <CardBody className="grid gap-2">
          {speculative.length === 0 && <p className="text-sm text-subtle">No unpriced debut on this league's wire.</p>}
          {speculative.slice(0, 12).map((row) => (
            <p key={row.player.id} className="text-sm">
              {row.player.name} <span className="text-subtle">{row.player.pos}</span>
              <span className="text-muted"> · no points · cannot start</span>
            </p>
          ))}
        </CardBody>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Ranked claims</CardTitle>
          <CardDesc>{sensitivity.note} Ranked by expected points, not VOR.</CardDesc>
        </CardHeader>
        <CardBody className="grid gap-3">
          {waivers.length === 0 && <p className="text-sm text-subtle">No claims beat replacement after priority cost.</p>}
          {waivers.map((w) => (
            <button
              key={w.player.id}
              type="button"
              onClick={() => setOpen(w.player)}
              className="rounded-lg border border-border px-4 py-3 text-left hover:bg-bg-subtle"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium">
                    {w.player.name} <span className="text-subtle">{w.player.pos}</span>
                  </p>
                  <p className="mt-1 text-xs text-muted">{w.reason}</p>
                  {w.drop && <p className="mt-1 text-xs text-subtle">Drop {w.drop.name}</p>}
                </div>
                <div className="text-right">
                  <Badge tone={w.advice === "Burn" ? "start" : "warn"}>{w.advice}</Badge>
                  <p className="mt-2 font-mono text-xs tabular text-muted">
                    {w.claimValue.toFixed(1)} · week {w.weekPts.toFixed(1)}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </CardBody>
      </Card>
      <div className="mt-6">
        <OsBrief
          kind="waiver"
          prompt={waivers
            .slice(0, 5)
            .map((w) => `${w.advice} ${w.player.name} drop ${w.drop?.name ?? "none"} claim ${w.claimValue} week ${w.weekPts}`)
            .join("\n")}
        />
      </div>
      <PlayerDrawer player={open} open={Boolean(open)} onOpenChange={() => setOpen(null)} />
    </div>
  );
}

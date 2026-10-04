import { Link, createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Card, CardBody, CardHeader, CardTitle, CardDesc } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ConfidenceBadge } from "@/components/grade-badge";
import { useDesk } from "@/lib/fantasy/use-desk";
import { fetchNflScoreboard } from "@/lib/espn/client";
import { DRAFT_START_AT, KEEPER_LOCK_AT } from "@/lib/fantasy/config";

export const Route = createFileRoute("/")({ component: Home });

function countdown(from: number) {
  const diff = Math.max(0, from - Date.now());
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  return { d, h, m, done: diff === 0 };
}

function Home() {
  const { me, lineup, opponent, theirLineup, actions, phase, selectedPair, pairLegal, mode, league, win, brainChip } = useDesk();
  const [lock, setLock] = useState(countdown(KEEPER_LOCK_AT));
  const [draft, setDraft] = useState(countdown(DRAFT_START_AT));
  useEffect(() => {
    const tick = () => {
      setLock(countdown(KEEPER_LOCK_AT));
      setDraft(countdown(DRAFT_START_AT));
    };
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, []);
  const board = useQuery({
    queryKey: ["nfl-board", league.week],
    queryFn: () => fetchNflScoreboard({ data: { week: league.week } }),
  });

  return (
    <div>
      <PageHeader
        kicker={`${me?.name ?? league.name} · Week ${league.week}`}
        title="Command"
        desc="One scorer for the lineup, the wire, and trades. Counting stats go through Bush League points. A missing feed stamps STALE. Under 1.5 points is a coin-flip."
      />
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 text-sm">
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-warn">BASELINE, brain disabled, validation failed.</p>
          {brainChip ? <p className="text-subtle">{brainChip.label}</p> : <p className="text-subtle">Freeze STALE</p>}
        </div>
        <div className="flex gap-4">
          <Link to="/grade" className="min-h-11 text-accent">
            Brain record
          </Link>
          <a className="min-h-11 text-accent" href={`https://fantasy.espn.com/football/team?leagueId=${league.espnLeagueId}&seasonId=${league.season}`}>
            Open ESPN
          </a>
        </div>
      </div>

      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        {(phase === "season"
          ? [
              { k: "Week", v: String(league.week), s: league.name },
              {
                k: "Record",
                v: me ? `${me.record.w}-${me.record.l}${me.record.t ? `-${me.record.t}` : ""}` : "—",
                s: me?.name ?? "Pick your club in Setup",
              },
              {
                k: "Three-point sample",
                v: win != null ? `${Math.round(win * 100)}%` : "—",
                s: opponent ? `vs ${opponent.name} · not a win chance · ${mode}` : "No opponent synced",
              },
            ]
          : [
              {
                k: "Keeper lock",
                v: lock.done ? "Locked" : `${lock.d}d ${lock.h}h`,
                s: "Tue 7:30 PM ET",
              },
              {
                k: "Draft",
                v: draft.done ? "Live" : `${draft.d}d ${draft.h}h`,
                s: "Tue 8:30 PM · 60s clock",
              },
              {
                k: "Locked pair",
                v: selectedPair
                  ? `${selectedPair.a.player.name.split(" ").slice(-1)[0]} + ${selectedPair.b.player.name.split(" ").slice(-1)[0]}`
                  : "—",
                s: pairLegal ? "McMillan R4.02 · Warren R5.09" : "Illegal pair",
              },
            ]
        ).map((stat) => (
          <Card key={stat.k}>
            <CardBody>
              <p className="text-[11px] tracking-[0.16em] text-muted uppercase">{stat.k}</p>
              <p className="mt-2 font-display text-3xl tabular tracking-tight">{stat.v}</p>
              <p className="mt-1 text-xs text-subtle">{stat.s}</p>
            </CardBody>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle>Do this</CardTitle>
            <CardDesc>Three actions. Each one has a flip condition.</CardDesc>
          </CardHeader>
          <CardBody className="grid gap-4">
            {actions.map((a, i) => (
              <Link key={a.id} to={a.href} className="block rounded-lg border border-border bg-bg px-4 py-4 hover:bg-bg-subtle">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] tracking-[0.16em] text-accent uppercase">
                      {i + 1}. {a.title}
                    </p>
                    <p className="mt-2 font-display text-xl tracking-tight">{a.doThis}</p>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{a.why}</p>
                    <p className="mt-2 text-xs text-subtle">Flip: {a.flip}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <ConfidenceBadge label={a.confidence} />
                    <p className="mt-2 font-mono text-xs tabular text-muted">{a.gain}</p>
                  </div>
                </div>
              </Link>
            ))}
          </CardBody>
        </Card>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>{phase === "keepers" ? "Board after keepers" : "Matchup snapshot"}</CardTitle>
              <CardDesc>
                {phase === "keepers"
                  ? "16 names off. Tommy kept nobody and owns 1.01. Your first bite is 1.09."
                  : `${opponent ? `vs ${opponent.name}` : "No opponent yet"} · mode ${mode}`}
              </CardDesc>
            </CardHeader>
            <CardBody>
              {phase === "keepers" ? (
                <>
                  <p className="text-xs text-subtle">Pick 1.09</p>
                  <p className="font-display text-3xl tracking-tight">{actions.find((a) => a.id === "first-pick")?.doThis ?? "Rebuild the board at 7:30"}</p>
                  <Button asChild variant="outline" className="mt-4 w-full">
                    <Link to="/draft">Open draft room</Link>
                  </Button>
                </>
              ) : (
                <>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-xs text-subtle">You</p>
                      <p className="font-display text-4xl tabular">{lineup.projected.toFixed(1)}</p>
                    </div>
                    <p className="text-sm text-muted">
                      Recent low {lineup.p20.toFixed(0)} · recent high {lineup.p80.toFixed(0)}
                    </p>
                    <div className="text-right">
                      <p className="text-xs text-subtle">{opponent?.abbrev ?? "OPP"}</p>
                      <p className="font-display text-4xl tabular">{theirLineup.projected.toFixed(1)}</p>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-muted">
                    Best lineup {lineup.projected.toFixed(1)}. Recent low {lineup.p20.toFixed(0)}, recent high {lineup.p80.toFixed(0)}.
                  </p>
                  <Button asChild variant="outline" className="mt-4 w-full">
                    <Link to="/lineup">Set the lineup</Link>
                  </Button>
                </>
              )}
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>NFL board</CardTitle>
              <CardDesc>Week 1 kick windows. Individual lock at gametime.</CardDesc>
            </CardHeader>
            <CardBody className="grid gap-2">
              {(board.data?.games ?? []).slice(0, 6).map((g) => (
                <div key={g.short} className="flex items-center justify-between text-sm">
                  <span>{g.short}</span>
                  <span className="font-mono text-xs text-subtle">{g.status || new Date(g.date).toLocaleString()}</span>
                </div>
              ))}
              {!board.data?.games?.length && <p className="text-sm text-subtle">Scoreboard loads when ESPN publishes Week 1.</p>}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}

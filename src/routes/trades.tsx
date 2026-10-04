import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Card, CardBody, CardHeader, CardTitle, CardDesc } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { OsBrief } from "@/components/brief";
import { useDesk } from "@/lib/fantasy/use-desk";
import { evaluateTrade } from "@/lib/fantasy/trades";
import { useBush } from "@/lib/store";
import { TRADE_DEADLINE_AT } from "@/lib/fantasy/config";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/trades")({ component: TradesPage });

function TradesPage() {
  const { me, mine, trades, map, opponent, league, mode } = useDesk();
  const partnerId = useBush((s) => s.tradePartnerId);
  const giveIds = useBush((s) => s.giveIds);
  const getIds = useBush((s) => s.getIds);
  const setTrade = useBush((s) => s.setTrade);
  const closed = Date.now() > TRADE_DEADLINE_AT;
  const partner = league.teams.find((t) => t.id === partnerId) ?? opponent ?? league.teams.find((t) => !t.isYou);
  const theirRoster = useMemo(() => {
    if (!partner) return [];
    return partner.roster.map((id) => map.get(id)).filter(Boolean);
  }, [partner, map]);

  const top3 = new Set([...league.teams].sort((a, b) => b.pf - a.pf).slice(0, 3).map((t) => t.id));
  const evald =
    me && partner && giveIds.length && getIds.length
      ? evaluateTrade(me, partner, map, giveIds, getIds, mode, { partnerTop3: top3.has(partner.id) })
      : null;

  function toggle(list: "give" | "get", id: string) {
    if (!partner) return;
    if (list === "give") {
      const next = giveIds.includes(id) ? giveIds.filter((x) => x !== id) : [...giveIds, id].slice(0, 3);
      setTrade(partner.id, next, getIds);
    } else {
      const next = getIds.includes(id) ? getIds.filter((x) => x !== id) : [...getIds, id].slice(0, 3);
      setTrade(partner.id, giveIds, next);
    }
  }

  return (
    <div>
      <PageHeader
        kicker="No review period · deadline Dec 4, 3:00 AM"
        title="Trades"
        desc="The letter is this week's starter change. A rest-of-season number can sit beside it and does not grade the deal. Three or fewer scored weeks is a thin sample: no Accept or Reject."
      />

      {closed && (
        <p className="mb-4 rounded-lg border border-warn/40 bg-warn/10 px-4 py-3 text-sm text-warn">
          Finder is hidden after the deadline. Analyzer stays for recaps.
        </p>
      )}

      <div className="mb-4 flex flex-wrap gap-2">
        {league.teams
          .filter((t) => !t.isYou)
          .map((t) => (
            <Button key={t.id} size="sm" variant={partner?.id === t.id ? "default" : "outline"} onClick={() => setTrade(t.id, [], [])}>
              {t.abbrev}
            </Button>
          ))}
      </div>

      <div className="mb-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>You send</CardTitle>
            <CardDesc>{me?.name}</CardDesc>
          </CardHeader>
          <CardBody className="grid gap-1">
            {mine
              .filter((p) => p.pos !== "DST")
              .map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => toggle("give", p.id)}
                  className={cn("flex justify-between rounded-md px-2 py-2 text-sm", giveIds.includes(p.id) && "bg-bg-subtle")}
                >
                  <span>
                    {p.pos} {p.name}
                  </span>
                  <span className="font-mono text-xs tabular text-muted">{p.adjVor.toFixed(0)}</span>
                </button>
              ))}
          </CardBody>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>You get</CardTitle>
            <CardDesc>{partner?.name ?? "Pick a team"}</CardDesc>
          </CardHeader>
          <CardBody className="grid gap-1">
            {theirRoster.map((p) => (
              <button
                key={p!.id}
                type="button"
                onClick={() => toggle("get", p!.id)}
                className={cn("flex justify-between rounded-md px-2 py-2 text-sm", getIds.includes(p!.id) && "bg-bg-subtle")}
              >
                <span>
                  {p!.pos} {p!.name}
                </span>
                <span className="font-mono text-xs tabular text-muted">{p!.adjVor.toFixed(0)}</span>
              </button>
            ))}
            {!theirRoster.length && <p className="text-sm text-subtle">Projected keepers only until ESPN or paste fills the roster.</p>}
          </CardBody>
        </Card>
      </div>

      {evald && (
        <Card className="mb-6">
          <CardBody className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-display text-3xl tabular">
                {evald.weekYou >= 0 ? "+" : ""}
                {evald.weekYou.toFixed(1)}
              </p>
              <p className="text-sm text-muted">{evald.why}</p>
              <p className="mt-1 text-xs text-subtle">
                Beside the letter, not in it:{" "}
                {[...giveIds, ...getIds]
                  .map((id) => map.get(id))
                  .filter((player) => player && player.trail !== "none")
                  .map((player) => `${player!.name} ${player!.ros.ePts.toFixed(1)} THIN, NOT A FORECAST`)
                  .join(" · ") || "No rest-of-season number."}
              </p>
            </div>
            <Badge tone={evald.letter === "A" || evald.letter === "B" ? "start" : evald.letter === "F" ? "sit" : "warn"}>
              {evald.letter} · {evald.verdict}
            </Badge>
          </CardBody>
        </Card>
      )}

      {!closed && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Finder</CardTitle>
            <CardDesc>Packages where this week's starters change by more than 1.5. A thin sample is not offered.</CardDesc>
          </CardHeader>
          <CardBody className="grid gap-2">
            {trades.map((t, i) => (
              <button
                key={`${t.partner.id}-${i}`}
                type="button"
                onClick={() => setTrade(t.partner.id, t.give.map((p) => p.id), t.get.map((p) => p.id))}
                className="rounded-lg border border-border px-4 py-3 text-left hover:bg-bg-subtle"
              >
                <p className="text-sm font-medium">
                  {t.give.map((p) => p.name).join(", ")} → {t.get.map((p) => p.name).join(", ")}
                  <span className="text-subtle"> · {t.partner.abbrev}</span>
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <Badge tone={t.eval.letter === "A" || t.eval.letter === "B" ? "start" : t.eval.letter === "F" || t.eval.letter === "D" ? "sit" : "warn"}>
                    {t.eval.letter} · {t.eval.verdict}
                  </Badge>
                  <span className="font-mono text-xs tabular text-muted">
                    Week {t.eval.weekYou >= 0 ? "+" : ""}
                    {t.eval.weekYou.toFixed(1)}
                    {t.eval.fair ? " · 8% heuristic" : ""}
                  </span>
                </div>
              </button>
            ))}
            {!trades.length && (
              <p className="text-sm text-subtle">
                No Accept. A package has to clear 1.5 starter points, and three or fewer scored weeks cannot be an Accept. Build a deal below to see the letter.
              </p>
            )}
          </CardBody>
        </Card>
      )}

      <OsBrief
        kind="trade"
        prompt={evald ? `NRA ${evald.nra} you ${evald.you} them ${evald.them} ${evald.why}` : "No deal loaded."}
      />
    </div>
  );
}

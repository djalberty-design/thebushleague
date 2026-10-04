import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Card, CardBody, CardHeader, CardTitle, CardDesc } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { connectEspnLeague, parsePastedRoster } from "@/lib/espn/client";
import { useBush } from "@/lib/store";
import { buildManualLeague } from "@/lib/fantasy/league";
import { LEAGUE_ID } from "@/lib/fantasy/config";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/setup")({ component: SetupPage });

function SetupPage() {
  const espn = useBush((s) => s.espn);
  const setEspn = useBush((s) => s.setEspn);
  const setLeague = useBush((s) => s.setLeague);
  const resetSeed = useBush((s) => s.resetSeed);
  const league = useBush((s) => s.league);
  const library = useBush((s) => s.library);
  const activeId = useBush((s) => s.activeId);
  const myTeamId = useBush((s) => s.myTeamId);
  const switchLeague = useBush((s) => s.switchLeague);
  const removeLeague = useBush((s) => s.removeLeague);
  const claimTeam = useBush((s) => s.claimTeam);
  const pasteText = useBush((s) => s.pasteText);
  const setPasteText = useBush((s) => s.setPasteText);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const [teamTouched, setTeamTouched] = useState(false);

  async function refreshSaved() {
    setBusy(true);
    setMsg(null);
    const ids = ["1014874", "210326445"];
    const notes: string[] = [];
    for (const leagueId of ids) {
      const res = await connectEspnLeague({
        data: { leagueId, season: espn.season, swid: espn.swid || undefined, espnS2: espn.espnS2 || undefined, teamId: null },
      });
      if (!res.ok) {
        setBusy(false);
        setMsg(res.error);
        return;
      }
      setLeague(res.league, res.myTeamId, res.extraPlayers);
      notes.push(res.league.name);
    }
    setBusy(false);
    setMsg(`Refreshed ${notes.join(" and ")}. Login stays on this desk.`);
  }

  async function connect() {
    setBusy(true);
    setMsg(null);
    const leagueId = espn.leagueId.trim() || LEAGUE_ID;
    const teamId = !teamTouched && leagueId !== LEAGUE_ID ? null : espn.teamId;
    const res = await connectEspnLeague({
      data: {
        leagueId,
        season: espn.season,
        swid: espn.swid || undefined,
        espnS2: espn.espnS2 || undefined,
        teamId,
      },
    });
    setBusy(false);
    if (!res.ok) setMsg(res.error);
    else {
      setLeague(res.league, res.myTeamId, res.extraPlayers);
      setMsg(res.warnings.filter(Boolean).join(" ") || `Synced ${res.league.name}.`);
    }
  }

  function rosterMessage(parsed: ReturnType<typeof parsePastedRoster>, lead: string) {
    const miss = parsed.unmatched.length ? ` Not matched: ${parsed.unmatched.slice(0, 6).join(", ")}.` : "";
    setMsg(`${lead}${miss}`);
  }

  function applyPaste() {
    const parsed = parsePastedRoster(pasteText);
    if (!parsed.ids.length) {
      setMsg(parsed.unmatched.length ? `No matching names. Check spelling: ${parsed.unmatched.slice(0, 6).join(", ")}.` : "Paste one player per line.");
      return;
    }
    const teams = league.teams.some((t) => t.isYou)
      ? league.teams.map((t) => (t.isYou ? { ...t, roster: parsed.ids } : t))
      : [
          ...league.teams.map((t) => ({ ...t, isYou: false })),
          {
            id: myTeamId || 1,
            name: "My team",
            abbrev: "ME",
            owner: "You",
            isYou: true,
            draftSlot: 1,
            record: { w: 0, l: 0, t: 0 },
            pf: 0,
            pa: 0,
            roster: parsed.ids,
            ir: [],
            draft: {},
            keepers: [],
            keeperCost: {},
            projectedKeepers: [],
            waivers: 1,
          },
        ];
    setLeague(
      { ...league, teams, source: league.source === "espn" ? "espn" : "paste", lastUpdated: Date.now() },
      myTeamId || 1,
      parsed.extra.length ? parsed.extra : undefined,
    );
    rosterMessage(parsed, `Loaded ${parsed.ids.length} players onto ${league.name}.`);
  }

  function addPastedLeague() {
    const parsed = parsePastedRoster(pasteText);
    if (!parsed.ids.length) {
      setMsg(parsed.unmatched.length ? `No matching names. Check spelling: ${parsed.unmatched.slice(0, 6).join(", ")}.` : "Paste one player per line.");
      return;
    }
    const built = buildManualLeague({ name: newName, rosterIds: parsed.ids });
    setLeague(built, 1, parsed.extra);
    setNewName("");
    rosterMessage(parsed, `Added ${built.name} with ${parsed.ids.length} players. Lineup works now. Trades need the other rosters, so connect ESPN when you can.`);
  }

  return (
    <div>
      <PageHeader
        kicker="Same scoring on every league"
        title="Leagues"
        desc="Keep The Bush League and add as many others as you want. One ESPN login covers all of them. On a phone, paste a roster instead."
      />

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Your leagues</CardTitle>
          <CardDesc>{library.length} saved. The open league is what Command, Lineup, and Waivers use.</CardDesc>
        </CardHeader>
        <CardBody className="grid gap-2">
          {library.map((slot) => {
            const you = slot.league.teams.find((t) => t.id === slot.myTeamId) ?? slot.league.teams.find((t) => t.isYou);
            const on = slot.id === activeId;
            return (
              <div
                key={slot.id}
                className={cn(
                  "flex flex-wrap items-center gap-3 rounded-md border px-3 py-3",
                  on ? "border-accent/60 bg-bg-subtle" : "border-border",
                )}
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{slot.league.name}</p>
                  <p className="text-xs text-subtle">
                    {you?.name ?? "Pick your club"} · {slot.league.teams.length} teams · {slot.league.source}
                    {on ? " · open" : ""}
                  </p>
                </div>
                {!on && (
                  <Button variant="outline" onClick={() => switchLeague(slot.id)}>
                    Open
                  </Button>
                )}
                <Button variant="ghost" disabled={library.length <= 1} onClick={() => removeLeague(slot.id)}>
                  Remove
                </Button>
              </div>
            );
          })}
        </CardBody>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Add or refresh from ESPN</CardTitle>
            <CardDesc>
              Login is saved on this desk for The Bush League and TW Fantasy. Refresh does not need the cookies again. A new league still needs its ID.
            </CardDesc>
          </CardHeader>
          <CardBody className="grid gap-3">
            <div>
              <Label htmlFor="lid">League ID</Label>
              <Input id="lid" value={espn.leagueId} onChange={(e) => setEspn({ leagueId: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="tid">Team ID</Label>
              <Input
                id="tid"
                inputMode="numeric"
                value={espn.teamId ?? ""}
                placeholder="Blank — pick your club after connect"
                onChange={(e) => {
                  setTeamTouched(true);
                  const raw = e.target.value.trim();
                  setEspn({ teamId: raw ? Number(raw) || null : null });
                }}
              />
            </div>
            <div>
              <Label htmlFor="swid">SWID</Label>
              <Input id="swid" value={espn.swid} onChange={(e) => setEspn({ swid: e.target.value })} placeholder="{...}" />
            </div>
            <div>
              <Label htmlFor="s2">espn_s2</Label>
              <Input id="s2" value={espn.espnS2} onChange={(e) => setEspn({ espnS2: e.target.value })} />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => void refreshSaved()} disabled={busy}>
                {busy ? "Refreshing…" : "Refresh both leagues"}
              </Button>
              <Button variant="outline" onClick={() => void connect()} disabled={busy}>
                Connect this league
              </Button>
              <Button variant="outline" onClick={resetSeed}>
                Reset Bush League
              </Button>
            </div>
            <p className="text-xs text-subtle">
              Open now: {league.name} · {league.source}
            </p>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Paste a roster</CardTitle>
            <CardDesc>One player per line. This is the phone path. No cookies.</CardDesc>
          </CardHeader>
          <CardBody className="grid gap-3">
            <Textarea
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
              className="min-h-40"
              placeholder={"CeeDee Lamb\nJahmyr Gibbs\nTyler Warren"}
            />
            <div>
              <Label htmlFor="lname">Name for a new league</Label>
              <Input id="lname" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Work league" />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={applyPaste}>
                Update {league.name}
              </Button>
              <Button onClick={addPastedLeague}>Add as new league</Button>
            </div>
          </CardBody>
        </Card>
      </div>

      {league.teams.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Your club in {league.name}</CardTitle>
            <CardDesc>Lineup and waivers follow this team. Bush League should be Let Maye Cook.</CardDesc>
          </CardHeader>
          <CardBody className="flex flex-wrap gap-2">
            {league.teams.map((t) => (
              <Button key={t.id} variant={t.id === myTeamId ? "default" : "outline"} onClick={() => claimTeam(t.id)}>
                {t.name}
              </Button>
            ))}
          </CardBody>
        </Card>
      )}

      {msg && <p className="mt-4 text-sm text-muted">{msg}</p>}
    </div>
  );
}

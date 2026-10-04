import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { Card, CardBody, CardHeader, CardTitle, CardDesc } from "@/components/ui/card";
import { GRADE_ROWS } from "@/lib/fantasy/brain/stored/grades";
import { NINE } from "@/lib/fantasy/brain/stored/nine";
import { NINE_PARITY } from "@/lib/fantasy/brain/stored/nine-parity";
import { PARITY } from "@/lib/fantasy/brain/stored/parity";
import { DECISIONS } from "@/lib/fantasy/brain/stored/decisions";
import { SHRINK } from "@/lib/fantasy/brain/stored/shrink";
import { TERCILE } from "@/lib/fantasy/brain/stored/tercile";
import { KILL_RULE } from "@/lib/fantasy/brain/stored/kill";
import { WEEK5_LEDGER } from "@/lib/fantasy/brain/stored/ledger";
import { PLAYED_ONLY } from "@/lib/fantasy/brain/stored/played-only";
import { QB_STARTS } from "@/lib/fantasy/brain/stored/qb-starts";
import { MONDAY_CONFIRMATION } from "@/lib/fantasy/brain/stored/monday-confirmation";
import { TUESDAY_FINAL } from "@/lib/fantasy/brain/stored/tuesday-final";
import { WEEK5_PRELIM } from "@/lib/fantasy/brain/stored/week5-prelim";
import { WEEK5_LOCKS } from "@/lib/fantasy/brain/stored/week5-locks";
import { ROSTER_AUDIT } from "@/lib/fantasy/brain/stored/roster-audit";
import { INACTIVE_AUDIT } from "@/lib/fantasy/brain/stored/inactives";
import { commitDecision } from "@/lib/fantasy/brain/commit";
import { STORED_WEIGHTS } from "@/lib/fantasy/brain/stored/weights";
import { mae } from "@/lib/fantasy/brain/grade";

export const Route = createFileRoute("/grade")({ component: GradePage });

function GradePage() {
  const decision = commitDecision(GRADE_ROWS, STORED_WEIGHTS);
  const priced = GRADE_ROWS.filter((row) => row.ePts != null);
  const line = `${GRADE_ROWS.length} unique Thursday players. The card is the trailing average, ${mae(priced, "baseline").toFixed(1)} off on this handful. Parity ${PARITY.passed ? "passed" : "FAILED"} on ${PARITY.rows} rows. B1 is disabled. B2 is shadow. ${decision.reason}`;

  return (
    <div>
      <PageHeader kicker="Grade log · stored rows only" title="Brain record" desc={line} />
      <div className="mb-4">
        <Link to="/" className="min-h-11 text-sm text-accent">
          Back to command
        </Link>
      </div>
      <div className="mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Week 10 kill</CardTitle>
            <CardDesc>The bars stay 0.25 and a lower bound above zero. This page does not lower them.</CardDesc>
          </CardHeader>
          <CardBody className="grid gap-2 text-sm">
            <p>At the {KILL_RULE.at}, pool the {KILL_RULE.pool}. {KILL_RULE.test}</p>
            <p>{KILL_RULE.rollback}</p>
            <p>{KILL_RULE.sunday}</p>
            <p>
              Odd-week lower bound {PARITY.odd.lowerBound}. Error gap {PARITY.odd.gap}. The check did not pass. {DECISIONS.disagree} of {DECISIONS.rows} rows differ from that player's own average by more than 1.5. Absolute error saved {DECISIONS.errorSaved}. That is not lineup value.
            </p>
          </CardBody>
        </Card>
      </div>
      <div className="mb-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quarterback terciles</CardTitle>
            <CardDesc>Odd weeks only. Missed games are zero. 276 is printed only if the bottom tercile lands within 1.5 of its prediction.</CardDesc>
          </CardHeader>
          <CardBody className="grid gap-2 text-sm">
            <p>Maye's week is {TERCILE.mayeWeekly}. {TERCILE.mayeThin} is THIN, NOT A FORECAST, and it does not grade a trade. {TERCILE.reason}</p>
            {TERCILE.terciles.map((band) => (
              <p key={band.name}>
                {band.name}: n {band.n}, early {band.earlyMean}, predicted {band.predictedMean}, actual {band.actualMean}, gap {band.gap}. {band.verdict}.
              </p>
            ))}
            <p>Played-only is stored and not on the card. The bottom group is {PLAYED_ONLY.terciles[0].nonPersistent ? "non-persistent" : "still inside 3"}.</p>
            <p>Shrink weight {SHRINK.starter.weight} toward {SHRINK.starter.prior} is not on the card. games / (games + 7) is not kept. 276 is not published.</p>
          </CardBody>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Week 5 files</CardTitle>
            <CardDesc>{WEEK5_LEDGER.id}. Not locked. Not the waiver file.</CardDesc>
          </CardHeader>
          <CardBody className="grid gap-2 text-sm">
            <p>
              {WEEK5_LEDGER.counts.rows} skill rows. Priced {WEEK5_LEDGER.counts.priced}. Bye {WEEK5_LEDGER.counts.bye}. NO TRAIL {WEEK5_LEDGER.counts.noTrail}. Locked: {WEEK5_LEDGER.locked ? "yes" : "no"}. Every row carries the scorer hash.
            </p>
            <p>
              Monday confirmation is its own file. {MONDAY_CONFIRMATION.label}. {MONDAY_CONFIRMATION.contamination} Sunday actuals on disk: {MONDAY_CONFIRMATION.actualsOnDisk}. The stamp stays. Week-5 rows in it: {MONDAY_CONFIRMATION.week5Rows}. Week-5 prelim rows: {WEEK5_PRELIM.rows.length}.
            </p>
            <p>
              Tuesday final includes Monday night: {TUESDAY_FINAL.includesMondayNight ? "yes" : "not yet"}. Overwrites Monday: {TUESDAY_FINAL.overwritesMonday ? "yes" : "no"}. {TUESDAY_FINAL.reason}
            </p>
            <p>
              Week-5 prelim ready: {WEEK5_PRELIM.ready ? "yes" : "no"}. Uses the Sunday draft: {WEEK5_PRELIM.usesSundayDraft ? "yes" : "no"}. Thursday lock: {WEEK5_LOCKS.thursday ? "set" : "not yet"}. Sunday lock: {WEEK5_LOCKS.sundayEarly ? "set" : "not yet"}.
            </p>
            <p>
              {ROSTER_AUDIT.conclusion} Flip metric ran: {ROSTER_AUDIT.flipRan ? "yes" : "no"}. QB14 is a heuristic sort. It is off the waiver button and it was not retuned. The claim is the next three weeks of trailing average. The 1.6 scale is off. Priority only breaks a tie under 1.5. {QB_STARTS.note}
            </p>
            <p>
              Starts under 3 on the stored lineups: {INACTIVE_AUDIT.storedStartsUnder3}. {INACTIVE_AUDIT.reason}
            </p>
            <p>Weight file {STORED_WEIGHTS.usageLast3.toFixed(2)}. No red-zone join. No one-week rollback. The formula was not touched.</p>
          </CardBody>
        </Card>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Scored weeks</CardTitle>
            <CardDesc>Empty until a freeze is stored and scored after the games. The lineup number stays the trailing average until then.</CardDesc>
          </CardHeader>
          <CardBody className="grid gap-2 text-sm">
            {GRADE_ROWS.length === 0 && <p>No grade rows.</p>}
            {GRADE_ROWS.slice(0, 12).map((row) => (
              <p key={`${row.playerId}-${row.week}`}>
                W{row.week} {row.playerId} ({row.leagueIds.join(", ")}): actual {row.actualPoints.toFixed(1)} · trailing average {row.baseline.toFixed(1)} · recent low {row.p20.toFixed(1)} · recent high {row.p80.toFixed(1)} · {row.tag}
              </p>
            ))}
          </CardBody>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Shadow components</CardTitle>
            <CardDesc>Not on the card. The player drawer does not show these points.</CardDesc>
          </CardHeader>
          <CardBody className="grid gap-3 text-sm">
            <p>{decision.reason} The file still reads {STORED_WEIGHTS.usageLast3.toFixed(2)}.</p>
            {NINE_PARITY.rows.map((row) => (
              <p key={`parity-${row.playerId}`}>
                {row.playerId}: shadow {row.brain ?? "not priced"} · trailing {row.b0 ?? "n/a"}. Targets {row.targets ?? "n/a"}. Carries {row.carries ?? "n/a"}. Receptions {row.receptions ?? "n/a"}. First downs {row.firstDowns ?? "n/a"}.
              </p>
            ))}
            {NINE.rows.map((row) => (
              <p key={row.playerId}>
                {row.playerId}: hand {row.hand} {row.handAgrees ? "agrees" : "DISAGREES"}.
              </p>
            ))}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

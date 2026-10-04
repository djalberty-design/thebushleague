import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { Card, CardBody, CardHeader, CardTitle, CardDesc } from "@/components/ui/card";

export const Route = createFileRoute("/rules")({ component: RulesPage });

function RulesPage() {
  return (
    <div>
      <PageHeader
        kicker="Locked · The Bush League · ESPN 1014874"
        title="The Standard"
        desc="This is not a slider toy. Scoring, keepers, VOR, and capital are the constitution. Live ESPN settings win if they disagree."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Scoring that inflates volume</CardTitle>
            <CardDesc>Never ingest generic PPR totals as the primary score.</CardDesc>
          </CardHeader>
          <CardBody className="grid gap-2 text-sm text-muted">
            <p>Pass: 0.05/yd, +0.10 completion, −0.10 incompletion, 4 PTD, 0.50 first down, −2 INT, −1 sack, 300/400 bonuses.</p>
            <p>Rush: 0.10/yd, 0.10/attempt, 6 RTD, 1 first down, 100/200 bonuses.</p>
            <p>Rec: 0.10/yd, 1 PPR, 0.20/target, 6 TD, 1 first down, 100/200 bonuses.</p>
            <p>OP is a soft superflex. Kickers start 0 and are never drafted.</p>
          </CardBody>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Keepers</CardTitle>
            <CardDesc>One extra year. Collision burns the next unused round.</CardDesc>
          </CardHeader>
          <CardBody className="grid gap-2 text-sm text-muted">
            <p>Two keepers, different positions. ESPN assigned the designated round — that pick is the cost and is burned.</p>
            <p>Cannot keep Rounds 1–4 or anyone on the K list. Empty keeper slots stay as extra draft picks.</p>
            <p>KeepScore = 55% z(AdjVOR) + 45% z(Surplus), rescaled to 100. Surplus uses assigned cost, not sticker.</p>
            <p>Locked 2026 pair: Tetairoa McMillan (Rd 4, Pick 2) + Tyler Warren (Rd 5, Pick 9). Those two are off the board.</p>
          </CardBody>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Replacement / VOR</CardTitle>
            <CardDesc>Scarcity lives here. No extra scarcity category on top.</CardDesc>
          </CardHeader>
          <CardBody className="grid gap-2 text-sm text-muted">
            <p>QB14 · RB26 · WR37 · TE12 · DST11. OP soaks extra QBs. TE has a real cliff.</p>
            <p>E[Pts] = 0.25×P20 + 0.50×P50 + 0.25×P80. A 14 with a 4–28 spread is not a 14 with a 9–17 spread.</p>
            <p>Start/sit uses weekly replacement. Keepers, draft, and trades use ROS.</p>
          </CardBody>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>What never enters the score</CardTitle>
          </CardHeader>
          <CardBody className="grid gap-2 text-sm text-muted">
            <p>FAAB. Kickers in recommendations. Linear rounds-saved. Multi-year dynasty aging. Contract dollars. Twitter heat. Last week's box score as ROS.</p>
            <p>Waiver priority resets weekly to inverse standings. Trade deadline December 4, 3:00 AM. No review.</p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

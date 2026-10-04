import { createServerFn } from "@tanstack/react-start";

export type AnalyzeKind = "startsit" | "waiver" | "keeper" | "draft" | "matchup" | "trade";

export const analyzeDecision = createServerFn({ method: "POST" })
  .validator((input: { kind: AnalyzeKind; prompt: string }) => input)
  .handler(async ({ data }) => {
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) return { ok: false as const, error: "OS Brief is unavailable in this environment." };

    const system = `You are Bush League OS, the desk for ESPN league 1014874 (The Bush League). 10 teams, H2H points, OP (soft superflex), K start 0, inverse-standings waivers (NOT FAAB), 2 keepers one extra year only, colliding keeper rounds burn the next unused round. Scoring pays targets (0.2), first downs, rush attempts, completions; taxes incompletions, sacks, INTs. Never recommend kickers. Never use FAAB. Never add multi-year residual. Be decisive. No emojis. 120-180 words: verdict line, 3 bullets, one flip condition. Use supplied numbers as ground truth.`;

    const res = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "grok-4.5",
        max_tokens: 320,
        messages: [
          { role: "system", content: system },
          { role: "user", content: `Kind: ${data.kind}\n\n${data.prompt}` },
        ],
      }),
    });
    if (!res.ok) return { ok: false as const, error: `Desk error ${res.status}` };
    const body = (await res.json()) as { choices: { message: { content: string } }[] };
    return { ok: true as const, text: body.choices[0]?.message.content ?? "" };
  });

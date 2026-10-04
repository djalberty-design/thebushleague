import { useState } from "react";
import { Button } from "@/components/ui/button";
import { analyzeDecision, type AnalyzeKind } from "@/lib/server/analyze";

export function OsBrief({ kind, prompt }: { kind: AnalyzeKind; prompt: string }) {
  const [text, setText] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function run() {
    setBusy(true);
    setError(null);
    const res = await analyzeDecision({ data: { kind, prompt } });
    setBusy(false);
    if (!res.ok) setError(res.error);
    else setText(res.text);
  }

  return (
    <div className="rounded-lg border border-border bg-bg px-4 py-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs tracking-widest text-subtle uppercase">OS brief</p>
        <Button size="sm" variant="outline" onClick={() => void run()} disabled={busy}>
          {busy ? "Writing…" : text ? "Rewrite" : "Ask Grok"}
        </Button>
      </div>
      {error && <p className="mt-2 text-sm text-sit">{error}</p>}
      {text && <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-muted">{text}</p>}
    </div>
  );
}

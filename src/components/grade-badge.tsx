import { Badge } from "@/components/ui/badge";
import type { ConfidenceLabel, KeepLabel } from "@/lib/fantasy/types";
import { cn } from "@/lib/utils";

export function KeepBadge({ label, className }: { label: KeepLabel; className?: string }) {
  const tone = label === "Lock" || label === "Strong" ? "start" : label === "Situational" ? "warn" : label === "Fringe" ? "muted" : "sit";
  return (
    <Badge tone={tone} className={cn("min-w-8 justify-center font-mono tabular", className)}>
      {label}
    </Badge>
  );
}

export function ConfidenceBadge({ label, className }: { label: ConfidenceLabel; className?: string }) {
  const tone = label === "High" ? "start" : label === "Med" ? "warn" : "muted";
  return (
    <Badge tone={tone} className={cn("justify-center font-mono tabular", className)}>
      {label}
    </Badge>
  );
}

export function PosMark({ pos }: { pos: string }) {
  return (
    <span className="inline-flex w-8 justify-center font-mono text-[10px] font-medium tracking-wider text-muted">
      {pos}
    </span>
  );
}

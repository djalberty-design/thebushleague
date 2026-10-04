import type { ComponentProps } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium tracking-wide",
  {
    variants: {
      tone: {
        muted: "bg-bg-subtle text-muted",
        paper: "bg-paper/10 text-paper",
        start: "bg-start/15 text-start",
        warn: "bg-warn/15 text-warn",
        sit: "bg-sit/15 text-sit",
        accent: "bg-accent/15 text-accent",
      },
    },
    defaultVariants: { tone: "muted" },
  },
);

export function Badge({
  className,
  tone,
  ...props
}: ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ tone, className }))} {...props} />;
}

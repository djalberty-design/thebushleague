import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "h-10 w-full rounded-md border border-border bg-bg px-3 text-sm text-fg placeholder:text-subtle outline-none transition-colors duration-150 focus:border-border-strong focus:ring-2 focus:ring-ring/40",
        className,
      )}
      {...props}
    />
  );
}

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        "min-h-24 w-full rounded-md border border-border bg-bg px-3 py-2 text-sm text-fg placeholder:text-subtle outline-none focus:border-border-strong focus:ring-2 focus:ring-ring/40",
        className,
      )}
      {...props}
    />
  );
}

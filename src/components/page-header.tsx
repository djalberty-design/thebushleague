import type { ReactNode } from "react";

export function PageHeader({
  kicker,
  title,
  desc,
  actions,
}: {
  kicker?: string;
  title: string;
  desc?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        {kicker && (
          <p className="mb-2 text-[11px] font-medium tracking-[0.2em] text-muted uppercase">{kicker}</p>
        )}
        <h1 className="font-display text-4xl tracking-tight text-fg md:text-5xl">{title}</h1>
        {desc && <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">{desc}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

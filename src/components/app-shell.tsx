import { useEffect, useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Bookmark,
  ListOrdered,
  Swords,
  UserRoundPlus,
  ArrowLeftRight,
  Cable,
  ScrollText,
  MoreHorizontal,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useBush } from "@/lib/store";
import { cn } from "@/lib/utils";

type Path = "/" | "/keepers" | "/draft" | "/lineup" | "/waivers" | "/trades" | "/rules" | "/setup" | "/grade";

const PRIMARY: { to: Path; label: string; icon: typeof LayoutDashboard }[] = [
  { to: "/", label: "Command", icon: LayoutDashboard },
  { to: "/lineup", label: "Lineup", icon: Swords },
  { to: "/waivers", label: "Waivers", icon: UserRoundPlus },
  { to: "/trades", label: "Trades", icon: ArrowLeftRight },
];

const MORE: { to: Path; label: string; icon: typeof LayoutDashboard }[] = [
  { to: "/keepers", label: "Keepers", icon: Bookmark },
  { to: "/draft", label: "Draft", icon: ListOrdered },
  { to: "/rules", label: "Rules", icon: ScrollText },
  { to: "/grade", label: "Brain", icon: ScrollText },
  { to: "/setup", label: "Setup", icon: Cable },
];

function NavLink({
  to,
  label,
  icon: Icon,
  collapsed,
}: {
  to: Path;
  label: string;
  icon: typeof LayoutDashboard;
  collapsed?: boolean;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const active = pathname === to;
  const inner = (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors duration-150",
        collapsed && "justify-center px-0",
        active ? "bg-bg-subtle text-fg" : "text-muted hover:bg-bg-subtle hover:text-fg",
      )}
    >
      <Icon className="size-4 shrink-0" />
      {!collapsed && <span>{label}</span>}
    </Link>
  );
  if (!collapsed) return inner;
  return (
    <Tooltip>
      <TooltipTrigger asChild>{inner}</TooltipTrigger>
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  );
}

function LeagueSwitch({ className }: { className?: string }) {
  const library = useBush((s) => s.library);
  const activeId = useBush((s) => s.activeId);
  const switchLeague = useBush((s) => s.switchLeague);
  const league = useBush((s) => s.league);
  if (!library.length) return null;
  return (
    <label className={cn("block", className)}>
      <span className="mb-1 block px-1 text-[10px] tracking-[0.16em] text-subtle uppercase">League</span>
      <select
        aria-label="Active league"
        className="h-11 w-full rounded-md border border-border bg-bg px-2 text-sm text-fg"
        value={library.some((s) => s.id === activeId) ? activeId : league.espnLeagueId}
        onChange={(e) => switchLeague(e.target.value)}
      >
        {library.map((slot) => {
          const you = slot.league.teams.find((t) => t.id === slot.myTeamId);
          return (
            <option key={slot.id} value={slot.id}>
              {you?.name ?? "Club"} · {slot.league.name}
            </option>
          );
        })}
      </select>
    </label>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  useEffect(() => {
    void useBush.persist.rehydrate();
    useBush.getState().setHydrated(true);
  }, []);

  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [moreOpen, setMoreOpen] = useState(false);

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex min-h-dvh bg-bg text-fg">
        <aside className="sticky top-0 hidden h-dvh w-56 shrink-0 flex-col border-r border-border px-3 py-5 md:flex">
          <Link to="/" className="px-3">
            <div className="font-display text-2xl font-semibold tracking-wide">BUSH LEAGUE</div>
            <div className="text-xs tracking-[0.22em] text-accent uppercase">OS</div>
          </Link>
          <LeagueSwitch className="mt-3 mb-6 px-0" />
          <nav className="flex flex-1 flex-col gap-1">
            {PRIMARY.map((item) => (
              <NavLink key={item.to} {...item} />
            ))}
            <div className="my-3 h-px bg-border" />
            {MORE.map((item) => (
              <NavLink key={item.to} {...item} />
            ))}
          </nav>
          <p className="px-3 text-xs leading-relaxed text-subtle">Lineup · wire · trades. Same scoring.</p>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 border-b border-border bg-bg/90 px-4 py-3 backdrop-blur-sm md:hidden">
            <div className="flex items-center justify-between">
              <Link to="/" className="font-display text-xl font-semibold tracking-wide">
                BUSH LEAGUE OS
              </Link>
              <span className="text-xs tracking-widest text-muted uppercase">
                {pathname === "/" ? "Command" : pathname.slice(1)}
              </span>
            </div>
            <LeagueSwitch className="mt-2" />
          </header>
          <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 pb-24 md:px-8 md:pb-10">{children}</main>
        </div>

        <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-border bg-bg/95 px-1 py-1 backdrop-blur-sm md:hidden">
          {PRIMARY.map((item) => {
            const active = pathname === item.to;
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex min-h-12 flex-col items-center justify-center gap-0.5 text-[10px] tracking-wide",
                  active ? "text-fg" : "text-muted",
                )}
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
          <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                className={cn(
                  "flex min-h-12 flex-col items-center justify-center gap-0.5 text-[10px] tracking-wide",
                  MORE.some((m) => m.to === pathname) ? "text-fg" : "text-muted",
                )}
              >
                <MoreHorizontal className="size-4" />
                More
              </button>
            </SheetTrigger>
            <SheetContent side="bottom" title="Desk">
              <div className="mt-4 grid gap-1 pb-6">
                {MORE.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setMoreOpen(false)}
                      className="flex min-h-12 items-center gap-3 rounded-md px-3 text-sm hover:bg-bg-subtle"
                    >
                      <Icon className="size-4 text-muted" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </SheetContent>
          </Sheet>
        </nav>
      </div>
    </TooltipProvider>
  );
}

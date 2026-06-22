import { Link, useRouterState } from "@tanstack/react-router";
import { Home, ListChecks, Users, CalendarRange, User, Plus } from "lucide-react";
import type { ReactNode } from "react";

const tabs = [
  { to: "/", label: "Home", icon: Home },
  { to: "/aktivitas", label: "Aktivitas", icon: ListChecks },
  { to: "/kontak", label: "Kontak", icon: Users },
  { to: "/program", label: "Program", icon: CalendarRange },
  { to: "/profile", label: "Profil", icon: User },
] as const;

export function MobileShell({ children, hideNav = false }: { children: ReactNode; hideNav?: boolean }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="mobile-shell relative">
      <div className={`flex flex-1 flex-col ${hideNav ? "" : "pb-24"}`}>{children}</div>
      {!hideNav && (
        <>
          <nav className="fixed bottom-0 left-1/2 z-40 w-full max-w-[440px] -translate-x-1/2 border-t border-border bg-card/95 backdrop-blur">
            <ul className="grid grid-cols-5 px-2 pb-3 pt-2">
              {tabs.map((t) => {
                const Icon = t.icon;
                const active = t.to === "/" ? pathname === "/" : pathname.startsWith(t.to);
                return (
                  <li key={t.to} className="flex justify-center">
                    <Link
                      to={t.to}
                      className={`flex w-full flex-col items-center gap-1 rounded-xl py-1.5 text-[10px] font-medium transition-colors ${
                        active ? "text-brand" : "text-muted-foreground"
                      }`}
                    >
                      <Icon className="h-5 w-5" strokeWidth={active ? 2.4 : 1.8} />
                      <span>{t.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          <Link
            to="/aktivitas/buat"
            className="fixed bottom-12 left-1/2 z-50 flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full text-accent-foreground shadow-lg shadow-amber-500/40 ring-4 ring-card transition-transform active:scale-95"
            style={{ background: "var(--gradient-accent)" }}
            aria-label="Buat aktivitas"
          >
            <Plus className="h-7 w-7" strokeWidth={2.6} />
          </Link>
        </>
      )}
    </div>
  );
}

export function ScreenHeader({
  title,
  subtitle,
  right,
  back,
}: {
  title: string;
  subtitle?: string;
  right?: ReactNode;
  back?: string;
}) {
  return (
    <header
      className="px-5 pb-6 pt-12 text-brand-foreground"
      style={{ background: "var(--gradient-brand)" }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          {back && (
            <Link to={back} className="-ml-2 rounded-full p-2 text-brand-foreground/80 hover:bg-white/10">
              ←
            </Link>
          )}
          <div>
            <h1 className="text-xl font-semibold leading-tight">{title}</h1>
            {subtitle && <p className="mt-0.5 text-sm text-brand-foreground/70">{subtitle}</p>}
          </div>
        </div>
        {right}
      </div>
    </header>
  );
}

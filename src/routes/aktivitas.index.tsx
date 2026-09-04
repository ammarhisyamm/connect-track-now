import { createFileRoute, Link } from "@tanstack/react-router";
import { MobileShell, ScreenHeader } from "@/components/mobile-shell";
import { activities, MODE_META } from "@/lib/mock-data";
import { useState } from "react";
import { Clock, MapPin, ChevronRight, Filter, Globe, Footprints } from "lucide-react";

export const Route = createFileRoute("/aktivitas/")({
  head: () => ({ meta: [{ title: "Aktivitas" }] }),
  component: ActivityList,
});

const TABS = ["Semua", "Hari Ini", "Riwayat"] as const;

function ActivityList() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Semua");

  const filtered = activities.filter((a) => {
    if (tab === "Hari Ini") return new Date(a.date).toDateString() === new Date().toDateString();
    if (tab === "Riwayat") return a.status === "completed";
    return true;
  });

  return (
    <MobileShell>
      <ScreenHeader
        title="Aktivitas"
        subtitle="Semua aktivitas & riwayatmu"
        right={
          <button className="rounded-full bg-white/10 p-2 text-brand-foreground">
            <Filter className="h-4 w-4" />
          </button>
        }
      />
      <div className="-mt-3 px-5">
        <div className="soft-card flex gap-1 p-1">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 rounded-xl px-3 py-2 text-xs font-semibold transition-colors ${
                tab === t ? "bg-brand text-brand-foreground" : "text-muted-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="mt-5 space-y-3">
          {filtered.map((a) => (
            <Link
              key={a.id}
              to="/aktivitas/$id"
              params={{ id: a.id }}
              className="soft-card flex gap-3 p-4"
            >
              <div className="flex w-12 flex-shrink-0 flex-col items-center justify-center rounded-xl bg-secondary py-2 text-brand">
                <span className="text-[10px] font-semibold uppercase">
                  {new Date(a.date).toLocaleDateString("id-ID", { month: "short" })}
                </span>
                <span className="text-lg font-bold leading-none">
                  {new Date(a.date).getDate()}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="rounded-md bg-brand/10 px-1.5 py-0.5 text-[10px] font-semibold text-brand">
                    {a.type}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${
                      a.mode === "online" ? "bg-brand/10 text-brand" : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    {a.mode === "online" ? <Globe className="h-3 w-3" /> : <Footprints className="h-3 w-3" />}
                    {MODE_META[a.mode].label}
                  </span>
                  <span className="text-[10px] text-muted-foreground">{a.mode === "lapangan" ? a.ptm : "Link aktif"}</span>
                </div>
                <p className="mt-1 truncate text-sm font-semibold">{a.locationName}</p>
                <div className="mt-1 flex items-center gap-3 text-[11px] text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {a.timeRange}
                  </span>
                  <span className="inline-flex items-center gap-1 truncate">
                    <MapPin className="h-3 w-3 flex-shrink-0" />
                    {a.address.split(",")[0]}
                  </span>
                </div>
                {a.status === "completed" && (
                  <div className="mt-2 flex gap-3 text-[11px]">
                    <span className="font-medium text-success">✓ {a.leadsCount} Leads</span>
                    <span className="font-medium text-accent-foreground">★ {a.closingCount} Closing</span>
                  </div>
                )}
              </div>
              <ChevronRight className="h-4 w-4 self-center text-muted-foreground" />
            </Link>
          ))}
          {filtered.length === 0 && (
            <div className="soft-card p-8 text-center text-sm text-muted-foreground">
              Belum ada aktivitas.
            </div>
          )}
        </div>
      </div>
    </MobileShell>
  );
}

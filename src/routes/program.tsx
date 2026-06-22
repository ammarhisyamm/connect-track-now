import { createFileRoute } from "@tanstack/react-router";
import { MobileShell, ScreenHeader } from "@/components/mobile-shell";
import { programs } from "@/lib/mock-data";
import { Award, MapPin, Calendar, Target } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/program")({
  head: () => ({ meta: [{ title: "Program" }] }),
  component: ProgramPage,
});

const TABS = ["Semua", "Berlangsung", "Segera", "Berakhir"] as const;

function ProgramPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Semua");
  const list = tab === "Semua" ? programs : programs.filter((p) => p.status === tab);

  return (
    <MobileShell>
      <ScreenHeader title="Program" subtitle="Event & program yang sedang berjalan" />
      <div className="-mt-3 px-5">
        <div className="soft-card flex gap-1 overflow-x-auto p-1">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 whitespace-nowrap rounded-xl px-3 py-2 text-xs font-semibold transition-colors ${
                tab === t ? "bg-brand text-brand-foreground" : "text-muted-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="mt-5 space-y-3">
          {list.map((p) => {
            const pct = Math.min(100, Math.round((p.currentLeads / p.targetLeads) * 100));
            return (
              <div key={p.id} className="soft-card overflow-hidden">
                <div className="h-1.5 w-full bg-secondary">
                  <div
                    className={`h-full ${
                      p.status === "Berlangsung" ? "bg-[var(--gradient-accent)]" : p.status === "Segera" ? "bg-brand" : "bg-muted-foreground"
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <StatusChip status={p.status} />
                      <h3 className="mt-1.5 text-base font-bold">{p.name}</h3>
                      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(p.date).toLocaleDateString("id-ID", { day: "numeric", month: "short" })} —{" "}
                          {new Date(p.endDate).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {p.location}
                        </span>
                      </div>
                    </div>
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-accent/30 text-accent-foreground">
                      <Award className="h-6 w-6" />
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2 text-center">
                    <div className="rounded-xl bg-secondary/60 p-2">
                      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Leads</p>
                      <p className="mt-0.5 text-sm font-bold">
                        {p.currentLeads}
                        <span className="text-xs font-medium text-muted-foreground"> / {p.targetLeads}</span>
                      </p>
                    </div>
                    <div className="rounded-xl bg-secondary/60 p-2">
                      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Closing</p>
                      <p className="mt-0.5 text-sm font-bold">
                        {p.currentClosing}
                        <span className="text-xs font-medium text-muted-foreground"> / {p.targetClosing}</span>
                      </p>
                    </div>
                  </div>

                  {p.status === "Berlangsung" && (
                    <button className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand py-2.5 text-xs font-semibold text-brand-foreground">
                      <Target className="h-3.5 w-3.5" /> Generate Kupon
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </MobileShell>
  );
}

function StatusChip({ status }: { status: string }) {
  const map: Record<string, string> = {
    Berlangsung: "bg-success/15 text-success",
    Segera: "bg-brand/10 text-brand",
    Berakhir: "bg-secondary text-muted-foreground",
  };
  return <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${map[status]}`}>{status}</span>;
}

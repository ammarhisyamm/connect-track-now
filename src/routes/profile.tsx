import { createFileRoute, Link } from "@tanstack/react-router";
import { MobileShell, ScreenHeader } from "@/components/mobile-shell";
import { profile, leadsByStatus } from "@/lib/mock-data";
import { Award, TrendingUp, Settings, LogOut, ChevronRight, FileSpreadsheet } from "lucide-react";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profil" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const total = leadsByStatus.reduce((s, l) => s + l.value, 0);
  const gradeBadgeColor: Record<string, string> = {
    Trainee: "from-slate-300 to-slate-400",
    Silver: "from-slate-200 to-slate-400",
    Gold: "from-amber-300 to-yellow-500",
    Platinum: "from-indigo-300 to-purple-400",
  };

  return (
    <MobileShell>
      <ScreenHeader title="Profil" subtitle={profile.nip} />
      <div className="-mt-3 space-y-5 px-5">
        {/* Profile card */}
        <div className="soft-card flex items-center gap-4 p-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand text-lg font-bold text-brand-foreground">
            {profile.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
          </div>
          <div className="flex-1">
            <p className="text-base font-bold">{profile.name}</p>
            <p className="text-xs text-muted-foreground">{profile.branch}</p>
            <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-300 to-yellow-500 px-2.5 py-0.5 text-[11px] font-bold text-amber-900">
              <Award className="h-3 w-3" /> {profile.grade}
            </div>
          </div>
        </div>

        {/* Grading */}
        <section className="soft-card p-4">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Grading</p>
              <p className="text-sm font-bold">Periode Triwulan</p>
            </div>
            <FileSpreadsheet className="h-5 w-5 text-muted-foreground" />
          </div>

          <div className="space-y-2.5">
            {(["Trainee", "Silver", "Gold", "Platinum"] as const).map((g) => {
              const active = g === profile.grade;
              return (
                <div key={g} className="flex items-center gap-3">
                  <div className={`h-8 w-8 rounded-full bg-gradient-to-br ${gradeBadgeColor[g]} ${active ? "ring-2 ring-brand" : "opacity-50"}`} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className={`text-xs font-semibold ${active ? "text-foreground" : "text-muted-foreground"}`}>{g}</p>
                      {active && <p className="text-[11px] font-semibold text-brand">{profile.gradeProgress}%</p>}
                    </div>
                    {active && (
                      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-secondary">
                        <div className="h-full bg-[var(--gradient-accent)]" style={{ width: `${profile.gradeProgress}%` }} />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <p className="mt-3 text-[11px] text-muted-foreground">
            Grading dievaluasi setiap 3 bulan. Data uploadable oleh tim bisnis.
          </p>
        </section>

        {/* Kuadran */}
        <section className="soft-card p-4">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Predikat (Kuadran)</p>
              <p className="text-sm font-bold">Activity vs Leads</p>
            </div>
            <span className="rounded-full bg-success/15 px-2.5 py-1 text-[11px] font-bold text-success">
              Kuadran {profile.quadrant}
            </span>
          </div>

          <div className="relative mx-auto aspect-square w-full max-w-[240px] rounded-lg border border-border bg-secondary/30">
            <div className="absolute left-1/2 top-0 h-full w-px bg-border" />
            <div className="absolute left-0 top-1/2 h-px w-full bg-border" />
            {[
              { q: "II", pos: "left-1.5 top-1.5", val: 38 },
              { q: "IV", pos: "right-1.5 top-1.5", val: 42, active: true },
              { q: "I", pos: "left-1.5 bottom-1.5", val: 77 },
              { q: "III", pos: "right-1.5 bottom-1.5", val: 33 },
            ].map((c) => (
              <div
                key={c.q}
                className={`absolute ${c.pos} rounded-md px-2 py-1 text-center text-[10px] font-bold ${
                  c.active ? "bg-brand text-brand-foreground" : "bg-card text-muted-foreground"
                }`}
              >
                <div>{c.q}</div>
                <div className="text-sm">{c.val}</div>
              </div>
            ))}
            {/* Sample scatter dots */}
            {[
              [25, 65], [40, 30], [70, 25], [80, 40], [55, 50], [60, 20], [30, 75], [85, 15], [45, 60], [72, 45],
            ].map(([x, y], i) => (
              <span
                key={i}
                className="absolute h-1.5 w-1.5 rounded-full bg-brand/70"
                style={{ left: `${x}%`, top: `${y}%` }}
              />
            ))}
            <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] text-muted-foreground">Activity →</div>
            <div className="absolute -left-2 top-1/2 -translate-x-full -translate-y-1/2 text-[10px] text-muted-foreground">Leads ↑</div>
          </div>
        </section>

        {/* Leads breakdown */}
        <section className="soft-card p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-bold">Leads Berdasarkan Status</p>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex h-2.5 w-full overflow-hidden rounded-full">
            {leadsByStatus.map((l) => (
              <div key={l.label} style={{ width: `${(l.value / total) * 100}%`, background: l.color }} title={l.label} />
            ))}
          </div>
          <div className="mt-3 space-y-1.5">
            {leadsByStatus.map((l) => (
              <div key={l.label} className="flex items-center gap-2 text-[11px]">
                <span className="h-2 w-2 rounded-full" style={{ background: l.color }} />
                <span className="flex-1 truncate text-muted-foreground">{l.label}</span>
                <span className="font-semibold">{l.value}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Settings */}
        <section className="soft-card divide-y divide-border">
          <button className="flex w-full items-center gap-3 p-4 text-left">
            <Settings className="h-4 w-4 text-muted-foreground" />
            <span className="flex-1 text-sm">Pengaturan</span>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </button>
          <Link to="/login" className="flex w-full items-center gap-3 p-4 text-left text-destructive">
            <LogOut className="h-4 w-4" />
            <span className="flex-1 text-sm font-semibold">Keluar</span>
          </Link>
        </section>
      </div>
    </MobileShell>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { MobileShell } from "@/components/mobile-shell";
import { activities, profile, targets, formatRupiah, programs, MODE_META } from "@/lib/mock-data";
import { Bell, Wallet, Sparkles, MapPin, Clock, LogIn, LogOut, ChevronRight, TrendingUp, Award, Globe, Footprints } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "Beranda — Sales Tracking" }] }),
  component: Home,
});

function Home() {
  const [range, setRange] = useState<"today" | "week" | "month">("today");
  const todayActivities = activities.filter((a) => new Date(a.date).toDateString() === new Date().toDateString());
  const ongoingProgram = programs.find((p) => p.status === "Berlangsung");

  return (
    <MobileShell>
      {/* Header */}
      <header className="px-5 pb-24 pt-12 text-brand-foreground" style={{ background: "var(--gradient-brand)" }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-base font-semibold ring-2 ring-white/20">
              {profile.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
            </div>
            <div>
              <p className="text-xs text-brand-foreground/70">Selamat datang,</p>
              <p className="text-sm font-semibold">{profile.name}</p>
            </div>
          </div>
          <Link to="/profile" className="relative rounded-full bg-white/10 p-2">
            <Bell className="h-5 w-5" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-accent" />
          </Link>
        </div>
      </header>

      <div className="-mt-20 space-y-5 px-5">
        {/* Booking card */}
        <div className="soft-card grid grid-cols-2 divide-x divide-border p-4">
          <div className="pr-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Wallet className="h-3.5 w-3.5" /> Booking
            </div>
            <p className="mt-1 text-base font-bold text-foreground">
              {formatRupiah(profile.booking)}
              <span className="text-xs font-medium text-muted-foreground"> / {formatRupiah(profile.bookingEstimate)}</span>
            </p>
            <p className="mt-0.5 text-[10px] text-muted-foreground">Estimasi saldo</p>
          </div>
          <div className="pl-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5" /> Estimasi Insentif
            </div>
            <p className="mt-1 text-base font-bold text-foreground">{formatRupiah(profile.estimasiInsentif)}</p>
            <p className="mt-0.5 text-[10px] text-muted-foreground">Periode berjalan</p>
          </div>
        </div>

        {/* Check in/out */}
        <CheckInCard />

        {/* Targets */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold">Target Leads & Closing Leads</h2>
          </div>
          <div className="mb-3 inline-flex rounded-full bg-secondary p-1 text-xs">
            {(["today", "week", "month"] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`rounded-full px-3 py-1.5 font-medium transition-colors ${
                  range === r ? "bg-brand text-brand-foreground" : "text-muted-foreground"
                }`}
              >
                {r === "today" ? "Hari Ini" : r === "week" ? "Minggu Ini" : "Bulan Ini"}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <TargetCard label="Leads" current={targets.leads[range].current} target={targets.leads[range].target} tone="brand" />
            <TargetCard
              label="Closing Leads"
              current={targets.closingLeads[range].current}
              target={targets.closingLeads[range].target}
              tone="accent"
            />
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">
            Target diatur oleh tim bisnis untuk setiap sales.
          </p>
        </section>

        {/* Program berlangsung */}
        {ongoingProgram && (
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold">Program Berlangsung</h2>
              <Link to="/program" className="text-xs font-medium text-brand">Lihat semua</Link>
            </div>
            <Link to="/program" className="soft-card flex items-start gap-3 p-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-accent/30 text-accent-foreground">
                <Award className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <p className="text-[11px] font-medium text-warning-foreground">{new Date(ongoingProgram.date).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long" })}</p>
                <p className="text-sm font-semibold">{ongoingProgram.name}</p>
                <div className="mt-1.5 flex items-center gap-3 text-[11px] text-muted-foreground">
                  <span>🎯 {ongoingProgram.currentLeads}/{ongoingProgram.targetLeads} Leads</span>
                  <span>📍 {ongoingProgram.location}</span>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          </section>
        )}

        {/* Today's activities */}
        <section className="pb-6">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold">Aktivitas Hari Ini</h2>
            <Link to="/aktivitas" className="text-xs font-medium text-brand">Lihat semua</Link>
          </div>
          <div className="space-y-2.5">
            {todayActivities.length === 0 && (
              <div className="soft-card p-6 text-center text-sm text-muted-foreground">
                Belum ada aktivitas hari ini
              </div>
            )}
            {todayActivities.map((a) => (
              <Link
                key={a.id}
                to="/aktivitas/$id"
                params={{ id: a.id }}
                className="soft-card flex items-center gap-3 p-3.5"
              >
                <StatusPill status={a.status} />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="rounded-md bg-secondary px-1.5 py-0.5 text-[10px] font-semibold text-brand">{a.type}</span>
                    <span className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${a.mode === "online" ? "bg-brand/10 text-brand" : "bg-secondary text-muted-foreground"}`}>
                      {a.mode === "online" ? <Globe className="h-3 w-3" /> : <Footprints className="h-3 w-3" />}
                      {MODE_META[a.mode].label}
                    </span>
                    <span className="text-[10px] text-muted-foreground">{a.mode === "lapangan" ? a.ptm : "Link"}</span>
                  </div>
                  <p className="mt-1 truncate text-sm font-semibold">{a.locationName}</p>
                  <div className="mt-0.5 flex items-center gap-3 text-[11px] text-muted-foreground">
                    <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" />{a.timeRange}</span>
                    <span className="inline-flex items-center gap-1 truncate"><MapPin className="h-3 w-3 flex-shrink-0" />{a.address.split(",")[0]}</span>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            ))}
          </div>
        </section>
      </div>
    </MobileShell>
  );
}

function TargetCard({ label, current, target, tone }: { label: string; current: number; target: number; tone: "brand" | "accent" }) {
  const pct = Math.min(100, Math.round((current / target) * 100));
  return (
    <div className="soft-card p-4">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <TrendingUp className="h-3.5 w-3.5" /> {label}
      </div>
      <p className="mt-1.5 text-2xl font-bold text-foreground">
        {current}
        <span className="text-sm font-medium text-muted-foreground"> / {target}</span>
      </p>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-secondary">
        <div
          className={`h-full rounded-full ${tone === "brand" ? "bg-brand" : "bg-[var(--gradient-accent)]"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="mt-1 text-[10px] text-muted-foreground">{pct}% tercapai</p>
    </div>
  );
}

function CheckInCard() {
  const [checkedIn, setCheckedIn] = useState(false);
  return (
    <div className="soft-card flex items-center justify-between p-4">
      <div>
        <p className="text-xs text-muted-foreground">Status absensi</p>
        <p className="text-sm font-semibold">
          {checkedIn ? "Sudah Check-in 08:12" : "Belum check-in"}
        </p>
        <p className="text-[11px] text-muted-foreground">📍 Lokasi: Denpasar</p>
      </div>
      <button
        onClick={() => setCheckedIn(!checkedIn)}
        className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
          checkedIn ? "bg-destructive text-destructive-foreground" : "bg-brand text-brand-foreground"
        }`}
      >
        {checkedIn ? <><LogOut className="h-3.5 w-3.5" /> Check Out</> : <><LogIn className="h-3.5 w-3.5" /> Check In</>}
      </button>
    </div>
  );
}

function StatusPill({ status }: { status: "planned" | "checked_in" | "completed" }) {
  const map = {
    planned: { bg: "bg-secondary", text: "text-brand", label: "Plan" },
    checked_in: { bg: "bg-warning/20", text: "text-warning-foreground", label: "Live" },
    completed: { bg: "bg-success/15", text: "text-success", label: "Done" },
  } as const;
  const s = map[status];
  return (
    <div className={`flex h-12 w-12 flex-shrink-0 flex-col items-center justify-center rounded-xl ${s.bg} ${s.text}`}>
      <span className="text-[10px] font-bold uppercase">{s.label}</span>
    </div>
  );
}

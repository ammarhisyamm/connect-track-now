import { createFileRoute, Link } from "@tanstack/react-router";
import { MobileShell } from "@/components/mobile-shell";
import {
  activities,
  formatJadwal,
  monthOptions,
  parseMonthOption,
  STATUS_META,
  getShareLink,
  type ActivityStatus,
} from "@/lib/mock-data";
import { useMemo, useState } from "react";
import {
  ChevronRight,
  CircleCheck,
  Crosshair,
  Link2,
  Check,
  LogOut,
  MapPin,
  Plus,
} from "lucide-react";

export const Route = createFileRoute("/aktivitas/")({
  head: () => ({ meta: [{ title: "Aktivitas" }] }),
  component: ActivityList,
});

const TABS = ["Semua", "Hari Ini", "Riwayat"] as const;
const MONTHS = monthOptions(2026);

function ActivityList() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Semua");
  const [dari, setDari] = useState(MONTHS[0]);
  const [ke, setKe] = useState(MONTHS[MONTHS.length - 1]);
  const [statusById, setStatusById] = useState<Record<string, ActivityStatus>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const d = parseMonthOption(dari);
    const k = parseMonthOption(ke);
    const start = new Date(d.year, d.month, 1).getTime();
    const end = new Date(k.year, k.month + 1, 1).getTime();
    return activities.filter((a) => {
      const t = new Date(a.date).getTime();
      if (t < start || t >= end) return false;
      const status = statusById[a.id] ?? a.status;
      if (tab === "Hari Ini") return new Date(a.date).toDateString() === new Date().toDateString();
      if (tab === "Riwayat") return status === "completed";
      return true;
    });
  }, [tab, dari, ke, statusById]);

  const copyLink = async (id: string, shareCode?: string) => {
    const link = getShareLink({ id, shareCode } as { id: string; shareCode?: string });
    try {
      await navigator.clipboard.writeText(window.location.origin + link);
    } catch {
      /* abaikan */
    }
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <MobileShell hideFab>
      <div className="bg-white px-5 pb-2 pt-12">
        <h1 className="text-[22px] font-bold text-slate-900">Aktivitas</h1>
        <p className="mt-0.5 text-[13px] text-slate-500">Kelola dan pantau semua kegiatan lapanganmu</p>
      </div>

      <div className="space-y-4 bg-white px-5 pb-8">
        <div className="flex gap-2 pt-3">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-full border px-4 py-2 text-[13px] font-medium transition-colors ${
                tab === t
                  ? "border-[#2953A4] bg-[#2953A4] text-white"
                  : "border-slate-200 bg-white text-slate-500"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3 rounded-xl bg-[#2953A4]/10 p-3">
          <label className="block">
            <span className="mb-1 block text-[13px] text-slate-700">Dari Bulan</span>
            <span className="relative block">
              <select
                value={dari}
                onChange={(e) => setDari(e.target.value)}
                className="w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-[13px] text-slate-800 outline-none"
              >
                {MONTHS.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
              <ChevronRight className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 rotate-90 text-slate-400" />
            </span>
          </label>
          <label className="block">
            <span className="mb-1 block text-[13px] text-slate-700">Ke Bulan</span>
            <span className="relative block">
              <select
                value={ke}
                onChange={(e) => setKe(e.target.value)}
                className="w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-[13px] text-slate-800 outline-none"
              >
                {MONTHS.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
              <ChevronRight className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 rotate-90 text-slate-400" />
            </span>
          </label>
        </div>

        <div className="space-y-3">
          {filtered.map((a) => {
            const status = statusById[a.id] ?? a.status;
            const meta = STATUS_META[status];
            const isOnline = a.mode === "online";
            return (
              <div key={a.id} className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[12px] font-medium text-[#2953A4]">{formatJadwal(a)}</p>
                  <p className={`flex-shrink-0 text-[12px] font-medium ${meta.className}`}>{meta.label}</p>
                </div>
                <div className="my-2.5 border-t border-slate-100" />
                <Link
                  to="/aktivitas/$id"
                  params={{ id: a.id }}
                  className="flex items-center justify-between gap-2"
                >
                  <div className="min-w-0">
                    <p className="truncate text-[16px] font-bold text-slate-900">{a.locationName}</p>
                    <p className="mt-0.5 truncate text-[13px] text-slate-500">
                      {a.address}
                      {isOnline && <span className="ml-1.5 text-[11px] font-semibold text-[#2953A4]">· Online</span>}
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 flex-shrink-0 text-[#2953A4]" />
                </Link>
                <div className="mt-3 flex items-center justify-between gap-2 rounded-lg border border-slate-200 px-3 py-2.5">
                  <span className="inline-flex items-center gap-1.5 text-[13px] text-slate-500">
                    <Crosshair className="h-4 w-4 text-[#2953A4]" />
                    {a.leadsCount}/{a.leadsTarget} Leads
                  </span>
                  {status === "completed" ? (
                    <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-1.5 text-[12px] font-medium text-slate-500">
                      <CircleCheck className="h-3.5 w-3.5" /> Finished {a.checkOutTime ?? ""}
                    </span>
                  ) : isOnline ? (
                    <button
                      onClick={() => copyLink(a.id, a.shareCode)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-[#2953A4] px-3.5 py-2 text-[12px] font-semibold text-white"
                    >
                      {copiedId === a.id ? <Check className="h-3.5 w-3.5" /> : <Link2 className="h-3.5 w-3.5" />}
                      {copiedId === a.id ? "Tersalin" : "Bagikan Link"}
                    </button>
                  ) : status === "checked_in" ? (
                    <button
                      onClick={() => setStatusById((s) => ({ ...s, [a.id]: "completed" }))}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-red-500 px-3.5 py-2 text-[12px] font-semibold text-white"
                    >
                      <LogOut className="h-3.5 w-3.5" /> Check Out {a.checkInTime ?? ""}
                    </button>
                  ) : (
                    <button
                      onClick={() => setStatusById((s) => ({ ...s, [a.id]: "checked_in" }))}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-[#2953A4] px-4 py-2 text-[12px] font-semibold text-white"
                    >
                      <MapPin className="h-3.5 w-3.5" /> Check In
                    </button>
                  )}
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="rounded-xl border border-slate-200 p-8 text-center text-sm text-slate-400">
              Belum ada aktivitas.
            </div>
          )}
        </div>

        <div className="flex justify-center pt-1">
          <Link
            to="/aktivitas/buat"
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#2953A4] bg-white px-4 py-2 text-[14px] font-medium text-[#2953A4]"
          >
            <Plus className="h-4 w-4" /> Tambah Aktivitas
          </Link>
        </div>
      </div>
    </MobileShell>
  );
}

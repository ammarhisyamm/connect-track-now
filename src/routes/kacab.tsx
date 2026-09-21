import { createFileRoute } from "@tanstack/react-router";
import { MobileShell } from "@/components/mobile-shell";
import { useState } from "react";
import {
  Bell,
  ChevronDown,
  ClipboardCheck,
  Crosshair,
  MapPin,
  UserRound,
} from "lucide-react";

export const Route = createFileRoute("/kacab")({
  head: () => ({ meta: [{ title: "Home KACAB — Sales Tracking" }] }),
  component: KacabHome,
});

type Period = "today" | "week" | "month";

const KCP_DATA = [
  {
    name: "MAS MONANG-MANING",
    visit: { today: [0, 1], week: [3, 7], month: [7, 7] },
    waskat: { today: 0, week: 4, month: 10 },
    marketing: {
      kepala: { today: [0, 1], week: [3, 6], month: [24, 24] },
      ro: { today: [0, 5], week: [12, 30], month: [120, 120] },
      ovd: { today: [0, 5], week: [12, 30], month: [120, 120] },
      leads: { today: [0, 5], week: [18, 30], month: [120, 120] },
      closing: { today: [0, 1], week: [4, 6], month: [24, 24] },
    },
  },
  {
    name: "MAS RAWAMANGUN",
    visit: { today: [1, 2], week: [5, 8], month: [18, 24] },
    waskat: { today: 1, week: 6, month: 14 },
    marketing: {
      kepala: { today: [1, 1], week: [4, 6], month: [18, 24] },
      ro: { today: [3, 5], week: [18, 30], month: [96, 120] },
      ovd: { today: [2, 5], week: [14, 30], month: [88, 120] },
      leads: { today: [4, 5], week: [22, 30], month: [108, 120] },
      closing: { today: [1, 1], week: [5, 6], month: [19, 24] },
    },
  },
] as const;

function KacabHome() {
  const [selectedKcp, setSelectedKcp] = useState(0);
  const [period, setPeriod] = useState<Period>("today");
  const kcp = KCP_DATA[selectedKcp];

  return (
    <MobileShell role="kacab" hideFab>
      <header className="relative overflow-hidden px-5 pb-20 pt-12 text-white" style={{ background: "var(--gradient-brand)" }}>
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-white/25">
              <UserRound className="h-7 w-7 text-white" />
            </span>
            <div className="min-w-0">
              <p className="text-[13px] text-white/75">Selamat datang</p>
              <p className="truncate text-[17px] font-bold">KACAB (MAS MONANG-MANING)</p>
            </div>
          </div>
          <button className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-white text-[#2953A4]" aria-label="Notifikasi">
            <Bell className="h-5 w-5" />
          </button>
        </div>

        <div className="relative z-10 mt-4 grid grid-cols-2 divide-x divide-slate-200 rounded-xl bg-white p-4 text-slate-900">
          <SummaryMetric icon={<MapPin />} label="Visit" value={`${kcp.visit[period][0]}`} target={`/${kcp.visit[period][1]}`} />
          <SummaryMetric icon={<ClipboardCheck />} label="Waskat" value={`${kcp.waskat[period]}`} />
        </div>
        <svg className="absolute bottom-0 left-0 h-[70px] w-full" viewBox="0 0 440 70" preserveAspectRatio="none">
          <path d="M0,38 C110,72 230,72 440,14 L440,70 L0,70 Z" fill="#8fa3d9" opacity="0.5" />
          <path d="M0,48 C130,78 260,76 440,28 L440,70 L0,70 Z" fill="#c3d0f0" opacity="0.75" />
          <path d="M0,56 C140,82 280,80 440,40 L440,70 L0,70 Z" fill="#eef2fd" />
        </svg>
      </header>

      <main className="space-y-6 bg-white px-5 pb-8 pt-5">
        <section>
          <p className="text-[20px] font-bold text-slate-900">Monitoring Aktivitas</p>
          <label className="mt-4 block text-[14px] font-medium text-slate-700">Pilih KCP</label>
          <span className="relative mt-1.5 block">
            <select
              value={selectedKcp}
              onChange={(e) => setSelectedKcp(Number(e.target.value))}
              className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-[14px] font-medium text-slate-900 outline-none"
            >
              {KCP_DATA.map((item, index) => <option key={item.name} value={index}>{item.name}</option>)}
            </select>
            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          </span>
        </section>

        <section>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {([ ["today", "Hari ini"], ["week", "Minggu ini"], ["month", "Bulan ini"] ] as const).map(([value, label]) => (
              <button key={value} onClick={() => setPeriod(value)} className={`flex-shrink-0 rounded-full border px-4 py-2 text-[13px] font-medium ${period === value ? "border-[#2953A4] bg-[#2953A4] text-white" : "border-slate-200 bg-white text-slate-500"}`}>
                {label}
              </button>
            ))}
          </div>
          <div className="mt-3 rounded-xl border border-slate-200 bg-white p-3.5">
            <p className="mb-3 text-[16px] font-bold text-slate-900">Kepala KCP</p>
            <MetricRow label="Marketing" value={kcp.marketing.kepala[period]} />
            <p className="mb-3 mt-5 text-[16px] font-bold text-slate-900">Penaksir Kasir</p>
            <div className="grid grid-cols-2 gap-2.5">
              <MetricRow label="Follow Up RO" value={kcp.marketing.ro[period]} />
              <MetricRow label="Follow Up OVD" value={kcp.marketing.ovd[period]} />
            </div>
            <p className="mb-3 mt-5 text-[16px] font-bold text-slate-900">Sales Officer</p>
            <div className="grid grid-cols-2 gap-2.5">
              <MetricRow label="Leads" value={kcp.marketing.leads[period]} />
              <MetricRow label="Closing Leads" value={kcp.marketing.closing[period]} />
            </div>
          </div>
        </section>

        <section>
          <div className="mb-2.5 flex items-center justify-between">
            <h2 className="text-[17px] font-bold text-slate-900">Aktivitas Hari Ini</h2>
            <span className="text-[13px] font-medium text-slate-500">{kcp.name}</span>
          </div>
          <div className="rounded-xl border border-slate-200 p-4">
            <p className="text-[13px] font-semibold text-[#2953A4]">Sabtu, 10 Oktober 2026</p>
            <div className="my-3 border-t border-slate-100" />
            <p className="text-[16px] font-bold text-slate-900">Evaluasi Pencapaian Target Unit & Sales</p>
            <p className="mt-1 text-[13px] text-slate-500">Monitoring aktivitas marketing KCP</p>
            <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-[12px] font-medium text-amber-700">
              <Crosshair className="h-3.5 w-3.5" /> High priority
            </span>
          </div>
        </section>
      </main>
    </MobileShell>
  );
}

function SummaryMetric({ icon, label, value, target }: { icon: React.ReactNode; label: string; value: string; target?: string }) {
  return (
    <div className="flex items-center gap-2 px-1 first:pr-3 last:pl-3">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2953A4]/10 text-[#2953A4]">{icon}</span>
      <div>
        <p className="text-[13px] text-slate-500">{label}</p>
        <p className="mt-1 text-[18px] font-bold text-slate-900">{value}<span className="font-normal text-slate-400">{target}</span></p>
      </div>
    </div>
  );
}

function MetricRow({ label, value }: { label: string; value: readonly [number, number] }) {
  return (
    <div className="rounded-xl border border-slate-200 px-3 py-3">
      <p className="flex items-center gap-2 text-[14px] text-slate-700"><span className="h-3.5 w-3.5 rounded-full border-2 border-[#93a8c8]" />{label}</p>
      <p className="mt-2 text-[20px] font-bold text-slate-900">{value[0]}<span className="font-normal text-slate-400">/{value[1]}</span></p>
    </div>
  );
}

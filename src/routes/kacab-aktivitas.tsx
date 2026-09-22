import { createFileRoute } from "@tanstack/react-router";
import { MobileShell } from "@/components/mobile-shell";
import { useMemo, useState } from "react";
import { Building2, ChevronDown, Eye, MapPin, Plus } from "lucide-react";

export const Route = createFileRoute("/kacab-aktivitas")({
  head: () => ({ meta: [{ title: "Aktivitas KACAB" }] }),
  component: KacabActivities,
});

const TABS = ["Hari Ini", "Minggu Ini", "Bulan Ini", "Custom"] as const;
const ITEMS = [
  { kcp: "MAS MONANG-MANING", date: "2026-06-28", time: "15:00 - 16:00 WIB", title: "Evaluasi Pencapaian Target Unit & Sales", place: "Balai Desa Kelurahan Pilumpanua", region: "Wajo, Sulawesi Selatan", priority: "High" },
  { kcp: "MAS RAWAMANGUN", date: "2026-06-06", time: "09:00 - 10:00 WIB", title: "Visit Nasabah One Obligor", place: "KCP Rawamangun", region: "Jakarta Timur, DKI Jakarta", priority: "Medium" },
];

function KacabActivities() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Custom");
  const [from, setFrom] = useState("2026-01-01");
  const [to, setTo] = useState("2026-12-31");
  const visible = useMemo(() => {
    if (tab !== "Custom") return ITEMS;
    return ITEMS.filter((item) => item.date >= from && item.date <= to);
  }, [tab, from, to]);
  const groups = [...new Set(visible.map((item) => item.kcp))].map((kcp) => ({ kcp, items: visible.filter((item) => item.kcp === kcp) }));

  return (
    <MobileShell role="kacab" hideFab>
      <header className="bg-white px-5 pb-5 pt-12">
        <h1 className="text-[22px] font-bold text-slate-900">Aktivitas</h1>
        <p className="mt-0.5 text-[15px] text-slate-500">Kelola dan pantau semua kegiatan lapanganmu</p>
      </header>
      <main className="space-y-4 bg-white px-5 pb-8">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {TABS.map((item) => <button key={item} onClick={() => setTab(item)} className={`flex-shrink-0 rounded-full border px-4 py-2.5 text-[14px] font-medium ${tab === item ? "border-[#2953A4] bg-[#2953A4] text-white" : "border-slate-200 bg-white text-slate-500"}`}>{item}</button>)}
        </div>
        {tab === "Custom" && <div className="grid grid-cols-2 gap-3 rounded-2xl border border-[#dce6f3] bg-[#f1f6fc] p-3"><DateField label="Dari Tanggal" value={from} onChange={setFrom} /><DateField label="Ke Tanggal" value={to} onChange={setTo} /></div>}
        <div className="space-y-4">
          {groups.map((group) => <section key={group.kcp} className="overflow-hidden rounded-2xl bg-[#eef5ff]"><h2 className="flex items-center gap-2 px-4 py-3 text-[16px] font-bold text-[#2953A4]"><Building2 className="h-5 w-5" />{group.kcp}</h2><div className="space-y-3 px-1 pb-1">{group.items.map((item) => <article key={`${item.kcp}-${item.date}`} className="rounded-xl border border-slate-200 bg-white p-4"><div className="flex items-start justify-between gap-3"><p className="text-[14px] font-bold text-[#2953A4]">{formatDate(item.date)} | {item.time}</p><span className={`flex-shrink-0 text-[14px] font-semibold ${item.priority === "High" ? "text-red-500" : "text-amber-600"}`}>{item.priority}</span></div><div className="my-3 border-t border-slate-100" /><h3 className="text-[18px] font-bold leading-tight text-slate-950">{item.title}</h3><div className="mt-4 flex items-center gap-3 rounded-xl border border-slate-200 px-3 py-3"><span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#eef5ff] text-[#2953A4]"><MapPin className="h-5 w-5" /></span><div className="min-w-0"><p className="truncate text-[15px] font-medium text-slate-900">{item.place}</p><p className="mt-0.5 text-[14px] text-slate-500">{item.region}</p></div></div><button type="button" className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#315bac] py-3 text-[15px] font-semibold text-white"><Eye className="h-5 w-5" /> Lihat Foto</button></article>)}</div></section>)}
          {groups.length === 0 && <div className="rounded-2xl border border-slate-200 px-5 py-12 text-center text-[14px] text-slate-500">Belum ada aktivitas pada rentang tanggal ini.</div>}
        </div>
        <div className="flex justify-center pt-1"><a href="/kacab-aktivitas/buat" className="inline-flex items-center gap-2 rounded-xl border-2 border-[#2953A4] px-5 py-3 text-[15px] font-semibold text-[#2953A4]"><Plus className="h-5 w-5" /> Tambah Aktivitas</a></div>
      </main>
    </MobileShell>
  );
}

function DateField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <label className="block"><span className="mb-1.5 block text-[14px] font-medium text-slate-800">{label}</span><span className="relative block"><input type="date" value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-[13px] text-slate-900 outline-none" /><ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" /></span></label>;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", { weekday: "long", day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(`${value}T00:00:00`));
}

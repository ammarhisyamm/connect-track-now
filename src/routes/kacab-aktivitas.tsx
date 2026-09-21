import { createFileRoute, Link } from "@tanstack/react-router";
import { MobileShell } from "@/components/mobile-shell";
import { CalendarDays, ChevronRight, MapPin, Plus } from "lucide-react";

export const Route = createFileRoute("/kacab-aktivitas")({
  head: () => ({ meta: [{ title: "Aktivitas KACAB" }] }),
  component: KacabActivities,
});

const ITEMS = [
  { kcp: "MAS MONANG-MANING", date: "10 Oktober 2026", title: "Evaluasi Pencapaian Target Unit & Sales", place: "Balai Desa Kelurahan Pilumpanua", priority: "High" },
  { kcp: "MAS RAWAMANGUN", date: "12 Oktober 2026", title: "Visit Nasabah One Obligor", place: "KCP Rawamangun", priority: "Medium" },
];

function KacabActivities() {
  return (
    <MobileShell role="kacab" hideFab>
      <header className="bg-white px-5 pb-5 pt-12">
        <h1 className="text-[22px] font-bold text-slate-900">Aktivitas</h1>
        <p className="mt-0.5 text-[13px] text-slate-500">Kelola aktivitas monitoring seluruh KCP</p>
      </header>
      <main className="space-y-3 bg-white px-5 pb-8">
        <Link to="/kacab-aktivitas/buat" className="flex items-center justify-center gap-2 rounded-xl bg-[#2953A4] py-3.5 text-[14px] font-semibold text-white shadow-sm">
          <Plus className="h-4 w-4" /> Tambah Aktivitas
        </Link>
        {ITEMS.map((item) => (
          <article key={`${item.kcp}-${item.date}`} className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between gap-3 text-[12px] text-slate-500">
              <span className="font-semibold text-[#2953A4]">{item.kcp}</span>
              <span>{item.date}</span>
            </div>
            <div className="my-3 border-t border-slate-100" />
            <h2 className="text-[16px] font-bold text-slate-900">{item.title}</h2>
            <p className="mt-2 flex items-center gap-1.5 text-[13px] text-slate-500"><MapPin className="h-4 w-4 text-[#2953A4]" />{item.place}</p>
            <div className="mt-3 flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-[12px] font-medium text-amber-700"><CalendarDays className="h-3.5 w-3.5" />{item.priority}</span>
              <ChevronRight className="h-5 w-5 text-[#2953A4]" />
            </div>
          </article>
        ))}
      </main>
    </MobileShell>
  );
}

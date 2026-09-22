import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Building2, ChevronDown, ChevronLeft, ChevronRight, ClipboardCheck, FileText, LayoutGrid, LogOut, Pencil, Settings2, ShieldCheck, Target, UsersRound, X } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Target Aktivitas" }] }),
  component: Dashboard,
});

type TargetRow = { unit: string; total: number; weekly: number; daily: number; configured: boolean };
type EditTarget = { unit: string; total: string; weekly: string; daily: string };

const INITIAL_TARGETS: TargetRow[] = [
  { unit: "Rawamangun", total: 40, weekly: 10, daily: 0, configured: true },
  { unit: "Monang-Maning", total: 0, weekly: 0, daily: 0, configured: false },
  { unit: "Kemayoran", total: 24, weekly: 6, daily: 0, configured: true },
];

function Dashboard() {
  const [tab, setTab] = useState("Kepala KCP");
  const [unit, setUnit] = useState("Semua Unit");
  const [period, setPeriod] = useState("Oktober 2026");
  const [targets, setTargets] = useState(INITIAL_TARGETS);
  const [edit, setEdit] = useState<EditTarget | null>(null);
  const visible = useMemo(() => unit === "Semua Unit" ? targets : targets.filter((item) => item.unit === unit), [unit, targets]);
  const configured = targets.filter((item) => item.configured).length;

  const saveTarget = () => {
    if (!edit) return;
    setTargets((items) => items.map((item) => item.unit === edit.unit ? { ...item, total: Number(edit.total) || 0, weekly: Number(edit.weekly) || 0, daily: Number(edit.daily) || 0, configured: true } : item));
    setEdit(null);
  };

  return (
    <div className="min-h-screen bg-[#f6f7fb] text-[#17182d]">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-[344px] bg-[#292663] text-white lg:block">
        <div className="flex h-[176px] items-center gap-4 bg-[#199900] px-8"><span className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-[#199900]"><Building2 className="h-8 w-8" /></span><div><p className="text-[21px] font-medium">Rawamangun</p><p className="mt-1.5 text-[16px] text-white/70">Kepala Cabang</p></div></div>
        <nav className="pt-0 text-[18px]">
          <NavItem icon={<LayoutGrid />} label="Dashboard" />
          <NavItem icon={<FileText />} label="Pencapaian Tim" active />
          <div className="border-l-4 border-transparent py-4 pl-[104px] text-white/90">Target Aktivitas <span className="ml-2 inline-block h-2.5 w-2.5 rounded-full bg-white" /></div>
          <div className="space-y-7 px-8 pb-8 pl-[104px] text-[17px] text-white/70"><p className="text-white">Pencapaian Kepala KCP</p><p>Pencapaian Penaksir</p><p>Pencapaian Sales Officer</p><p>Pencapaian Sales Agent</p></div>
          <NavItem icon={<ClipboardCheck />} label="Pengajuan Event" /><NavItem icon={<FileText />} label="Realisasi Event" /><NavItem icon={<LogOut />} label="Pengembalian Realisasi" /><NavItem icon={<FileText />} label="Riwayat Event" />
          <div className="mt-12"><NavItem icon={<Settings2 />} label="Ubah Kata Sandi" /><NavItem icon={<LogOut />} label="Keluar" /></div>
        </nav>
      </aside>

      <main className="min-h-screen lg:ml-[344px]">
        <div className="mx-auto max-w-[1600px] px-6 py-8 lg:px-12 lg:py-12">
          <div className="flex items-center gap-4 text-[16px] text-slate-500"><span>Home</span><span>/</span><strong className="text-slate-900">Pencapaian Tim</strong></div>
          <div className="mt-5 flex flex-wrap items-end justify-between gap-4"><div><h1 className="text-[32px] font-bold tracking-tight">Target Aktivitas</h1><p className="mt-2 text-[14px] text-slate-500">Atur target aktivitas bulanan per KCP di cabang ini.</p></div><label className="flex items-center gap-2 text-[14px] text-slate-500">Periode <span className="relative"><select value={period} onChange={(event) => setPeriod(event.target.value)} className="appearance-none rounded-lg border border-slate-200 bg-white px-4 py-2.5 pr-9 font-medium text-slate-800"><option>Oktober 2026</option><option>November 2026</option><option>Desember 2026</option></select><ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2" /></span></label></div>

          <div className="mt-10 flex gap-10 border-b border-slate-200 text-[17px] font-medium"><button onClick={() => setTab("Kepala KCP")} className={`border-b-4 px-1 pb-4 ${tab === "Kepala KCP" ? "border-[#199900] text-[#199900]" : "border-transparent text-slate-500"}`}>Kepala KCP</button><button onClick={() => setTab("Penaksir")} className={`border-b-4 px-1 pb-4 ${tab === "Penaksir" ? "border-[#199900] text-[#199900]" : "border-transparent text-slate-500"}`}>Penaksir</button><button onClick={() => setTab("Sales Officer")} className={`border-b-4 px-1 pb-4 ${tab === "Sales Officer" ? "border-[#199900] text-[#199900]" : "border-transparent text-slate-500"}`}>Sales Officer</button></div>

          <section className="mt-10 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"><div className="flex flex-wrap items-center justify-between gap-5 px-7 py-7"><div><h2 className="text-[25px] font-semibold">Daftar Target Aktivitas</h2><p className="mt-1 text-[14px] text-slate-400">{configured} dari {targets.length} KCP sudah disetting</p></div><label className="relative"><select value={unit} onChange={(event) => setUnit(event.target.value)} className="appearance-none rounded-xl border border-slate-300 bg-white px-4 py-3 pl-11 pr-11 text-[15px] font-medium"><option>Semua Unit</option>{targets.map((item) => <option key={item.unit}>{item.unit}</option>)}</select><Building2 className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#292663]" /><ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2" /></label></div><div className="overflow-x-auto"><table className="w-full min-w-[850px] border-collapse text-left"><thead className="border-y border-slate-200 text-[14px] text-slate-400"><tr><th className="px-7 py-5 font-medium">No</th><th className="px-5 py-5 font-medium">Unit</th><th className="px-5 py-5 font-medium">Total Activity Bulanan</th><th className="px-5 py-5 font-medium">Weekly Activity</th><th className="px-5 py-5 font-medium">Daily Activity</th><th className="px-5 py-5 font-medium">Status</th><th className="px-7 py-5 text-right font-medium">Aksi</th></tr></thead><tbody>{visible.map((item, index) => <tr key={item.unit} className="border-b border-slate-100 last:border-0"><td className="px-7 py-6">{index + 1}</td><td className="px-5 py-6 font-medium">{item.unit}</td><td className="px-5 py-6 font-semibold">{item.total || "-"}</td><td className="px-5 py-6">{item.weekly || "-"}</td><td className="px-5 py-6">{item.daily || "-"}</td><td className="px-5 py-6"><span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-medium ${item.configured ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"}`}>{item.configured ? <ShieldCheck className="h-3.5 w-3.5" /> : <Target className="h-3.5 w-3.5" />}{item.configured ? "Sudah disetting" : "Belum disetting"}</span></td><td className="px-7 py-6 text-right"><button onClick={() => setEdit({ unit: item.unit, total: String(item.total || ""), weekly: String(item.weekly || ""), daily: String(item.daily || "") })} className="inline-flex items-center gap-2 rounded-lg border border-[#292663] px-5 py-2.5 text-[14px] font-medium text-[#292663]"><Pencil className="h-4 w-4" /> Edit</button></td></tr>)}</tbody></table></div><div className="flex items-center justify-end gap-5 px-7 py-6 text-[14px] text-slate-400"><span>Rows per page: <strong className="ml-2 text-slate-600">10</strong></span><button disabled className="rounded-lg border border-slate-200 p-2"><ChevronLeft className="h-5 w-5" /></button><span className="rounded-lg bg-green-600 px-3 py-2 font-semibold text-white">1</span><button className="rounded-lg border border-slate-200 p-2"><ChevronRight className="h-5 w-5" /></button></div></section>

          <section className="mt-8"><h2 className="text-[22px] font-semibold">Visit KACAB</h2><div className="mt-4 grid gap-4 md:grid-cols-3"><VisitCard label="KPI Watch List" value="Belum disetting" /><VisitCard label="Grade Audit" value="Belum disetting" /><VisitCard label="Operational Score" value="Belum disetting" /></div></section>
        </div><footer className="border-t border-slate-200 bg-white px-12 py-8 text-[14px] text-slate-500">2021 © Sales Tracking. All rights reserved.</footer>
      </main>
      {edit && <EditModal edit={edit} setEdit={setEdit} onSave={saveTarget} />}
    </div>
  );
}

function NavItem({ icon, label, active = false }: { icon: React.ReactNode; label: string; active?: boolean }) { return <div className={`flex items-center gap-5 border-l-4 px-10 py-5 ${active ? "border-white bg-white/10" : "border-transparent text-white/75"}`}>{icon}<span>{label}</span></div>; }
function VisitCard({ label, value }: { label: string; value: string }) { return <div className="rounded-xl border border-slate-200 bg-white p-5"><p className="text-[14px] text-slate-500">{label}</p><p className="mt-3 text-[20px] font-semibold text-amber-700">{value}</p><p className="mt-1 text-[13px] text-slate-400">Atur melalui menu konfigurasi visit KACAB.</p></div>; }
function EditModal({ edit, setEdit, onSave }: { edit: EditTarget; setEdit: (value: EditTarget | null) => void; onSave: () => void }) { return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-5"><div className="w-full max-w-[500px] rounded-2xl bg-white p-7 shadow-2xl"><div className="flex items-start justify-between"><div><h2 className="text-[22px] font-bold">Edit Target Aktivitas</h2><p className="mt-1 text-[14px] text-slate-500">{edit.unit} · target bulanan</p></div><button onClick={() => setEdit(null)} aria-label="Tutup"><X className="h-5 w-5 text-slate-500" /></button></div><div className="mt-6 grid gap-4"><Input label="Total Activity Bulanan" value={edit.total} onChange={(value) => setEdit({ ...edit, total: value })} /><Input label="Weekly Activity" value={edit.weekly} onChange={(value) => setEdit({ ...edit, weekly: value })} /><Input label="Daily Activity" value={edit.daily} onChange={(value) => setEdit({ ...edit, daily: value })} /></div><div className="mt-7 flex justify-end gap-3"><button onClick={() => setEdit(null)} className="rounded-lg border border-slate-200 px-5 py-2.5 text-[14px]">Batal</button><button onClick={onSave} className="rounded-lg bg-[#199900] px-5 py-2.5 text-[14px] font-semibold text-white">Simpan Setting</button></div></div></div>; }
function Input({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) { return <label className="block text-[14px] font-medium text-slate-700">{label}<input type="number" min="0" value={value} onChange={(event) => onChange(event.target.value)} className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-[15px] outline-none focus:border-[#199900]" /></label>; }

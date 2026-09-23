import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Building2, ChevronDown, ChevronLeft, ChevronRight, ClipboardCheck, FileText, LayoutGrid, LogOut, UsersRound, X } from "lucide-react";
import { TargetFilters } from "../components/target-filters";
import { formatRupiah } from "../lib/mock-data";

export const Route = createFileRoute("/dashboard-bisnis")({
  head: () => ({ meta: [{ title: "Dashboard Bisnis — Sales Officer" }] }),
  component: DashboardBisnis,
});

type BusinessSalesTarget = {
  salesName: string;
  grade: string;
  unit: string;
  total: number;
  weekly: number;
  daily: number;
  ado: number;
  booking: number;
  gram: number;
  active: boolean;
};

const INITIAL_TARGETS: BusinessSalesTarget[] = [
  { salesName: "Andi Pratama", grade: "Trainee", unit: "Rawamangun", total: 40, weekly: 10, daily: 3, ado: 10000, booking: 32000000, gram: 3, active: true },
  { salesName: "Siti Rahma", grade: "Silver", unit: "Rawamangun", total: 40, weekly: 10, daily: 5, ado: 10000, booking: 32000000, gram: 5, active: false },
  { salesName: "Budi Santoso", grade: "Gold", unit: "Rawamangun", total: 40, weekly: 10, daily: 5, ado: 10000, booking: 32000000, gram: 5, active: false },
  { salesName: "Dewi Lestari", grade: "Platinum", unit: "Rawamangun", total: 40, weekly: 10, daily: 5, ado: 10000, booking: 32000000, gram: 5, active: false },
];

type BusinessEdit = { key: string; ado: string; booking: string; gram?: string };

function DashboardBisnis() {
  const [period, setPeriod] = useState("September 2026");
  const [unit, setUnit] = useState("Semua Unit");
  const [grade, setGrade] = useState("Semua Grade");
  const [targets, setTargets] = useState(INITIAL_TARGETS);
  const [edit, setEdit] = useState<BusinessEdit | null>(null);
  const [targetMenuOpen, setTargetMenuOpen] = useState(true);
  const visible = targets.filter((item) => (unit === "Semua Unit" || item.unit === unit) && (grade === "Semua Grade" || item.grade === grade));

  const save = () => {
    if (!edit) return;
    setTargets((items) => items.map((item) => `${item.unit}::${item.grade}` === edit.key ? { ...item, ado: parseAmount(edit.ado), booking: parseAmount(edit.booking), ...(edit.gram === undefined ? {} : { gram: parseAmount(edit.gram) }) } : item));
    setEdit(null);
  };

  return <div className="min-h-screen bg-[#f6f7fb] text-[#17182d]">
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-[256px] bg-[#292663] text-white lg:block">
      <div className="flex h-[90px] items-center gap-4 bg-[#199900] px-6"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-[#199900]"><Building2 className="h-4 w-4" /></span><div className="min-w-0"><p className="whitespace-nowrap text-[16px] font-medium">MAS MANGGALEWA</p><p className="mt-1 whitespace-nowrap text-[14px] text-white/70">Bisnis</p></div></div>
      <nav className="pt-0 text-[14px]"><SideItem icon={<FileText />} label="Report" active end={<ChevronDown className="h-4 w-4" />} /><SideItem icon={<FileText />} label="Pencapaian Sales" end={<ChevronDown className="h-4 w-4" />} /><button type="button" onClick={() => setTargetMenuOpen((open) => !open)} className="flex h-12 w-full items-center gap-4 border-l-4 border-transparent px-8 text-left text-white/75 hover:bg-white/10"><LayoutGrid className="h-6 w-6 shrink-0" /><span className="flex-1 whitespace-nowrap">Target Aktivitas</span><ChevronDown className={`h-4 w-4 transition-transform ${targetMenuOpen ? "rotate-180" : ""}`} /></button>{targetMenuOpen && <div className="bg-[#211f58] py-1 text-white/90"><SideSubItem label="KCP" /><SideSubItem label="Penaksir" /><SideSubItem label="Sales Officer" /></div>}<SideItem icon={<LayoutGrid />} label="Dashboard" /><SideItem icon={<ClipboardCheck />} label="Pengajuan Event" /><SideItem icon={<FileText />} label="Realisasi Event" /><SideItem icon={<LogOut />} label="Pengembalian Realisasi" /><SideItem icon={<UsersRound />} label="Manajemen Sales" /><SideItem icon={<UsersRound />} label="Manajemen Sales Mitra" /><div className="mt-12"><SideItem icon={<LayoutGrid />} label="Ubah Kata Sandi" /><SideItem icon={<FileText />} label="Keluar" /></div></nav>
    </aside>
    <main className="flex min-h-screen flex-col lg:ml-[256px]"><div className="flex-1 mx-auto w-full max-w-[1600px] px-6 py-8 lg:px-12 lg:py-12"><div className="flex items-center gap-4 text-[16px] text-slate-500"><span>Home</span><span>/</span><strong className="text-slate-900">Dashboard Bisnis</strong></div><h1 className="mt-5 text-[32px] font-bold tracking-tight">Target Sales Officer</h1><section className="mt-10 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"><div className="flex flex-wrap items-center justify-between gap-5 px-7 py-7"><div><h2 className="text-[25px] font-semibold">Daftar Target Aktivitas</h2><p className="mt-1 text-[14px] text-slate-400">{visible.length} Data</p></div><TargetFilters period={period} onPeriodChange={setPeriod} unit={unit} units={targets.map((item) => item.unit)} onUnitChange={setUnit} grade={grade} grades={[...new Set(targets.map((item) => item.grade))]} onGradeChange={setGrade} /></div><div className="overflow-x-auto"><table className="w-full min-w-[1580px] table-fixed border-collapse text-left"><colgroup><col className="w-[64px]" /><col className="w-[210px]" /><col className="w-[150px]" /><col className="w-[190px]" /><col className="w-[150px]" /><col className="w-[150px]" /><col className="w-[150px]" /><col className="w-[180px]" /><col className="w-[190px]" /><col className="w-[110px]" /><col className="w-[150px]" /><col className="w-[120px]" /></colgroup><thead className="border-y border-slate-200 text-[14px] text-slate-400"><tr><th className="whitespace-nowrap px-5 py-5 font-medium">No</th><th className="whitespace-nowrap px-5 py-5 font-medium">Nama Sales</th><th className="whitespace-nowrap px-5 py-5 font-medium">Grade</th><th className="whitespace-nowrap px-5 py-5 font-medium">Unit</th><th className="whitespace-nowrap px-5 py-5 font-medium">Total Activity</th><th className="whitespace-nowrap px-5 py-5 font-medium">Weekly Activity</th><th className="whitespace-nowrap px-5 py-5 font-medium">Daily Activity</th><th className="whitespace-nowrap px-5 py-5 font-medium">ADO</th><th className="whitespace-nowrap px-5 py-5 font-medium">Booking Amount</th><th className="whitespace-nowrap px-5 py-5 font-medium">Gram</th><th className="whitespace-nowrap px-5 py-5 font-medium">Status</th><th className="whitespace-nowrap px-5 py-5 text-right font-medium">Aksi</th></tr></thead><tbody>{visible.map((item, index) => <tr key={`${item.unit}-${item.grade}`} className="border-b border-slate-100 last:border-0"><td className="whitespace-nowrap px-5 py-7">{index + 1}</td><td className="whitespace-nowrap px-5 py-7 font-medium">{item.salesName}</td><td className="whitespace-nowrap px-5 py-7">{item.grade}</td><td className="whitespace-nowrap px-5 py-7">{item.unit}</td><td className="whitespace-nowrap px-5 py-7 font-semibold">{item.total}</td><td className="whitespace-nowrap px-5 py-7">{item.weekly}</td><td className="whitespace-nowrap px-5 py-7">{item.daily}</td><td className="whitespace-nowrap px-5 py-7">{formatRupiah(item.ado)}</td><td className="whitespace-nowrap px-5 py-7">{formatRupiah(item.booking)}</td><td className="whitespace-nowrap px-5 py-7">{item.gram}</td><td className={`whitespace-nowrap px-5 py-7 text-[14px] ${item.active ? "text-green-700" : "text-slate-500"}`}>{item.active ? "Active" : "Inactive"}</td><td className="whitespace-nowrap px-5 py-7 text-right"><button onClick={() => setEdit({ key: `${item.unit}::${item.grade}`, ado: formatAmount(item.ado), booking: formatAmount(item.booking) })} className="rounded-lg border border-[#292663] px-5 py-2.5 text-[14px] font-medium text-[#292663]">Edit</button></td></tr>)}</tbody></table></div><div className="flex min-w-[1580px] items-center justify-end gap-5 px-7 py-6 text-[14px] text-slate-400"><span>Rows per page: <strong className="ml-2 text-slate-600">10</strong></span><button disabled className="rounded-lg border border-slate-200 p-2"><ChevronLeft className="h-5 w-5" /></button><span className="rounded-lg bg-green-600 px-3 py-2 font-semibold text-white">1</span><button className="rounded-lg border border-slate-200 p-2"><ChevronRight className="h-5 w-5" /></button></div></section></div><footer className="mt-auto border-t border-slate-200 bg-white px-6 py-8 text-[14px] text-slate-500 lg:px-12">2021 © Sales Tracking. All rights reserved.</footer></main>
    {edit && <BusinessEditModal edit={edit} setEdit={setEdit} onSave={save} />}
  </div>;
}

function BusinessEditModal({ edit, setEdit, onSave }: { edit: BusinessEdit; setEdit: (value: BusinessEdit | null) => void; onSave: () => void }) {
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4"><div className="w-full max-w-[520px] rounded-xl bg-white shadow-2xl"><div className="flex items-center justify-between border-b border-slate-200 px-8 py-5"><h2 className="text-[24px] font-bold">Edit Target Bisnis</h2><button onClick={() => setEdit(null)} aria-label="Tutup"><X className="h-6 w-6 text-slate-500" /></button></div><div className="grid gap-4 px-8 py-6"><AmountField label="ADO" value={edit.ado} onChange={(value) => setEdit({ ...edit, ado: value })} /><AmountField label="Booking Amount" value={edit.booking} onChange={(value) => setEdit({ ...edit, booking: value })} /></div><div className="flex justify-end gap-3 border-t border-slate-200 px-8 py-4"><button onClick={() => setEdit(null)} className="rounded-lg border-2 border-[#199900] px-5 py-2.5 text-[14px] font-medium text-[#199900]">Batalkan</button><button onClick={onSave} className="rounded-lg bg-[#199900] px-6 py-2.5 text-[14px] font-semibold text-white">Simpan</button></div></div></div>;
}

function AmountField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) { return <label className="block text-[14px] font-medium text-slate-700">{label}<input inputMode="numeric" value={value} onChange={(event) => onChange(formatAmountInput(event.target.value))} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-[14px] outline-none focus:border-[#199900]" /></label>; }
function formatAmount(value: number) { return value.toLocaleString("id-ID"); }
function formatAmountInput(value: string) { const digits = value.replace(/\D/g, ""); return digits ? Number(digits).toLocaleString("id-ID") : ""; }
function parseAmount(value: string) { return Number(value.replace(/\D/g, "")) || 0; }
function SideItem({ icon, label, active = false, end }: { icon: React.ReactNode; label: string; active?: boolean; end?: React.ReactNode }) { return <div className={`flex h-12 items-center gap-4 border-l-4 px-8 ${active ? "border-white bg-[#3d35d9] text-white" : "border-transparent text-white/75"}`}>{icon}<span className="flex-1 whitespace-nowrap">{label}</span>{end}</div>; }
function SideSubItem({ label }: { label: string }) { return <div className="flex h-12 items-center pl-16 pr-8 text-[14px] whitespace-nowrap">{label}</div>; }

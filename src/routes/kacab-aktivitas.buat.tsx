import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { MobileShell } from "@/components/mobile-shell";
import { OverlayPortal, Spinner, useMinBusy } from "@/components/motion";
import { createActivity } from "@/lib/activity-store";
import { KELURAHAN_WILAYAH, type Activity, type ActivityType } from "@/lib/mock-data";
import { useState } from "react";
import { ArrowLeft, CalendarDays, ChevronDown, ChevronRight, Clock, MapPin } from "lucide-react";

export const Route = createFileRoute("/kacab-aktivitas/buat")({
  head: () => ({ meta: [{ title: "Tambah Aktivitas KACAB" }] }),
  component: CreateKacabActivity,
});

const KCP_OPTIONS = [
  { name: "MAS MONANG-MANING", kelurahan: "Pilumpanua", address: "Balai Desa Kelurahan Pilumpanua", wilayah: "Kec. Wajo, Sulawesi Selatan, 17133" },
  { name: "MAS RAWAMANGUN", kelurahan: "Rawamangun", address: "Jl. Balai Pustaka Timur No. 1, Rawamangun", wilayah: "Kec. Pulogadung, Jakarta Timur, DKI Jakarta, 13220" },
  { name: "MAS KEMAYORAN", kelurahan: "Kemayoran", address: "Jl. Kemayoran Gempol, Kemayoran", wilayah: "Kec. Kemayoran, Jakarta Pusat, DKI Jakarta, 10620" },
];
const ACTIVITIES: ActivityType[] = ["Penyelesaian Case Outlet", "Visit Nasabah One Obligor", "Evaluasi Pencapaian Target Unit & Sales"];
const PRIORITIES = ["High", "Low"] as const;

function CreateKacabActivity() {
  const navigate = useNavigate();
  const [selectedTypes, setSelectedTypes] = useState<ActivityType[]>([]);
  const [priority, setPriority] = useState<(typeof PRIORITIES)[number] | "">("");
  const [date, setDate] = useState("");
  const [kcpName, setKcpName] = useState("");
  const [place, setPlace] = useState("");
  const [from, setFrom] = useState("08:00");
  const [to, setTo] = useState("10:00");
  const [created, setCreated] = useState<Activity | null>(null);
  const [busy, runSave] = useMinBusy();
  const kcp = KCP_OPTIONS.find((item) => item.name === kcpName);
  const valid = selectedTypes.length > 0 && priority && date && kcp;

  const toggleActivity = (type: ActivityType) => {
    setSelectedTypes((current) => current.includes(type) ? current.filter((item) => item !== type) : [...current, type]);
  };

  const save = (event: React.FormEvent) => {
    event.preventDefault();
    if (!valid || busy || !kcp) return;
    runSave(() => {
      const activity = createActivity({
        type: selectedTypes[0],
        activityTypes: selectedTypes,
        kind: "lapangan",
        ptm: "Dalam PTM",
        locationName: kcp.name,
        address: place.trim() || kcp.address,
        kelurahan: kcp.kelurahan,
        wilayah: kcp.wilayah || KELURAHAN_WILAYAH[kcp.kelurahan],
        date: new Date(date).toISOString(),
        timeRange: `${from} - ${to}`,
        startTime: from,
        endTime: to,
      });
      setCreated(activity);
    });
  };

  return (
    <MobileShell role="kacab" hideNav>
      <header className="bg-white px-5 pb-3 pt-12">
        <button onClick={() => navigate({ to: "/kacab-aktivitas" })} className="inline-flex items-center gap-2 text-slate-900">
          <ArrowLeft className="h-5 w-5" /><span className="text-[17px] font-medium">Tambah Aktivitas</span>
        </button>
      </header>
      <form onSubmit={save} className="space-y-4 bg-white px-5 pb-8 pt-4">
        <div><h1 className="text-[20px] font-bold text-slate-900">Buat Aktivitas</h1><p className="mt-0.5 text-[13px] text-slate-500">Isi detail kegiatan monitoring KCP</p></div>

        <Field label="Kegiatan" hint={selectedTypes.length ? `${selectedTypes.length} kegiatan dipilih` : undefined}>
          <div className="space-y-2">
            {ACTIVITIES.map((type) => <button type="button" key={type} onClick={() => toggleActivity(type)} className={`flex w-full items-center justify-between rounded-xl border px-3.5 py-3 text-left text-[14px] ${selectedTypes.includes(type) ? "border-[#2953A4] bg-[#2953A4]/5 text-[#2953A4]" : "border-slate-200 text-slate-700"}`}><span>{type}</span><span className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${selectedTypes.includes(type) ? "border-[#2953A4] bg-[#2953A4]" : "border-slate-300"}`}>{selectedTypes.includes(type) && <span className="h-2 w-2 rounded-full bg-white" />}</span></button>)}
          </div>
        </Field>

        <Field label="Priority">
          <div className="grid grid-cols-2 gap-2.5">{PRIORITIES.map((item) => <button type="button" key={item} onClick={() => setPriority(item)} className={`rounded-xl border px-3.5 py-3 text-left text-[14px] ${priority === item ? "border-[#2953A4] bg-[#2953A4]/5 text-[#2953A4]" : "border-slate-200 text-slate-500"}`}>{item}</button>)}</div>
        </Field>

        <Field label="Tanggal Pelaksanaan"><span className="relative block"><input required type="date" value={date} onChange={(event) => setDate(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-[14px] text-slate-800 outline-none" /><CalendarDays className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /></span></Field>

        <Field label="Nama KCP">
          <span className="relative block"><select required value={kcpName} onChange={(event) => { setKcpName(event.target.value); setPlace(""); }} className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-[14px] text-slate-800 outline-none"><option value="" disabled>Pilih KCP</option>{KCP_OPTIONS.map((item) => <option key={item.name} value={item.name}>{item.name}</option>)}</select><ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /></span>
        </Field>

        <Field label="Tempat Kegiatan (Opsional)"><input value={place} onChange={(event) => setPlace(event.target.value)} placeholder={kcp?.address ?? "Contoh: Balai Desa"} className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-[14px] text-slate-800 outline-none placeholder:text-slate-400" /></Field>

        <Field label="Kelurahan"><div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-[14px] text-slate-600">{kcp?.kelurahan || "Pilih KCP terlebih dahulu"}<ChevronRight className="h-4 w-4 text-slate-400" /></div></Field>
        <Field label="Kecamatan, Kabupaten, Provinsi, Kode Pos"><div className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-[14px] text-slate-600">{kcp?.wilayah || "Alamat akan terisi otomatis"}</div></Field>

        <div className="grid grid-cols-2 gap-3"><Field label="Dari jam"><span className="relative block"><input type="time" value={from} onChange={(event) => setFrom(event.target.value)} className="w-full rounded-xl border border-slate-200 px-3.5 py-3 text-[14px]" /><Clock className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /></span></Field><Field label="Sampai jam"><span className="relative block"><input type="time" value={to} onChange={(event) => setTo(event.target.value)} className="w-full rounded-xl border border-slate-200 px-3.5 py-3 text-[14px]" /><Clock className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /></span></Field></div>

        <button type="submit" disabled={!valid || busy} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#2953A4] py-3.5 text-[15px] font-semibold text-white disabled:bg-slate-100 disabled:text-slate-400">{busy && <Spinner className="h-4 w-4" />}{busy ? "Menyimpan…" : "Simpan Aktivitas"}</button>
      </form>

      {created && <OverlayPortal><div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-5"><div className="w-full max-w-[360px] rounded-2xl bg-white px-5 pb-5 pt-8 text-center shadow-2xl"><div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#eef2ff]"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ffd43d] text-4xl font-bold leading-none text-white">✓</span></div><h2 className="mt-5 text-[22px] font-bold text-slate-950">Aktivitas Berhasil Dibuat</h2><p className="mt-2 text-[14px] leading-5 text-slate-500">Aktivitas monitoring sudah tersimpan.</p><button type="button" onClick={() => navigate({ to: "/kacab-aktivitas" })} className="mt-6 w-full rounded-xl bg-[#315bac] py-3.5 text-[15px] font-semibold text-white">Lihat Aktivitas</button></div></div></OverlayPortal>}
    </MobileShell>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return <div><label className="mb-1.5 block text-[14px] text-slate-800">{label}</label>{children}{hint && <p className="mt-1.5 text-[12px] text-[#2953A4]">{hint}</p>}</div>;
}

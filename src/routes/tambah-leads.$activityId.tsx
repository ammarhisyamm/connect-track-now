import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { MobileShell } from "@/components/mobile-shell";
import {
  activities,
  KELURAHAN_WILAYAH,
  PEKERJAAN_PROMAS,
  type Contact,
  type LeadStatus,
} from "@/lib/mock-data";
import { StatusPickerSheet } from "@/components/status-picker";
import { addLead } from "@/lib/leads-store";
import { useState } from "react";
import { ArrowLeft, ChevronRight, X } from "lucide-react";

export const Route = createFileRoute("/tambah-leads/$activityId")({
  head: () => ({ meta: [{ title: "Tambah Leads" }] }),
  component: TambahLeadsPage,
  notFoundComponent: () => (
    <MobileShell hideNav>
      <div className="flex flex-1 items-center justify-center text-slate-500">Tidak ditemukan</div>
    </MobileShell>
  ),
  loader: ({ params }) => {
    const a = activities.find((x) => x.id === params.activityId);
    if (!a) throw notFound();
    return a;
  },
});

const GENDERS = ["Laki-Laki", "Perempuan"] as const;
const KELURAHAN = Object.keys(KELURAHAN_WILAYAH);
const PRIMARY = "#2953A4";

function TambahLeadsPage() {
  const activity = Route.useLoaderData();
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [kelurahan, setKelurahan] = useState("");
  const [job, setJob] = useState("");
  const [status, setStatus] = useState<LeadStatus | "">("");
  const [statusPicker, setStatusPicker] = useState(false);

  const valid = name.trim() && gender && phone.trim() && kelurahan && job && status;

  const save = () => {
    if (!valid || !status) return;
    addLead(activity.id, activity.type, {
      id: `c-${Date.now()}`,
      name: name.trim(),
      phone: phone.trim(),
      status,
      source: activity.type,
      lastContact: "Baru saja",
      hasGold: status === "Hot" || status === "Warm",
      interested: status !== "Cold",
      gender: gender as Contact["gender"],
      address: address.trim() || undefined,
      kelurahan,
      wilayah: KELURAHAN_WILAYAH[kelurahan],
      job,
    });
    nav({ to: "/aktivitas/$id", params: { id: activity.id } });
  };

  const inputCls =
    "w-full rounded-lg border border-slate-200 bg-white px-3.5 py-3 text-[14px] text-slate-800 outline-none placeholder:text-slate-400";

  return (
    <MobileShell hideNav>
      <div className="sticky top-0 z-10 bg-white px-5 pb-2 pt-12">
        <div className="flex items-center justify-between">
          <h1 className="text-[20px] font-bold text-slate-900">Tambah Leads</h1>
          <Link
            to="/aktivitas/$id"
            params={{ id: activity.id }}
            aria-label="Tutup"
            className="rounded-full p-1 text-slate-700"
          >
            <X className="h-6 w-6" />
          </Link>
        </div>
        <p className="mt-0.5 text-[13px] text-slate-500">
          {activity.locationName} · data langsung tercatat di aktivitas ini
        </p>
      </div>

      <div className="space-y-4 bg-white px-5 pb-32 pt-4">
        <div>
          <Label>Nama Calon Nasabah</Label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Masukkan Nama Lengkap" className={inputCls} autoFocus />
        </div>
        <div>
          <Label>Jenis Kelamin</Label>
          <span className="relative block">
            <select value={gender} onChange={(e) => setGender(e.target.value)} className={`${inputCls} appearance-none ${!gender ? "text-slate-400" : ""}`}>
              <option value="" disabled>Pilih Jenis Kelamin</option>
              {GENDERS.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
            <ChevronRight className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 rotate-90 text-slate-400" />
          </span>
        </div>
        <div>
          <Label>Nomor Telepon</Label>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" placeholder="Masukkan Nomor Telepon" className={inputCls} />
        </div>
        <div>
          <Label>Alamat</Label>
          <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Masukkan alamat" className={inputCls} />
        </div>
        <div>
          <Label>Kelurahan</Label>
          <span className="relative block">
            <select value={kelurahan} onChange={(e) => setKelurahan(e.target.value)} className={`${inputCls} appearance-none ${!kelurahan ? "text-slate-400" : ""}`}>
              <option value="" disabled>Pilih Kelurahan</option>
              {KELURAHAN.map((k) => (
                <option key={k} value={k}>{k}</option>
              ))}
            </select>
            <ChevronRight className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </span>
        </div>
        <div>
          <Label>Kecamatan, Kabupaten, Provinsi, Kode Pos</Label>
          <input value={kelurahan ? (KELURAHAN_WILAYAH[kelurahan] ?? "") : ""} readOnly className={`${inputCls} bg-slate-50 text-slate-500`} />
        </div>
        <div>
          <Label>Pekerjaan Nasabah</Label>
          <span className="relative block">
            <select value={job} onChange={(e) => setJob(e.target.value)} className={`${inputCls} appearance-none ${!job ? "text-slate-400" : ""}`}>
              <option value="" disabled>Masukkan Pekerjaan Nasabah</option>
              {PEKERJAAN_PROMAS.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            <ChevronRight className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 rotate-90 text-slate-400" />
          </span>
          <p className="mt-1 text-[11px] text-slate-400">Ambil datanya dari Promas</p>
        </div>
        <div>
          <Label>Status Nasabah</Label>
          <button
            type="button"
            onClick={() => setStatusPicker(true)}
            className={`${inputCls} flex items-center justify-between text-left ${!status ? "text-slate-400" : ""}`}
          >
            {status || "Pilih Status Nasabah"}
            <ChevronRight className="h-4 w-4 rotate-90 text-slate-400" />
          </button>
        </div>
      </div>

      <div className="fixed bottom-0 left-1/2 z-40 w-full max-w-[440px] -translate-x-1/2 border-t border-slate-100 bg-white/95 px-5 pb-6 pt-3 backdrop-blur">
        <button
          onClick={save}
          disabled={!valid}
          className="w-full rounded-lg py-3.5 text-[15px] font-semibold text-white disabled:bg-slate-100 disabled:text-slate-400"
          style={valid ? { background: PRIMARY } : undefined}
        >
          Simpan Data Nasabah
        </button>
        <Link
          to="/aktivitas/$id"
          params={{ id: activity.id }}
          className="mt-1 flex items-center justify-center gap-2 py-2 text-[13px] text-slate-400"
        >
          <ArrowLeft className="h-4 w-4" /> Kembali tanpa menyimpan
        </Link>
      </div>

      {statusPicker && (
        <StatusPickerSheet
          value={status || "Hot"}
          onPick={(v) => {
            setStatus(v);
            setStatusPicker(false);
          }}
          onClose={() => setStatusPicker(false)}
        />
      )}
    </MobileShell>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="mb-1.5 block text-[14px] text-slate-800">{children}</label>;
}

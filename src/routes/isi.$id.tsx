import { createFileRoute, notFound } from "@tanstack/react-router";
import { MobileShell } from "@/components/mobile-shell";
import { Spinner, useMinBusy } from "@/components/motion";
import {
  activities,
  formatTanggalPanjang,
  KELURAHAN_WILAYAH,
  PEKERJAAN_PROMAS,
  profile,
  shortLocation,
} from "@/lib/mock-data";
import { useActivity } from "@/lib/activity-store";
import { addLead } from "@/lib/leads-store";
import { useState } from "react";
import { CheckCircle2, ChevronRight, Clock3, MapPin, Lock, ShieldCheck } from "lucide-react";

const KELURAHAN = Object.keys(KELURAHAN_WILAYAH);
const PRIMARY = "#2953A4";

export const Route = createFileRoute("/isi/$id")({
  head: () => ({ meta: [{ title: "Formulir Pendaftaran — Gadai Mas" }] }),
  component: PublicLeadForm,
  validateSearch: (s: Record<string, unknown>) => ({ k: (s.k as string) ?? "" }),
  loader: ({ params }) => {
    return activities.find((x) => x.id === params.id) ?? null;
  },
});

function PublicLeadForm() {
  const params = Route.useParams();
  const base = Route.useLoaderData();
  const fromStore = useActivity(params.id);
  const activity = fromStore ?? base;
  if (!activity) throw notFound();
  // `activity` sudah realtime dari store (localStorage) — ikut check-in sales.
  // SSR: fallback data statis. Nasabah selalu dapat snapshot statis.
  const effective = activity;
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [kelurahan, setKelurahan] = useState("");
  const [job, setJob] = useState("");
  const [done, setDone] = useState(false);

  const valid = name.trim() && gender && phone.trim() && kelurahan && job;
  const [busy, runSubmit] = useMinBusy();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid || busy) return;
    runSubmit(() => {
      addLead(activity.id, activity.type, {
        id: `c-${Date.now()}`,
      name: name.trim(),
      phone: phone.trim(),
      status: "Warm",
      source: activity.type,
      lastContact: "Baru saja",
      hasGold: false,
      interested: true,
      gender: gender as "Laki-Laki" | "Perempuan",
      address: address.trim() || undefined,
      kelurahan,
      wilayah: KELURAHAN_WILAYAH[kelurahan],
      job,
    });
      setDone(true);
    });
  };

  if (done) {
    return (
      <MobileShell hideNav>
        <div className="flex min-h-[80vh] flex-col items-center justify-center px-8 text-center">
          <CheckCircle2 className="h-14 w-14 text-green-500" />
          <h1 className="mt-4 text-lg font-bold text-slate-900">Terima kasih, {name.split(" ")[0] || "Kak"}!</h1>
          <p className="mt-2 text-sm text-slate-500">
            Data kamu sudah masuk ke tim <b>{profile.name}</b>. Kami hubungi via WA maksimal
            1x24 jam untuk info gadai emas.
          </p>
          <p className="mt-3 rounded-full bg-slate-100 px-3 py-1 text-[11px] text-slate-500">
            Ref: {activity.locationName} · {activity.type}
          </p>
        </div>
      </MobileShell>
    );
  }

  if (activity.kind !== "digital") {
    return (
      <MobileShell hideNav>
        <div className="flex min-h-[80vh] flex-col items-center justify-center px-8 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
            <Lock className="h-7 w-7" />
          </span>
          <h1 className="mt-4 text-lg font-bold text-slate-900">Formulir Tidak Tersedia</h1>
          <p className="mt-2 text-sm text-slate-500">
            Aktivitas lapangan tidak menggunakan formulir pendaftaran publik.
          </p>
        </div>
      </MobileShell>
    );
  }

  if (effective.status === "planned") {
    return (
      <MobileShell hideNav>
        <div className="flex min-h-[80vh] flex-col items-center justify-center px-8 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#2953A4]/10 text-[#2953A4]">
            <Clock3 className="h-7 w-7" />
          </span>
          <h1 className="mt-4 text-lg font-bold text-slate-900">Link Belum Aktif</h1>
          <p className="mt-2 text-sm text-slate-500">
            Aktivitas <b>{activity.locationName}</b> ({formatTanggalPanjang(activity.date)}) belum berjalan.
            Link ini aktif setelah sales check-in di lokasi.
          </p>
        </div>
      </MobileShell>
    );
  }

  if (effective.status === "completed") {
    return (
      <MobileShell hideNav>
        <div className="flex min-h-[80vh] flex-col items-center justify-center px-8 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
            <Lock className="h-7 w-7" />
          </span>
          <h1 className="mt-4 text-lg font-bold text-slate-900">Pendaftaran Ditutup</h1>
          <p className="mt-2 text-sm text-slate-500">
            Aktivitas <b>{activity.locationName}</b> sudah selesai. Hubungi sales kami untuk info kegiatan berikutnya.
          </p>
        </div>
      </MobileShell>
    );
  }

  return (
    <MobileShell hideNav>
      <div className="px-5 pb-8 pt-12 text-white" style={{ background: "var(--gradient-brand)" }}>
        <h1 className="text-[26px] font-bold leading-tight">Formulir Pendaftaran</h1>
        <span className="mt-2.5 inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-[13px] font-medium text-slate-900">
          <MapPin className="h-4 w-4" />
          {shortLocation(activity)}
        </span>
      </div>

      <form
        onSubmit={submit}
        className="space-y-4 bg-white px-5 py-5"
      >
        <div>
          <Label>Nama Calon Nasabah</Label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Masukkan Nama Lengkap"
            className={inputCls}
          />
        </div>

        <div>
          <Label>Jenis Kelamin</Label>
          <span className="relative block">
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className={`${inputCls} appearance-none ${!gender ? "text-slate-400" : ""}`}
            >
              <option value="" disabled>Pilih Jenis Kelamin</option>
              <option value="Laki-Laki">Laki-Laki</option>
              <option value="Perempuan">Perempuan</option>
            </select>
            <ChevronRight className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 rotate-90 text-slate-400" />
          </span>
        </div>

        <div>
          <Label>Nomor Telepon</Label>
          <input
            inputMode="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Masukkan Nomor Telepon"
            className={inputCls}
          />
        </div>

        <div>
          <Label>Alamat</Label>
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Masukkan alamat"
            className={inputCls}
          />
        </div>

        <div>
          <Label>Kelurahan</Label>
          <span className="relative block">
            <select
              value={kelurahan}
              onChange={(e) => setKelurahan(e.target.value)}
              className={`${inputCls} appearance-none ${!kelurahan ? "text-slate-400" : ""}`}
            >
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
          <input
            value={kelurahan ? (KELURAHAN_WILAYAH[kelurahan] ?? "") : ""}
            readOnly
            className={`${inputCls} bg-slate-50 text-slate-500`}
          />
        </div>

        <div>
          <Label>Pekerjaan Nasabah</Label>
          <span className="relative block">
            <select
              value={job}
              onChange={(e) => setJob(e.target.value)}
              className={`${inputCls} appearance-none ${!job ? "text-slate-400" : ""}`}
            >
              <option value="" disabled>Masukkan Pekerjaan Nasabah</option>
              {PEKERJAAN_PROMAS.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            <ChevronRight className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 rotate-90 text-slate-400" />
          </span>
        </div>

        <button
          type="submit"
          disabled={!valid || busy}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg py-3.5 text-[15px] font-semibold text-white disabled:bg-slate-100 disabled:text-slate-400"
          style={valid && !busy ? { background: PRIMARY } : undefined}
        >
          {busy && <Spinner className="h-4 w-4" />}
          {busy ? "Mengirim…" : "Simpan Data"}
        </button>
        <p className="flex items-center justify-center gap-1.5 text-center text-[11px] text-slate-400">
          <ShieldCheck className="h-3.5 w-3.5" /> Data aman, hanya untuk pengajuan gadai.
        </p>
      </form>
    </MobileShell>
  );
}

const inputCls =
  "w-full rounded-lg border border-slate-200 bg-white px-3.5 py-3 text-[14px] text-slate-800 outline-none placeholder:text-slate-400";

function Label({ children }: { children: React.ReactNode }) {
  return <label className="mb-1.5 block text-[14px] text-slate-800">{children}</label>;
}

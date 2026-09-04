import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { MobileShell } from "@/components/mobile-shell";
import { useState } from "react";
import { KELURAHAN_WILAYAH, type ActivityType } from "@/lib/mock-data";
import { ArrowLeft, CalendarDays, ChevronDown, ChevronRight, Clock } from "lucide-react";

export const Route = createFileRoute("/aktivitas/buat")({
  head: () => ({ meta: [{ title: "Tambah Aktivitas" }] }),
  component: CreateActivity,
});

const ACTIVITY_TYPES: ActivityType[] = ["Canvassing", "Sosialisasi", "Open Booth", "Event", "Market ke instansi", "Other"];
const KELURAHAN = Object.keys(KELURAHAN_WILAYAH);
const PRIMARY = "#2953A4";

function CreateActivity() {
  const nav = useNavigate();
  const [type, setType] = useState("");
  const [ptm, setPtm] = useState<"Dalam PTM" | "Luar PTM" | "">("");
  const [locName, setLocName] = useState("");
  const [address, setAddress] = useState("");
  const [kelurahan, setKelurahan] = useState("");
  const [date, setDate] = useState("");
  const [from, setFrom] = useState("07:00");
  const [to, setTo] = useState("08:00");

  const valid = type && ptm && locName.trim() && address.trim() && kelurahan && date && from && to;

  return (
    <MobileShell hideNav>
      <div className="bg-white px-5 pb-2 pt-12">
        <Link to="/aktivitas" className="inline-flex items-center gap-2 text-slate-900">
          <ArrowLeft className="h-5 w-5" />
          <span className="text-[17px] font-medium">Tambah Aktivitas</span>
        </Link>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (valid) nav({ to: "/aktivitas" });
        }}
        className="space-y-4 bg-white px-5 pb-8 pt-4"
      >
        <div>
          <h2 className="text-[20px] font-bold text-slate-900">Buat Aktivitas</h2>
          <p className="mt-0.5 text-[13px] text-slate-500">Isi detail kegiatan dan lokasi pelaksanaan</p>
        </div>

        <Field label="Aktivitas">
          <span className="relative block">
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className={`w-full appearance-none rounded-lg border border-slate-200 bg-white px-3.5 py-3 text-[14px] outline-none ${!type ? "text-slate-400" : "text-slate-800"}`}
            >
              <option value="" disabled>Pilih Aktivitas</option>
              {ACTIVITY_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </span>
        </Field>

        <Field label="Jenis PTM" hint="Dalam PTM = radius ≤ 5km | Luar PTM > 5km">
          <div className="grid grid-cols-2 gap-2.5">
            {(["Dalam PTM", "Luar PTM"] as const).map((p) => (
              <button
                type="button"
                key={p}
                onClick={() => setPtm(p)}
                className={`flex items-center gap-2.5 rounded-lg border px-3.5 py-3 text-left text-[14px] ${
                  ptm === p ? "border-slate-200 text-slate-800" : "border-slate-200 text-slate-400"
                }`}
              >
                <span
                  className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 ${
                    ptm === p ? "border-[#2953A4]" : "border-slate-300"
                  }`}
                >
                  {ptm === p && <span className="h-2.5 w-2.5 rounded-full bg-[#2953A4]" />}
                </span>
                {p}
              </button>
            ))}
          </div>
        </Field>

        <Field label="Nama Lokasi">
          <input
            value={locName}
            onChange={(e) => setLocName(e.target.value)}
            placeholder="Masukkan nama lokasi"
            className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-3 text-[14px] text-slate-800 outline-none placeholder:text-slate-400"
          />
        </Field>

        <Field label="Alamat">
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Masukkan alamat"
            className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-3 text-[14px] text-slate-800 outline-none placeholder:text-slate-400"
          />
        </Field>

        <Field label="Kelurahan">
          <span className="relative block">
            <select
              value={kelurahan}
              onChange={(e) => setKelurahan(e.target.value)}
              className={`w-full appearance-none rounded-lg border border-slate-200 bg-white px-3.5 py-3 text-[14px] outline-none ${!kelurahan ? "text-slate-400" : "text-slate-800"}`}
            >
              <option value="" disabled>Pilih Kelurahan</option>
              {KELURAHAN.map((k) => (
                <option key={k} value={k}>{k}</option>
              ))}
            </select>
            <ChevronRight className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </span>
        </Field>

        <Field label="Kecamatan, Kabupaten, Provinsi, Kode Pos">
          <input
            value={kelurahan ? (KELURAHAN_WILAYAH[kelurahan] ?? "") : ""}
            readOnly
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-3 text-[14px] text-slate-500 outline-none"
          />
        </Field>

        <Field label="Tanggal Pelaksanaan">
          <span className="relative block">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={`w-full rounded-lg border border-slate-200 bg-white px-3.5 py-3 text-[14px] outline-none ${!date ? "text-slate-400" : "text-slate-800"}`}
            />
            <CalendarDays className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </span>
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Dari jam">
            <span className="relative block">
              <input
                type="time"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-3 text-[14px] text-slate-800 outline-none"
              />
              <Clock className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </span>
          </Field>
          <Field label="Sampai Jam">
            <span className="relative block">
              <input
                type="time"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-3 text-[14px] text-slate-800 outline-none"
              />
              <Clock className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </span>
          </Field>
        </div>

        <button
          type="submit"
          disabled={!valid}
          className="w-full rounded-lg py-3.5 text-[15px] font-semibold text-white disabled:bg-slate-100 disabled:text-slate-400"
          style={valid ? { background: PRIMARY } : undefined}
        >
          Simpan Aktivitas
        </button>
      </form>
    </MobileShell>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-[14px] text-slate-800">{label}</label>
      {children}
      {hint && <p className="mt-1.5 text-[12px] text-slate-500">{hint}</p>}
    </div>
  );
}

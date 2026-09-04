import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { MobileShell } from "@/components/mobile-shell";
import { useState } from "react";
import {
  KELURAHAN_WILAYAH,
  type ActivityMode,
  type ActivityType,
} from "@/lib/mock-data";
import { ArrowLeft, CalendarDays, ChevronDown, ChevronRight, Clock } from "lucide-react";

export const Route = createFileRoute("/aktivitas/buat")({
  head: () => ({ meta: [{ title: "Tambah Aktivitas" }] }),
  component: CreateActivity,
});

const ACTIVITY_TYPES: ActivityType[] = ["Canvassing", "Sosialisasi", "Open Booth", "Event", "Market ke instansi", "Other"];
const ONLINE_CHANNELS = ["WhatsApp Blast", "Instagram / Facebook", "Zoom / Live", "Lainnya"];
const KELURAHAN = Object.keys(KELURAHAN_WILAYAH);

function CreateActivity() {
  const nav = useNavigate();
  const [mode, setMode] = useState<ActivityMode>("lapangan");
  const [type, setType] = useState<ActivityType>("Canvassing");
  const [ptm, setPtm] = useState<"Dalam PTM" | "Luar PTM">("Dalam PTM");
  const [locName, setLocName] = useState("");
  const [address, setAddress] = useState("");
  const [kelurahan, setKelurahan] = useState(KELURAHAN[0]);
  const [channel, setChannel] = useState(ONLINE_CHANNELS[0]);
  const [date, setDate] = useState("2026-05-10");
  const [from, setFrom] = useState("07:00");
  const [to, setTo] = useState("08:00");

  const isOnline = mode === "online";

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
          nav({ to: "/aktivitas" });
        }}
        className="space-y-4 bg-white px-5 pb-8 pt-4"
      >
        <div>
          <h2 className="text-[20px] font-bold text-slate-900">Buat Aktivitas</h2>
          <p className="mt-0.5 text-[13px] text-slate-500">
            {isOnline ? "Isi detail kegiatan online dan kanal distribusi" : "Isi detail kegiatan dan lokasi pelaksanaan"}
          </p>
        </div>

        <Field label="Metode Aktivitas">
          <div className="grid grid-cols-2 gap-2.5">
            <ModeRadio
              active={isOnline}
              onClick={() => setMode("online")}
              title="Online"
              desc="Bagikan link"
            />
            <ModeRadio
              active={!isOnline}
              onClick={() => setMode("lapangan")}
              title="Lapangan"
              desc="Check-in GPS"
            />
          </div>
        </Field>

        <Field label="Aktivitas">
          <span className="relative block">
            <select
              value={type}
              onChange={(e) => setType(e.target.value as ActivityType)}
              className="w-full appearance-none rounded-lg border border-slate-200 bg-white px-3.5 py-3 text-[14px] text-slate-800 outline-none"
            >
              {ACTIVITY_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </span>
        </Field>

        {isOnline ? (
          <>
            <Field label="Nama Kegiatan Online">
              <input
                value={locName}
                onChange={(e) => setLocName(e.target.value)}
                placeholder="cth: Blast WA Promo Gadai"
                className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-3 text-[14px] text-slate-800 outline-none placeholder:text-slate-400"
              />
            </Field>
            <Field label="Kanal Online">
              <div className="flex flex-wrap gap-2">
                {ONLINE_CHANNELS.map((c) => (
                  <button
                    type="button"
                    key={c}
                    onClick={() => setChannel(c)}
                    className={`rounded-full border px-3.5 py-2 text-[13px] font-medium ${
                      channel === c
                        ? "border-blue-700 bg-blue-700 text-white"
                        : "border-slate-200 bg-white text-slate-500"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </Field>
            <p className="rounded-lg bg-blue-50 px-3.5 py-2.5 text-[12px] leading-relaxed text-blue-700">
              Setelah disimpan, kamu dapat link unik untuk dibagikan ke nasabah. Tanpa check-in GPS.
            </p>
          </>
        ) : (
          <>
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
                        ptm === p ? "border-blue-700" : "border-slate-300"
                      }`}
                    >
                      {ptm === p && <span className="h-2.5 w-2.5 rounded-full bg-blue-700" />}
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
                placeholder="Tempat Lapangan"
                className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-3 text-[14px] text-slate-800 outline-none placeholder:text-slate-400"
              />
            </Field>

            <Field label="Alamat">
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Jln Matsuda Kirana Kelapa Gading"
                className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-3 text-[14px] text-slate-800 outline-none placeholder:text-slate-400"
              />
            </Field>

            <Field label="Kelurahan">
              <span className="relative block">
                <select
                  value={kelurahan}
                  onChange={(e) => setKelurahan(e.target.value)}
                  className="w-full appearance-none rounded-lg border border-slate-200 bg-white px-3.5 py-3 text-[14px] text-slate-800 outline-none"
                >
                  {KELURAHAN.map((k) => (
                    <option key={k} value={k}>{k}</option>
                  ))}
                </select>
                <ChevronRight className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </span>
            </Field>

            <Field label="Kecamatan, Kabupaten, Provinsi, Kode Pos">
              <input
                value={KELURAHAN_WILAYAH[kelurahan] ?? ""}
                readOnly
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-3 text-[14px] text-slate-500 outline-none"
              />
            </Field>
          </>
        )}

        <Field label="Tanggal Pelaksanaan">
          <span className="relative block">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-3 text-[14px] text-slate-800 outline-none"
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
          className="w-full rounded-lg bg-blue-700 py-3.5 text-[15px] font-semibold text-white active:scale-[0.99]"
        >
          {isOnline ? "Simpan & Bagikan Link" : "Simpan Aktivitas"}
        </button>
      </form>
    </MobileShell>
  );
}

function ModeRadio({ active, onClick, title, desc }: { active: boolean; onClick: () => void; title: string; desc: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2.5 rounded-lg border border-slate-200 px-3.5 py-3 text-left"
    >
      <span
        className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 ${
          active ? "border-blue-700" : "border-slate-300"
        }`}
      >
        {active && <span className="h-2.5 w-2.5 rounded-full bg-blue-700" />}
      </span>
      <span>
        <span className={`block text-[14px] font-medium ${active ? "text-slate-800" : "text-slate-400"}`}>{title}</span>
        <span className="block text-[11px] text-slate-400">{desc}</span>
      </span>
    </button>
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

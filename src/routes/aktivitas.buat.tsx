import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { MobileShell, ScreenHeader } from "@/components/mobile-shell";
import { useState } from "react";
import type { ActivityMode, ActivityType } from "@/lib/mock-data";
import { MapPin, Clock, CheckCircle2, Globe, Footprints, Link2 } from "lucide-react";

export const Route = createFileRoute("/aktivitas/buat")({
  head: () => ({ meta: [{ title: "Buat Aktivitas" }] }),
  component: CreateActivity,
});

const ACTIVITY_TYPES: ActivityType[] = ["Canvassing", "Sosialisasi", "Open Booth", "Event", "Market ke instansi", "Other"];
const TIME_SLOTS = ["08:00 - 09:00", "09:00 - 10:00", "10:00 - 11:00", "11:00 - 12:00", "13:00 - 14:00", "14:00 - 15:00", "15:00 - 16:00", "16:00 - 17:00"];
const ONLINE_CHANNELS = ["WhatsApp Blast", "Instagram / Facebook", "Zoom / Live", "Lainnya"];

function CreateActivity() {
  const nav = useNavigate();
  const [mode, setMode] = useState<ActivityMode>("lapangan");
  const [type, setType] = useState<ActivityType>("Canvassing");
  const [ptm, setPtm] = useState<"Dalam PTM" | "Luar PTM">("Dalam PTM");
  const [locName, setLocName] = useState("");
  const [address, setAddress] = useState("");
  const [channel, setChannel] = useState(ONLINE_CHANNELS[0]);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [slot, setSlot] = useState(TIME_SLOTS[1]);

  const isOnline = mode === "online";

  return (
    <MobileShell hideNav>
      <ScreenHeader
        title="Buat Aktivitas"
        subtitle={isOnline ? "Sebar link, leads isi sendiri" : "Rencanakan kunjunganmu"}
        back="/aktivitas"
      />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          nav({ to: "/aktivitas" });
        }}
        className="space-y-5 px-5 py-5"
      >
        <Field label="Metode Aktivitas">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setMode("online")}
              className={`rounded-xl border p-3 text-left transition-colors ${
                isOnline
                  ? "border-brand bg-brand/5 text-brand"
                  : "border-border bg-card text-muted-foreground"
              }`}
            >
              <Globe className="mb-1.5 h-5 w-5" />
              <p className="text-sm font-semibold">Online</p>
              <p className="mt-0.5 text-[11px] leading-snug opacity-80">
                Bagikan link, nasabah isi leads sendiri
              </p>
            </button>
            <button
              type="button"
              onClick={() => setMode("lapangan")}
              className={`rounded-xl border p-3 text-left transition-colors ${
                !isOnline
                  ? "border-brand bg-brand/5 text-brand"
                  : "border-border bg-card text-muted-foreground"
              }`}
            >
              <Footprints className="mb-1.5 h-5 w-5" />
              <p className="text-sm font-semibold">Lapangan</p>
              <p className="mt-0.5 text-[11px] leading-snug opacity-80">
                Datang ke lokasi, check-in GPS + foto
              </p>
            </button>
          </div>
        </Field>

        <Field label="Pilih Aktivitas">
          <div className="grid grid-cols-2 gap-2">
            {ACTIVITY_TYPES.map((t) => (
              <button
                type="button"
                key={t}
                onClick={() => setType(t)}
                className={`rounded-xl border px-3 py-3 text-left text-sm font-medium transition-colors ${
                  type === t
                    ? "border-brand bg-brand/5 text-brand"
                    : "border-border bg-card text-muted-foreground"
                }`}
              >
                {type === t && <CheckCircle2 className="mb-1 h-4 w-4" />}
                {t}
              </button>
            ))}
          </div>
        </Field>

        {isOnline ? (
          <>
            <Field label="Nama Kegiatan Online" hint="Contoh: Blast WA Promo Gadai, Live IG Edukasi Emas">
              <input
                value={locName}
                onChange={(e) => setLocName(e.target.value)}
                placeholder="Nama kegiatan online"
                className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-brand"
              />
            </Field>

            <Field label="Kanal Online">
              <div className="flex flex-wrap gap-2">
                {ONLINE_CHANNELS.map((c) => (
                  <button
                    type="button"
                    key={c}
                    onClick={() => setChannel(c)}
                    className={`rounded-full border px-3 py-2 text-xs font-medium transition-colors ${
                      channel === c
                        ? "border-brand bg-brand text-brand-foreground"
                        : "border-border bg-card text-muted-foreground"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </Field>

            <div className="flex gap-3 rounded-2xl bg-brand/5 p-3 text-brand">
              <Link2 className="h-5 w-5 flex-shrink-0" />
              <p className="text-xs leading-relaxed">
                Setelah disimpan, kamu dapat <b>link unik</b> untuk dibagikan ke nasabah.
                Setiap yang isi otomatis masuk sebagai leads di detail aktivitas. Tanpa
                check-in GPS.
              </p>
            </div>
          </>
        ) : (
          <>
            <Field label="PTM" hint="Dalam PTM = radius ≤ 5km · Luar PTM > 5km">
              <div className="flex gap-2">
                {(["Dalam PTM", "Luar PTM"] as const).map((p) => (
                  <button
                    type="button"
                    key={p}
                    onClick={() => setPtm(p)}
                    className={`flex-1 rounded-xl border px-3 py-3 text-sm font-medium transition-colors ${
                      ptm === p ? "border-brand bg-brand text-brand-foreground" : "border-border bg-card text-muted-foreground"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </Field>

            <Field label="Nama Lokasi" hint="Contoh: Mall, pasar, lapangan">
              <input
                value={locName}
                onChange={(e) => setLocName(e.target.value)}
                placeholder="Nama tempat"
                className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-brand"
              />
            </Field>

            <Field label="Lokasi" hint="Diambil dari Promas">
              <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3">
                <MapPin className="h-4 w-4 text-brand" />
                <input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Cari alamat atau pinpoint…"
                  className="flex-1 bg-transparent text-sm outline-none"
                />
              </div>
            </Field>
          </>
        )}

        <div className="grid grid-cols-2 gap-3">
          <Field label="Tanggal">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-xl border border-border bg-card px-3 py-3 text-sm outline-none focus:border-brand"
            />
          </Field>
          <Field label="Estimasi Waktu">
            <div className="relative">
              <Clock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand" />
              <select
                value={slot}
                onChange={(e) => setSlot(e.target.value)}
                className="w-full appearance-none rounded-xl border border-border bg-card py-3 pl-9 pr-3 text-sm outline-none focus:border-brand"
              >
                {TIME_SLOTS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </Field>
        </div>

        <button
          type="submit"
          className="w-full rounded-full bg-brand py-3.5 text-sm font-semibold text-brand-foreground shadow-lg shadow-brand/20 active:scale-[0.98]"
        >
          {isOnline ? "Simpan & Bagikan Link" : "Simpan Aktivitas"}
        </button>
      </form>
    </MobileShell>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </label>
      {children}
      {hint && <p className="mt-1.5 text-[11px] text-muted-foreground">{hint}</p>}
    </div>
  );
}

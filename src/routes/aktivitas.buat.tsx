import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { MobileShell, ScreenHeader } from "@/components/mobile-shell";
import { useState } from "react";
import type { ActivityType } from "@/lib/mock-data";
import { MapPin, Clock, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/aktivitas/buat")({
  head: () => ({ meta: [{ title: "Buat Aktivitas" }] }),
  component: CreateActivity,
});

const ACTIVITY_TYPES: ActivityType[] = ["Canvassing", "Sosialisasi", "Open Booth", "Event", "Market ke instansi", "Other"];
const TIME_SLOTS = ["08:00 - 09:00", "09:00 - 10:00", "10:00 - 11:00", "11:00 - 12:00", "13:00 - 14:00", "14:00 - 15:00", "15:00 - 16:00", "16:00 - 17:00"];

function CreateActivity() {
  const nav = useNavigate();
  const [type, setType] = useState<ActivityType>("Canvassing");
  const [ptm, setPtm] = useState<"Dalam PTM" | "Luar PTM">("Dalam PTM");
  const [locName, setLocName] = useState("");
  const [address, setAddress] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [slot, setSlot] = useState(TIME_SLOTS[1]);

  return (
    <MobileShell hideNav>
      <ScreenHeader title="Buat Aktivitas" subtitle="Rencanakan kunjunganmu" back="/aktivitas" />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          nav({ to: "/aktivitas" });
        }}
        className="space-y-5 px-5 py-5"
      >
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

        <Field label="Nama Lokasi" hint="Contoh: Mall, sawah, lapangan">
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
          Simpan Aktivitas
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

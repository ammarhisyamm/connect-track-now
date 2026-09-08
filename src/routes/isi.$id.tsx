import { createFileRoute, notFound } from "@tanstack/react-router";
import { MobileShell } from "@/components/mobile-shell";
import { StatusPickerSheet } from "@/components/status-picker";
import { Spinner, useMinBusy } from "@/components/motion";
import {
  activities,
  formatTanggalPanjang,
  KELURAHAN_WILAYAH,
  PEKERJAAN_PROMAS,
  profile,
  type LeadStatus,
} from "@/lib/mock-data";
import { useActivity } from "@/lib/activity-store";
import { addLead } from "@/lib/leads-store";
import { useState } from "react";
import { CheckCircle2, ChevronRight, Clock3, Link2, Lock, ShieldCheck } from "lucide-react";

const KELURAHAN = Object.keys(KELURAHAN_WILAYAH);
const PRIMARY = "#2953A4";

export const Route = createFileRoute("/isi/$id")({
  head: () => ({ meta: [{ title: "Formulir Pendaftaran — Gadai Mas" }] }),
  component: PublicLeadForm,
  validateSearch: (s: Record<string, unknown>) => ({ k: (s.k as string) ?? "" }),
  loader: ({ params }) => {
    const a = activities.find((x) => x.id === params.id);
    if (!a) throw notFound();
    return a;
  },
});

function PublicLeadForm() {
  const activity = Route.useLoaderData();
  // Status realtime dari store (localStorage) — ikut check-in sales,
  // bukan status statis. SSR: fallback data statis.
  const stored = useActivity(activity.id);
  const effective = stored ?? activity;
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [kelurahan, setKelurahan] = useState("");
  const [job, setJob] = useState("");
  const [status, setStatus] = useState<LeadStatus | "">("");
  const [statusPicker, setStatusPicker] = useState(false);
  const [hasGold, setHasGold] = useState<"ya" | "tidak" | "">("");
  const [need, setNeed] = useState("");
  const [done, setDone] = useState(false);

  const valid = name.trim() && phone.trim() && kelurahan && job && status;
  const [busy, runSubmit] = useMinBusy();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid || !status || busy) return;
    runSubmit(() => {
      addLead(activity.id, activity.type, {
        id: `c-${Date.now()}`,
      name: name.trim(),
      phone: phone.trim(),
      status,
      source: activity.type,
      lastContact: "Baru saja",
      hasGold: hasGold === "ya" || status === "Hot" || status === "Warm",
      interested: status !== "Cold",
      address: address.trim() || undefined,
      kelurahan,
      wilayah: KELURAHAN_WILAYAH[kelurahan],
      job,
      note: need.trim() || undefined,
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
      <header className="px-5 pb-6 pt-12 text-white" style={{ background: "var(--gradient-brand)" }}>
        <p className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-medium">
          <Link2 className="h-3.5 w-3.5" /> Formulir Pendaftaran · Gadai Mas
        </p>
        <h1 className="mt-3 text-xl font-semibold leading-tight">{activity.locationName}</h1>
        <p className="mt-1 text-sm text-brand-foreground/70">
          Isi 30 detik — dibantu oleh {profile.name} ({profile.branch})
        </p>
      </header>

      <form
        onSubmit={submit}
        className="space-y-4 bg-white px-5 py-5"
      >
        <div>
          <Label>Nama Lengkap</Label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="cth: Siti Sarah"
            className={inputCls}
          />
        </div>

        <div>
          <Label>No. HP / WA Aktif</Label>
          <input
            inputMode="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="cth: 0812xxxxxxx"
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

        <div>
          <Label>Punya emas / perhiasan?</Label>
          <div className="grid grid-cols-2 gap-2">
            {(["ya", "tidak"] as const).map((v) => (
              <button
                type="button"
                key={v}
                onClick={() => setHasGold(v)}
                className={`rounded-lg border px-3 py-3 text-sm font-medium capitalize ${
                  hasGold === v
                    ? "border-[#2953A4] bg-[#2953A4]/5 text-[#2953A4]"
                    : "border-slate-200 text-slate-500"
                }`}
              >
                {v === "ya" ? "Ya, punya" : "Belum punya"}
              </button>
            ))}
          </div>
        </div>

        <div>
          <Label>Kebutuhan (opsional)</Label>
          <textarea
            value={need}
            onChange={(e) => setNeed(e.target.value)}
            placeholder="cth: Butuh dana cepat, tanya bunga & tenor"
            rows={3}
            className={inputCls}
          />
        </div>

        <button
          type="submit"
          disabled={!valid || busy}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg py-3.5 text-[15px] font-semibold text-white disabled:bg-slate-100 disabled:text-slate-400"
          style={valid && !busy ? { background: PRIMARY } : undefined}
        >
          {busy && <Spinner className="h-4 w-4" />}
          {busy ? "Mengirim…" : "Kirim Data Saya"}
        </button>
        <p className="flex items-center justify-center gap-1.5 text-center text-[11px] text-slate-400">
          <ShieldCheck className="h-3.5 w-3.5" /> Data aman, hanya untuk pengajuan gadai.
        </p>
      </form>

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

const inputCls =
  "w-full rounded-lg border border-slate-200 bg-white px-3.5 py-3 text-[14px] text-slate-800 outline-none placeholder:text-slate-400";

function Label({ children }: { children: React.ReactNode }) {
  return <label className="mb-1.5 block text-[14px] text-slate-800">{children}</label>;
}

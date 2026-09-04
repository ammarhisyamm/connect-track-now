import { createFileRoute, notFound } from "@tanstack/react-router";
import { MobileShell } from "@/components/mobile-shell";
import { activities, formatTanggalPanjang, profile } from "@/lib/mock-data";
import { useState } from "react";
import { CheckCircle2, Clock3, Link2, Lock, ShieldCheck } from "lucide-react";

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
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [hasGold, setHasGold] = useState<"ya" | "tidak" | "">("");
  const [need, setNeed] = useState("");
  const [done, setDone] = useState(false);

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

  if (activity.status === "planned") {
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

  if (activity.status === "completed") {
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
        onSubmit={(e) => {
          e.preventDefault();
          setDone(true);
        }}
        className="space-y-4 px-5 py-5"
      >
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Nama Lengkap
          </label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="cth: Siti Sarah"
            className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-brand"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            No. HP / WA Aktif
          </label>
          <input
            required
            inputMode="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="cth: 0812xxxxxxx"
            className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-brand"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Punya emas / perhiasan?
          </label>
          <div className="grid grid-cols-2 gap-2">
            {(["ya", "tidak"] as const).map((v) => (
              <button
                type="button"
                key={v}
                onClick={() => setHasGold(v)}
                className={`rounded-xl border px-3 py-3 text-sm font-medium capitalize ${
                  hasGold === v ? "border-brand bg-brand/5 text-brand" : "border-border text-muted-foreground"
                }`}
              >
                {v === "ya" ? "Ya, punya" : "Belum punya"}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Kebutuhan (opsional)
          </label>
          <textarea
            value={need}
            onChange={(e) => setNeed(e.target.value)}
            placeholder="cth: Butuh dana cepat, tanya bunga & tenor"
            rows={3}
            className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-brand"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-full bg-brand py-3.5 text-sm font-semibold text-brand-foreground shadow-lg shadow-brand/20 active:scale-[0.98]"
        >
          Kirim Data Saya
        </button>
        <p className="flex items-center justify-center gap-1.5 text-center text-[11px] text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5" /> Data aman, hanya untuk pengajuan gadai.
        </p>
      </form>
    </MobileShell>
  );
}

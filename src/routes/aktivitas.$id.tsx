import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { MobileShell, ScreenHeader } from "@/components/mobile-shell";
import { activities, contacts, getShareLink, MODE_META } from "@/lib/mock-data";
import { useState } from "react";
import { MapPin, Camera, LogIn, LogOut, Users, Phone, MessageCircle, Filter, Link2, Copy, Check, Share2, Eye } from "lucide-react";

export const Route = createFileRoute("/aktivitas/$id")({
  head: () => ({ meta: [{ title: "Detail Aktivitas" }] }),
  component: ActivityDetail,
  notFoundComponent: () => (
    <MobileShell hideNav>
      <div className="flex flex-1 items-center justify-center text-muted-foreground">Tidak ditemukan</div>
    </MobileShell>
  ),
  loader: ({ params }) => {
    const a = activities.find((x) => x.id === params.id);
    if (!a) throw notFound();
    return a;
  },
});

function ActivityDetail() {
  const activity = Route.useLoaderData();
  const [filter, setFilter] = useState<"aktivitas" | "kontak">("aktivitas");
  const [checkedIn, setCheckedIn] = useState(activity.status !== "planned");

  const isOnline = activity.mode === "online";
  const relatedContacts = contacts.filter((c) => c.source === activity.type).slice(0, 4);

  return (
    <MobileShell hideNav>
      <ScreenHeader
        title={activity.locationName}
        subtitle={`${activity.type} · ${MODE_META[activity.mode].label}`}
        back="/aktivitas"
      />

      <div className="space-y-5 px-5 py-5">
        <span
          className={`inline-flex w-fit items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
            isOnline ? "bg-brand/10 text-brand" : "bg-secondary text-muted-foreground"
          }`}
        >
          {MODE_META[activity.mode].badge}
        </span>

        {isOnline ? (
          <ShareLinkCard
            activityId={activity.id}
            shareCode={activity.shareCode}
            views={activity.linkViews ?? 0}
            leads={activity.leadsCount}
          />
        ) : (
          <>
            {/* Map placeholder — khusus Lapangan */}
            <div className="soft-card overflow-hidden">
              <div className="relative h-40 bg-gradient-to-br from-secondary to-muted">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand text-brand-foreground shadow-lg">
                    <MapPin className="h-6 w-6" />
                  </div>
                </div>
                <div className="absolute inset-0 opacity-30" style={{
                  backgroundImage: "radial-gradient(circle at 50% 50%, transparent 20%, oklch(0.95 0.01 250) 70%), repeating-linear-gradient(45deg, oklch(0.92 0.01 255) 0 2px, transparent 2px 12px)",
                }} />
                <span className="absolute bottom-3 left-3 rounded-full bg-card/90 px-3 py-1 text-[11px] font-medium backdrop-blur">
                  GPS Live · Akurasi ±10m
                </span>
              </div>
              <div className="space-y-2 p-4">
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand" />
                  <span>{activity.address}</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {activity.ptm} · {activity.timeRange}
                </div>
              </div>
            </div>

            {/* Check-in actions — khusus Lapangan */}
            <div className="soft-card space-y-3 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Check In / Out</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setCheckedIn(true)}
                  disabled={checkedIn}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand py-3 text-sm font-semibold text-brand-foreground disabled:opacity-50"
                >
                  <LogIn className="h-4 w-4" /> Check In
                </button>
                <button
                  onClick={() => setCheckedIn(false)}
                  disabled={!checkedIn}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card py-3 text-sm font-semibold text-foreground disabled:opacity-50"
                >
                  <LogOut className="h-4 w-4" /> Check Out
                </button>
              </div>
              <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-secondary/40 py-6 text-xs font-medium text-muted-foreground">
                <Camera className="h-5 w-5" /> Tambah foto lokasi
              </button>
            </div>
          </>
        )}

        {/* Filter */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold">Detail Catatan</h3>
            <button className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <Filter className="h-3.5 w-3.5" /> Filter
            </button>
          </div>
          <div className="mb-3 inline-flex rounded-full bg-secondary p-1 text-xs">
            <button
              onClick={() => setFilter("aktivitas")}
              className={`rounded-full px-3 py-1.5 font-medium ${filter === "aktivitas" ? "bg-brand text-brand-foreground" : "text-muted-foreground"}`}
            >
              By Aktivitas
            </button>
            <button
              onClick={() => setFilter("kontak")}
              className={`rounded-full px-3 py-1.5 font-medium ${filter === "kontak" ? "bg-brand text-brand-foreground" : "text-muted-foreground"}`}
            >
              By Kontak
            </button>
          </div>

          {filter === "aktivitas" ? (
            <div className="soft-card p-4">
              <div className="grid grid-cols-3 divide-x divide-border text-center">
                <Stat label="Leads" value={activity.leadsCount} />
                <Stat label="Closing" value={activity.closingCount} />
                <Stat label={isOnline ? "Dilihat" : "Durasi"} value={isOnline ? (activity.linkViews ?? 0) : checkedIn ? "Live" : "—"} />
              </div>
              {isOnline && (
                <p className="mt-3 text-center text-[11px] text-muted-foreground">
                  Leads dari link masuk otomatis, tak perlu input manual.
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {relatedContacts.length === 0 && (
                <div className="soft-card p-6 text-center text-sm text-muted-foreground">
                  Belum ada kontak.
                </div>
              )}
              {relatedContacts.map((c) => (
                <div key={c.id} className="soft-card flex items-center gap-3 p-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand/10 text-sm font-semibold text-brand">
                    {c.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{c.name}</p>
                    <p className="text-[11px] text-muted-foreground">{c.status} · {c.lastContact}</p>
                  </div>
                  <a href={`tel:${c.phone}`} className="rounded-full bg-brand/10 p-2 text-brand">
                    <Phone className="h-4 w-4" />
                  </a>
                  <a href={`https://wa.me/${c.phone.replace(/\D/g, "")}`} className="rounded-full bg-success/15 p-2 text-success">
                    <MessageCircle className="h-4 w-4" />
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>

        <button className="flex w-full items-center justify-center gap-2 rounded-full bg-brand py-3.5 text-sm font-semibold text-brand-foreground">
          <Users className="h-4 w-4" /> Tambah Leads
        </button>
        {isOnline && (
          <p className="text-center text-[11px] text-muted-foreground">
            Tips: bagikan link ke WA / IG agar nasabah isi sendiri — hemat waktu input.
          </p>
        )}
      </div>
    </MobileShell>
  );
}

function ShareLinkCard({ activityId, shareCode, views, leads }: { activityId: string; shareCode?: string; views: number; leads: number }) {
  const [copied, setCopied] = useState(false);
  const fakeActivity = { id: activityId, shareCode } as { id: string; shareCode?: string };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const link = getShareLink(fakeActivity as any);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link);
    } catch {
      /* clipboard tak tersedia — tetap tampilkan status tersalin */
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  const waText = encodeURIComponent(`Halo! Isi data di link ini ya biar kami bisa bantu pengajuan gadai emasnya:\n${link}`);
  return (
    <div className="soft-card space-y-3 p-4">
      <div className="flex items-center justify-between">
        <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          <Link2 className="h-3.5 w-3.5" /> Link Pendaftaran Nasabah
        </p>
        <span className="rounded-full bg-success/15 px-2 py-0.5 text-[10px] font-semibold text-success">
          Aktif
        </span>
      </div>

      <div className="flex items-center gap-2 rounded-xl border border-border bg-secondary/50 px-3 py-2.5">
        <p className="flex-1 truncate text-xs font-medium">{link}</p>
        <button onClick={copy} className="inline-flex items-center gap-1 rounded-full bg-brand px-3 py-1.5 text-[11px] font-semibold text-brand-foreground">
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Tersalin" : "Salin"}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2 text-center">
        <div className="rounded-xl bg-secondary/60 p-2.5">
          <p className="inline-flex items-center gap-1 text-lg font-bold"><Eye className="h-4 w-4" />{views}</p>
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Dilihat</p>
        </div>
        <div className="rounded-xl bg-secondary/60 p-2.5">
          <p className="text-lg font-bold">{leads}</p>
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Mengisi</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <a
          href={`https://wa.me/?text=${waText}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-success/15 py-2.5 text-xs font-semibold text-success"
        >
          <Share2 className="h-3.5 w-3.5" /> Bagikan WA
        </a>
        <Link
          to="/isi/$id"
          params={{ id: activityId }}
          search={{ k: shareCode ?? "" }}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-brand/10 py-2.5 text-xs font-semibold text-brand"
        >
          <Eye className="h-3.5 w-3.5" /> Lihat Formulir
        </Link>
      </div>
      <p className="text-[11px] leading-relaxed text-muted-foreground">
        Nasabah yang buka link bisa langsung isi nama + no. HP — otomatis tercatat sebagai leads aktivitas ini.
      </p>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="px-2">
      <p className="text-xl font-bold text-foreground">{value}</p>
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
    </div>
  );
}

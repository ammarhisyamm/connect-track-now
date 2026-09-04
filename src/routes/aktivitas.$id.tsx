import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { MobileShell } from "@/components/mobile-shell";
import {
  activities,
  contacts,
  formatJadwal,
  formatTanggalSingkat,
  getShareLink,
  STATUS_META,
} from "@/lib/mock-data";
import { useState } from "react";
import {
  ArrowLeft,
  Camera,
  Check,
  Copy,
  Eye,
  Link2,
  LogOut,
  MapPin,
  Phone,
  MessageCircle,
  Plus,
  Share2,
} from "lucide-react";

export const Route = createFileRoute("/aktivitas/$id")({
  head: () => ({ meta: [{ title: "Detail Aktivitas" }] }),
  component: ActivityDetail,
  notFoundComponent: () => (
    <MobileShell hideNav>
      <div className="flex flex-1 items-center justify-center text-slate-500">Tidak ditemukan</div>
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
  const [checkedIn, setCheckedIn] = useState(activity.status === "checked_in");
  const finished = activity.status === "completed";
  const isOnline = activity.mode === "online";
  const meta = STATUS_META[activity.status];

  const relatedContacts = contacts.filter((c) => c.source === activity.type);
  const leads = relatedContacts.length > 0 ? relatedContacts : contacts.slice(0, 3);

  return (
    <MobileShell hideNav>
      <div className="bg-white px-5 pb-2 pt-12">
        <Link to="/aktivitas" className="inline-flex items-center gap-2 text-slate-900">
          <ArrowLeft className="h-5 w-5" />
          <span className="text-[17px] font-medium">Detail Aktivitas</span>
        </Link>
      </div>

      <div className="space-y-4 bg-white px-5 pb-8 pt-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[13px] font-medium text-blue-700">
              {isOnline ? formatTanggalSingkat(activity.date) + " | Online" : formatJadwal(activity)}
            </p>
            <p className={`flex-shrink-0 text-[13px] font-medium ${meta.className}`}>{meta.label}</p>
          </div>
          <div className="my-2.5 border-t border-slate-100" />
          <p className="text-[17px] font-bold text-slate-900">{activity.locationName}</p>
          <p className="mt-0.5 text-[13px] text-slate-500">
            {activity.kelurahan ? `${activity.kelurahan}, ` : ""}{activity.address}
          </p>
        </div>

        {isOnline ? (
          <ShareLinkCard
            activityId={activity.id}
            shareCode={activity.shareCode}
            views={activity.linkViews ?? 0}
            leadsCount={activity.leadsCount}
          />
        ) : (
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="relative flex h-44 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-sky-100 to-slate-200">
              <MapPin className="h-10 w-10 text-blue-700" />
              <button className="absolute bottom-2.5 right-2.5 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-medium text-slate-600">
                <Camera className="h-3.5 w-3.5" /> Foto lokasi
              </button>
            </div>
            {activity.status === "completed" || finished ? (
              <p className="mt-3 rounded-lg bg-slate-100 py-2.5 text-center text-[14px] font-medium text-slate-500">
                Finished {activity.checkOutTime ?? ""}
              </p>
            ) : checkedIn ? (
              <button
                onClick={() => setCheckedIn(false)}
                className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-red-500 py-3 text-[14px] font-semibold text-white"
              >
                <LogOut className="h-4 w-4" /> Check Out {activity.checkInTime ?? ""}
              </button>
            ) : (
              <button
                onClick={() => setCheckedIn(true)}
                className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-blue-700 py-3 text-[14px] font-semibold text-white"
              >
                <MapPin className="h-4 w-4" /> Check In
              </button>
            )}
          </div>
        )}

        <div>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-[16px] font-bold text-slate-900">Detail Leads ({leads.length})</h3>
            <button className="inline-flex items-center gap-1.5 rounded-lg border border-blue-700 px-3.5 py-2 text-[13px] font-medium text-blue-700">
              <Plus className="h-4 w-4" /> Tambah Leads
            </button>
          </div>
          <div className="space-y-2.5">
            {leads.map((c) => (
              <div key={c.id} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3.5">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[15px] font-bold text-slate-900">{c.name}</p>
                  <p className="mt-0.5 text-[13px] text-slate-500">
                    {c.status === "Closing" ? c.phone.replace("+62", "").replace(/(\d{3})(?=\d)/g, "$1 ") : `${c.status} · ${c.lastContact}`}
                  </p>
                </div>
                <a
                  href={`tel:${c.phone}`}
                  aria-label={`Telepon ${c.name}`}
                  className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-700"
                >
                  <Phone className="h-5 w-5" />
                </a>
                <a
                  href={`https://wa.me/${c.phone.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`WhatsApp ${c.name}`}
                  className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600"
                >
                  <MessageCircle className="h-5 w-5" />
                </a>
              </div>
            ))}
          </div>
          {isOnline && (
            <p className="mt-3 text-center text-[12px] text-slate-400">
              Leads dari link masuk otomatis — tak perlu input manual.
            </p>
          )}
        </div>
      </div>
    </MobileShell>
  );
}

function ShareLinkCard({ activityId, shareCode, views, leadsCount }: { activityId: string; shareCode?: string; views: number; leadsCount: number }) {
  const [copied, setCopied] = useState(false);
  const link = getShareLink({ id: activityId, shareCode } as { id: string; shareCode?: string });
  const fullLink = typeof window !== "undefined" ? window.location.origin + link : link;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(fullLink);
    } catch {
      /* abaikan */
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  const waText = encodeURIComponent(`Halo! Isi data di link ini ya biar kami bisa bantu pengajuan gadai emasnya:\n${fullLink}`);

  return (
    <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <p className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-slate-800">
          <Link2 className="h-4 w-4 text-blue-700" /> Link Pendaftaran Nasabah
        </p>
        <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-[11px] font-semibold text-green-600">
          Aktif
        </span>
      </div>
      <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5">
        <p className="flex-1 truncate text-[12px] text-slate-600">{fullLink}</p>
        <button
          onClick={copy}
          className="inline-flex flex-shrink-0 items-center gap-1 rounded-lg bg-blue-700 px-3 py-1.5 text-[12px] font-semibold text-white"
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Tersalin" : "Salin"}
        </button>
      </div>
      <div className="grid grid-cols-2 gap-2 text-center">
        <div className="rounded-lg bg-slate-50 p-2.5">
          <p className="inline-flex items-center gap-1 text-[18px] font-bold text-slate-900">
            <Eye className="h-4 w-4 text-slate-400" />{views}
          </p>
          <p className="text-[10px] uppercase tracking-wide text-slate-400">Dilihat</p>
        </div>
        <div className="rounded-lg bg-slate-50 p-2.5">
          <p className="text-[18px] font-bold text-slate-900">{leadsCount}</p>
          <p className="text-[10px] uppercase tracking-wide text-slate-400">Mengisi</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <a
          href={`https://wa.me/?text=${waText}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-green-100 py-2.5 text-[13px] font-semibold text-green-700"
        >
          <Share2 className="h-4 w-4" /> Bagikan WA
        </a>
        <Link
          to="/isi/$id"
          params={{ id: activityId }}
          search={{ k: shareCode ?? "" }}
          className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-blue-50 py-2.5 text-[13px] font-semibold text-blue-700"
        >
          <Eye className="h-4 w-4" /> Lihat Formulir
        </Link>
      </div>
    </div>
  );
}

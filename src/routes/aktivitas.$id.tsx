import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { MobileShell } from "@/components/mobile-shell";
import {
  activities,
  contacts,
  fillWaTemplate,
  formatTanggalPanjang,
  getShareCode,
  getShareLink,
  KELURAHAN_WILAYAH,
  PEKERJAAN_PROMAS,
  profile,
  STATUS_META,
  STATUS_NASABAH,
  WA_TEMPLATES,
  type Contact,
  type LeadStatus,
} from "@/lib/mock-data";
import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  Camera,
  Check,
  ChevronRight,
  Copy,
  Eye,
  Link2,
  LogOut,
  MapPin,
  MessageCircle,
  Phone,
  Plus,
  Share2,
  VideoOff,
  X,
} from "lucide-react";

const PRIMARY = "#2953A4";

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
  const [isDone, setIsDone] = useState(activity.status === "completed");
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(activity.photoUrl);
  const [checkInAt, setCheckInAt] = useState<string | undefined>(activity.checkInTime);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraMode, setCameraMode] = useState<"checkin" | "photo">("photo");

  const related = contacts.filter((c) => c.source === activity.type);
  const [leads, setLeads] = useState<Contact[]>(related.length > 0 ? related : contacts.slice(0, 3));

  const [leadModal, setLeadModal] = useState(false);
  const [waLead, setWaLead] = useState<Contact | null>(null);

  const meta = STATUS_META[isDone ? "completed" : checkedIn ? "checked_in" : "planned"];
  const startTime = activity.startTime ?? activity.timeRange.split(" - ")[0];

  const checkout = () => {
    setCheckedIn(false);
    setIsDone(true);
  };

  const nowHHMM = () => {
    const d = new Date();
    return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  };

  const openCamera = (m: "checkin" | "photo") => {
    setCameraMode(m);
    setCameraOpen(true);
  };

  const handleCameraSave = (url: string) => {
    setPhotoUrl(url);
    if (cameraMode === "checkin") {
      setCheckedIn(true);
      setCheckInAt(nowHHMM());
    }
    setCameraOpen(false);
  };

  const handleCameraSkip = () => {
    if (cameraMode === "checkin") {
      setCheckedIn(true);
      setCheckInAt(nowHHMM());
    }
    setCameraOpen(false);
  };

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
            <p className="text-[12px] font-medium" style={{ color: PRIMARY }}>
              {formatTanggalPanjang(activity.date, startTime)}
            </p>
            <p className={`flex-shrink-0 text-[12px] font-medium ${meta.className}`}>{meta.label}</p>
          </div>
          <div className="my-2.5 border-t border-slate-100" />
          <p className="text-[15px] font-bold text-slate-900">{activity.locationName}</p>
          <p className="mt-0.5 text-[13px] text-slate-500">
            {activity.kelurahan ? `${activity.kelurahan}, ` : ""}{activity.address}
          </p>
        </div>

        {isDone ? (
          <div className="rounded-xl border border-slate-200 bg-white px-4 py-8 text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-400">
              <Check className="h-7 w-7 text-white" strokeWidth={3} />
            </span>
            <p className="mt-3 text-[15px] font-semibold text-slate-900">Anda Telah Melakukan Checkout</p>
            <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-[12px] text-slate-500">
              Finished {activity.checkOutTime ?? ""}
            </span>
          </div>
        ) : checkedIn ? (
          <>
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="relative overflow-hidden rounded-lg bg-slate-100">
              {photoUrl ? (
                <img src={photoUrl} alt="Foto lokasi" className="h-52 w-full object-cover" />
              ) : (
                <div className="flex h-52 flex-col items-center justify-center gap-2 bg-gradient-to-br from-sky-100 to-slate-200 text-slate-400">
                  <Camera className="h-8 w-8" />
                  <p className="text-[12px]">Belum ada foto lokasi</p>
                </div>
              )}
              <button
                onClick={() => openCamera("photo")}
                aria-label="Ambil foto lokasi"
                className="absolute right-2.5 top-2.5 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow"
              >
                <Camera className="h-4 w-4" />
              </button>
            </div>
            <div className="-mt-0 flex justify-center">
              <button
                onClick={checkout}
                className="inline-flex -translate-y-1/2 items-center gap-1.5 rounded-full bg-red-500 px-5 py-2 text-[13px] font-semibold text-white shadow-lg shadow-red-500/30"
              >
                <LogOut className="h-4 w-4" /> Check Out {checkInAt ?? ""}
              </button>
            </div>
            {!photoUrl && (
              <button
                onClick={() => openCamera("photo")}
                className="-mt-2 w-full rounded-lg border border-dashed border-slate-300 py-2.5 text-[13px] font-medium text-slate-500"
              >
                + Tambah foto lokasi
              </button>
            )}
          </div>
          <ShareLinkCard
            activityId={activity.id}
            shareCode={activity.shareCode}
            views={activity.linkViews ?? 0}
            leadsCount={activity.leadsCount}
          />
          </>
        ) : (
          <div className="rounded-xl border border-slate-200 bg-white px-4 py-10 text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#2953A4]/10">
              <MapPin className="h-7 w-7 text-amber-500" fill="currentColor" />
            </span>
            <p className="mt-3 text-[14px] font-medium text-slate-700">Anda Belum Melakukan Check In</p>
            <p className="mx-auto mt-1 max-w-[260px] text-[12px] text-slate-400">
              Siapkan kamera — foto bukti check-in diambil langsung saat ini.
            </p>
            <button
              onClick={() => openCamera("checkin")}
              className="mt-3 inline-flex items-center gap-1.5 rounded-lg px-5 py-2 text-[13px] font-semibold text-white"
              style={{ background: PRIMARY }}
            >
              <MapPin className="h-4 w-4" /> Check In
            </button>
          </div>
        )}

        <div>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-[15px] font-bold text-slate-900">Detail Leads ({leads.length})</h3>
            <button
              onClick={() => setLeadModal(true)}
              className="inline-flex items-center gap-1.5 rounded-lg border px-3.5 py-2 text-[13px] font-medium"
              style={{ color: PRIMARY, borderColor: PRIMARY }}
            >
              <Plus className="h-4 w-4" /> Tambah Leads
            </button>
          </div>
          <div className="space-y-2.5">
            {leads.map((c) => (
              <div key={c.id} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3.5">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-bold text-slate-900">{c.name}</p>
                  <p className="mt-0.5 truncate text-[12px] text-slate-500">
                    {c.job ? `${c.job} | ${c.status}` : `${c.status} · ${c.lastContact}`}
                  </p>
                </div>
                <a
                  href={`tel:${c.phone}`}
                  aria-label={`Telepon ${c.name}`}
                  className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#2953A4]/10"
                  style={{ color: PRIMARY }}
                >
                  <Phone className="h-4.5 w-4.5" />
                </a>
                <button
                  onClick={() => setWaLead(c)}
                  aria-label={`WhatsApp ${c.name}`}
                  className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600"
                >
                  <MessageCircle className="h-4.5 w-4.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {cameraOpen && (
        <CameraModal
          mode={cameraMode}
          onClose={() => setCameraOpen(false)}
          onSave={handleCameraSave}
          onSkip={handleCameraSkip}
        />
      )}

      {leadModal && (
        <TambahLeadsModal
          activityType={activity.type}
          onClose={() => setLeadModal(false)}
          onSave={(c) => {
            setLeads((l) => [c, ...l]);
            setLeadModal(false);
          }}
        />
      )}

      {waLead && (
        <WaTemplateSheet
          lead={waLead}
          activityName={activity.locationName}
          activityDate={formatTanggalPanjang(activity.date)}
          coupon={getShareCode(activity)}
          onClose={() => setWaLead(null)}
        />
      )}
    </MobileShell>
  );
}

/* ---------------- Kamera ---------------- */

function CameraModal({
  mode,
  onClose,
  onSave,
  onSkip,
}: {
  mode: "checkin" | "photo";
  onClose: () => void;
  onSave: (url: string) => void;
  onSkip: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [perm, setPerm] = useState<"idle" | "requesting" | "granted" | "denied">("idle");
  const [unsupported, setUnsupported] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [captured, setCaptured] = useState<string | null>(null);
  const [clock, setClock] = useState("");

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      const p = (n: number) => String(n).padStart(2, "0");
      setClock(`${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`);
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(
    () => () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    },
    []
  );

  const requestCamera = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setUnsupported(true);
      setPerm("denied");
      return;
    }
    setPerm("requesting");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });
      streamRef.current = stream;
      setVideoReady(false);
      setPerm("granted");
    } catch {
      setPerm("denied");
    }
  };

  // Attach stream setiap kali elemen video mount (awal & setelah Ulangi)
  useEffect(() => {
    if (perm === "granted" && !captured && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(() => {});
    }
  }, [perm, captured]);

  const shutter = () => {
    const video = videoRef.current;
    if (!video || video.videoWidth === 0) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);
    // Stempel waktu bukti real-time
    const barH = Math.max(40, Math.round(canvas.height * 0.07));
    ctx.fillStyle = "rgba(0,0,0,0.55)";
    ctx.fillRect(0, canvas.height - barH, canvas.width, barH);
    ctx.fillStyle = "#fff";
    ctx.font = `${Math.round(barH * 0.42)}px sans-serif`;
    ctx.fillText(clock || new Date().toLocaleString("id-ID"), 16, canvas.height - barH * 0.32);
    setCaptured(canvas.toDataURL("image/jpeg", 0.85));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black">
      <div className="mx-auto flex h-full w-full max-w-[440px] flex-col">
        <button onClick={onClose} aria-label="Tutup kamera" className="absolute left-4 top-12 z-10 rounded-full bg-black/40 p-2 text-white">
          <ArrowLeft className="h-5 w-5" />
        </button>

        {perm === "granted" ? (
          <>
            <div className="relative flex-1 overflow-hidden bg-black">
              {captured ? (
                <img src={captured} alt="Hasil foto" className="h-full w-full object-cover" />
              ) : (
                <>
                  <video
                    ref={videoRef}
                    playsInline
                    muted
                    autoPlay
                    onLoadedMetadata={() => setVideoReady(true)}
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute right-4 top-14 inline-flex items-center gap-1.5 rounded-full bg-black/50 px-2.5 py-1 text-[11px] font-bold text-white">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" /> LIVE
                  </span>
                  <span className="absolute bottom-3 left-3 rounded-full bg-black/50 px-2.5 py-1 font-mono text-[11px] text-white">
                    {clock}
                  </span>
                </>
              )}
            </div>
            <div className="flex items-center justify-center gap-4 bg-black/90 px-6 py-6">
              {captured ? (
                <>
                  <button
                    onClick={() => setCaptured(null)}
                    className="flex-1 rounded-lg border border-white/40 py-3 text-[14px] font-medium text-white"
                  >
                    Ulangi
                  </button>
                  <button
                    onClick={() => onSave(captured)}
                    className="flex-1 rounded-lg bg-white py-3 text-[14px] font-semibold text-slate-900"
                  >
                    {mode === "checkin" ? "Simpan & Check In" : "Simpan"}
                  </button>
                </>
              ) : (
                <button
                  onClick={shutter}
                  disabled={!videoReady}
                  aria-label="Ambil foto"
                  className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-white bg-white/20 disabled:opacity-40"
                >
                  <Camera className="h-6 w-6 text-white" />
                </button>
              )}
            </div>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center bg-slate-900 px-8 text-center">
            {perm === "denied" ? (
              <>
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/15 text-red-400">
                  <VideoOff className="h-8 w-8" />
                </span>
                <p className="mt-4 text-[17px] font-bold text-white">Akses Kamera Ditolak</p>
                <p className="mt-2 text-[13px] leading-relaxed text-slate-300">
                  {unsupported
                    ? "Perangkat atau browser ini tidak mendukung akses kamera."
                    : "Izin kamera dibutuhkan untuk foto bukti check-in. Aktifkan lewat ikon kamera/gembok di address bar browser, lalu coba lagi."}
                </p>
                {!unsupported && (
                  <button
                    onClick={requestCamera}
                    className="mt-5 w-full rounded-lg bg-white py-3 text-[14px] font-semibold text-slate-900"
                  >
                    Coba Lagi
                  </button>
                )}
                {mode === "checkin" && (
                  <button onClick={onSkip} className="mt-2 w-full rounded-lg py-3 text-[14px] font-medium text-slate-300">
                    Lanjut Tanpa Foto
                  </button>
                )}
              </>
            ) : (
              <>
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-white">
                  <Camera className="h-8 w-8" />
                </span>
                <p className="mt-4 text-[17px] font-bold text-white">Izinkan Akses Kamera</p>
                <p className="mt-2 text-[13px] leading-relaxed text-slate-300">
                  {mode === "checkin"
                    ? "Kami akan mengambil foto sebagai bukti check-in yang valid dan real-time di lokasi ini."
                    : "Kami membutuhkan akses kamera untuk dokumentasi foto lokasi aktivitas."}
                </p>
                <button
                  onClick={requestCamera}
                  disabled={perm === "requesting"}
                  className="mt-5 w-full rounded-lg bg-white py-3 text-[14px] font-semibold text-slate-900 disabled:opacity-60"
                >
                  {perm === "requesting" ? "Meminta izin…" : "Aktifkan Kamera"}
                </button>
                <button onClick={onClose} className="mt-2 w-full rounded-lg py-3 text-[14px] font-medium text-slate-300">
                  Nanti Saja
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------- Tambah Leads ---------------- */

const GENDERS = ["Laki-Laki", "Perempuan"] as const;
const KELURAHAN = Object.keys(KELURAHAN_WILAYAH);

function TambahLeadsModal({
  activityType,
  onClose,
  onSave,
}: {
  activityType: string;
  onClose: () => void;
  onSave: (c: Contact) => void;
}) {
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
    onSave({
      id: `c-${Date.now()}`,
      name: name.trim(),
      phone: phone.trim(),
      status,
      source: activityType as Contact["source"],
      lastContact: "Baru saja",
      hasGold: status === "Hot" || status === "Warm",
      interested: status !== "Cold",
      gender: gender as Contact["gender"],
      address: address.trim() || undefined,
      kelurahan,
      wilayah: KELURAHAN_WILAYAH[kelurahan],
      job,
    });
  };

  const inputCls =
    "w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-[14px] text-slate-800 outline-none placeholder:text-slate-300";

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50">
      <div className="max-h-[92dvh] w-full max-w-[440px] overflow-y-auto rounded-t-2xl bg-white px-5 pb-6 pt-4">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-[16px] font-bold text-slate-900">Tambah Leads</h3>
          <button onClick={onClose} aria-label="Tutup" className="rounded-full p-1 text-slate-500">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-3.5">
          <div>
            <Label>Nama Calon Nasabah</Label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Masukkan Nama Lengkap" className={inputCls} />
          </div>
          <div>
            <Label>Jenis Kelamin</Label>
            <span className="relative block">
              <select value={gender} onChange={(e) => setGender(e.target.value)} className={`${inputCls} appearance-none ${!gender ? "text-slate-300" : ""}`}>
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
              <select value={kelurahan} onChange={(e) => setKelurahan(e.target.value)} className={`${inputCls} appearance-none ${!kelurahan ? "text-slate-300" : ""}`}>
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
            <input value={kelurahan ? (KELURAHAN_WILAYAH[kelurahan] ?? "") : ""} readOnly placeholder="" className={`${inputCls} bg-slate-50 text-slate-500`} />
          </div>
          <div>
            <Label>Pekerjaan Nasabah</Label>
            <span className="relative block">
              <select value={job} onChange={(e) => setJob(e.target.value)} className={`${inputCls} appearance-none ${!job ? "text-slate-300" : ""}`}>
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
              className={`${inputCls} flex items-center justify-between text-left ${!status ? "text-slate-300" : ""}`}
            >
              {status || "Pilih Status Nasabah"}
              <ChevronRight className="h-4 w-4 -translate-y-0 rotate-90 text-slate-400" />
            </button>
          </div>

          <button
            onClick={save}
            disabled={!valid}
            className={`w-full rounded-lg py-3 text-[14px] font-semibold text-white disabled:bg-slate-200 disabled:text-slate-400`}
            style={valid ? { background: PRIMARY } : undefined}
          >
            Simpan Data Nasabah
          </button>
        </div>
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
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="mb-1 block text-[12px] text-slate-600">{children}</label>;
}

function StatusPickerSheet({
  value,
  onPick,
  onClose,
}: {
  value: LeadStatus;
  onPick: (v: LeadStatus) => void;
  onClose: () => void;
}) {
  const [sel, setSel] = useState<LeadStatus>(value);
  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/50" onClick={onClose}>
      <div
        className="w-full max-w-[440px] rounded-t-2xl bg-white px-5 pb-6 pt-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between">
          <h4 className="text-[15px] font-bold text-slate-900">Status Nasabah</h4>
          <button onClick={onClose} aria-label="Tutup" className="rounded-full p-1 text-slate-500">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="space-y-1">
          {STATUS_NASABAH.map((s) => (
            <button
              key={s.value}
              onClick={() => setSel(s.value)}
              className="flex w-full items-center justify-between py-2.5 text-left"
            >
              <span>
                <span className="block text-[14px] text-slate-800">{s.value}</span>
                <span className="block text-[11px] text-slate-400">{s.desc}</span>
              </span>
              <span
                className="flex h-5 w-5 items-center justify-center rounded-full border-2"
                style={sel === s.value ? { borderColor: PRIMARY } : { borderColor: "#cbd5e1" }}
              >
                {sel === s.value && (
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: PRIMARY }} />
                )}
              </span>
            </button>
          ))}
        </div>
        <button
          onClick={() => onPick(sel)}
          className="mt-3 w-full rounded-lg py-3 text-[14px] font-semibold text-white"
          style={{ background: PRIMARY }}
        >
          Pilih Status Nasabah
        </button>
      </div>
    </div>
  );
}

/* ---------------- Template WA ---------------- */

function WaTemplateSheet({
  lead,
  activityName,
  activityDate,
  coupon,
  onClose,
}: {
  lead: Contact;
  activityName: string;
  activityDate: string;
  coupon: string;
  onClose: () => void;
}) {
  const vars = {
    nama_customer: lead.name,
    nama_sales: profile.name,
    nama_event: activityName,
    tanggal_event: activityDate,
    kode_kupon: coupon,
  };
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50" onClick={onClose}>
      <div
        className="max-h-[85dvh] w-full max-w-[440px] overflow-y-auto rounded-t-2xl bg-white px-5 pb-6 pt-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between">
          <h4 className="text-[15px] font-bold text-slate-900">Pilih Template WA</h4>
          <button onClick={onClose} aria-label="Tutup" className="rounded-full p-1 text-slate-500">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="space-y-2.5">
          {WA_TEMPLATES.map((t) => {
            const text = fillWaTemplate(t.body, vars);
            const href = `https://wa.me/${lead.phone.replace(/\D/g, "")}?text=${encodeURIComponent(text)}`;
            return (
              <a
                key={t.id}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="block rounded-xl bg-slate-900 p-3.5 text-white"
              >
                <p className="mb-1.5 text-[13px] font-semibold text-amber-300">{t.title}</p>
                <p className="whitespace-pre-line text-[12px] leading-relaxed text-slate-200">
                  {text.length > 220 ? text.slice(0, 220) + "…" : text}
                </p>
                <span
                  className="mt-2.5 inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-semibold text-white"
                  style={{ background: PRIMARY }}
                >
                  <Share2 className="h-3.5 w-3.5" /> Kirim via WhatsApp
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Share link (online) ---------------- */

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
          <Link2 className="h-4 w-4" style={{ color: PRIMARY }} /> Link Pendaftaran Nasabah
        </p>
        <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-[11px] font-semibold text-green-600">
          Aktif
        </span>
      </div>
      <p className="-mt-1 text-[12px] leading-relaxed text-slate-500">
        Aktivitas sedang berjalan — bagikan link ini ke nasabah. Mereka isi data sendiri,
        otomatis tercatat sebagai leads.
      </p>
      <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5">
        <p className="flex-1 truncate text-[12px] text-slate-600">{fullLink}</p>
        <button
          onClick={copy}
          className="inline-flex flex-shrink-0 items-center gap-1 rounded-lg px-3 py-1.5 text-[12px] font-semibold text-white"
          style={{ background: PRIMARY }}
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
          className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#2953A4]/10 py-2.5 text-[13px] font-semibold"
          style={{ color: PRIMARY }}
        >
          <Eye className="h-4 w-4" /> Lihat Formulir
        </Link>
      </div>
    </div>
  );
}

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Camera, VideoOff } from "lucide-react";

export function CameraModal({
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


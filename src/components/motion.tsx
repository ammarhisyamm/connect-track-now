import { useEffect, useState, useSyncExternalStore } from "react";
import { useRouterState } from "@tanstack/react-router";

/* ---------- hooks ---------- */

export function useReducedMotion() {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false
  );
}

/** true hanya jika kondisi aktif lebih dari `delay` — cegah flash skeleton. */
export function useDelayedLoading(active: boolean, delay = 300) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (!active) {
      setShow(false);
      return;
    }
    const t = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(t);
  }, [active, delay]);
  return show;
}

/** busy state dengan durasi tampil minimum — cegah flicker tombol submit. */
export function useMinBusy(ms = 400) {
  const [busy, setBusy] = useState(false);
  const run = async (fn: () => void | Promise<void>) => {
    if (busy) return;
    setBusy(true);
    const t0 = Date.now();
    try {
      await fn();
    } finally {
      const wait = Math.max(0, ms - (Date.now() - t0));
      setTimeout(() => setBusy(false), wait);
    }
  };
  return [busy, run] as const;
}

/* ---------- transitions ---------- */

export function PageTransition({
  variant,
  children,
}: {
  variant: "push" | "fade";
  children: React.ReactNode;
}) {
  return (
    <div className={variant === "push" ? "motion-page-push" : "motion-page-fade"}>
      {children}
    </div>
  );
}

/** Bar progres tipis saat navigasi chunk-loading >200ms. */
export function TopProgressBar() {
  const isLoading = useRouterState({ select: (s) => s.isLoading });
  const show = useDelayedLoading(isLoading, 200);
  if (!show) return null;
  return (
    <div
      className="fixed left-1/2 top-0 z-[70] h-[3px] w-full max-w-[440px] -translate-x-1/2 overflow-hidden"
      role="status"
      aria-label="Memuat halaman"
    >
      <div className="motion-progress-bar h-full w-1/3 rounded-full bg-[#2953A4]" />
    </div>
  );
}

/* ---------- spinner ---------- */

export function Spinner({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      className={`animate-spin ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      role="status"
      aria-label="Memuat"
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
      <path
        d="M22 12a10 10 0 0 0-10-10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ---------- toast ---------- */

type ToastMsg = { id: number; text: string };
let toastId = 0;
let toasts: ToastMsg[] = [];
const toastListeners = new Set<(t: ToastMsg[]) => void>();

export function toast(text: string) {
  const id = ++toastId;
  toasts = [...toasts.slice(-2), { id, text }];
  toastListeners.forEach((l) => l(toasts));
  setTimeout(() => {
    toasts = toasts.filter((t) => t.id !== id);
    toastListeners.forEach((l) => l(toasts));
  }, 2500);
}

export function Toaster() {
  const [items, setItems] = useState<ToastMsg[]>([]);
  useEffect(() => {
    const fn = (t: ToastMsg[]) => setItems(t);
    toastListeners.add(fn);
    return () => {
      toastListeners.delete(fn);
    };
  }, []);
  return (
    <div
      className="pointer-events-none fixed bottom-24 left-1/2 z-[65] flex w-full max-w-[440px] -translate-x-1/2 flex-col items-center gap-2 px-6"
      aria-live="polite"
    >
      {items.map((t) => (
        <div
          key={t.id}
          role="status"
          className="motion-toast-in rounded-full bg-slate-900 px-4 py-2.5 text-[13px] font-medium text-white shadow-lg"
        >
          {t.text}
        </div>
      ))}
    </div>
  );
}

/* ---------- skeleton ---------- */

/** Blok skeleton; shimmer berhenti otomatis setelah 5 detik. */
export function Skeleton({ className = "" }: { className?: string }) {
  const [static_, setStatic] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setStatic(true), 5000);
    return () => clearTimeout(t);
  }, []);
  return (
    <div
      aria-hidden
      className={`rounded-lg bg-slate-200 ${static_ ? "" : "motion-skeleton"} ${className}`}
    />
  );
}

/** Berapa lama skeleton tampil tiap pindah layar. Kecilkan/Nol-kan kalau data sudah async. */
export const SCREEN_SKELETON_MS = 450;

let hasNavigated = false;

/**
 * Tampilkan skeleton setiap kali layar di-mount akibat navigasi.
 * Load pertama (SSR/hydration) langsung render konten — tanpa flash.
 * Form tidak memakai ini supaya input langsung bisa diketik.
 */
export function ScreenLoader({
  skeleton,
  children,
}: {
  skeleton: React.ReactNode;
  children: React.ReactNode;
}) {
  const [ready, setReady] = useState(() => !hasNavigated);
  useEffect(() => {
    if (!hasNavigated) {
      hasNavigated = true;
      setReady(true);
      return;
    }
    const t = setTimeout(() => setReady(true), SCREEN_SKELETON_MS);
    return () => clearTimeout(t);
  }, []);
  if (!ready) {
    return (
      <div aria-busy role="status" aria-label="Memuat konten">
        <span className="sr-only">Memuat konten…</span>
        <div aria-hidden>{skeleton}</div>
      </div>
    );
  }
  return <>{children}</>;
}

/** Daftar baris skeleton + pengumuman aksesibel tunggal. */
export function SkeletonRows({ n = 3, className = "" }: { n?: number; className?: string }) {  return (
    <div className={className} aria-busy role="status" aria-label="Memuat konten">
      <span className="sr-only">Memuat konten…</span>
      <div className="space-y-3" aria-hidden>
        {Array.from({ length: n }).map((_, i) => (
          <div key={i} className="rounded-xl border border-slate-200 bg-white p-4">
            <Skeleton className="h-3 w-2/3" />
            <Skeleton className="mt-2 h-4 w-full" />
            <Skeleton className="mt-1.5 h-3 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { MobileShell } from "@/components/mobile-shell";
import { ScreenLoader } from "@/components/motion";
import { NotifikasiSkeleton } from "@/components/skeletons";
import { notifications } from "@/lib/mock-data";
import { useState } from "react";
import {
  ArrowLeft,
  ClipboardList,
  Gift,
  Globe,
  Mail,
  Megaphone,
  MessageCircle,
} from "lucide-react";

export const Route = createFileRoute("/notifikasi")({
  head: () => ({ meta: [{ title: "Notifikasi" }] }),
  component: NotifikasiPage,
});

const ICONS = {
  megaphone: Megaphone,
  globe: Globe,
  clipboard: ClipboardList,
  gift: Gift,
} as const;

const READ_KEY = "connect-track-notif-read-v1";

function loadRead(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(READ_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function NotifikasiPage() {
  const [readIds, setReadIds] = useState<string[]>(loadRead);

  const markRead = (id: string) => {
    setReadIds((prev) => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      try {
        window.localStorage.setItem(READ_KEY, JSON.stringify(next));
      } catch {
        /* abaikan */
      }
      return next;
    });
  };

  return (
    <MobileShell hideNav>
      <div className="bg-white px-5 pb-2 pt-12">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-900">
          <ArrowLeft className="h-5 w-5" />
          <span className="text-[17px] font-medium">Notifikasi</span>
        </Link>
      </div>

      {notifications.length === 0 ? (
        <div className="flex min-h-[70vh] flex-col items-center justify-center bg-white px-8 pb-8 text-center">
          <span className="relative flex h-28 w-36 items-center justify-center rounded-2xl bg-slate-100">
            <MessageCircle className="h-12 w-12 -translate-x-3 -translate-y-2 text-slate-500" fill="currentColor" />
            <Mail className="absolute bottom-4 right-6 h-10 w-10 translate-x-1 text-slate-600" />
          </span>
          <p className="mt-6 text-[20px] font-bold text-slate-900">Belum Ada Notifikasi</p>
          <p className="mt-2 text-[14px] leading-relaxed text-slate-500">
            Anda akan menerima pemberitahuan di sini saat ada informasi terbaru.
          </p>
        </div>
      ) : (
        <ScreenLoader skeleton={<NotifikasiSkeleton />}>
        <div className="bg-white pb-8">
          {notifications.map((n) => {
            const Icon = ICONS[n.icon];
            const unread = n.unread && !readIds.includes(n.id);
            return (
              <button
                key={n.id}
                onClick={() => markRead(n.id)}
                className={`flex w-full gap-3 border-b border-slate-100 px-5 py-4 text-left transition-colors duration-150 active:bg-slate-50 ${
                  unread ? "bg-[#2953A4]/5" : "bg-white"
                }`}
              >
                <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-[#2953A4]/10 text-[#2953A4]">
                  <Icon className="h-6 w-6" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[15px] font-bold leading-snug text-slate-900">
                    {n.title}
                  </span>
                  <span className="mt-1 block text-[14px] leading-relaxed text-slate-500">
                    {n.body.map((c, i) =>
                      c.b ? (
                        <b key={i} className="font-semibold text-slate-600">{c.t}</b>
                      ) : (
                        <span key={i}>{c.t}</span>
                      )
                    )}
                  </span>
                  <span className="mt-1.5 block text-[12px] text-slate-400">{n.date}</span>
                </span>
              </button>
            );
          })}
        </div>
        </ScreenLoader>
      )}
    </MobileShell>
  );
}

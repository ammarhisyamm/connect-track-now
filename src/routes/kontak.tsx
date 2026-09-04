import { createFileRoute } from "@tanstack/react-router";
import { MobileShell } from "@/components/mobile-shell";
import { contacts } from "@/lib/mock-data";
import { MapPin, MessageCircle, Phone, Search, UserRound } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/kontak")({
  head: () => ({ meta: [{ title: "Kontak" }] }),
  component: ContactsPage,
});

const TABS = ["Semua", "Belum Closing", "Closing"] as const;

const STATUS_COLOR: Record<string, string> = {
  Hot: "text-red-500",
  Warm: "text-amber-500",
  Cold: "text-slate-400",
  Closing: "text-green-500",
};

function shortLocation(c: { kelurahan?: string; wilayah?: string; address?: string }) {
  if (c.kelurahan && c.wilayah) {
    const parts = c.wilayah.split(",").map((s) => s.trim());
    const city = parts[1] ?? parts[0];
    return `${c.kelurahan}, ${city}`;
  }
  return c.address ?? "-";
}

function ContactsPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Semua");
  const [q, setQ] = useState("");

  const filtered = contacts.filter((c) => {
    if (tab === "Belum Closing" && c.status === "Closing") return false;
    if (tab === "Closing" && c.status !== "Closing") return false;
    if (q && !c.name.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  const closingCount = contacts.filter((c) => c.status === "Closing").length;

  return (
    <MobileShell hideFab>
      <div className="bg-white px-5 pb-2 pt-12">
        <h1 className="text-[22px] font-bold text-slate-900">Kontak</h1>
      </div>

      <div className="space-y-4 bg-white px-5 pb-8 pt-3">
        <div className="rounded-xl border border-slate-200 p-2">
          <div className="flex items-center gap-2 rounded-lg border border-slate-200 px-3.5 py-2.5">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Cari nama kontak"
              className="flex-1 bg-transparent text-[14px] text-slate-800 outline-none placeholder:text-slate-400"
            />
            <Search className="h-4.5 w-4.5 text-slate-400" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-[#2953A4]/10 p-3.5">
            <p className="text-[14px] text-slate-600">Total Kontak</p>
            <p className="mt-1 text-[18px] font-semibold text-slate-900">{contacts.length}</p>
          </div>
          <div className="rounded-xl bg-[#2953A4]/10 p-3.5">
            <p className="text-[14px] text-slate-600">Closing Kontak</p>
            <p className="mt-1 text-[18px] font-semibold text-slate-900">{closingCount}</p>
          </div>
        </div>

        <div className="flex gap-2">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-full border px-4 py-2 text-[13px] font-medium transition-colors ${
                tab === t
                  ? "border-[#2953A4] bg-[#2953A4] text-white"
                  : "border-slate-200 bg-white text-slate-500"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {filtered.map((c) => (
            <div key={c.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white">
              <div className="p-4 pb-3">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[16px] font-bold text-slate-900">{c.name}</p>
                  <span className={`flex-shrink-0 text-[14px] font-medium ${STATUS_COLOR[c.status] ?? "text-slate-400"}`}>
                    {c.status}
                  </span>
                </div>
                <p className="mt-0.5 text-[13px] text-slate-500">{c.job ?? "-"}</p>

                <div className="mt-3 rounded-lg border border-slate-200 p-3">
                  <p className="flex items-center gap-1.5 text-[13px] text-slate-500">
                    <UserRound className="h-4 w-4" /> Sumber Kontak
                  </p>
                  <p className="mt-1 text-[15px] font-bold text-slate-900">{c.source}</p>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2.5">
                  <a
                    href={`tel:${c.phone}`}
                    className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#2953A4]/10 py-2.5 text-[14px] font-medium text-[#2953A4]"
                  >
                    <Phone className="h-4 w-4" /> Telepon
                  </a>
                  <a
                    href={`https://wa.me/${c.phone.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 rounded-full bg-green-50 py-2.5 text-[14px] font-medium text-green-600"
                  >
                    <MessageCircle className="h-4 w-4" /> Whatsapp
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-1.5 bg-[#2953A4]/10 px-4 py-2.5 text-[13px] font-medium text-[#2953A4]">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{shortLocation(c)}</span>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="rounded-xl border border-slate-200 p-8 text-center text-sm text-slate-400">
              Tidak ada kontak.
            </div>
          )}
        </div>
      </div>
    </MobileShell>
  );
}

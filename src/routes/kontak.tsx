import { createFileRoute } from "@tanstack/react-router";
import { MobileShell, ScreenHeader } from "@/components/mobile-shell";
import { contacts } from "@/lib/mock-data";
import { Phone, MessageCircle, Search, Bell } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/kontak")({
  head: () => ({ meta: [{ title: "Daftar Kontak" }] }),
  component: ContactsPage,
});

const TABS = ["Semua", "Belum Closing", "Closing"] as const;

function ContactsPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Semua");
  const [q, setQ] = useState("");

  const filtered = contacts.filter((c) => {
    if (tab === "Belum Closing" && c.status === "Closing") return false;
    if (tab === "Closing" && c.status !== "Closing") return false;
    if (q && !c.name.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  const needsFollowUp = contacts.filter((c) => c.status !== "Closing").length;

  return (
    <MobileShell>
      <ScreenHeader
        title="Daftar Kontak"
        subtitle={`${needsFollowUp} leads perlu di-follow up`}
      />
      <div className="-mt-3 px-5">
        <div className="soft-card flex items-center gap-2 px-3 py-2.5">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cari nama kontak…"
            className="flex-1 bg-transparent text-sm outline-none"
          />
        </div>

        {needsFollowUp > 0 && (
          <div className="mt-4 flex items-center gap-3 rounded-2xl bg-accent/30 p-3 text-accent-foreground">
            <Bell className="h-4 w-4" />
            <p className="text-xs font-medium">
              Ada {needsFollowUp} leads yang belum closing — yuk follow up!
            </p>
          </div>
        )}

        <div className="mt-4 inline-flex rounded-full bg-secondary p-1 text-xs">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-full px-3 py-1.5 font-medium transition-colors ${
                tab === t ? "bg-brand text-brand-foreground" : "text-muted-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="mt-4 space-y-2.5">
          {filtered.map((c) => (
            <div key={c.id} className="soft-card p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-brand/10 text-sm font-bold text-brand">
                  {c.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-semibold">{c.name}</p>
                    <StatusBadge status={c.status} />
                  </div>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    {c.source} · {c.lastContact}
                  </p>
                  {c.note && (
                    <p className="mt-1.5 rounded-lg bg-secondary/60 px-2 py-1.5 text-[11px] text-muted-foreground">
                      💬 {c.note}
                    </p>
                  )}
                  <div className="mt-3 flex gap-2">
                    <a
                      href={`tel:${c.phone}`}
                      className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-brand/10 py-2 text-xs font-semibold text-brand"
                    >
                      <Phone className="h-3.5 w-3.5" /> Telepon
                    </a>
                    <a
                      href={`https://wa.me/${c.phone.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-success/15 py-2 text-xs font-semibold text-success"
                    >
                      <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MobileShell>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Hot: "bg-destructive/15 text-destructive",
    Warm: "bg-warning/20 text-warning-foreground",
    Cold: "bg-secondary text-muted-foreground",
    Closing: "bg-success/15 text-success",
  };
  return <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${map[status]}`}>{status}</span>;
}

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { MobileShell } from "@/components/mobile-shell";
import {
  formatRupiah,
  GRADES,
  LEAD_DISTRIBUTION,
  LEAD_TOTAL,
  profile,
  QUADRANT_DESC,
} from "@/lib/mock-data";
import { useState } from "react";
import { ChevronRight, LogOut, Settings, ShieldCheck, UserRound } from "lucide-react";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile" }] }),
  component: ProfilePage,
});

const PRIMARY = "#2953A4";

function ProfilePage() {
  const nav = useNavigate();
  const [logoutOpen, setLogoutOpen] = useState(false);

  const gradeIdx = GRADES.indexOf(profile.grade);
  const bookingPct = Math.round((profile.booking / profile.bookingEstimate) * 100);
  const rp = (n: number) => formatRupiah(n).replace("Rp", "Rp ");

  return (
    <MobileShell hideFab>
      <div className="bg-white px-5 pb-2 pt-12">
        <h1 className="text-[22px] font-bold text-slate-900">Profile</h1>
      </div>

      <div className="space-y-4 bg-white px-5 pb-8 pt-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-[#2953A4]/10 text-[#2953A4]">
              <UserRound className="h-7 w-7" />
            </span>
            <div>
              <p className="text-[16px] font-bold text-slate-900">Sales Gadai MAS</p>
              <p className="mt-0.5 text-[13px] text-slate-500">{profile.phone}</p>
            </div>
          </div>
          <div className="my-3 border-t border-slate-100" />
          <div className="grid grid-cols-2 text-[13px] text-slate-500">
            <p>{profile.region}</p>
            <p className="border-l border-slate-200 pl-3">{profile.unit}</p>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <p className="text-[13px] text-slate-500">Grade Periode</p>
            <p className="text-[15px] font-bold text-slate-900">{profile.gradeProgress}%</p>
          </div>
          <p className="mt-1 text-[16px] font-bold text-slate-900">Progress menuju Platinum</p>

          <div className="mt-4 px-1">
            <div className="relative flex items-center justify-between">
              <span className="absolute left-3 right-3 top-1/2 h-0.5 -translate-y-1/2 bg-slate-200" />
              <span
                className="absolute left-3 top-1/2 h-0.5 -translate-y-1/2"
                style={{
                  background: "#2953A4",
                  width: `calc((100% - 24px) * ${(gradeIdx / (GRADES.length - 1)).toFixed(3)})`,
                }}
              />
              {GRADES.map((g, i) => (
                <span
                  key={g}
                  className="relative z-10 flex h-6 w-6 items-center justify-center rounded-full border-2 bg-white"
                  style={i <= gradeIdx ? { borderColor: PRIMARY } : { borderColor: "#cbd5e1" }}
                >
                  {i <= gradeIdx && <span className="h-2.5 w-2.5 rounded-full" style={{ background: PRIMARY }} />}
                </span>
              ))}
            </div>
            <div className="mt-1.5 flex justify-between text-[11px] text-slate-600">
              {GRADES.map((g) => (
                <span key={g} className="w-12 text-center first:text-left last:text-right">{g}</span>
              ))}
            </div>
          </div>

          <div className="mt-4 rounded-xl bg-[#2953A4]/10 p-3.5">
            <div className="flex items-center justify-between text-[13px]">
              <p className="font-medium text-slate-800">Booking Periode berjalan</p>
              <p className="font-bold text-slate-900">{bookingPct}%</p>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white">
              <div className="h-full rounded-full" style={{ width: `${bookingPct}%`, background: PRIMARY }} />
            </div>
            <p className="mt-1.5 text-[12px] text-slate-500">
              {rp(profile.booking)} dari target {rp(profile.bookingEstimate)}
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <p className="text-[13px] text-slate-500">Grade Periode</p>
            <span className="rounded-md bg-green-50 px-2 py-0.5 text-[12px] font-semibold text-green-600">
              Kuadran {profile.quadrant}
            </span>
          </div>
          <p className="mt-1 text-[16px] font-bold text-slate-900">Aktivitas vs leads</p>

          <div className="mt-3 flex gap-1.5">
            <p className="w-4 self-center -rotate-90 text-[11px] text-slate-400">Leads</p>
            <div className="flex-1">
              <div className="grid grid-cols-2 overflow-hidden rounded-xl border border-slate-200">
                {(["II", "IV", "I", "III"] as const).map((q) => {
                  const active = q === profile.quadrant;
                  return (
                    <div
                      key={q}
                      className={`border-slate-200 p-3 ${active ? "bg-[#2953A4]/10" : "bg-white"} ${
                        q === "II" ? "border-b border-r" : q === "IV" ? "border-b" : q === "I" ? "border-r" : ""
                      }`}
                    >
                      <p className="text-[12px] font-bold text-slate-800">Kuadran {q}</p>
                      <p className="mt-0.5 text-[11px] leading-snug text-slate-500">
                        {QUADRANT_DESC[q].leads}, {QUADRANT_DESC[q].aktivitas}
                      </p>
                    </div>
                  );
                })}
              </div>
              <div className="mt-1.5 flex justify-between text-[11px] text-slate-400">
                <span>Rendah</span>
                <span>Aktivitas</span>
                <span>Tinggi</span>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <p className="text-[13px] text-slate-500">Distribusi Leads</p>
            <span className="rounded-md bg-green-50 px-2 py-0.5 text-[12px] font-semibold text-green-600">
              Kuadran {profile.quadrant}
            </span>
          </div>
          <p className="mt-1 text-[16px] font-bold text-slate-900">Status leads</p>

          <Donut />

          <div className="mt-4 space-y-3">
            {LEAD_DISTRIBUTION.map((l) => (
              <div key={l.label}>
                <div className="flex items-center gap-2">
                  <span className="h-6 w-1.5 rounded-full" style={{ background: l.color }} />
                  <p className="flex-1 text-[14px] text-slate-700">{l.label}</p>
                  <p className="text-[13px] text-slate-500">{l.pct}%</p>
                </div>
                <div className="mt-1.5 grid grid-cols-2 gap-2 pl-3.5">
                  <p className="rounded-lg bg-[#2953A4]/10 px-3 py-1.5 text-[13px] font-medium text-[#2953A4]">
                    {l.leads} Leads
                  </p>
                  <p className="rounded-lg bg-green-50 px-3 py-1.5 text-[13px] font-medium text-green-600">
                    {l.closing} Closing
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 flex items-center justify-between border-t border-dashed border-slate-200 pt-3 text-[14px]">
            <p className="font-medium text-slate-700">Total</p>
            <p className="font-semibold text-[#2953A4]">
              {LEAD_TOTAL.leads} Leads / {LEAD_TOTAL.closing} Closing
            </p>
          </div>
        </div>

        <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">
          <Link to="/ubah-password" className="flex w-full items-center gap-3 p-4 text-left">
            <Settings className="h-5 w-5 text-slate-700" />
            <span className="flex-1 text-[14px] text-slate-800">Ubah Password</span>
            <ChevronRight className="h-4 w-4 text-slate-400" />
          </Link>
          <button onClick={() => setLogoutOpen(true)} className="flex w-full items-center gap-3 p-4 text-left">
            <LogOut className="h-5 w-5 text-slate-700" />
            <span className="flex-1 text-[14px] text-slate-800">Keluar</span>
            <span className="text-[13px] text-slate-400">Versi 1.0</span>
            <ChevronRight className="h-4 w-4 text-slate-400" />
          </button>
        </div>
      </div>

      {logoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-8">
          <div className="w-full max-w-[320px] rounded-2xl bg-white p-6 text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#2953A4]">
              <ShieldCheck className="h-8 w-8 text-amber-300" />
            </span>
            <p className="mt-3 text-[16px] font-bold text-slate-900">Keluar dari Akun</p>
            <p className="mt-1 text-[12px] text-slate-500">Yakin ingin keluar dari akun sales tracking?</p>
            <button
              onClick={() => setLogoutOpen(false)}
              className="mt-4 w-full rounded-lg bg-[#2953A4] py-2.5 text-[14px] font-semibold text-white"
            >
              Batal
            </button>
            <button
              onClick={() => nav({ to: "/login" })}
              className="mt-2 w-full rounded-lg border border-red-300 py-2.5 text-[14px] font-medium text-red-500"
            >
              Ya, Keluar
            </button>
          </div>
        </div>
      )}
    </MobileShell>
  );
}

function Donut() {
  const size = 220;
  const r = 78;
  const c = 2 * Math.PI * r;
  const gap = 3; // px putih antar segmen ala chart standar
  const total = LEAD_DISTRIBUTION.reduce((s, l) => s + l.pct, 0);
  let acc = 0;
  const segs = LEAD_DISTRIBUTION.map((l) => {
    const frac = l.pct / total;
    const start = acc;
    acc += frac;
    return { ...l, frac, start, mid: (start + frac / 2) * 2 * Math.PI };
  });

  return (
    <div className="mt-2 flex justify-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
          {segs.map((s) => {
            const len = Math.max(s.frac * c - gap, 0.5);
            return (
              <circle
                key={s.label}
                cx={size / 2}
                cy={size / 2}
                r={r}
                fill="none"
                stroke={s.color}
                strokeWidth={34}
                strokeLinecap="butt"
                strokeDasharray={`${len} ${c - len}`}
                strokeDashoffset={-s.start * c + gap / 2}
              />
            );
          })}
        </g>
        {segs
          .filter((s) => s.pct >= 8)
          .map((s) => {
            const x = size / 2 + r * Math.cos(s.mid - Math.PI / 2);
            const y = size / 2 + r * Math.sin(s.mid - Math.PI / 2);
            return (
              <text
                key={s.label}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="central"
                fill="#fff"
                fontSize={12}
                fontWeight={600}
              >
                {s.pct}%
              </text>
            );
          })}
        <text x={size / 2} y={size / 2 - 8} textAnchor="middle" fill="#0f172a" fontSize={22} fontWeight={800}>
          {LEAD_TOTAL.leads}
        </text>
        <text x={size / 2} y={size / 2 + 14} textAnchor="middle" fill="#64748b" fontSize={12}>
          Leads
        </text>
      </svg>
    </div>
  );
}

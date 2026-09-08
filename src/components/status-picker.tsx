import { useState } from "react";
import { X } from "lucide-react";
import { STATUS_NASABAH, type LeadStatus } from "@/lib/mock-data";

const PRIMARY = "#2953A4";

export function StatusPickerSheet({
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
    <div className="motion-backdrop-in fixed inset-0 z-[60] flex items-end justify-center bg-black/50" onClick={onClose}>
      <div
        className="motion-sheet-in w-full max-w-[440px] rounded-t-2xl bg-white px-5 pb-6 pt-4"
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

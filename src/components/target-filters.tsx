import { Building2, ChevronDown } from "lucide-react";

const MONTHS = [
  "Januari 2026",
  "Februari 2026",
  "Maret 2026",
  "April 2026",
  "Mei 2026",
  "Juni 2026",
  "Juli 2026",
  "Agustus 2026",
  "September 2026",
  "Oktober 2026",
  "November 2026",
  "Desember 2026",
];

type TargetFiltersProps = {
  period: string;
  onPeriodChange: (period: string) => void;
  unit: string;
  units: string[];
  onUnitChange: (unit: string) => void;
};

export function TargetFilters({ period, onPeriodChange, unit, units, onUnitChange }: TargetFiltersProps) {
  return (
    <div className="flex flex-wrap gap-3">
      <label className="relative">
        <select value={period} onChange={(event) => onPeriodChange(event.target.value)} className="appearance-none rounded-xl border border-slate-300 bg-white px-4 py-3 pr-11 text-[15px] font-medium">
          {MONTHS.map((month) => <option key={month}>{month}</option>)}
        </select>
        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2" />
      </label>
      <label className="relative">
        <select value={unit} onChange={(event) => onUnitChange(event.target.value)} className="appearance-none rounded-xl border border-slate-300 bg-white px-4 py-3 pl-11 pr-11 text-[15px] font-medium">
          <option>Semua Unit</option>
          {units.map((item) => <option key={item}>{item}</option>)}
        </select>
        <Building2 className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#292663]" />
        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2" />
      </label>
    </div>
  );
}

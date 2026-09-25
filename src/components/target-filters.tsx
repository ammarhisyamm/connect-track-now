import { useEffect, useRef, useState } from "react";
import { Building2, Calendar, CalendarDays, ChevronDown, Star } from "lucide-react";

const MONTHS = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
const YEARS = ["2025", "2026", "2027"];

type TargetFiltersProps = {
  period: string;
  onPeriodChange: (period: string) => void;
  unit: string;
  units: string[];
  onUnitChange: (unit: string) => void;
  grade?: string;
  grades?: string[];
  onGradeChange?: (grade: string) => void;
  showUnit?: boolean;
};

export function TargetFilters({ period, onPeriodChange, unit, units, onUnitChange, grade, grades = [], onGradeChange, showUnit = true }: TargetFiltersProps) {
  const [month, year] = period.split(" ");
  return (
    <div className="flex flex-wrap gap-3">
      {onGradeChange && <FilterSelect value={grade ?? "Semua Grade"} options={["Semua Grade", ...grades]} onChange={onGradeChange} icon={<Star className="h-5 w-5 text-[#292663]" />} />}
      <FilterSelect value={month} options={MONTHS} onChange={(value) => onPeriodChange(`${value} ${year || YEARS[1]}`)} icon={<CalendarDays className="h-5 w-5 text-[#292663]" />} />
      <FilterSelect value={year || YEARS[1]} options={YEARS} onChange={(value) => onPeriodChange(`${month || MONTHS[0]} ${value}`)} icon={<Calendar className="h-5 w-5 text-[#292663]" />} />
      {showUnit && <FilterSelect value={unit} options={["Semua Unit", ...units]} onChange={onUnitChange} icon={<Building2 className="h-5 w-5 text-[#292663]" />} />}
    </div>
  );
}

function FilterSelect({ value, options, onChange, icon }: { value: string; options: string[]; onChange: (value: string) => void; icon?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return <div ref={ref} className="relative min-w-[150px]">
    <button type="button" onClick={() => setOpen((current) => !current)} className="flex w-full items-center gap-3 rounded-xl border border-slate-300 bg-white px-4 py-3 text-left text-[15px] font-medium">
      {icon}
      <span className="flex-1 whitespace-nowrap">{value}</span>
      <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
    </button>
    {open && <div className="absolute left-0 top-full z-50 mt-1.5 max-h-[50vh] min-w-full overflow-y-auto rounded-xl border border-slate-200 bg-white p-1 shadow-[0_12px_28px_rgba(23,24,45,0.18)]">
      {options.map((option) => <button key={option} type="button" onClick={() => { onChange(option); setOpen(false); }} className={`block w-full whitespace-nowrap rounded-lg px-4 py-3 text-left text-[15px] transition-colors ${option === value ? "bg-[#dcfce7] text-[#17182d]" : "text-[#17182d] hover:bg-slate-50"}`}>{option}</button>)}
    </div>}
  </div>;
}

import * as React from "react";
import { X, RotateCcw } from "lucide-react";

interface FilterChipsProps {
  activeFilters: { key: string; label: string; value: string }[];
  onRemoveFilter: (key: string) => void;
  onClearAll: () => void;
}

export function FilterChips({ activeFilters, onRemoveFilter, onClearAll }: FilterChipsProps) {
  if (activeFilters.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 pt-2" dir="rtl">
      <span className="text-[11px] font-bold text-slate-400">الفلاتر النشطة:</span>

      {activeFilters.map((filter) => (
        <span
          key={filter.key}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-orange-500/10 border border-orange-500/20 text-[#F58220] text-xs font-bold"
        >
          <span>{filter.label}:</span>
          <span className="text-slate-800 dark:text-white font-semibold">{filter.value}</span>
          <button
            onClick={() => onRemoveFilter(filter.key)}
            className="hover:text-rose-500 transition-colors p-0.5"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </span>
      ))}

      <button
        onClick={onClearAll}
        className="text-[11px] font-bold text-slate-500 hover:text-rose-500 underline flex items-center gap-1 mr-2 transition-colors cursor-pointer"
      >
        <RotateCcw className="w-3 h-3" />
        إلغاء الكل
      </button>
    </div>
  );
}
export default FilterChips;

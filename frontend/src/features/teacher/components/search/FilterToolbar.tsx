import * as React from "react";
import { Search, Filter, Calendar, ArrowUpDown, RotateCcw } from "lucide-react";
import { DateRangePickerModal } from "./DateRangePickerModal";
import { FilterChips } from "./FilterChips";

export interface FilterOption {
  value: string;
  label: string;
}

interface FilterToolbarProps {
  search?: string;
  onSearchChange?: (val: string) => void;
  status?: string;
  onStatusChange?: (val: string) => void;
  statusOptions?: FilterOption[];
  category?: string;
  onCategoryChange?: (val: string) => void;
  categoryOptions?: FilterOption[];
  sort?: string;
  onSortChange?: (val: string) => void;
  sortOptions?: FilterOption[];
  dateFrom?: string;
  dateTo?: string;
  dateShortcut?: string;
  onDateChange?: (dateFrom?: string, dateTo?: string, shortcut?: string) => void;
  onResetAll?: () => void;
}

export function FilterToolbar({
  search = "",
  onSearchChange,
  status = "",
  onStatusChange,
  statusOptions = [],
  category = "",
  onCategoryChange,
  categoryOptions = [],
  sort = "newest",
  onSortChange,
  sortOptions = [
    { value: "newest", label: "الأحدث أولاً" },
    { value: "oldest", label: "الأقدم أولاً" },
    { value: "highest_rating", label: "الأعلى تقييماً" },
    { value: "most_enrolled", label: "الأكثر تسجيلاً" },
    { value: "name_asc", label: "حسب الاسم (أ-ي)" },
  ],
  dateFrom,
  dateTo,
  dateShortcut,
  onDateChange,
  onResetAll,
}: FilterToolbarProps) {
  const [isDatePickerOpen, setIsDatePickerOpen] = React.useState(false);

  // Build active filters list for chips
  const activeFilters: { key: string; label: string; value: string }[] = [];

  if (search) activeFilters.push({ key: "search", label: "البحث", value: search });
  if (status && status !== "all") {
    const sOpt = statusOptions.find((o) => o.value === status);
    activeFilters.push({ key: "status", label: "الحالة", value: sOpt ? sOpt.label : status });
  }
  if (category && category !== "all") {
    const cOpt = categoryOptions.find((o) => o.value === category);
    activeFilters.push({ key: "category", label: "الفئة", value: cOpt ? cOpt.label : category });
  }
  if (dateShortcut || dateFrom || dateTo) {
    const dateVal = dateShortcut || `${dateFrom || ""} إلى ${dateTo || ""}`;
    activeFilters.push({ key: "date", label: "التاريخ", value: dateVal });
  }

  const handleRemoveChip = (key: string) => {
    if (key === "search" && onSearchChange) onSearchChange("");
    if (key === "status" && onStatusChange) onStatusChange("");
    if (key === "category" && onCategoryChange) onCategoryChange("");
    if (key === "date" && onDateChange) onDateChange(undefined, undefined, undefined);
  };

  return (
    <div className="space-y-3 text-right" dir="rtl">
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-[#0F274D] p-4 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm">
        {/* Search */}
        {onSearchChange && (
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="ابحث بالاسم أو التفاصيل..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full h-10 pr-10 pl-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none focus:border-[#F58220]"
            />
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3">
          {/* Status Dropdown */}
          {statusOptions.length > 0 && onStatusChange && (
            <div className="h-10 px-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={status}
                onChange={(e) => onStatusChange(e.target.value)}
                className="bg-transparent text-xs font-bold outline-none cursor-pointer"
              >
                <option value="all">كافة الحالات</option>
                {statusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Category Dropdown */}
          {categoryOptions.length > 0 && onCategoryChange && (
            <div className="h-10 px-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={category}
                onChange={(e) => onCategoryChange(e.target.value)}
                className="bg-transparent text-xs font-bold outline-none cursor-pointer"
              >
                <option value="all">كافة الفئات</option>
                {categoryOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Date Picker Trigger */}
          {onDateChange && (
            <button
              type="button"
              onClick={() => setIsDatePickerOpen(true)}
              className={`h-10 px-4 rounded-xl border flex items-center gap-2 text-xs font-bold transition-all cursor-pointer ${
                dateFrom || dateTo || dateShortcut
                  ? "border-[#F58220] bg-orange-500/10 text-[#F58220]"
                  : "border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-300"
              }`}
            >
              <Calendar className="w-4 h-4" />
              {dateShortcut || dateFrom ? "التاريخ محدد" : "تحديد التاريخ"}
            </button>
          )}

          {/* Sort Dropdown */}
          {onSortChange && (
            <div className="h-10 px-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center gap-2">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={sort}
                onChange={(e) => onSortChange(e.target.value)}
                className="bg-transparent text-xs font-bold outline-none cursor-pointer"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Reset button */}
          {onResetAll && activeFilters.length > 0 && (
            <button
              type="button"
              onClick={onResetAll}
              className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 transition-colors"
              title="إعادة ضبط"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Active Filter Chips */}
      <FilterChips
        activeFilters={activeFilters}
        onRemoveFilter={handleRemoveChip}
        onClearAll={onResetAll || (() => {})}
      />

      {/* Date Picker Modal */}
      {onDateChange && (
        <DateRangePickerModal
          isOpen={isDatePickerOpen}
          onClose={() => setIsDatePickerOpen(false)}
          dateFrom={dateFrom}
          dateTo={dateTo}
          dateShortcut={dateShortcut}
          onApply={(f, t, s) => onDateChange(f, t, s)}
        />
      )}
    </div>
  );
}
export default FilterToolbar;

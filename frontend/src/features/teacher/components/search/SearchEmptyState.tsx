import * as React from "react";
import { SearchX, RotateCcw } from "lucide-react";

interface SearchEmptyStateProps {
  title?: string;
  description?: string;
  onResetFilters?: () => void;
}

export function SearchEmptyState({
  title = "لم نتمكن من العثور على نتائج مطابقة",
  description = "جرب البحث باستخدام كلمات مفتاحية أخرى، أو قم بتغيير / إعادة ضبط الفلاتر المحددة.",
  onResetFilters,
}: SearchEmptyStateProps) {
  return (
    <div className="bg-white dark:bg-[#0F274D] rounded-3xl p-12 text-center border border-slate-200/80 dark:border-white/10 shadow-sm space-y-4" dir="rtl">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-white/10 text-slate-400 flex items-center justify-center mx-auto">
        <SearchX className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold text-[#0B2D5B] dark:text-white">{title}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">{description}</p>
      {onResetFilters && (
        <button
          onClick={onResetFilters}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0B2D5B] dark:bg-[#1E73D8] text-white text-xs font-bold transition-transform active:scale-95 shadow-md cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          إعادة ضبط كافة الفلاتر
        </button>
      )}
    </div>
  );
}
export default SearchEmptyState;

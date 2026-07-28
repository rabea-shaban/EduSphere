import * as React from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import type { PaginationMeta } from "@/features/teacher/types/search";

interface PaginationControlProps {
  meta?: PaginationMeta;
  onPageChange: (page: number) => void;
  onLimitChange?: (limit: number) => void;
}

export function PaginationControl({ meta, onPageChange, onLimitChange }: PaginationControlProps) {
  if (!meta || meta.totalPages <= 1) return null;

  const { page, limit, total, totalPages, hasNextPage, hasPrevPage } = meta;

  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-100 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-slate-200" dir="rtl">
      {/* Items Summary */}
      <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
        <span>
          عرض <strong className="text-slate-800 dark:text-white">{startItem}-{endItem}</strong> من أصل <strong className="text-slate-800 dark:text-white">{total}</strong> عنصر
        </span>

        {onLimitChange && (
          <div className="flex items-center gap-2 mr-4 border-r border-slate-200 dark:border-white/10 pr-4">
            <span>عدد العناصر بالصفحة:</span>
            <select
              value={limit}
              onChange={(e) => onLimitChange(Number(e.target.value))}
              className="h-8 px-2 rounded-lg bg-white dark:bg-[#0F274D] border border-slate-200 dark:border-white/10 text-xs font-bold outline-none cursor-pointer"
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
        )}
      </div>

      {/* Pagination Page Numbers & Arrows */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={!hasPrevPage}
          className="h-9 px-3 rounded-xl bg-white dark:bg-[#0F274D] border border-slate-200 dark:border-white/10 flex items-center gap-1 hover:bg-slate-50 dark:hover:bg-white/5 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          <ChevronRight className="w-4 h-4" />
          السابق
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
          .map((p, idx, arr) => {
            const isGap = idx > 0 && p - arr[idx - 1] > 1;
            return (
              <React.Fragment key={p}>
                {isGap && <span className="px-1 text-slate-400">...</span>}
                <button
                  onClick={() => onPageChange(p)}
                  className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                    p === page
                      ? "bg-[#0B2D5B] dark:bg-[#1E73D8] text-white shadow-sm"
                      : "bg-white dark:bg-[#0F274D] border border-slate-200/80 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer"
                  }`}
                >
                  {p}
                </button>
              </React.Fragment>
            );
          })}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={!hasNextPage}
          className="h-9 px-3 rounded-xl bg-white dark:bg-[#0F274D] border border-slate-200 dark:border-white/10 flex items-center gap-1 hover:bg-slate-50 dark:hover:bg-white/5 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          التالي
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
export default PaginationControl;

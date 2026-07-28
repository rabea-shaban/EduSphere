"use client";

import * as React from "react";
import { Calendar, Filter } from "lucide-react";
import type { AnalyticsPeriod, AnalyticsFilters } from "@/features/teacher/types/analytics";

interface AnalyticsDateFilterProps {
  filters: AnalyticsFilters;
  onChange: (newFilters: AnalyticsFilters) => void;
}

export function AnalyticsDateFilter({ filters, onChange }: AnalyticsDateFilterProps) {
  const period = filters.period || "30days";

  const handlePeriodChange = (p: AnalyticsPeriod) => {
    onChange({ ...filters, period: p });
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-[#0F274D] p-3.5 rounded-2xl border border-slate-200/80 dark:border-white/10 text-right dir-rtl">
      <div className="flex items-center gap-2">
        <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-500">
          <Calendar className="h-4 w-4" />
        </span>
        <span className="text-xs font-black text-[#0B2D5B] dark:text-white">
          النطاق الزمني للتحليلات:
        </span>
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-bold">
        <button
          type="button"
          onClick={() => handlePeriodChange("today")}
          className={`px-3 py-1.5 rounded-xl transition-colors cursor-pointer whitespace-nowrap ${
            period === "today"
              ? "bg-[#0B2D5B] dark:bg-[#1E73D8] text-white"
              : "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200/60"
          }`}
        >
          اليوم
        </button>

        <button
          type="button"
          onClick={() => handlePeriodChange("7days")}
          className={`px-3 py-1.5 rounded-xl transition-colors cursor-pointer whitespace-nowrap ${
            period === "7days"
              ? "bg-[#0B2D5B] dark:bg-[#1E73D8] text-white"
              : "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200/60"
          }`}
        >
          آخر 7 أيام
        </button>

        <button
          type="button"
          onClick={() => handlePeriodChange("30days")}
          className={`px-3 py-1.5 rounded-xl transition-colors cursor-pointer whitespace-nowrap ${
            period === "30days"
              ? "bg-[#0B2D5B] dark:bg-[#1E73D8] text-white"
              : "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200/60"
          }`}
        >
          آخر 30 يوماً
        </button>

        <button
          type="button"
          onClick={() => handlePeriodChange("90days")}
          className={`px-3 py-1.5 rounded-xl transition-colors cursor-pointer whitespace-nowrap ${
            period === "90days"
              ? "bg-[#0B2D5B] dark:bg-[#1E73D8] text-white"
              : "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200/60"
          }`}
        >
          آخر 90 يوماً
        </button>

        <button
          type="button"
          onClick={() => handlePeriodChange("thisYear")}
          className={`px-3 py-1.5 rounded-xl transition-colors cursor-pointer whitespace-nowrap ${
            period === "thisYear"
              ? "bg-[#0B2D5B] dark:bg-[#1E73D8] text-white"
              : "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200/60"
          }`}
        >
          هذه السنة
        </button>
      </div>
    </div>
  );
}

export default AnalyticsDateFilter;

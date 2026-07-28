"use client";

import * as React from "react";
import type { ChartMonthSeries } from "@/features/teacher/types/analytics";

interface RevenueLineChartProps {
  data: ChartMonthSeries[];
}

export function RevenueLineChart({ data }: RevenueLineChartProps) {
  if (!data || data.length === 0) return null;

  const maxVal = Math.max(...data.map((d) => d.revenue), 100);

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-[#0F274D] border border-slate-200/80 dark:border-white/10 space-y-4 text-right dir-rtl">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-black text-[#0B2D5B] dark:text-white">
            نمو الإيرادات والأرباح (آخر 6 أشهر) 📈
          </h3>
          <p className="text-xs text-slate-400">إجمالي صافي أرباح المحاضر بالجنيه المصري</p>
        </div>
      </div>

      <div className="h-48 w-full flex items-end justify-between gap-3 pt-6 pb-2 border-b border-slate-100 dark:border-white/10">
        {data.map((item, idx) => {
          const heightPct = Math.round((item.revenue / maxVal) * 100);
          return (
            <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
              <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">
                {item.revenue.toLocaleString()} ج.م
              </span>
              <div className="w-full bg-indigo-50 dark:bg-white/5 rounded-t-xl overflow-hidden flex items-end h-full">
                <div
                  className="w-full bg-gradient-to-t from-[#0B2D5B] to-[#1E73D8] group-hover:from-[#F58220] group-hover:to-[#FF9A2A] transition-all rounded-t-xl"
                  style={{ height: `${Math.max(8, heightPct)}%` }}
                />
              </div>
              <span className="text-[11px] font-bold text-slate-500 truncate">{item.month}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface StudentBarChartProps {
  data: ChartMonthSeries[];
}

export function StudentBarChart({ data }: StudentBarChartProps) {
  if (!data || data.length === 0) return null;

  const maxVal = Math.max(...data.map((d) => d.students), 10);

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-[#0F274D] border border-slate-200/80 dark:border-white/10 space-y-4 text-right dir-rtl">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-black text-[#0B2D5B] dark:text-white">
            معدل انضمام الطلاب الجدد 👥
          </h3>
          <p className="text-xs text-slate-400">عدد الطلاب المسجلين شهرياً في الكورسات</p>
        </div>
      </div>

      <div className="h-44 w-full flex items-end justify-between gap-3 pt-6 pb-2 border-b border-slate-100 dark:border-white/10">
        {data.map((item, idx) => {
          const heightPct = Math.round((item.students / maxVal) * 100);
          return (
            <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
              <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity">
                {item.students} طالب
              </span>
              <div className="w-full bg-emerald-50 dark:bg-white/5 rounded-t-xl overflow-hidden flex items-end h-full">
                <div
                  className="w-full bg-gradient-to-t from-emerald-600 to-emerald-400 group-hover:from-indigo-600 group-hover:to-indigo-400 transition-all rounded-t-xl"
                  style={{ height: `${Math.max(10, heightPct)}%` }}
                />
              </div>
              <span className="text-[11px] font-bold text-slate-500 truncate">{item.month}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface PassRateDonutChartProps {
  passRate: number;
  failRate: number;
}

export function PassRateDonutChart({ passRate, failRate }: PassRateDonutChartProps) {
  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-[#0F274D] border border-slate-200/80 dark:border-white/10 space-y-4 text-right dir-rtl flex flex-col justify-between">
      <div>
        <h3 className="text-sm font-black text-[#0B2D5B] dark:text-white">
          نسبة اجتياز الاختبارات 🎯
        </h3>
        <p className="text-xs text-slate-400">توزيع نتائج الطلاب بين الاجتياز وعدم الاجتياز</p>
      </div>

      <div className="flex items-center justify-center gap-6 py-2">
        <div className="relative h-32 w-32 flex items-center justify-center">
          <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-rose-100 dark:text-rose-950/40"
              strokeWidth="4"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="text-emerald-500"
              strokeDasharray={`${passRate}, 100`}
              strokeWidth="4"
              strokeLinecap="round"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">{passRate}%</span>
            <span className="text-[10px] font-bold text-slate-400">نسبة النجاح</span>
          </div>
        </div>

        <div className="space-y-2 text-xs font-bold">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-emerald-500" />
            <span className="text-slate-700 dark:text-slate-200">الاجتياز: {passRate}%</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-rose-500" />
            <span className="text-slate-700 dark:text-slate-200">عدم الاجتياز: {failRate}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

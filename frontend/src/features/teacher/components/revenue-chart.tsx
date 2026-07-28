"use client";

import * as React from "react";
import {
  Wallet,
  TrendingUp,
  Users,
  Calendar,
  Sparkles,
  BarChart3,
} from "lucide-react";

interface MonthlyDataPoint {
  month: string;
  revenue: number;
  studentsCount?: number;
  students?: number;
  growth?: number;
}

interface RevenueChartProps {
  data?: MonthlyDataPoint[];
}

export function RevenueChart({ data = [] }: RevenueChartProps) {
  // Use strictly the real data passed from the backend / database
  const chartData = React.useMemo(() => {
    if (!data || data.length === 0) return [];

    return data.map((item, idx, arr) => {
      const prevRev = idx > 0 ? arr[idx - 1].revenue : item.revenue;
      const growth = prevRev > 0 ? Math.round(((item.revenue - prevRev) / prevRev) * 100) : item.growth || 0;
      return {
        month: item.month,
        revenue: item.revenue || 0,
        studentsCount: item.studentsCount ?? item.students ?? 0,
        growth,
      };
    });
  }, [data]);

  // Controls state
  const [metricMode, setMetricMode] = React.useState<"revenue" | "students">("revenue");
  const [hoveredIdx, setHoveredIdx] = React.useState<number | null>(
    chartData.length > 0 ? chartData.length - 1 : null
  );

  // Active selected data point
  const activePoint =
    hoveredIdx !== null && chartData[hoveredIdx]
      ? chartData[hoveredIdx]
      : chartData[chartData.length - 1] || { month: "—", revenue: 0, studentsCount: 0, growth: 0 };

  // Calculate real totals
  const totalRevenueSum = chartData.reduce((acc, curr) => acc + curr.revenue, 0);

  // Calculate maximum value for bar scale
  const maxValue = React.useMemo(() => {
    if (chartData.length === 0) return 100;
    const vals = chartData.map((d) => (metricMode === "revenue" ? d.revenue : d.studentsCount || 0));
    const max = Math.max(...vals, 0);
    return max > 0 ? max * 1.15 : 100;
  }, [chartData, metricMode]);

  return (
    <div className="rounded-2xl sm:rounded-3xl p-5 sm:p-7 bg-white dark:bg-[#0F274D] border border-slate-200/80 dark:border-white/10 shadow-xl text-right flex flex-col gap-6 h-full transition-colors select-none relative overflow-hidden">
      {/* Background Accent Glow */}
      <div className="absolute -top-20 -right-20 w-60 h-60 bg-[#0B2D5B]/10 dark:bg-[#1E73D8]/10 rounded-full blur-3xl pointer-events-none" />

      {/* TOP HEADER & INTERACTIVE CONTROLS */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-white/10 pb-4">
        {/* Title Block */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
              <Wallet className="h-4 w-4 shrink-0" />
            </div>
            <h3 className="text-base font-extrabold text-[#0B2D5B] dark:text-white tracking-tight">
              نظرة عامة على الإيرادات والأرباح
            </h3>
            {activePoint.growth > 0 && (
              <span className="inline-flex items-center gap-1 text-[10px] font-black bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20">
                <TrendingUp className="h-3 w-3" />
                <span>+{activePoint.growth}% نمو</span>
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            تحليل وتتبع اشتراكات الكورسات والمستحقات الماليّة الشهرية من واقع البيانات الفعلية
          </p>
        </div>

        {/* Metric Toggle Tabs */}
        <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto justify-end">
          <div className="p-1 rounded-xl bg-slate-100 dark:bg-white/10 flex items-center gap-1 text-xs font-bold">
            <button
              type="button"
              onClick={() => setMetricMode("revenue")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                metricMode === "revenue"
                  ? "bg-white dark:bg-[#0B2D5B] text-[#0B2D5B] dark:text-white shadow-sm font-extrabold"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
              }`}
            >
              <BarChart3 className="h-3.5 w-3.5" />
              <span>الأرباح (ج.م)</span>
            </button>

            <button
              type="button"
              onClick={() => setMetricMode("students")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                metricMode === "students"
                  ? "bg-white dark:bg-[#0B2D5B] text-[#0B2D5B] dark:text-white shadow-sm font-extrabold"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
              }`}
            >
              <Users className="h-3.5 w-3.5" />
              <span>الاشتراكات</span>
            </button>
          </div>
        </div>
      </div>

      {/* ACTIVE MONTH HIGHLIGHT BANNER */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-[#0B2D5B] to-[#1E73D8] text-white flex items-center justify-center font-bold shrink-0">
            <Calendar className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-bold">
              بيانات شهر {activePoint.month}:
            </div>
            <div className="text-base font-black text-[#0B2D5B] dark:text-white font-mono flex items-center gap-2 mt-0.5">
              <span>
                {metricMode === "revenue"
                  ? `${(activePoint.revenue || 0).toLocaleString("en-US")} ج.م`
                  : `${activePoint.studentsCount || 0} طالب جديد`}
              </span>
              {activePoint.growth > 0 ? (
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-bold">
                  +{activePoint.growth}% مقارنة بالشهر السابق
                </span>
              ) : (
                <span className="text-[10px] text-slate-400 bg-slate-200/50 dark:bg-white/10 px-2 py-0.5 rounded-full font-bold">
                  بيانات فعلية من النظام
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="text-left font-mono text-[11px] text-slate-400 dark:text-slate-500">
          مرّر المشيرة فوق الأعمدة لمعاينة كل شهر
        </div>
      </div>

      {/* REAL-DATA COLUMN BARS AREA */}
      <div className="relative flex-1 flex flex-col justify-end pt-6 pb-2 min-h-[220px]">
        {/* Background Grid Guide Lines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20 dark:opacity-10">
          <div className="border-b border-slate-300 dark:border-white w-full" />
          <div className="border-b border-slate-300 dark:border-white w-full" />
          <div className="border-b border-slate-300 dark:border-white w-full" />
          <div className="border-b border-slate-300 dark:border-white w-full" />
        </div>

        {/* Interactive Column Bars Container */}
        <div className="relative z-10 flex items-end justify-between gap-2 sm:gap-4 h-48 px-2">
          {chartData.map((item, idx) => {
            const currentValue = metricMode === "revenue" ? item.revenue : item.studentsCount || 0;
            const heightPercent = maxValue > 0 && currentValue > 0 ? (currentValue / maxValue) * 100 : 0;
            const isHovered = hoveredIdx === idx;

            return (
              <div
                key={item.month}
                onMouseEnter={() => setHoveredIdx(idx)}
                onClick={() => setHoveredIdx(idx)}
                className="flex-1 flex flex-col items-center justify-end h-full group cursor-pointer"
              >
                {/* Floating Interactive Tooltip */}
                <div
                  className={`transition-all duration-200 mb-2 px-2.5 py-1 rounded-xl bg-[#0B2D5B] text-white text-[10px] font-mono font-bold shadow-xl flex flex-col items-center gap-0.5 whitespace-nowrap pointer-events-none ${
                    isHovered
                      ? "opacity-100 scale-100 -translate-y-1"
                      : "opacity-0 scale-95 translate-y-2 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0"
                  }`}
                >
                  <span className="text-[9px] text-slate-300 font-sans">{item.month}</span>
                  <span className="text-emerald-400 font-black">
                    {metricMode === "revenue"
                      ? `${item.revenue.toLocaleString()} ج.م`
                      : `${item.studentsCount} طالب`}
                  </span>
                </div>

                {/* Animated Column Bar */}
                <div className="w-full h-full relative flex items-end justify-center">
                  {currentValue > 0 ? (
                    <div
                      className={`w-full max-w-[36px] sm:max-w-[44px] rounded-t-xl transition-all duration-300 relative overflow-hidden ${
                        isHovered
                          ? "bg-gradient-to-t from-[#0B2D5B] via-[#1E73D8] to-[#F58220] shadow-lg shadow-[#1E73D8]/30 ring-2 ring-[#F58220]"
                          : "bg-gradient-to-t from-[#0B2D5B] via-[#1E73D8] to-[#F58220] hover:brightness-125"
                      }`}
                      style={{ height: `${Math.max(heightPercent, 8)}%` }}
                    >
                      <div className="w-full h-1.5 bg-[#F58220] opacity-90 rounded-t-xl" />
                    </div>
                  ) : (
                    <div
                      className={`w-full max-w-[36px] sm:max-w-[44px] h-2 rounded-full transition-all ${
                        isHovered ? "bg-[#F58220] h-3" : "bg-slate-200 dark:bg-white/10"
                      }`}
                    />
                  )}
                </div>

                {/* Month Name Label */}
                <span
                  className={`mt-2 text-[11px] sm:text-xs font-extrabold transition-colors truncate w-full text-center block ${
                    isHovered
                      ? "text-[#F58220] font-black"
                      : "text-slate-500 dark:text-slate-400"
                  }`}
                >
                  {item.month}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* FOOTER METRICS SUMMARY */}
      <div className="pt-4 border-t border-slate-100 dark:border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-slate-500 dark:text-slate-400 font-semibold">
            إجمالي الإيرادات المسجلة:
          </span>
          <strong className="text-[#0B2D5B] dark:text-white font-mono font-black text-sm">
            {totalRevenueSum.toLocaleString("en-US")} ج.م
          </strong>
        </div>

        <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 text-[11px]">
          <Sparkles className="h-3.5 w-3.5 text-[#F58220]" />
          <span>بيانات حقيقية مستخرجة مباشرة من قاعدة البيانات والمعاملات</span>
        </div>
      </div>
    </div>
  );
}

export default RevenueChart;

"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Wallet, TrendingUp } from "lucide-react";

interface RevenueChartProps {
  data: { month: string; revenue: number }[];
}

export function RevenueChart({ data }: RevenueChartProps) {
  const maxRevenue = Math.max(...data.map((d) => d.revenue), 100000);

  // Show fewer months on small screens
  const [visibleCount, setVisibleCount] = React.useState(data.length);

  React.useEffect(() => {
    const update = () => {
      if (window.innerWidth < 480) setVisibleCount(6);
      else if (window.innerWidth < 768) setVisibleCount(8);
      else setVisibleCount(data.length);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [data.length]);

  const visible = data.slice(-visibleCount);

  return (
    <div className="rounded-2xl sm:rounded-3xl p-4 sm:p-6 bg-white dark:bg-[#0F274D] border border-slate-200/80 dark:border-white/10 shadow-sm text-right flex flex-col gap-4 sm:gap-6 h-full">
      {/* Header */}
      <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-sm sm:text-base font-extrabold text-[#0B2D5B] dark:text-white flex items-center gap-2 flex-wrap">
            <Wallet className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-500 shrink-0" />
            <span>نظرة عامة على الإيرادات (ج.م)</span>
          </h3>
          <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            تحليل الأرباح الشهرية من اشتراكات الكورسات
          </p>
        </div>
        <div className="flex items-center gap-1 text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2.5 sm:px-3 py-1.5 rounded-full border border-emerald-500/20 shrink-0 whitespace-nowrap">
          <TrendingUp className="h-3.5 w-3.5" />
          <span>+33.5% نمو</span>
        </div>
      </div>

      {/* Revenue Bars */}
      <div className="h-40 sm:h-52 flex items-end justify-between gap-1 sm:gap-2 md:gap-3 pt-4 border-b border-slate-100 dark:border-white/10 pb-2 overflow-hidden">
        {visible.map((item, idx) => {
          const heightPercent = (item.revenue / maxRevenue) * 100;
          return (
            <div key={item.month} className="flex-1 flex flex-col items-center gap-1 group h-full justify-end min-w-0">
              {/* Tooltip */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-[#0B2D5B] text-white text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-1 rounded-md shadow-md whitespace-nowrap -mb-1 pointer-events-none">
                {item.revenue.toLocaleString("en-US")}
              </div>

              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${heightPercent}%` }}
                transition={{ duration: 0.6, delay: idx * 0.06 }}
                className="w-full rounded-t-lg sm:rounded-t-xl bg-gradient-to-t from-[#0B2D5B] via-[#1E73D8] to-[#F58220] shadow-md shadow-[#0B2D5B]/20 group-hover:brightness-125 transition-all"
              />

              <span className="text-[9px] sm:text-[11px] font-bold text-slate-500 dark:text-slate-400 truncate w-full text-center leading-tight mt-1">
                {item.month}
              </span>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 gap-1">
        <span>
          إجمالي هذا العام:{" "}
          <strong className="text-emerald-600 dark:text-emerald-400 font-black text-sm">342,500 ج.م</strong>
        </span>
        <span className="text-[11px]">تحديث: اليوم 10:00 ص</span>
      </div>
    </div>
  );
}

export default RevenueChart;

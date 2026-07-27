"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Wallet, TrendingUp } from "lucide-react";

interface RevenueChartProps {
  data: { month: string; revenue: number }[];
}

export function RevenueChart({ data }: RevenueChartProps) {
  const maxRevenue = Math.max(...data.map((d) => d.revenue), 100000);

  const [visibleCount, setVisibleCount] = React.useState(data.length);

  React.useEffect(() => {
    const update = () => {
      if (window.innerWidth < 480) setVisibleCount(5);
      else if (window.innerWidth < 768) setVisibleCount(7);
      else setVisibleCount(data.length);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [data.length]);

  const visible = data.slice(-visibleCount);

  return (
    <div className="rounded-2xl sm:rounded-3xl p-4 sm:p-6 bg-white dark:bg-[#0F274D] border border-slate-200/80 dark:border-white/10 shadow-sm text-right flex flex-col gap-4 sm:gap-5 h-full">

      {/* Header: stacked always — badge sits under title on mobile too */}
      <div className="flex items-start justify-between gap-3">
        {/* Title block */}
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            <Wallet className="h-4 w-4 text-emerald-500 shrink-0" />
            <h3 className="text-sm font-extrabold text-[#0B2D5B] dark:text-white leading-snug">
              نظرة عامة على الإيرادات
            </h3>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
            تحليل الأرباح الشهرية من اشتراكات الكورسات
          </p>
        </div>

        {/* Growth badge — always visible top-right */}
        <div className="flex items-center gap-1 text-[11px] sm:text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2.5 py-1.5 rounded-full border border-emerald-500/20 shrink-0 whitespace-nowrap">
          <TrendingUp className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
          <span>+33.5%</span>
        </div>
      </div>

      {/* Bars area */}
      <div className="flex-1 flex items-end justify-between gap-1 sm:gap-2 border-b border-slate-100 dark:border-white/10 pb-3 min-h-[120px] sm:min-h-[160px]">
        {visible.map((item, idx) => {
          const heightPercent = (item.revenue / maxRevenue) * 100;
          return (
            <div
              key={item.month}
              className="flex-1 flex flex-col items-center justify-end gap-0 group h-full min-w-0"
            >
              {/* Hover tooltip */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-[#0B2D5B] text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-md whitespace-nowrap mb-1 pointer-events-none">
                {item.revenue.toLocaleString("en-US")}
              </div>

              {/* Bar */}
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${heightPercent}%` }}
                transition={{ duration: 0.55, delay: idx * 0.05 }}
                className="w-full rounded-t-md sm:rounded-t-lg bg-gradient-to-t from-[#0B2D5B] via-[#1E73D8] to-[#F58220] group-hover:brightness-125 transition-all"
                style={{ minHeight: "4px" }}
              />

              {/* Month label */}
              <span className="mt-1.5 text-[8px] sm:text-[10px] font-semibold text-slate-400 dark:text-slate-500 truncate w-full text-center block leading-none">
                {item.month}
              </span>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <span className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400">
          إجمالي هذا العام:{" "}
          <strong className="text-emerald-600 dark:text-emerald-400 font-black">342,500 ج.م</strong>
        </span>
        <span className="text-[10px] text-slate-400 dark:text-slate-500">اليوم 10:00 ص</span>
      </div>
    </div>
  );
}

export default RevenueChart;

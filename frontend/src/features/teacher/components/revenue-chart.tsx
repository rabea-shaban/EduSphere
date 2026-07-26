"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Wallet, TrendingUp } from "lucide-react";

interface RevenueChartProps {
  data: { month: string; revenue: number }[];
}

export function RevenueChart({ data }: RevenueChartProps) {
  const maxRevenue = Math.max(...data.map((d) => d.revenue), 100000);

  return (
    <div className="rounded-3xl p-6 bg-white dark:bg-[#0F274D] border border-slate-200/80 dark:border-white/10 shadow-sm text-right flex flex-col justify-between">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-extrabold text-[#0B2D5B] dark:text-white flex items-center gap-2">
            <Wallet className="h-5 w-5 text-emerald-500" />
            <span>نظرة عامة على الإيرادات والأرباح (ج.م)</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            تحليل الأرباح الشهرية المتحصلة من اشتراكات الكورسات
          </p>
        </div>
        <div className="flex items-center gap-1 text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-3 py-1.5 rounded-full border border-emerald-500/20">
          <TrendingUp className="h-4 w-4" />
          <span>+33.5% نمو الإيرادات</span>
        </div>
      </div>

      {/* Revenue Bars */}
      <div className="h-52 flex items-end justify-between gap-3 sm:gap-6 pt-6 border-b border-slate-100 dark:border-white/10 pb-2">
        {data.map((item, idx) => {
          const heightPercent = (item.revenue / maxRevenue) * 100;
          return (
            <div key={item.month} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-[#0B2D5B] text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-md whitespace-nowrap -mb-1">
                {item.revenue.toLocaleString('en-US')} ج.م
              </div>

              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${heightPercent}%` }}
                transition={{ duration: 0.6, delay: idx * 0.08 }}
                className="w-full rounded-t-xl bg-gradient-to-t from-[#0B2D5B] via-[#1E73D8] to-[#F58220] shadow-md shadow-[#0B2D5B]/20 group-hover:brightness-125 transition-all"
              />

              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 truncate w-full text-center">
                {item.month}
              </span>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 pt-3">
        <span>إجمالي أرباح هذا العام: <strong className="text-emerald-600 dark:text-emerald-400 font-black text-sm">342,500 ج.م</strong></span>
        <span>تاريخ التحديث: اليوم 10:00 صباحاً</span>
      </div>
    </div>
  );
}

export default RevenueChart;

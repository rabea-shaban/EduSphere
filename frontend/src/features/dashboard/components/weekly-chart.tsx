"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Clock, TrendingUp } from "lucide-react";

interface WeeklyChartProps {
  data: { day: string; hours: number }[];
}

export function WeeklyChart({ data }: WeeklyChartProps) {
  const maxHours = Math.max(...data.map((d) => d.hours), 10);

  return (
    <div className="rounded-3xl p-6 bg-white dark:bg-[#0F274D] border border-slate-200/80 dark:border-white/10 shadow-sm text-right flex flex-col justify-between">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-extrabold text-[#0B2D5B] dark:text-white flex items-center gap-2">
            <Clock className="h-5 w-5 text-[#F58220]" />
            <span>نشاط المذاكرة الأسبوعي</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            معدل الساعات المخصصة يومياً للكورسات والتمارين
          </p>
        </div>
        <div className="flex items-center gap-1 text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-3 py-1.5 rounded-full border border-emerald-500/20">
          <TrendingUp className="h-4 w-4" />
          <span>معدل رائع (+18%)</span>
        </div>
      </div>

      {/* Bar Chart Visual */}
      <div className="h-48 flex items-end justify-between gap-2 sm:gap-4 pt-6 border-b border-slate-100 dark:border-white/10 pb-2">
        {data.map((item, idx) => {
          const heightPercent = (item.hours / maxHours) * 100;
          return (
            <div key={item.day} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
              {/* Tooltip on hover */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-[#0B2D5B] text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-md -mb-1">
                {item.hours} س
              </div>

              {/* Animated Bar */}
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${heightPercent}%` }}
                transition={{ duration: 0.6, delay: idx * 0.08 }}
                className={`w-full rounded-t-xl transition-all duration-300 ${
                  item.hours >= 6
                    ? "bg-gradient-to-t from-[#F58220] to-[#FF9A2A] shadow-md shadow-[#F58220]/20"
                    : "bg-gradient-to-t from-[#0B2D5B] to-[#1E73D8] dark:from-[#0F274D] dark:to-[#1E73D8]"
                }`}
              />

              {/* Day Label */}
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 truncate w-full text-center">
                {item.day}
              </span>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between text-xs font-semibold text-slate-400 dark:text-slate-400 pt-3">
        <span>إجمالي هذا الأسبوع: <strong className="text-[#0B2D5B] dark:text-white font-extrabold">38.7 ساعة</strong></span>
        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#F58220]" /> أعلى من 6 ساعات
          <span className="h-2.5 w-2.5 rounded-full bg-[#0B2D5B] dark:bg-[#1E73D8]" /> أقل من 6 ساعات
        </span>
      </div>
    </div>
  );
}

export default WeeklyChart;

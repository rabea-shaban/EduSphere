"use client";

import * as React from "react";
import { TrendingUp, TrendingDown, LucideIcon } from "lucide-react";

interface AnalyticsStatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  colorScheme?: "indigo" | "emerald" | "amber" | "rose" | "violet" | "blue";
}

export function AnalyticsStatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  colorScheme = "indigo",
}: AnalyticsStatCardProps) {
  const colorMap = {
    indigo: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-800/30",
    emerald: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800/30",
    amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-800/30",
    rose: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-800/30",
    violet: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-100 dark:border-violet-800/30",
    blue: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-800/30",
  };

  return (
    <div className="p-4 rounded-2xl bg-white dark:bg-[#0F274D] border border-slate-200/80 dark:border-white/10 space-y-2 text-right dir-rtl shadow-sm hover:border-slate-300 dark:hover:border-white/20 transition-all">
      <div className="flex items-center justify-between">
        <span className={`h-10 w-10 rounded-xl flex items-center justify-center border ${colorMap[colorScheme]}`}>
          <Icon className="h-5 w-5" />
        </span>
        {trend && (
          <span
            className={`flex items-center gap-0.5 text-[11px] font-extrabold px-2 py-0.5 rounded-full ${
              trend.isPositive
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
            }`}
          >
            {trend.isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {trend.isPositive ? `+${trend.value}%` : `-${trend.value}%`}
          </span>
        )}
      </div>

      <div>
        <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400">{title}</p>
        <p className="text-xl font-black text-[#0B2D5B] dark:text-white mt-0.5">{value}</p>
        {subtitle && <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}

export default AnalyticsStatCard;

"use client";

import * as React from "react";
import { LucideIcon } from "lucide-react";

interface EarningsStatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  badge?: string;
  colorScheme?: "emerald" | "amber" | "indigo" | "rose" | "violet";
}

export function EarningsStatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  badge,
  colorScheme = "emerald",
}: EarningsStatCardProps) {
  const colorMap = {
    emerald: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800/30",
    amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-800/30",
    indigo: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-800/30",
    rose: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-800/30",
    violet: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-100 dark:border-violet-800/30",
  };

  return (
    <div className="p-5 rounded-3xl bg-white dark:bg-[#0F274D] border border-slate-200/80 dark:border-white/10 space-y-2 text-right dir-rtl shadow-sm hover:border-slate-300 dark:hover:border-white/20 transition-all">
      <div className="flex items-center justify-between">
        <span className={`h-11 w-11 rounded-2xl flex items-center justify-center border ${colorMap[colorScheme]}`}>
          <Icon className="h-5 w-5" />
        </span>
        {badge && (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300">
            {badge}
          </span>
        )}
      </div>

      <div>
        <p className="text-xs font-bold text-slate-400">{title}</p>
        <p className="text-2xl font-black text-[#0B2D5B] dark:text-white mt-1">{value}</p>
        {subtitle && <p className="text-[11px] text-slate-400 font-semibold mt-1">{subtitle}</p>}
      </div>
    </div>
  );
}

export default EarningsStatCard;

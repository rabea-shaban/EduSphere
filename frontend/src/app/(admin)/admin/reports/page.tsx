"use client";

import * as React from "react";
import { Activity, Download, TrendingUp } from "lucide-react";
import { mockMonthlyGrowthData, PlatformChart } from "@/features/admin";

import { toast } from "react-hot-toast";

export default function AdminReportsPage() {
  return (
    <div className="space-y-6 text-right">
      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-white/10 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0B2D5B] dark:text-white">
            التقارير التحليلية والمالية 📊
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            تقارير الأرباح والاشتراكات ونمو الطلاب بالمنصة مع إمكانية التصدير (CSV / Excel)
          </p>
        </div>

        <button
          type="button"
          onClick={() => toast.success("جاري تصدير التقرير المالي المكتمل بصيغة CSV... 📊")}
          className="h-11 px-6 rounded-xl bg-[#0B2D5B] dark:bg-[#1E73D8] text-white text-xs font-bold flex items-center gap-2 shadow-md hover:bg-[#F58220] transition-colors"
        >
          <Download className="h-4 w-4" />
          <span>تصدير التقرير (CSV)</span>
        </button>
      </div>

      <PlatformChart data={mockMonthlyGrowthData} />
    </div>
  );
}

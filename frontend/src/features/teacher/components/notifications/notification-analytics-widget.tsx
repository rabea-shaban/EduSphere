"use client";

import * as React from "react";
import { Bell, CheckCircle2, TrendingUp, BookOpen, FileCheck2, Award, DollarSign } from "lucide-react";
import type { NotificationAnalyticsData } from "@/features/teacher/types/notification";

interface NotificationAnalyticsWidgetProps {
  analytics: NotificationAnalyticsData;
}

export function NotificationAnalyticsWidget({ analytics }: NotificationAnalyticsWidgetProps) {
  const { totalNotifications, unreadCount, readCount, readRatioPercentage, typeBreakdown } = analytics;

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-[#0F274D] border border-slate-200/80 dark:border-white/10 text-right dir-rtl space-y-5 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-4">
        <div>
          <h3 className="text-sm font-black text-[#0B2D5B] dark:text-white flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-[#F58220]" />
            إحصائيات ومؤشرات التنبيهات 📊
          </h3>
          <p className="text-xs text-slate-400">متابعة إجمالي التنبيهات الواردة، نسبة القراءة، وتوزيع الفئات</p>
        </div>

        <span className="px-3 py-1 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold text-xs">
          معدل الاطلاع: {readRatioPercentage}%
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-1">
          <span className="text-[11px] text-slate-400 font-bold">إجمالي الإشعارات</span>
          <p className="text-xl font-black text-[#0B2D5B] dark:text-white">{totalNotifications}</p>
        </div>

        <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-800/30 space-y-1">
          <span className="text-[11px] text-amber-600 font-bold">إشعارات غير مقروءة</span>
          <p className="text-xl font-black text-amber-600">{unreadCount}</p>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-800/30 space-y-1">
          <span className="text-[11px] text-emerald-600 font-bold">إشعارات مكتملة القراءة</span>
          <p className="text-xl font-black text-emerald-600">{readCount}</p>
        </div>

        <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-800/30 space-y-1">
          <span className="text-[11px] text-indigo-600 font-bold">تنبيهات مالية وإدارية</span>
          <p className="text-xl font-black text-indigo-600">{typeBreakdown.payment}</p>
        </div>
      </div>
    </div>
  );
}

export default NotificationAnalyticsWidget;

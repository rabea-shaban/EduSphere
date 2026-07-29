"use client";

import * as React from "react";
import { BookOpen, Users, Star, MessageSquare, DollarSign, TrendingUp } from "lucide-react";
import type { ProfileAnalyticsData } from "@/features/teacher/types/profile";

interface ProfileAnalyticsWidgetProps {
  analytics: ProfileAnalyticsData;
}

export function ProfileAnalyticsWidget({ analytics }: ProfileAnalyticsWidgetProps) {
  const { coursesPublished, studentsEnrolled, averageRating, totalReviews, totalRevenue } = analytics;

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-[#0F274D] border border-slate-200/80 dark:border-white/10 text-right dir-rtl space-y-4 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-4">
        <div>
          <h3 className="text-sm font-black text-[#0B2D5B] dark:text-white flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-[#F58220]" />
            ملخص أداء وتأثير المحاضر 🌟
          </h3>
          <p className="text-xs text-slate-400">إحصائيات فورية شاملة للكورسات، الطلاب، التقييمات والأرباح الصافية</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-1">
          <span className="text-[11px] text-slate-400 font-bold flex items-center gap-1">
            <BookOpen className="h-3.5 w-3.5 text-indigo-500" />
            الكورسات
          </span>
          <p className="text-lg font-black text-[#0B2D5B] dark:text-white">{coursesPublished}</p>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-1">
          <span className="text-[11px] text-slate-400 font-bold flex items-center gap-1">
            <Users className="h-3.5 w-3.5 text-blue-500" />
            الطلاب
          </span>
          <p className="text-lg font-black text-[#0B2D5B] dark:text-white">{studentsEnrolled}</p>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-1">
          <span className="text-[11px] text-slate-400 font-bold flex items-center gap-1">
            <Star className="h-3.5 w-3.5 text-amber-500" />
            متوسط التقييم
          </span>
          <p className="text-lg font-black text-amber-500">{averageRating}</p>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-1">
          <span className="text-[11px] text-slate-400 font-bold flex items-center gap-1">
            <MessageSquare className="h-3.5 w-3.5 text-purple-500" />
            المراجعات
          </span>
          <p className="text-lg font-black text-[#0B2D5B] dark:text-white">{totalReviews}</p>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-1 col-span-2 sm:col-span-1">
          <span className="text-[11px] text-slate-400 font-bold flex items-center gap-1">
            <DollarSign className="h-3.5 w-3.5 text-emerald-500" />
            صافي الأرباح
          </span>
          <p className="text-lg font-black text-emerald-600 dark:text-emerald-400">{totalRevenue} ج.م</p>
        </div>
      </div>
    </div>
  );
}

export default ProfileAnalyticsWidget;

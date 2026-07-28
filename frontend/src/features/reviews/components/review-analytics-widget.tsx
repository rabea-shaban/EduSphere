"use client";

import * as React from "react";
import { Star, MessageSquare, ThumbsUp, TrendingUp, Tag } from "lucide-react";
import type { TeacherReviewAnalytics } from "@/features/reviews/types/review";

interface ReviewAnalyticsWidgetProps {
  analytics: TeacherReviewAnalytics;
}

export function ReviewAnalyticsWidget({ analytics }: ReviewAnalyticsWidgetProps) {
  const {
    totalReviews,
    averageRating,
    responseRate,
    sentimentDistribution,
    topKeywords,
  } = analytics;

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-[#0F274D] border border-slate-200/80 dark:border-white/10 text-right dir-rtl space-y-6 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-4">
        <div>
          <h3 className="text-sm font-black text-[#0B2D5B] dark:text-white flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-[#F58220]" />
            تحليلات التقييمات وانطباعات الطلاب 📊
          </h3>
          <p className="text-xs text-slate-400">رصد معدلات الرضا، نسبة ردود المحاضر، وتحليل مشاعر الطلاب</p>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300">
          <span className="px-3 py-1 rounded-xl bg-amber-500/10 text-amber-600 border border-amber-500/20">
            معدل الرضا: {averageRating.toFixed(1)} / 5
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Reviews */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-1">
          <span className="text-[11px] text-slate-400 font-bold">إجمالي التقييمات والمراجعات</span>
          <p className="text-xl font-black text-[#0B2D5B] dark:text-white">{totalReviews} مراجعة</p>
        </div>

        {/* Response Rate */}
        <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-800/30 space-y-1">
          <span className="text-[11px] text-slate-500 font-bold">نسبة ردود المحاضر على الطلاب</span>
          <p className="text-xl font-black text-indigo-600 dark:text-indigo-400">{responseRate}%</p>
        </div>

        {/* Positive Sentiment % */}
        <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-800/30 space-y-1">
          <span className="text-[11px] text-slate-500 font-bold">نسبة الملاحظات والآراء الإيجابية</span>
          <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">
            {totalReviews > 0 ? Math.round((sentimentDistribution.positive / totalReviews) * 100) : 0}%
          </p>
        </div>
      </div>

      {/* Keywords Breakdown */}
      {topKeywords && topKeywords.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-white/10">
          <span className="text-xs font-black text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
            <Tag className="h-3.5 w-3.5 text-[#F58220]" />
            أبرز محاور وانطباعات الطلاب المكررة:
          </span>
          <div className="flex items-center gap-2 flex-wrap text-xs">
            {topKeywords.map((kw, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 font-bold text-slate-700 dark:text-slate-200"
              >
                {kw.keyword} <strong className="text-indigo-600">({kw.count})</strong>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ReviewAnalyticsWidget;

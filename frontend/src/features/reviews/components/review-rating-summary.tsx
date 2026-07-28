"use client";

import * as React from "react";
import { Star } from "lucide-react";
import type { RatingBreakdownSummary } from "@/features/reviews/types/review";

interface ReviewRatingSummaryProps {
  summary: RatingBreakdownSummary;
  onFilterStar?: (star: number | undefined) => void;
  selectedStar?: number;
}

export function ReviewRatingSummary({
  summary,
  onFilterStar,
  selectedStar,
}: ReviewRatingSummaryProps) {
  const { averageRating, totalReviews, distribution } = summary;

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-[#0F274D] border border-slate-200/80 dark:border-white/10 text-right dir-rtl shadow-sm space-y-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-white/10 pb-4">
        {/* Score & Stars */}
        <div className="flex items-center gap-4">
          <div className="text-center px-4 py-2 rounded-2xl bg-amber-500/10 border border-amber-500/20">
            <span className="text-3xl font-black text-amber-600 dark:text-amber-400">
              {averageRating.toFixed(1)}
            </span>
            <span className="text-xs text-slate-400 font-bold block">من 5</span>
          </div>

          <div>
            <div className="flex items-center gap-1 mb-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-5 w-5 ${
                    star <= Math.round(averageRating)
                      ? "text-amber-400 fill-amber-400"
                      : "text-slate-300 dark:text-slate-600"
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-slate-500 font-bold">
              إجمالي {totalReviews} مراجعة وتقييم للطالب
            </p>
          </div>
        </div>

        {onFilterStar && (
          <button
            type="button"
            onClick={() => onFilterStar(undefined)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              selectedStar === undefined
                ? "bg-[#0B2D5B] dark:bg-[#1E73D8] text-white"
                : "bg-slate-100 dark:bg-white/10 text-slate-600 hover:bg-slate-200"
            }`}
          >
            عرض جميع التقييمات
          </button>
        )}
      </div>

      {/* Star Progress Bars */}
      <div className="space-y-2 text-xs">
        {[5, 4, 3, 2, 1].map((starKey) => {
          const key = starKey as 5 | 4 | 3 | 2 | 1;
          const item = distribution[key] || { count: 0, percentage: 0 };
          const isSelected = selectedStar === starKey;

          return (
            <button
              key={starKey}
              type="button"
              onClick={() => onFilterStar?.(isSelected ? undefined : starKey)}
              className={`w-full flex items-center gap-3 p-1.5 rounded-xl transition-all cursor-pointer ${
                isSelected ? "bg-amber-500/10 border border-amber-500/30" : "hover:bg-slate-50 dark:hover:bg-white/5"
              }`}
            >
              <div className="flex items-center gap-1 shrink-0 w-16 text-slate-700 dark:text-slate-300 font-bold">
                <span>{starKey}</span>
                <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
              </div>

              <div className="flex-1 h-2 rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden">
                <div
                  className="h-full bg-amber-400 transition-all rounded-full"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>

              <span className="shrink-0 text-slate-400 font-semibold w-16 text-left">
                {item.count} ({item.percentage}%)
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default ReviewRatingSummary;

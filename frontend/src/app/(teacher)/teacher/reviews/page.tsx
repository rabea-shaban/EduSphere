"use client";

import * as React from "react";
import { Star, Sparkles, RefreshCw, MessageSquare, Filter } from "lucide-react";
import { useTeacherReviews, useTeacherReviewAnalytics, useDeleteTeacherReply } from "@/hooks/useReviews";
import type { CourseReviewItem, ReviewFilters } from "@/features/reviews/types/review";
import { ReviewAnalyticsWidget } from "@/features/reviews/components/review-analytics-widget";
import { ReviewCard } from "@/features/reviews/components/review-card";
import { TeacherReplyDialog } from "@/features/reviews/components/teacher-reply-dialog";
import { ReviewSkeleton } from "@/features/reviews/components/review-skeleton";
import { ReviewEmptyState } from "@/features/reviews/components/review-empty-state";

export default function InstructorReviewsPage() {
  const [filters, setFilters] = React.useState<ReviewFilters>({});
  const [selectedReviewForReply, setSelectedReviewForReply] = React.useState<CourseReviewItem | null>(null);

  const { data: analytics, isLoading: isAnalyticsLoading, refetch: refetchAnalytics } = useTeacherReviewAnalytics();
  const { data: reviewsData, isLoading: isReviewsLoading, refetch: refetchReviews } = useTeacherReviews(filters);
  const deleteReply = useDeleteTeacherReply();

  const reviews = reviewsData?.reviews || [];
  const total = reviewsData?.pagination?.total || 0;

  const handleRefetch = () => {
    refetchAnalytics();
    refetchReviews();
  };

  return (
    <div className="space-y-6 sm:space-y-8 text-right dir-rtl max-w-6xl mx-auto pb-12">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-2xl bg-amber-500/10 text-amber-500">
              <Sparkles className="h-5 w-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#0B2D5B] dark:text-white">
              إدارة التقييمات وآراء الطلاب
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            متابعة تقييمات الكورسات، تحليل المشاعر، والرد المباشر على ملاحظات الطلاب
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleRefetch}
            className="p-3 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F274D] text-slate-600 dark:text-slate-200 hover:border-[#F58220] transition-colors cursor-pointer"
            title="تحديث البيانات"
            aria-label="تحديث"
          >
            <RefreshCw className={`h-4 w-4 ${isReviewsLoading || isAnalyticsLoading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Review Analytics Widget */}
      {analytics && <ReviewAnalyticsWidget analytics={analytics} />}

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-[#0F274D] p-3.5 rounded-2xl border border-slate-200/80 dark:border-white/10">
        <div className="flex items-center gap-2 text-xs font-black text-[#0B2D5B] dark:text-white">
          <Filter className="h-4 w-4 text-[#F58220]" />
          <span>تصفية مراجعات الطلاب ({total}):</span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto text-xs font-bold">
          {/* Has Reply Filter */}
          <button
            type="button"
            onClick={() => setFilters({ ...filters, hasReply: undefined })}
            className={`px-3 py-1.5 rounded-xl transition-colors cursor-pointer whitespace-nowrap ${
              filters.hasReply === undefined
                ? "bg-[#0B2D5B] dark:bg-[#1E73D8] text-white"
                : "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
            }`}
          >
            الكل
          </button>

          <button
            type="button"
            onClick={() => setFilters({ ...filters, hasReply: false })}
            className={`px-3 py-1.5 rounded-xl transition-colors cursor-pointer whitespace-nowrap ${
              filters.hasReply === false
                ? "bg-amber-500 text-white"
                : "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
            }`}
          >
            في انتظار الرد
          </button>

          <button
            type="button"
            onClick={() => setFilters({ ...filters, hasReply: true })}
            className={`px-3 py-1.5 rounded-xl transition-colors cursor-pointer whitespace-nowrap ${
              filters.hasReply === true
                ? "bg-indigo-600 text-white"
                : "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
            }`}
          >
            تم الرد عليها
          </button>
        </div>
      </div>

      {/* Reviews List */}
      {isReviewsLoading ? (
        <ReviewSkeleton />
      ) : reviews.length === 0 ? (
        <ReviewEmptyState />
      ) : (
        <div className="space-y-4">
          {reviews.map((r) => (
            <ReviewCard
              key={r._id}
              review={r}
              isTeacherView
              onOpenTeacherReply={(reviewToReply) => setSelectedReviewForReply(reviewToReply)}
              onDeleteTeacherReply={(reviewId) => deleteReply.mutate(reviewId)}
            />
          ))}
        </div>
      )}

      {/* Reply Dialog Modal */}
      <TeacherReplyDialog
        review={selectedReviewForReply}
        isOpen={!!selectedReviewForReply}
        onClose={() => setSelectedReviewForReply(null)}
      />
    </div>
  );
}

"use client";

import * as React from "react";
import { Star, ThumbsUp, Flag, MessageSquare, Trash2, CheckCircle2 } from "lucide-react";
import { useVoteHelpful, useFlagReview } from "@/hooks/useReviews";
import type { CourseReviewItem } from "@/features/reviews/types/review";

interface ReviewCardProps {
  review: CourseReviewItem;
  isTeacherView?: boolean;
  onOpenTeacherReply?: (review: CourseReviewItem) => void;
  onDeleteTeacherReply?: (reviewId: string) => void;
}

export function ReviewCard({
  review,
  isTeacherView = false,
  onOpenTeacherReply,
  onDeleteTeacherReply,
}: ReviewCardProps) {
  const voteHelpful = useVoteHelpful();
  const flagReview = useFlagReview();

  const student = typeof review.studentId === "object" ? review.studentId : null;
  const course = typeof review.courseId === "object" ? review.courseId : null;

  const studentName = student
    ? `${student.firstName || ""} ${student.lastName || ""}`.trim() || student.username || student.email
    : "طالب EduSphere";

  const isPositive = review.sentiment === "POSITIVE";
  const isNegative = review.sentiment === "NEGATIVE";

  return (
    <div className="p-5 rounded-3xl bg-white dark:bg-[#0F274D] border border-slate-200/80 dark:border-white/10 text-right dir-rtl space-y-3 shadow-sm hover:border-slate-300 dark:hover:border-white/20 transition-all">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-[#0B2D5B] to-[#1E73D8] text-white font-black flex items-center justify-center text-sm shadow">
            {(studentName || "S").charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-xs font-black text-[#0B2D5B] dark:text-white">{studentName}</p>
            {course && (
              <p className="text-[11px] text-slate-400 font-semibold">{course.title}</p>
            )}
            <p className="text-[10px] text-slate-400 font-medium">
              {new Date(review.createdAt).toLocaleDateString("ar-EG")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Sentiment Badge */}
          <span
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
              isPositive
                ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30"
                : isNegative
                ? "bg-rose-500/10 text-rose-600 border-rose-500/30"
                : "bg-slate-500/10 text-slate-600 border-slate-500/30"
            }`}
          >
            {isPositive ? "إيجابي" : isNegative ? "ملاحظة تحسين" : "حيادي"}
          </span>

          {/* Stars */}
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className={`h-3.5 w-3.5 ${
                  s <= review.rating ? "text-amber-400 fill-amber-400" : "text-slate-200 dark:text-slate-700"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Review Content */}
      {review.title && (
        <p className="text-xs font-black text-slate-800 dark:text-slate-100">{review.title}</p>
      )}
      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{review.comment}</p>

      {/* Keywords Tags */}
      {review.keywords && review.keywords.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap pt-1">
          {review.keywords.map((kw, i) => (
            <span
              key={i}
              className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/5 text-[10px] text-slate-500 font-semibold"
            >
              #{kw}
            </span>
          ))}
        </div>
      )}

      {/* Teacher Reply Container */}
      {review.teacherReply && review.teacherReply.replyText && (
        <div className="mt-3 p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-800/40 space-y-1.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-black text-indigo-700 dark:text-indigo-300 flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-indigo-500" />
              رد المحاضر الرسمي
            </span>
            {isTeacherView && onDeleteTeacherReply && (
              <button
                type="button"
                onClick={() => onDeleteTeacherReply(review._id)}
                className="p-1 rounded text-rose-500 hover:bg-rose-100 transition-colors"
                title="حذف الرد"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          <p className="text-slate-700 dark:text-slate-200 font-medium leading-relaxed">
            {review.teacherReply.replyText}
          </p>
        </div>
      )}

      {/* Footer Controls */}
      <div className="flex items-center justify-between border-t border-slate-100 dark:border-white/10 pt-3 text-xs">
        <button
          type="button"
          onClick={() => voteHelpful.mutate(review._id)}
          className="flex items-center gap-1.5 text-slate-500 hover:text-emerald-600 transition-colors cursor-pointer"
        >
          <ThumbsUp className="h-3.5 w-3.5 text-slate-400" />
          <span className="font-bold">مفيد ({review.helpfulVotes?.count || 0})</span>
        </button>

        <div className="flex items-center gap-2">
          {isTeacherView && onOpenTeacherReply && (
            <button
              type="button"
              onClick={() => onOpenTeacherReply(review)}
              className="px-3 py-1 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-1.5 hover:bg-indigo-500/20 transition-colors cursor-pointer"
            >
              <MessageSquare className="h-3.5 w-3.5" />
              <span>{review.teacherReply?.replyText ? "تعديل الرد" : "الرد على الطالب"}</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => flagReview.mutate({ reviewId: review._id })}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
            title="الإبلاغ عن محتوى غير لائق"
          >
            <Flag className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReviewCard;

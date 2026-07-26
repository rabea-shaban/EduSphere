"use client";

import * as React from "react";
import { Star, MessageCircle } from "lucide-react";
import { mockReviews, ReviewCard, ReviewItem } from "@/features/teacher";

export default function InstructorReviewsPage() {
  const [reviews, setReviews] = React.useState<ReviewItem[]>(mockReviews);

  const handleReply = (reviewId: string, replyText: string) => {
    setReviews(
      reviews.map((r) => (r.id === reviewId ? { ...r, replyText } : r))
    );
  };

  return (
    <div className="space-y-6 text-right">
      <div className="border-b border-slate-200/80 dark:border-white/10 pb-6">
        <h1 className="text-2xl sm:text-3xl font-black text-[#0B2D5B] dark:text-white">
          تقييمات وآراء الطلاب ⭐️
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          متابعة انطباعات الطلاب وتفاعل المعلم مع الملاحظات والرد عليها
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reviews.map((rev) => (
          <ReviewCard key={rev.id} review={rev} onReplySubmit={handleReply} />
        ))}
      </div>
    </div>
  );
}

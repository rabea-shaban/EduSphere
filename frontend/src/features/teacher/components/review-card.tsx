"use client";

import * as React from "react";
import Image from "next/image";
import { Star, MessageCircle, Send } from "lucide-react";
import { ReviewItem } from "../types";

interface ReviewCardProps {
  review: ReviewItem;
  onReplySubmit?: (reviewId: string, replyText: string) => void;
}

export function ReviewCard({ review, onReplySubmit }: ReviewCardProps) {
  const [showReplyForm, setShowReplyForm] = React.useState(false);
  const [replyText, setReplyText] = React.useState(review.replyText || "");

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    onReplySubmit?.(review.id, replyText);
    setShowReplyForm(false);
  };

  return (
    <div className="rounded-2xl p-5 bg-white dark:bg-[#0F274D] border border-slate-200/80 dark:border-white/10 shadow-sm text-right space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 rounded-full overflow-hidden border border-slate-200 shrink-0">
            <Image src={review.studentAvatar} alt={review.studentName} fill className="object-cover" />
          </div>
          <div>
            <div className="text-xs font-bold text-[#0B2D5B] dark:text-white">{review.studentName}</div>
            <div className="text-[10px] text-slate-400">{review.courseTitle}</div>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2.5 py-1 rounded-full text-xs font-black">
          <Star className="h-3.5 w-3.5 fill-current" />
          <span>{review.rating}.0</span>
        </div>
      </div>

      <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
        "{review.comment}"
      </p>

      {/* Existing Reply */}
      {review.replyText && (
        <div className="p-3 rounded-xl bg-blue-50/50 dark:bg-white/5 border border-blue-100 dark:border-white/10 text-xs space-y-1">
          <span className="font-extrabold text-[#0B2D5B] dark:text-[#F58220]">رد المعلم:</span>
          <p className="text-slate-600 dark:text-slate-300">{review.replyText}</p>
        </div>
      )}

      {/* Reply toggle & form */}
      {!review.replyText && (
        <div>
          {!showReplyForm ? (
            <button
              type="button"
              onClick={() => setShowReplyForm(true)}
              className="text-xs font-bold text-[#F58220] hover:underline flex items-center gap-1.5 pt-1"
            >
              <MessageCircle className="h-4 w-4" />
              <span>إضافة رد على تقييم الطالب</span>
            </button>
          ) : (
            <form onSubmit={handleSendReply} className="space-y-2 pt-2">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="اكتب ردك اللبق والمشجع للطالب..."
                className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none focus:border-[#F58220]"
              />
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowReplyForm(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-white/10 text-xs font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#F58220] text-white text-xs font-bold flex items-center gap-1"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>إرسال الرد</span>
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}

export default ReviewCard;

"use client";

import * as React from "react";
import { X, Star, Loader2 } from "lucide-react";
import { useSubmitReview } from "@/hooks/useReviews";
import { toast } from "react-hot-toast";

interface ReviewFormDialogProps {
  courseId: string;
  courseTitle?: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ReviewFormDialog({
  courseId,
  courseTitle = "الكورس التعليمي",
  isOpen,
  onClose,
}: ReviewFormDialogProps) {
  const submitReview = useSubmitReview(courseId);

  const [rating, setRating] = React.useState<number>(5);
  const [hoverRating, setHoverRating] = React.useState<number>(0);
  const [title, setTitle] = React.useState<string>("");
  const [comment, setComment] = React.useState<string>("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || comment.trim().length < 5) {
      toast.error("يرجى كتابة ملاحظاتك بما لا يقل عن 5 أحرف");
      return;
    }

    await submitReview.mutateAsync({
      rating,
      comment: comment.trim(),
      title: title.trim() || undefined,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-md bg-white dark:bg-[#0B2D5B] rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 p-6 space-y-5 text-right dir-rtl">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-4">
          <div>
            <h2 className="text-base font-black text-[#0B2D5B] dark:text-white">
              تقديم تقييم ومراجعة للكورس
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">{courseTitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 transition-colors cursor-pointer"
            aria-label="إغلاق"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Rating Stars Selection */}
          <div className="space-y-2 text-center py-2 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-200/60 dark:border-white/10">
            <label className="text-xs font-black text-slate-700 dark:text-slate-200 block">
              درجة التقييم بالنجوم
            </label>
            <div className="flex items-center justify-center gap-2 dir-ltr">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 transition-transform hover:scale-125 cursor-pointer"
                >
                  <Star
                    className={`h-7 w-7 ${
                      star <= (hoverRating || rating)
                        ? "text-amber-400 fill-amber-400"
                        : "text-slate-300 dark:text-slate-600"
                    }`}
                  />
                </button>
              ))}
            </div>
            <span className="text-xs font-black text-amber-600 dark:text-amber-400 block">
              {rating === 5
                ? "ممتاز ⭐️⭐️⭐️⭐️⭐️"
                : rating === 4
                ? "جيد جداً ⭐️⭐️⭐️⭐️"
                : rating === 3
                ? "جيد ⭐️⭐️⭐️"
                : rating === 2
                ? "مقبول ⭐️⭐️"
                : "ضعيف ⭐️"}
            </span>
          </div>

          {/* Title Optional */}
          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-700 dark:text-slate-200">
              عنوان التقييم المختصر (اختياري)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثال: كورس ممتاز وشرح مبسط جداً..."
              className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none focus:border-[#F58220]"
            />
          </div>

          {/* Comment */}
          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-700 dark:text-slate-200">
              تفاصيل التقييم والتجربة التعليمية <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="اكتب انطباعك عن أسلوب الشرح، الأمثلة التطبيقية، وجودة المحتوى..."
              className="w-full p-3.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none focus:border-[#F58220]"
            />
          </div>

          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 h-11 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-200 transition-colors cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitReview.isPending}
              className="flex-1 h-11 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs font-black flex items-center justify-center gap-2 hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50"
            >
              {submitReview.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>جاري الإرسال...</span>
                </>
              ) : (
                <span>إرسال التقييم</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ReviewFormDialog;

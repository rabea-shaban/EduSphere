"use client";

import * as React from "react";
import { X, Loader2, MessageSquare } from "lucide-react";
import { useTeacherReply } from "@/hooks/useReviews";
import type { CourseReviewItem } from "@/features/reviews/types/review";
import { toast } from "react-hot-toast";

interface TeacherReplyDialogProps {
  review: CourseReviewItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export function TeacherReplyDialog({
  review,
  isOpen,
  onClose,
}: TeacherReplyDialogProps) {
  const teacherReply = useTeacherReply();
  const [replyText, setReplyText] = React.useState("");

  React.useEffect(() => {
    if (review && isOpen) {
      setReplyText(review.teacherReply?.replyText || "");
    }
  }, [review, isOpen]);

  if (!isOpen || !review) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) {
      toast.error("يرجى كتابة نص الرد أولاً");
      return;
    }

    await teacherReply.mutateAsync({
      reviewId: review._id,
      replyText: replyText.trim(),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-md bg-white dark:bg-[#0B2D5B] rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 p-6 space-y-4 text-right dir-rtl">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500">
              <MessageSquare className="h-5 w-5" />
            </span>
            <h2 className="text-base font-black text-[#0B2D5B] dark:text-white">
              الرد الرسمي للمحاضر على المراجعة
            </h2>
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

        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs space-y-1">
          <p className="font-bold text-[#0B2D5B] dark:text-white">ملاحظة الطالب:</p>
          <p className="text-slate-600 dark:text-slate-300 italic">"{review.comment}"</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-700 dark:text-slate-200">
              نص ردك الرسمي <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={4}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="اكتب ردك وملاحظاتك للطالب هنا بحرفية واهتمام..."
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
              disabled={teacherReply.isPending}
              className="flex-1 h-11 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-500 text-white text-xs font-black flex items-center justify-center gap-2 hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50"
            >
              {teacherReply.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>جاري الحفظ...</span>
                </>
              ) : (
                <span>حفظ وإرسال الرد</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TeacherReplyDialog;

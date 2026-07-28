"use client";

import { Loader2, Copy } from "lucide-react";
import { useDuplicateQuiz } from "@/hooks/useQuizzes";
import type { ApiQuiz } from "@/features/teacher/types/quiz";

interface DuplicateQuizDialogProps {
  quiz: ApiQuiz | null;
  isOpen: boolean;
  onClose: () => void;
}

export function DuplicateQuizDialog({ quiz, isOpen, onClose }: DuplicateQuizDialogProps) {
  const duplicateQuiz = useDuplicateQuiz();

  const handleConfirm = async () => {
    if (!quiz) return;
    await duplicateQuiz.mutateAsync(quiz._id);
    onClose();
  };

  if (!isOpen || !quiz) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white dark:bg-[#0B2D5B] rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 p-6 space-y-5 text-right">
        <div className="flex items-center gap-3">
          <span className="h-12 w-12 rounded-2xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center shrink-0">
            <Copy className="h-6 w-6 text-violet-600" />
          </span>
          <div>
            <h2 className="text-base font-black text-[#0B2D5B] dark:text-white">تكرار الاختبار</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">سيتم تكرار الاختبار وجميع أسئلته كمسودة</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-1">
          <p className="text-xs font-bold text-slate-500">الاختبار المراد تكراره:</p>
          <p className="text-sm font-black text-[#0B2D5B] dark:text-white">{quiz.title}</p>
        </div>

        <div className="flex items-center gap-3 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 h-11 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-200 transition-colors cursor-pointer"
          >
            إلغاء
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={duplicateQuiz.isPending}
            className="flex-1 h-11 rounded-xl bg-violet-600 text-white text-xs font-black flex items-center justify-center gap-2 hover:bg-violet-700 transition-colors cursor-pointer disabled:opacity-50"
          >
            {duplicateQuiz.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
            <span>{duplicateQuiz.isPending ? "جاري التكرار..." : "تكرار الاختبار"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default DuplicateQuizDialog;

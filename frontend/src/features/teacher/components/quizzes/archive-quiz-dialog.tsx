"use client";

import { Loader2, Archive } from "lucide-react";
import { useArchiveQuiz } from "@/hooks/useQuizzes";
import type { ApiQuiz } from "@/features/teacher/types/quiz";

interface ArchiveQuizDialogProps {
  quiz: ApiQuiz | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ArchiveQuizDialog({ quiz, isOpen, onClose }: ArchiveQuizDialogProps) {
  const archiveQuiz = useArchiveQuiz();

  const handleConfirm = async () => {
    if (!quiz) return;
    await archiveQuiz.mutateAsync(quiz._id);
    onClose();
  };

  if (!isOpen || !quiz) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white dark:bg-[#0B2D5B] rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 p-6 space-y-5 text-right">
        <div className="flex items-center gap-3">
          <span className="h-12 w-12 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
            <Archive className="h-6 w-6 text-amber-600" />
          </span>
          <div>
            <h2 className="text-base font-black text-[#0B2D5B] dark:text-white">أرشفة الاختبار</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">سيتم نقل الاختبار للأرشيف</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-700/30">
          <p className="text-sm font-bold text-amber-800 dark:text-amber-300">
            أرشفة الاختبار:
          </p>
          <p className="text-sm font-black text-amber-900 dark:text-amber-200 mt-1">
            &quot;{quiz.title}&quot;
          </p>
        </div>

        <div className="flex items-center gap-3 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 h-11 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-200 transition-colors cursor-pointer"
          >
            تراجع
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={archiveQuiz.isPending}
            className="flex-1 h-11 rounded-xl bg-amber-600 text-white text-xs font-black flex items-center justify-center gap-2 hover:bg-amber-700 transition-colors cursor-pointer disabled:opacity-50"
          >
            {archiveQuiz.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Archive className="h-4 w-4" />
            )}
            <span>{archiveQuiz.isPending ? "جاري الأرشفة..." : "أرشفة الاختبار"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ArchiveQuizDialog;

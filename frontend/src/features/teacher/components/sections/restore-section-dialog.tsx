"use client";

import { Loader2, RotateCcw } from "lucide-react";
import { useRestoreSection } from "@/hooks/useSections";
import type { ApiSection } from "@/features/teacher/types/section";

interface RestoreSectionDialogProps {
  courseId: string;
  section: ApiSection | null;
  isOpen: boolean;
  onClose: () => void;
}

export function RestoreSectionDialog({ courseId, section, isOpen, onClose }: RestoreSectionDialogProps) {
  const restoreSection = useRestoreSection(courseId);

  const handleConfirm = async () => {
    if (!section) return;
    await restoreSection.mutateAsync(section._id);
    onClose();
  };

  if (!isOpen || !section) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white dark:bg-[#0B2D5B] rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 p-6 space-y-5 text-right">
        <div className="flex items-center gap-3">
          <span className="h-12 w-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
            <RotateCcw className="h-6 w-6 text-emerald-600" />
          </span>
          <div>
            <h2 className="text-base font-black text-[#0B2D5B] dark:text-white">استعادة القسم</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">سيتم إعادة القسم إلى حالة المسودة</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-700/30">
          <p className="text-sm font-bold text-emerald-800 dark:text-emerald-300">استعادة القسم:</p>
          <p className="text-sm font-black text-emerald-900 dark:text-emerald-200 mt-1">
            &quot;{section.title}&quot;
          </p>
          <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-2 leading-relaxed">
            سيتم استعادة القسم كمسودة. يمكنك نشره للطلاب بعد مراجعة المحتوى.
          </p>
        </div>

        <div className="flex items-center gap-3 pt-1">
          <button type="button" onClick={onClose} className="flex-1 h-11 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-200 transition-colors cursor-pointer">
            تراجع
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={restoreSection.isPending}
            className="flex-1 h-11 rounded-xl bg-emerald-600 text-white text-xs font-black flex items-center justify-center gap-2 hover:bg-emerald-700 transition-colors cursor-pointer disabled:opacity-50"
          >
            {restoreSection.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <RotateCcw className="h-4 w-4" />}
            <span>{restoreSection.isPending ? "جاري الاستعادة..." : "استعادة القسم"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default RestoreSectionDialog;

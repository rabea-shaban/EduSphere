"use client";

import { Loader2, Copy, BookOpen, Clock } from "lucide-react";
import { useDuplicateSection } from "@/hooks/useSections";
import type { ApiSection } from "@/features/teacher/types/section";

interface DuplicateSectionDialogProps {
  courseId: string;
  section: ApiSection | null;
  isOpen: boolean;
  onClose: () => void;
}

export function DuplicateSectionDialog({ courseId, section, isOpen, onClose }: DuplicateSectionDialogProps) {
  const duplicateSection = useDuplicateSection(courseId);

  const handleConfirm = async () => {
    if (!section) return;
    await duplicateSection.mutateAsync(section._id);
    onClose();
  };

  if (!isOpen || !section) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white dark:bg-[#0B2D5B] rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 p-6 space-y-5 text-right">
        <div className="flex items-center gap-3">
          <span className="h-12 w-12 rounded-2xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center shrink-0">
            <Copy className="h-6 w-6 text-violet-600" />
          </span>
          <div>
            <h2 className="text-base font-black text-[#0B2D5B] dark:text-white">تكرار القسم</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">سيتم إنشاء نسخة كاملة من هذا القسم</p>
          </div>
        </div>

        {/* Section Preview */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-2">
          <p className="text-xs font-black text-slate-700 dark:text-slate-200">القسم المراد تكراره:</p>
          <p className="text-sm font-black text-[#0B2D5B] dark:text-white">{section.title}</p>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <BookOpen className="h-3 w-3" />
              {section.totalLessons} درس
            </span>
            {section.estimatedDuration > 0 && (
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {section.estimatedDuration} دقيقة
              </span>
            )}
          </div>
          <p className="text-xs text-violet-600 dark:text-violet-400 pt-1 leading-relaxed">
            ✓ سيتم نسخ القسم بكامل دروسه وإضافته كمسودة في نهاية القائمة
          </p>
        </div>

        <div className="flex items-center gap-3 pt-1">
          <button type="button" onClick={onClose} className="flex-1 h-11 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-200 transition-colors cursor-pointer">
            إلغاء
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={duplicateSection.isPending}
            className="flex-1 h-11 rounded-xl bg-violet-600 text-white text-xs font-black flex items-center justify-center gap-2 hover:bg-violet-700 transition-colors cursor-pointer disabled:opacity-50"
          >
            {duplicateSection.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Copy className="h-4 w-4" />}
            <span>{duplicateSection.isPending ? "جاري التكرار..." : "تكرار القسم"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default DuplicateSectionDialog;

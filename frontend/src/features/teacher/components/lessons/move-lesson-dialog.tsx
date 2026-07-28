"use client";

import * as React from "react";
import { X, Loader2, FolderInput } from "lucide-react";
import { useMoveLesson } from "@/hooks/useLessons";
import { useSections } from "@/hooks/useSections";
import type { ApiLesson } from "@/features/teacher/types/lesson";

interface MoveLessonDialogProps {
  currentSectionId?: string;
  courseId?: string;
  lesson: ApiLesson | null;
  isOpen: boolean;
  onClose: () => void;
}

export function MoveLessonDialog({
  currentSectionId,
  courseId,
  lesson,
  isOpen,
  onClose,
}: MoveLessonDialogProps) {
  const moveLesson = useMoveLesson(currentSectionId);

  // Extract actual courseId from lesson or prop
  const effectiveCourseId =
    courseId ||
    (typeof lesson?.courseId === "object" ? lesson.courseId._id : lesson?.courseId) ||
    "";

  const { data: sectionsData, isLoading: isLoadingSections } = useSections(
    effectiveCourseId,
    { limit: 100 }
  );

  const sections = sectionsData?.sections || [];
  const [selectedTargetSectionId, setSelectedTargetSectionId] = React.useState("");

  React.useEffect(() => {
    if (sections.length > 0) {
      const curId = currentSectionId || (typeof lesson?.sectionId === "object" ? lesson.sectionId._id : lesson?.sectionId);
      const otherSection = sections.find((s) => s._id !== curId);
      if (otherSection) {
        setSelectedTargetSectionId(otherSection._id);
      }
    }
  }, [sections, currentSectionId, lesson]);

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lesson || !selectedTargetSectionId) return;

    await moveLesson.mutateAsync({
      id: lesson._id,
      data: { targetSectionId: selectedTargetSectionId },
    });
    onClose();
  };

  if (!isOpen || !lesson) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white dark:bg-[#0B2D5B] rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 p-6 space-y-5 text-right">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <span className="h-10 w-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center shrink-0">
              <FolderInput className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </span>
            <div>
              <h2 className="text-base font-black text-[#0B2D5B] dark:text-white">نقل الدرس إلى قسم آخر</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-xs">
                {lesson.title}
              </p>
            </div>
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

        {/* Target Section Select */}
        <form onSubmit={handleConfirm} className="space-y-3">
          <label className="text-xs font-black text-slate-700 dark:text-slate-200">
            اختر القسم الوجهة:
          </label>

          {isLoadingSections ? (
            <div className="h-11 w-full rounded-xl bg-slate-100 dark:bg-white/10 animate-pulse" />
          ) : sections.length === 0 ? (
            <p className="text-xs text-rose-500">لا توجد أقسام أُخرى متبقية في هذا الكورس.</p>
          ) : (
            <select
              value={selectedTargetSectionId}
              onChange={(e) => setSelectedTargetSectionId(e.target.value)}
              className="w-full h-11 px-3 rounded-xl bg-slate-50 dark:bg-white/5 dark:bg-[#0B2D5B] border border-slate-200 dark:border-white/10 text-xs font-bold outline-none cursor-pointer focus:border-indigo-500"
            >
              {sections.map((sec) => (
                <option key={sec._id} value={sec._id}>
                  {sec.title} ({sec.totalLessons} دروس)
                </option>
              ))}
            </select>
          )}

          <div className="flex items-center gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-11 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-200 transition-colors cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={moveLesson.isPending || !selectedTargetSectionId}
              className="flex-1 h-11 rounded-xl bg-indigo-600 text-white text-xs font-black flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors cursor-pointer disabled:opacity-50"
            >
              {moveLesson.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <FolderInput className="h-4 w-4" />
              )}
              <span>{moveLesson.isPending ? "جاري النقل..." : "نقل الدرس"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default MoveLessonDialog;

"use client";

import * as React from "react";
import { X, Loader2, Award, CheckCircle2 } from "lucide-react";
import { useIssueCertificate } from "@/hooks/useTeacherStudents";
import type { TeacherStudent } from "@/features/teacher/types/student";

interface IssueCertificateDialogProps {
  student: TeacherStudent | null;
  isOpen: boolean;
  onClose: () => void;
}

export function IssueCertificateDialog({
  student,
  isOpen,
  onClose,
}: IssueCertificateDialogProps) {
  const issueCertificate = useIssueCertificate(student?._id);

  const [selectedCourseId, setSelectedCourseId] = React.useState<string>("");

  React.useEffect(() => {
    if (student?.courses && student.courses.length > 0) {
      const cId = typeof student.courses[0].courseId === "object"
        ? student.courses[0].courseId._id
        : student.courses[0].courseId;
      setSelectedCourseId(cId || "");
    }
  }, [student]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!student || !selectedCourseId) return;

    await issueCertificate.mutateAsync({
      id: student._id,
      courseId: selectedCourseId,
    });

    onClose();
  };

  if (!isOpen || !student) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-md bg-white dark:bg-[#0B2D5B] rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 p-6 space-y-5 text-right dir-rtl">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <span className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <Award className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-base font-black text-[#0B2D5B] dark:text-white">
                إصدار شهادة إتمام كورس
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-xs">
                إلى: {student.fullName}
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-700 dark:text-slate-200">
              اختر الكورس التعليمي <span className="text-rose-500">*</span>
            </label>
            <select
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold outline-none cursor-pointer focus:border-[#F58220]"
            >
              {student.courses && student.courses.length > 0 ? (
                student.courses.map((c, i) => {
                  const cId = typeof c.courseId === "object" ? c.courseId._id : c.courseId;
                  return (
                    <option key={i} value={cId}>
                      {c.courseTitle} (نسبة الإكمال: {c.progress}%)
                    </option>
                  );
                })
              ) : (
                <option value="">لا توجد كورسات مشتركة</option>
              )}
            </select>
          </div>

          <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/30 text-xs text-amber-800 dark:text-amber-300 font-semibold leading-relaxed">
            سيتم إصدار شهادة رسمية إلكترونية معتمدة برقم تسلسلي موثق كورسEduSphere وإخطار الطالب مباشرة عبر الإشعارات.
          </div>

          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 h-11 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-200 transition-colors cursor-pointer"
            >
              تراجع
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={issueCertificate.isPending || !selectedCourseId}
              className="flex-1 h-11 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs font-black flex items-center justify-center gap-2 hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50"
            >
              {issueCertificate.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>جاري إصدار الشهادة...</span>
                </>
              ) : (
                <>
                  <Award className="h-4 w-4" />
                  <span>تأكيد وإصدار الشهادة</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default IssueCertificateDialog;

"use client";

import * as React from "react";
import {
  X,
  Loader2,
  Award,
  Download,
  ExternalLink,
  Save,
  User,
  Clock,
  MessageSquare,
  Lock,
} from "lucide-react";
import { useGradeSubmission } from "@/hooks/useAssignments";
import type { ApiSubmission } from "@/features/teacher/types/assignment";

interface GradingSubmissionDialogProps {
  submission: ApiSubmission | null;
  totalMarks?: number;
  assignmentId?: string;
  isOpen: boolean;
  onClose: () => void;
}

export function GradingSubmissionDialog({
  submission,
  totalMarks = 100,
  assignmentId,
  isOpen,
  onClose,
}: GradingSubmissionDialogProps) {
  const gradeSubmission = useGradeSubmission(assignmentId);

  const [grade, setGrade] = React.useState<number>(100);
  const [feedback, setFeedback] = React.useState<string>("");
  const [privateNotes, setPrivateNotes] = React.useState<string>("");
  const [gradeOverride, setGradeOverride] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (submission) {
      setGrade(submission.grade !== undefined ? submission.grade : totalMarks);
      setFeedback(submission.feedback || "");
      setPrivateNotes(submission.privateNotes || "");
      setGradeOverride(Boolean(submission.gradeOverride));
    }
  }, [submission, totalMarks]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!submission) return;

    await gradeSubmission.mutateAsync({
      submissionId: submission._id,
      data: {
        grade: Number(grade),
        feedback: feedback.trim() || undefined,
        privateNotes: privateNotes.trim() || undefined,
        gradeOverride,
      },
    });
    onClose();
  };

  if (!isOpen || !submission) return null;

  const studentName =
    typeof submission.studentId === "object"
      ? `${submission.studentId.firstName || ""} ${submission.studentId.lastName || ""}`.trim() ||
        submission.studentId.username ||
        "طالب"
      : "طالب";

  const submittedDate = submission.submittedAt
    ? new Date(submission.submittedAt).toLocaleString("ar-EG")
    : "غير محدد";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-white dark:bg-[#0B2D5B] rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden flex flex-col max-h-[85vh] text-right dir-rtl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <span className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <Award className="h-5 w-5 text-amber-500" />
            </span>
            <div>
              <h2 className="text-base font-black text-[#0B2D5B] dark:text-white">
                تصحيح ورصد درجة تسليم الطالب
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                الطالب: {studentName} ({submittedDate})
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

        {/* Content Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Submission Preview Section */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-3">
            <h3 className="text-xs font-black text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
              <MessageSquare className="h-4 w-4 text-indigo-500" />
              <span>محتوى تسليم الطالب:</span>
            </h3>

            {submission.textAnswer && (
              <div className="p-3 rounded-xl bg-white dark:bg-[#0B2D5B] border border-slate-200/80 dark:border-white/10 text-xs font-semibold leading-relaxed text-slate-800 dark:text-slate-100 whitespace-pre-wrap">
                {submission.textAnswer}
              </div>
            )}

            {submission.externalUrl && (
              <a
                href={submission.externalUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span>فتح الرابط الخارجي المرفق</span>
              </a>
            )}

            {submission.attachments && submission.attachments.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <p className="text-[11px] font-bold text-slate-500">الملفات المرفقة:</p>
                <div className="flex flex-wrap gap-2">
                  {submission.attachments.map((att: any, i: number) => {
                    const url = typeof att === "string" ? att : att.url;
                    const name = typeof att === "string" ? `مرفق ${i + 1}` : att.name || `مرفق ${i + 1}`;
                    return (
                      <a
                        key={i}
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#0B2D5B] border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 hover:border-indigo-500 transition-colors"
                      >
                        <Download className="h-3.5 w-3.5 text-indigo-500" />
                        <span>{name}</span>
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Grade Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-slate-700 dark:text-slate-200">
                الدرجة المستحقة (من {totalMarks}) <span className="text-rose-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="grade-override"
                  checked={gradeOverride}
                  onChange={(e) => setGradeOverride(e.target.checked)}
                  className="h-3.5 w-3.5 rounded text-[#F58220]"
                />
                <label htmlFor="grade-override" className="text-[11px] font-bold text-slate-500 cursor-pointer">
                  السماح بتجاوز الحد الأقصى للدرجة
                </label>
              </div>
            </div>
            <input
              type="number"
              min={0}
              max={gradeOverride ? 1000 : totalMarks}
              value={grade}
              onChange={(e) => setGrade(Number(e.target.value))}
              className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm font-bold outline-none focus:border-[#F58220]"
            />
          </div>

          {/* Public Feedback */}
          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-700 dark:text-slate-200">
              التغذية الراجعة والملاحظات للطالب
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={3}
              placeholder="اكتب ملاحظاتك وتقييمك للطالب لمعرفة نقاط القوة والتحسين..."
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none focus:border-[#F58220] resize-none"
            />
          </div>

          {/* Private Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-700 dark:text-slate-200 flex items-center gap-1">
              <Lock className="h-3 w-3 text-slate-400" />
              ملاحظات خاصة للمحاضر (لا تظهر للطالب)
            </label>
            <input
              type="text"
              value={privateNotes}
              onChange={(e) => setPrivateNotes(e.target.value)}
              placeholder="ملاحظات سرية للمدرس فقط..."
              className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none focus:border-[#F58220]"
            />
          </div>
        </form>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-white/10 flex items-center justify-between gap-3 shrink-0">
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
            disabled={gradeSubmission.isPending}
            className="flex-1 h-11 rounded-xl bg-gradient-to-r from-[#0B2D5B] to-[#1E73D8] text-white text-xs font-black flex items-center justify-center gap-2 hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50"
          >
            {gradeSubmission.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>جاري رصد الدرجة...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>حفظ التقييم وإرسال النتيجة</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default GradingSubmissionDialog;

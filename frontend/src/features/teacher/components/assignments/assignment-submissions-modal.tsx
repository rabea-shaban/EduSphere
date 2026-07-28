"use client";

import * as React from "react";
import {
  X,
  Users,
  Award,
  Clock,
  Loader2,
  Edit3,
  CheckCircle2,
  AlertCircle,
  FileCheck2,
} from "lucide-react";
import { useAssignmentSubmissions } from "@/hooks/useAssignments";
import type { ApiAssignment, ApiSubmission } from "@/features/teacher/types/assignment";
import { GradingSubmissionDialog } from "./grading-submission-dialog";

interface AssignmentSubmissionsModalProps {
  assignment: ApiAssignment | null;
  isOpen: boolean;
  onClose: () => void;
}

export function AssignmentSubmissionsModal({
  assignment,
  isOpen,
  onClose,
}: AssignmentSubmissionsModalProps) {
  const assignmentId = assignment?._id || "";
  const { data, isLoading } = useAssignmentSubmissions(assignmentId);

  const submissions = data?.submissions || [];
  const [selectedSubmission, setSelectedSubmission] = React.useState<ApiSubmission | null>(null);

  if (!isOpen || !assignment) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-3xl bg-white dark:bg-[#0B2D5B] rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden flex flex-col max-h-[85vh] text-right dir-rtl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <span className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
              <Users className="h-5 w-5 text-indigo-500" />
            </span>
            <div>
              <h2 className="text-base font-black text-[#0B2D5B] dark:text-white">
                تسليمات الطلاب ({submissions.length} تسليم)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-md">
                {assignment.title}
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

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {isLoading ? (
            <div className="py-12 text-center flex flex-col items-center justify-center gap-2">
              <Loader2 className="h-6 w-6 text-indigo-500 animate-spin" />
              <p className="text-xs font-bold text-slate-500">جاري تحميل التسليمات...</p>
            </div>
          ) : submissions.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400 border border-dashed rounded-2xl">
              لا توجد تسليمات مقدمة من الطلاب لهذا الواجب بعد.
            </div>
          ) : (
            <div className="space-y-3">
              {submissions.map((sub) => {
                const studentName =
                  typeof sub.studentId === "object"
                    ? `${sub.studentId.firstName || ""} ${sub.studentId.lastName || ""}`.trim() ||
                      sub.studentId.username ||
                      "طالب"
                    : "طالب";

                const isReviewed = sub.status === "Reviewed" || sub.status === "Graded";
                const isLate = sub.status === "Late";

                return (
                  <div
                    key={sub._id}
                    className="p-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F274D] flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <span className="h-9 w-9 rounded-xl bg-slate-100 dark:bg-white/10 flex items-center justify-center font-bold text-xs text-slate-700 dark:text-slate-200">
                        {studentName.charAt(0)}
                      </span>
                      <div className="min-w-0 flex-1 space-y-0.5">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-black text-[#0B2D5B] dark:text-white truncate">
                            {studentName}
                          </p>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                              isReviewed
                                ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30"
                                : isLate
                                ? "bg-rose-500/10 text-rose-600 border-rose-500/30"
                                : "bg-blue-500/10 text-blue-600 border-blue-500/30"
                            }`}
                          >
                            {isReviewed ? "تم التصحيح" : isLate ? "تسليم متأخر" : "في انتظار التصحيح"}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400">
                          تاريخ التسليم: {new Date(sub.submittedAt).toLocaleDateString("ar-EG")}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {sub.grade !== undefined && (
                        <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">
                          {sub.grade} / {assignment.totalMarks}
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={() => setSelectedSubmission(sub)}
                        className="px-3 h-8 rounded-xl bg-[#0B2D5B] dark:bg-[#1E73D8] text-white text-xs font-bold flex items-center gap-1.5 hover:opacity-90 transition-opacity cursor-pointer"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                        <span>{isReviewed ? "تعديل الدرجة" : "رصد الدرجة"}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-white/10 flex justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 h-10 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-200 transition-colors cursor-pointer"
          >
            إغلاق
          </button>
        </div>

        {/* Grading Sub-modal */}
        <GradingSubmissionDialog
          submission={selectedSubmission}
          totalMarks={assignment.totalMarks}
          assignmentId={assignment._id}
          isOpen={!!selectedSubmission}
          onClose={() => setSelectedSubmission(null)}
        />
      </div>
    </div>
  );
}

export default AssignmentSubmissionsModal;

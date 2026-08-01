"use client";

import * as React from "react";
import { FileCheck2, UploadCloud } from "lucide-react";
import { AssignmentCard, AssignmentItem } from "@/features/dashboard";
import { useStudent } from "@/hooks/useStudent";
import { adaptAssignmentToUI } from "@/features/dashboard/utils/adapters";
import { toast } from "react-hot-toast";

export default function AssignmentsPage() {
  const [selectedAssignment, setSelectedAssignment] = React.useState<AssignmentItem | null>(null);
  const [textAnswer, setTextAnswer] = React.useState("");

  const { useAssignments, useMySubmissions, submitAssignment, isSubmittingAssignment } = useStudent();
  const { data: assignmentsData, isLoading: isLoadingAssignments } = useAssignments();
  const { data: submissionsData } = useMySubmissions();

  const assignments: AssignmentItem[] = React.useMemo(() => {
    if (!assignmentsData) return [];
    return assignmentsData.map((asg) => {
      const submission = submissionsData?.find((s) => {
        const asgId = typeof s.assignmentId === "object" ? s.assignmentId._id : s.assignmentId;
        return asgId === asg._id;
      });
      return adaptAssignmentToUI(asg, submission);
    });
  }, [assignmentsData, submissionsData]);

  const handleSubmit = async () => {
    if (!selectedAssignment) return;
    if (!textAnswer.trim()) {
      toast.error("يرجى كتابة الإجابة أو ملخص الحل قبل الإرسال");
      return;
    }
    await submitAssignment({
      assignmentId: selectedAssignment.id,
      textAnswer,
    });
    setSelectedAssignment(null);
    setTextAnswer("");
  };

  return (
    <div className="space-y-6 text-right">
      <div className="border-b border-slate-200/80 dark:border-white/10 pb-6">
        <h1 className="text-2xl sm:text-3xl font-black text-[#0B2D5B] dark:text-white">
          الواجبات والمشاريع العملية
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          قم برفع الحلول والملفات لمشاريع علوم الحاسب والواجبات المدرسية للحصول على تقييم المعلم
        </p>
      </div>

      {isLoadingAssignments ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((n) => (
            <div key={n} className="h-48 rounded-3xl bg-slate-200 dark:bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : assignments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {assignments.map((assignment) => (
            <AssignmentCard
              key={assignment.id}
              assignment={assignment}
              onSubmitClick={(asg) => {
                setSelectedAssignment(asg);
                setTextAnswer("");
              }}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-[#0F274D] rounded-3xl border border-slate-200 dark:border-white/10 p-8 space-y-3">
          <FileCheck2 className="h-12 w-12 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-700 dark:text-slate-200">لا توجد واجبات حالياً</h3>
          <p className="text-xs text-slate-500">ستظهر الواجبات المطلوبة هنا عند تعيينها في الكورسات المشترك بها</p>
        </div>
      )}

      {/* Upload Dropzone Modal */}
      {selectedAssignment && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0F274D] rounded-3xl p-6 max-w-lg w-full text-right space-y-4 shadow-2xl border border-slate-200 dark:border-white/10">
            <h3 className="text-lg font-black text-[#0B2D5B] dark:text-white">
              تسليم الواجب: {selectedAssignment.title}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              المادة: {selectedAssignment.subject} | {selectedAssignment.deadline}
            </p>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-200">نص الحل / رابط المشروعات والملفات:</label>
              <textarea
                rows={4}
                value={textAnswer}
                onChange={(e) => setTextAnswer(e.target.value)}
                placeholder="اكتب إجابتك أو رابط مشروعك (مثال: رابط GitHub أو Drive)..."
                className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none focus:border-[#F58220]"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedAssignment(null)}
                className="flex-1 h-11 rounded-xl bg-slate-100 dark:bg-white/10 text-xs font-bold cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="button"
                disabled={isSubmittingAssignment}
                onClick={handleSubmit}
                className="flex-1 h-11 rounded-xl bg-gradient-to-r from-[#F58220] to-[#FF9A2A] text-white text-xs font-bold shadow-md cursor-pointer disabled:opacity-50"
              >
                {isSubmittingAssignment ? "جاري التسليم..." : "تأكيد التسليم"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

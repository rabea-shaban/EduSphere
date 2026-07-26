"use client";

import * as React from "react";
import { FileCheck2, Download, CheckCircle2, Star } from "lucide-react";
import { mockSubmissions, SubmissionReview } from "@/features/teacher";

export default function InstructorAssignmentsPage() {
  const [submissions, setSubmissions] = React.useState<SubmissionReview[]>(mockSubmissions);
  const [selectedSub, setSelectedSub] = React.useState<SubmissionReview | null>(null);
  const [gradeInput, setGradeInput] = React.useState("95");
  const [feedbackInput, setFeedbackInput] = React.useState("");

  const handleGradeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSub) return;
    setSubmissions(
      submissions.map((s) =>
        s.id === selectedSub.id
          ? { ...s, status: "graded", score: Number(gradeInput), feedback: feedbackInput }
          : s
      )
    );
    setSelectedSub(null);
  };

  return (
    <div className="space-y-6 text-right">
      <div className="border-b border-slate-200/80 dark:border-white/10 pb-6">
        <h1 className="text-2xl sm:text-3xl font-black text-[#0B2D5B] dark:text-white">
          مراجعة وتقييم واجبات الطلاب 📋
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          قم بتنزيل أسطر البرمجة وملفات الـ PDF المسلمة ورصد الدرجات وكتابة التغذية الراجعة
        </p>
      </div>

      <div className="space-y-3">
        {submissions.map((sub) => (
          <div
            key={sub.id}
            className="p-5 rounded-2xl bg-white dark:bg-[#0F274D] border border-slate-200/80 dark:border-white/10 shadow-sm flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-[#0B2D5B]/10 text-[#0B2D5B] dark:text-[#F58220] flex items-center justify-center font-bold">
                <FileCheck2 className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#0B2D5B] dark:text-white">{sub.studentName} - {sub.assignmentTitle}</div>
                <div className="text-[11px] text-slate-400">تاريخ التسليم: {sub.submissionDate} | الملف: {sub.fileName}</div>
              </div>
            </div>

            {sub.status === "graded" ? (
              <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                تم رصد الدرجة: {sub.score} / {sub.maxScore}
              </span>
            ) : (
              <button
                type="button"
                onClick={() => setSelectedSub(sub)}
                className="px-4 py-2 rounded-xl bg-[#F58220] text-white text-xs font-bold shadow-md"
              >
                مراجعة ورصد الدرجة
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Grading Modal */}
      {selectedSub && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleGradeSubmit} className="bg-white dark:bg-[#0F274D] rounded-3xl p-6 max-w-md w-full text-right space-y-4 shadow-2xl border border-slate-200 dark:border-white/10">
            <h3 className="text-lg font-black text-[#0B2D5B] dark:text-white">
              تقييم واجب: {selectedSub.studentName}
            </h3>
            <p className="text-xs text-slate-500">{selectedSub.assignmentTitle}</p>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-200">الدرجة المستحقة (من {selectedSub.maxScore})</label>
              <input
                type="number"
                value={gradeInput}
                onChange={(e) => setGradeInput(e.target.value)}
                className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-200">التغذية الراجعة والتعليق</label>
              <textarea
                value={feedbackInput}
                onChange={(e) => setFeedbackInput(e.target.value)}
                rows={3}
                placeholder="اكتب ملاحظات تشجيعية وتصويبية للطالب..."
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedSub(null)}
                className="flex-1 h-11 rounded-xl bg-slate-100 dark:bg-white/10 text-xs font-bold"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="flex-1 h-11 rounded-xl bg-[#0B2D5B] dark:bg-[#1E73D8] text-white text-xs font-bold shadow-md"
              >
                حفظ الدرجة
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

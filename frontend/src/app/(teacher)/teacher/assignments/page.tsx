"use client";

import * as React from "react";
import { FileCheck2, Download, CheckCircle2, Edit3 } from "lucide-react";
import api from "@/services/api";
import { toast } from "react-hot-toast";

export default function InstructorAssignmentsPage() {
  const [submissions, setSubmissions] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [selectedSub, setSelectedSub] = React.useState<any | null>(null);
  const [gradeInput, setGradeInput] = React.useState("95");
  const [feedbackInput, setFeedbackInput] = React.useState("");

  const fetchSubmissions = React.useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/submissions/history", { params: { limit: 50 } });
      setSubmissions(res.data?.data?.submissions || []);
    } catch {
      toast.error("تعذر جلب التسليمات والواجبات");
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  const handleGradeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSub) return;

    try {
      await api.patch(`/submissions/${selectedSub._id}/grade`, {
        grade: Number(gradeInput),
        feedback: feedbackInput,
      });
      toast.success("تم رصد الدرجة وإرسال التغذية الراجعة للطالب بنجاح 🎉");
      setSelectedSub(null);
      fetchSubmissions();
    } catch (err: any) {
      toast.error(err?.message || "تعذر رصد الدرجة");
    }
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

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-20 rounded-2xl bg-slate-200 dark:bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : submissions.length > 0 ? (
        <div className="space-y-3">
          {submissions.map((sub) => {
            const studentObj = sub.studentId || {};
            const studentName = `${studentObj.firstName || ""} ${studentObj.lastName || ""}`.trim() || studentObj.email || "طالب EduSphere";
            const assignmentTitle = sub.assignmentId?.title || "واجب تطبيقي";
            const maxGrade = sub.assignmentId?.maxGrade || 100;
            const isGraded = sub.status === "Graded" || sub.grade !== undefined;

            return (
              <div
                key={sub._id}
                className="p-5 rounded-2xl bg-white dark:bg-[#0F274D] border border-slate-200/80 dark:border-white/10 shadow-sm flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-[#0B2D5B]/10 text-[#0B2D5B] dark:text-[#F58220] flex items-center justify-center font-bold">
                    <FileCheck2 className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#0B2D5B] dark:text-white">
                      {studentName} - {assignmentTitle}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      تاريخ التسليم: {new Date(sub.submittedAt || sub.createdAt).toLocaleDateString("ar-EG")}
                    </div>
                  </div>
                </div>

                {isGraded ? (
                  <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                    تم رصد الدرجة: {sub.grade} / {maxGrade}
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedSub(sub);
                      setGradeInput(String(sub.grade || maxGrade * 0.9));
                      setFeedbackInput(sub.feedback || "");
                    }}
                    className="px-4 py-2 rounded-xl bg-[#F58220] text-white text-xs font-bold shadow-md cursor-pointer"
                  >
                    مراجعة ورصد الدرجة
                  </button>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-[#0F274D] rounded-3xl border border-slate-200 dark:border-white/10 space-y-2">
          <FileCheck2 className="h-10 w-10 text-slate-400 mx-auto" />
          <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200">لا توجد واجبات مسلمة بانتظار التقييم حالياً</h4>
          <p className="text-xs text-slate-500">ستظهر هنا إجابات الطلاب المسلمة على الواجبات المنشورة</p>
        </div>
      )}

      {/* Grading Modal */}
      {selectedSub && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleGradeSubmit} className="bg-white dark:bg-[#0F274D] rounded-3xl p-6 max-w-md w-full text-right space-y-4 shadow-2xl border border-slate-200 dark:border-white/10">
            <h3 className="text-lg font-black text-[#0B2D5B] dark:text-white">
              تقييم واجب الطالب
            </h3>
            <p className="text-xs text-slate-500">{selectedSub.assignmentId?.title || "واجب مدرسي"}</p>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-200">الدرجة المستحقة (من {selectedSub.assignmentId?.maxGrade || 100})</label>
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
                className="flex-1 h-11 rounded-xl bg-slate-100 dark:bg-white/10 text-xs font-bold cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="flex-1 h-11 rounded-xl bg-[#0B2D5B] dark:bg-[#1E73D8] text-white text-xs font-bold shadow-md cursor-pointer"
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

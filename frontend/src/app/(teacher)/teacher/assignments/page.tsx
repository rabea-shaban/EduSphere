"use client";

import * as React from "react";
import { FileCheck2, Download, CheckCircle2, Edit3, PlusCircle, Trash2, Save, X, Calendar, Award } from "lucide-react";
import api from "@/services/api";
import { toast } from "react-hot-toast";

export default function InstructorAssignmentsPage() {
  const [activeTab, setActiveTab] = React.useState<"submissions" | "manage">("submissions");

  // Submissions state
  const [submissions, setSubmissions] = React.useState<any[]>([]);
  const [isLoadingSubmissions, setIsLoadingSubmissions] = React.useState(true);
  const [selectedSub, setSelectedSub] = React.useState<any | null>(null);
  const [gradeInput, setGradeInput] = React.useState("95");
  const [feedbackInput, setFeedbackInput] = React.useState("");

  // Assignments list & modal state
  const [assignments, setAssignments] = React.useState<any[]>([]);
  const [isLoadingAssignments, setIsLoadingAssignments] = React.useState(true);
  const [showModal, setShowModal] = React.useState(false);
  const [editingAssignmentId, setEditingAssignmentId] = React.useState<string | null>(null);

  // Assignment form states
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [maxGrade, setMaxGrade] = React.useState(100);
  const [dueDate, setDueDate] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const fetchSubmissions = React.useCallback(async () => {
    try {
      setIsLoadingSubmissions(true);
      const res = await api.get("/submissions/history", { params: { limit: 50 } });
      setSubmissions(res.data?.data?.submissions || res.data?.data || []);
    } catch {
      toast.error("تعذر جلب التسليمات والواجبات");
    } finally {
      setIsLoadingSubmissions(false);
    }
  }, []);

  const fetchAssignments = React.useCallback(async () => {
    try {
      setIsLoadingAssignments(true);
      const res = await api.get("/assignments", { params: { limit: 50 } });
      setAssignments(res.data?.data?.assignments || res.data?.data || []);
    } catch {
      toast.error("تعذر جلب قائمة الواجبات");
    } finally {
      setIsLoadingAssignments(false);
    }
  }, []);

  React.useEffect(() => {
    fetchSubmissions();
    fetchAssignments();
  }, [fetchSubmissions, fetchAssignments]);

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
      toast.error(err?.response?.data?.message || err?.message || "تعذر رصد الدرجة");
    }
  };

  const handleOpenCreateAssignment = () => {
    setEditingAssignmentId(null);
    setTitle("");
    setDescription("");
    setMaxGrade(100);
    setDueDate("");
    setShowModal(true);
  };

  const handleOpenEditAssignment = (ass: any) => {
    setEditingAssignmentId(ass._id);
    setTitle(ass.title || "");
    setDescription(ass.description || "");
    setMaxGrade(ass.maxGrade || 100);
    if (ass.dueDate) {
      setDueDate(new Date(ass.dueDate).toISOString().split("T")[0]);
    }
    setShowModal(true);
  };

  const handleSaveAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("يرجى كتابة عنوان الواجب التطبيقي");
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        title: title.trim(),
        description: description.trim() || undefined,
        maxGrade: Number(maxGrade),
        dueDate: dueDate || undefined,
      };

      if (editingAssignmentId) {
        await api.patch(`/assignments/${editingAssignmentId}`, payload);
        toast.success("تم تحديث الواجب التطبيقي بنجاح 🎉");
      } else {
        await api.post("/assignments", payload);
        toast.success("تم إنشاء الواجب الجديد ونشره بنجاح 📋");
      }

      setShowModal(false);
      fetchAssignments();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || "تعذر حفظ الواجب");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAssignment = async (id: string) => {
    if (!confirm("هل أنت تأكد من رغبتك في حذف هذا الواجب؟")) return;
    try {
      await api.delete(`/assignments/${id}`);
      toast.success("تم حذف الواجب بنجاح 🗑️");
      setAssignments((prev) => prev.filter((a) => a._id !== id));
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || "تعذر حذف الواجب");
    }
  };

  return (
    <div className="space-y-6 text-right dir-rtl">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-white/10 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0B2D5B] dark:text-white">
            إدارة الواجبات وتطبيقات الطلاب 📋
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            صمم الواجبات التطبيقية، راجع التسليمات، ورصد الدرجات والتغذية الراجعة
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreateAssignment}
          className="h-11 px-6 rounded-2xl bg-gradient-to-r from-[#F58220] to-[#FF9A2A] text-white text-xs font-black flex items-center gap-2 shadow-md shadow-[#F58220]/20 cursor-pointer hover:opacity-95 transition-opacity"
        >
          <PlusCircle className="h-4 w-4" />
          <span>إنشاء واجب جديد</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-white/10 text-xs font-black gap-6">
        <button
          type="button"
          onClick={() => setActiveTab("submissions")}
          className={`pb-3 border-b-2 transition-all cursor-pointer ${
            activeTab === "submissions"
              ? "border-[#F58220] text-[#F58220]"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          تسليمات وإجابات الطلاب ({submissions.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("manage")}
          className={`pb-3 border-b-2 transition-all cursor-pointer ${
            activeTab === "manage"
              ? "border-[#F58220] text-[#F58220]"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          إدارة وتعديل الواجبات ({assignments.length})
        </button>
      </div>

      {/* TAB 1: SUBMISSIONS & GRADING */}
      {activeTab === "submissions" && (
        <>
          {isLoadingSubmissions ? (
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
                const maxG = sub.assignmentId?.maxGrade || 100;
                const isGraded = sub.status === "Graded" || sub.grade !== undefined;

                return (
                  <div
                    key={sub._id}
                    className="p-5 rounded-2xl bg-white dark:bg-[#0F274D] border border-slate-200/80 dark:border-white/10 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-11 w-11 rounded-2xl bg-[#0B2D5B]/10 text-[#0B2D5B] dark:text-[#F58220] flex items-center justify-center font-bold shrink-0">
                        <FileCheck2 className="h-6 w-6" />
                      </div>
                      <div className="space-y-0.5">
                        <div className="text-sm font-extrabold text-[#0B2D5B] dark:text-white">
                          {studentName} — {assignmentTitle}
                        </div>
                        <div className="text-xs text-slate-400 font-semibold">
                          تاريخ التسليم: {new Date(sub.submittedAt || sub.createdAt).toLocaleDateString("ar-EG")}
                        </div>
                      </div>
                    </div>

                    {isGraded ? (
                      <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3.5 py-1.5 rounded-full border border-emerald-500/20 self-end sm:self-center">
                        تم رصد الدرجة: {sub.grade} / {maxG}
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedSub(sub);
                          setGradeInput(String(sub.grade || maxG * 0.9));
                          setFeedbackInput(sub.feedback || "");
                        }}
                        className="px-4 py-2 rounded-xl bg-[#F58220] hover:bg-[#FF9A2A] text-white text-xs font-bold shadow-md cursor-pointer transition-all self-end sm:self-center"
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
        </>
      )}

      {/* TAB 2: ASSIGNMENTS MANAGEMENT CRUD */}
      {activeTab === "manage" && (
        <>
          {isLoadingAssignments ? (
            <div className="space-y-3">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-20 rounded-2xl bg-slate-200 dark:bg-white/5 animate-pulse" />
              ))}
            </div>
          ) : assignments.length > 0 ? (
            <div className="space-y-3">
              {assignments.map((ass: any) => (
                <div
                  key={ass._id}
                  className="p-5 rounded-2xl bg-white dark:bg-[#0F274D] border border-slate-200/80 dark:border-white/10 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 rounded-2xl bg-[#F58220]/15 text-[#F58220] flex items-center justify-center font-bold shrink-0">
                      <FileCheck2 className="h-6 w-6" />
                    </div>
                    <div className="space-y-0.5">
                      <div className="text-sm font-extrabold text-[#0B2D5B] dark:text-white">{ass.title}</div>
                      <div className="text-xs text-slate-400 font-semibold flex items-center gap-3">
                        <span>الدرجة الكلية: {ass.maxGrade || 100}</span>
                        <span>•</span>
                        <span>أخر موعد: {ass.dueDate ? new Date(ass.dueDate).toLocaleDateString("ar-EG") : "غير محدد"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={() => handleOpenEditAssignment(ass)}
                      className="px-3.5 py-2 rounded-xl bg-[#0B2D5B] dark:bg-[#1E73D8] text-white text-xs font-bold hover:bg-[#F58220] transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                      <span>تعديل</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteAssignment(ass._id)}
                      className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 hover:bg-rose-100 transition-colors cursor-pointer"
                      title="حذف الواجب"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white dark:bg-[#0F274D] rounded-3xl border border-slate-200 dark:border-white/10 space-y-3">
              <FileCheck2 className="h-10 w-10 text-slate-400 mx-auto" />
              <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200">لا توجد واجبات مضافة حتى الآن</h4>
              <button
                type="button"
                onClick={handleOpenCreateAssignment}
                className="px-4 py-2 rounded-xl bg-[#F58220] text-white text-xs font-bold"
              >
                إنشاء أول واجب تطبيقي
              </button>
            </div>
          )}
        </>
      )}

      {/* Grading Modal */}
      {selectedSub && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleGradeSubmit} className="bg-white dark:bg-[#0F274D] rounded-3xl p-6 max-w-md w-full text-right space-y-4 shadow-2xl border border-slate-200 dark:border-white/10">
            <h3 className="text-lg font-black text-[#0B2D5B] dark:text-white">
              تقييم واجب الطالب ورصد الدرجة
            </h3>
            <p className="text-xs text-slate-500 font-semibold">{selectedSub.assignmentId?.title || "واجب تطبيقي"}</p>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-200">الدرجة المستحقة (من {selectedSub.assignmentId?.maxGrade || 100})</label>
              <input
                type="number"
                value={gradeInput}
                onChange={(e) => setGradeInput(e.target.value)}
                className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold outline-none"
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
                حفظ وتأكيد الدرجة
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Assignment Modal Dialog */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0F274D] w-full max-w-lg rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-white/10 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-4">
              <h3 className="text-lg font-black text-[#0B2D5B] dark:text-white">
                {editingAssignmentId ? "تعديل الواجب التطبيقي" : "إنشاء واجب تطبيقي جديد"}
              </h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="h-8 w-8 rounded-full bg-slate-100 dark:bg-white/10 text-slate-500 flex items-center justify-center cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveAssignment} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-200">عنوان الواجب *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="مثال: واجب الدرس الأول - كتابة كود الخوارزميات"
                  className="w-full h-11 px-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 outline-none focus:border-[#F58220] font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-200">الوصف والإرشادات للطلاب</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="اكتب متطلبات الواجب بالتفصيل ليتعلم الطالب..."
                  className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 outline-none focus:border-[#F58220] font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-200">الدرجة الكلية (Max Grade)</label>
                  <input
                    type="number"
                    min={10}
                    max={500}
                    value={maxGrade}
                    onChange={(e) => setMaxGrade(Number(e.target.value))}
                    className="w-full h-11 px-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 outline-none focus:border-[#F58220] font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-200">أخر موعد للتسليم (Due Date)</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full h-11 px-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 outline-none focus:border-[#F58220] font-bold"
                  />
                </div>
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 h-11 rounded-2xl bg-[#0B2D5B] hover:bg-[#1E73D8] text-white font-black flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Save className="h-4 w-4" />
                  <span>{isSubmitting ? "جاري الحفظ..." : "حفظ الواجب"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 h-11 rounded-2xl bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-200 font-bold"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

"use client";

import * as React from "react";
import Link from "next/link";
import { HelpCircle, PlusCircle, Clock, Trash2, Edit3, Save, X, CheckCircle2, Copy } from "lucide-react";
import api from "@/services/api";
import { ApiQuiz } from "@/features/dashboard/types/api";
import { toast } from "react-hot-toast";

export default function QuizzesManagementPage() {
  const [quizzes, setQuizzes] = React.useState<ApiQuiz[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  
  // Modal states
  const [showModal, setShowModal] = React.useState(false);
  const [editingQuizId, setEditingQuizId] = React.useState<string | null>(null);

  // Form states
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [duration, setDuration] = React.useState(30);
  const [passingScore, setPassingScore] = React.useState(60);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const fetchQuizzes = React.useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/quizzes", { params: { limit: 50 } });
      setQuizzes(res.data?.data?.quizzes || res.data?.data || []);
    } catch {
      toast.error("تعذر جلب قائمة الاختبارات");
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchQuizzes();
  }, [fetchQuizzes]);

  const handleOpenCreateModal = () => {
    setEditingQuizId(null);
    setTitle("");
    setDescription("");
    setDuration(30);
    setPassingScore(60);
    setShowModal(true);
  };

  const handleOpenEditModal = (q: any) => {
    setEditingQuizId(q._id);
    setTitle(q.title || "");
    setDescription(q.description || "");
    setDuration(q.duration || 30);
    setPassingScore(q.passingScore || 60);
    setShowModal(true);
  };

  const handleSaveQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("يرجى كتابة عنوان الاختبار");
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        title: title.trim(),
        description: description.trim() || undefined,
        duration: Number(duration),
        passingScore: Number(passingScore),
      };

      if (editingQuizId) {
        await api.patch(`/quizzes/${editingQuizId}`, payload);
        toast.success("تم تحديث بيانات الاختبار بنجاح 🎉");
      } else {
        await api.post("/quizzes", payload);
        toast.success("تم إنشاء الاختبار الجديد بنجاح 📝");
      }

      setShowModal(false);
      fetchQuizzes();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || "تعذر حفظ الاختبار");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت تأكد من رغبتك في حذف هذا الاختبار؟")) return;
    try {
      await api.delete(`/quizzes/${id}`);
      toast.success("تم حذف الاختبار بنجاح 🗑️");
      setQuizzes((prev) => prev.filter((q) => q._id !== id));
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || "تعذر حذف الاختبار");
    }
  };

  return (
    <div className="space-y-6 text-right dir-rtl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-white/10 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0B2D5B] dark:text-white">
            إدارة الاختبارات والكويزات 📝
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            إنشاء، تعديل، وتقييم الاختبارات التفاعلية وتحديد أوقات الإجابة
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreateModal}
          className="h-11 px-6 rounded-2xl bg-gradient-to-r from-[#F58220] to-[#FF9A2A] text-white text-xs font-black flex items-center gap-2 shadow-md shadow-[#F58220]/20 cursor-pointer hover:opacity-95 transition-opacity"
        >
          <PlusCircle className="h-4 w-4" />
          <span>إنشاء اختبار جديد</span>
        </button>
      </div>

      {/* Quizzes List */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-20 rounded-2xl bg-slate-200 dark:bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : quizzes.length > 0 ? (
        <div className="space-y-3">
          {quizzes.map((q: any) => (
            <div
              key={q._id}
              className="p-5 rounded-2xl bg-white dark:bg-[#0F274D] border border-slate-200/80 dark:border-white/10 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-2xl bg-[#F58220]/15 text-[#F58220] flex items-center justify-center font-bold shrink-0">
                  <HelpCircle className="h-6 w-6" />
                </div>
                <div className="space-y-0.5">
                  <div className="text-sm font-extrabold text-[#0B2D5B] dark:text-white">{q.title}</div>
                  <div className="text-xs text-slate-400 font-semibold flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{q.duration || 30} دقيقة</span>
                    </span>
                    <span>•</span>
                    <span>نسبة النجاح: {q.passingScore || 60}%</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  type="button"
                  onClick={() => handleOpenEditModal(q)}
                  className="px-3.5 py-2 rounded-xl bg-[#0B2D5B] dark:bg-[#1E73D8] text-white text-xs font-bold hover:bg-[#F58220] transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  <span>تعديل</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(q._id)}
                  className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 hover:bg-rose-100 transition-colors cursor-pointer"
                  title="حذف الاختبار"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-[#0F274D] rounded-3xl border border-slate-200 dark:border-white/10 space-y-3">
          <HelpCircle className="h-10 w-10 text-slate-400 mx-auto" />
          <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200">لا توجد اختبارات مضافة حالياً</h4>
          <p className="text-xs text-slate-500">قم بإنشاء اختبارك التفاعلي الأول وتقييم استيعاب الطلاب</p>
          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="px-4 py-2 rounded-xl bg-[#F58220] text-white text-xs font-bold"
          >
            إنشاء أول اختبار
          </button>
        </div>
      )}

      {/* Modal Dialog */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0F274D] w-full max-w-lg rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-white/10 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-4">
              <h3 className="text-lg font-black text-[#0B2D5B] dark:text-white">
                {editingQuizId ? "تعديل بيانات الاختبار" : "إنشاء اختبار تفاعلي جديد"}
              </h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="h-8 w-8 rounded-full bg-slate-100 dark:bg-white/10 text-slate-500 flex items-center justify-center cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveQuiz} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-200">عنوان الاختبار *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="مثال: اختبار الوحدة الأولى - الفيزيا الكهرومغناطيسية"
                  className="w-full h-11 px-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 outline-none focus:border-[#F58220] font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-200">الوصف والإرشادات للطلاب</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="اكتب الإرشادات والتعليمات الخاصة بالاختبار..."
                  className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 outline-none focus:border-[#F58220] font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-200">مدة الاختبار (بالدقائق)</label>
                  <input
                    type="number"
                    min={5}
                    max={300}
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full h-11 px-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 outline-none focus:border-[#F58220] font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-200">درجة النجاح (%)</label>
                  <input
                    type="number"
                    min={10}
                    max={100}
                    value={passingScore}
                    onChange={(e) => setPassingScore(Number(e.target.value))}
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
                  <span>{isSubmitting ? "جاري الحفظ..." : "حفظ الاختبار"}</span>
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

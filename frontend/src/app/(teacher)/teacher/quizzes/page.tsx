"use client";

import * as React from "react";
import Link from "next/link";
import { HelpCircle, PlusCircle, Clock, Trash2, Edit3 } from "lucide-react";
import api from "@/services/api";
import { ApiQuiz } from "@/features/dashboard/types/api";
import { toast } from "react-hot-toast";

export default function QuizzesManagementPage() {
  const [quizzes, setQuizzes] = React.useState<ApiQuiz[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const fetchQuizzes = React.useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/quizzes", { params: { limit: 50 } });
      setQuizzes(res.data?.data?.quizzes || []);
    } catch {
      toast.error("تعذر جلب قائمة الاختبارات");
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchQuizzes();
  }, [fetchQuizzes]);

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/quizzes/${id}`);
      toast.success("تم حذف الاختبار بنجاح 🗑️");
      fetchQuizzes();
    } catch (err: any) {
      toast.error(err?.message || "تعذر حذف الاختبار");
    }
  };

  return (
    <div className="space-y-6 text-right">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-white/10 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0B2D5B] dark:text-white">
            إدارة الاختبارات والأسئلة 📝
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            صمم الاختبارات التفاعلية، حدد التوقيت ونسبة النجاح للمرحلة الثانوية والبكالوريا
          </p>
        </div>

        <Link
          href="/teacher/quizzes/create"
          className="h-11 px-6 rounded-xl bg-gradient-to-r from-[#F58220] to-[#FF9A2A] text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-[#F58220]/20 cursor-pointer"
        >
          <PlusCircle className="h-4 w-4" />
          <span>إنشاء اختبار جديد</span>
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-20 rounded-2xl bg-slate-200 dark:bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : quizzes.length > 0 ? (
        <div className="space-y-3">
          {quizzes.map((q) => (
            <div
              key={q._id}
              className="p-5 rounded-2xl bg-white dark:bg-[#0F274D] border border-slate-200/80 dark:border-white/10 shadow-sm flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-[#F58220]/15 text-[#F58220] flex items-center justify-center font-bold">
                  <HelpCircle className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-[#0B2D5B] dark:text-white">{q.title}</div>
                  <div className="text-[11px] text-slate-400">
                    {q.totalQuestions || 10} سؤالاً • {q.duration || 30} دقيقة • نسبة النجاح: {q.passingScore || 50}%
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => toast("جاري فتح محرر أسئلة الاختبار... 📝")}
                  className="px-4 py-2 rounded-xl bg-[#0B2D5B] dark:bg-[#1E73D8] text-white text-xs font-bold hover:bg-[#F58220] transition-colors cursor-pointer"
                >
                  <Edit3 className="h-4 w-4 inline-block ml-1" />
                  <span>تعديل</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(q._id)}
                  className="p-2 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 hover:bg-red-100 transition-colors cursor-pointer"
                  title="حذف الاختبار"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-[#0F274D] rounded-3xl border border-slate-200 dark:border-white/10 space-y-2">
          <HelpCircle className="h-10 w-10 text-slate-400 mx-auto" />
          <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200">لا توجد اختبارات مضافة حالياً</h4>
          <p className="text-xs text-slate-500">قم بإنشاء اختبارك التفاعلي الأول وتقييم الطلاب المتقدمين</p>
        </div>
      )}
    </div>
  );
}

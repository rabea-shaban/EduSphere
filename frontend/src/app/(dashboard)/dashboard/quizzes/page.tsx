"use client";

import * as React from "react";
import { HelpCircle, CheckCircle2, Search } from "lucide-react";
import { mockQuizzes, QuizCard, QuizItem } from "@/features/dashboard";

export default function QuizzesPage() {
  const [filter, setFilter] = React.useState<"all" | "available" | "completed">("all");
  const [selectedQuiz, setSelectedQuiz] = React.useState<QuizItem | null>(null);

  const filteredQuizzes = mockQuizzes.filter((q) => {
    if (filter === "available") return q.status === "available";
    if (filter === "completed") return q.status === "completed";
    return true;
  });

  return (
    <div className="space-y-6 text-right">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-white/10 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0B2D5B] dark:text-white">
            الاختبارات والتقييمات 📝
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            قس مستوى فهمك واستعد للامتحانات النهائية بأسئلة تفاعلية وتقييم فوري
          </p>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              filter === "all"
                ? "bg-[#0B2D5B] dark:bg-[#1E73D8] text-white"
                : "bg-white dark:bg-[#0F274D] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10"
            }`}
          >
            الكل ({mockQuizzes.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("available")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              filter === "available"
                ? "bg-[#F58220] text-white"
                : "bg-white dark:bg-[#0F274D] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10"
            }`}
          >
            المتاحة الآن
          </button>
          <button
            type="button"
            onClick={() => setFilter("completed")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              filter === "completed"
                ? "bg-emerald-600 text-white"
                : "bg-white dark:bg-[#0F274D] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10"
            }`}
          >
            المكتملة
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredQuizzes.map((quiz) => (
          <QuizCard
            key={quiz.id}
            quiz={quiz}
            onStartQuiz={(q) => setSelectedQuiz(q)}
          />
        ))}
      </div>

      {/* Interactive Modal Drawer for Quiz Start Demo */}
      {selectedQuiz && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0F274D] rounded-3xl p-6 max-w-md w-full text-right space-y-4 shadow-2xl border border-slate-200 dark:border-white/10">
            <h3 className="text-lg font-black text-[#0B2D5B] dark:text-white">
              بدء الاختبار: {selectedQuiz.title}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              عدد الأسئلة: {selectedQuiz.totalQuestions} | الزمن المتاح: {selectedQuiz.durationMinutes} دقيقة | المحاولات المتبقية: {selectedQuiz.attemptsLeft}
            </p>
            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-xs text-amber-700 dark:text-amber-300 font-semibold">
              تنبيه: يبدأ حساب الوقت فور الضغط على تأكيد البدء. تأكد من استقرار الاتصال بالإنترنت.
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedQuiz(null)}
                className="flex-1 h-11 rounded-xl bg-slate-100 dark:bg-white/10 text-xs font-bold"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={() => {
                  alert("جاري تجهيز بيئة الاختبار التفاعلية...");
                  setSelectedQuiz(null);
                }}
                className="flex-1 h-11 rounded-xl bg-[#F58220] text-white text-xs font-bold shadow-md"
              >
                تأكيد وبدء الاختبار
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

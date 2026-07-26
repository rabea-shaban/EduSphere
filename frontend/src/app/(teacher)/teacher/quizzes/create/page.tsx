"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { HelpCircle, Plus, Trash2, Sparkles, CheckCircle2 } from "lucide-react";

export default function CreateQuizPage() {
  const router = useRouter();
  const [title, setTitle] = React.useState("");
  const [duration, setDuration] = React.useState(30);
  const [passingScore, setPassingScore] = React.useState(70);
  const [questions, setQuestions] = React.useState([
    { id: 1, text: "ما هو التعقيد الزمني لخوارزمية البحث الثنائي (Binary Search)؟", options: ["O(N)", "O(log N)", "O(N^2)", "O(1)"], correctOption: 1 },
  ]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: Date.now(),
        text: "سؤال جديد...",
        options: ["خيار A", "خيار B", "خيار C", "خيار D"],
        correctOption: 0,
      },
    ]);
  };

  const handleFinish = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1200));
    setIsSubmitting(false);
    alert("تم إعداد ونشر الاختبار بنجاح على منصة EduSphere! 🎉");
    router.push("/teacher/quizzes");
  };

  return (
    <div className="space-y-6 text-right">
      <div className="border-b border-slate-200/80 dark:border-white/10 pb-6">
        <h1 className="text-2xl sm:text-3xl font-black text-[#0B2D5B] dark:text-white">
          باني الأسئلة والاختبارات التفاعلي 📝
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          أنشئ أسئلة الاختيار من متعدد، حدد درجة النجاح والزمن المتاح للطلاب
        </p>
      </div>

      <form onSubmit={handleFinish} className="space-y-6 max-w-2xl">
        <div className="bg-white dark:bg-[#0F274D] rounded-3xl p-6 border border-slate-200/80 dark:border-white/10 shadow-sm space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-200">عنوان الاختبار</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثال: اختبار التفكير الخوارزمي وهياكل البيانات"
              required
              className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none focus:border-[#F58220]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-200">الزمن المتاح (بالدقائق)</label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-200">نسبة النجاح المطلوب (%)</label>
              <input
                type="number"
                value={passingScore}
                onChange={(e) => setPassingScore(Number(e.target.value))}
                className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none"
              />
            </div>
          </div>
        </div>

        {/* Questions List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-[#0B2D5B] dark:text-white">
              أسئلة الاختبار ({questions.length})
            </h3>
            <button
              type="button"
              onClick={handleAddQuestion}
              className="px-4 py-2 rounded-xl bg-[#F58220] text-white text-xs font-bold flex items-center gap-1.5 shadow-md"
            >
              <Plus className="h-4 w-4" />
              <span>إضافة سؤال جديد</span>
            </button>
          </div>

          {questions.map((q, idx) => (
            <div key={q.id} className="bg-white dark:bg-[#0F274D] rounded-3xl p-6 border border-slate-200/80 dark:border-white/10 shadow-sm space-y-3">
              <div className="flex justify-between items-center text-xs font-extrabold text-[#0B2D5B] dark:text-white">
                <span>السؤال رقم {idx + 1}</span>
                {questions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setQuestions(questions.filter((item) => item.id !== q.id))}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
              <input
                type="text"
                defaultValue={q.text}
                placeholder="صياغة نص السؤال..."
                className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none"
              />
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-12 rounded-xl bg-gradient-to-r from-[#F58220] to-[#FF9A2A] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg"
        >
          <Sparkles className="h-4 w-4" />
          <span>{isSubmitting ? "جاري الحفظ..." : "حفظ ونشر الاختبار على الطلاب"}</span>
        </button>
      </form>
    </div>
  );
}

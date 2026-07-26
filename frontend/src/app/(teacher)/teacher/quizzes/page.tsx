"use client";

import * as React from "react";
import Link from "next/link";
import { HelpCircle, PlusCircle, Clock, CheckCircle2 } from "lucide-react";

import { toast } from "react-hot-toast";

export default function QuizzesManagementPage() {
  return (
    <div className="space-y-6 text-right">
      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-white/10 pb-6">
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
          className="h-11 px-6 rounded-xl bg-gradient-to-r from-[#F58220] to-[#FF9A2A] text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-[#F58220]/20"
        >
          <PlusCircle className="h-4 w-4" />
          <span>إنشاء اختبار جديد</span>
        </Link>
      </div>

      <div className="space-y-3">
        {[
          { title: "اختبار التفكير الخوارزمي وهياكل البيانات", course: "أساسيات علوم الحاسب", questions: 20, duration: "30 دقيقة", attempts: 2 },
          { title: "اختبار الشبكات العصبية وتطبيقات AI", course: "الذكاء الاصطناعي وتعلم الآلة", questions: 25, duration: "40 دقيقة", attempts: 1 },
        ].map((q, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-white dark:bg-[#0F274D] border border-slate-200/80 dark:border-white/10 shadow-sm flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-[#F58220]/15 text-[#F58220] flex items-center justify-center font-bold">
                <HelpCircle className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#0B2D5B] dark:text-white">{q.title}</div>
                <div className="text-[11px] text-slate-400">{q.course} • {q.questions} سؤالاً • {q.duration}</div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => toast("جاري فتح محرر أسئلة الاختبار... 📝")}
              className="px-4 py-2 rounded-xl bg-[#0B2D5B] dark:bg-[#1E73D8] text-white text-xs font-bold hover:bg-[#F58220] transition-colors"
            >
              تعديل الأسئلة
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

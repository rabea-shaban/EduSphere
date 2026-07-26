"use client";

import * as React from "react";
import { PlayCircle, FileText, CheckCircle2 } from "lucide-react";

export default function AdminLessonsPage() {
  return (
    <div className="space-y-6 text-right">
      <div className="border-b border-slate-200/80 dark:border-white/10 pb-6">
        <h1 className="text-2xl sm:text-3xl font-black text-[#0B2D5B] dark:text-white">
          إدارة الدروس وسيرفرات الفيديو 🎬
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          متابعة استهلاك الباندويث وسيرفرات الاستضافة وتشفير مقاطع الفيديو
        </p>
      </div>

      <div className="space-y-3">
        {[
          { title: "الدرس 26: التفكير الخوارزمي وهياكل البيانات", course: "أساسيات علوم الحاسب", teacher: "د. طارق محمود", status: "نشط 🟢" },
          { title: "الدرس 12: بناء شبكة عصبية اصطناعية مبسطة", course: "الذكاء الاصطناعي وتعلم الآلة", teacher: "د. طارق محمود", status: "نشط 🟢" },
        ].map((les, idx) => (
          <div key={idx} className="p-4 rounded-2xl bg-white dark:bg-[#0F274D] border border-slate-200/80 dark:border-white/10 shadow-sm flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <PlayCircle className="h-5 w-5 text-[#F58220]" />
              <div>
                <div className="font-bold text-[#0B2D5B] dark:text-white">{les.title}</div>
                <div className="text-slate-400">{les.course} • المحاضر: {les.teacher}</div>
              </div>
            </div>
            <span className="font-bold text-emerald-600">{les.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";

import * as React from "react";
import Link from "next/link";
import { PlayCircle, PlusCircle, FileText, Upload } from "lucide-react";

export default function LessonsManagementPage() {
  return (
    <div className="space-y-6 text-right">
      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-white/10 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0B2D5B] dark:text-white">
            إدارة الدروس والمحتوى 🎬
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            رفع ملفات الفيديو ومذكرات الـ PDF والمرفقات لجميع الكورسات
          </p>
        </div>

        <Link
          href="/teacher/lessons/create"
          className="h-11 px-6 rounded-xl bg-gradient-to-r from-[#F58220] to-[#FF9A2A] text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-[#F58220]/20"
        >
          <PlusCircle className="h-4 w-4" />
          <span>إضافة درس جديد</span>
        </Link>
      </div>

      <div className="space-y-3">
        {[
          { title: "الدرس 26: التفكير الخوارزمي وهياكل البيانات (Data Structures)", course: "أساسيات علوم الحاسب", duration: "45:30 م", type: "فيديو + PDF" },
          { title: "الدرس 12: بناء شبكة عصبية اصطناعية مبسطة (Neural Networks)", course: "الذكاء الاصطناعي وتعلم الآلة", duration: "50:10 م", type: "فيديو + كود" },
          { title: "الدرس 18: إعداد ورقة البحث العلمية وصياغة الحجج", course: "مهارات البحث والتعليم - البكالوريا", duration: "35:00 م", type: "PDF تفاعلي" },
        ].map((les, idx) => (
          <div
            key={idx}
            className="p-4 rounded-2xl bg-white dark:bg-[#0F274D] border border-slate-200/80 dark:border-white/10 shadow-sm flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-[#0B2D5B]/10 text-[#0B2D5B] dark:text-[#F58220] flex items-center justify-center font-bold">
                <PlayCircle className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#0B2D5B] dark:text-white">{les.title}</div>
                <div className="text-[11px] text-slate-400">{les.course} • {les.duration}</div>
              </div>
            </div>

            <span className="text-xs font-extrabold text-[#F58220] bg-[#F58220]/10 px-3 py-1 rounded-full border border-[#F58220]/20">
              {les.type}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";

import * as React from "react";
import { FolderTree, Plus, Edit, BookOpen } from "lucide-react";

import { toast } from "react-hot-toast";

export default function AdminAcademicPage() {
  const stages = [
    { title: "💻 مسار علوم الحاسب والتكنولوجيا", count: "12 كورسات مخصصة", color: "from-[#0B2D5B] to-[#1E73D8]" },
    { title: "🏫 المرحلة الثانوية (عام)", count: "الصف الأول، الثاني، والثالث الثانوي", color: "from-blue-600 to-indigo-600" },
    { title: "🕌 التعليم الأزهري الشريف", count: "المرحلة الثانوية الأسطورية", color: "from-emerald-600 to-teal-600" },
    { title: "📜 نظام البكالوريا الجديد", count: "البكالوريا الدولية والوطنية", color: "from-amber-600 to-orange-600" },
  ];

  return (
    <div className="space-y-6 text-right">
      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-white/10 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0B2D5B] dark:text-white">
            المراحل الدراسية والمنظومة الأكاديمية 🏫
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            إدارة مسارات التعليم العام، الأزهر الشريف، البكالوريا، ومسار علوم الحاسب
          </p>
        </div>

        <button
          type="button"
          onClick={() => toast("جاري تحضير نموذج إضافة مسار تعليمي جديد... 🏫")}
          className="h-11 px-6 rounded-xl bg-gradient-to-r from-[#F58220] to-[#FF9A2A] text-white text-xs font-bold flex items-center gap-2 shadow-md"
        >
          <Plus className="h-4 w-4" />
          <span>إضافة مسار جديد</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stages.map((stg, idx) => (
          <div
            key={idx}
            className="rounded-3xl p-6 bg-white dark:bg-[#0F274D] border border-slate-200/80 dark:border-white/10 shadow-sm space-y-4 text-right hover:shadow-xl transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-base font-extrabold text-[#0B2D5B] dark:text-white">{stg.title}</span>
              <span className="text-xs font-bold text-slate-400">{stg.count}</span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden">
              <div className={`h-full bg-gradient-to-r ${stg.color} w-3/4`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

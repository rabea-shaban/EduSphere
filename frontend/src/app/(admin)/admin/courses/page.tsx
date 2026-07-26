"use client";

import * as React from "react";
import { BookOpen, Search, CheckCircle2, Eye } from "lucide-react";
import { mockTeacherCourses, TeacherCourseCard } from "@/features/teacher";

export default function AdminCoursesPage() {
  const [search, setSearch] = React.useState("");

  return (
    <div className="space-y-6 text-right">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-white/10 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0B2D5B] dark:text-white">
            إدارة ومراجعة جميع الكورسات 📚
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            اعتماد الكورسات، مراجعة جودة المحتوى، ونسبة الاشتراكات للمنصة
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="البحث اسم الكورس..."
            className="w-full h-11 pr-10 pl-4 rounded-xl text-xs font-semibold bg-white dark:bg-[#0F274D] border border-slate-200 dark:border-white/10 outline-none focus:border-[#F58220]"
          />
          <Search className="absolute right-3 top-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockTeacherCourses.map((course) => (
          <TeacherCourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}

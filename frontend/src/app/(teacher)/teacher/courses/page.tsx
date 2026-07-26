"use client";

import * as React from "react";
import Link from "next/link";
import { PlusCircle, Search, BookOpen } from "lucide-react";
import { mockTeacherCourses, TeacherCourseCard } from "@/features/teacher";

export default function InstructorCoursesPage() {
  const [filter, setFilter] = React.useState<"all" | "published" | "draft">("all");
  const [search, setSearch] = React.useState("");

  const filtered = mockTeacherCourses.filter((c) => {
    const matchesFilter = filter === "all" || c.status === filter;
    const matchesSearch = c.title.includes(search) || c.subject.includes(search);
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6 text-right">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-white/10 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0B2D5B] dark:text-white">
            إدارة الكورسات 📚
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            إضافة الكورسات المنشورة والمسودات، وتعديل المناهج المدرسية
          </p>
        </div>

        <Link
          href="/teacher/courses/create"
          className="h-11 px-6 rounded-xl bg-gradient-to-r from-[#F58220] to-[#FF9A2A] text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-[#F58220]/20 hover:-translate-y-0.5 transition-all"
        >
          <PlusCircle className="h-4 w-4" />
          <span>إنشاء كورس جديد</span>
        </Link>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
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
            جميع الكورسات ({mockTeacherCourses.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("published")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              filter === "published"
                ? "bg-emerald-600 text-white"
                : "bg-white dark:bg-[#0F274D] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10"
            }`}
          >
            المنشورة
          </button>
          <button
            type="button"
            onClick={() => setFilter("draft")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              filter === "draft"
                ? "bg-amber-600 text-white"
                : "bg-white dark:bg-[#0F274D] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10"
            }`}
          >
            المسودات
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="البحث في كورس..."
            className="w-full h-11 pr-10 pl-4 rounded-xl text-xs font-semibold bg-white dark:bg-[#0F274D] border border-slate-200 dark:border-white/10 outline-none focus:border-[#F58220]"
          />
          <Search className="absolute right-3 top-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((course) => (
          <TeacherCourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}

"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { BookOpen, Search, Sparkles, Filter } from "lucide-react";
import { mockEnrolledCourses, CourseCard } from "@/features/dashboard";

export default function MyCoursesPage() {
  const [filter, setFilter] = React.useState<"all" | "cs" | "general" | "azhari" | "baccalaureate">("all");
  const [search, setSearch] = React.useState("");

  const filteredCourses = mockEnrolledCourses.filter((c) => {
    const matchesFilter = filter === "all" || c.category === filter;
    const matchesSearch =
      c.title.includes(search) || c.subject.includes(search) || c.teacherName.includes(search);
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6 text-right">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-white/10 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0B2D5B] dark:text-white">
            كورساتي الدراسية 📚
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            استعرض مسارات علوم الحاسب والبكالوريا والتعليم العام والأزهري
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="البحث في كورساتي..."
            className="w-full h-11 pr-10 pl-4 rounded-xl text-xs font-semibold bg-white dark:bg-[#0F274D] border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white outline-none focus:border-[#F58220]"
          />
          <Search className="absolute right-3 top-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* Filter Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {[
          { id: "all", label: "جميع الكورسات" },
          { id: "cs", label: "💻 علوم الحاسب والتكنولوجيا" },
          { id: "general", label: "🏫 التعليم العام" },
          { id: "azhari", label: "🕌 الأزهر الشريف" },
          { id: "baccalaureate", label: "📜 البكالوريا الجديدة" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setFilter(tab.id as any)}
            className={`px-4 py-2 rounded-full text-xs font-extrabold whitespace-nowrap transition-all ${
              filter === tab.id
                ? "bg-[#0B2D5B] dark:bg-[#1E73D8] text-white shadow-md"
                : "bg-white dark:bg-[#0F274D] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:bg-slate-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-16 bg-white dark:bg-[#0F274D] rounded-3xl border border-slate-200 dark:border-white/10 p-8 space-y-3">
          <BookOpen className="h-12 w-12 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-700 dark:text-slate-200">لا توجد كورسات مطابقة للبحث</h3>
          <p className="text-xs text-slate-500">جرب تعديل كلمة البحث أو تصفح جميع الكورسات</p>
        </div>
      )}
    </div>
  );
}

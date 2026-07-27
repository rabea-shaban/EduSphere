"use client";

import * as React from "react";
import Link from "next/link";
import { BookOpen, Search } from "lucide-react";
import { CourseCard } from "@/features/dashboard";
import { useStudent } from "@/hooks/useStudent";
import { adaptEnrollmentToUI } from "@/features/dashboard/utils/adapters";

export default function MyCoursesPage() {
  const [filter, setFilter] = React.useState<"all" | "cs" | "general" | "azhari" | "baccalaureate">("all");
  const [search, setSearch] = React.useState("");

  const { useMyCourses } = useStudent();
  const { data: coursesData, isLoading } = useMyCourses();

  const enrolledCourses = React.useMemo(() => {
    if (!coursesData?.enrollments) return [];
    return coursesData.enrollments.map(adaptEnrollmentToUI);
  }, [coursesData]);

  const filteredCourses = enrolledCourses.filter((c) => {
    const matchesFilter = filter === "all" || c.category === filter;
    const matchesSearch =
      c.title.includes(search) || c.subject.includes(search) || c.teacherName.includes(search);
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6 text-right dir-rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-white/10 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0B2D5B] dark:text-white">
            كورساتي والمسارات المسجلة
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            استعرض الكورسات التي تم الاشتراك بها ومتابعة تقدمك التعليمي
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Search */}
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="البحث في كورساتي..."
              className="w-full h-11 pr-10 pl-4 rounded-xl text-xs font-semibold bg-white dark:bg-[#0F274D] border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white outline-none focus:border-[#F58220]"
            />
            <Search className="absolute right-3 top-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
          </div>

          <Link
            href="/courses"
            className="px-4 h-11 rounded-xl bg-gradient-to-r from-[#F58220] to-[#FF9A2A] text-white text-xs font-black flex items-center justify-center gap-2 shadow-md hover:opacity-95 transition-opacity whitespace-nowrap"
          >
            <span>استكشاف كورس جديد</span>
          </Link>
        </div>
      </div>

      {/* Filter Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {[
          { id: "all", label: "جميع الكورسات" },
          { id: "cs", label: "علوم الحاسب والتكنولوجيا" },
          { id: "general", label: "التعليم العام" },
          { id: "azhari", label: "الأزهر الشريف" },
          { id: "baccalaureate", label: "البكالوريا الجديدة" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setFilter(tab.id as any)}
            className={`px-4 py-2 rounded-full text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
              filter === tab.id
                ? "bg-[#0B2D5B] dark:bg-[#1E73D8] text-white shadow-md"
                : "bg-white dark:bg-[#0F274D] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:bg-slate-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Loading Skeleton */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-64 rounded-3xl bg-slate-200 dark:bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : (
        /* Course Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}

      {!isLoading && filteredCourses.length === 0 && (
        <div className="text-center py-16 bg-white dark:bg-[#0F274D] rounded-3xl border border-slate-200 dark:border-white/10 p-8 space-y-3">
          <BookOpen className="h-12 w-12 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-700 dark:text-slate-200">لا توجد كورسات مشتركة حتى الآن</h3>
          <p className="text-xs text-slate-500">اشترك في الكورسات المتاحة لبدء عملية التعلم والتقدم</p>
          <Link
            href="/courses"
            className="inline-block mt-2 px-5 py-2.5 rounded-xl bg-[#0B2D5B] text-white text-xs font-black"
          >
            تصفح الكورسات المتاحة الآن
          </Link>
        </div>
      )}
    </div>
  );
}

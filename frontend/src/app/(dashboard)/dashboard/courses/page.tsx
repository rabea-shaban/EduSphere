"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, Search, Code2, GraduationCap, LayoutGrid, Award, Sparkles } from "lucide-react";
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
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.subject.toLowerCase().includes(search.toLowerCase()) ||
      c.teacherName.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const filterTabs = [
    { id: "all", label: "جميع الكورسات", icon: LayoutGrid },
    { id: "cs", label: "علوم الحاسب والتكنولوجيا", icon: Code2 },
    { id: "general", label: "التعليم العام", icon: BookOpen },
    { id: "azhari", label: "الأزهر الشريف", icon: Award },
    { id: "baccalaureate", label: "البكالوريا الجديدة", icon: GraduationCap },
  ];

  return (
    <div className="space-y-8 text-right dir-rtl">
      {/* Header Banner */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#0B2D5B] via-[#071C3B] to-[#1E73D8] text-white shadow-xl overflow-hidden">
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-[#F58220]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 bg-[#F58220]/20 border border-[#F58220]/40 text-[#F58220] px-3.5 py-1 rounded-full text-xs font-black">
              <Sparkles className="h-4 w-4 animate-pulse" />
              <span>المسارات والمناهج المسجلة</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-snug">
              كورساتي والمسارات التعليمية
            </h1>
            <p className="text-xs sm:text-sm text-blue-100/90 font-medium leading-relaxed">
              تصفح الكورسات والدورات المسجل بها لمتابعة الدروس والتقدم الدراسي أولاً بأول.
            </p>
          </div>

          {/* Search & Explore CTA */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="البحث في كورساتي..."
                className="w-full h-11 pr-10 pl-4 rounded-xl text-xs font-semibold bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-blue-200/70 outline-none focus:border-[#F58220]"
              />
              <Search className="absolute right-3 top-3.5 h-4 w-4 text-blue-200 pointer-events-none" />
            </div>

            <Link
              href="/courses"
              className="w-full sm:w-auto px-5 h-11 rounded-xl bg-gradient-to-r from-[#F58220] to-[#FF9A2A] text-white text-xs font-black flex items-center justify-center gap-2 shadow-lg shadow-[#F58220]/30 hover:opacity-95 transition-opacity whitespace-nowrap cursor-pointer"
            >
              <span>استكشاف كورس جديد</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Filter Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {filterTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = filter === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id as any)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                isActive
                  ? "bg-[#0B2D5B] dark:bg-[#1E73D8] text-white shadow-md shadow-[#0B2D5B]/20"
                  : "bg-white dark:bg-[#0F274D] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5"
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? "text-[#F58220]" : "text-slate-400"}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Loading Skeletons */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-72 rounded-3xl bg-slate-200 dark:bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : filteredCourses.length > 0 ? (
        /* Course Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16 bg-white dark:bg-[#0F274D] rounded-3xl border border-slate-200/90 dark:border-white/10 p-8 space-y-4 shadow-sm"
        >
          <div className="h-16 w-16 rounded-3xl bg-[#0B2D5B]/10 dark:bg-white/5 flex items-center justify-center mx-auto text-[#F58220]">
            <BookOpen className="h-8 w-8" />
          </div>
          <div className="space-y-1 max-w-sm mx-auto">
            <h3 className="text-base font-black text-[#0B2D5B] dark:text-white">
              لا توجد كورسات مطابقة في هذا التصنيف
            </h3>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              تصفح الكورسات المتاحة على المنصة واشترك في المسارات التعليمية المناسبة لك.
            </p>
          </div>
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#0B2D5B] to-[#1E73D8] text-white text-xs font-black shadow-md hover:opacity-95 transition-opacity"
          >
            <span>تصفح كل الكورسات الآن</span>
          </Link>
        </motion.div>
      )}
    </div>
  );
}

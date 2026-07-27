"use client";

import * as React from "react";
import Link from "next/link";
import { PlusCircle, Search, BookOpen } from "lucide-react";
import { useAuthContext } from "@/providers/auth-provider";
import api from "@/services/api";
import { ApiCourse } from "@/features/dashboard/types/api";
import { toast } from "react-hot-toast";

export default function InstructorCoursesPage() {
  const { user } = useAuthContext();
  const [courses, setCourses] = React.useState<ApiCourse[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [filter, setFilter] = React.useState<"all" | "published" | "draft">("all");
  const [search, setSearch] = React.useState("");

  const fetchCourses = React.useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/courses", {
        params: { teacherId: user?._id || user?.id, limit: 100 },
      });
      setCourses(res.data?.data?.courses || []);
    } catch {
      toast.error("تعذر جلب قائمة الكورسات");
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  React.useEffect(() => {
    if (user) {
      fetchCourses();
    }
  }, [user, fetchCourses]);

  const filtered = courses.filter((c) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "published" && c.status === "Published") ||
      (filter === "draft" && c.status === "Draft");
    const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-5 sm:space-y-6 text-right">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 border-b border-slate-200/80 dark:border-white/10 pb-5 sm:pb-6">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#0B2D5B] dark:text-white">
            إدارة الكورسات 📚
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            إضافة الكورسات المنشورة والمسودات، وتعديل المناهج المدرسية
          </p>
        </div>

        <Link
          href="/teacher/courses/create"
          className="h-10 sm:h-11 px-4 sm:px-6 rounded-xl bg-gradient-to-r from-[#F58220] to-[#FF9A2A] text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-[#F58220]/20 hover:-translate-y-0.5 transition-all whitespace-nowrap shrink-0 cursor-pointer"
        >
          <PlusCircle className="h-4 w-4 shrink-0" />
          <span>إنشاء كورس جديد</span>
        </Link>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col gap-3">
        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          {[
            { key: "all" as const, label: `جميع الكورسات (${courses.length})` },
            { key: "published" as const, label: "المنشورة" },
            { key: "draft" as const, label: "المسودات" },
          ].map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                filter === key
                  ? key === "all"
                    ? "bg-[#0B2D5B] dark:bg-[#1E73D8] text-white"
                    : key === "published"
                    ? "bg-emerald-600 text-white"
                    : "bg-amber-600 text-white"
                  : "bg-white dark:bg-[#0F274D] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="البحث في كورس..."
            className="w-full h-10 sm:h-11 pr-10 pl-4 rounded-xl text-xs font-semibold bg-white dark:bg-[#0F274D] border border-slate-200 dark:border-white/10 outline-none focus:border-[#F58220] transition-colors"
          />
          <Search className="absolute right-3 top-3 sm:top-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* Courses Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-64 rounded-3xl bg-slate-200 dark:bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filtered.map((course) => (
            <div
              key={course._id}
              className="p-5 rounded-3xl bg-white dark:bg-[#0F274D] border border-slate-200/80 dark:border-white/10 shadow-sm flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#F58220]">
                    {course.price > 0 ? `${course.price} ج.م` : "مجاني 🎁"}
                  </span>
                  <span
                    className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${
                      course.status === "Published"
                        ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30"
                        : "bg-amber-500/10 text-amber-600 border-amber-500/30"
                    }`}
                  >
                    {course.status === "Published" ? "منشور 🟢" : "مسودة 📝"}
                  </span>
                </div>

                <h3 className="text-base font-black text-[#0B2D5B] dark:text-white leading-snug">
                  {course.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                  {course.description || "لا يوجد وصف مختصر للكورس حتى الآن."}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-white/10 flex items-center justify-between text-xs text-slate-500 font-semibold">
                <span>المشتركين: {course.enrollmentCount || 0}</span>
                <Link
                  href={`/teacher/courses/${course._id}`}
                  className="text-[#F58220] font-bold hover:underline"
                >
                  إدارة المحتوى ←
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 sm:py-24 text-center gap-4 bg-white dark:bg-[#0F274D] rounded-3xl border border-slate-200 dark:border-white/10">
          <BookOpen className="h-12 w-12 text-slate-300 dark:text-slate-600" />
          <p className="text-sm font-bold text-slate-500 dark:text-slate-400">لا توجد كورسات تطابق هذا الفلتر</p>
          <Link
            href="/teacher/courses/create"
            className="px-4 py-2 rounded-xl bg-[#F58220] text-white text-xs font-bold"
          >
            إضافة كورس جديد
          </Link>
        </div>
      )}
    </div>
  );
}

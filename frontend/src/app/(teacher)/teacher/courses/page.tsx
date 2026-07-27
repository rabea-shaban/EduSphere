"use client";

import * as React from "react";
import Link from "next/link";
import {
  PlusCircle,
  Search,
  BookOpen,
  Copy,
  Trash2,
  Edit,
  Eye,
  Archive,
  CheckCircle2,
  MoreVertical,
} from "lucide-react";
import { useAuthContext } from "@/providers/auth-provider";
import api from "@/services/api";
import { ApiCourse } from "@/features/dashboard/types/api";
import { toast } from "react-hot-toast";

export default function InstructorCoursesPage() {
  const { user } = useAuthContext();
  const [courses, setCourses] = React.useState<ApiCourse[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [filter, setFilter] = React.useState<"all" | "published" | "draft" | "archived">("all");
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

  const handleDuplicate = async (courseId: string) => {
    try {
      toast.loading("جاري نسخ الكورس...", { id: "dup" });
      await api.post(`/courses/${courseId}/duplicate`);
      toast.success("تم تكرار الكورس بنجاح 🎉", { id: "dup" });
      fetchCourses();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "تعذر تكرار الكورس", { id: "dup" });
    }
  };

  const handlePublishToggle = async (courseId: string, currentStatus: string) => {
    try {
      const isPublished = currentStatus === "Published";
      const endpoint = isPublished ? `/courses/${courseId}` : `/courses/${courseId}/publish`;
      const payload = isPublished ? { status: "Draft" } : {};
      
      if (isPublished) {
        await api.patch(endpoint, payload);
      } else {
        await api.patch(endpoint);
      }

      toast.success(isPublished ? "تم إرجاع الكورس لمسودة 📝" : "تم نشر الكورس للطلاب بنجاح 🟢");
      fetchCourses();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "تعذر تغيير حالة الكورس");
    }
  };

  const handleDelete = async (courseId: string) => {
    if (!confirm("هل أنت تأكد من رغبتك في حذف هذا الكورس نهائياً؟")) return;
    try {
      await api.delete(`/courses/${courseId}`);
      toast.success("تم حذف الكورس بنجاح 🗑️");
      setCourses((prev) => prev.filter((c) => c._id !== courseId));
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "تعذر حذف الكورس");
    }
  };

  const handleArchive = async (courseId: string) => {
    try {
      await api.patch(`/courses/${courseId}/archive`);
      toast.success("تم أرشفة الكورس بنجاح 📦");
      fetchCourses();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "تعذر أرشفة الكورس");
    }
  };

  const handleRestore = async (courseId: string) => {
    try {
      await api.patch(`/courses/${courseId}/restore`);
      toast.success("تم استعادة الكورس من الأرشيف لمسودة بنجاح 🔄");
      fetchCourses();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "تعذر استعادة الكورس");
    }
  };

  const filtered = courses.filter((c) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "published" && c.status === "Published") ||
      (filter === "draft" && c.status === "Draft") ||
      (filter === "archived" && c.status === "Archived");
    const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-5 sm:space-y-6 text-right dir-rtl">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 border-b border-slate-200/80 dark:border-white/10 pb-5 sm:pb-6">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#0B2D5B] dark:text-white">
            إدارة الكورسات ومحتوى المناهج 📚
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            إنشاء، نشر، تعديل، وتكرار الكورسات والمناهج المدرسية بالكامل
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          {[
            { key: "all" as const, label: `جميع الكورسات (${courses.length})` },
            { key: "published" as const, label: "المنشورة" },
            { key: "draft" as const, label: "المسودات" },
            { key: "archived" as const, label: "الأرشيف" },
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
                    : key === "draft"
                    ? "bg-amber-600 text-white"
                    : "bg-slate-700 text-white"
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
            placeholder="البحث باسم الكورس..."
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
              className="p-5 rounded-3xl bg-white dark:bg-[#0F274D] border border-slate-200/80 dark:border-white/10 shadow-sm flex flex-col justify-between space-y-4 hover:border-[#F58220]/50 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-[#F58220]">
                    {course.price > 0 ? `${course.price} ج.م` : "مجاني 🎁"}
                  </span>
                  <span
                    className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${
                      course.status === "Published"
                        ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30"
                        : course.status === "Draft"
                        ? "bg-amber-500/10 text-amber-600 border-amber-500/30"
                        : "bg-slate-500/10 text-slate-400 border-slate-500/30"
                    }`}
                  >
                    {course.status === "Published" ? "منشور 🟢" : course.status === "Draft" ? "مسودة 📝" : "مؤرشف 📦"}
                  </span>
                </div>

                <h3 className="text-base font-black text-[#0B2D5B] dark:text-white leading-snug line-clamp-2">
                  {course.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                  {course.description || "لا يوجد وصف مختصر للكورس حتى الآن."}
                </p>
              </div>

              {/* Course Action Buttons (Full CRUD Toolbar) */}
              <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-white/10">
                <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                  <span>المشتركين: {course.enrollmentCount || 0}</span>
                  <Link
                    href={`/teacher/courses/${course._id}`}
                    className="text-[#F58220] font-bold hover:underline flex items-center gap-1"
                  >
                    <Edit className="h-3.5 w-3.5" />
                    <span>تعديل المحتوى</span>
                  </Link>
                </div>

                <div className="flex items-center gap-1.5 pt-1 border-t border-slate-100 dark:border-white/5">
                  <button
                    type="button"
                    onClick={() => handlePublishToggle(course._id, course.status)}
                    className="flex-1 py-1.5 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-700 dark:text-slate-200 hover:text-emerald-600 text-[11px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                    title={course.status === "Published" ? "تحويل لمسودة" : "نشر الكورس للطلاب"}
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>{course.status === "Published" ? "مسودة" : "نشر"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDuplicate(course._id)}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-slate-600 dark:text-slate-300 hover:text-blue-600 transition-colors cursor-pointer"
                    title="تكرار الكورس"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </button>

                  {course.status === "Archived" ? (
                    <button
                      type="button"
                      onClick={() => handleRestore(course._id)}
                      className="p-2 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-600 dark:text-slate-300 hover:text-emerald-600 transition-colors cursor-pointer"
                      title="استعادة الكورس من الأرشيف"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleArchive(course._id)}
                      className="p-2 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-amber-50 dark:hover:bg-amber-950/40 text-slate-600 dark:text-slate-300 hover:text-amber-600 transition-colors cursor-pointer"
                      title="أرشفة الكورس"
                    >
                      <Archive className="h-3.5 w-3.5" />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => handleDelete(course._id)}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-600 dark:text-slate-300 hover:text-rose-600 transition-colors cursor-pointer"
                    title="حذف الكورس"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
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

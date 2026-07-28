"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Search,
  BookOpen,
  Filter,
  User,
  Star,
  Users,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
  GraduationCap,
} from "lucide-react";
import { toast } from "react-hot-toast";
import api from "@/services/api";
import { useAuthContext } from "@/providers/auth-provider";

export default function PublicCoursesPage() {
  const router = useRouter();
  const { user } = useAuthContext();
  const [courses, setCourses] = React.useState<any[]>([]);
  const [enrolledCourseIds, setEnrolledCourseIds] = React.useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("all");
  const [selectedLevel, setSelectedLevel] = React.useState("all");
  const [enrollingId, setEnrollingId] = React.useState<string | null>(null);

  const fetchCourses = React.useCallback(async () => {
    try {
      setIsLoading(true);
      const [coursesRes, myCoursesRes] = await Promise.all([
        api.get("/courses", { params: { status: "Published", limit: 100 } }),
        user
          ? api.get("/enrollments/my-courses").catch(() => ({ data: { data: { enrollments: [] } } }))
          : Promise.resolve({ data: { data: { enrollments: [] } } }),
      ]);

      const fetchedCourses = coursesRes.data?.data?.courses || coursesRes.data?.data || [];
      setCourses(fetchedCourses);

      const enrollments = myCoursesRes.data?.data?.enrollments || [];
      const enrolledIds = new Set<string>(
        enrollments.map((e: any) => e.courseId?._id || e.courseId?.id || e.courseId)
      );
      setEnrolledCourseIds(enrolledIds);
    } catch {
      toast.error("تعذر جلب قائمة الكورسات المتاحة");
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  React.useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const handleEnroll = async (courseId: string, isFree: boolean) => {
    if (!user) {
      toast.error("يرجى تسجيل الدخول أولاً للااشتراك في الكورس");
      router.push(`/login?redirect=/courses/${courseId}`);
      return;
    }

    try {
      setEnrollingId(courseId);
      toast.loading("جاري إتمام تسجيل الاشتراك...", { id: "enroll" });

      await api.post("/enrollments/enroll", {
        courseId,
        paymentStatus: isFree ? "Free" : "Paid",
      });

      toast.success("تم الاشتراك في الكورس بنجاح 🎉", { id: "enroll" });
      setEnrolledCourseIds((prev) => new Set(prev).add(courseId));
      router.push(`/dashboard/courses/${courseId}`);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "حدث خطأ أثناء تسجيل الاشتراك", { id: "enroll" });
    } finally {
      setEnrollingId(null);
    }
  };

  const filteredCourses = courses.filter((c) => {
    const matchesSearch =
      c.title?.toLowerCase().includes(search.toLowerCase()) ||
      c.description?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" ||
      (selectedCategory === "free" && c.isFree) ||
      (selectedCategory === "paid" && !c.isFree);
    const matchesLevel = selectedLevel === "all" || c.level === selectedLevel;

    return matchesSearch && matchesCategory && matchesLevel;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#07132b] text-right dir-rtl pb-20 pt-8 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Hero Section */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#0B2D5B] via-[#1E73D8] to-[#0B2D5B] text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 z-10 max-w-2xl">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-xs font-black">
              <GraduationCap className="h-4 w-4" />
              <span>مكتبة البرامج والمسارات التعليمية المعتمدة</span>
            </span>
            <h1 className="text-2xl sm:text-4xl font-black leading-tight tracking-tight">
              استكشف أحدث الكورسات والمناهج التفاعلية
            </h1>
            <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed">
              انضم إلى آلاف الطلاب في منصة EduSphere واشترك في أفضل البرامج والمناهج التعليمية في علوم الحاسب، الثانوية العامة، والأزهر الشريف.
            </p>
          </div>

          {/* Quick Search in Hero */}
          <div className="w-full md:w-80 z-10 space-y-2">
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ابحث باسم الكورس أو المادة..."
                className="w-full h-12 pr-11 pl-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-slate-300 text-xs font-semibold outline-none focus:bg-white focus:text-slate-900 focus:placeholder-slate-400 transition-all"
              />
              <Search className="absolute right-4 top-4 h-4 w-4 text-slate-300 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-[#0F274D] border border-slate-200/80 dark:border-white/10 shadow-sm">
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto scrollbar-none pb-1 sm:pb-0">
            {[
              { id: "all", label: "جميع الكورسات" },
              { id: "free", label: "الكورسات المجانية" },
              { id: "paid", label: "الكورسات المدفوعة" },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? "bg-[#0B2D5B] dark:bg-[#1E73D8] text-white shadow-md"
                    : "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="h-10 px-3 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-slate-200 outline-none cursor-pointer dark:bg-[#0F274D]"
            >
              <option value="all">جميع المراحل</option>
              <option value="Beginner">مبتدئ / تأسيسي</option>
              <option value="Intermediate">متوسط</option>
              <option value="Advanced">متقدم</option>
            </select>
          </div>
        </div>

        {/* Courses Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-80 rounded-3xl bg-slate-200 dark:bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => {
              const isEnrolled = enrolledCourseIds.has(course._id);

              return (
                <div
                  key={course._id}
                  className="rounded-3xl bg-white dark:bg-[#0F274D] border border-slate-200/80 dark:border-white/10 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-xl hover:border-[#F58220]/40 transition-all group"
                >
                  {/* Course Cover Image */}
                  <div className="relative h-48 w-full bg-slate-100 dark:bg-white/5 overflow-hidden">
                    <Image
                      src={course.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800"}
                      alt={course.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3">
                      <span className="px-3 py-1 rounded-full text-xs font-black shadow-md bg-white/95 dark:bg-slate-900/95 text-[#0B2D5B] dark:text-white">
                        {course.isFree || course.price === 0 ? "مجاني بالكامل" : `${course.price} ج.م`}
                      </span>
                    </div>
                  </div>

                  {/* Course Body Info */}
                  <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                        <span className="flex items-center gap-1 text-amber-500">
                          <Star className="h-3.5 w-3.5 fill-amber-500" />
                          <span>{course.rating || "5.0"} ({course.reviewCount || 0})</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3.5 w-3.5" />
                          <span>{course.enrollmentCount || 0} طالب</span>
                        </span>
                      </div>

                      <h3 className="text-base font-black text-[#0B2D5B] dark:text-white leading-snug line-clamp-2">
                        {course.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {course.description || "لا يوجد وصف مختصر متوفر حالياً لهذا الكورس."}
                      </p>
                    </div>

                    {/* Teacher & Actions Footer */}
                    <div className="pt-3 border-t border-slate-100 dark:border-white/10 space-y-3">
                      {course.teacher && (
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300">
                          <div className="h-7 w-7 rounded-full bg-[#0B2D5B]/10 dark:bg-white/10 text-[#0B2D5B] dark:text-white flex items-center justify-center font-black">
                            {course.teacher.firstName?.[0] || "م"}
                          </div>
                          <span>أ/ {course.teacher.firstName} {course.teacher.lastName}</span>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Link
                          href={`/courses/${course._id}`}
                          className="flex-1 h-10 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-200 text-xs font-extrabold flex items-center justify-center hover:bg-slate-200 transition-colors"
                        >
                          تفاصيل المنهج
                        </Link>

                        {isEnrolled ? (
                          <Link
                            href={`/dashboard/courses/${course._id}`}
                            className="flex-1 h-10 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center justify-center gap-1 transition-colors"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                            <span>دخول قاعة التعلم</span>
                          </Link>
                        ) : (
                          <button
                            type="button"
                            disabled={enrollingId === course._id}
                            onClick={() => handleEnroll(course._id, course.isFree)}
                            className="flex-1 h-10 rounded-xl bg-[#0B2D5B] dark:bg-[#1E73D8] hover:bg-[#F58220] text-white text-xs font-black flex items-center justify-center gap-1 transition-colors cursor-pointer disabled:opacity-50"
                          >
                            <span>{enrollingId === course._id ? "جاري الاشتراك..." : "الاشتراك الآن"}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-[#0F274D] rounded-3xl border border-slate-200 dark:border-white/10 p-8 space-y-3">
            <BookOpen className="h-12 w-12 text-slate-400 mx-auto" />
            <h3 className="text-base font-bold text-slate-700 dark:text-slate-200">لا توجد كورسات متاحة حالياً</h3>
            <p className="text-xs text-slate-500">جرب تغيير كلمات البحث أو الفلاتر لعرض نتائج أخرى</p>
          </div>
        )}

      </div>
    </div>
  );
}

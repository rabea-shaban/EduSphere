"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  BookOpen,
  CheckCircle2,
  Clock,
  DollarSign,
  FileText,
  GraduationCap,
  Layers,
  Lock,
  PlayCircle,
  Star,
  Users,
  Video,
  ArrowRight,
  Sparkles,
  Eye,
} from "lucide-react";
import { toast } from "react-hot-toast";
import api from "@/services/api";
import { useAuthContext } from "@/providers/auth-provider";

export default function PublicCourseDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuthContext();
  const courseId = params?.id as string;

  const isPreviewParam = searchParams.get("preview") === "true";
  const isTeacherOrAdmin = user?.role === "TEACHER" || user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";
  const isPreviewMode = isPreviewParam || isTeacherOrAdmin;

  const [course, setCourse] = React.useState<any>(null);
  const [units, setUnits] = React.useState<any[]>([]);
  const [isEnrolled, setIsEnrolled] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isEnrolling, setIsEnrolling] = React.useState(false);

  React.useEffect(() => {
    if (!courseId) return;

    const fetchDetails = async () => {
      try {
        setIsLoading(true);
        const [courseRes, unitsRes, myCoursesRes] = await Promise.all([
          api.get(`/courses/${courseId}`),
          api.get(`/units?courseId=${courseId}&limit=100`),
          user && user.role === "STUDENT"
            ? api.get("/enrollments/my-courses").catch(() => ({ data: { data: { enrollments: [] } } }))
            : Promise.resolve({ data: { data: { enrollments: [] } } }),
        ]);

        setCourse(courseRes.data?.data || courseRes.data);
        setUnits(unitsRes.data?.data?.units || unitsRes.data?.data || []);

        const enrollments = myCoursesRes.data?.data?.enrollments || [];
        const found = enrollments.some(
          (e: any) => (e.courseId?._id || e.courseId?.id || e.courseId) === courseId
        );
        setIsEnrolled(found);
      } catch {
        toast.error("تعذر جلب تفاصيل البرنامج التعليمي");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetails();
  }, [courseId, user]);

  const handleEnroll = async () => {
    if (isTeacherOrAdmin || isPreviewMode) {
      toast.error("أنت في وضع المعاينة بصفة معلم/مدير — تم تعطيل عمليات الشراء والاشتراك الفعلي.");
      return;
    }

    if (!user) {
      toast.error("يرجى تسجيل الدخول أولاً للاشتراك في هذا الكورس");
      router.push(`/login?redirect=/courses/${courseId}`);
      return;
    }

    try {
      setIsEnrolling(true);
      toast.loading("جاري معالجة الاشتراك وتسجيل الكورس...", { id: "enroll-detail" });

      await api.post("/enrollments/enroll", {
        courseId,
        paymentStatus: course?.isFree ? "Free" : "Paid",
      });

      toast.success("تم الاشتراك في الكورس بنجاح! 🎉", { id: "enroll-detail" });
      router.push(`/dashboard/courses/${courseId}`);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "حدث خطأ أثناء الاشتراك بالكورس", { id: "enroll-detail" });
    } finally {
      setIsEnrolling(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#07132b] flex items-center justify-center p-8">
        <div className="h-12 w-12 border-4 border-[#0B2D5B] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#07132b] flex flex-col items-center justify-center p-8 space-y-4 text-right dir-rtl">
        <BookOpen className="h-16 w-16 text-slate-400" />
        <h2 className="text-xl font-bold text-slate-700 dark:text-slate-200">لم يتم العثور على الكورس المطلوب</h2>
        <Link href="/courses" className="px-6 py-2 rounded-xl bg-[#0B2D5B] text-white text-xs font-bold">
          العودة لكافة الكورسات
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#07132b] text-right dir-rtl pb-20 pt-8 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Preview Mode Banner */}
        {isPreviewMode && (
          <div className="bg-amber-500/10 border-2 border-amber-500/40 text-amber-900 dark:text-amber-200 p-4 rounded-2xl flex items-center justify-between gap-3 text-xs font-extrabold shadow-sm">
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>وضع المعاينة المؤقت: أنت تعرض هذا الكورس حالياً بصفة زائر / طالب للمعاينة فقط. تم تعطيل التنفيذ المالي والاشتراكات للمعلمين والإدارة.</span>
            </div>
            <span className="px-3 py-1 bg-amber-500 text-white rounded-xl text-[10px] font-black shrink-0">معاينة فقط</span>
          </div>
        )}

        {/* Back Link */}
        <Link href="/courses" className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-[#0B2D5B] transition-colors">
          <ArrowRight className="h-4 w-4" />
          <span>العودة لكافة البرامج والكورسات</span>
        </Link>

        {/* Hero Card */}
        <div className="p-6 sm:p-10 rounded-3xl bg-white dark:bg-[#0F274D] border border-slate-200/80 dark:border-white/10 shadow-lg grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-[#0B2D5B]/10 text-[#0B2D5B] dark:text-[#1E73D8] text-xs font-black">
                {course.level || "جميع المراحل"}
              </span>
              {course.subject?.name && (
                <span className="px-3 py-1 rounded-full bg-[#F58220]/15 text-[#F58220] text-xs font-black">
                  {course.subject.name}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-[#0B2D5B] dark:text-white leading-tight">
              {course.title}
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              {course.description || "هذا البرنامج التعليمي مصمم لإكساب الطلاب المهارات والمفاهيم المنهجية التطبيقية المعتمدة."}
            </p>

            <div className="flex items-center gap-6 pt-2 text-xs font-bold text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1.5 text-amber-500">
                <Star className="h-4 w-4 fill-amber-500" />
                <span>{course.rating || "5.0"} ({course.reviewCount || 0} تقييم)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="h-4 w-4" />
                <span>{course.enrollmentCount || 0} طالب مشترك</span>
              </div>
            </div>

            {course.teacher && (
              <div className="pt-4 border-t border-slate-100 dark:border-white/10 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-[#0B2D5B] text-white flex items-center justify-center font-black">
                  {course.teacher.firstName?.[0] || "م"}
                </div>
                <div>
                  <div className="text-xs font-black text-[#0B2D5B] dark:text-white">
                    أ/ {course.teacher.firstName} {course.teacher.lastName}
                  </div>
                  <div className="text-[11px] text-slate-400 font-semibold">محاضر ومدرس معتمد بمنصة EduSphere</div>
                </div>
              </div>
            )}
          </div>

          {/* Action Box */}
          <div className="p-6 rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="relative h-44 w-full rounded-2xl overflow-hidden bg-slate-200">
                <Image
                  src={course.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800"}
                  alt={course.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">رسوم الاشتراك:</span>
                <span className="text-2xl font-black text-emerald-600">
                  {course.isFree || course.price === 0 ? "مجاني بالكامل" : `${course.price} ج.م`}
                </span>
              </div>
            </div>

            {isTeacherOrAdmin ? (
              <button
                type="button"
                onClick={() => toast.error("أنت في وضع المعاينة المؤقت كمعلم/مدير — لا يمكن تنفيذ عمليات الشراء والاشتراك الفعلي كطالب.")}
                className="w-full h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs font-black flex items-center justify-center gap-2 cursor-pointer hover:bg-amber-500/20 transition-all"
              >
                <Eye className="h-4 w-4 text-amber-600" />
                <span>زر الاشتراك (معطل في وضع المعاينة)</span>
              </button>
            ) : isEnrolled ? (
              <Link
                href={`/dashboard/courses/${courseId}`}
                className="w-full h-12 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center justify-center gap-2 shadow-lg transition-colors"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>مُشترك بالفعل — دخول قاعة التعلم</span>
              </Link>
            ) : (
              <button
                type="button"
                disabled={isEnrolling}
                onClick={handleEnroll}
                className="w-full h-12 rounded-2xl bg-gradient-to-r from-[#F58220] to-[#FF9A2A] text-white text-xs font-black flex items-center justify-center gap-2 shadow-lg cursor-pointer hover:opacity-95 transition-opacity disabled:opacity-50"
              >
                <Sparkles className="h-4 w-4" />
                <span>{isEnrolling ? "جاري الاشتراك..." : "تأكيد الاشتراك والانضمام الآن"}</span>
              </button>
            )}
          </div>
        </div>

        {/* Curriculum Units Breakdown */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0F274D] border border-slate-200/80 dark:border-white/10 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-4">
            <h2 className="text-lg font-black text-[#0B2D5B] dark:text-white flex items-center gap-2">
              <Layers className="h-5 w-5 text-[#F58220]" />
              <span>المنهج الدراسي والوحدات المتاحة ({units.length} وحدات)</span>
            </h2>
          </div>

          {units.length > 0 ? (
            <div className="space-y-4">
              {units.map((unit, uIdx) => (
                <div key={unit._id || uIdx} className="p-5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 space-y-2">
                  <h4 className="text-sm font-black text-[#0B2D5B] dark:text-white flex items-center gap-2">
                    <span className="h-6 w-6 rounded-lg bg-[#0B2D5B] text-white flex items-center justify-center text-[10px] font-black">
                      {uIdx + 1}
                    </span>
                    <span>{unit.title}</span>
                  </h4>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-xs font-bold text-slate-400">
              الوحدات والدروس قيد التجهيز والنشر من المحاضر
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

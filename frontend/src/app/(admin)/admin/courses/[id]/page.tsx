"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowRight,
  BookOpen,
  Users,
  CheckCircle2,
  XCircle,
  Star,
  Sparkles,
  Layers,
  Video,
  FileText,
  DollarSign,
  Briefcase,
  GraduationCap,
  Trash2,
  PlayCircle,
  Clock,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  Award,
} from "lucide-react";
import { toast } from "react-hot-toast";
import adminCourseService, { AdminCourseDetails } from "@/services/adminCourse.service";
import { Button } from "@/components/ui/button";

export default function AdminCourseDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const courseId = params?.id as string;

  const [rejectModalOpen, setRejectModalOpen] = React.useState(false);
  const [rejectionReason, setRejectionReason] = React.useState("");
  const [activeTab, setActiveTab] = React.useState<"curriculum" | "enrollments">("curriculum");

  // Fetch Course Details
  const { data: course, isLoading, isError, error, refetch } = useQuery<AdminCourseDetails>({
    queryKey: ["admin", "course-profile", courseId],
    queryFn: () => adminCourseService.getCourseById(courseId),
    enabled: Boolean(courseId),
  });

  // Fetch Enrollments
  const { data: enrollments = [] } = useQuery({
    queryKey: ["admin", "course-enrollments", courseId],
    queryFn: () => adminCourseService.getCourseEnrollments(courseId),
    enabled: Boolean(courseId) && activeTab === "enrollments",
  });

  // Approve Mutation
  const approveMutation = useMutation({
    mutationFn: () => adminCourseService.approveCourse(courseId),
    onSuccess: () => {
      toast.success("تمت الموافقة ونشر الكورس بنجاح.");
      queryClient.invalidateQueries({ queryKey: ["admin", "course-profile", courseId] });
      queryClient.invalidateQueries({ queryKey: ["admin", "courses-list"] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "حدث خطأ أثناء الاعتماد.");
    },
  });

  // Reject Mutation
  const rejectMutation = useMutation({
    mutationFn: (reason: string) => adminCourseService.rejectCourse(courseId, reason),
    onSuccess: () => {
      toast.success("تم تسجيل رفض الكورس وإرجاعه لمسودة.");
      setRejectModalOpen(false);
      setRejectionReason("");
      queryClient.invalidateQueries({ queryKey: ["admin", "course-profile", courseId] });
      queryClient.invalidateQueries({ queryKey: ["admin", "courses-list"] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "حدث خطأ أثناء الرفض.");
    },
  });

  // Feature Toggle Mutation
  const featureMutation = useMutation({
    mutationFn: () => adminCourseService.toggleFeature(courseId),
    onSuccess: () => {
      toast.success("تم تحديث حالة تمييز الكورس بنجاح.");
      queryClient.invalidateQueries({ queryKey: ["admin", "course-profile", courseId] });
      queryClient.invalidateQueries({ queryKey: ["admin", "courses-list"] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "حدث خطأ أثناء التمييز.");
    },
  });

  // Soft Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: () => adminCourseService.deleteCourse(courseId),
    onSuccess: () => {
      toast.success("تم نقل الكورس لأرشيف المحذوفات بنجاح");
      router.push("/admin/courses");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "حدث خطأ أثناء المسح.");
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6 text-right" dir="rtl">
        <div className="h-20 w-full bg-slate-200 dark:bg-white/10 rounded-3xl animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-96 bg-slate-200 dark:bg-white/10 rounded-3xl animate-pulse" />
          <div className="h-96 bg-slate-200 dark:bg-white/10 rounded-3xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (isError || !course) {
    return (
      <div className="p-12 text-center bg-white dark:bg-[#0F274D] rounded-3xl border border-rose-200 dark:border-rose-900/40 shadow-xl space-y-4" dir="rtl">
        <AlertCircle className="h-10 w-10 text-rose-500 mx-auto" />
        <h3 className="text-lg font-black text-[#0B2D5B] dark:text-white">لم يتم العثور على الكورس</h3>
        <p className="text-xs text-slate-500">قد يكون المنهج تم حذفه أو أن الرابط غير صحيح.</p>
        <Link href="/admin/courses">
          <Button className="bg-[#0B2D5B] text-white rounded-xl text-xs font-bold gap-2">
            <ArrowRight className="h-4 w-4" />
            <span>العودة لقائمة الكورسات</span>
          </Button>
        </Link>
      </div>
    );
  }

  const { statistics, curriculum = [] } = course;

  return (
    <div className="space-y-6 text-right transition-colors" dir="rtl">
      
      {/* Top Header & Sticky Control Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-[#0F274D] p-6 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/courses"
            className="h-10 w-10 rounded-2xl bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-200 flex items-center justify-center hover:bg-slate-200 transition-colors"
            title="العودة"
          >
            <ArrowRight className="h-5 w-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-[#0B2D5B] dark:text-white">
                {course.title}
              </h1>
              <span
                className={`px-3 py-0.5 rounded-full text-xs font-black ${
                  course.status === "Published"
                    ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                    : "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                }`}
              >
                {course.status === "Published" ? "منشور" : "مسودة / قيد المراجعة"}
              </span>

              {course.isFeatured && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-500/10 text-amber-600 border border-amber-500/20">
                  متميز
                </span>
              )}
            </div>

            <p className="text-xs text-slate-500 flex flex-wrap items-center gap-3">
              <span>المحاضر: <strong className="text-[#0B2D5B] dark:text-white font-bold">{course.teacher.fullName}</strong></span>
              <span>السعر: <strong className="text-emerald-600 font-bold">{course.isFree ? "مجاني" : `${course.price} ج.م`}</strong></span>
              <span>تاريخ الإنشاء: {new Date(course.createdAt).toLocaleDateString("ar-EG")}</span>
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {course.status !== "Published" ? (
            <Button
              onClick={() => approveMutation.mutate()}
              disabled={approveMutation.isPending}
              className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold gap-1.5"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>اعتماد ونشر الكورس</span>
            </Button>
          ) : (
            <Button
              onClick={() => setRejectModalOpen(true)}
              className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold gap-1.5"
            >
              <XCircle className="h-4 w-4" />
              <span>رفض وإرجاع لمسودة</span>
            </Button>
          )}

          <Button
            onClick={() => featureMutation.mutate()}
            disabled={featureMutation.isPending}
            variant="outline"
            className={`rounded-xl text-xs font-bold gap-1.5 ${
              course.isFeatured ? "bg-amber-500 text-white border-amber-500" : "border-slate-200 dark:border-white/10 text-amber-600"
            }`}
          >
            <Sparkles className="h-4 w-4" />
            <span>{course.isFeatured ? "إزالة التمييز" : "تمييز بالرئيسية"}</span>
          </Button>

          <Button
            onClick={() => {
              if (confirm("هل أنت تأكد من نقل الكورس إلى أرشيف المحذوفات؟")) {
                deleteMutation.mutate();
              }
            }}
            variant="ghost"
            size="icon"
            className="text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl"
            title="حذف الكورس"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Real Statistics Grid (4 Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Enrollments */}
        <div className="bg-white dark:bg-[#0F274D] p-5 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>الطلاب المشتركين</span>
            <Users className="h-4 w-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-black text-[#0B2D5B] dark:text-white font-mono">
            {statistics.enrollmentsCount}
          </div>
          <span className="text-[11px] text-indigo-500 font-bold block">مكتملين: {statistics.completedEnrollmentsCount}</span>
        </div>

        {/* Card 2: Revenue */}
        <div className="bg-white dark:bg-[#0F274D] p-5 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>إجمالي الإيرادات</span>
            <DollarSign className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
            {statistics.totalRevenue.toLocaleString()} ج.م
          </div>
          <span className="text-[11px] text-emerald-500 font-bold block">تحصيل مالي مقبول</span>
        </div>

        {/* Card 3: Rating */}
        <div className="bg-white dark:bg-[#0F274D] p-5 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>التقييم العام</span>
            <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400 font-mono">
            {statistics.rating} / 5.0
          </div>
          <span className="text-[11px] text-amber-500 font-bold block">من أصل {statistics.reviewCount} تقييم</span>
        </div>

        {/* Card 4: Quizzes */}
        <div className="bg-white dark:bg-[#0F274D] p-5 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>عدد الاختبارات</span>
            <Award className="h-4 w-4 text-purple-500" />
          </div>
          <div className="text-2xl font-black text-purple-600 dark:text-purple-400 font-mono">
            {statistics.quizzesCount} اختبار
          </div>
          <span className="text-[11px] text-purple-500 font-bold block">تقييمات دورية داخل المنهج</span>
        </div>

      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-200 dark:border-white/10 text-xs font-black gap-6">
        <button
          type="button"
          onClick={() => setActiveTab("curriculum")}
          className={`pb-3 border-b-2 transition-all cursor-pointer ${
            activeTab === "curriculum"
              ? "border-[#F58220] text-[#F58220]"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          المنهج والوحدات والدروس ({curriculum.length} وحدات)
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("enrollments")}
          className={`pb-3 border-b-2 transition-all cursor-pointer ${
            activeTab === "enrollments"
              ? "border-[#F58220] text-[#F58220]"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          الطلاب المشتركين بالدورة ({statistics.enrollmentsCount})
        </button>
      </div>

      {/* Tab Content: Curriculum Tree View */}
      {activeTab === "curriculum" && (
        <div className="bg-white dark:bg-[#0F274D] p-6 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm space-y-4">
          {curriculum.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-slate-200 dark:border-white/10 rounded-2xl">
              <p className="text-xs text-slate-400">لم يقم المحاضر بإضافة وحدات أو دروس داخل المنهج بعد</p>
            </div>
          ) : (
            <div className="space-y-4">
              {curriculum.map((unit: any, idx: number) => (
                <div
                  key={unit._id || idx}
                  className="p-5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-extrabold text-[#0B2D5B] dark:text-white flex items-center gap-2">
                      <Layers className="h-4 w-4 text-[#F58220]" />
                      <span>الوحدة {idx + 1}: {unit.title}</span>
                    </h4>
                    <span className="text-[11px] text-slate-400 font-bold">
                      {unit.lessons?.length || 0} دروس
                    </span>
                  </div>

                  {unit.lessons && unit.lessons.length > 0 && (
                    <div className="space-y-2 pr-4 border-r-2 border-slate-200 dark:border-white/10">
                      {unit.lessons.map((les: any, lIdx: number) => (
                        <div
                          key={les._id || lIdx}
                          className="p-3 rounded-xl bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 flex items-center justify-between text-xs"
                        >
                          <div className="flex items-center gap-2">
                            <PlayCircle className="h-4 w-4 text-indigo-500" />
                            <span className="font-bold text-slate-800 dark:text-slate-200">
                              {lIdx + 1}. {les.title}
                            </span>
                          </div>

                          {les.videoUrl && (
                            <a
                              href={les.videoUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline flex items-center gap-1 text-[11px]"
                            >
                              <Video className="h-3.5 w-3.5" />
                              <span>مشاهدة الدرس</span>
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab Content: Student Enrollments */}
      {activeTab === "enrollments" && (
        <div className="bg-white dark:bg-[#0F274D] p-6 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm space-y-4">
          {enrollments.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-slate-200 dark:border-white/10 rounded-2xl">
              <p className="text-xs text-slate-400">لا يوجد مشتركون حاليون في هذا الكورس</p>
            </div>
          ) : (
            <div className="space-y-3">
              {enrollments.map((e: any) => {
                const student = e.studentId || {};
                return (
                  <div
                    key={e._id}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-[#0B2D5B] text-white font-black flex items-center justify-center text-xs">
                        {(student.firstName || "S").charAt(0)}
                      </div>
                      <div>
                        <span className="font-bold text-[#0B2D5B] dark:text-white block">
                          {`${student.firstName || ""} ${student.lastName || ""}`.trim() || student.email}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          تاريخ الاشتراك: {new Date(e.createdAt || e.enrolledAt).toLocaleDateString("ar-EG")}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                        e.status === "Completed"
                          ? "bg-emerald-500/10 text-emerald-600"
                          : "bg-blue-500/10 text-blue-600"
                      }`}
                    >
                      {e.status === "Completed" ? "مكتمل" : "نشط"}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* REJECT MODAL */}
      <AnimatePresence>
        {rejectModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white dark:bg-[#0F274D] p-6 rounded-3xl max-w-md w-full border border-slate-200 dark:border-white/10 shadow-2xl space-y-4 text-right"
              dir="rtl"
            >
              <div className="flex items-center gap-3 text-rose-600">
                <div className="h-10 w-10 rounded-2xl bg-rose-500/10 flex items-center justify-center">
                  <XCircle className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-base font-black text-[#0B2D5B] dark:text-white">
                    سبب رفض نشر الكورس
                  </h3>
                  <p className="text-xs text-slate-500">{course.title}</p>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  سبب الرفض المباشر *
                </label>
                <textarea
                  rows={3}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="يرجى تحسين جودة التسجيل وتنظيم الدروس..."
                  className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  onClick={() => setRejectModalOpen(false)}
                  variant="outline"
                  className="rounded-xl text-xs font-bold"
                >
                  إلغاء
                </Button>
                <Button
                  onClick={() => {
                    if (!rejectionReason.trim()) {
                      toast.error("يرجى كتابة سبب الرفض");
                      return;
                    }
                    rejectMutation.mutate(rejectionReason.trim());
                  }}
                  disabled={rejectMutation.isPending}
                  className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-extrabold"
                >
                  <span>تأكيد الرفض والإرجاع</span>
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

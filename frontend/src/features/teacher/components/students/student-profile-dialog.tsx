"use client";

import * as React from "react";
import {
  X,
  User,
  BookOpen,
  Award,
  FileCheck2,
  Clock,
  CheckCircle2,
  BarChart3,
  Calendar,
  Loader2,
  Mail,
  Phone,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import { useTeacherStudent } from "@/hooks/useTeacherStudents";
import type { TeacherStudent } from "@/features/teacher/types/student";

interface StudentProfileDialogProps {
  student: TeacherStudent | null;
  isOpen: boolean;
  onClose: () => void;
}

export function StudentProfileDialog({ student, isOpen, onClose }: StudentProfileDialogProps) {
  const studentId = student?._id || "";
  const { data: profile, isLoading } = useTeacherStudent(studentId);

  const [activeTab, setActiveTab] = React.useState<"overview" | "enrollments" | "quizzes" | "assignments" | "activity">("overview");

  if (!isOpen || !student) return null;

  const currentProfile = profile || student;
  const stats = (profile as any)?.statistics || {
    enrolledCoursesCount: student.enrolledCoursesCount,
    completedCoursesCount: student.completedCoursesCount,
    certificatesCount: student.certificatesCount,
    averageProgress: student.averageProgress,
    averageQuizScore: student.averageQuizScore,
    averageAssignmentScore: student.averageAssignmentScore,
    quizzesCount: 0,
    submissionsCount: 0,
    studyHours: 24,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-3xl bg-white dark:bg-[#0B2D5B] rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden flex flex-col max-h-[85vh] text-right dir-rtl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <span className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-[#0B2D5B] to-[#1E73D8] text-white flex items-center justify-center font-black text-lg shadow-md shrink-0">
              {(student.fullName || "S").charAt(0).toUpperCase()}
            </span>
            <div>
              <h2 className="text-base font-black text-[#0B2D5B] dark:text-white">
                {student.fullName}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {student.email} • {student.phone || "بدون رقم هاتف"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 transition-colors cursor-pointer"
            aria-label="إغلاق"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 p-3 bg-slate-50/80 dark:bg-white/5 border-b border-slate-100 dark:border-white/10 overflow-x-auto shrink-0 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 rounded-xl transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === "overview"
                ? "bg-[#0B2D5B] dark:bg-[#1E73D8] text-white"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-200/50"
            }`}
          >
            الملخص والأداء 📊
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("enrollments")}
            className={`px-4 py-2 rounded-xl transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === "enrollments"
                ? "bg-[#0B2D5B] dark:bg-[#1E73D8] text-white"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-200/50"
            }`}
          >
            الكورسات والتقدم 📚
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("quizzes")}
            className={`px-4 py-2 rounded-xl transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === "quizzes"
                ? "bg-[#0B2D5B] dark:bg-[#1E73D8] text-white"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-200/50"
            }`}
          >
            نتائج الاختبارات 🎯
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("assignments")}
            className={`px-4 py-2 rounded-xl transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === "assignments"
                ? "bg-[#0B2D5B] dark:bg-[#1E73D8] text-white"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-200/50"
            }`}
          >
            تسليمات الواجبات 📝
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {isLoading ? (
            <div className="py-12 text-center flex flex-col items-center justify-center gap-2">
              <Loader2 className="h-6 w-6 text-indigo-500 animate-spin" />
              <p className="text-xs font-bold text-slate-500">جاري تحميل بيانات الطالب الأكاديمية...</p>
            </div>
          ) : activeTab === "overview" ? (
            <div className="space-y-6">
              {/* Stat Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-800/30">
                  <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">نسبة الإكمال العامة</span>
                  <p className="text-xl font-black text-[#0B2D5B] dark:text-white mt-1">
                    {stats.averageProgress}%
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-800/30">
                  <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400">متوسط الاختبارات</span>
                  <p className="text-xl font-black text-[#0B2D5B] dark:text-white mt-1">
                    {stats.averageQuizScore}%
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-800/30">
                  <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">ساعات التعلم</span>
                  <p className="text-xl font-black text-[#0B2D5B] dark:text-white mt-1">
                    {stats.studyHours} ساعة
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-violet-50/50 dark:bg-violet-950/20 border border-violet-100 dark:border-violet-800/30">
                  <span className="text-[11px] font-bold text-violet-600 dark:text-violet-400">الشهادات الصادرة</span>
                  <p className="text-xl font-black text-[#0B2D5B] dark:text-white mt-1">
                    {stats.certificatesCount}
                  </p>
                </div>
              </div>

              {/* General info */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-2 text-xs">
                <p className="font-black text-[#0B2D5B] dark:text-white mb-2">معلومات الطالب الدراسية:</p>
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>اسم المستخدم:</span>
                  <span className="font-bold">{currentProfile.username || "غير محدد"}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>المرحلة الدراسية:</span>
                  <span className="font-bold">{currentProfile.grade || "المرحلة الثانوية"}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>تاريخ الانضمام للمنصة:</span>
                  <span className="font-bold">{new Date(currentProfile.createdAt).toLocaleDateString("ar-EG")}</span>
                </div>
              </div>
            </div>
          ) : activeTab === "enrollments" ? (
            <div className="space-y-3">
              {(profile?.enrollments || student.courses || []).length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-6">لا توجد اشتراكات مسجلة.</p>
              ) : (
                (profile?.enrollments || student.courses || []).map((en: any, i: number) => {
                  const courseTitle = en.courseTitle || (en.courseId as any)?.title || "كورس تعليمي";
                  const progressPct = en.progress || 0;
                  return (
                    <div key={i} className="p-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F274D] space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-black text-[#0B2D5B] dark:text-white">{courseTitle}</span>
                        <span className="font-bold text-indigo-600 dark:text-indigo-400">{progressPct}%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-[#F58220] to-[#FF9A2A] transition-all" style={{ width: `${progressPct}%` }} />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          ) : activeTab === "quizzes" ? (
            <div className="space-y-3">
              {(profile?.attempts || []).length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-6">لا توجد محاولات اختبارات سابقة.</p>
              ) : (
                (profile?.attempts || []).map((att: any, i: number) => (
                  <div key={i} className="p-3.5 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F274D] flex items-center justify-between text-xs">
                    <span className="font-bold text-[#0B2D5B] dark:text-white">
                      {(att.quizId as any)?.title || "اختبار تقييمي"}
                    </span>
                    <span className="font-black text-emerald-600 dark:text-emerald-400">
                      {att.percentage}% ({att.passed ? "ناجح" : "لم يجتز"})
                    </span>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {(profile?.submissions || []).length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-6">لا توجد تسليمات واجبات سابقة.</p>
              ) : (
                (profile?.submissions || []).map((sub: any, i: number) => (
                  <div key={i} className="p-3.5 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F274D] flex items-center justify-between text-xs">
                    <span className="font-bold text-[#0B2D5B] dark:text-white">
                      {(sub.assignmentId as any)?.title || "واجب تطبيقي"}
                    </span>
                    <span className="font-black text-indigo-600 dark:text-indigo-400">
                      الدرجة: {sub.grade !== undefined ? sub.grade : "قيد التصحيح"}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-white/10 flex justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 h-10 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-200 transition-colors cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
}

export default StudentProfileDialog;

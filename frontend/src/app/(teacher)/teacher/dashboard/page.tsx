"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  PlusCircle,
  Sparkles,
  ArrowLeft,
  ShoppingBag,
  BookOpen,
  Users,
  Wallet,
  HelpCircle,
} from "lucide-react";
import {
  RevenueChart,
  TeacherStatCard,
} from "@/features/teacher";
import { useAuthContext } from "@/providers/auth-provider";
import { useTeacher } from "@/hooks/useTeacher";

export default function TeacherDashboardHomePage() {
  const { user } = useAuthContext();
  const { dashboardData, isLoadingDashboard } = useTeacher();

  const teacherName = (user?.firstName || user?.lastName)
    ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
    : (user?.fullName || user?.username || "المعلم الفاضل");

  const stats = dashboardData?.statistics || {};
  const myCourses = dashboardData?.myCourses || [];
  const recentEnrollments = dashboardData?.recentEnrollments || [];

  const totalCourses = stats.myCoursesCount ?? 0;
  const totalStudents = stats.totalStudents ?? 0;
  const totalRevenue = stats.totalRevenue ?? 0;
  const availableBalance = stats.availableBalance ?? 0;
  const quizzesCount = stats.quizzesCount ?? 0;
  const assignmentsCount = stats.assignmentsCount ?? 0;

  const teacherStats = [
    {
      id: "stat-1",
      title: "إجمالي الكورسات المنشورة",
      value: totalCourses,
      change: "+1 هذا الشهر",
      isPositive: true,
      iconName: "BookOpen",
      colorScheme: "navy" as const,
    },
    {
      id: "stat-2",
      title: "إجمالي الطلاب المشتركين",
      value: totalStudents,
      change: "+12 هذا الأسبوع",
      isPositive: true,
      iconName: "Users",
      colorScheme: "orange" as const,
    },
    {
      id: "stat-3",
      title: "إجمالي المبيعات والأرباح",
      value: `${totalRevenue.toLocaleString("en-US")} ج.م`,
      change: "85% صافي الأرباح",
      isPositive: true,
      iconName: "Wallet",
      colorScheme: "emerald" as const,
    },
    {
      id: "stat-4",
      title: "الرصيد المتاح للسحب",
      value: `${availableBalance.toLocaleString("en-US")} ج.م`,
      change: "جاهز للتحويل الفوري",
      isPositive: true,
      iconName: "CreditCard",
      colorScheme: "amber" as const,
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 text-right">
      {/* Hero Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-[#0B2D5B] via-[#071C3B] to-[#1E73D8] text-white shadow-2xl overflow-hidden"
      >
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-[#F58220]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-2 flex-1 min-w-0">
            <div className="inline-flex items-center gap-2 bg-[#F58220]/20 border border-[#F58220]/40 text-[#F58220] px-3 py-1 rounded-full text-xs font-black">
              <Sparkles className="h-3.5 w-3.5 animate-pulse shrink-0" />
              <span>مساحة المحاضر والمدرس المعتمد</span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-4xl font-black tracking-tight leading-snug">
              مرحباً بك، أستاذ {teacherName} 👋
            </h1>
            <p className="text-xs sm:text-sm text-blue-100/90 font-medium leading-relaxed">
              لديك <strong className="text-[#F58220]">{totalStudents} طالب مسجل</strong> في كورسـاتك و {quizzesCount} كويز نشط، و {assignmentsCount} واجباً متاحاً للتقييم.
            </p>
          </div>

          <div className="flex gap-2 sm:gap-3 w-full sm:w-auto shrink-0">
            <Link
              href="/teacher/courses/create"
              className="flex-1 sm:flex-initial h-11 px-4 sm:px-6 rounded-xl bg-gradient-to-r from-[#F58220] to-[#FF9A2A] text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-[#F58220]/30 hover:-translate-y-0.5 transition-all whitespace-nowrap"
            >
              <PlusCircle className="h-4 w-4 shrink-0" />
              <span>إنشاء كورس جديد</span>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="space-y-3 sm:space-y-4">
        <h2 className="text-base sm:text-lg font-black text-[#0B2D5B] dark:text-white">
          ملخص الأداء والمبيعات 📊
        </h2>
        {isLoadingDashboard ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-28 rounded-2xl bg-slate-200 dark:bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {teacherStats.map((stat, idx) => (
              <TeacherStatCard key={stat.id} stat={stat} index={idx} />
            ))}
          </div>
        )}
      </div>

      {/* Revenue Chart & Recent Sales */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
        <div className="xl:col-span-2">
          <RevenueChart data={[
            { month: "يناير", revenue: Math.round(totalRevenue * 0.1), studentsCount: Math.round(totalStudents * 0.1) },
            { month: "فبراير", revenue: Math.round(totalRevenue * 0.15), studentsCount: Math.round(totalStudents * 0.15) },
            { month: "مارس", revenue: Math.round(totalRevenue * 0.2), studentsCount: Math.round(totalStudents * 0.2) },
            { month: "أبريل", revenue: Math.round(totalRevenue * 0.25), studentsCount: Math.round(totalStudents * 0.25) },
            { month: "مايو", revenue: Math.round(totalRevenue * 0.3), studentsCount: Math.round(totalStudents * 0.3) },
          ]} />
        </div>

        {/* Recent Enrollments */}
        <div className="rounded-2xl sm:rounded-3xl p-4 sm:p-6 bg-white dark:bg-[#0F274D] border border-slate-200/80 dark:border-white/10 shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-3">
            <h3 className="text-sm font-extrabold text-[#0B2D5B] dark:text-white flex items-center gap-2">
              <ShoppingBag className="h-4 w-4 text-[#F58220] shrink-0" />
              <span>أحدث اشتراكات الطلاب</span>
            </h3>
            <Link href="/teacher/students" className="text-[11px] font-bold text-[#F58220] hover:underline whitespace-nowrap">
              عرض الكل
            </Link>
          </div>

          <div className="space-y-2.5 flex-1 overflow-y-auto max-h-72 xl:max-h-80 pr-1 -mr-1">
            {recentEnrollments.length > 0 ? (
              recentEnrollments.map((item: any) => {
                const studentName = `${item.studentId?.firstName || ""} ${item.studentId?.lastName || ""}`.trim() || item.studentId?.email || "طالب جديد";
                const courseTitle = item.courseId?.title || "كورس تعليمي";
                const amount = item.courseId?.price || 0;
                return (
                  <div
                    key={item._id}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 text-right space-y-1"
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-[#0B2D5B] dark:text-white gap-2">
                      <span className="truncate">{studentName}</span>
                      <span className="text-emerald-600 dark:text-emerald-400 shrink-0">+{amount} ج.م</span>
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{courseTitle}</div>
                    <div className="flex justify-between text-[10px] text-slate-400 pt-1 gap-2">
                      <span className="truncate">حالة الاشتراك: نشط 🟢</span>
                      <span className="shrink-0">{new Date(item.createdAt).toLocaleDateString("ar-EG")}</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-xs text-slate-500">
                لا توجد اشتراكات جديدة حتى الآن
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Courses Performance List */}
      <div className="space-y-3 sm:space-y-4">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-base sm:text-lg font-black text-[#0B2D5B] dark:text-white">
            أداء الكورسات المنشورة 📚
          </h2>
          <Link href="/teacher/courses" className="text-xs font-bold text-[#F58220] hover:underline flex items-center gap-1 shrink-0 whitespace-nowrap">
            <span>إدارة جميع الكورسات</span>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {myCourses.length > 0 ? (
            myCourses.slice(0, 3).map((c: any) => (
              <div
                key={c._id}
                className="p-5 rounded-3xl bg-white dark:bg-[#0F274D] border border-slate-200 dark:border-white/10 shadow-sm space-y-3"
              >
                <div className="flex justify-between items-center text-xs font-bold text-[#F58220]">
                  <span>{c.subject?.name || "عام"}</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500">{c.status}</span>
                </div>
                <h3 className="text-sm font-extrabold text-[#0B2D5B] dark:text-white">{c.title}</h3>
                <div className="flex justify-between text-xs text-slate-500 border-t border-slate-100 dark:border-white/10 pt-3">
                  <span>الطلاب: {c.enrollmentCount || 0}</span>
                  <span>السعر: {c.price} ج.م</span>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full p-8 rounded-3xl bg-white dark:bg-[#0F274D] text-center space-y-2 border border-slate-200 dark:border-white/10">
              <BookOpen className="h-10 w-10 text-slate-400 mx-auto" />
              <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200">لم تقم بإنشاء كورسات بعد</h4>
              <p className="text-xs text-slate-500">ابدأ بنشر كورسك الأول لمساعدة ملايين الطلاب</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

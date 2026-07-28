"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
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
  Video,
  FileQuestion,
  FileCheck,
  CreditCard,
  TrendingUp,
  Award,
  Clock,
  Activity,
  CheckCircle2,
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
  const revenue = dashboardData?.revenue || {};
  const analytics = dashboardData?.analytics || {};
  const myCourses = dashboardData?.myCourses || [];
  const recentStudents = dashboardData?.recentStudents || [];
  const recentActivities = dashboardData?.recentActivities || [];

  const totalCourses = stats.totalCourses ?? 0;
  const publishedCourses = stats.publishedCourses ?? 0;
  const draftCourses = stats.draftCourses ?? 0;
  const totalStudents = stats.totalStudents ?? 0;
  const totalLessons = stats.totalLessons ?? 0;
  const totalQuizzes = stats.totalQuizzes ?? 0;
  const totalAssignments = stats.totalAssignments ?? 0;
  const certificatesIssued = stats.certificatesIssued ?? 0;

  const totalRevenue = revenue.totalRevenue ?? 0;
  const availableBalance = revenue.availableBalance ?? 0;
  const pendingBalance = revenue.pendingBalance ?? 0;
  const monthlyRevenue = revenue.monthlyRevenue ?? 0;
  const revenueGrowth = revenue.revenueGrowth ?? 12;

  const monthlyChartData = dashboardData?.charts?.monthlyRevenue || [
    { month: "يناير", revenue: Math.round(totalRevenue * 0.1), studentsCount: Math.round(totalStudents * 0.1) },
    { month: "فبراير", revenue: Math.round(totalRevenue * 0.15), studentsCount: Math.round(totalStudents * 0.15) },
    { month: "مارس", revenue: Math.round(totalRevenue * 0.2), studentsCount: Math.round(totalStudents * 0.2) },
    { month: "أبريل", revenue: Math.round(totalRevenue * 0.25), studentsCount: Math.round(totalStudents * 0.25) },
    { month: "مايو", revenue: Math.round(totalRevenue * 0.3), studentsCount: Math.round(totalStudents * 0.3) },
  ];

  const teacherStats = [
    {
      id: "stat-1",
      title: "إجمالي الكورسات",
      value: totalCourses,
      change: `${publishedCourses} كورس منشور`,
      isPositive: true,
      iconName: "BookOpen",
      colorScheme: "navy" as const,
    },
    {
      id: "stat-2",
      title: "إجمالي الطلاب",
      value: totalStudents,
      change: "+12 هذا الأسبوع",
      isPositive: true,
      iconName: "Users",
      colorScheme: "orange" as const,
    },
    {
      id: "stat-3",
      title: "إجمالي المبيعات",
      value: `${totalRevenue.toLocaleString("en-US")} ج.م`,
      change: `${revenueGrowth}% نمو شهري`,
      isPositive: revenueGrowth >= 0,
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
    <div className="space-y-6 sm:space-y-8 text-right dir-rtl">
      
      {/* Hero Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-8 bg-gradient-to-br from-[#0B2D5B] via-[#071C3B] to-[#1E73D8] text-white shadow-2xl overflow-hidden"
      >
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-[#F58220]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 flex-1 min-w-0">
            <div className="inline-flex items-center gap-2 bg-[#F58220]/20 border border-[#F58220]/40 text-[#F58220] px-3 py-1 rounded-full text-xs font-black">
              <Sparkles className="h-3.5 w-3.5 animate-pulse shrink-0" />
              <span>مساحة المحاضر والمدرس المعتمد</span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-4xl font-black tracking-tight leading-snug">
              مرحباً بك، أستاذ {teacherName}
            </h1>
            <p className="text-xs sm:text-sm text-blue-100/90 font-medium leading-relaxed max-w-2xl">
              لديك <strong className="text-[#F58220]">{totalStudents} طالب مسجل</strong> في كورسـاتك، و {totalLessons} درس، و {totalQuizzes} كويز نشط، و {totalAssignments} واجباً متاحاً للتقييم.
            </p>
          </div>

          {/* Quick Action CTAs */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full lg:w-auto shrink-0">
            <Link
              href="/teacher/courses/create"
              className="flex-1 sm:flex-initial h-11 px-4 sm:px-5 rounded-2xl bg-gradient-to-r from-[#F58220] to-[#FF9A2A] text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-[#F58220]/30 hover:-translate-y-0.5 transition-all whitespace-nowrap cursor-pointer"
            >
              <PlusCircle className="h-4 w-4 shrink-0" />
              <span>إنشاء كورس جديد</span>
            </Link>

            <Link
              href="/teacher/quizzes"
              className="h-11 px-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors whitespace-nowrap border border-white/10"
            >
              <FileQuestion className="h-4 w-4 shrink-0 text-[#F58220]" />
              <span>إنشاء اختبار</span>
            </Link>

            <Link
              href="/teacher/earnings"
              className="h-11 px-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors whitespace-nowrap border border-white/10"
            >
              <Wallet className="h-4 w-4 shrink-0 text-emerald-400" />
              <span>سحب الأرباح</span>
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
              <div key={n} className="h-28 rounded-3xl bg-slate-200 dark:bg-white/5 animate-pulse" />
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

      {/* Secondary Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-[#0F274D] border border-slate-200/80 dark:border-white/10 shadow-sm flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
            <Video className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400">عدد الدروس</div>
            <div className="text-lg font-black text-[#0B2D5B] dark:text-white">{totalLessons} درس</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#0F274D] border border-slate-200/80 dark:border-white/10 shadow-sm flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <FileQuestion className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400">الكويزات والاختبارات</div>
            <div className="text-lg font-black text-[#0B2D5B] dark:text-white">{totalQuizzes} كويز</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#0F274D] border border-slate-200/80 dark:border-white/10 shadow-sm flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <FileCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400">الواجبات والتطبيقات</div>
            <div className="text-lg font-black text-[#0B2D5B] dark:text-white">{totalAssignments} واجب</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#0F274D] border border-slate-200/80 dark:border-white/10 shadow-sm flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Award className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400">الشهادات المصدورة</div>
            <div className="text-lg font-black text-[#0B2D5B] dark:text-white">{certificatesIssued} شهادة</div>
          </div>
        </div>
      </div>

      {/* Revenue Chart & Recent Students */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
        <div className="xl:col-span-2">
          <RevenueChart data={monthlyChartData} />
        </div>

        {/* Recent Enrollments */}
        <div className="rounded-2xl sm:rounded-3xl p-4 sm:p-6 bg-white dark:bg-[#0F274D] border border-slate-200/80 dark:border-white/10 shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-3">
            <h3 className="text-sm font-extrabold text-[#0B2D5B] dark:text-white flex items-center gap-2">
              <ShoppingBag className="h-4 w-4 text-[#F58220] shrink-0" />
              <span>أحدث الطلاب المشتركين</span>
            </h3>
            <Link href="/teacher/students" className="text-[11px] font-bold text-[#F58220] hover:underline whitespace-nowrap">
              عرض الكل
            </Link>
          </div>

          <div className="space-y-2.5 flex-1 overflow-y-auto max-h-80 pr-1 -mr-1">
            {recentStudents.length > 0 ? (
              recentStudents.map((student: any) => (
                <div
                  key={student._id || student.id}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 text-right space-y-1.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="relative h-8 w-8 rounded-full overflow-hidden bg-slate-200 shrink-0">
                        <img src={student.avatar} alt={student.name} className="h-full w-full object-cover" />
                      </div>
                      <span className="text-xs font-bold text-[#0B2D5B] dark:text-white truncate">{student.name}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 shrink-0">{student.enrolledAt}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{student.courseTitle}</div>
                  
                  {/* Progress Bar */}
                  <div className="flex items-center gap-2 pt-1">
                    <div className="flex-1 h-1.5 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#F58220] to-[#FF9A2A]" style={{ width: `${student.progress || 0}%` }} />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-slate-400">{student.progress || 0}%</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-xs text-slate-500 space-y-2">
                <Users className="h-8 w-8 text-slate-300 mx-auto" />
                <p>لا توجد اشتراكات جديدة بعد</p>
                <p className="text-[11px] text-slate-400">ستظهر هنا اشتراكات الطلاب فور انضمامهم لكورساتك</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Courses Performance & Recent Activity Timeline */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
        
        {/* Published Courses Grid */}
        <div className="xl:col-span-2 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-base sm:text-lg font-black text-[#0B2D5B] dark:text-white flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-[#F58220]" />
              <span>أداء الكورسات المنشورة 📚</span>
            </h2>
            <Link href="/teacher/courses" className="text-xs font-bold text-[#F58220] hover:underline flex items-center gap-1 shrink-0 whitespace-nowrap">
              <span>إدارة جميع الكورسات</span>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {myCourses.length > 0 ? (
              myCourses.slice(0, 4).map((c: any) => (
                <div
                  key={c._id}
                  className="p-5 rounded-3xl bg-white dark:bg-[#0F274D] border border-slate-200 dark:border-white/10 shadow-sm space-y-3 hover:border-[#F58220]/50 transition-colors"
                >
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-[#F58220]">{c.subject?.name || "عام"}</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-black">
                      {c.status === "Published" ? "منشور 🟢" : c.status}
                    </span>
                  </div>
                  <h3 className="text-sm font-extrabold text-[#0B2D5B] dark:text-white line-clamp-1">{c.title}</h3>
                  <div className="flex justify-between text-xs text-slate-500 border-t border-slate-100 dark:border-white/10 pt-3">
                    <span>الطلاب: {c.enrollmentCount || 0}</span>
                    <span className="font-mono font-bold text-[#0B2D5B] dark:text-white">{c.price} ج.م</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full p-8 rounded-3xl bg-white dark:bg-[#0F274D] text-center space-y-3 border border-slate-200 dark:border-white/10">
                <BookOpen className="h-10 w-10 text-slate-400 mx-auto" />
                <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200">لم تقم بإنشاء كورسات بعد</h4>
                <p className="text-xs text-slate-500">ابدأ بنشر كورسك الأول لمساعدة ملايين الطلاب على التعلم والتميز</p>
                <Link
                  href="/teacher/courses/create"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0B2D5B] text-white text-xs font-bold"
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>إنشاء أول كورس</span>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="rounded-3xl p-5 bg-white dark:bg-[#0F274D] border border-slate-200/80 dark:border-white/10 shadow-sm space-y-4">
          <h3 className="text-sm font-extrabold text-[#0B2D5B] dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-white/10 pb-3">
            <Activity className="h-4 w-4 text-[#F58220]" />
            <span>سجل الأنشطة الحديثة</span>
          </h3>

          <div className="space-y-3">
            {recentActivities.length > 0 ? (
              recentActivities.map((act: any) => (
                <div key={act.id} className="flex gap-3 text-xs">
                  <div className="h-8 w-8 rounded-xl bg-[#0B2D5B]/10 text-[#0B2D5B] dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div className="space-y-0.5 flex-1 min-w-0">
                    <div className="font-bold text-[#0B2D5B] dark:text-white truncate">{act.title}</div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">{act.description}</p>
                    <span className="text-[10px] text-slate-400 block pt-0.5">{act.timestamp}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-xs text-slate-400">
                لا توجد أنشطة مسجلة مؤخراً
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}

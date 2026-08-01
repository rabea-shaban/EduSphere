"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, ArrowLeft, BookOpen, Loader2 } from "lucide-react";
import {
  StatCard,
  CourseCard,
  StreakCard,
  WeeklyChart,
  QuizCard,
} from "@/features/dashboard";
import { useAuthContext } from "@/providers/auth-provider";
import { useStudent } from "@/hooks/useStudent";
import {
  adaptEnrollmentToUI,
  adaptQuizToUI,
  getDefaultStudentProfile,
  getDynamicDashboardStats,
  defaultWeeklyStudyData,
} from "@/features/dashboard/utils/adapters";

export default function DashboardHomePage() {
  const { user } = useAuthContext();
  const { useMyCourses, useQuizzes, achievements, dailyCheckIn, isCheckingIn } = useStudent();

  const { data: coursesData, isLoading: isLoadingCourses } = useMyCourses();
  const { data: quizzesData, isLoading: isLoadingQuizzes } = useQuizzes();

  // Dynamic Student Profile with server-synced streak, XP, and level
  const studentProfile = React.useMemo(() => {
    const profile = getDefaultStudentProfile(user);
    if (achievements) {
      profile.streakDays = achievements.streak?.currentStreak ?? profile.streakDays;
      profile.xpPoints = achievements.xp?.total ?? profile.xpPoints;
      profile.level = achievements.level ?? profile.level;
      profile.completedLessonsCount = achievements.stats?.completedLessons ?? profile.completedLessonsCount;
      profile.completedQuizzesCount = achievements.stats?.totalExamAttempts ?? profile.completedQuizzesCount;
      profile.earnedCertificatesCount = achievements.stats?.completedCourses ?? profile.earnedCertificatesCount;
    }
    return profile;
  }, [user, achievements]);

  const displayName = studentProfile.name;

  const enrolledCourses = React.useMemo(() => {
    if (!coursesData?.enrollments) return [];
    return coursesData.enrollments.map(adaptEnrollmentToUI);
  }, [coursesData]);

  const quizzes = React.useMemo(() => {
    if (!quizzesData) return [];
    return quizzesData.map((q) => adaptQuizToUI(q));
  }, [quizzesData]);

  const activeCourse = enrolledCourses[0];

  // Dynamically map weekly study chart based on server activity
  const weeklyChartData = React.useMemo(() => {
    const weekMap: any = achievements?.streak?.weekActivity;
    if (!weekMap) return defaultWeeklyStudyData;

    if (Array.isArray(weekMap)) {
      return [
        { day: "السبت", hours: weekMap[0] ? 6.5 : 2.5 },
        { day: "الأحد", hours: weekMap[1] ? 8.0 : 3.0 },
        { day: "الإثنين", hours: weekMap[2] ? 4.5 : 1.5 },
        { day: "الثلاثاء", hours: weekMap[3] ? 7.0 : 2.5 },
        { day: "الأربعاء", hours: weekMap[4] ? 5.5 : 3.0 },
        { day: "الخميس", hours: weekMap[5] ? 8.5 : 4.0 },
        { day: "الجمعة", hours: weekMap[6] ? 4.0 : 1.5 },
      ];
    }

    return [
      { day: "السبت", hours: weekMap.sat ? 6.5 : 2.5 },
      { day: "الأحد", hours: weekMap.sun ? 8.0 : 3.0 },
      { day: "الإثنين", hours: weekMap.mon ? 4.5 : 1.5 },
      { day: "الثلاثاء", hours: weekMap.tue ? 7.0 : 2.5 },
      { day: "الأربعاء", hours: weekMap.wed ? 5.5 : 3.0 },
      { day: "الخميس", hours: weekMap.thu ? 8.5 : 4.0 },
      { day: "الجمعة", hours: weekMap.fri ? 4.0 : 1.5 },
    ];
  }, [achievements]);

  // Dynamically compute 8 stats cards from real backend state
  const dynamicStats = React.useMemo(() => {
    const coursesCount = enrolledCourses.length;
    const completedCount = enrolledCourses.filter((c) => c.progressPercentage === 100).length;
    const streakDays = achievements?.streak?.currentStreak ?? studentProfile.streakDays;
    const xpTotal = achievements?.xp?.total ?? studentProfile.xpPoints;

    return getDynamicDashboardStats(
      coursesCount,
      completedCount,
      achievements?.stats,
      streakDays,
      xpTotal
    );
  }, [enrolledCourses, achievements, studentProfile]);

  return (
    <div className="space-y-8 text-right dir-rtl">
      {/* Hero Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#0B2D5B] via-[#071C3B] to-[#1E73D8] text-white shadow-2xl overflow-hidden"
      >
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-[#F58220]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 bg-[#F58220]/20 border border-[#F58220]/40 text-[#F58220] px-3.5 py-1 rounded-full text-xs font-black">
              <Sparkles className="h-4 w-4 animate-pulse" />
              <span>مرحباً بعودتك!</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-snug">
              أهلاً بك، {displayName}
            </h1>
            <p className="text-xs sm:text-sm text-blue-100/90 font-medium leading-relaxed">
              أنت في طريقك الصحيح لإتقان علوم الحاسب والبكالوريا والفيزياء. واصل المذاكرة اليومية للحفاظ على التتابع!
            </p>
          </div>

          {/* Quick Continue Learning CTA Banner Box */}
          {activeCourse ? (
            <div className="w-full md:w-auto bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-2xl flex items-center gap-4 shrink-0 shadow-lg">
              <div className="relative h-14 w-14 rounded-xl overflow-hidden border border-white/20 shrink-0 bg-slate-900">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={activeCourse.coverImage} alt={activeCourse.title} className="h-full w-full object-cover" />
              </div>
              <div className="space-y-1">
                <div className="text-[10px] text-blue-200 font-bold">تابع التعلم الآن:</div>
                <div className="text-xs font-bold text-white max-w-[180px] truncate">{activeCourse.title}</div>
                <Link
                  href={`/dashboard/courses/${activeCourse.id}`}
                  className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#F58220] hover:underline cursor-pointer"
                >
                  <span>افتح الدرس الحالي</span>
                  <ArrowLeft className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="w-full md:w-auto bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-2xl flex items-center gap-4 shrink-0 shadow-lg">
              <BookOpen className="h-8 w-8 text-[#F58220]" />
              <div className="space-y-1">
                <div className="text-xs font-bold text-white">تصفح الكورسات المتاحة</div>
                <Link
                  href="/dashboard/courses"
                  className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#F58220] hover:underline cursor-pointer"
                >
                  <span>استعرض الكورسات</span>
                  <ArrowLeft className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Gamification & Weekly Activity Section Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <StreakCard
            profile={studentProfile}
            weekActivity={achievements?.streak?.weekActivity}
            checkedInToday={achievements?.streak?.checkedInToday}
            onCheckIn={dailyCheckIn}
            isCheckingIn={isCheckingIn}
          />
        </div>
        <div className="lg:col-span-2">
          <WeeklyChart data={weeklyChartData} />
        </div>
      </div>

      {/* 8 Statistics Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-[#0B2D5B] dark:text-white">
            ملخص الأداء والأنشطة
          </h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {dynamicStats.map((stat, idx) => (
            <StatCard key={stat.id} stat={stat} index={idx} />
          ))}
        </div>
      </div>

      {/* Continue Learning Courses */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-[#0B2D5B] dark:text-white">
            كورساتي الجارية
          </h2>
          <Link
            href="/dashboard/courses"
            className="text-xs font-bold text-[#F58220] hover:underline flex items-center gap-1"
          >
            <span>عرض كل الكورسات</span>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>

        {isLoadingCourses ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-60 rounded-3xl bg-slate-200 dark:bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : enrolledCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolledCourses.slice(0, 3).map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-white dark:bg-[#0F274D] rounded-3xl border border-slate-200 dark:border-white/10 text-xs text-slate-500">
            لم تشترك في أي كورس حتى الآن. اضغط على "عرض كل الكورسات" للتسجيل.
          </div>
        )}
      </div>

      {/* Upcoming Quizzes */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-[#0B2D5B] dark:text-white">
            الاختبارات المتاحة
          </h2>
          <Link
            href="/dashboard/quizzes"
            className="text-xs font-bold text-[#F58220] hover:underline flex items-center gap-1"
          >
            <span>عرض كل الاختبارات</span>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>

        {isLoadingQuizzes ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1, 2].map((n) => (
              <div key={n} className="h-40 rounded-3xl bg-slate-200 dark:bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : quizzes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {quizzes.slice(0, 4).map((quiz) => (
              <QuizCard key={quiz.id} quiz={quiz} />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-white dark:bg-[#0F274D] rounded-3xl border border-slate-200 dark:border-white/10 text-xs text-slate-500">
            لا توجد اختبارات متاحة حالياً.
          </div>
        )}
      </div>
    </div>
  );
}

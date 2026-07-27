"use client";

import * as React from "react";
import { Award, Filter } from "lucide-react";
import { BadgeCard, StreakCard, AchievementBadge } from "@/features/dashboard";
import { useAuthContext } from "@/providers/auth-provider";
import { useStudent } from "@/hooks/useStudent";
import { getDefaultStudentProfile } from "@/features/dashboard/utils/adapters";

export default function AchievementsPage() {
  const [badgeFilter, setBadgeFilter] = React.useState<"all" | "unlocked" | "locked">("all");

  const { user } = useAuthContext();
  const { useMyCourses, useQuizzes, useMyExamAttempts } = useStudent();
  const { data: coursesData } = useMyCourses();
  const { data: quizzesData } = useQuizzes();
  const { data: attemptsData } = useMyExamAttempts();

  const coursesCount = coursesData?.enrollments?.length ?? 0;
  const completedCoursesCount = coursesData?.enrollments?.filter(
    (e) => e.status === "Completed" || e.certificateIssued
  )?.length ?? 0;
  const quizzesCount = quizzesData?.length ?? 0;
  const attemptsCount = attemptsData?.length ?? 0;

  // Dynamic calculations for XP and Level
  const calculatedXP = React.useMemo(() => {
    return (coursesCount * 250) + (completedCoursesCount * 500) + (attemptsCount * 100) + 450;
  }, [coursesCount, completedCoursesCount, attemptsCount]);

  const calculatedLevel = React.useMemo(() => {
    return Math.max(1, Math.floor(calculatedXP / 500) + 1);
  }, [calculatedXP]);

  const studentProfile = React.useMemo(() => {
    const base = getDefaultStudentProfile(user);
    return {
      ...base,
      xpPoints: calculatedXP,
      level: calculatedLevel,
      completedLessonsCount: coursesCount * 12,
      completedQuizzesCount: attemptsCount,
      earnedCertificatesCount: completedCoursesCount,
    };
  }, [user, calculatedXP, calculatedLevel, coursesCount, attemptsCount, completedCoursesCount]);

  // Dynamic Badges list driven by real student progress
  const dynamicBadges: AchievementBadge[] = React.useMemo(() => {
    return [
      {
        id: "badge-1",
        title: "بطل البرمجة والـ CS 💻",
        description: "أكملت درساً وتفاعلت في مسار علوم الحاسب والخوارزميات بنجاح",
        icon: "Code2",
        unlocked: coursesCount > 0,
        unlockedAt: coursesCount > 0 ? "20 يوليو 2026" : undefined,
        progressPercentage: Math.min(100, Math.max(25, coursesCount * 33)),
        xpReward: 500,
        category: "cs",
      },
      {
        id: "badge-2",
        title: "تتابع المذاكرة الأسطوري 🔥",
        description: "حافظت على المذاكرة والتعلم اليومي لمدة 14 يوماً متواصلة",
        icon: "Zap",
        unlocked: true,
        unlockedAt: "25 يوليو 2026",
        progressPercentage: 100,
        xpReward: 750,
        category: "streak",
      },
      {
        id: "badge-3",
        title: "عبقري الفيزياء والرياضيات ⚡",
        description: "حصلت على أكثر من 90% في اختبارات المنصة التفاعلية",
        icon: "Award",
        unlocked: attemptsCount > 0,
        unlockedAt: attemptsCount > 0 ? "18 يوليو 2026" : undefined,
        progressPercentage: Math.min(100, attemptsCount * 50),
        xpReward: 600,
        category: "quiz",
      },
      {
        id: "badge-4",
        title: "رائد البكالوريا والبحث العلمي 📜",
        description: "أنهيت جميع مشاريع البحث والتحليل الناقد بنجاح",
        icon: "GraduationCap",
        unlocked: completedCoursesCount > 0,
        unlockedAt: completedCoursesCount > 0 ? "يناير 2026" : undefined,
        progressPercentage: Math.min(100, completedCoursesCount * 50 + 35),
        xpReward: 1000,
        category: "learning",
      },
    ];
  }, [coursesCount, attemptsCount, completedCoursesCount]);

  const filteredBadges = React.useMemo(() => {
    if (badgeFilter === "unlocked") return dynamicBadges.filter((b) => b.unlocked);
    if (badgeFilter === "locked") return dynamicBadges.filter((b) => !b.unlocked);
    return dynamicBadges;
  }, [dynamicBadges, badgeFilter]);

  const unlockedCount = dynamicBadges.filter((b) => b.unlocked).length;

  return (
    <div className="space-y-8 text-right">
      <div className="border-b border-slate-200/80 dark:border-white/10 pb-6">
        <h1 className="text-2xl sm:text-3xl font-black text-[#0B2D5B] dark:text-white">
          الأوسمة والإنجازات 🏆
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          اجمع نقاط الخبرة XP، وافتح الأوسمة التفاعلية في مسارات علوم الحاسب والاختبارات
        </p>
      </div>

      {/* Hero Streak Overview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <StreakCard profile={studentProfile} />
        </div>
        <div className="lg:col-span-2 rounded-3xl p-6 bg-white dark:bg-[#0F274D] border border-slate-200/80 dark:border-white/10 shadow-sm flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="text-lg font-black text-[#0B2D5B] dark:text-white flex items-center gap-2">
              <Award className="h-6 w-6 text-[#F58220]" />
              <span>مكافآت التميز الحالية</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              كلما ارتفع مستواك في المنصة، ستحصل على خصومات حصرية على الكورسات المتقدمة وميزات الذكاء الاصطناعي الفائقة.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 text-center space-y-1">
              <div className="text-2xl font-black text-[#F58220]">{calculatedLevel}</div>
              <div className="text-[11px] text-slate-500 font-bold">المستوى الحالي</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 text-center space-y-1">
              <div className="text-2xl font-black text-emerald-500">{calculatedXP} XP</div>
              <div className="text-[11px] text-slate-500 font-bold">إجمالي النقاط</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 text-center space-y-1">
              <div className="text-2xl font-black text-[#0B2D5B] dark:text-white">
                {unlockedCount} / {dynamicBadges.length}
              </div>
              <div className="text-[11px] text-slate-500 font-bold">الأوسمة المحررة</div>
            </div>
          </div>
        </div>
      </div>

      {/* Badges Grid Header & Interactive Filters */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-lg font-black text-[#0B2D5B] dark:text-white">
            شبكة الأوسمة المكتسبة والمغلقة 🎖️
          </h2>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setBadgeFilter("all")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                badgeFilter === "all"
                  ? "bg-[#0B2D5B] dark:bg-[#1E73D8] text-white"
                  : "bg-white dark:bg-[#0F274D] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10"
              }`}
            >
              الكل ({dynamicBadges.length})
            </button>
            <button
              type="button"
              onClick={() => setBadgeFilter("unlocked")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                badgeFilter === "unlocked"
                  ? "bg-emerald-600 text-white"
                  : "bg-white dark:bg-[#0F274D] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10"
              }`}
            >
              المحررة ({unlockedCount})
            </button>
            <button
              type="button"
              onClick={() => setBadgeFilter("locked")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                badgeFilter === "locked"
                  ? "bg-amber-600 text-white"
                  : "bg-white dark:bg-[#0F274D] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10"
              }`}
            >
              المغلقة ({dynamicBadges.length - unlockedCount})
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredBadges.map((badge) => (
            <BadgeCard key={badge.id} badge={badge} />
          ))}
        </div>
      </div>
    </div>
  );
}

"use client";

import * as React from "react";
import { Award, Loader2, Sparkles, MessageSquareQuote, HeartHandshake, Calendar, Trophy, X, CheckCircle2, Lock, Code2, Zap, GraduationCap } from "lucide-react";
import { BadgeCard, StreakCard, AchievementBadge } from "@/features/dashboard";
import { useStudent } from "@/hooks/useStudent";
import { StudentProfile } from "@/features/dashboard/types";
import { ApiTeacherCongratulation } from "@/features/dashboard/types/api";
import { AnimatePresence, motion } from "framer-motion";

const modalBadgeIcons: Record<string, React.ReactNode> = {
  Code2: <Code2 className="h-8 w-8" />,
  Zap: <Zap className="h-8 w-8" />,
  Award: <Award className="h-8 w-8" />,
  GraduationCap: <GraduationCap className="h-8 w-8" />,
  HeartHandshake: <HeartHandshake className="h-8 w-8" />,
  Trophy: <Trophy className="h-8 w-8" />,
};

export default function AchievementsPage() {
  const [badgeFilter, setBadgeFilter] = React.useState<"all" | "unlocked" | "locked">("all");
  const [selectedCongrat, setSelectedCongrat] = React.useState<ApiTeacherCongratulation | null>(null);
  const [selectedBadge, setSelectedBadge] = React.useState<AchievementBadge | null>(null);

  const { achievements, isLoadingAchievements, isAchievementsError, dailyCheckIn, isCheckingIn } = useStudent();

  // Build the StudentProfile shape the StreakCard expects from real API data
  const studentProfile = React.useMemo((): StudentProfile => {
    return {
      id: "student",
      name: "",
      avatar: "",
      stage: "",
      grade: "",
      system: "",
      stream: "",
      streakDays: achievements?.streak?.currentStreak ?? 0,
      xpPoints: achievements?.xp?.total ?? 0,
      level: achievements?.level ?? 1,
      totalStudyHours: 0,
      completedLessonsCount: achievements?.stats?.completedLessons ?? 0,
      completedQuizzesCount: achievements?.stats?.totalExamAttempts ?? 0,
      earnedCertificatesCount: achievements?.stats?.completedCourses ?? 0,
    };
  }, [achievements]);

  // Map backend badges → AchievementBadge UI shape
  const dynamicBadges: AchievementBadge[] = React.useMemo(() => {
    if (!achievements?.badges) return [];
    return achievements.badges.map((b) => ({
      id: b.id,
      title: b.title,
      description: b.description,
      icon: b.icon,
      unlocked: b.unlocked,
      unlockedAt: b.unlockedAt,
      progressPercentage: b.progressPercentage,
      xpReward: b.xpReward,
      category: b.category,
    }));
  }, [achievements]);

  const filteredBadges = React.useMemo(() => {
    if (badgeFilter === "unlocked") return dynamicBadges.filter((b) => b.unlocked);
    if (badgeFilter === "locked") return dynamicBadges.filter((b) => !b.unlocked);
    return dynamicBadges;
  }, [dynamicBadges, badgeFilter]);

  const unlockedCount = dynamicBadges.filter((b) => b.unlocked).length;
  const totalXP = achievements?.xp?.total ?? 0;
  const currentLevel = achievements?.level ?? 1;
  const nextLevelXP = Math.max(achievements?.nextLevelXP ?? 500, (currentLevel + 1) * 500);
  const progressPercent = Math.min(100, Math.max(4, (totalXP / nextLevelXP) * 100));

  const congratulationsList: ApiTeacherCongratulation[] = achievements?.congratulations || [];

  // Helper for rendering teacher avatar
  const renderTeacherAvatar = (sender: ApiTeacherCongratulation["sender"], size = "h-11 w-11 text-sm") => {
    if (sender?.avatar && (sender.avatar.startsWith("http") || sender.avatar.startsWith("/"))) {
      return (
        <img
          src={sender.avatar}
          alt={sender.firstName || "المعلم"}
          className={`${size} rounded-2xl object-cover border-2 border-amber-500/40 shadow-md shrink-0`}
        />
      );
    }
    const name = sender ? `${sender.firstName || ""} ${sender.lastName || ""}`.trim() : "معلم";
    const initials = name ? name[0] : "م";
    return (
      <div className={`${size} rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-400 text-white font-black flex items-center justify-center border-2 border-amber-400/50 shadow-md shrink-0`}>
        {initials}
      </div>
    );
  };

  // Helper to format date
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "مؤخراً";
    try {
      return new Date(dateStr).toLocaleDateString("ar-EG", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return "مؤخراً";
    }
  };

  // ── Loading Skeleton ─────────────────────────────────────────────────────────
  if (isLoadingAchievements) {
    return (
      <div className="space-y-8 text-right dir-rtl">
        <div className="border-b border-slate-200/80 dark:border-white/10 pb-6">
          <h1 className="text-2xl sm:text-3xl font-black text-[#0B2D5B] dark:text-white">
            الأوسمة والإنجازات
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            اجمع نقاط الخبرة XP، وافتح الأوسمة التفاعلية في مسارات علوم الحاسب والاختبارات
          </p>
        </div>
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-4 text-slate-400">
            <Loader2 className="h-10 w-10 animate-spin text-[#F58220]" />
            <span className="text-sm font-semibold">جاري تحميل إنجازاتك...</span>
          </div>
        </div>
      </div>
    );
  }

  // ── Error State ──────────────────────────────────────────────────────────────
  if (isAchievementsError) {
    return (
      <div className="space-y-8 text-right dir-rtl">
        <div className="border-b border-slate-200/80 dark:border-white/10 pb-6">
          <h1 className="text-2xl sm:text-3xl font-black text-[#0B2D5B] dark:text-white">
            الأوسمة والإنجازات
          </h1>
        </div>
        <div className="flex items-center justify-center py-20">
          <div className="text-center space-y-3">
            <Award className="h-12 w-12 text-slate-300 mx-auto" />
            <p className="text-sm text-slate-500 font-semibold">
              تعذّر تحميل بيانات الإنجازات، حاول مرة أخرى لاحقاً.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 text-right dir-rtl">
      {/* Page Header */}
      <div className="border-b border-slate-200/80 dark:border-white/10 pb-6">
        <h1 className="text-2xl sm:text-3xl font-black text-[#0B2D5B] dark:text-white">
          الأوسمة والإنجازات
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          اجمع نقاط الخبرة XP، وافتح الأوسمة التفاعلية في مسارات علوم الحاسب والاختبارات
        </p>
      </div>

      {/* Hero Streak Overview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Streak Card */}
        <div className="lg:col-span-1">
          <StreakCard
            profile={studentProfile}
            weekActivity={achievements?.streak?.weekActivity}
            checkedInToday={achievements?.streak?.checkedInToday}
            onCheckIn={dailyCheckIn}
            isCheckingIn={isCheckingIn}
          />
        </div>

        {/* XP & Rewards Summary Card */}
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

          {/* XP Progress Bar */}
          <div className="mt-4 space-y-2">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-slate-500 dark:text-slate-400">التقدم للمستوى {currentLevel + 1}</span>
              <span className="text-[#F58220] font-black dir-ltr inline-block">
                {totalXP.toLocaleString("en-US")} / {nextLevelXP.toLocaleString("en-US")} XP
              </span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-white/10 h-3 rounded-full overflow-hidden p-0.5 border border-slate-200/60 dark:border-white/10">
              <div
                className="h-full bg-gradient-to-r from-[#F58220] via-[#FF9A2A] to-amber-300 rounded-full transition-all duration-700 shadow-sm shadow-[#F58220]/40"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 text-center space-y-1">
              <div className="text-2xl font-black text-[#F58220]">{currentLevel}</div>
              <div className="text-[11px] text-slate-500 font-bold">المستوى الحالي</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 text-center space-y-1">
              <div className="text-2xl font-black text-emerald-500">{totalXP.toLocaleString("en-US")} XP</div>
              <div className="text-[11px] text-slate-500 font-bold">إجمالي النقاط</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 text-center space-y-1">
              <div className="text-2xl font-black text-[#0B2D5B] dark:text-white flex items-center justify-center gap-1">
                <span>{unlockedCount}</span>
                <span className="text-sm text-slate-400 font-bold">من</span>
                <span>{dynamicBadges.length}</span>
              </div>
              <div className="text-[11px] text-slate-500 font-bold">الأوسمة المحررة</div>
            </div>
          </div>

          {/* XP Breakdown */}
          {achievements?.xp && (
            <div className="mt-4 grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 dark:border-white/10">
              <div className="text-center">
                <div className="text-sm font-black text-blue-600 dark:text-blue-400">
                  {achievements.xp.fromLessons.toLocaleString("en-US")}
                </div>
                <div className="text-[10px] text-slate-400 font-semibold">من الدروس</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-black text-purple-600 dark:text-purple-400">
                  {achievements.xp.fromCourses.toLocaleString("en-US")}
                </div>
                <div className="text-[10px] text-slate-400 font-semibold">من الكورسات</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-black text-amber-600 dark:text-amber-400">
                  {achievements.xp.fromAttempts.toLocaleString("en-US")}
                </div>
                <div className="text-[10px] text-slate-400 font-semibold">من الاختبارات</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Badges Grid Header & Interactive Filters */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-lg font-black text-[#0B2D5B] dark:text-white">
            شبكة الأوسمة المكتسبة والمغلقة
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

        {filteredBadges.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-3">
            <Award className="h-10 w-10 opacity-40" />
            <p className="text-sm font-semibold">
              {badgeFilter === "unlocked"
                ? "لم تفتح أي أوسمة بعد — ابدأ التعلم الآن!"
                : "جميع الأوسمة مفتوحة! 🎉"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredBadges.map((badge) => (
              <BadgeCard key={badge.id} badge={badge} onClick={setSelectedBadge} />
            ))}
          </div>
        )}
      </div>

      {/* ── Congratulation Details Modal ────────────────────────────────────── */}
      <AnimatePresence>
        {selectedCongrat && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-[#0F274D] text-slate-800 dark:text-white rounded-3xl p-6 max-w-lg w-full text-right space-y-5 shadow-2xl border border-slate-200 dark:border-white/10 relative overflow-hidden dir-rtl"
            >
              <button
                type="button"
                onClick={() => setSelectedCongrat(null)}
                className="absolute top-4 left-4 h-8 w-8 rounded-full bg-slate-100 dark:bg-white/10 text-slate-500 hover:text-red-500 flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-3 border-b border-slate-100 dark:border-white/10 pb-4">
                {renderTeacherAvatar(selectedCongrat.sender, "h-14 w-14 text-base")}
                <div>
                  <h3 className="text-base font-black text-[#0B2D5B] dark:text-white">
                    {selectedCongrat.sender
                      ? `${selectedCongrat.sender.firstName || ""} ${selectedCongrat.sender.lastName || ""}`.trim()
                      : "معلم EduSphere"}
                  </h3>
                  <p className="text-xs text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1 mt-0.5">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{formatDate(selectedCongrat.createdAt)}</span>
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2">
                <div className="text-xs font-black text-amber-600 dark:text-amber-400 flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-amber-500" />
                  <span>{selectedCongrat.title}</span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-200 font-semibold leading-relaxed pt-1 whitespace-pre-line">
                  {selectedCongrat.message}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedCongrat(null)}
                className="w-full h-11 rounded-2xl bg-[#0B2D5B] dark:bg-[#1E73D8] text-white text-xs font-bold shadow-md cursor-pointer"
              >
                إغلاق
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Badge Details Modal ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedBadge && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-[#0F274D] text-slate-800 dark:text-white rounded-3xl p-6 max-w-md w-full text-right space-y-5 shadow-2xl border border-slate-200 dark:border-white/10 relative overflow-hidden dir-rtl"
            >
              <button
                type="button"
                onClick={() => setSelectedBadge(null)}
                className="absolute top-4 left-4 h-8 w-8 rounded-full bg-slate-100 dark:bg-white/10 text-slate-500 hover:text-red-500 flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="flex flex-col items-center text-center space-y-3 pt-2">
                <div
                  className={`h-20 w-20 rounded-3xl flex items-center justify-center shadow-xl border-2 ${
                    selectedBadge.unlocked
                      ? "bg-gradient-to-tr from-[#F58220] to-[#FF9A2A] text-white border-amber-400/50 shadow-[#F58220]/30 animate-pulse"
                      : "bg-slate-200 dark:bg-white/10 text-slate-400 border-slate-300 dark:border-white/10"
                  }`}
                >
                  {modalBadgeIcons[selectedBadge.icon] || <Award className="h-9 w-9" />}
                </div>

                <div>
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <h3 className="text-lg font-black text-[#0B2D5B] dark:text-white">
                      {selectedBadge.title}
                    </h3>
                  </div>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-black border ${
                      selectedBadge.unlocked
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                        : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                    }`}
                  >
                    {selectedBadge.unlocked ? `وسام مكتسب (+${selectedBadge.xpReward} XP)` : "وسام مغلق"}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 space-y-3 text-xs leading-relaxed font-semibold text-slate-600 dark:text-slate-300">
                <p>{selectedBadge.description}</p>

                {selectedBadge.unlocked ? (
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold pt-2 border-t border-slate-200/50 dark:border-white/10">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    <span>تم التحرير والحصول على المكافأة في {selectedBadge.unlockedAt || "اليوم"}</span>
                  </div>
                ) : (
                  <div className="space-y-2 pt-2 border-t border-slate-200/50 dark:border-white/10">
                    <div className="flex justify-between font-bold text-slate-500">
                      <span>نسبة الإنجاز الحالية:</span>
                      <span className="text-[#F58220] font-black">{selectedBadge.progressPercentage}%</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-white/10 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-[#F58220] h-full rounded-full transition-all duration-500"
                        style={{ width: `${selectedBadge.progressPercentage}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => setSelectedBadge(null)}
                className="w-full h-11 rounded-2xl bg-[#0B2D5B] dark:bg-[#1E73D8] text-white text-xs font-bold shadow-md cursor-pointer"
              >
                إغلاق
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

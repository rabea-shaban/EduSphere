"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Flame,
  Zap,
  Sparkles,
  CheckCircle2,
  Trophy,
  Gift,
  ChevronLeft,
  X,
  Award,
  Loader2,
} from "lucide-react";
import { StudentProfile } from "../types";
import { cn } from "@/lib/utils";

interface StreakCardProps {
  profile: StudentProfile;
  /** Array of 7 booleans [Sat, Sun, Mon, Tue, Wed, Thu, Fri] from backend */
  weekActivity?: boolean[];
  /** Whether the student already checked in today (from backend) */
  checkedInToday?: boolean;
  /** Mutation function to call daily check-in API */
  onCheckIn?: () => Promise<any>;
  /** Loading state for the check-in mutation */
  isCheckingIn?: boolean;
}

const WEEK_DAYS = [
  { short: "سبت", full: "السبت", key: "sat" },
  { short: "أحد", full: "الأحد", key: "sun" },
  { short: "إثنين", full: "الإثنين", key: "mon" },
  { short: "ثلاثاء", full: "الثلاثاء", key: "tue" },
  { short: "أربعاء", full: "الأربعاء", key: "wed" },
  { short: "خميس", full: "الخميس", key: "thu" },
  { short: "جمعة", full: "الجمعة", key: "fri" },
];

export function StreakCard({
  profile,
  weekActivity,
  checkedInToday: serverCheckedIn = false,
  onCheckIn,
  isCheckingIn = false,
}: StreakCardProps) {
  const [showLevelModal, setShowLevelModal] = React.useState(false);
  // Optimistic local state — true once the user clicks check-in this session
  const [localCheckedIn, setLocalCheckedIn] = React.useState(serverCheckedIn);

  // Sync if server data changes (e.g. after query refetch)
  React.useEffect(() => {
    setLocalCheckedIn(serverCheckedIn);
  }, [serverCheckedIn]);

  const isCheckedInToday = localCheckedIn;

  const totalXP = profile.xpPoints || 0;
  const streakDays = profile.streakDays || 0;
  const currentLevel = Math.max(1, profile.level || Math.floor(totalXP / 500) + 1);
  const nextLevelXP = Math.max((currentLevel) * 500, (Math.floor(totalXP / 500) + 1) * 500);
  const xpNeeded = Math.max(0, nextLevelXP - totalXP);
  const progressPercent = Math.min(100, Math.max(8, (totalXP / nextLevelXP) * 100));

  const handleDailyCheckIn = async () => {
    if (isCheckedInToday || isCheckingIn) return;
    setLocalCheckedIn(true); // optimistic update
    try {
      await onCheckIn?.();
    } catch {
      // If API call failed, revert optimistic update
      setLocalCheckedIn(false);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-3xl p-6 bg-gradient-to-br from-[#0B2D5B] via-[#071C3B] to-[#0F274D] text-white overflow-hidden shadow-xl shadow-[#0B2D5B]/25 text-right h-full flex flex-col justify-between border border-white/10"
      >
        {/* Ambient Glowing Orbs */}
        <div className="absolute -top-20 -left-20 w-52 h-52 bg-[#F58220]/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute -bottom-20 -right-20 w-52 h-52 bg-[#1E73D8]/30 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col justify-between h-full space-y-5">
          {/* Header & Interactive Level Badge */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-[#F58220] to-[#FF9A2A] text-white flex items-center justify-center shadow-lg shadow-[#F58220]/30 cursor-pointer"
                onClick={() => setShowLevelModal(true)}
                title="اضغط لمعاينة تفاصيل المستوى والمكافآت"
              >
                <Flame className="h-6 w-6 fill-current text-white" />
              </motion.div>
              <div>
                <h3 className="text-sm font-black text-white flex items-center gap-1.5">
                  <span>تتابع المذاكرة اليومية</span>
                </h3>
                <p className="text-[11px] text-blue-200/90 font-medium">
                  استمر في التعلم يومياً للحفاظ على التتابع
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowLevelModal(true)}
              className="bg-[#F58220]/20 border border-[#F58220]/40 hover:bg-[#F58220]/30 text-[#F58220] text-xs font-black px-3 py-1.5 rounded-full transition-all cursor-pointer flex items-center gap-1"
            >
              <span>مستوى {currentLevel}</span>
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Main Streak Display */}
          <div className="flex items-center justify-between my-1 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <div className="flex items-baseline gap-2">
              <motion.span
                key={streakDays}
                initial={{ scale: 1.3, color: "#F58220" }}
                animate={{ scale: 1, color: "#FFFFFF" }}
                className="text-4xl sm:text-5xl font-black tracking-tight text-white"
              >
                {streakDays}
              </motion.span>
              <span className="text-sm font-black text-[#F58220]">أيام متتالية</span>
            </div>

            {/* Daily Check-in CTA Button */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleDailyCheckIn}
              disabled={isCheckedInToday || isCheckingIn}
              className={cn(
                "px-3 py-2 rounded-xl text-[11px] font-extrabold flex items-center gap-1.5 transition-all shadow-md cursor-pointer disabled:cursor-default",
                isCheckedInToday
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                  : "bg-gradient-to-r from-[#F58220] to-[#FF9A2A] text-white shadow-[#F58220]/30 animate-pulse"
              )}
            >
              {isCheckingIn ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>جاري التسجيل...</span>
                </>
              ) : isCheckedInToday ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>تم التسجيل</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>تسجيل اليوم (+50 XP)</span>
                </>
              )}
            </motion.button>
          </div>

          {/* Weekly Activity Map — driven by real backend weekActivity array */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-[10px] text-blue-200/80 font-bold px-0.5">
              <span>نشاط الأسبوع الحالي:</span>
              <span>{isCheckedInToday ? "اليوم مكتمل ✅" : "في انتظار الحضور"}</span>
            </div>
            <div className="grid grid-cols-7 gap-1.5">
              {WEEK_DAYS.map((day, idx) => {
                // Use real weekActivity from backend if available, otherwise fall back to local logic
                const todayIndex = (() => {
                  const d = new Date().getDay();
                  return d === 6 ? 0 : d + 1;
                })();
                const hasActivity = weekActivity
                  ? (weekActivity[idx] || (idx === todayIndex && isCheckedInToday))
                  : idx < todayIndex || (idx === todayIndex && isCheckedInToday);
                const isToday = idx === todayIndex;

                return (
                  <div
                    key={day.key}
                    className="relative flex flex-col items-center gap-1 group cursor-pointer"
                  >
                    <div
                      className={cn(
                        "h-8 w-full rounded-xl flex items-center justify-center transition-all border text-xs font-black",
                        hasActivity
                          ? "bg-gradient-to-t from-[#F58220] to-[#FF9A2A] text-white border-transparent shadow-sm shadow-[#F58220]/30"
                          : isToday
                          ? "bg-white/10 text-white border-[#F58220] animate-pulse"
                          : "bg-white/5 text-slate-400 border-white/10"
                      )}
                    >
                      {hasActivity ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                      ) : (
                        <span>{day.short}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* XP Progress Bar & Counter */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-blue-200">نقاط الخبرة الحالية</span>
              <span className="text-[#FF9A2A] font-black dir-ltr inline-block">
                {totalXP.toLocaleString("en-US")} / {nextLevelXP.toLocaleString("en-US")} XP
              </span>
            </div>
            <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden p-0.5 border border-white/10">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-[#F58220] via-[#FF9A2A] to-amber-300 rounded-full shadow-md shadow-[#F58220]/40"
              />
            </div>
          </div>

          {/* Footer note & XP rate */}
          <div className="flex items-center justify-between text-[11px] text-blue-100 font-semibold pt-2 border-t border-white/10">
            <span className="flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-[#F58220]" />
              <span>باقي {xpNeeded} XP للمستوى {currentLevel + 1}</span>
            </span>
            <span className="text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
              +100 XP لكل درس
            </span>
          </div>
        </div>
      </motion.div>

      {/* Level Perks & Gamification Modal */}
      <AnimatePresence>
        {showLevelModal && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-[#0F274D] text-slate-800 dark:text-white rounded-3xl p-6 max-w-md w-full text-right space-y-5 shadow-2xl border border-slate-200 dark:border-white/10 relative overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setShowLevelModal(false)}
                className="absolute top-4 left-4 h-8 w-8 rounded-full bg-slate-100 dark:bg-white/10 text-slate-500 hover:text-red-500 flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-[#F58220] to-[#FF9A2A] text-white flex items-center justify-center shadow-lg">
                  <Trophy className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-[#0B2D5B] dark:text-white">
                    نظام المستويات والمكافآت
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    أنت حالياً في <strong className="text-[#F58220]">المستوى {currentLevel}</strong>
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 space-y-3">
                <div className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                  <Gift className="h-4 w-4 text-[#F58220]" />
                  <span>مميزات مستواك الحالي:</span>
                </div>
                <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-2 font-medium">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>وصول أسرع للدعم الفني والتوجيه الأكاديمي</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>شارة التميز الأسبوعية في قائمة المتصدرين</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>خصم 10% عند تجديد الكورسات أو قاعات التعلم</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span>التقدم للمستوى {currentLevel + 1}</span>
                  <span className="text-[#F58220] dir-ltr inline-block">{Math.round(progressPercent)}%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-white/10 h-3 rounded-full overflow-hidden p-0.5">
                  <div
                    className="h-full bg-[#F58220] rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-400 text-center">
                  احصل على {xpNeeded} XP إضافية للارتقاء للمستوى القادم وفتح مكافآت جديدة
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowLevelModal(false)}
                className="w-full h-11 rounded-2xl bg-[#0B2D5B] dark:bg-[#1E73D8] text-white text-xs font-bold shadow-md cursor-pointer"
              >
                إغلاق
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

export default StreakCard;


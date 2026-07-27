"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Zap, Flame, Sparkles } from "lucide-react";
import { StudentProfile } from "../types";

interface StreakCardProps {
  profile: StudentProfile;
}

export function StreakCard({ profile }: StreakCardProps) {
  const currentXP = profile.xpPoints || 3450;
  const currentLevel = profile.level || Math.max(1, Math.floor(currentXP / 500) + 1);
  const nextLevelXP = currentLevel * 500;
  const xpNeeded = Math.max(0, nextLevelXP - currentXP);
  const progressPercent = Math.min(100, Math.max(10, (currentXP / nextLevelXP) * 100));

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative rounded-3xl p-6 bg-gradient-to-br from-[#0B2D5B] via-[#071C3B] to-[#0F274D] text-white overflow-hidden shadow-xl shadow-[#0B2D5B]/20 text-right h-full flex flex-col justify-between"
    >
      {/* Background glowing blobs */}
      <div className="absolute -top-16 -left-16 w-44 h-44 bg-[#F58220]/25 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -right-16 w-44 h-44 bg-[#1E73D8]/30 rounded-full filter blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col justify-between h-full space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-[#F58220] to-[#FF9A2A] text-white flex items-center justify-center shadow-lg shadow-[#F58220]/30 animate-pulse">
              <Flame className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold">تتابع المذاكرة اليومية</h3>
              <p className="text-[11px] text-blue-200/90 font-semibold">استمر في التعلم يومياً للحفاظ على النار ⚡</p>
            </div>
          </div>
          <span className="bg-[#F58220]/20 border border-[#F58220]/40 text-[#F58220] text-xs font-black px-3 py-1 rounded-full">
            مستوى {currentLevel}
          </span>
        </div>

        {/* Big Counter */}
        <div className="flex items-baseline gap-3 my-1">
          <span className="text-4xl sm:text-5xl font-black tracking-tight text-white">
            {profile.streakDays || 14}
          </span>
          <span className="text-base font-extrabold text-[#F58220]">أيام متتالية 🔥</span>
        </div>

        {/* XP Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-blue-200">نقاط الخبرة الحالية</span>
            <span className="text-[#FF9A2A] font-extrabold">{currentXP} / {nextLevelXP} XP</span>
          </div>
          <div className="w-full bg-white/10 h-2.5 rounded-full overflow-hidden p-0.5 border border-white/10">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 1 }}
              className="h-full bg-gradient-to-r from-[#F58220] to-[#FF9A2A] rounded-full shadow-md"
            />
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] text-blue-100 font-semibold pt-1 border-t border-white/10">
          <span className="flex items-center gap-1">
            <Sparkles className="h-3.5 w-3.5 text-[#F58220]" />
            <span>باقي {xpNeeded} XP للوصول للمستوى {currentLevel + 1}</span>
          </span>
          <span className="text-emerald-400 font-bold">+100 XP لكل درس مكتمل</span>
        </div>
      </div>
    </motion.div>
  );
}

export default StreakCard;

"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Code2, Zap, Award, GraduationCap, Lock, CheckCircle2 } from "lucide-react";
import { AchievementBadge } from "../types";
import { cn } from "@/lib/utils";

const badgeIcons: Record<string, React.ReactNode> = {
  Code2: <Code2 className="h-7 w-7" />,
  Zap: <Zap className="h-7 w-7" />,
  Award: <Award className="h-7 w-7" />,
  GraduationCap: <GraduationCap className="h-7 w-7" />,
};

interface BadgeCardProps {
  badge: AchievementBadge;
}

export function BadgeCard({ badge }: BadgeCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4 }}
      className={cn(
        "relative rounded-3xl p-5 border text-right flex flex-col justify-between transition-all duration-300 overflow-hidden",
        badge.unlocked
          ? "bg-white dark:bg-[#0F274D] border-slate-200/80 dark:border-white/10 shadow-sm hover:shadow-xl"
          : "bg-slate-50/50 dark:bg-white/5 border-slate-200/50 dark:border-white/5 opacity-75 grayscale"
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className={cn(
            "h-14 w-14 rounded-2xl flex items-center justify-center shadow-lg",
            badge.unlocked
              ? "bg-gradient-to-tr from-[#F58220] to-[#FF9A2A] text-white shadow-[#F58220]/25 animate-pulse"
              : "bg-slate-200 dark:bg-white/10 text-slate-400"
          )}
        >
          {badgeIcons[badge.icon] || <Award className="h-7 w-7" />}
        </div>
        <span
          className={cn(
            "text-[11px] font-extrabold px-3 py-1 rounded-full border",
            badge.unlocked
              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
              : "bg-slate-200 dark:bg-white/10 text-slate-500 border-transparent"
          )}
        >
          {badge.unlocked ? `+${badge.xpReward} XP` : "مغلق 🔒"}
        </span>
      </div>

      <div>
        <h4 className="text-sm font-extrabold text-[#0B2D5B] dark:text-white mb-1">
          {badge.title}
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
          {badge.description}
        </p>
      </div>

      <div>
        {badge.unlocked ? (
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-4 w-4" />
            <span>تم التحرير في {badge.unlockedAt}</span>
          </div>
        ) : (
          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px] font-bold text-slate-400">
              <span>نسبة الإنجاز</span>
              <span>{badge.progressPercentage}%</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-white/10 h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#F58220] h-full rounded-full"
                style={{ width: `${badge.progressPercentage}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default BadgeCard;

"use client";

import * as React from "react";
import { Award, Zap, Flame, Sparkles } from "lucide-react";
import { mockBadges, mockStudentProfile, BadgeCard, StreakCard } from "@/features/dashboard";

export default function AchievementsPage() {
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
          <StreakCard profile={mockStudentProfile} />
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
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 text-center">
              <div className="text-xl font-black text-[#F58220]">12</div>
              <div className="text-[11px] text-slate-500 font-bold">المستوى الحالي</div>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 text-center">
              <div className="text-xl font-black text-emerald-500">3,450 XP</div>
              <div className="text-[11px] text-slate-500 font-bold">إجمالي النقاط</div>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 text-center">
              <div className="text-xl font-black text-[#0B2D5B] dark:text-white">4 / 8</div>
              <div className="text-[11px] text-slate-500 font-bold">الأوسمة المحررة</div>
            </div>
          </div>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-black text-[#0B2D5B] dark:text-white">
          شبكة الأوسمة المكتسبة والمغلقة 🎖️
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {mockBadges.map((badge) => (
            <BadgeCard key={badge.id} badge={badge} />
          ))}
        </div>
      </div>
    </div>
  );
}

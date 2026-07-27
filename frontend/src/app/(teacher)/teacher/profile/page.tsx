"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { User, Award, BookOpen, Star, Settings, ExternalLink, GraduationCap } from "lucide-react";
import { mockTeacherProfile } from "@/features/teacher";

export default function TeacherProfilePage() {
  return (
    <div className="space-y-6 sm:space-y-8 text-right">
      <div className="border-b border-slate-200/80 dark:border-white/10 pb-5 sm:pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#0B2D5B] dark:text-white">
            الملف الشخصي للمحاضر 👨‍🏫
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            النبذة التعريفية، المؤهلات العلمية، والروابط العامة التي يراها الطلاب
          </p>
        </div>

        <Link
          href="/teacher/settings"
          className="h-9 sm:h-10 px-3 sm:px-4 rounded-xl bg-[#0B2D5B] dark:bg-[#1E73D8] text-white text-xs font-bold hover:bg-[#F58220] transition-colors flex items-center gap-2 shrink-0 whitespace-nowrap self-start sm:self-auto"
        >
          <Settings className="h-4 w-4" />
          <span>تعديل السيرة الذاتية</span>
        </Link>
      </div>

      <div className="rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#0F274D] border border-slate-200/80 dark:border-white/10 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="relative h-32 w-32 rounded-3xl overflow-hidden border-4 border-[#0B2D5B] shadow-xl shrink-0">
            <Image src={mockTeacherProfile.avatar} alt={mockTeacherProfile.name} fill className="object-cover" />
          </div>

          <div className="space-y-2 text-center sm:text-right flex-1">
            <h2 className="text-2xl font-extrabold text-[#0B2D5B] dark:text-white">
              {mockTeacherProfile.name}
            </h2>
            <p className="text-xs font-bold text-[#F58220]">{mockTeacherProfile.title}</p>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
              {mockTeacherProfile.bio}
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-2 text-xs font-bold">
              {mockTeacherProfile.subjects.map((sub) => (
                <span key={sub} className="bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-200 px-3 py-1 rounded-full">
                  {sub}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Qualifications */}
        <div className="pt-4 border-t border-slate-100 dark:border-white/10 space-y-3">
          <h3 className="text-sm font-extrabold text-[#0B2D5B] dark:text-white flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-[#F58220]" />
            <span>المؤهلات والشهادات الأكاديمية</span>
          </h3>
          <div className="space-y-2">
            {mockTeacherProfile.qualifications.map((q, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 text-xs font-semibold text-slate-700 dark:text-slate-200">
                • {q}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

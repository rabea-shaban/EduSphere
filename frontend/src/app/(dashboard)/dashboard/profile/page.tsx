"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { User, Mail, Phone, MapPin, GraduationCap, Settings, BookOpen, Flame, Award } from "lucide-react";
import { mockStudentProfile } from "@/features/dashboard";

export default function ProfilePage() {
  return (
    <div className="space-y-8 text-right">
      <div className="border-b border-slate-200/80 dark:border-white/10 pb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0B2D5B] dark:text-white">
            الملف الشخصي للطالب 👤
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            بياناتك الأكاديمية والنظام التعليمي المسجل في منصة EduSphere
          </p>
        </div>

        <Link
          href="/dashboard/settings"
          className="px-4 py-2 rounded-xl bg-[#0B2D5B] dark:bg-[#1E73D8] text-white text-xs font-bold hover:bg-[#F58220] transition-colors flex items-center gap-2"
        >
          <Settings className="h-4 w-4" />
          <span>تعديل الملف والإعدادات</span>
        </Link>
      </div>

      {/* Profile Card */}
      <div className="rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#0F274D] border border-slate-200/80 dark:border-white/10 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="relative h-28 w-28 rounded-3xl overflow-hidden border-4 border-[#0B2D5B] shadow-xl shrink-0">
            <Image src={mockStudentProfile.avatar} alt={mockStudentProfile.name} fill className="object-cover" />
          </div>

          <div className="space-y-2 text-center sm:text-right flex-1">
            <h2 className="text-2xl font-extrabold text-[#0B2D5B] dark:text-white">
              {mockStudentProfile.name}
            </h2>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs font-bold">
              <span className="bg-[#F58220]/15 text-[#F58220] px-3 py-1 rounded-full border border-[#F58220]/30">
                {mockStudentProfile.stage}
              </span>
              <span className="bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-200 px-3 py-1 rounded-full">
                {mockStudentProfile.system}
              </span>
              <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full">
                {mockStudentProfile.stream}
              </span>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-slate-100 dark:border-white/10 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 space-y-1">
            <span className="text-slate-400 font-bold block">البريد الإلكتروني:</span>
            <span className="font-extrabold text-[#0B2D5B] dark:text-white">rabie.student@edusphere.edu.eg</span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 space-y-1">
            <span className="text-slate-400 font-bold block">رقم الهاتف (مصري):</span>
            <span className="font-extrabold text-[#0B2D5B] dark:text-white">01012345678</span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 space-y-1">
            <span className="text-slate-400 font-bold block">المحافظة / المدينة:</span>
            <span className="font-extrabold text-[#0B2D5B] dark:text-white">القاهرة، مصر</span>
          </div>
        </div>
      </div>
    </div>
  );
}

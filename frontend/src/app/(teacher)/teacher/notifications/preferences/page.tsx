"use client";

import * as React from "react";
import { Settings, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import { NotificationPreferencesForm } from "@/features/teacher/components/notifications/notification-preferences-form";

export default function InstructorNotificationPreferencesPage() {
  return (
    <div className="space-y-6 text-right dir-rtl max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-2xl bg-indigo-500/10 text-indigo-500">
              <Sparkles className="h-5 w-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#0B2D5B] dark:text-white">
              إعدادات وتفضيلات الإشعارات
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            تخصيص القنوات المسموحة، كتم وإظهار فئات التنبيهات، والتحكم بوارد الرسائل
          </p>
        </div>

        <Link
          href="/teacher/notifications"
          className="h-10 px-4 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 hover:bg-slate-200 transition-colors cursor-pointer"
        >
          <ArrowRight className="h-4 w-4" />
          <span>العودة لمركز التنبيهات</span>
        </Link>
      </div>

      {/* Preferences Form */}
      <NotificationPreferencesForm />
    </div>
  );
}

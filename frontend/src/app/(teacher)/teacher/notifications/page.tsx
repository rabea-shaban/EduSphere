"use client";

import * as React from "react";
import { Bell, ShoppingBag, FileCheck2, Star } from "lucide-react";
import { mockTeacherNotifications } from "@/features/teacher";

export default function InstructorNotificationsPage() {
  return (
    <div className="space-y-5 sm:space-y-6 text-right">
      <div className="border-b border-slate-200/80 dark:border-white/10 pb-5 sm:pb-6">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#0B2D5B] dark:text-white">
          إشعارات وتنبيهات المعلم 🔔
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          تنبيهات فورية عند شراء الكورسات، تسليم الواجبات، والتقييمات الجديدة
        </p>
      </div>

      <div className="space-y-2.5 sm:space-y-3">
        {mockTeacherNotifications.map((n) => (
          <div
            key={n.id}
            className={`p-3.5 sm:p-5 rounded-2xl border flex items-start gap-3 sm:gap-4 ${
              n.read
                ? "bg-white dark:bg-[#0F274D] border-slate-200/60 dark:border-white/10"
                : "bg-orange-50/50 dark:bg-[#0F274D] border-[#F58220]/30 shadow-sm"
            }`}
          >
            <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-[#F58220]/15 text-[#F58220] flex items-center justify-center shrink-0">
              <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div className="space-y-0.5 sm:space-y-1 min-w-0 flex-1">
              <div className="text-xs font-extrabold text-[#0B2D5B] dark:text-white">{n.title}</div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{n.message}</p>
              <div className="text-[10px] text-slate-400 font-semibold pt-1">{n.timestamp}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

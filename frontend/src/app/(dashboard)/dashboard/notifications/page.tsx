"use client";

import * as React from "react";
import { Bell, CheckCircle2, BookOpen, Award, HelpCircle } from "lucide-react";
import { mockNotifications, NotificationItem } from "@/features/dashboard";

export default function NotificationsPage() {
  const [notifs, setNotifs] = React.useState<NotificationItem[]>(mockNotifications);

  const markAllRead = () => {
    setNotifs(notifs.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="space-y-6 text-right">
      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-white/10 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0B2D5B] dark:text-white">
            مركز الإشعارات والتنبيهات 🔔
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            تابع مواعيد الاختبارات، تحديثات الدروس، ومكافآت التتابع أولاً بأول
          </p>
        </div>

        <button
          type="button"
          onClick={markAllRead}
          className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-white/10 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-[#F58220] transition-colors"
        >
          تحديد الكل كـ مقروء
        </button>
      </div>

      <div className="space-y-3">
        {notifs.map((n) => (
          <div
            key={n.id}
            className={`p-5 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
              n.read
                ? "bg-white dark:bg-[#0F274D] border-slate-200/60 dark:border-white/10"
                : "bg-orange-50/50 dark:bg-[#0F274D] border-[#F58220]/30 shadow-sm"
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-xl bg-[#F58220]/15 text-[#F58220] flex items-center justify-center shrink-0">
                <Bell className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-extrabold text-[#0B2D5B] dark:text-white">{n.title}</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{n.message}</p>
                <div className="text-[10px] text-slate-400 font-semibold pt-1">{n.timestamp}</div>
              </div>
            </div>

            {!n.read && (
              <span className="h-3 w-3 rounded-full bg-[#F58220] shrink-0 animate-ping" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

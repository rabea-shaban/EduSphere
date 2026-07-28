"use client";

import * as React from "react";
import { Bell } from "lucide-react";
import { useUnreadNotificationsCount } from "@/hooks/useTeacherNotifications";

interface NotificationBadgeProps {
  onClick?: () => void;
}

export function NotificationBadge({ onClick }: NotificationBadgeProps) {
  const unreadCount = useUnreadNotificationsCount();

  return (
    <button
      type="button"
      onClick={onClick}
      className="relative p-2.5 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F274D] text-slate-600 dark:text-slate-200 hover:border-[#F58220] transition-colors cursor-pointer"
      title="مركز الإشعارات والتنبيهات"
      aria-label="الإشعارات"
    >
      <Bell className="h-5 w-5" />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 h-5 min-w-[20px] px-1 rounded-full bg-[#F58220] text-white text-[10px] font-black flex items-center justify-center animate-pulse border-2 border-white dark:border-[#0F274D]">
          {unreadCount > 99 ? "+99" : unreadCount}
        </span>
      )}
    </button>
  );
}

export default NotificationBadge;

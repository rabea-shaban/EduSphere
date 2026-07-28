"use client";

import * as React from "react";
import {
  BookOpen,
  FileCheck2,
  Award,
  Star,
  DollarSign,
  Bell,
  CheckCircle2,
  Trash2,
  Circle,
} from "lucide-react";
import { useMarkNotificationAsRead, useDeleteNotification } from "@/hooks/useTeacherNotifications";
import type { TeacherNotificationItem } from "@/features/teacher/types/notification";

interface NotificationCardProps {
  notification: TeacherNotificationItem;
  onSelect?: (notification: TeacherNotificationItem) => void;
}

export function NotificationCard({ notification, onSelect }: NotificationCardProps) {
  const markAsRead = useMarkNotificationAsRead();
  const deleteNotification = useDeleteNotification();

  const getIcon = (type: string) => {
    switch (type) {
      case "Course":
      case "Lesson":
        return <BookOpen className="h-4 w-4 text-indigo-500" />;
      case "Assignment":
        return <FileCheck2 className="h-4 w-4 text-blue-500" />;
      case "Quiz":
      case "Exam":
        return <Award className="h-4 w-4 text-amber-500" />;
      case "Payment":
        return <DollarSign className="h-4 w-4 text-emerald-500" />;
      default:
        return <Bell className="h-4 w-4 text-[#F58220]" />;
    }
  };

  const handleReadToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!notification.isRead) {
      markAsRead.mutate(notification._id);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteNotification.mutate(notification._id);
  };

  return (
    <div
      onClick={() => {
        if (!notification.isRead) markAsRead.mutate(notification._id);
        onSelect?.(notification);
      }}
      className={`p-4 rounded-2xl border transition-all cursor-pointer text-right dir-rtl ${
        notification.isRead
          ? "bg-white dark:bg-[#0F274D] border-slate-200/80 dark:border-white/10 opacity-80"
          : "bg-indigo-50/40 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-800/40 shadow-sm"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="p-2.5 rounded-xl bg-slate-100 dark:bg-white/10 shrink-0">
            {getIcon(notification.type)}
          </span>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-black text-[#0B2D5B] dark:text-white">
                {notification.title}
              </h4>
              {!notification.isRead && (
                <span className="h-2 w-2 rounded-full bg-[#F58220] animate-pulse" />
              )}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {notification.message}
            </p>
            <span className="text-[10px] text-slate-400 font-semibold block pt-1">
              {new Date(notification.createdAt).toLocaleString("ar-EG")}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {!notification.isRead && (
            <button
              type="button"
              onClick={handleReadToggle}
              className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-white/10 text-slate-400 hover:text-emerald-600 transition-colors"
              title="تحديد كمقروء"
            >
              <CheckCircle2 className="h-4 w-4" />
            </button>
          )}

          <button
            type="button"
            onClick={handleDelete}
            className="p-1.5 rounded-lg hover:bg-rose-100 text-slate-400 hover:text-rose-600 transition-colors"
            title="حذف الإشعار"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default NotificationCard;

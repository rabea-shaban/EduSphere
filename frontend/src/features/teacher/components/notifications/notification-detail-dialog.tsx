"use client";

import * as React from "react";
import {
  X,
  Bell,
  BookOpen,
  FileCheck2,
  Award,
  DollarSign,
  CheckCircle2,
  Trash2,
  Clock,
} from "lucide-react";
import {
  useMarkNotificationAsRead,
  useMarkNotificationAsUnread,
  useDeleteNotification,
} from "@/hooks/useTeacherNotifications";
import type { TeacherNotificationItem } from "@/features/teacher/types/notification";

interface NotificationDetailDialogProps {
  notification: TeacherNotificationItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationDetailDialog({
  notification,
  isOpen,
  onClose,
}: NotificationDetailDialogProps) {
  const markAsRead = useMarkNotificationAsRead();
  const markAsUnread = useMarkNotificationAsUnread();
  const deleteNotification = useDeleteNotification();

  if (!isOpen || !notification) return null;

  const getIcon = (type?: string) => {
    switch (type) {
      case "Course":
      case "Lesson":
        return <BookOpen className="h-5 w-5 text-indigo-500" />;
      case "Assignment":
        return <FileCheck2 className="h-5 w-5 text-blue-500" />;
      case "Quiz":
      case "Exam":
        return <Award className="h-5 w-5 text-amber-500" />;
      case "Payment":
        return <DollarSign className="h-5 w-5 text-emerald-500" />;
      default:
        return <Bell className="h-5 w-5 text-[#F58220]" />;
    }
  };

  const handleToggleRead = () => {
    if (notification.isRead) {
      markAsUnread.mutate(notification._id);
    } else {
      markAsRead.mutate(notification._id);
    }
  };

  const handleDelete = () => {
    deleteNotification.mutate(notification._id);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg bg-white dark:bg-[#0F274D] rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 p-6 space-y-5 text-right dir-rtl">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-slate-100 dark:border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <span className="p-3 rounded-2xl bg-slate-100 dark:bg-white/10 shrink-0">
              {getIcon(notification.type)}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-[#0B2D5B] dark:text-white">
                  {notification.title}
                </h3>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    notification.isRead
                      ? "bg-slate-100 dark:bg-white/10 text-slate-500"
                      : "bg-[#F58220]/10 text-[#F58220]"
                  }`}
                >
                  {notification.isRead ? "مقروء" : "جديد / غير مقروء"}
                </span>
              </div>
              <span className="flex items-center gap-1 text-[11px] text-slate-400 font-semibold mt-1">
                <Clock className="h-3 w-3" />
                {new Date(notification.createdAt).toLocaleString("ar-EG")}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 transition-colors cursor-pointer"
            aria-label="إغلاق"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed min-h-[100px] whitespace-pre-wrap">
          {notification.message}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-white/10 flex-wrap">
          <button
            type="button"
            onClick={handleDelete}
            className="h-10 px-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800/30 text-xs font-bold flex items-center gap-1.5 hover:bg-rose-100 transition-colors cursor-pointer"
          >
            <Trash2 className="h-4 w-4" />
            <span>حذف الإشعار</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleToggleRead}
              className="h-10 px-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/30 text-xs font-bold flex items-center gap-1.5 hover:bg-indigo-100 transition-colors cursor-pointer"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>
                {notification.isRead ? "تحديد كغير مقروء" : "تحديد كمقروء"}
              </span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="h-10 px-4 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-200 transition-colors cursor-pointer"
            >
              إغلاق
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotificationDetailDialog;

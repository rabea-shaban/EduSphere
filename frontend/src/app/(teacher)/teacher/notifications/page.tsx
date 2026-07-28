"use client";

import * as React from "react";
import {
  Bell,
  Sparkles,
  CheckCircle2,
  Trash2,
  RefreshCw,
  Settings,
  Search,
  Filter,
} from "lucide-react";
import Link from "next/link";
import {
  useTeacherNotifications,
  useMarkAllNotificationsAsRead,
  useBulkDeleteNotifications,
  useNotificationAnalytics,
} from "@/hooks/useTeacherNotifications";
import type { NotificationFilters } from "@/features/teacher/types/notification";
import { NotificationCard } from "@/features/teacher/components/notifications/notification-card";
import { NotificationAnalyticsWidget } from "@/features/teacher/components/notifications/notification-analytics-widget";
import { NotificationSkeleton } from "@/features/teacher/components/notifications/notification-skeleton";
import { NotificationEmptyState } from "@/features/teacher/components/notifications/notification-empty-state";

import { NotificationDetailDialog } from "@/features/teacher/components/notifications/notification-detail-dialog";
import type { TeacherNotificationItem } from "@/features/teacher/types/notification";

export default function InstructorNotificationsPage() {
  const [search, setSearch] = React.useState("");
  const [isReadFilter, setIsReadFilter] = React.useState<string>("ALL");
  const [typeFilter, setTypeFilter] = React.useState<string>("ALL");
  const [selectedNotif, setSelectedNotif] = React.useState<TeacherNotificationItem | null>(null);

  const filters: NotificationFilters = {
    ...(search ? { search } : {}),
    ...(isReadFilter === "UNREAD" ? { isRead: false } : isReadFilter === "READ" ? { isRead: true } : {}),
    ...(typeFilter !== "ALL" ? { type: typeFilter as any } : {}),
    limit: 50,
  };

  const { data: analytics } = useNotificationAnalytics();
  const { data: notificationsData, isLoading, refetch } = useTeacherNotifications(filters);
  const markAllAsRead = useMarkAllNotificationsAsRead();
  const bulkDelete = useBulkDeleteNotifications();

  const notifications = notificationsData?.notifications || [];
  const unreadCount = notificationsData?.unreadCount || 0;
  const total = notificationsData?.pagination?.total || 0;

  return (
    <div className="space-y-6 text-right dir-rtl max-w-6xl mx-auto pb-12">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-2xl bg-indigo-500/10 text-indigo-500">
              <Sparkles className="h-5 w-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#0B2D5B] dark:text-white">
              مركز التنبيهات والإشعارات الفورية
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            متابعة إشعارات الكورسات، تسليمات الواجبات، الاختبارات، التقييمات، والتدفقات المالية
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={() => refetch()}
            className="p-3 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F274D] text-slate-600 dark:text-slate-200 hover:border-[#F58220] transition-colors cursor-pointer"
            title="تحديث البيانات"
            aria-label="تحديث"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </button>

          {unreadCount > 0 && (
            <button
              type="button"
              onClick={() => markAllAsRead.mutate()}
              disabled={markAllAsRead.isPending}
              className="h-11 px-4 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-black flex items-center gap-1.5 hover:bg-emerald-500/20 transition-colors cursor-pointer"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>تحديد الكل كمقروء ({unreadCount})</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => bulkDelete.mutate({ clearReadOnly: true })}
            disabled={bulkDelete.isPending}
            className="h-11 px-4 rounded-2xl bg-rose-500/10 text-rose-600 border border-rose-500/20 text-xs font-bold flex items-center gap-1.5 hover:bg-rose-500/20 transition-colors cursor-pointer"
            title="مسح الإشعارات المقروءة"
          >
            <Trash2 className="h-4 w-4" />
            <span>مسح المقروء</span>
          </button>

          <Link
            href="/teacher/notifications/preferences"
            className="h-11 px-4 rounded-2xl bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-200 text-xs font-black flex items-center gap-1.5 hover:bg-slate-200 transition-colors cursor-pointer whitespace-nowrap"
          >
            <Settings className="h-4 w-4" />
            <span>إعدادات التنبيهات</span>
          </Link>
        </div>
      </div>

      {/* Analytics Widget */}
      {analytics && <NotificationAnalyticsWidget analytics={analytics} />}

      {/* Filter Bar & Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white dark:bg-[#0F274D] p-3.5 rounded-2xl border border-slate-200/80 dark:border-white/10">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-60">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="بحث في عنوان الإشعار أو الرسالة..."
              className="w-full h-9 pr-9 pl-3 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 outline-none focus:border-[#F58220]"
            />
            <Search className="absolute right-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto text-xs font-bold w-full sm:w-auto">
          <select
            value={isReadFilter}
            onChange={(e) => setIsReadFilter(e.target.value)}
            className="h-9 px-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold outline-none cursor-pointer"
          >
            <option value="ALL">جميع الإشعارات</option>
            <option value="UNREAD">غير مقروءة فقط</option>
            <option value="READ">مقروءة فقط</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="h-9 px-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold outline-none cursor-pointer"
          >
            <option value="ALL">جميع الفئات</option>
            <option value="Course">الكورسات</option>
            <option value="Assignment">الواجبات</option>
            <option value="Quiz">الاختبارات</option>
            <option value="Payment">المالية</option>
            <option value="System">النظام</option>
          </select>
        </div>
      </div>

      {/* Notifications List */}
      {isLoading ? (
        <NotificationSkeleton />
      ) : notifications.length === 0 ? (
        <NotificationEmptyState />
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <NotificationCard key={n._id} notification={n} onSelect={setSelectedNotif} />
          ))}
        </div>
      )}

      {/* Notification Detail Dialog */}
      <NotificationDetailDialog
        notification={selectedNotif}
        isOpen={!!selectedNotif}
        onClose={() => setSelectedNotif(null)}
      />
    </div>
  );
}

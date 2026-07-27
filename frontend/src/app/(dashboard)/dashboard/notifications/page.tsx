"use client";

import * as React from "react";
import {
  Bell,
  BookOpen,
  HelpCircle,
  FileText,
  Award,
  GraduationCap,
  CreditCard,
  Megaphone,
  Trash2,
  CheckCheck,
  Search,
  CheckCircle2,
  Clock,
  Sparkles,
} from "lucide-react";
import { useStudent } from "@/hooks/useStudent";
import { ApiNotification } from "@/features/dashboard/types/api";

function formatRelativeTime(dateString?: string): string {
  if (!dateString) return "الآن";
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "الآن";
  if (diffInSeconds < 3600) {
    const mins = Math.floor(diffInSeconds / 60);
    return `منذ ${mins} ${mins === 1 ? "دقيقة" : mins === 2 ? "دقيقتين" : "دقائق"}`;
  }
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `منذ ${hours} ${hours === 1 ? "ساعة" : hours === 2 ? "ساعتين" : "ساعات"}`;
  }
  const days = Math.floor(diffInSeconds / 86400);
  return `منذ ${days} ${days === 1 ? "يوم" : days === 2 ? "يومين" : "أيام"}`;
}

function getNotificationIcon(type?: string) {
  const t = (type || "").toLowerCase();
  if (t.includes("course") || t.includes("lesson")) return <BookOpen className="h-5 w-5 text-blue-500" />;
  if (t.includes("quiz") || t.includes("exam")) return <HelpCircle className="h-5 w-5 text-[#F58220]" />;
  if (t.includes("assignment")) return <FileText className="h-5 w-5 text-purple-500" />;
  if (t.includes("certificate") || t.includes("achievement")) return <Award className="h-5 w-5 text-amber-500" />;
  if (t.includes("payment")) return <CreditCard className="h-5 w-5 text-emerald-500" />;
  if (t.includes("announcement")) return <Megaphone className="h-5 w-5 text-indigo-500" />;
  return <Bell className="h-5 w-5 text-[#F58220]" />;
}

export default function NotificationsPage() {
  const [filterTab, setFilterTab] = React.useState<"all" | "unread" | "courses" | "quizzes" | "assignments" | "announcements">("all");
  const [searchQuery, setSearchQuery] = React.useState("");

  const {
    useNotifications,
    unreadNotificationsCount,
    markNotificationRead,
    markAllNotificationsRead,
    deleteNotification,
    isDeletingNotification,
  } = useStudent();

  const isReadParam = filterTab === "unread" ? false : undefined;
  const typeParam =
    filterTab === "courses"
      ? "Course"
      : filterTab === "quizzes"
      ? "Quiz"
      : filterTab === "assignments"
      ? "Assignment"
      : filterTab === "announcements"
      ? "Announcement"
      : undefined;

  const { data: notificationsData, isLoading } = useNotifications({
    isRead: isReadParam,
    type: typeParam,
    search: searchQuery || undefined,
  });

  const apiNotifications: ApiNotification[] = notificationsData?.notifications || [];

  const handleMarkAllRead = async () => {
    await markAllNotificationsRead();
  };

  const handleNotificationClick = async (id: string, isRead: boolean) => {
    if (!isRead) {
      await markNotificationRead(id);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    await deleteNotification(id);
  };

  return (
    <div className="space-y-6 text-right">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black text-[#0B2D5B] dark:text-white">
              مركز الإشعارات والتنبيهات 🔔
            </h1>
            {(unreadNotificationsCount ?? 0) > 0 && (
              <span className="bg-[#F58220] text-white text-xs font-extrabold px-2.5 py-0.5 rounded-full animate-pulse">
                {unreadNotificationsCount} غير مقروء
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            تابع مواعيد الاختبارات، تحديثات الدروس، والواجبات المدرسية أولاً بأول
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {apiNotifications.length > 0 && (
            <button
              type="button"
              onClick={handleMarkAllRead}
              className="px-4 py-2 rounded-xl bg-[#0B2D5B] dark:bg-[#1E73D8] text-white text-xs font-bold hover:bg-[#F58220] transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <CheckCheck className="h-4 w-4" />
              <span>تحديد الكل كـ مقروء</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {[
            { id: "all", label: "الكل" },
            { id: "unread", label: "غير مقروءة ⚡" },
            { id: "courses", label: "الكورسات 📚" },
            { id: "quizzes", label: "الاختبارات 📝" },
            { id: "assignments", label: "الواجبات 📋" },
            { id: "announcements", label: "الإعلانات 📢" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterTab(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
                filterTab === tab.id
                  ? "bg-[#0B2D5B] dark:bg-[#1E73D8] text-white shadow-md"
                  : "bg-white dark:bg-[#0F274D] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:bg-slate-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64 shrink-0">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="البحث في الإشعارات..."
            className="w-full h-10 pr-9 pl-4 rounded-xl text-xs font-semibold bg-white dark:bg-[#0F274D] border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white outline-none focus:border-[#F58220]"
          />
          <Search className="absolute right-3 top-3 h-4 w-4 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* Notifications Content */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-20 rounded-2xl bg-slate-200 dark:bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : apiNotifications.length > 0 ? (
        <div className="space-y-3">
          {apiNotifications.map((n) => (
            <div
              key={n._id}
              onClick={() => handleNotificationClick(n._id, n.isRead)}
              className={`group p-4 sm:p-5 rounded-2xl border transition-all flex items-start justify-between gap-4 cursor-pointer ${
                n.isRead
                  ? "bg-white dark:bg-[#0F274D] border-slate-200/60 dark:border-white/10 opacity-90"
                  : "bg-orange-50/60 dark:bg-[#0F274D] border-[#F58220]/40 shadow-sm"
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="h-11 w-11 rounded-2xl bg-slate-100 dark:bg-white/10 flex items-center justify-center shrink-0 shadow-sm">
                  {getNotificationIcon(n.type)}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-extrabold text-[#0B2D5B] dark:text-white">
                      {n.title}
                    </h4>
                    {!n.isRead && (
                      <span className="h-2 w-2 rounded-full bg-[#F58220] shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {n.message}
                  </p>
                  <div className="flex items-center gap-3 text-[10px] text-slate-400 font-semibold pt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{formatRelativeTime(n.createdAt)}</span>
                    </span>
                    {n.priority && (
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/10 text-slate-500">
                        الأولوية: {n.priority === "High" ? "عالية 🔥" : n.priority === "Medium" ? "متوسطة" : "عادية"}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {!n.isRead && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNotificationClick(n._id, false);
                    }}
                    className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 hover:text-emerald-600 transition-colors"
                    title="تحديد كـ مقروء"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                  </button>
                )}
                <button
                  type="button"
                  disabled={isDeletingNotification}
                  onClick={(e) => handleDelete(e, n._id)}
                  className="p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/40 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                  title="حذف الإشعار"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-[#0F274D] rounded-3xl border border-slate-200 dark:border-white/10 p-8 space-y-3">
          <Bell className="h-12 w-12 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-700 dark:text-slate-200">لا توجد إشعارات مطابقة للفلتر</h3>
          <p className="text-xs text-slate-500">ستظهر هنا التنبيهات الخاصة بالكورسات والاختبارات والواجبات الجديدة</p>
        </div>
      )}
    </div>
  );
}

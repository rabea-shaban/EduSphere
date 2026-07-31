"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Search,
  Bell,
  Menu,
  Send,
  ShieldCheck,
  User,
  Settings,
  LogOut,
  ChevronDown,
  CheckCheck,
  BellOff,
  GraduationCap,
} from "lucide-react";
import { ThemeToggle } from "@/components/common";
import { useAuthContext } from "@/providers/auth-provider";
import { useNotifications } from "@/hooks/useNotifications";
import { cn } from "@/lib/utils";

interface AdminTopbarProps {
  onMenuClick?: () => void;
}

export function AdminTopbar({ onMenuClick }: AdminTopbarProps) {
  const router = useRouter();
  const { user, logout } = useAuthContext();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  const [showNotifPopover, setShowNotifPopover] = React.useState(false);
  const [showUserMenu, setShowUserMenu] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  // Dynamic user details
  const adminDisplayName = user
    ? user.fullName || `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.username || user.email
    : "المشرف العام";

  const adminRoleLabel =
    user?.role === "SUPER_ADMIN"
      ? "مسؤول النظام الرئيسي"
      : user?.role === "ADMIN"
      ? "مدير المنصة"
      : "مشرف النظام";

  const userInitial = adminDisplayName.charAt(0).toUpperCase();

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      router.push("/admin/login");
    }
  };

  const handleNotifClick = async (notif: any) => {
    const notifId = notif._id || notif.id;
    if (notifId && !notif.isRead) {
      try {
        await markAsRead(notifId);
      } catch {
        // Handled silently
      }
    }
    setShowNotifPopover(false);

    // Dynamic Navigation
    const title = (notif.title || "").toLowerCase();
    const message = (notif.message || "").toLowerCase();

    if (title.includes("مدرس") || message.includes("معلم") || title.includes("طلب")) {
      router.push("/admin/teacher-applications");
    } else if (title.includes("كورس") || message.includes("دورة")) {
      router.push("/admin/courses");
    } else if (title.includes("دفع") || title.includes("اشتراك") || message.includes("مبلغ")) {
      router.push("/admin/payments");
    } else if (title.includes("طالب")) {
      router.push("/admin/students");
    } else {
      router.push("/admin/notifications");
    }
  };

  return (
    <header className="sticky top-0 z-30 w-full h-16 sm:h-20 bg-white/80 dark:bg-[#071C3B]/80 backdrop-blur-xl border-b border-slate-200/80 dark:border-white/10 px-4 sm:px-8 flex items-center justify-between transition-colors text-right select-none">
      {/* Mobile Drawer Trigger & Global Search */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="lg:hidden h-10 w-10 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-200 flex items-center justify-center focus:outline-none cursor-pointer"
          aria-label="افتح القائمة"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Global Search Bar */}
        <div className="relative hidden md:block w-72 lg:w-96">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث شامل في المستندات، المعلمين، أو المدفوعات..."
            className="w-full h-11 pr-10 pl-4 rounded-xl text-xs font-semibold bg-slate-100/80 dark:bg-[#0F274D] border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-[#0B2D5B] dark:focus:border-[#F58220] transition-colors"
          />
          <Search className="absolute right-3 top-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* Right control cluster */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Broadcast Notification CTA */}
        <Link
          href="/admin/notifications"
          className="hidden sm:flex items-center gap-2 h-10 px-4 rounded-xl bg-gradient-to-r from-[#F58220] to-[#FF9A2A] text-white text-xs font-bold shadow-md shadow-[#F58220]/20 hover:shadow-lg hover:-translate-y-0.5 transition-all"
        >
          <Send className="h-4 w-4" />
          <span>إرسال إشعار عام</span>
        </Link>

        {/* Dynamic Admin Role Badge */}
        <div className="hidden sm:flex items-center gap-1.5 bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 px-3 py-1.5 rounded-full text-xs font-black">
          <ShieldCheck className="h-4 w-4" />
          <span>{adminRoleLabel}</span>
        </div>

        {/* Theme switcher */}
        <ThemeToggle />

        {/* Notifications Popover */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowNotifPopover((prev) => !prev);
              setShowUserMenu(false);
            }}
            className="relative h-10 w-10 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-200 hover:text-[#F58220] flex items-center justify-center transition-colors cursor-pointer"
            aria-label="إشعارات Admin"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-[#F58220] text-white text-[10px] font-black flex items-center justify-center border-2 border-white dark:border-[#071C3B]">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifPopover && (
            <div className="absolute left-0 mt-3 w-80 sm:w-96 rounded-2xl bg-white dark:bg-[#0F274D] border border-slate-200 dark:border-white/10 shadow-2xl p-4 space-y-3 z-50 animate-fadeIn text-right dir-rtl">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-2">
                <span className="text-xs font-extrabold text-[#0B2D5B] dark:text-white flex items-center gap-1.5">
                  <span>إشعارات مسؤول المنصة</span>
                  {unreadCount > 0 && (
                    <span className="bg-[#F58220] text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                      {unreadCount} غير مقروء
                    </span>
                  )}
                </span>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={() => markAllAsRead()}
                      className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <CheckCheck className="h-3.5 w-3.5" />
                      <span>قراءة الكل</span>
                    </button>
                  )}
                  <Link
                    href="/admin/notifications"
                    onClick={() => setShowNotifPopover(false)}
                    className="text-[11px] font-bold text-[#F58220] hover:underline"
                  >
                    عرض الكل
                  </Link>
                </div>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="py-6 text-center space-y-1.5 text-slate-400">
                    <BellOff className="h-7 w-7 mx-auto opacity-50 text-slate-300" />
                    <p className="text-xs font-bold">لا توجد إشعارات جديدة حالياً ✨</p>
                  </div>
                ) : (
                  notifications.map((notif: any) => (
                    <div
                      key={notif._id || notif.id}
                      onClick={() => handleNotifClick(notif)}
                      className={cn(
                        "p-3 rounded-xl border text-right space-y-1 transition-all cursor-pointer hover:scale-[1.01]",
                        !notif.isRead
                          ? "bg-amber-500/10 border-amber-500/20 font-bold"
                          : "bg-slate-50 dark:bg-white/5 border-slate-100 dark:border-white/5 opacity-80"
                      )}
                    >
                      <div className="flex justify-between items-center text-xs text-[#0B2D5B] dark:text-white">
                        <span className="font-extrabold truncate">{notif.title}</span>
                        <span className="text-[10px] font-normal text-slate-400 shrink-0">
                          {notif.createdAt ? new Date(notif.createdAt).toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" }) : ""}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-300 line-clamp-2">{notif.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Dynamic Admin Avatar Menu */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowUserMenu((prev) => !prev);
              setShowNotifPopover(false);
            }}
            className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1 rounded-xl bg-slate-100/80 dark:bg-white/10 hover:bg-slate-200 transition-colors border border-slate-200 dark:border-white/10 cursor-pointer"
          >
            {user?.avatar ? (
              <Image
                src={user.avatar}
                alt={adminDisplayName}
                width={32}
                height={32}
                className="h-8 w-8 rounded-lg object-cover border border-slate-300 dark:border-white/20"
              />
            ) : (
              <div className="h-8 w-8 rounded-lg border border-slate-300 dark:border-white/20 bg-[#0B2D5B] text-white flex items-center justify-center font-black text-xs">
                {userInitial}
              </div>
            )}
            <span className="hidden sm:inline text-xs font-extrabold text-[#0B2D5B] dark:text-white max-w-[120px] truncate">
              {adminDisplayName}
            </span>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400 hidden sm:inline" />
          </button>

          {/* User quick menu */}
          {showUserMenu && (
            <div className="absolute left-0 mt-3 w-60 rounded-2xl bg-white dark:bg-[#0F274D] border border-slate-200 dark:border-white/10 shadow-2xl p-2 space-y-1 z-50 animate-fadeIn">
              <div className="p-3 border-b border-slate-100 dark:border-white/10 mb-1 space-y-0.5">
                <div className="text-xs font-extrabold text-[#0B2D5B] dark:text-white truncate">{adminDisplayName}</div>
                <div className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold">{adminRoleLabel}</div>
                {user?.email && <div className="text-[10px] text-slate-400 truncate">{user.email}</div>}
              </div>

              <Link
                href="/admin/profile"
                onClick={() => setShowUserMenu(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
              >
                <User className="h-4 w-4 text-[#F58220]" />
                <span>تعديل الملف الشخصي</span>
              </Link>

              <Link
                href="/admin/settings"
                onClick={() => setShowUserMenu(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
              >
                <Settings className="h-4 w-4 text-[#0B2D5B] dark:text-slate-300" />
                <span>إعدادات المنصة الشاملة</span>
              </Link>

              <Link
                href="/teacher/dashboard"
                onClick={() => setShowUserMenu(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-[#F58220] hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
              >
                <GraduationCap className="h-4 w-4 text-[#F58220]" />
                <span>معاينة لوحة تحكم المعلم</span>
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="w-full text-right flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                <span>تسجيل الخروج</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default AdminTopbar;

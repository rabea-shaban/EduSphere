"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Bell,
  Menu,
  Flame,
  User,
  Settings,
  LogOut,
  ChevronDown,
  CheckCheck,
} from "lucide-react";
import { ThemeToggle } from "@/components/common";
import { cn } from "@/lib/utils";
import { useAuthContext } from "@/providers/auth-provider";
import { useNotifications } from "@/hooks/useNotifications";

interface TopbarProps {
  onMenuClick?: () => void;
}

export function Topbar({ onMenuClick }: TopbarProps) {
  const router = useRouter();
  const [showSearchModal, setShowSearchModal] = React.useState(false);
  const [showNotifPopover, setShowNotifPopover] = React.useState(false);
  const [showUserMenu, setShowUserMenu] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const { user, logout } = useAuthContext();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  const displayName = (user?.firstName || user?.lastName)
    ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
    : (user?.fullName || user?.username || "طالب EduSphere");
  const avatarSrc = user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${displayName}`;
  const avatarInitial = displayName.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-30 w-full h-16 sm:h-20 bg-white/80 dark:bg-[#071C3B]/80 backdrop-blur-xl border-b border-slate-200/80 dark:border-white/10 px-4 sm:px-8 flex items-center justify-between transition-colors text-right select-none">
      {/* Mobile Drawer Trigger & Search input trigger */}
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
            placeholder="ابحث عن كورس، درس، معلم، أو مادة..."
            className="w-full h-11 pr-10 pl-4 rounded-xl text-xs font-semibold bg-slate-100/80 dark:bg-[#0F274D] border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-[#0B2D5B] dark:focus:border-[#F58220] transition-colors"
          />
          <Search className="absolute right-3 top-3 h-4 w-4 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* Right control cluster */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Streak counter pill */}
        <div className="hidden sm:flex items-center gap-1.5 bg-[#F58220]/10 border border-[#F58220]/30 text-[#F58220] px-3 py-1.5 rounded-full text-xs font-black">
          <Flame className="h-4 w-4 animate-pulse" />
          <span>مرحباً {displayName.split(" ")[0]}</span>
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
            aria-label="الإشعارات"
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
            <div className="absolute left-0 mt-3 w-80 sm:w-96 rounded-2xl bg-white dark:bg-[#0F274D] border border-slate-200 dark:border-white/10 shadow-2xl p-4 space-y-3 z-50 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-2">
                <span className="text-xs font-extrabold text-[#0B2D5B] dark:text-white flex items-center gap-1.5">
                  <span>الإشعارات والتنبيهات</span>
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
                    href="/dashboard/notifications"
                    onClick={() => setShowNotifPopover(false)}
                    className="text-[11px] font-bold text-[#F58220] hover:underline"
                  >
                    عرض الكل
                  </Link>
                </div>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.slice(0, 5).map((notif: any) => (
                    <div
                      key={notif._id || notif.id}
                      onClick={async () => {
                        const notifId = notif._id || notif.id;
                        if (!notif.isRead && notifId) {
                          try {
                            await markAsRead(notifId);
                          } catch {
                            // Ignored
                          }
                        }
                        setShowNotifPopover(false);

                        const title = (notif.title || "").toLowerCase();
                        const message = (notif.message || "").toLowerCase();
                        if (title.includes("كورس") || message.includes("دورة") || title.includes("تسجيل")) {
                          router.push("/dashboard/courses");
                        } else if (title.includes("واجب") || message.includes("واجب")) {
                          router.push("/dashboard/assignments");
                        } else if (title.includes("اختبار") || message.includes("امتحان")) {
                          router.push("/dashboard/quizzes");
                        } else {
                          router.push("/dashboard/notifications");
                        }
                      }}
                      className={cn(
                        "p-3 rounded-xl border text-right space-y-1 transition-all cursor-pointer hover:scale-[1.01]",
                        !notif.isRead
                          ? "bg-amber-500/10 border-amber-500/20 font-bold"
                          : "bg-slate-50 dark:bg-white/5 border-slate-100 dark:border-white/5 opacity-80"
                      )}
                    >
                      <div className="flex justify-between items-center text-xs font-bold text-[#0B2D5B] dark:text-white">
                        <span className="font-extrabold truncate">{notif.title}</span>
                        <span className="text-[10px] font-normal text-slate-400 shrink-0">
                          {notif.createdAt ? new Date(notif.createdAt).toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" }) : ""}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">{notif.message}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-xs text-slate-400">
                    لا توجد إشعارات جديدة حتى الآن
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Student Avatar Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowUserMenu((prev) => !prev);
              setShowNotifPopover(false);
            }}
            className="flex items-center gap-2 p-1 sm:px-2 sm:py-1 rounded-xl bg-slate-100/80 dark:bg-white/10 hover:bg-slate-200 transition-colors border border-slate-200 dark:border-white/10 cursor-pointer"
          >
            <div className="relative h-8 w-8 rounded-lg overflow-hidden border border-slate-300 dark:border-white/20 bg-gradient-to-tr from-[#F58220] to-[#FF9A2A] flex items-center justify-center shrink-0">
              {user?.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatarSrc} alt={displayName} className="h-full w-full object-cover" />
              ) : (
                <span className="text-white font-bold text-sm">{avatarInitial}</span>
              )}
            </div>
            <span className="hidden sm:inline text-xs font-bold text-[#0B2D5B] dark:text-white">
              {displayName}
            </span>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400 hidden sm:inline" />
          </button>

          {/* User quick menu */}
          {showUserMenu && (
            <div className="absolute left-0 mt-3 w-56 rounded-2xl bg-white dark:bg-[#0F274D] border border-slate-200 dark:border-white/10 shadow-2xl p-2 space-y-1 z-50 animate-fadeIn">
              <div className="p-3 border-b border-slate-100 dark:border-white/10 mb-1">
                <div className="text-xs font-extrabold text-[#0B2D5B] dark:text-white">{displayName}</div>
                <div className="text-[10px] text-[#F58220] font-semibold">🎓 طالب</div>
              </div>

              <Link
                href="/dashboard/profile"
                onClick={() => setShowUserMenu(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
              >
                <User className="h-4 w-4 text-[#0B2D5B] dark:text-[#F58220]" />
                <span>الملف الشخصي</span>
              </Link>

              <Link
                href="/dashboard/settings"
                onClick={() => setShowUserMenu(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
              >
                <Settings className="h-4 w-4 text-slate-400" />
                <span>الإعدادات</span>
              </Link>

              <button
                onClick={() => { logout(); setShowUserMenu(false); }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors cursor-pointer"
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

export default Topbar;

"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  Bell,
  Menu,
  PlusCircle,
  Wallet,
  User,
  Settings,
  LogOut,
  ChevronDown,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/common";
import { useAuthContext } from "@/providers/auth-provider";
import { mockTeacherProfile, mockTeacherNotifications } from "../data/mock-teacher-data";

interface TeacherTopbarProps {
  onMenuClick?: () => void;
}

export function TeacherTopbar({ onMenuClick }: TeacherTopbarProps) {
  const router = useRouter();
  const { user, logout } = useAuthContext();

  const teacherName = user
    ? `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.fullName || user.username || "المعلم"
    : mockTeacherProfile.name;

  const teacherAvatar = user?.avatar || mockTeacherProfile.avatar;

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      router.push("/login");
    }
  };
  const [showNotifPopover, setShowNotifPopover] = React.useState(false);
  const [showUserMenu, setShowUserMenu] = React.useState(false);
  const [showMobileSearch, setShowMobileSearch] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  const unreadNotifCount = mockTeacherNotifications.filter((n) => !n.read).length;

  const notifRef = React.useRef<HTMLDivElement>(null);
  const userRef = React.useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifPopover(false);
      }
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 w-full bg-white/90 dark:bg-[#071C3B]/90 backdrop-blur-xl border-b border-slate-200/80 dark:border-white/10 transition-colors select-none">
      {/* Mobile Search Bar (full-width overlay) */}
      {showMobileSearch && (
        <div className="flex md:hidden items-center gap-2 px-4 py-3 border-b border-slate-200/60 dark:border-white/10 bg-white dark:bg-[#071C3B]">
          <div className="relative flex-1">
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث في الكورسات، الطلاب..."
              className="w-full h-10 pr-10 pl-4 rounded-xl text-xs font-semibold bg-slate-100/80 dark:bg-[#0F274D] border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-[#F58220] transition-colors"
            />
            <Search className="absolute right-3 top-3 h-4 w-4 text-slate-400 pointer-events-none" />
          </div>
          <button
            type="button"
            onClick={() => setShowMobileSearch(false)}
            className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-white/10 flex items-center justify-center text-slate-600 dark:text-slate-300 shrink-0"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Main topbar row */}
      <div className="h-16 sm:h-20 px-3 sm:px-6 lg:px-8 flex items-center justify-between gap-2">
        {/* Left: Hamburger + Desktop Search */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            type="button"
            onClick={onMenuClick}
            className="lg:hidden h-10 w-10 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-200 flex items-center justify-center focus:outline-none shrink-0"
            aria-label="افتح القائمة"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Mobile Search Trigger */}
          <button
            type="button"
            onClick={() => setShowMobileSearch(true)}
            className="md:hidden h-10 w-10 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0"
            aria-label="البحث"
          >
            <Search className="h-4 w-4" />
          </button>

          {/* Desktop Search */}
          <div className="relative hidden md:block w-56 lg:w-80 xl:w-96">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث في الكورسات، الطلاب، أو التقييمات..."
              className="w-full h-11 pr-10 pl-4 rounded-xl text-xs font-semibold bg-slate-100/80 dark:bg-[#0F274D] border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-[#0B2D5B] dark:focus:border-[#F58220] transition-colors"
            />
            <Search className="absolute right-3 top-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Create Course CTA — hidden on small */}
          <Link
            href="/teacher/courses/create"
            className="hidden sm:flex items-center gap-1.5 h-9 sm:h-10 px-3 sm:px-4 rounded-xl bg-gradient-to-r from-[#F58220] to-[#FF9A2A] text-white text-xs font-bold shadow-md shadow-[#F58220]/20 hover:shadow-lg hover:-translate-y-0.5 transition-all whitespace-nowrap"
          >
            <PlusCircle className="h-4 w-4 shrink-0" />
            <span className="hidden lg:inline">إنشاء كورس جديد</span>
            <span className="lg:hidden">كورس جديد</span>
          </Link>

          {/* Revenue Badge — hidden on mobile */}
          <div className="hidden md:flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-2.5 py-1.5 rounded-full text-xs font-black whitespace-nowrap">
            <Wallet className="h-3.5 w-3.5 shrink-0" />
            <span>{mockTeacherProfile.totalRevenue.toLocaleString("en-US")} ج.م</span>
          </div>

          {/* Theme switcher */}
          <ThemeToggle />

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              type="button"
              onClick={() => {
                setShowNotifPopover((prev) => !prev);
                setShowUserMenu(false);
              }}
              className="relative h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-200 hover:text-[#F58220] flex items-center justify-center transition-colors"
              aria-label="الإشعارات"
            >
              <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
              {unreadNotifCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 rounded-full bg-[#F58220] text-white text-[9px] sm:text-[10px] font-black flex items-center justify-center border-2 border-white dark:border-[#071C3B]">
                  {unreadNotifCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifPopover && (
              <div className="absolute left-0 sm:left-auto sm:right-0 mt-3 w-[calc(100vw-2rem)] max-w-sm sm:w-80 md:w-96 rounded-2xl bg-white dark:bg-[#0F274D] border border-slate-200 dark:border-white/10 shadow-2xl p-4 space-y-3 z-50 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-2">
                  <span className="text-xs font-extrabold text-[#0B2D5B] dark:text-white">إشعارات المحاضر</span>
                  <Link
                    href="/teacher/notifications"
                    onClick={() => setShowNotifPopover(false)}
                    className="text-[11px] font-bold text-[#F58220] hover:underline"
                  >
                    عرض الكل
                  </Link>
                </div>

                <div className="space-y-2 max-h-72 overflow-y-auto">
                  {mockTeacherNotifications.map((notif) => (
                    <div
                      key={notif.id}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 text-right space-y-1"
                    >
                      <div className="flex justify-between items-start gap-2 text-xs font-bold text-[#0B2D5B] dark:text-white">
                        <span className="flex-1 leading-snug">{notif.title}</span>
                        <span className="text-[10px] font-normal text-slate-400 shrink-0">{notif.timestamp}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">{notif.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Teacher Avatar Menu */}
          <div className="relative" ref={userRef}>
            <button
              type="button"
              onClick={() => {
                setShowUserMenu((prev) => !prev);
                setShowNotifPopover(false);
              }}
              className="flex items-center gap-1.5 p-1 sm:px-2 sm:py-1 rounded-xl bg-slate-100/80 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 transition-colors border border-slate-200 dark:border-white/10"
            >
              <div className="relative h-7 w-7 sm:h-8 sm:w-8 rounded-lg overflow-hidden border border-slate-300 dark:border-white/20 shrink-0">
                <Image src={teacherAvatar} alt={teacherName} fill className="object-cover" />
              </div>
              <span className="hidden sm:inline text-xs font-bold text-[#0B2D5B] dark:text-white max-w-[80px] truncate">
                {teacherName}
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400 hidden sm:inline shrink-0" />
            </button>

            {/* User quick menu */}
            {showUserMenu && (
              <div className="absolute left-0 sm:left-auto sm:right-0 mt-3 w-52 rounded-2xl bg-white dark:bg-[#0F274D] border border-slate-200 dark:border-white/10 shadow-2xl p-2 space-y-1 z-50 animate-fadeIn">
                <div className="p-3 border-b border-slate-100 dark:border-white/10 mb-1">
                  <div className="text-xs font-extrabold text-[#0B2D5B] dark:text-white truncate">{teacherName}</div>
                  <div className="text-[10px] text-[#F58220] font-semibold truncate">محاضر ومعلم معتمد</div>
                </div>

                <Link
                  href="/teacher/profile"
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                >
                  <User className="h-4 w-4 text-[#0B2D5B] dark:text-[#F58220]" />
                  <span>تعديل الملف الشخصي</span>
                </Link>

                <Link
                  href="/teacher/settings"
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                >
                  <Settings className="h-4 w-4 text-slate-400" />
                  <span>إعدادات الأمان والحساب</span>
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full text-right flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>تسجيل الخروج</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default TeacherTopbar;

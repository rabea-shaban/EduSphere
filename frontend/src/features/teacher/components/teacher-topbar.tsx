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
} from "lucide-react";
import { ThemeToggle } from "@/components/common";
import { mockTeacherProfile, mockTeacherNotifications } from "../data/mock-teacher-data";

interface TeacherTopbarProps {
  onMenuClick?: () => void;
}

export function TeacherTopbar({ onMenuClick }: TeacherTopbarProps) {
  const [showNotifPopover, setShowNotifPopover] = React.useState(false);
  const [showUserMenu, setShowUserMenu] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  const unreadNotifCount = mockTeacherNotifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-30 w-full h-16 sm:h-20 bg-white/80 dark:bg-[#071C3B]/80 backdrop-blur-xl border-b border-slate-200/80 dark:border-white/10 px-4 sm:px-8 flex items-center justify-between transition-colors text-right select-none">
      {/* Mobile Drawer Trigger & Global Search */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="lg:hidden h-10 w-10 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-200 flex items-center justify-center focus:outline-none"
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
            placeholder="ابحث في الكورسات، الطلاب، أو التقييمات..."
            className="w-full h-11 pr-10 pl-4 rounded-xl text-xs font-semibold bg-slate-100/80 dark:bg-[#0F274D] border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-[#0B2D5B] dark:focus:border-[#F58220] transition-colors"
          />
          <Search className="absolute right-3 top-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* Right control cluster */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Create Course Quick CTA */}
        <Link
          href="/teacher/courses/create"
          className="hidden sm:flex items-center gap-2 h-10 px-4 rounded-xl bg-gradient-to-r from-[#F58220] to-[#FF9A2A] text-white text-xs font-bold shadow-md shadow-[#F58220]/20 hover:shadow-lg hover:-translate-y-0.5 transition-all"
        >
          <PlusCircle className="h-4 w-4" />
          <span>إنشاء كورس جديد</span>
        </Link>

        {/* Revenue Balance Badge */}
        <div className="hidden sm:flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-3 py-1.5 rounded-full text-xs font-black">
          <Wallet className="h-4 w-4" />
          <span>{mockTeacherProfile.totalRevenue.toLocaleString('en-US')} ج.م</span>
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
            className="relative h-10 w-10 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-200 hover:text-[#F58220] flex items-center justify-center transition-colors"
            aria-label="الإشعارات"
          >
            <Bell className="h-5 w-5" />
            {unreadNotifCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-[#F58220] text-white text-[10px] font-black flex items-center justify-center border-2 border-white dark:border-[#071C3B]">
                {unreadNotifCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifPopover && (
            <div className="absolute left-0 mt-3 w-80 sm:w-96 rounded-2xl bg-white dark:bg-[#0F274D] border border-slate-200 dark:border-white/10 shadow-2xl p-4 space-y-3 z-50 animate-fadeIn">
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

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {mockTeacherNotifications.map((notif) => (
                  <div
                    key={notif.id}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 text-right space-y-1"
                  >
                    <div className="flex justify-between items-center text-xs font-bold text-[#0B2D5B] dark:text-white">
                      <span>{notif.title}</span>
                      <span className="text-[10px] font-normal text-slate-400">{notif.timestamp}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">{notif.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Teacher Avatar Menu */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowUserMenu((prev) => !prev);
              setShowNotifPopover(false);
            }}
            className="flex items-center gap-2 p-1 sm:px-2 sm:py-1 rounded-xl bg-slate-100/80 dark:bg-white/10 hover:bg-slate-200 transition-colors border border-slate-200 dark:border-white/10"
          >
            <div className="relative h-8 w-8 rounded-lg overflow-hidden border border-slate-300 dark:border-white/20">
              <Image src={mockTeacherProfile.avatar} alt={mockTeacherProfile.name} fill className="object-cover" />
            </div>
            <span className="hidden sm:inline text-xs font-bold text-[#0B2D5B] dark:text-white">
              {mockTeacherProfile.name}
            </span>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400 hidden sm:inline" />
          </button>

          {/* User quick menu */}
          {showUserMenu && (
            <div className="absolute left-0 mt-3 w-56 rounded-2xl bg-white dark:bg-[#0F274D] border border-slate-200 dark:border-white/10 shadow-2xl p-2 space-y-1 z-50 animate-fadeIn">
              <div className="p-3 border-b border-slate-100 dark:border-white/10 mb-1">
                <div className="text-xs font-extrabold text-[#0B2D5B] dark:text-white">{mockTeacherProfile.name}</div>
                <div className="text-[10px] text-[#F58220] font-semibold">{mockTeacherProfile.title}</div>
              </div>

              <Link
                href="/teacher/profile"
                onClick={() => setShowUserMenu(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
              >
                <User className="h-4 w-4 text-[#0B2D5B] dark:text-[#F58220]" />
                <span>الملف الشخصي</span>
              </Link>

              <Link
                href="/teacher/settings"
                onClick={() => setShowUserMenu(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
              >
                <Settings className="h-4 w-4 text-slate-400" />
                <span>الإعدادات</span>
              </Link>

              <Link
                href="/login"
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>تسجيل الخروج</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default TeacherTopbar;

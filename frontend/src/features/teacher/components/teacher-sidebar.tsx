"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  PlusCircle,
  PlaySquare,
  HelpCircle,
  FileCheck2,
  Users,
  ShoppingBag,
  Wallet,
  Star,
  Bell,
  User,
  Settings,
  LogOut,
  ChevronRight,
  ChevronLeft,
  X,
} from "lucide-react";
import { Logo } from "@/components/common";
import { cn } from "@/lib/utils";
import { mockTeacherProfile } from "../data/mock-teacher-data";

export interface TeacherSidebarProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  onMobileClose?: () => void;
}

const navItems = [
  { title: "لوحة التحكم", href: "/teacher/dashboard", icon: LayoutDashboard },
  { title: "كورساتي", href: "/teacher/courses", icon: BookOpen, badge: "8" },
  { title: "إنشاء كورس", href: "/teacher/courses/create", icon: PlusCircle, isHighlight: true },
  { title: "الدروس", href: "/teacher/lessons", icon: PlaySquare },
  { title: "الاختبارات", href: "/teacher/quizzes", icon: HelpCircle },
  { title: "الواجبات", href: "/teacher/assignments", icon: FileCheck2, badge: "14" },
  { title: "الطلاب", href: "/teacher/students", icon: Users, badge: "4.8k" },
  { title: "طلبات الاشتراك", href: "/teacher/orders", icon: ShoppingBag },
  { title: "الأرباح", href: "/teacher/earnings", icon: Wallet },
  { title: "التقييمات", href: "/teacher/reviews", icon: Star, badge: "4.9 ★" },
  { title: "الإشعارات", href: "/teacher/notifications", icon: Bell, badge: "3" },
  { title: "الملف الشخصي", href: "/teacher/profile", icon: User },
  { title: "الإعدادات", href: "/teacher/settings", icon: Settings },
];

export function TeacherSidebar({ isCollapsed = false, onToggleCollapse, onMobileClose }: TeacherSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    router.push("/login");
  };

  return (
    <aside
      className={cn(
        "h-screen sticky top-0 z-40 bg-white dark:bg-[#071C3B] border-l border-slate-200/80 dark:border-white/10 flex flex-col justify-between transition-all duration-300 select-none text-right shadow-sm",
        isCollapsed ? "w-[72px]" : "w-64"
      )}
    >
      {/* Header Logo */}
      <div className="p-3 sm:p-4 flex items-center justify-between border-b border-slate-100 dark:border-white/10 min-h-[64px] sm:min-h-[80px]">
        {!isCollapsed ? (
          <Logo size="sm" showText={true} />
        ) : (
          <div className="mx-auto">
            <Logo size="sm" showText={false} />
          </div>
        )}

        {/* Desktop collapse toggle */}
        {onToggleCollapse && (
          <button
            type="button"
            onClick={onToggleCollapse}
            className="hidden lg:flex items-center justify-center h-7 w-7 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 hover:text-[#F58220] transition-colors shrink-0"
            title={isCollapsed ? "توسيع القائمة" : "طي القائمة"}
          >
            {isCollapsed ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
        )}

        {/* Mobile close button */}
        {onMobileClose && (
          <button
            type="button"
            onClick={onMobileClose}
            className="lg:hidden flex items-center justify-center h-8 w-8 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 hover:text-red-500 transition-colors shrink-0"
            title="إغلاق"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Navigation items list */}
      <div className="flex-1 overflow-y-auto py-3 px-2.5 space-y-1 scrollbar-thin">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/teacher/dashboard" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onMobileClose}
              className={cn(
                "group relative flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200",
                isCollapsed ? "justify-center" : "",
                item.isHighlight
                  ? "bg-gradient-to-r from-[#F58220] to-[#FF9A2A] text-white shadow-md shadow-[#F58220]/25 hover:shadow-lg"
                  : isActive
                  ? "bg-gradient-to-r from-[#0B2D5B] to-[#1E73D8] dark:from-[#0F274D] dark:to-[#1E73D8] text-white shadow-md shadow-[#0B2D5B]/20"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-[#0B2D5B] dark:hover:text-white"
              )}
              title={isCollapsed ? item.title : undefined}
            >
              <Icon
                className={cn(
                  "h-5 w-5 shrink-0 transition-transform group-hover:scale-110",
                  item.isHighlight
                    ? "text-white"
                    : isActive
                    ? "text-[#F58220]"
                    : "text-slate-400 dark:text-slate-400 group-hover:text-[#F58220]"
                )}
              />

              {!isCollapsed && <span className="flex-1 truncate">{item.title}</span>}

              {!isCollapsed && item.badge && (
                <span
                  className={cn(
                    "text-[10px] font-black px-2 py-0.5 rounded-full border shrink-0",
                    item.isHighlight
                      ? "bg-white text-[#F58220] border-transparent"
                      : isActive
                      ? "bg-[#F58220] text-white border-transparent"
                      : "bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-white/10"
                  )}
                >
                  {item.badge}
                </span>
              )}

              {/* Collapsed tooltip badge */}
              {isCollapsed && item.badge && (
                <span className="absolute -top-1 -left-1 h-4 w-4 rounded-full bg-[#F58220] text-white text-[8px] font-black flex items-center justify-center border border-white dark:border-[#071C3B]">
                  !
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Footer: Teacher Profile & Logout */}
      <div className="p-2.5 border-t border-slate-100 dark:border-white/10 space-y-2">
        {!isCollapsed && (
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-[#0B2D5B] to-[#1E73D8] text-white flex items-center justify-center font-bold text-sm shadow-md shrink-0">
              {mockTeacherProfile.name[0]}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-[#0B2D5B] dark:text-white truncate">
                {mockTeacherProfile.name}
              </div>
              <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-extrabold truncate">
                {mockTeacherProfile.totalRevenue.toLocaleString("en-US")} ج.م
              </div>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={handleLogout}
          className={cn(
            "w-full h-10 rounded-2xl border border-red-200 dark:border-red-900/40 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 text-xs font-bold flex items-center justify-center gap-2 transition-colors",
            isCollapsed ? "px-0" : "px-4"
          )}
          title="تسجيل الخروج"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!isCollapsed && <span>تسجيل الخروج</span>}
        </button>
      </div>
    </aside>
  );
}

export default TeacherSidebar;

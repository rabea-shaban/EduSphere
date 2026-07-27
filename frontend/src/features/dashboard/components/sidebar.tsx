"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  HelpCircle,
  FileCheck2,
  Award,
  GraduationCap,
  Bell,
  User,
  Settings,
  LogOut,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { Logo } from "@/components/common";
import { cn } from "@/lib/utils";
import { useAuthContext } from "@/providers/auth-provider";
import { useStudent } from "@/hooks/useStudent";

export interface SidebarNavProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  onMobileClose?: () => void;
}

export function Sidebar({ isCollapsed = false, onToggleCollapse, onMobileClose }: SidebarNavProps) {
  const pathname = usePathname();
  const { user, logout } = useAuthContext();

  const { useMyCourses, useQuizzes, useAssignments, notifications } = useStudent();
  const { data: coursesData } = useMyCourses();
  const { data: quizzesData } = useQuizzes();
  const { data: assignmentsData } = useAssignments();

  const enrolledCount = coursesData?.enrollments?.length ?? 0;
  const quizzesCount = quizzesData?.length ?? 0;
  const assignmentsCount = assignmentsData?.length ?? 0;
  const certificatesCount = coursesData?.enrollments?.filter(
    (e) => e.status === "Completed" || e.certificateIssued
  )?.length ?? 0;
  const unreadNotifCount = notifications?.filter((n) => !n.isRead)?.length ?? 0;

  const dynamicNavItems = [
    { title: "الرئيسية", href: "/dashboard", icon: LayoutDashboard },
    {
      title: "كورساتي",
      href: "/dashboard/courses",
      icon: BookOpen,
      badge: enrolledCount > 0 ? String(enrolledCount) : undefined,
    },
    {
      title: "الاختبارات",
      href: "/dashboard/quizzes",
      icon: HelpCircle,
      badge: quizzesCount > 0 ? `${quizzesCount} جُدد` : undefined,
    },
    {
      title: "الواجبات والمهام",
      href: "/dashboard/assignments",
      icon: FileCheck2,
      badge: assignmentsCount > 0 ? String(assignmentsCount) : undefined,
    },
    {
      title: "الشهادات",
      href: "/dashboard/certificates",
      icon: GraduationCap,
      badge: certificatesCount > 0 ? String(certificatesCount) : undefined,
    },
    { title: "الإنجازات والوسام", href: "/dashboard/achievements", icon: Award },
    {
      title: "الإشعارات",
      href: "/dashboard/notifications",
      icon: Bell,
      badge: unreadNotifCount > 0 ? String(unreadNotifCount) : undefined,
    },
    { title: "الملف الشخصي", href: "/dashboard/profile", icon: User },
    { title: "الإعدادات", href: "/dashboard/settings", icon: Settings },
  ];

  const displayName = (user?.firstName || user?.lastName)
    ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
    : (user?.fullName || user?.username || "طالب EduSphere");

  const avatarInitial = displayName.charAt(0).toUpperCase();
  const avatarSrc = user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${displayName}`;

  return (
    <aside
      className={cn(
        "h-screen sticky top-0 z-40 bg-white dark:bg-[#071C3B] border-l border-slate-200/80 dark:border-white/10 flex flex-col justify-between transition-all duration-300 select-none text-right shadow-sm",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* Header Logo */}
      <div className="p-4 sm:p-5 flex items-center justify-between border-b border-slate-100 dark:border-white/10">
        {!isCollapsed && <Logo size="sm" showText={true} />}
        {isCollapsed && (
          <div className="mx-auto">
            <Logo size="sm" showText={false} />
          </div>
        )}

        <button
          type="button"
          onClick={onToggleCollapse}
          className="hidden lg:flex items-center justify-center h-8 w-8 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 hover:text-[#F58220] transition-colors cursor-pointer"
          title={isCollapsed ? "توسيع القائمة" : "طي القائمة"}
        >
          {isCollapsed ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>
      </div>

      {/* Navigation items list */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1.5 scrollbar-thin">
        {dynamicNavItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onMobileClose}
              className={cn(
                "group relative flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-bold transition-all duration-200",
                isActive
                  ? "bg-gradient-to-r from-[#0B2D5B] to-[#1E73D8] dark:from-[#0F274D] dark:to-[#1E73D8] text-white shadow-md shadow-[#0B2D5B]/20"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-[#0B2D5B] dark:hover:text-white"
              )}
              title={isCollapsed ? item.title : undefined}
            >
              <Icon
                className={cn(
                  "h-5 w-5 shrink-0 transition-transform group-hover:scale-110",
                  isActive ? "text-[#F58220]" : "text-slate-400 dark:text-slate-400 group-hover:text-[#F58220]"
                )}
              />

              {!isCollapsed && <span className="flex-1 truncate">{item.title}</span>}

              {!isCollapsed && item.badge && (
                <span
                  className={cn(
                    "text-[10px] font-black px-2 py-0.5 rounded-full border transition-all animate-pulse",
                    isActive
                      ? "bg-[#F58220] text-white border-transparent"
                      : "bg-orange-50 dark:bg-white/10 text-[#F58220] dark:text-slate-200 border-[#F58220]/30"
                  )}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Footer Student Summary & Logout */}
      <div className="p-3 border-t border-slate-100 dark:border-white/10 space-y-2">
        {!isCollapsed && (
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              {/* Avatar */}
              {user?.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatarSrc}
                  alt={displayName}
                  className="h-9 w-9 rounded-xl object-cover border border-[#F58220]/40 shadow-md"
                />
              ) : (
                <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-[#F58220] to-[#FF9A2A] text-white flex items-center justify-center font-bold text-sm shadow-md">
                  {avatarInitial}
                </div>
              )}
              <div className="truncate">
                <div className="text-xs font-bold text-[#0B2D5B] dark:text-white truncate">
                  {displayName}
                </div>
                <div className="text-[10px] text-[#F58220] font-semibold truncate">
                  🎓 طالب
                </div>
              </div>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={() => logout()}
          className={cn(
            "w-full h-11 rounded-2xl border border-red-200 dark:border-red-900/40 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer",
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

export default Sidebar;

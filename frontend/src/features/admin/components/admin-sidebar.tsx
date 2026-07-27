"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  PlaySquare,
  HelpCircle,
  FileCheck2,
  CreditCard,
  Tag,
  Award,
  Star,
  Bell,
  FileText,
  Activity,
  Settings,
  LogOut,
  ChevronRight,
  ChevronLeft,
  ShieldAlert,
  FolderTree,
} from "lucide-react";
import { Logo } from "@/components/common";
import { cn } from "@/lib/utils";
import { useAuthContext } from "@/providers/auth-provider";
import adminService, { AdminDashboardResponse } from "@/services/admin.service";

export interface AdminSidebarProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  onMobileClose?: () => void;
}

export function AdminSidebar({ isCollapsed = false, onToggleCollapse, onMobileClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuthContext();

  // Fetch real statistics for dynamic sidebar badges
  const { data: dashboardData } = useQuery<AdminDashboardResponse>({
    queryKey: ["admin", "sidebar", "stats"],
    queryFn: () => adminService.getDashboardData(),
    staleTime: 60000, // cache for 1 min
  });

  const stats = dashboardData?.statistics;
  const health = dashboardData?.systemHealth;

  const navItems = [
    { title: "لوحة التحكم الرئيسية", href: "/admin/dashboard", icon: LayoutDashboard },
    {
      title: "إدارة المستخدمين",
      href: "/admin/users",
      icon: Users,
      badge: stats?.totalUsers ? stats.totalUsers.toLocaleString("ar-EG") : undefined,
    },
    {
      title: "اعتماد المعلمين",
      href: "/admin/teachers",
      icon: GraduationCap,
      badge: stats?.pendingTeacherApps ? `${stats.pendingTeacherApps} بانتظار` : undefined,
    },
    { title: "الطلاب والمتابعة", href: "/admin/students", icon: Users },
    { title: "المراحل والمواد", href: "/admin/academic", icon: FolderTree },
    {
      title: "إدارة الكورسات",
      href: "/admin/courses",
      icon: BookOpen,
      badge: stats?.totalCourses ? stats.totalCourses.toLocaleString("ar-EG") : undefined,
    },
    { title: "الدروس والمحتوى", href: "/admin/lessons", icon: PlaySquare },
    { title: "الاختبارات العامة", href: "/admin/quizzes", icon: HelpCircle },
    { title: "الواجبات والمشاريع", href: "/admin/assignments", icon: FileCheck2 },
    {
      title: "مراجعة المدفوعات",
      href: "/admin/payments",
      icon: CreditCard,
      badge: stats?.pendingPayments ? `${stats.pendingPayments} مراجعة` : undefined,
      isHighlight: true,
    },
    { title: "خطط الاشتراكات", href: "/admin/subscriptions", icon: CreditCard },
    { title: "كوبونات الخصم", href: "/admin/coupons", icon: Tag },
    { title: "إدارة المدونة والـ CMS", href: "/admin/blog", icon: FileText },
    { title: "الإشعارات العامة", href: "/admin/notifications", icon: Bell },
    { title: "التقارير المالية والتعليمية", href: "/admin/reports", icon: Activity },
    { title: "سجل العمليات والـ Logs", href: "/admin/audit-logs", icon: ShieldAlert },
    { title: "إعدادات المنصة الشاملة", href: "/admin/settings", icon: Settings },
  ];

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      router.push("/admin/login");
    }
  };

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
          className="hidden lg:flex items-center justify-center h-8 w-8 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 hover:text-[#F58220] transition-colors"
          title={isCollapsed ? "توسيع القائمة" : "طي القائمة"}
        >
          {isCollapsed ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>
      </div>

      {/* Navigation items list */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1.5 scrollbar-thin">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/admin/dashboard" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onMobileClose}
              className={cn(
                "group relative flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200",
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
                  "h-4 w-4 shrink-0 transition-transform group-hover:scale-110",
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
                    "text-[10px] font-black px-2 py-0.5 rounded-full border",
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
            </Link>
          );
        })}
      </div>

      {/* Footer System Status & Logout */}
      <div className="p-3 border-t border-slate-100 dark:border-white/10 space-y-2">
        {!isCollapsed && (
          <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400">السيرفرات تعمل بكفاءة</span>
            </div>
            <span className="text-[10px] font-extrabold text-emerald-600">
              {health?.uptimeFormatted || "99.9%"}
            </span>
          </div>
        )}

        <button
          type="button"
          onClick={handleLogout}
          className={cn(
            "w-full h-10 rounded-2xl border border-red-200 dark:border-red-900/40 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer",
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

export default AdminSidebar;

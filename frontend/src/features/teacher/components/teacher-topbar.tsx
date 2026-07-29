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
  Eye,
  EyeOff,
  RefreshCw,
  ArrowUpRight,
  TrendingUp,
  Sparkles,
  CreditCard,
  Send,
  Loader2,
  CheckCircle2,
  CheckCheck,
  Trash2,
  ExternalLink,
  BellOff,
} from "lucide-react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { ThemeToggle } from "@/components/common";
import { useAuthContext } from "@/providers/auth-provider";
import { SocketStatusBadge } from "./realtime/SocketStatusBadge";
import { useTeacherNotifications, useMarkNotificationAsRead, useMarkAllNotificationsAsRead, useDeleteNotification } from "@/hooks/useTeacherNotifications";
import { useTeacherEarningsDashboard } from "@/hooks/useTeacherEarnings";
import { useDashboardAnalytics } from "@/hooks/useTeacherAnalytics";
import { useWallet, useCreateWithdrawal } from "@/hooks/useTeacherWithdrawals";
import { mockTeacherNotifications } from "../data/mock-teacher-data";
import type { WithdrawalMethodType } from "@/features/teacher/types/withdrawal";

const GlobalSearchModal = dynamic(
  () => import("./search/GlobalSearchModal").then((mod) => mod.GlobalSearchModal),
  { ssr: false }
);

interface TeacherTopbarProps {
  onMenuClick?: () => void;
}

export function TeacherTopbar({ onMenuClick }: TeacherTopbarProps) {
  const router = useRouter();
  const { user, logout } = useAuthContext();

  const teacherName = user
    ? `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.fullName || user.username || "المعلم"
    : "المعلم";

  const teacherAvatar = user?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=edusphere-teacher";

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      router.push("/login");
    }
  };

  // Popover & Modal States
  const [showNotifPopover, setShowNotifPopover] = React.useState(false);
  const [showUserMenu, setShowUserMenu] = React.useState(false);
  const [showRevenuePopover, setShowRevenuePopover] = React.useState(false);
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = React.useState(false);
  const [isPrivacyHidden, setIsPrivacyHidden] = React.useState(false);

  // Instant Withdrawal Modal State
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = React.useState(false);
  const [withdrawAmount, setWithdrawAmount] = React.useState<string>("");
  const [withdrawMethod, setWithdrawMethod] = React.useState<WithdrawalMethodType>("Vodafone Cash");
  const [accountDetails, setAccountDetails] = React.useState<string>("");

  // Real-time Wallet & Revenue Data
  const { data: walletData, refetch: refetchWallet, isFetching: isFetchingWallet } = useWallet();
  const { data: earningsDashboard } = useTeacherEarningsDashboard();
  const createWithdrawalMutation = useCreateWithdrawal();

  const netRevenue = walletData?.lifetimeEarnings ?? earningsDashboard?.totalEarnings ?? 0;
  const grossRevenue = walletData?.grossRevenue ?? earningsDashboard?.lifetimeRevenue ?? 0;
  const availablePayout = walletData?.availableBalance ?? earningsDashboard?.availableBalance ?? 0;

  // Time Range Filter for Popover
  const [timeFilter, setTimeFilter] = React.useState<"all" | "thisMonth" | "30days">("all");

  const displayedNet = React.useMemo(() => {
    if (timeFilter === "thisMonth" || timeFilter === "30days") {
      return earningsDashboard?.monthlyEarnings ?? 0;
    }
    return netRevenue;
  }, [netRevenue, earningsDashboard, timeFilter]);

  const displayedGross = React.useMemo(() => {
    if (timeFilter === "thisMonth" || timeFilter === "30days") {
      const net = earningsDashboard?.monthlyEarnings ?? 0;
      return net > 0 ? Math.round(net / 0.85) : 0;
    }
    return grossRevenue;
  }, [grossRevenue, earningsDashboard, timeFilter]);

  // Notifications Queries & Mutations
  const { data: notificationsData } = useTeacherNotifications({ limit: 10 });
  const markAsReadMutation = useMarkNotificationAsRead();
  const markAllAsReadMutation = useMarkAllNotificationsAsRead();
  const deleteNotificationMutation = useDeleteNotification();

  const realNotifications = notificationsData?.notifications || [];
  const unreadNotifCount = notificationsData?.unreadCount ?? 0;

  const displayNotifications = notificationsData ? realNotifications : mockTeacherNotifications;

  const notifRef = React.useRef<HTMLDivElement>(null);
  const userRef = React.useRef<HTMLDivElement>(null);
  const revenueRef = React.useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifPopover(false);
      }
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
      if (revenueRef.current && !revenueRef.current.contains(e.target as Node)) {
        setShowRevenuePopover(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleWithdrawSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = Number(withdrawAmount);
    if (!amountNum || amountNum < 100) return;

    try {
      await createWithdrawalMutation.mutateAsync({
        amount: amountNum,
        method: withdrawMethod,
        accountDetails: accountDetails.trim(),
      });
      setIsWithdrawModalOpen(false);
      setWithdrawAmount("");
      setAccountDetails("");
      refetchWallet();
    } catch {
      // Error handled by mutation toast
    }
  };

  // Interactive Notification Item Click Handler
  const handleNotificationClick = (notif: any) => {
    const notifId = notif._id || notif.id;
    const isUnread = notif.isRead === false || notif.read === false;

    if (notifId && isUnread) {
      markAsReadMutation.mutate(notifId);
    }

    setShowNotifPopover(false);

    // Dynamic Navigation
    if (notif.actionUrl) {
      router.push(notif.actionUrl);
      return;
    }

    const title = (notif.title || "").toLowerCase();
    const message = (notif.message || notif.description || "").toLowerCase();

    if (title.includes("اشتراك") || message.includes("اشتراك") || title.includes("طالب")) {
      router.push("/teacher/students");
    } else if (title.includes("واجب") || message.includes("واجب") || title.includes("تسليم")) {
      router.push("/teacher/assignments");
    } else if (title.includes("اختبار") || message.includes("اختبار") || title.includes("كوبر")) {
      router.push("/teacher/quizzes");
    } else if (title.includes("سحب") || title.includes("أرباح") || title.includes("دفع")) {
      router.push("/teacher/withdrawals");
    } else if (title.includes("تقييم") || message.includes("نجوم")) {
      router.push("/teacher/courses");
    } else {
      router.push("/teacher/notifications");
    }
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-white/85 dark:bg-[#071C3B]/85 backdrop-blur-2xl border-b border-slate-200/80 dark:border-white/10 shadow-sm transition-all select-none print:hidden">
      <GlobalSearchModal isOpen={isGlobalSearchOpen} onClose={() => setIsGlobalSearchOpen(false)} />

      {/* Main topbar container */}
      <div className="h-16 sm:h-20 px-3 sm:px-6 lg:px-8 flex items-center justify-between gap-2 sm:gap-4 dir-rtl">
        {/* Right side: Search & Mobile Navigation */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <button
            type="button"
            onClick={onMenuClick}
            className="lg:hidden h-10 w-10 rounded-2xl bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-200 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-white/20 transition-all shrink-0 cursor-pointer"
            aria-label="افتح القائمة"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Mobile & Tablet Search Icon Button (visible up to XL screen) */}
          <button
            type="button"
            onClick={() => setIsGlobalSearchOpen(true)}
            className="xl:hidden h-10 w-10 rounded-2xl bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0 cursor-pointer hover:bg-slate-200 dark:hover:bg-white/20 transition-colors"
            aria-label="البحث"
          >
            <Search className="h-4 w-4 text-[#F58220]" />
          </button>

          {/* Desktop Command Palette Search Input Bar (visible on XL screens 1280px+) */}
          <div
            onClick={() => setIsGlobalSearchOpen(true)}
            className="relative hidden xl:flex items-center w-72 2xl:w-96 h-11 px-4 rounded-2xl text-xs font-semibold bg-slate-100/90 dark:bg-[#0F274D] border border-slate-200/90 dark:border-white/10 text-slate-400 cursor-pointer hover:border-[#F58220] dark:hover:border-[#F58220] hover:shadow-md transition-all justify-between group"
          >
            <div className="flex items-center gap-2.5 min-w-0 flex-1 pl-2">
              <Search className="h-4 w-4 text-[#F58220] group-hover:scale-110 transition-transform shrink-0" />
              <span className="truncate">ابحث في الكورسات، الطلاب، الملفات...</span>
            </div>
            <kbd className="px-2 py-0.5 rounded-lg bg-white dark:bg-[#071C3B] border border-slate-200 dark:border-white/10 text-[10px] font-mono text-slate-500 dark:text-slate-300 shrink-0 shadow-xs">
              Ctrl + K
            </kbd>
          </div>
        </div>

        {/* Left side: Actions & Widgets */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Create Course CTA */}
          <Link
            href="/teacher/courses/create"
            className="hidden sm:flex items-center gap-2 h-10 px-3.5 rounded-2xl bg-gradient-to-r from-[#F58220] via-[#FF8A00] to-[#FF9A2A] text-white text-xs font-black shadow-lg shadow-[#F58220]/25 hover:shadow-xl hover:shadow-[#F58220]/35 hover:-translate-y-0.5 active:translate-y-0 transition-all whitespace-nowrap cursor-pointer"
          >
            <PlusCircle className="h-4 w-4 shrink-0" />
            <span className="hidden 2xl:inline">إنشاء كورس جديد</span>
            <span className="hidden xl:inline 2xl:hidden">كورس جديد</span>
          </Link>

          {/* Interactive Live Revenue Wallet Badge */}
          <div className="relative" ref={revenueRef}>
            <button
              type="button"
              onClick={() => {
                setShowRevenuePopover((prev) => !prev);
                setShowNotifPopover(false);
                setShowUserMenu(false);
              }}
              className="group flex items-center gap-1.5 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-emerald-500/10 hover:from-emerald-500/20 hover:to-teal-500/20 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 px-3 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer shadow-xs hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
              title="انقر لإدارة الأرباح وسحب الأموال"
            >
              <div className="p-1 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                <Wallet className="h-4 w-4" />
              </div>

              <div className="flex items-center gap-1 font-mono text-xs tracking-tight">
                <span>
                  {isPrivacyHidden ? "••••••" : `${netRevenue.toLocaleString("en-US")} ج.م`}
                </span>
              </div>

              <ChevronDown className="h-3.5 w-3.5 text-emerald-600/70 dark:text-emerald-400/70 group-hover:translate-y-0.5 transition-transform" />
            </button>

            {/* Financial Interactive Popover */}
            {showRevenuePopover && (
              <div className="absolute left-0 mt-3 w-84 rounded-3xl bg-white dark:bg-[#0F274D] border border-slate-200/80 dark:border-white/10 shadow-2xl p-4.5 space-y-4 z-50 animate-fadeIn text-right dir-rtl">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
                      <Wallet className="h-4.5 w-4.5" />
                    </span>
                    <div>
                      <h4 className="text-xs font-black text-[#0B2D5B] dark:text-white flex items-center gap-1.5">
                        <span>محفظة الأرباح للمحاضر</span>
                        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping inline-block" />
                      </h4>
                      <p className="text-[10px] text-slate-400">بيانات الأرباح والسحب الحقيقية</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setIsPrivacyHidden((prev) => !prev)}
                      className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
                      title={isPrivacyHidden ? "إظهار المبالغ" : "إخفاء المبالغ (وضع الخصوصية)"}
                    >
                      {isPrivacyHidden ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => refetchWallet()}
                      className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
                      title="تحديث الرصيد الآن"
                    >
                      <RefreshCw className={`h-4 w-4 ${isFetchingWallet ? "animate-spin text-[#F58220]" : ""}`} />
                    </button>
                  </div>
                </div>

                {/* Time Range Filter Bar */}
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-white/5 p-1 rounded-xl text-[10px] font-bold">
                  <button
                    type="button"
                    onClick={() => setTimeFilter("all")}
                    className={`flex-1 py-1 rounded-lg transition-all ${
                      timeFilter === "all"
                        ? "bg-white dark:bg-[#071C3B] text-[#0B2D5B] dark:text-white shadow-xs"
                        : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-200"
                    }`}
                  >
                    الإجمالي (الكل)
                  </button>
                  <button
                    type="button"
                    onClick={() => setTimeFilter("thisMonth")}
                    className={`flex-1 py-1 rounded-lg transition-all ${
                      timeFilter === "thisMonth"
                        ? "bg-white dark:bg-[#071C3B] text-[#0B2D5B] dark:text-white shadow-xs"
                        : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-200"
                    }`}
                  >
                    الشهر الحالي
                  </button>
                  <button
                    type="button"
                    onClick={() => setTimeFilter("30days")}
                    className={`flex-1 py-1 rounded-lg transition-all ${
                      timeFilter === "30days"
                        ? "bg-white dark:bg-[#071C3B] text-[#0B2D5B] dark:text-white shadow-xs"
                        : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-200"
                    }`}
                  >
                    آخر 30 يوم
                  </button>
                </div>

                {/* Interactive Revenue Cards Breakdown */}
                <div className="space-y-3 bg-slate-50 dark:bg-white/5 p-3.5 rounded-2xl border border-slate-100 dark:border-white/5 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 dark:text-slate-400 text-[11px] font-semibold">صافي الأرباح المكتسبة:</span>
                    <span className="font-mono font-black text-emerald-600 dark:text-emerald-400 text-sm">
                      {isPrivacyHidden ? "••••••" : `${displayedNet.toLocaleString("en-US")} ج.م`}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 dark:text-slate-400 text-[11px] font-semibold">إجمالي المبيعات (قبل العمولة):</span>
                    <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                      {isPrivacyHidden ? "••••••" : `${displayedGross.toLocaleString("en-US")} ج.م`}
                    </span>
                  </div>

                  <div className="flex justify-between items-center border-t border-slate-200/60 dark:border-white/10 pt-2.5">
                    <span className="text-slate-500 dark:text-slate-400 text-[11px] font-semibold">المتاح للسحب الآن:</span>
                    <span className="font-mono font-black text-[#F58220]">
                      {isPrivacyHidden ? "••••••" : `${availablePayout.toLocaleString("en-US")} ج.م`}
                    </span>
                  </div>
                </div>

                {/* Direct Interactive Action Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setShowRevenuePopover(false);
                      setIsWithdrawModalOpen(true);
                    }}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#F58220] hover:bg-[#e57518] text-white text-xs font-bold transition-all shadow-md shadow-[#F58220]/20 text-center cursor-pointer"
                  >
                    <ArrowUpRight className="h-4 w-4" />
                    <span>طلب سحب رصيد</span>
                  </button>
                  <Link
                    href="/teacher/withdrawals"
                    onClick={() => setShowRevenuePopover(false)}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all text-center cursor-pointer"
                  >
                    <TrendingUp className="h-4 w-4 text-[#0B2D5B] dark:text-[#F58220]" />
                    <span>كشف المحفظة</span>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Real-time Socket Connection Badge */}
          <div className="hidden sm:block">
            <SocketStatusBadge />
          </div>

          {/* Theme Switcher Toggle */}
          <ThemeToggle />

          {/* Notifications Trigger & Popover */}
          <div className="relative" ref={notifRef}>
            <button
              type="button"
              onClick={() => {
                setShowNotifPopover((prev) => !prev);
                setShowUserMenu(false);
                setShowRevenuePopover(false);
              }}
              className="relative h-10 w-10 rounded-2xl bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-200 hover:text-[#F58220] dark:hover:text-[#F58220] hover:bg-slate-200 dark:hover:bg-white/20 flex items-center justify-center transition-all cursor-pointer"
              aria-label="الإشعارات"
            >
              <Bell className="h-5 w-5" />
              {unreadNotifCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-[#F58220] text-white text-[10px] font-black flex items-center justify-center border-2 border-white dark:border-[#071C3B] shadow-xs">
                  {unreadNotifCount}
                </span>
              )}
            </button>

            {/* Interactive Notifications Dropdown */}
            {showNotifPopover && (
              <div className="absolute left-0 mt-3 w-[calc(100vw-2rem)] max-w-sm sm:w-80 md:w-96 rounded-3xl bg-white dark:bg-[#0F274D] border border-slate-200/80 dark:border-white/10 shadow-2xl p-4 space-y-3 z-50 animate-fadeIn text-right dir-rtl">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-[#0B2D5B] dark:text-white">
                      إشعارات وتنبيهات المحاضر
                    </span>
                    {unreadNotifCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-[#F58220]/15 text-[#F58220] text-[10px] font-black">
                        {unreadNotifCount} غير مقروء
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {unreadNotifCount > 0 && (
                      <button
                        type="button"
                        onClick={() => markAllAsReadMutation.mutate()}
                        disabled={markAllAsReadMutation.isPending}
                        className="text-[11px] font-bold text-slate-500 hover:text-[#F58220] dark:text-slate-400 transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-40"
                        title="تحديد كافة الإشعارات كمقروءة"
                      >
                        <CheckCheck className="h-3.5 w-3.5" />
                        <span>تعيين الكل كمقروء</span>
                      </button>
                    )}

                    <Link
                      href="/teacher/notifications"
                      onClick={() => setShowNotifPopover(false)}
                      className="text-[11px] font-bold text-[#F58220] hover:underline"
                    >
                      عرض الكل
                    </Link>
                  </div>
                </div>

                {/* Notifications List */}
                <div className="space-y-2 max-h-80 overflow-y-auto pr-0.5 scrollbar-thin">
                  {displayNotifications.length === 0 ? (
                    <div className="py-8 text-center space-y-2 text-slate-400">
                      <BellOff className="h-8 w-8 mx-auto opacity-50 text-slate-300" />
                      <p className="text-xs font-bold">لا توجد إشعارات جديدة حالياً ✨</p>
                    </div>
                  ) : (
                    displayNotifications.map((notif: any) => {
                      const notifId = notif._id || notif.id;
                      const title = notif.title || "إشعار جديد";
                      const message = notif.message || notif.description || "";
                      const time = notif.createdAt
                        ? new Date(notif.createdAt).toLocaleTimeString("ar-EG", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : notif.timestamp || "";
                      const isUnread = notif.isRead === false || notif.read === false;

                      return (
                        <div
                          key={notifId}
                          onClick={() => handleNotificationClick(notif)}
                          className={`group relative p-3 rounded-2xl border text-right space-y-1.5 transition-all cursor-pointer hover:scale-[1.01] active:scale-[0.99] ${
                            isUnread
                              ? "bg-orange-500/5 dark:bg-white/10 border-orange-500/20 dark:border-white/15 font-bold shadow-xs hover:border-[#F58220]/40"
                              : "bg-slate-50/70 dark:bg-white/5 border-slate-100 dark:border-white/5 opacity-85 hover:opacity-100 hover:bg-slate-100/80 dark:hover:bg-white/10"
                          }`}
                        >
                          <div className="flex justify-between items-start gap-2 text-xs text-[#0B2D5B] dark:text-white">
                            <div className="flex items-center gap-1.5 flex-1 min-w-0">
                              {isUnread && (
                                <span className="h-2 w-2 rounded-full bg-[#F58220] shrink-0 animate-pulse" />
                              )}
                              <span className="font-extrabold leading-snug truncate group-hover:text-[#F58220] transition-colors">
                                {title}
                              </span>
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                              <span className="text-[10px] font-normal text-slate-400 font-mono">
                                {time}
                              </span>
                              <ExternalLink className="h-3 w-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />

                              {/* Quick Delete */}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (notifId) deleteNotificationMutation.mutate(notifId);
                                }}
                                className="p-1 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all rounded-lg hover:bg-slate-200/50 dark:hover:bg-white/10"
                                title="حذف الإشعار"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          </div>

                          {message && (
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed font-normal">
                              {message}
                            </p>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Teacher Profile Menu */}
          <div className="relative" ref={userRef}>
            <button
              type="button"
              onClick={() => {
                setShowUserMenu((prev) => !prev);
                setShowNotifPopover(false);
                setShowRevenuePopover(false);
              }}
              className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-2xl bg-slate-100/90 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 transition-all border border-slate-200/80 dark:border-white/10 cursor-pointer"
            >
              <div className="relative h-8 w-8 sm:h-9 sm:w-9 rounded-xl overflow-hidden border border-slate-300 dark:border-white/20 shrink-0">
                <Image src={teacherAvatar} alt={teacherName} fill className="object-cover" />
              </div>
              <div className="hidden sm:flex flex-col text-right max-w-[100px]">
                <span className="text-xs font-black text-[#0B2D5B] dark:text-white truncate">
                  {teacherName}
                </span>
                <span className="text-[10px] font-semibold text-[#F58220] truncate">محاضر معتمد</span>
              </div>
              <ChevronDown className="h-4 w-4 text-slate-400 hidden sm:inline shrink-0" />
            </button>

            {/* User Quick Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute left-0 mt-3 w-60 rounded-3xl bg-white dark:bg-[#0F274D] border border-slate-200/80 dark:border-white/10 shadow-2xl p-3 space-y-1.5 z-50 animate-fadeIn text-right dir-rtl">
                <div className="p-3 border-b border-slate-100 dark:border-white/10 mb-1 flex items-center gap-3">
                  <div className="relative h-10 w-10 rounded-xl overflow-hidden border border-[#F58220]/30 shrink-0">
                    <Image src={teacherAvatar} alt={teacherName} fill className="object-cover" />
                  </div>
                  <div className="truncate">
                    <div className="text-xs font-extrabold text-[#0B2D5B] dark:text-white truncate">{teacherName}</div>
                    <div className="text-[10px] text-[#F58220] font-bold flex items-center gap-1">
                      <Sparkles className="h-3 w-3" />
                      <span>حساب مدرس معتمد</span>
                    </div>
                  </div>
                </div>

                <Link
                  href="/teacher/profile"
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <User className="h-4 w-4 text-[#0B2D5B] dark:text-[#F58220]" />
                  <span>تعديل الملف الشخصي</span>
                </Link>

                <Link
                  href="/teacher/withdrawals"
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <CreditCard className="h-4 w-4 text-emerald-500" />
                  <span>المحفظة وسحب الرصيد</span>
                </Link>

                <Link
                  href="/teacher/settings"
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <Settings className="h-4 w-4 text-slate-400" />
                  <span>إعدادات الأمان والحساب</span>
                </Link>

                <div className="border-t border-slate-100 dark:border-white/10 pt-1 mt-1">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full text-right flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>تسجيل الخروج</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Interactive Instant Withdrawal Dialog Modal */}
      {isWithdrawModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4" dir="rtl">
          <div className="bg-white dark:bg-[#0F274D] rounded-3xl max-w-md w-full border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden text-right p-6 space-y-5 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-2xl bg-[#F58220]/10 text-[#F58220]">
                  <CreditCard className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-base font-black text-[#0B2D5B] dark:text-white">تقديم طلب سحب رصيد</h3>
                  <p className="text-xs text-slate-400">تحويل مستحقاتك لحسابك المالي مباشرة</p>
                </div>
              </div>

              <button
                onClick={() => setIsWithdrawModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs flex justify-between items-center font-bold">
              <span className="text-slate-600 dark:text-slate-300">الرصيد المتاح للسحب الآن:</span>
              <span className="font-mono font-black text-emerald-600 dark:text-emerald-400 text-sm">
                {availablePayout.toLocaleString("en-US")} ج.م
              </span>
            </div>

            <form onSubmit={handleWithdrawSubmit} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-extrabold text-slate-700 dark:text-slate-200">طريقة السحب المفضلة:</label>
                <select
                  value={withdrawMethod}
                  onChange={(e) => setWithdrawMethod(e.target.value as WithdrawalMethodType)}
                  className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 font-bold outline-none focus:border-[#F58220]"
                >
                  <option value="Vodafone Cash">فودافون كاش (Vodafone Cash)</option>
                  <option value="InstaPay">إنستا باي (InstaPay)</option>
                  <option value="Bank Transfer">تحويل بنكي (Bank Transfer)</option>
                  <option value="Fawry">فوري (Fawry)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-extrabold text-slate-700 dark:text-slate-200">
                  رقم المحفظة / عنوان الحساب (IPA أو رقم كاش):
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: 01012345678 أو username@instapay"
                  value={accountDetails}
                  onChange={(e) => setAccountDetails(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 font-bold outline-none focus:border-[#F58220]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-extrabold text-slate-700 dark:text-slate-200">المبلغ المطلوب (ج.م):</label>
                <input
                  type="number"
                  required
                  min={100}
                  max={availablePayout > 0 ? availablePayout : 100000}
                  placeholder="أدخل المبلغ (الحد الأدنى 100 ج.م)"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 font-bold outline-none focus:border-[#F58220]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={createWithdrawalMutation.isPending || !withdrawAmount || Number(withdrawAmount) < 100}
                  className="flex-1 h-11 rounded-2xl bg-gradient-to-r from-[#F58220] to-[#FF9A2A] text-white font-black flex items-center justify-center gap-2 shadow-lg shadow-[#F58220]/20 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50"
                >
                  {createWithdrawalMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>إرسال طلب السحب</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setIsWithdrawModalOpen(false)}
                  className="px-4 h-11 rounded-2xl border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}

export default TeacherTopbar;

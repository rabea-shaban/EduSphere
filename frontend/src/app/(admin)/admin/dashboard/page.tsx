"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ShieldCheck,
  Sparkles,
  Users,
  Wallet,
  BookOpen,
  CreditCard,
  UserCheck,
  Activity,
  ArrowLeft,
  Plus,
  Bell,
  Ticket,
  GraduationCap,
  Briefcase,
  DollarSign,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  Search,
  Filter,
  RefreshCw,
  Server,
  Database,
  Cpu,
  AlertCircle,
  FileText,
  TrendingUp,
  Inbox,
  Send,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { toast } from "react-hot-toast";
import adminService, { AdminDashboardResponse } from "@/services/admin.service";
import { Button } from "@/components/ui/button";

function AnimatedNumber({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) {
  const [displayValue, setDisplayValue] = React.useState(0);

  React.useEffect(() => {
    let start = 0;
    const end = Number(value) || 0;
    if (start === end) {
      setDisplayValue(end);
      return;
    }

    const duration = 1000;
    const startTime = performance.now();

    const updateNumber = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(easeProgress * (end - start) + start);
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(updateNumber);
      } else {
        setDisplayValue(end);
      }
    };

    requestAnimationFrame(updateNumber);
  }, [value]);

  return (
    <span>
      {prefix}
      {displayValue.toLocaleString("ar-EG")}
      {suffix}
    </span>
  );
}

export default function AdminDashboardHomePage() {
  const queryClient = useQueryClient();
  
  const [searchTerm, setSearchTerm] = React.useState("");
  const [dateFilter, setDateFilter] = React.useState<"today" | "week" | "month" | "year">("month");

  // Fetch Real Dashboard Data from Backend
  const { data, isLoading, isError, error, refetch } = useQuery<AdminDashboardResponse>({
    queryKey: ["admin", "dashboard", dateFilter],
    queryFn: () => adminService.getDashboardData(),
    refetchInterval: 30000, // auto-refresh every 30s
  });

  // Approve Teacher Application Mutation
  const approveTeacherMutation = useMutation({
    mutationFn: (id: string) => adminService.approveTeacher(id),
    onSuccess: () => {
      toast.success("تم التوافق واعتتماد المعلم بنجاح 🎉");
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "حدث خطأ أثناء اعتماد المعلم.");
    },
  });

  // Reject Teacher Application Mutation
  const rejectTeacherMutation = useMutation({
    mutationFn: (id: string) => adminService.rejectTeacher(id),
    onSuccess: () => {
      toast.success("تم إرسال قرار عدم القبول للمعلم.");
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "حدث خطأ أثناء تنفيذ الإجراء.");
    },
  });

  // Approve Payment Mutation
  const approvePaymentMutation = useMutation({
    mutationFn: (id: string) => adminService.approvePayment(id),
    onSuccess: () => {
      toast.success("تم تفعيل الاشتراك وإقرار العملية المالية بنجاح 💵");
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "حدث خطأ أثناء تفعيل المدفوعات.");
    },
  });

  // Filtered lists based on search term
  const filteredApplications = React.useMemo(() => {
    if (!data?.recentTeacherApplications) return [];
    if (!searchTerm.trim()) return data.recentTeacherApplications;
    const term = searchTerm.toLowerCase();
    return data.recentTeacherApplications.filter(
      (app: any) =>
        app.fullName?.toLowerCase().includes(term) ||
        app.subject?.toLowerCase().includes(term) ||
        app.stage?.toLowerCase().includes(term)
    );
  }, [data?.recentTeacherApplications, searchTerm]);

  // SKELETON LOADING STATE
  if (isLoading) {
    return (
      <div className="space-y-8 text-right" dir="rtl">
        {/* Banner Skeleton */}
        <div className="h-44 w-full rounded-3xl bg-slate-200 dark:bg-white/10 animate-pulse" />

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-32 rounded-3xl bg-slate-200 dark:bg-white/10 animate-pulse" />
          ))}
        </div>

        {/* Chart & Side Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-80 rounded-3xl bg-slate-200 dark:bg-white/10 animate-pulse" />
          <div className="h-80 rounded-3xl bg-slate-200 dark:bg-white/10 animate-pulse" />
        </div>
      </div>
    );
  }

  // ERROR STATE
  if (isError || !data) {
    return (
      <div className="p-12 text-center bg-white dark:bg-[#0F274D] rounded-3xl border border-rose-200 dark:border-rose-900/40 shadow-xl space-y-4" dir="rtl">
        <div className="h-16 w-16 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mx-auto">
          <AlertCircle className="h-8 w-8" />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-black text-[#0B2D5B] dark:text-white">
            فشل تحميل بيانات لوحة التحكم
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {error instanceof Error ? error.message : "يرجى التأكد من اتصال الخادم وإعادة المحاولة."}
          </p>
        </div>
        <Button onClick={() => refetch()} className="bg-[#0B2D5B] hover:bg-[#1E73D8] text-white rounded-xl text-xs font-bold gap-2">
          <RefreshCw className="h-4 w-4" />
          <span>إعادة المحاولة</span>
        </Button>
      </div>
    );
  }

  const { welcome, statistics, analyticsCharts, recentTeacherApplications, recentPayments, recentUsers, todoPanel = { pendingTeacherApps: 0, pendingPayments: 0, pendingWithdrawRequests: 0, pendingCourseReviews: 0 }, systemHealth, notifications } = data;

  return (
    <div className="space-y-8 text-right transition-colors" dir="rtl">
      
      {/* ========================================================== */}
      {/* 1. WELCOME HERO SECTION */}
      {/* ========================================================== */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#0B2D5B] via-[#071C3B] to-[#1E73D8] text-white shadow-2xl overflow-hidden"
      >
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-[#F58220]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-[#F58220]/20 border border-[#F58220]/40 text-[#F58220] px-3.5 py-1 rounded-full text-xs font-black">
              <ShieldCheck className="h-4 w-4" />
              <span>لوحة التحكم الرئيسية للمشرف العام</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-snug">
              مرحباً بعودتك، {welcome.adminName} 👋
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-blue-100/90 font-medium">
              <span>📅 {welcome.currentDate}</span>
              <span>🔒 التخصيص: <strong className="text-[#F58220]">{welcome.role}</strong></span>
              {welcome.lastLogin && (
                <span>🕒 آخر دخول: {new Date(welcome.lastLogin).toLocaleTimeString("ar-EG")}</span>
              )}
            </div>
          </div>

          {/* Date Filter & Refresh CTA */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <div className="flex bg-white/10 backdrop-blur-md p-1 rounded-2xl border border-white/20 text-xs font-bold">
              {(["today", "week", "month", "year"] as const).map((filterKey) => (
                <button
                  key={filterKey}
                  onClick={() => setDateFilter(filterKey)}
                  className={`px-3 py-1.5 rounded-xl transition-all ${
                    dateFilter === filterKey
                      ? "bg-[#F58220] text-white shadow-md"
                      : "text-blue-100 hover:text-white"
                  }`}
                >
                  {filterKey === "today" && "اليوم"}
                  {filterKey === "week" && "هذا الأسبوع"}
                  {filterKey === "month" && "هذا الشهر"}
                  {filterKey === "year" && "هذه السنة"}
                </button>
              ))}
            </div>

            <Button
              onClick={() => refetch()}
              variant="outline"
              size="icon"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-xl"
              title="تحديث البيانات"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </motion.div>

      {/* ========================================================== */}
      {/* 2. QUICK ACTIONS BAR */}
      {/* ========================================================== */}
      <div className="space-y-3">
        <h2 className="text-sm font-black text-slate-700 dark:text-slate-200">
          إجراءات سريعة ومباشرة 🚀
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          <Link
            href="/teacher/courses/create"
            className="p-3 rounded-2xl bg-white dark:bg-[#0F274D] border border-slate-200/80 dark:border-white/10 shadow-sm hover:border-[#F58220] transition-colors text-center space-y-1.5 group"
          >
            <div className="h-9 w-9 rounded-xl bg-[#F58220]/10 text-[#F58220] flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
              <Plus className="h-5 w-5" />
            </div>
            <span className="text-xs font-extrabold text-[#0B2D5B] dark:text-white block">إضافة كورس</span>
          </Link>

          <Link
            href="/admin/teachers"
            className="p-3 rounded-2xl bg-white dark:bg-[#0F274D] border border-slate-200/80 dark:border-white/10 shadow-sm hover:border-[#F58220] transition-colors text-center space-y-1.5 group"
          >
            <div className="h-9 w-9 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
              <Briefcase className="h-5 w-5" />
            </div>
            <span className="text-xs font-extrabold text-[#0B2D5B] dark:text-white block">طلبات المعلمين</span>
          </Link>

          <Link
            href="/admin/notifications"
            className="p-3 rounded-2xl bg-white dark:bg-[#0F274D] border border-slate-200/80 dark:border-white/10 shadow-sm hover:border-[#F58220] transition-colors text-center space-y-1.5 group"
          >
            <div className="h-9 w-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
              <Send className="h-5 w-5" />
            </div>
            <span className="text-xs font-extrabold text-[#0B2D5B] dark:text-white block">إرسال إشعار</span>
          </Link>

          <Link
            href="/admin/coupons"
            className="p-3 rounded-2xl bg-white dark:bg-[#0F274D] border border-slate-200/80 dark:border-white/10 shadow-sm hover:border-[#F58220] transition-colors text-center space-y-1.5 group"
          >
            <div className="h-9 w-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
              <Ticket className="h-5 w-5" />
            </div>
            <span className="text-xs font-extrabold text-[#0B2D5B] dark:text-white block">إضافة كوبون</span>
          </Link>

          <Link
            href="/admin/students"
            className="p-3 rounded-2xl bg-white dark:bg-[#0F274D] border border-slate-200/80 dark:border-white/10 shadow-sm hover:border-[#F58220] transition-colors text-center space-y-1.5 group"
          >
            <div className="h-9 w-9 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
              <GraduationCap className="h-5 w-5" />
            </div>
            <span className="text-xs font-extrabold text-[#0B2D5B] dark:text-white block">إدارة الطلاب</span>
          </Link>

          <Link
            href="/admin/teachers"
            className="p-3 rounded-2xl bg-white dark:bg-[#0F274D] border border-slate-200/80 dark:border-white/10 shadow-sm hover:border-[#F58220] transition-colors text-center space-y-1.5 group"
          >
            <div className="h-9 w-9 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
              <UserCheck className="h-5 w-5" />
            </div>
            <span className="text-xs font-extrabold text-[#0B2D5B] dark:text-white block">إدارة المعلمين</span>
          </Link>

          <Link
            href="/admin/payments"
            className="p-3 rounded-2xl bg-white dark:bg-[#0F274D] border border-slate-200/80 dark:border-white/10 shadow-sm hover:border-[#F58220] transition-colors text-center space-y-1.5 group"
          >
            <div className="h-9 w-9 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
              <Wallet className="h-5 w-5" />
            </div>
            <span className="text-xs font-extrabold text-[#0B2D5B] dark:text-white block">إدارة المدفوعات</span>
          </Link>
        </div>
      </div>

      {/* ========================================================== */}
      {/* 3. REAL STATISTICS CARDS GRID */}
      {/* ========================================================== */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-[#0B2D5B] dark:text-white flex items-center gap-2">
            <span>مؤشرات الأداء والإحصائيات المباشرة</span>
            <span className="text-xs bg-[#F58220]/10 text-[#F58220] px-2.5 py-0.5 rounded-full font-bold">تفاعلية ✨</span>
          </h2>
          <span className="text-xs text-slate-400">انقر على أي كارت للتنقل المباشر التفصيلي</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          
          {/* Card 1: Total Students */}
          <Link href="/admin/students">
            <motion.div
              whileHover={{ y: -4, scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="bg-white dark:bg-[#0F274D] p-5 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm space-y-3 hover:border-[#1E73D8] hover:shadow-lg hover:shadow-[#1E73D8]/10 cursor-pointer transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">عدد الطلاب</span>
                <div className="h-9 w-9 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                  <Users className="h-5 w-5" />
                </div>
              </div>
              <div>
                <div className="text-2xl font-black text-[#0B2D5B] dark:text-white font-mono">
                  <AnimatedNumber value={statistics.totalStudents} />
                </div>
                <div className="text-[11px] text-emerald-500 font-bold mt-1 flex items-center gap-1">
                  <TrendingUp className="h-3.5 w-3.5" />
                  <span>+12.4% نمو إيجابي</span>
                </div>
              </div>
            </motion.div>
          </Link>

          {/* Card 2: Total Teachers */}
          <Link href="/admin/teachers">
            <motion.div
              whileHover={{ y: -4, scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="bg-white dark:bg-[#0F274D] p-5 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm space-y-3 hover:border-purple-500 hover:shadow-lg hover:shadow-purple-500/10 cursor-pointer transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">عدد المعلمين</span>
                <div className="h-9 w-9 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
                  <UserCheck className="h-5 w-5" />
                </div>
              </div>
              <div>
                <div className="text-2xl font-black text-[#0B2D5B] dark:text-white font-mono">
                  <AnimatedNumber value={statistics.totalTeachers} />
                </div>
                <div className="text-[11px] text-emerald-500 font-bold mt-1 flex items-center gap-1">
                  <TrendingUp className="h-3.5 w-3.5" />
                  <span>+8.2% نمو شهري</span>
                </div>
              </div>
            </motion.div>
          </Link>

          {/* Card 3: Pending Join Apps */}
          <Link href="/admin/teachers">
            <motion.div
              whileHover={{ y: -4, scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="bg-white dark:bg-[#0F274D] p-5 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm space-y-3 hover:border-[#F58220] hover:shadow-lg hover:shadow-[#F58220]/10 cursor-pointer transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">طلبات الانضمام</span>
                <div className="h-9 w-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                  <Clock className="h-5 w-5" />
                </div>
              </div>
              <div>
                <div className="text-2xl font-black text-[#F58220] font-mono">
                  <AnimatedNumber value={statistics.pendingTeacherApps} />
                </div>
                <div className="text-[11px] text-amber-600 dark:text-amber-400 font-bold mt-1">
                  بانتظار الفحص والاعتماد
                </div>
              </div>
            </motion.div>
          </Link>

          {/* Card 4: Total Courses */}
          <Link href="/admin/courses">
            <motion.div
              whileHover={{ y: -4, scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="bg-white dark:bg-[#0F274D] p-5 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm space-y-3 hover:border-indigo-500 hover:shadow-lg hover:shadow-indigo-500/10 cursor-pointer transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">عدد الكورسات</span>
                <div className="h-9 w-9 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                  <BookOpen className="h-5 w-5" />
                </div>
              </div>
              <div>
                <div className="text-2xl font-black text-[#0B2D5B] dark:text-white font-mono">
                  <AnimatedNumber value={statistics.totalCourses} />
                </div>
                <div className="text-[11px] text-slate-400 font-bold mt-1">
                  {statistics.publishedCourses} منشور / مفعل
                </div>
              </div>
            </motion.div>
          </Link>

          {/* Card 5: Total Revenue */}
          <Link href="/admin/payments">
            <motion.div
              whileHover={{ y: -4, scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="bg-white dark:bg-[#0F274D] p-5 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm space-y-3 hover:border-emerald-500 hover:shadow-lg hover:shadow-emerald-500/10 cursor-pointer transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">إجمالي الإيرادات</span>
                <div className="h-9 w-9 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                  <Wallet className="h-5 w-5" />
                </div>
              </div>
              <div>
                <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                  <AnimatedNumber value={statistics.totalRevenue} suffix=" ج.م" />
                </div>
                <div className="text-[11px] text-emerald-500 font-bold mt-1 flex items-center gap-1">
                  <TrendingUp className="h-3.5 w-3.5" />
                  <span>تحصيل مباشر معتمد</span>
                </div>
              </div>
            </motion.div>
          </Link>

        </div>
      </div>

      {/* ========================================================== */}
      {/* 4. ANALYTICS CHARTS & TODO PANEL */}
      {/* ========================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Main Growth Analytics Chart (8 cols) */}
        <div className="lg:col-span-8 bg-white dark:bg-[#0F274D] p-6 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="text-base font-extrabold text-[#0B2D5B] dark:text-white flex items-center gap-2">
                <Activity className="h-5 w-5 text-[#F58220]" />
                <span>نمو المستخدمين والإيرادات الشهرية</span>
              </h3>
              <p className="text-xs text-slate-400">إحصائيات مجمعة من قاعدة البيانات خلال 6 أشهر</p>
            </div>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analyticsCharts.monthlyGrowth}>
                <defs>
                  <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1E73D8" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#1E73D8" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F58220" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#F58220" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} />
                <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0F274D",
                    borderColor: "rgba(255,255,255,0.1)",
                    borderRadius: "16px",
                    color: "#fff",
                  }}
                />
                <Legend />
                <Area type="monotone" dataKey="students" name="الطلاب الجدد" stroke="#1E73D8" fillOpacity={1} fill="url(#colorStudents)" />
                <Area type="monotone" dataKey="revenue" name="الإيرادات (ج.م)" stroke="#F58220" fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* TODO & Actionable Items Panel (4 cols) */}
        <div className="lg:col-span-4 bg-white dark:bg-[#0F274D] p-6 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm space-y-5">
          <div className="space-y-1">
            <h3 className="text-base font-extrabold text-[#0B2D5B] dark:text-white flex items-center gap-2">
              <Inbox className="h-5 w-5 text-purple-500" />
              <span>مهام بانتظار الإجراء 📋</span>
            </h3>
            <p className="text-xs text-slate-400">قائمة المهام العاجلة لتنفيذ الإدارة</p>
          </div>

          <div className="space-y-3">
            <Link
              href="/admin/teachers"
              className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/30 flex items-center justify-between text-xs transition-transform hover:-translate-y-0.5"
            >
              <div className="space-y-0.5">
                <span className="font-extrabold text-amber-800 dark:text-amber-200 block">طلبات اعتماد معلمين جديدة</span>
                <span className="text-[11px] text-amber-600 dark:text-amber-400">تتطلب فحص الملفات والسيرة الذاتية</span>
              </div>
              <span className="h-7 w-7 rounded-full bg-amber-500 text-white font-black flex items-center justify-center text-xs">
                {todoPanel.pendingTeacherApps}
              </span>
            </Link>

            <Link
              href="/admin/payments"
              className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/30 flex items-center justify-between text-xs transition-transform hover:-translate-y-0.5"
            >
              <div className="space-y-0.5">
                <span className="font-extrabold text-rose-800 dark:text-rose-200 block">إيصالات دفع قيد المراجعة</span>
                <span className="text-[11px] text-rose-600 dark:text-rose-400">فحص التحويلات البنكية والمحافظ</span>
              </div>
              <span className="h-7 w-7 rounded-full bg-rose-500 text-white font-black flex items-center justify-center text-xs">
                {todoPanel.pendingPayments}
              </span>
            </Link>

            <Link
              href="/admin/courses"
              className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/30 flex items-center justify-between text-xs transition-transform hover:-translate-y-0.5"
            >
              <div className="space-y-0.5">
                <span className="font-extrabold text-blue-800 dark:text-blue-200 block">كورسات بانتظار الاعتماد</span>
                <span className="text-[11px] text-blue-600 dark:text-blue-400">مراجعة المحتوى والدروس المرفوعة</span>
              </div>
              <span className="h-7 w-7 rounded-full bg-blue-500 text-white font-black flex items-center justify-center text-xs">
                {todoPanel.pendingCourseReviews}
              </span>
            </Link>
          </div>
        </div>

      </div>

      {/* ========================================================== */}
      {/* 5. RECENT TEACHER APPLICATIONS & SEARCH BAR */}
      {/* ========================================================== */}
      <div className="bg-white dark:bg-[#0F274D] p-6 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-extrabold text-[#0B2D5B] dark:text-white flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-purple-500" />
              <span>أحدث طلبات انضمام المعلمين</span>
            </h3>
            <p className="text-xs text-slate-400">يمكنك مراجعة الطلبات واعتمادها أو رفضها مباشرة</p>
          </div>

          <div className="relative w-full sm:w-72">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="البحث بالاسم أو المادة..."
              className="w-full h-10 pr-9 pl-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs outline-none focus:border-[#F58220]"
            />
            <Search className="h-4 w-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
          </div>
        </div>

        {/* Table / List */}
        {filteredApplications.length === 0 ? (
          <div className="p-8 text-center border border-dashed border-slate-200 dark:border-white/10 rounded-2xl space-y-2">
            <Inbox className="h-8 w-8 text-slate-400 mx-auto" />
            <p className="text-xs text-slate-500 font-bold">لا توجد طلبات انضمام حالياً مطابقة للبحث</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-white/10 text-slate-400 font-bold">
                  <th className="pb-3">الاسم الكامل</th>
                  <th className="pb-3">المادة والتخصص</th>
                  <th className="pb-3">المرحلة التعليمية</th>
                  <th className="pb-3">تاريخ التقديم</th>
                  <th className="pb-3">الحالة</th>
                  <th className="pb-3 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {filteredApplications.map((app: any) => (
                  <tr key={app._id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02]">
                    <td className="py-3.5 font-extrabold text-[#0B2D5B] dark:text-white">
                      {app.fullName}
                    </td>
                    <td className="py-3.5 font-bold text-[#F58220]">{app.subject}</td>
                    <td className="py-3.5 text-slate-600 dark:text-slate-300">{app.stage}</td>
                    <td className="py-3.5 text-slate-400">
                      {new Date(app.createdAt).toLocaleDateString("ar-EG")}
                    </td>
                    <td className="py-3.5">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          app.status === "Approved"
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            : app.status === "Rejected"
                            ? "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                            : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                        }`}
                      >
                        {app.status === "Approved" && "مقبول ✓"}
                        {app.status === "Rejected" && "مقتصر ❌"}
                        {app.status !== "Approved" && app.status !== "Rejected" && "قيد المراجعة ⏳"}
                      </span>
                    </td>
                    <td className="py-3.5 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          href={`/admin/teachers`}
                          className="p-1.5 rounded-lg bg-slate-100 dark:bg-white/10 hover:bg-slate-200 text-slate-600 dark:text-slate-200"
                          title="عرض التفاصيل"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </Link>
                        {app.status !== "Approved" && (
                          <button
                            onClick={() => approveTeacherMutation.mutate(app._id)}
                            disabled={approveTeacherMutation.isPending}
                            className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20"
                            title="اعتماد"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                        {app.status !== "Rejected" && (
                          <button
                            onClick={() => rejectTeacherMutation.mutate(app._id)}
                            disabled={rejectTeacherMutation.isPending}
                            className="p-1.5 rounded-lg bg-rose-500/10 text-rose-600 hover:bg-rose-500/20"
                            title="رفض"
                          >
                            <XCircle className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ========================================================== */}
      {/* 6. RECENT PAYMENTS & SYSTEM HEALTH GRID */}
      {/* ========================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Recent Payments (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-[#0F274D] p-6 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-[#0B2D5B] dark:text-white flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-[#F58220]" />
              <span>أحدث المدفوعات والتحويلات المالية</span>
            </h3>
            <Link href="/admin/payments" className="text-xs font-bold text-[#F58220] hover:underline">
              عرض الكل
            </Link>
          </div>

          {recentPayments.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-slate-200 dark:border-white/10 rounded-2xl">
              <p className="text-xs text-slate-400">لا توجد عمليات دفع مسجلة مؤخراً</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentPayments.map((pay: any) => (
                <div
                  key={pay._id}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5">
                    <span className="font-extrabold text-[#0B2D5B] dark:text-white block">
                      {pay.userId?.firstName || "طالب"} ({pay.courseId?.title || "كورس تعليمي"})
                    </span>
                    <span className="text-[11px] text-slate-400">
                      طريقة الدفع: {pay.paymentMethod || "InstaPay"} • {new Date(pay.createdAt).toLocaleDateString("ar-EG")}
                    </span>
                  </div>

                  <div className="text-left space-y-1">
                    <span className="font-black text-emerald-600 dark:text-emerald-400 font-mono block">
                      +{pay.amount} ج.م
                    </span>
                    {pay.status === "Pending" ? (
                      <button
                        onClick={() => approvePaymentMutation.mutate(pay._id)}
                        disabled={approvePaymentMutation.isPending}
                        className="px-2.5 py-1 rounded-lg bg-emerald-500 text-white font-bold text-[10px]"
                      >
                        اعتماد الدفع
                      </button>
                    ) : (
                      <span className="text-[10px] text-emerald-500 font-bold">مكتمل ✓</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* System Health (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-[#0F274D] p-6 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm space-y-4">
          <div className="space-y-1">
            <h3 className="text-base font-extrabold text-[#0B2D5B] dark:text-white flex items-center gap-2">
              <Server className="h-5 w-5 text-emerald-500" />
              <span>صحة واستقرار الخادم (System Health)</span>
            </h3>
            <p className="text-xs text-slate-400">مؤشرات الأداء المباشرة للسيرفر وقاعدة البيانات</p>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-emerald-500" />
                <span className="font-bold text-slate-700 dark:text-slate-200">حالة قاعدة البيانات:</span>
              </div>
              <span className="font-extrabold text-emerald-500">{systemHealth.dbStatus}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cpu className="h-4 w-4 text-blue-500" />
                <span className="font-bold text-slate-700 dark:text-slate-200">استهلاك الذاكرة العشوائية:</span>
              </div>
              <span className="font-mono font-bold text-[#0B2D5B] dark:text-white">{systemHealth.memoryUsageMB}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-amber-500" />
                <span className="font-bold text-slate-700 dark:text-slate-200">نسبة استقرار التشغيل (Uptime):</span>
              </div>
              <span className="font-mono font-bold text-emerald-500">{systemHealth.uptimeFormatted}</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}

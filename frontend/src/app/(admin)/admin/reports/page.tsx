"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Users,
  GraduationCap,
  BookOpen,
  Award,
  FileSpreadsheet,
  RefreshCw,
  AlertCircle,
  Calendar,
  Layers,
  PieChart,
  ShieldCheck,
  CheckCircle2,
  Printer,
  Sparkles,
} from "lucide-react";
import { toast } from "react-hot-toast";
import adminReportService, { ReportsDashboardData } from "@/services/adminReport.service";
import { Button } from "@/components/ui/button";

export default function AdminReportsPage() {
  const [activeTab, setActiveTab] = React.useState<"overview" | "revenue" | "students" | "teachers" | "courses">("overview");
  const [dateRange, setDateRange] = React.useState("Last 30 Days");

  const { data, isLoading, isError, refetch } = useQuery<ReportsDashboardData>({
    queryKey: ["admin", "reports-dashboard"],
    queryFn: () => adminReportService.getReportsDashboard(),
  });

  const summary = data?.summary || {
    totalRevenue: 0,
    totalStudents: 0,
    totalTeachers: 0,
    totalCourses: 0,
    totalEnrollments: 0,
    completedEnrollments: 0,
    completionRate: "0%",
    pendingPaymentsCount: 0,
    completedWithdrawals: 0,
    certificatesIssued: 0,
  };

  const monthlyRevenueTrend = data?.monthlyRevenueTrend || [];
  const paymentMethodsDistribution = data?.paymentMethodsDistribution || [];
  const topCourses = data?.topCourses || [];
  const topTeachers = data?.topTeachers || [];

  // Print & PDF Export
  const handlePrint = () => {
    window.print();
  };

  // Export Summary CSV
  const exportToCSV = () => {
    const headers = ["المؤشر الإحصائي", "القيمة الإجمالية"];
    const rows = [
      ["إجمالي تحصيلات الإيرادات", `${summary.totalRevenue} ج.م`],
      ["إجمالي الطلاب المسجلين", summary.totalStudents],
      ["إجمالي المعلمين المحاضرين", summary.totalTeachers],
      ["إجمالي الكورسات بالمنصة", summary.totalCourses],
      ["إجمالي الاشتراكات والتحاقات الكورسات", summary.totalEnrollments],
      ["معدل الإكمال الأكاديمي", summary.completionRate],
      ["إجمالي سحوبات المعلمين المدفوعة", `${summary.completedWithdrawals} ج.م`],
      ["الشهادات الصادرة", summary.certificatesIssued],
    ];

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `edusphere_analytics_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("تم تصدير تقرير التحليلات الشامل بنجاح.");
  };

  return (
    <div className="space-y-6 text-right transition-colors" dir="rtl">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-[#0F274D] p-6 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm print:hidden">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 bg-[#F58220]/10 text-[#F58220] px-3 py-1 rounded-full text-xs font-black">
            <BarChart3 className="h-4 w-4" />
            <span>نظام التقارير والذكاء الأكاديمي والمالي الشامل</span>
          </div>
          <h1 className="text-2xl font-black text-[#0B2D5B] dark:text-white">
            مركز التقارير والتحليلات البيانية
          </h1>
          <p className="text-xs text-slate-500">
            متابعة نمو المنصة، الإيرادات المالية، المعدلات الأكاديمية، والتحليلات اللحظية.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Date Filter */}
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="h-10 px-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold outline-none focus:border-[#F58220]"
          >
            <option value="Last 7 Days">آخر 7 أيام</option>
            <option value="Last 30 Days">آخر 30 يوم</option>
            <option value="Last 90 Days">آخر 90 يوم</option>
            <option value="This Year">العام الحالي</option>
          </select>

          <Button
            onClick={exportToCSV}
            variant="outline"
            className="rounded-xl border-slate-200 dark:border-white/10 text-xs font-bold gap-2"
          >
            <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
            <span>تصدير (CSV)</span>
          </Button>

          <Button
            onClick={handlePrint}
            variant="outline"
            className="rounded-xl border-slate-200 dark:border-white/10 text-xs font-bold gap-2"
          >
            <Printer className="h-4 w-4 text-slate-600 dark:text-slate-300" />
            <span>طباعة (PDF)</span>
          </Button>

          <Button
            onClick={() => refetch()}
            variant="outline"
            size="icon"
            className="rounded-xl border-slate-200 dark:border-white/10"
            title="تحديث البيانات"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Summary Metrics Grid (4 Main KPI Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Total Revenue */}
        <div className="bg-white dark:bg-[#0F274D] p-5 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>إجمالي تحصيلات المنصة</span>
            <DollarSign className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
            {summary.totalRevenue.toLocaleString()} ج.م
          </div>
          <span className="text-[11px] text-emerald-500 font-bold block">تحصيل مالي مؤكد</span>
        </div>

        {/* Card 2: Total Students */}
        <div className="bg-white dark:bg-[#0F274D] p-5 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>إجمالي الطلاب المسجلين</span>
            <GraduationCap className="h-4 w-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-black text-[#0B2D5B] dark:text-white font-mono">
            {summary.totalStudents} طالب
          </div>
          <span className="text-[11px] text-indigo-500 font-bold block">نمو تفاعلي دائم</span>
        </div>

        {/* Card 3: Completion Rate */}
        <div className="bg-white dark:bg-[#0F274D] p-5 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>نسبة إكمال المناهج</span>
            <CheckCircle2 className="h-4 w-4 text-purple-500" />
          </div>
          <div className="text-2xl font-black text-purple-600 dark:text-purple-400 font-mono">
            {summary.completionRate}
          </div>
          <span className="text-[11px] text-purple-500 font-bold block">من أصل {summary.totalEnrollments} اشتراك</span>
        </div>

        {/* Card 4: Certificates Issued */}
        <div className="bg-white dark:bg-[#0F274D] p-5 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>الشهادات الصادرة</span>
            <Award className="h-4 w-4 text-[#F58220]" />
          </div>
          <div className="text-2xl font-black text-[#F58220] font-mono">
            {summary.certificatesIssued} شهادة
          </div>
          <span className="text-[11px] text-slate-400 font-bold block">شهادات إتمام موثقة</span>
        </div>

      </div>

      {/* Visual Analytics Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Revenue Trend Chart Visualizer */}
        <div className="lg:col-span-2 bg-white dark:bg-[#0F274D] p-6 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-[#0B2D5B] dark:text-white flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-500" />
              <span>مؤشر نمو الإيرادات المالية التراكمية (الأشهر الأخيرة)</span>
            </h3>
          </div>

          {monthlyRevenueTrend.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-slate-200 dark:border-white/10 rounded-2xl">
              <p className="text-xs text-slate-400 font-bold">لا توجد عمليات بيع مسجلة حالياً لعرض الرسم البياني</p>
            </div>
          ) : (
            <div className="space-y-4 pt-2">
              {monthlyRevenueTrend.map((item, idx) => {
                const maxRev = Math.max(...monthlyRevenueTrend.map((m) => m.revenue || 1), 1);
                const percent = Math.round((item.revenue / maxRev) * 100);

                return (
                  <div key={idx} className="space-y-1.5 text-xs font-bold">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-700 dark:text-slate-300">{item.month}</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-mono">
                        {item.revenue.toLocaleString()} ج.م ({item.sales} عمليات بيع)
                      </span>
                    </div>
                    <div className="h-3 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percent}%` }}
                        transition={{ duration: 0.8 }}
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Payment Methods Distribution */}
        <div className="bg-white dark:bg-[#0F274D] p-6 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm space-y-4">
          <h3 className="text-sm font-extrabold text-[#0B2D5B] dark:text-white flex items-center gap-2">
            <PieChart className="h-4 w-4 text-indigo-500" />
            <span>توزيع وسائل التحصيل المالي</span>
          </h3>

          {paymentMethodsDistribution.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-slate-200 dark:border-white/10 rounded-2xl">
              <p className="text-xs text-slate-400 font-bold">لا توجد بيانات توزيع متاحة</p>
            </div>
          ) : (
            <div className="space-y-3 pt-2">
              {paymentMethodsDistribution.map((m, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 flex items-center justify-between text-xs font-bold"
                >
                  <span className="text-slate-800 dark:text-slate-200">{m.method}</span>
                  <div className="text-right">
                    <span className="text-emerald-600 dark:text-emerald-400 font-mono block">
                      {m.total.toLocaleString()} ج.م
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">({m.count} عملية)</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Top Performing Tables Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Top 5 Courses */}
        <div className="bg-white dark:bg-[#0F274D] p-6 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm space-y-4">
          <h3 className="text-sm font-extrabold text-[#0B2D5B] dark:text-white flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-[#F58220]" />
            <span>أكثر الكورسات مبيعاً وإقبالاً بالمنصة</span>
          </h3>

          <div className="space-y-3">
            {topCourses.map((c, idx) => (
              <div
                key={c._id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 flex items-center justify-between text-xs"
              >
                <div className="space-y-0.5">
                  <span className="font-extrabold text-[#0B2D5B] dark:text-white block line-clamp-1">
                    #{idx + 1} {c.title}
                  </span>
                  <span className="text-[10px] text-[#F58220] font-bold">المحاضر: {c.teacherName}</span>
                </div>
                <div className="text-right font-bold">
                  <span className="text-indigo-600 dark:text-indigo-400 font-mono block">
                    {c.studentsCount} طالب
                  </span>
                  <span className="text-[10px] text-slate-400">السعر: {c.price} ج.م</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top 5 Teachers */}
        <div className="bg-white dark:bg-[#0F274D] p-6 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm space-y-4">
          <h3 className="text-sm font-extrabold text-[#0B2D5B] dark:text-white flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-purple-500" />
            <span>أبرز المعلمين والمحاضرين تفاعلاً</span>
          </h3>

          <div className="space-y-3">
            {topTeachers.map((t, idx) => (
              <div
                key={t._id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 flex items-center justify-between text-xs"
              >
                <div className="space-y-0.5">
                  <span className="font-extrabold text-[#0B2D5B] dark:text-white block">
                    #{idx + 1} {t.fullName}
                  </span>
                  <span className="text-[10px] text-slate-400 dir-ltr text-right block">{t.email}</span>
                </div>
                <div className="text-right font-bold">
                  <span className="text-emerald-600 dark:text-emerald-400 font-mono block">
                    {t.studentsCount} طالب
                  </span>
                  <span className="text-[10px] text-purple-600 font-bold">{t.coursesCount} كورسات</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}

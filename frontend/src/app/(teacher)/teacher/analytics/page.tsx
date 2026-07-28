"use client";

import * as React from "react";
import {
  BarChart3,
  Sparkles,
  TrendingUp,
  Users,
  DollarSign,
  Award,
  BookOpen,
  FileCheck2,
  RefreshCw,
} from "lucide-react";
import {
  useDashboardAnalytics,
  useCourseAnalytics,
  useTeacherQuizAnalytics,
  useTeacherAssignmentAnalytics,
  useChartAnalytics,
} from "@/hooks/useTeacherAnalytics";
import type { AnalyticsFilters } from "@/features/teacher/types/analytics";
import { AnalyticsSkeleton } from "@/features/teacher/components/analytics/analytics-skeleton";
import { AnalyticsEmptyState } from "@/features/teacher/components/analytics/analytics-empty-state";
import { AnalyticsStatCard } from "@/features/teacher/components/analytics/analytics-stat-card";
import {
  RevenueLineChart,
  StudentBarChart,
  PassRateDonutChart,
} from "@/features/teacher/components/analytics/analytics-charts";
import { AnalyticsDateFilter } from "@/features/teacher/components/analytics/analytics-date-filter";
import { AnalyticsExportBar } from "@/features/teacher/components/analytics/analytics-export-bar";

export default function InstructorAnalyticsPage() {
  const [filters, setFilters] = React.useState<AnalyticsFilters>({ period: "30days" });
  const [activeTab, setActiveTab] = React.useState<"overview" | "courses" | "quizzes" | "assignments">("overview");

  const { data: dashboard, isLoading: isDashLoading, refetch: refetchDash } = useDashboardAnalytics(filters);
  const { data: courses, isLoading: isCoursesLoading } = useCourseAnalytics(filters);
  const { data: quizzes, isLoading: isQuizzesLoading } = useTeacherQuizAnalytics(filters);
  const { data: assignments, isLoading: isAssignmentsLoading } = useTeacherAssignmentAnalytics(filters);
  const { data: charts, isLoading: isChartsLoading } = useChartAnalytics(filters);

  const isLoading = isDashLoading || isChartsLoading;

  return (
    <div className="space-y-6 text-right dir-rtl max-w-6xl mx-auto pb-12">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-2xl bg-indigo-500/10 text-indigo-500">
              <Sparkles className="h-5 w-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#0B2D5B] dark:text-white">
              لوحة تحليلات وإحصائيات المحاضر 📊
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            رؤية متكاملة وتحليلات فورية لأداء الكورسات، تفاعل الطلاب، نتائج الاختبارات والواجبات، ونمو الأرباح
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => refetchDash()}
            className="p-2.5 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F274D] text-slate-600 dark:text-slate-200 hover:border-[#F58220] transition-colors cursor-pointer"
            title="تحديث البيانات"
            aria-label="تحديث"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </button>
          <AnalyticsExportBar reportTitle="تقارير_تحليلات_إيدوسفير" />
        </div>
      </div>

      {/* Date Range Filter Bar */}
      <AnalyticsDateFilter filters={filters} onChange={setFilters} />

      {/* Main Stats Cards Grid */}
      {isLoading ? (
        <AnalyticsSkeleton />
      ) : !dashboard ? (
        <AnalyticsEmptyState />
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <AnalyticsStatCard
              title="صافي إيرادات المحاضر"
              value={`${dashboard.revenue.teacherRevenue.toLocaleString()} ج.م`}
              subtitle={`من أصل ${dashboard.revenue.grossRevenue.toLocaleString()} ج.م إجمالي المبيعات`}
              icon={DollarSign}
              colorScheme="emerald"
              trend={{ value: 14.5, isPositive: true }}
            />

            <AnalyticsStatCard
              title="إجمالي الطلاب المشتركين"
              value={dashboard.students.total}
              subtitle={`${dashboard.students.certificatesIssued} شهادات مكتملة صادرة`}
              icon={Users}
              colorScheme="indigo"
              trend={{ value: 8.2, isPositive: true }}
            />

            <AnalyticsStatCard
              title="نسبة نجاح الاختبارات"
              value={`${dashboard.quizzes.passRate}%`}
              subtitle={`متوسط درجات الاختبارات: ${dashboard.quizzes.averageScore}%`}
              icon={Award}
              colorScheme="amber"
              trend={{ value: 3.1, isPositive: true }}
            />

            <AnalyticsStatCard
              title="متوسط درجات الواجبات"
              value={`${dashboard.assignments.averageScore}%`}
              subtitle={`إجمالي تسليمات الواجبات: ${dashboard.assignments.totalSubmissions}`}
              icon={FileCheck2}
              colorScheme="violet"
            />
          </div>

          {/* Navigation Tabs for Analytical Breakdown */}
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-white/10 pb-2 overflow-x-auto text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTab("overview")}
              className={`px-4 py-2 rounded-xl transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === "overview"
                  ? "bg-[#0B2D5B] dark:bg-[#1E73D8] text-white"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5"
              }`}
            >
              الرسوم البيانية العامة 📈
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("courses")}
              className={`px-4 py-2 rounded-xl transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === "courses"
                  ? "bg-[#0B2D5B] dark:bg-[#1E73D8] text-white"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5"
              }`}
            >
              تحليلات الكورسات 📚
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("quizzes")}
              className={`px-4 py-2 rounded-xl transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === "quizzes"
                  ? "bg-[#0B2D5B] dark:bg-[#1E73D8] text-white"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5"
              }`}
            >
              تحليلات الاختبارات 🎯
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("assignments")}
              className={`px-4 py-2 rounded-xl transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === "assignments"
                  ? "bg-[#0B2D5B] dark:bg-[#1E73D8] text-white"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5"
              }`}
            >
              تحليلات الواجبات 📝
            </button>
          </div>

          {/* Tab Views */}
          {activeTab === "overview" && charts && charts.length > 0 ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <RevenueLineChart data={charts} />
                </div>
                <div>
                  <PassRateDonutChart
                    passRate={dashboard.quizzes.passRate}
                    failRate={100 - dashboard.quizzes.passRate}
                  />
                </div>
              </div>

              <StudentBarChart data={charts} />
            </div>
          ) : activeTab === "courses" && courses ? (
            <div className="p-6 rounded-3xl bg-white dark:bg-[#0F274D] border border-slate-200/80 dark:border-white/10 space-y-4">
              <h3 className="text-sm font-black text-[#0B2D5B] dark:text-white">
                جدول أداء الكورسات ومعدلات الإكمال
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-right">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-white/10 text-slate-400 font-bold">
                      <th className="pb-3">عنوان الكورس</th>
                      <th className="pb-3">الحالة</th>
                      <th className="pb-3">عدد المشتركين</th>
                      <th className="pb-3">المكتملين</th>
                      <th className="pb-3">نسبة الإكمال</th>
                      <th className="pb-3">الإيرادات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                    {courses.map((c) => (
                      <tr key={c._id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                        <td className="py-3 font-bold text-[#0B2D5B] dark:text-white">{c.title}</td>
                        <td className="py-3 font-semibold">
                          <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/10 text-emerald-600 border border-emerald-500/30">
                            {c.status}
                          </span>
                        </td>
                        <td className="py-3 font-bold">{c.studentsCount} طالب</td>
                        <td className="py-3 font-semibold text-emerald-600">{c.completedCount}</td>
                        <td className="py-3 font-black text-indigo-600">{c.completionRate}%</td>
                        <td className="py-3 font-black text-[#0B2D5B] dark:text-white">{c.revenue.toLocaleString()} ج.م</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : activeTab === "quizzes" && quizzes ? (
            <div className="p-6 rounded-3xl bg-white dark:bg-[#0F274D] border border-slate-200/80 dark:border-white/10 space-y-4">
              <h3 className="text-sm font-black text-[#0B2D5B] dark:text-white">
                تفاصيل أداء ودرجات الاختبارات التقييمية
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-800/30">
                  <span className="text-[11px] text-slate-500">إجمالي محاولات الإجابة</span>
                  <p className="text-xl font-black text-[#0B2D5B] dark:text-white mt-1">{quizzes.totalAttempts}</p>
                </div>
                <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-800/30">
                  <span className="text-[11px] text-slate-500">أعلى درجة مسجلة</span>
                  <p className="text-xl font-black text-emerald-600 mt-1">{quizzes.highestScore}%</p>
                </div>
                <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-800/30">
                  <span className="text-[11px] text-slate-500">متوسط الدرجات</span>
                  <p className="text-xl font-black text-[#0B2D5B] dark:text-white mt-1">{quizzes.averageScore}%</p>
                </div>
                <div className="p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-800/30">
                  <span className="text-[11px] text-slate-500">معدل عدم الاجتياز</span>
                  <p className="text-xl font-black text-rose-600 mt-1">{quizzes.failRate}%</p>
                </div>
              </div>
            </div>
          ) : activeTab === "assignments" && assignments ? (
            <div className="p-6 rounded-3xl bg-white dark:bg-[#0F274D] border border-slate-200/80 dark:border-white/10 space-y-4">
              <h3 className="text-sm font-black text-[#0B2D5B] dark:text-white">
                تفاصيل إحصائيات تسليمات وتصحيح الواجبات
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-800/30">
                  <span className="text-[11px] text-slate-500">إجمالي التسليمات</span>
                  <p className="text-xl font-black text-[#0B2D5B] dark:text-white mt-1">{assignments.totalSubmissions}</p>
                </div>
                <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-800/30">
                  <span className="text-[11px] text-slate-500">تسليمات في انتظار التصحيح</span>
                  <p className="text-xl font-black text-amber-600 mt-1">{assignments.pendingReviewCount}</p>
                </div>
                <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-800/30">
                  <span className="text-[11px] text-slate-500">متوسط درجات الطلاب</span>
                  <p className="text-xl font-black text-emerald-600 mt-1">{assignments.averageGrade}%</p>
                </div>
                <div className="p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-800/30">
                  <span className="text-[11px] text-slate-500">معدل التسليم المتأخر</span>
                  <p className="text-xl font-black text-rose-600 mt-1">{assignments.lateSubmissionRate}%</p>
                </div>
              </div>
            </div>
          ) : (
            <AnalyticsEmptyState />
          )}
        </div>
      )}
    </div>
  );
}

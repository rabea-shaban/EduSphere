"use client";

import * as React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  HelpCircle,
  Search,
  RefreshCw,
  Trash2,
  Archive,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Clock,
  BookOpen,
  Users,
  TrendingUp,
  CheckCircle2,
  XCircle,
  ChevronDown,
  BarChart3,
  Target,
  Layers,
  FileQuestion,
  Eye,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import api from "@/services/api";
import type { ApiResponse } from "@/features/dashboard/types/api";

// ─── Types ────────────────────────────────────────────────────────────────────

interface AdminQuizItem {
  _id: string;
  title: string;
  description?: string;
  status: "Draft" | "Published" | "Archived";
  duration: number;
  passingPercentage: number;
  attemptLimit: number;
  totalQuestions: number;
  totalMarks: number;
  shuffleQuestions: boolean;
  negativeMarking: boolean;
  courseId?: { _id: string; title: string; slug: string };
  lessonId?: { _id: string; title: string };
  createdAt: string;
  updatedAt: string;
}

interface QuizzesListResponse {
  quizzes: AdminQuizItem[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

interface QuizAnalytics {
  quizId: string;
  quizTitle: string;
  totalQuestions: number;
  totalMarks: number;
  attemptsCount: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  passCount: number;
  failCount: number;
  passRate: number;
  failureRate: number;
}

// ─── Service ──────────────────────────────────────────────────────────────────

const adminQuizService = {
  async getQuizzes(params: Record<string, any> = {}): Promise<QuizzesListResponse> {
    const res = await api.get<ApiResponse<QuizzesListResponse>>("/teacher/quizzes", { params });
    return res.data.data;
  },
  async deleteQuiz(id: string) { await api.delete(`/teacher/quizzes/${id}`); },
  async publishQuiz(id: string)   { const r = await api.patch<ApiResponse<AdminQuizItem>>(`/teacher/quizzes/${id}/publish`);   return r.data.data; },
  async unpublishQuiz(id: string) { const r = await api.patch<ApiResponse<AdminQuizItem>>(`/teacher/quizzes/${id}/unpublish`); return r.data.data; },
  async archiveQuiz(id: string)   { const r = await api.patch<ApiResponse<AdminQuizItem>>(`/teacher/quizzes/${id}/archive`);   return r.data.data; },
  async restoreQuiz(id: string)   { const r = await api.patch<ApiResponse<AdminQuizItem>>(`/teacher/quizzes/${id}/restore`);   return r.data.data; },
  async getAnalytics(id: string): Promise<QuizAnalytics> {
    const r = await api.get<ApiResponse<QuizAnalytics>>(`/teacher/quizzes/${id}/analytics`);
    return r.data.data;
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_MAP: Record<string, { label: string; dot: string; cls: string }> = {
  Published: { label: "منشور",  dot: "bg-emerald-500", cls: "bg-emerald-500/10 text-emerald-700 border-emerald-500/30" },
  Draft:     { label: "مسودة",  dot: "bg-amber-500",   cls: "bg-amber-500/10 text-amber-700 border-amber-500/30" },
  Archived:  { label: "مؤرشف", dot: "bg-slate-400",   cls: "bg-slate-200/80 text-slate-600 border-slate-300" },
};

function formatDuration(min: number) {
  if (!min || min === 0) return "غير محدود";
  if (min < 60) return `${min} دقيقة`;
  return `${Math.floor(min / 60)}س ${min % 60 > 0 ? `${min % 60}د` : ""}`.trim();
}

// ─── Analytics Drawer ─────────────────────────────────────────────────────────

function AnalyticsDrawer({ quizId, quizTitle, onClose }: { quizId: string; quizTitle: string; onClose: () => void }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["quiz-analytics", quizId],
    queryFn: () => adminQuizService.getAnalytics(quizId),
    staleTime: 60_000,
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onClose}>
      <div
        className="bg-white dark:bg-[#0B2D5B] rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 w-full max-w-lg text-right"
        dir="rtl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-white/10">
          <div>
            <h3 className="font-black text-[#0B2D5B] dark:text-white text-base">{quizTitle}</h3>
            <p className="text-xs text-slate-400 mt-0.5">تقرير الأداء وإحصائيات الاختبار</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 transition-colors text-slate-400">
            <XCircle className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {isLoading ? (
            <div className="grid grid-cols-2 gap-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-16 bg-slate-100 dark:bg-white/5 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : isError ? (
            <div className="text-center py-8 text-rose-500 space-y-2">
              <AlertCircle className="h-8 w-8 mx-auto" />
              <p className="text-sm font-bold">تعذّر تحميل التحليلات</p>
            </div>
          ) : !data ? null : (
            <>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-black">
                  <span className="text-slate-500">نسبة النجاح</span>
                  <span className={data.passRate >= 70 ? "text-emerald-600" : data.passRate >= 50 ? "text-amber-600" : "text-rose-600"}>
                    {data.passRate}%
                  </span>
                </div>
                <div className="h-3 w-full bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${data.passRate >= 70 ? "bg-emerald-500" : data.passRate >= 50 ? "bg-amber-500" : "bg-rose-500"}`}
                    style={{ width: `${data.passRate}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "إجمالي المحاولات", value: data.attemptsCount.toLocaleString(), icon: Users,        color: "text-blue-600",    bg: "bg-blue-500/10" },
                  { label: "متوسط الدرجات",    value: `${data.averageScore}`,              icon: BarChart3,    color: "text-indigo-600",  bg: "bg-indigo-500/10" },
                  { label: "عدد الناجحين",     value: data.passCount.toLocaleString(),     icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-500/10" },
                  { label: "عدد الراسبين",     value: data.failCount.toLocaleString(),     icon: XCircle,      color: "text-rose-600",    bg: "bg-rose-500/10" },
                  { label: "أعلى درجة",        value: `${data.highestScore}`,             icon: TrendingUp,   color: "text-green-600",   bg: "bg-green-500/10" },
                  { label: "أدنى درجة",        value: `${data.lowestScore}`,              icon: Target,       color: "text-orange-600",  bg: "bg-orange-500/10" },
                ].map(({ label, value, icon: Icon, color, bg }) => (
                  <div key={label} className={`${bg} p-4 rounded-2xl flex items-center gap-3`}>
                    <Icon className={`h-5 w-5 ${color} shrink-0`} />
                    <div>
                      <div className={`text-lg font-black font-mono ${color}`}>{value}</div>
                      <div className="text-[10px] text-slate-500 font-bold">{label}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-100 dark:border-white/10">
                <span>{data.totalQuestions} سؤال</span>
                <span>{data.totalMarks} درجة إجمالية</span>
                <span>نسبة فشل: {data.failureRate}%</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Inline Status Select ─────────────────────────────────────────────────────

function InlineStatusSelect({
  quizId, currentStatus, onPublish, onUnpublish, onArchive, disabled,
}: {
  quizId: string;
  currentStatus: AdminQuizItem["status"];
  onPublish: (id: string) => void;
  onUnpublish: (id: string) => void;
  onArchive: (id: string) => void;
  disabled?: boolean;
}) {
  const cfg = STATUS_MAP[currentStatus] ?? STATUS_MAP["Draft"];
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === "Published") onPublish(quizId);
    else if (val === "Draft") onUnpublish(quizId);
    else if (val === "Archived") onArchive(quizId);
  };
  return (
    <div className="relative inline-flex items-center">
      <span className={`absolute right-2 h-2 w-2 rounded-full shrink-0 ${cfg.dot}`} />
      <select
        value={currentStatus}
        disabled={disabled}
        onChange={handleChange}
        className={`appearance-none cursor-pointer pr-6 pl-6 py-1 rounded-xl text-[11px] font-black border transition-all duration-150 outline-none focus:ring-2 ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed ${cfg.cls}`}
      >
        <option value="Published">منشور</option>
        <option value="Draft">مسودة</option>
        <option value="Archived">مؤرشف</option>
      </select>
      <ChevronDown className="pointer-events-none absolute left-1.5 h-3 w-3 opacity-60" />
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminQuizzesPage() {
  const queryClient = useQueryClient();

  const [search, setSearch]               = React.useState("");
  const [debouncedSearch, setDB]          = React.useState("");
  const [statusFilter, setStatusFilter]   = React.useState("All");
  const [page, setPage]                   = React.useState(1);
  const [analyticsQuiz, setAnalyticsQuiz] = React.useState<{ id: string; title: string } | null>(null);
  const LIMIT = 15;

  React.useEffect(() => {
    const t = setTimeout(() => setDB(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  const queryParams = {
    page, limit: LIMIT, sort: "createdAt:desc",
    ...(debouncedSearch && { search: debouncedSearch }),
    ...(statusFilter !== "All" && { status: statusFilter }),
  };

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["admin", "quizzes-list", queryParams],
    queryFn: () => adminQuizService.getQuizzes(queryParams),
    staleTime: 30_000,
  });

  const quizzes    = data?.quizzes ?? [];
  const pagination = data?.pagination ?? { total: 0, page: 1, totalPages: 1 };

  const stats = React.useMemo(() => ({
    total:     pagination.total,
    published: quizzes.filter((q) => q.status === "Published").length,
    draft:     quizzes.filter((q) => q.status === "Draft").length,
    questions: quizzes.reduce((s, q) => s + (q.totalQuestions ?? 0), 0),
  }), [quizzes, pagination.total]);

  const inv = () => queryClient.invalidateQueries({ queryKey: ["admin", "quizzes-list"] });

  const publishM   = useMutation({ mutationFn: (id: string) => adminQuizService.publishQuiz(id),   onSuccess: () => { toast.success("تم نشر الاختبار.");       inv(); }, onError: (e: any) => toast.error(e?.response?.data?.message || "خطأ.") });
  const unpublishM = useMutation({ mutationFn: (id: string) => adminQuizService.unpublishQuiz(id), onSuccess: () => { toast.success("تحويل لمسودة.");          inv(); }, onError: (e: any) => toast.error(e?.response?.data?.message || "خطأ.") });
  const archiveM   = useMutation({ mutationFn: (id: string) => adminQuizService.archiveQuiz(id),   onSuccess: () => { toast.success("تم أرشفة الاختبار.");    inv(); }, onError: (e: any) => toast.error(e?.response?.data?.message || "خطأ.") });
  const restoreM   = useMutation({ mutationFn: (id: string) => adminQuizService.restoreQuiz(id),   onSuccess: () => { toast.success("تم استرجاع الاختبار."); inv(); }, onError: (e: any) => toast.error(e?.response?.data?.message || "خطأ.") });
  const deleteM    = useMutation({ mutationFn: (id: string) => adminQuizService.deleteQuiz(id),    onSuccess: () => { toast.success("تم حذف الاختبار.");      inv(); }, onError: (e: any) => toast.error(e?.response?.data?.message || "خطأ.") });

  const statusPending = publishM.isPending || unpublishM.isPending || archiveM.isPending || restoreM.isPending;

  return (
    <>
      {analyticsQuiz && (
        <AnalyticsDrawer quizId={analyticsQuiz.id} quizTitle={analyticsQuiz.title} onClose={() => setAnalyticsQuiz(null)} />
      )}

      <div className="space-y-6 text-right transition-colors" dir="rtl">

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-[#0F274D] p-6 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 bg-[#F58220]/10 text-[#F58220] px-3 py-1 rounded-full text-xs font-black">
              <FileQuestion className="h-4 w-4" />
              <span>مركز الاختبارات والتقييمات</span>
            </div>
            <h1 className="text-2xl font-black text-[#0B2D5B] dark:text-white">بنك الأسئلة والاختبارات</h1>
            <p className="text-xs text-slate-500">متابعة نتائج اختبارات الطلاب ونسب النجاح الكلية بالمنصة</p>
          </div>
          <Button onClick={() => refetch()} variant="outline" size="icon" className="rounded-xl border-slate-200 dark:border-white/10">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "إجمالي الاختبارات", value: pagination.total, icon: HelpCircle,  color: "text-[#0B2D5B] dark:text-white", sub: "اختبار في المنصة" },
            { label: "اختبارات منشورة",   value: stats.published,  icon: CheckCircle2, color: "text-emerald-600",               sub: "متاح للطلاب الآن" },
            { label: "مسودات",            value: stats.draft,      icon: Eye,          color: "text-amber-600",                 sub: "قيد الإعداد" },
            { label: "أسئلة في الصفحة",  value: stats.questions,  icon: Layers,       color: "text-indigo-600",                sub: "سؤال مُدخَل" },
          ].map(({ label, value, icon: Icon, color, sub }) => (
            <div key={label} className="bg-white dark:bg-[#0F274D] p-5 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">{label}</span>
                <Icon className={`h-5 w-5 ${color}`} />
              </div>
              <div className={`text-2xl font-black font-mono ${color}`}>{isLoading ? "—" : value.toLocaleString()}</div>
              <div className="text-[11px] text-slate-400 font-bold">{sub}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-[#0F274D] p-4 sm:p-5 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div className="relative lg:col-span-2">
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="ابحث باسم الاختبار..."
                className="w-full h-11 pr-10 pl-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs outline-none focus:border-[#F58220]"
              />
              <Search className="h-4 w-4 text-slate-400 absolute right-3.5 top-3.5 pointer-events-none" />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="h-11 px-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold outline-none focus:border-[#F58220]"
            >
              <option value="All">جميع الحالات</option>
              <option value="Published">منشور</option>
              <option value="Draft">مسودة</option>
              <option value="Archived">مؤرشف</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-[#0F274D] rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="p-10 space-y-4">
              {[...Array(6)].map((_, i) => <div key={i} className="h-14 w-full bg-slate-100 dark:bg-white/5 rounded-2xl animate-pulse" />)}
            </div>
          ) : isError ? (
            <div className="p-14 text-center space-y-3 text-rose-500">
              <AlertCircle className="h-10 w-10 mx-auto" />
              <p className="text-sm font-bold">فشل تحميل الاختبارات.</p>
              <Button variant="outline" size="sm" onClick={() => refetch()} className="rounded-xl text-xs gap-2">
                <RefreshCw className="h-3.5 w-3.5" /> إعادة المحاولة
              </Button>
            </div>
          ) : quizzes.length === 0 ? (
            <div className="p-14 text-center space-y-3">
              <HelpCircle className="h-12 w-12 text-slate-300 mx-auto" />
              <p className="text-sm font-extrabold text-slate-500">لا توجد اختبارات مطابقة للبحث</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-50 dark:bg-white/5 border-b border-slate-100 dark:border-white/10 text-slate-400 font-bold">
                  <tr>
                    <th className="py-4 px-4">الاختبار</th>
                    <th className="py-4 px-3">الكورس</th>
                    <th className="py-4 px-3">الأسئلة</th>
                    <th className="py-4 px-3">الدرجة</th>
                    <th className="py-4 px-3">للنجاح</th>
                    <th className="py-4 px-3">الوقت</th>
                    <th className="py-4 px-3">الحالة</th>
                    <th className="py-4 px-3">تاريخ الإنشاء</th>
                    <th className="py-4 px-4 text-center">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {quizzes.map((quiz) => (
                    <tr key={quiz._id} className="hover:bg-slate-50/60 dark:hover:bg-white/[0.02] transition-colors">

                      <td className="py-4 px-4 min-w-[200px]">
                        <div className="font-bold text-[#0B2D5B] dark:text-white line-clamp-1">{quiz.title}</div>
                        <div className="flex items-center gap-2 mt-0.5">
                          {quiz.negativeMarking && (
                            <span className="text-[9px] font-black bg-rose-500/10 text-rose-600 px-1.5 py-0.5 rounded-lg border border-rose-500/20">خصم سلبي</span>
                          )}
                          {quiz.shuffleQuestions && (
                            <span className="text-[9px] font-black bg-indigo-500/10 text-indigo-600 px-1.5 py-0.5 rounded-lg border border-indigo-500/20">عشوائي</span>
                          )}
                          {quiz.attemptLimit > 0 && (
                            <span className="text-[9px] text-slate-400 font-bold">{quiz.attemptLimit} محاولة</span>
                          )}
                        </div>
                      </td>

                      <td className="py-4 px-3 max-w-[150px]">
                        <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                          <BookOpen className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                          <span className="font-bold line-clamp-1">{quiz.courseId?.title ?? "—"}</span>
                        </div>
                        {quiz.lessonId?.title && (
                          <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1 pr-5">{quiz.lessonId.title}</div>
                        )}
                      </td>

                      <td className="py-4 px-3">
                        <span className="inline-flex items-center gap-1 font-black text-[#0B2D5B] dark:text-white">
                          <FileQuestion className="h-3.5 w-3.5 text-[#F58220]" />
                          {quiz.totalQuestions}
                        </span>
                      </td>

                      <td className="py-4 px-3">
                        <span className="font-mono font-black text-[#F58220] bg-[#F58220]/10 px-2 py-0.5 rounded-lg text-[11px]">
                          {quiz.totalMarks}
                        </span>
                      </td>

                      <td className="py-4 px-3">
                        <div className="flex items-center gap-1.5">
                          <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                          <span className="font-bold text-slate-700 dark:text-slate-200">{quiz.passingPercentage}%</span>
                        </div>
                      </td>

                      <td className="py-4 px-3">
                        <span className="flex items-center gap-1 text-slate-500">
                          <Clock className="h-3.5 w-3.5 shrink-0" />
                          {formatDuration(quiz.duration)}
                        </span>
                      </td>

                      <td className="py-4 px-3">
                        <InlineStatusSelect
                          quizId={quiz._id}
                          currentStatus={quiz.status}
                          onPublish={(id) => publishM.mutate(id)}
                          onUnpublish={(id) => unpublishM.mutate(id)}
                          onArchive={(id) => archiveM.mutate(id)}
                          disabled={statusPending}
                        />
                      </td>

                      <td className="py-4 px-3 text-slate-400 font-mono text-[10px]">
                        {new Date(quiz.createdAt).toLocaleDateString("ar-EG")}
                      </td>

                      <td className="py-4 px-4">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            title="تحليلات الاختبار"
                            onClick={() => setAnalyticsQuiz({ id: quiz._id, title: quiz.title })}
                            className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-colors"
                          >
                            <BarChart3 className="h-3.5 w-3.5" />
                          </button>

                          {quiz.status === "Archived" ? (
                            <button title="استرجاع" onClick={() => restoreM.mutate(quiz._id)} disabled={restoreM.isPending}
                              className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-colors">
                              <RotateCcw className="h-3.5 w-3.5" />
                            </button>
                          ) : (
                            <button title="أرشفة" onClick={() => archiveM.mutate(quiz._id)} disabled={archiveM.isPending}
                              className="p-2 rounded-xl bg-amber-500/10 text-amber-600 hover:bg-amber-600 hover:text-white transition-colors">
                              <Archive className="h-3.5 w-3.5" />
                            </button>
                          )}

                          <button
                            title="حذف الاختبار"
                            onClick={() => { if (confirm(`هل أنت متأكد من حذف "${quiz.title}"؟`)) deleteM.mutate(quiz._id); }}
                            disabled={deleteM.isPending}
                            className="p-2 rounded-xl bg-rose-500/10 text-rose-600 hover:bg-rose-600 hover:text-white transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {!isLoading && !isError && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 dark:border-white/10">
              <p className="text-xs text-slate-400 font-bold">
                إجمالي {pagination.total.toLocaleString()} اختبار — صفحة {pagination.page} من {pagination.totalPages}
              </p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                  className="rounded-xl border-slate-200 dark:border-white/10 h-8 w-8">
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <span className="text-xs font-black text-[#0B2D5B] dark:text-white px-2">{page}</span>
                <Button variant="outline" size="icon" onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))} disabled={page === pagination.totalPages}
                  className="rounded-xl border-slate-200 dark:border-white/10 h-8 w-8">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

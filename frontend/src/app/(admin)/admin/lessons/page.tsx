"use client";

import * as React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  PlayCircle,
  FileText,
  FileVideo,
  BookOpen,
  Radio,
  FileArchive,
  HelpCircle,
  ClipboardList,
  AlignLeft,
  Search,
  RefreshCw,
  Filter,
  Eye,
  EyeOff,
  Archive,
  RotateCcw,
  Trash2,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Clock,
  BarChart3,
  BookMarked,
  Layers,
  SlidersHorizontal,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import adminLessonService, {
  AdminLessonItem,
  AdminLessonFilters,
} from "@/services/adminLesson.service";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getLessonTypeIcon(type: AdminLessonItem["lessonType"]) {
  const iconProps = { className: "h-4 w-4" };
  switch (type) {
    case "Video":      return <FileVideo {...iconProps} />;
    case "Article":    return <FileText {...iconProps} />;
    case "Live":       return <Radio {...iconProps} />;
    case "PDF":        return <FileArchive {...iconProps} />;
    case "Quiz":       return <HelpCircle {...iconProps} />;
    case "Assignment": return <ClipboardList {...iconProps} />;
    case "Text":       return <AlignLeft {...iconProps} />;
    default:           return <PlayCircle {...iconProps} />;
  }
}

function getLessonTypeLabel(type: AdminLessonItem["lessonType"]) {
  const labels: Record<string, string> = {
    Video: "فيديو",
    Article: "مقال",
    Live: "بث مباشر",
    PDF: "ملف PDF",
    Resource: "مورد",
    Interactive: "تفاعلي",
    Quiz: "اختبار",
    Assignment: "واجب",
    Text: "نص",
  };
  return labels[type] || type;
}

function getLessonTypeColor(type: AdminLessonItem["lessonType"]) {
  const colors: Record<string, string> = {
    Video: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    Article: "bg-purple-500/10 text-purple-600 border-purple-500/20",
    Live: "bg-rose-500/10 text-rose-600 border-rose-500/20",
    PDF: "bg-orange-500/10 text-orange-600 border-orange-500/20",
    Resource: "bg-teal-500/10 text-teal-600 border-teal-500/20",
    Interactive: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20",
    Quiz: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    Assignment: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    Text: "bg-slate-500/10 text-slate-600 border-slate-500/20",
  };
  return colors[type] || "bg-slate-500/10 text-slate-500 border-slate-500/20";
}

function formatDuration(minutes: number) {
  if (!minutes || minutes === 0) return "—";
  if (minutes < 60) return `${minutes} د`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}س ${m}د` : `${h}س`;
}

function getCourseTitle(courseId: AdminLessonItem["courseId"]) {
  if (typeof courseId === "object" && courseId !== null) return courseId.title;
  return "—";
}

function getSectionTitle(sectionId: AdminLessonItem["sectionId"]) {
  if (!sectionId) return "—";
  if (typeof sectionId === "object" && sectionId !== null) return sectionId.title;
  return "—";
}

// ─── Status Config ────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<string, { label: string; selectClass: string; dotClass: string }> = {
  Published: { label: "منشور",  selectClass: "bg-emerald-500/10 text-emerald-700 border-emerald-500/30 focus:ring-emerald-400", dotClass: "bg-emerald-500" },
  Draft:     { label: "مسودة",  selectClass: "bg-amber-500/10 text-amber-700 border-amber-500/30 focus:ring-amber-400",       dotClass: "bg-amber-500" },
  Hidden:    { label: "مخفي",   selectClass: "bg-rose-500/10 text-rose-700 border-rose-500/30 focus:ring-rose-400",           dotClass: "bg-rose-500" },
  Scheduled: { label: "مجدول", selectClass: "bg-indigo-500/10 text-indigo-700 border-indigo-500/30 focus:ring-indigo-400",   dotClass: "bg-indigo-500" },
  Archived:  { label: "مؤرشف", selectClass: "bg-slate-200/80 text-slate-600 border-slate-300 focus:ring-slate-400",          dotClass: "bg-slate-400" },
};

// ─── Inline Status Select ─────────────────────────────────────────────────────

function InlineStatusSelect({
  lessonId,
  currentStatus,
  onUpdate,
  disabled,
}: {
  lessonId: string;
  currentStatus: AdminLessonItem["status"];
  onUpdate: (id: string, status: string) => void;
  disabled?: boolean;
}) {
  const cfg = STATUS_CONFIG[currentStatus] ?? STATUS_CONFIG["Draft"];
  return (
    <div className="relative inline-flex items-center">
      {/* Colored dot */}
      <span className={`absolute right-2 h-2 w-2 rounded-full shrink-0 ${cfg.dotClass}`} />
      <select
        value={currentStatus}
        disabled={disabled}
        onChange={(e) => onUpdate(lessonId, e.target.value)}
        className={`
          appearance-none cursor-pointer
          pr-6 pl-6 py-1 rounded-xl text-[11px] font-black
          border transition-all duration-150 outline-none
          focus:ring-2 ring-offset-1
          disabled:opacity-50 disabled:cursor-not-allowed
          ${cfg.selectClass}
        `}
      >
        <option value="Published">منشور</option>
        <option value="Draft">مسودة</option>
        <option value="Hidden">مخفي</option>
        <option value="Scheduled">مجدول</option>
        <option value="Archived">مؤرشف</option>
      </select>
      {/* Chevron icon */}
      <ChevronDown className="pointer-events-none absolute left-1.5 h-3 w-3 opacity-60" />
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminLessonsPage() {
  const queryClient = useQueryClient();

  // Filters state
  const [search, setSearch]           = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("All");
  const [typeFilter, setTypeFilter]   = React.useState("All");
  const [page, setPage]               = React.useState(1);
  const LIMIT = 15;

  // Debounce search input
  React.useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  // Build query params
  const queryParams: AdminLessonFilters = {
    page,
    limit: LIMIT,
    sort: "createdAt:desc",
    ...(debouncedSearch && { search: debouncedSearch }),
    ...(statusFilter !== "All" && { status: statusFilter }),
    ...(typeFilter !== "All" && { lessonType: typeFilter }),
  };

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["admin", "lessons-list", queryParams],
    queryFn: () => adminLessonService.getLessons(queryParams),
    staleTime: 30_000,
  });

  const lessons     = data?.lessons ?? [];
  const pagination  = data?.pagination ?? { total: 0, page: 1, totalPages: 1 };

  // ── Derived Stats ─────────────────────────────────────────────────────────
  const stats = React.useMemo(() => {
    const all = lessons;
    return {
      total:     pagination.total,
      published: all.filter((l) => l.status === "Published").length,
      draft:     all.filter((l) => l.status === "Draft").length,
      video:     all.filter((l) => l.lessonType === "Video").length,
    };
  }, [lessons, pagination.total]);

  // ── Mutations ─────────────────────────────────────────────────────────────
  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["admin", "lessons-list"] });

  const archiveMutation = useMutation({
    mutationFn: (id: string) => adminLessonService.archiveLesson(id),
    onSuccess: () => { toast.success("تم أرشفة الدرس بنجاح."); invalidate(); },
    onError: (e: any) => toast.error(e?.response?.data?.message || "حدث خطأ أثناء الأرشفة."),
  });

  const restoreMutation = useMutation({
    mutationFn: (id: string) => adminLessonService.restoreLesson(id),
    onSuccess: () => { toast.success("تم استرجاع الدرس بنجاح."); invalidate(); },
    onError: (e: any) => toast.error(e?.response?.data?.message || "حدث خطأ أثناء الاسترجاع."),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminLessonService.deleteLesson(id),
    onSuccess: () => { toast.success("تم حذف الدرس بنجاح."); invalidate(); },
    onError: (e: any) => toast.error(e?.response?.data?.message || "حدث خطأ أثناء الحذف."),
  });

  // Inline status update mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      adminLessonService.updateLesson(id, { status: status as AdminLessonItem["status"] }),
    onSuccess: (_, vars) => {
      const label = STATUS_CONFIG[vars.status]?.label ?? vars.status;
      toast.success(`تم تغيير حالة الدرس إلى "${label}" بنجاح.`);
      invalidate();
    },
    onError: (e: any) => toast.error(e?.response?.data?.message || "حدث خطأ أثناء تغيير الحالة."),
  });

  const handleStatusChange = (id: string, status: string) =>
    updateStatusMutation.mutate({ id, status });

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6 text-right transition-colors" dir="rtl">

      {/* ── Header Banner ──────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-[#0F274D] p-6 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 bg-[#F58220]/10 text-[#F58220] px-3 py-1 rounded-full text-xs font-black">
            <BookMarked className="h-4 w-4" />
            <span>إدارة محتوى المنصة التعليمية</span>
          </div>
          <h1 className="text-2xl font-black text-[#0B2D5B] dark:text-white">
            الدروس والمحتوى التعليمي
          </h1>
          <p className="text-xs text-slate-500">
            عرض وإدارة جميع الدروس والمقاطع المنشورة عبر الكورسات والوحدات الدراسية.
          </p>
        </div>

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

      {/* ── KPI Cards ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "إجمالي الدروس",   value: pagination.total, icon: BookOpen,  color: "text-[#0B2D5B] dark:text-white", sub: "درس في المنصة" },
          { label: "دروس منشورة",     value: stats.published,  icon: Eye,       color: "text-emerald-600",                sub: "متاح للطلاب" },
          { label: "مسودات",          value: stats.draft,      icon: EyeOff,    color: "text-amber-600",                  sub: "قيد الإعداد" },
          { label: "مقاطع فيديو",     value: stats.video,      icon: FileVideo, color: "text-blue-600",                   sub: "محتوى مرئي" },
        ].map(({ label, value, icon: Icon, color, sub }) => (
          <div key={label} className="bg-white dark:bg-[#0F274D] p-5 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold text-slate-500">{label}</span>
              <Icon className={`h-5 w-5 ${color}`} />
            </div>
            <div className={`text-2xl font-black font-mono ${color}`}>
              {isLoading ? "—" : value.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-400 font-bold">{sub}</div>
          </div>
        ))}
      </div>

      {/* ── Filters ──────────────────────────────────────────────────────── */}
      <div className="bg-white dark:bg-[#0F274D] p-4 sm:p-5 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">

          {/* Search */}
          <div className="relative lg:col-span-2">
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="ابحث بعنوان الدرس..."
              className="w-full h-11 pr-10 pl-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs outline-none focus:border-[#F58220]"
            />
            <Search className="h-4 w-4 text-slate-400 absolute right-3.5 top-3.5 pointer-events-none" />
          </div>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="h-11 px-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold outline-none focus:border-[#F58220]"
          >
            <option value="All">جميع الحالات</option>
            <option value="Published">منشور</option>
            <option value="Draft">مسودة</option>
            <option value="Archived">مؤرشف</option>
            <option value="Scheduled">مجدول</option>
            <option value="Hidden">مخفي</option>
          </select>

          {/* Type filter */}
          <select
            value={typeFilter}
            onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
            className="h-11 px-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold outline-none focus:border-[#F58220]"
          >
            <option value="All">جميع الأنواع</option>
            <option value="Video">فيديو</option>
            <option value="Article">مقال</option>
            <option value="Live">بث مباشر</option>
            <option value="PDF">ملف PDF</option>
            <option value="Quiz">اختبار</option>
            <option value="Assignment">واجب</option>
            <option value="Text">نص</option>
            <option value="Resource">مورد</option>
          </select>
        </div>
      </div>

      {/* ── Table ────────────────────────────────────────────────────────── */}
      <div className="bg-white dark:bg-[#0F274D] rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-10 space-y-4">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="h-14 w-full bg-slate-100 dark:bg-white/5 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : isError ? (
          <div className="p-14 text-center space-y-3 text-rose-500">
            <AlertCircle className="h-10 w-10 mx-auto" />
            <p className="text-sm font-bold">فشل استرجاع الدروس. تحقق من اتصال الخادم.</p>
            <Button variant="outline" size="sm" onClick={() => refetch()} className="rounded-xl text-xs gap-2">
              <RefreshCw className="h-3.5 w-3.5" /> إعادة المحاولة
            </Button>
          </div>
        ) : lessons.length === 0 ? (
          <div className="p-14 text-center space-y-3">
            <BookOpen className="h-12 w-12 text-slate-300 mx-auto" />
            <p className="text-sm font-extrabold text-slate-500">لا توجد دروس مطابقة لشروط البحث</p>
            <p className="text-xs text-slate-400">جرب تغيير الفلاتر أو البحث بكلمة مختلفة</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 dark:bg-white/5 border-b border-slate-100 dark:border-white/10 text-slate-400 font-bold">
                <tr>
                  <th className="py-4 px-4">الدرس</th>
                  <th className="py-4 px-3">النوع</th>
                  <th className="py-4 px-3">الكورس / الوحدة</th>
                  <th className="py-4 px-3">الترتيب</th>
                  <th className="py-4 px-3">المدة</th>
                  <th className="py-4 px-3">الحالة</th>
                  <th className="py-4 px-3">تاريخ الإضافة</th>
                  <th className="py-4 px-4 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5 font-medium">
                {lessons.map((lesson) => (
                  <tr
                    key={lesson._id}
                    className="hover:bg-slate-50/60 dark:hover:bg-white/[0.02] transition-colors"
                  >
                    {/* Title & Slug */}
                    <td className="py-4 px-4 space-y-0.5 min-w-[200px]">
                      <div className="font-bold text-[#0B2D5B] dark:text-white line-clamp-1">
                        {lesson.title}
                      </div>
                      {lesson.isPreview && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-[#F58220] font-bold">
                          <Eye className="h-3 w-3" /> معاينة مجانية
                        </span>
                      )}
                    </td>

                    {/* Type */}
                    <td className="py-4 px-3">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[10px] font-black border ${getLessonTypeColor(lesson.lessonType)}`}>
                        {getLessonTypeIcon(lesson.lessonType)}
                        {getLessonTypeLabel(lesson.lessonType)}
                      </span>
                    </td>

                    {/* Course / Section */}
                    <td className="py-4 px-3 space-y-0.5 max-w-[160px]">
                      <div className="font-bold text-slate-700 dark:text-slate-200 line-clamp-1">
                        {getCourseTitle(lesson.courseId)}
                      </div>
                      <div className="text-[10px] text-slate-400 line-clamp-1 flex items-center gap-1">
                        <Layers className="h-3 w-3 shrink-0" />
                        {getSectionTitle(lesson.sectionId || lesson.unitId)}
                      </div>
                    </td>

                    {/* Order */}
                    <td className="py-4 px-3">
                      <span className="font-mono font-black text-[#F58220] bg-[#F58220]/10 px-2 py-0.5 rounded-lg text-[11px]">
                        #{lesson.order}
                      </span>
                    </td>

                    {/* Duration */}
                    <td className="py-4 px-3">
                      <span className="flex items-center gap-1 text-slate-500">
                        <Clock className="h-3.5 w-3.5 shrink-0" />
                        {formatDuration(lesson.duration)}
                      </span>
                    </td>

                    {/* Status — inline editable select */}
                    <td className="py-4 px-3">
                      <InlineStatusSelect
                        lessonId={lesson._id}
                        currentStatus={lesson.status}
                        onUpdate={handleStatusChange}
                        disabled={updateStatusMutation.isPending}
                      />
                    </td>

                    {/* Created At */}
                    <td className="py-4 px-3 text-slate-400 font-mono text-[10px]">
                      {new Date(lesson.createdAt).toLocaleDateString("ar-EG")}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-center gap-1.5">
                        {lesson.status === "Archived" ? (
                          <button
                            title="استرجاع الدرس"
                            onClick={() => restoreMutation.mutate(lesson._id)}
                            disabled={restoreMutation.isPending}
                            className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-colors"
                          >
                            <RotateCcw className="h-3.5 w-3.5" />
                          </button>
                        ) : (
                          <button
                            title="أرشفة الدرس"
                            onClick={() => archiveMutation.mutate(lesson._id)}
                            disabled={archiveMutation.isPending}
                            className="p-2 rounded-xl bg-amber-500/10 text-amber-600 hover:bg-amber-600 hover:text-white transition-colors"
                          >
                            <Archive className="h-3.5 w-3.5" />
                          </button>
                        )}
                        <button
                          title="حذف الدرس"
                          onClick={() => {
                            if (confirm(`هل أنت متأكد من حذف الدرس "${lesson.title}"؟`)) {
                              deleteMutation.mutate(lesson._id);
                            }
                          }}
                          disabled={deleteMutation.isPending}
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

        {/* ── Pagination ──────────────────────────────────────────────────── */}
        {!isLoading && !isError && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 dark:border-white/10">
            <p className="text-xs text-slate-400 font-bold">
              إجمالي {pagination.total.toLocaleString()} درس — صفحة {pagination.page} من {pagination.totalPages}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="rounded-xl border-slate-200 dark:border-white/10 h-8 w-8"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <span className="text-xs font-black text-[#0B2D5B] dark:text-white px-2">
                {page}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                disabled={page === pagination.totalPages}
                className="rounded-xl border-slate-200 dark:border-white/10 h-8 w-8"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

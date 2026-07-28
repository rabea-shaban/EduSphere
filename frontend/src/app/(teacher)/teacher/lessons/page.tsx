"use client";

import * as React from "react";
import Link from "next/link";
import {
  Sparkles,
  PlusCircle,
  Search,
  Filter,
  RefreshCw,
  Video,
  FileText,
  Eye,
  BookOpen,
} from "lucide-react";
import { useTeacherLessons } from "@/hooks/useLessons";
import type { ApiLesson, LessonType, LessonStatus, LessonFilters } from "@/features/teacher/types/lesson";
import { LessonSkeleton } from "@/features/teacher/components/lessons/lesson-skeleton";
import { LessonEmptyState } from "@/features/teacher/components/lessons/lesson-empty-state";
import { LessonCard } from "@/features/teacher/components/lessons/lesson-card";
import { CreateLessonDialog } from "@/features/teacher/components/lessons/create-lesson-dialog";
import { EditLessonDialog } from "@/features/teacher/components/lessons/edit-lesson-dialog";
import { DeleteLessonDialog } from "@/features/teacher/components/lessons/delete-lesson-dialog";
import { ArchiveLessonDialog } from "@/features/teacher/components/lessons/archive-lesson-dialog";
import { RestoreLessonDialog } from "@/features/teacher/components/lessons/restore-lesson-dialog";
import { DuplicateLessonDialog } from "@/features/teacher/components/lessons/duplicate-lesson-dialog";
import { MoveLessonDialog } from "@/features/teacher/components/lessons/move-lesson-dialog";

export default function LessonsManagementPage() {
  // Filter & Search States
  const [search, setSearch] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  const [selectedType, setSelectedType] = React.useState<LessonType | "ALL">("ALL");
  const [selectedStatus, setSelectedStatus] = React.useState<LessonStatus | "ALL">("ALL");
  const [sortBy, setSortBy] = React.useState("createdAt:desc");

  // Dialog targets
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [editTarget, setEditTarget] = React.useState<ApiLesson | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<ApiLesson | null>(null);
  const [archiveTarget, setArchiveTarget] = React.useState<ApiLesson | null>(null);
  const [restoreTarget, setRestoreTarget] = React.useState<ApiLesson | null>(null);
  const [duplicateTarget, setDuplicateTarget] = React.useState<ApiLesson | null>(null);
  const [moveTarget, setMoveTarget] = React.useState<ApiLesson | null>(null);

  // Debounce search
  React.useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  const filters: LessonFilters = {
    ...(debouncedSearch ? { search: debouncedSearch } : {}),
    ...(selectedType !== "ALL" ? { lessonType: selectedType } : {}),
    ...(selectedStatus !== "ALL" ? { status: selectedStatus } : {}),
    sort: sortBy,
    limit: 100,
  };

  const { data, isLoading, isError, refetch } = useTeacherLessons(filters);

  const lessons = data?.lessons || [];
  const total = data?.pagination?.total || 0;
  const isFiltered = !!debouncedSearch || selectedType !== "ALL" || selectedStatus !== "ALL";

  // Quick Stat Counters
  const stats = React.useMemo(() => {
    const totalCount = total;
    const videoCount = lessons.filter((l) => l.lessonType === "Video" || l.videoUrl).length;
    const pdfCount = lessons.filter((l) => l.lessonType === "PDF" || l.attachmentUrl).length;
    const previewCount = lessons.filter((l) => l.isPreview).length;
    return { totalCount, videoCount, pdfCount, previewCount };
  }, [lessons, total]);

  return (
    <div className="space-y-8 text-right dir-rtl max-w-6xl mx-auto pb-12">
      {/* Page Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-2xl bg-[#F58220]/10 text-[#F58220]">
              <Sparkles className="h-5 w-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#0B2D5B] dark:text-white">
              إدارة دروس المنصة التعليمية
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            مركز التحكم الكامل لإدارة الشروحات والمرئيات والمذكرات والمستندات التعليمية
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => refetch()}
            className="p-3 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F274D] text-slate-600 dark:text-slate-200 hover:border-[#F58220] transition-colors cursor-pointer"
            title="تحديث البيانات"
            aria-label="تحديث"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </button>
          <Link
            href="/teacher/lessons/create"
            className="h-11 px-5 rounded-2xl bg-gradient-to-r from-[#F58220] to-[#FF9A2A] text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-[#F58220]/20 hover:-translate-y-0.5 transition-all cursor-pointer whitespace-nowrap"
          >
            <PlusCircle className="h-4 w-4" />
            <span>إضافة درس جديد</span>
          </Link>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-[#0F274D] border border-slate-200/80 dark:border-white/10 flex items-center gap-3">
          <span className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center font-black">
            <BookOpen className="h-5 w-5" />
          </span>
          <div>
            <p className="text-[11px] text-slate-400 font-semibold">إجمالي الدروس</p>
            <p className="text-lg font-black text-[#0B2D5B] dark:text-white">{stats.totalCount}</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#0F274D] border border-slate-200/80 dark:border-white/10 flex items-center gap-3">
          <span className="h-10 w-10 rounded-xl bg-sky-500/10 text-sky-600 flex items-center justify-center font-black">
            <Video className="h-5 w-5" />
          </span>
          <div>
            <p className="text-[11px] text-slate-400 font-semibold">دروس الفيديو</p>
            <p className="text-lg font-black text-[#0B2D5B] dark:text-white">{stats.videoCount}</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#0F274D] border border-slate-200/80 dark:border-white/10 flex items-center gap-3">
          <span className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-black">
            <FileText className="h-5 w-5" />
          </span>
          <div>
            <p className="text-[11px] text-slate-400 font-semibold">الملفات والـ PDF</p>
            <p className="text-lg font-black text-[#0B2D5B] dark:text-white">{stats.pdfCount}</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#0F274D] border border-slate-200/80 dark:border-white/10 flex items-center gap-3">
          <span className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-black">
            <Eye className="h-5 w-5" />
          </span>
          <div>
            <p className="text-[11px] text-slate-400 font-semibold">معاينة مجانية</p>
            <p className="text-lg font-black text-[#0B2D5B] dark:text-white">{stats.previewCount}</p>
          </div>
        </div>
      </div>

      {/* Toolbar & Filters */}
      <div className="p-4 rounded-3xl bg-white dark:bg-[#0F274D] border border-slate-200/80 dark:border-white/10 space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 w-full">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="البحث باسم الدرس أو الوصف..."
              className="w-full h-11 pr-10 pl-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none focus:border-[#F58220]"
            />
            <Search className="absolute right-3.5 top-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
          </div>

          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as any)}
            className="h-11 px-4 rounded-2xl bg-slate-50 dark:bg-white/5 dark:bg-[#0B2D5B] border border-slate-200 dark:border-white/10 text-xs font-bold outline-none cursor-pointer w-full sm:w-auto"
          >
            <option value="ALL">جميع أنواع الدروس</option>
            <option value="Video">فيديو 🎥</option>
            <option value="Article">مقال 📝</option>
            <option value="Live">بث مباشر 🔴</option>
            <option value="PDF">ملف PDF 📄</option>
            <option value="Resource">مصدر 🌐</option>
            <option value="Interactive">تفاعلي ✨</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as any)}
            className="h-11 px-4 rounded-2xl bg-slate-50 dark:bg-white/5 dark:bg-[#0B2D5B] border border-slate-200 dark:border-white/10 text-xs font-bold outline-none cursor-pointer w-full sm:w-auto"
          >
            <option value="ALL">جميع الحالات</option>
            <option value="Published">منشور</option>
            <option value="Draft">مسودة</option>
            <option value="Scheduled">مجدول</option>
            <option value="Hidden">مخفي</option>
            <option value="Archived">مؤرشف</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="h-11 px-4 rounded-2xl bg-slate-50 dark:bg-white/5 dark:bg-[#0B2D5B] border border-slate-200 dark:border-white/10 text-xs font-bold outline-none cursor-pointer w-full sm:w-auto"
          >
            <option value="createdAt:desc">الأحدث أولاً</option>
            <option value="createdAt:asc">الأقدم أولاً</option>
            <option value="title:asc">أبجدياً (أ-ي)</option>
            <option value="order:asc">الترتيب الأصلي</option>
          </select>
        </div>
      </div>

      {/* Main Lessons List */}
      {isLoading ? (
        <LessonSkeleton />
      ) : isError ? (
        <div className="p-10 text-center bg-white dark:bg-[#0F274D] rounded-3xl border border-rose-200 dark:border-rose-700/30">
          <p className="text-sm font-bold text-rose-600">تعذر جلب بيانات الدروس من السيرفر</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-3 px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold cursor-pointer"
          >
            إعادة المحاولة
          </button>
        </div>
      ) : lessons.length === 0 ? (
        <LessonEmptyState filtered={isFiltered} />
      ) : (
        <div className="space-y-2.5">
          {lessons.map((lesson, idx) => (
            <LessonCard
              key={lesson._id}
              lesson={lesson}
              index={idx}
              onEdit={setEditTarget}
              onDelete={setDeleteTarget}
              onArchive={setArchiveTarget}
              onRestore={setRestoreTarget}
              onDuplicate={setDuplicateTarget}
              onMove={setMoveTarget}
            />
          ))}
        </div>
      )}

      {/* Action Dialogs */}
      <EditLessonDialog
        lesson={editTarget}
        isOpen={!!editTarget}
        onClose={() => setEditTarget(null)}
      />
      <DeleteLessonDialog
        lesson={deleteTarget}
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
      />
      <ArchiveLessonDialog
        lesson={archiveTarget}
        isOpen={!!archiveTarget}
        onClose={() => setArchiveTarget(null)}
      />
      <RestoreLessonDialog
        lesson={restoreTarget}
        isOpen={!!restoreTarget}
        onClose={() => setRestoreTarget(null)}
      />
      <DuplicateLessonDialog
        lesson={duplicateTarget}
        isOpen={!!duplicateTarget}
        onClose={() => setDuplicateTarget(null)}
      />
      <MoveLessonDialog
        lesson={moveTarget}
        isOpen={!!moveTarget}
        onClose={() => setMoveTarget(null)}
      />
    </div>
  );
}

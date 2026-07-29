"use client";

import * as React from "react";
import { Search, PlusCircle, RefreshCw } from "lucide-react";
import { useLessons } from "@/hooks/useLessons";
import type { ApiLesson, LessonType, LessonStatus, LessonFilters } from "@/features/teacher/types/lesson";
import { LessonSkeleton } from "./lesson-skeleton";
import { LessonEmptyState } from "./lesson-empty-state";
import { LessonReorder } from "./lesson-reorder";
import { CreateLessonDialog } from "./create-lesson-dialog";
import { EditLessonDialog } from "./edit-lesson-dialog";
import { DeleteLessonDialog } from "./delete-lesson-dialog";
import { ArchiveLessonDialog } from "./archive-lesson-dialog";
import { RestoreLessonDialog } from "./restore-lesson-dialog";
import { DuplicateLessonDialog } from "./duplicate-lesson-dialog";
import { MoveLessonDialog } from "./move-lesson-dialog";

interface LessonListProps {
  sectionId: string;
  courseId?: string;
}

export function LessonList({ sectionId, courseId }: LessonListProps) {
  // Dialog state
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [editTarget, setEditTarget] = React.useState<ApiLesson | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<ApiLesson | null>(null);
  const [archiveTarget, setArchiveTarget] = React.useState<ApiLesson | null>(null);
  const [restoreTarget, setRestoreTarget] = React.useState<ApiLesson | null>(null);
  const [duplicateTarget, setDuplicateTarget] = React.useState<ApiLesson | null>(null);
  const [moveTarget, setMoveTarget] = React.useState<ApiLesson | null>(null);

  // Filter state
  const [search, setSearch] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  const [typeFilter, setTypeFilter] = React.useState<LessonType | "ALL">("ALL");
  const [statusFilter, setStatusFilter] = React.useState<LessonStatus | "ALL">("ALL");

  React.useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  const filters: LessonFilters = {
    ...(debouncedSearch ? { search: debouncedSearch } : {}),
    ...(typeFilter !== "ALL" ? { lessonType: typeFilter } : {}),
    ...(statusFilter !== "ALL" ? { status: statusFilter } : {}),
    limit: 100,
  };

  const { data, isLoading, isError, refetch } = useLessons(sectionId, filters);

  const lessons = data?.lessons || [];
  const total = data?.pagination?.total || 0;
  const isFiltered = !!debouncedSearch || typeFilter !== "ALL" || statusFilter !== "ALL";

  return (
    <div className="space-y-3 text-right dir-rtl">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-50/70 dark:bg-[#0B2D5B]/30 p-3.5 rounded-2xl border border-slate-200/60 dark:border-white/5">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-[#0B2D5B] dark:text-white">
            دروس القسم
          </span>
          {!isLoading && (
            <span className="px-2 py-0.5 rounded-full bg-slate-200/70 dark:bg-white/10 text-[11px] font-bold">
              {total}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
          {/* Search Input */}
          <div className="relative flex-1 sm:w-44">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="بحث في الدروس..."
              className="w-full h-8 pr-8 pl-3 rounded-lg text-[11px] font-semibold bg-white dark:bg-[#0B2D5B] border border-slate-200 dark:border-white/10 outline-none focus:border-[#F58220]"
              aria-label="البحث في دروس القسم"
            />
            <Search className="absolute right-2.5 top-2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
          </div>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as any)}
            className="h-8 px-2 rounded-lg bg-white dark:bg-[#0B2D5B] border border-slate-200 dark:border-white/10 text-[11px] font-bold outline-none cursor-pointer"
            aria-label="تصفية حسب نوع الدرس"
          >
            <option value="ALL">جميع الأنواع</option>
            <option value="Video">فيديو</option>
            <option value="Article">مقال</option>
            <option value="Live">بث مباشر</option>
            <option value="PDF">ملف PDF</option>
            <option value="Resource">مصدر</option>
            <option value="Interactive">تفاعلي</option>
          </select>

          {/* Refresh */}
          <button
            type="button"
            onClick={() => refetch()}
            className="p-2 rounded-lg hover:bg-slate-200/60 dark:hover:bg-white/10 text-slate-500 transition-colors cursor-pointer"
            title="تحديث الدروس"
            aria-label="تحديث"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
          </button>

          {/* Add Lesson Button */}
          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="h-8 px-3 rounded-lg bg-gradient-to-r from-[#F58220] to-[#FF9A2A] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm hover:opacity-90 transition-opacity cursor-pointer shrink-0"
            aria-label="إضافة درس جديد"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span>إضافة درس</span>
          </button>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <LessonSkeleton />
      ) : isError ? (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-900/10 border border-rose-200 dark:border-rose-700/30 text-center">
          <p className="text-xs font-bold text-rose-600 dark:text-rose-400">
            تعذر جلب دروس هذا القسم
          </p>
        </div>
      ) : lessons.length === 0 ? (
        <LessonEmptyState
          filtered={isFiltered}
          onCreateClick={!isFiltered ? () => setIsCreateOpen(true) : undefined}
        />
      ) : (
        <LessonReorder
          sectionId={sectionId}
          lessons={lessons}
          onEdit={setEditTarget}
          onDelete={setDeleteTarget}
          onArchive={setArchiveTarget}
          onRestore={setRestoreTarget}
          onDuplicate={setDuplicateTarget}
          onMove={setMoveTarget}
        />
      )}

      {/* Dialogs */}
      <CreateLessonDialog
        sectionId={sectionId}
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />

      <EditLessonDialog
        sectionId={sectionId}
        lesson={editTarget}
        isOpen={!!editTarget}
        onClose={() => setEditTarget(null)}
      />

      <DeleteLessonDialog
        sectionId={sectionId}
        lesson={deleteTarget}
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
      />

      <ArchiveLessonDialog
        sectionId={sectionId}
        lesson={archiveTarget}
        isOpen={!!archiveTarget}
        onClose={() => setArchiveTarget(null)}
      />

      <RestoreLessonDialog
        sectionId={sectionId}
        lesson={restoreTarget}
        isOpen={!!restoreTarget}
        onClose={() => setRestoreTarget(null)}
      />

      <DuplicateLessonDialog
        sectionId={sectionId}
        lesson={duplicateTarget}
        isOpen={!!duplicateTarget}
        onClose={() => setDuplicateTarget(null)}
      />

      <MoveLessonDialog
        currentSectionId={sectionId}
        courseId={courseId}
        lesson={moveTarget}
        isOpen={!!moveTarget}
        onClose={() => setMoveTarget(null)}
      />
    </div>
  );
}

export default LessonList;

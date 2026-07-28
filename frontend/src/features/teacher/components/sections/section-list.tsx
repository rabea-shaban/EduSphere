"use client";

import * as React from "react";
import { Search, Filter, SortAsc, PlusCircle, RefreshCw } from "lucide-react";
import { useSections } from "@/hooks/useSections";
import type { ApiSection, SectionStatus, SectionFilters } from "@/features/teacher/types/section";
import { SectionSkeleton } from "./section-skeleton";
import { SectionEmptyState } from "./section-empty-state";
import { SectionReorder } from "./section-reorder";
import { CreateSectionDialog } from "./create-section-dialog";
import { EditSectionDialog } from "./edit-section-dialog";
import { DeleteSectionDialog } from "./delete-section-dialog";
import { ArchiveSectionDialog } from "./archive-section-dialog";
import { RestoreSectionDialog } from "./restore-section-dialog";
import { DuplicateSectionDialog } from "./duplicate-section-dialog";

interface SectionListProps {
  courseId: string;
  courseTitle?: string;
}

const STATUS_FILTERS: { key: SectionStatus | "all"; label: string }[] = [
  { key: "all", label: "الكل" },
  { key: "Published", label: "منشور" },
  { key: "Draft", label: "مسودة" },
  { key: "Hidden", label: "مخفي" },
  { key: "Archived", label: "مؤرشف" },
];

const SORT_OPTIONS = [
  { value: "order:asc", label: "الترتيب (تصاعدي)" },
  { value: "order:desc", label: "الترتيب (تنازلي)" },
  { value: "createdAt:desc", label: "الأحدث أولاً" },
  { value: "createdAt:asc", label: "الأقدم أولاً" },
  { value: "title:asc", label: "أبجدياً (أ-ي)" },
];

export function SectionList({ courseId, courseTitle }: SectionListProps) {
  // Dialog state
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [editTarget, setEditTarget] = React.useState<ApiSection | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<ApiSection | null>(null);
  const [archiveTarget, setArchiveTarget] = React.useState<ApiSection | null>(null);
  const [restoreTarget, setRestoreTarget] = React.useState<ApiSection | null>(null);
  const [duplicateTarget, setDuplicateTarget] = React.useState<ApiSection | null>(null);

  // Filter state
  const [search, setSearch] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<SectionStatus | "all">("all");
  const [sortBy, setSortBy] = React.useState("order:asc");

  // Debounce search
  React.useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  const filters: SectionFilters = {
    ...(debouncedSearch ? { search: debouncedSearch } : {}),
    ...(statusFilter !== "all" ? { status: statusFilter } : {}),
    sort: sortBy,
    limit: 100,
  };

  const { data, isLoading, isError, refetch } = useSections(courseId, filters);

  const sections = data?.sections || [];
  const total = data?.pagination?.total || 0;
  const isFiltered = !!debouncedSearch || statusFilter !== "all";

  return (
    <div className="space-y-5 text-right dir-rtl">
      {/* ─── Toolbar ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="font-black text-[#0B2D5B] dark:text-white text-base">
              أقسام الكورس
            </span>
            {!isLoading && (
              <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/10 font-bold">
                {total}
              </span>
            )}
          </div>
          {courseTitle && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate max-w-xs">
              {courseTitle}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={() => setIsCreateOpen(true)}
          className="h-10 px-5 rounded-xl bg-gradient-to-r from-[#F58220] to-[#FF9A2A] text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-[#F58220]/20 hover:-translate-y-0.5 transition-all whitespace-nowrap cursor-pointer shrink-0"
          aria-label="إضافة قسم جديد"
        >
          <PlusCircle className="h-4 w-4" />
          <span>إضافة قسم</span>
        </button>
      </div>

      {/* ─── Search & Filters ────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 w-full sm:max-w-xs">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="البحث في أقسام الكورس..."
            className="w-full h-10 pr-10 pl-4 rounded-xl text-xs font-semibold bg-white dark:bg-[#0F274D] border border-slate-200 dark:border-white/10 outline-none focus:border-[#F58220] transition-colors"
            aria-label="البحث في الأقسام"
          />
          <Search className="absolute right-3 top-3 h-4 w-4 text-slate-400 pointer-events-none" />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {STATUS_FILTERS.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setStatusFilter(key)}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all whitespace-nowrap cursor-pointer ${
                statusFilter === key
                  ? key === "all"
                    ? "bg-[#0B2D5B] dark:bg-[#1E73D8] text-white"
                    : key === "Published"
                    ? "bg-emerald-600 text-white"
                    : key === "Draft"
                    ? "bg-amber-600 text-white"
                    : key === "Archived"
                    ? "bg-zinc-600 text-white"
                    : "bg-slate-700 text-white"
                  : "bg-white dark:bg-[#0F274D] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="h-10 px-3 rounded-xl bg-white dark:bg-[#0F274D] dark:bg-[#0B2D5B] border border-slate-200 dark:border-white/10 text-xs font-bold outline-none cursor-pointer focus:border-[#F58220]"
          aria-label="ترتيب الأقسام"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Refresh */}
        <button
          type="button"
          onClick={() => refetch()}
          className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 transition-colors cursor-pointer"
          title="تحديث القائمة"
          aria-label="تحديث"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* ─── Content ─────────────────────────────────────────────────────── */}
      {isLoading ? (
        <SectionSkeleton />
      ) : isError ? (
        <div className="flex flex-col items-center justify-center py-16 gap-4 bg-white dark:bg-[#0F274D] rounded-3xl border border-rose-200 dark:border-rose-700/30">
          <p className="text-sm font-bold text-rose-600 dark:text-rose-400">
            تعذر جلب بيانات الأقسام
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold cursor-pointer"
          >
            إعادة المحاولة
          </button>
        </div>
      ) : sections.length === 0 ? (
        <SectionEmptyState
          filtered={isFiltered}
          onCreateClick={!isFiltered ? () => setIsCreateOpen(true) : undefined}
        />
      ) : (
        <SectionReorder
          courseId={courseId}
          sections={sections}
          onEdit={setEditTarget}
          onDelete={setDeleteTarget}
          onArchive={setArchiveTarget}
          onRestore={setRestoreTarget}
          onDuplicate={setDuplicateTarget}
        />
      )}

      {/* ─── Dialogs ─────────────────────────────────────────────────────── */}
      <CreateSectionDialog
        courseId={courseId}
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />

      <EditSectionDialog
        courseId={courseId}
        section={editTarget}
        isOpen={!!editTarget}
        onClose={() => setEditTarget(null)}
      />

      <DeleteSectionDialog
        courseId={courseId}
        section={deleteTarget}
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
      />

      <ArchiveSectionDialog
        courseId={courseId}
        section={archiveTarget}
        isOpen={!!archiveTarget}
        onClose={() => setArchiveTarget(null)}
      />

      <RestoreSectionDialog
        courseId={courseId}
        section={restoreTarget}
        isOpen={!!restoreTarget}
        onClose={() => setRestoreTarget(null)}
      />

      <DuplicateSectionDialog
        courseId={courseId}
        section={duplicateTarget}
        isOpen={!!duplicateTarget}
        onClose={() => setDuplicateTarget(null)}
      />
    </div>
  );
}

export default SectionList;

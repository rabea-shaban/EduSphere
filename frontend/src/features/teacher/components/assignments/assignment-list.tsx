"use client";

import * as React from "react";
import { Search, PlusCircle, RefreshCw } from "lucide-react";
import { useAssignments } from "@/hooks/useAssignments";
import type { ApiAssignment, AssignmentStatus, AssignmentFilters } from "@/features/teacher/types/assignment";
import { AssignmentSkeleton } from "./assignment-skeleton";
import { AssignmentEmptyState } from "./assignment-empty-state";
import { AssignmentCard } from "./assignment-card";
import { CreateAssignmentDialog } from "./create-assignment-dialog";
import { EditAssignmentDialog } from "./edit-assignment-dialog";
import { DeleteAssignmentDialog } from "./delete-assignment-dialog";
import { ArchiveAssignmentDialog } from "./archive-assignment-dialog";
import { RestoreAssignmentDialog } from "./restore-assignment-dialog";
import { DuplicateAssignmentDialog } from "./duplicate-assignment-dialog";
import { PublishAssignmentDialog } from "./publish-assignment-dialog";
import { AssignmentSubmissionsModal } from "./assignment-submissions-modal";
import { AssignmentAnalyticsModal } from "./assignment-analytics-modal";

interface AssignmentListProps {
  courseId?: string;
  sectionId?: string;
  lessonId?: string;
}

export function AssignmentList({ courseId, sectionId, lessonId }: AssignmentListProps) {
  // Dialog States
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [editTarget, setEditTarget] = React.useState<ApiAssignment | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<ApiAssignment | null>(null);
  const [archiveTarget, setArchiveTarget] = React.useState<ApiAssignment | null>(null);
  const [restoreTarget, setRestoreTarget] = React.useState<ApiAssignment | null>(null);
  const [duplicateTarget, setDuplicateTarget] = React.useState<ApiAssignment | null>(null);
  const [publishTarget, setPublishTarget] = React.useState<{ assignment: ApiAssignment; mode: "publish" | "unpublish" } | null>(null);
  const [submissionsTarget, setSubmissionsTarget] = React.useState<ApiAssignment | null>(null);
  const [analyticsTarget, setAnalyticsTarget] = React.useState<ApiAssignment | null>(null);

  // Filter States
  const [search, setSearch] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<AssignmentStatus | "ALL">("ALL");

  React.useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  const filters: AssignmentFilters = {
    ...(debouncedSearch ? { search: debouncedSearch } : {}),
    ...(statusFilter !== "ALL" ? { status: statusFilter } : {}),
    ...(courseId ? { courseId } : {}),
    ...(sectionId ? { sectionId } : {}),
    ...(lessonId ? { lessonId } : {}),
    limit: 100,
  };

  const { data, isLoading, isError, refetch } = useAssignments(filters);

  const assignments = data?.assignments || [];
  const total = data?.pagination?.total || 0;
  const isFiltered = !!debouncedSearch || statusFilter !== "ALL";

  return (
    <div className="space-y-4 text-right dir-rtl">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-50/70 dark:bg-[#0B2D5B]/30 p-3.5 rounded-2xl border border-slate-200/60 dark:border-white/5">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-[#0B2D5B] dark:text-white">
            قائمة الواجبات التطبيقية
          </span>
          {!isLoading && (
            <span className="px-2 py-0.5 rounded-full bg-slate-200/70 dark:bg-white/10 text-[11px] font-bold">
              {total}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
          {/* Search */}
          <div className="relative flex-1 sm:w-48">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="بحث باسم الواجب..."
              className="w-full h-8 pr-8 pl-3 rounded-lg text-[11px] font-semibold bg-white dark:bg-[#0B2D5B] border border-slate-200 dark:border-white/10 outline-none focus:border-[#F58220]"
            />
            <Search className="absolute right-2.5 top-2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="h-8 px-2 rounded-lg bg-white dark:bg-[#0B2D5B] border border-slate-200 dark:border-white/10 text-[11px] font-bold outline-none cursor-pointer"
          >
            <option value="ALL">جميع الحالات</option>
            <option value="Published">منشور</option>
            <option value="Draft">مسودة</option>
            <option value="Closed">مغلق</option>
            <option value="Archived">مؤرشف</option>
          </select>

          {/* Refresh */}
          <button
            type="button"
            onClick={() => refetch()}
            className="p-2 rounded-lg hover:bg-slate-200/60 dark:hover:bg-white/10 text-slate-500 transition-colors cursor-pointer"
            title="تحديث"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
          </button>

          {/* Add Assignment Button */}
          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="h-8 px-3 rounded-lg bg-gradient-to-r from-[#F58220] to-[#FF9A2A] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm hover:opacity-90 transition-opacity cursor-pointer shrink-0"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span>إضافة واجب</span>
          </button>
        </div>
      </div>

      {/* Main List */}
      {isLoading ? (
        <AssignmentSkeleton />
      ) : isError ? (
        <div className="p-4 rounded-xl bg-rose-50 text-center text-xs font-bold text-rose-600">
          تعذر جلب قائمة الواجبات
        </div>
      ) : assignments.length === 0 ? (
        <AssignmentEmptyState
          filtered={isFiltered}
          onCreateClick={!isFiltered ? () => setIsCreateOpen(true) : undefined}
        />
      ) : (
        <div className="space-y-3">
          {assignments.map((assignment, idx) => (
            <AssignmentCard
              key={assignment._id}
              assignment={assignment}
              index={idx}
              onEdit={setEditTarget}
              onSubmissions={setSubmissionsTarget}
              onAnalytics={setAnalyticsTarget}
              onDelete={setDeleteTarget}
              onPublish={(a) => setPublishTarget({ assignment: a, mode: "publish" })}
              onUnpublish={(a) => setPublishTarget({ assignment: a, mode: "unpublish" })}
              onArchive={setArchiveTarget}
              onRestore={setRestoreTarget}
              onDuplicate={setDuplicateTarget}
            />
          ))}
        </div>
      )}

      {/* Dialogs */}
      <CreateAssignmentDialog
        courseId={courseId}
        sectionId={sectionId}
        lessonId={lessonId}
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />

      <EditAssignmentDialog
        assignment={editTarget}
        isOpen={!!editTarget}
        onClose={() => setEditTarget(null)}
      />

      <DeleteAssignmentDialog
        assignment={deleteTarget}
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
      />

      <ArchiveAssignmentDialog
        assignment={archiveTarget}
        isOpen={!!archiveTarget}
        onClose={() => setArchiveTarget(null)}
      />

      <RestoreAssignmentDialog
        assignment={restoreTarget}
        isOpen={!!restoreTarget}
        onClose={() => setRestoreTarget(null)}
      />

      <DuplicateAssignmentDialog
        assignment={duplicateTarget}
        isOpen={!!duplicateTarget}
        onClose={() => setDuplicateTarget(null)}
      />

      <PublishAssignmentDialog
        assignment={publishTarget?.assignment || null}
        mode={publishTarget?.mode || "publish"}
        isOpen={!!publishTarget}
        onClose={() => setPublishTarget(null)}
      />

      <AssignmentSubmissionsModal
        assignment={submissionsTarget}
        isOpen={!!submissionsTarget}
        onClose={() => setSubmissionsTarget(null)}
      />

      <AssignmentAnalyticsModal
        assignment={analyticsTarget}
        isOpen={!!analyticsTarget}
        onClose={() => setAnalyticsTarget(null)}
      />
    </div>
  );
}

export default AssignmentList;

"use client";

import * as React from "react";
import { Sparkles, PlusCircle, RefreshCw, FileCheck2, Award, CheckCircle2, Clock } from "lucide-react";
import { useAssignments } from "@/hooks/useAssignments";
import type { ApiAssignment, AssignmentStatus, AssignmentFilters } from "@/features/teacher/types/assignment";
import { AssignmentSkeleton } from "@/features/teacher/components/assignments/assignment-skeleton";
import { AssignmentEmptyState } from "@/features/teacher/components/assignments/assignment-empty-state";
import { AssignmentCard } from "@/features/teacher/components/assignments/assignment-card";
import { CreateAssignmentDialog } from "@/features/teacher/components/assignments/create-assignment-dialog";
import { EditAssignmentDialog } from "@/features/teacher/components/assignments/edit-assignment-dialog";
import { DeleteAssignmentDialog } from "@/features/teacher/components/assignments/delete-assignment-dialog";
import { ArchiveAssignmentDialog } from "@/features/teacher/components/assignments/archive-assignment-dialog";
import { RestoreAssignmentDialog } from "@/features/teacher/components/assignments/restore-assignment-dialog";
import { DuplicateAssignmentDialog } from "@/features/teacher/components/assignments/duplicate-assignment-dialog";
import { PublishAssignmentDialog } from "@/features/teacher/components/assignments/publish-assignment-dialog";
import { AssignmentSubmissionsModal } from "@/features/teacher/components/assignments/assignment-submissions-modal";
import { AssignmentAnalyticsModal } from "@/features/teacher/components/assignments/assignment-analytics-modal";

export default function InstructorAssignmentsPage() {
  const [search, setSearch] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  const [selectedStatus, setSelectedStatus] = React.useState<AssignmentStatus | "ALL">("ALL");

  // Dialog targets
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [editTarget, setEditTarget] = React.useState<ApiAssignment | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<ApiAssignment | null>(null);
  const [archiveTarget, setArchiveTarget] = React.useState<ApiAssignment | null>(null);
  const [restoreTarget, setRestoreTarget] = React.useState<ApiAssignment | null>(null);
  const [duplicateTarget, setDuplicateTarget] = React.useState<ApiAssignment | null>(null);
  const [publishTarget, setPublishTarget] = React.useState<{ assignment: ApiAssignment; mode: "publish" | "unpublish" } | null>(null);
  const [submissionsTarget, setSubmissionsTarget] = React.useState<ApiAssignment | null>(null);
  const [analyticsTarget, setAnalyticsTarget] = React.useState<ApiAssignment | null>(null);

  React.useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  const filters: AssignmentFilters = {
    ...(debouncedSearch ? { search: debouncedSearch } : {}),
    ...(selectedStatus !== "ALL" ? { status: selectedStatus } : {}),
    limit: 100,
  };

  const { data, isLoading, isError, refetch } = useAssignments(filters);

  const assignments = data?.assignments || [];
  const total = data?.pagination?.total || 0;
  const isFiltered = !!debouncedSearch || selectedStatus !== "ALL";

  const stats = React.useMemo(() => {
    const totalCount = total;
    const publishedCount = assignments.filter((a) => a.status === "Published").length;
    const draftCount = assignments.filter((a) => a.status === "Draft").length;
    const closedCount = assignments.filter((a) => a.status === "Closed").length;
    return { totalCount, publishedCount, draftCount, closedCount };
  }, [assignments, total]);

  return (
    <div className="space-y-8 text-right dir-rtl max-w-6xl mx-auto pb-12">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-2xl bg-indigo-500/10 text-indigo-500">
              <Sparkles className="h-5 w-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#0B2D5B] dark:text-white">
              منظومة الواجبات والتطبيقات العملية
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            إدارة الواجبات، استقبال مشاريع الطلاب، التصحيح اليدوي ورصد التغذية الراجعة
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
          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="h-11 px-5 rounded-2xl bg-gradient-to-r from-[#F58220] to-[#FF9A2A] text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-[#F58220]/20 hover:-translate-y-0.5 transition-all cursor-pointer whitespace-nowrap"
          >
            <PlusCircle className="h-4 w-4" />
            <span>إضافة واجب جديد</span>
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-[#0F274D] border border-slate-200/80 dark:border-white/10 flex items-center gap-3">
          <span className="h-10 w-10 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center font-black">
            <FileCheck2 className="h-5 w-5" />
          </span>
          <div>
            <p className="text-[11px] text-slate-400 font-semibold">إجمالي الواجبات</p>
            <p className="text-lg font-black text-[#0B2D5B] dark:text-white">{stats.totalCount}</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#0F274D] border border-slate-200/80 dark:border-white/10 flex items-center gap-3">
          <span className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-black">
            <CheckCircle2 className="h-5 w-5" />
          </span>
          <div>
            <p className="text-[11px] text-slate-400 font-semibold">الواجبات المنشورة</p>
            <p className="text-lg font-black text-[#0B2D5B] dark:text-white">{stats.publishedCount}</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#0F274D] border border-slate-200/80 dark:border-white/10 flex items-center gap-3">
          <span className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-black">
            <Award className="h-5 w-5" />
          </span>
          <div>
            <p className="text-[11px] text-slate-400 font-semibold">المسودات</p>
            <p className="text-lg font-black text-[#0B2D5B] dark:text-white">{stats.draftCount}</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#0F274D] border border-slate-200/80 dark:border-white/10 flex items-center gap-3">
          <span className="h-10 w-10 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center font-black">
            <Clock className="h-5 w-5" />
          </span>
          <div>
            <p className="text-[11px] text-slate-400 font-semibold">الواجبات المغلقة</p>
            <p className="text-lg font-black text-[#0B2D5B] dark:text-white">{stats.closedCount}</p>
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
              placeholder="البحث باسم الواجب أو الوصف..."
              className="w-full h-11 pr-10 pl-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none focus:border-[#F58220]"
            />
          </div>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as any)}
            className="h-11 px-4 rounded-2xl bg-slate-50 dark:bg-white/5 dark:bg-[#0B2D5B] border border-slate-200 dark:border-white/10 text-xs font-bold outline-none cursor-pointer w-full sm:w-auto"
          >
            <option value="ALL">جميع حالات الواجبات</option>
            <option value="Published">منشور للطلاب</option>
            <option value="Draft">مسودة</option>
            <option value="Closed">مغلق</option>
            <option value="Archived">مؤرشف</option>
          </select>
        </div>
      </div>

      {/* List Content */}
      {isLoading ? (
        <AssignmentSkeleton />
      ) : isError ? (
        <div className="p-10 text-center bg-white dark:bg-[#0F274D] rounded-3xl border border-rose-200 dark:border-rose-700/30">
          <p className="text-sm font-bold text-rose-600">تعذر جلب بيانات الواجبات من السيرفر</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-3 px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold cursor-pointer"
          >
            إعادة المحاولة
          </button>
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

      {/* Action Dialogs */}
      <CreateAssignmentDialog
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

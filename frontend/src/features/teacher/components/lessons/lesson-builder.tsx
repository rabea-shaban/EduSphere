"use client";

import * as React from "react";
import { useSections } from "@/hooks/useSections";
import { SectionSkeleton } from "@/features/teacher/components/sections/section-skeleton";
import { SectionEmptyState } from "@/features/teacher/components/sections/section-empty-state";
import { SectionReorder } from "@/features/teacher/components/sections/section-reorder";
import { CreateSectionDialog } from "@/features/teacher/components/sections/create-section-dialog";
import { EditSectionDialog } from "@/features/teacher/components/sections/edit-section-dialog";
import { DeleteSectionDialog } from "@/features/teacher/components/sections/delete-section-dialog";
import { ArchiveSectionDialog } from "@/features/teacher/components/sections/archive-section-dialog";
import { RestoreSectionDialog } from "@/features/teacher/components/sections/restore-section-dialog";
import { DuplicateSectionDialog } from "@/features/teacher/components/sections/duplicate-section-dialog";
import { LessonList } from "./lesson-list";
import type { ApiSection } from "@/features/teacher/types/section";
import { Layers, PlusCircle, RefreshCw } from "lucide-react";

interface LessonBuilderProps {
  courseId: string;
  courseTitle?: string;
}

export function LessonBuilder({ courseId, courseTitle }: LessonBuilderProps) {
  const [isCreateSectionOpen, setIsCreateSectionOpen] = React.useState(false);
  const [editSectionTarget, setEditSectionTarget] = React.useState<ApiSection | null>(null);
  const [deleteSectionTarget, setDeleteSectionTarget] = React.useState<ApiSection | null>(null);
  const [archiveSectionTarget, setArchiveSectionTarget] = React.useState<ApiSection | null>(null);
  const [restoreSectionTarget, setRestoreSectionTarget] = React.useState<ApiSection | null>(null);
  const [duplicateSectionTarget, setDuplicateSectionTarget] = React.useState<ApiSection | null>(null);

  const { data, isLoading, isError, refetch } = useSections(courseId, { limit: 100 });
  const sections = data?.sections || [];

  return (
    <div className="space-y-5 text-right dir-rtl">
      {/* Builder Header */}
      <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-[#0F274D] border border-slate-200 dark:border-white/10">
        <div className="flex items-center gap-3">
          <span className="h-10 w-10 rounded-xl bg-[#F58220]/10 flex items-center justify-center shrink-0">
            <Layers className="h-5 w-5 text-[#F58220]" />
          </span>
          <div>
            <h2 className="text-sm font-black text-[#0B2D5B] dark:text-white">
              بناء منهج الكورس (أقسام ودروس)
            </h2>
            {courseTitle && (
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-xs">
                {courseTitle}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => refetch()}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 transition-colors cursor-pointer"
            title="تحديث الهيكلية"
            aria-label="تحديث"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </button>
          <button
            type="button"
            onClick={() => setIsCreateSectionOpen(true)}
            className="h-10 px-4 rounded-xl bg-gradient-to-r from-[#F58220] to-[#FF9A2A] text-white text-xs font-bold flex items-center gap-2 shadow-sm hover:opacity-90 transition-opacity cursor-pointer shrink-0"
          >
            <PlusCircle className="h-4 w-4" />
            <span>إضافة قسم جديد</span>
          </button>
        </div>
      </div>

      {/* Sections Tree */}
      {isLoading ? (
        <SectionSkeleton />
      ) : isError ? (
        <div className="p-6 rounded-2xl bg-rose-50 text-center text-rose-600 font-bold text-xs">
          تعذر جلب الأقسام والدروس
        </div>
      ) : sections.length === 0 ? (
        <SectionEmptyState onCreateClick={() => setIsCreateSectionOpen(true)} />
      ) : (
        <div className="space-y-4">
          <SectionReorder
            courseId={courseId}
            sections={sections}
            onEdit={setEditSectionTarget}
            onDelete={setDeleteSectionTarget}
            onArchive={setArchiveSectionTarget}
            onRestore={setRestoreSectionTarget}
            onDuplicate={setDuplicateSectionTarget}
          />
        </div>
      )}

      {/* Section Dialogs */}
      <CreateSectionDialog
        courseId={courseId}
        isOpen={isCreateSectionOpen}
        onClose={() => setIsCreateSectionOpen(false)}
      />
      <EditSectionDialog
        courseId={courseId}
        section={editSectionTarget}
        isOpen={!!editSectionTarget}
        onClose={() => setEditSectionTarget(null)}
      />
      <DeleteSectionDialog
        courseId={courseId}
        section={deleteSectionTarget}
        isOpen={!!deleteSectionTarget}
        onClose={() => setDeleteSectionTarget(null)}
      />
      <ArchiveSectionDialog
        courseId={courseId}
        section={archiveSectionTarget}
        isOpen={!!archiveSectionTarget}
        onClose={() => setArchiveSectionTarget(null)}
      />
      <RestoreSectionDialog
        courseId={courseId}
        section={restoreSectionTarget}
        isOpen={!!restoreSectionTarget}
        onClose={() => setRestoreSectionTarget(null)}
      />
      <DuplicateSectionDialog
        courseId={courseId}
        section={duplicateSectionTarget}
        isOpen={!!duplicateSectionTarget}
        onClose={() => setDuplicateSectionTarget(null)}
      />
    </div>
  );
}

export default LessonBuilder;

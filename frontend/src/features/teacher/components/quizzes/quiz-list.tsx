"use client";

import * as React from "react";
import { Search, PlusCircle, RefreshCw } from "lucide-react";
import { useQuizzes } from "@/hooks/useQuizzes";
import type { ApiQuiz, QuizStatus, QuizFilters } from "@/features/teacher/types/quiz";
import { QuizSkeleton } from "./quiz-skeleton";
import { QuizEmptyState } from "./quiz-empty-state";
import { QuizCard } from "./quiz-card";
import { CreateQuizDialog } from "./create-quiz-dialog";
import { EditQuizDialog } from "./edit-quiz-dialog";
import { DeleteQuizDialog } from "./delete-quiz-dialog";
import { ArchiveQuizDialog } from "./archive-quiz-dialog";
import { RestoreQuizDialog } from "./restore-quiz-dialog";
import { DuplicateQuizDialog } from "./duplicate-quiz-dialog";
import { PublishQuizDialog } from "./publish-quiz-dialog";
import { QuestionBuilderDialog } from "./question-builder-dialog";
import { QuizAnalyticsModal } from "./quiz-analytics-modal";

interface QuizListProps {
  courseId?: string;
  sectionId?: string;
  lessonId?: string;
}

export function QuizList({ courseId, sectionId, lessonId }: QuizListProps) {
  // Dialog States
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [editTarget, setEditTarget] = React.useState<ApiQuiz | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<ApiQuiz | null>(null);
  const [archiveTarget, setArchiveTarget] = React.useState<ApiQuiz | null>(null);
  const [restoreTarget, setRestoreTarget] = React.useState<ApiQuiz | null>(null);
  const [duplicateTarget, setDuplicateTarget] = React.useState<ApiQuiz | null>(null);
  const [publishTarget, setPublishTarget] = React.useState<{ quiz: ApiQuiz; mode: "publish" | "unpublish" } | null>(null);
  const [questionsTarget, setQuestionsTarget] = React.useState<ApiQuiz | null>(null);
  const [analyticsTarget, setAnalyticsTarget] = React.useState<ApiQuiz | null>(null);

  // Filter States
  const [search, setSearch] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<QuizStatus | "ALL">("ALL");

  React.useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  const filters: QuizFilters = {
    ...(debouncedSearch ? { search: debouncedSearch } : {}),
    ...(statusFilter !== "ALL" ? { status: statusFilter } : {}),
    ...(courseId ? { courseId } : {}),
    ...(sectionId ? { sectionId } : {}),
    ...(lessonId ? { lessonId } : {}),
    limit: 100,
  };

  const { data, isLoading, isError, refetch } = useQuizzes(filters);

  const quizzes = data?.quizzes || [];
  const total = data?.pagination?.total || 0;
  const isFiltered = !!debouncedSearch || statusFilter !== "ALL";

  return (
    <div className="space-y-4 text-right dir-rtl">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-50/70 dark:bg-[#0B2D5B]/30 p-3.5 rounded-2xl border border-slate-200/60 dark:border-white/5">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-[#0B2D5B] dark:text-white">
            قائمة الاختبارات التقييمية
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
              placeholder="بحث باسم الاختبار..."
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

          {/* Add Quiz Button */}
          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="h-8 px-3 rounded-lg bg-gradient-to-r from-[#F58220] to-[#FF9A2A] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm hover:opacity-90 transition-opacity cursor-pointer shrink-0"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span>إضافة اختبار</span>
          </button>
        </div>
      </div>

      {/* Main List */}
      {isLoading ? (
        <QuizSkeleton />
      ) : isError ? (
        <div className="p-4 rounded-xl bg-rose-50 text-center text-xs font-bold text-rose-600">
          تعذر جلب قائمة الاختبارات
        </div>
      ) : quizzes.length === 0 ? (
        <QuizEmptyState
          filtered={isFiltered}
          onCreateClick={!isFiltered ? () => setIsCreateOpen(true) : undefined}
        />
      ) : (
        <div className="space-y-3">
          {quizzes.map((quiz, idx) => (
            <QuizCard
              key={quiz._id}
              quiz={quiz}
              index={idx}
              onEdit={setEditTarget}
              onQuestions={setQuestionsTarget}
              onAnalytics={setAnalyticsTarget}
              onDelete={setDeleteTarget}
              onPublish={(q) => setPublishTarget({ quiz: q, mode: "publish" })}
              onUnpublish={(q) => setPublishTarget({ quiz: q, mode: "unpublish" })}
              onArchive={setArchiveTarget}
              onRestore={setRestoreTarget}
              onDuplicate={setDuplicateTarget}
            />
          ))}
        </div>
      )}

      {/* Dialogs */}
      <CreateQuizDialog
        courseId={courseId}
        sectionId={sectionId}
        lessonId={lessonId}
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />

      <EditQuizDialog
        quiz={editTarget}
        isOpen={!!editTarget}
        onClose={() => setEditTarget(null)}
      />

      <DeleteQuizDialog
        quiz={deleteTarget}
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
      />

      <ArchiveQuizDialog
        quiz={archiveTarget}
        isOpen={!!archiveTarget}
        onClose={() => setArchiveTarget(null)}
      />

      <RestoreQuizDialog
        quiz={restoreTarget}
        isOpen={!!restoreTarget}
        onClose={() => setRestoreTarget(null)}
      />

      <DuplicateQuizDialog
        quiz={duplicateTarget}
        isOpen={!!duplicateTarget}
        onClose={() => setDuplicateTarget(null)}
      />

      <PublishQuizDialog
        quiz={publishTarget?.quiz || null}
        mode={publishTarget?.mode || "publish"}
        isOpen={!!publishTarget}
        onClose={() => setPublishTarget(null)}
      />

      <QuestionBuilderDialog
        quiz={questionsTarget}
        isOpen={!!questionsTarget}
        onClose={() => setQuestionsTarget(null)}
      />

      <QuizAnalyticsModal
        quiz={analyticsTarget}
        isOpen={!!analyticsTarget}
        onClose={() => setAnalyticsTarget(null)}
      />
    </div>
  );
}

export default QuizList;

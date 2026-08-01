"use client";

import * as React from "react";
import { Sparkles, PlusCircle, RefreshCw, HelpCircle, Award, CheckCircle2, Clock } from "lucide-react";
import { useQuizzes } from "@/hooks/useQuizzes";
import type { ApiQuiz, QuizStatus, QuizFilters } from "@/features/teacher/types/quiz";
import { QuizSkeleton } from "@/features/teacher/components/quizzes/quiz-skeleton";
import { QuizEmptyState } from "@/features/teacher/components/quizzes/quiz-empty-state";
import { QuizCard } from "@/features/teacher/components/quizzes/quiz-card";
import { CreateQuizDialog } from "@/features/teacher/components/quizzes/create-quiz-dialog";
import { EditQuizDialog } from "@/features/teacher/components/quizzes/edit-quiz-dialog";
import { DeleteQuizDialog } from "@/features/teacher/components/quizzes/delete-quiz-dialog";
import { ArchiveQuizDialog } from "@/features/teacher/components/quizzes/archive-quiz-dialog";
import { RestoreQuizDialog } from "@/features/teacher/components/quizzes/restore-quiz-dialog";
import { DuplicateQuizDialog } from "@/features/teacher/components/quizzes/duplicate-quiz-dialog";
import { PublishQuizDialog } from "@/features/teacher/components/quizzes/publish-quiz-dialog";
import { QuestionBuilderDialog } from "@/features/teacher/components/quizzes/question-builder-dialog";
import { QuizAnalyticsModal } from "@/features/teacher/components/quizzes/quiz-analytics-modal";
import { QuizLeaderboardModal } from "@/features/teacher/components/quizzes/quiz-leaderboard-modal";

export default function QuizzesManagementPage() {
  const [search, setSearch] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  const [selectedStatus, setSelectedStatus] = React.useState<QuizStatus | "ALL">("ALL");

  // Dialog targets
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [editTarget, setEditTarget] = React.useState<ApiQuiz | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<ApiQuiz | null>(null);
  const [archiveTarget, setArchiveTarget] = React.useState<ApiQuiz | null>(null);
  const [restoreTarget, setRestoreTarget] = React.useState<ApiQuiz | null>(null);
  const [duplicateTarget, setDuplicateTarget] = React.useState<ApiQuiz | null>(null);
  const [publishTarget, setPublishTarget] = React.useState<{ quiz: ApiQuiz; mode: "publish" | "unpublish" } | null>(null);
  const [questionsTarget, setQuestionsTarget] = React.useState<ApiQuiz | null>(null);
  const [analyticsTarget, setAnalyticsTarget] = React.useState<ApiQuiz | null>(null);
  const [leaderboardTarget, setLeaderboardTarget] = React.useState<ApiQuiz | null>(null);

  React.useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  const filters: QuizFilters = {
    ...(debouncedSearch ? { search: debouncedSearch } : {}),
    ...(selectedStatus !== "ALL" ? { status: selectedStatus } : {}),
    limit: 100,
  };

  const { data, isLoading, isError, refetch } = useQuizzes(filters);

  const quizzes = data?.quizzes || [];
  const total = data?.pagination?.total || 0;
  const isFiltered = !!debouncedSearch || selectedStatus !== "ALL";

  const stats = React.useMemo(() => {
    const totalCount = total;
    const publishedCount = quizzes.filter((q) => q.status === "Published").length;
    const draftCount = quizzes.filter((q) => q.status === "Draft").length;
    const totalQuestionsCount = quizzes.reduce(
      (sum, q) => sum + (q.totalQuestions || q.questions?.length || 0),
      0
    );
    return { totalCount, publishedCount, draftCount, totalQuestionsCount };
  }, [quizzes, total]);

  return (
    <div className="space-y-8 text-right dir-rtl max-w-6xl mx-auto pb-12">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-2xl bg-amber-500/10 text-amber-500">
              <Sparkles className="h-5 w-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#0B2D5B] dark:text-white">
              منظومة إعداد وإدارة الاختبارات والتقييمات
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            إنشاء الاختبارات الإلكترونية، بناء بنوك الأسئلة، ضبط الدرجات، ومتابعة التحليلات والنتائج
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
            className="h-11 px-5 rounded-2xl bg-[#F58220] hover:bg-[#e57518] text-white text-xs font-black flex items-center gap-2 shadow-lg shadow-[#F58220]/25 transition-all cursor-pointer whitespace-nowrap"
          >
            <PlusCircle className="h-4 w-4" />
            <span>إضافة اختبار جديد</span>
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-[#0F274D] border border-slate-200/80 dark:border-white/10 flex items-center gap-3">
          <span className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-black">
            <HelpCircle className="h-5 w-5" />
          </span>
          <div>
            <p className="text-[11px] text-slate-400 font-semibold">إجمالي الاختبارات</p>
            <p className="text-lg font-black text-[#0B2D5B] dark:text-white">{stats.totalCount}</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#0F274D] border border-slate-200/80 dark:border-white/10 flex items-center gap-3">
          <span className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-black">
            <CheckCircle2 className="h-5 w-5" />
          </span>
          <div>
            <p className="text-[11px] text-slate-400 font-semibold">الاختبارات المنشورة</p>
            <p className="text-lg font-black text-[#0B2D5B] dark:text-white">{stats.publishedCount}</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#0F274D] border border-slate-200/80 dark:border-white/10 flex items-center gap-3">
          <span className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center font-black">
            <Award className="h-5 w-5" />
          </span>
          <div>
            <p className="text-[11px] text-slate-400 font-semibold">المسودات</p>
            <p className="text-lg font-black text-[#0B2D5B] dark:text-white">{stats.draftCount}</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#0F274D] border border-slate-200/80 dark:border-white/10 flex items-center gap-3">
          <span className="h-10 w-10 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center font-black">
            <Clock className="h-5 w-5" />
          </span>
          <div>
            <p className="text-[11px] text-slate-400 font-semibold">إجمالي الأسئلة المتاحة</p>
            <p className="text-lg font-black text-[#0B2D5B] dark:text-white">{stats.totalQuestionsCount}</p>
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
              placeholder="البحث باسم الاختبار أو الوصف..."
              className="w-full h-11 pr-10 pl-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none focus:border-[#F58220]"
            />
          </div>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as any)}
            className="h-11 px-4 rounded-2xl bg-slate-50 dark:bg-white/5 dark:bg-[#0B2D5B] border border-slate-200 dark:border-white/10 text-xs font-bold outline-none cursor-pointer w-full sm:w-auto"
          >
            <option value="ALL">جميع حالات الاختبارات</option>
            <option value="Published">منشور للطلاب</option>
            <option value="Draft">مسودة</option>
            <option value="Archived">مؤرشف</option>
          </select>
        </div>
      </div>

      {/* List Content */}
      {isLoading ? (
        <QuizSkeleton />
      ) : isError ? (
        <div className="p-10 text-center bg-white dark:bg-[#0F274D] rounded-3xl border border-rose-200 dark:border-rose-700/30">
          <p className="text-sm font-bold text-rose-600">تعذر جلب بيانات الاختبارات من السيرفر</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-3 px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold cursor-pointer"
          >
            إعادة المحاولة
          </button>
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
              onLeaderboard={setLeaderboardTarget}
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

      {/* Action Dialogs */}
      <CreateQuizDialog
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={(createdQuiz) => {
          setIsCreateOpen(false);
          setQuestionsTarget(createdQuiz);
        }}
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

      <QuizLeaderboardModal
        quiz={leaderboardTarget}
        isOpen={!!leaderboardTarget}
        onClose={() => setLeaderboardTarget(null)}
      />
    </div>
  );
}

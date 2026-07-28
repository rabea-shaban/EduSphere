"use client";

import * as React from "react";
import {
  HelpCircle,
  Clock,
  Award,
  Edit,
  Copy,
  Archive,
  RotateCcw,
  Trash2,
  BarChart3,
  Globe,
  EyeOff,
  Layers,
  CheckCircle2,
  AlertCircle,
  FileQuestion,
} from "lucide-react";
import type { ApiQuiz, QuizStatus } from "@/features/teacher/types/quiz";

interface QuizCardProps {
  quiz: ApiQuiz;
  index: number;
  onEdit: (quiz: ApiQuiz) => void;
  onQuestions: (quiz: ApiQuiz) => void;
  onAnalytics: (quiz: ApiQuiz) => void;
  onDelete: (quiz: ApiQuiz) => void;
  onPublish: (quiz: ApiQuiz) => void;
  onUnpublish: (quiz: ApiQuiz) => void;
  onArchive: (quiz: ApiQuiz) => void;
  onRestore: (quiz: ApiQuiz) => void;
  onDuplicate: (quiz: ApiQuiz) => void;
}

const STATUS_CONFIG: Record<
  QuizStatus,
  { label: string; className: string; icon: React.ReactNode }
> = {
  Draft: {
    label: "مسودة",
    className: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
    icon: <AlertCircle className="h-3 w-3" />,
  },
  Published: {
    label: "منشور للطلاب",
    className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
    icon: <CheckCircle2 className="h-3 w-3" />,
  },
  Archived: {
    label: "مؤرشف",
    className: "bg-zinc-500/10 text-zinc-500 dark:text-zinc-400 border-zinc-500/30",
    icon: <Archive className="h-3 w-3" />,
  },
};

export function QuizCard({
  quiz,
  index,
  onEdit,
  onQuestions,
  onAnalytics,
  onDelete,
  onPublish,
  onUnpublish,
  onArchive,
  onRestore,
  onDuplicate,
}: QuizCardProps) {
  const statusConfig = STATUS_CONFIG[quiz.status] || STATUS_CONFIG.Draft;
  const isArchived = quiz.status === "Archived";
  const isPublished = quiz.status === "Published";

  const questionCount = quiz.totalQuestions || quiz.questions?.length || 0;
  const marksCount = quiz.totalMarks || quiz.questions?.reduce((s, q) => s + (q.marks || 1), 0) || 0;

  return (
    <div className="rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#0F274D] p-5 space-y-4 hover:border-slate-300 dark:hover:border-white/20 transition-all text-right dir-rtl">
      {/* Top Header Row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <span className="h-10 w-10 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-black shrink-0">
            <HelpCircle className="h-5 w-5" />
          </span>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-black text-[#0B2D5B] dark:text-white truncate">
                {quiz.title}
              </h3>
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${statusConfig.className}`}>
                {statusConfig.icon}
                {statusConfig.label}
              </span>
            </div>

            {quiz.description && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                {quiz.description}
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 shrink-0">
          {/* Questions Builder */}
          <button
            type="button"
            onClick={() => onQuestions(quiz)}
            className="px-3 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 hover:bg-amber-100 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="بناء الأسئلة والخيارات"
          >
            <FileQuestion className="h-4 w-4" />
            <span className="hidden sm:inline">الأسئلة ({questionCount})</span>
          </button>

          {/* Analytics */}
          <button
            type="button"
            onClick={() => onAnalytics(quiz)}
            className="p-2 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer"
            title="تحليلات وإحصائيات الاختبار"
            aria-label="التحليلات"
          >
            <BarChart3 className="h-4 w-4" />
          </button>

          {/* Edit */}
          <button
            type="button"
            onClick={() => onEdit(quiz)}
            className="p-2 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-950/40 text-slate-500 hover:text-blue-600 transition-colors cursor-pointer"
            title="تعديل الإعدادات"
            aria-label="تعديل"
          >
            <Edit className="h-4 w-4" />
          </button>

          {/* Duplicate */}
          <button
            type="button"
            onClick={() => onDuplicate(quiz)}
            className="p-2 rounded-xl hover:bg-violet-50 dark:hover:bg-violet-950/40 text-slate-500 hover:text-violet-600 transition-colors cursor-pointer"
            title="تكرار الاختبار"
            aria-label="تكرار"
          >
            <Copy className="h-4 w-4" />
          </button>

          {/* Publish / Unpublish */}
          {isPublished ? (
            <button
              type="button"
              onClick={() => onUnpublish(quiz)}
              className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 transition-colors cursor-pointer"
              title="إلغاء النشر (تحويل لمسودة)"
              aria-label="إلغاء النشر"
            >
              <EyeOff className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onPublish(quiz)}
              className="p-2 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-500 hover:text-emerald-600 transition-colors cursor-pointer"
              title="نشر للطلاب"
              aria-label="نشر"
            >
              <Globe className="h-4 w-4" />
            </button>
          )}

          {/* Archive / Restore */}
          {isArchived ? (
            <button
              type="button"
              onClick={() => onRestore(quiz)}
              className="p-2 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-500 hover:text-emerald-600 transition-colors cursor-pointer"
              title="استعادة الاختبار"
              aria-label="استعادة"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onArchive(quiz)}
              className="p-2 rounded-xl hover:bg-amber-50 dark:hover:bg-amber-950/40 text-slate-500 hover:text-amber-600 transition-colors cursor-pointer"
              title="أرشفة الاختبار"
              aria-label="أرشفة"
            >
              <Archive className="h-4 w-4" />
            </button>
          )}

          {/* Delete */}
          <button
            type="button"
            onClick={() => onDelete(quiz)}
            className="p-2 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
            title="حذف الاختبار"
            aria-label="حذف"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-white/5 flex-wrap">
        <span className="flex items-center gap-1">
          <HelpCircle className="h-3.5 w-3.5 text-amber-500" />
          <strong>{questionCount}</strong> سؤال ({marksCount} درجة)
        </span>
        <span className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5 text-sky-500" />
          {quiz.duration > 0 ? `${quiz.duration} دقيقة` : "بدون حد زمني"}
        </span>
        <span className="flex items-center gap-1">
          <Award className="h-3.5 w-3.5 text-emerald-500" />
          الدرجة الأدنى للنجاح: <strong>{quiz.passingScore}</strong> ({quiz.passingPercentage}%)
        </span>
        <span className="flex items-center gap-1">
          <Layers className="h-3.5 w-3.5 text-indigo-500" />
          المحاولات المتاحة: {quiz.attemptLimit > 0 ? quiz.attemptLimit : "غير محدد"}
        </span>
      </div>
    </div>
  );
}

export default QuizCard;

"use client";

import * as React from "react";
import {
  GripVertical,
  Video,
  Volume2,
  FileText,
  Radio,
  FileDown,
  Globe,
  Sparkles,
  HelpCircle,
  BookOpen,
  Edit,
  Copy,
  FolderInput,
  Archive,
  RotateCcw,
  Trash2,
  Eye,
  Clock,
  CheckCircle2,
  AlertCircle,
  Calendar,
} from "lucide-react";
import type { ApiLesson, LessonType, LessonStatus } from "@/features/teacher/types/lesson";

interface LessonCardProps {
  lesson: ApiLesson;
  index: number;
  isDragging?: boolean;
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
  onEdit: (lesson: ApiLesson) => void;
  onDelete: (lesson: ApiLesson) => void;
  onArchive: (lesson: ApiLesson) => void;
  onRestore: (lesson: ApiLesson) => void;
  onDuplicate: (lesson: ApiLesson) => void;
  onMove: (lesson: ApiLesson) => void;
}

const TYPE_ICONS: Record<LessonType, React.ReactNode> = {
  Video: <Video className="h-4 w-4 text-sky-500" />,
  Audio: <Volume2 className="h-4 w-4 text-indigo-500" />,
  Article: <FileText className="h-4 w-4 text-emerald-500" />,
  Live: <Radio className="h-4 w-4 text-rose-500" />,
  PDF: <FileDown className="h-4 w-4 text-amber-500" />,
  Resource: <Globe className="h-4 w-4 text-indigo-500" />,
  Interactive: <Sparkles className="h-4 w-4 text-purple-500" />,
  Quiz: <HelpCircle className="h-4 w-4 text-orange-500" />,
  Assignment: <BookOpen className="h-4 w-4 text-teal-500" />,
  Text: <FileText className="h-4 w-4 text-slate-500" />,
};

const TYPE_LABELS: Record<LessonType, string> = {
  Video: "فيديو",
  Audio: "صوت",
  Article: "مقال",
  Live: "بث مباشر",
  PDF: "ملف PDF",
  Resource: "مصدر خارجي",
  Interactive: "تفاعلي",
  Quiz: "اختبار",
  Assignment: "واجب",
  Text: "نص",
};

const STATUS_CONFIG: Record<
  LessonStatus,
  { label: string; className: string; icon: React.ReactNode }
> = {
  Draft: {
    label: "مسودة",
    className: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
    icon: <AlertCircle className="h-3 w-3" />,
  },
  Published: {
    label: "منشور",
    className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
    icon: <CheckCircle2 className="h-3 w-3" />,
  },
  Scheduled: {
    label: "جدولة",
    className: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30",
    icon: <Calendar className="h-3 w-3" />,
  },
  Hidden: {
    label: "مخفي",
    className: "bg-slate-500/10 text-slate-500 dark:text-slate-400 border-slate-500/30",
    icon: <AlertCircle className="h-3 w-3" />,
  },
  Archived: {
    label: "مؤرشف",
    className: "bg-zinc-500/10 text-zinc-500 dark:text-zinc-400 border-zinc-500/30",
    icon: <Archive className="h-3 w-3" />,
  },
};

export function LessonCard({
  lesson,
  index,
  isDragging,
  dragHandleProps,
  onEdit,
  onDelete,
  onArchive,
  onRestore,
  onDuplicate,
  onMove,
}: LessonCardProps) {
  const typeIcon = TYPE_ICONS[lesson.lessonType] || TYPE_ICONS.Video;
  const typeLabel = TYPE_LABELS[lesson.lessonType] || "درس";
  const statusConfig = STATUS_CONFIG[lesson.status] || STATUS_CONFIG.Draft;
  const isArchived = lesson.status === "Archived";

  return (
    <div
      className={`group rounded-xl border bg-white dark:bg-[#0B2D5B]/70 p-3 flex items-center justify-between gap-3 transition-all duration-200 ${
        isDragging
          ? "border-[#F58220]/60 shadow-lg shadow-[#F58220]/10 scale-[1.01]"
          : "border-slate-200/80 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20"
      }`}
    >
      {/* Left (Drag handle & info) */}
      <div className="flex items-center gap-2.5 min-w-0 flex-1">
        <div
          {...dragHandleProps}
          className="cursor-grab active:cursor-grabbing p-1 text-slate-300 dark:text-slate-600 hover:text-slate-500 transition-colors shrink-0 touch-none"
          aria-label="إسحب لتغيير ترتيب الدرس"
        >
          <GripVertical className="h-4 w-4" />
        </div>

        <span className="h-6 w-6 rounded-lg bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-200 text-[11px] font-bold flex items-center justify-center shrink-0">
          {index + 1}
        </span>

        <span className="h-8 w-8 rounded-lg bg-slate-100 dark:bg-white/5 flex items-center justify-center shrink-0">
          {typeIcon}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-xs font-black text-[#0B2D5B] dark:text-white truncate leading-snug">
              {lesson.title}
            </h4>
            {lesson.isPreview && (
              <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold border border-emerald-500/20 flex items-center gap-0.5">
                <Eye className="h-2.5 w-2.5" />
                معاينة مجانية
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
            <span>{typeLabel}</span>
            {lesson.duration > 0 && (
              <span className="flex items-center gap-1">
                <Clock className="h-2.5 w-2.5" />
                {lesson.duration} دقيقة
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right (Status & Actions) */}
      <div className="flex items-center gap-2 shrink-0">
        <span
          className={`hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusConfig.className}`}
        >
          {statusConfig.icon}
          {statusConfig.label}
        </span>

        <div className="flex items-center gap-0.5">
          {/* Edit */}
          <button
            type="button"
            onClick={() => onEdit(lesson)}
            className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/40 text-slate-400 hover:text-blue-600 transition-colors cursor-pointer"
            title="تعديل الدرس"
            aria-label="تعديل الدرس"
          >
            <Edit className="h-3.5 w-3.5" />
          </button>

          {/* Duplicate */}
          <button
            type="button"
            onClick={() => onDuplicate(lesson)}
            className="p-1.5 rounded-lg hover:bg-violet-50 dark:hover:bg-violet-950/40 text-slate-400 hover:text-violet-600 transition-colors cursor-pointer"
            title="تكرار الدرس"
            aria-label="تكرار الدرس"
          >
            <Copy className="h-3.5 w-3.5" />
          </button>

          {/* Move */}
          <button
            type="button"
            onClick={() => onMove(lesson)}
            className="p-1.5 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer"
            title="نقل إلى قسم آخر"
            aria-label="نقل إلى قسم آخر"
          >
            <FolderInput className="h-3.5 w-3.5" />
          </button>

          {/* Archive / Restore */}
          {isArchived ? (
            <button
              type="button"
              onClick={() => onRestore(lesson)}
              className="p-1.5 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-400 hover:text-emerald-600 transition-colors cursor-pointer"
              title="استعادة الدرس"
              aria-label="استعادة الدرس"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onArchive(lesson)}
              className="p-1.5 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-950/40 text-slate-400 hover:text-amber-600 transition-colors cursor-pointer"
              title="أرشفة الدرس"
              aria-label="أرشفة الدرس"
            >
              <Archive className="h-3.5 w-3.5" />
            </button>
          )}

          {/* Delete */}
          <button
            type="button"
            onClick={() => onDelete(lesson)}
            className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
            title="حذف الدرس"
            aria-label="حذف الدرس"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default LessonCard;

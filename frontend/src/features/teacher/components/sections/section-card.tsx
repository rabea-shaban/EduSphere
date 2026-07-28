"use client";

import * as React from "react";
import {
  GripVertical,
  ChevronDown,
  ChevronUp,
  Edit,
  Copy,
  Archive,
  RotateCcw,
  Trash2,
  Clock,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  EyeOff,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { ApiSection } from "@/features/teacher/types/section";
import { LessonList } from "@/features/teacher/components/lessons/lesson-list";

interface SectionCardProps {
  section: ApiSection;
  index: number;
  isDragging?: boolean;
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
  onEdit: (section: ApiSection) => void;
  onDelete: (section: ApiSection) => void;
  onArchive: (section: ApiSection) => void;
  onRestore: (section: ApiSection) => void;
  onDuplicate: (section: ApiSection) => void;
  children?: React.ReactNode;
}

const STATUS_CONFIG: Record<
  string,
  { label: string; className: string; icon: React.ReactNode }
> = {
  Draft: {
    label: "مسودة",
    className:
      "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
    icon: <AlertCircle className="h-3 w-3" />,
  },
  Published: {
    label: "منشور",
    className:
      "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
    icon: <CheckCircle2 className="h-3 w-3" />,
  },
  Hidden: {
    label: "مخفي",
    className:
      "bg-slate-500/10 text-slate-500 dark:text-slate-400 border-slate-500/30",
    icon: <EyeOff className="h-3 w-3" />,
  },
  Archived: {
    label: "مؤرشف",
    className:
      "bg-zinc-500/10 text-zinc-500 dark:text-zinc-400 border-zinc-500/30",
    icon: <Archive className="h-3 w-3" />,
  },
};

export function SectionCard({
  section,
  index,
  isDragging,
  dragHandleProps,
  onEdit,
  onDelete,
  onArchive,
  onRestore,
  onDuplicate,
  children,
}: SectionCardProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const statusConfig = STATUS_CONFIG[section.status] || STATUS_CONFIG.Draft;
  const isArchived = section.status === "Archived";
  const durationText =
    section.estimatedDuration > 0
      ? section.estimatedDuration >= 60
        ? `${Math.floor(section.estimatedDuration / 60)} س ${section.estimatedDuration % 60} د`
        : `${section.estimatedDuration} دقيقة`
      : null;

  const courseId =
    typeof section.courseId === "object" ? section.courseId._id : section.courseId;

  return (
    <div
      className={`rounded-2xl border bg-white dark:bg-[#0F274D] transition-all duration-200 ${
        isDragging
          ? "border-[#F58220]/60 shadow-xl shadow-[#F58220]/10 rotate-1 scale-[1.02]"
          : "border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20"
      }`}
    >
      {/* Card Header */}
      <div className="flex items-center gap-3 p-4">
        {/* Drag Handle */}
        <div
          {...dragHandleProps}
          className="cursor-grab active:cursor-grabbing p-1 text-slate-300 dark:text-slate-600 hover:text-slate-500 dark:hover:text-slate-400 transition-colors shrink-0 touch-none"
          aria-label="إسحب لإعادة الترتيب"
        >
          <GripVertical className="h-5 w-5" />
        </div>

        {/* Order Badge */}
        <span className="h-8 w-8 rounded-xl bg-[#0B2D5B] dark:bg-[#1E73D8] text-white text-xs font-black flex items-center justify-center shrink-0">
          {index + 1}
        </span>

        {/* Title & Meta */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-black text-[#0B2D5B] dark:text-white truncate leading-snug">
            {section.title}
          </h3>
          <div className="flex items-center gap-3 mt-0.5 flex-wrap">
            {durationText && (
              <span className="flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-500">
                <Clock className="h-3 w-3" />
                {durationText}
              </span>
            )}
            <span className="flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-500">
              <BookOpen className="h-3 w-3" />
              {section.totalLessons || 0} درس
            </span>
          </div>
        </div>

        {/* Status Badge */}
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black border shrink-0 ${statusConfig.className}`}
        >
          {statusConfig.icon}
          {statusConfig.label}
        </span>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 shrink-0">
          {/* Edit */}
          <button
            type="button"
            onClick={() => onEdit(section)}
            className="p-2 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-950/40 text-slate-500 hover:text-blue-600 transition-colors cursor-pointer"
            title="تعديل القسم"
            aria-label="تعديل القسم"
          >
            <Edit className="h-4 w-4" />
          </button>

          {/* Duplicate */}
          <button
            type="button"
            onClick={() => onDuplicate(section)}
            className="p-2 rounded-xl hover:bg-violet-50 dark:hover:bg-violet-950/40 text-slate-500 hover:text-violet-600 transition-colors cursor-pointer"
            title="تكرار القسم"
            aria-label="تكرار القسم"
          >
            <Copy className="h-4 w-4" />
          </button>

          {/* Archive / Restore */}
          {isArchived ? (
            <button
              type="button"
              onClick={() => onRestore(section)}
              className="p-2 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-500 hover:text-emerald-600 transition-colors cursor-pointer"
              title="استعادة القسم"
              aria-label="استعادة القسم"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onArchive(section)}
              className="p-2 rounded-xl hover:bg-amber-50 dark:hover:bg-amber-950/40 text-slate-500 hover:text-amber-600 transition-colors cursor-pointer"
              title="أرشفة القسم"
              aria-label="أرشفة القسم"
            >
              <Archive className="h-4 w-4" />
            </button>
          )}

          {/* Delete */}
          <button
            type="button"
            onClick={() => onDelete(section)}
            className="p-2 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
            title="حذف القسم"
            aria-label="حذف القسم"
          >
            <Trash2 className="h-4 w-4" />
          </button>

          {/* Expand Toggle */}
          <button
            type="button"
            onClick={() => setIsExpanded((v) => !v)}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 transition-colors cursor-pointer"
            title={isExpanded ? "طيّ دروس القسم" : "عرض دروس القسم"}
            aria-expanded={isExpanded}
            aria-label={isExpanded ? "إخفاء الدروس" : "عرض الدروس"}
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4 text-[#F58220]" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Description (if present) */}
      {section.description && (
        <p className="px-4 pb-3 text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2 border-t border-slate-100 dark:border-white/5 pt-3">
          {section.description}
        </p>
      )}

      {/* Expandable Lessons Slot */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            key="lessons"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-slate-100 dark:border-white/5"
          >
            <div className="p-4 bg-slate-50/40 dark:bg-black/10">
              {children || <LessonList sectionId={section._id} courseId={courseId} />}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default SectionCard;

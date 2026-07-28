"use client";

import * as React from "react";
import {
  FileCheck2,
  Calendar,
  Award,
  Edit,
  Copy,
  Archive,
  RotateCcw,
  Trash2,
  BarChart3,
  Globe,
  EyeOff,
  Users,
  CheckCircle2,
  AlertCircle,
  FileText,
} from "lucide-react";
import type { ApiAssignment, AssignmentStatus } from "@/features/teacher/types/assignment";

interface AssignmentCardProps {
  assignment: ApiAssignment;
  index: number;
  onEdit: (assignment: ApiAssignment) => void;
  onSubmissions: (assignment: ApiAssignment) => void;
  onAnalytics: (assignment: ApiAssignment) => void;
  onDelete: (assignment: ApiAssignment) => void;
  onPublish: (assignment: ApiAssignment) => void;
  onUnpublish: (assignment: ApiAssignment) => void;
  onArchive: (assignment: ApiAssignment) => void;
  onRestore: (assignment: ApiAssignment) => void;
  onDuplicate: (assignment: ApiAssignment) => void;
}

const STATUS_CONFIG: Record<
  AssignmentStatus,
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
  Closed: {
    label: "مغلق",
    className: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30",
    icon: <AlertCircle className="h-3 w-3" />,
  },
  Archived: {
    label: "مؤرشف",
    className: "bg-zinc-500/10 text-zinc-500 dark:text-zinc-400 border-zinc-500/30",
    icon: <Archive className="h-3 w-3" />,
  },
};

export function AssignmentCard({
  assignment,
  index,
  onEdit,
  onSubmissions,
  onAnalytics,
  onDelete,
  onPublish,
  onUnpublish,
  onArchive,
  onRestore,
  onDuplicate,
}: AssignmentCardProps) {
  const statusConfig = STATUS_CONFIG[assignment.status] || STATUS_CONFIG.Draft;
  const isArchived = assignment.status === "Archived";
  const isPublished = assignment.status === "Published";

  const formattedDueDate = assignment.dueDate
    ? new Date(assignment.dueDate).toLocaleDateString("ar-EG", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "غير محدد";

  return (
    <div className="rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#0F274D] p-5 space-y-4 hover:border-slate-300 dark:hover:border-white/20 transition-all text-right dir-rtl">
      {/* Top Header Row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <span className="h-10 w-10 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-black shrink-0">
            <FileCheck2 className="h-5 w-5" />
          </span>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-black text-[#0B2D5B] dark:text-white truncate">
                {assignment.title}
              </h3>
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${statusConfig.className}`}>
                {statusConfig.icon}
                {statusConfig.label}
              </span>
            </div>

            {assignment.description && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                {assignment.description}
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 shrink-0">
          {/* Submissions View */}
          <button
            type="button"
            onClick={() => onSubmissions(assignment)}
            className="px-3 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="عرض تسليمات الطلاب"
          >
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">التسليمات</span>
          </button>

          {/* Analytics */}
          <button
            type="button"
            onClick={() => onAnalytics(assignment)}
            className="p-2 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer"
            title="تحليلات وإحصائيات الواجب"
            aria-label="التحليلات"
          >
            <BarChart3 className="h-4 w-4" />
          </button>

          {/* Edit */}
          <button
            type="button"
            onClick={() => onEdit(assignment)}
            className="p-2 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-950/40 text-slate-500 hover:text-blue-600 transition-colors cursor-pointer"
            title="تعديل الإعدادات"
            aria-label="تعديل"
          >
            <Edit className="h-4 w-4" />
          </button>

          {/* Duplicate */}
          <button
            type="button"
            onClick={() => onDuplicate(assignment)}
            className="p-2 rounded-xl hover:bg-violet-50 dark:hover:bg-violet-950/40 text-slate-500 hover:text-[#F58220] transition-colors cursor-pointer"
            title="تكرار الواجب"
            aria-label="تكرار"
          >
            <Copy className="h-4 w-4" />
          </button>

          {/* Publish / Unpublish */}
          {isPublished ? (
            <button
              type="button"
              onClick={() => onUnpublish(assignment)}
              className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 transition-colors cursor-pointer"
              title="إلغاء النشر (تحويل لمسودة)"
              aria-label="إلغاء النشر"
            >
              <EyeOff className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onPublish(assignment)}
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
              onClick={() => onRestore(assignment)}
              className="p-2 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-500 hover:text-emerald-600 transition-colors cursor-pointer"
              title="استعادة الواجب"
              aria-label="استعادة"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onArchive(assignment)}
              className="p-2 rounded-xl hover:bg-amber-50 dark:hover:bg-amber-950/40 text-slate-500 hover:text-amber-600 transition-colors cursor-pointer"
              title="أرشفة الواجب"
              aria-label="أرشفة"
            >
              <Archive className="h-4 w-4" />
            </button>
          )}

          {/* Delete */}
          <button
            type="button"
            onClick={() => onDelete(assignment)}
            className="p-2 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
            title="حذف الواجب"
            aria-label="حذف"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-white/5 flex-wrap">
        <span className="flex items-center gap-1">
          <Calendar className="h-3.5 w-3.5 text-indigo-500" />
          تاريخ التسليم: <strong>{formattedDueDate}</strong>
        </span>
        <span className="flex items-center gap-1">
          <Award className="h-3.5 w-3.5 text-amber-500" />
          الدرجة الكلية: <strong>{assignment.totalMarks}</strong> (درجة النجاح: {assignment.passingMarks})
        </span>
        <span className="flex items-center gap-1">
          <FileText className="h-3.5 w-3.5 text-emerald-500" />
          نوع التسليم: {assignment.submissionType}
        </span>
      </div>
    </div>
  );
}

export default AssignmentCard;

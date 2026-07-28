"use client";

import { Loader2, Globe, EyeOff } from "lucide-react";
import { usePublishAssignment, useUnpublishAssignment } from "@/hooks/useAssignments";
import type { ApiAssignment } from "@/features/teacher/types/assignment";

interface PublishAssignmentDialogProps {
  assignment: ApiAssignment | null;
  mode: "publish" | "unpublish";
  isOpen: boolean;
  onClose: () => void;
}

export function PublishAssignmentDialog({ assignment, mode, isOpen, onClose }: PublishAssignmentDialogProps) {
  const publishAssignment = usePublishAssignment();
  const unpublishAssignment = useUnpublishAssignment();

  const isPublishing = mode === "publish";
  const pending = publishAssignment.isPending || unpublishAssignment.isPending;

  const handleConfirm = async () => {
    if (!assignment) return;
    if (isPublishing) {
      await publishAssignment.mutateAsync(assignment._id);
    } else {
      await unpublishAssignment.mutateAsync(assignment._id);
    }
    onClose();
  };

  if (!isOpen || !assignment) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white dark:bg-[#0B2D5B] rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 p-6 space-y-5 text-right">
        <div className="flex items-center gap-3">
          <span className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 ${
            isPublishing ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600" : "bg-amber-100 dark:bg-amber-900/30 text-amber-600"
          }`}>
            {isPublishing ? <Globe className="h-6 w-6" /> : <EyeOff className="h-6 w-6" />}
          </span>
          <div>
            <h2 className="text-base font-black text-[#0B2D5B] dark:text-white">
              {isPublishing ? "نشر الواجب للطلاب" : "إلغاء نشر الواجب"}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isPublishing ? "سيصبح الواجب متاحاً لجميع الطلاب لبدء التسليم" : "سيتم إخفاء الواجب وتحويله إلى مسودة"}
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
          <p className="text-sm font-black text-[#0B2D5B] dark:text-white">{assignment.title}</p>
        </div>

        <div className="flex items-center gap-3 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 h-11 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-200 transition-colors cursor-pointer"
          >
            تراجع
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={pending}
            className={`flex-1 h-11 rounded-xl text-white text-xs font-black flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50 ${
              isPublishing ? "bg-emerald-600 hover:bg-emerald-700" : "bg-amber-600 hover:bg-amber-700"
            }`}
          >
            {pending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : isPublishing ? (
              <Globe className="h-4 w-4" />
            ) : (
              <EyeOff className="h-4 w-4" />
            )}
            <span>{pending ? "جاري الحفظ..." : isPublishing ? "تأكيد النشر" : "إلغاء النشر"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default PublishAssignmentDialog;

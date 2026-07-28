"use client";

import { Loader2, Trash2, AlertTriangle } from "lucide-react";
import { useDeleteAssignment } from "@/hooks/useAssignments";
import type { ApiAssignment } from "@/features/teacher/types/assignment";

interface DeleteAssignmentDialogProps {
  assignment: ApiAssignment | null;
  isOpen: boolean;
  onClose: () => void;
}

export function DeleteAssignmentDialog({ assignment, isOpen, onClose }: DeleteAssignmentDialogProps) {
  const deleteAssignment = useDeleteAssignment();

  const handleConfirm = async () => {
    if (!assignment) return;
    await deleteAssignment.mutateAsync(assignment._id);
    onClose();
  };

  if (!isOpen || !assignment) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white dark:bg-[#0B2D5B] rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 p-6 space-y-5 text-right">
        <div className="flex items-center gap-3">
          <span className="h-12 w-12 rounded-2xl bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center shrink-0">
            <AlertTriangle className="h-6 w-6 text-rose-600" />
          </span>
          <div>
            <h2 className="text-base font-black text-[#0B2D5B] dark:text-white">تأكيد حذف الواجب</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">سيتم نقل الواجب إلى الحذف المؤقت</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-900/10 border border-rose-200 dark:border-rose-700/30">
          <p className="text-sm font-bold text-rose-800 dark:text-rose-300">
            هل أنت متأكد من رغبتك في حذف الواجب التطبيقي:
          </p>
          <p className="text-sm font-black text-rose-900 dark:text-rose-200 mt-1">
            &quot;{assignment.title}&quot;
          </p>
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
            disabled={deleteAssignment.isPending}
            className="flex-1 h-11 rounded-xl bg-rose-600 text-white text-xs font-black flex items-center justify-center gap-2 hover:bg-rose-700 transition-colors cursor-pointer disabled:opacity-50"
          >
            {deleteAssignment.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
            <span>{deleteAssignment.isPending ? "جاري الحذف..." : "حذف الواجب"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteAssignmentDialog;

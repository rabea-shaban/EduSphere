"use client";

import * as React from "react";
import { X, Clock, CheckCircle2, XCircle, RotateCcw, AlertTriangle, Loader2 } from "lucide-react";
import { useCancelWithdrawal } from "@/hooks/useTeacherWithdrawals";
import type { TeacherWithdrawalItem } from "@/features/teacher/types/withdrawal";

interface WithdrawalDetailsDialogProps {
  withdrawal: TeacherWithdrawalItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export function WithdrawalDetailsDialog({
  withdrawal,
  isOpen,
  onClose,
}: WithdrawalDetailsDialogProps) {
  const cancelWithdrawal = useCancelWithdrawal();

  if (!isOpen || !withdrawal) return null;

  const isPending = withdrawal.status === "Pending";
  const isPaid = withdrawal.status === "Paid";
  const isRejected = withdrawal.status === "Rejected";
  const isCancelled = withdrawal.status === "Cancelled";

  const handleCancel = async () => {
    await cancelWithdrawal.mutateAsync(withdrawal._id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-md bg-white dark:bg-[#0B2D5B] rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 p-6 space-y-5 text-right dir-rtl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-4">
          <div>
            <h2 className="text-base font-black text-[#0B2D5B] dark:text-white">
              تفاصيل طلب السحب: {withdrawal.withdrawalId}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              تاريخ تقديم الطلب: {new Date(withdrawal.requestedAt).toLocaleString("ar-EG")}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 transition-colors cursor-pointer"
            aria-label="إغلاق"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Amount & Method */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-semibold">المبلغ المطلوب:</span>
            <span className="text-lg font-black text-[#0B2D5B] dark:text-white">
              {withdrawal.amount.toLocaleString()} ج.م
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-semibold">وسيلة الاستلام:</span>
            <span className="font-bold text-indigo-600 dark:text-indigo-400">{withdrawal.method}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-semibold">تفاصيل الحساب:</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">{withdrawal.accountDetails}</span>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-white/10">
            <span className="text-slate-500 font-semibold">حالة الطلب:</span>
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border ${
                isPaid
                  ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30"
                  : isRejected
                  ? "bg-rose-500/10 text-rose-600 border-rose-500/30"
                  : isCancelled
                  ? "bg-slate-500/10 text-slate-600 border-slate-500/30"
                  : "bg-amber-500/10 text-amber-600 border-amber-500/30"
              }`}
            >
              {isPaid ? "تم السداد (مكتمل)" : isRejected ? "مرفوض" : isCancelled ? "ملغى" : "قيد المعالجة (معلق)"}
            </span>
          </div>
        </div>

        {/* Rejection Note */}
        {isRejected && withdrawal.rejectionReason && (
          <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/40 text-xs text-rose-800 dark:text-rose-300 space-y-1">
            <p className="font-black flex items-center gap-1">
              <AlertTriangle className="h-4 w-4 text-rose-600" />
              سبب الرفض:
            </p>
            <p className="font-semibold">{withdrawal.rejectionReason}</p>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between gap-3 pt-2">
          {isPending && (
            <button
              type="button"
              onClick={handleCancel}
              disabled={cancelWithdrawal.isPending}
              className="flex-1 h-11 rounded-xl bg-rose-600 text-white text-xs font-black flex items-center justify-center gap-2 hover:bg-rose-700 transition-colors cursor-pointer disabled:opacity-50"
            >
              {cancelWithdrawal.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RotateCcw className="h-4 w-4" />
              )}
              <span>إلغاء الطلب واستعادة الرصيد</span>
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="px-5 h-11 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-200 transition-colors cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
}

export default WithdrawalDetailsDialog;

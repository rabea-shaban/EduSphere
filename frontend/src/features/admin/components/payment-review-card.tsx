"use client";

import * as React from "react";
import Image from "next/image";
import { CheckCircle2, XCircle, ExternalLink, CreditCard } from "lucide-react";
import { PaymentReviewItem } from "../types";

interface PaymentReviewCardProps {
  payment: PaymentReviewItem;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
}

export function PaymentReviewCard({ payment, onApprove, onReject }: PaymentReviewCardProps) {
  const [showImageModal, setShowImageModal] = React.useState(false);

  return (
    <div className="rounded-2xl p-5 bg-white dark:bg-[#0F274D] border border-slate-200/80 dark:border-white/10 shadow-sm text-right space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 rounded-full overflow-hidden border border-slate-200 shrink-0">
            <Image src={payment.studentAvatar} alt={payment.studentName} fill className="object-cover" />
          </div>
          <div>
            <div className="text-xs font-bold text-[#0B2D5B] dark:text-white">{payment.studentName}</div>
            <div className="text-[10px] text-slate-400">مرجع التحويل: {payment.transactionRef}</div>
          </div>
        </div>

        <div className="text-left">
          <div className="text-base font-black text-emerald-600 dark:text-emerald-400">+{payment.amount} ج.م</div>
          <span className="text-[10px] font-bold bg-[#0B2D5B]/10 text-[#0B2D5B] dark:text-blue-200 px-2 py-0.5 rounded-full">
            {payment.paymentMethod}
          </span>
        </div>
      </div>

      <div className="text-xs text-slate-600 dark:text-slate-300 font-medium">
        الكورس المطلوب: <strong className="text-[#0B2D5B] dark:text-white">{payment.courseTitle}</strong>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-white/10">
        <button
          type="button"
          onClick={() => setShowImageModal(true)}
          className="px-3 h-9 rounded-xl bg-slate-100 dark:bg-white/10 text-xs font-bold flex items-center gap-1 hover:text-[#F58220]"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          <span>معاينة الإيصال</span>
        </button>

        {payment.status === "pending" ? (
          <div className="flex gap-2 flex-1 justify-end">
            <button
              type="button"
              onClick={() => onReject?.(payment.id)}
              className="px-3 h-9 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 text-xs font-bold flex items-center gap-1 hover:bg-red-100"
            >
              <XCircle className="h-3.5 w-3.5" />
              <span>رفض</span>
            </button>
            <button
              type="button"
              onClick={() => onApprove?.(payment.id)}
              className="px-4 h-9 rounded-xl bg-emerald-600 text-white text-xs font-bold flex items-center gap-1 shadow-md hover:bg-emerald-700"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>اعتماد التفعيل</span>
            </button>
          </div>
        ) : (
          <span className="text-xs font-bold text-emerald-600 flex-1 text-left">تم الاعتماد ✅</span>
        )}
      </div>

      {/* Image Receipt Modal */}
      {showImageModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0F274D] rounded-3xl p-6 max-w-lg w-full text-right space-y-4 shadow-2xl border border-slate-200 dark:border-white/10">
            <h3 className="text-sm font-black text-[#0B2D5B] dark:text-white">
              إيصال التحويل المالية: {payment.transactionRef}
            </h3>
            <div className="relative h-72 w-full rounded-2xl overflow-hidden bg-slate-900">
              <Image src={payment.receiptImage} alt="Receipt" fill className="object-contain" />
            </div>
            <button
              type="button"
              onClick={() => setShowImageModal(false)}
              className="w-full h-10 rounded-xl bg-slate-100 dark:bg-white/10 text-xs font-bold"
            >
              إغلاق المعاينة
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PaymentReviewCard;

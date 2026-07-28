"use client";

import * as React from "react";
import { Wallet, DollarSign, Clock, CheckCircle2, ArrowDownRight, AlertCircle } from "lucide-react";
import type { WalletSummary } from "@/features/teacher/types/withdrawal";

interface WalletCardProps {
  wallet: WalletSummary;
  onRequestWithdrawal: () => void;
}

export function WalletCard({ wallet, onRequestWithdrawal }: WalletCardProps) {
  const hasActivePending = wallet.activePendingCount > 0;

  return (
    <div className="space-y-4 text-right dir-rtl">
      {hasActivePending && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-700/40 flex items-center justify-between gap-3 text-amber-800 dark:text-amber-300">
          <div className="flex items-center gap-2 text-xs font-bold">
            <AlertCircle className="h-4 w-4 shrink-0 text-amber-600" />
            <span>يوجد لديك طلب سحب رصيد معلق حالياً بقيمة ({wallet.pendingBalance.toLocaleString()} ج.م) قيد معالجة الإدارة.</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {/* Available Balance */}
        <div className="p-5 rounded-3xl bg-gradient-to-tr from-[#0B2D5B] to-[#1E73D8] text-white space-y-3 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="h-10 w-10 rounded-2xl bg-white/10 flex items-center justify-center">
              <Wallet className="h-5 w-5 text-white" />
            </span>
            <button
              type="button"
              onClick={onRequestWithdrawal}
              disabled={wallet.availableBalance <= 0 || hasActivePending}
              className="px-3 h-8 rounded-xl bg-[#F58220] hover:bg-[#FF9A2A] text-white text-xs font-black flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
            >
              <ArrowDownRight className="h-3.5 w-3.5" />
              <span>طلب سحب</span>
            </button>
          </div>
          <div>
            <p className="text-xs text-slate-200 font-bold">الرصيد المتاح للسحب الفوري</p>
            <p className="text-2xl font-black text-white mt-1">
              {wallet.availableBalance.toLocaleString()} {wallet.currency}
            </p>
          </div>
        </div>

        {/* Lifetime Earnings */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#0F274D] border border-slate-200/80 dark:border-white/10 space-y-2">
          <span className="h-10 w-10 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center border border-emerald-500/20">
            <DollarSign className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs text-slate-400 font-bold">إجمالي الأرباح الكلية (85%)</p>
            <p className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
              {wallet.lifetimeEarnings.toLocaleString()} {wallet.currency}
            </p>
          </div>
        </div>

        {/* Pending Balance */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#0F274D] border border-slate-200/80 dark:border-white/10 space-y-2">
          <span className="h-10 w-10 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center border border-amber-500/20">
            <Clock className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs text-slate-400 font-bold">المبالغ قيد السحب المعلقة</p>
            <p className="text-xl font-black text-amber-600 dark:text-amber-400 mt-1">
              {wallet.pendingBalance.toLocaleString()} {wallet.currency}
            </p>
          </div>
        </div>

        {/* Total Withdrawn */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#0F274D] border border-slate-200/80 dark:border-white/10 space-y-2">
          <span className="h-10 w-10 rounded-2xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center border border-indigo-500/20">
            <CheckCircle2 className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs text-slate-400 font-bold">إجمالي المبالغ المسحوبة سابقاً</p>
            <p className="text-xl font-black text-[#0B2D5B] dark:text-white mt-1">
              {wallet.totalWithdrawn.toLocaleString()} {wallet.currency}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WalletCard;

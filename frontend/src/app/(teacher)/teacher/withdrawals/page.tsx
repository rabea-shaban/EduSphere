"use client";

import * as React from "react";
import { Sparkles, ArrowDownRight, RefreshCw } from "lucide-react";
import { useWallet } from "@/hooks/useTeacherWithdrawals";
import { WalletCard } from "@/features/teacher/components/withdrawals/wallet-card";
import { WithdrawalHistoryTable } from "@/features/teacher/components/withdrawals/withdrawal-history-table";
import { WithdrawalRequestDialog } from "@/features/teacher/components/withdrawals/withdrawal-request-dialog";
import { WithdrawalSkeleton } from "@/features/teacher/components/withdrawals/withdrawal-skeleton";
import { WithdrawalEmptyState } from "@/features/teacher/components/withdrawals/withdrawal-empty-state";

export default function InstructorWithdrawalsPage() {
  const [isRequestOpen, setIsRequestOpen] = React.useState(false);

  const { data: wallet, isLoading, refetch } = useWallet();

  return (
    <div className="space-y-6 text-right dir-rtl max-w-6xl mx-auto pb-12">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-2xl bg-[#F58220]/10 text-[#F58220]">
              <Sparkles className="h-5 w-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#0B2D5B] dark:text-white">
              منظومة محفظة وسحب مستحقات المحاضر
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            سحب الأرباح المتاحة، متابعة رصيد المعاملات المعلقة، وإدارة طلبات التحويل
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
            onClick={() => setIsRequestOpen(true)}
            disabled={!wallet || wallet.availableBalance <= 0 || wallet.activePendingCount > 0}
            className="h-11 px-5 rounded-2xl bg-gradient-to-r from-[#F58220] to-[#FF9A2A] text-white text-xs font-black flex items-center gap-2 shadow-lg shadow-[#F58220]/20 hover:-translate-y-0.5 transition-all cursor-pointer whitespace-nowrap disabled:opacity-50"
          >
            <ArrowDownRight className="h-4 w-4" />
            <span>طلب سحب جديد</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      {isLoading ? (
        <WithdrawalSkeleton />
      ) : !wallet ? (
        <WithdrawalEmptyState />
      ) : (
        <div className="space-y-6">
          <WalletCard
            wallet={wallet}
            onRequestWithdrawal={() => setIsRequestOpen(true)}
          />

          <WithdrawalHistoryTable
            onRequestNew={() => setIsRequestOpen(true)}
          />
        </div>
      )}

      {/* Request Dialog */}
      <WithdrawalRequestDialog
        availableBalance={wallet?.availableBalance || 0}
        minAmount={wallet?.minWithdrawalAmount || 100}
        isOpen={isRequestOpen}
        onClose={() => setIsRequestOpen(false)}
      />
    </div>
  );
}

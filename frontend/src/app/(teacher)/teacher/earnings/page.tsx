"use client";

import * as React from "react";
import {
  Wallet,
  ArrowDownRight,
  TrendingUp,
  Sparkles,
  DollarSign,
  Clock,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import { useTeacherEarningsDashboard } from "@/hooks/useTeacherEarnings";
import { EarningsSkeleton } from "@/features/teacher/components/earnings/earnings-skeleton";
import { EarningsEmptyState } from "@/features/teacher/components/earnings/earnings-empty-state";
import { EarningsStatCard } from "@/features/teacher/components/earnings/earnings-stat-card";
import { WithdrawPayoutModal } from "@/features/teacher/components/earnings/withdraw-payout-modal";
import { TransactionsTable } from "@/features/teacher/components/earnings/transactions-table";
import { FinancialReportExportBar } from "@/features/teacher/components/earnings/financial-report-export-bar";

export default function InstructorEarningsPage() {
  const [showWithdrawModal, setShowWithdrawModal] = React.useState(false);

  const { data: dashboard, isLoading, refetch } = useTeacherEarningsDashboard();

  return (
    <div className="space-y-6 sm:space-y-8 text-right dir-rtl max-w-6xl mx-auto pb-12">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-2xl bg-emerald-500/10 text-emerald-500">
              <Sparkles className="h-5 w-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#0B2D5B] dark:text-white">
              الأرباح والمستحقات المالية 💰
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            متابعة الرصيد القابل للسحب، إجمالي أرباح المحاضر (85%)، سجل المعاملات ورصيد طلبات السحب
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
            onClick={() => setShowWithdrawModal(true)}
            className="h-11 px-5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-600/20 hover:-translate-y-0.5 transition-all cursor-pointer whitespace-nowrap"
          >
            <ArrowDownRight className="h-4 w-4 shrink-0" />
            <span>طلب سحب الرصيد</span>
          </button>

          <FinancialReportExportBar />
        </div>
      </div>

      {/* Main Stats Cards Grid */}
      {isLoading ? (
        <EarningsSkeleton />
      ) : !dashboard ? (
        <EarningsEmptyState />
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <EarningsStatCard
              title="إجمالي أرباح المحاضر الكلية (85%)"
              value={`${dashboard.totalEarnings.toLocaleString()} ج.م`}
              subtitle={`من أصل ${dashboard.lifetimeRevenue.toLocaleString()} ج.م مبيعات سداد الكورسات`}
              icon={DollarSign}
              colorScheme="emerald"
              badge={`نمو +${dashboard.revenueGrowth}%`}
            />

            <EarningsStatCard
              title="الرصيد القابل للسحب الآن"
              value={`${dashboard.availableBalance.toLocaleString()} ج.م`}
              subtitle={
                dashboard.pendingWithdrawalAmount > 0
                  ? `هناك ${dashboard.pendingWithdrawalAmount.toLocaleString()} ج.م قيد السحب حالياً`
                  : "متاح للسحب الفوري عبر المحافظ الإلكترونية"
              }
              icon={Wallet}
              colorScheme="amber"
              badge="جاهز للسحب"
            />

            <EarningsStatCard
              title="إجمالي المبالغ المسحوبة سابقاً"
              value={`${dashboard.withdrawnAmount.toLocaleString()} ج.م`}
              subtitle="تم تحويلها بنجاح لحساب المحاضر"
              icon={CheckCircle2}
              colorScheme="indigo"
            />
          </div>

          {/* Transactions Table */}
          <TransactionsTable />
        </div>
      )}

      {/* Withdraw Payout Modal */}
      <WithdrawPayoutModal
        availableBalance={dashboard?.availableBalance || 0}
        isOpen={showWithdrawModal}
        onClose={() => setShowWithdrawModal(false)}
      />
    </div>
  );
}

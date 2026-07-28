"use client";

import * as React from "react";
import { Search, RefreshCw, Eye, RotateCcw, ArrowDownRight } from "lucide-react";
import { useTeacherWithdrawals, useCancelWithdrawal } from "@/hooks/useTeacherWithdrawals";
import type { TeacherWithdrawalItem, WithdrawalFilters } from "@/features/teacher/types/withdrawal";
import { WithdrawalSkeleton } from "./withdrawal-skeleton";
import { WithdrawalEmptyState } from "./withdrawal-empty-state";
import { WithdrawalDetailsDialog } from "./withdrawal-details-dialog";

interface WithdrawalHistoryTableProps {
  onRequestNew: () => void;
}

export function WithdrawalHistoryTable({ onRequestNew }: WithdrawalHistoryTableProps) {
  const [search, setSearch] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("ALL");

  const [selectedWithdrawal, setSelectedWithdrawal] = React.useState<TeacherWithdrawalItem | null>(null);

  const cancelWithdrawal = useCancelWithdrawal();

  React.useEffect(() => {
    const t = setTimeout(() => setSearch(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  const filters: WithdrawalFilters = {
    ...(search ? { search } : {}),
    ...(statusFilter !== "ALL" ? { status: statusFilter as any } : {}),
    limit: 50,
  };

  const { data, isLoading, refetch } = useTeacherWithdrawals(filters);

  const withdrawals = data?.withdrawals || [];
  const total = data?.pagination?.total || 0;

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-[#0F274D] border border-slate-200/80 dark:border-white/10 space-y-4 text-right dir-rtl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-black text-[#0B2D5B] dark:text-white flex items-center gap-2">
            <ArrowDownRight className="h-4 w-4 text-emerald-500" />
            سجل وجدول طلبات السحب ({total})
          </h3>
          <p className="text-xs text-slate-400">سجل كامل بطلبات سحب الرصيد، المبالغ المحولة، والحالات المعالجة</p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
          {/* Search */}
          <div className="relative flex-1 sm:w-44">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="بحث بالرقم المرجعي..."
              className="w-full h-8 pr-8 pl-3 rounded-lg text-[11px] font-semibold bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 outline-none focus:border-[#F58220]"
            />
            <Search className="absolute right-2.5 top-2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-8 px-2 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[11px] font-bold outline-none cursor-pointer"
          >
            <option value="ALL">جميع الحالات</option>
            <option value="Pending">معلق (قيد المعالجة)</option>
            <option value="Paid">مكتمل (تم التحويل)</option>
            <option value="Rejected">مرفوض</option>
            <option value="Cancelled">ملغى</option>
          </select>

          {/* Refresh */}
          <button
            type="button"
            onClick={() => refetch()}
            className="p-2 rounded-lg hover:bg-slate-200/60 dark:hover:bg-white/10 text-slate-500 transition-colors cursor-pointer"
            title="تحديث"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {isLoading ? (
        <WithdrawalSkeleton />
      ) : withdrawals.length === 0 ? (
        <WithdrawalEmptyState />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-right">
            <thead>
              <tr className="border-b border-slate-100 dark:border-white/10 text-slate-400 font-bold">
                <th className="pb-3">رقم الطلب</th>
                <th className="pb-3">المبلغ</th>
                <th className="pb-3">وسيلة السحب</th>
                <th className="pb-3">بيانات الحساب</th>
                <th className="pb-3">الحالة</th>
                <th className="pb-3">تاريخ الطلب</th>
                <th className="pb-3">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {withdrawals.map((w) => {
                const isPending = w.status === "Pending";
                const isPaid = w.status === "Paid";
                const isRejected = w.status === "Rejected";
                const isCancelled = w.status === "Cancelled";

                return (
                  <tr key={w._id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                    <td className="py-3 font-mono font-bold text-[#0B2D5B] dark:text-white">
                      {w.withdrawalId}
                    </td>
                    <td className="py-3 font-black text-emerald-600 dark:text-emerald-400">
                      {w.amount.toLocaleString()} ج.م
                    </td>
                    <td className="py-3 font-bold text-slate-700 dark:text-slate-200">
                      {w.method}
                    </td>
                    <td className="py-3 font-semibold text-slate-500 max-w-xs truncate">
                      {w.accountDetails}
                    </td>
                    <td className="py-3 font-bold">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] border ${
                          isPaid
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30"
                            : isRejected
                            ? "bg-rose-500/10 text-rose-600 border-rose-500/30"
                            : isCancelled
                            ? "bg-slate-500/10 text-slate-600 border-slate-500/30"
                            : "bg-amber-500/10 text-amber-600 border-amber-500/30"
                        }`}
                      >
                        {isPaid ? "مكتمل" : isRejected ? "مرفوض" : isCancelled ? "ملغى" : "معلق"}
                      </span>
                    </td>
                    <td className="py-3 text-slate-400 font-semibold">
                      {new Date(w.requestedAt).toLocaleDateString("ar-EG")}
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedWithdrawal(w)}
                          className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                          title="عرض التفاصيل"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        {isPending && (
                          <button
                            type="button"
                            onClick={() => cancelWithdrawal.mutate(w._id)}
                            disabled={cancelWithdrawal.isPending}
                            className="p-1.5 rounded-lg hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer disabled:opacity-50"
                            title="إلغاء الطلب المعلق"
                          >
                            <RotateCcw className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <WithdrawalDetailsDialog
        withdrawal={selectedWithdrawal}
        isOpen={!!selectedWithdrawal}
        onClose={() => setSelectedWithdrawal(null)}
      />
    </div>
  );
}

export default WithdrawalHistoryTable;

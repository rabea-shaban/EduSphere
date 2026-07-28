"use client";

import * as React from "react";
import { Search, RefreshCw, DollarSign, CheckCircle2, Clock, XCircle, FileText } from "lucide-react";
import { useTeacherTransactions } from "@/hooks/useTeacherEarnings";
import type { EarningsFilters } from "@/features/teacher/types/earnings";

export function TransactionsTable() {
  const [search, setSearch] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("ALL");
  const [methodFilter, setMethodFilter] = React.useState<string>("ALL");

  React.useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  const filters: EarningsFilters = {
    ...(debouncedSearch ? { search: debouncedSearch } : {}),
    ...(statusFilter !== "ALL" ? { status: statusFilter as any } : {}),
    ...(methodFilter !== "ALL" ? { paymentMethod: methodFilter as any } : {}),
    limit: 50,
  };

  const { data, isLoading, refetch } = useTeacherTransactions(filters);

  const transactions = data?.transactions || [];
  const total = data?.pagination?.total || 0;

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-[#0F274D] border border-slate-200/80 dark:border-white/10 space-y-4 text-right dir-rtl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-black text-[#0B2D5B] dark:text-white flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-emerald-500" />
            سجل المعاملات والعمليات المالية ({total})
          </h3>
          <p className="text-xs text-slate-400">سجل كامل لعمليات السداد وشراء الكورسات مع تفاصيل حصة المحاضر</p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
          {/* Search */}
          <div className="relative flex-1 sm:w-44">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="بحث بالمرجع أو اسم الطالب..."
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
            <option value="Paid">مكتمل ومدفوع</option>
            <option value="Pending">قيد المعالجة</option>
            <option value="Refunded">مسترجع</option>
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
        <div className="py-12 text-center text-xs font-bold text-slate-400">جاري تحميل سجل المعاملات...</div>
      ) : transactions.length === 0 ? (
        <div className="p-8 text-center text-xs text-slate-400 border border-dashed rounded-2xl">
          لا توجد معاملات ماليّة تفي بشروط الفلتر.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-right">
            <thead>
              <tr className="border-b border-slate-100 dark:border-white/10 text-slate-400 font-bold">
                <th className="pb-3">رقم المرجع</th>
                <th className="pb-3">الطالب</th>
                <th className="pb-3">الكورس</th>
                <th className="pb-3">المبلغ الكلي</th>
                <th className="pb-3">حصة المحاضر (85%)</th>
                <th className="pb-3">طريقة الدفع</th>
                <th className="pb-3">الحالة</th>
                <th className="pb-3">التاريخ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {transactions.map((tx) => {
                const isPaid = tx.status === "Paid";
                const isRefunded = tx.status === "Refunded";

                return (
                  <tr key={tx._id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                    <td className="py-3 font-mono font-bold text-[#0B2D5B] dark:text-white">
                      {tx.transactionId}
                    </td>
                    <td className="py-3 font-bold text-slate-700 dark:text-slate-200">
                      {tx.studentName}
                    </td>
                    <td className="py-3 font-semibold text-slate-600 dark:text-slate-300 max-w-xs truncate">
                      {tx.courseTitle}
                    </td>
                    <td className="py-3 font-black text-slate-800 dark:text-slate-100">
                      {tx.amount.toLocaleString()} {tx.currency}
                    </td>
                    <td className="py-3 font-black text-emerald-600 dark:text-emerald-400">
                      {tx.teacherShare.toLocaleString()} {tx.currency}
                    </td>
                    <td className="py-3 font-semibold text-slate-500">
                      {tx.paymentMethod}
                    </td>
                    <td className="py-3 font-bold">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] border ${
                          isPaid
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30"
                            : isRefunded
                            ? "bg-rose-500/10 text-rose-600 border-rose-500/30"
                            : "bg-amber-500/10 text-amber-600 border-amber-500/30"
                        }`}
                      >
                        {isPaid ? "مكتمل" : isRefunded ? "مسترجع" : "معلق"}
                      </span>
                    </td>
                    <td className="py-3 text-slate-400 font-semibold">
                      {new Date(tx.createdAt).toLocaleDateString("ar-EG")}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default TransactionsTable;

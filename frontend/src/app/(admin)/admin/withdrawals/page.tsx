"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Wallet,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  FileSpreadsheet,
  ArrowUpRight,
  DollarSign,
  Briefcase,
  Phone,
  Building2,
  ShieldCheck,
  Send,
} from "lucide-react";
import { toast } from "react-hot-toast";
import adminPaymentService, { AdminWithdrawalItem } from "@/services/adminPayment.service";
import { Button } from "@/components/ui/button";

export default function AdminWithdrawalsPage() {
  const queryClient = useQueryClient();

  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);
  const [statusFilter, setStatusFilter] = React.useState<string>("All");

  const [rejectModal, setRejectModal] = React.useState<AdminWithdrawalItem | null>(null);
  const [rejectReasonInput, setRejectReasonInput] = React.useState("");

  // Fetch Withdrawals List
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["admin", "withdrawals-list", page, limit, statusFilter],
    queryFn: () =>
      adminPaymentService.getWithdrawals({
        page,
        limit,
        status: statusFilter !== "All" ? statusFilter : undefined,
      }),
  });

  const withdrawals = data?.withdrawals || [];
  const pagination = data?.pagination || { total: 0, page: 1, limit: 10, totalPages: 1 };

  // Approve Withdrawal Mutation
  const approveMutation = useMutation({
    mutationFn: (id: string) => adminPaymentService.approveWithdrawal(id),
    onSuccess: () => {
      toast.success("تمت الموافقة على طلب سحب مستحقات المحاضر.");
      queryClient.invalidateQueries({ queryKey: ["admin", "withdrawals-list"] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "حدث خطأ أثناء الاعتماد.");
    },
  });

  // Mark Paid Withdrawal Mutation
  const markPaidMutation = useMutation({
    mutationFn: (id: string) => adminPaymentService.markWithdrawalPaid(id),
    onSuccess: () => {
      toast.success("تم تأكيد تحويل الأرباح للمحاضر وإغلاق الطلب.");
      queryClient.invalidateQueries({ queryKey: ["admin", "withdrawals-list"] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "حدث خطأ أثناء التأكيد.");
    },
  });

  // Reject Withdrawal Mutation
  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      adminPaymentService.rejectWithdrawal(id, reason),
    onSuccess: () => {
      toast.success("تم تسجيل رفض طلب السحب وإبلاغ المحاضر بالسبب.");
      setRejectModal(null);
      setRejectReasonInput("");
      queryClient.invalidateQueries({ queryKey: ["admin", "withdrawals-list"] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "حدث خطأ أثناء الرفض.");
    },
  });

  // CSV Export
  const exportToCSV = () => {
    if (withdrawals.length === 0) {
      toast.error("لا توجد طلبات سحب للتصدير");
      return;
    }

    const headers = [
      "معرف الطلب",
      "اسم المحاضر",
      "البريد الإلكتروني",
      "المبلغ (ج.م)",
      "طريقة السحب",
      "بيانات الحساب / الهاتف",
      "الحالة",
      "تاريخ الطلب",
    ];

    const rows = withdrawals.map((w) => [
      w._id,
      `"${w.teacher?.fullName || ""}"`,
      w.teacher?.email || "",
      w.amount,
      w.method,
      `"${w.accountDetails}"`,
      w.status,
      new Date(w.requestedAt).toLocaleDateString("ar-EG"),
    ]);

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `teacher_withdrawals_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("تم تصدير ملف سحوبات الأرباح بنجاح.");
  };

  return (
    <div className="space-y-6 text-right transition-colors" dir="rtl">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-[#0F274D] p-6 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 bg-[#F58220]/10 text-[#F58220] px-3 py-1 rounded-full text-xs font-black">
            <Wallet className="h-4 w-4" />
            <span>نظام صرف المستحقات وسحوبات أرباح المحاضرين</span>
          </div>
          <h1 className="text-2xl font-black text-[#0B2D5B] dark:text-white">
            طلب سحب وتحويل مستحقات المعلمين
          </h1>
          <p className="text-xs text-slate-500">
            اعتماد الطلبات المالية، التحويل إلى محفظة فودافون كاش أو InstaPay، وتحديث الحالة.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link href="/admin/payments">
            <Button variant="outline" className="rounded-xl border-slate-200 dark:border-white/10 text-xs font-bold gap-2">
              <DollarSign className="h-4 w-4 text-emerald-600" />
              <span>العودة لجدول المدفوعات والتحصيلات</span>
            </Button>
          </Link>

          <Button
            onClick={exportToCSV}
            variant="outline"
            className="rounded-xl border-slate-200 dark:border-white/10 text-xs font-bold gap-2"
          >
            <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
            <span>تصدير (CSV)</span>
          </Button>

          <Button
            onClick={() => refetch()}
            variant="outline"
            size="icon"
            className="rounded-xl border-slate-200 dark:border-white/10"
            title="تحديث البيانات"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-[#0F274D] p-4 sm:p-5 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-500">تصفية حسب الحالة:</span>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="h-11 px-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold outline-none focus:border-[#F58220]"
          >
            <option value="All">جميع الطلبات</option>
            <option value="Pending">قيد المراجعة</option>
            <option value="Approved">مقبول وقيد التحويل</option>
            <option value="Paid">تم التحويل والإغلاق</option>
            <option value="Rejected">مرفوض</option>
          </select>
        </div>
      </div>

      {/* Main Withdrawals Data Table */}
      <div className="bg-white dark:bg-[#0F274D] rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-12 w-full bg-slate-100 dark:bg-white/5 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : isError ? (
          <div className="p-12 text-center space-y-3 text-rose-500">
            <AlertCircle className="h-8 w-8 mx-auto" />
            <p className="text-xs font-bold">فشل استرجاع سجل طلبات السحب</p>
          </div>
        ) : withdrawals.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Wallet className="h-10 w-10 text-slate-300 mx-auto" />
            <p className="text-xs font-extrabold text-slate-500">لا توجد طلبات سحب مطابقة حالياً</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 dark:bg-white/5 border-b border-slate-100 dark:border-white/10 text-slate-400 font-bold">
                <tr>
                  <th className="py-4 px-4">المحاضر</th>
                  <th className="py-4 px-3">المبلغ المطلوب</th>
                  <th className="py-4 px-3">وسيلة التحويل والحساب</th>
                  <th className="py-4 px-3">تاريخ الطلب</th>
                  <th className="py-4 px-3">الحالة</th>
                  <th className="py-4 px-4 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5 font-medium">
                {withdrawals.map((w) => (
                  <tr
                    key={w._id}
                    className="hover:bg-slate-50/60 dark:hover:bg-white/[0.02] transition-colors"
                  >
                    {/* Teacher */}
                    <td className="py-4 px-4 space-y-0.5">
                      <div className="font-bold text-[#0B2D5B] dark:text-white">
                        {w.teacher?.fullName}
                      </div>
                      <div className="text-[10px] text-slate-400 dir-ltr text-right">
                        {w.teacher?.email}
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="py-4 px-3 font-mono font-black text-emerald-600 dark:text-emerald-400 text-sm">
                      {w.amount.toLocaleString()} ج.م
                    </td>

                    {/* Method & Details */}
                    <td className="py-4 px-3 space-y-0.5">
                      <div className="font-bold text-[#F58220]">
                        {w.method}
                      </div>
                      <div className="font-mono text-[11px] text-slate-700 dark:text-slate-300">
                        {w.accountDetails}
                      </div>
                    </td>

                    {/* Date */}
                    <td className="py-4 px-3 text-slate-400 font-semibold">
                      {new Date(w.requestedAt).toLocaleDateString("ar-EG")}
                    </td>

                    {/* Status */}
                    <td className="py-4 px-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                          w.status === "Paid"
                            ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                            : w.status === "Approved"
                            ? "bg-blue-500/10 text-blue-600 border border-blue-500/20"
                            : w.status === "Rejected"
                            ? "bg-rose-500/10 text-rose-600 border border-rose-500/20"
                            : "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                        }`}
                      >
                        {w.status === "Paid" && "تم التحويل والإغلاق"}
                        {w.status === "Approved" && "مقبول وقيد التحويل"}
                        {w.status === "Rejected" && "مرفوض"}
                        {w.status === "Pending" && "قيد المراجعة"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {w.status === "Pending" && (
                          <button
                            type="button"
                            onClick={() => approveMutation.mutate(w._id)}
                            disabled={approveMutation.isPending}
                            className="px-3 py-1 rounded-xl bg-blue-600 text-white text-[11px] font-bold hover:bg-blue-700 transition-colors"
                          >
                            موافقة على الطلب
                          </button>
                        )}

                        {(w.status === "Approved" || w.status === "Pending") && (
                          <button
                            type="button"
                            onClick={() => markPaidMutation.mutate(w._id)}
                            disabled={markPaidMutation.isPending}
                            className="px-3 py-1 rounded-xl bg-emerald-600 text-white text-[11px] font-bold hover:bg-emerald-700 transition-colors"
                          >
                            تأكيد تحويل المبلغ
                          </button>
                        )}

                        {w.status !== "Paid" && w.status !== "Rejected" && (
                          <button
                            type="button"
                            onClick={() => setRejectModal(w)}
                            className="p-1.5 rounded-xl bg-rose-500/10 text-rose-600 hover:bg-rose-500 hover:text-white transition-colors"
                            title="رفض الطلب"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {pagination.totalPages > 1 && (
          <div className="p-4 border-t border-slate-100 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold text-slate-500">
            <div>
              عرض الصفحة {pagination.page} من أصل {pagination.totalPages} (إجمالي {pagination.total} طلب سحب)
            </div>

            <div className="flex items-center gap-2">
              <Button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                variant="outline"
                size="sm"
                className="rounded-xl text-xs"
              >
                <ChevronRight className="h-4 w-4" />
                <span>السابق</span>
              </Button>

              <Button
                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                disabled={page >= pagination.totalPages}
                variant="outline"
                size="sm"
                className="rounded-xl text-xs"
              >
                <span>التالي</span>
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* REJECT WITHDRAWAL MODAL */}
      <AnimatePresence>
        {rejectModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white dark:bg-[#0F274D] p-6 rounded-3xl max-w-md w-full border border-slate-200 dark:border-white/10 shadow-2xl space-y-4 text-right"
              dir="rtl"
            >
              <div className="flex items-center gap-3 text-rose-600">
                <div className="h-10 w-10 rounded-2xl bg-rose-500/10 flex items-center justify-center">
                  <XCircle className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-base font-black text-[#0B2D5B] dark:text-white">
                    سبب عدم قبول طلب سحب الأرباح
                  </h3>
                  <p className="text-xs text-slate-500">{rejectModal.teacher?.fullName}</p>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  سبب الرفض المباشر *
                </label>
                <textarea
                  rows={3}
                  value={rejectReasonInput}
                  onChange={(e) => setRejectReasonInput(e.target.value)}
                  placeholder="رقم محفظة فودافون كاش غير صحيح أو لا يستقبل مبالغ تحويل..."
                  className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  onClick={() => setRejectModal(null)}
                  variant="outline"
                  className="rounded-xl text-xs font-bold"
                >
                  إلغاء
                </Button>
                <Button
                  onClick={() => {
                    if (!rejectReasonInput.trim()) {
                      toast.error("يرجى كتابة سبب الرفض");
                      return;
                    }
                    rejectMutation.mutate({
                      id: rejectModal._id,
                      reason: rejectReasonInput.trim(),
                    });
                  }}
                  disabled={rejectMutation.isPending}
                  className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-extrabold"
                >
                  <span>تأكيد تسجيل الرفض</span>
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

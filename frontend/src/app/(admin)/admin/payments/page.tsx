"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  DollarSign,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Eye,
  FileSpreadsheet,
  CheckSquare,
  Square,
  Clock,
  AlertCircle,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Wallet,
  TrendingUp,
  CreditCard,
  Building2,
  PhoneCall,
  RotateCcw,
  ArrowDownLeft,
  ArrowUpRight,
  ShieldCheck,
  Award,
} from "lucide-react";
import { toast } from "react-hot-toast";
import adminPaymentService, { AdminPaymentItem } from "@/services/adminPayment.service";
import { Button } from "@/components/ui/button";

export default function AdminPaymentsPage() {
  const queryClient = useQueryClient();

  // Filters & State
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);
  const [statusFilter, setStatusFilter] = React.useState<string>("All");
  const [methodFilter, setMethodFilter] = React.useState<string>("All");
  const [searchTerm, setSearchTerm] = React.useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = React.useState<string>("");

  // Modals & Selection State
  const [rejectPaymentModal, setRejectPaymentModal] = React.useState<AdminPaymentItem | null>(null);
  const [rejectReasonInput, setRejectReasonInput] = React.useState("");
  const [refundPaymentModal, setRefundPaymentModal] = React.useState<AdminPaymentItem | null>(null);
  const [refundReasonInput, setRefundReasonInput] = React.useState("");

  // Debounce search
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Fetch Payments & Financial Summary
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["admin", "payments-list", page, limit, statusFilter, methodFilter, debouncedSearch],
    queryFn: () =>
      adminPaymentService.getPayments({
        page,
        limit,
        status: statusFilter !== "All" ? statusFilter : undefined,
        method: methodFilter !== "All" ? methodFilter : undefined,
        search: debouncedSearch.trim() || undefined,
      }),
  });

  const payments = data?.payments || [];
  const summary = data?.summary || {
    totalRevenue: 0,
    todayRevenue: 0,
    monthlyRevenue: 0,
    pendingPaymentsCount: 0,
    approvedPaymentsCount: 0,
    refundedPaymentsCount: 0,
    failedPaymentsCount: 0,
    pendingWithdrawalsCount: 0,
    completedWithdrawalsCount: 0,
  };
  const pagination = data?.pagination || { total: 0, page: 1, limit: 10, totalPages: 1 };

  // Approve Payment Mutation
  const approveMutation = useMutation({
    mutationFn: (id: string) => adminPaymentService.approvePayment(id),
    onSuccess: () => {
      toast.success("تم تأكيد السداد وتفعيل اشتراك الطالب فورياً 🎉");
      queryClient.invalidateQueries({ queryKey: ["admin", "payments-list"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "حدث خطأ أثناء تأكيد السداد.");
    },
  });

  // Reject Payment Mutation
  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      adminPaymentService.rejectPayment(id, reason),
    onSuccess: () => {
      toast.success("تم تسجيل عدم قبول السداد وتنبيه الطالب.");
      setRejectPaymentModal(null);
      setRejectReasonInput("");
      queryClient.invalidateQueries({ queryKey: ["admin", "payments-list"] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "حدث خطأ أثناء الرفض.");
    },
  });

  // Refund Payment Mutation
  const refundMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      adminPaymentService.refundPayment(id, reason),
    onSuccess: () => {
      toast.success("تم تنفيذ الاسترجاع المالي وتجميد كورس الطالب 💸");
      setRefundPaymentModal(null);
      setRefundReasonInput("");
      queryClient.invalidateQueries({ queryKey: ["admin", "payments-list"] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "حدث خطأ أثناء الاسترجاع.");
    },
  });

  // CSV Export
  const exportToCSV = () => {
    if (payments.length === 0) {
      toast.error("لا توجد عمليات سداد للتصدير");
      return;
    }

    const headers = [
      "رقم العملية / المرجع",
      "اسم الطالب",
      "البريد الإلكتروني",
      "اسم المحاضر",
      "اسم الكورس",
      "المبلغ (ج.م)",
      "طريقة الدفع",
      "الحالة",
      "تاريخ السداد",
    ];

    const rows = payments.map((p) => [
      `"${p.paymentReference}"`,
      `"${p.student?.fullName || ""}"`,
      p.student?.email || "",
      `"${p.teacher?.fullName || ""}"`,
      `"${p.course?.title || ""}"`,
      p.amount,
      p.paymentMethod,
      p.status,
      new Date(p.createdAt).toLocaleDateString("ar-EG"),
    ]);

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `financial_transactions_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("تم تصدير ملف العمليات المالية بنجاح 📊");
  };

  return (
    <div className="space-y-6 text-right transition-colors" dir="rtl">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-[#0F274D] p-6 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full text-xs font-black">
            <DollarSign className="h-4 w-4" />
            <span>نظام الإدارة والتحصيل المالي والتدقيق</span>
          </div>
          <h1 className="text-2xl font-black text-[#0B2D5B] dark:text-white">
            سجل مدفوعات وتحصيلات المنصة 💳
          </h1>
          <p className="text-xs text-slate-500">
            متابعة العمليات المالية، تأكيد السداد الفوري، الاسترجاع المالي (Refund)، والتدقيق.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link href="/admin/withdrawals">
            <Button className="bg-[#0B2D5B] hover:bg-[#1E73D8] text-white rounded-xl text-xs font-bold gap-2">
              <Wallet className="h-4 w-4 text-[#F58220]" />
              <span>طلبات سحوبات المحاضرين ({summary.pendingWithdrawalsCount})</span>
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

      {/* Summary Metrics Cards Grid (4 Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Total Revenue */}
        <div className="bg-white dark:bg-[#0F274D] p-5 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>إجمالي تحصيلات المنصة</span>
            <Wallet className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
            {summary.totalRevenue.toLocaleString()} ج.م
          </div>
          <span className="text-[11px] text-slate-400 font-bold block">مقبول ومؤكد مالياً</span>
        </div>

        {/* Card 2: Today Revenue */}
        <div className="bg-white dark:bg-[#0F274D] p-5 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>تحصيلات اليوم</span>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-[#0B2D5B] dark:text-white font-mono">
            {summary.todayRevenue.toLocaleString()} ج.م
          </div>
          <span className="text-[11px] text-blue-500 font-bold block">تحصيل مباشر خلال اليوم</span>
        </div>

        {/* Card 3: Monthly Revenue */}
        <div className="bg-white dark:bg-[#0F274D] p-5 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>تحصيلات الشهر الحالي</span>
            <DollarSign className="h-4 w-4 text-[#F58220]" />
          </div>
          <div className="text-2xl font-black text-[#F58220] font-mono">
            {summary.monthlyRevenue.toLocaleString()} ج.م
          </div>
          <span className="text-[11px] text-slate-400 font-bold block">أرباح الشهر الحالي</span>
        </div>

        {/* Card 4: Pending Payments */}
        <div className="bg-white dark:bg-[#0F274D] p-5 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>في انتظار التأكيد</span>
            <Clock className="h-4 w-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400 font-mono">
            {summary.pendingPaymentsCount} عمليات
          </div>
          <span className="text-[11px] text-amber-500 font-bold block">بانتظار التأكيد أو التفعيل</span>
        </div>

      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-[#0F274D] p-4 sm:p-5 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* Search Input */}
          <div className="relative lg:col-span-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ابحث برقم المرجع، اسم الطالب، الكورس، أو المعلم..."
              className="w-full h-11 pr-10 pl-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs outline-none focus:border-[#F58220]"
            />
            <Search className="h-4 w-4 text-slate-400 absolute right-3.5 top-3.5 pointer-events-none" />
          </div>

          {/* Status Filter */}
          <div className="space-y-1">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="w-full h-11 px-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold outline-none focus:border-[#F58220]"
            >
              <option value="All">جميع حالات السداد</option>
              <option value="Paid">مقبول ومسدد 🟢</option>
              <option value="Pending">بانتظار التثبت ⏳</option>
              <option value="Refunded">مسترجع (Refunded) 💸</option>
              <option value="Failed">غير مقبول 🔴</option>
            </select>
          </div>

          {/* Payment Method Filter */}
          <div className="space-y-1">
            <select
              value={methodFilter}
              onChange={(e) => {
                setMethodFilter(e.target.value);
                setPage(1);
              }}
              className="w-full h-11 px-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold outline-none focus:border-[#F58220]"
            >
              <option value="All">جميع وسائل الدفع</option>
              <option value="Vodafone Cash">فودافون كاش / المحافظ</option>
              <option value="InstaPay">انستا باي (InstaPay)</option>
              <option value="Fawry">فوري (Fawry)</option>
              <option value="Bank Transfer">تحويل بنكي direct</option>
              <option value="Stripe">بطاقة ائتمانية (Visa / Meeza)</option>
            </select>
          </div>

        </div>
      </div>

      {/* Main Payments Data Table */}
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
            <p className="text-xs font-bold">فشل استرجاع سجل المدفوعات والتحصيلات المالية</p>
          </div>
        ) : payments.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <CreditCard className="h-10 w-10 text-slate-300 mx-auto" />
            <p className="text-xs font-extrabold text-slate-500">لا توجد عمليات سداد مطابقة لشروط الفحص الحالية</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 dark:bg-white/5 border-b border-slate-100 dark:border-white/10 text-slate-400 font-bold">
                <tr>
                  <th className="py-4 px-4">رقم المرجع والعملية</th>
                  <th className="py-4 px-3">الطالب المسدد</th>
                  <th className="py-4 px-3">الكورس والمحاضر</th>
                  <th className="py-4 px-3">المبلغ ووسيلة الدفع</th>
                  <th className="py-4 px-3">الحالة والتاريخ</th>
                  <th className="py-4 px-4 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5 font-medium">
                {payments.map((p) => (
                  <tr
                    key={p._id}
                    className="hover:bg-slate-50/60 dark:hover:bg-white/[0.02] transition-colors"
                  >
                    {/* Reference */}
                    <td className="py-4 px-4 font-mono font-bold text-[#0B2D5B] dark:text-white">
                      {p.paymentReference}
                    </td>

                    {/* Student */}
                    <td className="py-4 px-3 space-y-0.5">
                      <div className="font-bold text-slate-800 dark:text-slate-200">
                        {p.student?.fullName}
                      </div>
                      <div className="text-[10px] text-slate-400 dir-ltr text-right truncate max-w-[140px]">
                        {p.student?.email}
                      </div>
                    </td>

                    {/* Course & Teacher */}
                    <td className="py-4 px-3 space-y-0.5">
                      <div className="font-bold text-[#0B2D5B] dark:text-white line-clamp-1 max-w-[200px]">
                        {p.course?.title}
                      </div>
                      <div className="text-[10px] text-[#F58220] font-bold">
                        محاضر: {p.teacher?.fullName}
                      </div>
                    </td>

                    {/* Amount & Method */}
                    <td className="py-4 px-3 space-y-0.5">
                      <div className="font-mono font-black text-emerald-600 dark:text-emerald-400 text-sm">
                        {p.amount.toLocaleString()} ج.م
                      </div>
                      <div className="text-[10px] text-slate-400 font-bold">
                        {p.paymentMethod}
                      </div>
                    </td>

                    {/* Status & Date */}
                    <td className="py-4 px-3 space-y-1">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                          p.status === "Paid"
                            ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                            : p.status === "Refunded"
                            ? "bg-purple-500/10 text-purple-600 border border-purple-500/20"
                            : p.status === "Failed"
                            ? "bg-rose-500/10 text-rose-600 border border-rose-500/20"
                            : "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                        }`}
                      >
                        {p.status === "Paid" && "مقبول ومسدد 🟢"}
                        {p.status === "Refunded" && "مسترجع (Refunded) 💸"}
                        {p.status === "Failed" && "غير مقبول 🔴"}
                        {p.status === "Pending" && "بانتظار التثبت ⏳"}
                      </span>
                      <div className="text-[10px] text-slate-400 font-semibold block">
                        {new Date(p.createdAt).toLocaleDateString("ar-EG")}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {p.status !== "Paid" && p.status !== "Refunded" && (
                          <button
                            type="button"
                            onClick={() => approveMutation.mutate(p._id)}
                            disabled={approveMutation.isPending}
                            className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500 hover:text-white transition-colors"
                            title="تأكيد السداد وتفعيل اشتراك الطالب فورياً"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                          </button>
                        )}

                        {p.status === "Pending" && (
                          <button
                            type="button"
                            onClick={() => setRejectPaymentModal(p)}
                            className="p-2 rounded-xl bg-rose-500/10 text-rose-600 hover:bg-rose-500 hover:text-white transition-colors"
                            title="عدم قبول عملية السداد"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        )}

                        {p.status === "Paid" && (
                          <button
                            type="button"
                            onClick={() => setRefundPaymentModal(p)}
                            className="p-2 rounded-xl bg-purple-500/10 text-purple-600 hover:bg-purple-500 hover:text-white transition-colors"
                            title="تنفيذ استرجاع مالي (Refund)"
                          >
                            <RotateCcw className="h-4 w-4" />
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
              عرض الصفحة {pagination.page} من أصل {pagination.totalPages} (إجمالي {pagination.total} عملية سداد)
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

      {/* REJECT PAYMENT MODAL */}
      <AnimatePresence>
        {rejectPaymentModal && (
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
                    سبب عدم قبول العملية المالية
                  </h3>
                  <p className="text-xs text-slate-500">{rejectPaymentModal.paymentReference}</p>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  سبب الرفض المباشر (سيصل كإشعار للطالب) *
                </label>
                <textarea
                  rows={3}
                  value={rejectReasonInput}
                  onChange={(e) => setRejectReasonInput(e.target.value)}
                  placeholder="لم يصل المبلغ للحساب البنكي أو الرقم القومي غير مطابق..."
                  className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  onClick={() => setRejectPaymentModal(null)}
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
                      id: rejectPaymentModal._id,
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

      {/* REFUND PAYMENT MODAL */}
      <AnimatePresence>
        {refundPaymentModal && (
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
              <div className="flex items-center gap-3 text-purple-600">
                <div className="h-10 w-10 rounded-2xl bg-purple-500/10 flex items-center justify-center">
                  <RotateCcw className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-base font-black text-[#0B2D5B] dark:text-white">
                    تنفيذ استرجاع مالي (Refund)
                  </h3>
                  <p className="text-xs text-slate-500">
                    مبلغ {refundPaymentModal.amount} ج.م • {refundPaymentModal.student?.fullName}
                  </p>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  سبب الاسترجاع المالي الموثق *
                </label>
                <textarea
                  rows={3}
                  value={refundReasonInput}
                  onChange={(e) => setRefundReasonInput(e.target.value)}
                  placeholder="بناءً على طلب الطالب ووفق سياسة الضمان الذهبي..."
                  className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  onClick={() => setRefundPaymentModal(null)}
                  variant="outline"
                  className="rounded-xl text-xs font-bold"
                >
                  إلغاء
                </Button>
                <Button
                  onClick={() => {
                    if (!refundReasonInput.trim()) {
                      toast.error("يرجى كتابة سبب الاسترجاع المالي");
                      return;
                    }
                    refundMutation.mutate({
                      id: refundPaymentModal._id,
                      reason: refundReasonInput.trim(),
                    });
                  }}
                  disabled={refundMutation.isPending}
                  className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-extrabold"
                >
                  <span>تأكيد الاسترجاع وتجميد الاشتراك</span>
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

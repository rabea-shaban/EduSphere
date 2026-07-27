"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Tag,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Eye,
  FileSpreadsheet,
  Clock,
  AlertCircle,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Percent,
  DollarSign,
  Trash2,
  Sparkles,
  Zap,
} from "lucide-react";
import { toast } from "react-hot-toast";
import adminCouponService, { AdminCouponItem } from "@/services/adminCoupon.service";
import { Button } from "@/components/ui/button";

export default function AdminCouponsPage() {
  const queryClient = useQueryClient();

  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);
  const [statusFilter, setStatusFilter] = React.useState<string>("All");
  const [typeFilter, setTypeFilter] = React.useState<string>("All");
  const [searchTerm, setSearchTerm] = React.useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = React.useState<string>("");

  // Create / Edit Modal State
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editingCoupon, setEditingCoupon] = React.useState<AdminCouponItem | null>(null);

  // Form Fields
  const [code, setCode] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [discountType, setDiscountType] = React.useState<"Percentage" | "Fixed">("Percentage");
  const [discountValue, setDiscountValue] = React.useState<number>(10);
  const [maximumDiscount, setMaximumDiscount] = React.useState<number>(100);
  const [minimumPurchase, setMinimumPurchase] = React.useState<number>(0);
  const [usageLimit, setUsageLimit] = React.useState<number>(100);
  const [expiresAt, setExpiresAt] = React.useState<string>(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  );

  // Debounce search
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Fetch Coupons
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["admin", "coupons-list", page, limit, statusFilter, typeFilter, debouncedSearch],
    queryFn: () =>
      adminCouponService.getCoupons({
        page,
        limit,
        status: statusFilter !== "All" ? statusFilter : undefined,
        type: typeFilter !== "All" ? typeFilter : undefined,
        search: debouncedSearch.trim() || undefined,
      }),
  });

  const coupons = data?.coupons || [];
  const pagination = data?.pagination || { total: 0, page: 1, limit: 10, totalPages: 1 };

  // Save / Update Mutation
  const saveMutation = useMutation({
    mutationFn: (payload: any) =>
      editingCoupon
        ? adminCouponService.updateCoupon(editingCoupon._id, payload)
        : adminCouponService.createCoupon(payload),
    onSuccess: () => {
      toast.success(editingCoupon ? "تم تحديث الكوبون بنجاح" : "تم إنشاء الكوبون الترويجي بنجاح 🎉");
      setModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["admin", "coupons-list"] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "حدث خطأ أثناء حفظ الكوبون.");
    },
  });

  // Activate / Deactivate Mutation
  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) =>
      active ? adminCouponService.deactivateCoupon(id) : adminCouponService.activateCoupon(id),
    onSuccess: () => {
      toast.success("تم تحديث حالة تفعيل الكوبون 🟢");
      queryClient.invalidateQueries({ queryKey: ["admin", "coupons-list"] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "حدث خطأ أثناء تغيير الحالة.");
    },
  });

  // Soft Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminCouponService.deleteCoupon(id),
    onSuccess: () => {
      toast.success("تم نقل الكوبون لأرشيف المحذوفات بنجاح");
      queryClient.invalidateQueries({ queryKey: ["admin", "coupons-list"] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "حدث خطأ أثناء الحذف.");
    },
  });

  // Export CSV
  const exportToCSV = () => {
    if (coupons.length === 0) {
      toast.error("لا توجد كوبونات للتصدير");
      return;
    }

    const headers = [
      "كود الخصم",
      "نوع الخصم",
      "قيمة الخصم",
      "الحد الأدنى للشراء",
      "عدد مرات الاستخدام",
      "الحد الأقصى",
      "تاريخ الانتهاء",
      "الحالة",
    ];

    const rows = coupons.map((c) => [
      `"${c.code}"`,
      c.discountType,
      c.discountValue,
      c.minimumPurchase,
      c.usedCount,
      c.usageLimit,
      new Date(c.expiresAt).toLocaleDateString("ar-EG"),
      c.status,
    ]);

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `discount_coupons_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("تم تصدير ملف الكوبونات بنجاح 📊");
  };

  return (
    <div className="space-y-6 text-right transition-colors" dir="rtl">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-[#0F274D] p-6 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 bg-[#F58220]/10 text-[#F58220] px-3 py-1 rounded-full text-xs font-black">
            <Tag className="h-4 w-4" />
            <span>نظام الخصومات والعروض الترويجية والحملات التسويقية</span>
          </div>
          <h1 className="text-2xl font-black text-[#0B2D5B] dark:text-white">
            إدارة كودات الخصم والتخفيضات 🏷️
          </h1>
          <p className="text-xs text-slate-500">
            إنشاء الكوبونات، تحديد نسب التخفيض، فحص الحد الأقصى للاستخدام والتفعيل اللحظي.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            onClick={() => {
              setEditingCoupon(null);
              setCode("");
              setDescription("");
              setDiscountType("Percentage");
              setDiscountValue(10);
              setMaximumDiscount(100);
              setMinimumPurchase(0);
              setUsageLimit(100);
              setExpiresAt(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10));
              setModalOpen(true);
            }}
            className="bg-[#0B2D5B] hover:bg-[#1E73D8] text-white rounded-xl text-xs font-bold gap-1.5"
          >
            <Plus className="h-4 w-4" />
            <span>إنشاء كوبون خصم جديد</span>
          </Button>

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

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-[#0F274D] p-4 sm:p-5 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* Search Input */}
          <div className="relative lg:col-span-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ابحث بكود الخصم، الوصف..."
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
              <option value="All">جميع الحالات</option>
              <option value="Active">مفعل ونشط 🟢</option>
              <option value="Inactive">معطل 🔒</option>
              <option value="Expired">منتهي الصلاحية ⌛</option>
            </select>
          </div>

          {/* Type Filter */}
          <div className="space-y-1">
            <select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value);
                setPage(1);
              }}
              className="w-full h-11 px-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold outline-none focus:border-[#F58220]"
            >
              <option value="All">جميع أنواع الخصم</option>
              <option value="Percentage">نسبة مئوية (%)</option>
              <option value="Fixed">مبلغ ثابت (ج.م)</option>
            </select>
          </div>

        </div>
      </div>

      {/* Main Coupons Data Table */}
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
            <p className="text-xs font-bold">فشل استرجاع كودات الخصم</p>
          </div>
        ) : coupons.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Tag className="h-10 w-10 text-slate-300 mx-auto" />
            <p className="text-xs font-extrabold text-slate-500">لا توجد كودات خصم مطابقة حالياً</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 dark:bg-white/5 border-b border-slate-100 dark:border-white/10 text-slate-400 font-bold">
                <tr>
                  <th className="py-4 px-4">كود الخصم</th>
                  <th className="py-4 px-3">نوع وقيمة الخصم</th>
                  <th className="py-4 px-3">مرات الاستخدام المتاحة</th>
                  <th className="py-4 px-3">الحد الأدنى للطلب</th>
                  <th className="py-4 px-3">تاريخ الانتهاء والحالة</th>
                  <th className="py-4 px-4 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5 font-medium">
                {coupons.map((c) => (
                  <tr
                    key={c._id}
                    className="hover:bg-slate-50/60 dark:hover:bg-white/[0.02] transition-colors"
                  >
                    {/* Code */}
                    <td className="py-4 px-4 space-y-0.5">
                      <span className="font-mono font-black text-[#0B2D5B] dark:text-white bg-slate-100 dark:bg-white/10 px-3 py-1 rounded-xl text-sm border border-slate-200 dark:border-white/10">
                        {c.code}
                      </span>
                      <div className="text-[11px] text-slate-400 font-semibold block pt-1">
                        {c.description || "خصم ترويجي على الكورسات"}
                      </div>
                    </td>

                    {/* Discount Value */}
                    <td className="py-4 px-3 font-bold">
                      {c.discountType === "Percentage" ? (
                        <span className="text-emerald-600 font-mono text-sm font-black">
                          {c.discountValue}% خصم
                          {c.maximumDiscount ? ` (حد أقصى ${c.maximumDiscount} ج.م)` : ""}
                        </span>
                      ) : (
                        <span className="text-blue-600 font-mono text-sm font-black">
                          {c.discountValue} ج.م خصم ثابت
                        </span>
                      )}
                    </td>

                    {/* Usage */}
                    <td className="py-4 px-3 space-y-0.5">
                      <div className="font-mono font-bold text-slate-800 dark:text-slate-200">
                        {c.usedCount} / {c.usageLimit || "∞"}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        المتبقي: {c.remainingUsage}
                      </div>
                    </td>

                    {/* Minimum Purchase */}
                    <td className="py-4 px-3 font-mono font-semibold text-slate-600 dark:text-slate-300">
                      {c.minimumPurchase ? `${c.minimumPurchase} ج.م` : "بدون حد أدنى"}
                    </td>

                    {/* Expiration & Status */}
                    <td className="py-4 px-3 space-y-1">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                          c.status === "Active"
                            ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                            : c.status === "Expired"
                            ? "bg-rose-500/10 text-rose-600 border border-rose-500/20"
                            : "bg-slate-500/10 text-slate-500 border border-slate-500/20"
                        }`}
                      >
                        {c.status === "Active" && "مفعل ونشط 🟢"}
                        {c.status === "Expired" && "منتهي الصلاحية ⌛"}
                        {c.status === "Inactive" && "معطل 🔒"}
                      </span>
                      <div className="text-[10px] text-slate-400 font-semibold block">
                        ينتهي: {new Date(c.expiresAt).toLocaleDateString("ar-EG")}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <Link href={`/admin/coupons/${c._id}`}>
                          <button
                            type="button"
                            className="p-2 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-200 hover:bg-[#0B2D5B] hover:text-white transition-colors"
                            title="التفاصيل والإحصائيات"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        </Link>

                        <button
                          type="button"
                          onClick={() =>
                            toggleStatusMutation.mutate({
                              id: c._id,
                              active: c.status === "Active",
                            })
                          }
                          disabled={toggleStatusMutation.isPending}
                          className={`p-2 rounded-xl transition-colors ${
                            c.status === "Active"
                              ? "bg-amber-500/10 text-amber-600 hover:bg-amber-500 hover:text-white"
                              : "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500 hover:text-white"
                          }`}
                          title={c.status === "Active" ? "تعطيل الكوبون" : "تفعيل الكوبون"}
                        >
                          {c.status === "Active" ? <XCircle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`هل أنت تأكد من نقل كود الخصم (${c.code}) للمحذوفات؟`)) {
                              deleteMutation.mutate(c._id);
                            }
                          }}
                          className="p-2 rounded-xl bg-rose-500/10 text-rose-600 hover:bg-rose-600 hover:text-white transition-colors"
                          title="حذف الكوبون"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
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
              عرض الصفحة {pagination.page} من أصل {pagination.totalPages} (إجمالي {pagination.total} كوبون خصم)
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

      {/* CREATE / EDIT COUPON MODAL */}
      <AnimatePresence>
        {modalOpen && (
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
              <h3 className="text-base font-black text-[#0B2D5B] dark:text-white border-b border-slate-100 dark:border-white/10 pb-3">
                {editingCoupon ? "تعديل كود الخصم" : "إنشاء كوبون خصم جديد"}
              </h3>

              <div className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">كود الخصم (Code) *</label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="مثال: EDUSPHERE20..."
                    className="w-full h-11 px-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 outline-none focus:border-[#F58220] font-mono uppercase"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300">نوع الخصم *</label>
                    <select
                      value={discountType}
                      onChange={(e: any) => setDiscountType(e.target.value)}
                      className="w-full h-11 px-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 outline-none focus:border-[#F58220]"
                    >
                      <option value="Percentage">نسبة مئوية (%)</option>
                      <option value="Fixed">مبلغ ثابت (ج.م)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300">قيمة الخصم *</label>
                    <input
                      type="number"
                      value={discountValue}
                      onChange={(e) => setDiscountValue(Number(e.target.value))}
                      className="w-full h-11 px-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 outline-none focus:border-[#F58220]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300">الحد الأقصى للخصم</label>
                    <input
                      type="number"
                      value={maximumDiscount}
                      onChange={(e) => setMaximumDiscount(Number(e.target.value))}
                      placeholder="100 ج.م"
                      className="w-full h-11 px-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 outline-none focus:border-[#F58220]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300">الحد الأقصى للاستخدام</label>
                    <input
                      type="number"
                      value={usageLimit}
                      onChange={(e) => setUsageLimit(Number(e.target.value))}
                      placeholder="100 مرة"
                      className="w-full h-11 px-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 outline-none focus:border-[#F58220]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">تاريخ انتهاء الصلاحية *</label>
                  <input
                    type="date"
                    value={expiresAt}
                    onChange={(e) => setExpiresAt(e.target.value)}
                    className="w-full h-11 px-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 outline-none focus:border-[#F58220]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">الوصف الترويجي</label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="خصم 20% بمناسبة انطلاق الفصل الدراسي الثاني..."
                    className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 outline-none focus:border-[#F58220]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  onClick={() => setModalOpen(false)}
                  variant="outline"
                  className="rounded-xl text-xs font-bold"
                >
                  إلغاء
                </Button>
                <Button
                  onClick={() => {
                    if (!code.trim()) {
                      toast.error("يرجى كتابة كود الخصم");
                      return;
                    }
                    saveMutation.mutate({
                      code: code.trim(),
                      description: description.trim(),
                      discountType,
                      discountValue,
                      maximumDiscount,
                      minimumPurchase,
                      usageLimit,
                      expiresAt,
                    });
                  }}
                  disabled={saveMutation.isPending}
                  className="bg-[#0B2D5B] hover:bg-[#1E73D8] text-white rounded-xl text-xs font-extrabold"
                >
                  <span>حفظ الكوبون</span>
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

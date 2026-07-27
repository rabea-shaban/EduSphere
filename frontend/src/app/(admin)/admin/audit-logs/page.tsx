"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
  FileText,
  ShieldAlert,
  Clock,
  Search,
  Download,
  Eye,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Activity,
  Filter,
  Terminal,
  Cpu,
  UserCheck,
  Server,
} from "lucide-react";
import { toast } from "react-hot-toast";
import adminAuditLogService, { AuditLogItem, AuditLogStatistics } from "@/services/adminAuditLog.service";
import { Button } from "@/components/ui/button";

export default function AdminAuditLogsPage() {
  const [page, setPage] = React.useState(1);
  const [search, setSearch] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("");
  const [selectedStatus, setSelectedStatus] = React.useState("");

  const [selectedLogModal, setSelectedLogModal] = React.useState<AuditLogItem | null>(null);

  // Debounce search
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(handler);
  }, [search]);

  // Fetch Statistics
  const { data: stats, refetch: refetchStats } = useQuery<AuditLogStatistics>({
    queryKey: ["admin", "audit-stats"],
    queryFn: () => adminAuditLogService.getStatistics(),
  });

  // Fetch Audit Logs Table
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["admin", "audit-logs", page, debouncedSearch, selectedCategory, selectedStatus],
    queryFn: () =>
      adminAuditLogService.getLogs({
        page,
        limit: 15,
        search: debouncedSearch,
        category: selectedCategory,
        status: selectedStatus,
      }),
  });

  const logs = data?.logs || [];
  const pagination = data?.pagination;

  // Export Audit Logs to CSV
  const exportToCSV = () => {
    if (!logs.length) {
      toast.error("لا توجد سجلات حالية للتصدير");
      return;
    }

    const headers = ["Activity ID", "Date", "Action", "Category", "Module", "Status", "User", "Role", "IP Address"];
    const rows = logs.map((l) => [
      l._id,
      new Date(l.createdAt).toLocaleString("ar-EG"),
      `"${l.action}"`,
      l.category,
      l.module || "System",
      l.status,
      l.userId?.firstName ? `"${l.userId.firstName} ${l.userId.lastName}"` : "نظام",
      l.userId?.role || "SYSTEM",
      l.ipAddress || "127.0.0.1",
    ]);

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `edusphere_audit_logs_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("تم تصدير سجل التدقيق إلى ملف CSV بنجاح");
  };

  return (
    <div className="space-y-6 text-right transition-colors" dir="rtl">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-[#0F274D] p-6 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 bg-[#0B2D5B]/10 text-[#0B2D5B] dark:text-blue-400 px-3 py-1 rounded-full text-xs font-black">
            <Activity className="h-4 w-4" />
            <span>نظام مراقبة الأنشطة وسجل التدقيق الإداري (Audit Trail)</span>
          </div>
          <h1 className="text-2xl font-black text-[#0B2D5B] dark:text-white">
            سجل التدقيق ومراقبة الأنشطة
          </h1>
          <p className="text-xs text-slate-500">
            تتبع وتسجيل كافة الإجراءات والعمليات والتغييرات الأمنية والمالية بدقة عالية ومراقبة مستمرة.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={exportToCSV}
            variant="outline"
            className="rounded-xl border-slate-200 dark:border-white/10 text-xs font-bold gap-1.5"
          >
            <Download className="h-4 w-4 text-[#F58220]" />
            <span>تصدير السجل (CSV)</span>
          </Button>

          <Button
            onClick={() => {
              refetch();
              refetchStats();
            }}
            variant="outline"
            size="icon"
            className="rounded-xl border-slate-200 dark:border-white/10"
            title="تحديث السجل"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Logs */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#0F274D] border border-slate-200/80 dark:border-white/10 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">إجمالي الأنشطة المسجلة</span>
            <div className="p-2.5 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <FileText className="h-5 w-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#0B2D5B] dark:text-white">
            {stats?.totalLogs || 0}
          </div>
        </div>

        {/* Today's Activities */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#0F274D] border border-slate-200/80 dark:border-white/10 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">أنشطة اليوم</span>
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {stats?.todayCount || 0}
          </div>
        </div>

        {/* Security Events */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#0F274D] border border-slate-200/80 dark:border-white/10 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">الأحداث الأمنية</span>
            <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <ShieldAlert className="h-5 w-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400">
            {stats?.securityCount || 0}
          </div>
        </div>

        {/* Failed Attempts */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#0F274D] border border-slate-200/80 dark:border-white/10 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">محاولات فاشلة / مرفوضة</span>
            <div className="p-2.5 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
              <AlertTriangle className="h-5 w-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-600 dark:text-rose-400">
            {stats?.failedCount || 0}
          </div>
        </div>

      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-[#0F274D] p-4 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
        
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="البحث باسم الإجراء، المستخدم، أو عنوان IP..."
            className="w-full h-10 pr-10 pl-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-medium outline-none focus:border-[#F58220]"
          />
        </div>

        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setPage(1);
          }}
          className="h-10 px-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-slate-200 outline-none"
        >
          <option value="">جميع التصنيفات</option>
          <option value="Login">تسجيل الدخول (Login)</option>
          <option value="Admin">إدارة النظام (Admin)</option>
          <option value="Payment">المالية والتحصيل (Payment)</option>
          <option value="Security">الأمان والحماية (Security)</option>
          <option value="Settings">إعدادات المنظومة (Settings)</option>
        </select>

        {/* Status Filter */}
        <select
          value={selectedStatus}
          onChange={(e) => {
            setSelectedStatus(e.target.value);
            setPage(1);
          }}
          className="h-10 px-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-slate-200 outline-none"
        >
          <option value="">جميع الحالات</option>
          <option value="SUCCESS">ناجحة (SUCCESS)</option>
          <option value="FAILED">فاشلة (FAILED)</option>
          <option value="WARNING">تحذير أمني (WARNING)</option>
        </select>

      </div>

      {/* Audit Log Table */}
      <div className="bg-white dark:bg-[#0F274D] rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 space-y-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-12 w-full bg-slate-100 dark:bg-white/5 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <FileText className="h-10 w-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-600 dark:text-slate-300">
              لا توجد سجلات تدقيق مطابقة لمعايير البحث
            </h3>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 dark:bg-white/5 border-b border-slate-200/80 dark:border-white/10 font-bold text-slate-600 dark:text-slate-300">
                <tr>
                  <th className="py-4 px-4">الإجراء والبيان</th>
                  <th className="py-4 px-4">المنفذ / المستخدم</th>
                  <th className="py-4 px-4">القسم</th>
                  <th className="py-4 px-4">الحالة</th>
                  <th className="py-4 px-4">IP Address</th>
                  <th className="py-4 px-4">التاريخ والوقت</th>
                  <th className="py-4 px-4 text-center">التفاصيل</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5 font-medium">
                {logs.map((log) => (
                  <tr key={log._id} className="hover:bg-slate-50/60 dark:hover:bg-white/[0.02]">
                    
                    {/* Action */}
                    <td className="py-4 px-4">
                      <div className="space-y-0.5">
                        <span className="font-extrabold text-[#0B2D5B] dark:text-white block">
                          {log.action}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          ID: {log._id.slice(-6)}
                        </span>
                      </div>
                    </td>

                    {/* Performed By */}
                    <td className="py-4 px-4">
                      {log.userId ? (
                        <div>
                          <span className="font-bold text-slate-800 dark:text-slate-200 block">
                            {log.userId.firstName} {log.userId.lastName}
                          </span>
                          <span className="text-[10px] text-slate-400 font-extrabold">
                            {log.userId.role}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400 font-bold text-[11px]">النظام الإداري</span>
                      )}
                    </td>

                    {/* Module */}
                    <td className="py-4 px-4">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 text-[11px] font-bold">
                        {log.module || log.category}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4">
                      {log.status === "SUCCESS" && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
                          <CheckCircle2 className="h-3 w-3" />
                          <span>ناجح</span>
                        </span>
                      )}
                      {log.status === "FAILED" && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 bg-rose-500/10 px-2.5 py-0.5 rounded-full">
                          <XCircle className="h-3 w-3" />
                          <span>فشل</span>
                        </span>
                      )}
                      {log.status === "WARNING" && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-500/10 px-2.5 py-0.5 rounded-full">
                          <AlertTriangle className="h-3 w-3" />
                          <span>تحذير أمني</span>
                        </span>
                      )}
                    </td>

                    {/* IP */}
                    <td className="py-4 px-4 text-slate-500 font-mono text-[11px]">
                      {log.ipAddress || "127.0.0.1"}
                    </td>

                    {/* Date */}
                    <td className="py-4 px-4 text-slate-500 text-[11px]">
                      {new Date(log.createdAt).toLocaleString("ar-EG")}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => setSelectedLogModal(log)}
                        className="p-2 rounded-xl bg-[#0B2D5B]/10 text-[#0B2D5B] dark:text-blue-400 hover:bg-[#0B2D5B] hover:text-white transition-colors"
                        title="معاينة سجل التدقيق"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="p-4 border-t border-slate-200/80 dark:border-white/10 flex items-center justify-between text-xs font-bold text-slate-500">
            <span>
              عرض الصفحة {pagination.page} من {pagination.totalPages} (إجمالي {pagination.total} سجل)
            </span>

            <div className="flex items-center gap-2">
              <Button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                variant="outline"
                className="rounded-xl text-xs"
              >
                السابق
              </Button>

              <Button
                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                disabled={page === pagination.totalPages}
                variant="outline"
                className="rounded-xl text-xs"
              >
                التالي
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* INSPECT LOG DETAILS MODAL */}
      <AnimatePresence>
        {selectedLogModal && (
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
              className="bg-white dark:bg-[#0F274D] p-6 rounded-3xl max-w-lg w-full border border-slate-200 dark:border-white/10 shadow-2xl space-y-4 text-right"
              dir="rtl"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-3">
                <h3 className="text-base font-black text-[#0B2D5B] dark:text-white">
                  تفاصيل سجل التدقيق رقم ({selectedLogModal._id.slice(-8)})
                </h3>
                <span className="text-xs font-bold text-slate-400 font-mono">Audit Trace</span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/10">
                  <div>
                    <span className="text-slate-400 block text-[10px]">المنفذ:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {selectedLogModal.userId?.firstName || "النظام"} ({selectedLogModal.userId?.role || "SYSTEM"})
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px]">عنوان IP:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">
                      {selectedLogModal.ipAddress || "127.0.0.1"}
                    </span>
                  </div>
                </div>

                {selectedLogModal.details && (
                  <div className="space-y-1">
                    <span className="font-bold text-slate-700 dark:text-slate-300">تفاصيل البيانات (Details Trace):</span>
                    <pre className="p-3 rounded-2xl bg-slate-900 text-emerald-400 font-mono text-[11px] overflow-x-auto dir-ltr text-left">
                      {JSON.stringify(selectedLogModal.details, null, 2)}
                    </pre>
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  onClick={() => setSelectedLogModal(null)}
                  variant="outline"
                  className="rounded-xl text-xs font-bold"
                >
                  إغلاق
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

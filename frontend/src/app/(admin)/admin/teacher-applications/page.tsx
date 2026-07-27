"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  GraduationCap,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Eye,
  Trash2,
  Download,
  FileSpreadsheet,
  CheckSquare,
  Square,
  Clock,
  AlertCircle,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Briefcase,
  Calendar,
  Layers,
  FileText,
  UserCheck,
  UserX,
} from "lucide-react";
import { toast } from "react-hot-toast";
import teacherApplicationService, {
  TeacherApplicationItem,
} from "@/services/teacherApplication.service";
import { Button } from "@/components/ui/button";

export default function AdminTeacherApplicationsPage() {
  const queryClient = useQueryClient();

  // State Filters & Pagination
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);
  const [statusFilter, setStatusFilter] = React.useState<string>("All");
  const [stageFilter, setStageFilter] = React.useState<string>("All");
  const [subjectFilter, setSubjectFilter] = React.useState<string>("All");
  const [searchTerm, setSearchTerm] = React.useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = React.useState<string>("");

  // Selection & Modals State
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [rejectingApp, setRejectingApp] = React.useState<TeacherApplicationItem | null>(null);
  const [rejectionReasonInput, setRejectionReasonInput] = React.useState("");
  const [isBulkRejectModalOpen, setIsBulkRejectModalOpen] = React.useState(false);
  const [bulkRejectionReason, setBulkRejectionReason] = React.useState("");

  // Debounce search input
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Fetch Applications with React Query
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: [
      "admin",
      "teacher-applications",
      page,
      limit,
      statusFilter,
      stageFilter,
      subjectFilter,
      debouncedSearch,
    ],
    queryFn: () =>
      teacherApplicationService.getApplications({
        page,
        limit,
        status: statusFilter !== "All" ? statusFilter : undefined,
        stage: stageFilter !== "All" ? stageFilter : undefined,
        subject: subjectFilter !== "All" ? subjectFilter : undefined,
        search: debouncedSearch.trim() || undefined,
      }),
  });

  const applications = data?.applications || [];
  const pagination = data?.pagination || { total: 0, page: 1, limit: 10, totalPages: 1 };

  // Approve Mutation
  const approveMutation = useMutation({
    mutationFn: (id: string) => teacherApplicationService.updateStatus(id, "Approved"),
    onSuccess: () => {
      toast.success("تم التوافق واعتتماد المعلم بنجاح وتفعيل لوحة تحكم المعلم 🎉");
      queryClient.invalidateQueries({ queryKey: ["admin", "teacher-applications"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "حدث خطأ أثناء اعتماد الطلب.");
    },
  });

  // Single Reject Mutation
  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      teacherApplicationService.updateStatus(id, "Rejected", reason),
    onSuccess: () => {
      toast.success("تم تسجيل رفض الطلب وإبلاغ المتقدم بالسبب.");
      setRejectingApp(null);
      setRejectionReasonInput("");
      queryClient.invalidateQueries({ queryKey: ["admin", "teacher-applications"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "حدث خطأ أثناء رفض الطلب.");
    },
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => teacherApplicationService.deleteApplication(id),
    onSuccess: () => {
      toast.success("تم حذف الطلب بنجاح");
      queryClient.invalidateQueries({ queryKey: ["admin", "teacher-applications"] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "حدث خطأ أثناء المسح.");
    },
  });

  // Bulk Approve Mutation
  const bulkApproveMutation = useMutation({
    mutationFn: (ids: string[]) => teacherApplicationService.bulkApprove(ids),
    onSuccess: (res) => {
      toast.success(`تم اعتماد ${res.approvedCount} معلماً بنجاح 🎉`);
      setSelectedIds([]);
      queryClient.invalidateQueries({ queryKey: ["admin", "teacher-applications"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "حدث خطأ أثناء الاعتماد الجماعي.");
    },
  });

  // Bulk Reject Mutation
  const bulkRejectMutation = useMutation({
    mutationFn: ({ ids, reason }: { ids: string[]; reason: string }) =>
      teacherApplicationService.bulkReject(ids, reason),
    onSuccess: (res) => {
      toast.success(`تم رفض ${res.rejectedCount} طلباً بنجاح.`);
      setSelectedIds([]);
      setIsBulkRejectModalOpen(false);
      setBulkRejectionReason("");
      queryClient.invalidateQueries({ queryKey: ["admin", "teacher-applications"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "حدث خطأ أثناء الرفض الجماعي.");
    },
  });

  // Selection handlers
  const toggleSelectAll = () => {
    if (selectedIds.length === applications.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(applications.map((app) => app._id));
    }
  };

  const toggleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds((prev) => prev.filter((item) => item !== id));
    } else {
      setSelectedIds((prev) => [...prev, id]);
    }
  };

  // CSV Export Function
  const exportToCSV = () => {
    const targetApps = selectedIds.length > 0
      ? applications.filter((app) => selectedIds.includes(app._id))
      : applications;

    if (targetApps.length === 0) {
      toast.error("لا توجد طلبات للتصدير");
      return;
    }

    const headers = [
      "رقم الطلب",
      "اسم المتقدم",
      "البريد الإلكتروني",
      "الهاتف",
      "الرقم القومي",
      "المادة",
      "المرحلة",
      "سنوات الخبرة",
      "تاريخ التقديم",
      "الحالة",
    ];

    const rows = targetApps.map((app) => [
      app._id,
      `"${app.fullName}"`,
      app.email,
      `"${app.phone}"`,
      `"${app.nationalId || ""}"`,
      `"${app.subject}"`,
      `"${app.stage}"`,
      app.experienceYears,
      new Date(app.createdAt).toLocaleDateString("ar-EG"),
      app.status,
    ]);

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `teacher_applications_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("تم تصدير ملف CSV بنجاح 📊");
  };

  return (
    <div className="space-y-6 text-right transition-colors" dir="rtl">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-[#0F274D] p-6 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 bg-purple-500/10 text-purple-600 dark:text-purple-400 px-3 py-1 rounded-full text-xs font-black">
            <GraduationCap className="h-4 w-4" />
            <span>نظام إدارة واعتماد المعلمين</span>
          </div>
          <h1 className="text-2xl font-black text-[#0B2D5B] dark:text-white">
            طلبات انضمام المعلمين 👨‍🏫
          </h1>
          <p className="text-xs text-slate-500">
            مراجعة كاملة لبيانات ومستندات المعلمين المتقدمين وانتقاء الكوادر وتفعيل حساباتهم.
          </p>
        </div>

        {/* Global Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            onClick={exportToCSV}
            variant="outline"
            className="rounded-xl border-slate-200 dark:border-white/10 text-xs font-bold gap-2"
          >
            <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
            <span>تصدير البيانات (CSV)</span>
          </Button>

          <Button
            onClick={() => refetch()}
            variant="outline"
            size="icon"
            className="rounded-xl border-slate-200 dark:border-white/10"
            title="تحديث القائمة"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-[#0F274D] p-4 sm:p-5 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          
          {/* Search Input */}
          <div className="relative lg:col-span-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ابحث بالاسم، الرقم القومي، الهاتف أو الإيميل..."
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
              <option value="All">كافة الحالات (الكل)</option>
              <option value="Pending">قيد الانتظار ⏳</option>
              <option value="UnderReview">قيد الفحص والمراجعة 🔍</option>
              <option value="Approved">مقبول ومفعل ✓</option>
              <option value="Rejected">مرفوض ❌</option>
            </select>
          </div>

          {/* Stage Filter */}
          <div className="space-y-1">
            <select
              value={stageFilter}
              onChange={(e) => {
                setStageFilter(e.target.value);
                setPage(1);
              }}
              className="w-full h-11 px-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold outline-none focus:border-[#F58220]"
            >
              <option value="All">جميع المراحل التعليمية</option>
              <option value="المرحلة الثانوية">المرحلة الثانوية</option>
              <option value="المرحلة الإعدادية">المرحلة الإعدادية</option>
              <option value="المرحلة الابتدائية">المرحلة الابتدائية</option>
              <option value="جامعي / كليات">جامعي / كليات</option>
            </select>
          </div>

          {/* Subject Filter */}
          <div className="space-y-1">
            <select
              value={subjectFilter}
              onChange={(e) => {
                setSubjectFilter(e.target.value);
                setPage(1);
              }}
              className="w-full h-11 px-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold outline-none focus:border-[#F58220]"
            >
              <option value="All">جميع التخصصات والمواد</option>
              <option value="الرياضيات">الرياضيات</option>
              <option value="الفيزياء">الفيزياء</option>
              <option value="الكيمياء">الكيمياء</option>
              <option value="اللغة العربية">اللغة العربية</option>
              <option value="اللغة الإنجليزية">اللغة الإنجليزية</option>
              <option value="الأحياء">الأحياء</option>
              <option value="الحاسب الآلي والذكاء الاصطناعي">الحاسب الآلي</option>
            </select>
          </div>

        </div>

        {/* Bulk Action Bar (Visible when rows selected) */}
        {selectedIds.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 rounded-2xl bg-[#0B2D5B] text-white flex flex-wrap items-center justify-between gap-3 text-xs font-bold shadow-lg"
          >
            <div className="flex items-center gap-2">
              <CheckSquare className="h-4 w-4 text-[#F58220]" />
              <span>تم تحديد {selectedIds.length} طلبات انضمام</span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                onClick={() => bulkApproveMutation.mutate(selectedIds)}
                disabled={bulkApproveMutation.isPending}
                size="sm"
                className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-black gap-1.5"
              >
                <UserCheck className="h-4 w-4" />
                <span>اعتماد المحدد ({selectedIds.length})</span>
              </Button>

              <Button
                onClick={() => setIsBulkRejectModalOpen(true)}
                size="sm"
                className="bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-black gap-1.5"
              >
                <UserX className="h-4 w-4" />
                <span>رفض المحدد ({selectedIds.length})</span>
              </Button>

              <Button
                onClick={() => setSelectedIds([])}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/10 rounded-xl text-xs"
              >
                إلغاء التحديد
              </Button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Main Applications Table */}
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
            <p className="text-xs font-bold">فشل استرجاع بيانات المعلمين</p>
          </div>
        ) : applications.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <GraduationCap className="h-10 w-10 text-slate-300 mx-auto" />
            <p className="text-xs font-extrabold text-slate-500">لا توجد طلبات انضمام مطابقة للشروط الحالية</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 dark:bg-white/5 border-b border-slate-100 dark:border-white/10 text-slate-400 font-bold">
                <tr>
                  <th className="py-4 px-4 text-center">
                    <button type="button" onClick={toggleSelectAll} className="cursor-pointer">
                      {selectedIds.length === applications.length && applications.length > 0 ? (
                        <CheckSquare className="h-4 w-4 text-[#F58220]" />
                      ) : (
                        <Square className="h-4 w-4 text-slate-400" />
                      )}
                    </button>
                  </th>
                  <th className="py-4 px-3">المتقدم والتخصص</th>
                  <th className="py-4 px-3">بيانات التواصل</th>
                  <th className="py-4 px-3">الرقم القومي</th>
                  <th className="py-4 px-3">المرحلة والخبرة</th>
                  <th className="py-4 px-3">تاريخ التقديم</th>
                  <th className="py-4 px-3">الحالة</th>
                  <th className="py-4 px-4 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5 font-medium">
                {applications.map((app) => {
                  const isSelected = selectedIds.includes(app._id);
                  return (
                    <tr
                      key={app._id}
                      className={`hover:bg-slate-50/60 dark:hover:bg-white/[0.02] transition-colors ${
                        isSelected ? "bg-blue-50/50 dark:bg-white/5" : ""
                      }`}
                    >
                      <td className="py-4 px-4 text-center">
                        <button type="button" onClick={() => toggleSelectOne(app._id)}>
                          {isSelected ? (
                            <CheckSquare className="h-4 w-4 text-[#F58220]" />
                          ) : (
                            <Square className="h-4 w-4 text-slate-400" />
                          )}
                        </button>
                      </td>

                      {/* Applicant Name & Subject */}
                      <td className="py-4 px-3 space-y-0.5">
                        <Link
                          href={`/admin/teacher-applications/${app._id}`}
                          className="font-extrabold text-[#0B2D5B] dark:text-white hover:text-[#F58220] transition-colors block text-sm"
                        >
                          {app.fullName}
                        </Link>
                        <div className="text-[11px] text-[#F58220] font-bold flex items-center gap-1">
                          <Briefcase className="h-3 w-3" />
                          <span>{app.subject}</span>
                        </div>
                      </td>

                      {/* Contact Email & Phone */}
                      <td className="py-4 px-3 space-y-0.5">
                        <div className="font-bold text-slate-700 dark:text-slate-200 dir-ltr text-right">
                          {app.phone}
                        </div>
                        <div className="text-[11px] text-slate-400 dir-ltr text-right truncate max-w-[160px]">
                          {app.email}
                        </div>
                      </td>

                      {/* National ID */}
                      <td className="py-4 px-3 font-mono text-slate-600 dark:text-slate-300">
                        {app.nationalId || "غير مدخل"}
                      </td>

                      {/* Stage & Experience */}
                      <td className="py-4 px-3 space-y-0.5">
                        <div className="font-bold text-slate-700 dark:text-slate-200">{app.stage}</div>
                        <div className="text-[11px] text-slate-400">خبرة: {app.experienceYears} سنوات</div>
                      </td>

                      {/* Submitted Date */}
                      <td className="py-4 px-3 text-slate-400 text-[11px]">
                        {new Date(app.createdAt).toLocaleDateString("ar-EG", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>

                      {/* Status Badge */}
                      <td className="py-4 px-3">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black ${
                            app.status === "Approved"
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                              : app.status === "Rejected"
                              ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                              : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                          }`}
                        >
                          {app.status === "Approved" && (
                            <>
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              <span>مقبول ومفعل</span>
                            </>
                          )}
                          {app.status === "Rejected" && (
                            <>
                              <XCircle className="h-3.5 w-3.5" />
                              <span>مرفوض</span>
                            </>
                          )}
                          {app.status !== "Approved" && app.status !== "Rejected" && (
                            <>
                              <Clock className="h-3.5 w-3.5" />
                              <span>قيد الانتظار</span>
                            </>
                          )}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <Link
                            href={`/admin/teacher-applications/${app._id}`}
                            className="p-2 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-200 hover:bg-[#0B2D5B] hover:text-white transition-colors"
                            title="عرض كافة التفاصيل والمستندات"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>

                          {app.status !== "Approved" && (
                            <button
                              type="button"
                              onClick={() => approveMutation.mutate(app._id)}
                              disabled={approveMutation.isPending}
                              className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500 hover:text-white transition-colors"
                              title="اعتماد وتفعيل المعلم"
                            >
                              <CheckCircle2 className="h-4 w-4" />
                            </button>
                          )}

                          {app.status !== "Rejected" && (
                            <button
                              type="button"
                              onClick={() => setRejectingApp(app)}
                              className="p-2 rounded-xl bg-rose-500/10 text-rose-600 hover:bg-rose-500 hover:text-white transition-colors"
                              title="رفض الطلب"
                            >
                              <XCircle className="h-4 w-4" />
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => {
                              if (confirm("هل أنت تأكد من مسح هذا الطلب؟")) {
                                deleteMutation.mutate(app._id);
                              }
                            }}
                            className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-400 hover:bg-rose-600 hover:text-white transition-colors"
                            title="حذف الطلب"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {pagination.totalPages > 1 && (
          <div className="p-4 border-t border-slate-100 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold text-slate-500">
            <div>
              عرض الصفحة {pagination.page} من أصل {pagination.totalPages} (إجمالي {pagination.total} طلب)
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

      {/* SINGLE REJECT MODAL */}
      <AnimatePresence>
        {rejectingApp && (
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
                    سبب عدم قبول طلب المعلم
                  </h3>
                  <p className="text-xs text-slate-500">مطلب إلزامي لإيضاح سبب الرفض للمتقدم</p>
                </div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-white/5 rounded-2xl text-xs font-bold text-slate-700 dark:text-slate-200">
                المتقدم: {rejectingApp.fullName} ({rejectingApp.subject})
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  سبب الرفض المباشر *
                </label>
                <textarea
                  rows={3}
                  value={rejectionReasonInput}
                  onChange={(e) => setRejectionReasonInput(e.target.value)}
                  placeholder="مثال: يرجى رفع صورة أوضح لشهادة التخرج والسيرة الذاتية المفصلة..."
                  className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  onClick={() => setRejectingApp(null)}
                  variant="outline"
                  className="rounded-xl text-xs font-bold"
                >
                  إلغاء
                </Button>
                <Button
                  onClick={() => {
                    if (!rejectionReasonInput.trim()) {
                      toast.error("يرجى كتابة سبب الرفض إعمالاً بالدقة والمهنية");
                      return;
                    }
                    rejectMutation.mutate({ id: rejectingApp._id, reason: rejectionReasonInput.trim() });
                  }}
                  disabled={rejectMutation.isPending}
                  className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-extrabold gap-1.5"
                >
                  <span>تأكيد تسجيل الرفض</span>
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* BULK REJECT MODAL */}
      <AnimatePresence>
        {isBulkRejectModalOpen && (
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
                  <UserX className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-base font-black text-[#0B2D5B] dark:text-white">
                    الرفض الجماعي لـ {selectedIds.length} طلبات
                  </h3>
                  <p className="text-xs text-slate-500">سيتم إرسال سبب الرفض لكافة المتقدمين المحددين</p>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  سبب الرفض الجماعي *
                </label>
                <textarea
                  rows={3}
                  value={bulkRejectionReason}
                  onChange={(e) => setBulkRejectionReason(e.target.value)}
                  placeholder="لم يتم استيفاء المستندات أو الأوراق المطلوبة للتسجيل..."
                  className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  onClick={() => setIsBulkRejectModalOpen(false)}
                  variant="outline"
                  className="rounded-xl text-xs font-bold"
                >
                  إلغاء
                </Button>
                <Button
                  onClick={() => {
                    bulkRejectMutation.mutate({ ids: selectedIds, reason: bulkRejectionReason });
                  }}
                  disabled={bulkRejectMutation.isPending}
                  className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-extrabold"
                >
                  <span>تأكيد الرفض الجماعي</span>
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

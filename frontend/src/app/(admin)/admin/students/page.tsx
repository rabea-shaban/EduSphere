"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Users,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Eye,
  Trash2,
  FileSpreadsheet,
  CheckSquare,
  Square,
  Clock,
  AlertCircle,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Award,
  Star,
  KeyRound,
  Lock,
  UserCheck,
  UserX,
  Send,
  Zap,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import { toast } from "react-hot-toast";
import adminStudentService, { AdminStudentItem } from "@/services/adminStudent.service";
import { Button } from "@/components/ui/button";

export default function AdminStudentsPage() {
  const queryClient = useQueryClient();

  // Filters & State
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);
  const [statusFilter, setStatusFilter] = React.useState<string>("All");
  const [sortFilter, setSortFilter] = React.useState<string>("newest");
  const [searchTerm, setSearchTerm] = React.useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = React.useState<string>("");

  // Modals & Selection State
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [resetPasswordStudent, setResetPasswordStudent] = React.useState<AdminStudentItem | null>(null);
  const [newPasswordInput, setNewPasswordInput] = React.useState("");
  const [notifyStudent, setNotifyStudent] = React.useState<AdminStudentItem | null>(null);
  const [notifTitle, setNotifTitle] = React.useState("");
  const [notifMessage, setNotifMessage] = React.useState("");

  // Debounce search
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Fetch Students List
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["admin", "students-list", page, limit, statusFilter, sortFilter, debouncedSearch],
    queryFn: () =>
      adminStudentService.getStudents({
        page,
        limit,
        status: statusFilter !== "All" ? statusFilter : undefined,
        sort: sortFilter,
        search: debouncedSearch.trim() || undefined,
      }),
  });

  const students = data?.students || [];
  const pagination = data?.pagination || { total: 0, page: 1, limit: 10, totalPages: 1 };

  // Suspend Mutation
  const suspendMutation = useMutation({
    mutationFn: (id: string) => adminStudentService.suspendStudent(id),
    onSuccess: () => {
      toast.success("تم تعليق حساب الطالب بنجاح.");
      queryClient.invalidateQueries({ queryKey: ["admin", "students-list"] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "حدث خطأ أثناء تجميد الحساب.");
    },
  });

  // Activate Mutation
  const activateMutation = useMutation({
    mutationFn: (id: string) => adminStudentService.activateStudent(id),
    onSuccess: () => {
      toast.success("تم إعادة تفعيل حساب الطالب بنجاح.");
      queryClient.invalidateQueries({ queryKey: ["admin", "students-list"] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "حدث خطأ أثناء تفعيل الحساب.");
    },
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminStudentService.deleteStudent(id),
    onSuccess: () => {
      toast.success("تم نقل الطالب لأرشيف المحذوفات بنجاح");
      queryClient.invalidateQueries({ queryKey: ["admin", "students-list"] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "حدث خطأ أثناء المسح.");
    },
  });

  // Reset Password Mutation
  const resetPasswordMutation = useMutation({
    mutationFn: ({ id, pass }: { id: string; pass: string }) =>
      adminStudentService.resetPassword(id, pass),
    onSuccess: () => {
      toast.success("تم تعيين كلمة المرور الجديدة للطالب بنجاح.");
      setResetPasswordStudent(null);
      setNewPasswordInput("");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "حدث خطأ أثناء تعيين كلمة المرور.");
    },
  });

  // Send Notification Mutation
  const sendNotifMutation = useMutation({
    mutationFn: ({ id, title, message }: { id: string; title: string; message: string }) =>
      adminStudentService.sendNotification(id, title, message),
    onSuccess: () => {
      toast.success("تم إرسال الإشعار للطالب بنجاح.");
      setNotifyStudent(null);
      setNotifTitle("");
      setNotifMessage("");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "حدث خطأ أثناء إرسال الإشعار.");
    },
  });

  // Selection Handlers
  const toggleSelectAll = () => {
    if (selectedIds.length === students.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(students.map((s) => s._id));
    }
  };

  const toggleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds((prev) => prev.filter((item) => item !== id));
    } else {
      setSelectedIds((prev) => [...prev, id]);
    }
  };

  // CSV Export
  const exportToCSV = () => {
    const targetStudents = selectedIds.length > 0
      ? students.filter((s) => selectedIds.includes(s._id))
      : students;

    if (targetStudents.length === 0) {
      toast.error("لا يوجد طلاب للتصدير");
      return;
    }

    const headers = [
      "رقم الطالب",
      "الاسم الكامل",
      "البريد الإلكتروني",
      "الهاتف",
      "المرحلة",
      "النظام التعليمي",
      "عدد الكورسات",
      "مجموع النقاط (XP)",
      "تاريخ الانضمام",
      "الحالة",
    ];

    const rows = targetStudents.map((s) => [
      s._id,
      `"${s.fullName}"`,
      s.email,
      `"${s.phone || ""}"`,
      `"${s.grade}"`,
      `"${s.educationalSystem}"`,
      s.enrolledCoursesCount,
      s.xp,
      new Date(s.createdAt).toISOString().slice(0, 10),
      s.status,
    ]);

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `registered_students_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("تم تصدير ملف الطلاب المسجلين بنجاح.");
  };

  return (
    <div className="space-y-6 text-right transition-colors" dir="rtl">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-[#0F274D] p-6 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 bg-[#0B2D5B]/10 dark:bg-white/10 text-[#0B2D5B] dark:text-white px-3 py-1 rounded-full text-xs font-black">
            <Users className="h-4 w-4 text-[#F58220]" />
            <span>سجل الطلاب والتعليم الإلكتروني</span>
          </div>
          <h1 className="text-2xl font-black text-[#0B2D5B] dark:text-white">
            دليل الطلاب والدارسين
          </h1>
          <p className="text-xs text-slate-500">
            متابعة التقدم الدراسي للطلاب، التقارير الأكاديمية، تجميد/تفعيل الحسابات وإدارة الصلاحيات.
          </p>
        </div>

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
              placeholder="ابحث باسم الطالب، البريد، رقم الهاتف، أو معرف الطالب..."
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
              <option value="All">جميع حالات الحسابات</option>
              <option value="Active">طالب نشط</option>
              <option value="Suspended">طالب مجمد</option>
            </select>
          </div>

          {/* Sort Filter */}
          <div className="space-y-1">
            <select
              value={sortFilter}
              onChange={(e) => {
                setSortFilter(e.target.value);
                setPage(1);
              }}
              className="w-full h-11 px-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold outline-none focus:border-[#F58220]"
            >
              <option value="newest">الأحدث تسجيلاً</option>
              <option value="oldest">الأقدم تسجيلاً</option>
              <option value="highest_xp">الأعلى نقاطاً (XP)</option>
              <option value="highest_quiz">الأعلى تقييماً للاختبارات</option>
              <option value="most_courses">الأكثر اشتراكاً بالكورسات</option>
            </select>
          </div>

        </div>

        {/* Bulk Action Bar */}
        {selectedIds.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 rounded-2xl bg-[#0B2D5B] text-white flex flex-wrap items-center justify-between gap-3 text-xs font-bold shadow-lg"
          >
            <div className="flex items-center gap-2">
              <CheckSquare className="h-4 w-4 text-[#F58220]" />
              <span>تم تحديد {selectedIds.length} طلاب</span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                onClick={() => {
                  selectedIds.forEach((id) => activateMutation.mutate(id));
                  setSelectedIds([]);
                }}
                size="sm"
                className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-black gap-1.5"
              >
                <UserCheck className="h-4 w-4" />
                <span>تفعيل المحدد ({selectedIds.length})</span>
              </Button>

              <Button
                onClick={() => {
                  selectedIds.forEach((id) => suspendMutation.mutate(id));
                  setSelectedIds([]);
                }}
                size="sm"
                className="bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-black gap-1.5"
              >
                <UserX className="h-4 w-4" />
                <span>تجميد المحدد ({selectedIds.length})</span>
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

      {/* Main Students Data Table */}
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
            <p className="text-xs font-bold">فشل استرجاع دليل الطلاب المسجلين</p>
          </div>
        ) : students.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Users className="h-10 w-10 text-slate-300 mx-auto" />
            <p className="text-xs font-extrabold text-slate-500">لا يوجد طلاب مطبقين للشروط الحالية</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 dark:bg-white/5 border-b border-slate-100 dark:border-white/10 text-slate-400 font-bold">
                <tr>
                  <th className="py-4 px-4 text-center">
                    <button type="button" onClick={toggleSelectAll} className="cursor-pointer">
                      {selectedIds.length === students.length && students.length > 0 ? (
                        <CheckSquare className="h-4 w-4 text-[#F58220]" />
                      ) : (
                        <Square className="h-4 w-4 text-slate-400" />
                      )}
                    </button>
                  </th>
                  <th className="py-4 px-3">الطالب والحساب</th>
                  <th className="py-4 px-3">التواصل</th>
                  <th className="py-4 px-3">الصف والنظام</th>
                  <th className="py-4 px-3">الكورسات المكتملة</th>
                  <th className="py-4 px-3">مستوى XP والتفوق</th>
                  <th className="py-4 px-3">الحالة</th>
                  <th className="py-4 px-4 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5 font-medium">
                {students.map((s) => {
                  const isSelected = selectedIds.includes(s._id);
                  return (
                    <tr
                      key={s._id}
                      className={`hover:bg-slate-50/60 dark:hover:bg-white/[0.02] transition-colors ${
                        isSelected ? "bg-blue-50/50 dark:bg-white/5" : ""
                      }`}
                    >
                      <td className="py-4 px-4 text-center">
                        <button type="button" onClick={() => toggleSelectOne(s._id)}>
                          {isSelected ? (
                            <CheckSquare className="h-4 w-4 text-[#F58220]" />
                          ) : (
                            <Square className="h-4 w-4 text-slate-400" />
                          )}
                        </button>
                      </td>

                      {/* Student Info */}
                      <td className="py-4 px-3">
                        <div className="flex items-center gap-3">
                          {s.avatar ? (
                            <Image
                              src={s.avatar}
                              alt={s.fullName || "صورة الطالب"}
                              width={36}
                              height={36}
                              className="h-9 w-9 rounded-full object-cover border border-slate-200 dark:border-white/20"
                            />
                          ) : (
                            <div className="h-9 w-9 rounded-full bg-[#0B2D5B] text-white font-black flex items-center justify-center text-xs">
                              {s.fullName.charAt(0)}
                            </div>
                          )}
                          <div className="space-y-0.5">
                            <Link
                              href={`/admin/students/${s._id}`}
                              className="font-extrabold text-[#0B2D5B] dark:text-white hover:text-[#F58220] transition-colors block text-sm"
                            >
                              {s.fullName}
                            </Link>
                            <span className="text-[10px] text-slate-400">
                              تاريخ التسجيل: {new Date(s.createdAt).toLocaleDateString("ar-EG")}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="py-4 px-3 space-y-0.5">
                        <div className="font-bold text-slate-700 dark:text-slate-200 dir-ltr text-right">
                          {s.phone || "غير مدخل"}
                        </div>
                        <div className="text-[11px] text-slate-400 dir-ltr text-right truncate max-w-[160px]">
                          {s.email}
                        </div>
                      </td>

                      {/* Educational System & Grade */}
                      <td className="py-4 px-3 space-y-0.5">
                        <div className="font-bold text-[#0B2D5B] dark:text-white">
                          {s.grade}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {s.educationalSystem}
                        </div>
                      </td>

                      {/* Enrolled & Completed Courses */}
                      <td className="py-4 px-3 space-y-0.5">
                        <div className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1">
                          <BookOpen className="h-3.5 w-3.5 text-indigo-500" />
                          <span>{s.enrolledCoursesCount} كورس مسجل</span>
                        </div>
                        <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          <span>{s.completedCoursesCount} كورس مكتمل</span>
                        </div>
                      </td>

                      {/* XP & Level */}
                      <td className="py-4 px-3 space-y-0.5">
                        <div className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-600 px-2 py-0.5 rounded-full text-[11px] font-bold">
                          <Zap className="h-3 w-3 fill-amber-500 text-amber-500" />
                          <span>{s.xp} XP (المستوى {s.level})</span>
                        </div>
                        <div className="text-[10px] text-slate-400">
                          متوسط الاختبارات: <strong className="text-emerald-500">{s.averageQuizScore}%</strong>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-3">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black ${
                            s.isBlocked
                              ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                              : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                          }`}
                        >
                          {s.isBlocked ? (
                            <>
                              <Lock className="h-3.5 w-3.5" />
                              <span>مجمد</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              <span>نشط</span>
                            </>
                          )}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <Link
                            href={`/admin/students/${s._id}`}
                            className="p-2 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-200 hover:bg-[#0B2D5B] hover:text-white transition-colors"
                            title="عرض الملف الأكاديمي والتقرير الشامل"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>

                          {s.isBlocked ? (
                            <button
                              type="button"
                              onClick={() => activateMutation.mutate(s._id)}
                              disabled={activateMutation.isPending}
                              className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500 hover:text-white transition-colors"
                              title="إعادة تفعيل الحساب"
                            >
                              <CheckCircle2 className="h-4 w-4" />
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => suspendMutation.mutate(s._id)}
                              disabled={suspendMutation.isPending}
                              className="p-2 rounded-xl bg-rose-500/10 text-rose-600 hover:bg-rose-500 hover:text-white transition-colors"
                              title="تجميد الحساب"
                            >
                              <Lock className="h-4 w-4" />
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => setNotifyStudent(s)}
                            className="p-2 rounded-xl bg-purple-500/10 text-purple-600 hover:bg-purple-500 hover:text-white transition-colors"
                            title="إرسال إشعار مباشر"
                          >
                            <Send className="h-4 w-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => setResetPasswordStudent(s)}
                            className="p-2 rounded-xl bg-amber-500/10 text-amber-600 hover:bg-amber-500 hover:text-white transition-colors"
                            title="تغيير كلمة المرور"
                          >
                            <KeyRound className="h-4 w-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              if (confirm("هل أنت تأكد من نقل حساب الطالب إلى أرشيف المحذوفات؟")) {
                                deleteMutation.mutate(s._id);
                              }
                            }}
                            className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-400 hover:bg-rose-600 hover:text-white transition-colors"
                            title="حذف الحساب"
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
              عرض الصفحة {pagination.page} من أصل {pagination.totalPages} (إجمالي {pagination.total} طالب مسجل)
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

      {/* RESET PASSWORD MODAL */}
      <AnimatePresence>
        {resetPasswordStudent && (
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
              <div className="flex items-center gap-3 text-amber-500">
                <div className="h-10 w-10 rounded-2xl bg-amber-500/10 flex items-center justify-center">
                  <KeyRound className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-base font-black text-[#0B2D5B] dark:text-white">
                    إعادة تعيين كلمة المرور للطالب
                  </h3>
                  <p className="text-xs text-slate-500">{resetPasswordStudent.fullName}</p>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  كلمة المرور الجديدة *
                </label>
                <input
                  type="password"
                  value={newPasswordInput}
                  onChange={(e) => setNewPasswordInput(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-11 px-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs outline-none focus:border-amber-500 dir-ltr text-right"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  onClick={() => setResetPasswordStudent(null)}
                  variant="outline"
                  className="rounded-xl text-xs font-bold"
                >
                  إلغاء
                </Button>
                <Button
                  onClick={() => {
                    if (!newPasswordInput || newPasswordInput.length < 6) {
                      toast.error("كلمة المرور يجب أن لا تقل عن 6 أحرف");
                      return;
                    }
                    resetPasswordMutation.mutate({
                      id: resetPasswordStudent._id,
                      pass: newPasswordInput,
                    });
                  }}
                  disabled={resetPasswordMutation.isPending}
                  className="bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-extrabold"
                >
                  <span>تعيين كلمة المرور</span>
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* NOTIFY STUDENT MODAL */}
      <AnimatePresence>
        {notifyStudent && (
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
                  <Send className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-base font-black text-[#0B2D5B] dark:text-white">
                    إرسال إشعار مباشر للطالب
                  </h3>
                  <p className="text-xs text-slate-500">{notifyStudent.fullName}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    عنوان الإشعار *
                  </label>
                  <input
                    type="text"
                    value={notifTitle}
                    onChange={(e) => setNotifTitle(e.target.value)}
                    placeholder="تنبيه أكاديمي..."
                    className="w-full h-11 px-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs outline-none focus:border-purple-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    نص الإشعار *
                  </label>
                  <textarea
                    rows={3}
                    value={notifMessage}
                    onChange={(e) => setNotifMessage(e.target.value)}
                    placeholder="نتمنى لك التوفيق في اختبارك القادم..."
                    className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  onClick={() => setNotifyStudent(null)}
                  variant="outline"
                  className="rounded-xl text-xs font-bold"
                >
                  إلغاء
                </Button>
                <Button
                  onClick={() => {
                    if (!notifTitle.trim() || !notifMessage.trim()) {
                      toast.error("يرجى كتابة عنوان ورسالة الإشعار");
                      return;
                    }
                    sendNotifMutation.mutate({
                      id: notifyStudent._id,
                      title: notifTitle.trim(),
                      message: notifMessage.trim(),
                    });
                  }}
                  disabled={sendNotifMutation.isPending}
                  className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-extrabold gap-1.5"
                >
                  <Send className="h-4 w-4" />
                  <span>إرسال الإشعار</span>
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

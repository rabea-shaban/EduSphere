"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  BookOpen,
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
  Star,
  Sparkles,
  Users,
  Wallet,
  GraduationCap,
  Briefcase,
  PlayCircle,
  Archive,
  Layers,
  Send,
  MoreVertical,
} from "lucide-react";
import { toast } from "react-hot-toast";
import adminCourseService, { AdminCourseItem } from "@/services/adminCourse.service";
import { Button } from "@/components/ui/button";

export default function AdminCoursesPage() {
  const queryClient = useQueryClient();

  // Filters & State
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);
  const [statusFilter, setStatusFilter] = React.useState<string>("All");
  const [isFreeFilter, setIsFreeFilter] = React.useState<string>("All");
  const [isFeaturedFilter, setIsFeaturedFilter] = React.useState<string>("All");
  const [sortFilter, setSortFilter] = React.useState<string>("newest");
  const [searchTerm, setSearchTerm] = setSearchTermState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState<string>("");

  // Modals & Selection State
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [rejectCourseModal, setRejectCourseModal] = React.useState<AdminCourseItem | null>(null);
  const [rejectionReasonInput, setRejectionReasonInput] = React.useState("");

  // Helper setter for search term
  function setSearchTermState(val: string): [string, React.Dispatch<React.SetStateAction<string>>] {
    return React.useState(val);
  }

  // Debounce search
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Fetch Courses List
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: [
      "admin",
      "courses-list",
      page,
      limit,
      statusFilter,
      isFreeFilter,
      isFeaturedFilter,
      sortFilter,
      debouncedSearch,
    ],
    queryFn: () =>
      adminCourseService.getCourses({
        page,
        limit,
        status: statusFilter !== "All" ? statusFilter : undefined,
        isFree: isFreeFilter !== "All" ? isFreeFilter : undefined,
        isFeatured: isFeaturedFilter !== "All" ? isFeaturedFilter : undefined,
        sort: sortFilter,
        search: debouncedSearch.trim() || undefined,
      }),
  });

  const courses = data?.courses || [];
  const pagination = data?.pagination || { total: 0, page: 1, limit: 10, totalPages: 1 };

  // Approve Mutation
  const approveMutation = useMutation({
    mutationFn: (id: string) => adminCourseService.approveCourse(id),
    onSuccess: () => {
      toast.success("تمت الموافقة ونشر الكورس بنجاح.");
      queryClient.invalidateQueries({ queryKey: ["admin", "courses-list"] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "حدث خطأ أثناء القبول.");
    },
  });

  // Reject Mutation
  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      adminCourseService.rejectCourse(id, reason),
    onSuccess: () => {
      toast.success("تم تسجيل رفض الكورس وإبلاغ المحاضر بالسبب.");
      setRejectCourseModal(null);
      setRejectionReasonInput("");
      queryClient.invalidateQueries({ queryKey: ["admin", "courses-list"] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "حدث خطأ أثناء الرفض.");
    },
  });

  // Feature Toggle Mutation
  const featureMutation = useMutation({
    mutationFn: (id: string) => adminCourseService.toggleFeature(id),
    onSuccess: () => {
      toast.success("تم تحديث حالة تمييز الكورس بنجاح.");
      queryClient.invalidateQueries({ queryKey: ["admin", "courses-list"] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "حدث خطأ أثناء التحديث.");
    },
  });

  // Soft Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminCourseService.deleteCourse(id),
    onSuccess: () => {
      toast.success("تم نقل الكورس إلى أرشيف المحذوفات");
      queryClient.invalidateQueries({ queryKey: ["admin", "courses-list"] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "حدث خطأ أثناء الحذف.");
    },
  });

  // Selection Handlers
  const toggleSelectAll = () => {
    if (selectedIds.length === courses.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(courses.map((c) => c._id));
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
    const targetCourses = selectedIds.length > 0
      ? courses.filter((c) => selectedIds.includes(c._id))
      : courses;

    if (targetCourses.length === 0) {
      toast.error("لا يوجد كورسات للتصدير");
      return;
    }

    const headers = [
      "معرف الكورس",
      "عنوان الكورس",
      "المحاضر",
      "المادة والصف",
      "السعر",
      "نوع الاشتراك",
      "الحالة",
      "عدد المشتركين",
      "إجمالي الإيرادات",
      "التقييم",
      "تاريخ الإنشاء",
    ];

    const rows = targetCourses.map((c) => [
      c._id,
      `"${c.title}"`,
      `"${c.teacher.fullName}"`,
      `"${c.subjectName} - ${c.gradeName}"`,
      c.price,
      c.isFree ? "مجاني" : "مدفوع",
      c.status,
      c.enrollmentCount,
      c.revenue,
      c.rating,
      new Date(c.createdAt).toLocaleDateString("ar-EG"),
    ]);

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `platform_courses_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("تم تصدير ملف الكورسات بنجاح.");
  };

  return (
    <div className="space-y-6 text-right transition-colors" dir="rtl">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-[#0F274D] p-6 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-full text-xs font-black">
            <BookOpen className="h-4 w-4" />
            <span>نظام الإشراف واعتمد الكورسات والأعمال التعليمية</span>
          </div>
          <h1 className="text-2xl font-black text-[#0B2D5B] dark:text-white">
            دليل الكورسات والمناهج
          </h1>
          <p className="text-xs text-slate-500">
            مراجعة واعتمد الكورسات، تغيير الحالات، التمييز في الصفحة الرئيسية، والتحليل المالي.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            onClick={exportToCSV}
            variant="outline"
            className="rounded-xl border-slate-200 dark:border-white/10 text-xs font-bold gap-2"
          >
            <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
            <span>تصدير الكورسات (CSV)</span>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          
          {/* Search Input */}
          <div className="relative lg:col-span-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ابحث باسم الكورس، اسم المحاضر، المادة، أو معرف الكورس..."
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
              <option value="Published">منشور ومتاح</option>
              <option value="Draft">مسودة / قيد المراجعة</option>
              <option value="Archived">مؤرشف</option>
            </select>
          </div>

          {/* Pricing Filter */}
          <div className="space-y-1">
            <select
              value={isFreeFilter}
              onChange={(e) => {
                setIsFreeFilter(e.target.value);
                setPage(1);
              }}
              className="w-full h-11 px-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold outline-none focus:border-[#F58220]"
            >
              <option value="All">جميع التسعيرات</option>
              <option value="true">كورس مجاني</option>
              <option value="false">كورس مدفوع</option>
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
              <option value="newest">الأحدث إنشاءً</option>
              <option value="oldest">الأقدم إنشاءً</option>
              <option value="highest_revenue">الأعلى إيراداً</option>
              <option value="most_students">الأكثر اشتراكاً</option>
              <option value="highest_rating">الأعلى تقييماً</option>
              <option value="most_lessons">الأكثر دروساً</option>
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
              <span>تم تحديد {selectedIds.length} كورسات</span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                onClick={() => {
                  selectedIds.forEach((id) => approveMutation.mutate(id));
                  setSelectedIds([]);
                }}
                size="sm"
                className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-black gap-1.5"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>اعتماد ونشر المحدد ({selectedIds.length})</span>
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

      {/* Main Courses Data Table */}
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
            <p className="text-xs font-bold">فشل استرجاع دليل الكورسات</p>
          </div>
        ) : courses.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <BookOpen className="h-10 w-10 text-slate-300 mx-auto" />
            <p className="text-xs font-extrabold text-slate-500">لا توجد كورسات مطابقة لشروط الفحص الحالية</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 dark:bg-white/5 border-b border-slate-100 dark:border-white/10 text-slate-400 font-bold">
                <tr>
                  <th className="py-4 px-4 text-center">
                    <button type="button" onClick={toggleSelectAll} className="cursor-pointer">
                      {selectedIds.length === courses.length && courses.length > 0 ? (
                        <CheckSquare className="h-4 w-4 text-[#F58220]" />
                      ) : (
                        <Square className="h-4 w-4 text-slate-400" />
                      )}
                    </button>
                  </th>
                  <th className="py-4 px-3">الكورس والمادة</th>
                  <th className="py-4 px-3">المحاضر</th>
                  <th className="py-4 px-3">السعر والتسعيير</th>
                  <th className="py-4 px-3">المشتركين والدروس</th>
                  <th className="py-4 px-3">الإيرادات والتقييم</th>
                  <th className="py-4 px-3">الحالة والتميز</th>
                  <th className="py-4 px-4 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5 font-medium">
                {courses.map((c) => {
                  const isSelected = selectedIds.includes(c._id);
                  return (
                    <tr
                      key={c._id}
                      className={`hover:bg-slate-50/60 dark:hover:bg-white/[0.02] transition-colors ${
                        isSelected ? "bg-blue-50/50 dark:bg-white/5" : ""
                      }`}
                    >
                      <td className="py-4 px-4 text-center">
                        <button type="button" onClick={() => toggleSelectOne(c._id)}>
                          {isSelected ? (
                            <CheckSquare className="h-4 w-4 text-[#F58220]" />
                          ) : (
                            <Square className="h-4 w-4 text-slate-400" />
                          )}
                        </button>
                      </td>

                      {/* Course Title & Thumbnail */}
                      <td className="py-4 px-3">
                        <div className="flex items-center gap-3">
                          <div className="relative h-11 w-16 rounded-xl overflow-hidden bg-slate-200 dark:bg-white/10 shrink-0">
                            {c.thumbnail && (
                              <Image src={c.thumbnail} alt={c.title} fill className="object-cover" />
                            )}
                          </div>
                          <div className="space-y-0.5 max-w-[200px]">
                            <Link
                              href={`/admin/courses/${c._id}`}
                              className="font-extrabold text-[#0B2D5B] dark:text-white hover:text-[#F58220] transition-colors block text-xs line-clamp-1"
                              title={c.title}
                            >
                              {c.title}
                            </Link>
                            <span className="text-[10px] text-slate-400 block font-bold">
                              {c.subjectName} ({c.gradeName})
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Teacher Info */}
                      <td className="py-4 px-3 space-y-0.5">
                        <div className="font-bold text-slate-700 dark:text-slate-200">
                          {c.teacher?.fullName}
                        </div>
                        <div className="text-[10px] text-slate-400 dir-ltr text-right truncate max-w-[130px]">
                          {c.teacher?.email}
                        </div>
                      </td>

                      {/* Price */}
                      <td className="py-4 px-3">
                        {c.isFree ? (
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-extrabold text-[11px]">
                            مجاني
                          </span>
                        ) : (
                          <div className="font-mono font-black text-slate-800 dark:text-slate-100">
                            {c.price} ج.م
                          </div>
                        )}
                      </td>

                      {/* Enrollments & Lessons */}
                      <td className="py-4 px-3 space-y-0.5">
                        <div className="font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          <span>{c.enrollmentCount} طالب</span>
                        </div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Layers className="h-3 w-3" />
                          <span>{c.lessonsCount} درس ({c.unitsCount} وحدة)</span>
                        </div>
                      </td>

                      {/* Revenue & Rating */}
                      <td className="py-4 px-3 space-y-0.5">
                        <div className="font-mono font-black text-emerald-600 dark:text-emerald-400">
                          {c.revenue.toLocaleString()} ج.م
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-amber-500 font-bold">
                          <Star className="h-3 w-3 fill-amber-500" />
                          <span>{c.rating} ({c.reviewCount})</span>
                        </div>
                      </td>

                      {/* Status & Featured Badge */}
                      <td className="py-4 px-3 space-y-1">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                            c.status === "Published"
                              ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                              : "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                          }`}
                        >
                          {c.status === "Published" ? "منشور" : "مسودة"}
                        </span>

                        {c.isFeatured && (
                          <div className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-600 px-2 py-0.5 rounded-full text-[9px] font-black border border-amber-500/20 block w-fit">
                            <Sparkles className="h-2.5 w-2.5 fill-amber-500" />
                            <span>متميز</span>
                          </div>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <Link
                            href={`/admin/courses/${c._id}`}
                            className="p-2 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-200 hover:bg-[#0B2D5B] hover:text-white transition-colors"
                            title="معاينة تفاصيل المنهج والتحليلات"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>

                          {c.status !== "Published" ? (
                            <button
                              type="button"
                              onClick={() => approveMutation.mutate(c._id)}
                              disabled={approveMutation.isPending}
                              className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500 hover:text-white transition-colors"
                              title="اعتماد ونشر الكورس"
                            >
                              <CheckCircle2 className="h-4 w-4" />
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setRejectCourseModal(c)}
                              className="p-2 rounded-xl bg-rose-500/10 text-rose-600 hover:bg-rose-500 hover:text-white transition-colors"
                              title="رفض الكورس"
                            >
                              <XCircle className="h-4 w-4" />
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => featureMutation.mutate(c._id)}
                            disabled={featureMutation.isPending}
                            className={`p-2 rounded-xl transition-colors ${
                              c.isFeatured
                                ? "bg-amber-500 text-white"
                                : "bg-amber-500/10 text-amber-600 hover:bg-amber-500 hover:text-white"
                            }`}
                            title={c.isFeatured ? "إزالة التمييز" : "تمييز في الرئيسية"}
                          >
                            <Sparkles className="h-4 w-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              if (confirm("هل أنت تأكد من نقل الكورس إلى أرشيف المحذوفات؟")) {
                                deleteMutation.mutate(c._id);
                              }
                            }}
                            className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-400 hover:bg-rose-600 hover:text-white transition-colors"
                            title="حذف الكورس"
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
              عرض الصفحة {pagination.page} من أصل {pagination.totalPages} (إجمالي {pagination.total} كورس بالمنصة)
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

      {/* REJECT COURSE MODAL */}
      <AnimatePresence>
        {rejectCourseModal && (
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
                    تسجيل رفض نشر الكورس
                  </h3>
                  <p className="text-xs text-slate-500">{rejectCourseModal.title}</p>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  سبب الرفض المباشر (سيصل كإشعار للمحاضر) *
                </label>
                <textarea
                  rows={3}
                  value={rejectionReasonInput}
                  onChange={(e) => setRejectionReasonInput(e.target.value)}
                  placeholder="يرجى تحسين جودة الصوت في الدروس وإرفاق أوراق العمل المفصلة..."
                  className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  onClick={() => setRejectCourseModal(null)}
                  variant="outline"
                  className="rounded-xl text-xs font-bold"
                >
                  إلغاء
                </Button>
                <Button
                  onClick={() => {
                    if (!rejectionReasonInput.trim()) {
                      toast.error("يرجى كتابة سبب الرفض");
                      return;
                    }
                    rejectMutation.mutate({
                      id: rejectCourseModal._id,
                      reason: rejectionReasonInput.trim(),
                    });
                  }}
                  disabled={rejectMutation.isPending}
                  className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-extrabold"
                >
                  <span>تأكيد الرفض والإرجاع</span>
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

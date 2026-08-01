"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  FileCheck2,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  BookOpen,
  User,
  Award,
  RefreshCw,
  Eye,
  Trash2,
  Plus,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  ExternalLink,
  Layers,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { assignmentService } from "@/services/assignment.service";
import { Button } from "@/components/ui/button";
import type { ApiAssignment } from "@/features/teacher/types/assignment";

export default function AdminAssignmentsPage() {
  const queryClient = useQueryClient();

  // Filters & State
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);
  const [statusFilter, setStatusFilter] = React.useState<string>("All");
  const [searchTerm, setSearchTerm] = React.useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = React.useState<string>("");

  // Debounce search
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Fetch Assignments Data
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["admin", "assignments-list", page, limit, statusFilter, debouncedSearch],
    queryFn: () =>
      assignmentService.getAssignments({
        page,
        limit,
        status: statusFilter !== "All" ? (statusFilter as any) : undefined,
        search: debouncedSearch.trim() || undefined,
      }),
  });

  const assignments = data?.assignments || [];
  const pagination = data?.pagination || { total: 0, page: 1, limit: 10, totalPages: 1 };

  // Calculate quick metrics
  const totalCount = pagination.total || assignments.length;
  const publishedCount = assignments.filter((a) => a.status === "Published").length;
  const draftCount = assignments.filter((a) => a.status === "Draft").length;

  // Publish / Unpublish Mutation
  const togglePublishMutation = useMutation({
    mutationFn: async ({ id, isPublished }: { id: string; isPublished: boolean }) => {
      if (isPublished) {
        return assignmentService.unpublishAssignment(id);
      } else {
        return assignmentService.publishAssignment(id);
      }
    },
    onSuccess: () => {
      toast.success("تم تحديث حالة نشر الواجب بنجاح.");
      queryClient.invalidateQueries({ queryKey: ["admin", "assignments-list"] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "حدث خطأ أثناء تحديث حالة الواجب.");
    },
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => assignmentService.deleteAssignment(id),
    onSuccess: () => {
      toast.success("تم حذف الواجب بنجاح.");
      queryClient.invalidateQueries({ queryKey: ["admin", "assignments-list"] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "حدث خطأ أثناء حذف الواجب.");
    },
  });

  return (
    <div className="space-y-6 text-right transition-colors" dir="rtl">
      
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white dark:bg-[#0F274D] p-6 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm">
        <div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-[#0B2D5B] dark:bg-[#F58220] text-white flex items-center justify-center font-black">
              <FileCheck2 className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-[#0B2D5B] dark:text-white">
                إدارة الواجبات والمشاريع العملية
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                متابعة تسليمات مشاريع البرمجة وأوراق البحث ومراجعة تقييمات الطلاب عبر كافة الكورسات
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => refetch()}
            variant="outline"
            size="sm"
            className="rounded-xl border-slate-200 dark:border-white/10 text-xs font-bold gap-1.5"
          >
            <RefreshCw className="h-4 w-4 text-slate-500" />
            <span>تحديث البيانات</span>
          </Button>

          <Link href="/teacher/assignments">
            <Button className="bg-gradient-to-r from-[#0B2D5B] to-[#1E73D8] hover:from-[#1E73D8] hover:to-[#0B2D5B] text-white rounded-xl text-xs font-black gap-2 shadow-md">
              <Plus className="h-4 w-4" />
              <span>إضافة واجب جديد</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Cards Grid (4 Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Total Assignments */}
        <div className="bg-white dark:bg-[#0F274D] p-5 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>إجمالي الواجبات</span>
            <FileCheck2 className="h-4 w-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-black text-[#0B2D5B] dark:text-white font-mono">
            {totalCount}
          </div>
          <span className="text-[11px] text-slate-400 font-bold block">مشاريع وواجبات مسجلة</span>
        </div>

        {/* Card 2: Published Assignments */}
        <div className="bg-white dark:bg-[#0F274D] p-5 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>الواجبات المنشورة</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
            {publishedCount}
          </div>
          <span className="text-[11px] text-emerald-500 font-bold block">متاحة حالياً للطلاب</span>
        </div>

        {/* Card 3: Draft Assignments */}
        <div className="bg-white dark:bg-[#0F274D] p-5 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>المسودات المؤجلة</span>
            <Clock className="h-4 w-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400 font-mono">
            {draftCount}
          </div>
          <span className="text-[11px] text-amber-600 font-bold block">قيد التعديل أو المراجعة</span>
        </div>

        {/* Card 4: AI Grader Status */}
        <div className="bg-white dark:bg-[#0F274D] p-5 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>التقييم بالذكاء الاصطناعي</span>
            <Sparkles className="h-4 w-4 text-purple-500 animate-pulse" />
          </div>
          <div className="text-lg font-black text-purple-600 dark:text-purple-400">
            مفعل 100%
          </div>
          <span className="text-[11px] text-purple-500 font-bold block">AI Grader Engine Ready</span>
        </div>

      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-[#0F274D] p-4 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="h-4 w-4 absolute right-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="البحث باسم الواجب أو الكورس..."
            className="w-full h-11 pr-10 pl-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs outline-none focus:border-[#F58220] transition-colors"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="h-11 px-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold outline-none focus:border-[#F58220]"
            >
              <option value="All">جميع الحالات</option>
              <option value="Published">منشور ومفعل</option>
              <option value="Draft">مسودة</option>
              <option value="Archived">مؤرشف</option>
            </select>
          </div>
        </div>

      </div>

      {/* Data Table / List */}
      <div className="bg-white dark:bg-[#0F274D] rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-14 bg-slate-100 dark:bg-white/5 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : assignments.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <FileCheck2 className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto" />
            <h3 className="text-base font-black text-[#0B2D5B] dark:text-white">
              لا توجد واجبات أو مشاريع مسجلة حالياً
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              يمكنك إضافة واجب دراسي أو مشروع تنفيذي جديد من خلال زر الإضافة بأعلى الصفحة.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 dark:bg-white/5 text-slate-500 font-bold border-b border-slate-200/80 dark:border-white/10">
                <tr>
                  <th className="p-4">عنوان الواجب / المشروع</th>
                  <th className="p-4">الكورس التعليمي</th>
                  <th className="p-4">المعلم المسؤول</th>
                  <th className="p-4">الدرجات والتسليمات</th>
                  <th className="p-4">الحالة</th>
                  <th className="p-4">تاريخ الإضافة</th>
                  <th className="p-4 text-center">الإجراءات</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-white/5 font-medium">
                {assignments.map((item: ApiAssignment) => {
                  const courseObj: any = item.courseId || {};
                  const teacherObj: any = item.teacherId || {};
                  const courseTitle = typeof courseObj === "object" ? courseObj.title : "كورس محدد";
                  const teacherName =
                    typeof teacherObj === "object"
                      ? `${teacherObj.firstName || ""} ${teacherObj.lastName || ""}`.trim() || teacherObj.email
                      : "معلم مخصص";

                  const isPublished = item.status === "Published";

                  return (
                    <tr
                      key={item._id}
                      className="hover:bg-slate-50/80 dark:hover:bg-white/5 transition-colors"
                    >
                      {/* Assignment Title */}
                      <td className="p-4">
                        <div className="space-y-1">
                          <div className="font-black text-[#0B2D5B] dark:text-white text-sm flex items-center gap-2">
                            <span>{item.title}</span>
                          </div>
                          {item.description && (
                            <p className="text-[11px] text-slate-400 line-clamp-1">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Course */}
                      <td className="p-4">
                        <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-200 font-bold">
                          <BookOpen className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                          <span>{courseTitle}</span>
                        </div>
                      </td>

                      {/* Teacher */}
                      <td className="p-4">
                        <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-semibold">
                          <User className="h-3.5 w-3.5 text-[#F58220] shrink-0" />
                          <span>{teacherName}</span>
                        </div>
                      </td>

                      {/* Marks & Submissions */}
                      <td className="p-4">
                        <div className="space-y-0.5">
                          <div className="font-bold text-slate-700 dark:text-slate-200">
                            الدرجة: <strong className="text-emerald-600">{item.totalMarks || 100} نقطة</strong>
                          </div>
                          <div className="text-[11px] text-slate-400">
                            درجة النجاح: {item.passingMarks || 50}
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full text-[11px] font-black inline-flex items-center gap-1.5 ${
                            isPublished
                              ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                              : "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                          }`}
                        >
                          {isPublished ? (
                            <>
                              <CheckCircle2 className="h-3 w-3" />
                              <span>منشور ومفعل</span>
                            </>
                          ) : (
                            <>
                              <Clock className="h-3 w-3" />
                              <span>مسودة</span>
                            </>
                          )}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="p-4 text-slate-500 text-[11px]">
                        {item.createdAt ? new Date(item.createdAt).toLocaleDateString("ar-EG") : "—"}
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            onClick={() =>
                              togglePublishMutation.mutate({ id: item._id, isPublished })
                            }
                            disabled={togglePublishMutation.isPending}
                            variant="ghost"
                            size="sm"
                            className={`rounded-xl text-xs font-bold gap-1 ${
                              isPublished ? "text-amber-600 hover:bg-amber-50" : "text-emerald-600 hover:bg-emerald-50"
                            }`}
                            title={isPublished ? "تحويل لمسودة" : "نشر الواجب للطلاب"}
                          >
                            {isPublished ? "إلغاء النشر" : "نشر الآن"}
                          </Button>

                          <Button
                            onClick={() => {
                              if (confirm("هل أنت تأكد من نقل الواجب لرسل المحذوفات؟")) {
                                deleteMutation.mutate(item._id);
                              }
                            }}
                            variant="ghost"
                            size="icon"
                            className="text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl"
                            title="حذف الواجب"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
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
          <div className="p-4 border-t border-slate-200/80 dark:border-white/10 flex items-center justify-between text-xs font-bold text-slate-500">
            <span>
              صفحة {pagination.page} من {pagination.totalPages} (إجمالي {pagination.total} واجب)
            </span>
            <div className="flex items-center gap-2">
              <Button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                variant="outline"
                size="sm"
                className="rounded-xl gap-1 text-xs"
              >
                <ChevronRight className="h-4 w-4" />
                <span>السابق</span>
              </Button>
              <Button
                disabled={page >= pagination.totalPages}
                onClick={() => setPage((p) => p + 1)}
                variant="outline"
                size="sm"
                className="rounded-xl gap-1 text-xs"
              >
                <span>التالي</span>
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}

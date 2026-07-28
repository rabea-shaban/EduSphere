"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FolderTree,
  Plus,
  Edit2,
  Trash2,
  BookOpen,
  Search,
  CheckCircle2,
  XCircle,
  Eye,
  RefreshCw,
  Sparkles,
  Layers,
  GraduationCap,
  AlertTriangle,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import {
  useGrades,
  useCreateGrade,
  useUpdateGrade,
  useDeleteGrade,
  useToggleGradeStatus,
} from "@/hooks/useAcademic";
import {
  AcademicGrade,
  EducationStageType,
  CreateGradeDTO,
} from "@/services/academic.service";
import { CreateEditGradeModal } from "@/features/admin/components/academic/CreateEditGradeModal";
import { GradeDetailsModal } from "@/features/admin/components/academic/GradeDetailsModal";

const STAGE_FILTERS = [
  { id: "ALL", label: "جميع المسارات" },
  { id: "Secondary", label: "المرحلة الثانوية (عام)" },
  { id: "Azhar", label: "التعليم الأزهري الشريف" },
  { id: "Baccalaureate", label: "نظام البكالوريا الجديد" },
  { id: "ComputerScience", label: "علوم الحاسب والتكنولوجيا" },
  { id: "Preparatory", label: "المرحلة الإعدادية" },
  { id: "Primary", label: "المرحلة الابتدائية" },
];

const STAGE_THEMES: Record<string, { title: string; gradient: string; badge: string }> = {
  Secondary: {
    title: "المرحلة الثانوية (عام)",
    gradient: "from-blue-600 to-indigo-600",
    badge: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/40",
  },
  Azhar: {
    title: "التعليم الأزهري الشريف",
    gradient: "from-emerald-600 to-teal-600",
    badge: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/40",
  },
  Baccalaureate: {
    title: "نظام البكالوريا الجديد",
    gradient: "from-amber-600 to-orange-600",
    badge: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/40",
  },
  ComputerScience: {
    title: "علوم الحاسب والتكنولوجيا",
    gradient: "from-[#0B2D5B] to-[#1E73D8]",
    badge: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-900/40",
  },
  Preparatory: {
    title: "المرحلة الإعدادية",
    gradient: "from-sky-600 to-cyan-600",
    badge: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-200 dark:border-sky-900/40",
  },
  Primary: {
    title: "المرحلة الابتدائية",
    gradient: "from-rose-600 to-pink-600",
    badge: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900/40",
  },
};

export default function AdminAcademicPage() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedStage, setSelectedStage] = React.useState<string>("ALL");

  // Modals state
  const [isCreateEditOpen, setIsCreateEditOpen] = React.useState(false);
  const [editingGrade, setEditingGrade] = React.useState<AcademicGrade | null>(null);
  const [detailsGrade, setDetailsGrade] = React.useState<AcademicGrade | null>(null);
  const [deletingGradeId, setDeletingGradeId] = React.useState<string | null>(null);

  // Queries & Mutations
  const { data, isLoading, isError, error, refetch } = useGrades({
    search: searchTerm,
    educationStage: selectedStage !== "ALL" ? selectedStage : undefined,
  });

  const createGradeMutation = useCreateGrade();
  const updateGradeMutation = useUpdateGrade();
  const deleteGradeMutation = useDeleteGrade();
  const toggleStatusMutation = useToggleGradeStatus();

  const grades = data?.grades || [];

  const handleOpenCreate = () => {
    setEditingGrade(null);
    setIsCreateEditOpen(true);
  };

  const handleOpenEdit = (grade: AcademicGrade) => {
    setEditingGrade(grade);
    setIsCreateEditOpen(true);
  };

  const handleCreateOrUpdate = (formData: CreateGradeDTO) => {
    if (editingGrade) {
      updateGradeMutation.mutate(
        { id: editingGrade._id, data: formData },
        {
          onSuccess: () => setIsCreateEditOpen(false),
        }
      );
    } else {
      createGradeMutation.mutate(formData, {
        onSuccess: () => setIsCreateEditOpen(false),
      });
    }
  };

  const handleDelete = (id: string) => {
    deleteGradeMutation.mutate(id, {
      onSuccess: () => setDeletingGradeId(null),
    });
  };

  return (
    <div className="space-y-8 text-right transition-colors" dir="rtl">
      {/* ========================================================== */}
      {/* 1. HERO HEADER BANNER */}
      {/* ========================================================== */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#0B2D5B] via-[#071C3B] to-[#1E73D8] text-white shadow-2xl overflow-hidden">
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-[#F58220]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-[#F58220]/20 border border-[#F58220]/40 text-[#F58220] px-3.5 py-1 rounded-full text-xs font-black">
              <GraduationCap className="h-4 w-4" />
              <span>منظومة المسارات الدراسية والمناهج الأكاديمية</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-snug">
              المراحل والمنظومة الأكاديمية
            </h1>

            <p className="text-xs sm:text-sm text-blue-100/90 font-medium">
              إدارة مسارات التعليم العام، الأزهر الشريف، البكالوريا، ومسار علوم الحاسب والتكنولوجيا بالتكامل مع المناهج والمواد
            </p>
          </div>

          <Button
            onClick={handleOpenCreate}
            className="h-12 px-6 rounded-2xl bg-gradient-to-r from-[#F58220] to-[#FF9A2A] hover:from-[#FF9A2A] hover:to-[#F58220] text-white text-xs font-black flex items-center gap-2 shadow-xl shadow-[#F58220]/20 transform hover:-translate-y-0.5 transition-transform"
          >
            <Plus className="h-5 w-5" />
            <span>إضافة مسار جديد</span>
          </Button>
        </div>
      </div>

      {/* ========================================================== */}
      {/* 2. FILTERS & SEARCH ACTION BAR */}
      {/* ========================================================== */}
      <div className="bg-white dark:bg-[#0F274D] p-5 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="البحث باسم الصف أو التخصص الأكاديمي..."
              className="w-full h-11 pr-10 pl-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs outline-none focus:border-[#F58220]"
            />
            <Search className="h-4 w-4 text-slate-400 absolute right-3.5 top-3.5 pointer-events-none" />
          </div>

          {/* Refresh Button */}
          <Button
            onClick={() => refetch()}
            variant="outline"
            size="sm"
            className="rounded-2xl text-xs font-bold gap-2 self-end md:self-auto"
          >
            <RefreshCw className="h-4 w-4" />
            <span>تحديث البيانات</span>
          </Button>
        </div>

        {/* Stage Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-bold">
          {STAGE_FILTERS.map((stg) => {
            const isSelected = selectedStage === stg.id;
            return (
              <button
                key={stg.id}
                onClick={() => setSelectedStage(stg.id)}
                className={`px-4 py-2 rounded-2xl whitespace-nowrap transition-all ${
                  isSelected
                    ? "bg-[#0B2D5B] text-white dark:bg-[#1E73D8] shadow-md"
                    : "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                }`}
              >
                {stg.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================== */}
      {/* 3. DYNAMIC ACADEMIC TRACKS GRID */}
      {/* ========================================================== */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-56 rounded-3xl bg-slate-200 dark:bg-white/10 animate-pulse"
            />
          ))}
        </div>
      ) : isError ? (
        <div className="p-12 text-center bg-white dark:bg-[#0F274D] rounded-3xl border border-rose-200 dark:border-rose-900/40 shadow-xl space-y-4">
          <AlertTriangle className="h-10 w-10 text-rose-500 mx-auto" />
          <h3 className="text-base font-black text-[#0B2D5B] dark:text-white">
            فشل تحميل بيانات المسارات الأكاديمية
          </h3>
          <p className="text-xs text-slate-500">
            {error instanceof Error ? error.message : "يرجى التأكد من اتصال الخادم وإعادة المحاولة."}
          </p>
          <Button onClick={() => refetch()} className="bg-[#0B2D5B] text-white rounded-xl text-xs font-bold">
            إعادة المحاولة
          </Button>
        </div>
      ) : grades.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-[#0F274D] rounded-3xl border border-slate-200 dark:border-white/10 shadow-sm space-y-3">
          <FolderTree className="h-10 w-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-[#0B2D5B] dark:text-white">
            لا توجد صفوف أو مسارات أكاديمية حالياً
          </h3>
          <p className="text-xs text-slate-400">
            قم بإضافة مسار دراسي جديد للبدء في تنظيم المواد والمناهج
          </p>
          <Button onClick={handleOpenCreate} className="bg-[#F58220] text-white rounded-xl text-xs font-bold">
            إضافة أول مسار
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {grades.map((grade) => {
            const theme = STAGE_THEMES[grade.educationStage] || {
              title: grade.educationStage,
              gradient: "from-blue-600 to-indigo-600",
              badge: "bg-blue-500/10 text-blue-600 border-blue-200",
            };

            return (
              <motion.div
                key={grade._id}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="rounded-3xl p-6 bg-white dark:bg-[#0F274D] border border-slate-200/80 dark:border-white/10 shadow-sm space-y-5 text-right hover:shadow-xl transition-all flex flex-col justify-between"
              >
                {/* Header Badge & Title */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-[11px] font-extrabold border ${theme.badge}`}
                    >
                      {theme.title}
                    </span>

                    {/* Active Status Switch */}
                    <button
                      onClick={() =>
                        toggleStatusMutation.mutate({
                          id: grade._id,
                          isActive: !grade.isActive,
                        })
                      }
                      title={grade.isActive ? "تعطيل الصف" : "تفعيل الصف"}
                      className={`h-6 w-11 rounded-full p-0.5 transition-colors relative ${
                        grade.isActive ? "bg-emerald-500" : "bg-slate-300 dark:bg-white/20"
                      }`}
                    >
                      <div
                        className={`h-5 w-5 rounded-full bg-white shadow-md transform transition-transform ${
                          grade.isActive ? "translate-x-0" : "-translate-x-5"
                        }`}
                      />
                    </button>
                  </div>

                  <div>
                    <h3 className="text-lg font-black text-[#0B2D5B] dark:text-white">
                      {grade.name.ar}
                    </h3>
                    <span className="text-xs font-bold text-slate-400 block font-mono">
                      {grade.name.en}
                    </span>
                  </div>

                  {grade.description && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {grade.description}
                    </p>
                  )}
                </div>

                {/* Progress & Stats Bar */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-300">
                    <span className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4 text-[#F58220]" />
                      <span>المواد والكوورسات</span>
                    </span>
                    <span className="font-mono text-emerald-600 dark:text-emerald-400">
                      {grade.subjectsCount || 0} مواد • {grade.coursesCount || 0} كورس
                    </span>
                  </div>

                  <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden">
                    <div className={`h-full bg-gradient-to-r ${theme.gradient} w-3/4`} />
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="pt-4 border-t border-slate-100 dark:border-white/10 flex items-center justify-between gap-2">
                  <Button
                    onClick={() => setDetailsGrade(grade)}
                    variant="outline"
                    size="sm"
                    className="rounded-xl text-xs font-bold gap-1 text-slate-600 dark:text-slate-300 hover:text-[#0B2D5B]"
                  >
                    <Eye className="h-3.5 w-3.5 text-[#1E73D8]" />
                    <span>التفاصيل</span>
                  </Button>

                  <div className="flex items-center gap-1.5">
                    <Button
                      onClick={() => handleOpenEdit(grade)}
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-xl border-slate-200 dark:border-white/10 hover:border-amber-500 text-amber-600"
                      title="تعديل"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </Button>

                    <Button
                      onClick={() => setDeletingGradeId(grade._id)}
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-xl border-slate-200 dark:border-white/10 hover:border-rose-500 text-rose-600"
                      title="حذف"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* ========================================================== */}
      {/* MODALS */}
      {/* ========================================================== */}
      <CreateEditGradeModal
        isOpen={isCreateEditOpen}
        onClose={() => setIsCreateEditOpen(false)}
        onSubmit={handleCreateOrUpdate}
        isLoading={createGradeMutation.isPending || updateGradeMutation.isPending}
        initialGrade={editingGrade}
      />

      <GradeDetailsModal
        grade={detailsGrade}
        onClose={() => setDetailsGrade(null)}
      />

      {/* DELETE CONFIRM MODAL */}
      <AnimatePresence>
        {deletingGradeId && (
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
              <div className="flex items-center gap-3 text-rose-500">
                <div className="h-10 w-10 rounded-2xl bg-rose-500/10 flex items-center justify-center">
                  <Trash2 className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-base font-black text-[#0B2D5B] dark:text-white">
                    حذف المسار الأكاديمي
                  </h3>
                  <p className="text-xs text-slate-500">هل أنت تأكد من رغبتك في حذف هذا الصف؟</p>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                تنبيه: حذف هذا المسار سيلغي ارتباط المواد الدراسية المسجلة تحته.
              </p>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  onClick={() => setDeletingGradeId(null)}
                  variant="outline"
                  className="rounded-xl text-xs font-bold"
                >
                  إلغاء
                </Button>
                <Button
                  onClick={() => handleDelete(deletingGradeId)}
                  disabled={deleteGradeMutation.isPending}
                  className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-extrabold"
                >
                  حذف الآن
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

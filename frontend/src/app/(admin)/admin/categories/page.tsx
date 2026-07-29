"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Layers,
  BookOpen,
  GraduationCap,
  Plus,
  Trash2,
  Edit,
  CheckCircle2,
  XCircle,
  Search,
  RefreshCw,
  AlertCircle,
  FileSpreadsheet,
  Palette,
  Sparkles,
  Building2,
  Globe,
  Tag,
} from "lucide-react";
import { toast } from "react-hot-toast";
import adminCategoryService, {
  CategoryItem,
  SubjectItem,
  GradeItem,
} from "@/services/adminCategory.service";
import { Button } from "@/components/ui/button";
import { queryKeys, handleApiError } from "@/lib/react-query";

export default function AdminCategoriesPage() {
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = React.useState<"subjects" | "grades" | "categories" | "systems">("subjects");
  const [searchTerm, setSearchTerm] = React.useState("");

  // Modals state
  const [subjectModalOpen, setSubjectModalOpen] = React.useState(false);
  const [editingSubject, setEditingSubject] = React.useState<SubjectItem | null>(null);
  const [subjName, setSubjName] = React.useState("");
  const [subjDesc, setSubjDesc] = React.useState("");
  const [subjStage, setSubjStage] = React.useState("Secondary");
  const [subjColor, setSubjColor] = React.useState("#F58220");

  const [gradeModalOpen, setGradeModalOpen] = React.useState(false);
  const [editingGrade, setEditingGrade] = React.useState<GradeItem | null>(null);
  const [gradeNameAr, setGradeNameAr] = React.useState("");
  const [gradeNameEn, setGradeNameEn] = React.useState("");
  const [gradeOrder, setGradeOrder] = React.useState(1);

  const [catModalOpen, setCatModalOpen] = React.useState(false);
  const [editingCat, setEditingCat] = React.useState<CategoryItem | null>(null);
  const [catName, setCatName] = React.useState("");
  const [catDesc, setCatDesc] = React.useState("");

  // Queries
  const { data: subjects = [], isLoading: loadingSubjects } = useQuery({
    queryKey: queryKeys.admin.subjects(),
    queryFn: () => adminCategoryService.getSubjects(),
    staleTime: 1000 * 60 * 5,
  });

  const { data: grades = [], isLoading: loadingGrades } = useQuery({
    queryKey: queryKeys.admin.grades(),
    queryFn: () => adminCategoryService.getGrades(),
    staleTime: 1000 * 60 * 5,
  });

  const { data: categories = [], isLoading: loadingCategories } = useQuery({
    queryKey: queryKeys.admin.categories(),
    queryFn: () => adminCategoryService.getCategories(),
    staleTime: 1000 * 60 * 5,
  });

  // Subject Mutations
  const saveSubjectMutation = useMutation({
    mutationFn: (data: any) =>
      editingSubject
        ? adminCategoryService.updateSubject(editingSubject._id, data)
        : adminCategoryService.createSubject(data),
    onSuccess: () => {
      toast.success(editingSubject ? "تم تحديث المادة بنجاح" : "تم إضافة المادة الدراسية بنجاح.");
      setSubjectModalOpen(false);
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.subjects() });
    },
    onError: (err: any) => {
      handleApiError(err, "حدث خطأ أثناء الحفظ.");
    },
  });

  const deleteSubjectMutation = useMutation({
    mutationFn: (id: string) => adminCategoryService.deleteSubject(id),
    onSuccess: () => {
      toast.success("تم حذف المادة بنجاح");
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.subjects() });
    },
    onError: (err: any) => {
      handleApiError(err, "تعذر الحذف لارتباط المادة بكورسات حالية.");
    },
  });

  // Grade Mutations
  const saveGradeMutation = useMutation({
    mutationFn: (data: any) =>
      editingGrade
        ? adminCategoryService.updateGrade(editingGrade._id, data)
        : adminCategoryService.createGrade(data),
    onSuccess: () => {
      toast.success(editingGrade ? "تم تحديث الصف بنجاح" : "تم إضافة الصف الدراسي بنجاح.");
      setGradeModalOpen(false);
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.grades() });
    },
    onError: (err: any) => {
      handleApiError(err, "حدث خطأ أثناء الحفظ.");
    },
  });

  const deleteGradeMutation = useMutation({
    mutationFn: (id: string) => adminCategoryService.deleteGrade(id),
    onSuccess: () => {
      toast.success("تم حذف الصف بنجاح");
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.grades() });
    },
    onError: (err: any) => {
      handleApiError(err, "تعذر الحذف لارتباط الصف بكورسات مسجلة.");
    },
  });

  // Category Mutations
  const saveCatMutation = useMutation({
    mutationFn: (data: any) =>
      editingCat
        ? adminCategoryService.updateCategory(editingCat._id, data)
        : adminCategoryService.createCategory(data),
    onSuccess: () => {
      toast.success(editingCat ? "تم تحديث التصنيف بنجاح" : "تم إضافة التصنيف بنجاح.");
      setCatModalOpen(false);
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.categories() });
    },
    onError: (err: any) => {
      handleApiError(err, "حدث خطأ أثناء الحفظ.");
    },
  });

  const deleteCatMutation = useMutation({
    mutationFn: (id: string) => adminCategoryService.deleteCategory(id),
    onSuccess: () => {
      toast.success("تم حذف التصنيف بنجاح");
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.categories() });
    },
    onError: (err: any) => {
      handleApiError(err, "تعذر الحذف لارتباطه بكورسات حالية.");
    },
  });

  return (
    <div className="space-y-6 text-right transition-colors" dir="rtl">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-[#0F274D] p-6 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 bg-[#F58220]/10 text-[#F58220] px-3 py-1 rounded-full text-xs font-black">
            <Layers className="h-4 w-4" />
            <span>إدارة الهيكل التعليمي والمناهج الدراسية</span>
          </div>
          <h1 className="text-2xl font-black text-[#0B2D5B] dark:text-white">
            المواد، الصفوف والتصنيفات
          </h1>
          <p className="text-xs text-slate-500">
            التحكم في الهيكل الأكاديمي، إضافة المواد الدراسية، ترتيب الصفوف والتصنيفات العامة.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === "subjects" && (
            <Button
              onClick={() => {
                setEditingSubject(null);
                setSubjName("");
                setSubjDesc("");
                setSubjStage("Secondary");
                setSubjectModalOpen(true);
              }}
              className="bg-[#0B2D5B] hover:bg-[#1E73D8] text-white rounded-xl text-xs font-bold gap-1.5"
            >
              <Plus className="h-4 w-4" />
              <span>إضافة مادة دراسية جديدة</span>
            </Button>
          )}

          {activeTab === "grades" && (
            <Button
              onClick={() => {
                setEditingGrade(null);
                setGradeNameAr("");
                setGradeNameEn("");
                setGradeOrder(grades.length + 1);
                setGradeModalOpen(true);
              }}
              className="bg-[#0B2D5B] hover:bg-[#1E73D8] text-white rounded-xl text-xs font-bold gap-1.5"
            >
              <Plus className="h-4 w-4" />
              <span>إضافة صف دراسي جديد</span>
            </Button>
          )}

          {activeTab === "categories" && (
            <Button
              onClick={() => {
                setEditingCat(null);
                setCatName("");
                setCatDesc("");
                setCatModalOpen(true);
              }}
              className="bg-[#0B2D5B] hover:bg-[#1E73D8] text-white rounded-xl text-xs font-bold gap-1.5"
            >
              <Plus className="h-4 w-4" />
              <span>إضافة تصنيف جديد</span>
            </Button>
          )}
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex border-b border-slate-200 dark:border-white/10 text-xs font-black gap-6">
        <button
          type="button"
          onClick={() => setActiveTab("subjects")}
          className={`pb-3 border-b-2 transition-all cursor-pointer ${
            activeTab === "subjects"
              ? "border-[#F58220] text-[#F58220]"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          المواد الدراسية ({subjects.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("grades")}
          className={`pb-3 border-b-2 transition-all cursor-pointer ${
            activeTab === "grades"
              ? "border-[#F58220] text-[#F58220]"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          الصفوف الدراسية ({grades.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("categories")}
          className={`pb-3 border-b-2 transition-all cursor-pointer ${
            activeTab === "categories"
              ? "border-[#F58220] text-[#F58220]"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          تصنيفات الكورسات ({categories.length})
        </button>
      </div>

      {/* TAB 1: SUBJECTS */}
      {activeTab === "subjects" && (
        <div className="bg-white dark:bg-[#0F274D] p-6 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm space-y-4">
          {loadingSubjects ? (
            <div className="p-8 space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-16 w-full bg-slate-100 dark:bg-white/5 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : subjects.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-slate-200 dark:border-white/10 rounded-2xl space-y-2">
              <BookOpen className="h-8 w-8 text-slate-300 mx-auto" />
              <p className="text-xs font-bold text-slate-400">لا توجد مواد دراسية مسجلة حالياً</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {subjects.map((s) => (
                <div
                  key={s._id}
                  className="p-5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: s.color || "#F58220" }}
                        />
                        <h3 className="font-extrabold text-[#0B2D5B] dark:text-white text-base">
                          {s.name}
                        </h3>
                      </div>
                      <span className="text-[10px] font-bold text-purple-600 bg-purple-500/10 px-2.5 py-0.5 rounded-full">
                        {s.educationStage}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                      {s.description || "مادة دراسية ضمن مناهج المنصة المعالجة."}
                    </p>

                    <div className="flex items-center justify-between text-xs font-bold text-slate-400 pt-2 border-t border-slate-200/50 dark:border-white/5">
                      <span>{s.coursesCount} كورس</span>
                      <span>{s.teachersCount} معلم</span>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-slate-200/50 dark:border-white/5">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingSubject(s);
                        setSubjName(s.name);
                        setSubjDesc(s.description || "");
                        setSubjStage(s.educationStage || "Secondary");
                        setSubjColor(s.color || "#F58220");
                        setSubjectModalOpen(true);
                      }}
                      className="p-2 rounded-xl bg-slate-200/70 dark:bg-white/10 text-slate-700 dark:text-slate-200 hover:bg-[#0B2D5B] hover:text-white transition-colors"
                      title="تعديل"
                    >
                      <Edit className="h-4 w-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`هل أنت تأكد من حذف المادة (${s.name})؟`)) {
                          deleteSubjectMutation.mutate(s._id);
                        }
                      }}
                      className="p-2 rounded-xl bg-rose-500/10 text-rose-600 hover:bg-rose-600 hover:text-white transition-colors"
                      title="حذف"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: GRADES */}
      {activeTab === "grades" && (
        <div className="bg-white dark:bg-[#0F274D] p-6 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm space-y-4">
          {loadingGrades ? (
            <div className="p-8 space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-16 w-full bg-slate-100 dark:bg-white/5 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : grades.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-slate-200 dark:border-white/10 rounded-2xl space-y-2">
              <GraduationCap className="h-8 w-8 text-slate-300 mx-auto" />
              <p className="text-xs font-bold text-slate-400">لا توجد صفوف دراسية مسجلة حالياً</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {grades.map((g) => (
                <div
                  key={g._id}
                  className="p-5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-extrabold text-[#0B2D5B] dark:text-white text-base">
                        {g.nameAr}
                      </h3>
                      <span className="text-[11px] font-mono font-bold text-[#F58220] bg-[#F58220]/10 px-2.5 py-0.5 rounded-full">
                        الترتيب #{g.order}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 font-mono">
                      English: {g.nameEn}
                    </p>

                    <div className="flex items-center justify-between text-xs font-bold text-slate-400 pt-2 border-t border-slate-200/50 dark:border-white/5">
                      <span>{g.coursesCount} كورس</span>
                      <span>{g.studentsCount} طالب</span>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-slate-200/50 dark:border-white/5">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingGrade(g);
                        setGradeNameAr(g.nameAr);
                        setGradeNameEn(g.nameEn);
                        setGradeOrder(g.order);
                        setGradeModalOpen(true);
                      }}
                      className="p-2 rounded-xl bg-slate-200/70 dark:bg-white/10 text-slate-700 dark:text-slate-200 hover:bg-[#0B2D5B] hover:text-white transition-colors"
                      title="تعديل"
                    >
                      <Edit className="h-4 w-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`هل أنت تأكد من حذف الصف الدراسي (${g.nameAr})؟`)) {
                          deleteGradeMutation.mutate(g._id);
                        }
                      }}
                      className="p-2 rounded-xl bg-rose-500/10 text-rose-600 hover:bg-rose-600 hover:text-white transition-colors"
                      title="حذف"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: CATEGORIES */}
      {activeTab === "categories" && (
        <div className="bg-white dark:bg-[#0F274D] p-6 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm space-y-4">
          {loadingCategories ? (
            <div className="p-8 space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-16 w-full bg-slate-100 dark:bg-white/5 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : categories.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-slate-200 dark:border-white/10 rounded-2xl space-y-2">
              <Tag className="h-8 w-8 text-slate-300 mx-auto" />
              <p className="text-xs font-bold text-slate-400">لا توجد تصنيفات كورسات مسجلة حالياً</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((c) => (
                <div
                  key={c._id}
                  className="p-5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-extrabold text-[#0B2D5B] dark:text-white text-base">
                        {c.name}
                      </h3>
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
                        {c.type}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 leading-relaxed">
                      {c.description || "تصنيف تعليمي عام للكورسات والأقسام."}
                    </p>

                    <div className="text-xs font-bold text-slate-400 pt-2 border-t border-slate-200/50 dark:border-white/5">
                      <span>{c.coursesCount} كورس مرتبطة</span>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-slate-200/50 dark:border-white/5">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingCat(c);
                        setCatName(c.name);
                        setCatDesc(c.description || "");
                        setCatModalOpen(true);
                      }}
                      className="p-2 rounded-xl bg-slate-200/70 dark:bg-white/10 text-slate-700 dark:text-slate-200 hover:bg-[#0B2D5B] hover:text-white transition-colors"
                      title="تعديل"
                    >
                      <Edit className="h-4 w-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`هل أنت تأكد من حذف التصنيف (${c.name})؟`)) {
                          deleteCatMutation.mutate(c._id);
                        }
                      }}
                      className="p-2 rounded-xl bg-rose-500/10 text-rose-600 hover:bg-rose-600 hover:text-white transition-colors"
                      title="حذف"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SUBJECT MODAL */}
      <AnimatePresence>
        {subjectModalOpen && (
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
                {editingSubject ? "تعديل المادة الدراسية" : "إضافة مادة دراسية جديدة"}
              </h3>

              <div className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">اسم المادة *</label>
                  <input
                    type="text"
                    value={subjName}
                    onChange={(e) => setSubjName(e.target.value)}
                    placeholder="مثال: الفيزياء، الرياضيات، الأحياء..."
                    className="w-full h-11 px-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 outline-none focus:border-[#F58220]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">المرحلة الدراسية *</label>
                  <select
                    value={subjStage}
                    onChange={(e) => setSubjStage(e.target.value)}
                    className="w-full h-11 px-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 outline-none focus:border-[#F58220]"
                  >
                    <option value="Primary">المرحلة الابتدائية</option>
                    <option value="Preparatory">المرحلة الإعدادية</option>
                    <option value="Secondary">المرحلة الثانوية</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">الوصف المختصر</label>
                  <textarea
                    rows={2}
                    value={subjDesc}
                    onChange={(e) => setSubjDesc(e.target.value)}
                    placeholder="وصف المادة والصفوف الموجهة لها..."
                    className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 outline-none focus:border-[#F58220]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  onClick={() => setSubjectModalOpen(false)}
                  variant="outline"
                  className="rounded-xl text-xs font-bold"
                >
                  إلغاء
                </Button>
                <Button
                  onClick={() => {
                    if (!subjName.trim()) {
                      toast.error("يرجى كتابة اسم المادة الدراسية");
                      return;
                    }
                    saveSubjectMutation.mutate({
                      name: subjName.trim(),
                      description: subjDesc.trim(),
                      educationStage: subjStage,
                      color: subjColor,
                    });
                  }}
                  disabled={saveSubjectMutation.isPending}
                  className="bg-[#0B2D5B] hover:bg-[#1E73D8] text-white rounded-xl text-xs font-extrabold"
                >
                  <span>حفظ المادة</span>
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* GRADE MODAL */}
      <AnimatePresence>
        {gradeModalOpen && (
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
                {editingGrade ? "تعديل الصف الدراسي" : "إضافة صف دراسي جديد"}
              </h3>

              <div className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">الاسم بالعربي *</label>
                  <input
                    type="text"
                    value={gradeNameAr}
                    onChange={(e) => setGradeNameAr(e.target.value)}
                    placeholder="مثال: الصف الثالث الثانوي..."
                    className="w-full h-11 px-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 outline-none focus:border-[#F58220]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">الاسم بالإنجليزي *</label>
                  <input
                    type="text"
                    value={gradeNameEn}
                    onChange={(e) => setGradeNameEn(e.target.value)}
                    placeholder="Grade 12 / Senior High..."
                    className="w-full h-11 px-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 outline-none focus:border-[#F58220] dir-ltr text-right"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">الترتيب الرقمي *</label>
                  <input
                    type="number"
                    value={gradeOrder}
                    onChange={(e) => setGradeOrder(Number(e.target.value))}
                    className="w-full h-11 px-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 outline-none focus:border-[#F58220]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  onClick={() => setGradeModalOpen(false)}
                  variant="outline"
                  className="rounded-xl text-xs font-bold"
                >
                  إلغاء
                </Button>
                <Button
                  onClick={() => {
                    if (!gradeNameAr.trim() || !gradeNameEn.trim()) {
                      toast.error("يرجى كتابة اسم الصف بالعربي والإنجليزي");
                      return;
                    }
                    saveGradeMutation.mutate({
                      nameAr: gradeNameAr.trim(),
                      nameEn: gradeNameEn.trim(),
                      order: gradeOrder,
                    });
                  }}
                  disabled={saveGradeMutation.isPending}
                  className="bg-[#0B2D5B] hover:bg-[#1E73D8] text-white rounded-xl text-xs font-extrabold"
                >
                  <span>حفظ الصف</span>
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CATEGORY MODAL */}
      <AnimatePresence>
        {catModalOpen && (
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
                {editingCat ? "تعديل التصنيف" : "إضافة تصنيف جديد"}
              </h3>

              <div className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">اسم التصنيف *</label>
                  <input
                    type="text"
                    value={catName}
                    onChange={(e) => setCatName(e.target.value)}
                    placeholder="مثال: البرمجة والذكاء الاصطناعي..."
                    className="w-full h-11 px-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 outline-none focus:border-[#F58220]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">الوصف</label>
                  <textarea
                    rows={2}
                    value={catDesc}
                    onChange={(e) => setCatDesc(e.target.value)}
                    placeholder="وصف مختصر لأقسام هذا التصنيف..."
                    className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 outline-none focus:border-[#F58220]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  onClick={() => setCatModalOpen(false)}
                  variant="outline"
                  className="rounded-xl text-xs font-bold"
                >
                  إلغاء
                </Button>
                <Button
                  onClick={() => {
                    if (!catName.trim()) {
                      toast.error("يرجى كتابة اسم التصنيف");
                      return;
                    }
                    saveCatMutation.mutate({
                      name: catName.trim(),
                      description: catDesc.trim(),
                    });
                  }}
                  disabled={saveCatMutation.isPending}
                  className="bg-[#0B2D5B] hover:bg-[#1E73D8] text-white rounded-xl text-xs font-extrabold"
                >
                  <span>حفظ التصنيف</span>
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save, GraduationCap, Layers, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AcademicGrade,
  EducationStageType,
  CreateGradeDTO,
} from "@/services/academic.service";

interface CreateEditGradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateGradeDTO) => void;
  isLoading: boolean;
  initialGrade?: AcademicGrade | null;
}

export function CreateEditGradeModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  initialGrade,
}: CreateEditGradeModalProps) {
  const [nameAr, setNameAr] = React.useState("");
  const [nameEn, setNameEn] = React.useState("");
  const [order, setOrder] = React.useState<number | string>("");
  const [educationStage, setEducationStage] = React.useState<EducationStageType>("Secondary");
  const [description, setDescription] = React.useState("");
  const [isActive, setIsActive] = React.useState(true);

  React.useEffect(() => {
    if (initialGrade) {
      setNameAr(initialGrade.name?.ar || "");
      setNameEn(initialGrade.name?.en || "");
      setOrder(initialGrade.order ?? "");
      setEducationStage(initialGrade.educationStage || "Secondary");
      setDescription(initialGrade.description || "");
      setIsActive(initialGrade.isActive ?? true);
    } else {
      setNameAr("");
      setNameEn("");
      setOrder("");
      setEducationStage("Secondary");
      setDescription("");
      setIsActive(true);
    }
  }, [initialGrade, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameAr.trim() || !nameEn.trim()) return;

    onSubmit({
      name: { ar: nameAr.trim(), en: nameEn.trim() },
      order: order !== "" && order !== undefined ? Number(order) : (undefined as any),
      educationStage,
      description: description.trim(),
      isActive,
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            className="bg-white dark:bg-[#0F274D] p-6 sm:p-8 rounded-3xl max-w-lg w-full border border-slate-200 dark:border-white/10 shadow-2xl space-y-6 text-right"
            dir="rtl"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-[#F58220]/10 text-[#F58220] flex items-center justify-center font-bold">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-[#0B2D5B] dark:text-white">
                    {initialGrade ? "تعديل المسار / الصف الأكاديمي" : "إضافة مسار أو صف دراسي جديد"}
                  </h3>
                  <p className="text-xs text-slate-400">
                    أدخل بيانات الصف والترتيب والمرحلة التعليمية بدقة
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="h-8 w-8 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Arabic Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  الاسم باللغة العربية *
                </label>
                <input
                  type="text"
                  required
                  value={nameAr}
                  onChange={(e) => setNameAr(e.target.value)}
                  placeholder="مثال: الصف الثالث الثانوي العام"
                  className="w-full h-11 px-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs outline-none focus:border-[#F58220]"
                />
              </div>

              {/* English Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  الاسم باللغة الإنجليزية *
                </label>
                <input
                  type="text"
                  required
                  value={nameEn}
                  onChange={(e) => setNameEn(e.target.value)}
                  placeholder="e.g. 3rd Secondary Grade"
                  className="w-full h-11 px-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs outline-none focus:border-[#F58220] dir-ltr text-right"
                />
              </div>

              {/* Education Stage & Order Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    المرحلة / المسار *
                  </label>
                  <select
                    value={educationStage}
                    onChange={(e) => setEducationStage(e.target.value as EducationStageType)}
                    className="w-full h-11 px-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs outline-none focus:border-[#F58220]"
                  >
                    <option value="Secondary">المرحلة الثانوية (عام)</option>
                    <option value="Azhar">التعليم الأزهري الشريف</option>
                    <option value="Baccalaureate">نظام البكالوريا الجديد</option>
                    <option value="ComputerScience">مسار علوم الحاسب والتكنولوجيا</option>
                    <option value="Preparatory">المرحلة الإعدادية</option>
                    <option value="Primary">المرحلة الابتدائية</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    ترتيب العرض (Order) <span className="text-amber-500 font-normal text-[10px]">(تلقائي)</span>
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={order}
                    onChange={(e) => setOrder(e.target.value)}
                    placeholder="تلقائي حسب الأحدث (اختياري)"
                    className="w-full h-11 px-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs outline-none focus:border-[#F58220]"
                  />
                  <span className="text-[10px] text-slate-400 font-medium block">
                    ✨ يُحسب الترتيب تلقائياً حسب تاريخ الإضافة إذا تُرِك فارغاً
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  وصف مختصر للمسار
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="وصف الإسهامات والمقررات المشمولة في هذا الصف..."
                  className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs outline-none focus:border-[#F58220]"
                />
              </div>

              {/* Active Toggle */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/10">
                <span className="text-xs font-extrabold text-[#0B2D5B] dark:text-white">
                  حالة التفعيل الأكاديمي المباشر
                </span>
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="h-5 w-5 accent-[#F58220] rounded cursor-pointer"
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  onClick={onClose}
                  variant="outline"
                  className="rounded-2xl text-xs font-bold"
                >
                  إلغاء
                </Button>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-gradient-to-r from-[#0B2D5B] to-[#1E73D8] hover:from-[#1E73D8] hover:to-[#0B2D5B] text-white rounded-2xl text-xs font-black gap-2 shadow-lg"
                >
                  <Save className="h-4 w-4" />
                  <span>{initialGrade ? "حفظ التغيرات" : "إضافة المسار"}</span>
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

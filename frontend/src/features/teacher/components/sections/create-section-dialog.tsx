"use client";

import * as React from "react";
import { X, Loader2, Layers } from "lucide-react";
import { useCreateSection } from "@/hooks/useSections";
import type { CreateSectionInput, SectionStatus, SectionVisibility, CompletionRule } from "@/features/teacher/types/section";

interface CreateSectionDialogProps {
  courseId: string;
  isOpen: boolean;
  onClose: () => void;
}

const STATUS_OPTIONS: { value: SectionStatus; label: string }[] = [
  { value: "Draft", label: "مسودة" },
  { value: "Published", label: "منشور" },
  { value: "Hidden", label: "مخفي" },
];

const VISIBILITY_OPTIONS: { value: SectionVisibility; label: string }[] = [
  { value: "Enrolled", label: "للمشتركين فقط" },
  { value: "Public", label: "عام للجميع" },
  { value: "Private", label: "خاص (غير مرئي)" },
];

const COMPLETION_OPTIONS: { value: CompletionRule; label: string }[] = [
  { value: "AllLessons", label: "إتمام جميع الدروس" },
  { value: "MinimumLessons", label: "الحد الأدنى من الدروس" },
  { value: "AnyLesson", label: "أي درس واحد" },
];

export function CreateSectionDialog({ courseId, isOpen, onClose }: CreateSectionDialogProps) {
  const createSection = useCreateSection(courseId);

  const [form, setForm] = React.useState<CreateSectionInput>({
    title: "",
    description: "",
    status: "Draft",
    visibility: "Enrolled",
    estimatedDuration: 0,
    completionRule: "AllLessons",
    minimumLessonsRequired: 0,
  });

  const [errors, setErrors] = React.useState<Partial<Record<keyof CreateSectionInput, string>>>({});

  const reset = React.useCallback(() => {
    setForm({
      title: "",
      description: "",
      status: "Draft",
      visibility: "Enrolled",
      estimatedDuration: 0,
      completionRule: "AllLessons",
      minimumLessonsRequired: 0,
    });
    setErrors({});
  }, []);

  React.useEffect(() => {
    if (!isOpen) reset();
  }, [isOpen, reset]);

  const validate = (): boolean => {
    const newErrors: typeof errors = {};
    if (!form.title.trim()) newErrors.title = "عنوان القسم مطلوب";
    else if (form.title.trim().length < 2) newErrors.title = "العنوان يجب أن يكون حرفين على الأقل";
    if (form.estimatedDuration && form.estimatedDuration < 0)
      newErrors.estimatedDuration = "المدة يجب أن تكون موجبة";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const payload: CreateSectionInput = {
      ...form,
      title: form.title.trim(),
      description: form.description?.trim() || undefined,
      estimatedDuration: Number(form.estimatedDuration) || 0,
      minimumLessonsRequired: Number(form.minimumLessonsRequired) || 0,
    };

    await createSection.mutateAsync(payload);
    onClose();
  };

  const handleChange = <K extends keyof CreateSectionInput>(
    key: K,
    value: CreateSectionInput[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="إنشاء قسم جديد"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative w-full max-w-lg bg-white dark:bg-[#0B2D5B] rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-white/10">
          <div className="flex items-center gap-3">
            <span className="h-10 w-10 rounded-xl bg-[#F58220]/10 flex items-center justify-center">
              <Layers className="h-5 w-5 text-[#F58220]" />
            </span>
            <div>
              <h2 className="text-base font-black text-[#0B2D5B] dark:text-white">
                إضافة قسم جديد
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                أدخل تفاصيل القسم الجديد
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 transition-colors cursor-pointer"
            aria-label="إغلاق"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto text-right">
          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-700 dark:text-slate-200">
              عنوان القسم <span className="text-rose-500">*</span>
            </label>
            <input
              id="section-title"
              type="text"
              value={form.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="مثال: الوحدة الأولى - المفاهيم الأساسية"
              className={`w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-white/5 border text-sm font-semibold outline-none transition-colors ${
                errors.title
                  ? "border-rose-400 focus:border-rose-500"
                  : "border-slate-200 dark:border-white/10 focus:border-[#F58220]"
              }`}
              aria-invalid={!!errors.title}
              aria-describedby={errors.title ? "title-error" : undefined}
            />
            {errors.title && (
              <p id="title-error" className="text-xs text-rose-500 font-semibold">
                {errors.title}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-700 dark:text-slate-200">
              وصف القسم (اختياري)
            </label>
            <textarea
              id="section-description"
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="وصف مختصر لمحتوى هذا القسم وأهدافه التعليمية..."
              rows={3}
              className="w-full p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm font-semibold outline-none focus:border-[#F58220] transition-colors resize-none"
            />
          </div>

          {/* Status & Visibility row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-700 dark:text-slate-200">
                الحالة
              </label>
              <select
                id="section-status"
                value={form.status}
                onChange={(e) => handleChange("status", e.target.value as SectionStatus)}
                className="w-full h-11 px-3 rounded-xl bg-slate-50 dark:bg-white/5 dark:bg-[#0B2D5B] border border-slate-200 dark:border-white/10 text-xs font-bold outline-none focus:border-[#F58220] cursor-pointer"
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-700 dark:text-slate-200">
                إمكانية الوصول
              </label>
              <select
                id="section-visibility"
                value={form.visibility}
                onChange={(e) => handleChange("visibility", e.target.value as SectionVisibility)}
                className="w-full h-11 px-3 rounded-xl bg-slate-50 dark:bg-white/5 dark:bg-[#0B2D5B] border border-slate-200 dark:border-white/10 text-xs font-bold outline-none focus:border-[#F58220] cursor-pointer"
              >
                {VISIBILITY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Estimated Duration */}
          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-700 dark:text-slate-200">
              المدة التقديرية (بالدقائق)
            </label>
            <input
              id="section-duration"
              type="number"
              min={0}
              value={form.estimatedDuration}
              onChange={(e) => handleChange("estimatedDuration", Number(e.target.value))}
              placeholder="0"
              className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm font-semibold outline-none focus:border-[#F58220] transition-colors"
            />
          </div>

          {/* Completion Rule */}
          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-700 dark:text-slate-200">
              شرط إتمام القسم
            </label>
            <select
              id="section-completion-rule"
              value={form.completionRule}
              onChange={(e) => handleChange("completionRule", e.target.value as CompletionRule)}
              className="w-full h-11 px-3 rounded-xl bg-slate-50 dark:bg-white/5 dark:bg-[#0B2D5B] border border-slate-200 dark:border-white/10 text-xs font-bold outline-none focus:border-[#F58220] cursor-pointer"
            >
              {COMPLETION_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Minimum lessons (if MinimumLessons selected) */}
          {form.completionRule === "MinimumLessons" && (
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-700 dark:text-slate-200">
                الحد الأدنى من الدروس المطلوبة
              </label>
              <input
                type="number"
                min={1}
                value={form.minimumLessonsRequired}
                onChange={(e) => handleChange("minimumLessonsRequired", Number(e.target.value))}
                className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm font-semibold outline-none focus:border-[#F58220] transition-colors"
              />
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 p-6 border-t border-slate-100 dark:border-white/10">
          <button
            type="button"
            onClick={onClose}
            className="px-5 h-11 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-200 dark:hover:bg-white/20 transition-colors cursor-pointer"
          >
            إلغاء
          </button>
          <button
            type="submit"
            form="create-section-form"
            onClick={handleSubmit}
            disabled={createSection.isPending}
            className="flex-1 h-11 rounded-2xl bg-gradient-to-r from-[#F58220] to-[#FF9A2A] hover:from-[#e57518] hover:to-[#f08d1f] text-white text-xs font-black flex items-center justify-center gap-2 shadow-lg shadow-[#F58220]/20 transition-all cursor-pointer disabled:opacity-50"
          >
            {createSection.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>جاري الإنشاء...</span>
              </>
            ) : (
              <>
                <Layers className="h-4 w-4" />
                <span>إنشاء القسم</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateSectionDialog;

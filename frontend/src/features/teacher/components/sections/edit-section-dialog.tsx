"use client";

import * as React from "react";
import { X, Loader2, Save } from "lucide-react";
import { useUpdateSection } from "@/hooks/useSections";
import type {
  ApiSection,
  UpdateSectionInput,
  SectionStatus,
  SectionVisibility,
  CompletionRule,
} from "@/features/teacher/types/section";

interface EditSectionDialogProps {
  courseId: string;
  section: ApiSection | null;
  isOpen: boolean;
  onClose: () => void;
}

const STATUS_OPTIONS: { value: SectionStatus; label: string }[] = [
  { value: "Draft", label: "مسودة" },
  { value: "Published", label: "منشور" },
  { value: "Hidden", label: "مخفي" },
  { value: "Archived", label: "مؤرشف" },
];

const VISIBILITY_OPTIONS: { value: SectionVisibility; label: string }[] = [
  { value: "Enrolled", label: "للمشتركين فقط" },
  { value: "Public", label: "عام للجميع" },
  { value: "Private", label: "خاص" },
];

const COMPLETION_OPTIONS: { value: CompletionRule; label: string }[] = [
  { value: "AllLessons", label: "إتمام جميع الدروس" },
  { value: "MinimumLessons", label: "الحد الأدنى من الدروس" },
  { value: "AnyLesson", label: "أي درس واحد" },
];

export function EditSectionDialog({ courseId, section, isOpen, onClose }: EditSectionDialogProps) {
  const updateSection = useUpdateSection(courseId);

  const [form, setForm] = React.useState<UpdateSectionInput>({});
  const [errors, setErrors] = React.useState<Partial<Record<keyof UpdateSectionInput, string>>>({});

  // Populate form when section changes
  React.useEffect(() => {
    if (section) {
      setForm({
        title: section.title,
        description: section.description || "",
        status: section.status,
        visibility: section.visibility,
        estimatedDuration: section.estimatedDuration,
        completionRule: section.completionRule,
        minimumLessonsRequired: section.minimumLessonsRequired,
      });
      setErrors({});
    }
  }, [section]);

  const validate = (): boolean => {
    const newErrors: typeof errors = {};
    if (!form.title?.trim()) newErrors.title = "عنوان القسم مطلوب";
    else if ((form.title?.trim().length || 0) < 2)
      newErrors.title = "العنوان يجب أن يكون حرفين على الأقل";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!section || !validate()) return;

    const payload: UpdateSectionInput = {
      ...form,
      title: form.title?.trim(),
      description: form.description?.trim() || undefined,
      estimatedDuration: Number(form.estimatedDuration) || 0,
      minimumLessonsRequired: Number(form.minimumLessonsRequired) || 0,
    };

    await updateSection.mutateAsync({ id: section._id, data: payload });
    onClose();
  };

  const handleChange = <K extends keyof UpdateSectionInput>(
    key: K,
    value: UpdateSectionInput[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  if (!isOpen || !section) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="تعديل القسم"
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-white dark:bg-[#0B2D5B] rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-white/10">
          <div>
            <h2 className="text-base font-black text-[#0B2D5B] dark:text-white">
              تعديل القسم
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-xs">
              {section.title}
            </p>
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
              type="text"
              value={form.title || ""}
              onChange={(e) => handleChange("title", e.target.value)}
              className={`w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-white/5 border text-sm font-semibold outline-none transition-colors ${
                errors.title
                  ? "border-rose-400 focus:border-rose-500"
                  : "border-slate-200 dark:border-white/10 focus:border-[#F58220]"
              }`}
            />
            {errors.title && (
              <p className="text-xs text-rose-500 font-semibold">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-700 dark:text-slate-200">
              وصف القسم (اختياري)
            </label>
            <textarea
              value={form.description || ""}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={3}
              className="w-full p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm font-semibold outline-none focus:border-[#F58220] transition-colors resize-none"
            />
          </div>

          {/* Status & Visibility */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-700 dark:text-slate-200">الحالة</label>
              <select
                value={form.status || "Draft"}
                onChange={(e) => handleChange("status", e.target.value as SectionStatus)}
                className="w-full h-11 px-3 rounded-xl bg-slate-50 dark:bg-white/5 dark:bg-[#0B2D5B] border border-slate-200 dark:border-white/10 text-xs font-bold outline-none cursor-pointer"
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-700 dark:text-slate-200">إمكانية الوصول</label>
              <select
                value={form.visibility || "Enrolled"}
                onChange={(e) => handleChange("visibility", e.target.value as SectionVisibility)}
                className="w-full h-11 px-3 rounded-xl bg-slate-50 dark:bg-white/5 dark:bg-[#0B2D5B] border border-slate-200 dark:border-white/10 text-xs font-bold outline-none cursor-pointer"
              >
                {VISIBILITY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
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
              type="number"
              min={0}
              value={form.estimatedDuration || 0}
              onChange={(e) => handleChange("estimatedDuration", Number(e.target.value))}
              className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm font-semibold outline-none focus:border-[#F58220] transition-colors"
            />
          </div>

          {/* Completion Rule */}
          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-700 dark:text-slate-200">
              شرط إتمام القسم
            </label>
            <select
              value={form.completionRule || "AllLessons"}
              onChange={(e) => handleChange("completionRule", e.target.value as CompletionRule)}
              className="w-full h-11 px-3 rounded-xl bg-slate-50 dark:bg-white/5 dark:bg-[#0B2D5B] border border-slate-200 dark:border-white/10 text-xs font-bold outline-none cursor-pointer"
            >
              {COMPLETION_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {form.completionRule === "MinimumLessons" && (
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-700 dark:text-slate-200">
                الحد الأدنى من الدروس
              </label>
              <input
                type="number"
                min={1}
                value={form.minimumLessonsRequired || 0}
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
            type="button"
            onClick={handleSubmit}
            disabled={updateSection.isPending}
            className="flex-1 h-11 rounded-2xl bg-gradient-to-r from-[#F58220] to-[#FF9A2A] hover:from-[#e57518] hover:to-[#f08d1f] text-white text-xs font-black flex items-center justify-center gap-2 shadow-lg shadow-[#F58220]/20 transition-all cursor-pointer disabled:opacity-50"
          >
            {updateSection.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>جاري الحفظ...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>حفظ التعديلات</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditSectionDialog;

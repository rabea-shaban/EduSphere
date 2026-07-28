"use client";

import * as React from "react";
import { X, Loader2, Save } from "lucide-react";
import { useUpdateAssignment } from "@/hooks/useAssignments";
import type { ApiAssignment, UpdateAssignmentInput, SubmissionType } from "@/features/teacher/types/assignment";

interface EditAssignmentDialogProps {
  assignment: ApiAssignment | null;
  isOpen: boolean;
  onClose: () => void;
}

const SUBMISSION_TYPES: { value: SubmissionType; label: string }[] = [
  { value: "FileUpload", label: "رفع ملفات (مختلف الصيغ)" },
  { value: "PDFUpload", label: "رفع ملف PDF حصراً" },
  { value: "ImageUpload", label: "رفع صور" },
  { value: "ZIPUpload", label: "رفع ملف مضغوط ZIP/RAR" },
  { value: "TextSubmission", label: "إجابة نصية مباشرة" },
  { value: "ExternalUrl", label: "رابط خارجي / مشروع (GitHub/Figma)" },
  { value: "MultipleAttachments", label: "مرفقات متعددة شاملة" },
];

export function EditAssignmentDialog({ assignment, isOpen, onClose }: EditAssignmentDialogProps) {
  const updateAssignment = useUpdateAssignment();

  const [form, setForm] = React.useState<UpdateAssignmentInput>({});
  const [errors, setErrors] = React.useState<Partial<Record<keyof UpdateAssignmentInput, string>>>({});

  React.useEffect(() => {
    if (assignment) {
      setForm({
        title: assignment.title,
        description: assignment.description || "",
        instructions: assignment.instructions || "",
        dueDate: assignment.dueDate ? new Date(assignment.dueDate).toISOString().split("T")[0] : "",
        totalMarks: assignment.totalMarks,
        passingMarks: assignment.passingMarks,
        submissionType: assignment.submissionType,
        maxFileSizeMB: assignment.maxFileSizeMB,
        maxFiles: assignment.maxFiles,
        maxAttempts: assignment.maxAttempts,
        allowLateSubmission: assignment.allowLateSubmission,
        status: assignment.status,
      });
      setErrors({});
    }
  }, [assignment]);

  const validate = (): boolean => {
    const newErrors: typeof errors = {};
    if (!form.title?.trim()) newErrors.title = "عنوان الواجب مطلوب";
    if (!form.dueDate?.trim()) newErrors.dueDate = "تاريخ التسليم مطلوب";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignment || !validate()) return;

    const payload: UpdateAssignmentInput = {
      ...form,
      title: form.title?.trim(),
      description: form.description?.trim() || undefined,
      instructions: form.instructions?.trim() || undefined,
      totalMarks: Number(form.totalMarks) || 100,
      passingMarks: Number(form.passingMarks) || 60,
    };

    await updateAssignment.mutateAsync({ id: assignment._id, data: payload });
    onClose();
  };

  const handleChange = <K extends keyof UpdateAssignmentInput>(
    key: K,
    value: UpdateAssignmentInput[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  if (!isOpen || !assignment) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-xl bg-white dark:bg-[#0B2D5B] rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-white/10">
          <div>
            <h2 className="text-base font-black text-[#0B2D5B] dark:text-white">
              تعديل إعدادات الواجب التطبيقي
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-xs">
              {assignment.title}
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto text-right">
          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-700 dark:text-slate-200">
              عنوان الواجب <span className="text-rose-500">*</span>
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
              الوصف والتعليمات
            </label>
            <textarea
              value={form.description || ""}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={2}
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none focus:border-[#F58220] resize-none"
            />
          </div>

          {/* Submission Type & Due Date Row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-700 dark:text-slate-200">
                نوع التسليم
              </label>
              <select
                value={form.submissionType || "FileUpload"}
                onChange={(e) => handleChange("submissionType", e.target.value as SubmissionType)}
                className="w-full h-11 px-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold outline-none cursor-pointer"
              >
                {SUBMISSION_TYPES.map((st) => (
                  <option key={st.value} value={st.value}>
                    {st.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-700 dark:text-slate-200">
                آخر موعد للتسليم
              </label>
              <input
                type="date"
                value={form.dueDate || ""}
                onChange={(e) => handleChange("dueDate", e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm font-semibold outline-none focus:border-[#F58220]"
              />
            </div>
          </div>

          {/* Marks & Attempts Row */}
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-700 dark:text-slate-200">
                الدرجة الكلية
              </label>
              <input
                type="number"
                min={0}
                value={form.totalMarks || 100}
                onChange={(e) => handleChange("totalMarks", Number(e.target.value))}
                className="w-full h-11 px-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm font-semibold outline-none focus:border-[#F58220]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-700 dark:text-slate-200">
                درجة النجاح
              </label>
              <input
                type="number"
                min={0}
                value={form.passingMarks || 60}
                onChange={(e) => handleChange("passingMarks", Number(e.target.value))}
                className="w-full h-11 px-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm font-semibold outline-none focus:border-[#F58220]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-700 dark:text-slate-200">
                المحاولات المتاحة
              </label>
              <input
                type="number"
                min={0}
                value={form.maxAttempts || 1}
                onChange={(e) => handleChange("maxAttempts", Number(e.target.value))}
                className="w-full h-11 px-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm font-semibold outline-none focus:border-[#F58220]"
              />
            </div>
          </div>

          {/* Late Submission Toggle */}
          <div className="pt-2 border-t border-slate-100 dark:border-white/5">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="edit-allow-late"
                checked={Boolean(form.allowLateSubmission)}
                onChange={(e) => handleChange("allowLateSubmission", e.target.checked)}
                className="h-4 w-4 rounded text-[#F58220] focus:ring-[#F58220]"
              />
              <label htmlFor="edit-allow-late" className="text-xs font-bold text-slate-700 dark:text-slate-200 cursor-pointer">
                السماح بالتسليم المتأخر بعد الموعد النهائي ⏰
              </label>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 p-6 border-t border-slate-100 dark:border-white/10">
          <button
            type="button"
            onClick={onClose}
            className="px-5 h-11 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-200 transition-colors cursor-pointer"
          >
            إلغاء
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={updateAssignment.isPending}
            className="flex-1 h-11 rounded-xl bg-gradient-to-r from-[#0B2D5B] to-[#1E73D8] text-white text-xs font-black flex items-center justify-center gap-2 hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50"
          >
            {updateAssignment.isPending ? (
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

export default EditAssignmentDialog;

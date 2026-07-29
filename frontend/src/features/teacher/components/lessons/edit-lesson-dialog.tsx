"use client";

import * as React from "react";
import { X, Loader2, Save } from "lucide-react";
import { useUpdateLesson } from "@/hooks/useLessons";
import type {
  ApiLesson,
  UpdateLessonInput,
  LessonType,
  LessonStatus,
  LessonVisibility,
  CompletionRequirement,
} from "@/features/teacher/types/lesson";

interface EditLessonDialogProps {
  sectionId?: string;
  lesson: ApiLesson | null;
  isOpen: boolean;
  onClose: () => void;
}

const LESSON_TYPES: { value: LessonType; label: string }[] = [
  { value: "Video", label: "فيديو" },
  { value: "Article", label: "مقال نصي" },
  { value: "Live", label: "بث مباشر" },
  { value: "PDF", label: "ملف PDF" },
  { value: "Resource", label: "رابط / مصدر خارجي" },
  { value: "Interactive", label: "محتوى تفاعلي" },
  { value: "Quiz", label: "اختبار تقييمي" },
  { value: "Assignment", label: "واجب دراسي" },
];

const STATUS_OPTIONS: { value: LessonStatus; label: string }[] = [
  { value: "Published", label: "منشور" },
  { value: "Draft", label: "مسودة" },
  { value: "Scheduled", label: "مجدول" },
  { value: "Hidden", label: "مخفي" },
  { value: "Archived", label: "مؤرشف" },
];

const VISIBILITY_OPTIONS: { value: LessonVisibility; label: string }[] = [
  { value: "Enrolled", label: "للمشتركين فقط" },
  { value: "Public", label: "عام للجميع" },
  { value: "Private", label: "خاص" },
];

const COMPLETION_OPTIONS: { value: CompletionRequirement; label: string }[] = [
  { value: "Watch75", label: "مشاهدة 75% من الفيديو" },
  { value: "Watch100", label: "مشاهدة الفيديو بالكامل 100%" },
  { value: "PassQuiz", label: "اجتياز الاختبار التابع" },
  { value: "SubmitAssignment", label: "تسليم الواجب المطلوب" },
  { value: "Manual", label: "تأكيد يدوي من الطالب" },
];

export function EditLessonDialog({ sectionId, lesson, isOpen, onClose }: EditLessonDialogProps) {
  const updateLesson = useUpdateLesson(sectionId);

  const [form, setForm] = React.useState<UpdateLessonInput>({});
  const [errors, setErrors] = React.useState<Partial<Record<keyof UpdateLessonInput, string>>>({});

  React.useEffect(() => {
    if (lesson) {
      setForm({
        title: lesson.title,
        description: lesson.description || "",
        shortDescription: lesson.shortDescription || "",
        content: lesson.content || "",
        lessonType: lesson.lessonType,
        status: lesson.status,
        visibility: lesson.visibility,
        duration: lesson.duration,
        estimatedStudyTime: lesson.estimatedStudyTime || 0,
        isPreview: lesson.isPreview,
        videoUrl: lesson.videoUrl || "",
        attachmentUrl: lesson.attachmentUrl || "",
        completionRequirement: lesson.completionRequirement || "Watch75",
      });
      setErrors({});
    }
  }, [lesson]);

  const validate = (): boolean => {
    const newErrors: typeof errors = {};
    if (!form.title?.trim()) newErrors.title = "عنوان الدرس مطلوب";
    else if ((form.title?.trim().length || 0) < 2)
      newErrors.title = "العنوان يجب أن يكون حرفين على الأقل";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lesson || !validate()) return;

    const payload: UpdateLessonInput = {
      ...form,
      title: form.title?.trim(),
      description: form.description?.trim() || undefined,
      shortDescription: form.shortDescription?.trim() || undefined,
      content: form.content?.trim() || undefined,
      videoUrl: form.videoUrl?.trim() || undefined,
      attachmentUrl: form.attachmentUrl?.trim() || undefined,
      duration: Number(form.duration) || 0,
      estimatedStudyTime: Number(form.estimatedStudyTime) || 0,
    };

    await updateLesson.mutateAsync({ id: lesson._id, data: payload });
    onClose();
  };

  const handleChange = <K extends keyof UpdateLessonInput>(
    key: K,
    value: UpdateLessonInput[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  if (!isOpen || !lesson) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="تعديل الدرس"
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-xl bg-white dark:bg-[#0B2D5B] rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-white/10">
          <div>
            <h2 className="text-base font-black text-[#0B2D5B] dark:text-white">
              تعديل الدرس
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-xs">
              {lesson.title}
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
              عنوان الدرس <span className="text-rose-500">*</span>
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

          {/* Lesson Type & Status Row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-700 dark:text-slate-200">
                نوع الدرس
              </label>
              <select
                value={form.lessonType || "Video"}
                onChange={(e) => handleChange("lessonType", e.target.value as LessonType)}
                className="w-full h-11 px-3 rounded-xl bg-slate-50 dark:bg-white/5 dark:bg-[#0B2D5B] border border-slate-200 dark:border-white/10 text-xs font-bold outline-none cursor-pointer"
              >
                {LESSON_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-700 dark:text-slate-200">
                الحالة
              </label>
              <select
                value={form.status || "Published"}
                onChange={(e) => handleChange("status", e.target.value as LessonStatus)}
                className="w-full h-11 px-3 rounded-xl bg-slate-50 dark:bg-white/5 dark:bg-[#0B2D5B] border border-slate-200 dark:border-white/10 text-xs font-bold outline-none cursor-pointer"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Video URL */}
          {(form.lessonType === "Video" || form.lessonType === "Live") && (
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-700 dark:text-slate-200">
                رابط الفيديو / البث المباشر
              </label>
              <input
                type="url"
                value={form.videoUrl || ""}
                onChange={(e) => handleChange("videoUrl", e.target.value)}
                className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none focus:border-[#F58220] transition-colors dir-ltr text-left"
              />
            </div>
          )}

          {/* Attachment URL */}
          {(form.lessonType === "PDF" || form.lessonType === "Resource") && (
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-700 dark:text-slate-200">
                رابط الملف أو المصدر الخارجي
              </label>
              <input
                type="url"
                value={form.attachmentUrl || ""}
                onChange={(e) => handleChange("attachmentUrl", e.target.value)}
                className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none focus:border-[#F58220] transition-colors dir-ltr text-left"
              />
            </div>
          )}

          {/* Content */}
          {(form.lessonType === "Article" || form.lessonType === "Text" || form.lessonType === "Interactive") && (
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-700 dark:text-slate-200">
                محتوى الدرس المقالي
              </label>
              <textarea
                value={form.content || ""}
                onChange={(e) => handleChange("content", e.target.value)}
                rows={4}
                className="w-full p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none focus:border-[#F58220] transition-colors resize-none"
              />
            </div>
          )}

          {/* Duration & Study Time Row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-700 dark:text-slate-200">
                مدة الفيديو (بالدقائق)
              </label>
              <input
                type="number"
                min={0}
                value={form.duration || 0}
                onChange={(e) => handleChange("duration", Number(e.target.value))}
                className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm font-semibold outline-none focus:border-[#F58220]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-700 dark:text-slate-200">
                وقت الدراسة التقديري (دقائق)
              </label>
              <input
                type="number"
                min={0}
                value={form.estimatedStudyTime || 0}
                onChange={(e) => handleChange("estimatedStudyTime", Number(e.target.value))}
                className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm font-semibold outline-none focus:border-[#F58220]"
              />
            </div>
          </div>

          {/* Visibility & Completion */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-700 dark:text-slate-200">
                إمكانية الوصول
              </label>
              <select
                value={form.visibility || "Enrolled"}
                onChange={(e) => handleChange("visibility", e.target.value as LessonVisibility)}
                className="w-full h-11 px-3 rounded-xl bg-slate-50 dark:bg-white/5 dark:bg-[#0B2D5B] border border-slate-200 dark:border-white/10 text-xs font-bold outline-none cursor-pointer"
              >
                {VISIBILITY_OPTIONS.map((v) => (
                  <option key={v.value} value={v.value}>
                    {v.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-700 dark:text-slate-200">
                شرط الإتمام
              </label>
              <select
                value={form.completionRequirement || "Watch75"}
                onChange={(e) => handleChange("completionRequirement", e.target.value as CompletionRequirement)}
                className="w-full h-11 px-3 rounded-xl bg-slate-50 dark:bg-white/5 dark:bg-[#0B2D5B] border border-slate-200 dark:border-white/10 text-xs font-bold outline-none cursor-pointer"
              >
                {COMPLETION_OPTIONS.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Preview Toggle */}
          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-700/30">
            <input
              type="checkbox"
              id="edit-is-preview"
              checked={Boolean(form.isPreview)}
              onChange={(e) => handleChange("isPreview", e.target.checked)}
              className="h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
            />
            <label htmlFor="edit-is-preview" className="text-xs font-bold text-emerald-800 dark:text-emerald-300 cursor-pointer">
              معاينة مجانية (يمكن للطلاب غير المشتركين مشاهدة هذا الدرس قبل الشراء)
            </label>
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
            disabled={updateLesson.isPending}
            className="flex-1 h-11 rounded-xl bg-gradient-to-r from-[#0B2D5B] to-[#1E73D8] text-white text-xs font-black flex items-center justify-center gap-2 hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50"
          >
            {updateLesson.isPending ? (
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

export default EditLessonDialog;

"use client";

import * as React from "react";
import { X, Loader2, Save, Video, Volume2, FileText, File, Sparkles, CheckCircle2, FileDown } from "lucide-react";
import { useUpdateLesson } from "@/hooks/useLessons";
import type {
  ApiLesson,
  UpdateLessonInput,
  LessonType,
  LessonStatus,
  LessonVisibility,
  CompletionRequirement,
} from "@/features/teacher/types/lesson";
import { FileUploader } from "@/components/common/file-uploader";

interface EditLessonDialogProps {
  sectionId?: string;
  lesson: ApiLesson | null;
  isOpen: boolean;
  onClose: () => void;
}

const LESSON_TYPES: { value: LessonType; label: string; icon: any }[] = [
  { value: "Video", label: "فيديو مرئي", icon: Video },
  { value: "Audio" as any, label: "مقطع صوتي", icon: Volume2 },
  { value: "PDF", label: "مستند / PDF", icon: FileText },
  { value: "Article", label: "مقال نصي", icon: File },
  { value: "Quiz", label: "اختبار تقييمي", icon: Sparkles },
  { value: "Assignment", label: "واجب دراسي", icon: CheckCircle2 },
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
  { value: "Watch75", label: "مشاهدة 75% من المحتوى" },
  { value: "Watch100", label: "مشاهدة المحتوى بالكامل 100%" },
  { value: "PassQuiz", label: "اجتياز الاختبار التابع" },
  { value: "SubmitAssignment", label: "تسليم الواجب المطلوب" },
  { value: "Manual", label: "تأكيد يدوي من الطالب" },
];

export function EditLessonDialog({ sectionId, lesson, isOpen, onClose }: EditLessonDialogProps) {
  const updateLesson = useUpdateLesson(sectionId);

  const [form, setForm] = React.useState<UpdateLessonInput>({});
  const [errors, setErrors] = React.useState<Partial<Record<keyof UpdateLessonInput, string>>>({});
  const [mediaMode, setMediaMode] = React.useState<"upload" | "url">("upload");

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
        audioUrl: (lesson as any).audioUrl || "",
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
      audioUrl: (form as any).audioUrl?.trim() || undefined,
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
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-white dark:bg-[#0F274D] rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden text-right dir-rtl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.02]">
          <div className="space-y-0.5">
            <h2 className="text-lg font-black text-[#0B2D5B] dark:text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-[#F58220]" />
              تعديل وإدارة بيانات الدرس المنهجي
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold truncate max-w-md">
              الدرس الحالي: {lesson.title}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2.5 rounded-2xl hover:bg-slate-200/60 dark:hover:bg-white/10 text-slate-500 transition-colors cursor-pointer"
            aria-label="إغلاق"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Title */}
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-700 dark:text-slate-200">
              عنوان الدرس المنهجي <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={form.title || ""}
              onChange={(e) => handleChange("title", e.target.value)}
              className={`w-full h-12 px-4 rounded-2xl bg-slate-50 dark:bg-white/5 border text-xs font-bold outline-none transition-colors ${
                errors.title
                  ? "border-rose-400 focus:border-rose-500"
                  : "border-slate-200 dark:border-white/10 focus:border-[#F58220]"
              }`}
            />
            {errors.title && (
              <p className="text-xs text-rose-500 font-bold">{errors.title}</p>
            )}
          </div>

          {/* Lesson Type & Status Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-700 dark:text-slate-200">
                نوع المحتوى
              </label>
              <select
                value={form.lessonType || "Video"}
                onChange={(e) => handleChange("lessonType", e.target.value as LessonType)}
                className="w-full h-12 px-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold outline-none cursor-pointer"
              >
                {LESSON_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-700 dark:text-slate-200">
                حالة الدرس
              </label>
              <select
                value={form.status || "Published"}
                onChange={(e) => handleChange("status", e.target.value as LessonStatus)}
                className="w-full h-12 px-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold outline-none cursor-pointer"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Video Section */}
          {(form.lessonType === "Video" || form.lessonType === "Live") && (
            <div className="space-y-3 p-4 rounded-2xl bg-slate-50/70 dark:bg-white/5 border border-slate-200/80 dark:border-white/10">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                  <Video className="h-4 w-4 text-emerald-500" />
                  <span>فيديو الدرس الأصلي</span>
                </label>
                <div className="flex items-center gap-1 bg-white dark:bg-slate-800 p-1 rounded-xl shadow-xs">
                  <button
                    type="button"
                    onClick={() => setMediaMode("upload")}
                    className={`px-3 py-1 rounded-lg text-[11px] font-bold cursor-pointer ${
                      mediaMode === "upload" ? "bg-[#0B2D5B] text-white" : "text-slate-500"
                    }`}
                  >
                    رفع مباشر
                  </button>
                  <button
                    type="button"
                    onClick={() => setMediaMode("url")}
                    className={`px-3 py-1 rounded-lg text-[11px] font-bold cursor-pointer ${
                      mediaMode === "url" ? "bg-[#0B2D5B] text-white" : "text-slate-500"
                    }`}
                  >
                    رابط خارجي
                  </button>
                </div>
              </div>

              {mediaMode === "upload" ? (
                <FileUploader
                  category="video"
                  folder="courses/videos"
                  label="تحديث ملف الفيديو"
                  helperText="اسحب فيديو MP4/WebM الجديد لرفعه سحابياً"
                  maxSizeMB={500}
                  value={form.videoUrl || ""}
                  onChange={(url) => handleChange("videoUrl", url)}
                />
              ) : (
                <input
                  type="url"
                  value={form.videoUrl || ""}
                  onChange={(e) => handleChange("videoUrl", e.target.value)}
                  placeholder="ضع رابط الفيديو الخارجي..."
                  className="w-full h-11 px-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none focus:border-[#F58220]"
                />
              )}
            </div>
          )}

          {/* Attachment / Document Section */}
          <div className="space-y-3 p-4 rounded-2xl bg-slate-50/70 dark:bg-white/5 border border-slate-200/80 dark:border-white/10">
            <label className="text-xs font-black text-slate-700 dark:text-slate-200 flex items-center gap-1.5 block">
              <FileDown className="h-4 w-4 text-[#1E73D8]" />
              <span>إرفاق المذكرات والملحقات (PDF, DOCX, ZIP)</span>
            </label>
            <FileUploader
              category="document"
              folder="courses/attachments"
              label="تحديث الملحق التعليمي"
              helperText="رفع ملف المذكرة أو التمرين التابع لهذا الدرس"
              maxSizeMB={50}
              value={form.attachmentUrl || ""}
              onChange={(url) => handleChange("attachmentUrl", url)}
            />
          </div>

          {/* Article / Text Content */}
          {(form.lessonType === "Article" || form.lessonType === "Text" || form.lessonType === "Interactive") && (
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-700 dark:text-slate-200">
                محتوى الدرس المقالي النصي
              </label>
              <textarea
                value={form.content || ""}
                onChange={(e) => handleChange("content", e.target.value)}
                rows={4}
                placeholder="اكتب المحتوى التعليمي النصي..."
                className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none focus:border-[#F58220] transition-colors resize-none"
              />
            </div>
          )}

          {/* Duration & Study Time Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-700 dark:text-slate-200 block">
                مدة الفيديو (بالدقائق)
              </label>
              <input
                type="number"
                min={0}
                value={form.duration || 0}
                onChange={(e) => handleChange("duration", Number(e.target.value))}
                className="w-full h-12 px-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold outline-none focus:border-[#F58220]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-700 dark:text-slate-200 block">
                وقت الدراسة التقديري (بالدقائق)
              </label>
              <input
                type="number"
                min={0}
                value={form.estimatedStudyTime || 0}
                onChange={(e) => handleChange("estimatedStudyTime", Number(e.target.value))}
                className="w-full h-12 px-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold outline-none focus:border-[#F58220]"
              />
            </div>
          </div>

          {/* Visibility & Completion */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-700 dark:text-slate-200 block">
                إمكانية الوصول
              </label>
              <select
                value={form.visibility || "Enrolled"}
                onChange={(e) => handleChange("visibility", e.target.value as LessonVisibility)}
                className="w-full h-12 px-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold outline-none cursor-pointer"
              >
                {VISIBILITY_OPTIONS.map((v) => (
                  <option key={v.value} value={v.value}>
                    {v.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-700 dark:text-slate-200 block">
                شرط الإتمام
              </label>
              <select
                value={form.completionRequirement || "Watch75"}
                onChange={(e) => handleChange("completionRequirement", e.target.value as CompletionRequirement)}
                className="w-full h-12 px-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold outline-none cursor-pointer"
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
          <label className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-700/30 cursor-pointer">
            <input
              type="checkbox"
              id="edit-is-preview"
              checked={Boolean(form.isPreview)}
              onChange={(e) => handleChange("isPreview", e.target.checked)}
              className="h-5 w-5 rounded accent-[#F58220] cursor-pointer"
            />
            <div className="space-y-0.5">
              <span className="text-xs font-extrabold text-emerald-800 dark:text-emerald-300 block">
                معاينة مجانية (يمكن للطلاب غير المشتركين مشاهدة هذا الدرس قبل الشراء)
              </span>
            </div>
          </label>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-between gap-4 p-6 border-t border-slate-100 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.02]">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 rounded-2xl border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 transition-colors cursor-pointer"
          >
            إلغاء
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={updateLesson.isPending}
            className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-[#F58220] to-[#FF9A2A] hover:from-[#e57518] hover:to-[#f08d1f] text-white text-xs font-black flex items-center justify-center gap-2 shadow-lg shadow-[#F58220]/20 transition-all cursor-pointer disabled:opacity-50"
          >
            {updateLesson.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>جاري حفظ التعديلات...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>حفظ التعديلات الآن</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditLessonDialog;

"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { X, Loader2, FileCheck2 } from "lucide-react";
import { useCreateAssignment } from "@/hooks/useAssignments";
import type { CreateAssignmentInput, SubmissionType } from "@/features/teacher/types/assignment";
import api from "@/services/api";
import type { ApiResponse } from "@/features/dashboard/types/api";

interface CreateAssignmentDialogProps {
  courseId?: string;
  sectionId?: string;
  lessonId?: string;
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

export function CreateAssignmentDialog({
  courseId,
  sectionId,
  lessonId,
  isOpen,
  onClose,
}: CreateAssignmentDialogProps) {
  const createAssignment = useCreateAssignment();

  const [form, setForm] = React.useState<CreateAssignmentInput>({
    title: "",
    description: "",
    instructions: "",
    courseId: courseId || "",
    sectionId,
    lessonId: lessonId || "",
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    totalMarks: 100,
    passingMarks: 60,
    submissionType: "FileUpload",
    maxFileSizeMB: 10,
    maxFiles: 5,
    maxAttempts: 1,
    allowLateSubmission: false,
    latePenaltyPercentage: 0,
    status: "Published",
  });

  const [errors, setErrors] = React.useState<Partial<Record<keyof CreateAssignmentInput, string>>>({});

  // Fetch teacher's courses if not passed in props
  const { data: courses = [] } = useQuery({
    queryKey: ["teacher-courses-select"],
    queryFn: async () => {
      const res = await api.get<ApiResponse<any>>("/teacher/courses");
      return res.data.data?.courses || res.data.data || [];
    },
    enabled: isOpen && !courseId,
  });

  // Fetch lessons under selected course
  const activeCourseId = form.courseId || courseId;
  const { data: lessons = [] } = useQuery({
    queryKey: ["teacher-lessons-select", activeCourseId],
    queryFn: async () => {
      if (!activeCourseId) return [];
      const res = await api.get<ApiResponse<any>>("/teacher/lessons", {
        params: { courseId: activeCourseId, limit: 100 },
      });
      return res.data.data?.lessons || res.data.data || [];
    },
    enabled: isOpen && !!activeCourseId,
  });

  const reset = React.useCallback(() => {
    setForm({
      title: "",
      description: "",
      instructions: "",
      courseId: courseId || "",
      sectionId,
      lessonId: lessonId || "",
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      totalMarks: 100,
      passingMarks: 60,
      submissionType: "FileUpload",
      maxFileSizeMB: 10,
      maxFiles: 5,
      maxAttempts: 1,
      allowLateSubmission: false,
      latePenaltyPercentage: 0,
      status: "Published",
    });
    setErrors({});
  }, [courseId, sectionId, lessonId]);

  React.useEffect(() => {
    if (!isOpen) reset();
  }, [isOpen, reset]);

  const validate = (): boolean => {
    const newErrors: typeof errors = {};
    if (!form.title?.trim()) newErrors.title = "عنوان الواجب مطلوب";
    if (!form.courseId?.trim() && !courseId) newErrors.courseId = "الكورس التابع للواجب مطلوب";
    if (!form.lessonId?.trim() && !lessonId) newErrors.lessonId = "الدرس التابع للواجب مطلوب";
    if (!form.dueDate?.trim()) newErrors.dueDate = "تاريخ التسليم مطلوب";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const payload: CreateAssignmentInput = {
      ...form,
      title: form.title.trim(),
      courseId: form.courseId || courseId || "",
      lessonId: form.lessonId || lessonId || "",
      description: form.description?.trim() || undefined,
      instructions: form.instructions?.trim() || undefined,
    };

    await createAssignment.mutateAsync(payload);
    onClose();
  };

  const handleChange = (key: keyof CreateAssignmentInput, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-xl bg-white dark:bg-[#0B2D5B] rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden text-right dir-rtl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-white/10">
          <div className="flex items-center gap-3">
            <span className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
              <FileCheck2 className="h-5 w-5 text-indigo-500" />
            </span>
            <div>
              <h2 className="text-base font-black text-[#0B2D5B] dark:text-white">
                إضافة واجب تطبيقي جديد
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                حدد تفاصيل الواجب، الكورس، شروط التسليم والدرجات
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-700 dark:text-slate-200">
              عنوان الواجب <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="مثال: تطبيق تصميم واجهة مستخدم متجاوبة"
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

          {/* Course & Lesson Selection if not pre-provided */}
          {!courseId && (
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-700 dark:text-slate-200">
                  الكورس التابع <span className="text-rose-500">*</span>
                </label>
                <select
                  value={form.courseId}
                  onChange={(e) => {
                    handleChange("courseId", e.target.value);
                    handleChange("lessonId", "");
                  }}
                  className={`w-full h-11 px-3 rounded-xl bg-slate-50 dark:bg-white/5 border text-xs font-bold outline-none cursor-pointer ${
                    errors.courseId ? "border-rose-400" : "border-slate-200 dark:border-white/10"
                  }`}
                >
                  <option value="">اختر الكورس...</option>
                  {courses.map((c: any) => (
                    <option key={c._id} value={c._id}>
                      {c.title}
                    </option>
                  ))}
                </select>
                {errors.courseId && <p className="text-[11px] text-rose-500">{errors.courseId}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-700 dark:text-slate-200">
                  الدرس التابع <span className="text-rose-500">*</span>
                </label>
                <select
                  value={form.lessonId}
                  onChange={(e) => handleChange("lessonId", e.target.value)}
                  disabled={!activeCourseId}
                  className={`w-full h-11 px-3 rounded-xl bg-slate-50 dark:bg-white/5 border text-xs font-bold outline-none cursor-pointer ${
                    errors.lessonId ? "border-rose-400" : "border-slate-200 dark:border-white/10"
                  }`}
                >
                  <option value="">اختر الدرس...</option>
                  {lessons.map((l: any) => (
                    <option key={l._id} value={l._id}>
                      {l.title}
                    </option>
                  ))}
                </select>
                {errors.lessonId && <p className="text-[11px] text-rose-500">{errors.lessonId}</p>}
              </div>
            </div>
          )}

          {/* Description & Instructions */}
          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-700 dark:text-slate-200">
              الوصف والتعليمات
            </label>
            <textarea
              value={form.description || ""}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={2}
              placeholder="تعليمات وإرشادات التنفيذ للطلاب..."
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none focus:border-[#F58220] resize-none"
            />
          </div>

          {/* Submission Type & Due Date Row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-700 dark:text-slate-200">
                نوع التسليم المطلوب
              </label>
              <select
                value={form.submissionType}
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
                آخر موعد للتسليم <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={form.dueDate}
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
                value={form.totalMarks}
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
                value={form.passingMarks}
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
                value={form.maxAttempts}
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
                id="create-allow-late"
                checked={form.allowLateSubmission}
                onChange={(e) => handleChange("allowLateSubmission", e.target.checked)}
                className="h-4 w-4 rounded text-[#F58220] focus:ring-[#F58220]"
              />
              <label htmlFor="create-allow-late" className="text-xs font-bold text-slate-700 dark:text-slate-200 cursor-pointer">
                السماح بالتسليم المتأخر بعد الموعد النهائي
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
            disabled={createAssignment.isPending}
            className="flex-1 h-11 rounded-2xl bg-gradient-to-r from-[#F58220] to-[#FF9A2A] hover:from-[#e57518] hover:to-[#f08d1f] text-white text-xs font-black flex items-center justify-center gap-2 shadow-lg shadow-[#F58220]/20 transition-all cursor-pointer disabled:opacity-50"
          >
            {createAssignment.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>جاري الإنشاء...</span>
              </>
            ) : (
              <>
                <FileCheck2 className="h-4 w-4" />
                <span>إنشاء الواجب</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateAssignmentDialog;

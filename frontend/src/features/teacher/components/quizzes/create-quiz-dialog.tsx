"use client";

import * as React from "react";
import { X, Loader2, HelpCircle } from "lucide-react";
import { useCreateQuiz } from "@/hooks/useQuizzes";
import type { CreateQuizInput, QuizStatus } from "@/features/teacher/types/quiz";

interface CreateQuizDialogProps {
  courseId?: string;
  sectionId?: string;
  lessonId?: string;
  isOpen: boolean;
  onClose: () => void;
}

export function CreateQuizDialog({
  courseId,
  sectionId,
  lessonId,
  isOpen,
  onClose,
}: CreateQuizDialogProps) {
  const createQuiz = useCreateQuiz();

  const [form, setForm] = React.useState<CreateQuizInput>({
    title: "",
    description: "",
    instructions: "",
    courseId,
    sectionId,
    lessonId,
    duration: 30,
    passingScore: 50,
    passingPercentage: 60,
    attemptLimit: 1,
    shuffleQuestions: true,
    shuffleAnswers: true,
    negativeMarking: false,
    autoSubmit: true,
    certificateRequirement: false,
    showScoreAfterSubmission: true,
    showCorrectAnswers: true,
    showExplanations: true,
    allowReview: true,
    status: "Published",
  });

  const [errors, setErrors] = React.useState<Partial<Record<keyof CreateQuizInput, string>>>({});

  const reset = React.useCallback(() => {
    setForm({
      title: "",
      description: "",
      instructions: "",
      courseId,
      sectionId,
      lessonId,
      duration: 30,
      passingScore: 50,
      passingPercentage: 60,
      attemptLimit: 1,
      shuffleQuestions: true,
      shuffleAnswers: true,
      negativeMarking: false,
      autoSubmit: true,
      certificateRequirement: false,
      showScoreAfterSubmission: true,
      showCorrectAnswers: true,
      showExplanations: true,
      allowReview: true,
      status: "Published",
    });
    setErrors({});
  }, [courseId, sectionId, lessonId]);

  React.useEffect(() => {
    if (!isOpen) reset();
  }, [isOpen, reset]);

  const validate = (): boolean => {
    const newErrors: typeof errors = {};
    if (!form.title?.trim()) newErrors.title = "عنوان الاختبار مطلوب";
    else if ((form.title?.trim().length || 0) < 2)
      newErrors.title = "العنوان يجب أن يكون حرفين على الأقل";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const payload: CreateQuizInput = {
      ...form,
      title: form.title.trim(),
      description: form.description?.trim() || undefined,
      instructions: form.instructions?.trim() || undefined,
      duration: Number(form.duration) || 0,
      passingScore: Number(form.passingScore) || 50,
      passingPercentage: Number(form.passingPercentage) || 60,
      attemptLimit: Number(form.attemptLimit) || 1,
      courseId: form.courseId || courseId,
      sectionId: form.sectionId || sectionId,
      lessonId: form.lessonId || lessonId,
    };

    await createQuiz.mutateAsync(payload);
    onClose();
  };

  const handleChange = <K extends keyof CreateQuizInput>(
    key: K,
    value: CreateQuizInput[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-xl bg-white dark:bg-[#0B2D5B] rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-white/10">
          <div className="flex items-center gap-3">
            <span className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <HelpCircle className="h-5 w-5 text-amber-500" />
            </span>
            <div>
              <h2 className="text-base font-black text-[#0B2D5B] dark:text-white">
                إضافة اختبار تقييمي جديد
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                حدد إعدادات وقواعد الاختبار والنجاح
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto text-right">
          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-700 dark:text-slate-200">
              عنوان الاختبار <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="مثال: اختبار نهاية الوحدة الأولى"
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
              وصف الاختبار
            </label>
            <textarea
              value={form.description || ""}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={2}
              placeholder="وصف مختصر للطلاب حول محتوى الاختبار..."
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none focus:border-[#F58220] resize-none"
            />
          </div>

          {/* Duration & Passing Score Row */}
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-700 dark:text-slate-200">
                المدة (دقائق)
              </label>
              <input
                type="number"
                min={0}
                value={form.duration}
                onChange={(e) => handleChange("duration", Number(e.target.value))}
                placeholder="0 = بدون حد"
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
                value={form.passingScore}
                onChange={(e) => handleChange("passingScore", Number(e.target.value))}
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
                value={form.attemptLimit}
                onChange={(e) => handleChange("attemptLimit", Number(e.target.value))}
                placeholder="1"
                className="w-full h-11 px-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm font-semibold outline-none focus:border-[#F58220]"
              />
            </div>
          </div>

          {/* Toggles */}
          <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-white/5">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="create-shuffle-questions"
                checked={form.shuffleQuestions}
                onChange={(e) => handleChange("shuffleQuestions", e.target.checked)}
                className="h-4 w-4 rounded text-[#F58220] focus:ring-[#F58220]"
              />
              <label htmlFor="create-shuffle-questions" className="text-xs font-bold text-slate-700 dark:text-slate-200 cursor-pointer">
                خلط ترتيب الأسئلة عشوائياً لكل طالب 🔀
              </label>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="create-shuffle-answers"
                checked={form.shuffleAnswers}
                onChange={(e) => handleChange("shuffleAnswers", e.target.checked)}
                className="h-4 w-4 rounded text-[#F58220] focus:ring-[#F58220]"
              />
              <label htmlFor="create-shuffle-answers" className="text-xs font-bold text-slate-700 dark:text-slate-200 cursor-pointer">
                خلط خيارات الإجابة عشوائياً
              </label>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="create-show-correct"
                checked={form.showCorrectAnswers}
                onChange={(e) => handleChange("showCorrectAnswers", e.target.checked)}
                className="h-4 w-4 rounded text-[#F58220] focus:ring-[#F58220]"
              />
              <label htmlFor="create-show-correct" className="text-xs font-bold text-slate-700 dark:text-slate-200 cursor-pointer">
                إظهار الإجابات الصحيحة والتفسير بعد الانتهاء
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
            disabled={createQuiz.isPending}
            className="flex-1 h-11 rounded-xl bg-gradient-to-r from-[#0B2D5B] to-[#1E73D8] text-white text-xs font-black flex items-center justify-center gap-2 hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50"
          >
            {createQuiz.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>جاري الإنشاء...</span>
              </>
            ) : (
              <>
                <HelpCircle className="h-4 w-4" />
                <span>إنشاء الاختبار</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateQuizDialog;

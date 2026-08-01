"use client";

import * as React from "react";
import { X, Loader2, Save } from "lucide-react";
import { useUpdateQuiz } from "@/hooks/useQuizzes";
import type { ApiQuiz, UpdateQuizInput } from "@/features/teacher/types/quiz";

interface EditQuizDialogProps {
  quiz: ApiQuiz | null;
  isOpen: boolean;
  onClose: () => void;
}

export function EditQuizDialog({ quiz, isOpen, onClose }: EditQuizDialogProps) {
  const updateQuiz = useUpdateQuiz();

  const [form, setForm] = React.useState<UpdateQuizInput>({});
  const [errors, setErrors] = React.useState<Partial<Record<keyof UpdateQuizInput, string>>>({});

  React.useEffect(() => {
    if (quiz) {
      setForm({
        title: quiz.title,
        description: quiz.description || "",
        instructions: quiz.instructions || "",
        duration: quiz.duration,
        passingScore: quiz.passingScore,
        passingPercentage: quiz.passingPercentage || 60,
        attemptLimit: quiz.attemptLimit,
        shuffleQuestions: quiz.shuffleQuestions,
        shuffleAnswers: quiz.shuffleAnswers,
        negativeMarking: quiz.negativeMarking,
        showScoreAfterSubmission: quiz.showScoreAfterSubmission,
        showCorrectAnswers: quiz.showCorrectAnswers,
        showExplanations: quiz.showExplanations,
        allowReview: quiz.allowReview,
        status: quiz.status,
      });
      setErrors({});
    }
  }, [quiz]);

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
    if (!quiz || !validate()) return;

    const payload: UpdateQuizInput = {
      ...form,
      title: form.title?.trim(),
      description: form.description?.trim() || undefined,
      instructions: form.instructions?.trim() || undefined,
      duration: Number(form.duration) || 0,
      passingScore: Number(form.passingScore) || 50,
      passingPercentage: Number(form.passingPercentage) || 60,
      attemptLimit: Number(form.attemptLimit) || 1,
    };

    await updateQuiz.mutateAsync({ id: quiz._id, data: payload });
    onClose();
  };

  const handleChange = <K extends keyof UpdateQuizInput>(
    key: K,
    value: UpdateQuizInput[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  if (!isOpen || !quiz) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-xl bg-white dark:bg-[#0B2D5B] rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-white/10">
          <div>
            <h2 className="text-base font-black text-[#0B2D5B] dark:text-white">
              تعديل إعدادات الاختبار
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-xs">
              {quiz.title}
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
              عنوان الاختبار <span className="text-rose-500">*</span>
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
              وصف الاختبار
            </label>
            <textarea
              value={form.description || ""}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={2}
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
                value={form.duration || 0}
                onChange={(e) => handleChange("duration", Number(e.target.value))}
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
                value={form.passingScore || 50}
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
                value={form.attemptLimit || 1}
                onChange={(e) => handleChange("attemptLimit", Number(e.target.value))}
                className="w-full h-11 px-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm font-semibold outline-none focus:border-[#F58220]"
              />
            </div>
          </div>

          {/* Toggles */}
          <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-white/5">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="edit-shuffle-questions"
                checked={Boolean(form.shuffleQuestions)}
                onChange={(e) => handleChange("shuffleQuestions", e.target.checked)}
                className="h-4 w-4 rounded text-[#F58220] focus:ring-[#F58220]"
              />
              <label htmlFor="edit-shuffle-questions" className="text-xs font-bold text-slate-700 dark:text-slate-200 cursor-pointer">
                خلط ترتيب الأسئلة عشوائياً لكل طالب 🔀
              </label>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="edit-shuffle-answers"
                checked={Boolean(form.shuffleAnswers)}
                onChange={(e) => handleChange("shuffleAnswers", e.target.checked)}
                className="h-4 w-4 rounded text-[#F58220] focus:ring-[#F58220]"
              />
              <label htmlFor="edit-shuffle-answers" className="text-xs font-bold text-slate-700 dark:text-slate-200 cursor-pointer">
                خلط خيارات الإجابة عشوائياً
              </label>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="edit-show-correct"
                checked={Boolean(form.showCorrectAnswers)}
                onChange={(e) => handleChange("showCorrectAnswers", e.target.checked)}
                className="h-4 w-4 rounded text-[#F58220] focus:ring-[#F58220]"
              />
              <label htmlFor="edit-show-correct" className="text-xs font-bold text-slate-700 dark:text-slate-200 cursor-pointer">
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
            disabled={updateQuiz.isPending}
            className="flex-1 h-11 rounded-2xl bg-[#F58220] hover:bg-[#e57518] text-white text-xs font-black flex items-center justify-center gap-2 shadow-lg shadow-[#F58220]/25 transition-all cursor-pointer disabled:opacity-50"
          >
            {updateQuiz.isPending ? (
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

export default EditQuizDialog;

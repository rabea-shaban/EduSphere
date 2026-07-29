"use client";

import * as React from "react";
import {
  X,
  Plus,
  Trash2,
  Edit,
  Save,
  CheckCircle2,
  GripVertical,
  HelpCircle,
  Loader2,
  FileQuestion,
} from "lucide-react";
import {
  useQuizQuestions,
  useAddQuestion,
  useUpdateQuestion,
  useDeleteQuestion,
  useReorderQuestions,
} from "@/hooks/useQuizzes";
import type {
  ApiQuiz,
  ApiQuestion,
  ApiOption,
  QuestionType,
  CreateQuestionInput,
} from "@/features/teacher/types/quiz";

interface QuestionBuilderDialogProps {
  quiz: ApiQuiz | null;
  isOpen: boolean;
  onClose: () => void;
}

const QUESTION_TYPES: { value: QuestionType; label: string }[] = [
  { value: "SingleChoice", label: "اختيار من متعدد (إجابة واحدة)" },
  { value: "MultipleChoice", label: "اختيارات متعددة (عدة إجابات)" },
  { value: "TrueFalse", label: "صح أم خطأ" },
  { value: "ShortAnswer", label: "إجابة قصيرة" },
  { value: "Essay", label: "سؤال مقالي (تصحيح يدوي)" },
  { value: "FillBlank", label: "إكمال الفراغ" },
  { value: "Numeric", label: "إجابة رقمية" },
  { value: "FileUpload", label: "رفع ملف / حل ورقي" },
];

export function QuestionBuilderDialog({ quiz, isOpen, onClose }: QuestionBuilderDialogProps) {
  const quizId = quiz?._id || "";
  const { data: questionsData, isLoading } = useQuizQuestions(quizId);
  const addQuestion = useAddQuestion(quizId);
  const updateQuestion = useUpdateQuestion(quizId);
  const deleteQuestion = useDeleteQuestion(quizId);
  const reorderQuestions = useReorderQuestions(quizId);

  const questions = questionsData || quiz?.questions || [];

  // Question Form State (for Add / Edit)
  const [editingQuestionId, setEditingQuestionId] = React.useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = React.useState(false);

  const [form, setForm] = React.useState<CreateQuestionInput>({
    question: "",
    instructions: "",
    type: "SingleChoice",
    marks: 1,
    explanation: "",
    options: [
      { text: "الخيار الأول", isCorrect: true, order: 1 },
      { text: "الخيار الثاني", isCorrect: false, order: 2 },
    ],
    correctAnswer: "",
    numericAnswer: 0,
  });

  const resetForm = () => {
    setForm({
      question: "",
      instructions: "",
      type: "SingleChoice",
      marks: 1,
      explanation: "",
      options: [
        { text: "الخيار الأول", isCorrect: true, order: 1 },
        { text: "الخيار الثاني", isCorrect: false, order: 2 },
      ],
      correctAnswer: "",
      numericAnswer: 0,
    });
    setEditingQuestionId(null);
    setIsAddingNew(false);
  };

  const handleStartAdd = () => {
    resetForm();
    setIsAddingNew(true);
  };

  const handleStartEdit = (q: ApiQuestion) => {
    setEditingQuestionId(q._id || q.id || null);
    setIsAddingNew(false);
    setForm({
      question: q.question,
      instructions: q.instructions || "",
      type: q.type,
      marks: q.marks || 1,
      explanation: q.explanation || "",
      options: q.options && q.options.length > 0 ? q.options : [
        { text: "الخيار الأول", isCorrect: true, order: 1 },
        { text: "الخيار الثاني", isCorrect: false, order: 2 },
      ],
      correctAnswer: q.correctAnswer || "",
      numericAnswer: q.numericAnswer || 0,
    });
  };

  // Option handlers
  const handleAddOption = () => {
    const nextOrder = (form.options?.length || 0) + 1;
    setForm((prev) => ({
      ...prev,
      options: [...(prev.options || []), { text: `الخيار ${nextOrder}`, isCorrect: false, order: nextOrder }],
    }));
  };

  const handleRemoveOption = (index: number) => {
    setForm((prev) => ({
      ...prev,
      options: (prev.options || []).filter((_, i) => i !== index),
    }));
  };

  const handleOptionChange = (index: number, text: string) => {
    setForm((prev) => {
      const opts = [...(prev.options || [])];
      opts[index] = { ...opts[index], text };
      return { ...prev, options: opts };
    });
  };

  const handleSetCorrectOption = (index: number) => {
    setForm((prev) => {
      const opts = (prev.options || []).map((o, i) => {
        if (prev.type === "MultipleChoice") {
          return i === index ? { ...o, isCorrect: !o.isCorrect } : o;
        }
        return { ...o, isCorrect: i === index };
      });
      return { ...prev, options: opts };
    });
  };

  const handleSaveQuestion = async () => {
    if (!form.question.trim()) return;

    if (isAddingNew) {
      await addQuestion.mutateAsync(form);
    } else if (editingQuestionId) {
      await updateQuestion.mutateAsync({ questionId: editingQuestionId, data: form });
    }
    resetForm();
  };

  const handleDeleteQuestion = async (qId: string) => {
    if (window.confirm("هل أنت متأكد من حذف هذا السؤال؟")) {
      await deleteQuestion.mutateAsync(qId);
    }
  };

  if (!isOpen || !quiz) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-3xl bg-white dark:bg-[#0B2D5B] rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <span className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <FileQuestion className="h-5 w-5 text-amber-500" />
            </span>
            <div>
              <h2 className="text-base font-black text-[#0B2D5B] dark:text-white">
                منشئ أسئلة الاختبار ({questions.length} سؤال)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-md">
                {quiz.title}
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

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-right dir-rtl">
          {/* Add / Edit Form */}
          {(isAddingNew || editingQuestionId) ? (
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-[#0B2D5B] dark:text-white">
                  {isAddingNew ? "إضافة سؤال جديد" : "تعديل السؤال"}
                </h3>
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-xs font-bold text-slate-500 hover:text-slate-700 dark:hover:text-white"
                >
                  إلغاء
                </button>
              </div>

              {/* Question Text */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-700 dark:text-slate-200">
                  نص السؤال <span className="text-rose-500">*</span>
                </label>
                <textarea
                  value={form.question}
                  onChange={(e) => setForm((p) => ({ ...p, question: e.target.value }))}
                  rows={2}
                  placeholder="أكتب نص السؤال هنا..."
                  className="w-full p-3 rounded-xl bg-white dark:bg-[#0B2D5B] border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none focus:border-[#F58220] resize-none"
                />
              </div>

              {/* Type & Marks */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-700 dark:text-slate-200">
                    نوع السؤال
                  </label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm((p) => ({ ...p, type: e.target.value as QuestionType }))}
                    className="w-full h-10 px-3 rounded-xl bg-white dark:bg-[#0B2D5B] border border-slate-200 dark:border-white/10 text-xs font-bold outline-none cursor-pointer"
                  >
                    {QUESTION_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-700 dark:text-slate-200">
                    الدرجة المستحقة
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={form.marks}
                    onChange={(e) => setForm((p) => ({ ...p, marks: Number(e.target.value) }))}
                    className="w-full h-10 px-3 rounded-xl bg-white dark:bg-[#0B2D5B] border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none focus:border-[#F58220]"
                  />
                </div>
              </div>

              {/* Options Builder (for Choice & TrueFalse types) */}
              {(form.type === "SingleChoice" || form.type === "MultipleChoice" || form.type === "TrueFalse") && (
                <div className="space-y-2.5 pt-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black text-slate-700 dark:text-slate-200">
                      خيارات الإجابة (حدد الإجابة الصحيحة):
                    </label>
                    {form.type !== "TrueFalse" && (
                      <button
                        type="button"
                        onClick={handleAddOption}
                        className="text-xs font-bold text-[#F58220] flex items-center gap-1 hover:underline cursor-pointer"
                      >
                        <Plus className="h-3 w-3" />
                        إضافة خيار
                      </button>
                    )}
                  </div>

                  <div className="space-y-2">
                    {form.options?.map((opt, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleSetCorrectOption(idx)}
                          className={`h-8 px-2.5 rounded-lg border text-[11px] font-bold flex items-center gap-1 shrink-0 transition-colors cursor-pointer ${
                            opt.isCorrect
                              ? "bg-emerald-500 text-white border-emerald-600"
                              : "bg-slate-100 dark:bg-white/10 text-slate-500 border-slate-200 dark:border-white/10"
                          }`}
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>{opt.isCorrect ? "صحيح" : "خطأ"}</span>
                        </button>
                        <input
                          type="text"
                          value={opt.text}
                          onChange={(e) => handleOptionChange(idx, e.target.value)}
                          className="flex-1 h-9 px-3 rounded-lg bg-white dark:bg-[#0B2D5B] border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none"
                        />
                        {form.options!.length > 2 && form.type !== "TrueFalse" && (
                          <button
                            type="button"
                            onClick={() => handleRemoveOption(idx)}
                            className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Explanation */}
              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-black text-slate-700 dark:text-slate-200">
                  التفسير والشرح بعد الإجابة (اختياري)
                </label>
                <input
                  type="text"
                  value={form.explanation || ""}
                  onChange={(e) => setForm((p) => ({ ...p, explanation: e.target.value }))}
                  placeholder="سبب صحة الإجابة..."
                  className="w-full h-10 px-3 rounded-xl bg-white dark:bg-[#0B2D5B] border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none focus:border-[#F58220]"
                />
              </div>

              {/* Submit Question */}
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleSaveQuestion}
                  disabled={addQuestion.isPending || updateQuestion.isPending}
                  className="h-9 px-4 rounded-xl bg-[#0B2D5B] dark:bg-[#1E73D8] text-white text-xs font-bold flex items-center gap-1.5 hover:opacity-90 transition-opacity cursor-pointer"
                >
                  <Save className="h-3.5 w-3.5" />
                  <span>حفظ السؤال</span>
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleStartAdd}
              className="w-full py-3 rounded-2xl border border-dashed border-amber-500/40 text-amber-600 dark:text-amber-400 bg-amber-500/5 hover:bg-amber-500/10 text-xs font-black flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>إضافة سؤال جديد إلى الاختبار</span>
            </button>
          )}

          {/* Questions List */}
          {isLoading ? (
            <div className="p-4 text-center text-xs text-slate-400">جاري تحميل الأسئلة...</div>
          ) : questions.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400 border border-dashed rounded-2xl">
              لا توجد أسئلة مضافة بعد. اضغط على الأزرار أعلاه لإضافة أول سؤال.
            </div>
          ) : (
            <div className="space-y-3">
              {questions.map((q, idx) => (
                <div
                  key={q._id || q.id || idx}
                  className="p-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F274D] flex items-start justify-between gap-3"
                >
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <span className="h-7 w-7 rounded-lg bg-amber-500/10 text-amber-600 text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <div className="min-w-0 flex-1 space-y-1">
                      <p className="text-xs font-black text-[#0B2D5B] dark:text-white leading-relaxed">
                        {q.question}
                      </p>
                      <div className="flex items-center gap-3 text-[10px] text-slate-400">
                        <span>نوع: {q.type}</span>
                        <span>الدرجة: {q.marks || 1}</span>
                        {q.options && <span>الخيارات: {q.options.length}</span>}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleStartEdit(q)}
                      className="p-1.5 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors cursor-pointer"
                      title="تعديل السؤال"
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteQuestion(q._id || q.id || "")}
                      className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                      title="حذف السؤال"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-white/10 flex justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 h-10 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-200 transition-colors cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
}

export default QuestionBuilderDialog;

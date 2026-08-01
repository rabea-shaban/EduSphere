"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  HelpCircle,
  Plus,
  Trash2,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Clock,
  Award,
  BookOpen,
  Check,
  AlertCircle,
} from "lucide-react";
import { toast } from "react-hot-toast";
import api from "@/services/api";

interface CourseItem {
  _id: string;
  id?: string;
  title: string;
}

interface QuestionDraft {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // 0, 1, 2, 3 index
  marks: number;
  explanation: string;
}

export default function CreateQuizPage() {
  const router = useRouter();

  // Courses List State
  const [courses, setCourses] = React.useState<CourseItem[]>([]);
  const [selectedCourseId, setSelectedCourseId] = React.useState("");

  // Quiz Settings State
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [duration, setDuration] = React.useState(30);
  const [passingScore, setPassingScore] = React.useState(60);
  const [shuffleQuestions, setShuffleQuestions] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Dynamic Questions List
  const [questions, setQuestions] = React.useState<QuestionDraft[]>([
    {
      id: "q-1",
      question: "ما هو التعقيد الزمني لخوارزمية البحث الثنائي (Binary Search) في مصفوفة مرتبة؟",
      options: ["O(N)", "O(log N)", "O(N^2)", "O(1)"],
      correctAnswer: 1,
      marks: 1,
      explanation: "البحث الثنائي يقسم المصفوفة لنصفين في كل خطوة، لذلك تعقيده الزمني هو O(log N).",
    },
    {
      id: "q-2",
      question: "أي من هياكل البيانات التالية تعتمد على مبدأ (LIFO - Last In First Out)؟",
      options: ["المكدس (Stack)", "الطابور (Queue)", "القائمة الموصولة (LinkedList)", "الشجرة (Tree)"],
      correctAnswer: 0,
      marks: 1,
      explanation: "المكدس Stack يتبع قاعدة آخر عنصر يدخل هو أول عنصر يخرج.",
    },
  ]);

  // Fetch Teacher's Courses on Mount
  React.useEffect(() => {
    async function fetchTeacherCourses() {
      try {
        const res = await api.get("/courses?limit=100");
        const rawData = res.data?.data;
        const list: CourseItem[] = Array.isArray(rawData)
          ? rawData
          : Array.isArray(rawData?.courses)
          ? rawData.courses
          : Array.isArray(res.data)
          ? res.data
          : [];
        setCourses(list);
        if (list.length > 0) {
          setSelectedCourseId(list[0]._id || list[0].id || "");
        }
      } catch (err) {
        console.error("Failed to load courses:", err);
      }
    }
    fetchTeacherCourses();
  }, []);

  // Add Question
  const handleAddQuestion = () => {
    const nextNum = questions.length + 1;
    setQuestions([
      ...questions,
      {
        id: `q-${Date.now()}`,
        question: `السؤال رقم ${nextNum}: اكتب نص السؤال هنا...`,
        options: ["الخيار الأول (أ)", "الخيار الثاني (ب)", "الخيار الثالث (ج)", "الخيار الرابع (د)"],
        correctAnswer: 0,
        marks: 1,
        explanation: "",
      },
    ]);
  };

  // Remove Question
  const handleRemoveQuestion = (id: string) => {
    if (questions.length <= 1) {
      toast.error("يجب أن يحتوي الاختبار على سؤال واحد على الأقل");
      return;
    }
    setQuestions(questions.filter((q) => q.id !== id));
  };

  // Question Property Handlers
  const handleUpdateQuestionText = (id: string, text: string) => {
    setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, question: text } : q)));
  };

  const handleUpdateOptionText = (qId: string, optIndex: number, text: string) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== qId) return q;
        const newOpts = [...q.options];
        newOpts[optIndex] = text;
        return { ...q, options: newOpts };
      })
    );
  };

  const handleSelectCorrectOption = (qId: string, optIndex: number) => {
    setQuestions((prev) => prev.map((q) => (q.id === qId ? { ...q, correctAnswer: optIndex } : q)));
  };

  const handleUpdateMarks = (qId: string, marks: number) => {
    setQuestions((prev) => prev.map((q) => (q.id === qId ? { ...q, marks } : q)));
  };

  const handleUpdateExplanation = (qId: string, explanation: string) => {
    setQuestions((prev) => prev.map((q) => (q.id === qId ? { ...q, explanation } : q)));
  };

  // Submit Handler
  const handleFinish = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("يرجى كتابة عنوان الاختبار");
      return;
    }

    // Validate questions
    for (let i = 0; i < questions.length; i++) {
      if (!questions[i].question.trim()) {
        toast.error(`يرجى كتابة نص السؤال رقم ${i + 1}`);
        return;
      }
    }

    setIsSubmitting(true);
    toast.loading("جاري حفظ ونشر الاختبار الجديد على المنصة...", { id: "create-quiz" });

    try {
      const payload = {
        title: title.trim(),
        description: description.trim() || undefined,
        courseId: selectedCourseId || undefined,
        duration: Number(duration) || 30,
        passingScore: Number(passingScore) || 60,
        shuffleQuestions,
        status: "Published",
        questions: questions.map((q) => ({
          question: q.question.trim(),
          options: q.options.map((opt) => opt.trim()),
          correctAnswer: q.correctAnswer,
          marks: Number(q.marks) || 1,
          explanation: q.explanation.trim() || undefined,
          type: "MCQ",
        })),
      };

      await api.post("/quizzes", payload);

      toast.success("تم إنشاء ونشر الاختبار بنجاح على منصة EduSphere!", { id: "create-quiz" });
      router.push("/teacher/quizzes");
    } catch (err: any) {
      console.error("Create quiz error:", err);
      toast.error(err?.response?.data?.message || err?.message || "تعذر إنشاء الاختبار", {
        id: "create-quiz",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 text-right dir-rtl max-w-4xl mx-auto pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-2xl bg-[#F58220]/10 text-[#F58220]">
              <Sparkles className="h-5 w-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#0B2D5B] dark:text-white">
              إنشاء وتجميع اختبار منهجي جديد
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            أنشئ أسئلة الاختيار من متعدد، حدد درجة النجاح والزمن المتاح للطلاب
          </p>
        </div>

        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 rounded-2xl border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center gap-2 transition-all cursor-pointer"
        >
          <ArrowRight className="h-4 w-4" />
          <span>رجوع</span>
        </button>
      </div>

      <form onSubmit={handleFinish} className="space-y-6">
        {/* Basic Settings Card */}
        <div className="bg-white dark:bg-[#0F274D] rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-white/10 shadow-sm space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-white/10 pb-4">
            <BookOpen className="h-5 w-5 text-[#F58220]" />
            <h2 className="text-base font-black text-[#0B2D5B] dark:text-white">
              1. الإعدادات الأساسية للاختبار
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-200 block">
                عنوان الاختبار *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="مثال: الاختبار الشامل في التفكير الخوارزمي وهياكل البيانات"
                required
                className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none focus:border-[#F58220]"
              />
            </div>

            {/* Course Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-200 block">
                الكورس التابع له الاختبار (اختياري)
              </label>
              <select
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none focus:border-[#F58220] cursor-pointer"
              >
                <option value="">-- اختبار عام بدون كورس محدد --</option>
                {courses.map((c) => (
                  <option key={c._id || c.id} value={c._id || c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-200 block">
                الزمن المتاح للاجابة (بالدقائق)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min={1}
                  max={300}
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value) || 0)}
                  className="w-full h-11 px-4 pl-10 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none focus:border-[#F58220]"
                />
                <Clock className="h-4 w-4 absolute left-3 top-3.5 text-slate-400" />
              </div>
            </div>

            {/* Passing Score */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-200 block">
                نسبة الدرجة المطلوبة للنجاح (%)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={passingScore}
                  onChange={(e) => setPassingScore(Number(e.target.value) || 0)}
                  className="w-full h-11 px-4 pl-10 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none focus:border-[#F58220]"
                />
                <Award className="h-4 w-4 absolute left-3 top-3.5 text-slate-400" />
              </div>
            </div>

            {/* Shuffle Questions Checkbox */}
            <div className="space-y-2 flex items-center pt-4">
              <label className="flex items-center gap-3 cursor-pointer p-3.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 w-full">
                <input
                  type="checkbox"
                  checked={shuffleQuestions}
                  onChange={(e) => setShuffleQuestions(e.target.checked)}
                  className="h-4 w-4 rounded accent-[#F58220] cursor-pointer"
                />
                <span className="text-xs font-bold text-[#0B2D5B] dark:text-white">
                  خلط وترتيب الأسئلة عشوائياً لكل طالب (Shuffle Questions)
                </span>
              </label>
            </div>

            {/* Description */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-200 block">
                توجيهات وتعليمات الاختبار للطلاب (اختياري)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                placeholder="اكتب أي تعليمات هامة يرغب المدرس في عرضها للطلاب قبل بدء الاختبار..."
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none focus:border-[#F58220] resize-none"
              />
            </div>
          </div>
        </div>

        {/* Questions Builder Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-black text-[#0B2D5B] dark:text-white flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-[#F58220]" />
              <span>2. أسئلة الاختبار التفاعلية ({questions.length})</span>
            </h2>

            <button
              type="button"
              onClick={handleAddQuestion}
              className="px-4 py-2.5 rounded-2xl bg-[#0B2D5B] hover:bg-[#153e75] text-white text-xs font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <Plus className="h-4 w-4 text-[#F58220]" />
              <span>إضافة سؤال جديد</span>
            </button>
          </div>

          {questions.map((q, qIdx) => (
            <div
              key={q.id}
              className="bg-white dark:bg-[#0F274D] rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-white/10 shadow-sm space-y-5"
            >
              {/* Question Card Top Bar */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <span className="h-7 w-7 rounded-xl bg-[#F58220]/10 text-[#F58220] flex items-center justify-center text-xs font-black">
                    {qIdx + 1}
                  </span>
                  <span className="text-xs font-black text-[#0B2D5B] dark:text-white">
                    السؤال رقم {qIdx + 1} (اختيار من متعدد)
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <span className="text-[11px] font-bold text-slate-400">الدرجة:</span>
                    <input
                      type="number"
                      min={1}
                      max={100}
                      value={q.marks}
                      onChange={(e) => handleUpdateMarks(q.id, Number(e.target.value) || 1)}
                      className="w-14 h-8 px-2 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold text-center outline-none"
                    />
                  </div>

                  {questions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveQuestion(q.id)}
                      className="p-1.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
                      title="حذف هذا السؤال"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Question Text */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-200 block">
                  نص السؤال *
                </label>
                <input
                  type="text"
                  value={q.question}
                  onChange={(e) => handleUpdateQuestionText(q.id, e.target.value)}
                  placeholder="اكتب صياغة نص السؤال بوضوح هنا..."
                  required
                  className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none focus:border-[#F58220]"
                />
              </div>

              {/* Options Selection */}
              <div className="space-y-3 pt-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-200 block">
                  الخيارات المتاحة (انقر على الدائرة الخضراء لاختيار الإجابة الصحيحة) *
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {q.options.map((optText, optIdx) => {
                    const isCorrect = q.correctAnswer === optIdx;
                    return (
                      <div
                        key={optIdx}
                        onClick={() => handleSelectCorrectOption(q.id, optIdx)}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                          isCorrect
                            ? "bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-500 shadow-sm"
                            : "bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10"
                        }`}
                      >
                        <div
                          className={`h-6 w-6 rounded-full flex items-center justify-center shrink-0 border transition-all ${
                            isCorrect
                              ? "bg-emerald-500 text-white border-emerald-500"
                              : "border-slate-300 dark:border-white/20"
                          }`}
                        >
                          {isCorrect && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                        </div>

                        <input
                          type="text"
                          value={optText}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleUpdateOptionText(q.id, optIdx, e.target.value);
                          }}
                          placeholder={`الخيار ${optIdx + 1}...`}
                          className="w-full bg-transparent text-xs font-bold outline-none text-[#0B2D5B] dark:text-white"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Explanation Field */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-200 block">
                  تفسير الإجابة الصحيحة (تظهر للطالب بعد التسليم)
                </label>
                <input
                  type="text"
                  value={q.explanation}
                  onChange={(e) => handleUpdateExplanation(q.id, e.target.value)}
                  placeholder="شرح مقتضب للحل الصحيح يساعد الطالب على فهم سبب الإجابة..."
                  className="w-full h-10 px-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none focus:border-[#F58220]"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Submit Bar */}
        <div className="flex items-center justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 rounded-2xl border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-50 transition-all cursor-pointer"
          >
            إلغاء
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3.5 rounded-2xl bg-[#F58220] hover:bg-[#e57518] text-white text-xs font-black shadow-lg shadow-[#F58220]/25 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="h-4 w-4" />
            <span>{isSubmitting ? "جاري الحفظ والنشر..." : "حفظ ونشر الاختبار للطلاب"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

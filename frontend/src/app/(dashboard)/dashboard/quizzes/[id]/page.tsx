"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import {
  HelpCircle,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Trophy,
  Award,
  Check,
  X,
  RotateCcw,
  BookOpen,
  ChevronRight,
  ChevronLeft,
  Send,
  FileText,
  Lock,
} from "lucide-react";
import { toast } from "react-hot-toast";
import api from "@/services/api";

interface QuestionItem {
  _id?: string;
  id?: string;
  question: string;
  options: (string | { text: string; isCorrect?: boolean })[];
  correctAnswer?: number | string;
  marks?: number;
  explanation?: string;
  type?: string;
}

function getOptionText(opt: any): string {
  if (!opt) return "";
  if (typeof opt === "string") return opt;
  if (typeof opt === "object" && opt.text !== undefined) return String(opt.text);
  return String(opt || "");
}

interface QuizData {
  _id: string;
  id?: string;
  title: string;
  description?: string;
  duration?: number; // in minutes
  passingScore?: number; // percentage
  courseId?: { title?: string };
  questions?: QuestionItem[];
}

export default function StudentExamModePage() {
  const params = useParams();
  const router = useRouter();
  const quizId = String(params?.id || "");

  // Main Quiz State
  const [quiz, setQuiz] = React.useState<QuizData | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  // Exam Progress State
  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0);
  const [userAnswers, setUserAnswers] = React.useState<Record<number, number>>({});
  const [timeRemainingSeconds, setTimeRemainingSeconds] = React.useState<number>(1800); // 30 mins default
  const [isExamFinished, setIsExamFinished] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = React.useState(false);

  // Calculated Results
  const [examResult, setExamResult] = React.useState<{
    score: number;
    totalMarks: number;
    percentage: number;
    passed: boolean;
    timeTakenSeconds: number;
  } | null>(null);

  // Load Quiz Data & Check Previous Attempts
  React.useEffect(() => {
    async function fetchQuiz() {
      if (!quizId) return;
      try {
        setIsLoading(true);

        // 1. Fetch Quiz Details
        const res = await api.get(`/quizzes/${quizId}`);
        const quizObj: QuizData = res.data?.data || res.data;
        setQuiz(quizObj);

        // Initialize Timer
        const initialDurationMins = quizObj.duration || 30;
        setTimeRemainingSeconds(initialDurationMins * 60);

        // 2. Check if student ALREADY completed this quiz
        try {
          const attemptRes = await api.get(`/exam-attempts/history?quizId=${quizId}`);
          const attemptsList = attemptRes.data?.data || [];
          const completed = attemptsList.find(
            (att: any) => att.status === "Submitted" || att.status === "Graded"
          );

          if (completed) {
            // Student already completed quiz! Lock exam and show results directly
            setExamResult({
              score: completed.score || 0,
              totalMarks: 100,
              percentage: completed.percentage ?? completed.score ?? 100,
              passed: Boolean(completed.passed),
              timeTakenSeconds: 300,
            });
            setIsExamFinished(true);
          }
        } catch (e) {
          // Ignore attempt check error
        }
      } catch (err) {
        console.error("Failed to load quiz:", err);
        toast.error("تعذر تحميل بيانات الاختبار");
      } finally {
        setIsLoading(false);
      }
    }
    fetchQuiz();
  }, [quizId]);

  // Live Timer Effect
  React.useEffect(() => {
    if (isExamFinished || isLoading || !quiz) return;

    const timer = setInterval(() => {
      setTimeRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Auto submit when time runs out
          handleCalculateAndFinish(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isExamFinished, isLoading, quiz]);

  // Select Option Handler
  const handleSelectOption = (questionIndex: number, optionIndex: number) => {
    if (isExamFinished) return;
    setUserAnswers((prev) => ({
      ...prev,
      [questionIndex]: optionIndex,
    }));
  };

  // Calculate & Finish Exam (Posts Result to MongoDB for Teacher Leaderboard!)
  const handleCalculateAndFinish = async (isAutoSubmit = false) => {
    if (!quiz || !quiz.questions) return;

    setIsSubmitting(true);
    if (isAutoSubmit) {
      toast.error("انتهى زمن الاختبار! يتم الآن تسليم الإجابات تلقائياً...", { id: "time-out" });
    }

    let earnedScore = 0;
    let maxMarks = 0;

    const answersPayload: any[] = [];

    quiz.questions.forEach((q, idx) => {
      const qMarks = q.marks || 1;
      maxMarks += qMarks;
      const userSelected = userAnswers[idx];

      // Convert correctAnswer string/number to index
      const correctIdx = typeof q.correctAnswer === "number" ? q.correctAnswer : Number(q.correctAnswer) || 0;
      const isCorrect = userSelected !== undefined && userSelected === correctIdx;

      if (isCorrect) {
        earnedScore += qMarks;
      }

      answersPayload.push({
        questionId: q._id || String(idx),
        studentAnswer: userSelected,
        correctAnswer: correctIdx,
        isCorrect,
        marks: isCorrect ? qMarks : 0,
      });
    });

    const percentage = maxMarks > 0 ? Math.round((earnedScore / maxMarks) * 100) : 0;
    const requiredPassScore = quiz.passingScore ?? 50;
    const passed = percentage >= requiredPassScore;

    const initialSeconds = (quiz.duration || 30) * 60;
    const timeTakenSeconds = Math.max(0, initialSeconds - timeRemainingSeconds);

    setExamResult({
      score: earnedScore,
      totalMarks: maxMarks,
      percentage,
      passed,
      timeTakenSeconds,
    });

    // Send Result to MongoDB Backend so it appears on Teacher Leaderboard & locks retakes!
    try {
      await api.post(`/exam-attempts/${quizId}/submit`, {
        quizId,
        score: earnedScore,
        percentage,
        passed,
        timeTakenSeconds,
        answers: answersPayload,
      });
    } catch (err) {
      console.warn("Could not save attempt in database:", err);
    }

    setIsExamFinished(true);
    setShowSubmitConfirm(false);
    setIsSubmitting(false);
  };

  // Format Time Helper MM:SS
  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (isLoading) {
    return (
      <div className="space-y-6 text-right dir-rtl max-w-4xl mx-auto pb-12 pt-6">
        <div className="h-20 rounded-3xl bg-slate-100 dark:bg-white/5 animate-pulse" />
        <div className="h-96 rounded-3xl bg-slate-100 dark:bg-white/5 animate-pulse" />
      </div>
    );
  }

  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return (
      <div className="p-12 rounded-3xl bg-white dark:bg-[#0F274D] border border-slate-200 dark:border-white/10 text-center space-y-4 max-w-md mx-auto dir-rtl mt-12">
        <AlertCircle className="h-10 w-10 text-rose-500 mx-auto" />
        <h2 className="text-lg font-black text-[#0B2D5B] dark:text-white">لم يتم العثور على أسئلة لهذا الاختبار</h2>
        <p className="text-xs text-slate-400">تأكد من إعداد الأسئلة من قبل المعلم أو عد لقائمة الاختبارات</p>
        <button
          type="button"
          onClick={() => router.push("/dashboard/quizzes")}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#F58220] text-white text-xs font-bold"
        >
          <ArrowRight className="h-4 w-4" />
          <span>العودة للاختبارات</span>
        </button>
      </div>
    );
  }

  const currentQ = quiz.questions[currentQuestionIndex];
  const totalQCount = quiz.questions.length;
  const answeredCount = Object.keys(userAnswers).length;
  const progressPercent = Math.round(((currentQuestionIndex + 1) / totalQCount) * 100);

  // ----------------------------------------------------
  // SCREEN 2: RESULT & MODEL SOLUTION SCREEN
  // ----------------------------------------------------
  if (isExamFinished && examResult) {
    return (
      <div className="space-y-8 text-right dir-rtl max-w-4xl mx-auto pb-16 pt-4">
        {/* Result Header Banner */}
        <div
          className={`p-8 rounded-3xl border text-center space-y-4 shadow-xl ${
            examResult.passed
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-900 dark:text-emerald-300"
              : "bg-rose-500/10 border-rose-500/30 text-rose-900 dark:text-rose-300"
          }`}
        >
          <div
            className={`h-20 w-20 rounded-full mx-auto flex items-center justify-center text-3xl font-black shadow-lg ${
              examResult.passed ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"
            }`}
          >
            {examResult.passed ? <Trophy className="h-10 w-10" /> : <AlertCircle className="h-10 w-10" />}
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-black">
              {examResult.passed ? "تهانينا! لقد اجتزت الاختبار بنجاح 🎉" : "لم تتجاوز نسبة النجاح المطلوبة ⚠️"}
            </h1>
            <p className="text-xs sm:text-sm font-semibold opacity-80">
              اختبار: {quiz.title} ({quiz.courseId?.title || "كورس تعليمي"})
            </p>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 text-right">
            <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-white/10 space-y-1">
              <div className="text-xs font-bold text-slate-400">النتيجة النهائية</div>
              <div className="text-lg font-black text-[#0B2D5B] dark:text-white">
                {examResult.score} / {examResult.totalMarks}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-white/10 space-y-1">
              <div className="text-xs font-bold text-slate-400">النسبة المئوية</div>
              <div className="text-lg font-black text-[#F58220]">%{examResult.percentage}</div>
            </div>

            <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-white/10 space-y-1">
              <div className="text-xs font-bold text-slate-400">النسبة المطلوبة</div>
              <div className="text-lg font-black text-slate-600 dark:text-slate-300">%{quiz.passingScore || 50}</div>
            </div>

            <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-white/10 space-y-1">
              <div className="text-xs font-bold text-slate-400">الوقت المستغرق</div>
              <div className="text-lg font-black text-slate-600 dark:text-slate-300">
                {formatTime(examResult.timeTakenSeconds)}
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Model Solution */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-200/80 dark:border-white/10 pb-4">
            <FileText className="h-5 w-5 text-[#F58220]" />
            <h2 className="text-base font-black text-[#0B2D5B] dark:text-white">
              التصحيح النموذجي وتفسير الأسئلة
            </h2>
          </div>

          <div className="space-y-4">
            {quiz.questions.map((q, idx) => {
              const userSelected = userAnswers[idx];
              const correctIdx = typeof q.correctAnswer === "number" ? q.correctAnswer : Number(q.correctAnswer) || 0;
              const isUserCorrect = userSelected === correctIdx;

              return (
                <div
                  key={idx}
                  className={`p-6 rounded-3xl bg-white dark:bg-[#0F274D] border shadow-sm space-y-4 ${
                    isUserCorrect
                      ? "border-emerald-500/40"
                      : userSelected === undefined
                      ? "border-amber-500/40"
                      : "border-rose-500/40"
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-xs font-black text-[#0B2D5B] dark:text-white">
                      السؤال {idx + 1}: {q.question}
                    </span>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-black shrink-0 ${
                        isUserCorrect
                          ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                          : userSelected === undefined
                          ? "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                          : "bg-rose-500/10 text-rose-600 border border-rose-500/20"
                      }`}
                    >
                      {isUserCorrect
                        ? `إجابة صحيحة (+${q.marks || 1}) 🟢`
                        : userSelected === undefined
                        ? "لم يتم الإجابة 🟡"
                        : "إجابة خاطئة (0) 🔴"}
                    </span>
                  </div>

                  {/* Options Review List */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {q.options.map((optText, optIdx) => {
                      const isThisCorrect = optIdx === correctIdx;
                      const isThisSelected = userSelected === optIdx;

                      let styleClass = "bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10";
                      if (isThisCorrect) {
                        styleClass = "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-800 dark:text-emerald-200 font-bold";
                      } else if (isThisSelected && !isThisCorrect) {
                        styleClass = "bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-800 dark:text-rose-200 line-through opacity-80";
                      }

                      return (
                        <div key={optIdx} className={`p-3.5 rounded-2xl border text-xs flex items-center justify-between gap-2 ${styleClass}`}>
                          <span>{getOptionText(optText)}</span>
                          {isThisCorrect && <Check className="h-4 w-4 text-emerald-600 stroke-[3] shrink-0" />}
                          {isThisSelected && !isThisCorrect && <X className="h-4 w-4 text-rose-600 stroke-[3] shrink-0" />}
                        </div>
                      );
                    })}
                  </div>

                  {/* Teacher Explanation */}
                  {q.explanation && (
                    <div className="p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/40 text-xs text-indigo-900 dark:text-indigo-200 space-y-1">
                      <strong className="block font-black">تفسير وحل المدرس:</strong>
                      <p>{q.explanation}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Locked Notice & Action Button */}
        <div className="flex flex-col items-center justify-center gap-4 pt-6 text-center border-t border-slate-200/80 dark:border-white/10">
          <div className="px-4 py-2 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-black flex items-center gap-2">
            <Lock className="h-4 w-4" />
            <span>هذا الاختبار مُغلق نهائياً - لقد تم تسجيل إجاباتك السابقة بنجاح ولا يمكن إعادة الامتحان.</span>
          </div>

          <button
            type="button"
            onClick={() => router.push("/dashboard/quizzes")}
            className="px-8 py-3.5 rounded-2xl bg-[#F58220] hover:bg-[#e57518] text-white text-xs font-black shadow-lg shadow-[#F58220]/20 flex items-center gap-2 transition-all cursor-pointer"
          >
            <ArrowRight className="h-4 w-4" />
            <span>العودة لقائمة الاختبارات 📋</span>
          </button>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // SCREEN 1: ACTIVE EXAM MODE
  // ----------------------------------------------------
  return (
    <div className="space-y-6 text-right dir-rtl max-w-4xl mx-auto pb-16 pt-2">
      {/* Top Exam Header */}
      <div className="bg-white dark:bg-[#0F274D] rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-white/10 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="px-3 py-1 rounded-full text-xs font-black bg-[#F58220]/10 text-[#F58220] mb-2 inline-block">
              وضع الامتحان المباشر 📝
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-[#0B2D5B] dark:text-white">
              {quiz.title}
            </h1>
          </div>

          {/* Live Countdown Timer */}
          <div className="flex items-center gap-3 bg-slate-100 dark:bg-white/5 p-3 rounded-2xl border border-slate-200 dark:border-white/10">
            <Clock className={`h-5 w-5 ${timeRemainingSeconds < 180 ? "text-rose-500 animate-pulse" : "text-[#F58220]"}`} />
            <div>
              <div className="text-[10px] font-bold text-slate-400">الوقت المتبقي</div>
              <div className={`text-base font-black ${timeRemainingSeconds < 180 ? "text-rose-600 dark:text-rose-400" : "text-[#0B2D5B] dark:text-white"}`}>
                {formatTime(timeRemainingSeconds)}
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5 pt-2">
          <div className="flex justify-between text-xs font-bold text-slate-500">
            <span>التقدم في الإجابة: {answeredCount} من {totalQCount} سؤال</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="h-2.5 w-full bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#F58220] to-[#FF9A2A] transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Question Card */}
      <div className="bg-white dark:bg-[#0F274D] rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-white/10 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-4">
          <span className="px-3 py-1 rounded-xl bg-[#0B2D5B]/10 text-[#0B2D5B] dark:text-[#F58220] text-xs font-black">
            السؤال {currentQuestionIndex + 1} من {totalQCount}
          </span>
          <span className="text-xs font-bold text-slate-400">
            الدرجة: {currentQ.marks || 1} نقطة
          </span>
        </div>

        {/* Question Text */}
        <div className="text-base sm:text-lg font-black text-[#0B2D5B] dark:text-white leading-relaxed">
          {currentQ.question}
        </div>

        {/* Options List */}
        <div className="space-y-3 pt-2">
          {currentQ.options.map((optText, optIdx) => {
            const isSelected = userAnswers[currentQuestionIndex] === optIdx;
            return (
              <div
                key={optIdx}
                onClick={() => handleSelectOption(currentQuestionIndex, optIdx)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-4 ${
                  isSelected
                    ? "bg-[#F58220]/10 border-[#F58220] text-[#0B2D5B] dark:text-white shadow-sm"
                    : "bg-slate-50 dark:bg-white/5 border-slate-200/80 dark:border-white/10 hover:border-slate-300"
                }`}
              >
                <div
                  className={`h-6 w-6 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                    isSelected
                      ? "bg-[#F58220] border-[#F58220] text-white"
                      : "border-slate-300 dark:border-white/20"
                  }`}
                >
                  {isSelected && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                </div>
                <span className="text-xs sm:text-sm font-extrabold">{getOptionText(optText)}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Question Matrix Navigation & Action Bar */}
      <div className="bg-white dark:bg-[#0F274D] rounded-3xl p-6 border border-slate-200/80 dark:border-white/10 shadow-sm space-y-4">
        <div className="text-xs font-bold text-slate-500">التنقل السريع بين الأسئلة:</div>
        <div className="flex flex-wrap gap-2">
          {quiz.questions.map((_, idx) => {
            const isAnswered = userAnswers[idx] !== undefined;
            const isCurrent = idx === currentQuestionIndex;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentQuestionIndex(idx)}
                className={`h-9 w-9 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  isCurrent
                    ? "bg-[#0B2D5B] text-white shadow-md ring-2 ring-[#F58220]"
                    : isAnswered
                    ? "bg-emerald-500 text-white"
                    : "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10"
                }`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>

        {/* Footer Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/10 gap-3">
          <button
            type="button"
            disabled={currentQuestionIndex === 0}
            onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
            className="px-5 py-2.5 rounded-2xl border border-slate-200 dark:border-white/10 text-xs font-bold flex items-center gap-2 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
          >
            <ChevronRight className="h-4 w-4" />
            <span>السؤال السابق</span>
          </button>

          {currentQuestionIndex < totalQCount - 1 ? (
            <button
              type="button"
              onClick={() => setCurrentQuestionIndex((prev) => Math.min(totalQCount - 1, prev + 1))}
              className="px-6 py-2.5 rounded-2xl bg-[#0B2D5B] hover:bg-[#153e75] text-white text-xs font-bold flex items-center gap-2 cursor-pointer"
            >
              <span>السؤال التالي</span>
              <ChevronLeft className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setShowSubmitConfirm(true)}
              className="px-6 py-2.5 rounded-2xl bg-[#F58220] hover:bg-[#e57518] text-white text-xs font-black flex items-center gap-2 shadow-lg shadow-[#F58220]/20 cursor-pointer"
            >
              <Send className="h-4 w-4" />
              <span>إنهاء وتسليم الاختبار 🏁</span>
            </button>
          )}
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0F274D] rounded-3xl p-6 max-w-md w-full text-right space-y-4 shadow-2xl border border-slate-200 dark:border-white/10">
            <h3 className="text-base font-black text-[#0B2D5B] dark:text-white">
              تأكيد إنهاء وتسليم الاختبار
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              لقد أجبت على <strong className="text-[#F58220]">{answeredCount}</strong> من إجمالي <strong>{totalQCount}</strong> سؤال. هل أنت تأكد من تسليم الإجابات وإنهاء الاختبار الآن؟
            </p>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowSubmitConfirm(false)}
                className="flex-1 h-11 rounded-xl bg-slate-100 dark:bg-white/10 text-xs font-bold cursor-pointer"
              >
                مراجعة الإجابات
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => handleCalculateAndFinish(false)}
                className="flex-1 h-11 rounded-xl bg-[#F58220] text-white text-xs font-black shadow-md cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? "جاري التسليم..." : "تأكيد التسليم فورا"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

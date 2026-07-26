"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { HelpCircle, Clock, CheckCircle2, ArrowLeft, Play } from "lucide-react";
import { QuizItem } from "../types";
import { cn } from "@/lib/utils";

interface QuizCardProps {
  quiz: QuizItem;
  onStartQuiz?: (quiz: QuizItem) => void;
}

export function QuizCard({ quiz, onStartQuiz }: QuizCardProps) {
  const isCompleted = quiz.status === "completed";

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      className="rounded-2xl p-5 bg-white dark:bg-[#0F274D] border border-slate-200/80 dark:border-white/10 shadow-sm hover:shadow-md transition-all text-right flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-white/10 px-2.5 py-1 rounded-lg">
            {quiz.subject}
          </span>
          <span
            className={cn(
              "text-xs font-bold px-2.5 py-1 rounded-full border",
              isCompleted
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                : "bg-[#F58220]/10 text-[#F58220] border-[#F58220]/20"
            )}
          >
            {isCompleted ? `النتيجة: ${quiz.score}/${quiz.maxScore}` : `الموعد: ${quiz.dueDate}`}
          </span>
        </div>

        <h3 className="text-sm font-extrabold text-[#0B2D5B] dark:text-white line-clamp-2 mb-2">
          {quiz.title}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">{quiz.courseName}</p>

        <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-4">
          <span className="flex items-center gap-1">
            <HelpCircle className="h-4 w-4 text-[#0B2D5B] dark:text-[#F58220]" />
            <span>{quiz.totalQuestions} سؤالاً</span>
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4 text-[#F58220]" />
            <span>{quiz.durationMinutes} دقيقة</span>
          </span>
        </div>
      </div>

      <div>
        {isCompleted ? (
          <div className="w-full h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center justify-center gap-2 border border-emerald-500/20">
            <CheckCircle2 className="h-4 w-4" />
            <span>مكتمل بنجاح</span>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => onStartQuiz?.(quiz)}
            className="w-full h-10 rounded-xl bg-[#0B2D5B] dark:bg-[#1E73D8] hover:bg-[#F58220] dark:hover:bg-[#F58220] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-colors"
          >
            <Play className="h-4 w-4 fill-current" />
            <span>بدء الاختبار الآن</span>
            <ArrowLeft className="h-4 w-4" />
          </button>
        )}
      </div>
    </motion.div>
  );
}

export default QuizCard;

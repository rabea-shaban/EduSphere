"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { HelpCircle, Clock, CheckCircle2, ArrowLeft, Play, Lock, Trophy, BarChart2 } from "lucide-react";
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
      className={cn(
        "rounded-3xl p-6 border shadow-sm hover:shadow-md transition-all text-right flex flex-col justify-between relative overflow-hidden",
        isCompleted
          ? "bg-emerald-50/30 dark:bg-[#0F274D] border-emerald-500/30"
          : "bg-white dark:bg-[#0F274D] border-slate-200/80 dark:border-white/10"
      )}
    >
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-white/10 px-3 py-1 rounded-xl">
            {quiz.subject}
          </span>
          <span
            className={cn(
              "text-xs font-black px-3 py-1 rounded-full border flex items-center gap-1",
              isCompleted
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                : "bg-[#F58220]/10 text-[#F58220] border-[#F58220]/20"
            )}
          >
            {isCompleted ? (
              <>
                <Lock className="h-3.5 w-3.5 text-emerald-600" />
                <span>مُغلق - تم التسليم</span>
              </>
            ) : (
              `الموعد: ${quiz.dueDate}`
            )}
          </span>
        </div>

        <h3 className="text-base font-black text-[#0B2D5B] dark:text-white line-clamp-2 mb-1">
          {quiz.title}
        </h3>
        <p className="text-xs font-semibold text-slate-400 mb-4">{quiz.courseName}</p>

        {isCompleted ? (
          <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-500/20 flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-amber-500 shrink-0" />
              <div>
                <div className="text-[11px] font-bold text-slate-400">درجتك المحققة</div>
                <div className="text-sm font-black text-emerald-600">
                  %{quiz.percentage ?? quiz.score ?? 100}
                </div>
              </div>
            </div>

            <div className="text-left">
              <div className="text-[11px] font-bold text-slate-400">ترتيبك بالاختبار</div>
              <div className="text-xs font-black text-[#0B2D5B] dark:text-white">
                {quiz.rank ? `المركز #${quiz.rank}` : "المركز الأول"}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4 text-xs font-bold text-slate-500 dark:text-slate-400 mb-4">
            <span className="flex items-center gap-1">
              <HelpCircle className="h-4 w-4 text-[#0B2D5B] dark:text-[#F58220]" />
              <span>{quiz.totalQuestions} سؤالاً</span>
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4 text-[#F58220]" />
              <span>{quiz.durationMinutes} دقيقة</span>
            </span>
          </div>
        )}
      </div>

      <div>
        {isCompleted ? (
          <Link
            href={`/dashboard/quizzes/${quiz.id}`}
            className="w-full h-11 rounded-2xl bg-slate-100 dark:bg-white/10 hover:bg-[#0B2D5B] hover:text-white text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <BarChart2 className="h-4 w-4 text-[#F58220]" />
            <span>استعراض النتيجة والتصحيح النموذجِي</span>
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => onStartQuiz?.(quiz)}
            className="w-full h-11 rounded-2xl bg-gradient-to-r from-[#F58220] to-[#FF9A2A] hover:from-[#e57518] hover:to-[#f08d1f] text-white text-xs font-black flex items-center justify-center gap-2 shadow-md shadow-[#F58220]/20 transition-all cursor-pointer"
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

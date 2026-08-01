"use client";

import * as React from "react";
import {
  X,
  Trophy,
  Medal,
  Clock,
  Search,
  CheckCircle2,
  XCircle,
  Award,
  Loader2,
  Users,
  Sparkles,
} from "lucide-react";
import { useQuizLeaderboard } from "@/hooks/useQuizzes";
import type { ApiQuiz } from "@/features/teacher/types/quiz";
import type { LeaderboardEntry } from "@/services/quiz.service";

interface QuizLeaderboardModalProps {
  quiz: ApiQuiz | null;
  isOpen: boolean;
  onClose: () => void;
}

export function QuizLeaderboardModal({ quiz, isOpen, onClose }: QuizLeaderboardModalProps) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const quizId = quiz?._id || "";
  const { data: leaderboard, isLoading } = useQuizLeaderboard(quizId);

  if (!isOpen || !quiz) return null;

  const list: LeaderboardEntry[] = leaderboard || [];

  const filteredList = list.filter((item) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    const fullName = `${item.student?.firstName || ""} ${item.student?.lastName || ""}`.toLowerCase();
    const username = (item.student?.username || "").toLowerCase();
    const email = (item.student?.email || "").toLowerCase();
    return fullName.includes(term) || username.includes(term) || email.includes(term);
  });

  const topThree = list.slice(0, 3);
  const firstPlace = topThree[0];
  const secondPlace = topThree[1];
  const thirdPlace = topThree[2];

  const formatDuration = (totalSeconds: number) => {
    if (!totalSeconds || totalSeconds <= 0) return "أقل من دقيقة";
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    if (mins === 0) return `${secs} ثانية`;
    return `${mins} دقيقة ${secs > 0 ? `و ${secs}ث` : ""}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />

      <div className="relative w-full max-w-3xl bg-white dark:bg-[#0B2D5B] rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden flex flex-col max-h-[90vh] text-right dir-rtl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-white/10 shrink-0 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent">
          <div className="flex items-center gap-3">
            <span className="h-12 w-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/25 shrink-0">
              <Trophy className="h-6 w-6" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-[#0B2D5B] dark:text-white">
                  لوحة الشرف والأوائل 🏆
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[11px] font-bold border border-amber-500/20">
                  {list.length} مشاركاً
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-md mt-0.5">
                اختبار: <strong className="text-slate-700 dark:text-slate-200">{quiz.title}</strong>
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

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {isLoading ? (
            <div className="py-16 text-center flex flex-col items-center justify-center gap-3">
              <Loader2 className="h-8 w-8 text-amber-500 animate-spin" />
              <p className="text-xs font-bold text-slate-500">جاري ترتيب نتائج الطلاب ولوحة الشرف...</p>
            </div>
          ) : list.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <div className="h-16 w-16 rounded-full bg-slate-100 dark:bg-white/5 mx-auto flex items-center justify-center text-slate-400">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="text-base font-bold text-[#0B2D5B] dark:text-white">
                لا يوجد مشاركات في هذا الاختبار حتى الآن
              </h3>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                بمجرد أن يُكمل الطلاب الإجابة على الأسئلة، ستظهر أسماؤهم ودرجاتهم هنا مرتبة حسب الأعلى أداءً 🎯
              </p>
            </div>
          ) : (
            <>
              {/* Top 3 Podium Cards */}
              {topThree.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 pb-2">
                  {/* 2nd Place */}
                  {secondPlace && (
                    <div className="order-2 sm:order-1 p-4 rounded-2xl bg-gradient-to-b from-slate-100 to-slate-50 dark:from-slate-800/60 dark:to-slate-900/60 border border-slate-300/60 dark:border-white/10 text-center relative flex flex-col justify-between overflow-hidden shadow-sm">
                      <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-slate-300/30 text-slate-700 dark:text-slate-300 text-[10px] font-black">
                        المركز #2 🥈
                      </span>
                      <div className="pt-4 pb-2">
                        <div className="h-12 w-12 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 mx-auto flex items-center justify-center font-black text-lg border-2 border-slate-300 mb-2">
                          {secondPlace.student?.firstName?.[0] || "ط"}
                        </div>
                        <h4 className="text-xs font-black text-[#0B2D5B] dark:text-white truncate">
                          {secondPlace.student?.firstName} {secondPlace.student?.lastName}
                        </h4>
                        <p className="text-[10px] text-slate-400 truncate">
                          @{secondPlace.student?.username || "طالب"}
                        </p>
                      </div>
                      <div className="p-2 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/50 dark:border-white/10 flex items-center justify-between text-xs">
                        <span className="font-black text-[#F58220]" dir="ltr">%{secondPlace.percentage}</span>
                        <span className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDuration(secondPlace.timeTaken)}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* 1st Place Gold */}
                  {firstPlace && (
                    <div className="order-1 sm:order-2 p-5 rounded-2xl bg-gradient-to-b from-amber-500/15 via-amber-500/5 to-white dark:to-slate-900 border-2 border-amber-500/50 text-center relative flex flex-col justify-between overflow-hidden shadow-lg shadow-amber-500/10">
                      <span className="absolute top-2 right-2 px-2.5 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-black shadow-md flex items-center gap-1">
                        <Sparkles className="h-3 w-3" />
                        المركز #1 🥇
                      </span>
                      <div className="pt-4 pb-2">
                        <div className="h-14 w-14 rounded-full bg-amber-500 text-white mx-auto flex items-center justify-center font-black text-xl border-4 border-amber-300 shadow-md mb-2">
                          {firstPlace.student?.firstName?.[0] || "ط"}
                        </div>
                        <h4 className="text-sm font-black text-[#0B2D5B] dark:text-white truncate">
                          {firstPlace.student?.firstName} {firstPlace.student?.lastName}
                        </h4>
                        <p className="text-[10px] text-amber-600 dark:text-amber-400 font-bold truncate">
                          @{firstPlace.student?.username || "الأول على الاختبار"}
                        </p>
                      </div>
                      <div className="p-2.5 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 border border-amber-500/30 flex items-center justify-between text-xs">
                        <span className="font-black text-amber-600 dark:text-amber-400 text-sm" dir="ltr">
                          %{firstPlace.percentage}
                        </span>
                        <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDuration(firstPlace.timeTaken)}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* 3rd Place Bronze */}
                  {thirdPlace && (
                    <div className="order-3 p-4 rounded-2xl bg-gradient-to-b from-amber-700/10 to-slate-50 dark:to-slate-900/60 border border-amber-700/30 text-center relative flex flex-col justify-between overflow-hidden shadow-sm">
                      <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-amber-700/20 text-amber-800 dark:text-amber-300 text-[10px] font-black">
                        المركز #3 🥉
                      </span>
                      <div className="pt-4 pb-2">
                        <div className="h-12 w-12 rounded-full bg-amber-800/20 text-amber-800 dark:text-amber-300 mx-auto flex items-center justify-center font-black text-lg border-2 border-amber-700/40 mb-2">
                          {thirdPlace.student?.firstName?.[0] || "ط"}
                        </div>
                        <h4 className="text-xs font-black text-[#0B2D5B] dark:text-white truncate">
                          {thirdPlace.student?.firstName} {thirdPlace.student?.lastName}
                        </h4>
                        <p className="text-[10px] text-slate-400 truncate">
                          @{thirdPlace.student?.username || "طالب"}
                        </p>
                      </div>
                      <div className="p-2 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/50 dark:border-white/10 flex items-center justify-between text-xs">
                        <span className="font-black text-[#F58220]" dir="ltr">%{thirdPlace.percentage}</span>
                        <span className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDuration(thirdPlace.timeTaken)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Search Bar & Full Table */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="البحث برقم الطالب أو الاسم..."
                      className="w-full h-10 pr-10 pl-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-xs text-[#0B2D5B] dark:text-white focus:outline-none focus:border-amber-500 transition-colors"
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-400 shrink-0">
                    إجمالي النتائج: {filteredList.length}
                  </span>
                </div>

                <div className="rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-right text-xs">
                      <thead className="bg-slate-50 dark:bg-white/5 border-b border-slate-200 dark:border-white/10 text-slate-500 font-bold">
                        <tr>
                          <th className="p-3 text-center w-14">الترتيب</th>
                          <th className="p-3">اسم الطالب</th>
                          <th className="p-3 text-center">النتيجة النهائية</th>
                          <th className="p-3 text-center">النسبة المئوية</th>
                          <th className="p-3 text-center">زمن الحل</th>
                          <th className="p-3 text-center">الحالة</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-white/5 font-semibold text-slate-700 dark:text-slate-200">
                        {filteredList.map((entry) => {
                          const isTopOne = entry.rank === 1;
                          const isTopTwo = entry.rank === 2;
                          const isTopThree = entry.rank === 3;

                          return (
                            <tr
                              key={entry.rank}
                              className={`hover:bg-slate-50/80 dark:hover:bg-white/5 transition-colors ${
                                isTopOne
                                  ? "bg-amber-500/5 dark:bg-amber-500/10 font-bold"
                                  : ""
                              }`}
                            >
                              {/* Rank */}
                              <td className="p-3 text-center">
                                {isTopOne ? (
                                  <span className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-amber-500 text-white font-black text-xs shadow-sm">
                                    🥇 1
                                  </span>
                                ) : isTopTwo ? (
                                  <span className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-slate-300 text-slate-800 font-black text-xs">
                                    🥈 2
                                  </span>
                                ) : isTopThree ? (
                                  <span className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-amber-800/30 text-amber-800 dark:text-amber-300 font-black text-xs">
                                    🥉 3
                                  </span>
                                ) : (
                                  <span className="text-slate-400 font-bold">#{entry.rank}</span>
                                )}
                              </td>

                              {/* Student info */}
                              <td className="p-3">
                                <div className="flex items-center gap-2.5">
                                  <div className="h-8 w-8 rounded-full bg-[#0B2D5B] text-white flex items-center justify-center font-black text-xs shrink-0">
                                    {entry.student?.firstName?.[0] || "ط"}
                                  </div>
                                  <div>
                                    <div className="font-black text-[#0B2D5B] dark:text-white">
                                      {entry.student?.firstName} {entry.student?.lastName}
                                    </div>
                                    <div className="text-[10px] text-slate-400">
                                      @{entry.student?.username || "طالب"}
                                    </div>
                                  </div>
                                </div>
                              </td>

                              {/* Score */}
                              <td className="p-3 text-center font-black text-[#0B2D5B] dark:text-white" dir="ltr">
                                {entry.score}
                              </td>

                              {/* Percentage */}
                              <td className="p-3 text-center font-black text-[#F58220]" dir="ltr">
                                %{entry.percentage}
                              </td>

                              {/* Time Taken */}
                              <td className="p-3 text-center text-slate-500 dark:text-slate-400">
                                <span className="inline-flex items-center gap-1">
                                  <Clock className="h-3.5 w-3.5 text-slate-400" />
                                  {formatDuration(entry.timeTaken)}
                                </span>
                              </td>

                              {/* Status */}
                              <td className="p-3 text-center">
                                <span
                                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                                    entry.passed
                                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                                      : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
                                  }`}
                                >
                                  {entry.passed ? (
                                    <>
                                      <CheckCircle2 className="h-3 w-3" />
                                      <span>ناجح</span>
                                    </>
                                  ) : (
                                    <>
                                      <XCircle className="h-3 w-3" />
                                      <span>لم يجتز</span>
                                    </>
                                  )}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </>
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

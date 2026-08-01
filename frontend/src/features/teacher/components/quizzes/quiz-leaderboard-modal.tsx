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
  Send,
  HeartHandshake,
  MessageSquare,
} from "lucide-react";
import { useQuizLeaderboard } from "@/hooks/useQuizzes";
import type { ApiQuiz } from "@/features/teacher/types/quiz";
import type { LeaderboardEntry } from "@/services/quiz.service";
import api from "@/services/api";
import { toast } from "react-hot-toast";

interface QuizLeaderboardModalProps {
  quiz: ApiQuiz | null;
  isOpen: boolean;
  onClose: () => void;
}

export function QuizLeaderboardModal({ quiz, isOpen, onClose }: QuizLeaderboardModalProps) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [congratulateTarget, setCongratulateTarget] = React.useState<LeaderboardEntry | null>(null);
  const [congratMessage, setCongratMessage] = React.useState("");
  const [isSending, setIsSending] = React.useState(false);

  const quizId = quiz?._id || "";
  const { data: leaderboard, isLoading } = useQuizLeaderboard(quizId);

  // Set default congratulate message when target selected
  React.useEffect(() => {
    if (congratulateTarget && quiz) {
      const studentName = `${congratulateTarget.student?.firstName || ""} ${congratulateTarget.student?.lastName || ""}`.trim() || "عزيزي الطالب";
      setCongratMessage(
        `مرحباً ${studentName}! 🎉\nأحسنت صنعاً بحصولك على المركز #${congratulateTarget.rank} بنسبة %${congratulateTarget.percentage} في اختبار "${quiz.title}"!\nنعتز بتفوقك واجتهادك الرائع ونرجو لك دوام التوفيق والتميز ✨`
      );
    }
  }, [congratulateTarget, quiz]);

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

  const handleSendCongratulation = async () => {
    if (!congratulateTarget || !congratulateTarget.student?._id) return;

    try {
      setIsSending(true);
      const studentId = congratulateTarget.student._id;

      await api.post("/notifications", {
        recipientId: studentId,
        title: `تهانينا على تفوقك في اختبار "${quiz.title}"! 🎉`,
        message: congratMessage,
        type: "Quiz",
        priority: "High",
      });

      toast.success(`تم إرسال رسالة التهنئة بنجاح لـ ${congratulateTarget.student.firstName} 💌🎉`);
      setCongratulateTarget(null);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "تعذر إرسال التهنئة حالياً");
    } finally {
      setIsSending(false);
    }
  };

  // Helper for Student Avatar
  const renderStudentAvatar = (student: LeaderboardEntry["student"], rank: number, size = "h-12 w-12 text-base") => {
    const avatarUrl = student?.avatar;
    const initials = student?.firstName?.[0] || "ط";

    let borderClass = "border-slate-300 dark:border-slate-700 bg-[#0B2D5B] text-white";
    if (rank === 1) borderClass = "border-amber-400 bg-amber-500 text-white shadow-md shadow-amber-500/30";
    if (rank === 2) borderClass = "border-slate-300 bg-slate-400 text-white shadow-md";
    if (rank === 3) borderClass = "border-amber-700/50 bg-amber-800 text-amber-100 shadow-md";

    if (avatarUrl && typeof avatarUrl === "string" && (avatarUrl.startsWith("http") || avatarUrl.startsWith("/"))) {
      return (
        <img
          src={avatarUrl}
          alt={student?.firstName || "طالب"}
          className={`${size} rounded-full object-cover border-2 ${borderClass} shrink-0`}
        />
      );
    }

    return (
      <div className={`${size} rounded-full border-2 ${borderClass} flex items-center justify-center font-black shrink-0`}>
        {initials}
      </div>
    );
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />

        <div className="relative w-full max-w-4xl bg-white dark:bg-[#0B2D5B] rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden flex flex-col max-h-[90vh] text-right dir-rtl">
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
                  <span className="px-3 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold border border-amber-500/20">
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
                <p className="text-xs font-bold text-slate-500">جاري تحميل نتائج الاختبار ولوحة الأوائل...</p>
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
                  بمجرد أن يُكمل الطلاب الإجابة على الأسئلة، ستظهر أسماؤهم وصورهم هنا مرتبة حسب الأعلى أداءً 🎯
                </p>
              </div>
            ) : (
              <>
                {/* Podium Grid (Dynamic centered grid depending on count) */}
                {topThree.length > 0 && (
                  <div
                    className={`grid gap-4 pt-2 pb-2 ${
                      topThree.length === 1
                        ? "grid-cols-1 max-w-sm mx-auto"
                        : topThree.length === 2
                        ? "grid-cols-1 sm:grid-cols-2 max-w-xl mx-auto"
                        : "grid-cols-1 sm:grid-cols-3"
                    }`}
                  >
                    {/* 2nd Place */}
                    {secondPlace && (
                      <div className="order-2 sm:order-1 p-5 rounded-3xl bg-gradient-to-b from-slate-100 via-slate-50 to-white dark:from-slate-800/60 dark:via-slate-900/60 dark:to-[#0F274D] border border-slate-200 dark:border-white/10 text-center relative flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-md transition-all">
                        <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-[11px] font-black">
                          المركز #2 🥈
                        </span>
                        <div className="pt-5 pb-3">
                          <div className="mx-auto flex justify-center mb-2">
                            {renderStudentAvatar(secondPlace.student, 2, "h-14 w-14 text-lg")}
                          </div>
                          <h4 className="text-sm font-black text-[#0B2D5B] dark:text-white truncate px-2">
                            {secondPlace.student?.firstName} {secondPlace.student?.lastName}
                          </h4>
                          <p className="text-[11px] text-slate-400 truncate">
                            @{secondPlace.student?.username || "طالب"}
                          </p>
                        </div>
                        <div className="space-y-2">
                          <div className="p-2.5 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/50 dark:border-white/10 flex items-center justify-between text-xs">
                            <span className="font-black text-[#F58220]" dir="ltr">%{secondPlace.percentage}</span>
                            <span className="text-[10px] text-slate-400 flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatDuration(secondPlace.timeTaken)}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => setCongratulateTarget(secondPlace)}
                            className="w-full h-8 rounded-xl bg-slate-200/70 hover:bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <HeartHandshake className="h-3.5 w-3.5 text-slate-600 dark:text-slate-300" />
                            <span>إرسال تهنئة 💌</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* 1st Place Gold */}
                    {firstPlace && (
                      <div className="order-1 sm:order-2 p-5 rounded-3xl bg-gradient-to-b from-amber-500/20 via-amber-500/5 to-white dark:to-[#0F274D] border-2 border-amber-500/60 text-center relative flex flex-col justify-between overflow-hidden shadow-xl shadow-amber-500/10 hover:shadow-2xl transition-all">
                        <span className="absolute top-3 right-3 px-3 py-0.5 rounded-full bg-amber-500 text-white text-[11px] font-black shadow-md flex items-center gap-1">
                          <Sparkles className="h-3.5 w-3.5" />
                          المركز #1 🥇
                        </span>
                        <div className="pt-6 pb-3">
                          <div className="mx-auto flex justify-center mb-2">
                            {renderStudentAvatar(firstPlace.student, 1, "h-16 w-16 text-xl")}
                          </div>
                          <h4 className="text-base font-black text-[#0B2D5B] dark:text-white truncate px-2">
                            {firstPlace.student?.firstName} {firstPlace.student?.lastName}
                          </h4>
                          <p className="text-xs text-amber-600 dark:text-amber-400 font-bold truncate">
                            @{firstPlace.student?.username || "الأول على الاختبار"}
                          </p>
                        </div>
                        <div className="space-y-2">
                          <div className="p-2.5 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 border border-amber-500/30 flex items-center justify-between text-xs">
                            <span className="font-black text-amber-600 dark:text-amber-400 text-sm" dir="ltr">
                              %{firstPlace.percentage}
                            </span>
                            <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300 flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              {formatDuration(firstPlace.timeTaken)}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => setCongratulateTarget(firstPlace)}
                            className="w-full h-9 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-black flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/25 transition-colors cursor-pointer"
                          >
                            <Send className="h-3.5 w-3.5" />
                            <span>إرسال تهنئة للأول 💌🎉</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* 3rd Place Bronze */}
                    {thirdPlace && (
                      <div className="order-3 p-5 rounded-3xl bg-gradient-to-b from-amber-800/15 via-amber-800/5 to-white dark:to-[#0F274D] border border-amber-800/30 text-center relative flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-md transition-all">
                        <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-amber-800/20 text-amber-800 dark:text-amber-300 text-[11px] font-black">
                          المركز #3 🥉
                        </span>
                        <div className="pt-5 pb-3">
                          <div className="mx-auto flex justify-center mb-2">
                            {renderStudentAvatar(thirdPlace.student, 3, "h-14 w-14 text-lg")}
                          </div>
                          <h4 className="text-sm font-black text-[#0B2D5B] dark:text-white truncate px-2">
                            {thirdPlace.student?.firstName} {thirdPlace.student?.lastName}
                          </h4>
                          <p className="text-[11px] text-slate-400 truncate">
                            @{thirdPlace.student?.username || "طالب"}
                          </p>
                        </div>
                        <div className="space-y-2">
                          <div className="p-2.5 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/50 dark:border-white/10 flex items-center justify-between text-xs">
                            <span className="font-black text-[#F58220]" dir="ltr">%{thirdPlace.percentage}</span>
                            <span className="text-[10px] text-slate-400 flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatDuration(thirdPlace.timeTaken)}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => setCongratulateTarget(thirdPlace)}
                            className="w-full h-8 rounded-xl bg-amber-800/10 hover:bg-amber-800/20 text-amber-800 dark:text-amber-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <HeartHandshake className="h-3.5 w-3.5" />
                            <span>إرسال تهنئة 💌</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Search Bar & Full Table */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div className="relative flex-1 min-w-[220px]">
                      <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="البحث باسم الطالب أو برقم الحساب..."
                        className="w-full h-10 pr-10 pl-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-xs text-[#0B2D5B] dark:text-white focus:outline-none focus:border-amber-500 transition-colors"
                      />
                    </div>
                    <span className="text-xs font-bold text-slate-400 shrink-0">
                      إجمالي نتائج البحث: {filteredList.length}
                    </span>
                  </div>

                  <div className="rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                      <table className="w-full text-right text-xs">
                        <thead className="bg-slate-50 dark:bg-white/5 border-b border-slate-200 dark:border-white/10 text-slate-500 font-bold">
                          <tr>
                            <th className="p-3.5 text-center w-16">الترتيب</th>
                            <th className="p-3.5">اسم الطالب والحساب</th>
                            <th className="p-3.5 text-center">النتيجة</th>
                            <th className="p-3.5 text-center">النسبة المئوية</th>
                            <th className="p-3.5 text-center">زمن الحل</th>
                            <th className="p-3.5 text-center">الحالة</th>
                            <th className="p-3.5 text-center">الإجراء</th>
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
                                <td className="p-3.5 text-center">
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

                                {/* Student info with avatar */}
                                <td className="p-3.5">
                                  <div className="flex items-center gap-3">
                                    {renderStudentAvatar(entry.student, entry.rank, "h-9 w-9 text-xs")}
                                    <div className="min-w-0">
                                      <div className="font-black text-[#0B2D5B] dark:text-white line-clamp-1">
                                        {entry.student?.firstName} {entry.student?.lastName}
                                      </div>
                                      <div className="text-[10px] text-slate-400 truncate">
                                        @{entry.student?.username || "طالب"}
                                      </div>
                                    </div>
                                  </div>
                                </td>

                                {/* Score */}
                                <td className="p-3.5 text-center font-black text-[#0B2D5B] dark:text-white" dir="ltr">
                                  {entry.score}
                                </td>

                                {/* Percentage */}
                                <td className="p-3.5 text-center font-black text-[#F58220]" dir="ltr">
                                  %{entry.percentage}
                                </td>

                                {/* Time Taken */}
                                <td className="p-3.5 text-center text-slate-500 dark:text-slate-400">
                                  <span className="inline-flex items-center gap-1">
                                    <Clock className="h-3.5 w-3.5 text-slate-400" />
                                    {formatDuration(entry.timeTaken)}
                                  </span>
                                </td>

                                {/* Status */}
                                <td className="p-3.5 text-center">
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

                                {/* Send Congratulation Button */}
                                <td className="p-3.5 text-center">
                                  <button
                                    type="button"
                                    onClick={() => setCongratulateTarget(entry)}
                                    className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500 text-amber-600 hover:text-white dark:text-amber-400 text-xs font-bold flex items-center gap-1 mx-auto transition-colors cursor-pointer"
                                    title="إرسال تهنئة للطالب"
                                  >
                                    <HeartHandshake className="h-3.5 w-3.5" />
                                    <span>تهنئة 💌</span>
                                  </button>
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

      {/* Send Congratulation Modal */}
      {congratulateTarget && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setCongratulateTarget(null)} />

          <div className="relative w-full max-w-md bg-white dark:bg-[#0B2D5B] rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 p-6 text-right dir-rtl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <span className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-500">
                  <Send className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-base font-black text-[#0B2D5B] dark:text-white">
                    إرسال رسالة تهنئة للطالب 💌
                  </h3>
                  <p className="text-xs text-slate-400">
                    سيتم إرسال الإشعار فوراً لحساب الطالب في المنظومة
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setCongratulateTarget(null)}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Target Student Quick Info Card */}
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                {renderStudentAvatar(congratulateTarget.student, congratulateTarget.rank, "h-10 w-10 text-sm")}
                <div>
                  <div className="text-xs font-black text-[#0B2D5B] dark:text-white">
                    {congratulateTarget.student?.firstName} {congratulateTarget.student?.lastName}
                  </div>
                  <div className="text-[10px] text-amber-600 font-bold">
                    المركز #{congratulateTarget.rank} • النسبة %{congratulateTarget.percentage}
                  </div>
                </div>
              </div>

              <span className="px-2.5 py-1 rounded-xl bg-white dark:bg-slate-900 text-amber-500 text-xs font-black shadow-sm">
                🏆 ممتاز
              </span>
            </div>

            {/* Message Textarea */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-300">
                نص التهنئة الموجهة للطالب:
              </label>
              <textarea
                rows={4}
                value={congratMessage}
                onChange={(e) => setCongratMessage(e.target.value)}
                className="w-full p-3.5 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-xs text-[#0B2D5B] dark:text-white focus:outline-none focus:border-amber-500 leading-relaxed"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100 dark:border-white/10">
              <button
                type="button"
                onClick={() => setCongratulateTarget(null)}
                className="px-4 h-10 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-200"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={handleSendCongratulation}
                disabled={isSending || !congratMessage.trim()}
                className="px-5 h-10 rounded-xl bg-[#F58220] hover:bg-[#e57518] disabled:opacity-50 text-white text-xs font-black flex items-center gap-2 shadow-lg shadow-[#F58220]/25 transition-all cursor-pointer"
              >
                {isSending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                <span>إرسال التهنئة الآن 🚀</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

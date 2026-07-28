"use client";

import * as React from "react";
import {
  User,
  BookOpen,
  Award,
  BarChart3,
  Send,
  Award as CertIcon,
  CheckCircle2,
  Clock,
  Eye,
  Mail,
  GraduationCap,
} from "lucide-react";
import type { TeacherStudent } from "@/features/teacher/types/student";

interface StudentCardProps {
  student: TeacherStudent;
  onViewProfile: (student: TeacherStudent) => void;
  onSendNotification: (student: TeacherStudent) => void;
  onIssueCertificate: (student: TeacherStudent) => void;
}

export function StudentCard({
  student,
  onViewProfile,
  onSendNotification,
  onIssueCertificate,
}: StudentCardProps) {
  const avatarInitial = (student.fullName || student.email || "S").charAt(0).toUpperCase();

  return (
    <div className="rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#0F274D] p-5 space-y-4 hover:border-slate-300 dark:hover:border-white/20 transition-all text-right dir-rtl">
      {/* Top Header Row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-[#0B2D5B] to-[#1E73D8] text-white flex items-center justify-center font-black text-base shadow-md shrink-0">
            {avatarInitial}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-black text-[#0B2D5B] dark:text-white truncate">
                {student.fullName}
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold border bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30">
                طالب نشط
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
              <span className="flex items-center gap-1">
                <Mail className="h-3 w-3 text-slate-400" />
                {student.email}
              </span>
              {student.grade && (
                <span className="flex items-center gap-1">
                  <GraduationCap className="h-3 w-3 text-indigo-500" />
                  {student.grade}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => onViewProfile(student)}
            className="px-3 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="عرض الملف الأكاديمي والتحليلات"
          >
            <Eye className="h-4 w-4" />
            <span className="hidden sm:inline">الملف الأكاديمي</span>
          </button>

          <button
            type="button"
            onClick={() => onSendNotification(student)}
            className="p-2 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-950/40 text-slate-500 hover:text-blue-600 transition-colors cursor-pointer"
            title="إرسال إشعار / رسالة مباشرة"
            aria-label="مراسلة"
          >
            <Send className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => onIssueCertificate(student)}
            className="p-2 rounded-xl hover:bg-amber-50 dark:hover:bg-amber-950/40 text-slate-500 hover:text-amber-600 transition-colors cursor-pointer"
            title="إصدار شهادة إتمام كورس"
            aria-label="إصدار شهادة"
          >
            <CertIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-white/5 flex-wrap">
        <span className="flex items-center gap-1">
          <BookOpen className="h-3.5 w-3.5 text-indigo-500" />
          الكورسات المشترك بها: <strong>{student.enrolledCoursesCount}</strong>
        </span>
        <span className="flex items-center gap-1">
          <BarChart3 className="h-3.5 w-3.5 text-emerald-500" />
          نسبة الإكمال: <strong>{student.averageProgress}%</strong>
        </span>
        <span className="flex items-center gap-1">
          <Award className="h-3.5 w-3.5 text-amber-500" />
          متوسط الاختبارات: <strong>{student.averageQuizScore}%</strong>
        </span>
        <span className="flex items-center gap-1">
          <CertIcon className="h-3.5 w-3.5 text-violet-500" />
          الشهادات: <strong>{student.certificatesCount}</strong>
        </span>
      </div>
    </div>
  );
}

export default StudentCard;

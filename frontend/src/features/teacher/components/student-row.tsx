"use client";

import * as React from "react";
import Image from "next/image";
import { MessageSquare } from "lucide-react";
import { toast } from "react-hot-toast";

interface StudentRowProps {
  student: {
    id: string;
    name: string;
    avatar: string;
    courseName: string;
    completionPercentage: number;
    enrolledDate: string;
  };
}

export function StudentRow({ student }: StudentRowProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-[#0F274D] border border-slate-200/80 dark:border-white/10 shadow-sm text-right hover:border-[#F58220]/30 transition-all">
      {/* Left: Avatar + Info */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="relative h-10 w-10 rounded-xl overflow-hidden border border-slate-200 shrink-0">
          <Image src={student.avatar} alt={student.name} fill className="object-cover" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-xs font-bold text-[#0B2D5B] dark:text-white truncate">{student.name}</div>
          <div className="text-[11px] text-slate-400 truncate">{student.courseName}</div>
          {/* Mobile: progress bar inline */}
          <div className="sm:hidden mt-1.5 flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all"
                style={{ width: `${student.completionPercentage}%` }}
              />
            </div>
            <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 shrink-0">
              {student.completionPercentage}%
            </span>
          </div>
        </div>
      </div>

      {/* Right: completion + date + action */}
      <div className="flex items-center gap-3 sm:gap-4 shrink-0">
        {/* Desktop: completion */}
        <div className="hidden sm:flex flex-col items-end gap-1">
          <span className="text-[10px] font-bold text-slate-400">نسبة الإكمال</span>
          <div className="flex items-center gap-2">
            <div className="w-16 h-1.5 bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400"
                style={{ width: `${student.completionPercentage}%` }}
              />
            </div>
            <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
              {student.completionPercentage}%
            </span>
          </div>
        </div>

        {/* Date */}
        <div className="hidden md:block text-[10px] text-slate-400 font-bold whitespace-nowrap">
          {student.enrolledDate}
        </div>

        {/* Message button */}
        <button
          type="button"
          onClick={() => toast(`بدء محادثة مباشرة مع الطالب ${student.name} 💬`)}
          className="h-8 sm:h-9 px-2.5 sm:px-3 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-200 hover:text-[#F58220] font-bold text-xs flex items-center gap-1.5 transition-colors whitespace-nowrap"
        >
          <MessageSquare className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          <span className="hidden sm:inline">مراسلة</span>
        </button>
      </div>
    </div>
  );
}

export default StudentRow;

"use client";

import * as React from "react";
import Image from "next/image";
import { MessageSquare, Award, CheckCircle2 } from "lucide-react";

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
    <div className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-[#0F274D] border border-slate-200/80 dark:border-white/10 shadow-sm text-right hover:border-[#F58220]/30 transition-all">
      <div className="flex items-center gap-3">
        <div className="relative h-10 w-10 rounded-xl overflow-hidden border border-slate-200 shrink-0">
          <Image src={student.avatar} alt={student.name} fill className="object-cover" />
        </div>
        <div>
          <div className="text-xs font-bold text-[#0B2D5B] dark:text-white">{student.name}</div>
          <div className="text-[11px] text-slate-400">{student.courseName}</div>
        </div>
      </div>

      <div className="flex items-center gap-6 text-xs">
        <div className="hidden sm:block text-right">
          <span className="text-slate-400 text-[10px] font-bold block">نسبة الإكمال</span>
          <span className="font-extrabold text-emerald-600 dark:text-emerald-400">{student.completionPercentage}%</span>
        </div>

        <button
          type="button"
          onClick={() => alert(`بدء محادثة مباشرة مع الطالب ${student.name}`)}
          className="h-9 px-3 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-200 hover:text-[#F58220] font-bold text-xs flex items-center gap-1.5 transition-colors"
        >
          <MessageSquare className="h-4 w-4" />
          <span className="hidden sm:inline">مراسلة</span>
        </button>
      </div>
    </div>
  );
}

export default StudentRow;

"use client";

import * as React from "react";
import { Users, Sparkles } from "lucide-react";
import { StudentList } from "@/features/teacher/components/students/student-list";

export default function InstructorStudentsPage() {
  return (
    <div className="space-y-6 text-right dir-rtl max-w-6xl mx-auto pb-12">
      {/* Top Banner Header */}
      <div className="border-b border-slate-200/80 dark:border-white/10 pb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="p-2 rounded-2xl bg-indigo-500/10 text-indigo-500">
            <Sparkles className="h-5 w-5" />
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0B2D5B] dark:text-white">
            متابعة وإدارة الطلاب المشتركين
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          استعراض ملفات الطلاب، متابعة نسب إكمال المحتوى، درجات الاختبارات، إصدار الشهادات، والمراسلة المباشرة
        </p>
      </div>

      {/* Main Student List Component */}
      <StudentList />
    </div>
  );
}

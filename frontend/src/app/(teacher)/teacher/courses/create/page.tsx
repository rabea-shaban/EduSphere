"use client";

import * as React from "react";
import { CourseBuilderWizard } from "@/features/teacher";

export default function CreateCoursePage() {
  return (
    <div className="space-y-6 text-right">
      <div className="border-b border-slate-200/80 dark:border-white/10 pb-6">
        <h1 className="text-2xl sm:text-3xl font-black text-[#0B2D5B] dark:text-white">
          باني الكورسات التفاعلي 🛠️
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          قم بإضافة معلومات الكورس، تحديد السعر، وإثراء المنهج الدراسي بالدروس والمرفقات
        </p>
      </div>

      <CourseBuilderWizard />
    </div>
  );
}

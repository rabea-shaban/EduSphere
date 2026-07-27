"use client";

import * as React from "react";
import { CourseBuilderWizard } from "@/features/teacher";

export default function CreateCoursePage() {
  return (
    <div className="space-y-6 text-right dir-rtl">
      <div className="border-b border-slate-200/80 dark:border-white/10 pb-6">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0B2D5B] dark:text-white tracking-tight">
          استوديو بناء وتوثيق البرامج والمناهج التعليمية
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1.5 font-medium leading-relaxed max-w-3xl">
          قم بإضافة كافة بيانات البرامج التعليمية، ضبط خطط الاشتراك والأسعار، وإثراء الفصول والوحدات المنهجية بالدروس والمرفقات المعتمدة لطلاب منصة EduSphere.
        </p>
      </div>

      <CourseBuilderWizard />
    </div>
  );
}

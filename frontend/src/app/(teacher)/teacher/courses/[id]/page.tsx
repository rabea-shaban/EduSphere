"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { BookOpen, Users, PlusCircle, Edit, PlayCircle, HelpCircle } from "lucide-react";
import { mockTeacherCourses } from "@/features/teacher";

export default function SingleCourseManagePage() {
  const params = useParams();
  const course = mockTeacherCourses[0];

  return (
    <div className="space-y-6 text-right">
      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-white/10 pb-6">
        <div>
          <h1 className="text-2xl font-black text-[#0B2D5B] dark:text-white mb-1">
            إدارة: {course.title}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            المسار: {course.subject} | عدد الطلاب: {course.enrolledStudents} | الإيرادات: {course.revenue.toLocaleString()} ج.م
          </p>
        </div>

        <div className="flex gap-2">
          <Link
            href="/teacher/lessons/create"
            className="px-4 py-2 rounded-xl bg-[#F58220] text-white text-xs font-bold flex items-center gap-1.5 shadow-md"
          >
            <PlusCircle className="h-4 w-4" />
            <span>إضافة درس جديد</span>
          </Link>
        </div>
      </div>

      <div className="rounded-3xl p-6 bg-white dark:bg-[#0F274D] border border-slate-200/80 dark:border-white/10 space-y-4">
        <h3 className="text-base font-extrabold text-[#0B2D5B] dark:text-white">
          أقسام المنهج الدراسي المنشورة
        </h3>

        <div className="space-y-3">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <PlayCircle className="h-5 w-5 text-[#F58220]" />
              <span className="text-xs font-bold text-[#0B2D5B] dark:text-white">الدرس 1: التفكير الخوارزمي وصياغة المشاكل</span>
            </div>
            <span className="text-xs font-bold text-slate-400">45:30 دقيقة</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <PlayCircle className="h-5 w-5 text-[#F58220]" />
              <span className="text-xs font-bold text-[#0B2D5B] dark:text-white">الدرس 2: هيكل البرنامج بلغة C++ والمتغيرات</span>
            </div>
            <span className="text-xs font-bold text-slate-400">38:15 دقيقة</span>
          </div>
        </div>
      </div>
    </div>
  );
}

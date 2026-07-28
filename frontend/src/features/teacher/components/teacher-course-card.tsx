"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Users, Star, Edit, Eye, MoreVertical, Sparkles, BookOpen } from "lucide-react";
import { InstructorCourse } from "../types";
import { cn } from "@/lib/utils";

interface TeacherCourseCardProps {
  course: InstructorCourse;
  onEdit?: (course: InstructorCourse) => void;
}

export function TeacherCourseCard({ course, onEdit }: TeacherCourseCardProps) {
  const isPublished = course.status === "published";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="group rounded-3xl bg-white dark:bg-[#0F274D] border border-slate-200/80 dark:border-white/10 shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col justify-between text-right"
    >
      <div className="relative h-44 w-full overflow-hidden bg-slate-900">
        <Image
          src={course.coverImage}
          alt={course.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Status Badge */}
        <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
          <span
            className={cn(
              "text-xs font-black px-3 py-1 rounded-full border shadow-md backdrop-blur-md",
              isPublished
                ? "bg-emerald-500/90 text-white border-emerald-400/30"
                : "bg-amber-500/90 text-white border-amber-400/30"
            )}
          >
            {isPublished ? "منشور" : "مسودة"}
          </span>
          <span className="bg-[#0B2D5B]/90 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full border border-white/20">
            {course.price} ج.م
          </span>
        </div>

        {/* Bottom stats overlay */}
        <div className="absolute bottom-3 right-3 left-3 flex items-center justify-between text-xs text-white/90 font-bold z-10">
          <span className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-lg">
            <Users className="h-3.5 w-3.5 text-[#F58220]" />
            <span>{course.enrolledStudents} طالب</span>
          </span>
          <span className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-lg text-amber-300">
            <Star className="h-3.5 w-3.5 fill-current text-amber-400" />
            <span>{course.rating || "جديد"}</span>
          </span>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <span className="text-[11px] font-extrabold text-[#F58220] bg-[#F58220]/10 px-2.5 py-0.5 rounded-full inline-block mb-2">
            {course.subject} • {course.stage}
          </span>
          <h3 className="text-base font-extrabold text-[#0B2D5B] dark:text-white line-clamp-2 leading-snug mb-2 group-hover:text-[#F58220] transition-colors">
            {course.title}
          </h3>

          <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 font-semibold pt-1">
            <span>{course.totalLessons} درس</span>
            <span>•</span>
            <span>{course.totalQuizzes} اختبارات</span>
            <span>•</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">{course.revenue.toLocaleString('en-US')} ج.م إيرادات</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-white/10">
          <Link
            href={`/teacher/courses/${course.id}`}
            className="h-10 rounded-xl bg-[#0B2D5B] dark:bg-[#1E73D8] text-white text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-[#071C3B] transition-colors"
          >
            <Eye className="h-4 w-4" />
            <span>إدارة الكورس</span>
          </Link>
          <button
            type="button"
            onClick={() => onEdit?.(course)}
            className="h-10 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-800 dark:text-white text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-[#F58220] hover:text-white transition-colors"
          >
            <Edit className="h-4 w-4" />
            <span>تعديل</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default TeacherCourseCard;

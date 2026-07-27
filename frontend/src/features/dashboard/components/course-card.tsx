"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { PlayCircle, BookOpen, User, ArrowLeft, Sparkles } from "lucide-react";
import { EnrolledCourse } from "../types";
import { cn } from "@/lib/utils";

interface CourseCardProps {
  course: EnrolledCourse;
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="group rounded-3xl bg-white dark:bg-[#0F274D] border border-slate-200/80 dark:border-white/10 shadow-sm hover:shadow-2xl hover:shadow-[#0B2D5B]/10 dark:hover:shadow-black/50 transition-all duration-300 overflow-hidden flex flex-col justify-between text-right"
    >
      {/* Cover Image */}
      <div className="relative h-44 w-full overflow-hidden bg-slate-900">
        <Image
          src={course.coverImage}
          alt={course.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Category & Badge Overlay */}
        <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
          <span className="bg-[#0B2D5B]/90 backdrop-blur-md border border-white/20 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-md">
            {course.subject}
          </span>
          {course.isFeatured && (
            <span className="bg-gradient-to-r from-[#F58220] to-[#FF9A2A] text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
              <Sparkles className="h-3 w-3" /> مميز
            </span>
          )}
        </div>

        {/* Stage tag */}
        <div className="absolute bottom-3 right-3 left-3 flex items-center justify-between text-xs text-white/90 font-semibold z-10">
          <span className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-lg">
            <BookOpen className="h-3.5 w-3.5 text-[#F58220]" />
            <span>{course.totalLessons} درس</span>
          </span>
          <span className="text-emerald-400 font-extrabold bg-emerald-950/60 backdrop-blur-md px-2.5 py-1 rounded-lg">
            مكتمل {course.progressPercentage}%
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3 className="text-base font-extrabold text-[#0B2D5B] dark:text-white line-clamp-2 leading-snug mb-2 group-hover:text-[#F58220] transition-colors">
            {course.title}
          </h3>

          {/* Teacher info */}
          <div className="flex items-center gap-2.5 text-xs text-slate-500 dark:text-slate-400 mb-3">
            <div className="relative h-6 w-6 rounded-full overflow-hidden border border-slate-200 dark:border-white/20 shrink-0">
              <Image src={course.teacherAvatar} alt={course.teacherName} fill className="object-cover" />
            </div>
            <span className="font-semibold">{course.teacherName}</span>
          </div>

          {/* Next Lesson snippet */}
          <div className="bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-xl p-3 text-xs">
            <div className="text-slate-400 dark:text-slate-400 text-[10px] font-bold mb-1">الدرس القادم:</div>
            <div className="font-bold text-[#0B2D5B] dark:text-slate-200 truncate">
              {course.nextLessonTitle}
            </div>
          </div>
        </div>

        {/* Progress Bar & CTA */}
        <div className="space-y-3 pt-2">
          <div className="w-full bg-slate-100 dark:bg-white/10 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#0B2D5B] to-[#F58220] h-full rounded-full transition-all duration-500"
              style={{ width: `${course.progressPercentage}%` }}
            />
          </div>

          <Link
            href={`/dashboard/courses/${course.id}`}
            className="w-full h-11 rounded-xl bg-gradient-to-r from-[#F58220] to-[#FF9A2A] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-[#F58220]/20 hover:shadow-lg hover:shadow-[#F58220]/30 hover:-translate-y-0.5 active:translate-y-0 transition-all"
          >
            <PlayCircle className="h-4.5 w-4.5" />
            <span>متابعة التعلم</span>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default CourseCard;

"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { PlayCircle, BookOpen, ArrowLeft, Sparkles, CheckCircle2, Code2 } from "lucide-react";
import { EnrolledCourse } from "../types";

interface CourseCardProps {
  course: EnrolledCourse;
}

export function CourseCard({ course }: CourseCardProps) {
  // Check if cover image is a person's avatar vs course cover thumbnail
  const isPersonalAvatar =
    !course.coverImage ||
    course.coverImage.includes("dicebear") ||
    course.coverImage.includes("avatar") ||
    course.coverImage.includes("user");

  const defaultCourseCover =
    course.category === "cs"
      ? "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80"
      : course.subject.includes("فيزياء") || course.subject.includes("رياضيات")
      ? "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop&q=80"
      : "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80";

  const coverSrc = isPersonalAvatar ? defaultCourseCover : course.coverImage;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className="group rounded-3xl bg-white dark:bg-[#0F274D] border border-slate-200/90 dark:border-white/10 shadow-sm hover:shadow-2xl hover:shadow-[#0B2D5B]/15 dark:hover:shadow-black/60 transition-all duration-300 overflow-hidden flex flex-col justify-between text-right"
    >
      {/* Cover Image & Header Banner */}
      <div className="relative h-48 w-full overflow-hidden bg-[#071C3B]">
        <Image
          src={coverSrc}
          alt={course.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700 brightness-95 group-hover:brightness-100"
        />
        {/* Rich Dual Dark Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#071C3B] via-[#071C3B]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B2D5B]/30 via-transparent to-black/20" />

        {/* Top Badges */}
        <div className="absolute top-3.5 right-3.5 left-3.5 flex items-center justify-between z-10">
          <span className="bg-[#0B2D5B]/90 backdrop-blur-md border border-white/20 text-white text-[11px] font-black px-3.5 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
            <Code2 className="h-3.5 w-3.5 text-[#F58220]" />
            <span>{course.subject || "مسار تعليمي"}</span>
          </span>

          {course.isFeatured ? (
            <span className="bg-gradient-to-r from-[#F58220] to-[#FF9A2A] text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5 animate-pulse" />
              <span>متميز</span>
            </span>
          ) : (
            <span className="bg-emerald-500/90 backdrop-blur-md text-white text-[10px] font-extrabold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" />
              <span>مسجل</span>
            </span>
          )}
        </div>

        {/* Bottom Banner Stats Overlay */}
        <div className="absolute bottom-3 right-3.5 left-3.5 flex items-center justify-between text-xs text-white z-10">
          <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-md border border-white/10 px-3 py-1 rounded-xl text-[11px] font-bold text-blue-100">
            <BookOpen className="h-3.5 w-3.5 text-[#F58220]" />
            <span>{course.completedLessons} من {course.totalLessons} دروس</span>
          </div>

          <div className="bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 backdrop-blur-md px-3 py-1 rounded-xl text-[11px] font-black">
            {course.progressPercentage === 100 ? "مكتمل 100%" : `${course.progressPercentage}% إنجاز`}
          </div>
        </div>
      </div>

      {/* Course Body Content */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
        <div className="space-y-3">
          {/* Course Title */}
          <h3 className="text-base sm:text-lg font-black text-[#0B2D5B] dark:text-white line-clamp-2 leading-snug group-hover:text-[#F58220] transition-colors">
            {course.title}
          </h3>

          {/* Teacher Row */}
          <div className="flex items-center gap-3 pt-1">
            <div className="relative h-8 w-8 rounded-full overflow-hidden border-2 border-[#F58220] shadow-sm shrink-0 bg-slate-900">
              <Image
                src={course.teacherAvatar}
                alt={course.teacherName}
                fill
                className="object-cover"
                onError={(e) => {
                  const fallback = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(course.teacherName)}`;
                  if (e.currentTarget.src !== fallback) {
                    e.currentTarget.src = fallback;
                  }
                }}
              />
            </div>
            <div className="space-y-0.5">
              <div className="text-[10px] text-slate-400 font-bold">المعلم والمدرب:</div>
              <div className="text-xs font-black text-slate-700 dark:text-slate-200">
                {course.teacherName}
              </div>
            </div>
          </div>

          {/* Next Lesson Box */}
          <div className="bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 rounded-2xl p-3.5 text-xs">
            <div className="text-slate-400 dark:text-slate-400 text-[10px] font-extrabold mb-1">
              الدرس الحالي في المسار:
            </div>
            <div className="font-bold text-[#0B2D5B] dark:text-slate-100 truncate">
              {course.nextLessonTitle || "تابع الدروس القادمة في هذا الكورس"}
            </div>
          </div>
        </div>

        {/* Progress Bar & Action CTA */}
        <div className="space-y-3 pt-2">
          {/* Progress Bar */}
          <div className="space-y-1">
            <div className="w-full bg-slate-100 dark:bg-white/10 h-2.5 rounded-full overflow-hidden p-0.5">
              <div
                className="bg-gradient-to-r from-[#0B2D5B] via-[#1E73D8] to-[#F58220] h-full rounded-full transition-all duration-500 shadow-sm"
                style={{ width: `${Math.max(5, course.progressPercentage)}%` }}
              />
            </div>
          </div>

          {/* Action CTA Button */}
          <Link
            href={`/dashboard/courses/${course.id}`}
            className="w-full h-12 rounded-2xl bg-gradient-to-r from-[#F58220] via-[#FF9A2A] to-[#F58220] bg-[length:200%_auto] hover:bg-right text-white text-xs font-black flex items-center justify-center gap-2 shadow-md shadow-[#F58220]/25 hover:shadow-lg hover:shadow-[#F58220]/40 transition-all duration-300 cursor-pointer"
          >
            <PlayCircle className="h-4.5 w-4.5" />
            <span>متابعة التعلم والدرس الحالي</span>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default CourseCard;

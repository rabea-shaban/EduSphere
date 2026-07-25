"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, UserCheck } from "lucide-react";
import type { Course, SubjectBadgeVariant } from "./types";
import { cn } from "@/lib/utils";

interface CourseCardProps {
  course: Course;
  index: number;
}

const BADGE_VARIANT_STYLES: Record<SubjectBadgeVariant, string> = {
  orange: "bg-[#F58220] text-white",
  blue: "bg-[#1E73D8] text-white",
  purple: "bg-[#6366F1] text-white",
  red: "bg-[#EF4444] text-white",
};

export function CourseCard({ course, index }: CourseCardProps) {
  const badgeClass = BADGE_VARIANT_STYLES[course.subjectVariant] || BADGE_VARIANT_STYLES.blue;

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -6 }}
      className="group relative flex flex-col justify-between h-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[20px] shadow-[0_8px_30px_rgba(11,45,91,0.06)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.35)] hover:shadow-[0_20px_40px_rgba(11,45,91,0.12)] dark:hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)] transition-all duration-300 overflow-hidden select-none"
    >
      <Link href={course.href} className="flex flex-col h-full">

        {/* Top Thumbnail Image & Subject Badge */}
        <div className="relative w-full aspect-[16/9] overflow-hidden bg-slate-100 dark:bg-slate-800">
          <Image
            src={course.imageSrc}
            alt={course.imageAlt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
            priority={index < 2}
          />

          {/* Subject Badge (Top-Right in RTL) */}
          <div className="absolute top-3 right-3 z-10">
            <span
              className={cn(
                "px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-md tracking-wide",
                badgeClass
              )}
              style={{ fontFamily: "'Cairo', sans-serif" }}
            >
              {course.subjectBadge}
            </span>
          </div>
        </div>

        {/* Card Body & Information */}
        <div className="p-5 flex flex-col justify-between flex-1 space-y-4 text-right">

          {/* Course Title */}
          <h3
            className="text-base sm:text-lg font-black text-[#0B2D5B] dark:text-white leading-snug group-hover:text-[#1E73D8] dark:group-hover:text-blue-400 transition-colors"
            style={{ fontFamily: "'Cairo', sans-serif" }}
          >
            {course.title}
          </h3>

          {/* Teacher Row */}
          <div className="flex items-center justify-end gap-1.5 text-xs sm:text-sm font-bold text-[#64748B] dark:text-slate-400">
            <span style={{ fontFamily: "'Cairo', sans-serif" }}>{course.teacherName}</span>
            <UserCheck className="h-4 w-4 shrink-0 text-slate-400 dark:text-slate-500" />
          </div>

          {/* Bottom Footer: Students Count & Star Ratings */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            {/* Students Count (RTL Right side) */}
            <span
              className="text-xs sm:text-sm font-extrabold text-[#0B2D5B] dark:text-slate-200"
              style={{ fontFamily: "'Cairo', sans-serif" }}
            >
              {course.studentsCount}
            </span>

            {/* Rating Stars & Value (RTL Left side) */}
            <div className="flex items-center gap-1.5">
              {/* 5 Golden Stars */}
              <div className="flex items-center gap-0.5 text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span
                className="text-xs sm:text-sm font-extrabold text-[#0B2D5B] dark:text-white"
                style={{ fontFamily: "'Cairo', sans-serif" }}
              >
                {course.rating.toFixed(1)}
              </span>
            </div>
          </div>

        </div>

      </Link>
    </motion.div>
  );
}

export default CourseCard;

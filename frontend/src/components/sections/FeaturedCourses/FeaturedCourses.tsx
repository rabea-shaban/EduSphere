"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { FeaturedCoursesProps } from "./types";
import { DEFAULT_FEATURED_COURSES } from "./mock-data";
import { CourseSlider } from "./CourseSlider";
import {
  SectionWrapper,
  SectionContainer,
  SectionHeader,
  SectionTitle,
  SectionDescription,
} from "@/components/layout/section-layout";
import { cn } from "@/lib/utils";

export function FeaturedCourses({
  title = "كورسات مميزة",
  subtitle = "اختر من أفضل الكورسات في جميع المواد",
  courses = DEFAULT_FEATURED_COURSES,
  allCoursesText = "عرض جميع الكورسات",
  allCoursesHref = "/courses",
  className,
}: FeaturedCoursesProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % courses.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + courses.length) % courses.length);
  };

  return (
    <SectionWrapper aria-label="كورسات مميزة" className={cn("bg-slate-50/60 dark:bg-slate-950/40", className)}>
      <SectionContainer>

        {/* Section Header with Navigation Controls */}
        <SectionHeader className="max-w-none w-full">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 w-full">

            {/* Left Side (RTL): "View All Courses" Button */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="order-3 md:order-1"
            >
              <Link
                href={allCoursesHref}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#1E73D8] text-[#1E73D8] dark:border-blue-500 dark:text-blue-400 hover:bg-[#1E73D8] hover:text-white dark:hover:bg-blue-600 dark:hover:text-white font-bold text-xs sm:text-sm transition-all duration-300 shadow-sm cursor-pointer"
                style={{ fontFamily: "'Cairo', sans-serif" }}
              >
                <ChevronLeft className="h-4 w-4 shrink-0" />
                <span>{allCoursesText}</span>
              </Link>
            </motion.div>

            {/* Center: Section Title & Subtitle */}
            <div className="text-center space-y-2 order-1 md:order-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <SectionTitle>{title}</SectionTitle>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <SectionDescription>{subtitle}</SectionDescription>
              </motion.div>
            </div>

            {/* Right Side (RTL): Slider Navigation Controls (< & >) */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-2 order-2 md:order-3 select-none"
            >
              {/* Prev (Right in RTL) */}
              <button
                onClick={handlePrev}
                aria-label="الكورس السابق"
                className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center transition-colors cursor-pointer"
              >
                <ChevronRight className="h-5 w-5" />
              </button>

              {/* Next (Left in RTL - Active Blue) */}
              <button
                onClick={handleNext}
                aria-label="الكورس التالي"
                className="w-10 h-10 rounded-full bg-[#1E73D8] hover:bg-[#165bb0] text-white flex items-center justify-center shadow-md transition-colors cursor-pointer"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            </motion.div>

          </div>
        </SectionHeader>

        {/* Course Cards Grid Slider */}
        <CourseSlider courses={courses} currentIndex={currentIndex} />

      </SectionContainer>
    </SectionWrapper>
  );
}

export default FeaturedCourses;

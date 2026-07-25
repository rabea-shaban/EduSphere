"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  BookOpen,
  GraduationCap,
  Target,
  Trophy,
  Layers,
  FileText,
  Backpack,
} from "lucide-react";
import type { EducationalStage } from "./types";
import { STAGE_VARIANT_STYLES } from "./constants";
import { cn } from "@/lib/utils";

interface StageCardProps {
  stage: EducationalStage;
  index: number;
}

function StageTopIcon({ iconName, className }: { iconName: EducationalStage["iconName"]; className?: string }) {
  switch (iconName) {
    case "backpack":
      return <Backpack className={cn("h-4 w-4", className)} />;
    case "book":
      return <BookOpen className={cn("h-4 w-4", className)} />;
    case "target":
      return <Target className={cn("h-4 w-4", className)} />;
    case "cap":
      return <GraduationCap className={cn("h-4 w-4", className)} />;
    case "trophy":
      return <Trophy className={cn("h-4 w-4", className)} />;
    default:
      return <BookOpen className={cn("h-4 w-4", className)} />;
  }
}

export function EducationalStageCard({ stage, index }: StageCardProps) {
  const styles = STAGE_VARIANT_STYLES[stage.variant];
  const isOrangeTitle = stage.titleColor === "orange";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -8 }}
      className="group relative flex flex-col justify-between h-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[24px] p-5 shadow-[0_10px_30px_rgba(11,45,91,0.05)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:shadow-[0_20px_40px_rgba(11,45,91,0.12)] dark:hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)] transition-all duration-300 select-none overflow-hidden"
    >
      {/* Subtle background gradient glow */}
      <div
        className={cn(
          "absolute top-0 right-0 left-0 h-40 bg-gradient-to-b opacity-80 pointer-events-none rounded-t-[24px]",
          styles.cardBgGradient
        )}
      />

      {/* Top Floating Badge & Image Header */}
      <div className="relative w-full flex flex-col items-center pt-2 pb-4">
        {/* Floating circular icon top-right (in RTL = top left visual) */}
        <div className="absolute top-0 right-0 z-20">
          <div
            className={cn(
              "w-9 h-9 rounded-full bg-white dark:bg-slate-800 shadow-md border border-slate-100 dark:border-slate-700 flex items-center justify-center transition-transform duration-300 group-hover:scale-110",
              styles.iconColor
            )}
          >
            <StageTopIcon iconName={stage.iconName} />
          </div>
        </div>

        {/* 3D Illustration */}
        <div className="relative w-36 h-36 sm:w-40 sm:h-40 flex items-center justify-center my-2">
          <Image
            src={stage.imageSrc}
            alt={stage.imageAlt}
            width={160}
            height={160}
            className="w-full h-full object-contain drop-shadow-md transition-transform duration-500 group-hover:scale-105"
            priority={index < 2}
          />
        </div>
      </div>

      {/* Card Body: Title, Subtitle, Description */}
      <div className="flex flex-col items-center text-center space-y-2 mb-4 flex-1">
        {/* Main Stage Title */}
        <h3
          className={cn(
            "text-lg sm:text-xl font-extrabold leading-tight",
            isOrangeTitle
              ? "text-[#F58220] dark:text-orange-400"
              : "text-[#0B2D5B] dark:text-slate-100"
          )}
          style={{ fontFamily: "'Cairo', sans-serif" }}
        >
          {stage.title}
        </h3>

        {/* Subtitle (Grade level) */}
        <p
          className={cn(
            "text-xs sm:text-sm font-bold",
            isOrangeTitle
              ? "text-[#F58220]/90 dark:text-orange-400/90"
              : "text-[#0B2D5B]/80 dark:text-slate-300"
          )}
          style={{ fontFamily: "'Cairo', sans-serif" }}
        >
          {stage.subtitle}
        </p>

        {/* Description */}
        <p
          className="text-xs text-[#64748B] dark:text-slate-400 font-medium leading-relaxed max-w-[220px] pt-1"
          style={{ fontFamily: "'Cairo', sans-serif" }}
        >
          {stage.description}
        </p>
      </div>

      {/* Bottom Statistics Box & Action Button */}
      <div className="space-y-4 pt-2">
        {/* Statistics Box */}
        <div
          className={cn(
            "rounded-2xl p-3 border transition-colors duration-200",
            styles.statsBg,
            styles.statsBorder
          )}
        >
          <div className="grid grid-cols-2 divide-x divide-x-reverse divide-slate-200/80 dark:divide-slate-700/60 text-center">
            {/* Right Column (RTL): Subjects Count */}
            <div className="px-2 flex flex-col items-center justify-center space-y-1">
              <div className="flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-[#64748B] dark:text-slate-400">
                <Layers className="h-3 w-3 shrink-0 text-[#1E73D8] dark:text-blue-400" />
                <span>المواد الأساسية</span>
              </div>
              <span
                className="text-sm sm:text-base font-extrabold text-[#0B2D5B] dark:text-white"
                style={{ fontFamily: "'Cairo', sans-serif" }}
              >
                {stage.subjectsCount}
              </span>
            </div>

            {/* Left Column (RTL): Lessons Count */}
            <div className="px-2 flex flex-col items-center justify-center space-y-1">
              <div className="flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-[#64748B] dark:text-slate-400">
                <FileText className="h-3 w-3 shrink-0 text-[#1E73D8] dark:text-blue-400" />
                <span>عدد الدروس</span>
              </div>
              <span
                className="text-sm sm:text-base font-extrabold text-[#0B2D5B] dark:text-white"
                style={{ fontFamily: "'Cairo', sans-serif" }}
              >
                {stage.lessonsCount}
              </span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <Link
          href={stage.buttonHref}
          className={cn(
            "w-full h-11 rounded-xl border-2 flex items-center justify-center gap-2 font-bold text-xs sm:text-sm transition-all duration-300 shadow-sm cursor-pointer",
            styles.buttonBorder,
            styles.buttonText,
            styles.buttonHoverBg
          )}
          style={{ fontFamily: "'Cairo', sans-serif" }}
        >
          <span>{stage.buttonText}</span>
          <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
        </Link>
      </div>
    </motion.div>
  );
}

export default EducationalStageCard;

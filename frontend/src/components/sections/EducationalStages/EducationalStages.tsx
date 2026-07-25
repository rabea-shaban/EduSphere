"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import type { EducationalStagesProps } from "./types";
import { DEFAULT_EDUCATIONAL_STAGES } from "./mock-data";
import { EducationalStageCard } from "./EducationalStageCard";
import { cn } from "@/lib/utils";

export function EducationalStages({
  title = "المراحل الدراسية",
  subtitle = "من الصف الرابع الابتدائي إلى الصف الثالث الثانوي",
  stages = DEFAULT_EDUCATIONAL_STAGES,
  bottomNote = "جميع المناهج معتمدة ومحدثة وفقًا لآخر التعديلات الوزارية",
  className,
}: EducationalStagesProps) {
  return (
    <section
      id="stages"
      aria-label="المراحل الدراسية"
      className={cn(
        "relative w-full py-16 sm:py-20 bg-slate-50/50 dark:bg-slate-950/60 overflow-hidden transition-colors duration-300",
        className
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">

        {/* Section Header */}
        <div className="text-center space-y-3 mb-12 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center justify-center gap-2"
          >
            {/* Title Sparkle Dots Decoration */}
            <div className="flex items-center gap-1 text-[#1E73D8] dark:text-blue-400 select-none">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1E73D8] dark:bg-blue-400" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#F58220]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
            </div>

            <h2
              className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B2D5B] dark:text-white tracking-tight"
              style={{ fontFamily: "'Cairo', sans-serif" }}
            >
              {title}
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-sm sm:text-base text-[#64748B] dark:text-slate-400 font-semibold max-w-xl mx-auto"
            style={{ fontFamily: "'Cairo', sans-serif" }}
          >
            {subtitle}
          </motion.p>
        </div>

        {/* 5 Equal Cards Grid (1 col Mobile, 2 cols Tablet, 5 cols Desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5 sm:gap-6 items-stretch">
          {stages.map((stage, index) => (
            <EducationalStageCard key={stage.id} stage={stage} index={index} />
          ))}
        </div>

        {/* Bottom Note with Blue Shield Icon */}
        {bottomNote && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-12 sm:mt-16 flex items-center justify-center gap-2 text-xs sm:text-sm text-[#0B2D5B] dark:text-slate-300 font-bold select-none"
            style={{ fontFamily: "'Cairo', sans-serif" }}
          >
            <ShieldCheck className="h-4.5 w-4.5 text-[#1E73D8] dark:text-blue-400 shrink-0" />
            <span>{bottomNote}</span>
          </motion.div>
        )}

      </div>
    </section>
  );
}

export default EducationalStages;

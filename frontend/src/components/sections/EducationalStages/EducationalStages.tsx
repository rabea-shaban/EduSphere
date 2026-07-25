"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import type { EducationalStagesProps } from "./types";
import { DEFAULT_EDUCATIONAL_STAGES } from "./mock-data";
import { EducationalStageCard } from "./EducationalStageCard";
import {
  SectionWrapper,
  SectionContainer,
  SectionHeader,
  SectionTitle,
  SectionDescription,
} from "@/components/layout/section-layout";
import { cn } from "@/lib/utils";

export function EducationalStages({
  title = "المراحل الدراسية",
  subtitle = "من الصف الرابع الابتدائي إلى الصف الثالث الثانوي",
  stages = DEFAULT_EDUCATIONAL_STAGES,
  bottomNote = "جميع المناهج معتمدة ومحدثة وفقًا لآخر التعديلات الوزارية",
  className,
}: EducationalStagesProps) {
  return (
    <SectionWrapper id="stages" aria-label="المراحل الدراسية" className={cn("bg-slate-50/50 dark:bg-slate-950/60", className)}>
      <SectionContainer>

        {/* Section Header */}
        <SectionHeader>
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
        </SectionHeader>

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

      </SectionContainer>
    </SectionWrapper>
  );
}

export default EducationalStages;

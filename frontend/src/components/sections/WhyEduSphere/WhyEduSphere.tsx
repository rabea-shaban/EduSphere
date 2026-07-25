"use client";

import * as React from "react";
import { motion } from "framer-motion";
import type { WhyEduSphereProps } from "./types";
import { DEFAULT_FEATURES } from "./mock-data";
import { FeatureCard } from "./FeatureCard";
import {
  SectionWrapper,
  SectionContainer,
  SectionHeader,
  SectionTitle,
  SectionDescription,
} from "@/components/layout/section-layout";
import { cn } from "@/lib/utils";

export function WhyEduSphere({
  title = "لماذا EduSphere؟",
  subtitle = "نوفر تجربة تعليمية متكاملة باستخدام أحدث التقنيات",
  features = DEFAULT_FEATURES,
  className,
}: WhyEduSphereProps) {
  return (
    <SectionWrapper aria-label="لماذا EduSphere" className={cn("bg-white dark:bg-slate-950", className)}>
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

        {/* 6 Equal Cards Grid (1 col Mobile, 2 cols Tablet, 3 cols Medium, 6 cols Desktop) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5 items-stretch">
          {features.map((feature, index) => (
            <FeatureCard key={feature.id} feature={feature} index={index} />
          ))}
        </div>

      </SectionContainer>
    </SectionWrapper>
  );
}

export default WhyEduSphere;

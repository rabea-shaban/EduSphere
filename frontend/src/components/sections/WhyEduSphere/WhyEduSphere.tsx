"use client";

import * as React from "react";
import { motion } from "framer-motion";
import type { WhyEduSphereProps } from "./types";
import { DEFAULT_FEATURES } from "./mock-data";
import { FeatureCard } from "./FeatureCard";
import { cn } from "@/lib/utils";

export function WhyEduSphere({
  title = "لماذا EduSphere؟",
  subtitle = "نوفر تجربة تعليمية متكاملة باستخدام أحدث التقنيات",
  features = DEFAULT_FEATURES,
  className,
}: WhyEduSphereProps) {
  return (
    <section
      aria-label="لماذا EduSphere"
      className={cn(
        "relative w-full py-16 sm:py-20 bg-white dark:bg-slate-950 transition-colors duration-300 overflow-hidden",
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

        {/* 6 Equal Cards Grid (1 col Mobile, 2 cols Tablet, 3 cols Medium, 6 cols Desktop) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5 items-stretch">
          {features.map((feature, index) => (
            <FeatureCard key={feature.id} feature={feature} index={index} />
          ))}
        </div>

      </div>
    </section>
  );
}

export default WhyEduSphere;

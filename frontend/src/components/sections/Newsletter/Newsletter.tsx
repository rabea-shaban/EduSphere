"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import type { NewsletterProps } from "./types";
import { DEFAULT_NEWSLETTER_BENEFITS } from "./mock-data";
import { NewsletterIllustration } from "./NewsletterIllustration";
import { NewsletterForm } from "./NewsletterForm";
import { NewsletterBenefits } from "./NewsletterBenefits";
import { fadeUpVariants, planeFlyVariants } from "./animations";
import { SectionWrapper, SectionContainer } from "@/components/layout/section-layout";
import { cn } from "@/lib/utils";

export function Newsletter({
  title1 = "اشترك في",
  title2Highlight = "النشرة الإخبارية",
  description = "احصل على آخر الدروس والنصائح التعليمية والعروض الحصرية مباشرةً في بريدك الإلكتروني.",
  inputPlaceholder = "اكتب بريدك الإلكتروني",
  buttonText = "اشترك الآن",
  benefits = DEFAULT_NEWSLETTER_BENEFITS,
  className,
}: NewsletterProps) {
  return (
    <SectionWrapper id="newsletter" aria-label="اشترك في النشرة الإخبارية" className={cn("bg-slate-50/50 dark:bg-slate-950/60", className)}>
      <SectionContainer>

        {/* Outer White Card Container */}
        <div className="relative w-full rounded-[32px] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-8 sm:p-12 lg:p-14 shadow-[0_15px_50px_rgba(11,45,91,0.06)] dark:shadow-[0_15px_50px_rgba(0,0,0,0.4)] overflow-hidden">

          {/* 2-Column Main Section (RTL: Right Content -> Left 3D Illustration) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

            {/* LEFT COLUMN (in RTL layout = Visual Left): 3D Envelope Illustration */}
            <div className="lg:col-span-6 order-1 lg:order-1 flex justify-center">
              <NewsletterIllustration />
            </div>

            {/* RIGHT COLUMN (in RTL layout = Visual Right): Flying Paper Plane, Heading, Description & Form */}
            <div className="lg:col-span-6 order-2 lg:order-2 text-right space-y-6 flex flex-col items-end">

              {/* Heading with Paper Plane Decoration */}
              <div className="relative space-y-2 w-full">

                {/* Flying Paper Plane Icon with Dashed Curve Trajectory (RTL Top Left visual) */}
                <motion.div
                  variants={planeFlyVariants}
                  initial="initial"
                  animate="animate"
                  className="absolute -top-6 left-2 text-[#1E73D8] dark:text-blue-400 select-none flex items-center gap-1"
                >
                  <svg className="w-16 h-8 text-[#1E73D8]/40 dark:text-blue-400/40" viewBox="0 0 100 40" fill="none">
                    <path
                      d="M 10 30 Q 50 5 90 20"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeDasharray="4 4"
                    />
                  </svg>
                  <Send className="h-6 w-6 text-[#1E73D8] dark:text-blue-400 fill-[#1E73D8]/20 -rotate-45" />
                </motion.div>

                {/* Heading Text */}
                <motion.div
                  variants={fadeUpVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <h2
                    className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0B2D5B] dark:text-white leading-[1.25] tracking-tight"
                    style={{ fontFamily: "'Cairo', sans-serif" }}
                  >
                    <span>{title1}</span>
                    <br />
                    <span className="text-[#F58220] dark:text-orange-400">{title2Highlight}</span>
                  </h2>
                </motion.div>
              </div>

              {/* Description */}
              <motion.p
                variants={fadeUpVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="text-sm sm:text-base text-[#64748B] dark:text-slate-400 font-medium leading-relaxed max-w-md"
                style={{ fontFamily: "'Cairo', sans-serif" }}
              >
                {description}
              </motion.p>

              {/* Email Form */}
              <motion.div
                variants={fadeUpVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="w-full pt-1"
              >
                <NewsletterForm placeholder={inputPlaceholder} buttonText={buttonText} />
              </motion.div>

            </div>

          </div>

          {/* Bottom Benefits Horizontal Row */}
          <NewsletterBenefits benefits={benefits} />

        </div>

      </SectionContainer>
    </SectionWrapper>
  );
}

export default Newsletter;

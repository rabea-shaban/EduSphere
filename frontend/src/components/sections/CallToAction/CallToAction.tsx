"use client";

import * as React from "react";
import { motion } from "framer-motion";
import type { CallToActionProps } from "./types";
import { CTA_COLORS } from "./constants";
import { BackgroundDecorations } from "./BackgroundDecorations";
import { CTAButtons } from "./CTAButtons";
import { CTAIllustration } from "./CTAIllustration";
import { fadeUpVariants } from "./animations";
import { SectionWrapper, SectionContainer } from "@/components/layout/section-layout";
import { cn } from "@/lib/utils";

export function CallToAction({
  title1 = "جاهز لتحقيق",
  title2Highlight = "حلمك؟",
  subtitle = "انضم إلى آلاف الطلاب وابدأ رحلتك نحو التفوق مع منصتنا التعليمية المتكاملة.",
  primaryBtnText = "ابدأ التعلم الآن",
  primaryBtnHref = "/auth/register",
  secondaryBtnText = "تصفح الكورسات",
  secondaryBtnHref = "#courses",
  className,
}: CallToActionProps) {
  return (
    <SectionWrapper aria-label="جاهز لتحقيق حلمك؟" className={cn("bg-white dark:bg-slate-950", className)}>
      <SectionContainer>

        {/* Outer Rounded Container with Deep Blue Gradient (Light & Dark Mode) */}
        <div
          className={cn(
            "relative w-full rounded-[32px] p-8 sm:p-12 lg:p-16 shadow-[0_20px_50px_rgba(11,45,91,0.25)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.6)] border border-blue-900/20 dark:border-blue-900/50 overflow-hidden transition-colors duration-300",
            CTA_COLORS.bgGradient
          )}
        >

          {/* Background Decorative Waves, Stars, & Glows */}
          <BackgroundDecorations />

          {/* 2-Column Grid (RTL: Right Content -> Left 3D Illustration) */}
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

            {/* LEFT COLUMN (in RTL layout = Visual Left): 3D Illustration */}
            <div className="lg:col-span-6 order-1 lg:order-1 flex justify-center">
              <CTAIllustration />
            </div>

            {/* RIGHT COLUMN (in RTL layout = Visual Right): Heading, Subtitle & Buttons */}
            <div className="lg:col-span-6 order-2 lg:order-2 text-right space-y-6 flex flex-col items-end">

              {/* Main Heading with Orange Highlight & Dot Decoration */}
              <div className="relative space-y-2">
                <motion.div
                  variants={fadeUpVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="relative inline-block"
                >
                  {/* Decorative dots grid (:::) on the left of title */}
                  <div aria-hidden className="absolute top-3 -left-8 grid grid-cols-2 gap-1 text-[#F58220] opacity-90 select-none">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F58220]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F58220]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F58220]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F58220]" />
                  </div>

                  <h2
                    className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-[1.2] tracking-tight"
                    style={{ fontFamily: "'Cairo', sans-serif" }}
                  >
                    <span>{title1}</span>
                    <br />
                    <span className="text-[#F58220]">{title2Highlight}</span>
                  </h2>
                </motion.div>
              </div>

              {/* Subtitle */}
              <motion.p
                variants={fadeUpVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="text-sm sm:text-base text-white/90 dark:text-slate-200 font-medium leading-relaxed max-w-md"
                style={{ fontFamily: "'Cairo', sans-serif" }}
              >
                {subtitle}
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                variants={fadeUpVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <CTAButtons
                  primaryBtnText={primaryBtnText}
                  primaryBtnHref={primaryBtnHref}
                  secondaryBtnText={secondaryBtnText}
                  secondaryBtnHref={secondaryBtnHref}
                />
              </motion.div>

            </div>

          </div>

        </div>

      </SectionContainer>
    </SectionWrapper>
  );
}

export default CallToAction;

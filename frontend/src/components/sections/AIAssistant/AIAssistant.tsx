"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles } from "lucide-react";
import type { AIAssistantProps } from "./types";
import { DEFAULT_AI_CAPABILITIES } from "./mock-data";
import { RobotIllustration } from "./RobotIllustration";
import { AssistantFeatureCard } from "./AssistantFeatureCard";
import { containerVariants } from "./animations";
import { cn } from "@/lib/utils";

export function AIAssistant({
  title1 = "مساعدك الذكي",
  title2Highlight = "في التعلم",
  description = "اسأل أي سؤال واحصل على شرح فوري ومحتوى مخصص لك.",
  buttonText = "جرب المساعد الذكي",
  buttonHref = "/ai-assistant",
  promptQuestion = "كيف يمكنني مساعدتك اليوم؟",
  capabilities = DEFAULT_AI_CAPABILITIES,
  className,
}: AIAssistantProps) {
  return (
    <section
      id="ai-assistant"
      aria-label="المساعد الذكي في التعلم"
      className={cn(
        "relative w-full py-16 sm:py-20 bg-slate-50/50 dark:bg-slate-950/60 overflow-hidden transition-colors duration-300",
        className
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">

        {/* Main Section Rounded Container (Glassmorphism & Soft Shadow) */}
        <div className="relative w-full rounded-[32px] bg-gradient-to-br from-[#F4F8FE] via-[#EFF6FE] to-[#E6F0FD] dark:from-slate-900/90 dark:via-slate-900/80 dark:to-slate-950/90 border border-blue-100/80 dark:border-slate-800 p-8 sm:p-12 lg:p-14 shadow-[0_15px_50px_rgba(11,45,91,0.06)] dark:shadow-[0_15px_50px_rgba(0,0,0,0.4)] overflow-hidden">

          {/* Background Decorative Blur Blobs */}
          <div aria-hidden className="absolute -top-20 -right-20 w-80 h-80 bg-blue-300/20 dark:bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
          <div aria-hidden className="absolute -bottom-20 -left-20 w-80 h-80 bg-orange-300/15 dark:bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />

          {/* 3 Columns Grid (RTL: Right Heading -> Center Capabilities -> Left 3D Robot) */}
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">

            {/* LEFT COLUMN (in RTL layout = Visual Left): 3D AI Robot */}
            <div className="lg:col-span-4 order-1 lg:order-1 flex justify-center">
              <RobotIllustration />
            </div>

            {/* CENTER COLUMN: Top Prompt Question & Capability Cards */}
            <div className="lg:col-span-4 order-2 lg:order-2 space-y-3.5 max-w-md mx-auto w-full">

              {/* Top Prompt Question Pill */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="w-full bg-white dark:bg-slate-800/90 border border-slate-100 dark:border-slate-700/80 rounded-2xl py-3 px-6 text-center shadow-sm select-none"
              >
                <span
                  className="text-xs sm:text-sm font-extrabold text-[#0B2D5B] dark:text-slate-100"
                  style={{ fontFamily: "'Cairo', sans-serif" }}
                >
                  {promptQuestion}
                </span>
              </motion.div>

              {/* Capability Cards List */}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="space-y-2.5 w-full"
              >
                {capabilities.map((item, index) => (
                  <AssistantFeatureCard key={item.id} capability={item} index={index} />
                ))}
              </motion.div>
            </div>

            {/* RIGHT COLUMN (in RTL layout = Visual Right): Section Heading & CTA */}
            <div className="lg:col-span-4 order-3 lg:order-3 text-right space-y-6 flex flex-col items-end">

              {/* Main Heading with Sparkle Stars */}
              <div className="relative space-y-2">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="relative inline-block"
                >
                  {/* Title */}
                  <h2
                    className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0B2D5B] dark:text-white leading-[1.25] tracking-tight"
                    style={{ fontFamily: "'Cairo', sans-serif" }}
                  >
                    <span>{title1}</span>
                    <br />
                    <span className="text-[#1E73D8] dark:text-blue-400">{title2Highlight}</span>
                  </h2>

                  {/* Sparkling Stars Icon decoration on the left of title */}
                  <div aria-hidden className="absolute top-2 -left-10 sm:-left-12 text-[#1E73D8] dark:text-blue-400 flex items-center gap-1">
                    <Sparkles className="h-6 w-6 text-[#1E73D8] dark:text-blue-400 fill-[#1E73D8]/20 animate-pulse" />
                  </div>
                </motion.div>
              </div>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-sm sm:text-base text-[#64748B] dark:text-slate-300 font-medium leading-relaxed max-w-sm"
                style={{ fontFamily: "'Cairo', sans-serif" }}
              >
                {description}
              </motion.p>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="pt-2"
              >
                <Link
                  href={buttonHref}
                  className="inline-flex items-center justify-center gap-2.5 h-12 px-8 rounded-xl bg-[#F58220] hover:bg-[#e0711a] text-white font-bold text-sm shadow-lg shadow-orange-200 dark:shadow-orange-950/50 transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
                  style={{ fontFamily: "'Cairo', sans-serif" }}
                >
                  <ArrowLeft className="h-4 w-4 text-white shrink-0" />
                  <span>{buttonText}</span>
                </Link>
              </motion.div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

export default AIAssistant;

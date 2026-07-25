"use client";

import * as React from "react";
import { motion } from "framer-motion";
import type { Transition } from "framer-motion";
import { ArrowLeft, Play, BarChart3, Box, Bot } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";

// ─── Shared float transition helper ──────────────────────────────────────────
const makeFloat = (amplitude: number, duration: number, delay: number): Transition => ({
  duration,
  repeat: Infinity,
  ease: "easeInOut" as const,
  delay,
  repeatType: "mirror" as const,
});

// ─── Interfaces ───────────────────────────────────────────────────────────────
interface FloatingCard1Props { title: string; value: string; sub: string }
interface FloatingCard2Props { title: string; value: string }
interface FloatingCard3Props { title: string; sub: string }

export interface HeroSectionProps {
  title1: string;
  title2: string;
  title2Highlight: string;
  subtitle: string;
  primaryCTA: string;
  secondaryCTA: string;
  card1: FloatingCard1Props;
  card2: FloatingCard2Props;
  card3: FloatingCard3Props;
}

// ─── Floating Cards (Dark + Light Mode) ───────────────────────────────────────
function Card1({ title, value, sub }: FloatingCard1Props) {
  return (
    <motion.div
      animate={{ y: [0, -8, 0] }}
      transition={makeFloat(8, 4, 0)}
      className="absolute top-[10%] right-[2%] z-20 bg-white dark:bg-slate-900 border border-transparent dark:border-slate-800 rounded-2xl shadow-[0_8px_32px_rgba(11,45,91,0.12)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)] p-3.5 w-[160px] select-none transition-colors duration-300"
    >
      <div className="flex items-center gap-2.5 mb-2.5">
        <div className="rounded-xl bg-[#EBF4FF] dark:bg-blue-950/80 p-2 shrink-0">
          <BarChart3 className="h-4 w-4 text-[#1E73D8] dark:text-blue-400" />
        </div>
        <div>
          <p className="text-[9px] font-bold text-[#64748B] dark:text-slate-400 leading-tight">{title}</p>
          <p className="text-[15px] font-black text-[#0B2D5B] dark:text-white leading-none">{value}</p>
        </div>
      </div>
      <div className="space-y-1">
        <div className="h-1.5 w-full rounded-full bg-[#E2E8F0] dark:bg-slate-800 overflow-hidden">
          <div className="h-full w-[85%] rounded-full bg-[#F58220]" />
        </div>
        <p className="text-[8px] text-[#94A3B8] dark:text-slate-400 font-semibold text-right">{sub}</p>
      </div>
    </motion.div>
  );
}

function Card2({ title, value }: FloatingCard2Props) {
  return (
    <motion.div
      animate={{ y: [0, -6, 0] }}
      transition={makeFloat(6, 5, 0.8)}
      className="absolute top-[30%] left-[2%] z-20 bg-white dark:bg-slate-900 border border-transparent dark:border-slate-800 rounded-2xl shadow-[0_8px_32px_rgba(11,45,91,0.12)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)] p-3.5 flex items-center gap-3 select-none transition-colors duration-300"
    >
      <div className="rounded-xl bg-[#EBF4FF] dark:bg-blue-950/80 p-2.5 shrink-0">
        <Box className="h-5 w-5 text-[#1E73D8] dark:text-blue-400" />
      </div>
      <div>
        <p className="text-[9px] font-bold text-[#64748B] dark:text-slate-400 leading-tight">{title}</p>
        <p className="text-[15px] font-black text-[#0B2D5B] dark:text-white leading-none">{value}</p>
      </div>
    </motion.div>
  );
}

function Card3({ title, sub }: FloatingCard3Props) {
  return (
    <motion.div
      animate={{ y: [0, -7, 0] }}
      transition={makeFloat(7, 4.5, 1.5)}
      className="absolute bottom-[18%] right-[4%] z-20 bg-white dark:bg-slate-900 border border-transparent dark:border-slate-800 rounded-2xl shadow-[0_8px_32px_rgba(11,45,91,0.12)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)] p-3.5 flex items-center gap-3 select-none transition-colors duration-300"
    >
      <div className="rounded-xl bg-[#EBF4FF] dark:bg-blue-950/80 p-2 shrink-0">
        <Bot className="h-5 w-5 text-[#1E73D8] dark:text-blue-400" />
      </div>
      <div>
        <p className="text-[10px] font-black text-[#0B2D5B] dark:text-white leading-tight">{title}</p>
        <p className="text-[9px] text-[#64748B] dark:text-slate-400 font-semibold leading-tight">{sub}</p>
      </div>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function HeroSection({
  title1, title2, title2Highlight,
  subtitle, primaryCTA, secondaryCTA,
  card1, card2, card3,
}: HeroSectionProps) {
  return (
    <section aria-label="Hero Section" className="relative w-full overflow-hidden bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">

      {/* ── Background dot grid decorations (section level) ── */}
      <div aria-hidden className="absolute right-[2%] top-[15%] grid grid-cols-4 gap-1.5 opacity-15 dark:opacity-25 pointer-events-none">
        {Array.from({ length: 16 }).map((_, i) => (
          <div key={i} className="w-1 h-1 rounded-full bg-[#1E73D8] dark:bg-blue-400" />
        ))}
      </div>

      {/* ── Main content ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-14 pb-0">
        <div className="flex flex-col-reverse lg:flex-row-reverse items-center gap-8 lg:gap-12">

          {/* LEFT: Image + Circle + Floating Cards */}
          <div className="relative flex-1 w-full flex items-end justify-center min-h-[380px] sm:min-h-[440px] lg:min-h-[500px]">

            {/* Floating Cards */}
            <Card1 {...card1} />
            <Card2 {...card2} />
            <Card3 {...card3} />

            {/* Decorative orange circles attached to the image frame */}
            <div aria-hidden className="absolute top-[6%] left-[6%] w-6 h-6 rounded-full bg-[#F58220] opacity-90 pointer-events-none z-10 shadow-sm animate-pulse" />
            <div aria-hidden className="absolute bottom-[20%] left-[2%] w-4 h-4 rounded-full bg-[#F58220] opacity-70 pointer-events-none z-10" />

            {/* Dots grid near image */}
            <div aria-hidden className="absolute left-[-2%] bottom-[8%] grid grid-cols-4 gap-1.5 opacity-30 dark:opacity-40 pointer-events-none z-0">
              {Array.from({ length: 16 }).map((_, i) => (
                <div key={i} className="w-1 h-1 rounded-full bg-[#1E73D8] dark:bg-blue-400" />
              ))}
            </div>

            {/* Student Image & Centered Circle Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10 w-full max-w-[420px] flex items-end justify-center select-none"
            >
              {/* Soft-blue circle mathematically 100% centered behind student image */}
              <div
                aria-hidden
                className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[92%] aspect-square bg-gradient-to-br from-[#EBF4FF] via-[#EBF4FF] to-[#DBEAFE] dark:from-blue-950/60 dark:via-slate-900/80 dark:to-slate-800/80 rounded-full opacity-95 pointer-events-none z-0 shadow-inner transition-colors duration-300"
              />

              {/* Student Image */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/personHerosection.png"
                alt="طالب يتعلم على EduSphere"
                className="relative z-10 w-full h-auto object-contain object-bottom drop-shadow-xl"
                loading="eager"
              />
            </motion.div>
          </div>

          {/* RIGHT: Text */}
          <div className="flex-1 text-right space-y-6 pt-8 lg:pt-0">
            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="font-black text-[#0B2D5B] dark:text-white leading-[1.2] tracking-tight"
              style={{
                fontFamily: "'Cairo', sans-serif",
                fontSize: "clamp(2.2rem, 5vw, 3.8rem)",
              }}
            >
              <span className="text-[#0B2D5B] dark:text-white">{title1}</span>
              <br />
              <span className="text-[#0B2D5B] dark:text-white">{title2} </span>
              <span className="text-[#F58220]">{title2Highlight}</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="text-[#64748B] dark:text-slate-300 text-base sm:text-lg leading-relaxed font-medium max-w-md mr-0 ml-auto lg:ml-0"
              style={{ fontFamily: "'Cairo', sans-serif" }}
            >
              {subtitle}
            </motion.p>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-wrap items-center justify-end gap-4 pt-2"
            >
              {/* Primary CTA – Orange */}
              <Button
                asChild
                className="h-12 px-7 rounded-xl bg-[#F58220] hover:bg-[#e0711a] text-white font-bold text-sm shadow-md shadow-orange-200 dark:shadow-orange-950/40 transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] gap-2"
                style={{ fontFamily: "'Cairo', sans-serif" }}
              >
                <Link href="/auth/register" aria-label={primaryCTA}>
                  {primaryCTA}
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-white/25">
                    <ArrowLeft className="h-3 w-3 text-white" />
                  </span>
                </Link>
              </Button>

              {/* Secondary CTA – White with navy border in light, dark background in dark */}
              <Button
                asChild
                variant="outline"
                className="h-12 px-7 rounded-xl border-2 border-[#0B2D5B] dark:border-slate-300 text-[#0B2D5B] dark:text-slate-100 bg-white dark:bg-slate-900 hover:bg-[#F8FAFC] dark:hover:bg-slate-800 font-bold text-sm transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] gap-2"
                style={{ fontFamily: "'Cairo', sans-serif" }}
              >
                <Link href="#courses" aria-label={secondaryCTA}>
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full border border-[#0B2D5B] dark:border-slate-300">
                    <Play className="h-2.5 w-2.5 fill-[#0B2D5B] text-[#0B2D5B] dark:fill-slate-100 dark:text-slate-100" />
                  </span>
                  {secondaryCTA}
                </Link>
              </Button>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default HeroSection;

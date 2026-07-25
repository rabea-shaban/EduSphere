"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, GraduationCap } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface HeroSectionProps {
  badgeText: string;
  title: string;
  subtitle: string;
  primaryCTA: string;
  secondaryCTA: string;
  quickStats: { value: string; label: string }[];
  completedText: string;
  completedCount: string;
  progressText: string;
  progressVal: string;
  aiText: string;
}

export function HeroSection({
  badgeText,
  title,
  subtitle,
  primaryCTA,
  secondaryCTA,
  quickStats,
  completedText,
  completedCount,
  progressText,
  progressVal,
  aiText,
}: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden pt-20 pb-16 md:pt-28 md:pb-24 lg:pt-36 lg:pb-32 px-4 sm:px-6 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
      {/* Background soft lighting blobs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-secondary/10 blur-3xl -z-10 animate-pulse pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] rounded-full bg-accent/5 blur-3xl -z-10 pointer-events-none" />

      {/* Text Area */}
      <div className="flex-1 text-left rtl:text-right space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Badge
            variant="outline"
            className="gap-1.5 px-3 py-1 text-xs border-primary/20 bg-primary/5 rounded-full font-semibold select-none"
          >
            <Sparkles className="h-3 w-3 text-accent shrink-0" />
            {badgeText}
          </Badge>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-display font-heading font-extrabold tracking-tight text-foreground leading-[1.1] max-w-xl"
        >
          {title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-body-large text-muted-foreground max-w-md leading-relaxed"
        >
          {subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap items-center gap-4 pt-2"
        >
          <Button
            size="lg"
            className="rounded-xl h-12 px-6 font-bold shadow-md cursor-pointer shrink-0"
            asChild
          >
            <Link href="/auth/register" className="gap-2">
              {primaryCTA}
              <ArrowRight className="h-4.5 w-4.5 rtl:rotate-180 shrink-0" />
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="rounded-xl h-12 px-6 font-bold cursor-pointer shrink-0"
            asChild
          >
            <Link href="#courses" className="gap-2">
              <span className="h-5 w-5 rounded-full border border-current flex items-center justify-center text-[10px] shrink-0">▶</span>
              {secondaryCTA}
            </Link>
          </Button>
        </motion.div>

        {/* Quick Stats list */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex items-center gap-6 pt-4 border-t border-border/60 max-w-md"
        >
          {quickStats.map((stat, idx) => (
            <div key={idx} className="space-y-0.5 select-none">
              <span className="block text-h4 font-extrabold text-primary">{stat.value}</span>
              <span className="block text-caption text-muted-foreground font-semibold">
                {stat.label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Visual Area (Floating Cards Illustration matching reference image) */}
      <div className="flex-1 w-full relative flex items-center justify-center min-h-[380px] sm:min-h-[440px] md:min-h-[480px]">
        {/* Main Hero visual: Student with laptop and headphones */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="w-full max-w-[400px] border border-border/80 rounded-3xl shadow-2xl overflow-hidden aspect-[4/3.5] relative"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80"
            alt="Student Studying on Laptop"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent" />
        </motion.div>

        {/* Floating Card 1: Completed lessons count */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-10 right-6 sm:right-12 bg-card border border-border/80 p-3.5 rounded-2xl shadow-lg flex items-center gap-3 select-none z-10"
        >
          <div className="rounded-xl bg-primary/10 p-2.5 text-primary shrink-0">
            <GraduationCap className="h-5 w-5 shrink-0" />
          </div>
          <div>
            <span className="block text-[9px] font-bold text-muted-foreground uppercase tracking-wider">{completedText}</span>
            <span className="block text-sm font-extrabold text-foreground">{completedCount}</span>
          </div>
        </motion.div>

        {/* Floating Card 2: Weekly Progress */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="absolute top-12 left-6 sm:left-12 bg-card border border-border/80 p-3.5 rounded-2xl shadow-lg flex items-center gap-3 select-none z-10"
        >
          <div className="rounded-xl bg-secondary/15 p-2 text-secondary shrink-0 relative flex items-center justify-center">
            <span className="text-xs font-bold">{progressVal}</span>
          </div>
          <div>
            <span className="block text-xs font-extrabold text-foreground">{progressText}</span>
            <span className="block text-[9px] text-muted-foreground">Active study streak</span>
          </div>
        </motion.div>

        {/* Floating Card 3: AI Assistant Helper */}
        <motion.div
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-12 left-10 sm:left-20 bg-card border border-border/80 p-3.5 rounded-2xl shadow-lg flex items-center gap-3 select-none z-10 max-w-[180px]"
        >
          <div className="rounded-xl bg-accent/15 p-2.5 text-accent shrink-0">
            <Sparkles className="h-5 w-5 fill-accent shrink-0" />
          </div>
          <div>
            <span className="block text-[10px] font-extrabold text-foreground leading-snug">{aiText}</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
export default HeroSection;

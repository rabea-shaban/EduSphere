"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, GraduationCap, Users, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface HeroSectionProps {
  badgeText: string;
  title: string;
  subtitle: string;
  primaryCTA: string;
  secondaryCTA: string;
  quickStats: { value: string; label: string }[];
}

export function HeroSection({
  badgeText,
  title,
  subtitle,
  primaryCTA,
  secondaryCTA,
  quickStats,
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
            <a href="/auth/register" className="gap-2">
              {primaryCTA}
              <ArrowRight className="h-4.5 w-4.5 rtl:rotate-180 shrink-0" />
            </a>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="rounded-xl h-12 px-6 font-bold cursor-pointer shrink-0"
            asChild
          >
            <a href="/courses">{secondaryCTA}</a>
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

      {/* Visual Area (Floating Cards Illustration) */}
      <div className="flex-1 w-full relative flex items-center justify-center min-h-[380px] sm:min-h-[440px] md:min-h-[480px]">
        {/* Main centered card mockup */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="w-full max-w-[400px] bg-card border border-border/80 rounded-2xl shadow-xl overflow-hidden aspect-[4/3] p-6 relative flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                Live Class
              </span>
            </div>
            <span className="text-xs font-bold text-secondary">Math Syllabus</span>
          </div>

          <div className="space-y-2">
            <h3 className="text-h4 font-heading font-extrabold leading-tight">
              Advanced Trigonometry Unit 2
            </h3>
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-muted overflow-hidden flex items-center justify-center text-[10px] font-bold text-primary">
                🎓
              </div>
              <span className="text-xs font-bold text-muted-foreground">Ahmed Ali</span>
            </div>
          </div>

          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
            <div className="h-full w-2/3 bg-primary rounded-full" />
          </div>
        </motion.div>

        {/* Floating Card 1: Students count */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-10 left-6 sm:left-12 bg-card border border-border/80 p-3.5 rounded-xl shadow-lg flex items-center gap-3 select-none"
        >
          <div className="rounded-lg bg-secondary/15 p-2 text-secondary shrink-0">
            <Users className="h-5 w-5 shrink-0" />
          </div>
          <div>
            <span className="block text-xs font-bold text-foreground">50K+ Students</span>
            <span className="block text-[9px] text-muted-foreground">Joined this month</span>
          </div>
        </motion.div>

        {/* Floating Card 2: Rating */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="absolute bottom-12 right-6 sm:right-12 bg-card border border-border/80 p-3.5 rounded-xl shadow-lg flex items-center gap-3 select-none"
        >
          <div className="rounded-lg bg-accent/15 p-2 text-accent shrink-0">
            <Star className="h-5 w-5 fill-accent shrink-0" />
          </div>
          <div>
            <span className="block text-xs font-bold text-foreground">4.9/5 Rating</span>
            <span className="block text-[9px] text-muted-foreground">From verified reviews</span>
          </div>
        </motion.div>

        {/* Floating Card 3: Alignment */}
        <motion.div
          animate={{ scale: [1, 1.03, 1] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-16 left-12 sm:left-24 bg-card border border-border/80 p-3.5 rounded-xl shadow-lg flex items-center gap-3 select-none"
        >
          <div className="rounded-lg bg-primary/10 p-2 text-primary shrink-0">
            <GraduationCap className="h-5 w-5 shrink-0" />
          </div>
          <div>
            <span className="block text-xs font-bold text-foreground">Aligned Curriculum</span>
            <span className="block text-[9px] text-muted-foreground">National standards</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
export default HeroSection;

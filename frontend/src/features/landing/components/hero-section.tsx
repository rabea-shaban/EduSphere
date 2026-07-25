"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Clock, TrendingUp, Cloud, Award, Star, User, Users, Box, BarChart3, Bot } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface TrustBadge {
  title: string;
  subtitle: string;
  icon: string;
}

interface StatItem {
  value: string;
  label: string;
  icon: string;
}

interface HeroSectionProps {
  badgeText: string;
  title: string;
  subtitle: string;
  primaryCTA: string;
  secondaryCTA: string;
  // Floating cards translations
  cardProgressTitle: string;
  cardProgressVal: string;
  cardProgressSub: string;
  cardContentTitle: string;
  cardContentVal: string;
  cardAITitle: string;
  cardAISub: string;
  // Dynamic arrays
  trustBadges: TrustBadge[];
  quickStats: StatItem[];
}

export function HeroSection({
  badgeText,
  title,
  subtitle,
  primaryCTA,
  secondaryCTA,
  cardProgressTitle,
  cardProgressVal,
  cardProgressSub,
  cardContentTitle,
  cardContentVal,
  cardAITitle,
  cardAISub,
  trustBadges,
  quickStats,
}: HeroSectionProps) {
  // Title parser to handle custom line-breaks and orange accent text colors dynamically
  const lines = title.split("|");
  const renderLine = (line: string) => {
    const parts = line.split("*");
    return parts.map((part, idx) => {
      if (idx % 2 === 1) {
        return (
          <span key={idx} className="text-accent">
            {part}
          </span>
        );
      }
      return part;
    });
  };

  const getTrustIcon = (iconName: string) => {
    switch (iconName) {
      case "clock":
        return <Clock className="h-5 w-5 text-primary shrink-0" />;
      case "trending-up":
        return <TrendingUp className="h-5 w-5 text-primary shrink-0" />;
      case "cloud":
        return <Cloud className="h-5 w-5 text-primary shrink-0" />;
      default:
        return <Award className="h-5 w-5 text-primary shrink-0" />;
    }
  };

  const getStatIcon = (iconName: string) => {
    switch (iconName) {
      case "star":
        return <Star className="h-5 w-5 text-accent fill-accent shrink-0 animate-pulse" />;
      case "teacher":
        return <User className="h-5 w-5 text-blue-400 shrink-0" />;
      case "clock":
        return <Clock className="h-5 w-5 text-blue-400 shrink-0" />;
      default:
        return <Users className="h-5 w-5 text-blue-400 shrink-0" />;
    }
  };

  return (
    <section className="relative overflow-hidden pt-20 pb-16 md:pt-24 md:pb-20 lg:pt-28 lg:pb-24 px-4 sm:px-6 max-w-7xl mx-auto flex flex-col gap-16">
      
      {/* 1. Main Hero Content Row */}
      <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
        {/* Left Side (Boy visual area) */}
        <div className="flex-1 w-full relative flex items-center justify-center min-h-[380px] sm:min-h-[440px] md:min-h-[480px]">
          {/* Main Hero visual: Student with laptop and headphones */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="w-full max-w-[420px] lg:max-w-[480px] aspect-[4/3.5] relative select-none"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/personHerosection.png"
              alt="EduSphere Student"
              className="w-full h-full object-contain"
            />
          </motion.div>

          {/* Floating Card 1: Success Rate & Progress (Top Left in RTL / Top Right in LTR) */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-12 left-2 sm:left-4 bg-card border border-border/80 p-3 rounded-xl shadow-lg flex flex-col gap-2 select-none z-10 w-[145px] sm:w-[155px]"
          >
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-primary/10 p-2 text-primary shrink-0">
                <BarChart3 className="h-4.5 w-4.5 shrink-0" />
              </div>
              <div className="space-y-0.5">
                <span className="block text-[8px] font-bold text-muted-foreground leading-none">
                  {cardProgressTitle}
                </span>
                <span className="block text-[14px] font-extrabold text-foreground leading-none">
                  {cardProgressVal}
                </span>
              </div>
            </div>
            <div className="space-y-1">
              <div className="bg-muted h-1.5 rounded-full w-full overflow-hidden">
                <div className="bg-accent h-full rounded-full w-[85%]" />
              </div>
              <span className="block text-[7px] font-extrabold text-muted-foreground text-left rtl:text-right">
                {cardProgressSub}
              </span>
            </div>
          </motion.div>

          {/* Floating Card 2: Available Content (Middle Right in RTL / Middle Left in LTR) */}
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute top-1/3 right-2 sm:right-6 bg-card border border-border/80 p-3 rounded-xl shadow-lg flex items-center gap-3 select-none z-10 w-[130px] sm:w-[140px]"
          >
            <div className="rounded-lg bg-blue-100 dark:bg-blue-950/40 p-2.5 text-blue-600 dark:text-blue-400 shrink-0">
              <Box className="h-5 w-5 shrink-0" />
            </div>
            <div>
              <span className="block text-[8px] font-bold text-muted-foreground leading-none">
                {cardContentTitle}
              </span>
              <span className="block text-[14px] font-extrabold text-foreground leading-none mt-1">
                {cardContentVal}
              </span>
            </div>
          </motion.div>

          {/* Floating Card 3: AI Assistant Helper (Bottom Left in RTL / Bottom Right in LTR) */}
          <motion.div
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-16 left-6 sm:left-12 bg-card border border-border/80 p-3 rounded-xl shadow-lg flex items-center gap-3 select-none z-10 max-w-[170px]"
          >
            <div className="rounded-lg bg-accent/15 p-2 text-accent shrink-0">
              <Bot className="h-4.5 w-4.5 shrink-0" />
            </div>
            <div className="space-y-0.5">
              <span className="block text-[9px] font-extrabold text-foreground leading-none">
                {cardAITitle}
              </span>
              <span className="block text-[7px] text-muted-foreground font-semibold leading-none">
                {cardAISub}
              </span>
            </div>
          </motion.div>
        </div>

        {/* Right Side (Text Area) */}
        <div className="flex-1 text-left rtl:text-right space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Badge
              variant="outline"
              className="gap-1.5 px-3 py-1 text-xs border-primary/20 bg-primary/5 rounded-full font-semibold select-none text-primary"
            >
              <Sparkles className="h-3 w-3 text-accent shrink-0" />
              {badgeText}
            </Badge>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h1 className="text-display font-heading font-extrabold tracking-tight text-[#0B2D5B] dark:text-white leading-[1.15] max-w-xl">
              {lines.map((line, idx) => (
                <span key={idx} className="block">
                  {renderLine(line)}
                </span>
              ))}
            </h1>
          </motion.div>

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
            {/* CTA 1 (Primary - Dark Navy filled) */}
            <Button
              size="lg"
              className="rounded-xl h-12 px-6 font-bold bg-[#0B2D5B] hover:bg-[#0B2D5B]/90 text-white shadow-md cursor-pointer shrink-0 transition-all"
              asChild
            >
              <Link href="/auth/register" className="gap-2 flex items-center">
                <span>{primaryCTA}</span>
                <span className="h-5 w-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <ArrowRight className="h-3 w-3 text-white rtl:rotate-180 shrink-0" />
                </span>
              </Link>
            </Button>
            {/* CTA 2 (Secondary - Outline play button) */}
            <Button
              size="lg"
              variant="outline"
              className="rounded-xl h-12 px-6 font-bold border-secondary text-secondary hover:bg-secondary/5 cursor-pointer shrink-0 transition-all"
              asChild
            >
              <Link href="#courses" className="gap-2 flex items-center">
                <span className="h-5 w-5 rounded-full border border-current flex items-center justify-center text-[10px] shrink-0">▶</span>
                <span>{secondaryCTA}</span>
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>

      {/* 2. Trust Badges grid (matches visual row in image) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 border-t border-border/40 select-none">
        {trustBadges.map((badge, idx) => (
          <div key={idx} className="flex items-center gap-3 text-left rtl:text-right">
            <div className="rounded-2xl bg-primary/5 p-3 text-primary shrink-0 border border-primary/10">
              {getTrustIcon(badge.icon)}
            </div>
            <div className="space-y-0.5">
              <h4 className="text-xs font-extrabold text-foreground leading-tight">
                {badge.title}
              </h4>
              <p className="text-[10px] text-muted-foreground font-semibold leading-tight">
                {badge.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Dark Navy statistics container (matches navy card row at bottom of image) */}
      <div className="bg-[#0B2D5B] text-primary-foreground rounded-[2rem] p-6 md:p-8 flex flex-col md:flex-row items-center justify-around gap-8 shadow-xl select-none relative overflow-hidden">
        {/* Background micro gradient accents */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
        {quickStats.map((stat, idx) => (
          <div key={idx} className="flex items-center gap-4 text-left rtl:text-right w-fit shrink-0">
            <div className="rounded-full bg-white/10 p-3 text-white shrink-0 border border-white/5 shadow-inner">
              {getStatIcon(stat.icon)}
            </div>
            <div className="space-y-0.5">
              <span className="block text-xl md:text-2xl font-black text-white leading-none">
                {stat.value}
              </span>
              <span className="block text-[11px] text-blue-200/90 font-bold leading-none mt-1">
                {stat.label}
              </span>
            </div>
          </div>
        ))}
      </div>

    </section>
  );
}
export default HeroSection;

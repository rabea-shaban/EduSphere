"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Clock, ShieldCheck, Users, TrendingUp, Bot, Lock } from "lucide-react";
import type { FeatureItem } from "./types";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  feature: FeatureItem;
  index: number;
}

function FeatureIcon({ variant, className }: { variant: FeatureItem["iconVariant"]; className?: string }) {
  switch (variant) {
    case "clock":
      return <Clock className={cn("h-6 w-6", className)} />;
    case "shield":
      return <ShieldCheck className={cn("h-6 w-6", className)} />;
    case "users":
      return <Users className={cn("h-6 w-6", className)} />;
    case "chart":
      return <TrendingUp className={cn("h-6 w-6", className)} />;
    case "ai":
      return <Bot className={cn("h-6 w-6", className)} />;
    case "interactive":
      return <Lock className={cn("h-6 w-6", className)} />;
    default:
      return <Clock className={cn("h-6 w-6", className)} />;
  }
}

export function FeatureCard({ feature, index }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -6 }}
      className="group relative flex flex-col items-center justify-between text-center bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-[24px] p-6 sm:p-7 shadow-[0_8px_30px_rgba(11,45,91,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)] hover:shadow-[0_20px_40px_rgba(11,45,91,0.1)] dark:hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)] transition-all duration-300 select-none overflow-hidden h-full"
    >
      {/* Top Floating Icon Badge & Dotted Background Decoration */}
      <div className="relative w-full flex items-center justify-center mb-5 pt-2">
        {/* Decorative dotted grid behind icon */}
        <div aria-hidden className="absolute grid grid-cols-3 gap-1 opacity-20 dark:opacity-30 pointer-events-none">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="w-1 h-1 rounded-full bg-slate-400 dark:bg-slate-500" />
          ))}
        </div>

        {/* Circular Floating Badge */}
        <div
          className={cn(
            "relative z-10 w-14 h-14 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-sm",
            feature.badgeBg
          )}
        >
          <FeatureIcon variant={feature.iconVariant} className={feature.iconColor} />
        </div>
      </div>

      {/* Title & Description */}
      <div className="space-y-2.5 flex-1 flex flex-col justify-start">
        <h3
          className="text-base sm:text-lg font-extrabold text-[#0B2D5B] dark:text-white leading-snug"
          style={{ fontFamily: "'Cairo', sans-serif" }}
        >
          {feature.title}
        </h3>
        <p
          className="text-xs sm:text-sm text-[#64748B] dark:text-slate-400 font-medium leading-relaxed max-w-[210px] mx-auto"
          style={{ fontFamily: "'Cairo', sans-serif" }}
        >
          {feature.description}
        </p>
      </div>
    </motion.div>
  );
}

export default FeatureCard;

"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { GraduationCap, HelpCircle, Lightbulb, Zap, Plus } from "lucide-react";
import type { AICapability } from "./types";
import { cardFadeUpVariants, cardHoverVariants } from "./animations";
import { cn } from "@/lib/utils";

interface AssistantFeatureCardProps {
  capability: AICapability;
  index: number;
}

function CapabilityIcon({ iconName, className }: { iconName: AICapability["iconName"]; className?: string }) {
  switch (iconName) {
    case "cap":
      return <GraduationCap className={cn("h-4 w-4 text-[#1E73D8] dark:text-blue-400", className)} />;
    case "help":
      return <HelpCircle className={cn("h-4 w-4 text-[#1E73D8] dark:text-blue-400", className)} />;
    case "lightbulb":
      return <Lightbulb className={cn("h-4 w-4 text-[#1E73D8] dark:text-blue-400", className)} />;
    case "zap":
      return <Zap className={cn("h-4 w-4 text-[#1E73D8] dark:text-blue-400", className)} />;
    default:
      return <GraduationCap className={cn("h-4 w-4 text-[#1E73D8] dark:text-blue-400", className)} />;
  }
}

export function AssistantFeatureCard({ capability }: AssistantFeatureCardProps) {
  return (
    <motion.div
      variants={cardFadeUpVariants}
      initial="initial"
      whileHover="hover"
      custom={cardHoverVariants}
      className="flex items-center gap-3 w-full select-none"
    >
      {/* Plus Symbol directly to the right of the card (Robot side) */}
      <div className="shrink-0 flex items-center justify-center text-[#1E73D8] dark:text-blue-400 font-extrabold text-lg">
        <Plus className="h-5 w-5 stroke-[3]" />
      </div>

      {/* Main Glassmorphism Capability Card */}
      <div className="flex-1 bg-white/95 dark:bg-slate-800/90 border border-slate-100 dark:border-slate-700/80 rounded-2xl p-3 px-5 shadow-[0_4px_20px_rgba(11,45,91,0.05)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_25px_rgba(30,115,216,0.12)] transition-all duration-300 flex items-center justify-between gap-4">
        {/* Capability Title */}
        <span
          className="text-xs sm:text-sm font-extrabold text-[#0B2D5B] dark:text-slate-100"
          style={{ fontFamily: "'Cairo', sans-serif" }}
        >
          {capability.title}
        </span>

        {/* Circular Icon Badge */}
        <div className="shrink-0 w-8 h-8 rounded-full bg-[#EBF4FF] dark:bg-blue-950/80 flex items-center justify-center shadow-inner">
          <CapabilityIcon iconName={capability.iconName} />
        </div>
      </div>
    </motion.div>
  );
}

export default AssistantFeatureCard;

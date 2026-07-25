"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { GraduationCap, Play } from "lucide-react";
import { CTA_COLORS } from "./constants";
import { cn } from "@/lib/utils";

interface CTAButtonsProps {
  primaryBtnText: string;
  primaryBtnHref: string;
  secondaryBtnText: string;
  secondaryBtnHref: string;
}

export function CTAButtons({
  primaryBtnText,
  primaryBtnHref,
  secondaryBtnText,
  secondaryBtnHref,
}: CTAButtonsProps) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-4 pt-2 select-none">

      {/* Primary Button: Orange Gradient */}
      <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
        <Link
          href={primaryBtnHref}
          className={cn(
            "h-12 px-7 rounded-xl flex items-center justify-center gap-2.5 text-white font-bold text-sm shadow-xl shadow-orange-950/30 dark:shadow-orange-950/50 transition-all duration-200 cursor-pointer",
            CTA_COLORS.primaryOrangeGradient
          )}
          style={{ fontFamily: "'Cairo', sans-serif" }}
        >
          <span>{primaryBtnText}</span>
          <GraduationCap className="h-4.5 w-4.5 text-white shrink-0" />
        </Link>
      </motion.div>

      {/* Secondary Button: White / Dark Slate Background */}
      <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
        <Link
          href={secondaryBtnHref}
          className={cn(
            "h-12 px-7 rounded-xl flex items-center justify-center gap-2.5 font-bold text-sm transition-all duration-200 shadow-md cursor-pointer",
            CTA_COLORS.secondaryWhiteBg
          )}
          style={{ fontFamily: "'Cairo', sans-serif" }}
        >
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full border border-[#1E73D8] dark:border-blue-400">
            <Play className="h-2.5 w-2.5 fill-[#1E73D8] text-[#1E73D8] dark:fill-blue-400 dark:text-blue-400" />
          </span>
          <span>{secondaryBtnText}</span>
        </Link>
      </motion.div>

    </div>
  );
}

export default CTAButtons;

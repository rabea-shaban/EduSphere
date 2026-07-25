"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { MessageSquare } from "lucide-react";
import { floatingButtonVariants } from "./animations";

export function FloatingSupportButton() {
  return (
    <div className="fixed bottom-6 left-6 z-50 flex items-center gap-3 select-none">
      {/* Small Tooltip Pill */}
      <div className="hidden sm:flex flex-col text-right bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border border-slate-100 dark:border-slate-700 rounded-2xl py-1.5 px-4 shadow-lg">
        <span
          className="text-xs font-bold text-[#0B2D5B] dark:text-slate-100"
          style={{ fontFamily: "'Cairo', sans-serif" }}
        >
          تحتاج مساعدة؟
        </span>
        <span
          className="text-[11px] font-medium text-[#64748B] dark:text-slate-400"
          style={{ fontFamily: "'Cairo', sans-serif" }}
        >
          نحن هنا لمساعدتك
        </span>
      </div>

      {/* Circular Blue Floating Button */}
      <motion.button
        type="button"
        aria-label="الدعم المباشر"
        variants={floatingButtonVariants}
        initial="initial"
        animate="animate"
        whileHover="hover"
        className="w-13 h-13 rounded-full bg-[#1E73D8] hover:bg-[#155ab3] text-white shadow-xl shadow-blue-500/30 dark:shadow-blue-900/50 flex items-center justify-center cursor-pointer transition-colors duration-200"
      >
        <MessageSquare className="h-6 w-6 fill-white text-white" />
      </motion.button>
    </div>
  );
}

export default FloatingSupportButton;

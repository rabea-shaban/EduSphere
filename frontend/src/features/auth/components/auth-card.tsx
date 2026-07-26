"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AuthCardProps {
  children: React.ReactNode;
  className?: string;
}

export function AuthCard({ children, className }: AuthCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.98 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "w-full rounded-[32px]",
        "bg-white/95 dark:bg-[#132F5E]/90 backdrop-blur-xl",
        "border border-slate-200/80 dark:border-white/10",
        "shadow-[0_20px_60px_-15px_rgba(11,45,91,0.12)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)]",
        "p-6 sm:p-10 md:p-11",
        "transition-all duration-300",
        className
      )}
    >
      {children}
    </motion.div>
  );
}

export default AuthCard;

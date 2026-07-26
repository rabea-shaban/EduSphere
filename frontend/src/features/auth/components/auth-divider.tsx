"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface AuthDividerProps {
  text?: string;
  className?: string;
}

export function AuthDivider({
  text = "أو متابعة من خلال",
  className,
}: AuthDividerProps) {
  return (
    <div className={cn("relative my-6 flex items-center justify-center", className)}>
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-slate-200 dark:border-white/10" />
      </div>
      <div className="relative bg-white dark:bg-[#132F5E] px-4 text-xs font-semibold text-slate-400 dark:text-slate-400">
        {text}
      </div>
    </div>
  );
}

export default AuthDivider;

"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface SocialButtonsProps {
  onGoogleClick?: () => void;
  onAppleClick?: () => void;
  onMicrosoftClick?: () => void;
  className?: string;
}

export function SocialButtons({
  onGoogleClick,
  onAppleClick,
  onMicrosoftClick,
  className,
}: SocialButtonsProps) {
  return (
    <div className={cn("grid grid-cols-3 gap-3 w-full", className)}>
      {/* Google */}
      <button
        type="button"
        onClick={onGoogleClick}
        className="flex items-center justify-center gap-2 h-11 px-3 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F274D] text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 hover:border-slate-300 dark:hover:border-white/20 transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0B2D5B] dark:focus:ring-[#F58220]"
        aria-label="تسجيل الدخول بواسطة Google"
      >
        <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
          />
          <path
            fill="#34A853"
            d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.25 21.32 7.32 24 12 24z"
          />
          <path
            fill="#FBBC05"
            d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.18 0 9.99 0 12s.46 3.82 1.26 5.42l4.02-3.15z"
          />
          <path
            fill="#EA4335"
            d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.32 0 3.25 2.68 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
          />
        </svg>
        <span className="text-xs font-bold hidden sm:inline">Google</span>
      </button>

      {/* Apple */}
      <button
        type="button"
        onClick={onAppleClick}
        className="flex items-center justify-center gap-2 h-11 px-3 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F274D] text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 hover:border-slate-300 dark:hover:border-white/20 transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0B2D5B] dark:focus:ring-[#F58220]"
        aria-label="تسجيل الدخول بواسطة Apple"
      >
        <svg className="h-5 w-5 shrink-0 fill-current text-slate-900 dark:text-white" viewBox="0 0 24 24">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.09c.67-.82 1.12-1.96.99-3.09-.97.04-2.14.65-2.83 1.46-.62.72-1.16 1.88-1.01 3 .01 0 .04 0 .07 0 1.08 0 2.18-.62 2.78-1.37z" />
        </svg>
        <span className="text-xs font-bold hidden sm:inline">Apple</span>
      </button>

      {/* Microsoft */}
      <button
        type="button"
        onClick={onMicrosoftClick}
        className="flex items-center justify-center gap-2 h-11 px-3 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F274D] text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 hover:border-slate-300 dark:hover:border-white/20 transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0B2D5B] dark:focus:ring-[#F58220]"
        aria-label="تسجيل الدخول بواسطة Microsoft"
      >
        <svg className="h-4.5 w-4.5 shrink-0" viewBox="0 0 23 23">
          <path fill="#f35325" d="M1 1h10v10H1z" />
          <path fill="#81bc06" d="M12 1h10v10H12z" />
          <path fill="#05a6f0" d="M1 12h10v10H1z" />
          <path fill="#ffba08" d="M12 12h10v10H12z" />
        </svg>
        <span className="text-xs font-bold hidden sm:inline">Microsoft</span>
      </button>
    </div>
  );
}

export default SocialButtons;

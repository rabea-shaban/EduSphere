"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PrimaryButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const PrimaryButton = React.forwardRef<
  HTMLButtonElement,
  PrimaryButtonProps
>(
  (
    {
      children,
      className,
      variant = "primary",
      size = "lg",
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "relative inline-flex items-center justify-center font-bold tracking-wide transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-[#F58220]/20 disabled:pointer-events-none disabled:opacity-60 select-none";

    const sizeStyles =
      size === "lg"
        ? "h-12 sm:h-13 px-6 rounded-xl text-base"
        : "h-10 px-4 rounded-lg text-sm";

    const variantStyles = {
      primary:
        "bg-gradient-to-r from-[#F58220] to-[#FF9A2A] text-white shadow-lg shadow-[#F58220]/25 hover:shadow-xl hover:shadow-[#F58220]/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99]",
      secondary:
        "bg-[#0B2D5B] text-white shadow-lg shadow-[#0B2D5B]/20 hover:bg-[#071C3B] hover:shadow-xl hover:shadow-[#0B2D5B]/30 hover:-translate-y-0.5 active:translate-y-0",
      outline:
        "border-2 border-[#0B2D5B] text-[#0B2D5B] dark:text-[#F58220] dark:border-[#F58220] hover:bg-[#0B2D5B]/10 hover:-translate-y-0.5 active:translate-y-0",
      ghost:
        "bg-transparent text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#0F274D] hover:text-[#0B2D5B] dark:hover:text-white",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, sizeStyles, variantStyles[variant], className)}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>جاري التحميل...</span>
          </span>
        ) : (
          <span className="flex items-center gap-2">
            {rightIcon && <span className="shrink-0">{rightIcon}</span>}
            <span>{children}</span>
            {leftIcon && <span className="shrink-0">{leftIcon}</span>}
          </span>
        )}
      </button>
    );
  }
);

PrimaryButton.displayName = "PrimaryButton";
export default PrimaryButton;

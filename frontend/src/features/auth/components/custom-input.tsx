"use client";

import * as React from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CustomInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  isSuccess?: boolean;
  icon?: React.ReactNode;
  endIcon?: React.ReactNode;
  containerClassName?: string;
}

export const CustomInput = React.forwardRef<HTMLInputElement, CustomInputProps>(
  (
    {
      label,
      error,
      isSuccess,
      icon,
      endIcon,
      className,
      containerClassName,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || React.useId();

    return (
      <div className={cn("w-full space-y-2 text-right", containerClassName)}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-semibold text-[#1E293B] dark:text-slate-200 select-none"
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          {icon && (
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none transition-colors group-focus-within:text-[#0B2D5B] dark:group-focus-within:text-[#F58220]">
              {icon}
            </div>
          )}

          <input
            id={inputId}
            ref={ref}
            className={cn(
              "w-full h-12 rounded-xl text-sm font-medium transition-all duration-200 outline-none",
              "bg-slate-50/80 dark:bg-[#0F274D] text-[#1E293B] dark:text-[#F8FAFC]",
              "border border-slate-200 dark:border-white/10",
              "placeholder:text-slate-400 dark:placeholder:text-slate-500",
              "hover:border-slate-300 dark:hover:border-white/20",
              "focus:bg-white dark:focus:bg-[#0F274D]",
              "focus:border-[#0B2D5B] dark:focus:border-[#F58220]",
              "focus:ring-4 focus:ring-[#0B2D5B]/15 dark:focus:ring-[#F58220]/20",
              icon ? "pr-11 pl-4" : "px-4",
              endIcon ? "pl-11" : "",
              error &&
                "border-red-500/80 focus:border-red-500 focus:ring-red-500/15 dark:border-red-500/80 dark:focus:border-red-500",
              isSuccess &&
                !error &&
                "border-emerald-500/80 focus:border-emerald-500 focus:ring-emerald-500/15",
              className
            )}
            {...props}
          />

          {endIcon ? (
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center">
              {endIcon}
            </div>
          ) : isSuccess && !error ? (
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-500 pointer-events-none">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          ) : error ? (
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-red-500 pointer-events-none">
              <AlertCircle className="h-5 w-5" />
            </div>
          ) : null}
        </div>

        {error && (
          <p className="text-xs font-semibold text-red-500 dark:text-red-400 flex items-center gap-1 mt-1 animate-fadeIn">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            <span>{error}</span>
          </p>
        )}
      </div>
    );
  }
);

CustomInput.displayName = "CustomInput";
export default CustomInput;

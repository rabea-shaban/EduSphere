"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// 1. Unified Section Outer Wrapper (72px Mobile -> 96px Tablet -> 120px Desktop spacing)
export interface SectionWrapperProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export const SectionWrapper = React.forwardRef<HTMLElement, SectionWrapperProps>(
  ({ children, className, id, ...props }, ref) => {
    return (
      <section
        ref={ref}
        id={id}
        className={cn(
          "relative w-full py-[72px] sm:py-[96px] lg:py-[120px] bg-transparent overflow-hidden transition-colors duration-300",
          className
        )}
        {...props}
      >
        {children}
      </section>
    );
  }
);
SectionWrapper.displayName = "SectionWrapper";

// 2. Global Unified Container (max-width: 1280px, width: 100%, 24px Mobile -> 32px Tablet -> 48px Desktop padding)
export interface SectionContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export function SectionContainer({ children, className, ...props }: SectionContainerProps) {
  return (
    <div
      className={cn(
        "w-full max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-12",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// 3. Section Header Wrapper (Centered, Max-Width 720px)
export interface SectionHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export function SectionHeader({ children, className, ...props }: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center text-center max-w-[720px] mx-auto mb-12 sm:mb-14 lg:mb-16 select-none",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// 4. Section Title Component (Cairo 800, 32px Mobile -> 40px Tablet -> 48px Desktop, -0.02em tracking, #0B2D5B)
export interface SectionTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
  className?: string;
  highlightText?: string;
}

export function SectionTitle({ children, highlightText, className, ...props }: SectionTitleProps) {
  return (
    <h2
      className={cn(
        "text-[32px] sm:text-[40px] lg:text-[48px] font-black text-[#0B2D5B] dark:text-white tracking-[-0.02em] leading-[1.2] text-center mb-4",
        className
      )}
      style={{ fontFamily: "'Cairo', sans-serif" }}
      {...props}
    >
      {children}
      {highlightText && (
        <>
          {" "}
          <span className="text-[#F58220] dark:text-orange-400">{highlightText}</span>
        </>
      )}
    </h2>
  );
}

// 5. Section Description Component (Cairo 500, 16px Mobile -> 18px Tablet -> 20px Desktop, 180% leading, #64748B)
export interface SectionDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
  className?: string;
}

export function SectionDescription({ children, className, ...props }: SectionDescriptionProps) {
  return (
    <p
      className={cn(
        "text-[16px] sm:text-[18px] lg:text-[20px] font-medium leading-[1.8] text-[#64748B] dark:text-slate-400 text-center max-w-[720px] mx-auto",
        className
      )}
      style={{ fontFamily: "'Cairo', sans-serif" }}
      {...props}
    >
      {children}
    </p>
  );
}

// 6. Section Content Primitive (Grid/Card Container Wrapper)
export interface SectionContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export function SectionContent({ children, className, ...props }: SectionContentProps) {
  return (
    <div
      className={cn(
        "w-full flex flex-col items-center justify-center",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

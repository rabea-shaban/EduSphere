import * as React from "react";
import { cn } from "@/lib/utils";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  spacing?: "sm" | "md" | "lg" | "none";
}

/**
 * A semantic section element wrapper that ensures uniform padding and margins
 * across all pages of the SaaS.
 */
export function Section({
  spacing = "md",
  className,
  children,
  ...props
}: SectionProps) {
  const spacingClasses = {
    none: "py-0",
    sm: "py-6 sm:py-8",
    md: "py-10 sm:py-14",
    lg: "py-16 sm:py-24",
  };

  return (
    <section className={cn(spacingClasses[spacing], className)} {...props}>
      {children}
    </section>
  );
}
export default Section;

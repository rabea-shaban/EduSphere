import * as React from "react";
import { cn } from "@/lib/utils";

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  spacing?: "sm" | "md" | "lg" | "none";
}

/**
 * A semantic section element wrapper that ensures uniform padding and margins
 * across all pages of the SaaS. Supports ref forwarding for animations.
 */
export const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ spacing = "md", className, children, ...props }, ref) => {
    const spacingClasses = {
      none: "py-0",
      sm: "py-6 sm:py-8",
      md: "py-10 sm:py-14",
      lg: "py-16 sm:py-24",
    };

    return (
      <section ref={ref} className={cn(spacingClasses[spacing], className)} {...props}>
        {children}
      </section>
    );
  }
);

Section.displayName = "Section";
export default Section;

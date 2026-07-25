import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-ring duration-150",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground shadow-sm",
        secondary: "border-transparent bg-secondary/15 text-secondary border border-secondary/20",
        outline: "border-border text-foreground bg-transparent",
        success: "border-transparent bg-success/15 text-success border border-success/20",
        warning: "border-transparent bg-warning/15 text-warning-foreground border border-warning/20",
        danger: "border-transparent bg-danger/15 text-danger border border-danger/20",
        info: "border-transparent bg-info/15 text-info border border-info/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };

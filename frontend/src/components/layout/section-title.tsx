import * as React from "react";
import { cn } from "@/lib/utils";

interface SectionTitleProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  align?: "left" | "center";
}

export function SectionTitle({
  title,
  subtitle,
  action,
  align = "left",
  className,
  ...props
}: SectionTitleProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-8",
        align === "center" && "sm:flex-col sm:items-center sm:text-center",
        className
      )}
      {...props}
    >
      <div className="space-y-1.5 max-w-2xl">
        <h2 className="text-h2 font-heading tracking-tight text-foreground/90">{title}</h2>
        {subtitle && <p className="text-sm text-muted-foreground leading-relaxed">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
export default SectionTitle;

import * as React from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  active?: boolean;
}

export interface BreadcrumbProps extends React.HtmlHTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items, className, ...props }: BreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("flex items-center text-xs font-semibold text-muted-foreground", className)}
      {...props}
    >
      <ol className="flex items-center gap-1.5 flex-wrap">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={idx} className="flex items-center gap-1.5">
              {idx > 0 && (
                <ChevronRight className="h-3.5 w-3.5 opacity-60 shrink-0 rtl:rotate-180" />
              )}
              {item.href && !isLast ? (
                <a href={item.href} className="transition-colors hover:text-foreground">
                  {item.label}
                </a>
              ) : (
                <span
                  className={cn(
                    "select-none",
                    isLast || item.active ? "text-foreground/90 font-bold" : ""
                  )}
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
export default Breadcrumb;

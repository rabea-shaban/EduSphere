"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ChipProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  onDelete?: () => void;
  onClick?: () => void;
  active?: boolean;
  iconLeft?: React.ReactNode;
}

export function Chip({
  label,
  onDelete,
  onClick,
  active = false,
  iconLeft,
  className,
  ...props
}: ChipProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 py-1 text-xs font-semibold text-muted-foreground transition-all duration-150 select-none",
        onClick && "cursor-pointer hover:bg-muted hover:text-foreground",
        active &&
          "bg-primary border-primary text-primary-foreground hover:bg-primary/95 hover:text-primary-foreground",
        className
      )}
      {...props}
    >
      {iconLeft && <span className="inline-flex shrink-0">{iconLeft}</span>}
      <span>{label}</span>
      {onDelete && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className={cn(
            "rounded-full p-0.5 hover:bg-muted-foreground/20 text-muted-foreground transition-colors cursor-pointer inline-flex",
            active &&
              "text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/20"
          )}
          aria-label={`Remove ${label}`}
        >
          <X className="h-3 w-3 shrink-0" />
        </button>
      )}
    </div>
  );
}

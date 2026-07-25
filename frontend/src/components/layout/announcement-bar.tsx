"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnnouncementBarProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "onAnimationStart" | "onDragStart" | "onDragEnd" | "onDrag"
  > {
  message?: string;
  actionText?: string;
  onActionClick?: () => void;
}

export function AnnouncementBar({
  message = "Sprint 3 is live! Discover the complete layouts and navigation system.",
  actionText = "Learn more",
  onActionClick,
  className,
  ...props
}: AnnouncementBarProps) {
  const [isVisible, setIsVisible] = React.useState(true);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className={cn(
          "w-full bg-primary text-primary-foreground text-xs font-semibold py-2 px-4 flex items-center justify-between z-50 select-none overflow-hidden border-b border-primary/20",
          className
        )}
        {...props}
      >
        <div className="flex-1 flex items-center justify-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-accent animate-pulse shrink-0" />
          <span className="text-center truncate leading-none">{message}</span>
          {actionText && (
            <button
              onClick={onActionClick}
              className="underline hover:text-accent font-bold ml-1 cursor-pointer transition-colors"
            >
              {actionText}
            </button>
          )}
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="rounded p-0.5 hover:bg-primary-foreground/20 text-primary-foreground/80 hover:text-primary-foreground transition-colors cursor-pointer inline-flex ml-2 shrink-0"
          aria-label="Dismiss Announcement"
        >
          <X className="h-3.5 w-3.5 shrink-0" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
export default AnnouncementBar;

"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Sparkles, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

interface ComingSoonProps extends React.HTMLAttributes<HTMLDivElement> {
  moduleName: string;
  expectedDate?: string;
  onNotifyMe?: () => void;
}

export function ComingSoon({
  moduleName,
  expectedDate,
  onNotifyMe,
  className,
  ...props
}: ComingSoonProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 rounded-2xl bg-card border border-border shadow-md max-w-lg mx-auto my-12 select-none",
        className
      )}
      {...props}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-center rounded-2xl bg-accent/10 text-accent p-4 mb-4 shrink-0"
      >
        <Sparkles className="h-10 w-10 animate-pulse" />
      </motion.div>
      <h2 className="font-heading text-xl font-extrabold tracking-tight text-foreground">
        {moduleName}
      </h2>
      <p className="text-sm text-muted-foreground mt-3 max-w-md leading-relaxed">
        We are crafting a premium learning experience. This module is currently under development and will be available soon.
      </p>
      {expectedDate && (
        <div className="flex items-center gap-2 mt-4 text-xs font-bold text-primary bg-primary/5 px-3 py-1.5 rounded-lg border border-primary/10">
          <Calendar className="h-4 w-4 shrink-0" />
          <span>Expected launch: {expectedDate}</span>
        </div>
      )}
      {onNotifyMe && (
        <Button onClick={onNotifyMe} className="mt-6" size="sm">
          Notify Me
        </Button>
      )}
    </div>
  );
}
export default ComingSoon;

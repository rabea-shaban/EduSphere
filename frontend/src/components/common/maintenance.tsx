"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Wrench } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";

interface MaintenanceProps extends React.HTMLAttributes<HTMLDivElement> {
  estimatedTime?: string;
}

export function Maintenance({
  estimatedTime = "2 hours",
  className,
  ...props
}: MaintenanceProps) {
  return (
    <div
      className={cn(
        "flex min-h-screen flex-col items-center justify-center p-6 text-center select-none bg-background",
        className
      )}
      {...props}
    >
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-xl"
      >
        <Logo size="md" showText={true} className="justify-center mb-6" />
        <div className="flex items-center justify-center rounded-2xl bg-warning/15 text-warning h-16 w-16 mx-auto mb-6 shrink-0 border border-warning/20">
          <Wrench className="h-8 w-8 shrink-0" />
        </div>
        <h2 className="font-heading text-xl font-bold tracking-tight text-foreground">
          Under Maintenance
        </h2>
        <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
          We are currently upgrading our platform servers to improve user experience. We will be back shortly.
        </p>
        <div className="mt-6 border-t border-border/80 pt-4">
          <p className="text-xs text-muted-foreground">
            Estimated duration:{" "}
            <span className="font-bold text-foreground">{estimatedTime}</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
export default Maintenance;

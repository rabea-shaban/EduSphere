"use client";

import * as React from "react";
import { RefreshCw, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

interface ErrorStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  onRetry?: () => void;
  retryText?: string;
  loading?: boolean;
}

export function ErrorState({
  title = "An Error Occurred",
  description = "Something went wrong while loading the data. Please try again.",
  onRetry,
  retryText = "Retry Request",
  loading = false,
  className,
  ...props
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 rounded-2xl bg-card border border-border shadow-md max-w-md mx-auto my-12 select-none",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-center rounded-2xl bg-danger/10 text-danger p-4 mb-4 shrink-0">
        <ShieldAlert className="h-10 w-10 shrink-0" />
      </div>
      <h3 className="font-heading text-lg font-bold text-foreground/90">{title}</h3>
      <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{description}</p>
      {onRetry && (
        <Button
          onClick={onRetry}
          loading={loading}
          className="mt-6"
          size="sm"
          iconLeft={!loading && <RefreshCw className="h-3.5 w-3.5 shrink-0" />}
        >
          {retryText}
        </Button>
      )}
    </div>
  );
}
export default ErrorState;

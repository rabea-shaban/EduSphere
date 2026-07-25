import * as React from "react";
import { cn } from "@/lib/utils";
import { Spinner } from "../ui/spinner";

interface PageLoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  message?: string;
}

export function PageLoader({
  message = "Loading content...",
  className,
  ...props
}: PageLoaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-12 text-center select-none max-w-sm mx-auto",
        className
      )}
      {...props}
    >
      <Spinner size="md" className="mb-4 text-primary" />
      <p className="text-sm text-muted-foreground font-semibold">{message}</p>
    </div>
  );
}
export default PageLoader;

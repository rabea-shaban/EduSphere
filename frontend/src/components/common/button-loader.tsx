import * as React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type ButtonLoaderProps = React.HTMLAttributes<HTMLSpanElement>;

export function ButtonLoader({ className, ...props }: ButtonLoaderProps) {
  return (
    <span
      className={cn("inline-flex items-center justify-center shrink-0", className)}
      {...props}
    >
      <Loader2 className="h-4 w-4 animate-spin text-current" />
    </span>
  );
}
export default ButtonLoader;

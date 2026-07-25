import * as React from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ErrorMessageProps extends React.HTMLAttributes<HTMLDivElement> {
  message: string;
}

export function ErrorMessage({ message, className, ...props }: ErrorMessageProps) {
  if (!message) return null;

  return (
    <div
      className={cn(
        "flex items-center gap-2.5 rounded-xl border border-danger/25 bg-danger/10 p-3 text-xs font-bold text-danger",
        className
      )}
      role="alert"
      {...props}
    >
      <AlertCircle className="h-4.5 w-4.5 shrink-0" />
      <span className="leading-normal flex-1 text-left rtl:text-right">{message}</span>
    </div>
  );
}
export default ErrorMessage;

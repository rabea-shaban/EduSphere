import * as React from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

interface NotFoundStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  actionText?: string;
  href?: string;
}

export function NotFoundState({
  title = "Page Not Found",
  description = "The page you are looking for does not exist or has been moved.",
  actionText = "Back to Home",
  href = "/",
  className,
  ...props
}: NotFoundStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 rounded-2xl bg-card border border-border shadow-md max-w-md mx-auto my-12 select-none",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-center rounded-2xl bg-danger/10 text-danger p-4 mb-4 shrink-0">
        <AlertCircle className="h-10 w-10 shrink-0" />
      </div>
      <h3 className="font-heading text-lg font-bold text-foreground/90">{title}</h3>
      <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{description}</p>
      <Button asChild className="mt-6" size="sm">
        <a href={href}>{actionText}</a>
      </Button>
    </div>
  );
}
export default NotFoundState;

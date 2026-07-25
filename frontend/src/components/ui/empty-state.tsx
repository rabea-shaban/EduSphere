import * as React from "react";
import { Inbox } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
  icon?: React.ReactNode;
  actionText?: string;
  onAction?: () => void;
}

export function EmptyState({
  title,
  description,
  icon = <Inbox className="h-10 w-10 text-muted-foreground/60" />,
  actionText,
  onAction,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-border rounded-2xl bg-card/40 backdrop-blur-xs select-none max-w-md mx-auto my-4",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-center rounded-2xl bg-muted p-4 mb-4 shrink-0 text-muted-foreground/70">
        {icon}
      </div>
      <h3 className="font-heading text-lg font-bold text-foreground/90">{title}</h3>
      <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{description}</p>
      {actionText && onAction && (
        <Button onClick={onAction} className="mt-6" size="sm">
          {actionText}
        </Button>
      )}
    </div>
  );
}
export default EmptyState;

import * as React from "react";
import { Inbox } from "lucide-react";
import { cn } from "@/lib/utils";

interface NoDataProps extends React.HTMLAttributes<HTMLDivElement> {
  message?: string;
}

export function NoData({ message = "No records found.", className, ...props }: NoDataProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 text-center text-muted-foreground select-none max-w-sm mx-auto",
        className
      )}
      {...props}
    >
      <Inbox className="h-8 w-8 opacity-40 mb-3 shrink-0" />
      <p className="text-xs font-bold leading-normal">{message}</p>
    </div>
  );
}
export default NoData;

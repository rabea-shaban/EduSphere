"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";

export function SearchBox({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        document.getElementById("db-search-input")?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className={cn("relative w-full max-w-xs md:max-w-sm", className)} {...props}>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground shrink-0 rtl:right-3 rtl:left-auto" />
      <Input
        id="db-search-input"
        type="text"
        placeholder="Search courses, files..."
        className="pl-9 pr-12 rtl:pr-9 rtl:pl-12 h-9 text-xs rounded-xl"
      />
      <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 hidden h-5 select-none items-center gap-0.5 rounded border border-border bg-muted px-1.5 font-mono text-[9px] font-semibold text-muted-foreground opacity-100 sm:flex rtl:left-3 rtl:right-auto">
        <span className="text-[7px] font-sans">⌘</span>K
      </kbd>
    </div>
  );
}
export default SearchBox;

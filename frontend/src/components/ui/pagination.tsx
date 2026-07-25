"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./button";

interface PaginationProps extends React.HTMLAttributes<HTMLElement> {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
  ...props
}: PaginationProps) {
  const getPages = () => {
    const pages: (number | string)[] = [];
    const maxPageNumbersToShow = 5;

    if (totalPages <= maxPageNumbersToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const leftBoundary = Math.max(1, currentPage - 1);
      const rightBoundary = Math.min(totalPages, currentPage + 1);

      if (leftBoundary > 2) {
        pages.push(1);
        pages.push("ellipsis-left");
      } else {
        for (let i = 1; i < leftBoundary; i++) {
          pages.push(i);
        }
      }

      for (let i = leftBoundary; i <= rightBoundary; i++) {
        pages.push(i);
      }

      if (rightBoundary < totalPages - 1) {
        pages.push("ellipsis-right");
        pages.push(totalPages);
      } else {
        for (let i = rightBoundary + 1; i <= totalPages; i++) {
          pages.push(i);
        }
      }
    }

    return pages;
  };

  return (
    <nav
      role="navigation"
      aria-label="Pagination Navigation"
      className={cn("flex justify-center w-full items-center gap-1", className)}
      {...props}
    >
      {/* Previous button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className={cn(
          buttonVariants({ variant: "ghost", size: "icon" }),
          "disabled:opacity-40 cursor-pointer"
        )}
        aria-label="Go to previous page"
      >
        <ChevronLeft className="h-4 w-4 rtl:rotate-180 shrink-0" />
      </button>

      {/* Pages */}
      <div className="flex items-center gap-1">
        {getPages().map((page, index) => {
          if (typeof page === "string") {
            return (
              <span
                key={index}
                className="flex h-10 w-10 items-center justify-center text-muted-foreground select-none"
              >
                <MoreHorizontal className="h-4 w-4 shrink-0" />
              </span>
            );
          }

          const isCurrent = page === currentPage;

          return (
            <button
              key={index}
              onClick={() => onPageChange(page)}
              className={cn(
                buttonVariants({
                  variant: isCurrent ? "default" : "outline",
                  size: "icon",
                }),
                isCurrent && "pointer-events-none",
                "cursor-pointer"
              )}
              aria-current={isCurrent ? "page" : undefined}
              aria-label={`Go to page ${page}`}
            >
              {page}
            </button>
          );
        })}
      </div>

      {/* Next button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className={cn(
          buttonVariants({ variant: "ghost", size: "icon" }),
          "disabled:opacity-40 cursor-pointer"
        )}
        aria-label="Go to next page"
      >
        <ChevronRight className="h-4 w-4 rtl:rotate-180 shrink-0" />
      </button>
    </nav>
  );
}
export default Pagination;

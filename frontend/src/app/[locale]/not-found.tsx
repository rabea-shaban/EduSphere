import * as React from "react";
import { NotFoundState } from "@/components/ui";

/**
 * Next.js Global Not Found page.
 * Catches missing pathnames and displays custom details.
 */
export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex-1 flex items-center justify-center p-6 bg-background">
      <NotFoundState />
    </div>
  );
}

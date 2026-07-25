"use client";

import * as React from "react";
import { ErrorState } from "@/components/ui";

/**
 * Next.js Global Error Boundary page.
 * Catches runtime crashes and shows a fallback retry panel.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error("Global boundary error caught:", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex-1 flex items-center justify-center p-6 bg-background">
      <ErrorState
        title="Application Error"
        description={error.message || "An unexpected rendering error occurred. Please try again."}
        onRetry={reset}
        retryText="Reload Viewport"
      />
    </div>
  );
}

"use client";

import * as React from "react";
import { ErrorState } from "@/components/ui";

/**
 * Next.js Global Error Boundary.
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

  const errorMessage =
    typeof error?.message === "string" && error.message !== "[object Object]"
      ? error.message
      : (error as any)?.details?.[0]?.message ||
        (error as any)?.data?.message ||
        "حدث خطأ أثناء تحميل الصفحة. يرجى المحاولة مجدداً.";

  return (
    <div className="min-h-[60vh] flex-1 flex items-center justify-center p-6 bg-background text-right dir-rtl">
      <ErrorState
        title="حدث خطأ غير متوقع"
        description={errorMessage}
        onRetry={reset}
        retryText="إعادة المحاولة"
      />
    </div>
  );
}

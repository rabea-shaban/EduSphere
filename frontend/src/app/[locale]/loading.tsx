import * as React from "react";
import { LoadingScreen } from "@/components/common";

/**
 * Next.js Global Loading screen.
 * Displays during router prefetching or slow server component loads.
 */
export default function Loading() {
  return <LoadingScreen />;
}

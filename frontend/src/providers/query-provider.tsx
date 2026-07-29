"use client";

import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

interface QueryProviderProps {
  children: React.ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 10 * 1000, // 10 seconds stale time for instant cached rendering + background sync
            gcTime: 20 * 60 * 1000, // 20 minutes garbage collection
            refetchOnWindowFocus: true, // Silently refetch in background when user switches back to browser tab
            refetchOnMount: true, // Auto-refetch stale queries on component mount
            refetchOnReconnect: true, // Auto-refetch when network connection restores
            retry: (failureCount, error: any) => {
              // Don't retry on 401, 403, or 404 errors
              if (error?.statusCode && [401, 403, 404].includes(error.statusCode)) {
                return false;
              }
              return failureCount < 2;
            },
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 8000),
          },
        },
      })
  );

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

export default QueryProvider;

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
            staleTime: 2 * 60 * 1000, // 2 minutes stale time
            gcTime: 10 * 60 * 1000, // 10 minutes garbage collection time
            refetchOnWindowFocus: false,
            retry: (failureCount, error: any) => {
              // Don't retry on 401, 403, or 404 errors
              if (error?.statusCode && [401, 403, 404].includes(error.statusCode)) {
                return false;
              }
              return failureCount < 2;
            },
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
          },
        },
      })
  );

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

export default QueryProvider;

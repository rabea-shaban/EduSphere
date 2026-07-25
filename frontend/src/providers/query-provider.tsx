"use client";

import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

interface QueryProviderProps {
  children: React.ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  // Creating QueryClient inside component state ensures that data is not shared
  // across different users and requests during server side rendering.
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute stale time
            gcTime: 5 * 60 * 1000, // 5 minutes garbage collection time
            refetchOnWindowFocus: false, // Prevents refetching on returning to tab
            retry: 1, // Fail faster, fallback gracefully
          },
        },
      })
  );

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

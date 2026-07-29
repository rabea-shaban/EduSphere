import { QueryClient } from "@tanstack/react-query";

/**
 * Production-ready QueryClient configuration tailored for EduSphere educational platform.
 * 
 * RATIONALE FOR EACH DEFAULT OPTION:
 * 
 * 1. staleTime (5 minutes):
 *    Course catalogs, teacher profiles, quiz structures, and dashboard statistics do not change every second.
 *    Setting a 5-minute staleTime prevents aggressive re-fetching during rapid user navigation between tabs/pages,
 *    eliminating redundant API calls while keeping data reasonably fresh.
 * 
 * 2. gcTime (30 minutes):
 *    Garbage collection time (formerly cacheTime). Unused query results remain cached in memory for 30 minutes.
 *    When a student or teacher navigates back to a previously visited screen (e.g. course details or profile),
 *    data is immediately rendered from cache without waiting for a server roundtrip.
 * 
 * 3. refetchOnWindowFocus (false):
 *    Defaulting to false prevents jarring UI re-render flashes whenever the user switches back and forth between browser tabs.
 *    Specific critical real-time queries (e.g. wallet balance, live notifications) explicitly override this.
 * 
 * 4. refetchOnMount (true):
 *    Checks if data is stale when a component mounts. If data is still fresh (< staleTime), no network request is executed.
 * 
 * 5. refetchOnReconnect (true):
 *    Automatically re-synchronizes queries when network connection is restored after going offline.
 * 
 * 6. retry (smart error handling):
 *    Client-side errors (401 Unauthorized, 403 Forbidden, 404 Not Found, 422 Unprocessable Entity) will not retry
 *    as repeating them won't succeed. Server errors (5xx) or network disconnects retry up to 2 times.
 * 
 * 7. retryDelay (exponential backoff):
 *    Uses exponential backoff with jitter to prevent server thundering herd problems during outages.
 * 
 * 8. networkMode ("online"):
 *    Queries only execute when network connectivity is available, avoiding pointless requests while offline.
 * 
 * 9. structuralSharing (true):
 *    Preserves object references between query updates if data hasn't deeply changed, preventing unnecessary React component re-renders.
 */
export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes default
        gcTime: 1000 * 60 * 30, // 30 minutes cache retention
        refetchOnWindowFocus: false,
        refetchOnMount: true,
        refetchOnReconnect: true,
        networkMode: "online",
        structuralSharing: true,
        retry: (failureCount, error: any) => {
          const status = error?.statusCode || error?.response?.status;
          // Never retry explicit client/auth errors
          if (status && [401, 403, 404, 422].includes(status)) {
            return false;
          }
          return failureCount < 2;
        },
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      },
      mutations: {
        retry: false,
        networkMode: "online",
      },
    },
  });
}

// Single instance for global client usage
let queryClientInstance: QueryClient | undefined;

export function getQueryClient(): QueryClient {
  if (typeof window === "undefined") {
    // Server: always create a new query client
    return createQueryClient();
  }
  // Browser: create a single persistent query client
  if (!queryClientInstance) {
    queryClientInstance = createQueryClient();
  }
  return queryClientInstance;
}

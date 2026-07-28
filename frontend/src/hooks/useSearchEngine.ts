import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import teacherSearchService from "@/services/teacherSearch.service";

export const TEACHER_SEARCH_KEYS = {
  global: (q: string) => ["teacher-search", "global", q] as const,
  suggestions: (q: string) => ["teacher-search", "suggestions", q] as const,
};

export function useGlobalSearch(q: string) {
  return useQuery({
    queryKey: TEACHER_SEARCH_KEYS.global(q),
    queryFn: () => teacherSearchService.globalSearch(q),
    enabled: Boolean(q && q.trim().length > 0),
    staleTime: 1000 * 60 * 2,
  });
}

export function useSearchSuggestions(q: string) {
  return useQuery({
    queryKey: TEACHER_SEARCH_KEYS.suggestions(q),
    queryFn: () => teacherSearchService.getSuggestions(q),
    enabled: Boolean(q && q.trim().length >= 2),
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Custom hook to synchronize search filters, pagination, and sorting with browser URL
 */
export function useURLSearchParamsState() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const getParam = (key: string, defaultValue: string = "") => {
    return searchParams.get(key) || defaultValue;
  };

  const getNumberParam = (key: string, defaultValue: number = 1) => {
    const val = searchParams.get(key);
    return val ? parseInt(val, 10) : defaultValue;
  };

  const updateParams = React.useCallback(
    (newParams: Record<string, string | number | boolean | null | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(newParams).forEach(([key, val]) => {
        if (val === null || val === undefined || val === "" || val === "all") {
          params.delete(key);
        } else {
          params.set(key, String(val));
        }
      });

      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  const resetParams = React.useCallback(() => {
    router.push(pathname, { scroll: false });
  }, [router, pathname]);

  return {
    getParam,
    getNumberParam,
    updateParams,
    resetParams,
    searchParams,
  };
}

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useDebounce } from "./useDebounce";

export interface SearchFilterState {
  search: string;
  category: string;
  stage: string;
  grade: string;
  status: string;
  sortBy: string;
  page: number;
  limit: number;
}

export function useSearchFilter(initialParams: Partial<SearchFilterState> = {}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState<string>(searchParams.get("search") || initialParams.search || "");
  const [category, setCategory] = useState<string>(searchParams.get("category") || initialParams.category || "all");
  const [stage, setStage] = useState<string>(searchParams.get("stage") || initialParams.stage || "all");
  const [grade, setGrade] = useState<string>(searchParams.get("grade") || initialParams.grade || "all");
  const [status, setStatus] = useState<string>(searchParams.get("status") || initialParams.status || "all");
  const [sortBy, setSortBy] = useState<string>(searchParams.get("sortBy") || initialParams.sortBy || "newest");
  const [page, setPage] = useState<number>(Number(searchParams.get("page")) || initialParams.page || 1);
  const [limit, setLimit] = useState<number>(Number(searchParams.get("limit")) || initialParams.limit || 10);

  const debouncedSearch = useDebounce(search, 400);

  // Sync state to URL Query Parameters
  const updateUrl = useCallback(
    (newParams: Record<string, string | number | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(newParams).forEach(([key, val]) => {
        if (val !== undefined && val !== "" && val !== "all" && val !== 1) {
          params.set(key, String(val));
        } else {
          params.delete(key);
        }
      });

      const newQuery = params.toString();
      const newPath = newQuery ? `${pathname}?${newQuery}` : pathname;
      router.replace(newPath, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  // Update URL whenever debounced search or filters change
  useEffect(() => {
    updateUrl({
      search: debouncedSearch,
      category,
      stage,
      grade,
      status,
      sortBy,
      page,
      limit,
    });
  }, [debouncedSearch, category, stage, grade, status, sortBy, page, limit, updateUrl]);

  const resetFilters = useCallback(() => {
    setSearch("");
    setCategory("all");
    setStage("all");
    setGrade("all");
    setStatus("all");
    setSortBy("newest");
    setPage(1);
    updateUrl({});
  }, [updateUrl]);

  return {
    search,
    setSearch,
    debouncedSearch,
    category,
    setCategory,
    stage,
    setStage,
    grade,
    setGrade,
    status,
    setStatus,
    sortBy,
    setSortBy,
    page,
    setPage,
    limit,
    setLimit,
    resetFilters,
  };
}

export default useSearchFilter;

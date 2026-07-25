"use client";

import { useEffect, useState } from "react";

/**
 * Custom hook to debounce a value by a specified delay in milliseconds.
 * Useful for delaying search queries or filter calls during rapid text inputs.
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
export default useDebounce;

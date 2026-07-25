"use client";

import * as React from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input, type InputProps } from "./input";

export interface SearchInputProps extends Omit<InputProps, "onChange" | "value"> {
  onChange?: (value: string) => void;
  onClear?: () => void;
  value?: string;
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, value = "", onChange, onClear, ...props }, ref) => {
    const [inputValue, setInputValue] = React.useState(value);

    React.useEffect(() => {
      setInputValue(value);
    }, [value]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setInputValue(val);
      onChange?.(val);
    };

    const handleClear = () => {
      setInputValue("");
      onChange?.("");
      onClear?.();
    };

    return (
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground shrink-0 rtl:right-3 rtl:left-auto" />
        <Input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          className={cn("pl-9 pr-9 rtl:pr-9 rtl:pl-9", className)}
          ref={ref}
          {...props}
        />
        {inputValue && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-0.5 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer rtl:left-3 rtl:right-auto"
            aria-label="Clear search"
          >
            <X className="h-3.5 w-3.5 shrink-0" />
          </button>
        )}
      </div>
    );
  }
);
SearchInput.displayName = "SearchInput";

export { SearchInput };

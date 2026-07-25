"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "./badge";

interface Option {
  label: string;
  value: string;
}

interface MultiSelectProps {
  options: Option[];
  selected: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  className?: string;
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Select options...",
  className,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  const handleUnselect = (item: string) => {
    onChange(selected.filter((i) => i !== item));
  };

  const handleSelect = (item: string) => {
    if (selected.includes(item)) {
      onChange(selected.filter((i) => i !== item));
    } else {
      onChange([...selected, item]);
    }
  };

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <PopoverPrimitive.Trigger asChild>
        <button
          type="button"
          className={cn(
            "flex min-h-10 w-full items-center justify-between rounded-xl border border-input bg-card px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer text-left rtl:text-right transition-all",
            className
          )}
        >
          <div className="flex flex-wrap gap-1.5 items-center">
            {selected.length === 0 && (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
            {selected.map((val) => {
              const label = options.find((o) => o.value === val)?.label || val;
              return (
                <Badge
                  key={val}
                  variant="secondary"
                  className="rounded-lg px-2 py-0.5 text-xs flex items-center gap-1 font-semibold"
                >
                  {label}
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUnselect(val);
                    }}
                    className="ml-0.5 rounded-full hover:bg-muted-foreground/20 p-0.5 cursor-pointer text-muted-foreground hover:text-foreground inline-flex rtl:mr-0.5 rtl:ml-0"
                  >
                    <X className="h-3 w-3" />
                  </span>
                </Badge>
              );
            })}
          </div>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50 ml-2 rtl:mr-2 rtl:ml-0" />
        </button>
      </PopoverPrimitive.Trigger>

      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          align="start"
          className="z-50 w-[var(--radix-popover-trigger-width)] min-w-[12rem] rounded-xl border border-border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out duration-150"
        >
          {/* Search box inside drop list */}
          <div className="flex items-center border-b border-muted px-2 py-1.5">
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none border-none py-1 px-1 focus:ring-0"
            />
          </div>
          <div className="max-h-60 overflow-y-auto p-1 space-y-0.5">
            {filteredOptions.length === 0 && (
              <div className="text-center text-xs text-muted-foreground py-4">
                No results found.
              </div>
            )}
            {filteredOptions.map((option) => {
              const isSelected = selected.includes(option.value);
              return (
                <div
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  className={cn(
                    "flex w-full cursor-pointer select-none items-center justify-between rounded-lg px-2 py-1.5 text-sm text-foreground transition-colors hover:bg-muted focus:bg-muted focus:text-accent-foreground rtl:flex-row-reverse",
                    isSelected && "bg-muted/65 font-bold"
                  )}
                >
                  <span>{option.label}</span>
                  {isSelected && (
                    <Check className="h-4 w-4 text-primary shrink-0 stroke-[3px]" />
                  )}
                </div>
              );
            })}
          </div>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}

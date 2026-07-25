"use client";

import * as React from "react";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { LanguageSwitcher, ThemeToggle } from "../common";
import { NotificationDropdown } from "./notification-dropdown";
import { ProfileDropdown } from "./profile-dropdown";
import { SearchBox } from "./search-box";

interface TopbarProps extends React.HTMLAttributes<HTMLDivElement> {
  onMenuClick?: () => void;
}

export function Topbar({ onMenuClick, className, ...props }: TopbarProps) {
  return (
    <header
      className={cn(
        "flex h-16 w-full items-center justify-between border-b border-border/80 bg-card px-4 md:px-6 z-30 sticky top-0",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-4">
        {onMenuClick && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="md:hidden shrink-0 cursor-pointer"
            aria-label="Open Navigation Drawer"
          >
            <Menu className="h-5 w-5 shrink-0" />
          </Button>
        )}
        <SearchBox className="hidden sm:flex" />
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <LanguageSwitcher />
        <ThemeToggle />
        <NotificationDropdown />
        <Separator orientation="vertical" className="h-6" />
        <ProfileDropdown />
      </div>
    </header>
  );
}
export default Topbar;

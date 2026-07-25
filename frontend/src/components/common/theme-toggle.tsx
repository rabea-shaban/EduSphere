"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "../ui/button";

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" className="rounded-xl h-9 w-9 border-border/80" disabled>
        <div className="h-4.5 w-4.5 shrink-0" />
      </Button>
    );
  }

  const isDark = resolvedTheme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="rounded-xl h-9 w-9 border-border/80 text-muted-foreground hover:text-foreground cursor-pointer transition-all duration-200 select-none"
      aria-label="تبديل الوضع الليلي والفاتح"
      title={isDark ? "التحويل إلى الوضع الفاتح" : "التحويل إلى الوضع الليلي"}
    >
      {isDark ? (
        <Sun className="h-4.5 w-4.5 text-amber-400 transition-transform duration-300 hover:rotate-45" />
      ) : (
        <Moon className="h-4.5 w-4.5 text-slate-700 dark:text-slate-200 transition-transform duration-300 hover:-rotate-12" />
      )}
    </Button>
  );
}

export default ThemeToggle;

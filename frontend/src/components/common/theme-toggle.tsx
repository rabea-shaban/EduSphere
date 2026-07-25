"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "../ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" disabled>
        <div className="h-4.5 w-4.5 shrink-0" />
      </Button>
    );
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="rounded-xl h-10 w-10 text-muted-foreground hover:text-foreground cursor-pointer"
      aria-label="Toggle Color Theme"
    >
      {theme === "dark" ? (
        <Sun className="h-4.5 w-4.5 transition-transform duration-300" />
      ) : (
        <Moon className="h-4.5 w-4.5 transition-transform duration-300" />
      )}
    </Button>
  );
}
export default ThemeToggle;

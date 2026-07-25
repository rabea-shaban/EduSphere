"use client";

import * as React from "react";
import { Languages } from "lucide-react";
import { Button } from "../ui/button";

export function LanguageSwitcher() {
  const [lang, setLang] = React.useState("en");

  React.useEffect(() => {
    if (typeof window !== "undefined" && typeof document !== "undefined") {
      const savedLang = localStorage.getItem("app_lang") || document.documentElement.lang || "en";
      const savedDir = savedLang === "ar" ? "rtl" : "ltr";
      
      const timer = setTimeout(() => {
        setLang(savedLang);
        document.documentElement.lang = savedLang;
        document.documentElement.dir = savedDir;
      }, 0);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const toggleLanguage = () => {
    const nextLang = lang === "en" ? "ar" : "en";
    const nextDir = nextLang === "ar" ? "rtl" : "ltr";
    
    setLang(nextLang);
    
    if (typeof document !== "undefined") {
      document.documentElement.lang = nextLang;
      document.documentElement.dir = nextDir;
      localStorage.setItem("app_lang", nextLang);
      localStorage.setItem("app_dir", nextDir);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLanguage}
      className="gap-2 rounded-xl h-9 cursor-pointer text-xs font-bold"
      iconLeft={<Languages className="h-3.5 w-3.5 shrink-0" />}
    >
      {lang === "en" ? "العربية (AR)" : "English (EN)"}
    </Button>
  );
}
export default LanguageSwitcher;

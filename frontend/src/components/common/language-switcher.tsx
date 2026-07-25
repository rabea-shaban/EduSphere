"use client";

import * as React from "react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";
import { Globe, ChevronDown } from "lucide-react";
import { Button } from "../ui/button";

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const toggleLanguage = () => {
    const nextLocale = locale === "en" ? "ar" : "en";
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLanguage}
      className="gap-2 rounded-xl h-9 border-border/80 px-3 cursor-pointer text-xs font-bold text-muted-foreground hover:text-foreground transition-all duration-200 select-none"
    >
      <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
      <span>{locale === "en" ? "English" : "العربية"}</span>
      <ChevronDown className="h-3 w-3 text-muted-foreground/60 shrink-0" />
    </Button>
  );
}
export default LanguageSwitcher;

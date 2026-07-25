"use client";

import * as React from "react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";
import { Languages } from "lucide-react";
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
      className="gap-2 rounded-xl h-9 cursor-pointer text-xs font-bold"
      iconLeft={<Languages className="h-3.5 w-3.5 shrink-0" />}
    >
      {locale === "en" ? "العربية (AR)" : "English (EN)"}
    </Button>
  );
}
export default LanguageSwitcher;

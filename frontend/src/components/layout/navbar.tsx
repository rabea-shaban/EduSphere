"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { Menu } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Logo, ThemeToggle, LanguageSwitcher } from "../common";
import { Button } from "../ui/button";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { NavLink } from "./nav-link";

export function Navbar() {
  const [open, setOpen] = React.useState(false);
  const t = useTranslations("Navbar");

  const navLinks = [
    { label: t("home"), href: "/" },
    { label: t("stages"), href: "#stages" },
    { label: t("subjects"), href: "#subjects" },
    { label: t("courses"), href: "#courses" },
    { label: t("teachers"), href: "#teachers" },
    { label: t("contact"), href: "#contact" },
  ];

  return (
    <nav className="sticky top-0 z-45 w-full border-b border-border/80 bg-card/85 backdrop-blur-md px-4 sm:px-6">
      <div className="flex h-16 items-center justify-between max-w-7xl mx-auto">
        {/* Left Side: Brand Logo */}
        <Logo />

        {/* Center: Desktop Menu Links */}
        <div className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <NavLink
              key={link.href}
              href={link.href}
              exact={link.href === "/"}
              className="text-xs font-bold text-muted-foreground transition-all hover:text-foreground py-1.5"
              activeClassName="text-primary font-extrabold border-b-2 border-primary"
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* Right Side: Toggles & Auth actions */}
        <div className="hidden lg:flex items-center gap-3">
          <LanguageSwitcher />
          <ThemeToggle />
          <Button variant="ghost" size="sm" className="cursor-pointer text-xs font-bold" asChild>
            <Link href="/auth/login">{t("login")}</Link>
          </Button>
          <Button variant="default" size="sm" className="cursor-pointer text-xs font-bold bg-accent hover:bg-accent/90" asChild>
            <Link href="/auth/register">{t("signUp")}</Link>
          </Button>
        </div>

        {/* Mobile Hamburger menu */}
        <div className="flex lg:hidden items-center gap-2">
          <ThemeToggle />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open Navigation Menu" className="cursor-pointer">
                <Menu className="h-5 w-5 shrink-0" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <SheetHeader>
                <SheetTitle className="text-left rtl:text-right">
                  <Logo />
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-4 mt-8">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.href}
                    href={link.href}
                    exact={link.href === "/"}
                    onClick={() => setOpen(false)}
                    className="text-sm font-bold text-muted-foreground transition-all hover:text-foreground py-2 border-b border-border/50 text-left rtl:text-right"
                    activeClassName="text-primary font-extrabold"
                  >
                    {link.label}
                  </NavLink>
                ))}
                <div className="flex flex-col gap-3 mt-6">
                  <LanguageSwitcher />
                  <Button variant="outline" asChild onClick={() => setOpen(false)} className="cursor-pointer text-xs font-bold">
                    <Link href="/auth/login">{t("login")}</Link>
                  </Button>
                  <Button variant="default" asChild onClick={() => setOpen(false)} className="cursor-pointer text-xs font-bold bg-accent hover:bg-accent/90">
                    <Link href="/auth/register">{t("signUp")}</Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
export default Navbar;

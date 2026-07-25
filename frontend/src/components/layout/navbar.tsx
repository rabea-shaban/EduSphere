"use client";

import { Link } from "@/i18n/routing";
import { GraduationCap, Menu } from "lucide-react";
import { useTranslations } from "next-intl";
import * as React from "react";
import { LanguageSwitcher, Logo, ThemeToggle } from "../common";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
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
    { label: t("pricing"), href: "#pricing" },
    { label: t("contact"), href: "#contact" },
  ];

  return (
    <nav className="border-border/50 bg-card sticky top-0 z-45 w-full border-b px-4 shadow-sm select-none sm:px-6">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between">
        {/* Left Side: Brand Logo */}
        <Logo />

        {/* Center: Desktop Menu Links (Matches image underline alignment) */}
        <div className="hidden h-full items-center gap-6 lg:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.href}
              href={link.href}
              exact={link.href === "/"}
              className="text-muted-foreground hover:text-foreground flex h-16 cursor-pointer items-center border-b-2 border-transparent px-1 text-xs font-bold transition-all"
              activeClassName="text-primary border-primary font-extrabold"
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* Right Side: Toggles & Auth actions (Matches image layout style) */}
        <div className="hidden items-center gap-3 lg:flex">
          <Button
            variant="outline"
            size="sm"
            className="border-secondary text-secondary hover:bg-secondary/5 h-9 cursor-pointer rounded-xl px-4 text-xs font-bold transition-colors duration-200"
            asChild
          >
            <Link href="/auth/login">{t("login")}</Link>
          </Button>
          <Button
            variant="default"
            size="sm"
            className="bg-accent hover:bg-accent/90 flex h-9 cursor-pointer items-center justify-center gap-2 rounded-xl px-4 text-xs font-bold text-white shadow-sm transition-all duration-200"
            asChild
          >
            <Link href="/auth/register">
              <span>{t("signUp")}</span>
              <GraduationCap className="h-4 w-4 shrink-0" />
            </Link>
          </Button>

          <LanguageSwitcher />

          <ThemeToggle />
        </div>

        {/* Mobile Hamburger menu */}
        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Open Navigation Menu"
                className="cursor-pointer"
              >
                <Menu className="h-5 w-5 shrink-0" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <SheetHeader>
                <SheetTitle className="text-left rtl:text-right">
                  <Logo />
                </SheetTitle>
              </SheetHeader>
              <div className="mt-8 flex flex-col gap-4">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.href}
                    href={link.href}
                    exact={link.href === "/"}
                    onClick={() => setOpen(false)}
                    className="text-muted-foreground hover:text-foreground border-border/50 border-b py-2 text-left text-sm font-bold transition-all rtl:text-right"
                    activeClassName="text-primary font-extrabold"
                  >
                    {link.label}
                  </NavLink>
                ))}
                <div className="mt-6 flex flex-col gap-3">
                  <LanguageSwitcher />
                  <Button
                    variant="outline"
                    asChild
                    onClick={() => setOpen(false)}
                    className="border-secondary text-secondary hover:bg-secondary/5 cursor-pointer text-xs font-bold"
                  >
                    <Link href="/auth/login">{t("login")}</Link>
                  </Button>
                  <Button
                    variant="default"
                    asChild
                    onClick={() => setOpen(false)}
                    className="bg-accent hover:bg-accent/90 cursor-pointer text-xs font-bold"
                  >
                    <Link href="/auth/register" className="flex items-center justify-center gap-2">
                      <span>{t("signUp")}</span>
                      <GraduationCap className="h-4 w-4 shrink-0" />
                    </Link>
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

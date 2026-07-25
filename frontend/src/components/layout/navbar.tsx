"use client";

import * as React from "react";
import { Menu } from "lucide-react";
import { Logo, ThemeToggle, LanguageSwitcher } from "../common";
import { Button } from "../ui/button";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { NavLink } from "./nav-link";

export function Navbar() {
  const [open, setOpen] = React.useState(false);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Courses", href: "/courses" },
    { label: "Pricing", href: "/pricing" },
    { label: "About", href: "/about" },
  ];

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-border/80 bg-card/85 backdrop-blur-md px-4 sm:px-6">
      <div className="flex h-16 items-center justify-between max-w-7xl mx-auto">
        {/* Left Side: Brand Logo */}
        <Logo />

        {/* Center: Desktop Menu Links */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <NavLink
              key={link.href}
              href={link.href}
              exact={link.href === "/"}
              className="text-sm font-bold text-muted-foreground transition-all hover:text-foreground py-1.5 hover:scale-[1.01]"
              activeClassName="text-primary font-extrabold border-b-2 border-primary"
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* Right Side: Toggles & Auth actions */}
        <div className="hidden md:flex items-center gap-3">
          <LanguageSwitcher />
          <ThemeToggle />
          <Button variant="outline" size="sm" asChild>
            <a href="/auth/login">Login</a>
          </Button>
          <Button variant="default" size="sm" asChild>
            <a href="/auth/register">Sign Up</a>
          </Button>
        </div>

        {/* Mobile Hamburger menu */}
        <div className="flex md:hidden items-center gap-2">
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
                    className="text-base font-bold text-muted-foreground transition-all hover:text-foreground py-2 border-b border-border/50 text-left rtl:text-right"
                    activeClassName="text-primary font-extrabold"
                  >
                    {link.label}
                  </NavLink>
                ))}
                <div className="flex flex-col gap-3 mt-6">
                  <LanguageSwitcher />
                  <Button variant="outline" asChild onClick={() => setOpen(false)} className="cursor-pointer">
                    <a href="/auth/login">Login</a>
                  </Button>
                  <Button variant="default" asChild onClick={() => setOpen(false)} className="cursor-pointer">
                    <a href="/auth/register">Sign Up</a>
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

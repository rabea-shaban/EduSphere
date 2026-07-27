"use client";

import * as React from "react";
import Link from "next/link";
import { GraduationCap, Menu, LayoutDashboard, UserCircle, LogOut } from "lucide-react";
import { Logo, ThemeToggle } from "../common";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import { NavLink } from "./nav-link";
import { useAuthContext } from "@/providers/auth-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

// ─── Arabic navigation links ──────────────────────────────────────────────────
const navLinks = [
  { label: "الصفحة الرئيسية", href: "/" },
  { label: "المراحل الدراسية", href: "/#stages" },
  { label: "المواد", href: "/#subjects" },
  { label: "الكورسات", href: "/courses" },
  { label: "المعلمون", href: "/#teachers" },
  { label: "الأسعار", href: "/#pricing" },
  { label: "تواصل معنا", href: "/#contact" },
];

export function Navbar() {
  const [open, setOpen] = React.useState(false);
  const { isAuthenticated, role, user, logout } = useAuthContext();

  const userDisplayName = (user?.firstName || user?.lastName)
    ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
    : (user?.fullName || user?.username || "مستخدم EduSphere");

  const normalizedRole = (role || "").toLowerCase();
  let dashboardHref = "/dashboard";
  let dashboardLabel = "لوحة التعلم 🎓";

  if (normalizedRole.includes("admin") || normalizedRole === "super_admin") {
    dashboardHref = "/admin/dashboard";
    dashboardLabel = "لوحة الإدارة 👑";
  } else if (normalizedRole === "teacher") {
    dashboardHref = "/teacher/dashboard";
    dashboardLabel = "مساحة المعلم 👨‍🏫";
  }

  return (
    <nav className="border-border/50 bg-card sticky top-0 z-45 w-full border-b px-4 shadow-sm select-none sm:px-6">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between">
        {/* Logo */}
        <Logo />

        {/* Desktop Nav Links */}
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

        {/* Desktop Right — Dynamic Auth / Dashboard Buttons */}
        <div className="hidden items-center gap-3 lg:flex">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="relative rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[#F58220] focus-visible:ring-offset-2 cursor-pointer">
                  <Avatar className="h-9 w-9 border-2 border-[#F58220] shadow-md hover:scale-105 transition-transform duration-200">
                    <AvatarImage
                      src={user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.fullName || "User"}`}
                      alt={user?.fullName || "المستخدم"}
                    />
                    <AvatarFallback className="bg-[#0B2D5B] text-white text-xs font-bold">
                      {(user?.fullName || "U").charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {/* Online indicator */}
                  <span className="absolute bottom-0 left-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-background" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-60 p-2 rounded-2xl shadow-xl border border-slate-200 dark:border-white/10">
                {/* User header */}
                <div className="flex items-center gap-3 px-2 py-2.5">
                  <Avatar className="h-10 w-10 border-2 border-[#F58220] shrink-0">
                    <AvatarImage
                      src={user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.fullName || "User"}`}
                      alt={user?.fullName || "المستخدم"}
                    />
                    <AvatarFallback className="bg-[#0B2D5B] text-white text-xs font-bold">
                      {(user?.fullName || "U").charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 text-right">
                    <p className="text-xs font-bold text-[#0B2D5B] dark:text-white truncate">
                      {userDisplayName}
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                      {user?.email || ""}
                    </p>
                    <span className="inline-block text-[10px] font-bold text-[#F58220] mt-0.5">
                      {normalizedRole === "teacher" ? "👨‍🏫 معلم" : normalizedRole.includes("admin") ? "👑 أدمن" : "🎓 طالب"}
                    </span>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="cursor-pointer rounded-xl text-right focus:bg-[#0B2D5B]/5 dark:focus:bg-white/5">
                  <Link href={dashboardHref} className="flex items-center gap-2.5 w-full px-2 py-2">
                    <LayoutDashboard className="h-4 w-4 text-[#0B2D5B] dark:text-[#F58220] shrink-0" />
                    <span className="text-xs font-bold">{dashboardLabel}</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer rounded-xl text-right focus:bg-[#0B2D5B]/5 dark:focus:bg-white/5">
                  <Link href={`${normalizedRole === "teacher" ? "/teacher/profile" : normalizedRole.includes("admin") ? "/admin/settings" : "/dashboard/profile"}`} className="flex items-center gap-2.5 w-full px-2 py-2">
                    <UserCircle className="h-4 w-4 text-slate-500 shrink-0" />
                    <span className="text-xs font-bold">الملف الشخصي</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => logout()}
                  className="cursor-pointer rounded-xl text-red-600 dark:text-red-400 focus:bg-red-50 dark:focus:bg-red-950/40 focus:text-red-600"
                >
                  <div className="flex items-center gap-2.5 w-full px-2 py-1">
                    <LogOut className="h-4 w-4 shrink-0" />
                    <span className="text-xs font-bold">تسجيل الخروج</span>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                className="border-secondary text-secondary hover:bg-secondary/5 h-9 cursor-pointer rounded-xl px-4 text-xs font-bold transition-colors duration-200"
                asChild
              >
                <Link href="/login">تسجيل الدخول</Link>
              </Button>
              <Button
                variant="default"
                size="sm"
                className="bg-accent hover:bg-accent/90 flex h-9 cursor-pointer items-center justify-center gap-2 rounded-xl px-4 text-xs font-bold text-white shadow-sm transition-all duration-200"
                asChild
              >
                <Link href="/register">
                  <span>ابدأ التعلم الآن</span>
                  <GraduationCap className="h-4 w-4 shrink-0" />
                </Link>
              </Button>
            </>
          )}

          <ThemeToggle />
        </div>

        {/* Mobile Menu */}
        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="فتح قائمة التنقل"
                className="cursor-pointer"
              >
                <Menu className="h-5 w-5 shrink-0" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <SheetHeader>
                <SheetTitle className="text-right">
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
                    className="text-muted-foreground hover:text-foreground border-border/50 border-b py-2 text-right text-sm font-bold transition-all"
                    activeClassName="text-primary font-extrabold"
                  >
                    {link.label}
                  </NavLink>
                ))}
                <div className="mt-6 flex flex-col gap-3">
                  {isAuthenticated ? (
                    <>
                      {/* Mobile Profile Card */}
                      <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                        <Avatar className="h-11 w-11 border-2 border-[#F58220] shrink-0">
                          <AvatarImage
                            src={user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.fullName || "User"}`}
                            alt={user?.fullName || "المستخدم"}
                          />
                          <AvatarFallback className="bg-[#0B2D5B] text-white text-xs font-bold">
                            {(user?.fullName || "U").charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 text-right">
                          <p className="text-xs font-bold text-[#0B2D5B] dark:text-white truncate">{userDisplayName}</p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{user?.email || ""}</p>
                          <span className="text-[10px] font-bold text-[#F58220]">
                            {normalizedRole === "teacher" ? "👨‍🏫 معلم" : normalizedRole.includes("admin") ? "👑 أدمن" : "🎓 طالب"}
                          </span>
                        </div>
                      </div>
                      {/* Dashboard */}
                      <Button
                        variant="default"
                        asChild
                        onClick={() => setOpen(false)}
                        className="bg-gradient-to-r from-[#0B2D5B] to-[#1E73D8] dark:from-[#F58220] dark:to-[#FF9A2A] text-white cursor-pointer text-xs font-bold rounded-xl"
                      >
                        <Link href={dashboardHref} className="flex items-center justify-center gap-2">
                          <LayoutDashboard className="h-4 w-4 shrink-0" />
                          <span>{dashboardLabel}</span>
                        </Link>
                      </Button>
                      {/* Profile */}
                      <Button
                        variant="outline"
                        asChild
                        onClick={() => setOpen(false)}
                        className="border-slate-300 dark:border-white/20 cursor-pointer text-xs font-bold rounded-xl"
                      >
                        <Link href={normalizedRole === "teacher" ? "/teacher/profile" : normalizedRole.includes("admin") ? "/admin/settings" : "/dashboard/profile"} className="flex items-center justify-center gap-2">
                          <UserCircle className="h-4 w-4 shrink-0" />
                          <span>الملف الشخصي</span>
                        </Link>
                      </Button>
                      {/* Logout */}
                      <Button
                        variant="ghost"
                        onClick={() => { logout(); setOpen(false); }}
                        className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 cursor-pointer text-xs font-bold rounded-xl border border-red-200 dark:border-red-900/40"
                      >
                        <div className="flex items-center justify-center gap-2">
                          <LogOut className="h-4 w-4 shrink-0" />
                          <span>تسجيل الخروج</span>
                        </div>
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        asChild
                        onClick={() => setOpen(false)}
                        className="border-secondary text-secondary hover:bg-secondary/5 cursor-pointer text-xs font-bold"
                      >
                        <Link href="/login">تسجيل الدخول</Link>
                      </Button>
                      <Button
                        variant="default"
                        asChild
                        onClick={() => setOpen(false)}
                        className="bg-accent hover:bg-accent/90 cursor-pointer text-xs font-bold"
                      >
                        <Link href="/register" className="flex items-center justify-center gap-2">
                          <span>ابدأ التعلم الآن</span>
                          <GraduationCap className="h-4 w-4 shrink-0" />
                        </Link>
                      </Button>
                    </>
                  )}
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

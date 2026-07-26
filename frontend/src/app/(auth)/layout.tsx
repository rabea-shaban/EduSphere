import * as React from "react";
import Link from "next/link";
import { ArrowRight, ArrowLeft, Home } from "lucide-react";
import { Logo, ThemeToggle } from "@/components/common";
import { PageTransition } from "@/components/layout";
import { IllustrationSide } from "@/features/auth";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen w-full flex bg-[#F8FAFC] dark:bg-[#071C3B] text-[#1E293B] dark:text-[#F8FAFC] transition-colors duration-300 font-cairo">
      {/* RIGHT SIDE (Visual Illustration Banner - Hidden on mobile/tablet) */}
      <IllustrationSide />

      {/* LEFT SIDE (Form Container) */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-4 sm:p-8 md:p-12 relative overflow-y-auto min-h-screen">
        {/* Top Control Bar */}
        <div className="w-full flex items-center justify-between z-20 mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-[#F58220] dark:hover:text-[#F58220] transition-colors bg-white/80 dark:bg-[#0F274D]/80 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm"
          >
            <ArrowRight className="h-4 w-4" />
            <span>الرئيسية</span>
          </Link>

          <div className="flex items-center gap-3">
            {/* Mobile Logo */}
            <div className="lg:hidden">
              <Logo size="sm" />
            </div>
            {/* Theme Toggle Switcher */}
            <ThemeToggle />
          </div>
        </div>

        {/* Center Auth Form */}
        <div className="w-full max-w-md mx-auto my-auto py-4 z-10">
          <PageTransition>{children}</PageTransition>
        </div>

        {/* Footer info */}
        <div className="w-full text-center text-xs font-semibold text-slate-400 dark:text-slate-500 pt-6 z-10">
          &copy; {new Date().getFullYear()} EduSphere. جميع الحقوق محفوظة.
        </div>
      </div>
    </div>
  );
}

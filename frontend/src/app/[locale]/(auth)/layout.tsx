import * as React from "react";
import { BookOpen } from "lucide-react";
import { Logo } from "@/components/common";
import { PageTransition } from "@/components/layout";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex bg-background">
      {/* Left side: Splitted brand banner (visible on desktop) */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary text-primary-foreground flex-col justify-between p-12 relative overflow-hidden select-none">
        {/* Soft floating background light */}
        <div className="absolute top-[-20%] left-[-20%] h-[70%] w-[70%] rounded-full bg-secondary/20 filter blur-3xl" />
        <div className="absolute bottom-[-20%] right-[-20%] h-[70%] w-[70%] rounded-full bg-accent/15 filter blur-3xl" />

        <div className="relative z-10">
          <Logo className="text-white" showText={true} />
        </div>

        <div className="relative z-10 max-w-md space-y-4">
          <div className="inline-flex rounded-xl bg-white/10 p-2 text-accent">
            <BookOpen className="h-6 w-6" />
          </div>
          <h2 className="text-h2 font-heading font-extrabold tracking-tight">
            Unlock Unlimited Knowledge
          </h2>
          <p className="text-sm text-primary-foreground/80 leading-relaxed">
            Join thousands of learners worldwide. EduSphere brings you enterprise-grade virtual
            classrooms, real-time analytics, and verified certified degrees.
          </p>
        </div>

        <div className="relative z-10 text-xs text-primary-foreground/60">
          &copy; {new Date().getFullYear()} EduSphere. All rights reserved.
        </div>
      </div>

      {/* Right side: Auth Form Card (always visible) */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 relative">
        <div className="absolute top-6 left-6 lg:hidden">
          <Logo />
        </div>
        <div className="w-full max-w-md">
          <PageTransition>{children}</PageTransition>
        </div>
      </div>
    </div>
  );
}

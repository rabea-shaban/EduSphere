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
      {/* Right side (in RTL = visual left): Brand banner — desktop only */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary text-primary-foreground flex-col justify-between p-12 relative overflow-hidden select-none">
        {/* Decorative blobs */}
        <div className="absolute top-[-20%] left-[-20%] h-[70%] w-[70%] rounded-full bg-secondary/20 filter blur-3xl" />
        <div className="absolute bottom-[-20%] right-[-20%] h-[70%] w-[70%] rounded-full bg-accent/15 filter blur-3xl" />

        <div className="relative z-10">
          <Logo className="text-white" showText={true} />
        </div>

        <div className="relative z-10 max-w-md space-y-4">
          <div className="inline-flex rounded-xl bg-white/10 p-2 text-accent">
            <BookOpen className="h-6 w-6" />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight" style={{ fontFamily: "var(--font-cairo), sans-serif" }}>
            افتح أبواب المعرفة الحقيقية
          </h2>
          <p className="text-sm text-primary-foreground/80 leading-relaxed" style={{ fontFamily: "var(--font-cairo), sans-serif" }}>
            انضم إلى آلاف الطلاب على منصة EduSphere — تعلم تفاعلي، ذكاء اصطناعي مخصص، ومعلمون خبراء لمساعدتك على التفوق.
          </p>
        </div>

        <div className="relative z-10 text-xs text-primary-foreground/60" style={{ fontFamily: "var(--font-cairo), sans-serif" }}>
          &copy; {new Date().getFullYear()} EduSphere. جميع الحقوق محفوظة.
        </div>
      </div>

      {/* Auth form side */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 relative">
        <div className="absolute top-6 right-6 lg:hidden">
          <Logo />
        </div>
        <div className="w-full max-w-md">
          <PageTransition>{children}</PageTransition>
        </div>
      </div>
    </div>
  );
}

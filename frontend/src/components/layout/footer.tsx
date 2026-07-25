import * as React from "react";
import { Logo } from "../common";
import { cn } from "@/lib/utils";

export function Footer({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <footer
      className={cn("bg-card border-t border-border/80 w-full py-8 px-4 mt-auto", className)}
      {...props}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-muted-foreground font-semibold">
        <Logo size="sm" showText={true} />
        <p className="text-center md:text-left rtl:md:text-right">
          &copy; {new Date().getFullYear()} EduSphere. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          <a href="/privacy" className="hover:text-foreground transition-colors">
            Privacy Policy
          </a>
          <a href="/terms" className="hover:text-foreground transition-colors">
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  );
}
export default Footer;

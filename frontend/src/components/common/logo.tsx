import * as React from "react";
import { GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export function Logo({ size = "md", showText = true, className, ...props }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2.5 select-none cursor-pointer", className)} {...props}>
      <div className="relative flex items-center justify-center rounded-xl bg-primary text-primary-foreground p-1.5 shadow-md shrink-0">
        <GraduationCap
          className={cn(
            size === "sm" ? "h-4.5 w-4.5" : size === "md" ? "h-5.5 w-5.5" : "h-6.5 w-6.5",
            "shrink-0 transition-transform duration-300 hover:rotate-6"
          )}
        />
        {/* Glowing Sphere indicator on Cap corner */}
        <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
        </span>
      </div>
      {showText && (
        <span
          className={cn(
            "font-heading font-extrabold tracking-tight text-foreground/95",
            size === "sm" ? "text-base" : size === "md" ? "text-lg" : "text-xl"
          )}
        >
          Edu<span className="text-secondary">Sphere</span>
        </span>
      )}
    </div>
  );
}
export default Logo;

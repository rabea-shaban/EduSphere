import * as React from "react";
import { cn } from "@/lib/utils";

interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export function Logo({ size = "md", showText = true, className, ...props }: LogoProps) {
  const heightClass =
    size === "sm" ? "h-6 sm:h-7" : size === "md" ? "h-8 sm:h-9" : "h-10 sm:h-11";

  return (
    <div className={cn("flex items-center select-none cursor-pointer", className)} {...props}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={showText ? "/logo.png" : "/logo-mark.png"}
        alt="EduSphere Logo"
        className={cn(heightClass, "w-auto object-contain")}
      />
    </div>
  );
}
export default Logo;

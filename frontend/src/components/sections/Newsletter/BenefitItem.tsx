"use client";

import * as React from "react";
import { Mail, Gift, Lightbulb, ShieldCheck } from "lucide-react";
import type { NewsletterBenefit } from "./types";
import { cn } from "@/lib/utils";

interface BenefitItemProps {
  benefit: NewsletterBenefit;
}

function BenefitIcon({ iconName, className }: { iconName: NewsletterBenefit["iconName"]; className?: string }) {
  switch (iconName) {
    case "mail":
      return <Mail className={cn("h-4 w-4 text-[#1E73D8] dark:text-blue-400", className)} />;
    case "gift":
      return <Gift className={cn("h-4 w-4 text-[#1E73D8] dark:text-blue-400", className)} />;
    case "lightbulb":
      return <Lightbulb className={cn("h-4 w-4 text-[#1E73D8] dark:text-blue-400", className)} />;
    case "shield":
      return <ShieldCheck className={cn("h-4 w-4 text-[#1E73D8] dark:text-blue-400", className)} />;
    default:
      return <Mail className={cn("h-4 w-4 text-[#1E73D8] dark:text-blue-400", className)} />;
  }
}

export function BenefitItem({ benefit }: BenefitItemProps) {
  return (
    <div className="flex items-center gap-3 justify-center px-4 py-2 select-none">
      {/* Circular Blue Icon Badge */}
      <div className="w-10 h-10 rounded-full bg-[#EBF4FF] dark:bg-blue-950/80 flex items-center justify-center shrink-0 shadow-sm">
        <BenefitIcon iconName={benefit.iconName} />
      </div>

      {/* Benefit Title & Optional Subtitle */}
      <div className="text-right flex flex-col">
        <span
          className="text-xs sm:text-sm font-bold text-[#0B2D5B] dark:text-slate-100 leading-tight"
          style={{ fontFamily: "'Cairo', sans-serif" }}
        >
          {benefit.title}
        </span>
        {benefit.subtitle && (
          <span
            className="text-[11px] text-[#64748B] dark:text-slate-400 font-medium leading-tight mt-0.5"
            style={{ fontFamily: "'Cairo', sans-serif" }}
          >
            {benefit.subtitle}
          </span>
        )}
      </div>
    </div>
  );
}

export default BenefitItem;

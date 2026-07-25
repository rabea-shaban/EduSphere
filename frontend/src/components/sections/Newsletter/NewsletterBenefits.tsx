"use client";

import * as React from "react";
import type { NewsletterBenefit } from "./types";
import { BenefitItem } from "./BenefitItem";

interface NewsletterBenefitsProps {
  benefits: NewsletterBenefit[];
}

export function NewsletterBenefits({ benefits }: NewsletterBenefitsProps) {
  return (
    <div className="w-full pt-8 mt-8 border-t border-slate-100 dark:border-slate-800/80">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x sm:divide-x-reverse divide-slate-100 dark:divide-slate-800 gap-4 sm:gap-0 items-center justify-between">
        {benefits.map((item) => (
          <BenefitItem key={item.id} benefit={item} />
        ))}
      </div>
    </div>
  );
}

export default NewsletterBenefits;

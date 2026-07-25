"use client";

import * as React from "react";

interface PartnersSectionProps {
  title: string;
}

export function PartnersSection({ title }: PartnersSectionProps) {
  const partners = [
    "Oxford Prep",
    "Cambridge Ed",
    "Al-Azhar Inst",
    "Cairo Schools",
    "EdTech Gulf",
    "Future Learn",
  ];

  return (
    <section className="bg-muted/30 py-10 border-y border-border/50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 text-center space-y-6">
        <span className="text-[10px] font-bold text-muted-foreground/80 uppercase tracking-wider select-none">
          {title}
        </span>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 opacity-60 grayscale hover:grayscale-0 transition-all duration-300">
          {partners.map((partner, idx) => (
            <span
              key={idx}
              className="text-sm font-extrabold text-foreground/80 tracking-tight select-none hover:text-primary transition-colors"
            >
              {partner}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
export default PartnersSection;

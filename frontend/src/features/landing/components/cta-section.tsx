"use client";

import * as React from "react";
import { ArrowRight } from "lucide-react";
import { Container, Section } from "@/components/layout";
import { Button } from "@/components/ui/button";

interface CTASectionProps {
  title: string;
  subtitle: string;
  primaryButton: string;
  secondaryButton: string;
}

export function CTASection({ title, subtitle, primaryButton, secondaryButton }: CTASectionProps) {
  return (
    <Section className="bg-primary text-primary-foreground relative overflow-hidden select-none">
      {/* Background glow effects */}
      <div className="absolute -left-1/4 -top-1/4 h-[80%] w-[80%] rounded-full bg-secondary/15 filter blur-3xl" />
      <div className="absolute -right-1/4 -bottom-1/4 h-[80%] w-[80%] rounded-full bg-accent/10 filter blur-3xl" />

      <Container className="text-center space-y-6 max-w-2xl relative z-10">
        <h2 className="text-h2 font-heading font-extrabold tracking-tight md:text-display leading-tight">
          {title}
        </h2>
        <p className="text-sm text-primary-foreground/80 leading-relaxed max-w-md mx-auto">
          {subtitle}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Button
            size="lg"
            className="bg-accent hover:bg-accent/90 text-white rounded-xl h-12 px-6 font-bold shadow-md cursor-pointer shrink-0"
            asChild
          >
            <a href="/auth/register" className="gap-2">
              <span>{primaryButton}</span>
              <ArrowRight className="h-4.5 w-4.5 rtl:rotate-180 shrink-0" />
            </a>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-white/20 hover:bg-white/10 text-white rounded-xl h-12 px-6 font-bold cursor-pointer shrink-0"
            asChild
          >
            <a href="/advisor">{secondaryButton}</a>
          </Button>
        </div>
      </Container>
    </Section>
  );
}
export default CTASection;

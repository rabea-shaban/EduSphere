"use client";

import * as React from "react";
import { CallToAction } from "@/components/sections/CallToAction";

interface CTASectionProps {
  title?: string;
  subtitle?: string;
  primaryButton?: string;
  secondaryButton?: string;
}

export function CTASection({
  subtitle,
  primaryButton,
  secondaryButton,
}: CTASectionProps) {
  return (
    <CallToAction
      subtitle={subtitle}
      primaryBtnText={primaryButton}
      secondaryBtnText={secondaryButton}
    />
  );
}

export default CTASection;

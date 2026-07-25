"use client";

import * as React from "react";
import { AIAssistant } from "@/components/sections/AIAssistant";

interface AISectionProps {
  badgeText?: string;
  title?: string;
  subtitle?: string;
  btnText?: string;
  q1?: string;
  q2?: string;
  q3?: string;
  q4?: string;
}

export function AISection({
  title,
  subtitle,
  btnText,
}: AISectionProps) {
  return (
    <AIAssistant
      description={subtitle}
      buttonText={btnText}
    />
  );
}

export default AISection;

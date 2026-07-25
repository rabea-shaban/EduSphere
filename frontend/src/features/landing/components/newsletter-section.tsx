"use client";

import * as React from "react";
import { Newsletter } from "@/components/sections/Newsletter";

interface NewsletterSectionProps {
  title?: string;
  subtitle?: string;
  placeholder?: string;
  buttonText?: string;
  successMsg?: string;
}

export function NewsletterSection({
  subtitle,
  placeholder,
  buttonText,
}: NewsletterSectionProps) {
  return (
    <Newsletter
      description={subtitle}
      inputPlaceholder={placeholder}
      buttonText={buttonText}
    />
  );
}

export default NewsletterSection;

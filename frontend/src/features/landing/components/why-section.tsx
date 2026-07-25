"use client";

import * as React from "react";
import { WhyEduSphere } from "@/components/sections/WhyEduSphere";

interface WhyItem {
  title: string;
  description: string;
}

interface WhySectionProps {
  title?: string;
  subtitle?: string;
  items?: WhyItem[];
}

export function WhySection({ title, subtitle }: WhySectionProps) {
  return <WhyEduSphere title={title} subtitle={subtitle} />;
}

export default WhySection;

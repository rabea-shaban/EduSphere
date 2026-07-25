"use client";

import * as React from "react";
import { EducationalStages } from "@/components/sections/EducationalStages";

interface StageItem {
  id: string;
  title: string;
  description: string;
  btnText: string;
  icon: "backpack" | "book" | "target" | "cap" | "trophy";
}

interface StagesSectionProps {
  title?: string;
  subtitle?: string;
  items?: StageItem[];
}

export function StagesSection({ title, subtitle }: StagesSectionProps) {
  return <EducationalStages title={title} subtitle={subtitle} />;
}

export default StagesSection;

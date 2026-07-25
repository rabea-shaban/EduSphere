"use client";

import * as React from "react";
import { FeaturedCourses } from "@/components/sections/FeaturedCourses";

interface CoursesSectionProps {
  title?: string;
  subtitle?: string;
  courses?: any[];
  viewAllText?: string;
  studentsLabel?: string;
}

export function CoursesSection({
  title,
  subtitle,
  viewAllText,
}: CoursesSectionProps) {
  return (
    <FeaturedCourses
      title={title}
      subtitle={subtitle}
      allCoursesText={viewAllText}
    />
  );
}

export default CoursesSection;

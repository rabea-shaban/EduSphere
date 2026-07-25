"use client";

import * as React from "react";
import type { Course } from "./types";
import { CourseCard } from "./CourseCard";

interface CourseSliderProps {
  courses: Course[];
  currentIndex: number;
}

export function CourseSlider({ courses }: CourseSliderProps) {
  return (
    <div className="w-full">
      {/* 4 Cards Grid on Desktop, 2 on Tablet, 1 on Mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
        {courses.map((course, index) => (
          <CourseCard key={course.id} course={course} index={index} />
        ))}
      </div>
    </div>
  );
}

export default CourseSlider;

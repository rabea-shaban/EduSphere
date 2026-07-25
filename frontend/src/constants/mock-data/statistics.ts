export interface StatisticItem {
  value: string;
  label: string;
  description: string;
}

export const mockStatistics: StatisticItem[] = [
  { value: "50K+", label: "Active Students", description: "Learners studying daily" },
  { value: "500+", label: "Expert Teachers", description: "Top certified educators" },
  { value: "1,200+", label: "Courses", description: "Bilingual interactive classes" },
  { value: "45K+", label: "Completed Lessons", description: "Lectures watched" },
  { value: "98%", label: "Success Rate", description: "Students scoring top marks" },
];

export type SubjectBadgeVariant = "orange" | "blue" | "purple" | "red";

export interface Course {
  id: string;
  title: string;
  subjectBadge: string;
  subjectVariant: SubjectBadgeVariant;
  imageSrc: string;
  imageAlt: string;
  teacherName: string;
  teacherAvatar?: string;
  studentsCount: string;
  rating: number;
  href: string;
}

export interface FeaturedCoursesProps {
  title?: string;
  subtitle?: string;
  courses?: Course[];
  allCoursesText?: string;
  allCoursesHref?: string;
  className?: string;
}

export type StageVariant = "blue" | "green" | "orange";

export interface EducationalStage {
  id: string;
  variant: StageVariant;
  iconName: "backpack" | "book" | "target" | "cap" | "trophy";
  imageSrc: string;
  imageAlt: string;
  title: string;
  titleColor?: "blue" | "orange";
  subtitle: string;
  description: string;
  subjectsCount: number;
  lessonsCount: string;
  buttonText: string;
  buttonHref: string;
}

export interface EducationalStagesProps {
  title?: string;
  subtitle?: string;
  stages?: EducationalStage[];
  bottomNote?: string;
  className?: string;
}

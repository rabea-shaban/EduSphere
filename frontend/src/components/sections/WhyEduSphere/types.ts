export type FeatureIconVariant = "clock" | "shield" | "users" | "chart" | "ai" | "interactive";

export interface FeatureItem {
  id: string;
  title: string;
  description: string;
  iconVariant: FeatureIconVariant;
  badgeBg: string;
  iconColor: string;
}

export interface WhyEduSphereProps {
  title?: string;
  subtitle?: string;
  features?: FeatureItem[];
  className?: string;
}

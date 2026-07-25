import type { FeatureItem } from "./types";

export const DEFAULT_FEATURES: FeatureItem[] = [
  {
    id: "time",
    title: "متاح في أي وقت",
    description: "تعلم متى تشاء ومن أي جهاز",
    iconVariant: "clock",
    badgeBg: "bg-blue-100 dark:bg-blue-950/80",
    iconColor: "text-[#1E73D8] dark:text-blue-400",
  },
  {
    id: "security",
    title: "آمن وموثوق",
    description: "بيئة تعليمية آمنة وخصوصية مضمونة",
    iconVariant: "shield",
    badgeBg: "bg-blue-100 dark:bg-blue-950/80",
    iconColor: "text-[#1E73D8] dark:text-blue-400",
  },
  {
    id: "teachers",
    title: "معلمون متخصصون",
    description: "أفضل المعلمين ذوي الخبرة في جميع المواد",
    iconVariant: "users",
    badgeBg: "bg-purple-100 dark:bg-purple-950/80",
    iconColor: "text-purple-600 dark:text-purple-400",
  },
  {
    id: "analytics",
    title: "متابعة ذكية",
    description: "تقارير تفصيلية لمتابعة تقدمك ونقاط ضعفك لتقويرها",
    iconVariant: "chart",
    badgeBg: "bg-orange-100 dark:bg-orange-950/80",
    iconColor: "text-[#F58220] dark:text-orange-400",
  },
  {
    id: "ai",
    title: "ذكاء اصطناعي",
    description: "مساعد ذكي يجيب عن جميع استفساراتك",
    iconVariant: "ai",
    badgeBg: "bg-blue-100 dark:bg-blue-950/80",
    iconColor: "text-[#1E73D8] dark:text-blue-400",
  },
  {
    id: "interactive",
    title: "محتوى تفاعلي",
    description: "فيديوهات تفاعلية وتمارين تطبيقية ممتعة",
    iconVariant: "interactive",
    badgeBg: "bg-emerald-100 dark:bg-emerald-950/80",
    iconColor: "text-emerald-600 dark:text-emerald-400",
  },
];

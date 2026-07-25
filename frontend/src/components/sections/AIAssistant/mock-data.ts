import type { AICapability } from "./types";

export const DEFAULT_AI_CAPABILITIES: AICapability[] = [
  {
    id: "cap1",
    title: "شرح دروس المواد الدراسية",
    iconName: "cap",
  },
  {
    id: "cap2",
    title: "حل أسئلة في الاختبارات",
    iconName: "help",
  },
  {
    id: "cap3",
    title: "تلخيص دروس الأحياء",
    iconName: "lightbulb",
  },
  {
    id: "cap4",
    title: "إنشاء اختبار سريع",
    iconName: "zap",
  },
];

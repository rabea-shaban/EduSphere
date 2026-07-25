import type { NewsletterBenefit } from "./types";

export const DEFAULT_NEWSLETTER_BENEFITS: NewsletterBenefit[] = [
  {
    id: "content",
    title: "محتوى تعليمي حصري",
    iconName: "mail",
  },
  {
    id: "discounts",
    title: "عروض وخصومات خاصة للمشتركين",
    iconName: "gift",
  },
  {
    id: "tips",
    title: "نصائح وأفكار للتعلم بذكاء",
    iconName: "lightbulb",
  },
  {
    id: "no-spam",
    title: "لا مزعج",
    subtitle: "يمكنك الإلغاء في أي وقت",
    iconName: "shield",
  },
];

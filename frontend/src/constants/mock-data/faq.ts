export interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export const mockFAQs: FAQItem[] = [
  {
    question: "Is there a free trial or plan available?",
    answer: "Yes! The Free Plan gives you access to select open courses, basic quizzes, and standard forum support. No credit card is required to sign up.",
    category: "General",
  },
  {
    question: "How does the AI Tutor help me study?",
    answer: "The AI Tutor is available 24/7. It explains complex topics, generates mock practice tests, helps plan your weekly schedule, and summarizes long lecture chapters automatically.",
    category: "Features",
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer: "Absolutely. You can cancel, upgrade, or downgrade your plan directly from your account billing settings at any time without extra fees.",
    category: "Pricing",
  },
  {
    question: "Are the courses aligned with the school curriculum?",
    answer: "Yes, our experienced instructors design courses specifically to align with official school stages (Primary, Preparatory, and Secondary) and standards.",
    category: "Academic",
  },
];

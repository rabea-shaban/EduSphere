export interface FAQItem {
  id: string;
  category: string;
}

export const mockFAQs: FAQItem[] = [
  { id: "q1", category: "General" },
  { id: "q2", category: "Features" },
  { id: "q3", category: "Pricing" },
  { id: "q4", category: "Academic" },
];

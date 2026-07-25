export interface NewsletterBenefit {
  id: string;
  title: string;
  subtitle?: string;
  iconName: "mail" | "gift" | "lightbulb" | "shield";
}

export interface NewsletterProps {
  title1?: string;
  title2Highlight?: string;
  description?: string;
  inputPlaceholder?: string;
  buttonText?: string;
  benefits?: NewsletterBenefit[];
  className?: string;
}

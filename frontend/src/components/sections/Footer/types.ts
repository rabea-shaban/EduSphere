export interface FooterLinkItem {
  label: string;
  href: string;
}

export interface FooterColumnData {
  title: string;
  links: FooterLinkItem[];
}

export interface ContactDetailItem {
  id: string;
  text: string;
  iconName: "mail" | "phone" | "map" | "clock";
  href?: string;
}

export interface SocialLinkItem {
  id: string;
  name: string;
  href: string;
  iconName: "facebook" | "youtube" | "instagram" | "twitter";
}

export interface PaymentMethodItem {
  id: string;
  name: string;
  logoSrc: string;
}

export interface FooterProps {
  className?: string;
}

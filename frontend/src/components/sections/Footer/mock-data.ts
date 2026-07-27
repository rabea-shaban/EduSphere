import type { FooterColumnData, ContactDetailItem, SocialLinkItem, PaymentMethodItem } from "./types";

export const FOOTER_COLUMNS: FooterColumnData[] = [
  {
    title: "المنصة",
    links: [
      { label: "الرئيسية", href: "/" },
      { label: "المراحل الدراسية", href: "#stages" },
      { label: "جميع الدروس", href: "/courses" },
      { label: "كورسات مميزة", href: "#featured-courses" },
      { label: "مساعدك الذكي", href: "#ai-assistant" },
    ],
  },
  {
    title: "الدعم",
    links: [
      { label: "مركز المساعدة", href: "/help" },
      { label: "الأسئلة الشائعة", href: "/faq" },
      { label: "تواصل معنا", href: "/contact" },
      { label: "سياسة الخصوصية", href: "/privacy" },
      { label: "الشروط والأحكام", href: "/terms" },
    ],
  },
  {
    title: "روابط مهمة",
    links: [
      { label: "من نحن", href: "/about" },
      { label: "المدونة", href: "/blog" },
      { label: "انضم كمدرس 👨‍🏫", href: "/teacher/apply" },
      { label: "استعلام عن طلب معلم 🔎", href: "/teacher/status" },
      { label: "المكتبة المجانية", href: "/library" },
      { label: "خريطة الموقع", href: "/sitemap" },
    ],
  },
];

export const CONTACT_DETAILS: ContactDetailItem[] = [
  {
    id: "email",
    text: "support@edusphere.com",
    iconName: "mail",
    href: "mailto:support@edusphere.com",
  },
  {
    id: "phone",
    text: "+20 100 123 4567",
    iconName: "phone",
    href: "tel:+201001234567",
  },
  {
    id: "location",
    text: "المنيا، جمهورية مصر العربية",
    iconName: "map",
  },
  {
    id: "hours",
    text: "السبت - الخميس: 9:00 صباحًا - 9:00 مساءً",
    iconName: "clock",
  },
];

export const SOCIAL_LINKS: SocialLinkItem[] = [
  {
    id: "facebook",
    name: "Facebook",
    href: "https://facebook.com",
    iconName: "facebook",
  },
  {
    id: "youtube",
    name: "YouTube",
    href: "https://youtube.com",
    iconName: "youtube",
  },
  {
    id: "instagram",
    name: "Instagram",
    href: "https://instagram.com",
    iconName: "instagram",
  },
  {
    id: "twitter",
    name: "Twitter / X",
    href: "https://twitter.com",
    iconName: "twitter",
  },
];

export const PAYMENT_METHODS: PaymentMethodItem[] = [
  {
    id: "instapay",
    name: "InstaPay",
    logoSrc: "/payments/instapay.svg",
  },
  {
    id: "fawry",
    name: "Fawry",
    logoSrc: "/payments/fawry.svg",
  },
  {
    id: "meeza",
    name: "Meeza",
    logoSrc: "/payments/meeza.svg",
  },
  {
    id: "visa",
    name: "Visa",
    logoSrc: "/payments/visa.svg",
  },
  {
    id: "mastercard",
    name: "Mastercard",
    logoSrc: "/payments/mastercard.svg",
  },
];

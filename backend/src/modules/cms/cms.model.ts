import { Schema, model, Document } from 'mongoose';

export interface IFaq {
  _id?: string;
  question: string;
  answer: string;
  category?: string;
  order?: number;
}

export interface ITestimonial {
  _id?: string;
  name: string;
  role: string;
  avatar?: string;
  rating: number;
  review: string;
  isVisible: boolean;
}

export interface ICmsContent {
  hero: {
    title: string;
    subtitle: string;
    description: string;
    ctaText: string;
    heroImage?: string;
    bgImage?: string;
  };
  contact: {
    phone: string;
    email: string;
    whatsapp: string;
    address: string;
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
    twitter?: string;
  };
  legal: {
    aboutUs?: string;
    privacyPolicy?: string;
    termsAndConditions?: string;
    refundPolicy?: string;
  };
  seo: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string;
  };
  faqs: IFaq[];
  testimonials: ITestimonial[];
}

export interface ICmsContentDocument extends ICmsContent, Document {}

const cmsContentSchema = new Schema<ICmsContentDocument>(
  {
    hero: {
      title: { type: String, default: 'منصة EduSphere التعليمية المتكاملة' },
      subtitle: { type: String, default: 'المنصة الأولى للتعلم الذكي وتطوير المهارات الأكاديمية' },
      description: { type: String, default: 'نقدم تجربة تعليمية فريدة تربط أفضل المعلمين والدروس التفاعلية بالطلاب بأعلى جودة' },
      ctaText: { type: String, default: 'ابدأ التعلم الآن 🚀' },
      heroImage: { type: String },
      bgImage: { type: String },
    },
    contact: {
      phone: { type: String, default: '+20 100 000 0000' },
      email: { type: String, default: 'support@edusphere.edu.eg' },
      whatsapp: { type: String, default: '+20 100 000 0000' },
      address: { type: String, default: 'القاهرة، مصر' },
      facebook: { type: String, default: 'https://facebook.com' },
      instagram: { type: String, default: 'https://instagram.com' },
      linkedin: { type: String, default: 'https://linkedin.com' },
      youtube: { type: String, default: 'https://youtube.com' },
      twitter: { type: String, default: 'https://x.com' },
    },
    legal: {
      aboutUs: { type: String, default: 'EduSphere هي منصة تعليمية مصرية رائدة تهتم بتوفير المناهج والدروس التفاعلية للجميع.' },
      privacyPolicy: { type: String, default: 'سياسة الخصوصية الخاصة بمنصة EduSphere لحماية بيانات الطلاب والمعلمين.' },
      termsAndConditions: { type: String, default: 'الشروط والأحكام الخاصة باستعمال خدمات المنصة.' },
      refundPolicy: { type: String, default: 'سياسة الاسترجاع المالي والضمان الذهبي.' },
    },
    seo: {
      metaTitle: { type: String, default: 'EduSphere — منصة التعلم الذكي والمناهج التعليمية' },
      metaDescription: { type: String, default: 'أكبر منصة تعليمية تفاعلية للمناهج والدروس واختبارات الثانوية والصفوف الدراسية' },
      keywords: { type: String, default: 'تعليم, مناهج مصرية, دروس اونلاين, ثانوية عامة' },
    },
    faqs: [
      {
        question: { type: String, required: true },
        answer: { type: String, required: true },
        category: { type: String, default: 'عام' },
        order: { type: Number, default: 0 },
      },
    ],
    testimonials: [
      {
        name: { type: String, required: true },
        role: { type: String, default: 'طالب بالثانوية العامة' },
        avatar: { type: String },
        rating: { type: Number, default: 5 },
        review: { type: String, required: true },
        isVisible: { type: Boolean, default: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const CmsContent = model<ICmsContentDocument>('CmsContent', cmsContentSchema);
export default CmsContent;

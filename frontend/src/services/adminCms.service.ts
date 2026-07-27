import api from "./api";

export interface CmsContentData {
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
  faqs: {
    _id?: string;
    question: string;
    answer: string;
    category?: string;
    order?: number;
  }[];
  testimonials: {
    _id?: string;
    name: string;
    role: string;
    avatar?: string;
    rating: number;
    review: string;
    isVisible: boolean;
  }[];
}

export const adminCmsService = {
  async getCmsContent(): Promise<CmsContentData> {
    const response = await api.get<{ success: boolean; data: CmsContentData }>("/admin/cms");
    return response.data.data;
  },

  async updateCmsSection(section: string, data: any): Promise<CmsContentData> {
    const response = await api.patch<{ success: boolean; data: CmsContentData }>(`/admin/cms/${section}`, {
      [section]: data,
    });
    return response.data.data;
  },

  async addFaq(faq: { question: string; answer: string; category?: string }): Promise<any> {
    const response = await api.post<{ success: boolean; data: any }>("/admin/faqs", faq);
    return response.data.data;
  },

  async deleteFaq(id: string): Promise<void> {
    await api.delete(`/admin/faqs/${id}`);
  },

  async addTestimonial(testimonial: {
    name: string;
    role?: string;
    review: string;
    rating?: number;
  }): Promise<any> {
    const response = await api.post<{ success: boolean; data: any }>("/admin/testimonials", testimonial);
    return response.data.data;
  },

  async deleteTestimonial(id: string): Promise<void> {
    await api.delete(`/admin/testimonials/${id}`);
  },
};

export default adminCmsService;

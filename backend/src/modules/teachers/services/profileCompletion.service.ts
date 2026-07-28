export interface ProfileCompletenessResult {
  completionPercentage: number;
  completedFields: string[];
  missingFields: string[];
  recommendedImprovements: string[];
}

export class ProfileCompletionService {
  /**
   * Calculates profile completion percentage (100% scale) and provides improvement tips.
   */
  static calculate(user: any, profile: any): ProfileCompletenessResult {
    const fields = [
      { name: 'الاسم الكامل', check: !!(user?.firstName && user?.lastName) },
      { name: 'البريد الإلكتروني والرمز', check: !!user?.email },
      { name: 'رقم الهاتف', check: !!user?.phone },
      { name: 'الصورة الشخصية (Avatar)', check: !!user?.avatar && !user?.avatar.includes('dicebear') },
      { name: 'صورة الغلاف (Cover)', check: !!profile?.coverImage },
      { name: 'العنوان الوظيفي (Headline)', check: !!profile?.headline },
      { name: 'السيرة الذاتية (Bio)', check: !!profile?.bio && profile?.bio.length > 20 },
      { name: 'التخصص التعليمي', check: !!profile?.professionalInfo?.specialization },
      { name: 'سنوات الخبرة', check: (profile?.professionalInfo?.yearsOfExperience || 0) > 0 },
      { name: 'المهارات والشهادات', check: (profile?.professionalInfo?.skills?.length || 0) > 0 },
      { name: 'روابط التواصل الاجتماعي', check: !!(profile?.socialLinks?.linkedIn || profile?.socialLinks?.website) },
    ];

    const completedFields: string[] = [];
    const missingFields: string[] = [];

    fields.forEach((f) => {
      if (f.check) completedFields.push(f.name);
      else missingFields.push(f.name);
    });

    const completionPercentage = Math.round((completedFields.length / fields.length) * 100);

    const recommendedImprovements: string[] = [];
    if (!user?.avatar || user?.avatar.includes('dicebear')) {
      recommendedImprovements.push('قم برفع صورة شخصية احترافية لتسهيل التعرف عليك من الطلاب.');
    }
    if (!profile?.headline) {
      recommendedImprovements.push('أضف مسمى وظيفي مختصر يصف مجال تدريسك بشكل مميز.');
    }
    if (!profile?.bio || profile?.bio.length < 20) {
      recommendedImprovements.push('اكتب نبذة شخصية ملهمة توضح خبرتك وأسلوبك في الشرح.');
    }
    if (!profile?.socialLinks?.linkedIn && !profile?.socialLinks?.website) {
      recommendedImprovements.push('أضف روابط حساباتك المهنية لتوفير المزيد من الثقة للطلاب.');
    }

    return {
      completionPercentage,
      completedFields,
      missingFields,
      recommendedImprovements,
    };
  }
}

export default ProfileCompletionService;

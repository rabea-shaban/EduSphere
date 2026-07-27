import { Request, Response } from 'express';
import { CmsContent } from './cms.model';
import { ApiResponse } from '../../utils/ApiResponse';
import { ApiError } from '../../utils/ApiError';
import { catchAsync } from '../../utils/catchAsync';

/**
 * Get CMS Content settings & sections.
 */
export const getCmsContentAdmin = catchAsync(async (_req: Request, res: Response) => {
  let cms = await CmsContent.findOne();
  if (!cms) {
    cms = await CmsContent.create({
      faqs: [
        {
          question: 'كيف يمكنني التسجيل واشتراك الكورسات؟',
          answer: 'يمكنك إنشاء حساب جديد كطالب، ثم اختيار الصف الدراسي واستكشاف الكورسات والشراء المباشر.',
          category: 'عام',
        },
      ],
      testimonials: [
        {
          name: 'أحمد محمود',
          role: 'طالب بالصف الثالث الثانوي',
          rating: 5,
          review: 'منصة ممتازة جداً وساعدتني كثيراً في فهم واستيعاب مادة الفيزياء!',
          isVisible: true,
        },
      ],
    });
  }

  res.status(200).json(new ApiResponse(200, cms, 'CMS content retrieved successfully'));
});

/**
 * Update CMS Content section (hero, contact, legal, seo).
 */
export const updateCmsSectionAdmin = catchAsync(async (req: Request, res: Response) => {
  const { section } = req.params;
  let cms = await CmsContent.findOne();
  if (!cms) {
    cms = new CmsContent({});
  }

  if (section === 'hero' && req.body.hero) {
    cms.hero = { ...cms.hero, ...req.body.hero };
  } else if (section === 'contact' && req.body.contact) {
    cms.contact = { ...cms.contact, ...req.body.contact };
  } else if (section === 'legal' && req.body.legal) {
    cms.legal = { ...cms.legal, ...req.body.legal };
  } else if (section === 'seo' && req.body.seo) {
    cms.seo = { ...cms.seo, ...req.body.seo };
  } else {
    Object.assign(cms, req.body);
  }

  await cms.save();
  res.status(200).json(new ApiResponse(200, cms, `تم تحديث قسم (${section}) بنجاح`));
});

/**
 * FAQ Management: Add FAQ.
 */
export const addFaqAdmin = catchAsync(async (req: Request, res: Response) => {
  const { question, answer, category = 'عام' } = req.body;
  if (!question || !answer) {
    throw new ApiError(400, 'السؤال والإجابة مطلوبان');
  }

  let cms = await CmsContent.findOne();
  if (!cms) cms = new CmsContent({});

  cms.faqs.push({ question, answer, category, order: cms.faqs.length + 1 });
  await cms.save();

  res.status(201).json(new ApiResponse(201, cms.faqs, 'تم إضافة السؤال الشائع بنجاح 🎉'));
});

/**
 * FAQ Management: Delete FAQ.
 */
export const deleteFaqAdmin = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  let cms = await CmsContent.findOne();
  if (!cms) throw new ApiError(404, 'CMS content not found');

  cms.faqs = cms.faqs.filter((f: any) => f._id?.toString() !== id);
  await cms.save();

  res.status(200).json(new ApiResponse(200, cms.faqs, 'تم حذف السؤال الشائع بنجاح'));
});

/**
 * Testimonials Management: Add Testimonial.
 */
export const addTestimonialAdmin = catchAsync(async (req: Request, res: Response) => {
  const { name, role, review, rating = 5, avatar } = req.body;
  if (!name || !review) {
    throw new ApiError(400, 'الاسم والرأي مطلوبان');
  }

  let cms = await CmsContent.findOne();
  if (!cms) cms = new CmsContent({});

  cms.testimonials.push({ name, role: role || 'طالب', review, rating: Number(rating), avatar, isVisible: true });
  await cms.save();

  res.status(201).json(new ApiResponse(201, cms.testimonials, 'تم إضافة التقييم والتوصية بنجاح 🎉'));
});

/**
 * Testimonials Management: Delete Testimonial.
 */
export const deleteTestimonialAdmin = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  let cms = await CmsContent.findOne();
  if (!cms) throw new ApiError(404, 'CMS content not found');

  cms.testimonials = cms.testimonials.filter((t: any) => t._id?.toString() !== id);
  await cms.save();

  res.status(200).json(new ApiResponse(200, cms.testimonials, 'تم حذف التوصية بنجاح'));
});

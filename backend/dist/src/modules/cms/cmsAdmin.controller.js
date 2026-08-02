"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTestimonialAdmin = exports.addTestimonialAdmin = exports.deleteFaqAdmin = exports.addFaqAdmin = exports.updateCmsSectionAdmin = exports.getCmsContentAdmin = void 0;
const cms_model_1 = require("./cms.model");
const ApiResponse_1 = require("../../utils/ApiResponse");
const ApiError_1 = require("../../utils/ApiError");
const catchAsync_1 = require("../../utils/catchAsync");
/**
 * Get CMS Content settings & sections.
 */
exports.getCmsContentAdmin = (0, catchAsync_1.catchAsync)(async (_req, res) => {
    let cms = await cms_model_1.CmsContent.findOne();
    if (!cms) {
        cms = await cms_model_1.CmsContent.create({
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
    res.status(200).json(new ApiResponse_1.ApiResponse(200, cms, 'CMS content retrieved successfully'));
});
/**
 * Update CMS Content section (hero, contact, legal, seo).
 */
exports.updateCmsSectionAdmin = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { section } = req.params;
    let cms = await cms_model_1.CmsContent.findOne();
    if (!cms) {
        cms = new cms_model_1.CmsContent({});
    }
    if (section === 'hero' && req.body.hero) {
        cms.hero = { ...cms.hero, ...req.body.hero };
    }
    else if (section === 'contact' && req.body.contact) {
        cms.contact = { ...cms.contact, ...req.body.contact };
    }
    else if (section === 'legal' && req.body.legal) {
        cms.legal = { ...cms.legal, ...req.body.legal };
    }
    else if (section === 'seo' && req.body.seo) {
        cms.seo = { ...cms.seo, ...req.body.seo };
    }
    else {
        Object.assign(cms, req.body);
    }
    await cms.save();
    res.status(200).json(new ApiResponse_1.ApiResponse(200, cms, `تم تحديث قسم (${section}) بنجاح`));
});
/**
 * FAQ Management: Add FAQ.
 */
exports.addFaqAdmin = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { question, answer, category = 'عام' } = req.body;
    if (!question || !answer) {
        throw new ApiError_1.ApiError(400, 'السؤال والإجابة مطلوبان');
    }
    let cms = await cms_model_1.CmsContent.findOne();
    if (!cms)
        cms = new cms_model_1.CmsContent({});
    cms.faqs.push({ question, answer, category, order: cms.faqs.length + 1 });
    await cms.save();
    res.status(201).json(new ApiResponse_1.ApiResponse(201, cms.faqs, 'تم إضافة السؤال الشائع بنجاح 🎉'));
});
/**
 * FAQ Management: Delete FAQ.
 */
exports.deleteFaqAdmin = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    let cms = await cms_model_1.CmsContent.findOne();
    if (!cms)
        throw new ApiError_1.ApiError(404, 'CMS content not found');
    cms.faqs = cms.faqs.filter((f) => f._id?.toString() !== id);
    await cms.save();
    res.status(200).json(new ApiResponse_1.ApiResponse(200, cms.faqs, 'تم حذف السؤال الشائع بنجاح'));
});
/**
 * Testimonials Management: Add Testimonial.
 */
exports.addTestimonialAdmin = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { name, role, review, rating = 5, avatar } = req.body;
    if (!name || !review) {
        throw new ApiError_1.ApiError(400, 'الاسم والرأي مطلوبان');
    }
    let cms = await cms_model_1.CmsContent.findOne();
    if (!cms)
        cms = new cms_model_1.CmsContent({});
    cms.testimonials.push({ name, role: role || 'طالب', review, rating: Number(rating), avatar, isVisible: true });
    await cms.save();
    res.status(201).json(new ApiResponse_1.ApiResponse(201, cms.testimonials, 'تم إضافة التقييم والتوصية بنجاح 🎉'));
});
/**
 * Testimonials Management: Delete Testimonial.
 */
exports.deleteTestimonialAdmin = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    let cms = await cms_model_1.CmsContent.findOne();
    if (!cms)
        throw new ApiError_1.ApiError(404, 'CMS content not found');
    cms.testimonials = cms.testimonials.filter((t) => t._id?.toString() !== id);
    await cms.save();
    res.status(200).json(new ApiResponse_1.ApiResponse(200, cms.testimonials, 'تم حذف التوصية بنجاح'));
});

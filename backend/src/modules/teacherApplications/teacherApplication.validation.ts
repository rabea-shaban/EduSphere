import Joi from 'joi';

// ─── Shared body schema for the application fields ───────────────────────────
const applicationBodySchema = {
  fullName: Joi.string().trim().required().messages({ 'any.required': 'الاسم الكامل مطلوب' }),
  email: Joi.string().email().trim().required().messages({
    'string.email': 'البريد الإلكتروني غير صالح',
    'any.required': 'البريد الإلكتروني مطلوب',
  }),
  phone: Joi.string().trim().required().messages({ 'any.required': 'رقم الهاتف مطلوب' }),
  nationalId: Joi.string().trim().allow('', null).optional(),
  subject: Joi.string().trim().required().messages({ 'any.required': 'المادة التخصصية مطلوبة' }),
  stage: Joi.string().trim().required().messages({ 'any.required': 'المرحلة التعليمية مطلوبة' }),
  grades: Joi.array().items(Joi.string().trim()).optional(),
  experienceYears: Joi.number().min(0).required().messages({ 'any.required': 'عدد سنوات الخبرة مطلوب' }),
  currentJob: Joi.string().trim().allow('', null).optional(),
  bio: Joi.string().trim().allow('', null).optional(),
  degree: Joi.string().trim().required().messages({ 'any.required': 'المؤهل الدراسي مطلوب' }),
  university: Joi.string().trim().required().messages({ 'any.required': 'الجامعة / الكلية مطلوبة' }),
  graduationYear: Joi.number().integer().min(1950).max(2030).required().messages({
    'any.required': 'سنة التخرج مطلوبة',
  }),
  profileImage: Joi.string().trim().allow('', null).optional(),
  nationalIdFront: Joi.string().trim().allow('', null).optional(),
  nationalIdBack: Joi.string().trim().allow('', null).optional(),
  certificateDoc: Joi.string().trim().allow('', null).optional(),
  cvUrl: Joi.string().trim().allow('', null).optional(),
  demoVideoUrl: Joi.string().trim().allow('', null).optional(),
  socialLinks: Joi.object({
    linkedin: Joi.string().trim().allow('', null).optional(),
    facebook: Joi.string().trim().allow('', null).optional(),
    youtube: Joi.string().trim().allow('', null).optional(),
    website: Joi.string().trim().allow('', null).optional(),
  }).optional(),
};

// Draft allows most required fields to be optional
const draftBodySchema = {
  ...applicationBodySchema,
  fullName: Joi.string().trim().allow('', null).optional(),
  email: Joi.string().email().trim().allow('', null).optional(),
  phone: Joi.string().trim().allow('', null).optional(),
  subject: Joi.string().trim().allow('', null).optional(),
  stage: Joi.string().trim().allow('', null).optional(),
  experienceYears: Joi.number().min(0).optional(),
  degree: Joi.string().trim().allow('', null).optional(),
  university: Joi.string().trim().allow('', null).optional(),
  graduationYear: Joi.number().integer().min(1950).max(2030).optional(),
};

export const createTeacherApplicationSchema = Joi.object(applicationBodySchema);

export const saveDraftApplicationSchema = Joi.object(draftBodySchema);

export const updateApplicationStatusSchema = Joi.object({
  status: Joi.string()
    .valid('Pending', 'UnderReview', 'Approved', 'Rejected', 'NeedsChanges', 'Suspended')
    .required()
    .messages({ 'any.required': 'الحالة مطلوبة' }),
  rejectionReason: Joi.string().trim().allow('', null).optional(),
  changesRequested: Joi.string().trim().allow('', null).optional(),
});

export const approveApplicationSchema = Joi.object({
  notes: Joi.string().trim().allow('', null).optional(),
});

export const rejectApplicationSchema = Joi.object({
  rejectionReason: Joi.string().trim().required().messages({
    'any.required': 'سبب الرفض مطلوب',
  }),
});

export const requestChangesSchema = Joi.object({
  changesRequested: Joi.string().trim().required().messages({
    'any.required': 'يرجى تحديد التغييرات المطلوبة',
  }),
});

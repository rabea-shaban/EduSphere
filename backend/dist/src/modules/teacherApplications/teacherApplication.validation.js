"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestChangesSchema = exports.rejectApplicationSchema = exports.approveApplicationSchema = exports.updateApplicationStatusSchema = exports.saveDraftApplicationSchema = exports.createTeacherApplicationSchema = void 0;
const joi_1 = __importDefault(require("joi"));
// ─── Shared body schema for the application fields ───────────────────────────
const applicationBodySchema = {
    fullName: joi_1.default.string().trim().required().messages({ 'any.required': 'الاسم الكامل مطلوب' }),
    email: joi_1.default.string().email().trim().required().messages({
        'string.email': 'البريد الإلكتروني غير صالح',
        'any.required': 'البريد الإلكتروني مطلوب',
    }),
    phone: joi_1.default.string().trim().required().messages({ 'any.required': 'رقم الهاتف مطلوب' }),
    password: joi_1.default.string().min(6).trim().allow('', null).optional().messages({
        'string.min': 'كلمة المرور يجب أن تتكون من 6 أحرف على الأقل',
    }),
    nationalId: joi_1.default.string().trim().allow('', null).optional(),
    subject: joi_1.default.string().trim().required().messages({ 'any.required': 'المادة التخصصية مطلوبة' }),
    stage: joi_1.default.string().trim().required().messages({ 'any.required': 'المرحلة التعليمية مطلوبة' }),
    grades: joi_1.default.array().items(joi_1.default.string().trim()).optional(),
    experienceYears: joi_1.default.number().min(0).required().messages({ 'any.required': 'عدد سنوات الخبرة مطلوب' }),
    currentJob: joi_1.default.string().trim().allow('', null).optional(),
    bio: joi_1.default.string().trim().allow('', null).optional(),
    degree: joi_1.default.string().trim().required().messages({ 'any.required': 'المؤهل الدراسي مطلوب' }),
    university: joi_1.default.string().trim().required().messages({ 'any.required': 'الجامعة / الكلية مطلوبة' }),
    graduationYear: joi_1.default.number().integer().min(1950).max(2030).required().messages({
        'any.required': 'سنة التخرج مطلوبة',
    }),
    profileImage: joi_1.default.string().trim().allow('', null).optional(),
    nationalIdFront: joi_1.default.string().trim().allow('', null).optional(),
    nationalIdBack: joi_1.default.string().trim().allow('', null).optional(),
    certificateDoc: joi_1.default.string().trim().allow('', null).optional(),
    cvUrl: joi_1.default.string().trim().allow('', null).optional(),
    demoVideoUrl: joi_1.default.string().trim().allow('', null).optional(),
    socialLinks: joi_1.default.object({
        linkedin: joi_1.default.string().trim().allow('', null).optional(),
        facebook: joi_1.default.string().trim().allow('', null).optional(),
        youtube: joi_1.default.string().trim().allow('', null).optional(),
        website: joi_1.default.string().trim().allow('', null).optional(),
    }).optional(),
};
// Draft allows most required fields to be optional
const draftBodySchema = {
    ...applicationBodySchema,
    fullName: joi_1.default.string().trim().allow('', null).optional(),
    email: joi_1.default.string().email().trim().allow('', null).optional(),
    phone: joi_1.default.string().trim().allow('', null).optional(),
    subject: joi_1.default.string().trim().allow('', null).optional(),
    stage: joi_1.default.string().trim().allow('', null).optional(),
    experienceYears: joi_1.default.number().min(0).optional(),
    degree: joi_1.default.string().trim().allow('', null).optional(),
    university: joi_1.default.string().trim().allow('', null).optional(),
    graduationYear: joi_1.default.number().integer().min(1950).max(2030).optional(),
};
exports.createTeacherApplicationSchema = joi_1.default.object(applicationBodySchema);
exports.saveDraftApplicationSchema = joi_1.default.object(draftBodySchema);
exports.updateApplicationStatusSchema = joi_1.default.object({
    status: joi_1.default.string()
        .valid('Pending', 'UnderReview', 'Approved', 'Rejected', 'NeedsChanges', 'Suspended')
        .required()
        .messages({ 'any.required': 'الحالة مطلوبة' }),
    rejectionReason: joi_1.default.string().trim().allow('', null).optional(),
    changesRequested: joi_1.default.string().trim().allow('', null).optional(),
});
exports.approveApplicationSchema = joi_1.default.object({
    notes: joi_1.default.string().trim().allow('', null).optional(),
});
exports.rejectApplicationSchema = joi_1.default.object({
    rejectionReason: joi_1.default.string().trim().required().messages({
        'any.required': 'سبب الرفض مطلوب',
    }),
});
exports.requestChangesSchema = joi_1.default.object({
    changesRequested: joi_1.default.string().trim().required().messages({
        'any.required': 'يرجى تحديد التغييرات المطلوبة',
    }),
});

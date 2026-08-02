"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.confirmPasswordSchema = exports.updateTeacherSettingsSchema = exports.updateSecuritySettingsSchema = exports.updatePrivacySettingsSchema = exports.updateNotificationSettingsSchema = exports.updateAppearanceSettingsSchema = exports.updateGeneralSettingsSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.updateGeneralSettingsSchema = joi_1.default.object({
    language: joi_1.default.string().valid('ar', 'en', 'fr').optional(),
    timezone: joi_1.default.string().trim().optional(),
    dateFormat: joi_1.default.string().valid('YYYY-MM-DD', 'DD/MM/YYYY', 'MM/DD/YYYY').optional(),
    timeFormat: joi_1.default.string().valid('12h', '24h').optional(),
    currency: joi_1.default.string().valid('EGP', 'USD', 'EUR', 'SAR', 'AED').optional(),
    defaultDashboard: joi_1.default.string().valid('overview', 'courses', 'analytics', 'earnings', 'students').optional(),
    profileVisibility: joi_1.default.string().valid('public', 'students_only', 'private').optional(),
    autoSavePreferences: joi_1.default.boolean().optional(),
});
exports.updateAppearanceSettingsSchema = joi_1.default.object({
    theme: joi_1.default.string().valid('light', 'dark', 'system').optional(),
    primaryColor: joi_1.default.string().trim().pattern(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).optional(),
    sidebarPreferences: joi_1.default.object({
        collapsed: joi_1.default.boolean().optional(),
        position: joi_1.default.string().valid('left', 'right').optional(),
    }).optional(),
    tableDensity: joi_1.default.string().valid('compact', 'comfortable', 'spacious').optional(),
});
exports.updateNotificationSettingsSchema = joi_1.default.object({
    inApp: joi_1.default.boolean().optional(),
    email: joi_1.default.boolean().optional(),
    push: joi_1.default.boolean().optional(),
    marketing: joi_1.default.boolean().optional(),
    assignment: joi_1.default.boolean().optional(),
    quiz: joi_1.default.boolean().optional(),
    enrollment: joi_1.default.boolean().optional(),
    payment: joi_1.default.boolean().optional(),
    review: joi_1.default.boolean().optional(),
    systemAnnouncements: joi_1.default.boolean().optional(),
});
exports.updatePrivacySettingsSchema = joi_1.default.object({
    publicProfile: joi_1.default.boolean().optional(),
    showEmail: joi_1.default.boolean().optional(),
    showPhone: joi_1.default.boolean().optional(),
    showSocialLinks: joi_1.default.boolean().optional(),
    showInstructorStats: joi_1.default.boolean().optional(),
    profileVisibility: joi_1.default.string().valid('public', 'students_only', 'private').optional(),
    searchEngineVisibility: joi_1.default.boolean().optional(),
});
exports.updateSecuritySettingsSchema = joi_1.default.object({
    currentPassword: joi_1.default.string().optional(),
    newPassword: joi_1.default.string().min(6).optional(),
    confirmPassword: joi_1.default.string().valid(joi_1.default.ref('newPassword')).when('newPassword', {
        is: joi_1.default.exist(),
        then: joi_1.default.required(),
        otherwise: joi_1.default.optional(),
    }),
    twoFactorEnabled: joi_1.default.boolean().optional(),
    securityAlerts: joi_1.default.boolean().optional(),
});
exports.updateTeacherSettingsSchema = joi_1.default.object({
    general: exports.updateGeneralSettingsSchema.optional(),
    appearance: exports.updateAppearanceSettingsSchema.optional(),
    notifications: exports.updateNotificationSettingsSchema.optional(),
    privacy: exports.updatePrivacySettingsSchema.optional(),
    security: exports.updateSecuritySettingsSchema.optional(),
});
exports.confirmPasswordSchema = joi_1.default.object({
    password: joi_1.default.string().required().messages({
        'any.required': 'كلمة المرور مطلوبة لتأكيد هذا الإجراء السري',
    }),
    reason: joi_1.default.string().optional(),
});

import Joi from 'joi';

export const updateGeneralSettingsSchema = Joi.object({
  language: Joi.string().valid('ar', 'en', 'fr').optional(),
  timezone: Joi.string().trim().optional(),
  dateFormat: Joi.string().valid('YYYY-MM-DD', 'DD/MM/YYYY', 'MM/DD/YYYY').optional(),
  timeFormat: Joi.string().valid('12h', '24h').optional(),
  currency: Joi.string().valid('EGP', 'USD', 'EUR', 'SAR', 'AED').optional(),
  defaultDashboard: Joi.string().valid('overview', 'courses', 'analytics', 'earnings', 'students').optional(),
  profileVisibility: Joi.string().valid('public', 'students_only', 'private').optional(),
  autoSavePreferences: Joi.boolean().optional(),
});

export const updateAppearanceSettingsSchema = Joi.object({
  theme: Joi.string().valid('light', 'dark', 'system').optional(),
  primaryColor: Joi.string().trim().pattern(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).optional(),
  sidebarPreferences: Joi.object({
    collapsed: Joi.boolean().optional(),
    position: Joi.string().valid('left', 'right').optional(),
  }).optional(),
  tableDensity: Joi.string().valid('compact', 'comfortable', 'spacious').optional(),
});

export const updateNotificationSettingsSchema = Joi.object({
  inApp: Joi.boolean().optional(),
  email: Joi.boolean().optional(),
  push: Joi.boolean().optional(),
  marketing: Joi.boolean().optional(),
  assignment: Joi.boolean().optional(),
  quiz: Joi.boolean().optional(),
  enrollment: Joi.boolean().optional(),
  payment: Joi.boolean().optional(),
  review: Joi.boolean().optional(),
  systemAnnouncements: Joi.boolean().optional(),
});

export const updatePrivacySettingsSchema = Joi.object({
  publicProfile: Joi.boolean().optional(),
  showEmail: Joi.boolean().optional(),
  showPhone: Joi.boolean().optional(),
  showSocialLinks: Joi.boolean().optional(),
  showInstructorStats: Joi.boolean().optional(),
  profileVisibility: Joi.string().valid('public', 'students_only', 'private').optional(),
  searchEngineVisibility: Joi.boolean().optional(),
});

export const updateSecuritySettingsSchema = Joi.object({
  currentPassword: Joi.string().optional(),
  newPassword: Joi.string().min(6).optional(),
  confirmPassword: Joi.string().valid(Joi.ref('newPassword')).when('newPassword', {
    is: Joi.exist(),
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  twoFactorEnabled: Joi.boolean().optional(),
  securityAlerts: Joi.boolean().optional(),
});

export const updateTeacherSettingsSchema = Joi.object({
  general: updateGeneralSettingsSchema.optional(),
  appearance: updateAppearanceSettingsSchema.optional(),
  notifications: updateNotificationSettingsSchema.optional(),
  privacy: updatePrivacySettingsSchema.optional(),
  security: updateSecuritySettingsSchema.optional(),
});

export const confirmPasswordSchema = Joi.object({
  password: Joi.string().required().messages({
    'any.required': 'كلمة المرور مطلوبة لتأكيد هذا الإجراء السري',
  }),
  reason: Joi.string().optional(),
});

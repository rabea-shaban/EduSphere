"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlatformSettings = void 0;
const mongoose_1 = require("mongoose");
const platformSettingsSchema = new mongoose_1.Schema({
    general: {
        platformName: { type: String, default: 'EduSphere Academy' },
        platformDescription: { type: String, default: 'المنصة الأولى للتعلم الذكي وتطوير المهارات الأكاديمية' },
        currency: { type: String, default: 'EGP' },
        defaultLanguage: { type: String, default: 'ar' },
        timezone: { type: String, default: 'Africa/Cairo' },
    },
    system: {
        maintenanceMode: { type: Boolean, default: false },
        registrationEnabled: { type: Boolean, default: true },
        teacherApplicationsEnabled: { type: Boolean, default: true },
        courseApprovalRequired: { type: Boolean, default: true },
        autoPublishCourses: { type: Boolean, default: false },
    },
    payments: {
        instapayEnabled: { type: Boolean, default: true },
        vodafoneCashEnabled: { type: Boolean, default: true },
        fawryEnabled: { type: Boolean, default: true },
        bankTransferEnabled: { type: Boolean, default: true },
        stripeEnabled: { type: Boolean, default: true },
    },
    security: {
        minPasswordLength: { type: Number, default: 8 },
        requireUppercase: { type: Boolean, default: true },
        requireNumbers: { type: Boolean, default: true },
        sessionTimeoutMinutes: { type: Number, default: 120 },
    },
    email: {
        smtpHost: { type: String, default: 'smtp.gmail.com' },
        smtpPort: { type: Number, default: 587 },
        smtpUser: { type: String, default: 'notifications@edusphere.edu.eg' },
        senderName: { type: String, default: 'EduSphere Team' },
        senderEmail: { type: String, default: 'no-reply@edusphere.edu.eg' },
    },
    backup: {
        lastBackupAt: { type: Date },
        databaseSizeMB: { type: Number, default: 14.5 },
    },
}, { timestamps: true });
exports.PlatformSettings = (0, mongoose_1.model)('PlatformSettings', platformSettingsSchema);
exports.default = exports.PlatformSettings;

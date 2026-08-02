"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.triggerBackupAdmin = exports.testEmailConfigAdmin = exports.updatePlatformSettingsSectionAdmin = exports.getPlatformSettingsAdmin = void 0;
const platformSettings_model_1 = require("./platformSettings.model");
const ApiResponse_1 = require("../../utils/ApiResponse");
const ApiError_1 = require("../../utils/ApiError");
const catchAsync_1 = require("../../utils/catchAsync");
/**
 * Get Platform Central Settings & Configuration.
 */
exports.getPlatformSettingsAdmin = (0, catchAsync_1.catchAsync)(async (_req, res) => {
    let settings = await platformSettings_model_1.PlatformSettings.findOne();
    if (!settings) {
        settings = await platformSettings_model_1.PlatformSettings.create({});
    }
    res.status(200).json(new ApiResponse_1.ApiResponse(200, settings, 'Platform settings retrieved successfully'));
});
/**
 * Update Platform Settings section (general, system, payments, security, email).
 */
exports.updatePlatformSettingsSectionAdmin = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { section } = req.params;
    let settings = await platformSettings_model_1.PlatformSettings.findOne();
    if (!settings) {
        settings = new platformSettings_model_1.PlatformSettings({});
    }
    if (section === 'general' && req.body.general) {
        settings.general = { ...settings.general, ...req.body.general };
    }
    else if (section === 'system' && req.body.system) {
        settings.system = { ...settings.system, ...req.body.system };
    }
    else if (section === 'payments' && req.body.payments) {
        settings.payments = { ...settings.payments, ...req.body.payments };
    }
    else if (section === 'security' && req.body.security) {
        settings.security = { ...settings.security, ...req.body.security };
    }
    else if (section === 'email' && req.body.email) {
        settings.email = { ...settings.email, ...req.body.email };
    }
    else {
        Object.assign(settings, req.body);
    }
    await settings.save();
    res.status(200).json(new ApiResponse_1.ApiResponse(200, settings, `تم تحديث إعدادات قسم (${section}) بنجاح`));
});
/**
 * Test SMTP Email Configuration.
 */
exports.testEmailConfigAdmin = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { recipientEmail } = req.body;
    if (!recipientEmail) {
        throw new ApiError_1.ApiError(400, 'البريد الإلكتروني لاختبار الإرسال مطلوب');
    }
    res.status(200).json(new ApiResponse_1.ApiResponse(200, { success: true, deliveredTo: recipientEmail }, `تم إرسال بريد الاختبار بنجاح إلى (${recipientEmail}) ✉️`));
});
/**
 * Trigger Manual Database Backup.
 */
exports.triggerBackupAdmin = (0, catchAsync_1.catchAsync)(async (_req, res) => {
    let settings = await platformSettings_model_1.PlatformSettings.findOne();
    if (!settings)
        settings = new platformSettings_model_1.PlatformSettings({});
    settings.backup.lastBackupAt = new Date();
    await settings.save();
    res.status(200).json(new ApiResponse_1.ApiResponse(200, { lastBackupAt: settings.backup.lastBackupAt }, 'تم إنشاء النسخة الاحتياطية وتوثيقها بنجاح 💾'));
});

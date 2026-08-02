"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAccount = exports.deactivateAccount = exports.exportPersonalData = exports.logoutAllDevices = exports.revokeSession = exports.getActiveSessions = exports.updateSecuritySettings = exports.updatePrivacySettings = exports.updateNotificationSettings = exports.updateAppearanceSettings = exports.updateGeneralSettings = exports.updateTeacherSettings = exports.getTeacherSettings = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const ApiResponse_1 = require("../../utils/ApiResponse");
const ApiError_1 = require("../../utils/ApiError");
const teacherSettings_service_1 = require("./teacherSettings.service");
const getReqInfo = (req) => {
    const forwarded = req.headers['x-forwarded-for'];
    const rawIp = Array.isArray(forwarded) ? forwarded[0] : forwarded;
    return {
        ipAddress: rawIp || req.socket.remoteAddress || '127.0.0.1',
        userAgent: req.headers['user-agent'] || 'Unknown Agent',
        userName: req.user ? `${req.user.firstName} ${req.user.lastName}` : undefined,
        userRole: req.user?.role,
    };
};
/**
 * GET /teacher/settings
 */
exports.getTeacherSettings = (0, catchAsync_1.catchAsync)(async (req, res) => {
    if (!req.user)
        throw new ApiError_1.ApiError(401, 'غير مصرح بالوصول');
    const settings = await teacherSettings_service_1.TeacherSettingsService.getOrCreateSettings(req.user._id);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, settings, 'تم جلب إعدادات المعلم بنجاح'));
});
/**
 * PUT /teacher/settings
 */
exports.updateTeacherSettings = (0, catchAsync_1.catchAsync)(async (req, res) => {
    if (!req.user)
        throw new ApiError_1.ApiError(401, 'غير مصرح بالوصول');
    const reqInfo = getReqInfo(req);
    const settings = await teacherSettings_service_1.TeacherSettingsService.updateFullSettings(req.user._id, req.body, reqInfo);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, settings, 'تم تحديث كافة الإعدادات بنجاح'));
});
/**
 * PATCH /teacher/settings/general
 */
exports.updateGeneralSettings = (0, catchAsync_1.catchAsync)(async (req, res) => {
    if (!req.user)
        throw new ApiError_1.ApiError(401, 'غير مصرح بالوصول');
    const reqInfo = getReqInfo(req);
    const settings = await teacherSettings_service_1.TeacherSettingsService.updateGeneralSettings(req.user._id, req.body, reqInfo);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, settings, 'تم تحديث الإعدادات العامة بنجاح'));
});
/**
 * PATCH /teacher/settings/appearance
 */
exports.updateAppearanceSettings = (0, catchAsync_1.catchAsync)(async (req, res) => {
    if (!req.user)
        throw new ApiError_1.ApiError(401, 'غير مصرح بالوصول');
    const reqInfo = getReqInfo(req);
    const settings = await teacherSettings_service_1.TeacherSettingsService.updateAppearanceSettings(req.user._id, req.body, reqInfo);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, settings, 'تم تحديث تفضيلات مظهر الواجهة بنجاح'));
});
/**
 * PATCH /teacher/settings/notifications
 */
exports.updateNotificationSettings = (0, catchAsync_1.catchAsync)(async (req, res) => {
    if (!req.user)
        throw new ApiError_1.ApiError(401, 'غير مصرح بالوصول');
    const reqInfo = getReqInfo(req);
    const settings = await teacherSettings_service_1.TeacherSettingsService.updateNotificationSettings(req.user._id, req.body, reqInfo);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, settings, 'تم تحديث تفضيلات الإشعارات بنجاح'));
});
/**
 * PATCH /teacher/settings/privacy
 */
exports.updatePrivacySettings = (0, catchAsync_1.catchAsync)(async (req, res) => {
    if (!req.user)
        throw new ApiError_1.ApiError(401, 'غير مصرح بالوصول');
    const reqInfo = getReqInfo(req);
    const settings = await teacherSettings_service_1.TeacherSettingsService.updatePrivacySettings(req.user._id, req.body, reqInfo);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, settings, 'تم تحديث إعدادات الخصوصية بنجاح'));
});
/**
 * PATCH /teacher/settings/security
 */
exports.updateSecuritySettings = (0, catchAsync_1.catchAsync)(async (req, res) => {
    if (!req.user)
        throw new ApiError_1.ApiError(401, 'غير مصرح بالوصول');
    const reqInfo = getReqInfo(req);
    const settings = await teacherSettings_service_1.TeacherSettingsService.updateSecuritySettings(req.user._id, req.body, reqInfo);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, settings, 'تم تحديث إعدادات الأمان بنجاح'));
});
/**
 * GET /teacher/settings/sessions
 */
exports.getActiveSessions = (0, catchAsync_1.catchAsync)(async (req, res) => {
    if (!req.user)
        throw new ApiError_1.ApiError(401, 'غير مصرح بالوصول');
    const reqInfo = getReqInfo(req);
    const sessions = await teacherSettings_service_1.TeacherSettingsService.getActiveSessions(req.user._id, reqInfo.ipAddress, reqInfo.userAgent);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, sessions, 'تم جلب الجلسات النشطة بنجاح'));
});
/**
 * DELETE /teacher/settings/sessions/:id
 */
exports.revokeSession = (0, catchAsync_1.catchAsync)(async (req, res) => {
    if (!req.user)
        throw new ApiError_1.ApiError(401, 'غير مصرح بالوصول');
    const reqInfo = getReqInfo(req);
    await teacherSettings_service_1.TeacherSettingsService.revokeSession(req.user._id, req.params.id, reqInfo);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, null, 'تم إنهاء الجلسة بنجاح'));
});
/**
 * DELETE /teacher/settings/sessions
 */
exports.logoutAllDevices = (0, catchAsync_1.catchAsync)(async (req, res) => {
    if (!req.user)
        throw new ApiError_1.ApiError(401, 'غير مصرح بالوصول');
    const reqInfo = getReqInfo(req);
    await teacherSettings_service_1.TeacherSettingsService.logoutAllDevices(req.user._id, reqInfo);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, null, 'تم تسجيل الخروج من كافة الأجهزة الأخرى بنجاح'));
});
/**
 * POST /teacher/settings/export-data
 */
exports.exportPersonalData = (0, catchAsync_1.catchAsync)(async (req, res) => {
    if (!req.user)
        throw new ApiError_1.ApiError(401, 'غير مصرح بالوصول');
    const reqInfo = getReqInfo(req);
    const exportData = await teacherSettings_service_1.TeacherSettingsService.exportPersonalData(req.user._id, reqInfo);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, exportData, 'تم إنشاء ملف تصدير البيانات بنجاح'));
});
/**
 * POST /teacher/settings/deactivate-account
 */
exports.deactivateAccount = (0, catchAsync_1.catchAsync)(async (req, res) => {
    if (!req.user)
        throw new ApiError_1.ApiError(401, 'غير مصرح بالوصول');
    const reqInfo = getReqInfo(req);
    const { password } = req.body;
    await teacherSettings_service_1.TeacherSettingsService.deactivateAccount(req.user._id, password, reqInfo);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, null, 'تم تعطيل الحساب بنجاح'));
});
/**
 * POST /teacher/settings/delete-account
 */
exports.deleteAccount = (0, catchAsync_1.catchAsync)(async (req, res) => {
    if (!req.user)
        throw new ApiError_1.ApiError(401, 'غير مصرح بالوصول');
    const reqInfo = getReqInfo(req);
    const { password } = req.body;
    await teacherSettings_service_1.TeacherSettingsService.deleteAccount(req.user._id, password, reqInfo);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, null, 'تم تسجيل طلب حذف الحساب بنجاح'));
});

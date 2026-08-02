"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeacherSettingsService = void 0;
const mongoose_1 = require("mongoose");
const teacherSettings_model_1 = __importDefault(require("./teacherSettings.model"));
const teacherSession_model_1 = __importDefault(require("./teacherSession.model"));
const user_model_1 = __importDefault(require("../users/user.model"));
const teacherProfile_model_1 = __importDefault(require("../teachers/teacherProfile.model"));
const activityLog_model_1 = __importDefault(require("../activityLogs/activityLog.model"));
const ApiError_1 = require("../../utils/ApiError");
class TeacherSettingsService {
    /**
     * Helper to normalize userId to string / ObjectId
     */
    static parseUserId(userId) {
        if (!userId)
            return null;
        return typeof userId === 'string' ? new mongoose_1.Types.ObjectId(userId) : userId;
    }
    /**
     * Fetch or initialize default teacher settings
     */
    static async getOrCreateSettings(userIdInput) {
        const userId = this.parseUserId(userIdInput);
        let settings = await teacherSettings_model_1.default.findOne({ userId: userId });
        if (!settings) {
            settings = await teacherSettings_model_1.default.create({
                userId: userId,
                general: {},
                appearance: {},
                notifications: {},
                privacy: {},
                security: {},
            });
        }
        return settings;
    }
    /**
     * Update full teacher settings
     */
    static async updateFullSettings(userIdInput, data, reqInfo) {
        const userId = this.parseUserId(userIdInput);
        const settings = await this.getOrCreateSettings(userId);
        if (data.general)
            settings.general = { ...settings.general, ...data.general };
        if (data.appearance)
            settings.appearance = { ...settings.appearance, ...data.appearance };
        if (data.notifications)
            settings.notifications = { ...settings.notifications, ...data.notifications };
        if (data.privacy)
            settings.privacy = { ...settings.privacy, ...data.privacy };
        if (data.security) {
            const { currentPassword, newPassword, ...secFields } = data.security;
            settings.security = { ...settings.security, ...secFields };
        }
        await settings.save();
        // Audit log
        await activityLog_model_1.default.create({
            userId: userId,
            userName: reqInfo.userName,
            userRole: reqInfo.userRole || 'TEACHER',
            action: 'تحديث كافة إعدادات المعلم',
            category: 'Settings',
            module: 'TeacherSettings',
            status: 'SUCCESS',
            ipAddress: reqInfo.ipAddress,
            userAgent: reqInfo.userAgent,
        }).catch(() => { });
        return settings;
    }
    /**
     * Update General Settings
     */
    static async updateGeneralSettings(userIdInput, generalData, reqInfo) {
        const userId = this.parseUserId(userIdInput);
        const settings = await this.getOrCreateSettings(userId);
        settings.general = { ...settings.general, ...generalData };
        await settings.save();
        await activityLog_model_1.default.create({
            userId: userId,
            userName: reqInfo.userName,
            userRole: reqInfo.userRole || 'TEACHER',
            action: 'تحديث الإعدادات العامة',
            category: 'Settings',
            module: 'TeacherSettings',
            status: 'SUCCESS',
            ipAddress: reqInfo.ipAddress,
            userAgent: reqInfo.userAgent,
        }).catch(() => { });
        return settings;
    }
    /**
     * Update Appearance Settings
     */
    static async updateAppearanceSettings(userIdInput, appearanceData, reqInfo) {
        const userId = this.parseUserId(userIdInput);
        const settings = await this.getOrCreateSettings(userId);
        if (appearanceData.theme)
            settings.appearance.theme = appearanceData.theme;
        if (appearanceData.primaryColor)
            settings.appearance.primaryColor = appearanceData.primaryColor;
        if (appearanceData.sidebarPreferences) {
            settings.appearance.sidebarPreferences = {
                ...settings.appearance.sidebarPreferences,
                ...appearanceData.sidebarPreferences,
            };
        }
        if (appearanceData.tableDensity)
            settings.appearance.tableDensity = appearanceData.tableDensity;
        await settings.save();
        await activityLog_model_1.default.create({
            userId: userId,
            userName: reqInfo.userName,
            userRole: reqInfo.userRole || 'TEACHER',
            action: 'تحديث تفضيلات مظهر الواجهة',
            category: 'Settings',
            module: 'TeacherSettings',
            status: 'SUCCESS',
            ipAddress: reqInfo.ipAddress,
            userAgent: reqInfo.userAgent,
        }).catch(() => { });
        return settings;
    }
    /**
     * Update Notification Settings
     */
    static async updateNotificationSettings(userIdInput, notificationData, reqInfo) {
        const userId = this.parseUserId(userIdInput);
        const settings = await this.getOrCreateSettings(userId);
        settings.notifications = { ...settings.notifications, ...notificationData };
        await settings.save();
        await activityLog_model_1.default.create({
            userId: userId,
            userName: reqInfo.userName,
            userRole: reqInfo.userRole || 'TEACHER',
            action: 'تحديث تفضيلات الإشعارات',
            category: 'Settings',
            module: 'TeacherSettings',
            status: 'SUCCESS',
            ipAddress: reqInfo.ipAddress,
            userAgent: reqInfo.userAgent,
        }).catch(() => { });
        return settings;
    }
    /**
     * Update Privacy Settings
     */
    static async updatePrivacySettings(userIdInput, privacyData, reqInfo) {
        const userId = this.parseUserId(userIdInput);
        const settings = await this.getOrCreateSettings(userId);
        settings.privacy = { ...settings.privacy, ...privacyData };
        await settings.save();
        await activityLog_model_1.default.create({
            userId: userId,
            userName: reqInfo.userName,
            userRole: reqInfo.userRole || 'TEACHER',
            action: 'تحديث إعدادات الخصوصية',
            category: 'Settings',
            module: 'TeacherSettings',
            status: 'SUCCESS',
            ipAddress: reqInfo.ipAddress,
            userAgent: reqInfo.userAgent,
        }).catch(() => { });
        return settings;
    }
    /**
     * Update Security Settings & Change Password if requested
     */
    static async updateSecuritySettings(userIdInput, securityData, reqInfo) {
        const userId = this.parseUserId(userIdInput);
        const settings = await this.getOrCreateSettings(userId);
        const { currentPassword, newPassword, ...secFields } = securityData;
        if (newPassword) {
            if (!currentPassword) {
                throw new ApiError_1.ApiError(400, 'كلمة المرور الحالية مطلوبة لتحديث كلمة المرور');
            }
            const user = await user_model_1.default.findById(userId).select('+password');
            if (!user)
                throw new ApiError_1.ApiError(404, 'المستخدم غير موجود');
            const isMatch = await user.comparePassword(currentPassword);
            if (!isMatch)
                throw new ApiError_1.ApiError(400, 'كلمة المرور الحالية غير صحيحة');
            user.password = newPassword;
            await user.save();
            await activityLog_model_1.default.create({
                userId: userId,
                userName: reqInfo.userName,
                userRole: reqInfo.userRole || 'TEACHER',
                action: 'تحديث كلمة المرور بنجاح',
                category: 'Security',
                module: 'TeacherSettings',
                status: 'SUCCESS',
                ipAddress: reqInfo.ipAddress,
                userAgent: reqInfo.userAgent,
            }).catch(() => { });
        }
        if (Object.keys(secFields).length > 0) {
            settings.security = { ...settings.security, ...secFields };
            await settings.save();
        }
        return settings;
    }
    /**
     * Fetch active login sessions
     */
    static async getActiveSessions(userIdInput, currentIp, userAgent) {
        const userId = this.parseUserId(userIdInput);
        let sessions = await teacherSession_model_1.default.find({ userId: userId }).sort({ lastActive: -1 }).lean();
        // If no sessions present, create dummy current session for testing/dev
        if (sessions.length === 0) {
            const currentSession = await teacherSession_model_1.default.create({
                userId: userId,
                deviceName: userAgent?.includes('Windows')
                    ? 'Windows Browser (Chrome / Edge)'
                    : userAgent?.includes('Mac')
                        ? 'MacOS Safari'
                        : 'متصفح النظام',
                ipAddress: currentIp || '127.0.0.1',
                location: 'القاهرة، مصر',
                isCurrent: true,
                lastActive: new Date(),
            });
            sessions = [currentSession.toObject()];
        }
        return sessions.map((s) => ({
            id: s._id.toString(),
            deviceName: s.deviceName,
            ipAddress: s.ipAddress,
            location: s.location,
            isCurrent: Boolean(s.isCurrent || s.ipAddress === currentIp),
            lastActive: s.lastActive,
        }));
    }
    /**
     * Revoke a single login session
     */
    static async revokeSession(userIdInput, sessionId, reqInfo) {
        const userId = this.parseUserId(userIdInput);
        const session = await teacherSession_model_1.default.findOneAndDelete({ _id: new mongoose_1.Types.ObjectId(sessionId), userId: userId });
        if (!session) {
            throw new ApiError_1.ApiError(404, 'الجلسة غير موجودة أو تم إنهاؤها سابقاً');
        }
        await activityLog_model_1.default.create({
            userId: userId,
            userName: reqInfo.userName,
            userRole: reqInfo.userRole || 'TEACHER',
            action: `إنهاء الجلسة (${session.deviceName})`,
            category: 'Security',
            module: 'TeacherSettings',
            status: 'SUCCESS',
            ipAddress: reqInfo.ipAddress,
            userAgent: reqInfo.userAgent,
        }).catch(() => { });
        return true;
    }
    /**
     * Logout all devices except current
     */
    static async logoutAllDevices(userIdInput, reqInfo) {
        const userId = this.parseUserId(userIdInput);
        await teacherSession_model_1.default.deleteMany({ userId: userId });
        // Create current active session afresh
        await teacherSession_model_1.default.create({
            userId: userId,
            deviceName: reqInfo.userAgent?.includes('Windows')
                ? 'Windows Browser'
                : 'الجهاز الحالي',
            ipAddress: reqInfo.ipAddress || '127.0.0.1',
            location: 'القاهرة، مصر',
            isCurrent: true,
            lastActive: new Date(),
        });
        await activityLog_model_1.default.create({
            userId: userId,
            userName: reqInfo.userName,
            userRole: reqInfo.userRole || 'TEACHER',
            action: 'تسجيل الخروج من كافة الأجهزة والجلسات الأخرى',
            category: 'Security',
            module: 'TeacherSettings',
            status: 'SUCCESS',
            ipAddress: reqInfo.ipAddress,
            userAgent: reqInfo.userAgent,
        }).catch(() => { });
        return true;
    }
    /**
     * Export Personal Data (GDPR Ready)
     */
    static async exportPersonalData(userIdInput, reqInfo) {
        const userId = this.parseUserId(userIdInput);
        const user = await user_model_1.default.findById(userId).lean();
        if (!user)
            throw new ApiError_1.ApiError(404, 'المستخدم غير موجود');
        const profile = await teacherProfile_model_1.default.findOne({ userId: userId }).lean();
        const settings = await teacherSettings_model_1.default.findOne({ userId: userId }).lean();
        const activityLogs = await activityLog_model_1.default.find({ userId: userId }).sort({ createdAt: -1 }).limit(100).lean();
        await activityLog_model_1.default.create({
            userId: userId,
            userName: reqInfo.userName,
            userRole: reqInfo.userRole || 'TEACHER',
            action: 'تصدير البيانات الشخصية (GDPR Export)',
            category: 'Settings',
            module: 'TeacherSettings',
            status: 'SUCCESS',
            ipAddress: reqInfo.ipAddress,
            userAgent: reqInfo.userAgent,
        }).catch(() => { });
        return {
            exportTimestamp: new Date().toISOString(),
            account: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
                email: user.email,
                phone: user.phone,
                role: user.role,
                isVerified: user.isVerified,
                createdAt: user.createdAt,
            },
            profile: profile || null,
            settings: settings || null,
            recentLogs: activityLogs.map((log) => ({
                action: log.action,
                category: log.category,
                timestamp: log.createdAt,
                ipAddress: log.ipAddress,
            })),
        };
    }
    /**
     * Deactivate Account
     */
    static async deactivateAccount(userIdInput, password, reqInfo) {
        const userId = this.parseUserId(userIdInput);
        const user = await user_model_1.default.findById(userId).select('+password');
        if (!user)
            throw new ApiError_1.ApiError(404, 'المستخدم غير موجود');
        const isMatch = await user.comparePassword(password);
        if (!isMatch)
            throw new ApiError_1.ApiError(400, 'كلمة المرور التأكيدية غير صحيحة');
        user.isBlocked = true;
        await user.save();
        await activityLog_model_1.default.create({
            userId: userId,
            userName: reqInfo.userName,
            userRole: reqInfo.userRole || 'TEACHER',
            action: 'تعطيل حساب المعلم مؤقتاً',
            category: 'Security',
            module: 'TeacherSettings',
            status: 'WARNING',
            ipAddress: reqInfo.ipAddress,
            userAgent: reqInfo.userAgent,
        }).catch(() => { });
        return true;
    }
    /**
     * Request Account Deletion
     */
    static async deleteAccount(userIdInput, password, reqInfo) {
        const userId = this.parseUserId(userIdInput);
        const user = await user_model_1.default.findById(userId).select('+password');
        if (!user)
            throw new ApiError_1.ApiError(404, 'المستخدم غير موجود');
        const isMatch = await user.comparePassword(password);
        if (!isMatch)
            throw new ApiError_1.ApiError(400, 'كلمة المرور التأكيدية غير صحيحة');
        user.deletedAt = new Date();
        await user.save();
        await activityLog_model_1.default.create({
            userId: userId,
            userName: reqInfo.userName,
            userRole: reqInfo.userRole || 'TEACHER',
            action: 'طلب حذف حساب المعلم نهائياً',
            category: 'Security',
            module: 'TeacherSettings',
            status: 'WARNING',
            ipAddress: reqInfo.ipAddress,
            userAgent: reqInfo.userAgent,
        }).catch(() => { });
        return true;
    }
}
exports.TeacherSettingsService = TeacherSettingsService;

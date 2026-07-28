import { Types } from 'mongoose';
import TeacherSettings from './teacherSettings.model';
import TeacherSession from './teacherSession.model';
import User from '../users/user.model';
import TeacherProfile from '../teachers/teacherProfile.model';
import ActivityLog from '../activityLogs/activityLog.model';
import { ApiError } from '../../utils/ApiError';
import { ITeacherSettingsDocument } from './teacherSettings.interface';

interface IReqInfo {
  ipAddress?: string;
  userAgent?: string;
  userName?: string;
  userRole?: string;
}

export class TeacherSettingsService {
  /**
   * Helper to normalize userId to string / ObjectId
   */
  private static parseUserId(userId: any): any {
    if (!userId) return null;
    return typeof userId === 'string' ? new Types.ObjectId(userId) : userId;
  }

  /**
   * Fetch or initialize default teacher settings
   */
  static async getOrCreateSettings(userIdInput: any): Promise<ITeacherSettingsDocument> {
    const userId = this.parseUserId(userIdInput);
    let settings = await TeacherSettings.findOne({ userId: userId as any });
    if (!settings) {
      settings = await TeacherSettings.create({
        userId: userId as any,
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
  static async updateFullSettings(
    userIdInput: any,
    data: any,
    reqInfo: IReqInfo
  ): Promise<ITeacherSettingsDocument> {
    const userId = this.parseUserId(userIdInput);
    const settings = await this.getOrCreateSettings(userId);

    if (data.general) settings.general = { ...settings.general, ...data.general };
    if (data.appearance) settings.appearance = { ...settings.appearance, ...data.appearance };
    if (data.notifications) settings.notifications = { ...settings.notifications, ...data.notifications };
    if (data.privacy) settings.privacy = { ...settings.privacy, ...data.privacy };
    if (data.security) {
      const { currentPassword, newPassword, ...secFields } = data.security;
      settings.security = { ...settings.security, ...secFields };
    }

    await settings.save();

    // Audit log
    await ActivityLog.create({
      userId: userId as any,
      userName: reqInfo.userName,
      userRole: reqInfo.userRole || 'TEACHER',
      action: 'تحديث كافة إعدادات المعلم',
      category: 'Settings',
      module: 'TeacherSettings',
      status: 'SUCCESS',
      ipAddress: reqInfo.ipAddress,
      userAgent: reqInfo.userAgent,
    } as any).catch(() => {});

    return settings;
  }

  /**
   * Update General Settings
   */
  static async updateGeneralSettings(
    userIdInput: any,
    generalData: any,
    reqInfo: IReqInfo
  ): Promise<ITeacherSettingsDocument> {
    const userId = this.parseUserId(userIdInput);
    const settings = await this.getOrCreateSettings(userId);
    settings.general = { ...settings.general, ...generalData };
    await settings.save();

    await ActivityLog.create({
      userId: userId as any,
      userName: reqInfo.userName,
      userRole: reqInfo.userRole || 'TEACHER',
      action: 'تحديث الإعدادات العامة',
      category: 'Settings',
      module: 'TeacherSettings',
      status: 'SUCCESS',
      ipAddress: reqInfo.ipAddress,
      userAgent: reqInfo.userAgent,
    } as any).catch(() => {});

    return settings;
  }

  /**
   * Update Appearance Settings
   */
  static async updateAppearanceSettings(
    userIdInput: any,
    appearanceData: any,
    reqInfo: IReqInfo
  ): Promise<ITeacherSettingsDocument> {
    const userId = this.parseUserId(userIdInput);
    const settings = await this.getOrCreateSettings(userId);
    if (appearanceData.theme) settings.appearance.theme = appearanceData.theme;
    if (appearanceData.primaryColor) settings.appearance.primaryColor = appearanceData.primaryColor;
    if (appearanceData.sidebarPreferences) {
      settings.appearance.sidebarPreferences = {
        ...settings.appearance.sidebarPreferences,
        ...appearanceData.sidebarPreferences,
      };
    }
    if (appearanceData.tableDensity) settings.appearance.tableDensity = appearanceData.tableDensity;
    await settings.save();

    await ActivityLog.create({
      userId: userId as any,
      userName: reqInfo.userName,
      userRole: reqInfo.userRole || 'TEACHER',
      action: 'تحديث تفضيلات مظهر الواجهة',
      category: 'Settings',
      module: 'TeacherSettings',
      status: 'SUCCESS',
      ipAddress: reqInfo.ipAddress,
      userAgent: reqInfo.userAgent,
    } as any).catch(() => {});

    return settings;
  }

  /**
   * Update Notification Settings
   */
  static async updateNotificationSettings(
    userIdInput: any,
    notificationData: any,
    reqInfo: IReqInfo
  ): Promise<ITeacherSettingsDocument> {
    const userId = this.parseUserId(userIdInput);
    const settings = await this.getOrCreateSettings(userId);
    settings.notifications = { ...settings.notifications, ...notificationData };
    await settings.save();

    await ActivityLog.create({
      userId: userId as any,
      userName: reqInfo.userName,
      userRole: reqInfo.userRole || 'TEACHER',
      action: 'تحديث تفضيلات الإشعارات',
      category: 'Settings',
      module: 'TeacherSettings',
      status: 'SUCCESS',
      ipAddress: reqInfo.ipAddress,
      userAgent: reqInfo.userAgent,
    } as any).catch(() => {});

    return settings;
  }

  /**
   * Update Privacy Settings
   */
  static async updatePrivacySettings(
    userIdInput: any,
    privacyData: any,
    reqInfo: IReqInfo
  ): Promise<ITeacherSettingsDocument> {
    const userId = this.parseUserId(userIdInput);
    const settings = await this.getOrCreateSettings(userId);
    settings.privacy = { ...settings.privacy, ...privacyData };
    await settings.save();

    await ActivityLog.create({
      userId: userId as any,
      userName: reqInfo.userName,
      userRole: reqInfo.userRole || 'TEACHER',
      action: 'تحديث إعدادات الخصوصية',
      category: 'Settings',
      module: 'TeacherSettings',
      status: 'SUCCESS',
      ipAddress: reqInfo.ipAddress,
      userAgent: reqInfo.userAgent,
    } as any).catch(() => {});

    return settings;
  }

  /**
   * Update Security Settings & Change Password if requested
   */
  static async updateSecuritySettings(
    userIdInput: any,
    securityData: any,
    reqInfo: IReqInfo
  ): Promise<ITeacherSettingsDocument> {
    const userId = this.parseUserId(userIdInput);
    const settings = await this.getOrCreateSettings(userId);
    const { currentPassword, newPassword, ...secFields } = securityData;

    if (newPassword) {
      if (!currentPassword) {
        throw new ApiError(400, 'كلمة المرور الحالية مطلوبة لتحديث كلمة المرور');
      }
      const user = await User.findById(userId).select('+password');
      if (!user) throw new ApiError(404, 'المستخدم غير موجود');

      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) throw new ApiError(400, 'كلمة المرور الحالية غير صحيحة');

      user.password = newPassword;
      await user.save();

      await ActivityLog.create({
        userId: userId as any,
        userName: reqInfo.userName,
        userRole: reqInfo.userRole || 'TEACHER',
        action: 'تحديث كلمة المرور بنجاح',
        category: 'Security',
        module: 'TeacherSettings',
        status: 'SUCCESS',
        ipAddress: reqInfo.ipAddress,
        userAgent: reqInfo.userAgent,
      } as any).catch(() => {});
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
  static async getActiveSessions(userIdInput: any, currentIp?: string, userAgent?: string) {
    const userId = this.parseUserId(userIdInput);
    let sessions = await TeacherSession.find({ userId: userId as any }).sort({ lastActive: -1 }).lean();

    // If no sessions present, create dummy current session for testing/dev
    if (sessions.length === 0) {
      const currentSession = await TeacherSession.create({
        userId: userId as any,
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
      sessions = [currentSession.toObject() as any];
    }

    return sessions.map((s: any) => ({
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
  static async revokeSession(userIdInput: any, sessionId: string, reqInfo: IReqInfo) {
    const userId = this.parseUserId(userIdInput);
    const session = await TeacherSession.findOneAndDelete({ _id: new Types.ObjectId(sessionId), userId: userId as any });
    if (!session) {
      throw new ApiError(404, 'الجلسة غير موجودة أو تم إنهاؤها سابقاً');
    }

    await ActivityLog.create({
      userId: userId as any,
      userName: reqInfo.userName,
      userRole: reqInfo.userRole || 'TEACHER',
      action: `إنهاء الجلسة (${session.deviceName})`,
      category: 'Security',
      module: 'TeacherSettings',
      status: 'SUCCESS',
      ipAddress: reqInfo.ipAddress,
      userAgent: reqInfo.userAgent,
    } as any).catch(() => {});

    return true;
  }

  /**
   * Logout all devices except current
   */
  static async logoutAllDevices(userIdInput: any, reqInfo: IReqInfo) {
    const userId = this.parseUserId(userIdInput);
    await TeacherSession.deleteMany({ userId: userId as any });

    // Create current active session afresh
    await TeacherSession.create({
      userId: userId as any,
      deviceName: reqInfo.userAgent?.includes('Windows')
        ? 'Windows Browser'
        : 'الجهاز الحالي',
      ipAddress: reqInfo.ipAddress || '127.0.0.1',
      location: 'القاهرة، مصر',
      isCurrent: true,
      lastActive: new Date(),
    });

    await ActivityLog.create({
      userId: userId as any,
      userName: reqInfo.userName,
      userRole: reqInfo.userRole || 'TEACHER',
      action: 'تسجيل الخروج من كافة الأجهزة والجلسات الأخرى',
      category: 'Security',
      module: 'TeacherSettings',
      status: 'SUCCESS',
      ipAddress: reqInfo.ipAddress,
      userAgent: reqInfo.userAgent,
    } as any).catch(() => {});

    return true;
  }

  /**
   * Export Personal Data (GDPR Ready)
   */
  static async exportPersonalData(userIdInput: any, reqInfo: IReqInfo) {
    const userId = this.parseUserId(userIdInput);
    const user = await User.findById(userId).lean();
    if (!user) throw new ApiError(404, 'المستخدم غير موجود');

    const profile = await TeacherProfile.findOne({ userId: userId as any }).lean();
    const settings = await TeacherSettings.findOne({ userId: userId as any }).lean();
    const activityLogs = await ActivityLog.find({ userId: userId as any }).sort({ createdAt: -1 }).limit(100).lean();

    await ActivityLog.create({
      userId: userId as any,
      userName: reqInfo.userName,
      userRole: reqInfo.userRole || 'TEACHER',
      action: 'تصدير البيانات الشخصية (GDPR Export)',
      category: 'Settings',
      module: 'TeacherSettings',
      status: 'SUCCESS',
      ipAddress: reqInfo.ipAddress,
      userAgent: reqInfo.userAgent,
    } as any).catch(() => {});

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
      recentLogs: activityLogs.map((log: any) => ({
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
  static async deactivateAccount(userIdInput: any, password: string, reqInfo: IReqInfo) {
    const userId = this.parseUserId(userIdInput);
    const user = await User.findById(userId).select('+password');
    if (!user) throw new ApiError(404, 'المستخدم غير موجود');

    const isMatch = await user.comparePassword(password);
    if (!isMatch) throw new ApiError(400, 'كلمة المرور التأكيدية غير صحيحة');

    user.isBlocked = true;
    await user.save();

    await ActivityLog.create({
      userId: userId as any,
      userName: reqInfo.userName,
      userRole: reqInfo.userRole || 'TEACHER',
      action: 'تعطيل حساب المعلم مؤقتاً',
      category: 'Security',
      module: 'TeacherSettings',
      status: 'WARNING',
      ipAddress: reqInfo.ipAddress,
      userAgent: reqInfo.userAgent,
    } as any).catch(() => {});

    return true;
  }

  /**
   * Request Account Deletion
   */
  static async deleteAccount(userIdInput: any, password: string, reqInfo: IReqInfo) {
    const userId = this.parseUserId(userIdInput);
    const user = await User.findById(userId).select('+password');
    if (!user) throw new ApiError(404, 'المستخدم غير موجود');

    const isMatch = await user.comparePassword(password);
    if (!isMatch) throw new ApiError(400, 'كلمة المرور التأكيدية غير صحيحة');

    user.deletedAt = new Date();
    await user.save();

    await ActivityLog.create({
      userId: userId as any,
      userName: reqInfo.userName,
      userRole: reqInfo.userRole || 'TEACHER',
      action: 'طلب حذف حساب المعلم نهائياً',
      category: 'Security',
      module: 'TeacherSettings',
      status: 'WARNING',
      ipAddress: reqInfo.ipAddress,
      userAgent: reqInfo.userAgent,
    } as any).catch(() => {});

    return true;
  }
}

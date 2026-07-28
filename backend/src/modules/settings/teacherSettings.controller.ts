import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { ApiResponse } from '../../utils/ApiResponse';
import { ApiError } from '../../utils/ApiError';
import { TeacherSettingsService } from './teacherSettings.service';

const getReqInfo = (req: Request) => {
  const forwarded = req.headers['x-forwarded-for'];
  const rawIp = Array.isArray(forwarded) ? forwarded[0] : forwarded;
  return {
    ipAddress: rawIp || req.socket.remoteAddress || '127.0.0.1',
    userAgent: (req.headers['user-agent'] as string) || 'Unknown Agent',
    userName: req.user ? `${req.user.firstName} ${req.user.lastName}` : undefined,
    userRole: req.user?.role,
  };
};

/**
 * GET /teacher/settings
 */
export const getTeacherSettings = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) throw new ApiError(401, 'غير مصرح بالوصول');
  const settings = await TeacherSettingsService.getOrCreateSettings(req.user._id);
  res.status(200).json(new ApiResponse(200, settings, 'تم جلب إعدادات المعلم بنجاح'));
});

/**
 * PUT /teacher/settings
 */
export const updateTeacherSettings = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) throw new ApiError(401, 'غير مصرح بالوصول');
  const reqInfo = getReqInfo(req);
  const settings = await TeacherSettingsService.updateFullSettings(req.user._id, req.body, reqInfo);
  res.status(200).json(new ApiResponse(200, settings, 'تم تحديث كافة الإعدادات بنجاح'));
});

/**
 * PATCH /teacher/settings/general
 */
export const updateGeneralSettings = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) throw new ApiError(401, 'غير مصرح بالوصول');
  const reqInfo = getReqInfo(req);
  const settings = await TeacherSettingsService.updateGeneralSettings(req.user._id, req.body, reqInfo);
  res.status(200).json(new ApiResponse(200, settings, 'تم تحديث الإعدادات العامة بنجاح'));
});

/**
 * PATCH /teacher/settings/appearance
 */
export const updateAppearanceSettings = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) throw new ApiError(401, 'غير مصرح بالوصول');
  const reqInfo = getReqInfo(req);
  const settings = await TeacherSettingsService.updateAppearanceSettings(req.user._id, req.body, reqInfo);
  res.status(200).json(new ApiResponse(200, settings, 'تم تحديث تفضيلات مظهر الواجهة بنجاح'));
});

/**
 * PATCH /teacher/settings/notifications
 */
export const updateNotificationSettings = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) throw new ApiError(401, 'غير مصرح بالوصول');
  const reqInfo = getReqInfo(req);
  const settings = await TeacherSettingsService.updateNotificationSettings(req.user._id, req.body, reqInfo);
  res.status(200).json(new ApiResponse(200, settings, 'تم تحديث تفضيلات الإشعارات بنجاح'));
});

/**
 * PATCH /teacher/settings/privacy
 */
export const updatePrivacySettings = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) throw new ApiError(401, 'غير مصرح بالوصول');
  const reqInfo = getReqInfo(req);
  const settings = await TeacherSettingsService.updatePrivacySettings(req.user._id, req.body, reqInfo);
  res.status(200).json(new ApiResponse(200, settings, 'تم تحديث إعدادات الخصوصية بنجاح'));
});

/**
 * PATCH /teacher/settings/security
 */
export const updateSecuritySettings = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) throw new ApiError(401, 'غير مصرح بالوصول');
  const reqInfo = getReqInfo(req);
  const settings = await TeacherSettingsService.updateSecuritySettings(req.user._id, req.body, reqInfo);
  res.status(200).json(new ApiResponse(200, settings, 'تم تحديث إعدادات الأمان بنجاح'));
});

/**
 * GET /teacher/settings/sessions
 */
export const getActiveSessions = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) throw new ApiError(401, 'غير مصرح بالوصول');
  const reqInfo = getReqInfo(req);
  const sessions = await TeacherSettingsService.getActiveSessions(req.user._id, reqInfo.ipAddress, reqInfo.userAgent);
  res.status(200).json(new ApiResponse(200, sessions, 'تم جلب الجلسات النشطة بنجاح'));
});

/**
 * DELETE /teacher/settings/sessions/:id
 */
export const revokeSession = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) throw new ApiError(401, 'غير مصرح بالوصول');
  const reqInfo = getReqInfo(req);
  await TeacherSettingsService.revokeSession(req.user._id, req.params.id as string, reqInfo);
  res.status(200).json(new ApiResponse(200, null, 'تم إنهاء الجلسة بنجاح'));
});

/**
 * DELETE /teacher/settings/sessions
 */
export const logoutAllDevices = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) throw new ApiError(401, 'غير مصرح بالوصول');
  const reqInfo = getReqInfo(req);
  await TeacherSettingsService.logoutAllDevices(req.user._id, reqInfo);
  res.status(200).json(new ApiResponse(200, null, 'تم تسجيل الخروج من كافة الأجهزة الأخرى بنجاح'));
});

/**
 * POST /teacher/settings/export-data
 */
export const exportPersonalData = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) throw new ApiError(401, 'غير مصرح بالوصول');
  const reqInfo = getReqInfo(req);
  const exportData = await TeacherSettingsService.exportPersonalData(req.user._id, reqInfo);
  res.status(200).json(new ApiResponse(200, exportData, 'تم إنشاء ملف تصدير البيانات بنجاح'));
});

/**
 * POST /teacher/settings/deactivate-account
 */
export const deactivateAccount = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) throw new ApiError(401, 'غير مصرح بالوصول');
  const reqInfo = getReqInfo(req);
  const { password } = req.body;
  await TeacherSettingsService.deactivateAccount(req.user._id, password, reqInfo);
  res.status(200).json(new ApiResponse(200, null, 'تم تعطيل الحساب بنجاح'));
});

/**
 * POST /teacher/settings/delete-account
 */
export const deleteAccount = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) throw new ApiError(401, 'غير مصرح بالوصول');
  const reqInfo = getReqInfo(req);
  const { password } = req.body;
  await TeacherSettingsService.deleteAccount(req.user._id, password, reqInfo);
  res.status(200).json(new ApiResponse(200, null, 'تم تسجيل طلب حذف الحساب بنجاح'));
});

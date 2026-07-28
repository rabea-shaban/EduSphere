import { Request, Response } from 'express';
import { ApiResponse } from '../../utils/ApiResponse';
import { catchAsync } from '../../utils/catchAsync';
import { ActivityLog } from '../activityLogs/activityLog.model';
import { Types } from 'mongoose';
import ProfileService from './services/profile.service';
import MediaService from './services/media.service';
import AccountSecurityService from './services/accountSecurity.service';
import ProfileCompletionService from './services/profileCompletion.service';
import ProfileAnalyticsService from './services/profileAnalytics.service';
import { User } from '../users/user.model';
import { TeacherProfile } from './teacherProfile.model';

async function logActivity(userId: string, userName: string, userRole: string, action: string, details?: object): Promise<void> {
  await ActivityLog.create({
    userId: new Types.ObjectId(userId) as any,
    userName,
    userRole,
    action,
    category: 'Admin',
    module: 'Profile',
    status: 'SUCCESS',
    details,
  }).catch(() => {});
}

/**
 * GET /teacher/profile
 */
export const getTeacherProfile = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const userId = req.user!._id.toString();

  const profileData = await ProfileService.getFullProfile(userId);

  res.status(200).json(new ApiResponse(200, profileData, 'Teacher profile retrieved successfully'));
});

/**
 * PUT /teacher/profile
 */
export const updateTeacherProfile = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const userId = req.user!._id.toString();
  const userRole = req.user!.role;
  const userName = `${req.user!.firstName || ''} ${req.user!.lastName || ''}`.trim() || req.user!.email;

  const profileData = await ProfileService.updateProfile(userId, req.body);

  await logActivity(userId, userName, userRole, 'PROFILE_UPDATED');

  res.status(200).json(new ApiResponse(200, profileData, 'تم تحديث بيانات الملف الشخصي بنجاح 🎉'));
});

/**
 * PATCH /teacher/profile/avatar
 */
export const updateTeacherAvatar = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const userId = req.user!._id.toString();
  const userRole = req.user!.role;
  const userName = `${req.user!.firstName || ''} ${req.user!.lastName || ''}`.trim() || req.user!.email;

  const { avatar } = req.body;

  const newAvatarUrl = await MediaService.updateAvatar(userId, avatar);

  await logActivity(userId, userName, userRole, 'AVATAR_CHANGED');

  res.status(200).json(new ApiResponse(200, { avatar: newAvatarUrl }, 'تم تحديث الصورة الشخصية بنجاح'));
});

/**
 * DELETE /teacher/profile/avatar
 */
export const deleteTeacherAvatar = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const userId = req.user!._id.toString();

  const defaultAvatarUrl = await MediaService.deleteAvatar(userId);

  res.status(200).json(new ApiResponse(200, { avatar: defaultAvatarUrl }, 'تم حذف الصورة الشخصية واستعادة الصورة الافتراضية'));
});

/**
 * PATCH /teacher/profile/cover
 */
export const updateTeacherCover = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const userId = req.user!._id.toString();
  const userRole = req.user!.role;
  const userName = `${req.user!.firstName || ''} ${req.user!.lastName || ''}`.trim() || req.user!.email;

  const { coverImage } = req.body;

  const newCoverUrl = await MediaService.updateCover(userId, coverImage);

  await logActivity(userId, userName, userRole, 'COVER_CHANGED');

  res.status(200).json(new ApiResponse(200, { coverImage: newCoverUrl }, 'تم تحديث صورة الغلاف بنجاح'));
});

/**
 * DELETE /teacher/profile/cover
 */
export const deleteTeacherCover = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const userId = req.user!._id.toString();

  const defaultCoverUrl = await MediaService.deleteCover(userId);

  res.status(200).json(new ApiResponse(200, { coverImage: defaultCoverUrl }, 'تم حذف صورة الغلاف'));
});

/**
 * PATCH /teacher/profile/password
 */
export const changeTeacherPassword = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const userId = req.user!._id.toString();
  const userRole = req.user!.role;
  const userName = `${req.user!.firstName || ''} ${req.user!.lastName || ''}`.trim() || req.user!.email;

  const { currentPassword, newPassword } = req.body;

  await AccountSecurityService.changePassword(userId, currentPassword, newPassword);

  await logActivity(userId, userName, userRole, 'PASSWORD_CHANGED');

  res.status(200).json(new ApiResponse(200, null, 'تم تغيير كلمة المرور بنجاح 🔒'));
});

/**
 * PATCH /teacher/profile/email
 */
export const updateTeacherEmail = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const userId = req.user!._id.toString();
  const userRole = req.user!.role;
  const userName = `${req.user!.firstName || ''} ${req.user!.lastName || ''}`.trim() || req.user!.email;

  const { email } = req.body;

  const newEmail = await AccountSecurityService.updateEmail(userId, email);

  await logActivity(userId, userName, userRole, 'EMAIL_CHANGED', { email: newEmail });

  res.status(200).json(new ApiResponse(200, { email: newEmail }, 'تم تحديث البريد الإلكتروني بنجاح'));
});

/**
 * GET /teacher/profile/completeness
 */
export const getTeacherProfileCompleteness = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const userId = req.user!._id.toString();

  const user = await User.findById(userId).lean();
  const profile = await TeacherProfile.findOne({ userId: new Types.ObjectId(userId) }).lean();

  const completeness = ProfileCompletionService.calculate(user, profile);

  res.status(200).json(new ApiResponse(200, completeness, 'Profile completeness calculated successfully'));
});

/**
 * GET /teacher/profile/analytics
 */
export const getTeacherProfileAnalytics = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const userId = req.user!._id.toString();

  const analytics = await ProfileAnalyticsService.getAnalytics(userId);

  res.status(200).json(new ApiResponse(200, analytics, 'Profile analytics retrieved successfully'));
});

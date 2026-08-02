"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTeacherProfileAnalytics = exports.getTeacherProfileCompleteness = exports.updateTeacherEmail = exports.changeTeacherPassword = exports.deleteTeacherCover = exports.updateTeacherCover = exports.deleteTeacherAvatar = exports.updateTeacherAvatar = exports.updateTeacherProfile = exports.getTeacherProfile = void 0;
const ApiResponse_1 = require("../../utils/ApiResponse");
const catchAsync_1 = require("../../utils/catchAsync");
const activityLog_model_1 = require("../activityLogs/activityLog.model");
const mongoose_1 = require("mongoose");
const profile_service_1 = __importDefault(require("./services/profile.service"));
const media_service_1 = __importDefault(require("./services/media.service"));
const accountSecurity_service_1 = __importDefault(require("./services/accountSecurity.service"));
const profileCompletion_service_1 = __importDefault(require("./services/profileCompletion.service"));
const profileAnalytics_service_1 = __importDefault(require("./services/profileAnalytics.service"));
const user_model_1 = require("../users/user.model");
const teacherProfile_model_1 = require("./teacherProfile.model");
function logActivity(userId, userName, userRole, action, details) {
    activityLog_model_1.ActivityLog.create({
        userId: new mongoose_1.Types.ObjectId(userId),
        userName,
        userRole,
        action,
        category: 'Admin',
        module: 'Profile',
        status: 'SUCCESS',
        details,
    }).catch(() => { });
}
/**
 * GET /teacher/profile
 */
exports.getTeacherProfile = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const userId = req.user._id.toString();
    const profileData = await profile_service_1.default.getFullProfile(userId);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, profileData, 'Teacher profile retrieved successfully'));
});
/**
 * PUT /teacher/profile
 */
exports.updateTeacherProfile = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const userId = req.user._id.toString();
    const userRole = req.user.role;
    const userName = `${req.user.firstName || ''} ${req.user.lastName || ''}`.trim() || req.user.email;
    const profileData = await profile_service_1.default.updateProfile(userId, req.body);
    await logActivity(userId, userName, userRole, 'PROFILE_UPDATED');
    res.status(200).json(new ApiResponse_1.ApiResponse(200, profileData, 'تم تحديث بيانات الملف الشخصي بنجاح 🎉'));
});
/**
 * PATCH /teacher/profile/avatar
 */
exports.updateTeacherAvatar = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const userId = req.user._id.toString();
    const userRole = req.user.role;
    const userName = `${req.user.firstName || ''} ${req.user.lastName || ''}`.trim() || req.user.email;
    const { avatar } = req.body;
    const newAvatarUrl = await media_service_1.default.updateAvatar(userId, avatar);
    await logActivity(userId, userName, userRole, 'AVATAR_CHANGED');
    res.status(200).json(new ApiResponse_1.ApiResponse(200, { avatar: newAvatarUrl }, 'تم تحديث الصورة الشخصية بنجاح'));
});
/**
 * DELETE /teacher/profile/avatar
 */
exports.deleteTeacherAvatar = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const userId = req.user._id.toString();
    const defaultAvatarUrl = await media_service_1.default.deleteAvatar(userId);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, { avatar: defaultAvatarUrl }, 'تم حذف الصورة الشخصية واستعادة الصورة الافتراضية'));
});
/**
 * PATCH /teacher/profile/cover
 */
exports.updateTeacherCover = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const userId = req.user._id.toString();
    const userRole = req.user.role;
    const userName = `${req.user.firstName || ''} ${req.user.lastName || ''}`.trim() || req.user.email;
    const { coverImage } = req.body;
    const newCoverUrl = await media_service_1.default.updateCover(userId, coverImage);
    await logActivity(userId, userName, userRole, 'COVER_CHANGED');
    res.status(200).json(new ApiResponse_1.ApiResponse(200, { coverImage: newCoverUrl }, 'تم تحديث صورة الغلاف بنجاح'));
});
/**
 * DELETE /teacher/profile/cover
 */
exports.deleteTeacherCover = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const userId = req.user._id.toString();
    const defaultCoverUrl = await media_service_1.default.deleteCover(userId);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, { coverImage: defaultCoverUrl }, 'تم حذف صورة الغلاف'));
});
/**
 * PATCH /teacher/profile/password
 */
exports.changeTeacherPassword = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const userId = req.user._id.toString();
    const userRole = req.user.role;
    const userName = `${req.user.firstName || ''} ${req.user.lastName || ''}`.trim() || req.user.email;
    const { currentPassword, newPassword } = req.body;
    await accountSecurity_service_1.default.changePassword(userId, currentPassword, newPassword);
    await logActivity(userId, userName, userRole, 'PASSWORD_CHANGED');
    res.status(200).json(new ApiResponse_1.ApiResponse(200, null, 'تم تغيير كلمة المرور بنجاح 🔒'));
});
/**
 * PATCH /teacher/profile/email
 */
exports.updateTeacherEmail = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const userId = req.user._id.toString();
    const userRole = req.user.role;
    const userName = `${req.user.firstName || ''} ${req.user.lastName || ''}`.trim() || req.user.email;
    const { email } = req.body;
    const newEmail = await accountSecurity_service_1.default.updateEmail(userId, email);
    await logActivity(userId, userName, userRole, 'EMAIL_CHANGED', { email: newEmail });
    res.status(200).json(new ApiResponse_1.ApiResponse(200, { email: newEmail }, 'تم تحديث البريد الإلكتروني بنجاح'));
});
/**
 * GET /teacher/profile/completeness
 */
exports.getTeacherProfileCompleteness = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const userId = req.user._id.toString();
    const user = await user_model_1.User.findById(userId).lean();
    const profile = await teacherProfile_model_1.TeacherProfile.findOne({ userId: new mongoose_1.Types.ObjectId(userId) }).lean();
    const completeness = profileCompletion_service_1.default.calculate(user, profile);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, completeness, 'Profile completeness calculated successfully'));
});
/**
 * GET /teacher/profile/analytics
 */
exports.getTeacherProfileAnalytics = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const userId = req.user._id.toString();
    const analytics = await profileAnalytics_service_1.default.getAnalytics(userId);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, analytics, 'Profile analytics retrieved successfully'));
});

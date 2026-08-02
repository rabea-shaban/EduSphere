"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaService = void 0;
const mongoose_1 = require("mongoose");
const user_model_1 = require("../../users/user.model");
const teacherProfile_model_1 = require("../teacherProfile.model");
const ApiError_1 = require("../../../utils/ApiError");
class MediaService {
    /**
     * Updates user avatar URL.
     */
    static async updateAvatar(userId, avatarUrl) {
        if (!avatarUrl || !avatarUrl.trim()) {
            throw new ApiError_1.ApiError(400, 'رابط الصورة الشخصية غير صحيح');
        }
        const user = await user_model_1.User.findById(userId);
        if (!user) {
            throw new ApiError_1.ApiError(404, 'User not found');
        }
        user.avatar = avatarUrl.trim();
        await user.save();
        return user.avatar;
    }
    /**
     * Deletes custom avatar and resets to default avatar.
     */
    static async deleteAvatar(userId) {
        const user = await user_model_1.User.findById(userId);
        if (!user) {
            throw new ApiError_1.ApiError(404, 'User not found');
        }
        user.avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username || 'edusphere'}`;
        await user.save();
        return user.avatar;
    }
    /**
     * Updates teacher cover image URL.
     */
    static async updateCover(userId, coverUrl) {
        if (!coverUrl || !coverUrl.trim()) {
            throw new ApiError_1.ApiError(400, 'رابط صورة الغلاف غير صحيح');
        }
        const uid = new mongoose_1.Types.ObjectId(userId);
        let profile = await teacherProfile_model_1.TeacherProfile.findOne({ userId: uid });
        if (!profile) {
            profile = new teacherProfile_model_1.TeacherProfile({ userId: uid, coverImage: coverUrl.trim() });
        }
        else {
            profile.coverImage = coverUrl.trim();
        }
        await profile.save();
        return profile.coverImage || coverUrl.trim();
    }
    /**
     * Resets teacher cover image to default.
     */
    static async deleteCover(userId) {
        const uid = new mongoose_1.Types.ObjectId(userId);
        const profile = await teacherProfile_model_1.TeacherProfile.findOne({ userId: uid });
        const defaultCover = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200';
        if (profile) {
            profile.coverImage = defaultCover;
            await profile.save();
        }
        return profile?.coverImage || defaultCover;
    }
}
exports.MediaService = MediaService;
exports.default = MediaService;

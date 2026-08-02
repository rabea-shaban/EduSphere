"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountSecurityService = void 0;
const user_model_1 = require("../../users/user.model");
const ApiError_1 = require("../../../utils/ApiError");
class AccountSecurityService {
    /**
     * Changes user password after verifying current password.
     */
    static async changePassword(userId, currentPassword, newPassword) {
        if (!currentPassword || !newPassword) {
            throw new ApiError_1.ApiError(400, 'يرجى إدخال كلمة المرور الحالية وكلمة المرور الجديدة');
        }
        if (newPassword.length < 6) {
            throw new ApiError_1.ApiError(400, 'كلمة المرور الجديدة يجب أن تحتوي على 6 أحرف أو أكثر');
        }
        const user = await user_model_1.User.findById(userId).select('+password');
        if (!user) {
            throw new ApiError_1.ApiError(404, 'User not found');
        }
        // Verify current password
        const isCorrect = await user.comparePassword(currentPassword);
        if (!isCorrect) {
            throw new ApiError_1.ApiError(400, 'كلمة المرور الحالية غير صحيحة. يرجى التثبت والمحاولة مجدداً');
        }
        user.password = newPassword;
        await user.save();
    }
    /**
     * Updates teacher's email address.
     */
    static async updateEmail(userId, newEmail) {
        if (!newEmail || !newEmail.includes('@')) {
            throw new ApiError_1.ApiError(400, 'يرجى إدخال بريد إلكتروني صحيح');
        }
        const lowerEmail = newEmail.toLowerCase().trim();
        const existingUser = await user_model_1.User.findOne({ email: lowerEmail, _id: { $ne: userId } });
        if (existingUser) {
            throw new ApiError_1.ApiError(409, 'البريد الإلكتروني مسجل بالفعل لمستخدم آخر في المنصة');
        }
        const user = await user_model_1.User.findById(userId);
        if (!user) {
            throw new ApiError_1.ApiError(404, 'User not found');
        }
        user.email = lowerEmail;
        user.isVerified = false;
        await user.save();
        return user.email;
    }
}
exports.AccountSecurityService = AccountSecurityService;
exports.default = AccountSecurityService;

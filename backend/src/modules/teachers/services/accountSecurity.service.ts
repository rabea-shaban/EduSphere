import { User } from '../../users/user.model';
import { ApiError } from '../../../utils/ApiError';

export class AccountSecurityService {
  /**
   * Changes user password after verifying current password.
   */
  static async changePassword(
    userId: string,
    currentPassword?: string,
    newPassword?: string
  ): Promise<void> {
    if (!currentPassword || !newPassword) {
      throw new ApiError(400, 'يرجى إدخال كلمة المرور الحالية وكلمة المرور الجديدة');
    }

    if (newPassword.length < 6) {
      throw new ApiError(400, 'كلمة المرور الجديدة يجب أن تحتوي على 6 أحرف أو أكثر');
    }

    const user = await User.findById(userId).select('+password');
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    // Verify current password
    const isCorrect = await user.comparePassword(currentPassword);
    if (!isCorrect) {
      throw new ApiError(400, 'كلمة المرور الحالية غير صحيحة. يرجى التثبت والمحاولة مجدداً');
    }

    user.password = newPassword;
    await user.save();
  }

  /**
   * Updates teacher's email address.
   */
  static async updateEmail(userId: string, newEmail: string): Promise<string> {
    if (!newEmail || !newEmail.includes('@')) {
      throw new ApiError(400, 'يرجى إدخال بريد إلكتروني صحيح');
    }

    const lowerEmail = newEmail.toLowerCase().trim();

    const existingUser = await User.findOne({ email: lowerEmail, _id: { $ne: userId } });
    if (existingUser) {
      throw new ApiError(409, 'البريد الإلكتروني مسجل بالفعل لمستخدم آخر في المنصة');
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    user.email = lowerEmail;
    user.isVerified = false;
    await user.save();

    return user.email;
  }
}

export default AccountSecurityService;

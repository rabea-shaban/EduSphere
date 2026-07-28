import { Types } from 'mongoose';
import { User } from '../../users/user.model';
import { TeacherProfile } from '../teacherProfile.model';
import { ApiError } from '../../../utils/ApiError';

export class MediaService {
  /**
   * Updates user avatar URL.
   */
  static async updateAvatar(userId: string, avatarUrl: string): Promise<string> {
    if (!avatarUrl || !avatarUrl.trim()) {
      throw new ApiError(400, 'رابط الصورة الشخصية غير صحيح');
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    user.avatar = avatarUrl.trim();
    await user.save();

    return user.avatar;
  }

  /**
   * Deletes custom avatar and resets to default avatar.
   */
  static async deleteAvatar(userId: string): Promise<string> {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    user.avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username || 'edusphere'}`;
    await user.save();

    return user.avatar;
  }

  /**
   * Updates teacher cover image URL.
   */
  static async updateCover(userId: string, coverUrl: string): Promise<string> {
    if (!coverUrl || !coverUrl.trim()) {
      throw new ApiError(400, 'رابط صورة الغلاف غير صحيح');
    }

    const uid = new Types.ObjectId(userId);
    let profile = await TeacherProfile.findOne({ userId: uid });

    if (!profile) {
      profile = new TeacherProfile({ userId: uid, coverImage: coverUrl.trim() });
    } else {
      profile.coverImage = coverUrl.trim();
    }

    await profile.save();
    return profile.coverImage || coverUrl.trim();
  }

  /**
   * Resets teacher cover image to default.
   */
  static async deleteCover(userId: string): Promise<string> {
    const uid = new Types.ObjectId(userId);
    const profile = await TeacherProfile.findOne({ userId: uid });

    const defaultCover = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200';
    if (profile) {
      profile.coverImage = defaultCover;
      await profile.save();
    }

    return (profile?.coverImage as string) || defaultCover;
  }
}

export default MediaService;

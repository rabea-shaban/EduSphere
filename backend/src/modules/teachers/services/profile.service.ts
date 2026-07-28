import { Types } from 'mongoose';
import { User } from '../../users/user.model';
import { TeacherProfile } from '../teacherProfile.model';
import { ApiError } from '../../../utils/ApiError';
import { ProfileCompletionService } from './profileCompletion.service';
import { ProfileAnalyticsService } from './profileAnalytics.service';

export class ProfileService {
  /**
   * Retrieves full teacher profile combining User and TeacherProfile data.
   */
  static async getFullProfile(userId: string) {
    const uid = new Types.ObjectId(userId);

    const user = await User.findById(uid).select('-password');
    if (!user) {
      throw new ApiError(404, 'Teacher user not found');
    }

    let profile = await TeacherProfile.findOne({ userId: uid });
    if (!profile) {
      profile = await TeacherProfile.create({
        userId: uid,
        displayName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username,
        professionalInfo: {
          yearsOfExperience: 1,
          specialization: 'معلم عام',
          skills: [],
          certifications: [],
          education: [],
          languages: ['العربية'],
        },
        socialLinks: {},
      });
    }

    const completeness = ProfileCompletionService.calculate(user, profile);
    profile.completionPercentage = completeness.completionPercentage;
    await profile.save();

    const analytics = await ProfileAnalyticsService.getAnalytics(userId);

    return {
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        gender: user.gender,
        dateOfBirth: user.dateOfBirth,
        role: user.role,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
      },
      profile: {
        displayName: profile.displayName || `${user.firstName} ${user.lastName}`,
        headline: profile.headline || '',
        bio: profile.bio || '',
        coverImage: profile.coverImage,
        location: profile.location || '',
        country: profile.country || 'مصر',
        city: profile.city || '',
        timezone: profile.timezone || 'Africa/Cairo',
        professionalInfo: profile.professionalInfo,
        socialLinks: profile.socialLinks,
        completionPercentage: profile.completionPercentage,
        isPublic: profile.isPublic,
      },
      completeness,
      analytics,
    };
  }

  /**
   * Updates teacher profile details in User and TeacherProfile models.
   */
  static async updateProfile(userId: string, body: any) {
    const uid = new Types.ObjectId(userId);

    const user = await User.findById(uid);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    // Update User fields
    if (body.firstName) user.firstName = body.firstName.trim();
    if (body.lastName) user.lastName = body.lastName.trim();
    if (body.phone) user.phone = body.phone.trim();
    if (body.gender) user.gender = body.gender;
    if (body.dateOfBirth) user.dateOfBirth = new Date(body.dateOfBirth);

    if (body.username && body.username.trim() !== user.username) {
      const lowerUsername = body.username.toLowerCase().trim();
      const existingUser = await User.findOne({ username: lowerUsername, _id: { $ne: uid } });
      if (existingUser) {
        throw new ApiError(409, 'اسم المستخدم غير متاح، يرجى اختيار اسم مستخدم آخر');
      }
      user.username = lowerUsername;
    }

    await user.save();

    // Update TeacherProfile fields
    let profile = await TeacherProfile.findOne({ userId: uid });
    if (!profile) {
      profile = new TeacherProfile({ userId: uid });
    }

    if (body.displayName) profile.displayName = body.displayName.trim();
    if (body.headline !== undefined) profile.headline = body.headline.trim();
    if (body.bio !== undefined) profile.bio = body.bio.trim();
    if (body.location !== undefined) profile.location = body.location.trim();
    if (body.country !== undefined) profile.country = body.country.trim();
    if (body.city !== undefined) profile.city = body.city.trim();
    if (body.timezone !== undefined) profile.timezone = body.timezone.trim();

    if (body.professionalInfo) {
      profile.professionalInfo = {
        ...profile.professionalInfo,
        ...body.professionalInfo,
      };
    }

    if (body.socialLinks) {
      profile.socialLinks = {
        ...profile.socialLinks,
        ...body.socialLinks,
      };
    }

    const completeness = ProfileCompletionService.calculate(user, profile);
    profile.completionPercentage = completeness.completionPercentage;
    await profile.save();

    return this.getFullProfile(userId);
  }
}

export default ProfileService;

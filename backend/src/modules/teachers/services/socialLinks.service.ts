import { Types } from 'mongoose';
import { TeacherProfile, ISocialLinks } from '../teacherProfile.model';

export class SocialLinksService {
  /**
   * Updates social links for a teacher profile.
   */
  static async updateSocialLinks(userId: string, links: ISocialLinks): Promise<ISocialLinks> {
    const uid = new Types.ObjectId(userId);
    let profile = await TeacherProfile.findOne({ userId: uid });

    if (!profile) {
      profile = new TeacherProfile({
        userId: uid,
        socialLinks: links,
      });
    } else {
      profile.socialLinks = {
        ...profile.socialLinks,
        ...links,
      };
    }

    await profile.save();
    return profile.socialLinks;
  }
}

export default SocialLinksService;

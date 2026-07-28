import { Types } from 'mongoose';
import { TeacherProfile, IProfessionalInfo } from '../teacherProfile.model';

export class ProfessionalProfileService {
  /**
   * Updates professional information for a teacher profile.
   */
  static async updateProfessionalInfo(
    userId: string,
    info: Partial<IProfessionalInfo>
  ): Promise<IProfessionalInfo> {
    const uid = new Types.ObjectId(userId);
    let profile = await TeacherProfile.findOne({ userId: uid });

    if (!profile) {
      profile = new TeacherProfile({
        userId: uid,
        professionalInfo: {
          yearsOfExperience: info.yearsOfExperience || 1,
          specialization: info.specialization || 'معلم عام',
          skills: info.skills || [],
          certifications: info.certifications || [],
          education: info.education || [],
          portfolio: info.portfolio || '',
          achievements: info.achievements || [],
          languages: info.languages || ['العربية'],
        },
      });
    } else {
      profile.professionalInfo = {
        ...profile.professionalInfo,
        ...info,
      };
    }

    await profile.save();
    return profile.professionalInfo;
  }
}

export default ProfessionalProfileService;

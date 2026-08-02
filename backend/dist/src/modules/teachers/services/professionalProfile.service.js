"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfessionalProfileService = void 0;
const mongoose_1 = require("mongoose");
const teacherProfile_model_1 = require("../teacherProfile.model");
class ProfessionalProfileService {
    /**
     * Updates professional information for a teacher profile.
     */
    static async updateProfessionalInfo(userId, info) {
        const uid = new mongoose_1.Types.ObjectId(userId);
        let profile = await teacherProfile_model_1.TeacherProfile.findOne({ userId: uid });
        if (!profile) {
            profile = new teacherProfile_model_1.TeacherProfile({
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
        }
        else {
            profile.professionalInfo = {
                ...profile.professionalInfo,
                ...info,
            };
        }
        await profile.save();
        return profile.professionalInfo;
    }
}
exports.ProfessionalProfileService = ProfessionalProfileService;
exports.default = ProfessionalProfileService;

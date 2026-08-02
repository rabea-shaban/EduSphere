"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocialLinksService = void 0;
const mongoose_1 = require("mongoose");
const teacherProfile_model_1 = require("../teacherProfile.model");
class SocialLinksService {
    /**
     * Updates social links for a teacher profile.
     */
    static async updateSocialLinks(userId, links) {
        const uid = new mongoose_1.Types.ObjectId(userId);
        let profile = await teacherProfile_model_1.TeacherProfile.findOne({ userId: uid });
        if (!profile) {
            profile = new teacherProfile_model_1.TeacherProfile({
                userId: uid,
                socialLinks: links,
            });
        }
        else {
            profile.socialLinks = {
                ...profile.socialLinks,
                ...links,
            };
        }
        await profile.save();
        return profile.socialLinks;
    }
}
exports.SocialLinksService = SocialLinksService;
exports.default = SocialLinksService;

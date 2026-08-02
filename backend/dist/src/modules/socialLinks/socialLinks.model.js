"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocialLinks = void 0;
const mongoose_1 = require("mongoose");
const socialLinksSchema = new mongoose_1.Schema({
    facebook: { type: String, trim: true },
    instagram: { type: String, trim: true },
    linkedin: { type: String, trim: true },
    youtube: { type: String, trim: true },
    x: { type: String, trim: true },
    tiktok: { type: String, trim: true },
    website: { type: String, trim: true },
    organizationId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Organization', unique: true },
}, { timestamps: true });
exports.SocialLinks = (0, mongoose_1.model)('SocialLinks', socialLinksSchema);
exports.default = exports.SocialLinks;

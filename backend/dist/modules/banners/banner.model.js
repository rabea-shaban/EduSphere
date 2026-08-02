"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Banner = void 0;
const mongoose_1 = require("mongoose");
const bannerSchema = new mongoose_1.Schema({
    title: { type: String, required: [true, 'Banner title is required'], trim: true },
    subtitle: { type: String, trim: true },
    image: { type: String, required: [true, 'Image URL is required'] },
    buttonText: { type: String, trim: true },
    buttonLink: { type: String, trim: true },
    displayOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    organizationId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Organization' },
}, { timestamps: true });
bannerSchema.index({ isActive: 1 });
bannerSchema.index({ displayOrder: 1 });
exports.Banner = (0, mongoose_1.model)('Banner', bannerSchema);
exports.default = exports.Banner;

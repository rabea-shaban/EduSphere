"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Seo = void 0;
const mongoose_1 = require("mongoose");
const seoSchema = new mongoose_1.Schema({
    page: { type: String, required: [true, 'Page name or route is required'], trim: true },
    metaTitle: { type: String, required: [true, 'Meta title is required'], trim: true },
    metaDescription: { type: String, required: [true, 'Meta description is required'], trim: true },
    keywords: [{ type: String, trim: true }],
    canonicalUrl: { type: String, trim: true },
    ogImage: { type: String },
    organizationId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Organization' },
}, { timestamps: true });
seoSchema.index({ page: 1 });
exports.Seo = (0, mongoose_1.model)('Seo', seoSchema);
exports.default = exports.Seo;

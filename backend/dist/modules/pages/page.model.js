"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Page = void 0;
const mongoose_1 = require("mongoose");
const pageSchema = new mongoose_1.Schema({
    title: { type: String, required: [true, 'Title is required'], trim: true },
    slug: { type: String, required: [true, 'Slug is required'], unique: true, trim: true, lowercase: true },
    content: { type: String, required: [true, 'Content is required'] },
    pageType: {
        type: String,
        enum: ['Home', 'About', 'Contact', 'Privacy Policy', 'Terms', 'Custom'],
        required: [true, 'Page type is required'],
        default: 'Custom',
    },
    status: { type: String, enum: ['Draft', 'Published'], default: 'Draft' },
    organizationId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Organization' },
}, { timestamps: true });
pageSchema.index({ pageType: 1 });
pageSchema.index({ status: 1 });
exports.Page = (0, mongoose_1.model)('Page', pageSchema);
exports.default = exports.Page;

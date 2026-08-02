"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Blog = void 0;
const mongoose_1 = require("mongoose");
const blogSchema = new mongoose_1.Schema({
    title: { type: String, required: [true, 'Blog title is required'], trim: true },
    slug: { type: String, required: [true, 'Slug is required'], unique: true, trim: true, lowercase: true },
    excerpt: { type: String, trim: true },
    content: { type: String, required: [true, 'Content is required'] },
    thumbnail: { type: String },
    authorId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: [true, 'Author reference is required'] },
    categoryId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Category', required: [true, 'Category reference is required'] },
    tags: [{ type: String, trim: true }],
    status: { type: String, enum: ['Draft', 'Published'], default: 'Draft' },
    views: { type: Number, default: 0 },
    organizationId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Organization' },
}, { timestamps: true });
blogSchema.index({ categoryId: 1 });
blogSchema.index({ authorId: 1 });
blogSchema.index({ status: 1 });
exports.Blog = (0, mongoose_1.model)('Blog', blogSchema);
exports.default = exports.Blog;

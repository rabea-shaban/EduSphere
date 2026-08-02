"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Category = void 0;
const mongoose_1 = require("mongoose");
const categorySchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'Category name is required'],
        trim: true,
    },
    slug: {
        type: String,
        required: [true, 'Slug is required'],
        unique: true,
        trim: true,
        lowercase: true,
    },
    description: {
        type: String,
        trim: true,
    },
    type: {
        type: String,
        enum: ['Blog', 'Course', 'General'],
        required: [true, 'Category type is required'],
        default: 'General',
    },
    organizationId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Organization',
    },
}, {
    timestamps: true,
});
// Indexes
categorySchema.index({ type: 1 });
exports.Category = (0, mongoose_1.model)('Category', categorySchema);
exports.default = exports.Category;

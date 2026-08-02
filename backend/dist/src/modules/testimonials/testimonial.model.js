"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Testimonial = void 0;
const mongoose_1 = require("mongoose");
const testimonialSchema = new mongoose_1.Schema({
    studentName: { type: String, required: [true, 'Student name is required'], trim: true },
    studentImage: { type: String },
    courseId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Course' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: [true, 'Comment is required'], trim: true },
    isApproved: { type: Boolean, default: false },
    organizationId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Organization' },
}, { timestamps: true });
testimonialSchema.index({ isApproved: 1 });
testimonialSchema.index({ courseId: 1 });
exports.Testimonial = (0, mongoose_1.model)('Testimonial', testimonialSchema);
exports.default = exports.Testimonial;

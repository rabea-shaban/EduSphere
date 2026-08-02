"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lesson = void 0;
const mongoose_1 = require("mongoose");
const slugify_1 = __importDefault(require("slugify"));
const lessonSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: [true, 'Lesson title is required'],
        trim: true,
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true,
    },
    description: {
        type: String,
        trim: true,
    },
    unitId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Unit',
        required: [true, 'Unit reference is required'],
    },
    courseId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Course',
        required: [true, 'Course reference is required'],
    },
    lessonType: {
        type: String,
        enum: ['Video', 'PDF', 'Quiz', 'Assignment', 'Text'],
        required: [true, 'Lesson type is required'],
    },
    duration: {
        type: Number,
        default: 0, // in minutes
    },
    order: {
        type: Number,
        required: [true, 'Lesson order is required'],
    },
    isPreview: {
        type: Boolean,
        default: false,
    },
    isPublished: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});
// Indexes
lessonSchema.index({ unitId: 1 });
lessonSchema.index({ courseId: 1 });
lessonSchema.index({ order: 1 });
lessonSchema.index({ unitId: 1, order: 1 });
// Slugify pre-save hook
lessonSchema.pre('save', function (next) {
    if (this.isModified('title')) {
        this.slug = (0, slugify_1.default)(this.title, { lower: true, strict: true });
    }
    next();
});
exports.Lesson = (0, mongoose_1.model)('Lesson', lessonSchema);
exports.default = exports.Lesson;

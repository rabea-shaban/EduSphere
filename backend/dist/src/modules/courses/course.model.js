"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Course = void 0;
const mongoose_1 = require("mongoose");
const slugify_1 = __importDefault(require("slugify"));
const courseSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: [true, 'Course title is required'],
        unique: true,
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
    thumbnail: {
        type: String,
        default: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800',
    },
    previewVideo: {
        type: String,
        trim: true,
    },
    teacher: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Teacher reference is required'],
    },
    academicYear: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'AcademicYear',
        required: false,
    },
    grade: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Grade',
        required: false,
    },
    subject: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Subject',
        required: false,
    },
    term: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Term',
        required: false,
    },
    language: {
        type: String,
        default: 'arabic',
    },
    price: {
        type: Number,
        default: 0,
        min: [0, 'Price cannot be negative'],
    },
    discountPrice: {
        type: Number,
        default: 0,
        min: [0, 'Discount price cannot be negative'],
        validate: {
            validator: function (value) {
                return value <= this.price;
            },
            message: 'Discount price must be less than or equal to original price',
        },
    },
    duration: {
        type: Number,
        default: 0,
    },
    level: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced'],
        default: 'Beginner',
    },
    tags: [
        {
            type: String,
            trim: true,
        },
    ],
    requirements: [
        {
            type: String,
            trim: true,
        },
    ],
    objectives: [
        {
            type: String,
            trim: true,
        },
    ],
    status: {
        type: String,
        enum: ['Draft', 'Published', 'Archived'],
        default: 'Draft',
    },
    isFeatured: {
        type: Boolean,
        default: false,
    },
    isFree: {
        type: Boolean,
        default: false,
    },
    enrollmentCount: {
        type: Number,
        default: 0,
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
    },
    reviewCount: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});
// Indexes — language_override: 'none' stops MongoDB from validating language field value against supported text search languages
courseSchema.index({ title: 'text', description: 'text', tags: 'text' }, { default_language: 'none', language_override: 'none' });
courseSchema.index({ teacher: 1, status: 1 });
courseSchema.index({ academicYear: 1 });
courseSchema.index({ grade: 1 });
courseSchema.index({ subject: 1 });
courseSchema.index({ term: 1 });
courseSchema.index({ status: 1, createdAt: -1 });
courseSchema.index({ isFeatured: 1 });
courseSchema.index({ isFree: 1 });
// Pre-save slugification hook
courseSchema.pre('save', function () {
    if (this.isModified('title')) {
        this.slug = (0, slugify_1.default)(this.title, { lower: true, strict: true });
    }
});
exports.Course = (0, mongoose_1.model)('Course', courseSchema);
// Drop old text indexes on startup if they were created with old language_override options
exports.Course.collection.dropIndexes().catch(() => { });
exports.default = exports.Course;

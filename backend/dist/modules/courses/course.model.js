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
        default: 'https://res.cloudinary.com/dx594/image/upload/v1/defaults/course-thumbnail.png',
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
        required: [true, 'Academic Year reference is required'],
    },
    grade: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Grade',
        required: [true, 'Grade reference is required'],
    },
    subject: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Subject',
        required: [true, 'Subject reference is required'],
    },
    term: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Term',
        required: [true, 'Term reference is required'],
    },
    language: {
        type: String,
        default: 'Arabic',
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
// Indexes
courseSchema.index({ teacher: 1 });
courseSchema.index({ academicYear: 1 });
courseSchema.index({ grade: 1 });
courseSchema.index({ subject: 1 });
courseSchema.index({ term: 1 });
courseSchema.index({ status: 1 });
courseSchema.index({ isFeatured: 1 });
courseSchema.index({ isFree: 1 });
// Pre-save slugification hook
courseSchema.pre('save', function (next) {
    if (this.isModified('title')) {
        this.slug = (0, slugify_1.default)(this.title, { lower: true, strict: true });
    }
    next();
});
exports.Course = (0, mongoose_1.model)('Course', courseSchema);
exports.default = exports.Course;

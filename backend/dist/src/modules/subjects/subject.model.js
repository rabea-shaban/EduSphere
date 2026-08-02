"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Subject = void 0;
const mongoose_1 = require("mongoose");
const slugify_1 = __importDefault(require("slugify"));
const subjectSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'Subject name is required'],
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
    icon: {
        type: String,
        trim: true,
    },
    color: {
        type: String,
        trim: true,
    },
    educationStage: {
        type: String,
        enum: ['Primary', 'Preparatory', 'Secondary', 'Azhar', 'Baccalaureate', 'ComputerScience'],
        required: [true, 'Education stage is required'],
    },
    grades: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Grade',
        },
    ],
    teacherIds: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
    isActive: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});
// Indexes
subjectSchema.index({ educationStage: 1 });
subjectSchema.index({ isActive: 1 });
// Slugify pre-save hook
subjectSchema.pre('save', function () {
    if (this.isModified('name')) {
        this.slug = (0, slugify_1.default)(this.name, { lower: true, strict: true });
    }
});
exports.Subject = (0, mongoose_1.model)('Subject', subjectSchema);
exports.default = exports.Subject;

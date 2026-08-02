"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Grade = void 0;
const mongoose_1 = require("mongoose");
const gradeSchema = new mongoose_1.Schema({
    name: {
        ar: {
            type: String,
            required: [true, 'Arabic grade name is required'],
            unique: true,
            trim: true,
        },
        en: {
            type: String,
            required: [true, 'English grade name is required'],
            unique: true,
            trim: true,
        },
    },
    order: {
        type: Number,
        required: [true, 'Grade ordering is required'],
        unique: true,
    },
    educationStage: {
        type: String,
        enum: ['Primary', 'Preparatory', 'Secondary'],
        required: [true, 'Education stage is required'],
    },
    description: {
        type: String,
        trim: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});
// Indexes
gradeSchema.index({ educationStage: 1 });
gradeSchema.index({ isActive: 1 });
exports.Grade = (0, mongoose_1.model)('Grade', gradeSchema);
exports.default = exports.Grade;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Unit = void 0;
const mongoose_1 = require("mongoose");
const unitSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: [true, 'Unit title is required'],
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    courseId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Course',
        required: [true, 'Course reference is required'],
    },
    order: {
        type: Number,
        required: [true, 'Unit order is required'],
    },
    isPublished: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});
// Indexes
unitSchema.index({ courseId: 1 });
unitSchema.index({ order: 1 });
unitSchema.index({ courseId: 1, order: 1 });
exports.Unit = (0, mongoose_1.model)('Unit', unitSchema);
exports.default = exports.Unit;

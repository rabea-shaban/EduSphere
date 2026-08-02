"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Enrollment = void 0;
const mongoose_1 = require("mongoose");
const enrollmentSchema = new mongoose_1.Schema({
    studentId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Student reference is required'],
    },
    courseId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Course',
        required: [true, 'Course reference is required'],
    },
    teacherId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Teacher reference is required'],
    },
    status: {
        type: String,
        enum: ['Pending', 'Active', 'Completed', 'Cancelled'],
        default: 'Active',
    },
    paymentStatus: {
        type: String,
        enum: ['Paid', 'Unpaid', 'Free'],
        default: 'Unpaid',
    },
    purchasePrice: {
        type: Number,
        default: 0,
        min: [0, 'Purchase price cannot be negative'],
    },
    enrolledAt: {
        type: Date,
        default: Date.now,
    },
    completedAt: {
        type: Date,
    },
    certificateIssued: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
// Indexes
enrollmentSchema.index({ studentId: 1, courseId: 1 }, { unique: true });
enrollmentSchema.index({ studentId: 1 });
enrollmentSchema.index({ courseId: 1 });
enrollmentSchema.index({ teacherId: 1 });
enrollmentSchema.index({ status: 1 });
exports.Enrollment = (0, mongoose_1.model)('Enrollment', enrollmentSchema);
exports.default = exports.Enrollment;

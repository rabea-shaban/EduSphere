"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Submission = void 0;
const mongoose_1 = require("mongoose");
const submissionSchema = new mongoose_1.Schema({
    assignmentId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Assignment',
        required: [true, 'Assignment reference is required'],
        index: true,
    },
    studentId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Student reference is required'],
        index: true,
    },
    attemptNumber: {
        type: Number,
        default: 1,
        min: 1,
    },
    attachments: [mongoose_1.Schema.Types.Mixed],
    textAnswer: {
        type: String,
        trim: true,
    },
    externalUrl: {
        type: String,
        trim: true,
    },
    submittedAt: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        enum: ['Draft', 'Submitted', 'Late', 'Reviewed', 'Graded', 'Returned'],
        default: 'Submitted',
        index: true,
    },
    grade: {
        type: Number,
        min: [0, 'Grade cannot be negative'],
    },
    feedback: {
        type: String,
        trim: true,
    },
    privateNotes: {
        type: String,
        trim: true,
    },
    publicFeedback: {
        type: String,
        trim: true,
    },
    gradeOverride: {
        type: Boolean,
        default: false,
    },
    reviewedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
    },
    reviewedAt: {
        type: Date,
    },
}, {
    timestamps: true,
});
// Indexes
submissionSchema.index({ assignmentId: 1, studentId: 1, attemptNumber: 1 });
submissionSchema.index({ assignmentId: 1, status: 1 });
exports.Submission = (0, mongoose_1.model)('Submission', submissionSchema);
exports.default = exports.Submission;

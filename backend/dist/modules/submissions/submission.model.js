"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Submission = void 0;
const mongoose_1 = require("mongoose");
const submissionSchema = new mongoose_1.Schema({
    assignmentId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Assignment',
        required: [true, 'Assignment reference is required'],
    },
    studentId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Student reference is required'],
    },
    attachments: [
        {
            type: String,
            trim: true,
        },
    ],
    textAnswer: {
        type: String,
        trim: true,
    },
    submittedAt: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        enum: ['Submitted', 'Late', 'Reviewed'],
        default: 'Submitted',
    },
    grade: {
        type: Number,
        min: [0, 'Grade cannot be negative'],
    },
    feedback: {
        type: String,
        trim: true,
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
submissionSchema.index({ assignmentId: 1, studentId: 1 }, { unique: true });
submissionSchema.index({ assignmentId: 1 });
submissionSchema.index({ studentId: 1 });
submissionSchema.index({ status: 1 });
exports.Submission = (0, mongoose_1.model)('Submission', submissionSchema);
exports.default = exports.Submission;

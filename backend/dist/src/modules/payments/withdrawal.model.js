"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Withdrawal = void 0;
const mongoose_1 = require("mongoose");
const withdrawalSchema = new mongoose_1.Schema({
    teacherId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Teacher reference is required'],
    },
    amount: {
        type: Number,
        required: [true, 'Withdrawal amount is required'],
        min: [1, 'Amount must be greater than zero'],
    },
    method: {
        type: String,
        enum: ['Vodafone Cash', 'InstaPay', 'Bank Transfer', 'Fawry'],
        default: 'Vodafone Cash',
    },
    accountDetails: {
        type: String,
        required: [true, 'Account details / phone number is required'],
        trim: true,
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Paid', 'Rejected', 'Cancelled'],
        default: 'Pending',
    },
    requestedAt: {
        type: Date,
        default: Date.now,
    },
    processedAt: {
        type: Date,
    },
    reviewedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
    },
    rejectionReason: {
        type: String,
        trim: true,
    },
}, {
    timestamps: true,
});
withdrawalSchema.index({ teacherId: 1 });
withdrawalSchema.index({ status: 1 });
exports.Withdrawal = (0, mongoose_1.model)('Withdrawal', withdrawalSchema);
exports.default = exports.Withdrawal;

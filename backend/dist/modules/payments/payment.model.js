"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Payment = void 0;
const mongoose_1 = require("mongoose");
const paymentSchema = new mongoose_1.Schema({
    studentId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
    },
    organizationId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Organization',
    },
    courseId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Course',
    },
    subscriptionId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'SubscriptionPlan',
    },
    amount: {
        type: Number,
        required: [true, 'Payment amount is required'],
        min: [0, 'Amount cannot be negative'],
    },
    currency: {
        type: String,
        required: [true, 'Currency is required'],
        default: 'USD',
        trim: true,
    },
    paymentMethod: {
        type: String,
        enum: ['Stripe', 'Cash', 'Bank Transfer', 'Wallet'],
        required: [true, 'Payment method is required'],
    },
    status: {
        type: String,
        enum: ['Pending', 'Paid', 'Failed', 'Refunded'],
        default: 'Pending',
    },
    paymentReference: {
        type: String,
        required: [true, 'Payment reference ID is required'],
        trim: true,
    },
    paidAt: {
        type: Date,
    },
}, {
    timestamps: true,
});
// Indexes
paymentSchema.index({ studentId: 1 });
paymentSchema.index({ organizationId: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ paymentReference: 1 });
exports.Payment = (0, mongoose_1.model)('Payment', paymentSchema);
exports.default = exports.Payment;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = void 0;
const mongoose_1 = require("mongoose");
const transactionSchema = new mongoose_1.Schema({
    paymentId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Payment',
        required: [true, 'Payment reference is required'],
    },
    gateway: {
        type: String,
        required: [true, 'Transaction gateway is required'],
        trim: true,
    },
    transactionId: {
        type: String,
        required: [true, 'Transaction ID reference is required'],
        trim: true,
    },
    requestPayload: {
        type: mongoose_1.Schema.Types.Mixed,
    },
    responsePayload: {
        type: mongoose_1.Schema.Types.Mixed,
    },
    status: {
        type: String,
        enum: ['Pending', 'Success', 'Failed'],
        default: 'Pending',
    },
}, {
    timestamps: true,
});
// Indexes
transactionSchema.index({ paymentId: 1 });
transactionSchema.index({ transactionId: 1 });
transactionSchema.index({ status: 1 });
exports.Transaction = (0, mongoose_1.model)('Transaction', transactionSchema);
exports.default = exports.Transaction;

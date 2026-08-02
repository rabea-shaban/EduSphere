"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Invoice = void 0;
const mongoose_1 = require("mongoose");
const invoiceItemSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
});
const invoiceSchema = new mongoose_1.Schema({
    invoiceNumber: {
        type: String,
        required: [true, 'Invoice number is required'],
        unique: true,
        trim: true,
    },
    studentId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
    },
    organizationId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Organization',
    },
    paymentId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Payment',
        required: [true, 'Payment reference is required'],
    },
    items: [invoiceItemSchema],
    subtotal: {
        type: Number,
        required: [true, 'Subtotal is required'],
        min: [0, 'Subtotal cannot be negative'],
    },
    discount: {
        type: Number,
        default: 0,
        min: [0, 'Discount cannot be negative'],
    },
    tax: {
        type: Number,
        default: 0,
        min: [0, 'Tax cannot be negative'],
    },
    total: {
        type: Number,
        required: [true, 'Total price is required'],
        min: [0, 'Total cannot be negative'],
    },
    currency: {
        type: String,
        required: [true, 'Currency is required'],
        default: 'USD',
        trim: true,
    },
    status: {
        type: String,
        enum: ['Issued', 'Paid', 'Cancelled'],
        default: 'Issued',
    },
    issuedAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});
// Indexes
invoiceSchema.index({ studentId: 1 });
invoiceSchema.index({ organizationId: 1 });
invoiceSchema.index({ status: 1 });
exports.Invoice = (0, mongoose_1.model)('Invoice', invoiceSchema);
exports.default = exports.Invoice;

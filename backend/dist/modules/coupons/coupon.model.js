"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Coupon = void 0;
const mongoose_1 = require("mongoose");
const couponSchema = new mongoose_1.Schema({
    code: {
        type: String,
        required: [true, 'Coupon code is required'],
        unique: true,
        uppercase: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    discountType: {
        type: String,
        enum: ['Percentage', 'Fixed'],
        required: [true, 'Discount type is required'],
    },
    discountValue: {
        type: Number,
        required: [true, 'Discount value is required'],
        min: [0, 'Discount value cannot be negative'],
    },
    maximumDiscount: {
        type: Number,
        min: [0, 'Maximum discount cannot be negative'],
    },
    minimumPurchase: {
        type: Number,
        required: [true, 'Minimum purchase requirement is required'],
        default: 0,
        min: [0, 'Minimum purchase cannot be negative'],
    },
    usageLimit: {
        type: Number,
        min: [1, 'Usage limit must be at least 1'],
    },
    usedCount: {
        type: Number,
        default: 0,
        min: [0, 'Used count cannot be negative'],
    },
    expiresAt: {
        type: Date,
        required: [true, 'Coupon expiration date is required'],
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active',
    },
}, {
    timestamps: true,
});
// Indexes
couponSchema.index({ status: 1 });
couponSchema.index({ expiresAt: 1 });
exports.Coupon = (0, mongoose_1.model)('Coupon', couponSchema);
exports.default = exports.Coupon;

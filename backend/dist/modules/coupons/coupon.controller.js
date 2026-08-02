"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAndApplyCoupon = exports.deleteCoupon = exports.updateCoupon = exports.getCouponById = exports.getAllCoupons = exports.createCoupon = void 0;
const coupon_model_1 = require("./coupon.model");
const ApiResponse_1 = require("../../utils/ApiResponse");
const ApiError_1 = require("../../utils/ApiError");
const catchAsync_1 = require("../../utils/catchAsync");
/**
 * Create a new coupon.
 */
exports.createCoupon = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const coupon = await coupon_model_1.Coupon.create(req.body);
    res.status(201).json(new ApiResponse_1.ApiResponse(201, coupon, 'Coupon created successfully'));
});
/**
 * Get all coupons with filters and pagination.
 */
exports.getAllCoupons = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { page = 1, limit = 10, search, status } = req.query;
    const filter = {};
    if (search) {
        filter.code = new RegExp(search, 'i');
    }
    if (status) {
        filter.status = status;
    }
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Number(limit));
    const skip = (pageNum - 1) * limitNum;
    const coupons = await coupon_model_1.Coupon.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum);
    const total = await coupon_model_1.Coupon.countDocuments(filter);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, {
        coupons,
        pagination: {
            total,
            page: pageNum,
            limit: limitNum,
            totalPages: Math.ceil(total / limitNum),
        },
    }, 'Coupons retrieved successfully'));
});
/**
 * Get Coupon by ID.
 */
exports.getCouponById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const coupon = await coupon_model_1.Coupon.findById(id);
    if (!coupon) {
        throw new ApiError_1.ApiError(404, 'Coupon not found');
    }
    res.status(200).json(new ApiResponse_1.ApiResponse(200, coupon, 'Coupon retrieved successfully'));
});
/**
 * Update Coupon.
 */
exports.updateCoupon = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const coupon = await coupon_model_1.Coupon.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!coupon) {
        throw new ApiError_1.ApiError(404, 'Coupon not found');
    }
    res.status(200).json(new ApiResponse_1.ApiResponse(200, coupon, 'Coupon updated successfully'));
});
/**
 * Delete Coupon.
 */
exports.deleteCoupon = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const coupon = await coupon_model_1.Coupon.findByIdAndDelete(id);
    if (!coupon) {
        throw new ApiError_1.ApiError(404, 'Coupon not found');
    }
    res.status(200).json(new ApiResponse_1.ApiResponse(200, null, 'Coupon deleted successfully'));
});
/**
 * Validate and apply coupon against a purchase price.
 */
exports.validateAndApplyCoupon = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { code, purchaseAmount } = req.body;
    const coupon = await coupon_model_1.Coupon.findOne({ code: code.toUpperCase() });
    if (!coupon) {
        throw new ApiError_1.ApiError(404, 'Invalid coupon code');
    }
    if (coupon.status !== 'Active') {
        throw new ApiError_1.ApiError(400, 'Coupon is inactive');
    }
    if (new Date() > new Date(coupon.expiresAt)) {
        throw new ApiError_1.ApiError(400, 'Coupon has expired');
    }
    if (coupon.usageLimit !== undefined && coupon.usedCount >= coupon.usageLimit) {
        throw new ApiError_1.ApiError(400, 'Coupon usage limit has been reached');
    }
    if (purchaseAmount < coupon.minimumPurchase) {
        throw new ApiError_1.ApiError(400, `Minimum purchase amount of $${coupon.minimumPurchase} is required to use this coupon`);
    }
    // Calculate discount value
    let discount = 0;
    if (coupon.discountType === 'Fixed') {
        discount = coupon.discountValue;
    }
    else if (coupon.discountType === 'Percentage') {
        discount = (coupon.discountValue / 100) * purchaseAmount;
        if (coupon.maximumDiscount !== undefined && discount > coupon.maximumDiscount) {
            discount = coupon.maximumDiscount;
        }
    }
    // Ensure discount does not exceed the total price
    discount = Math.min(discount, purchaseAmount);
    const finalAmount = purchaseAmount - discount;
    res.status(200).json(new ApiResponse_1.ApiResponse(200, {
        coupon,
        discount,
        finalAmount,
    }, 'Coupon validated successfully'));
});
exports.default = exports.createCoupon;

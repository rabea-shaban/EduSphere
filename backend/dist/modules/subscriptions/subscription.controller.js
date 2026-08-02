"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivatePlan = exports.activatePlan = exports.updatePlan = exports.getPlanById = exports.getAllPlans = exports.createPlan = void 0;
const subscription_model_1 = require("./subscription.model");
const ApiResponse_1 = require("../../utils/ApiResponse");
const ApiError_1 = require("../../utils/ApiError");
const catchAsync_1 = require("../../utils/catchAsync");
/**
 * Create a new subscription plan.
 */
exports.createPlan = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const plan = await subscription_model_1.SubscriptionPlan.create(req.body);
    res.status(201).json(new ApiResponse_1.ApiResponse(201, plan, 'Subscription plan created successfully'));
});
/**
 * Get all subscription plans with pagination, sorting and filtering.
 */
exports.getAllPlans = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { page = 1, limit = 10, search, status } = req.query;
    const filter = {};
    if (search) {
        filter.name = new RegExp(search, 'i');
    }
    if (status) {
        filter.status = status;
    }
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Number(limit));
    const skip = (pageNum - 1) * limitNum;
    const plans = await subscription_model_1.SubscriptionPlan.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum);
    const total = await subscription_model_1.SubscriptionPlan.countDocuments(filter);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, {
        plans,
        pagination: {
            total,
            page: pageNum,
            limit: limitNum,
            totalPages: Math.ceil(total / limitNum),
        },
    }, 'Subscription plans retrieved successfully'));
});
/**
 * Get Subscription Plan by ID.
 */
exports.getPlanById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const plan = await subscription_model_1.SubscriptionPlan.findById(id);
    if (!plan) {
        throw new ApiError_1.ApiError(404, 'Subscription plan not found');
    }
    res.status(200).json(new ApiResponse_1.ApiResponse(200, plan, 'Subscription plan retrieved successfully'));
});
/**
 * Update Subscription Plan.
 */
exports.updatePlan = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const plan = await subscription_model_1.SubscriptionPlan.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!plan) {
        throw new ApiError_1.ApiError(404, 'Subscription plan not found');
    }
    res.status(200).json(new ApiResponse_1.ApiResponse(200, plan, 'Subscription plan updated successfully'));
});
/**
 * Activate a subscription plan.
 */
exports.activatePlan = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const plan = await subscription_model_1.SubscriptionPlan.findByIdAndUpdate(id, { status: 'Active' }, { new: true });
    if (!plan) {
        throw new ApiError_1.ApiError(404, 'Subscription plan not found');
    }
    res.status(200).json(new ApiResponse_1.ApiResponse(200, plan, 'Subscription plan activated successfully'));
});
/**
 * Deactivate a subscription plan.
 */
exports.deactivatePlan = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const plan = await subscription_model_1.SubscriptionPlan.findByIdAndUpdate(id, { status: 'Inactive' }, { new: true });
    if (!plan) {
        throw new ApiError_1.ApiError(404, 'Subscription plan not found');
    }
    res.status(200).json(new ApiResponse_1.ApiResponse(200, plan, 'Subscription plan deactivated successfully'));
});
exports.default = exports.createPlan;

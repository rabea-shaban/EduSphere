"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTransactionById = exports.getAllTransactions = void 0;
const transaction_model_1 = require("./transaction.model");
const ApiResponse_1 = require("../../utils/ApiResponse");
const ApiError_1 = require("../../utils/ApiError");
const catchAsync_1 = require("../../utils/catchAsync");
/**
 * Retrieve transaction audit logs (Admins only).
 */
exports.getAllTransactions = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { page = 1, limit = 10, status, gateway } = req.query;
    const filter = {};
    if (status)
        filter.status = status;
    if (gateway)
        filter.gateway = gateway;
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Number(limit));
    const skip = (pageNum - 1) * limitNum;
    const transactions = await transaction_model_1.Transaction.find(filter)
        .populate('paymentId')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum);
    const total = await transaction_model_1.Transaction.countDocuments(filter);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, {
        transactions,
        pagination: {
            total,
            page: pageNum,
            limit: limitNum,
            totalPages: Math.ceil(total / limitNum),
        },
    }, 'Transaction audit logs retrieved successfully'));
});
/**
 * Get single transaction details.
 */
exports.getTransactionById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const transaction = await transaction_model_1.Transaction.findById(id).populate('paymentId');
    if (!transaction) {
        throw new ApiError_1.ApiError(404, 'Transaction log not found');
    }
    res.status(200).json(new ApiResponse_1.ApiResponse(200, transaction, 'Transaction logs retrieved successfully'));
});
exports.default = exports.getAllTransactions;

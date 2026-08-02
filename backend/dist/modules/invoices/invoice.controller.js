"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInvoiceById = exports.getAllInvoices = exports.createInvoice = void 0;
const invoice_model_1 = require("./invoice.model");
const ApiResponse_1 = require("../../utils/ApiResponse");
const ApiError_1 = require("../../utils/ApiError");
const catchAsync_1 = require("../../utils/catchAsync");
/**
 * Generate a new invoice manually (Admins only).
 */
exports.createInvoice = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const invoice = await invoice_model_1.Invoice.create(req.body);
    res.status(201).json(new ApiResponse_1.ApiResponse(201, invoice, 'Invoice generated successfully'));
});
/**
 * Retrieve paginated invoice records with filters.
 */
exports.getAllInvoices = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { page = 1, limit = 10, status, studentId } = req.query;
    const filter = {};
    if (status)
        filter.status = status;
    // Enforce student view restrictions
    if (req.user && req.user.role === 'STUDENT') {
        filter.studentId = req.user._id;
    }
    else if (studentId) {
        filter.studentId = studentId;
    }
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Number(limit));
    const skip = (pageNum - 1) * limitNum;
    const invoices = await invoice_model_1.Invoice.find(filter)
        .populate('studentId', 'firstName lastName email')
        .populate('paymentId')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum);
    const total = await invoice_model_1.Invoice.countDocuments(filter);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, {
        invoices,
        pagination: {
            total,
            page: pageNum,
            limit: limitNum,
            totalPages: Math.ceil(total / limitNum),
        },
    }, 'Invoices retrieved successfully'));
});
/**
 * Get single Invoice details.
 */
exports.getInvoiceById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const invoice = await invoice_model_1.Invoice.findById(id)
        .populate('studentId', 'firstName lastName email')
        .populate('paymentId');
    if (!invoice) {
        throw new ApiError_1.ApiError(404, 'Invoice not found');
    }
    res.status(200).json(new ApiResponse_1.ApiResponse(200, invoice, 'Invoice retrieved successfully'));
});
exports.default = exports.createInvoice;

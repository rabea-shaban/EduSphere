"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFaq = exports.updateFaq = exports.getFaqById = exports.getAllFaqs = exports.createFaq = void 0;
const faq_model_1 = require("./faq.model");
const ApiResponse_1 = require("../../utils/ApiResponse");
const ApiError_1 = require("../../utils/ApiError");
const catchAsync_1 = require("../../utils/catchAsync");
exports.createFaq = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const faq = await faq_model_1.Faq.create(req.body);
    res.status(201).json(new ApiResponse_1.ApiResponse(201, faq, 'FAQ created successfully'));
});
exports.getAllFaqs = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { page = 1, limit = 10, isActive } = req.query;
    const filter = {};
    if (isActive !== undefined)
        filter.isActive = isActive === 'true';
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Number(limit));
    const skip = (pageNum - 1) * limitNum;
    const faqs = await faq_model_1.Faq.find(filter).skip(skip).limit(limitNum).sort({ displayOrder: 1, createdAt: -1 });
    const total = await faq_model_1.Faq.countDocuments(filter);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, { faqs, pagination: { total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) } }, 'FAQs retrieved successfully'));
});
exports.getFaqById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const faq = await faq_model_1.Faq.findById(id);
    if (!faq)
        throw new ApiError_1.ApiError(404, 'FAQ not found');
    res.status(200).json(new ApiResponse_1.ApiResponse(200, faq, 'FAQ retrieved successfully'));
});
exports.updateFaq = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const faq = await faq_model_1.Faq.findByIdAndUpdate(id, req.body, { new: true });
    if (!faq)
        throw new ApiError_1.ApiError(404, 'FAQ not found');
    res.status(200).json(new ApiResponse_1.ApiResponse(200, faq, 'FAQ updated successfully'));
});
exports.deleteFaq = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const faq = await faq_model_1.Faq.findByIdAndDelete(id);
    if (!faq)
        throw new ApiError_1.ApiError(404, 'FAQ not found');
    res.status(200).json(new ApiResponse_1.ApiResponse(200, null, 'FAQ deleted successfully'));
});

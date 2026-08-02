"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTestimonial = exports.approveTestimonial = exports.updateTestimonial = exports.getAllTestimonials = exports.createTestimonial = void 0;
const testimonial_model_1 = require("./testimonial.model");
const ApiResponse_1 = require("../../utils/ApiResponse");
const ApiError_1 = require("../../utils/ApiError");
const catchAsync_1 = require("../../utils/catchAsync");
exports.createTestimonial = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const testimonial = await testimonial_model_1.Testimonial.create(req.body);
    res.status(201).json(new ApiResponse_1.ApiResponse(201, testimonial, 'Testimonial created successfully'));
});
exports.getAllTestimonials = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { page = 1, limit = 10, isApproved, courseId } = req.query;
    const filter = {};
    if (isApproved !== undefined)
        filter.isApproved = isApproved === 'true';
    if (courseId)
        filter.courseId = courseId;
    // Students/Public only see approved testimonials
    if (!req.user || req.user.role === 'STUDENT') {
        filter.isApproved = true;
    }
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Number(limit));
    const skip = (pageNum - 1) * limitNum;
    const testimonials = await testimonial_model_1.Testimonial.find(filter).populate('courseId', 'title').skip(skip).limit(limitNum).sort({ createdAt: -1 });
    const total = await testimonial_model_1.Testimonial.countDocuments(filter);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, { testimonials, pagination: { total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) } }, 'Testimonials retrieved successfully'));
});
exports.updateTestimonial = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const testimonial = await testimonial_model_1.Testimonial.findByIdAndUpdate(id, req.body, { new: true });
    if (!testimonial)
        throw new ApiError_1.ApiError(404, 'Testimonial not found');
    res.status(200).json(new ApiResponse_1.ApiResponse(200, testimonial, 'Testimonial updated successfully'));
});
exports.approveTestimonial = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const testimonial = await testimonial_model_1.Testimonial.findByIdAndUpdate(id, { isApproved: true }, { new: true });
    if (!testimonial)
        throw new ApiError_1.ApiError(404, 'Testimonial not found');
    res.status(200).json(new ApiResponse_1.ApiResponse(200, testimonial, 'Testimonial approved successfully'));
});
exports.deleteTestimonial = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const testimonial = await testimonial_model_1.Testimonial.findByIdAndDelete(id);
    if (!testimonial)
        throw new ApiError_1.ApiError(404, 'Testimonial not found');
    res.status(200).json(new ApiResponse_1.ApiResponse(200, null, 'Testimonial deleted successfully'));
});

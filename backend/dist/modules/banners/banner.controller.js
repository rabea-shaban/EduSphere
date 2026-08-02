"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBanner = exports.updateBanner = exports.getBannerById = exports.getAllBanners = exports.createBanner = void 0;
const banner_model_1 = require("./banner.model");
const ApiResponse_1 = require("../../utils/ApiResponse");
const ApiError_1 = require("../../utils/ApiError");
const catchAsync_1 = require("../../utils/catchAsync");
exports.createBanner = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const banner = await banner_model_1.Banner.create(req.body);
    res.status(201).json(new ApiResponse_1.ApiResponse(201, banner, 'Banner created successfully'));
});
exports.getAllBanners = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { page = 1, limit = 10, isActive } = req.query;
    const filter = {};
    if (isActive !== undefined)
        filter.isActive = isActive === 'true';
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Number(limit));
    const skip = (pageNum - 1) * limitNum;
    const banners = await banner_model_1.Banner.find(filter).skip(skip).limit(limitNum).sort({ displayOrder: 1, createdAt: -1 });
    const total = await banner_model_1.Banner.countDocuments(filter);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, { banners, pagination: { total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) } }, 'Banners retrieved successfully'));
});
exports.getBannerById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const banner = await banner_model_1.Banner.findById(id);
    if (!banner)
        throw new ApiError_1.ApiError(404, 'Banner not found');
    res.status(200).json(new ApiResponse_1.ApiResponse(200, banner, 'Banner retrieved successfully'));
});
exports.updateBanner = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const banner = await banner_model_1.Banner.findByIdAndUpdate(id, req.body, { new: true });
    if (!banner)
        throw new ApiError_1.ApiError(404, 'Banner not found');
    res.status(200).json(new ApiResponse_1.ApiResponse(200, banner, 'Banner updated successfully'));
});
exports.deleteBanner = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const banner = await banner_model_1.Banner.findByIdAndDelete(id);
    if (!banner)
        throw new ApiError_1.ApiError(404, 'Banner not found');
    res.status(200).json(new ApiResponse_1.ApiResponse(200, null, 'Banner deleted successfully'));
});

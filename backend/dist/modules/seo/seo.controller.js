"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSeo = exports.getPageSeo = exports.createSeo = void 0;
const seo_model_1 = require("./seo.model");
const ApiResponse_1 = require("../../utils/ApiResponse");
const ApiError_1 = require("../../utils/ApiError");
const catchAsync_1 = require("../../utils/catchAsync");
exports.createSeo = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const seo = await seo_model_1.Seo.create(req.body);
    res.status(201).json(new ApiResponse_1.ApiResponse(201, seo, 'SEO meta config created successfully'));
});
exports.getPageSeo = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { page } = req.query;
    const seo = await seo_model_1.Seo.findOne({ page: page });
    if (!seo)
        throw new ApiError_1.ApiError(404, 'SEO configurations not found for this page');
    res.status(200).json(new ApiResponse_1.ApiResponse(200, seo, 'SEO configurations retrieved'));
});
exports.updateSeo = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const seo = await seo_model_1.Seo.findByIdAndUpdate(id, req.body, { new: true });
    if (!seo)
        throw new ApiError_1.ApiError(404, 'SEO config not found');
    res.status(200).json(new ApiResponse_1.ApiResponse(200, seo, 'SEO config updated successfully'));
});

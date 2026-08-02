"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePage = exports.updatePage = exports.getPageById = exports.getAllPages = exports.createPage = void 0;
const page_model_1 = require("./page.model");
const ApiResponse_1 = require("../../utils/ApiResponse");
const ApiError_1 = require("../../utils/ApiError");
const catchAsync_1 = require("../../utils/catchAsync");
const slugify_1 = __importDefault(require("slugify"));
exports.createPage = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const pageData = { ...req.body };
    if (!pageData.slug) {
        pageData.slug = (0, slugify_1.default)(pageData.title, { lower: true, strict: true });
    }
    const page = await page_model_1.Page.create(pageData);
    res.status(201).json(new ApiResponse_1.ApiResponse(201, page, 'Page created successfully'));
});
exports.getAllPages = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { page = 1, limit = 10, search, status, pageType } = req.query;
    const filter = {};
    if (search)
        filter.title = new RegExp(search, 'i');
    if (status)
        filter.status = status;
    if (pageType)
        filter.pageType = pageType;
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Number(limit));
    const skip = (pageNum - 1) * limitNum;
    const pages = await page_model_1.Page.find(filter).skip(skip).limit(limitNum).sort({ createdAt: -1 });
    const total = await page_model_1.Page.countDocuments(filter);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, { pages, pagination: { total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) } }, 'Pages retrieved successfully'));
});
exports.getPageById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = req.params.id;
    const isId = /^[0-9a-fA-F]{24}$/.test(id);
    const page = isId ? await page_model_1.Page.findById(id) : await page_model_1.Page.findOne({ slug: id.toLowerCase() });
    if (!page)
        throw new ApiError_1.ApiError(404, 'Page not found');
    res.status(200).json(new ApiResponse_1.ApiResponse(200, page, 'Page retrieved successfully'));
});
exports.updatePage = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = req.params.id;
    const page = await page_model_1.Page.findById(id);
    if (!page)
        throw new ApiError_1.ApiError(404, 'Page not found');
    if (req.body.title && !req.body.slug) {
        req.body.slug = (0, slugify_1.default)(req.body.title, { lower: true, strict: true });
    }
    Object.assign(page, req.body);
    await page.save();
    res.status(200).json(new ApiResponse_1.ApiResponse(200, page, 'Page updated successfully'));
});
exports.deletePage = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = req.params.id;
    const page = await page_model_1.Page.findByIdAndDelete(id);
    if (!page)
        throw new ApiError_1.ApiError(404, 'Page not found');
    res.status(200).json(new ApiResponse_1.ApiResponse(200, null, 'Page deleted successfully'));
});

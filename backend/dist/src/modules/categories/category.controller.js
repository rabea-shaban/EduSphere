"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.updateCategory = exports.getCategoryById = exports.getAllCategories = exports.createCategory = void 0;
const category_model_1 = require("./category.model");
const ApiResponse_1 = require("../../utils/ApiResponse");
const ApiError_1 = require("../../utils/ApiError");
const catchAsync_1 = require("../../utils/catchAsync");
const slugify_1 = __importDefault(require("slugify"));
/**
 * Create a new Category.
 */
exports.createCategory = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const categoryData = { ...req.body };
    if (!categoryData.slug) {
        categoryData.slug = (0, slugify_1.default)(categoryData.name, { lower: true, strict: true });
    }
    // Bind organizationId if admin
    if (req.user && !categoryData.organizationId) {
        categoryData.organizationId = req.user.organizationId;
    }
    const category = await category_model_1.Category.create(categoryData);
    res.status(201).json(new ApiResponse_1.ApiResponse(201, category, 'Category created successfully'));
});
/**
 * Get all categories with query filters and pagination.
 */
exports.getAllCategories = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { page = 1, limit = 10, search, type, organizationId } = req.query;
    const filter = {};
    if (search) {
        filter.name = new RegExp(search, 'i');
    }
    if (type) {
        filter.type = type;
    }
    if (organizationId) {
        filter.organizationId = organizationId;
    }
    else if (req.user && req.user.organizationId) {
        filter.organizationId = req.user.organizationId;
    }
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Number(limit));
    const skip = (pageNum - 1) * limitNum;
    const categories = await category_model_1.Category.find(filter)
        .sort({ name: 1 })
        .skip(skip)
        .limit(limitNum);
    const total = await category_model_1.Category.countDocuments(filter);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, {
        categories,
        pagination: {
            total,
            page: pageNum,
            limit: limitNum,
            totalPages: Math.ceil(total / limitNum),
        },
    }, 'Categories retrieved successfully'));
});
/**
 * Get Category by ID or Slug.
 */
exports.getCategoryById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = req.params.id;
    const isId = /^[0-9a-fA-F]{24}$/.test(id);
    const category = isId
        ? await category_model_1.Category.findById(id)
        : await category_model_1.Category.findOne({ slug: id.toLowerCase() });
    if (!category) {
        throw new ApiError_1.ApiError(404, 'Category not found');
    }
    res.status(200).json(new ApiResponse_1.ApiResponse(200, category, 'Category retrieved successfully'));
});
/**
 * Update Category.
 */
exports.updateCategory = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = req.params.id;
    const category = await category_model_1.Category.findById(id);
    if (!category) {
        throw new ApiError_1.ApiError(404, 'Category not found');
    }
    if (req.body.name && !req.body.slug) {
        req.body.slug = (0, slugify_1.default)(req.body.name, { lower: true, strict: true });
    }
    Object.assign(category, req.body);
    await category.save();
    res.status(200).json(new ApiResponse_1.ApiResponse(200, category, 'Category updated successfully'));
});
/**
 * Delete Category.
 */
exports.deleteCategory = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = req.params.id;
    const category = await category_model_1.Category.findByIdAndDelete(id);
    if (!category) {
        throw new ApiError_1.ApiError(404, 'Category not found');
    }
    res.status(200).json(new ApiResponse_1.ApiResponse(200, null, 'Category deleted successfully'));
});
exports.default = exports.createCategory;

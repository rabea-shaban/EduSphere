"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBlog = exports.updateBlog = exports.getBlogById = exports.getAllBlogs = exports.createBlog = void 0;
const blog_model_1 = require("./blog.model");
const ApiResponse_1 = require("../../utils/ApiResponse");
const ApiError_1 = require("../../utils/ApiError");
const catchAsync_1 = require("../../utils/catchAsync");
const slugify_1 = __importDefault(require("slugify"));
exports.createBlog = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const blogData = { ...req.body };
    if (!blogData.authorId && req.user)
        blogData.authorId = req.user._id;
    if (!blogData.slug)
        blogData.slug = (0, slugify_1.default)(blogData.title, { lower: true, strict: true });
    const blog = await blog_model_1.Blog.create(blogData);
    res.status(201).json(new ApiResponse_1.ApiResponse(201, blog, 'Blog post created successfully'));
});
exports.getAllBlogs = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { page = 1, limit = 10, search, categoryId, status } = req.query;
    const filter = {};
    if (search)
        filter.title = new RegExp(search, 'i');
    if (categoryId)
        filter.categoryId = categoryId;
    if (status)
        filter.status = status;
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Number(limit));
    const skip = (pageNum - 1) * limitNum;
    const blogs = await blog_model_1.Blog.find(filter).populate('authorId', 'firstName lastName avatar').populate('categoryId', 'name').skip(skip).limit(limitNum).sort({ createdAt: -1 });
    const total = await blog_model_1.Blog.countDocuments(filter);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, { blogs, pagination: { total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) } }, 'Blogs retrieved successfully'));
});
exports.getBlogById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = req.params.id;
    const isId = /^[0-9a-fA-F]{24}$/.test(id);
    const blog = isId
        ? await blog_model_1.Blog.findByIdAndUpdate(id, { $inc: { views: 1 } }, { new: true })
        : await blog_model_1.Blog.findOneAndUpdate({ slug: id.toLowerCase() }, { $inc: { views: 1 } }, { new: true });
    if (!blog)
        throw new ApiError_1.ApiError(404, 'Blog not found');
    const populated = await blog.populate('authorId', 'firstName lastName avatar');
    res.status(200).json(new ApiResponse_1.ApiResponse(200, populated, 'Blog retrieved successfully'));
});
exports.updateBlog = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = req.params.id;
    const blog = await blog_model_1.Blog.findById(id);
    if (!blog)
        throw new ApiError_1.ApiError(404, 'Blog not found');
    if (req.user && req.user.role === 'TEACHER' && blog.authorId.toString() !== req.user._id.toString()) {
        throw new ApiError_1.ApiError(403, 'You do not have permission to modify this blog');
    }
    if (req.body.title && !req.body.slug) {
        req.body.slug = (0, slugify_1.default)(req.body.title, { lower: true, strict: true });
    }
    Object.assign(blog, req.body);
    await blog.save();
    res.status(200).json(new ApiResponse_1.ApiResponse(200, blog, 'Blog post updated successfully'));
});
exports.deleteBlog = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = req.params.id;
    const blog = await blog_model_1.Blog.findById(id);
    if (!blog)
        throw new ApiError_1.ApiError(404, 'Blog not found');
    if (req.user && req.user.role === 'TEACHER' && blog.authorId.toString() !== req.user._id.toString()) {
        throw new ApiError_1.ApiError(403, 'You do not have permission to delete this blog');
    }
    await blog.deleteOne();
    res.status(200).json(new ApiResponse_1.ApiResponse(200, null, 'Blog post deleted successfully'));
});

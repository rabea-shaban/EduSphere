import { Request, Response } from 'express';
import { Blog } from './blog.model';
import { ApiResponse } from '../../utils/ApiResponse';
import { ApiError } from '../../utils/ApiError';
import { catchAsync } from '../../utils/catchAsync';
import slugify from 'slugify';

export const createBlog = catchAsync(async (req: Request, res: Response) => {
  const blogData = { ...req.body };
  if (!blogData.authorId && req.user) blogData.authorId = req.user._id;
  if (!blogData.slug) blogData.slug = slugify(blogData.title, { lower: true, strict: true });

  const blog = await Blog.create(blogData);
  res.status(201).json(new ApiResponse(201, blog, 'Blog post created successfully'));
});

export const getAllBlogs = catchAsync(async (req: Request, res: Response) => {
  const { page = 1, limit = 10, search, categoryId, status } = req.query;
  const filter: any = {};
  if (search) filter.title = new RegExp(search as string, 'i');
  if (categoryId) filter.categoryId = categoryId;
  if (status) filter.status = status;

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.max(1, Number(limit));
  const skip = (pageNum - 1) * limitNum;

  const blogs = await Blog.find(filter).populate('authorId', 'firstName lastName avatar').populate('categoryId', 'name').skip(skip).limit(limitNum).sort({ createdAt: -1 });
  const total = await Blog.countDocuments(filter);

  res.status(200).json(new ApiResponse(200, { blogs, pagination: { total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) } }, 'Blogs retrieved successfully'));
});

export const getBlogById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const isId = /^[0-9a-fA-F]{24}$/.test(id);

  const blog = isId
    ? await Blog.findByIdAndUpdate(id, { $inc: { views: 1 } }, { new: true })
    : await Blog.findOneAndUpdate({ slug: id.toLowerCase() }, { $inc: { views: 1 } }, { new: true });

  if (!blog) throw new ApiError(404, 'Blog not found');

  const populated = await blog.populate('authorId', 'firstName lastName avatar');
  res.status(200).json(new ApiResponse(200, populated, 'Blog retrieved successfully'));
});

export const updateBlog = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const blog = await Blog.findById(id);
  if (!blog) throw new ApiError(404, 'Blog not found');

  if (req.user && req.user.role === 'TEACHER' && blog.authorId.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'You do not have permission to modify this blog');
  }

  if (req.body.title && !req.body.slug) {
    req.body.slug = slugify(req.body.title, { lower: true, strict: true });
  }

  Object.assign(blog, req.body);
  await blog.save();
  res.status(200).json(new ApiResponse(200, blog, 'Blog post updated successfully'));
});

export const deleteBlog = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const blog = await Blog.findById(id);
  if (!blog) throw new ApiError(404, 'Blog not found');

  if (req.user && req.user.role === 'TEACHER' && blog.authorId.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'You do not have permission to delete this blog');
  }

  await blog.deleteOne();
  res.status(200).json(new ApiResponse(200, null, 'Blog post deleted successfully'));
});

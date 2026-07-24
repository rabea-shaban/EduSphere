import { Request, Response } from 'express';
import { Category } from './category.model';
import { ApiResponse } from '../../utils/ApiResponse';
import { ApiError } from '../../utils/ApiError';
import { catchAsync } from '../../utils/catchAsync';
import slugify from 'slugify';

/**
 * Create a new Category.
 */
export const createCategory = catchAsync(async (req: Request, res: Response) => {
  const categoryData = { ...req.body };
  if (!categoryData.slug) {
    categoryData.slug = slugify(categoryData.name, { lower: true, strict: true });
  }

  // Bind organizationId if admin
  if (req.user && !categoryData.organizationId) {
    categoryData.organizationId = (req.user as any).organizationId;
  }

  const category = await Category.create(categoryData);
  res.status(201).json(new ApiResponse(201, category, 'Category created successfully'));
});

/**
 * Get all categories with query filters and pagination.
 */
export const getAllCategories = catchAsync(async (req: Request, res: Response) => {
  const { page = 1, limit = 10, search, type, organizationId } = req.query;
  const filter: any = {};

  if (search) {
    filter.name = new RegExp(search as string, 'i');
  }
  if (type) {
    filter.type = type;
  }
  if (organizationId) {
    filter.organizationId = organizationId;
  } else if (req.user && (req.user as any).organizationId) {
    filter.organizationId = (req.user as any).organizationId;
  }

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.max(1, Number(limit));
  const skip = (pageNum - 1) * limitNum;

  const categories = await Category.find(filter)
    .sort({ name: 1 })
    .skip(skip)
    .limit(limitNum);

  const total = await Category.countDocuments(filter);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        categories,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum),
        },
      },
      'Categories retrieved successfully'
    )
  );
});

/**
 * Get Category by ID or Slug.
 */
export const getCategoryById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const isId = /^[0-9a-fA-F]{24}$/.test(id);

  const category = isId
    ? await Category.findById(id)
    : await Category.findOne({ slug: id.toLowerCase() });

  if (!category) {
    throw new ApiError(404, 'Category not found');
  }

  res.status(200).json(new ApiResponse(200, category, 'Category retrieved successfully'));
});

/**
 * Update Category.
 */
export const updateCategory = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const category = await Category.findById(id);

  if (!category) {
    throw new ApiError(404, 'Category not found');
  }

  if (req.body.name && !req.body.slug) {
    req.body.slug = slugify(req.body.name, { lower: true, strict: true });
  }

  Object.assign(category, req.body);
  await category.save();

  res.status(200).json(new ApiResponse(200, category, 'Category updated successfully'));
});

/**
 * Delete Category.
 */
export const deleteCategory = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const category = await Category.findByIdAndDelete(id);

  if (!category) {
    throw new ApiError(404, 'Category not found');
  }

  res.status(200).json(new ApiResponse(200, null, 'Category deleted successfully'));
});
export default createCategory;

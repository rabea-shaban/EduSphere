import { Request, Response } from 'express';
import { Page } from './page.model';
import { ApiResponse } from '../../utils/ApiResponse';
import { ApiError } from '../../utils/ApiError';
import { catchAsync } from '../../utils/catchAsync';
import slugify from 'slugify';

export const createPage = catchAsync(async (req: Request, res: Response) => {
  const pageData = { ...req.body };
  if (!pageData.slug) {
    pageData.slug = slugify(pageData.title, { lower: true, strict: true });
  }
  const page = await Page.create(pageData);
  res.status(201).json(new ApiResponse(201, page, 'Page created successfully'));
});

export const getAllPages = catchAsync(async (req: Request, res: Response) => {
  const { page = 1, limit = 10, search, status, pageType } = req.query;
  const filter: any = {};
  if (search) filter.title = new RegExp(search as string, 'i');
  if (status) filter.status = status;
  if (pageType) filter.pageType = pageType;

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.max(1, Number(limit));
  const skip = (pageNum - 1) * limitNum;

  const pages = await Page.find(filter).skip(skip).limit(limitNum).sort({ createdAt: -1 });
  const total = await Page.countDocuments(filter);

  res.status(200).json(new ApiResponse(200, { pages, pagination: { total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) } }, 'Pages retrieved successfully'));
});

export const getPageById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const isId = /^[0-9a-fA-F]{24}$/.test(id);
  const page = isId ? await Page.findById(id) : await Page.findOne({ slug: id.toLowerCase() });
  if (!page) throw new ApiError(404, 'Page not found');
  res.status(200).json(new ApiResponse(200, page, 'Page retrieved successfully'));
});

export const updatePage = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const page = await Page.findById(id);
  if (!page) throw new ApiError(404, 'Page not found');

  if (req.body.title && !req.body.slug) {
    req.body.slug = slugify(req.body.title, { lower: true, strict: true });
  }
  Object.assign(page, req.body);
  await page.save();
  res.status(200).json(new ApiResponse(200, page, 'Page updated successfully'));
});

export const deletePage = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const page = await Page.findByIdAndDelete(id);
  if (!page) throw new ApiError(404, 'Page not found');
  res.status(200).json(new ApiResponse(200, null, 'Page deleted successfully'));
});

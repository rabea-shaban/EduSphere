import { Request, Response } from 'express';
import { Testimonial } from './testimonial.model';
import { ApiResponse } from '../../utils/ApiResponse';
import { ApiError } from '../../utils/ApiError';
import { catchAsync } from '../../utils/catchAsync';

export const createTestimonial = catchAsync(async (req: Request, res: Response) => {
  const testimonial = await Testimonial.create(req.body);
  res.status(201).json(new ApiResponse(201, testimonial, 'Testimonial created successfully'));
});

export const getAllTestimonials = catchAsync(async (req: Request, res: Response) => {
  const { page = 1, limit = 10, isApproved, courseId } = req.query;
  const filter: any = {};
  if (isApproved !== undefined) filter.isApproved = isApproved === 'true';
  if (courseId) filter.courseId = courseId;

  // Students/Public only see approved testimonials
  if (!req.user || req.user.role === 'STUDENT') {
    filter.isApproved = true;
  }

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.max(1, Number(limit));
  const skip = (pageNum - 1) * limitNum;

  const testimonials = await Testimonial.find(filter).populate('courseId', 'title').skip(skip).limit(limitNum).sort({ createdAt: -1 });
  const total = await Testimonial.countDocuments(filter);

  res.status(200).json(new ApiResponse(200, { testimonials, pagination: { total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) } }, 'Testimonials retrieved successfully'));
});

export const updateTestimonial = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const testimonial = await Testimonial.findByIdAndUpdate(id, req.body, { new: true });
  if (!testimonial) throw new ApiError(404, 'Testimonial not found');
  res.status(200).json(new ApiResponse(200, testimonial, 'Testimonial updated successfully'));
});

export const approveTestimonial = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const testimonial = await Testimonial.findByIdAndUpdate(id, { isApproved: true }, { new: true });
  if (!testimonial) throw new ApiError(404, 'Testimonial not found');
  res.status(200).json(new ApiResponse(200, testimonial, 'Testimonial approved successfully'));
});

export const deleteTestimonial = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const testimonial = await Testimonial.findByIdAndDelete(id);
  if (!testimonial) throw new ApiError(404, 'Testimonial not found');
  res.status(200).json(new ApiResponse(200, null, 'Testimonial deleted successfully'));
});

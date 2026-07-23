import { Request, Response } from 'express';
import { AcademicYear } from './academicYear.model';
import { ApiResponse } from '../../utils/ApiResponse';
import { ApiError } from '../../utils/ApiError';
import { catchAsync } from '../../utils/catchAsync';

/**
 * Create a new Academic Year.
 */
export const createAcademicYear = catchAsync(async (req: Request, res: Response) => {
  const { title } = req.body;

  const existingYear = await AcademicYear.findOne({ title });
  if (existingYear) {
    throw new ApiError(400, 'Academic year with this title already exists');
  }

  const year = await AcademicYear.create(req.body);
  res.status(201).json(new ApiResponse(201, year, 'Academic Year created successfully'));
});

/**
 * Get all Academic Years with search, pagination, sorting, and status filters.
 */
export const getAllAcademicYears = catchAsync(async (req: Request, res: Response) => {
  const { page = 1, limit = 10, search, status, sort, isCurrent } = req.query;
  const filter: any = {};

  if (search) {
    filter.title = new RegExp(search as string, 'i');
  }

  if (status) {
    filter.status = status;
  }

  if (isCurrent !== undefined) {
    filter.isCurrent = isCurrent === 'true';
  }

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.max(1, Number(limit));
  const skip = (pageNum - 1) * limitNum;

  // Sorting
  let sortBy: any = { createdAt: -1 };
  if (sort) {
    const sortParts = (sort as string).split(':');
    sortBy = { [sortParts[0]]: sortParts[1] === 'desc' ? -1 : 1 };
  }

  const years = await AcademicYear.find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limitNum);

  const total = await AcademicYear.countDocuments(filter);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        academicYears: years,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum),
        },
      },
      'Academic Years retrieved successfully'
    )
  );
});

/**
 * Get Academic Year by ID.
 */
export const getAcademicYearById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const year = await AcademicYear.findById(id);

  if (!year) {
    throw new ApiError(404, 'Academic Year not found');
  }

  res.status(200).json(new ApiResponse(200, year, 'Academic Year retrieved successfully'));
});

/**
 * Update Academic Year details.
 */
export const updateAcademicYear = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const year = await AcademicYear.findById(id);
  if (!year) {
    throw new ApiError(404, 'Academic Year not found');
  }

  const { title } = req.body;
  if (title && title !== year.title) {
    const duplicateTitle = await AcademicYear.findOne({ title });
    if (duplicateTitle) {
      throw new ApiError(400, 'Academic year with this title already exists');
    }
  }

  // Update properties and save (triggers hooks)
  Object.assign(year, req.body);
  await year.save();

  res.status(200).json(new ApiResponse(200, year, 'Academic Year updated successfully'));
});

/**
 * Delete Academic Year.
 */
export const deleteAcademicYear = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const year = await AcademicYear.findByIdAndDelete(id);
  if (!year) {
    throw new ApiError(404, 'Academic Year not found');
  }

  res.status(200).json(new ApiResponse(200, null, 'Academic Year deleted successfully'));
});

/**
 * Activate an Academic Year.
 */
export const activateAcademicYear = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const year = await AcademicYear.findById(id);
  if (!year) {
    throw new ApiError(404, 'Academic Year not found');
  }

  year.status = 'ACTIVE';
  await year.save();

  res.status(200).json(new ApiResponse(200, year, 'Academic Year activated successfully'));
});

/**
 * Deactivate an Academic Year.
 */
export const deactivateAcademicYear = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const year = await AcademicYear.findById(id);
  if (!year) {
    throw new ApiError(404, 'Academic Year not found');
  }

  year.status = 'INACTIVE';
  await year.save();

  res.status(200).json(new ApiResponse(200, year, 'Academic Year deactivated successfully'));
});

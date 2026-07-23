import { Request, Response } from 'express';
import { Term } from './term.model';
import { ApiResponse } from '../../utils/ApiResponse';
import { ApiError } from '../../utils/ApiError';
import { catchAsync } from '../../utils/catchAsync';

/**
 * Create a new Term.
 */
export const createTerm = catchAsync(async (req: Request, res: Response) => {
  const { name, order } = req.body;

  // Check unique constraints
  const duplicate = await Term.findOne({
    $or: [{ name }, { order }],
  });

  if (duplicate) {
    if (duplicate.name === name) {
      throw new ApiError(400, 'Term name already exists');
    }
    if (duplicate.order === order) {
      throw new ApiError(400, 'Term order already taken');
    }
  }

  const term = await Term.create(req.body);
  res.status(201).json(new ApiResponse(201, term, 'Term created successfully'));
});

/**
 * Get all Terms with filtering, search, pagination, and sorting.
 */
export const getAllTerms = catchAsync(async (req: Request, res: Response) => {
  const { page = 1, limit = 10, search, isActive, sort } = req.query;
  const filter: any = {};

  if (search) {
    filter.name = new RegExp(search as string, 'i');
  }

  if (isActive !== undefined) {
    filter.isActive = isActive === 'true';
  }

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.max(1, Number(limit));
  const skip = (pageNum - 1) * limitNum;

  // Default sorting by order ascending
  let sortBy: any = { order: 1 };
  if (sort) {
    const sortParts = (sort as string).split(':');
    sortBy = { [sortParts[0]]: sortParts[1] === 'desc' ? -1 : 1 };
  }

  const terms = await Term.find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limitNum);

  const total = await Term.countDocuments(filter);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        terms,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum),
        },
      },
      'Terms retrieved successfully'
    )
  );
});

/**
 * Get Term by ID.
 */
export const getTermById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const term = await Term.findById(id);

  if (!term) {
    throw new ApiError(404, 'Term not found');
  }

  res.status(200).json(new ApiResponse(200, term, 'Term retrieved successfully'));
});

/**
 * Update Term details.
 */
export const updateTerm = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const term = await Term.findById(id);
  if (!term) {
    throw new ApiError(404, 'Term not found');
  }

  const { name, order } = req.body;
  const orConditions: any[] = [];
  if (name && name !== term.name) {
    orConditions.push({ name });
  }
  if (order && order !== term.order) {
    orConditions.push({ order });
  }

  if (orConditions.length > 0) {
    const duplicate = await Term.findOne({ $or: orConditions });
    if (duplicate) {
      if (name && duplicate.name === name) {
        throw new ApiError(400, 'Term name already exists');
      }
      if (order && duplicate.order === order) {
        throw new ApiError(400, 'Term order already taken');
      }
    }
  }

  Object.assign(term, req.body);
  await term.save();

  res.status(200).json(new ApiResponse(200, term, 'Term updated successfully'));
});

/**
 * Delete Term.
 */
export const deleteTerm = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const term = await Term.findByIdAndDelete(id);
  if (!term) {
    throw new ApiError(404, 'Term not found');
  }

  res.status(200).json(new ApiResponse(200, null, 'Term deleted successfully'));
});

/**
 * Activate Term.
 */
export const activateTerm = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const term = await Term.findByIdAndUpdate(id, { isActive: true }, { new: true });
  if (!term) {
    throw new ApiError(404, 'Term not found');
  }

  res.status(200).json(new ApiResponse(200, term, 'Term activated successfully'));
});

/**
 * Deactivate Term.
 */
export const deactivateTerm = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const term = await Term.findByIdAndUpdate(id, { isActive: false }, { new: true });
  if (!term) {
    throw new ApiError(404, 'Term not found');
  }

  res.status(200).json(new ApiResponse(200, term, 'Term deactivated successfully'));
});

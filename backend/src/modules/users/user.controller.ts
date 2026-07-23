import { Request, Response } from 'express';
import { User } from './user.model';
import { ApiResponse } from '../../utils/ApiResponse';
import { ApiError } from '../../utils/ApiError';
import { catchAsync } from '../../utils/catchAsync';

/**
 * Create a new user.
 */
export const createUser = catchAsync(async (req: Request, res: Response) => {
  const { username, email, phone } = req.body;

  // Check unique constraints manually for nicer error messages (or rely on DB indexes)
  const existingUser = await User.findOne({
    $or: [{ username: username.toLowerCase() }, { email: email.toLowerCase() }, { phone }],
  });

  if (existingUser) {
    if (existingUser.username === username.toLowerCase()) {
      throw new ApiError(400, 'Username is already taken');
    }
    if (existingUser.email === email.toLowerCase()) {
      throw new ApiError(400, 'Email address is already in use');
    }
    if (existingUser.phone === phone) {
      throw new ApiError(400, 'Phone number is already registered');
    }
  }

  const user = await User.create(req.body);
  const userResponse = user.toObject();
  delete userResponse.password; // Exclude password from response payload

  res.status(201).json(new ApiResponse(201, userResponse, 'User created successfully'));
});

/**
 * Get all users with query filters, search, and pagination.
 */
export const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const { page = 1, limit = 10, search, role, isBlocked } = req.query;
  const filter: any = {};

  if (search) {
    const searchRegex = new RegExp(search as string, 'i');
    filter.$or = [
      { firstName: searchRegex },
      { lastName: searchRegex },
      { username: searchRegex },
      { email: searchRegex },
    ];
  }

  if (role) {
    filter.role = role;
  }

  if (isBlocked !== undefined) {
    filter.isBlocked = isBlocked === 'true';
  }

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.max(1, Number(limit));
  const skip = (pageNum - 1) * limitNum;

  const users = await User.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum);

  const total = await User.countDocuments(filter);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        users,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum),
        },
      },
      'Users retrieved successfully'
    )
  );
});

/**
 * Get user by id.
 */
export const getUserById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await User.findById(id);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  res.status(200).json(new ApiResponse(200, user, 'User retrieved successfully'));
});

/**
 * Update user details by id.
 */
export const updateUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  // Find the user first to trigger pre-save hooks (for password hashing)
  const user = await User.findById(id);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const { username, email, phone } = req.body;

  // Check unique constraints for fields changing
  const orConditions: any[] = [];
  if (username && username.toLowerCase() !== user.username) {
    orConditions.push({ username: username.toLowerCase() });
  }
  if (email && email.toLowerCase() !== user.email) {
    orConditions.push({ email: email.toLowerCase() });
  }
  if (phone && phone !== user.phone) {
    orConditions.push({ phone });
  }

  if (orConditions.length > 0) {
    const duplicateUser = await User.findOne({ $or: orConditions });
    if (duplicateUser) {
      if (username && duplicateUser.username === username.toLowerCase()) {
        throw new ApiError(400, 'Username is already taken');
      }
      if (email && duplicateUser.email === email.toLowerCase()) {
        throw new ApiError(400, 'Email address is already in use');
      }
      if (phone && duplicateUser.phone === phone) {
        throw new ApiError(400, 'Phone number is already registered');
      }
    }
  }

  // Update fields
  Object.assign(user, req.body);
  await user.save();

  const updatedUserResponse = user.toObject();
  delete updatedUserResponse.password;

  res.status(200).json(new ApiResponse(200, updatedUserResponse, 'User updated successfully'));
});

/**
 * Soft delete user.
 */
export const softDeleteUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await User.findById(id);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  user.deletedAt = new Date();
  await user.save();

  res.status(200).json(new ApiResponse(200, null, 'User soft-deleted successfully'));
});

/**
 * Restore a soft-deleted user.
 */
export const restoreUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  // Find user bypassing the soft-delete filter
  const user = await User.findById(id).setOptions({ withDeleted: true });

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  if (!user.deletedAt) {
    throw new ApiError(400, 'User is not deleted');
  }

  user.deletedAt = null;
  await user.save();

  const userResponse = user.toObject();
  delete userResponse.password;

  res.status(200).json(new ApiResponse(200, userResponse, 'User restored successfully'));
});

/**
 * Permanently delete user from database.
 */
export const permanentDeleteUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  // Perform hard delete bypassing pre-find hook
  const result = await User.deleteOne({ _id: id }).setOptions({ withDeleted: true });

  if (result.deletedCount === 0) {
    throw new ApiError(404, 'User not found');
  }

  res.status(200).json(new ApiResponse(200, null, 'User permanently deleted'));
});

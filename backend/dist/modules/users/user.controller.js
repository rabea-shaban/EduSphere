"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.permanentDeleteUser = exports.restoreUser = exports.softDeleteUser = exports.updateUser = exports.getUserById = exports.getAllUsers = exports.createUser = void 0;
const user_model_1 = require("./user.model");
const ApiResponse_1 = require("../../utils/ApiResponse");
const ApiError_1 = require("../../utils/ApiError");
const catchAsync_1 = require("../../utils/catchAsync");
/**
 * Create a new user.
 */
exports.createUser = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { username, email, phone } = req.body;
    // Check unique constraints manually for nicer error messages (or rely on DB indexes)
    const existingUser = await user_model_1.User.findOne({
        $or: [{ username: username.toLowerCase() }, { email: email.toLowerCase() }, { phone }],
    });
    if (existingUser) {
        if (existingUser.username === username.toLowerCase()) {
            throw new ApiError_1.ApiError(400, 'Username is already taken');
        }
        if (existingUser.email === email.toLowerCase()) {
            throw new ApiError_1.ApiError(400, 'Email address is already in use');
        }
        if (existingUser.phone === phone) {
            throw new ApiError_1.ApiError(400, 'Phone number is already registered');
        }
    }
    const user = await user_model_1.User.create(req.body);
    const userResponse = user.toObject();
    delete userResponse.password; // Exclude password from response payload
    res.status(201).json(new ApiResponse_1.ApiResponse(201, userResponse, 'User created successfully'));
});
/**
 * Get all users with query filters, search, and pagination.
 */
exports.getAllUsers = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { page = 1, limit = 10, search, role, isBlocked } = req.query;
    const filter = {};
    if (search) {
        const searchRegex = new RegExp(search, 'i');
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
    const users = await user_model_1.User.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum);
    const total = await user_model_1.User.countDocuments(filter);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, {
        users,
        pagination: {
            total,
            page: pageNum,
            limit: limitNum,
            totalPages: Math.ceil(total / limitNum),
        },
    }, 'Users retrieved successfully'));
});
/**
 * Get user by id.
 */
exports.getUserById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const user = await user_model_1.User.findById(id);
    if (!user) {
        throw new ApiError_1.ApiError(404, 'User not found');
    }
    res.status(200).json(new ApiResponse_1.ApiResponse(200, user, 'User retrieved successfully'));
});
/**
 * Update user details by id.
 */
exports.updateUser = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    // Find the user first to trigger pre-save hooks (for password hashing)
    const user = await user_model_1.User.findById(id);
    if (!user) {
        throw new ApiError_1.ApiError(404, 'User not found');
    }
    const { username, email, phone } = req.body;
    // Check unique constraints for fields changing
    const orConditions = [];
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
        const duplicateUser = await user_model_1.User.findOne({ $or: orConditions });
        if (duplicateUser) {
            if (username && duplicateUser.username === username.toLowerCase()) {
                throw new ApiError_1.ApiError(400, 'Username is already taken');
            }
            if (email && duplicateUser.email === email.toLowerCase()) {
                throw new ApiError_1.ApiError(400, 'Email address is already in use');
            }
            if (phone && duplicateUser.phone === phone) {
                throw new ApiError_1.ApiError(400, 'Phone number is already registered');
            }
        }
    }
    // Update fields
    Object.assign(user, req.body);
    await user.save();
    const updatedUserResponse = user.toObject();
    delete updatedUserResponse.password;
    res.status(200).json(new ApiResponse_1.ApiResponse(200, updatedUserResponse, 'User updated successfully'));
});
/**
 * Soft delete user.
 */
exports.softDeleteUser = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const user = await user_model_1.User.findById(id);
    if (!user) {
        throw new ApiError_1.ApiError(404, 'User not found');
    }
    user.deletedAt = new Date();
    await user.save();
    res.status(200).json(new ApiResponse_1.ApiResponse(200, null, 'User soft-deleted successfully'));
});
/**
 * Restore a soft-deleted user.
 */
exports.restoreUser = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    // Find user bypassing the soft-delete filter
    const user = await user_model_1.User.findById(id).setOptions({ withDeleted: true });
    if (!user) {
        throw new ApiError_1.ApiError(404, 'User not found');
    }
    if (!user.deletedAt) {
        throw new ApiError_1.ApiError(400, 'User is not deleted');
    }
    user.deletedAt = null;
    await user.save();
    const userResponse = user.toObject();
    delete userResponse.password;
    res.status(200).json(new ApiResponse_1.ApiResponse(200, userResponse, 'User restored successfully'));
});
/**
 * Permanently delete user from database.
 */
exports.permanentDeleteUser = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    // Perform hard delete bypassing pre-find hook
    const result = await user_model_1.User.deleteOne({ _id: id }).setOptions({ withDeleted: true });
    if (result.deletedCount === 0) {
        throw new ApiError_1.ApiError(404, 'User not found');
    }
    res.status(200).json(new ApiResponse_1.ApiResponse(200, null, 'User permanently deleted'));
});

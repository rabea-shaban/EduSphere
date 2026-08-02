"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivateTerm = exports.activateTerm = exports.deleteTerm = exports.updateTerm = exports.getTermById = exports.getAllTerms = exports.createTerm = void 0;
const term_model_1 = require("./term.model");
const ApiResponse_1 = require("../../utils/ApiResponse");
const ApiError_1 = require("../../utils/ApiError");
const catchAsync_1 = require("../../utils/catchAsync");
/**
 * Create a new Term.
 */
exports.createTerm = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { name, order } = req.body;
    // Check unique constraints
    const duplicate = await term_model_1.Term.findOne({
        $or: [{ name }, { order }],
    });
    if (duplicate) {
        if (duplicate.name === name) {
            throw new ApiError_1.ApiError(400, 'Term name already exists');
        }
        if (duplicate.order === order) {
            throw new ApiError_1.ApiError(400, 'Term order already taken');
        }
    }
    const term = await term_model_1.Term.create(req.body);
    res.status(201).json(new ApiResponse_1.ApiResponse(201, term, 'Term created successfully'));
});
/**
 * Get all Terms with filtering, search, pagination, and sorting.
 */
exports.getAllTerms = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { page = 1, limit = 10, search, isActive, sort } = req.query;
    const filter = {};
    if (search) {
        filter.name = new RegExp(search, 'i');
    }
    if (isActive !== undefined) {
        filter.isActive = isActive === 'true';
    }
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Number(limit));
    const skip = (pageNum - 1) * limitNum;
    // Default sorting by order ascending
    let sortBy = { order: 1 };
    if (sort) {
        const sortParts = sort.split(':');
        sortBy = { [sortParts[0]]: sortParts[1] === 'desc' ? -1 : 1 };
    }
    const terms = await term_model_1.Term.find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limitNum);
    const total = await term_model_1.Term.countDocuments(filter);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, {
        terms,
        pagination: {
            total,
            page: pageNum,
            limit: limitNum,
            totalPages: Math.ceil(total / limitNum),
        },
    }, 'Terms retrieved successfully'));
});
/**
 * Get Term by ID.
 */
exports.getTermById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const term = await term_model_1.Term.findById(id);
    if (!term) {
        throw new ApiError_1.ApiError(404, 'Term not found');
    }
    res.status(200).json(new ApiResponse_1.ApiResponse(200, term, 'Term retrieved successfully'));
});
/**
 * Update Term details.
 */
exports.updateTerm = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const term = await term_model_1.Term.findById(id);
    if (!term) {
        throw new ApiError_1.ApiError(404, 'Term not found');
    }
    const { name, order } = req.body;
    const orConditions = [];
    if (name && name !== term.name) {
        orConditions.push({ name });
    }
    if (order && order !== term.order) {
        orConditions.push({ order });
    }
    if (orConditions.length > 0) {
        const duplicate = await term_model_1.Term.findOne({ $or: orConditions });
        if (duplicate) {
            if (name && duplicate.name === name) {
                throw new ApiError_1.ApiError(400, 'Term name already exists');
            }
            if (order && duplicate.order === order) {
                throw new ApiError_1.ApiError(400, 'Term order already taken');
            }
        }
    }
    Object.assign(term, req.body);
    await term.save();
    res.status(200).json(new ApiResponse_1.ApiResponse(200, term, 'Term updated successfully'));
});
/**
 * Delete Term.
 */
exports.deleteTerm = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const term = await term_model_1.Term.findByIdAndDelete(id);
    if (!term) {
        throw new ApiError_1.ApiError(404, 'Term not found');
    }
    res.status(200).json(new ApiResponse_1.ApiResponse(200, null, 'Term deleted successfully'));
});
/**
 * Activate Term.
 */
exports.activateTerm = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const term = await term_model_1.Term.findByIdAndUpdate(id, { isActive: true }, { new: true });
    if (!term) {
        throw new ApiError_1.ApiError(404, 'Term not found');
    }
    res.status(200).json(new ApiResponse_1.ApiResponse(200, term, 'Term activated successfully'));
});
/**
 * Deactivate Term.
 */
exports.deactivateTerm = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const term = await term_model_1.Term.findByIdAndUpdate(id, { isActive: false }, { new: true });
    if (!term) {
        throw new ApiError_1.ApiError(404, 'Term not found');
    }
    res.status(200).json(new ApiResponse_1.ApiResponse(200, term, 'Term deactivated successfully'));
});

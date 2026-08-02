"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMenu = exports.updateMenu = exports.getAllMenus = exports.createMenu = void 0;
const menu_model_1 = require("./menu.model");
const ApiResponse_1 = require("../../utils/ApiResponse");
const ApiError_1 = require("../../utils/ApiError");
const catchAsync_1 = require("../../utils/catchAsync");
exports.createMenu = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const menu = await menu_model_1.Menu.create(req.body);
    res.status(201).json(new ApiResponse_1.ApiResponse(201, menu, 'Menu item created successfully'));
});
exports.getAllMenus = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { page = 1, limit = 100, isActive } = req.query;
    const filter = {};
    if (isActive !== undefined)
        filter.isActive = isActive === 'true';
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Number(limit));
    const skip = (pageNum - 1) * limitNum;
    const menus = await menu_model_1.Menu.find(filter).populate('parentId', 'title').skip(skip).limit(limitNum).sort({ displayOrder: 1, createdAt: 1 });
    const total = await menu_model_1.Menu.countDocuments(filter);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, { menus, pagination: { total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) } }, 'Menus retrieved successfully'));
});
exports.updateMenu = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const menu = await menu_model_1.Menu.findByIdAndUpdate(id, req.body, { new: true });
    if (!menu)
        throw new ApiError_1.ApiError(404, 'Menu item not found');
    res.status(200).json(new ApiResponse_1.ApiResponse(200, menu, 'Menu item updated successfully'));
});
exports.deleteMenu = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const menu = await menu_model_1.Menu.findByIdAndDelete(id);
    if (!menu)
        throw new ApiError_1.ApiError(404, 'Menu item not found');
    res.status(200).json(new ApiResponse_1.ApiResponse(200, null, 'Menu item deleted successfully'));
});

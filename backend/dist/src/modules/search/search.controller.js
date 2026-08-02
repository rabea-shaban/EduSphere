"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSearchSuggestions = exports.globalSearch = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const ApiResponse_1 = require("../../utils/ApiResponse");
const ApiError_1 = require("../../utils/ApiError");
const search_service_1 = require("./search.service");
const getReqInfo = (req) => {
    const forwarded = req.headers['x-forwarded-for'];
    const rawIp = Array.isArray(forwarded) ? forwarded[0] : forwarded;
    return {
        ipAddress: rawIp || req.socket.remoteAddress || '127.0.0.1',
        userAgent: req.headers['user-agent'] || 'Unknown Agent',
        userName: req.user ? `${req.user.firstName} ${req.user.lastName}` : undefined,
        userRole: req.user?.role,
    };
};
/**
 * GET /teacher/search/global
 */
exports.globalSearch = (0, catchAsync_1.catchAsync)(async (req, res) => {
    if (!req.user)
        throw new ApiError_1.ApiError(401, 'غير مصرح بالوصول');
    const q = String(req.query.q || req.query.search || '');
    const reqInfo = getReqInfo(req);
    const results = await search_service_1.SearchService.globalSearch(req.user._id, q, reqInfo);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, results, 'تم جلب نتائج البحث العالمي بنجاح'));
});
/**
 * GET /teacher/search/suggestions
 */
exports.getSearchSuggestions = (0, catchAsync_1.catchAsync)(async (req, res) => {
    if (!req.user)
        throw new ApiError_1.ApiError(401, 'غير مصرح بالوصول');
    const q = String(req.query.q || req.query.search || '');
    const suggestions = await search_service_1.SearchService.getSuggestions(req.user._id, q);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, suggestions, 'تم جلب اقتراحات البحث بنجاح'));
});

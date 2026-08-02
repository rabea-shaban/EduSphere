"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.previewFile = exports.downloadFile = exports.restoreFile = exports.deleteFile = exports.updateFileMetadata = exports.getFileById = exports.getFileStats = exports.getTeacherFiles = exports.uploadMultipleFiles = exports.uploadSingleFile = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const ApiResponse_1 = require("../../utils/ApiResponse");
const ApiError_1 = require("../../utils/ApiError");
const fileAsset_service_1 = require("./fileAsset.service");
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
 * POST /teacher/files/upload
 */
exports.uploadSingleFile = (0, catchAsync_1.catchAsync)(async (req, res) => {
    if (!req.user)
        throw new ApiError_1.ApiError(401, 'غير مصرح بالوصول');
    if (!req.file)
        throw new ApiError_1.ApiError(400, 'يرجى تحديد ملف للرفع');
    const reqInfo = getReqInfo(req);
    const result = await fileAsset_service_1.FileAssetService.uploadSingleFile(req.file, req.user._id, req.body, reqInfo);
    res.status(201).json(new ApiResponse_1.ApiResponse(201, result, 'تم رفع الملف بنجاح'));
});
/**
 * POST /teacher/files/upload-multiple
 */
exports.uploadMultipleFiles = (0, catchAsync_1.catchAsync)(async (req, res) => {
    if (!req.user)
        throw new ApiError_1.ApiError(401, 'غير مصرح بالوصول');
    const files = req.files;
    if (!files || files.length === 0)
        throw new ApiError_1.ApiError(400, 'يرجى تحديد ملفات للرفع');
    const reqInfo = getReqInfo(req);
    const results = await fileAsset_service_1.FileAssetService.uploadMultipleFiles(files, req.user._id, req.body, reqInfo);
    res.status(201).json(new ApiResponse_1.ApiResponse(201, results, 'تم رفع الملفات بنجاح'));
});
/**
 * GET /teacher/files
 */
exports.getTeacherFiles = (0, catchAsync_1.catchAsync)(async (req, res) => {
    if (!req.user)
        throw new ApiError_1.ApiError(401, 'غير مصرح بالوصول');
    const result = await fileAsset_service_1.FileAssetService.getTeacherFiles(req.user._id, req.query);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, result, 'تم جلب قائمة الملفات بنجاح'));
});
/**
 * GET /teacher/files/stats
 */
exports.getFileStats = (0, catchAsync_1.catchAsync)(async (req, res) => {
    if (!req.user)
        throw new ApiError_1.ApiError(401, 'غير مصرح بالوصول');
    const stats = await fileAsset_service_1.FileAssetService.getFileStats(req.user._id);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, stats, 'تم جلب إحصائيات التخزين بنجاح'));
});
/**
 * GET /teacher/files/:id
 */
exports.getFileById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    if (!req.user)
        throw new ApiError_1.ApiError(401, 'غير مصرح بالوصول');
    const file = await fileAsset_service_1.FileAssetService.getFileById(req.params.id, req.user._id);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, file, 'تم جلب تفاصيل الملف بنجاح'));
});
/**
 * PATCH /teacher/files/:id
 */
exports.updateFileMetadata = (0, catchAsync_1.catchAsync)(async (req, res) => {
    if (!req.user)
        throw new ApiError_1.ApiError(401, 'غير مصرح بالوصول');
    const reqInfo = getReqInfo(req);
    const updatedFile = await fileAsset_service_1.FileAssetService.updateFileMetadata(req.params.id, req.user._id, req.body, reqInfo);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, updatedFile, 'تم تحديث بيانات الملف بنجاح'));
});
/**
 * DELETE /teacher/files/:id
 */
exports.deleteFile = (0, catchAsync_1.catchAsync)(async (req, res) => {
    if (!req.user)
        throw new ApiError_1.ApiError(401, 'غير مصرح بالوصول');
    const reqInfo = getReqInfo(req);
    const isPermanent = req.query.permanent === 'true';
    const result = await fileAsset_service_1.FileAssetService.softDeleteFile(req.params.id, req.user._id, isPermanent, reqInfo);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, result, isPermanent ? 'تم حذف الملف نهائياً' : 'تم نقل الملف إلى سلة المهملات'));
});
/**
 * PATCH /teacher/files/:id/restore
 */
exports.restoreFile = (0, catchAsync_1.catchAsync)(async (req, res) => {
    if (!req.user)
        throw new ApiError_1.ApiError(401, 'غير مصرح بالوصول');
    const reqInfo = getReqInfo(req);
    const restoredFile = await fileAsset_service_1.FileAssetService.restoreFile(req.params.id, req.user._id, reqInfo);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, restoredFile, 'تم استعادة الملف بنجاح'));
});
/**
 * GET /teacher/files/:id/download
 */
exports.downloadFile = (0, catchAsync_1.catchAsync)(async (req, res) => {
    if (!req.user)
        throw new ApiError_1.ApiError(401, 'غير مصرح بالوصول');
    const reqInfo = getReqInfo(req);
    const downloadInfo = await fileAsset_service_1.FileAssetService.getDownloadStream(req.params.id, req.user._id, reqInfo);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, downloadInfo, 'تم تجهيز رابط التحميل بنجاح'));
});
/**
 * GET /teacher/files/:id/preview
 */
exports.previewFile = (0, catchAsync_1.catchAsync)(async (req, res) => {
    if (!req.user)
        throw new ApiError_1.ApiError(401, 'غير مصرح بالوصول');
    const file = await fileAsset_service_1.FileAssetService.getFileById(req.params.id, req.user._id);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, {
        id: file._id,
        originalName: file.originalName,
        publicUrl: file.publicUrl,
        secureUrl: file.secureUrl,
        category: file.category,
        mimeType: file.mimeType,
        metadata: file.metadata,
    }, 'تم جلب معاينة الملف بنجاح'));
});

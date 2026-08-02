"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFileAsset = exports.uploadAnyFile = exports.uploadDocumentFile = exports.uploadVideoFile = exports.uploadImageFile = void 0;
const r2_service_1 = require("../../services/r2.service");
const ApiResponse_1 = require("../../utils/ApiResponse");
const ApiError_1 = require("../../utils/ApiError");
const catchAsync_1 = require("../../utils/catchAsync");
const uploadFolders_1 = require("../../constants/uploadFolders");
/**
 * Handle Image Upload (Avatars, Thumbnails, CMS, Logos, Certificates) via Cloudflare R2
 */
exports.uploadImageFile = (0, catchAsync_1.catchAsync)(async (req, res) => {
    if (!req.file) {
        throw new ApiError_1.ApiError(400, 'الرجاء اختيار صورة رفع صالحة');
    }
    const folder = req.body.folder || uploadFolders_1.UploadFolders.THUMBNAIL;
    const result = await r2_service_1.r2Service.uploadFile({ file: req.file, folder });
    res.status(201).json(new ApiResponse_1.ApiResponse(201, {
        url: result.url,
        key: result.key,
        originalName: result.originalName,
        mimeType: result.mimetype,
        size: result.size,
    }, 'تم رفع الصورة بنجاح'));
});
/**
 * Handle Video Upload (Course Videos, Lessons, Demo Videos) via Cloudflare R2
 */
exports.uploadVideoFile = (0, catchAsync_1.catchAsync)(async (req, res) => {
    if (!req.file) {
        throw new ApiError_1.ApiError(400, 'الرجاء اختيار ملف فيديو صالح');
    }
    const folder = req.body.folder || uploadFolders_1.UploadFolders.VIDEO;
    const result = await r2_service_1.r2Service.uploadFile({ file: req.file, folder });
    res.status(201).json(new ApiResponse_1.ApiResponse(201, {
        url: result.url,
        key: result.key,
        originalName: result.originalName,
        mimeType: result.mimetype,
        size: result.size,
    }, 'تم رفع الفيديو بنجاح'));
});
/**
 * Handle Document Upload (PDF, DOCX, ZIP, PPTX, XLS) via Cloudflare R2
 */
exports.uploadDocumentFile = (0, catchAsync_1.catchAsync)(async (req, res) => {
    if (!req.file) {
        throw new ApiError_1.ApiError(400, 'الرجاء اختيار ملف مستند صالح');
    }
    const folder = req.body.folder || uploadFolders_1.UploadFolders.LESSON;
    const result = await r2_service_1.r2Service.uploadFile({ file: req.file, folder });
    res.status(201).json(new ApiResponse_1.ApiResponse(201, {
        url: result.url,
        key: result.key,
        originalName: result.originalName,
        mimeType: result.mimetype,
        size: result.size,
    }, 'تم رفع المستند بنجاح'));
});
/**
 * Handle Any File Upload (Images, Videos, PDFs, Voice, Archives) via Cloudflare R2
 */
exports.uploadAnyFile = (0, catchAsync_1.catchAsync)(async (req, res) => {
    if (!req.file) {
        throw new ApiError_1.ApiError(400, 'الرجاء اختيار ملف صالح للرفع');
    }
    const folder = req.body.folder || 'chat';
    const result = await r2_service_1.r2Service.uploadFile({ file: req.file, folder });
    res.status(201).json(new ApiResponse_1.ApiResponse(201, {
        url: result.url,
        key: result.key,
        originalName: result.originalName,
        mimeType: result.mimetype,
        size: result.size,
    }, 'تم رفع الملف بنجاح إلى Cloudflare R2'));
});
/**
 * Delete asset from Cloudflare R2
 */
exports.deleteFileAsset = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const key = String(req.params.publicId || req.params.key || req.query.key || '');
    if (!key) {
        throw new ApiError_1.ApiError(400, 'معرف المفتاح (key) مطلوب للحذف');
    }
    await r2_service_1.r2Service.deleteFile(key);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, { key }, 'تم حذف الملف بنجاح من Cloudflare R2'));
});

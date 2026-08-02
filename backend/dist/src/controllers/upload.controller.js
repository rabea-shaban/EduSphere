"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.streamFileFromR2 = exports.uploadAnyFile = exports.deleteFileByKey = exports.uploadMultiple = exports.uploadVideo = exports.uploadPdf = exports.uploadImage = void 0;
const r2_service_1 = require("../services/r2.service");
const fileValidator_1 = require("../utils/fileValidator");
const uploadFolders_1 = require("../constants/uploadFolders");
const catchAsync_1 = require("../utils/catchAsync");
const ApiError_1 = require("../utils/ApiError");
const fileAsset_model_1 = require("../modules/upload/fileAsset.model");
/**
 * Helper function to save file metadata into MongoDB
 */
async function saveMetadataToMongoDB(result, category, req) {
    try {
        const userId = req.user?._id;
        if (!userId)
            return; // Skip DB asset tracking if unauthenticated upload
        const catMap = {
            IMAGE: 'image',
            DOCUMENT: 'document',
            VIDEO: 'video',
            ARCHIVE: 'archive',
        };
        const assetCategory = catMap[category] || 'other';
        const ext = result.key ? result.key.split('.').pop() || 'bin' : 'bin';
        await fileAsset_model_1.FileAsset.create({
            owner: userId,
            originalName: result.originalName || 'file',
            storedName: result.key,
            publicUrl: result.url,
            secureUrl: result.url,
            fileSize: result.size,
            extension: ext,
            mimeType: result.mimetype,
            category: assetCategory,
            cloudProvider: 'r2',
            cloudProviderId: result.key,
        });
    }
    catch (err) {
        // Log MongoDB error without failing R2 file upload response
        console.warn('⚠️ Warning: File upload succeeded to R2, but MongoDB metadata recording failed:', err);
    }
}
/**
 * POST /upload/image
 * Upload single image (jpg, png, webp, svg) max 10MB
 */
exports.uploadImage = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const file = req.file;
    if (!file) {
        throw new ApiError_1.ApiError(400, 'No image file uploaded');
    }
    // Validate image
    const validation = (0, fileValidator_1.validateFile)(file, 'IMAGE');
    if (!validation.isValid) {
        throw new ApiError_1.ApiError(400, validation.error || 'Invalid image file');
    }
    const folder = req.body.folder || uploadFolders_1.UploadFolders.THUMBNAIL;
    const result = await r2_service_1.r2Service.uploadFile({ file, folder });
    // Save metadata to MongoDB
    await saveMetadataToMongoDB(result, 'IMAGE', req);
    res.status(200).json({
        success: true,
        message: 'File uploaded successfully',
        data: result,
    });
});
/**
 * POST /upload/pdf
 * Upload single document/PDF max 20MB
 */
exports.uploadPdf = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const file = req.file;
    if (!file) {
        throw new ApiError_1.ApiError(400, 'No PDF or document file uploaded');
    }
    // Validate document
    const validation = (0, fileValidator_1.validateFile)(file, 'DOCUMENT');
    if (!validation.isValid) {
        throw new ApiError_1.ApiError(400, validation.error || 'Invalid document file');
    }
    const folder = req.body.folder || uploadFolders_1.UploadFolders.LESSON;
    const result = await r2_service_1.r2Service.uploadFile({ file, folder });
    // Save metadata to MongoDB
    await saveMetadataToMongoDB(result, 'DOCUMENT', req);
    res.status(200).json({
        success: true,
        message: 'File uploaded successfully',
        data: result,
    });
});
/**
 * POST /upload/video
 * Upload single video max 500MB
 */
exports.uploadVideo = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const file = req.file;
    if (!file) {
        throw new ApiError_1.ApiError(400, 'No video file uploaded');
    }
    // Validate video
    const validation = (0, fileValidator_1.validateFile)(file, 'VIDEO');
    if (!validation.isValid) {
        throw new ApiError_1.ApiError(400, validation.error || 'Invalid video file');
    }
    const folder = req.body.folder || uploadFolders_1.UploadFolders.VIDEO;
    const result = await r2_service_1.r2Service.uploadFile({ file, folder });
    // Save metadata to MongoDB
    await saveMetadataToMongoDB(result, 'VIDEO', req);
    res.status(200).json({
        success: true,
        message: 'File uploaded successfully',
        data: result,
    });
});
/**
 * POST /upload/multiple
 * Upload multiple files to Cloudflare R2
 */
exports.uploadMultiple = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const files = req.files;
    if (!files || files.length === 0) {
        throw new ApiError_1.ApiError(400, 'No files uploaded');
    }
    // Validate all files
    for (const file of files) {
        const validation = (0, fileValidator_1.validateFile)(file);
        if (!validation.isValid) {
            throw new ApiError_1.ApiError(400, `File ${file.originalname}: ${validation.error}`);
        }
    }
    const folder = req.body.folder || uploadFolders_1.UploadFolders.COURSE;
    const results = await r2_service_1.r2Service.uploadMultipleFiles(files, folder);
    // Save metadata for all files in MongoDB
    for (const resItem of results) {
        await saveMetadataToMongoDB(resItem, 'GENERAL', req);
    }
    res.status(200).json({
        success: true,
        message: 'Files uploaded successfully',
        data: results,
    });
});
/**
 * DELETE /upload/:key* or DELETE /upload
 * Delete file from Cloudflare R2 and MongoDB
 */
exports.deleteFileByKey = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const keyParam = req.params.key || req.params[0] || req.query.key || req.body.key;
    if (!keyParam) {
        throw new ApiError_1.ApiError(400, 'Object key is required for deletion');
    }
    const key = decodeURIComponent(keyParam);
    await r2_service_1.r2Service.deleteFile(key);
    // Remove from MongoDB
    try {
        await fileAsset_model_1.FileAsset.deleteOne({ $or: [{ storedName: key }, { publicUrl: key }, { secureUrl: key }] });
    }
    catch (err) {
        console.warn('⚠️ Warning: File deleted from R2, but MongoDB record deletion failed:', err);
    }
    res.status(200).json({
        success: true,
        message: 'File deleted successfully from Cloudflare R2',
        data: { key },
    });
});
/**
 * POST /upload/file
 * Upload any file type (image, video, document, audio, archive) max 100MB
 * Used for chat attachments stored on Cloudflare R2
 */
exports.uploadAnyFile = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const file = req.file;
    if (!file) {
        throw new ApiError_1.ApiError(400, 'No file uploaded');
    }
    const folder = req.body.folder || 'chat';
    const result = await r2_service_1.r2Service.uploadFile({ file, folder });
    // Detect category from mimetype
    let category = 'GENERAL';
    if (file.mimetype.startsWith('image/'))
        category = 'IMAGE';
    else if (file.mimetype.startsWith('video/'))
        category = 'VIDEO';
    else if (file.mimetype.startsWith('audio/'))
        category = 'AUDIO';
    else if (file.mimetype.includes('pdf') || file.mimetype.includes('document') || file.mimetype.includes('officedocument'))
        category = 'DOCUMENT';
    // Save metadata to MongoDB
    await saveMetadataToMongoDB(result, category, req);
    res.status(200).json({
        success: true,
        message: 'File uploaded successfully to Cloudflare R2',
        data: result,
    });
});
/**
 * GET /upload/file/*key or GET /upload/file/:key
 * Stream object directly from Cloudflare R2 to client
 */
exports.streamFileFromR2 = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const keyParam = req.params.key || req.params[0] || req.query.key;
    if (!keyParam) {
        throw new ApiError_1.ApiError(400, 'Object key is required');
    }
    const keyStr = Array.isArray(keyParam) ? keyParam[0] : String(keyParam);
    const key = decodeURIComponent(keyStr);
    const r2Object = await r2_service_1.r2Service.getFileObject(key);
    if (r2Object.ContentType) {
        res.setHeader('Content-Type', r2Object.ContentType);
    }
    if (r2Object.ContentLength) {
        res.setHeader('Content-Length', r2Object.ContentLength);
    }
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    if (r2Object.Body) {
        const stream = r2Object.Body;
        if (typeof stream.pipe === 'function') {
            return stream.pipe(res);
        }
        if (typeof stream.transformToByteArray === 'function') {
            const byteArray = await stream.transformToByteArray();
            return res.send(Buffer.from(byteArray));
        }
    }
    res.status(404).json({ success: false, message: 'File stream unavailable' });
});

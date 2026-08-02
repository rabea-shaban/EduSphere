"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteResourceFile = exports.getLessonResources = exports.uploadResourceFile = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const resource_model_1 = require("./resource.model");
const cloudinary_1 = require("../../config/cloudinary");
const ApiResponse_1 = require("../../utils/ApiResponse");
const ApiError_1 = require("../../utils/ApiError");
const catchAsync_1 = require("../../utils/catchAsync");
/**
 * Handle resource creation (file upload or external links).
 */
exports.uploadResourceFile = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { title, description, lessonId, courseId, resourceType, downloadable, url } = req.body;
    let fileUrl = url;
    let publicId = '';
    let size = 0;
    let extension = '';
    if (resourceType === 'External Link') {
        if (!url) {
            throw new ApiError_1.ApiError(400, 'URL is required for External Link resources');
        }
    }
    else {
        // Expect a file upload
        if (!req.file) {
            throw new ApiError_1.ApiError(400, 'Please upload a resource file');
        }
        try {
            // 1. Upload local temporary file to Cloudinary
            const uploadResult = await (0, cloudinary_1.uploadResourceToCloudinary)(req.file.path, resourceType);
            fileUrl = uploadResult.secure_url;
            publicId = uploadResult.public_id;
            size = req.file.size;
            extension = path_1.default.extname(req.file.originalname);
        }
        finally {
            // 2. Always delete local temporary file immediately
            fs_1.default.promises.unlink(req.file.path).catch((err) => {
                console.error(`[Upload Cleanup] Failed to delete local temp file at ${req.file?.path}:`, err);
            });
        }
    }
    // 3. Create resource document in database
    const resource = await resource_model_1.Resource.create({
        lessonId,
        courseId,
        title,
        description,
        resourceType,
        url: fileUrl,
        publicId,
        size,
        extension,
        downloadable: downloadable === undefined ? true : (downloadable === 'true' || downloadable === true),
    });
    res.status(201).json(new ApiResponse_1.ApiResponse(201, resource, 'Resource created successfully'));
});
/**
 * Get all resources of a lesson.
 */
exports.getLessonResources = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { lessonId } = req.params;
    const resources = await resource_model_1.Resource.find({ lessonId });
    res.status(200).json(new ApiResponse_1.ApiResponse(200, resources, 'Lesson resources retrieved successfully'));
});
/**
 * Delete a resource from database and storage.
 */
exports.deleteResourceFile = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const resource = await resource_model_1.Resource.findById(id);
    if (!resource) {
        throw new ApiError_1.ApiError(404, 'Resource not found');
    }
    // 1. Delete asset from Cloudinary
    if (resource.publicId) {
        const isImage = resource.resourceType === 'Image';
        const cloudinaryResourceType = isImage ? 'image' : 'raw';
        await (0, cloudinary_1.deleteFromCloudinary)(resource.publicId, cloudinaryResourceType);
    }
    // 2. Delete document from database
    await resource.deleteOne();
    res.status(200).json(new ApiResponse_1.ApiResponse(200, null, 'Resource file deleted successfully'));
});

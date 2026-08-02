"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.publishVideoFile = exports.deleteVideoFile = exports.updateVideoMetadata = exports.getVideoById = exports.getAllVideos = exports.uploadVideoFile = void 0;
const fs_1 = __importDefault(require("fs"));
const video_model_1 = require("./video.model");
const cloudinary_1 = require("../../config/cloudinary");
const ApiResponse_1 = require("../../utils/ApiResponse");
const ApiError_1 = require("../../utils/ApiError");
const catchAsync_1 = require("../../utils/catchAsync");
/**
 * Handle video upload and metadata creation.
 */
exports.uploadVideoFile = (0, catchAsync_1.catchAsync)(async (req, res) => {
    if (!req.file) {
        throw new ApiError_1.ApiError(400, 'Please upload a video file');
    }
    const { title, description, lessonId, courseId, isPreview, isPublished, captions } = req.body;
    let uploadResult;
    try {
        // 1. Upload local temporary file to Cloudinary
        uploadResult = await (0, cloudinary_1.uploadVideoToCloudinary)(req.file.path);
    }
    finally {
        // 2. Always delete local temporary file immediately to conserve space
        fs_1.default.promises.unlink(req.file.path).catch((err) => {
            console.error(`[Upload Cleanup] Failed to delete local temp file at ${req.file?.path}:`, err);
        });
    }
    // 3. Create video document in database
    const video = await video_model_1.Video.create({
        lessonId,
        courseId,
        title,
        description,
        provider: 'Cloudinary',
        videoUrl: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        duration: uploadResult.duration,
        quality: uploadResult.quality,
        isPreview: isPreview === 'true' || isPreview === true,
        isPublished: isPublished === undefined ? true : (isPublished === 'true' || isPublished === true),
        captions: captions ? (typeof captions === 'string' ? JSON.parse(captions) : captions) : [],
    });
    res.status(201).json(new ApiResponse_1.ApiResponse(201, video, 'Video uploaded successfully'));
});
/**
 * Get all videos with filters and pagination.
 */
exports.getAllVideos = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { page = 1, limit = 10, courseId, lessonId, search, isPublished } = req.query;
    const filter = {};
    if (courseId)
        filter.courseId = courseId;
    if (lessonId)
        filter.lessonId = lessonId;
    if (isPublished !== undefined)
        filter.isPublished = isPublished === 'true';
    if (search)
        filter.title = new RegExp(search, 'i');
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Number(limit));
    const skip = (pageNum - 1) * limitNum;
    const videos = await video_model_1.Video.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum);
    const total = await video_model_1.Video.countDocuments(filter);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, {
        videos,
        pagination: {
            total,
            page: pageNum,
            limit: limitNum,
            totalPages: Math.ceil(total / limitNum),
        },
    }, 'Videos retrieved successfully'));
});
/**
 * Get Video by ID.
 */
exports.getVideoById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const video = await video_model_1.Video.findById(id);
    if (!video) {
        throw new ApiError_1.ApiError(404, 'Video not found');
    }
    res.status(200).json(new ApiResponse_1.ApiResponse(200, video, 'Video retrieved successfully'));
});
/**
 * Update video metadata.
 */
exports.updateVideoMetadata = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const video = await video_model_1.Video.findById(id);
    if (!video) {
        throw new ApiError_1.ApiError(404, 'Video not found');
    }
    Object.assign(video, req.body);
    await video.save();
    res.status(200).json(new ApiResponse_1.ApiResponse(200, video, 'Video details updated successfully'));
});
/**
 * Delete video from database and delete from Cloudinary storage.
 */
exports.deleteVideoFile = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const video = await video_model_1.Video.findById(id);
    if (!video) {
        throw new ApiError_1.ApiError(404, 'Video not found');
    }
    // 1. Delete asset from Cloudinary
    if (video.publicId) {
        await (0, cloudinary_1.deleteFromCloudinary)(video.publicId, 'video');
    }
    // 2. Delete document from database
    await video.deleteOne();
    res.status(200).json(new ApiResponse_1.ApiResponse(200, null, 'Video file deleted successfully'));
});
/**
 * Publish video.
 */
exports.publishVideoFile = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const video = await video_model_1.Video.findByIdAndUpdate(id, { isPublished: true }, { new: true });
    if (!video) {
        throw new ApiError_1.ApiError(404, 'Video not found');
    }
    res.status(200).json(new ApiResponse_1.ApiResponse(200, video, 'Video published successfully'));
});

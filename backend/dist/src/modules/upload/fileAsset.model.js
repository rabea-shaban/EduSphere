"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileAsset = void 0;
const mongoose_1 = require("mongoose");
const fileAssetSchema = new mongoose_1.Schema({
    owner: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'File owner is required'],
        index: true,
    },
    originalName: {
        type: String,
        required: [true, 'Original name is required'],
        trim: true,
    },
    storedName: {
        type: String,
        required: [true, 'Stored name is required'],
        trim: true,
    },
    publicUrl: {
        type: String,
        required: [true, 'Public URL is required'],
    },
    secureUrl: {
        type: String,
        required: [true, 'Secure URL is required'],
    },
    fileSize: {
        type: Number,
        required: [true, 'File size is required'],
        min: 0,
    },
    extension: {
        type: String,
        required: [true, 'File extension is required'],
        lowercase: true,
        trim: true,
    },
    mimeType: {
        type: String,
        required: [true, 'MIME type is required'],
        trim: true,
    },
    category: {
        type: String,
        enum: ['image', 'video', 'document', 'archive', 'audio', 'code', 'other'],
        default: 'other',
        index: true,
    },
    relatedEntity: {
        entityType: {
            type: String,
            enum: ['course', 'lesson', 'assignment', 'profile', 'general'],
            default: 'general',
        },
        entityId: {
            type: mongoose_1.Schema.Types.ObjectId,
        },
    },
    folder: {
        type: String,
        default: 'general',
        trim: true,
        index: true,
    },
    cloudProvider: {
        type: String,
        enum: ['cloudinary', 's3', 'azure', 'local', 'r2'],
        default: 'r2',
    },
    cloudProviderId: {
        type: String,
        trim: true,
    },
    isDeleted: {
        type: Boolean,
        default: false,
        index: true,
    },
    deletedAt: {
        type: Date,
        default: null,
    },
    downloadCount: {
        type: Number,
        default: 0,
        min: 0,
    },
    metadata: {
        width: { type: Number },
        height: { type: Number },
        duration: { type: Number },
        quality: { type: String },
        encoding: { type: String },
    },
}, {
    timestamps: true,
});
// Compound Indexes for fast queries
fileAssetSchema.index({ owner: 1, isDeleted: 1 });
fileAssetSchema.index({ owner: 1, category: 1, isDeleted: 1 });
fileAssetSchema.index({ owner: 1, folder: 1 });
fileAssetSchema.index({ originalName: 'text' });
exports.FileAsset = (0, mongoose_1.model)('FileAsset', fileAssetSchema);
exports.default = exports.FileAsset;

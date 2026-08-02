"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.r2Service = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const r2_1 = require("../config/r2");
const generateFileName_1 = require("../utils/generateFileName");
const ApiError_1 = require("../utils/ApiError");
/**
 * Cloudflare R2 Storage Service
 * Provides production-ready methods for uploading, deleting, and URL generation.
 */
class R2Service {
    /**
     * Constructs public CDN or R2 URL for a given object key
     * Format: https://pub-9d9ed5fae6184a39883cfb2dd345892f.r2.dev/<key>
     */
    getPublicUrl(key) {
        if (!key)
            return '';
        // If key is already a full HTTP URL, return it directly
        if (key.startsWith('http://') || key.startsWith('https://')) {
            return key;
        }
        const cleanKey = key.replace(/^\/+/, '');
        const publicUrlBase = (process.env.R2_PUBLIC_URL || r2_1.R2_PUBLIC_URL || r2_1.R2_PUBLIC_DOMAIN || 'https://pub-9d9ed5fae6184a39883cfb2dd345892f.r2.dev').replace(/\/+$/, '');
        return `${publicUrlBase}/${cleanKey}`;
    }
    /**
     * Stream object from Cloudflare R2 bucket for public file delivery
     */
    async getFileObject(key) {
        if (!key) {
            throw new ApiError_1.ApiError(400, 'Object key is required');
        }
        let cleanKey = key.replace(/^\/+/, '');
        if (cleanKey.includes('/api/v1/upload/file/')) {
            cleanKey = cleanKey.split('/api/v1/upload/file/').pop() || cleanKey;
        }
        try {
            const command = new client_s3_1.GetObjectCommand({
                Bucket: r2_1.R2_BUCKET,
                Key: cleanKey,
            });
            return await r2_1.r2Client.send(command);
        }
        catch (error) {
            console.error('❌ Cloudflare R2 GetObject Error:', error);
            throw new ApiError_1.ApiError(404, `File not found in R2 storage: ${error.message || 'Key missing'}`);
        }
    }
    /**
     * Upload a single file buffer to Cloudflare R2
     */
    async uploadFile({ file, folder = 'general', customFileName }) {
        if (!file || !file.buffer) {
            throw new ApiError_1.ApiError(400, 'Invalid file buffer for R2 upload');
        }
        const key = customFileName
            ? `${folder.replace(/[^a-zA-Z0-9_-]/g, '')}/${customFileName.replace(/^\/+/, '')}`
            : (0, generateFileName_1.generateFileName)(file.originalname, folder);
        try {
            const command = new client_s3_1.PutObjectCommand({
                Bucket: r2_1.R2_BUCKET,
                Key: key,
                Body: file.buffer,
                ContentType: file.mimetype,
                ContentLength: file.size,
                Metadata: {
                    originalName: encodeURIComponent(file.originalname || 'file'),
                    uploadedAt: new Date().toISOString(),
                },
            });
            await r2_1.r2Client.send(command);
            const publicUrl = this.getPublicUrl(key);
            return {
                key,
                url: publicUrl,
                size: file.size,
                mimetype: file.mimetype,
                mimeType: file.mimetype,
                originalName: file.originalname,
            };
        }
        catch (error) {
            console.error('❌ Cloudflare R2 Upload Error:', error);
            throw new ApiError_1.ApiError(500, `Cloudflare R2 storage upload failed: ${error.message || 'Network or configuration error'}`);
        }
    }
    /**
     * Delete an object from Cloudflare R2 bucket by key
     */
    async deleteFile(key) {
        if (!key) {
            throw new ApiError_1.ApiError(400, 'Object key is required for deletion');
        }
        try {
            // Extract key if a full URL was provided
            let objectKey = key;
            if (key.startsWith('http://') || key.startsWith('https://')) {
                const urlObj = new URL(key);
                objectKey = urlObj.pathname.replace(/^\/+/, '');
            }
            const command = new client_s3_1.DeleteObjectCommand({
                Bucket: r2_1.R2_BUCKET,
                Key: objectKey,
            });
            await r2_1.r2Client.send(command);
            return true;
        }
        catch (error) {
            console.error('❌ Cloudflare R2 Deletion Error:', error);
            throw new ApiError_1.ApiError(500, `Failed to delete file from Cloudflare R2: ${error.message}`);
        }
    }
    /**
     * Upload multiple files concurrently to Cloudflare R2
     */
    async uploadMultipleFiles(files, folder = 'general') {
        if (!files || files.length === 0) {
            throw new ApiError_1.ApiError(400, 'No files provided for multi-upload');
        }
        const uploadPromises = files.map((file) => this.uploadFile({ file, folder }));
        return await Promise.all(uploadPromises);
    }
}
exports.r2Service = new R2Service();
exports.default = exports.r2Service;

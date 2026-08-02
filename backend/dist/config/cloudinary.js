"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSecureUrl = exports.deleteFromCloudinary = exports.uploadResourceToCloudinary = exports.uploadVideoToCloudinary = void 0;
const cloudinary_1 = require("cloudinary");
// Configure Cloudinary instance
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'mock_cloud',
    api_key: process.env.CLOUDINARY_API_KEY || 'mock_key',
    api_secret: process.env.CLOUDINARY_API_SECRET || 'mock_secret',
});
// Check if credentials are local defaults / missing
const isMock = !process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET;
if (isMock) {
    console.log('[Cloudinary] WARNING: Missing Cloudinary credentials. Running in OFFLINE/SIMULATION mode.');
}
/**
 * Uploads a video file to Cloudinary.
 */
const uploadVideoToCloudinary = async (filePath) => {
    if (isMock) {
        // Return mock response for testing offline
        return {
            secure_url: `https://res.cloudinary.com/mock_cloud/video/upload/v1700000000/mock-video-${Date.now()}.mp4`,
            public_id: `mock-video-public-id-${Date.now()}`,
            duration: 120, // 2 minutes duration mock
            quality: '720',
        };
    }
    const result = await cloudinary_1.v2.uploader.upload(filePath, {
        resource_type: 'video',
        folder: 'edusphere/videos',
    });
    return {
        secure_url: result.secure_url,
        public_id: result.public_id,
        duration: result.duration ? Math.round(result.duration) : 0,
        quality: result.height ? (result.height >= 1080 ? '1080' : result.height >= 720 ? '720' : result.height >= 480 ? '480' : '360') : '720',
    };
};
exports.uploadVideoToCloudinary = uploadVideoToCloudinary;
/**
 * Uploads a general resource file (PDF, ZIP, Image, Doc) to Cloudinary.
 */
const uploadResourceToCloudinary = async (filePath, resourceType) => {
    if (isMock) {
        // Return mock response for testing offline
        return {
            secure_url: `https://res.cloudinary.com/mock_cloud/raw/upload/v1700000000/mock-resource-${Date.now()}.${resourceType === 'PDF' ? 'pdf' : 'zip'}`,
            public_id: `mock-resource-public-id-${Date.now()}`,
        };
    }
    // Determine Cloudinary resource_type classification
    // raw is used for PDFs, ZIPs, docs, while image is used for png/jpg
    const isImage = ['Image', 'png', 'jpg', 'jpeg', 'gif'].includes(resourceType);
    const cloudinaryResourceType = isImage ? 'image' : 'raw';
    const result = await cloudinary_1.v2.uploader.upload(filePath, {
        resource_type: cloudinaryResourceType,
        folder: 'edusphere/resources',
    });
    return {
        secure_url: result.secure_url,
        public_id: result.public_id,
    };
};
exports.uploadResourceToCloudinary = uploadResourceToCloudinary;
/**
 * Deletes an asset from Cloudinary.
 */
const deleteFromCloudinary = async (publicId, resourceType) => {
    if (isMock) {
        console.log(`[Cloudinary Mock] Deleted asset with publicId: ${publicId}`);
        return { result: 'ok' };
    }
    return await cloudinary_1.v2.uploader.destroy(publicId, {
        resource_type: resourceType,
    });
};
exports.deleteFromCloudinary = deleteFromCloudinary;
/**
 * Generates a secure url for transform options.
 */
const generateSecureUrl = (publicId, options = {}) => {
    return cloudinary_1.v2.url(publicId, {
        secure: true,
        ...options,
    });
};
exports.generateSecureUrl = generateSecureUrl;
exports.default = cloudinary_1.v2;

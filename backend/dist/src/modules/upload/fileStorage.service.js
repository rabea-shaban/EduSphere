"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileStorageService = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const cloudinary_1 = require("../../config/cloudinary");
class FileStorageService {
    /**
     * Determine file category from extension and mime type
     */
    static determineCategory(mimeType, extension) {
        const ext = extension.toLowerCase().replace('.', '');
        const mime = mimeType.toLowerCase();
        if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'].includes(ext) || mime.startsWith('image/')) {
            return 'image';
        }
        if (['mp4', 'mkv', 'avi', 'mov', 'wmv', 'webm'].includes(ext) || mime.startsWith('video/')) {
            return 'video';
        }
        if (['mp3', 'wav', 'ogg', 'm4a', 'aac', 'flac'].includes(ext) || mime.startsWith('audio/')) {
            return 'audio';
        }
        if (['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'rtf', 'csv'].includes(ext) || mime.includes('pdf') || mime.includes('document')) {
            return 'document';
        }
        if (['zip', 'rar', '7z', 'tar', 'gz', 'bz2'].includes(ext) || mime.includes('zip') || mime.includes('compressed')) {
            return 'archive';
        }
        if (['js', 'ts', 'jsx', 'tsx', 'py', 'java', 'c', 'cpp', 'html', 'css', 'json', 'xml', 'sql'].includes(ext)) {
            return 'code';
        }
        return 'other';
    }
    /**
     * Upload file to cloud storage (Cloudinary with local fallback)
     */
    static async uploadFileToStorage(file, _folderName = 'general') {
        const ext = path_1.default.extname(file.originalname).toLowerCase();
        const category = this.determineCategory(file.mimetype, ext);
        const filePathOrBuffer = file.path || file.buffer;
        let uploadResult;
        if (category === 'video') {
            uploadResult = await (0, cloudinary_1.uploadVideoToCloudinary)(filePathOrBuffer);
        }
        else {
            const resourceTypeHint = category === 'image' ? 'Image' : file.mimetype.includes('pdf') ? 'PDF' : 'RAW';
            uploadResult = await (0, cloudinary_1.uploadResourceToCloudinary)(filePathOrBuffer, resourceTypeHint);
        }
        // Clean temp local file if created
        if (file.path && fs_1.default.existsSync(file.path) && !uploadResult.secure_url.includes('/uploads/')) {
            try {
                fs_1.default.unlinkSync(file.path);
            }
            catch (err) {
                console.warn('[FileStorage] Error removing temp file:', err);
            }
        }
        return {
            publicUrl: uploadResult.secure_url,
            secureUrl: uploadResult.secure_url,
            cloudProviderId: uploadResult.public_id || `local-${Date.now()}`,
            cloudProvider: uploadResult.secure_url.includes('cloudinary') ? 'cloudinary' : 'local',
            category,
            metadata: {
                duration: uploadResult.duration,
                quality: uploadResult.quality,
            },
        };
    }
    /**
     * Delete file asset from storage provider
     */
    static async deleteFileFromStorage(cloudProviderId, category) {
        if (!cloudProviderId)
            return;
        const resourceType = category === 'video' ? 'video' : category === 'image' ? 'image' : 'raw';
        await (0, cloudinary_1.deleteFromCloudinary)(cloudProviderId, resourceType).catch((err) => {
            console.warn(`[FileStorage] Deleting asset ${cloudProviderId} failed:`, err);
        });
    }
}
exports.FileStorageService = FileStorageService;

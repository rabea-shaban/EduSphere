import path from 'path';
import fs from 'fs';
import { uploadResourceToCloudinary, uploadVideoToCloudinary, deleteFromCloudinary } from '../../config/cloudinary';
import { FileCategory, CloudProvider } from './fileAsset.interface';

export class FileStorageService {
  /**
   * Determine file category from extension and mime type
   */
  static determineCategory(mimeType: string, extension: string): FileCategory {
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
  static async uploadFileToStorage(
    file: Express.Multer.File,
    _folderName: string = 'general'
  ): Promise<{
    publicUrl: string;
    secureUrl: string;
    cloudProviderId: string;
    cloudProvider: CloudProvider;
    category: FileCategory;
    metadata: { width?: number; height?: number; duration?: number; quality?: string };
  }> {
    const ext = path.extname(file.originalname).toLowerCase();
    const category = this.determineCategory(file.mimetype, ext);
    const filePathOrBuffer = file.path || file.buffer;

    let uploadResult: any;

    if (category === 'video') {
      uploadResult = await uploadVideoToCloudinary(filePathOrBuffer as any);
    } else {
      const resourceTypeHint = category === 'image' ? 'Image' : file.mimetype.includes('pdf') ? 'PDF' : 'RAW';
      uploadResult = await uploadResourceToCloudinary(filePathOrBuffer as any, resourceTypeHint);
    }

    // Clean temp local file if created
    if (file.path && fs.existsSync(file.path) && !uploadResult.secure_url.includes('/uploads/')) {
      try {
        fs.unlinkSync(file.path);
      } catch (err) {
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
  static async deleteFileFromStorage(cloudProviderId: string, category: FileCategory): Promise<void> {
    if (!cloudProviderId) return;
    const resourceType = category === 'video' ? 'video' : category === 'image' ? 'image' : 'raw';
    await deleteFromCloudinary(cloudProviderId, resourceType).catch((err) => {
      console.warn(`[FileStorage] Deleting asset ${cloudProviderId} failed:`, err);
    });
  }
}

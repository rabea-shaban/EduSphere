import { PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { r2Client, R2_BUCKET, R2_PUBLIC_DOMAIN } from '../config/r2';
import { generateFileName } from '../utils/generateFileName';
import { ApiError } from '../utils/ApiError';

export interface R2UploadResult {
  key: string;
  url: string;
  size: number;
  mimetype: string;
  mimeType?: string;
  originalName: string;
}

export interface UploadOptions {
  file: Express.Multer.File;
  folder?: string;
  customFileName?: string;
}

/**
 * Cloudflare R2 Storage Service
 * Provides production-ready methods for uploading, deleting, and URL generation.
 */
class R2Service {
  /**
   * Constructs public CDN or R2 URL for a given object key
   */
  getPublicUrl(key: string): string {
    if (!key) return '';

    // If key is already a full HTTP URL (external/mock), return it directly
    if (key.startsWith('http://') || key.startsWith('https://')) {
      return key;
    }

    const cleanKey = key.replace(/^\/+/, '');

    // Custom CDN domain or public bucket domain (e.g. https://pub-xxx.r2.dev)
    if (R2_PUBLIC_DOMAIN) {
      const baseUrl = R2_PUBLIC_DOMAIN.replace(/\/+$/, '');
      return `${baseUrl}/${cleanKey}`;
    }

    // Proxy stream endpoint for clean local/production HTTP delivery
    const serverUrl = process.env.SERVER_URL || `http://localhost:${process.env.PORT || 5000}`;
    return `${serverUrl.replace(/\/+$/, '')}/api/v1/upload/file/${cleanKey}`;
  }

  /**
   * Stream object from Cloudflare R2 bucket for public file delivery
   */
  async getFileObject(key: string) {
    if (!key) {
      throw new ApiError(400, 'Object key is required');
    }

    let cleanKey = key.replace(/^\/+/, '');
    if (cleanKey.includes('/api/v1/upload/file/')) {
      cleanKey = cleanKey.split('/api/v1/upload/file/').pop() || cleanKey;
    }

    try {
      const command = new GetObjectCommand({
        Bucket: R2_BUCKET,
        Key: cleanKey,
      });

      return await r2Client.send(command);
    } catch (error: any) {
      console.error('❌ Cloudflare R2 GetObject Error:', error);
      throw new ApiError(404, `File not found in R2 storage: ${error.message || 'Key missing'}`);
    }
  }

  /**
   * Upload a single file buffer to Cloudflare R2
   */
  async uploadFile({ file, folder = 'general', customFileName }: UploadOptions): Promise<R2UploadResult> {
    if (!file || !file.buffer) {
      throw new ApiError(400, 'Invalid file buffer for R2 upload');
    }

    const key = customFileName
      ? `${folder.replace(/[^a-zA-Z0-9_-]/g, '')}/${customFileName.replace(/^\/+/, '')}`
      : generateFileName(file.originalname, folder);

    try {
      const command = new PutObjectCommand({
        Bucket: R2_BUCKET,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        ContentLength: file.size,
        Metadata: {
          originalName: encodeURIComponent(file.originalname || 'file'),
          uploadedAt: new Date().toISOString(),
        },
      });

      await r2Client.send(command);

      const publicUrl = this.getPublicUrl(key);

      return {
        key,
        url: publicUrl,
        size: file.size,
        mimetype: file.mimetype,
        mimeType: file.mimetype,
        originalName: file.originalname,
      };
    } catch (error: any) {
      console.error('❌ Cloudflare R2 Upload Error:', error);
      throw new ApiError(
        500,
        `Cloudflare R2 storage upload failed: ${error.message || 'Network or configuration error'}`
      );
    }
  }

  /**
   * Delete an object from Cloudflare R2 bucket by key
   */
  async deleteFile(key: string): Promise<boolean> {
    if (!key) {
      throw new ApiError(400, 'Object key is required for deletion');
    }

    try {
      // Extract key if a full URL was provided
      let objectKey = key;
      if (key.startsWith('http://') || key.startsWith('https://')) {
        const urlObj = new URL(key);
        objectKey = urlObj.pathname.replace(/^\/+/, '');
      }

      const command = new DeleteObjectCommand({
        Bucket: R2_BUCKET,
        Key: objectKey,
      });

      await r2Client.send(command);
      return true;
    } catch (error: any) {
      console.error('❌ Cloudflare R2 Deletion Error:', error);
      throw new ApiError(500, `Failed to delete file from Cloudflare R2: ${error.message}`);
    }
  }

  /**
   * Upload multiple files concurrently to Cloudflare R2
   */
  async uploadMultipleFiles(files: Express.Multer.File[], folder: string = 'general'): Promise<R2UploadResult[]> {
    if (!files || files.length === 0) {
      throw new ApiError(400, 'No files provided for multi-upload');
    }

    const uploadPromises = files.map((file) => this.uploadFile({ file, folder }));
    return await Promise.all(uploadPromises);
  }
}

export const r2Service = new R2Service();
export default r2Service;

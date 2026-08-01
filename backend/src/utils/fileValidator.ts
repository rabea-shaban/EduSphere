/**
 * File Validation Utility
 * Validates file MIME types, file extensions, and strict size limits.
 */

export const FILE_SIZE_LIMITS = {
  IMAGE: 10 * 1024 * 1024, // 10MB
  DOCUMENT: 20 * 1024 * 1024, // 20MB
  ARCHIVE: 50 * 1024 * 1024, // 50MB
  VIDEO: 500 * 1024 * 1024, // 500MB
} as const;

export const ALLOWED_MIME_TYPES = {
  IMAGES: [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/avif',
    'image/gif',
    'image/bmp',
    'image/svg+xml',
    'image/heic',
    'image/heif',
    'image/x-icon',
  ],
  DOCUMENTS: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'text/markdown',
  ],
  ARCHIVES: [
    'application/zip',
    'application/x-zip-compressed',
    'application/x-rar-compressed',
    'application/vnd.rar',
    'application/x-7z-compressed',
  ],
  VIDEOS: [
    'video/mp4',
    'video/webm',
    'video/quicktime', // .mov
    'video/x-msvideo', // .avi
    'video/x-matroska', // .mkv
    'video/ogg',
    'video/3gpp',
  ],
} as const;

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  category?: 'IMAGE' | 'DOCUMENT' | 'ARCHIVE' | 'VIDEO';
}

/**
 * Detect file category based on MIME type or prefix
 */
export function getFileCategory(mimetype: string): 'IMAGE' | 'DOCUMENT' | 'ARCHIVE' | 'VIDEO' | null {
  const mime = mimetype.toLowerCase();

  if (ALLOWED_MIME_TYPES.IMAGES.includes(mime as any) || mime.startsWith('image/')) return 'IMAGE';
  if (ALLOWED_MIME_TYPES.VIDEOS.includes(mime as any) || mime.startsWith('video/')) return 'VIDEO';
  if (ALLOWED_MIME_TYPES.DOCUMENTS.includes(mime as any) || mime.startsWith('application/pdf')) return 'DOCUMENT';
  if (ALLOWED_MIME_TYPES.ARCHIVES.includes(mime as any) || mime.includes('zip') || mime.includes('rar')) return 'ARCHIVE';

  return null;
}

/**
 * Validate file mime type and size against limits
 */
export function validateFile(file: Express.Multer.File, expectedType?: 'IMAGE' | 'DOCUMENT' | 'VIDEO' | 'ARCHIVE'): ValidationResult {
  if (!file) {
    return { isValid: false, error: 'No file provided for validation' };
  }

  const category = getFileCategory(file.mimetype);

  if (!category) {
    return {
      isValid: false,
      error: `Unsupported file type: ${file.mimetype}. Allowed types: images (jpg, png, webp, svg), docs (pdf, doc, docx), archives (zip, rar), videos (mp4, mov, avi).`,
    };
  }

  if (expectedType && category !== expectedType) {
    return {
      isValid: false,
      error: `Invalid file type. Expected ${expectedType.toLowerCase()} file but received ${file.mimetype}`,
    };
  }

  const maxAllowedSize = FILE_SIZE_LIMITS[category];
  if (file.size > maxAllowedSize) {
    const maxMb = maxAllowedSize / (1024 * 1024);
    return {
      isValid: false,
      error: `File size exceeds limit. Maximum allowed size for ${category.toLowerCase()} files is ${maxMb}MB.`,
    };
  }

  return { isValid: true, category };
}

export default {
  FILE_SIZE_LIMITS,
  ALLOWED_MIME_TYPES,
  getFileCategory,
  validateFile,
};

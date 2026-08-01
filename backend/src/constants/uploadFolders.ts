/**
 * Upload Folders Constants
 * Defines standardized storage paths inside Cloudflare R2 bucket.
 */
export const UploadFolders = {
  USER: 'users',
  TEACHER: 'teachers',
  COURSE: 'courses',
  LESSON: 'lessons',
  THUMBNAIL: 'thumbnails',
  CERTIFICATE: 'certificates',
  RECEIPT: 'receipts',
  VIDEO: 'videos',
} as const;

export type UploadFolderType = (typeof UploadFolders)[keyof typeof UploadFolders];

export default UploadFolders;

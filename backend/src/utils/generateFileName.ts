import { randomUUID } from 'crypto';
import path from 'path';

/**
 * Generate Secure Unique Object Key for Cloudflare R2
 * Format: {folder}/{uuid}_{timestamp}.{ext}
 * Example: courses/550e8400-e29b-41d4-a716-446655440000_1725123123.jpg
 * 
 * Sanitizes input extension and prevents path traversal attacks.
 */
export function generateFileName(originalName: string, folderName: string = 'general'): string {
  // Extract extension safely
  const rawExt = path.extname(originalName || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  const ext = rawExt ? `.${rawExt}` : '';

  // Sanitize folder name to prevent path traversal
  const sanitizedFolder = folderName.replace(/[^a-zA-Z0-9_-]/g, '').toLowerCase() || 'general';

  const uuid = randomUUID();
  const timestamp = Date.now();

  return `${sanitizedFolder}/${uuid}_${timestamp}${ext}`;
}

export default generateFileName;

import { S3Client } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Cloudflare R2 Client Configuration
 * Uses AWS SDK v3 S3 client with region: "auto" for Cloudflare R2 compatibility.
 */
const endpoint = process.env.R2_ENDPOINT;
const accessKeyId = process.env.R2_ACCESS_KEY;
const secretAccessKey = process.env.R2_SECRET_KEY;
export const R2_BUCKET = process.env.R2_BUCKET || '';
export const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL || process.env.R2_PUBLIC_DOMAIN || 'https://pub-9d9ed5fae6184a39883cfb2dd345892f.r2.dev';
export const R2_PUBLIC_DOMAIN = R2_PUBLIC_URL;

if (!endpoint || !accessKeyId || !secretAccessKey || !R2_BUCKET) {
  console.warn('⚠️ Warning: Cloudflare R2 environment variables (R2_ENDPOINT, R2_ACCESS_KEY, R2_SECRET_KEY, R2_BUCKET) are missing.');
}

export const r2Client = new S3Client({
  region: 'auto',
  endpoint: endpoint,
  credentials: {
    accessKeyId: accessKeyId || '',
    secretAccessKey: secretAccessKey || '',
  },
});

export default r2Client;

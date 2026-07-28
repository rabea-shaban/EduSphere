import { v2 as cloudinary } from 'cloudinary';
import path from 'path';
import fs from 'fs';

/**
 * Lazily configure Cloudinary on first use so that dotenv has already loaded
 * process.env before we read CLOUDINARY_* variables.
 */
let _configured = false;

function getCloudinary() {
  if (!_configured) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'mock_cloud',
      api_key: process.env.CLOUDINARY_API_KEY || 'mock_key',
      api_secret: process.env.CLOUDINARY_API_SECRET || 'mock_secret',
    });
    _configured = true;

    if (isMockMode()) {
      console.warn('[Cloudinary] WARNING: Running in OFFLINE/SIMULATION mode (missing or placeholder credentials).');
    } else {
      console.log(`[Cloudinary] Connected to cloud: ${process.env.CLOUDINARY_CLOUD_NAME}`);
    }
  }
  return cloudinary;
}

const MOCK_CLOUD_NAMES = new Set([
  'your_cloud_name',
  'your_cloudinary_cloud_name',
  'your_api_key',
  'your_cloudinary_api_key',
  'your_api_secret',
  'your_cloudinary_api_secret',
  'mock_cloud',
  'mock_key',
  'mock_secret',
  'mock',
  'demo',
  'test',
  'change_me',
]);

/** Returns true if Cloudinary credentials are missing or placeholder — decided at call time. */
function isMockMode(): boolean {
  const cName = (process.env.CLOUDINARY_CLOUD_NAME || '').trim().toLowerCase();
  const apiKey = (process.env.CLOUDINARY_API_KEY || '').trim().toLowerCase();
  const apiSecret = (process.env.CLOUDINARY_API_SECRET || '').trim().toLowerCase();

  if (!cName || !apiKey || !apiSecret) {
    return true;
  }

  if (MOCK_CLOUD_NAMES.has(cName) || MOCK_CLOUD_NAMES.has(apiKey) || MOCK_CLOUD_NAMES.has(apiSecret)) {
    return true;
  }

  return false;
}

const getLocalServerUrl = () => {
  const port = process.env.PORT || 5000;
  return process.env.SERVER_URL || `http://localhost:${port}`;
};

const getMockVideoUpload = (filePath?: string | Buffer) => {
  if (typeof filePath === 'string' && filePath) {
    const filename = path.basename(filePath);
    return {
      secure_url: `${getLocalServerUrl()}/uploads/${filename}`,
      public_id: `local-video-${filename}`,
      duration: 120,
      quality: '720',
    };
  }

  return {
    secure_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    public_id: `mock-video-public-id-${Date.now()}`,
    duration: 120,
    quality: '720',
  };
};

const getMockResourceUpload = (filePath?: string | Buffer, resourceType?: string) => {
  if (typeof filePath === 'string' && filePath && fs.existsSync(filePath)) {
    try {
      const fileBuffer = fs.readFileSync(filePath);
      const ext = path.extname(filePath).replace('.', '').toLowerCase() || 'png';
      const isPdf = resourceType === 'PDF' || ext === 'pdf';
      const mime = isPdf ? 'application/pdf' : `image/${ext === 'jpg' ? 'jpeg' : ext}`;
      return {
        secure_url: `data:${mime};base64,${fileBuffer.toString('base64')}`,
        public_id: `base64-resource-${Date.now()}`,
      };
    } catch (err) {
      console.error('[Cloudinary Mock] Error reading file for base64 fallback:', err);
    }
  }

  if (Buffer.isBuffer(filePath)) {
    const isPdf = resourceType === 'PDF';
    const mime = isPdf ? 'application/pdf' : 'image/png';
    return {
      secure_url: `data:${mime};base64,${filePath.toString('base64')}`,
      public_id: `mock-resource-buffer-${Date.now()}`,
    };
  }

  const isPdf = resourceType === 'PDF';
  const secure_url = isPdf
    ? 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
    : 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800';

  return {
    secure_url,
    public_id: `mock-resource-public-id-${Date.now()}`,
  };
};

// ─── Upload Video ─────────────────────────────────────────────────────────────

export const uploadVideoToCloudinary = async (
  filePath: string | Buffer
): Promise<{ secure_url: string; public_id: string; duration: number; quality: string }> => {
  if (isMockMode()) {
    return getMockVideoUpload(filePath);
  }

  try {
    const cld = getCloudinary();

    // Buffer path (Vercel memory storage)
    if (Buffer.isBuffer(filePath)) {
      return await new Promise((resolve, reject) => {
        const stream = cld.uploader.upload_stream(
          { resource_type: 'video', folder: 'edusphere/videos' },
          (error, result) => {
            if (error || !result) return reject(error);
            resolve({
              secure_url: result.secure_url,
              public_id: result.public_id,
              duration: result.duration ? Math.round(result.duration) : 0,
              quality: result.height
                ? result.height >= 1080 ? '1080' : result.height >= 720 ? '720' : result.height >= 480 ? '480' : '360'
                : '720',
            });
          }
        );
        stream.end(filePath);
      });
    }

    // Disk path
    const result = await cld.uploader.upload(filePath, {
      resource_type: 'video',
      folder: 'edusphere/videos',
    });

    return {
      secure_url: result.secure_url,
      public_id: result.public_id,
      duration: result.duration ? Math.round(result.duration) : 0,
      quality: result.height
        ? result.height >= 1080 ? '1080' : result.height >= 720 ? '720' : result.height >= 480 ? '480' : '360'
        : '720',
    };
  } catch (error: any) {
    console.warn(`[Cloudinary] Video upload failed (${error?.message || error}). Falling back to simulation mode.`);
    return getMockVideoUpload(filePath);
  }
};

// ─── Upload Resource (Image / PDF / Document) ─────────────────────────────────

export const uploadResourceToCloudinary = async (
  filePath: string | Buffer,
  resourceType: string
): Promise<{ secure_url: string; public_id: string }> => {
  if (isMockMode()) {
    return getMockResourceUpload(filePath, resourceType);
  }

  try {
    const cld = getCloudinary();
    const isImage = ['Image', 'png', 'jpg', 'jpeg', 'gif', 'webp'].includes(resourceType);
    const cloudinaryResourceType: 'image' | 'raw' = isImage ? 'image' : 'raw';

    // Buffer path (Vercel memory storage)
    if (Buffer.isBuffer(filePath)) {
      return await new Promise((resolve, reject) => {
        const stream = cld.uploader.upload_stream(
          { resource_type: cloudinaryResourceType, folder: 'edusphere/resources' },
          (error, result) => {
            if (error || !result) return reject(error);
            resolve({ secure_url: result.secure_url, public_id: result.public_id });
          }
        );
        stream.end(filePath);
      });
    }

    // Disk path
    const result = await cld.uploader.upload(filePath, {
      resource_type: cloudinaryResourceType,
      folder: 'edusphere/resources',
    });

    return {
      secure_url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (error: any) {
    console.warn(`[Cloudinary] Resource upload failed (${error?.message || error}). Falling back to simulation mode.`);
    return getMockResourceUpload(filePath, resourceType);
  }
};

// ─── Delete Asset ─────────────────────────────────────────────────────────────

export const deleteFromCloudinary = async (
  publicId: string,
  resourceType: 'video' | 'image' | 'raw'
): Promise<any> => {
  if (isMockMode()) {
    console.log(`[Cloudinary Mock] Deleted asset: ${publicId}`);
    return { result: 'ok' };
  }

  try {
    const cld = getCloudinary();
    return await cld.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (error: any) {
    console.warn(`[Cloudinary] Delete asset failed (${error?.message || error}). Mocking deletion success.`);
    return { result: 'ok' };
  }
};

// ─── Generate Secure URL ──────────────────────────────────────────────────────

export const generateSecureUrl = (publicId: string, options: any = {}): string => {
  if (isMockMode()) {
    return 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800';
  }
  try {
    const cld = getCloudinary();
    return cld.url(publicId, { secure: true, ...options });
  } catch (error: any) {
    return 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800';
  }
};

export default cloudinary;

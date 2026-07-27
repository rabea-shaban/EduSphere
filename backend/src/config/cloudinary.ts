import { v2 as cloudinary } from 'cloudinary';

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

    const isMissing =
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET;

    if (isMissing) {
      console.warn('[Cloudinary] WARNING: Missing credentials — running in OFFLINE/SIMULATION mode.');
    } else {
      console.log(`[Cloudinary] Connected to cloud: ${process.env.CLOUDINARY_CLOUD_NAME}`);
    }
  }
  return cloudinary;
}

/** Returns true if Cloudinary credentials are missing — decided at call time. */
function isMockMode(): boolean {
  return (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  );
}

// ─── Upload Video ─────────────────────────────────────────────────────────────

export const uploadVideoToCloudinary = async (
  filePath: string | Buffer
): Promise<{ secure_url: string; public_id: string; duration: number; quality: string }> => {
  if (isMockMode()) {
    return {
      secure_url: `https://res.cloudinary.com/mock_cloud/video/upload/v1700000000/mock-video-${Date.now()}.mp4`,
      public_id: `mock-video-public-id-${Date.now()}`,
      duration: 120,
      quality: '720',
    };
  }

  const cld = getCloudinary();

  // Buffer path (Vercel memory storage)
  if (Buffer.isBuffer(filePath)) {
    return new Promise((resolve, reject) => {
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
};

// ─── Upload Resource (Image / PDF / Document) ─────────────────────────────────

export const uploadResourceToCloudinary = async (
  filePath: string | Buffer,
  resourceType: string
): Promise<{ secure_url: string; public_id: string }> => {
  if (isMockMode()) {
    const ext = resourceType === 'PDF' ? 'pdf' : resourceType === 'Image' ? 'png' : 'zip';
    return {
      secure_url: `https://res.cloudinary.com/mock_cloud/image/upload/v1700000000/mock-resource-${Date.now()}.${ext}`,
      public_id: `mock-resource-public-id-${Date.now()}`,
    };
  }

  const cld = getCloudinary();
  const isImage = ['Image', 'png', 'jpg', 'jpeg', 'gif', 'webp'].includes(resourceType);
  const cloudinaryResourceType: 'image' | 'raw' = isImage ? 'image' : 'raw';

  // Buffer path (Vercel memory storage)
  if (Buffer.isBuffer(filePath)) {
    return new Promise((resolve, reject) => {
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

  const cld = getCloudinary();
  return cld.uploader.destroy(publicId, { resource_type: resourceType });
};

// ─── Generate Secure URL ──────────────────────────────────────────────────────

export const generateSecureUrl = (publicId: string, options: any = {}): string => {
  const cld = getCloudinary();
  return cld.url(publicId, { secure: true, ...options });
};

export default cloudinary;

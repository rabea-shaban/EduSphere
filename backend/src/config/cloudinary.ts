import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary instance
cloudinary.config({
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
export const uploadVideoToCloudinary = async (filePath: string): Promise<{
  secure_url: string;
  public_id: string;
  duration: number;
  quality: string;
}> => {
  if (isMock) {
    // Return mock response for testing offline
    return {
      secure_url: `https://res.cloudinary.com/mock_cloud/video/upload/v1700000000/mock-video-${Date.now()}.mp4`,
      public_id: `mock-video-public-id-${Date.now()}`,
      duration: 120, // 2 minutes duration mock
      quality: '720',
    };
  }

  const result = await cloudinary.uploader.upload(filePath, {
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

/**
 * Uploads a general resource file (PDF, ZIP, Image, Doc) to Cloudinary.
 */
export const uploadResourceToCloudinary = async (filePath: string, resourceType: string): Promise<{
  secure_url: string;
  public_id: string;
}> => {
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

  const result = await cloudinary.uploader.upload(filePath, {
    resource_type: cloudinaryResourceType,
    folder: 'edusphere/resources',
  });

  return {
    secure_url: result.secure_url,
    public_id: result.public_id,
  };
};

/**
 * Deletes an asset from Cloudinary.
 */
export const deleteFromCloudinary = async (publicId: string, resourceType: 'video' | 'image' | 'raw'): Promise<any> => {
  if (isMock) {
    console.log(`[Cloudinary Mock] Deleted asset with publicId: ${publicId}`);
    return { result: 'ok' };
  }

  return await cloudinary.uploader.destroy(publicId, {
    resource_type: resourceType,
  });
};

/**
 * Generates a secure url for transform options.
 */
export const generateSecureUrl = (publicId: string, options: any = {}): string => {
  return cloudinary.url(publicId, {
    secure: true,
    ...options,
  });
};

export default cloudinary;

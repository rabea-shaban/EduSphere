import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure temporary uploads directory exists inside workspace backend folder
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage Configuration
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

// Video File Filter
const videoFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedExtensions = ['.mp4', '.mkv', '.avi', '.mov', '.wmv'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only video files are allowed (mp4, mkv, avi, mov, wmv)') as any, false);
  }
};

// General Resource File Filter
const resourceFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedExtensions = [
    '.pdf', '.zip', '.rar', '.png', '.jpg', '.jpeg', '.gif',
    '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.txt',
    '.js', '.ts', '.py', '.java', '.html', '.css', '.json'
  ];
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type for resource upload') as any, false);
  }
};

// Expose multer upload configurations
export const uploadVideo = multer({
  storage,
  fileFilter: videoFilter,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit for videos
});

export const uploadResource = multer({
  storage,
  fileFilter: resourceFilter,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB limit for resources
});

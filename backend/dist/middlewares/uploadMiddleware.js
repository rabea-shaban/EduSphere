"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadResource = exports.uploadVideo = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// Ensure temporary uploads directory exists inside workspace backend folder
const uploadDir = path_1.default.join(__dirname, '../../uploads');
if (!fs_1.default.existsSync(uploadDir)) {
    fs_1.default.mkdirSync(uploadDir, { recursive: true });
}
// Storage Configuration
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, uploadDir);
    },
    filename: (_req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `${file.fieldname}-${uniqueSuffix}${path_1.default.extname(file.originalname)}`);
    },
});
// Video File Filter
const videoFilter = (_req, file, cb) => {
    const allowedExtensions = ['.mp4', '.mkv', '.avi', '.mov', '.wmv'];
    const ext = path_1.default.extname(file.originalname).toLowerCase();
    if (allowedExtensions.includes(ext)) {
        cb(null, true);
    }
    else {
        cb(new Error('Only video files are allowed (mp4, mkv, avi, mov, wmv)'), false);
    }
};
// General Resource File Filter
const resourceFilter = (_req, file, cb) => {
    const allowedExtensions = [
        '.pdf', '.zip', '.rar', '.png', '.jpg', '.jpeg', '.gif',
        '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.txt',
        '.js', '.ts', '.py', '.java', '.html', '.css', '.json'
    ];
    const ext = path_1.default.extname(file.originalname).toLowerCase();
    if (allowedExtensions.includes(ext)) {
        cb(null, true);
    }
    else {
        cb(new Error('Invalid file type for resource upload'), false);
    }
};
// Expose multer upload configurations
exports.uploadVideo = (0, multer_1.default)({
    storage,
    fileFilter: videoFilter,
    limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit for videos
});
exports.uploadResource = (0, multer_1.default)({
    storage,
    fileFilter: resourceFilter,
    limits: { fileSize: 20 * 1024 * 1024 }, // 20MB limit for resources
});

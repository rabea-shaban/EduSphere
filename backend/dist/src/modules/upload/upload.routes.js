"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const upload_controller_1 = require("./upload.controller");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const router = (0, express_1.Router)();
const storage = multer_1.default.memoryStorage();
// 1. Image Upload Multer Configuration (Max 10MB)
const uploadImageMulter = (0, multer_1.default)({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    fileFilter: (_req, file, cb) => {
        const allowed = ['.jpg', '.jpeg', '.png', '.webp', '.svg'];
        const ext = path_1.default.extname(file.originalname).toLowerCase();
        if (allowed.includes(ext) || file.mimetype.startsWith('image/')) {
            cb(null, true);
        }
        else {
            cb(new Error('نوع الصورة غير مدعوم (JPG, JPEG, PNG, WEBP, SVG)'), false);
        }
    },
});
// 2. Video Upload Multer Configuration (Max 500MB)
const uploadVideoMulter = (0, multer_1.default)({
    storage,
    limits: { fileSize: 500 * 1024 * 1024 }, // 500MB
    fileFilter: (_req, file, cb) => {
        const allowed = ['.mp4', '.mov', '.avi', '.webm', '.mkv'];
        const ext = path_1.default.extname(file.originalname).toLowerCase();
        if (allowed.includes(ext) || file.mimetype.startsWith('video/')) {
            cb(null, true);
        }
        else {
            cb(new Error('نوع الفيديو غير مدعوم (MP4, MOV, AVI, WEBM)'), false);
        }
    },
});
// 3. Document Upload Multer Configuration (Max 25MB)
const uploadDocumentMulter = (0, multer_1.default)({
    storage,
    limits: { fileSize: 25 * 1024 * 1024 }, // 25MB
    fileFilter: (_req, file, cb) => {
        const allowed = ['.pdf', '.doc', '.docx', '.ppt', '.pptx', '.xls', '.xlsx', '.txt', '.zip', '.rar'];
        const ext = path_1.default.extname(file.originalname).toLowerCase();
        if (allowed.includes(ext) || file.mimetype.includes('pdf') || file.mimetype.includes('officedocument') || file.mimetype.includes('zip')) {
            cb(null, true);
        }
        else {
            cb(new Error('نوع المستند غير مدعوم (PDF, DOCX, PPTX, XLSX, ZIP)'), false);
        }
    },
});
// 4. Any File Upload Multer Configuration (Max 100MB)
const uploadAnyMulter = (0, multer_1.default)({
    storage,
    limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
});
/**
 * @route POST /api/v1/upload/image
 * @desc Upload single image file to Cloudflare R2
 */
router.post('/image', authMiddleware_1.protect, uploadImageMulter.single('file'), upload_controller_1.uploadImageFile);
/**
 * @route POST /api/v1/upload/video
 * @desc Upload single video file to Cloudflare R2
 */
router.post('/video', authMiddleware_1.protect, uploadVideoMulter.single('file'), upload_controller_1.uploadVideoFile);
/**
 * @route POST /api/v1/upload/application-doc
 * @desc Upload document for teacher application (public - no auth required)
 */
router.post('/application-doc', uploadDocumentMulter.single('file'), upload_controller_1.uploadDocumentFile);
/**
 * @route POST /api/v1/upload/document
 * @desc Upload single document file to Cloudflare R2
 */
router.post('/document', authMiddleware_1.protect, uploadDocumentMulter.single('file'), upload_controller_1.uploadDocumentFile);
/**
 * @route POST /api/v1/upload/file
 * @desc Upload any file type (image, video, document, audio) to Cloudflare R2
 */
router.post('/file', authMiddleware_1.protect, uploadAnyMulter.single('file'), upload_controller_1.uploadAnyFile);
/**
 * @route DELETE /api/v1/upload/:publicId
 * @desc Delete asset from Cloudflare R2
 */
router.delete('/:publicId', authMiddleware_1.protect, upload_controller_1.deleteFileAsset);
exports.default = router;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const validationMiddleware_1 = require("../../middlewares/validationMiddleware");
const uploadMiddleware_1 = require("../../middlewares/uploadMiddleware");
const fileAsset_validation_1 = require("./fileAsset.validation");
const fileAsset_controller_1 = require("./fileAsset.controller");
const router = (0, express_1.Router)();
// Protect all file management routes with JWT and role check
router.use(authMiddleware_1.protect);
router.use((0, authMiddleware_1.restrictTo)('TEACHER', 'ADMIN', 'SUPER_ADMIN'));
// Upload Routes
router.post('/upload', uploadMiddleware_1.uploadResource.single('file'), fileAsset_controller_1.uploadSingleFile);
router.post('/upload-multiple', uploadMiddleware_1.uploadResource.array('files', 10), fileAsset_controller_1.uploadMultipleFiles);
// Storage Stats & List Queries
router.get('/stats', fileAsset_controller_1.getFileStats);
router.get('/', (0, validationMiddleware_1.validationMiddleware)({ query: fileAsset_validation_1.fileQuerySchema }), fileAsset_controller_1.getTeacherFiles);
// Single File Resource Actions
router.get('/:id', fileAsset_controller_1.getFileById);
router.patch('/:id', (0, validationMiddleware_1.validationMiddleware)({ body: fileAsset_validation_1.updateFileMetadataSchema }), fileAsset_controller_1.updateFileMetadata);
router.delete('/:id', fileAsset_controller_1.deleteFile);
router.patch('/:id/restore', fileAsset_controller_1.restoreFile);
router.get('/:id/download', fileAsset_controller_1.downloadFile);
router.get('/:id/preview', fileAsset_controller_1.previewFile);
exports.default = router;

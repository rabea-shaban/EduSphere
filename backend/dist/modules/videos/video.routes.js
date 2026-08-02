"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const uploadMiddleware_1 = require("../../middlewares/uploadMiddleware");
const validationMiddleware_1 = require("../../middlewares/validationMiddleware");
const user_validation_1 = require("../users/user.validation");
const video_validation_1 = require("./video.validation");
const video_controller_1 = require("./video.controller");
const router = (0, express_1.Router)();
// Read routes (authenticated users)
router.get('/', authMiddleware_1.protect, video_controller_1.getAllVideos);
router.get('/:id', authMiddleware_1.protect, (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema }), video_controller_1.getVideoById);
// Write routes (admins and teachers only)
router.use(authMiddleware_1.protect, (0, authMiddleware_1.restrictTo)('SUPER_ADMIN', 'ADMIN', 'TEACHER'));
router.post('/upload', uploadMiddleware_1.uploadVideo.single('video'), (0, validationMiddleware_1.validationMiddleware)({ body: video_validation_1.createVideoMetadataSchema }), video_controller_1.uploadVideoFile);
router.patch('/:id', (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema, body: video_validation_1.updateVideoMetadataSchema }), video_controller_1.updateVideoMetadata);
router.delete('/:id', (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema }), video_controller_1.deleteVideoFile);
router.patch('/:id/publish', (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema }), video_controller_1.publishVideoFile);
exports.default = router;

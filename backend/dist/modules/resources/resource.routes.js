"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const uploadMiddleware_1 = require("../../middlewares/uploadMiddleware");
const validationMiddleware_1 = require("../../middlewares/validationMiddleware");
const user_validation_1 = require("../users/user.validation");
const resource_validation_1 = require("./resource.validation");
const resource_controller_1 = require("./resource.controller");
const router = (0, express_1.Router)();
// Read routes (authenticated users)
router.get('/lesson/:id', authMiddleware_1.protect, (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema }), resource_controller_1.getLessonResources);
// Write routes (admins and teachers only)
router.use(authMiddleware_1.protect, (0, authMiddleware_1.restrictTo)('SUPER_ADMIN', 'ADMIN', 'TEACHER'));
router.post('/upload', uploadMiddleware_1.uploadResource.single('file'), (0, validationMiddleware_1.validationMiddleware)({ body: resource_validation_1.createResourceMetadataSchema }), resource_controller_1.uploadResourceFile);
router.delete('/:id', (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema }), resource_controller_1.deleteResourceFile);
exports.default = router;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const validationMiddleware_1 = require("../../middlewares/validationMiddleware");
const user_validation_1 = require("../users/user.validation");
const announcement_validation_1 = require("./announcement.validation");
const announcement_controller_1 = require("./announcement.controller");
const router = (0, express_1.Router)();
// Read routes (authenticated users)
router.get('/', authMiddleware_1.protect, announcement_controller_1.getAllAnnouncements);
router.get('/:id', authMiddleware_1.protect, (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema }), announcement_controller_1.getAnnouncementById);
// Write routes (admins and teachers only)
router.use(authMiddleware_1.protect, (0, authMiddleware_1.restrictTo)('SUPER_ADMIN', 'ADMIN', 'TEACHER'));
router.post('/', (0, validationMiddleware_1.validationMiddleware)({ body: announcement_validation_1.createAnnouncementSchema }), announcement_controller_1.createAnnouncement);
router.patch('/:id', (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema, body: announcement_validation_1.updateAnnouncementSchema }), announcement_controller_1.updateAnnouncement);
router.delete('/:id', (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema }), announcement_controller_1.deleteAnnouncement);
router.patch('/:id/publish', (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema }), announcement_controller_1.publishAnnouncement);
router.patch('/:id/archive', (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema }), announcement_controller_1.archiveAnnouncement);
exports.default = router;

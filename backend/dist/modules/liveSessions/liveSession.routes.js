"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const validationMiddleware_1 = require("../../middlewares/validationMiddleware");
const user_validation_1 = require("../users/user.validation");
const liveSession_validation_1 = require("./liveSession.validation");
const liveSession_controller_1 = require("./liveSession.controller");
const router = (0, express_1.Router)();
// Read routes (authenticated users)
router.get('/', authMiddleware_1.protect, liveSession_controller_1.getAllLiveSessions);
router.get('/:id', authMiddleware_1.protect, (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema }), liveSession_controller_1.getLiveSessionById);
router.get('/:id/join', authMiddleware_1.protect, (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema }), liveSession_controller_1.joinLiveSession);
// Write routes (admins and teachers only)
router.use(authMiddleware_1.protect, (0, authMiddleware_1.restrictTo)('SUPER_ADMIN', 'ADMIN', 'TEACHER'));
router.post('/', (0, validationMiddleware_1.validationMiddleware)({ body: liveSession_validation_1.createLiveSessionSchema }), liveSession_controller_1.scheduleLiveSession);
router.patch('/:id', (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema, body: liveSession_validation_1.updateLiveSessionSchema }), liveSession_controller_1.updateLiveSession);
router.patch('/:id/cancel', (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema }), liveSession_controller_1.cancelLiveSession);
router.patch('/:id/recording', (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema }), liveSession_controller_1.saveRecordingLink);
exports.default = router;

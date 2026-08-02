"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const validationMiddleware_1 = require("../../middlewares/validationMiddleware");
const user_validation_1 = require("../users/user.validation");
const unit_validation_1 = require("./unit.validation");
const unit_controller_1 = require("./unit.controller");
const router = (0, express_1.Router)();
// Read routes (public - no auth required)
router.get('/', unit_controller_1.getAllUnits);
router.get('/:id', (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema }), unit_controller_1.getUnitById);
// Write routes (admins and teachers only)
router.use(authMiddleware_1.protect, (0, authMiddleware_1.restrictTo)('SUPER_ADMIN', 'ADMIN', 'TEACHER'));
router.post('/', (0, validationMiddleware_1.validationMiddleware)({ body: unit_validation_1.createUnitSchema }), unit_controller_1.createUnit);
router.patch('/:id', (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema, body: unit_validation_1.updateUnitSchema }), unit_controller_1.updateUnit);
router.delete('/:id', (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema }), unit_controller_1.deleteUnit);
exports.default = router;

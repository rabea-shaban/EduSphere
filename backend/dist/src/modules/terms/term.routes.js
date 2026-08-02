"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const validationMiddleware_1 = require("../../middlewares/validationMiddleware");
const user_validation_1 = require("../users/user.validation");
const term_validation_1 = require("./term.validation");
const term_controller_1 = require("./term.controller");
const router = (0, express_1.Router)();
// Read routes (authenticated users)
router.get('/', authMiddleware_1.protect, term_controller_1.getAllTerms);
router.get('/:id', authMiddleware_1.protect, (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema }), term_controller_1.getTermById);
// Write routes (admins only)
router.use(authMiddleware_1.protect, (0, authMiddleware_1.restrictTo)('SUPER_ADMIN', 'ADMIN'));
router.post('/', (0, validationMiddleware_1.validationMiddleware)({ body: term_validation_1.createTermSchema }), term_controller_1.createTerm);
router.patch('/:id', (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema, body: term_validation_1.updateTermSchema }), term_controller_1.updateTerm);
router.delete('/:id', (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema }), term_controller_1.deleteTerm);
router.patch('/:id/activate', (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema }), term_controller_1.activateTerm);
router.patch('/:id/deactivate', (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema }), term_controller_1.deactivateTerm);
exports.default = router;

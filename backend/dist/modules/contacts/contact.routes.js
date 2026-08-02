"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const validationMiddleware_1 = require("../../middlewares/validationMiddleware");
const user_validation_1 = require("../users/user.validation");
const contact_validation_1 = require("./contact.validation");
const contact_controller_1 = require("./contact.controller");
const router = (0, express_1.Router)();
// Public submission
router.post('/', (0, validationMiddleware_1.validationMiddleware)({ body: contact_validation_1.createContactSchema }), contact_controller_1.submitContact);
// Admin queries management
router.use(authMiddleware_1.protect, (0, authMiddleware_1.restrictTo)('SUPER_ADMIN', 'ADMIN'));
router.get('/', contact_controller_1.getAllContacts);
router.get('/:id', (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema }), contact_controller_1.getContactById);
router.patch('/:id', (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema, body: contact_validation_1.updateContactSchema }), contact_controller_1.updateContactStatus);
exports.default = router;

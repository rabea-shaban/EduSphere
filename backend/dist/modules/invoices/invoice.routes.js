"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const validationMiddleware_1 = require("../../middlewares/validationMiddleware");
const user_validation_1 = require("../users/user.validation");
const invoice_validation_1 = require("./invoice.validation");
const invoice_controller_1 = require("./invoice.controller");
const router = (0, express_1.Router)();
// Read routes (authenticated users)
router.get('/', authMiddleware_1.protect, invoice_controller_1.getAllInvoices);
router.get('/:id', authMiddleware_1.protect, (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema }), invoice_controller_1.getInvoiceById);
// Write routes (admins only)
router.post('/', authMiddleware_1.protect, (0, authMiddleware_1.restrictTo)('SUPER_ADMIN', 'ADMIN'), (0, validationMiddleware_1.validationMiddleware)({ body: invoice_validation_1.createInvoiceSchema }), invoice_controller_1.createInvoice);
exports.default = router;

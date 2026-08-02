"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const validationMiddleware_1 = require("../../middlewares/validationMiddleware");
const user_validation_1 = require("../users/user.validation");
const category_validation_1 = require("./category.validation");
const category_controller_1 = require("./category.controller");
const router = (0, express_1.Router)();
// Read routes (Public)
router.get('/', category_controller_1.getAllCategories);
router.get('/:id', category_controller_1.getCategoryById);
// Write routes (admins only)
router.use(authMiddleware_1.protect, (0, authMiddleware_1.restrictTo)('SUPER_ADMIN', 'ADMIN'));
router.post('/', (0, validationMiddleware_1.validationMiddleware)({ body: category_validation_1.createCategorySchema }), category_controller_1.createCategory);
router.patch('/:id', (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema, body: category_validation_1.updateCategorySchema }), category_controller_1.updateCategory);
router.delete('/:id', (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema }), category_controller_1.deleteCategory);
exports.default = router;

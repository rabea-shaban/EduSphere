"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const blog_controller_1 = require("./blog.controller");
const router = (0, express_1.Router)();
router.get('/', blog_controller_1.getAllBlogs);
router.get('/:id', blog_controller_1.getBlogById);
// Protected routes for Admin & Teachers
router.use(authMiddleware_1.protect, (0, authMiddleware_1.restrictTo)('SUPER_ADMIN', 'ADMIN', 'TEACHER'));
router.post('/', blog_controller_1.createBlog);
router.patch('/:id', blog_controller_1.updateBlog);
router.delete('/:id', blog_controller_1.deleteBlog);
exports.default = router;

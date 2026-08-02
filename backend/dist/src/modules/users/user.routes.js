"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validationMiddleware_1 = require("../../middlewares/validationMiddleware");
const user_validation_1 = require("./user.validation");
const user_controller_1 = require("./user.controller");
const router = (0, express_1.Router)();
/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management (admin)
 */
/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of users
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [firstName, lastName, username, email, phone, password, role]
 *             properties:
 *               firstName: { type: string }
 *               lastName: { type: string }
 *               username: { type: string }
 *               email: { type: string, format: email }
 *               phone: { type: string }
 *               password: { type: string, minLength: 6 }
 *               role: { type: string, enum: [SUPER_ADMIN, ADMIN, TEACHER, STUDENT, PARENT] }
 *               gender: { type: string, enum: [MALE, FEMALE, OTHER] }
 *               dateOfBirth: { type: string, format: date }
 *     responses:
 *       201:
 *         description: User created
 */
/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: User data
 *       404:
 *         description: User not found
 *   patch:
 *     summary: Update user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName: { type: string }
 *               lastName: { type: string }
 *               phone: { type: string }
 *               role: { type: string, enum: [SUPER_ADMIN, ADMIN, TEACHER, STUDENT, PARENT] }
 *               isBlocked: { type: boolean }
 *     responses:
 *       200:
 *         description: User updated
 *   delete:
 *     summary: Soft delete user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: User soft deleted
 */
/**
 * @swagger
 * /users/{id}/restore:
 *   patch:
 *     summary: Restore a soft-deleted user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: User restored
 */
/**
 * @swagger
 * /users/{id}/permanent:
 *   delete:
 *     summary: Permanently delete a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: User permanently deleted
 */
/**
 * User Module Routes
 */
router
    .route('/')
    .post((0, validationMiddleware_1.validationMiddleware)({ body: user_validation_1.createUserSchema }), user_controller_1.createUser)
    .get(user_controller_1.getAllUsers);
router
    .route('/:id')
    .get((0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema }), user_controller_1.getUserById)
    .patch((0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema, body: user_validation_1.updateUserSchema }), user_controller_1.updateUser)
    .delete((0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema }), user_controller_1.softDeleteUser);
router.patch('/:id/restore', (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema }), user_controller_1.restoreUser);
router.delete('/:id/permanent', (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema }), user_controller_1.permanentDeleteUser);
exports.default = router;

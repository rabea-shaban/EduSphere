import { Router } from 'express';
import { validationMiddleware } from '../../middlewares/validationMiddleware';
import {
  createUserSchema,
  updateUserSchema,
  userIdSchema,
} from './user.validation';
import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  softDeleteUser,
  restoreUser,
  permanentDeleteUser,
} from './user.controller';

const router = Router();

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
  .post(validationMiddleware({ body: createUserSchema }), createUser)
  .get(getAllUsers);

router
  .route('/:id')
  .get(validationMiddleware({ params: userIdSchema }), getUserById)
  .patch(validationMiddleware({ params: userIdSchema, body: updateUserSchema }), updateUser)
  .delete(validationMiddleware({ params: userIdSchema }), softDeleteUser);

router.patch(
  '/:id/restore',
  validationMiddleware({ params: userIdSchema }),
  restoreUser
);

router.delete(
  '/:id/permanent',
  validationMiddleware({ params: userIdSchema }),
  permanentDeleteUser
);

export default router;

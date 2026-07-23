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

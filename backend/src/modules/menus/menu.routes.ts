import { Router } from 'express';
import { protect, restrictTo } from '../../middlewares/authMiddleware';
import { validationMiddleware } from '../../middlewares/validationMiddleware';
import { userIdSchema } from '../users/user.validation';
import { createMenuSchema, updateMenuSchema } from './menu.validation';
import { createMenu, getAllMenus, updateMenu, deleteMenu } from './menu.controller';

const router = Router();

router.get('/', getAllMenus);

router.use(protect, restrictTo('SUPER_ADMIN', 'ADMIN'));
router.post('/', validationMiddleware({ body: createMenuSchema }), createMenu);
router.patch('/:id', validationMiddleware({ params: userIdSchema, body: updateMenuSchema }), updateMenu);
router.delete('/:id', validationMiddleware({ params: userIdSchema }), deleteMenu);

export default router;

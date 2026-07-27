import { Router } from 'express';
import { protect, restrictTo } from '../../middlewares/authMiddleware';
import {
  getAllRolesAdmin,
  getSystemPermissionsAdmin,
  createRoleAdmin,
  updateRoleAdmin,
  deleteRoleAdmin,
  assignUserRoleAdmin,
} from './roleAdmin.controller';

const router = Router();

// Protect all routes to Super Admin & Admin
router.use(protect, restrictTo('SUPER_ADMIN', 'ADMIN'));

router.get('/roles', getAllRolesAdmin);
router.post('/roles', createRoleAdmin);
router.get('/permissions', getSystemPermissionsAdmin);
router.patch('/roles/:id', updateRoleAdmin);
router.delete('/roles/:id', deleteRoleAdmin);
router.patch('/users/:id/roles', assignUserRoleAdmin);

export default router;

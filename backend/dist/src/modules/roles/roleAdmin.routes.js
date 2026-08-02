"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const roleAdmin_controller_1 = require("./roleAdmin.controller");
const router = (0, express_1.Router)();
// Protect all routes to Super Admin & Admin
router.use(authMiddleware_1.protect, (0, authMiddleware_1.restrictTo)('SUPER_ADMIN', 'ADMIN'));
router.get('/roles', roleAdmin_controller_1.getAllRolesAdmin);
router.post('/roles', roleAdmin_controller_1.createRoleAdmin);
router.get('/permissions', roleAdmin_controller_1.getSystemPermissionsAdmin);
router.patch('/roles/:id', roleAdmin_controller_1.updateRoleAdmin);
router.delete('/roles/:id', roleAdmin_controller_1.deleteRoleAdmin);
router.patch('/users/:id/roles', roleAdmin_controller_1.assignUserRoleAdmin);
exports.default = router;

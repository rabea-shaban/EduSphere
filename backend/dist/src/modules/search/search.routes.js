"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const search_controller_1 = require("./search.controller");
const router = (0, express_1.Router)();
// Protect all search routes with authentication and role check
router.use(authMiddleware_1.protect);
router.use((0, authMiddleware_1.restrictTo)('TEACHER', 'ADMIN', 'SUPER_ADMIN'));
router.get('/global', search_controller_1.globalSearch);
router.get('/suggestions', search_controller_1.getSearchSuggestions);
exports.default = router;

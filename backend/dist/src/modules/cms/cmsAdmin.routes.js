"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const cmsAdmin_controller_1 = require("./cmsAdmin.controller");
const router = (0, express_1.Router)();
// Public endpoint to read CMS for landing page
router.get('/public', cmsAdmin_controller_1.getCmsContentAdmin);
router.get('/cms/public', cmsAdmin_controller_1.getCmsContentAdmin);
// Protected Admin Middleware for below routes
const adminAuth = [authMiddleware_1.protect, (0, authMiddleware_1.restrictTo)('SUPER_ADMIN', 'ADMIN')];
router.get('/cms', adminAuth, cmsAdmin_controller_1.getCmsContentAdmin);
router.get('/', adminAuth, cmsAdmin_controller_1.getCmsContentAdmin);
router.patch('/cms/:section', adminAuth, cmsAdmin_controller_1.updateCmsSectionAdmin);
router.patch('/:section', adminAuth, cmsAdmin_controller_1.updateCmsSectionAdmin);
router.post('/faqs', adminAuth, cmsAdmin_controller_1.addFaqAdmin);
router.delete('/faqs/:id', adminAuth, cmsAdmin_controller_1.deleteFaqAdmin);
router.post('/testimonials', adminAuth, cmsAdmin_controller_1.addTestimonialAdmin);
router.delete('/testimonials/:id', adminAuth, cmsAdmin_controller_1.deleteTestimonialAdmin);
exports.default = router;

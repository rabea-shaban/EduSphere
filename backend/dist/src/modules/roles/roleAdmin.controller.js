"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assignUserRoleAdmin = exports.deleteRoleAdmin = exports.updateRoleAdmin = exports.createRoleAdmin = exports.getSystemPermissionsAdmin = exports.getAllRolesAdmin = exports.SYSTEM_ACTIONS = exports.SYSTEM_MODULES = void 0;
const role_model_1 = require("./role.model");
const user_model_1 = require("../users/user.model");
const ApiResponse_1 = require("../../utils/ApiResponse");
const ApiError_1 = require("../../utils/ApiError");
const catchAsync_1 = require("../../utils/catchAsync");
exports.SYSTEM_MODULES = [
    { key: 'dashboard', nameAr: 'لوحة التحكم الرئيسية' },
    { key: 'teacherApplications', nameAr: 'طلبات اعتماد المعلمين' },
    { key: 'teachers', nameAr: 'إدارة المعلمين والمحاضرين' },
    { key: 'students', nameAr: 'إدارة الطلاب والدارسين' },
    { key: 'courses', nameAr: 'المناهج والكورسات' },
    { key: 'lessons', nameAr: 'الدروس والفيديوهات' },
    { key: 'quizzes', nameAr: 'الاختبارات والتقييمات' },
    { key: 'payments', nameAr: 'التحصيلات والمدفوعات' },
    { key: 'withdrawals', nameAr: 'سحوبات أرباح المعلمين' },
    { key: 'coupons', nameAr: 'كوبونات الخصم والعروض' },
    { key: 'categories', nameAr: 'الهيكل التعليمي والمواد' },
    { key: 'notifications', nameAr: 'مركز الإشعارات والبث' },
    { key: 'reports', nameAr: 'التقارير والتحليلات البيانية' },
    { key: 'cms', nameAr: 'إدارة محتوى الموقع العامة' },
    { key: 'settings', nameAr: 'إعدادات المنظومة والنظام' },
    { key: 'roles', nameAr: 'الأدوار والصلاحيات (RBAC)' },
];
exports.SYSTEM_ACTIONS = [
    { key: 'view', nameAr: 'عرض' },
    { key: 'create', nameAr: 'إنشاء' },
    { key: 'edit', nameAr: 'تعديل' },
    { key: 'delete', nameAr: 'حذف' },
    { key: 'approve', nameAr: 'موافقة/اعتماد' },
    { key: 'reject', nameAr: 'رفض' },
    { key: 'export', nameAr: 'تصدير' },
    { key: 'manage', nameAr: 'تحكم شامل' },
];
/**
 * Get all roles with user counts and initial seeding.
 */
exports.getAllRolesAdmin = (0, catchAsync_1.catchAsync)(async (_req, res) => {
    let count = await role_model_1.Role.countDocuments();
    if (count === 0) {
        // Seed default system roles
        const defaultRoles = [
            {
                name: 'SUPER_ADMIN',
                displayNameAr: 'المشرف العام (Super Admin)',
                displayNameEn: 'Super Admin',
                description: 'صلاحيات وصول للتحكم في كافة أجزاء المنظومة بالنظام',
                isSystem: true,
                isActive: true,
                permissions: exports.SYSTEM_MODULES.map((m) => ({
                    module: m.key,
                    actions: ['view', 'create', 'edit', 'delete', 'approve', 'reject', 'export', 'manage'],
                })),
            },
            {
                name: 'ADMIN',
                displayNameAr: 'مدير النظام (Admin)',
                displayNameEn: 'Admin',
                description: 'إدارة العمليات اليومية للطلاب والمعلمين والكورسات',
                isSystem: true,
                isActive: true,
                permissions: exports.SYSTEM_MODULES.map((m) => ({
                    module: m.key,
                    actions: ['view', 'create', 'edit', 'approve', 'export'],
                })),
            },
            {
                name: 'FINANCE',
                displayNameAr: 'مدير المالية (Finance)',
                displayNameEn: 'Finance Manager',
                description: 'التحكم في المدفوعات والتحصيلات وسحوبات الأرباح وكوبونات الخصم',
                isSystem: true,
                isActive: true,
                permissions: [
                    { module: 'payments', actions: ['view', 'approve', 'reject', 'export'] },
                    { module: 'withdrawals', actions: ['view', 'approve', 'reject', 'export'] },
                    { module: 'coupons', actions: ['view', 'create', 'edit', 'export'] },
                    { module: 'reports', actions: ['view', 'export'] },
                ],
            },
            {
                name: 'CONTENT_MANAGER',
                displayNameAr: 'مدير المحتوى (Content Manager)',
                displayNameEn: 'Content Manager',
                description: 'مراجعة المناهج، الكورسات، المواد الدراسية، ومحتوى الـ CMS',
                isSystem: true,
                isActive: true,
                permissions: [
                    { module: 'courses', actions: ['view', 'edit', 'approve', 'reject'] },
                    { module: 'categories', actions: ['view', 'create', 'edit'] },
                    { module: 'cms', actions: ['view', 'create', 'edit'] },
                ],
            },
        ];
        await role_model_1.Role.insertMany(defaultRoles);
    }
    const rawRoles = await role_model_1.Role.find().sort({ isSystem: -1, createdAt: 1 });
    const roles = await Promise.all(rawRoles.map(async (r) => {
        const usersCount = await user_model_1.User.countDocuments({ role: r.name });
        return {
            _id: r._id,
            name: r.name,
            displayNameAr: r.displayNameAr,
            displayNameEn: r.displayNameEn,
            description: r.description,
            isSystem: r.isSystem,
            isActive: r.isActive,
            permissionsCount: r.permissions?.reduce((acc, p) => acc + (p.actions?.length || 0), 0) || 0,
            usersCount,
            permissions: r.permissions,
            createdAt: r.createdAt,
        };
    }));
    res.status(200).json(new ApiResponse_1.ApiResponse(200, roles, 'Roles retrieved successfully'));
});
/**
 * Get system modules and actions list.
 */
exports.getSystemPermissionsAdmin = (0, catchAsync_1.catchAsync)(async (_req, res) => {
    res.status(200).json(new ApiResponse_1.ApiResponse(200, {
        modules: exports.SYSTEM_MODULES,
        actions: exports.SYSTEM_ACTIONS,
    }, 'Permissions schema retrieved successfully'));
});
/**
 * Create custom role.
 */
exports.createRoleAdmin = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { name, displayNameAr, displayNameEn, description, permissions } = req.body;
    if (!name || !displayNameAr) {
        throw new ApiError_1.ApiError(400, 'كود الدور والاسم بالعربي مطلوبة');
    }
    const cleanName = name.toUpperCase().replace(/\s+/g, '_').trim();
    const existing = await role_model_1.Role.findOne({ name: cleanName });
    if (existing) {
        throw new ApiError_1.ApiError(400, 'كود الدور هذا مسجل بالفعل');
    }
    const role = await role_model_1.Role.create({
        name: cleanName,
        displayNameAr,
        displayNameEn: displayNameEn || cleanName,
        description,
        isSystem: false,
        isActive: true,
        permissions: permissions || [],
    });
    res.status(201).json(new ApiResponse_1.ApiResponse(201, role, 'تم إنشاء الدور الوظيفي بنجاح 🎉'));
});
/**
 * Update role and permissions matrix.
 */
exports.updateRoleAdmin = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const role = await role_model_1.Role.findById(id);
    if (!role)
        throw new ApiError_1.ApiError(404, 'Role not found');
    if (req.body.displayNameAr)
        role.displayNameAr = req.body.displayNameAr;
    if (req.body.description !== undefined)
        role.description = req.body.description;
    if (req.body.permissions)
        role.permissions = req.body.permissions;
    if (req.body.isActive !== undefined && !role.isSystem)
        role.isActive = req.body.isActive;
    await role.save();
    res.status(200).json(new ApiResponse_1.ApiResponse(200, role, 'تم تحديث مصفوفة صلاحيات الدور بنجاح'));
});
/**
 * Delete custom role.
 */
exports.deleteRoleAdmin = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const role = await role_model_1.Role.findById(id);
    if (!role)
        throw new ApiError_1.ApiError(404, 'Role not found');
    if (role.isSystem) {
        throw new ApiError_1.ApiError(400, 'لا يمكن حذف أداور النظام الأساسية المعرفة افتراضياً');
    }
    const usersCount = await user_model_1.User.countDocuments({ role: role.name });
    if (usersCount > 0) {
        throw new ApiError_1.ApiError(400, `لا يمكن حذف الدور لأنه مسند لـ ${usersCount} مستخدم حالياً`);
    }
    await role_model_1.Role.deleteOne({ _id: id });
    res.status(200).json(new ApiResponse_1.ApiResponse(200, null, 'تم حذف الدور الوظيفي بنجاح'));
});
/**
 * Assign role to user.
 */
exports.assignUserRoleAdmin = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const { roleName } = req.body;
    if (!roleName)
        throw new ApiError_1.ApiError(400, 'اسم الدور المطلوب تعيينه مطلوب');
    const user = await user_model_1.User.findById(id);
    if (!user)
        throw new ApiError_1.ApiError(404, 'User not found');
    user.role = roleName;
    await user.save();
    res.status(200).json(new ApiResponse_1.ApiResponse(200, user, `تم تغيير دور المستخدم إلى (${roleName}) بنجاح`));
});

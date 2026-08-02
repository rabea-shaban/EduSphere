"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteGradeAdmin = exports.updateGradeAdmin = exports.createGradeAdmin = exports.getAllGradesAdmin = exports.deleteSubjectAdmin = exports.updateSubjectAdmin = exports.createSubjectAdmin = exports.getAllSubjectsAdmin = exports.deleteCategoryAdmin = exports.updateCategoryAdmin = exports.createCategoryAdmin = exports.getAllCategoriesAdmin = void 0;
const slugify_1 = __importDefault(require("slugify"));
const category_model_1 = require("./category.model");
const subject_model_1 = require("../subjects/subject.model");
const grade_model_1 = require("../grades/grade.model");
const course_model_1 = require("../courses/course.model");
const user_model_1 = require("../users/user.model");
const ApiResponse_1 = require("../../utils/ApiResponse");
const ApiError_1 = require("../../utils/ApiError");
const catchAsync_1 = require("../../utils/catchAsync");
// -------------------------------------------------------------
// 1. COURSE & GENERAL CATEGORIES
// -------------------------------------------------------------
exports.getAllCategoriesAdmin = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { type, search } = req.query;
    const filter = {};
    if (type && type !== 'All')
        filter.type = type;
    if (search) {
        filter.$or = [
            { name: new RegExp(search, 'i') },
            { description: new RegExp(search, 'i') },
        ];
    }
    const rawCategories = await category_model_1.Category.find(filter).sort({ createdAt: -1 });
    // Enrich with course usage counts
    const categories = await Promise.all(rawCategories.map(async (cat) => {
        const coursesCount = await course_model_1.Course.countDocuments({
            $or: [{ category: cat._id }, { tags: cat.name }],
        });
        return {
            _id: cat._id,
            name: cat.name,
            slug: cat.slug,
            description: cat.description,
            type: cat.type || 'Course',
            coursesCount,
            createdAt: cat.createdAt,
            updatedAt: cat.updatedAt,
        };
    }));
    res.status(200).json(new ApiResponse_1.ApiResponse(200, categories, 'Categories retrieved successfully'));
});
exports.createCategoryAdmin = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { name, description, type = 'Course' } = req.body;
    if (!name)
        throw new ApiError_1.ApiError(400, 'اسم التصنيف مطلوب');
    const slug = (0, slugify_1.default)(name, { lower: true, strict: true }) || name.toLowerCase().replace(/\s+/g, '-');
    const existing = await category_model_1.Category.findOne({ slug });
    if (existing)
        throw new ApiError_1.ApiError(400, 'هذا التصنيف موجود بالفعل');
    const category = await category_model_1.Category.create({
        name,
        slug,
        description,
        type,
    });
    res.status(201).json(new ApiResponse_1.ApiResponse(201, category, 'تم إنشاء التصنيف بنجاح'));
});
exports.updateCategoryAdmin = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const { name, description, type } = req.body;
    const category = await category_model_1.Category.findById(id);
    if (!category)
        throw new ApiError_1.ApiError(404, 'Category not found');
    if (name) {
        category.name = name;
        category.slug = (0, slugify_1.default)(name, { lower: true, strict: true }) || name.toLowerCase().replace(/\s+/g, '-');
    }
    if (description !== undefined)
        category.description = description;
    if (type)
        category.type = type;
    await category.save();
    res.status(200).json(new ApiResponse_1.ApiResponse(200, category, 'تم تحديث التصنيف بنجاح'));
});
exports.deleteCategoryAdmin = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const category = await category_model_1.Category.findById(id);
    if (!category)
        throw new ApiError_1.ApiError(404, 'Category not found');
    // Relationship check
    const coursesCount = await course_model_1.Course.countDocuments({ category: id });
    if (coursesCount > 0) {
        throw new ApiError_1.ApiError(400, `لا يمكن حذف التصنيف لأنه مرتبط بـ ${coursesCount} كورسات حالياً`);
    }
    await category_model_1.Category.deleteOne({ _id: id });
    res.status(200).json(new ApiResponse_1.ApiResponse(200, null, 'تم حذف التصنيف بنجاح'));
});
// -------------------------------------------------------------
// 2. SUBJECTS (المواد الدراسية)
// -------------------------------------------------------------
exports.getAllSubjectsAdmin = (0, catchAsync_1.catchAsync)(async (_req, res) => {
    const rawSubjects = await subject_model_1.Subject.find().sort({ createdAt: -1 }).populate('grades', 'name order');
    const subjects = await Promise.all(rawSubjects.map(async (subj) => {
        const coursesCount = await course_model_1.Course.countDocuments({ subject: subj._id });
        const teachersCount = await user_model_1.User.countDocuments({
            role: 'TEACHER',
            $or: [{ subject: subj.name }, { _id: { $in: subj.teacherIds || [] } }],
        });
        return {
            _id: subj._id,
            name: subj.name,
            slug: subj.slug,
            description: subj.description,
            icon: subj.icon || 'BookOpen',
            color: subj.color || '#F58220',
            educationStage: subj.educationStage,
            grades: subj.grades,
            isActive: subj.isActive,
            coursesCount,
            teachersCount,
            createdAt: subj.createdAt,
        };
    }));
    res.status(200).json(new ApiResponse_1.ApiResponse(200, subjects, 'Subjects retrieved successfully'));
});
exports.createSubjectAdmin = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { name, description, educationStage = 'Secondary', icon, color, grades } = req.body;
    if (!name)
        throw new ApiError_1.ApiError(400, 'اسم المادة الدراسية مطلوب');
    const existing = await subject_model_1.Subject.findOne({ name: name.trim() });
    if (existing)
        throw new ApiError_1.ApiError(400, 'هذه المادة الدراسية مسجلة بالفعل');
    const subject = await subject_model_1.Subject.create({
        name: name.trim(),
        description,
        educationStage,
        icon: icon || 'BookOpen',
        color: color || '#F58220',
        grades: grades || [],
        isActive: true,
    });
    res.status(201).json(new ApiResponse_1.ApiResponse(201, subject, 'تم إضافة المادة الدراسية بنجاح'));
});
exports.updateSubjectAdmin = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const subject = await subject_model_1.Subject.findById(id);
    if (!subject)
        throw new ApiError_1.ApiError(404, 'Subject not found');
    Object.assign(subject, req.body);
    await subject.save();
    res.status(200).json(new ApiResponse_1.ApiResponse(200, subject, 'تم تحديث المادة الدراسية بنجاح'));
});
exports.deleteSubjectAdmin = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const subject = await subject_model_1.Subject.findById(id);
    if (!subject)
        throw new ApiError_1.ApiError(404, 'Subject not found');
    const coursesCount = await course_model_1.Course.countDocuments({ subject: id });
    if (coursesCount > 0) {
        throw new ApiError_1.ApiError(400, `لا يمكن حذف المادة لأنها مرتبطة بـ ${coursesCount} كورسات منشورة`);
    }
    await subject_model_1.Subject.deleteOne({ _id: id });
    res.status(200).json(new ApiResponse_1.ApiResponse(200, null, 'تم حذف المادة الدراسية بنجاح'));
});
// -------------------------------------------------------------
// 3. GRADES (الصفوف الدراسية)
// -------------------------------------------------------------
exports.getAllGradesAdmin = (0, catchAsync_1.catchAsync)(async (_req, res) => {
    const rawGrades = await grade_model_1.Grade.find().sort({ order: 1 });
    const grades = await Promise.all(rawGrades.map(async (g) => {
        const coursesCount = await course_model_1.Course.countDocuments({ grade: g._id });
        const studentsCount = await user_model_1.User.countDocuments({ role: 'STUDENT', grade: g.name.ar });
        return {
            _id: g._id,
            nameAr: g.name.ar,
            nameEn: g.name.en,
            order: g.order,
            educationStage: g.educationStage,
            description: g.description,
            isActive: g.isActive,
            coursesCount,
            studentsCount,
        };
    }));
    res.status(200).json(new ApiResponse_1.ApiResponse(200, grades, 'Grades retrieved successfully'));
});
exports.createGradeAdmin = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { nameAr, nameEn, order, educationStage = 'Secondary', description } = req.body;
    if (!nameAr || !nameEn || order === undefined) {
        throw new ApiError_1.ApiError(400, 'اسم الصف بالعربي والإنجليزي ورتبة الترتيب مطلوبة');
    }
    const grade = await grade_model_1.Grade.create({
        name: { ar: nameAr.trim(), en: nameEn.trim() },
        order: Number(order),
        educationStage,
        description,
        isActive: true,
    });
    res.status(201).json(new ApiResponse_1.ApiResponse(201, grade, 'تم إضافة الصف الدراسي بنجاح'));
});
exports.updateGradeAdmin = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const { nameAr, nameEn, order, educationStage, description, isActive } = req.body;
    const grade = await grade_model_1.Grade.findById(id);
    if (!grade)
        throw new ApiError_1.ApiError(404, 'Grade not found');
    if (nameAr && nameEn) {
        grade.name = { ar: nameAr.trim(), en: nameEn.trim() };
    }
    if (order !== undefined)
        grade.order = Number(order);
    if (educationStage)
        grade.educationStage = educationStage;
    if (description !== undefined)
        grade.description = description;
    if (isActive !== undefined)
        grade.isActive = isActive;
    await grade.save();
    res.status(200).json(new ApiResponse_1.ApiResponse(200, grade, 'تم تحديث الصف الدراسي بنجاح'));
});
exports.deleteGradeAdmin = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const grade = await grade_model_1.Grade.findById(id);
    if (!grade)
        throw new ApiError_1.ApiError(404, 'Grade not found');
    const coursesCount = await course_model_1.Course.countDocuments({ grade: id });
    if (coursesCount > 0) {
        throw new ApiError_1.ApiError(400, `لا يمكن حذف الصف الدراسي لأنه مرتبط بـ ${coursesCount} كورسات حالياً`);
    }
    await grade_model_1.Grade.deleteOne({ _id: id });
    res.status(200).json(new ApiResponse_1.ApiResponse(200, null, 'تم حذف الصف الدراسي بنجاح'));
});

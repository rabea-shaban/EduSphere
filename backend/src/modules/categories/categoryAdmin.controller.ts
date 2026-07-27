import { Request, Response } from 'express';
import slugify from 'slugify';
import { Category } from './category.model';
import { Subject } from '../subjects/subject.model';
import { Grade } from '../grades/grade.model';
import { Course } from '../courses/course.model';
import { User } from '../users/user.model';
import { ApiResponse } from '../../utils/ApiResponse';
import { ApiError } from '../../utils/ApiError';
import { catchAsync } from '../../utils/catchAsync';

// -------------------------------------------------------------
// 1. COURSE & GENERAL CATEGORIES
// -------------------------------------------------------------

export const getAllCategoriesAdmin = catchAsync(async (req: Request, res: Response) => {
  const { type, search } = req.query;
  const filter: any = {};
  if (type && type !== 'All') filter.type = type;
  if (search) {
    filter.$or = [
      { name: new RegExp(search as string, 'i') },
      { description: new RegExp(search as string, 'i') },
    ];
  }

  const rawCategories = await Category.find(filter).sort({ createdAt: -1 });

  // Enrich with course usage counts
  const categories = await Promise.all(
    rawCategories.map(async (cat) => {
      const coursesCount = await Course.countDocuments({
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
    })
  );

  res.status(200).json(new ApiResponse(200, categories, 'Categories retrieved successfully'));
});

export const createCategoryAdmin = catchAsync(async (req: Request, res: Response) => {
  const { name, description, type = 'Course' } = req.body;
  if (!name) throw new ApiError(400, 'اسم التصنيف مطلوب');

  const slug = slugify(name, { lower: true, strict: true }) || name.toLowerCase().replace(/\s+/g, '-');
  const existing = await Category.findOne({ slug });
  if (existing) throw new ApiError(400, 'هذا التصنيف موجود بالفعل');

  const category = await Category.create({
    name,
    slug,
    description,
    type,
  });

  res.status(201).json(new ApiResponse(201, category, 'تم إنشاء التصنيف بنجاح'));
});

export const updateCategoryAdmin = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description, type } = req.body;

  const category = await Category.findById(id);
  if (!category) throw new ApiError(404, 'Category not found');

  if (name) {
    category.name = name;
    category.slug = slugify(name, { lower: true, strict: true }) || name.toLowerCase().replace(/\s+/g, '-');
  }
  if (description !== undefined) category.description = description;
  if (type) category.type = type;

  await category.save();
  res.status(200).json(new ApiResponse(200, category, 'تم تحديث التصنيف بنجاح'));
});

export const deleteCategoryAdmin = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const category = await Category.findById(id);
  if (!category) throw new ApiError(404, 'Category not found');

  // Relationship check
  const coursesCount = await Course.countDocuments({ category: id });
  if (coursesCount > 0) {
    throw new ApiError(400, `لا يمكن حذف التصنيف لأنه مرتبط بـ ${coursesCount} كورسات حالياً`);
  }

  await Category.deleteOne({ _id: id });
  res.status(200).json(new ApiResponse(200, null, 'تم حذف التصنيف بنجاح'));
});


// -------------------------------------------------------------
// 2. SUBJECTS (المواد الدراسية)
// -------------------------------------------------------------

export const getAllSubjectsAdmin = catchAsync(async (_req: Request, res: Response) => {
  const rawSubjects = await Subject.find().sort({ createdAt: -1 }).populate('grades', 'name order');

  const subjects = await Promise.all(
    rawSubjects.map(async (subj) => {
      const coursesCount = await Course.countDocuments({ subject: subj._id });
      const teachersCount = await User.countDocuments({
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
    })
  );

  res.status(200).json(new ApiResponse(200, subjects, 'Subjects retrieved successfully'));
});

export const createSubjectAdmin = catchAsync(async (req: Request, res: Response) => {
  const { name, description, educationStage = 'Secondary', icon, color, grades } = req.body;
  if (!name) throw new ApiError(400, 'اسم المادة الدراسية مطلوب');

  const existing = await Subject.findOne({ name: name.trim() });
  if (existing) throw new ApiError(400, 'هذه المادة الدراسية مسجلة بالفعل');

  const subject = await Subject.create({
    name: name.trim(),
    description,
    educationStage,
    icon: icon || 'BookOpen',
    color: color || '#F58220',
    grades: grades || [],
    isActive: true,
  });

  res.status(201).json(new ApiResponse(201, subject, 'تم إضافة المادة الدراسية بنجاح'));
});

export const updateSubjectAdmin = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const subject = await Subject.findById(id);
  if (!subject) throw new ApiError(404, 'Subject not found');

  Object.assign(subject, req.body);
  await subject.save();

  res.status(200).json(new ApiResponse(200, subject, 'تم تحديث المادة الدراسية بنجاح'));
});

export const deleteSubjectAdmin = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const subject = await Subject.findById(id);
  if (!subject) throw new ApiError(404, 'Subject not found');

  const coursesCount = await Course.countDocuments({ subject: id });
  if (coursesCount > 0) {
    throw new ApiError(400, `لا يمكن حذف المادة لأنها مرتبطة بـ ${coursesCount} كورسات منشورة`);
  }

  await Subject.deleteOne({ _id: id });
  res.status(200).json(new ApiResponse(200, null, 'تم حذف المادة الدراسية بنجاح'));
});


// -------------------------------------------------------------
// 3. GRADES (الصفوف الدراسية)
// -------------------------------------------------------------

export const getAllGradesAdmin = catchAsync(async (_req: Request, res: Response) => {
  const rawGrades = await Grade.find().sort({ order: 1 });

  const grades = await Promise.all(
    rawGrades.map(async (g) => {
      const coursesCount = await Course.countDocuments({ grade: g._id });
      const studentsCount = await User.countDocuments({ role: 'STUDENT', grade: g.name.ar });

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
    })
  );

  res.status(200).json(new ApiResponse(200, grades, 'Grades retrieved successfully'));
});

export const createGradeAdmin = catchAsync(async (req: Request, res: Response) => {
  const { nameAr, nameEn, order, educationStage = 'Secondary', description } = req.body;
  if (!nameAr || !nameEn || order === undefined) {
    throw new ApiError(400, 'اسم الصف بالعربي والإنجليزي ورتبة الترتيب مطلوبة');
  }

  const grade = await Grade.create({
    name: { ar: nameAr.trim(), en: nameEn.trim() },
    order: Number(order),
    educationStage,
    description,
    isActive: true,
  });

  res.status(201).json(new ApiResponse(201, grade, 'تم إضافة الصف الدراسي بنجاح'));
});

export const updateGradeAdmin = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { nameAr, nameEn, order, educationStage, description, isActive } = req.body;

  const grade = await Grade.findById(id);
  if (!grade) throw new ApiError(404, 'Grade not found');

  if (nameAr && nameEn) {
    grade.name = { ar: nameAr.trim(), en: nameEn.trim() };
  }
  if (order !== undefined) grade.order = Number(order);
  if (educationStage) grade.educationStage = educationStage;
  if (description !== undefined) grade.description = description;
  if (isActive !== undefined) grade.isActive = isActive;

  await grade.save();
  res.status(200).json(new ApiResponse(200, grade, 'تم تحديث الصف الدراسي بنجاح'));
});

export const deleteGradeAdmin = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const grade = await Grade.findById(id);
  if (!grade) throw new ApiError(404, 'Grade not found');

  const coursesCount = await Course.countDocuments({ grade: id });
  if (coursesCount > 0) {
    throw new ApiError(400, `لا يمكن حذف الصف الدراسي لأنه مرتبط بـ ${coursesCount} كورسات حالياً`);
  }

  await Grade.deleteOne({ _id: id });
  res.status(200).json(new ApiResponse(200, null, 'تم حذف الصف الدراسي بنجاح'));
});

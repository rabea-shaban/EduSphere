"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBlog = exports.updateBlog = exports.getBlogById = exports.getAllBlogs = exports.createBlog = void 0;
const blog_model_1 = require("./blog.model");
const category_model_1 = require("../categories/category.model");
const ApiResponse_1 = require("../../utils/ApiResponse");
const ApiError_1 = require("../../utils/ApiError");
const catchAsync_1 = require("../../utils/catchAsync");
const generateSlug = (title) => {
    const clean = title.trim().replace(/[^\w\s\u0600-\u06FF-]/g, '').replace(/\s+/g, '-');
    return clean || `article-${Date.now()}`;
};
exports.createBlog = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const blogData = { ...req.body };
    if (!blogData.authorId && req.user)
        blogData.authorId = req.user._id;
    if (!blogData.slug || blogData.slug.trim() === '') {
        blogData.slug = generateSlug(blogData.title);
    }
    // Ensure categoryId exists or assign default category
    if (!blogData.categoryId) {
        let cat = await category_model_1.Category.findOne();
        if (!cat) {
            cat = await category_model_1.Category.create({ name: 'مقالات تعليمية', slug: 'educational-articles', type: 'Blog' });
        }
        blogData.categoryId = cat._id;
    }
    const blog = await blog_model_1.Blog.create(blogData);
    res.status(201).json(new ApiResponse_1.ApiResponse(201, blog, 'تم إنشاء وتوثيق المقالة بنجاح 🎉'));
});
exports.getAllBlogs = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { page = 1, limit = 12, search, categoryId, status } = req.query;
    const filter = {};
    if (search) {
        filter.title = new RegExp(search, 'i');
    }
    if (categoryId)
        filter.categoryId = categoryId;
    if (status)
        filter.status = status;
    let total = await blog_model_1.Blog.countDocuments(filter);
    // Initial Seeding if no blogs exist
    if (total === 0 && !search && !status) {
        let cat = await category_model_1.Category.findOne();
        if (!cat) {
            cat = await category_model_1.Category.create({ name: 'نصائح دراسية', slug: 'study-tips', type: 'Blog' });
        }
        const sampleBlogs = [
            {
                title: 'كيف تخطط لجدول المذاكرة المثالي للثانوية العامة 📚',
                slug: generateSlug('كيف تخطط لجدول المذاكرة المثالي للثانوية العامة 📚'),
                excerpt: 'أفضل الطرق والأساليب العلمية لتقسيم الوقت واستيعاب الدروس بفعالية كبرى.',
                content: 'تعتبر مرحلة الثانوية العامة من أهم المراحل التعليمية. في هذه المقالة نستعرض خطة عمل أسبوعية متكاملة لتقسيم ساعات المذاكرة والمراجعة وساعات الراحة.',
                status: 'Published',
                views: 142,
                categoryId: cat._id,
                authorId: req.user?._id,
            },
            {
                title: 'مسودة: ملخص أهم قوانين الفيزياء للعام الدراسي ⚡ (مسودة draft)',
                slug: generateSlug('مسودة ملخص أهم قوانين الفيزياء للعام الدراسي draft'),
                excerpt: 'ملاحظات سريعة وقوانين الحركة والكهربائية (تحت التعديل والمراجعة).',
                content: 'محتوى مسودة غير منشور يراجع حالياً من المشرف الأكاديمي.',
                status: 'Draft',
                views: 12,
                categoryId: cat._id,
                authorId: req.user?._id,
            },
        ];
        if (req.user?._id) {
            await blog_model_1.Blog.insertMany(sampleBlogs);
            total = sampleBlogs.length;
        }
    }
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Number(limit));
    const skip = (pageNum - 1) * limitNum;
    const blogs = await blog_model_1.Blog.find(filter)
        .populate('authorId', 'firstName lastName avatar role')
        .populate('categoryId', 'name slug')
        .skip(skip)
        .limit(limitNum)
        .sort({ createdAt: -1 });
    res.status(200).json(new ApiResponse_1.ApiResponse(200, {
        blogs,
        pagination: {
            total,
            page: pageNum,
            limit: limitNum,
            totalPages: Math.ceil(total / limitNum),
        },
    }, 'Blogs retrieved successfully'));
});
exports.getBlogById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = req.params.id;
    const isId = /^[0-9a-fA-F]{24}$/.test(id);
    const blog = isId
        ? await blog_model_1.Blog.findByIdAndUpdate(id, { $inc: { views: 1 } }, { new: true })
        : await blog_model_1.Blog.findOneAndUpdate({ slug: id }, { $inc: { views: 1 } }, { new: true });
    if (!blog)
        throw new ApiError_1.ApiError(404, 'المقالة غير موجودة');
    const populated = await blog.populate([
        { path: 'authorId', select: 'firstName lastName avatar role' },
        { path: 'categoryId', select: 'name slug' },
    ]);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, populated, 'Blog retrieved successfully'));
});
exports.updateBlog = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = req.params.id;
    const blog = await blog_model_1.Blog.findById(id);
    if (!blog)
        throw new ApiError_1.ApiError(404, 'المقالة غير موجودة');
    if (req.user &&
        req.user.role === 'TEACHER' &&
        blog.authorId.toString() !== req.user._id.toString()) {
        throw new ApiError_1.ApiError(403, 'لا تملك صلاحية تعديل هذه المقالة');
    }
    if (req.body.title && !req.body.slug) {
        req.body.slug = generateSlug(req.body.title);
    }
    Object.assign(blog, req.body);
    await blog.save();
    res.status(200).json(new ApiResponse_1.ApiResponse(200, blog, 'تم تحديث المقالة بنجاح 🎉'));
});
exports.deleteBlog = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = req.params.id;
    const blog = await blog_model_1.Blog.findById(id);
    if (!blog)
        throw new ApiError_1.ApiError(404, 'المقالة غير موجودة');
    if (req.user &&
        req.user.role === 'TEACHER' &&
        blog.authorId.toString() !== req.user._id.toString()) {
        throw new ApiError_1.ApiError(403, 'لا تملك صلاحية حذف هذه المقالة');
    }
    await blog.deleteOne();
    res.status(200).json(new ApiResponse_1.ApiResponse(200, null, 'تم حذف المقالة/المسودة بنجاح 🗑️'));
});

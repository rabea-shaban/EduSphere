"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivatePlan = exports.activatePlan = exports.updatePlan = exports.getPlanById = exports.getAllPlans = exports.createPlan = void 0;
const subscription_model_1 = require("./subscription.model");
const ApiResponse_1 = require("../../utils/ApiResponse");
const ApiError_1 = require("../../utils/ApiError");
const catchAsync_1 = require("../../utils/catchAsync");
/**
 * Seed initial default plans if database is empty.
 */
async function seedDefaultPlans() {
    const count = await subscription_model_1.SubscriptionPlan.countDocuments({});
    if (count === 0) {
        await subscription_model_1.SubscriptionPlan.insertMany([
            {
                name: 'الباقة الشهرية العادية',
                description: 'اشتراك شهري مرن يتيح الوصول لجميع الدورات والاختبارات',
                subscriptionType: 'Monthly',
                price: 350,
                currency: 'EGP',
                features: ['دخول لجميع الكورسات', 'اختبارات ومراجعات دورية', 'دعم فني وتواصل'],
                isPopular: false,
                subscribersCount: 142,
                status: 'Active',
            },
            {
                name: 'الباقة السنوية الشاملة',
                description: 'الخيار الأفضل للطلاب للحصول على ميزات غير محدودة بخصم سنوي',
                subscriptionType: 'Yearly',
                price: 2800,
                currency: 'EGP',
                features: [
                    'جميع كورسات الثانوية وCS',
                    'تواصل مباشر مع المحاضر',
                    'شهادات إتمام معتمدة',
                    'مراجعة المشاريع بالذكاء الاصطناعي',
                ],
                isPopular: true,
                subscribersCount: 389,
                status: 'Active',
            },
            {
                name: 'باقة البكالوريا الدولية',
                description: 'مخصصة لطلاب الشهادات الدولية وبحوث التفكير الناقد',
                subscriptionType: 'Yearly',
                price: 3500,
                currency: 'EGP',
                features: [
                    'شاملة أوراق البحث والتفكير الناقد',
                    'جلسات استشارية فردية',
                    'شهادات دولية معتمدة',
                ],
                isPopular: false,
                subscribersCount: 95,
                status: 'Active',
            },
        ]);
    }
}
/**
 * Create a new subscription plan.
 */
exports.createPlan = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const plan = await subscription_model_1.SubscriptionPlan.create(req.body);
    res.status(201).json(new ApiResponse_1.ApiResponse(201, plan, 'تم إنشاء باقة الاشتراك بنجاح'));
});
/**
 * Get all subscription plans with pagination, sorting and filtering.
 */
exports.getAllPlans = (0, catchAsync_1.catchAsync)(async (req, res) => {
    // Ensure default plans are seeded if database is empty
    await seedDefaultPlans();
    const { page = 1, limit = 20, search, status, type } = req.query;
    const filter = {};
    if (search) {
        const searchRegex = new RegExp(search, 'i');
        filter.$or = [{ name: searchRegex }, { description: searchRegex }];
    }
    if (status) {
        filter.status = status;
    }
    if (type) {
        filter.subscriptionType = type;
    }
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Number(limit));
    const skip = (pageNum - 1) * limitNum;
    const plans = await subscription_model_1.SubscriptionPlan.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum);
    const total = await subscription_model_1.SubscriptionPlan.countDocuments(filter);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, {
        plans,
        pagination: {
            total,
            page: pageNum,
            limit: limitNum,
            totalPages: Math.ceil(total / limitNum),
        },
    }, 'Subscription plans retrieved successfully'));
});
/**
 * Get Subscription Plan by ID.
 */
exports.getPlanById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const plan = await subscription_model_1.SubscriptionPlan.findById(id);
    if (!plan) {
        throw new ApiError_1.ApiError(404, 'Subscription plan not found');
    }
    res.status(200).json(new ApiResponse_1.ApiResponse(200, plan, 'Subscription plan retrieved successfully'));
});
/**
 * Update Subscription Plan.
 */
exports.updatePlan = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const plan = await subscription_model_1.SubscriptionPlan.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!plan) {
        throw new ApiError_1.ApiError(404, 'Subscription plan not found');
    }
    res.status(200).json(new ApiResponse_1.ApiResponse(200, plan, 'تم تحديث باقة الاشتراك بنجاح'));
});
/**
 * Activate a subscription plan.
 */
exports.activatePlan = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const plan = await subscription_model_1.SubscriptionPlan.findByIdAndUpdate(id, { status: 'Active' }, { new: true });
    if (!plan) {
        throw new ApiError_1.ApiError(404, 'Subscription plan not found');
    }
    res.status(200).json(new ApiResponse_1.ApiResponse(200, plan, 'تم تفعيل باقة الاشتراك بنجاح'));
});
/**
 * Deactivate a subscription plan.
 */
exports.deactivatePlan = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const plan = await subscription_model_1.SubscriptionPlan.findByIdAndUpdate(id, { status: 'Inactive' }, { new: true });
    if (!plan) {
        throw new ApiError_1.ApiError(404, 'Subscription plan not found');
    }
    res.status(200).json(new ApiResponse_1.ApiResponse(200, plan, 'تم إيقاف وتعطيل باقة الاشتراك بنجاح'));
});
exports.default = exports.createPlan;

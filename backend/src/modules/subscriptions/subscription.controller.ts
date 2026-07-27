import { Request, Response } from 'express';
import { SubscriptionPlan } from './subscription.model';
import { ApiResponse } from '../../utils/ApiResponse';
import { ApiError } from '../../utils/ApiError';
import { catchAsync } from '../../utils/catchAsync';

/**
 * Seed initial default plans if database is empty.
 */
async function seedDefaultPlans() {
  const count = await SubscriptionPlan.countDocuments({});
  if (count === 0) {
    await SubscriptionPlan.insertMany([
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
export const createPlan = catchAsync(async (req: Request, res: Response) => {
  const plan = await SubscriptionPlan.create(req.body);
  res.status(201).json(new ApiResponse(201, plan, 'تم إنشاء باقة الاشتراك بنجاح'));
});

/**
 * Get all subscription plans with pagination, sorting and filtering.
 */
export const getAllPlans = catchAsync(async (req: Request, res: Response) => {
  // Ensure default plans are seeded if database is empty
  await seedDefaultPlans();

  const { page = 1, limit = 20, search, status, type } = req.query;
  const filter: any = {};

  if (search) {
    const searchRegex = new RegExp(search as string, 'i');
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

  const plans = await SubscriptionPlan.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum);

  const total = await SubscriptionPlan.countDocuments(filter);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        plans,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum),
        },
      },
      'Subscription plans retrieved successfully'
    )
  );
});

/**
 * Get Subscription Plan by ID.
 */
export const getPlanById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const plan = await SubscriptionPlan.findById(id);

  if (!plan) {
    throw new ApiError(404, 'Subscription plan not found');
  }

  res.status(200).json(new ApiResponse(200, plan, 'Subscription plan retrieved successfully'));
});

/**
 * Update Subscription Plan.
 */
export const updatePlan = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const plan = await SubscriptionPlan.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

  if (!plan) {
    throw new ApiError(404, 'Subscription plan not found');
  }

  res.status(200).json(new ApiResponse(200, plan, 'تم تحديث باقة الاشتراك بنجاح'));
});

/**
 * Activate a subscription plan.
 */
export const activatePlan = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const plan = await SubscriptionPlan.findByIdAndUpdate(id, { status: 'Active' }, { new: true });

  if (!plan) {
    throw new ApiError(404, 'Subscription plan not found');
  }

  res.status(200).json(new ApiResponse(200, plan, 'تم تفعيل باقة الاشتراك بنجاح'));
});

/**
 * Deactivate a subscription plan.
 */
export const deactivatePlan = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const plan = await SubscriptionPlan.findByIdAndUpdate(id, { status: 'Inactive' }, { new: true });

  if (!plan) {
    throw new ApiError(404, 'Subscription plan not found');
  }

  res.status(200).json(new ApiResponse(200, plan, 'تم إيقاف وتعطيل باقة الاشتراك بنجاح'));
});

export default createPlan;

import { Request, Response } from 'express';
import { Payment } from './payment.model';
import { Course } from '../courses/course.model';
import { SubscriptionPlan } from '../subscriptions/subscription.model';
import { Coupon } from '../coupons/coupon.model';
import { Transaction } from '../transactions/transaction.model';
import { Invoice } from '../invoices/invoice.model';
import { Enrollment } from '../enrollments/enrollment.model';
import { createStripeCheckoutSession, stripe } from '../../config/stripe';
import { ApiResponse } from '../../utils/ApiResponse';
import { ApiError } from '../../utils/ApiError';
import { catchAsync } from '../../utils/catchAsync';

/**
 * Helper to process post-payment triggers (activate enrollment, log transaction, issue invoice).
 */
export const processSuccessfulPayment = async (payment: any, referenceId: string) => {
  payment.status = 'Paid';
  payment.paidAt = new Date();
  await payment.save();

  // 1. Save Transaction audit log
  await Transaction.create({
    paymentId: payment._id,
    gateway: payment.paymentMethod,
    transactionId: referenceId,
    requestPayload: { paymentId: payment._id, referenceId },
    responsePayload: { status: 'Success', processedAt: new Date() },
    status: 'Success',
  });

  // 2. Generate Invoice automatically
  const invoiceNumber = `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const itemName = payment.courseId ? 'Course Enrollment Purchase' : 'Organization Subscription Purchase';
  await Invoice.create({
    invoiceNumber,
    studentId: payment.studentId,
    organizationId: payment.organizationId,
    paymentId: payment._id,
    items: [{ name: itemName, quantity: 1, price: payment.amount }],
    subtotal: payment.amount,
    discount: 0,
    tax: 0,
    total: payment.amount,
    currency: payment.currency,
    status: 'Paid',
    issuedAt: new Date(),
  });

  // 3. Activate student Course Enrollment list if applicable
  if (payment.courseId && payment.studentId) {
    const course = await Course.findById(payment.courseId);
    const teacherId = course ? course.teacher : payment.studentId; // default fallback

    let enrollment = await Enrollment.findOne({
      studentId: payment.studentId,
      courseId: payment.courseId,
    });

    if (!enrollment) {
      await Enrollment.create({
        studentId: payment.studentId,
        courseId: payment.courseId,
        teacherId,
        status: 'Active',
        paymentStatus: 'Paid',
        enrolledAt: new Date(),
      });
    } else {
      enrollment.status = 'Active';
      enrollment.paymentStatus = 'Paid';
      await enrollment.save();
    }
  }
};

/**
 * Purchase a course (Student initiates card checkout session).
 */
export const purchaseCourse = catchAsync(async (req: Request, res: Response) => {
  const { courseId, couponCode } = req.body;
  const studentId = req.user?._id;

  if (!studentId) {
    throw new ApiError(401, 'Unauthorized');
  }

  // 1. Fetch course details
  const course = await Course.findById(courseId);
  if (!course) {
    throw new ApiError(404, 'Course not found');
  }

  let finalPrice = course.discountPrice !== undefined && course.discountPrice < course.price
    ? course.discountPrice
    : course.price;

  // 2. Apply Coupon discount if present
  if (couponCode) {
    const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), status: 'Active' });
    if (coupon && new Date() < new Date(coupon.expiresAt)) {
      if (finalPrice >= coupon.minimumPurchase) {
        let discount = 0;
        if (coupon.discountType === 'Fixed') {
          discount = coupon.discountValue;
        } else if (coupon.discountType === 'Percentage') {
          discount = (coupon.discountValue / 100) * finalPrice;
          if (coupon.maximumDiscount !== undefined && discount > coupon.maximumDiscount) {
            discount = coupon.maximumDiscount;
          }
        }
        discount = Math.min(discount, finalPrice);
        finalPrice -= discount;

        // Increment coupon count
        coupon.usedCount += 1;
        await coupon.save();
      }
    }
  }

  // 3. Create Stripe checkout session
  const successUrl = `${req.protocol}://${req.get('host')}/payments/success?session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = `${req.protocol}://${req.get('host')}/payments/cancel`;

  const session = await createStripeCheckoutSession({
    successUrl,
    cancelUrl,
    lineItems: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: course.title,
            description: course.description || 'EduSphere course purchase',
          },
          unit_amount: Math.round(finalPrice * 100), // In cents
        },
        quantity: 1,
      },
    ],
    metadata: {
      courseId: courseId.toString(),
      studentId: studentId.toString(),
    },
  });

  // 4. Save Pending payment record
  const payment = await Payment.create({
    studentId,
    courseId,
    amount: finalPrice,
    currency: 'USD',
    paymentMethod: 'Stripe',
    status: 'Pending',
    paymentReference: session.id,
  });

  res.status(200).json(
    new ApiResponse(
      200,
      {
        checkoutUrl: session.url,
        sessionId: session.id,
        payment,
      },
      'Payment checkout session created'
    )
  );
});

/**
 * Purchase subscription plan.
 */
export const purchaseSubscription = catchAsync(async (req: Request, res: Response) => {
  const { subscriptionId, couponCode } = req.body;
  const organizationId = req.user?._id; // Treat user ID as org ID in multi-tenant contexts

  const plan = await SubscriptionPlan.findById(subscriptionId);
  if (!plan) {
    throw new ApiError(404, 'Subscription plan not found');
  }

  let finalPrice = plan.price;

  if (couponCode) {
    const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), status: 'Active' });
    if (coupon && new Date() < new Date(coupon.expiresAt)) {
      if (finalPrice >= coupon.minimumPurchase) {
        let discount = 0;
        if (coupon.discountType === 'Fixed') {
          discount = coupon.discountValue;
        } else if (coupon.discountType === 'Percentage') {
          discount = (coupon.discountValue / 100) * finalPrice;
        }
        discount = Math.min(discount, finalPrice);
        finalPrice -= discount;
      }
    }
  }

  const successUrl = `${req.protocol}://${req.get('host')}/payments/success?session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = `${req.protocol}://${req.get('host')}/payments/cancel`;

  const session = await createStripeCheckoutSession({
    successUrl,
    cancelUrl,
    lineItems: [
      {
        price_data: {
          currency: plan.currency || 'usd',
          product_data: {
            name: plan.name,
            description: plan.description || 'EduSphere Subscription Plan',
          },
          unit_amount: Math.round(finalPrice * 100),
        },
        quantity: 1,
      },
    ],
    metadata: {
      subscriptionId: subscriptionId.toString(),
      organizationId: organizationId?.toString(),
    },
  });

  const payment = await Payment.create({
    organizationId,
    subscriptionId,
    amount: finalPrice,
    currency: plan.currency || 'USD',
    paymentMethod: 'Stripe',
    status: 'Pending',
    paymentReference: session.id,
  });

  res.status(200).json(
    new ApiResponse(
      200,
      {
        checkoutUrl: session.url,
        sessionId: session.id,
        payment,
      },
      'Subscription plan checkout session created'
    )
  );
});

/**
 * Verify manual payments (Cash, Bank Transfer) - Admin only.
 */
export const verifyPayment = catchAsync(async (req: Request, res: Response) => {
  const { paymentId, status, paymentReference } = req.body;

  const payment = await Payment.findById(paymentId);
  if (!payment) {
    throw new ApiError(404, 'Payment log not found');
  }

  payment.paymentReference = paymentReference;
  if (status === 'Paid') {
    await processSuccessfulPayment(payment, paymentReference);
  } else {
    payment.status = status;
    await payment.save();
  }

  res.status(200).json(new ApiResponse(200, payment, 'Payment verified successfully'));
});

/**
 * Handle Stripe webhook events (checkout.session.completed, etc.).
 */
export const handleStripeWebhook = catchAsync(async (req: Request, res: Response) => {
  let eventType = req.body.event || req.body.type;
  let sessionId = req.body.sessionId || (req.body.data && req.body.data.object && req.body.data.object.id);

  // If real Stripe keys are configured and it's a real HTTP signature callback, verify signature
  if (stripe && req.headers['stripe-signature']) {
    const sig = req.headers['stripe-signature'] as string;
    try {
      const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET || '');
      eventType = event.type;
      const object = event.data.object as any;
      sessionId = object.id;
    } catch (err: any) {
      throw new ApiError(400, `Webhook Signature Error: ${err.message}`);
    }
  }

  console.log(`[Stripe Webhook] Received Event '${eventType}' for Session: ${sessionId}`);

  if (eventType === 'checkout.session.completed' && sessionId) {
    const payment = await Payment.findOne({ paymentReference: sessionId });
    if (payment && payment.status === 'Pending') {
      await processSuccessfulPayment(payment, sessionId);
      console.log(`[Stripe Webhook] Payment ${payment._id} updated to Paid.`);
    }
  }

  res.status(200).json({ received: true });
});

/**
 * Fetch all payments history with filters.
 */
export const getAllPayments = catchAsync(async (req: Request, res: Response) => {
  const { page = 1, limit = 10, status, paymentMethod } = req.query;
  const filter: any = {};

  if (status) filter.status = status;
  if (paymentMethod) filter.paymentMethod = paymentMethod;

  // Enforce isolation for students
  if (req.user && req.user.role === 'STUDENT') {
    filter.studentId = req.user._id;
  }

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.max(1, Number(limit));
  const skip = (pageNum - 1) * limitNum;

  const payments = await Payment.find(filter)
    .populate('studentId', 'firstName lastName email')
    .populate('courseId', 'title slug')
    .populate('subscriptionId', 'name')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum);

  const total = await Payment.countDocuments(filter);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        payments,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum),
        },
      },
      'Payments retrieved successfully'
    )
  );
});
export default purchaseCourse;

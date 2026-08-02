"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllPayments = exports.handleStripeWebhook = exports.verifyPayment = exports.purchaseSubscription = exports.purchaseCourse = exports.processSuccessfulPayment = void 0;
const payment_model_1 = require("./payment.model");
const course_model_1 = require("../courses/course.model");
const subscription_model_1 = require("../subscriptions/subscription.model");
const coupon_model_1 = require("../coupons/coupon.model");
const transaction_model_1 = require("../transactions/transaction.model");
const invoice_model_1 = require("../invoices/invoice.model");
const enrollment_model_1 = require("../enrollments/enrollment.model");
const stripe_1 = require("../../config/stripe");
const ApiResponse_1 = require("../../utils/ApiResponse");
const ApiError_1 = require("../../utils/ApiError");
const catchAsync_1 = require("../../utils/catchAsync");
/**
 * Helper to process post-payment triggers (activate enrollment, log transaction, issue invoice).
 */
const processSuccessfulPayment = async (payment, referenceId) => {
    payment.status = 'Paid';
    payment.paidAt = new Date();
    await payment.save();
    // 1. Save Transaction audit log
    await transaction_model_1.Transaction.create({
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
    await invoice_model_1.Invoice.create({
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
        const course = await course_model_1.Course.findById(payment.courseId);
        const teacherId = course ? course.teacher : payment.studentId; // default fallback
        let enrollment = await enrollment_model_1.Enrollment.findOne({
            studentId: payment.studentId,
            courseId: payment.courseId,
        });
        if (!enrollment) {
            await enrollment_model_1.Enrollment.create({
                studentId: payment.studentId,
                courseId: payment.courseId,
                teacherId,
                status: 'Active',
                paymentStatus: 'Paid',
                enrolledAt: new Date(),
            });
        }
        else {
            enrollment.status = 'Active';
            enrollment.paymentStatus = 'Paid';
            await enrollment.save();
        }
    }
};
exports.processSuccessfulPayment = processSuccessfulPayment;
/**
 * Purchase a course (Student initiates card checkout session).
 */
exports.purchaseCourse = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { courseId, couponCode } = req.body;
    const studentId = req.user?._id;
    if (!studentId) {
        throw new ApiError_1.ApiError(401, 'Unauthorized');
    }
    // 1. Fetch course details
    const course = await course_model_1.Course.findById(courseId);
    if (!course) {
        throw new ApiError_1.ApiError(404, 'Course not found');
    }
    let finalPrice = course.discountPrice !== undefined && course.discountPrice < course.price
        ? course.discountPrice
        : course.price;
    // 2. Apply Coupon discount if present
    if (couponCode) {
        const coupon = await coupon_model_1.Coupon.findOne({ code: couponCode.toUpperCase(), status: 'Active' });
        if (coupon && new Date() < new Date(coupon.expiresAt)) {
            if (finalPrice >= coupon.minimumPurchase) {
                let discount = 0;
                if (coupon.discountType === 'Fixed') {
                    discount = coupon.discountValue;
                }
                else if (coupon.discountType === 'Percentage') {
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
    const session = await (0, stripe_1.createStripeCheckoutSession)({
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
    const payment = await payment_model_1.Payment.create({
        studentId,
        courseId,
        amount: finalPrice,
        currency: 'USD',
        paymentMethod: 'Stripe',
        status: 'Pending',
        paymentReference: session.id,
    });
    res.status(200).json(new ApiResponse_1.ApiResponse(200, {
        checkoutUrl: session.url,
        sessionId: session.id,
        payment,
    }, 'Payment checkout session created'));
});
/**
 * Purchase subscription plan.
 */
exports.purchaseSubscription = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { subscriptionId, couponCode } = req.body;
    const organizationId = req.user?._id; // Treat user ID as org ID in multi-tenant contexts
    const plan = await subscription_model_1.SubscriptionPlan.findById(subscriptionId);
    if (!plan) {
        throw new ApiError_1.ApiError(404, 'Subscription plan not found');
    }
    let finalPrice = plan.price;
    if (couponCode) {
        const coupon = await coupon_model_1.Coupon.findOne({ code: couponCode.toUpperCase(), status: 'Active' });
        if (coupon && new Date() < new Date(coupon.expiresAt)) {
            if (finalPrice >= coupon.minimumPurchase) {
                let discount = 0;
                if (coupon.discountType === 'Fixed') {
                    discount = coupon.discountValue;
                }
                else if (coupon.discountType === 'Percentage') {
                    discount = (coupon.discountValue / 100) * finalPrice;
                }
                discount = Math.min(discount, finalPrice);
                finalPrice -= discount;
            }
        }
    }
    const successUrl = `${req.protocol}://${req.get('host')}/payments/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${req.protocol}://${req.get('host')}/payments/cancel`;
    const session = await (0, stripe_1.createStripeCheckoutSession)({
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
    const payment = await payment_model_1.Payment.create({
        organizationId,
        subscriptionId,
        amount: finalPrice,
        currency: plan.currency || 'USD',
        paymentMethod: 'Stripe',
        status: 'Pending',
        paymentReference: session.id,
    });
    res.status(200).json(new ApiResponse_1.ApiResponse(200, {
        checkoutUrl: session.url,
        sessionId: session.id,
        payment,
    }, 'Subscription plan checkout session created'));
});
/**
 * Verify manual payments (Cash, Bank Transfer) - Admin only.
 */
exports.verifyPayment = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { paymentId, status, paymentReference } = req.body;
    const payment = await payment_model_1.Payment.findById(paymentId);
    if (!payment) {
        throw new ApiError_1.ApiError(404, 'Payment log not found');
    }
    payment.paymentReference = paymentReference;
    if (status === 'Paid') {
        await (0, exports.processSuccessfulPayment)(payment, paymentReference);
    }
    else {
        payment.status = status;
        await payment.save();
    }
    res.status(200).json(new ApiResponse_1.ApiResponse(200, payment, 'Payment verified successfully'));
});
/**
 * Handle Stripe webhook events (checkout.session.completed, etc.).
 */
exports.handleStripeWebhook = (0, catchAsync_1.catchAsync)(async (req, res) => {
    let eventType = req.body.event || req.body.type;
    let sessionId = req.body.sessionId || (req.body.data && req.body.data.object && req.body.data.object.id);
    // If real Stripe keys are configured and it's a real HTTP signature callback, verify signature
    if (stripe_1.stripe && req.headers['stripe-signature']) {
        const sig = req.headers['stripe-signature'];
        try {
            const event = stripe_1.stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET || '');
            eventType = event.type;
            const object = event.data.object;
            sessionId = object.id;
        }
        catch (err) {
            throw new ApiError_1.ApiError(400, `Webhook Signature Error: ${err.message}`);
        }
    }
    console.log(`[Stripe Webhook] Received Event '${eventType}' for Session: ${sessionId}`);
    if (eventType === 'checkout.session.completed' && sessionId) {
        const payment = await payment_model_1.Payment.findOne({ paymentReference: sessionId });
        if (payment && payment.status === 'Pending') {
            await (0, exports.processSuccessfulPayment)(payment, sessionId);
            console.log(`[Stripe Webhook] Payment ${payment._id} updated to Paid.`);
        }
    }
    res.status(200).json({ received: true });
});
/**
 * Fetch all payments history with filters.
 */
exports.getAllPayments = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { page = 1, limit = 10, status, paymentMethod } = req.query;
    const filter = {};
    if (status)
        filter.status = status;
    if (paymentMethod)
        filter.paymentMethod = paymentMethod;
    // Enforce isolation for students
    if (req.user && req.user.role === 'STUDENT') {
        filter.studentId = req.user._id;
    }
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Number(limit));
    const skip = (pageNum - 1) * limitNum;
    const payments = await payment_model_1.Payment.find(filter)
        .populate('studentId', 'firstName lastName email')
        .populate('courseId', 'title slug')
        .populate('subscriptionId', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum);
    const total = await payment_model_1.Payment.countDocuments(filter);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, {
        payments,
        pagination: {
            total,
            page: pageNum,
            limit: limitNum,
            totalPages: Math.ceil(total / limitNum),
        },
    }, 'Payments retrieved successfully'));
});
exports.default = exports.purchaseCourse;

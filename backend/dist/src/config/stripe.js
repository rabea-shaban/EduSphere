"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refundStripePayment = exports.createStripeCheckoutSession = exports.stripe = void 0;
const stripe_1 = __importDefault(require("stripe"));
const secretKey = process.env.STRIPE_SECRET_KEY || '';
const isMock = !secretKey;
exports.stripe = isMock
    ? null
    : new stripe_1.default(secretKey, {
        apiVersion: '2023-10-16',
    });
if (isMock) {
    console.log('[Stripe] WARNING: Missing STRIPE_SECRET_KEY. Running Stripe in OFFLINE/SIMULATION mode.');
}
else {
    console.log('[Stripe] SDK initialized successfully.');
}
/**
 * Creates a Stripe checkout session. Integrates an offline mock fallback.
 */
const createStripeCheckoutSession = async (params) => {
    if (isMock || !exports.stripe) {
        console.log('[Stripe Mock] Creating Checkout Session with params:', params);
        const mockSessionId = `mock_session_id_${Date.now()}`;
        return {
            id: mockSessionId,
            url: `https://checkout.stripe.dev/pay/${mockSessionId}`,
        };
    }
    return await exports.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: params.lineItems,
        mode: 'payment',
        success_url: params.successUrl,
        cancel_url: params.cancelUrl,
        metadata: params.metadata,
    });
};
exports.createStripeCheckoutSession = createStripeCheckoutSession;
/**
 * Refund a charge. Integrates an offline mock fallback.
 */
const refundStripePayment = async (chargeId, amount) => {
    if (isMock || !exports.stripe) {
        console.log(`[Stripe Mock] Issuing refund for Charge: ${chargeId}, Amount: ${amount}`);
        return { id: `mock_refund_id_${Date.now()}`, status: 'succeeded' };
    }
    return await exports.stripe.refunds.create({
        charge: chargeId,
        amount,
    });
};
exports.refundStripePayment = refundStripePayment;
exports.default = exports.stripe;

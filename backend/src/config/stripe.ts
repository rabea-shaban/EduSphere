import Stripe from 'stripe';

const secretKey = process.env.STRIPE_SECRET_KEY || '';
const isMock = !secretKey;

export const stripe = isMock
  ? null
  : new Stripe(secretKey, {
      apiVersion: '2023-10-16' as any,
    });

if (isMock) {
  console.log('[Stripe] WARNING: Missing STRIPE_SECRET_KEY. Running Stripe in OFFLINE/SIMULATION mode.');
} else {
  console.log('[Stripe] SDK initialized successfully.');
}

/**
 * Creates a Stripe checkout session. Integrates an offline mock fallback.
 */
export const createStripeCheckoutSession = async (params: {
  successUrl: string;
  cancelUrl: string;
  lineItems: Array<{
    price_data: {
      currency: string;
      product_data: {
        name: string;
        description?: string;
      };
      unit_amount: number;
    };
    quantity: number;
  }>;
  metadata?: any;
}) => {
  if (isMock || !stripe) {
    console.log('[Stripe Mock] Creating Checkout Session with params:', params);
    const mockSessionId = `mock_session_id_${Date.now()}`;
    return {
      id: mockSessionId,
      url: `https://checkout.stripe.dev/pay/${mockSessionId}`,
    };
  }

  return await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: params.lineItems,
    mode: 'payment',
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    metadata: params.metadata,
  });
};

/**
 * Refund a charge. Integrates an offline mock fallback.
 */
export const refundStripePayment = async (chargeId: string, amount?: number) => {
  if (isMock || !stripe) {
    console.log(`[Stripe Mock] Issuing refund for Charge: ${chargeId}, Amount: ${amount}`);
    return { id: `mock_refund_id_${Date.now()}`, status: 'succeeded' };
  }

  return await stripe.refunds.create({
    charge: chargeId,
    amount,
  });
};
export default stripe;

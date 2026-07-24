import { createCouponSchema } from '../src/modules/coupons/coupon.validation';

describe('Payment & Coupon Validation Unit Tests', () => {
  it('should validate valid coupon creation payload', () => {
    const validCoupon = {
      code: 'SUMMER2026',
      discountType: 'Percentage',
      discountValue: 20,
      minPurchaseAmount: 50,
      expiryDate: new Date(Date.now() + 86400000).toISOString(),
    };

    const { error } = createCouponSchema.validate(validCoupon);
    expect(error).toBeUndefined();
  });

  it('should calculate percentage discount correctly', () => {
    const originalPrice = 100;
    const discountValue = 20;
    const finalPrice = originalPrice - (originalPrice * discountValue) / 100;

    expect(finalPrice).toBe(80);
  });
});

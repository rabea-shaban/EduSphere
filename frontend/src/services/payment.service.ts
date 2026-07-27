import api from "./api";
import { ApiResponse } from "@/features/dashboard/types/api";

export interface ValidateCouponResponse {
  coupon: {
    _id: string;
    code: string;
    discountType: "Percentage" | "Fixed";
    discountValue: number;
  };
  discount: number;
  finalAmount: number;
}

export interface ManualPaymentInput {
  courseId: string;
  paymentMethod: "Vodafone Cash" | "InstaPay" | "Fawry" | "Bank Transfer" | "Visa" | "Meeza";
  paymentReference: string;
  receiptUrl?: string;
  notes?: string;
  couponCode?: string;
}

export interface ApiPaymentRecord {
  _id: string;
  paymentReference: string;
  studentId: any;
  courseId: any;
  amount: number;
  currency: string;
  paymentMethod: string;
  status: "Pending" | "Paid" | "Failed" | "Refunded";
  paidAt?: string;
  createdAt: string;
}

export const paymentService = {
  /**
   * Validate coupon code against a purchase amount.
   */
  async validateCoupon(code: string, purchaseAmount: number): Promise<ValidateCouponResponse> {
    const response = await api.post<ApiResponse<ValidateCouponResponse>>("/coupons/validate", {
      code,
      purchaseAmount,
    });
    return response.data.data;
  },

  /**
   * Initiate online card checkout session (Stripe).
   */
  async purchaseCourse(courseId: string, couponCode?: string): Promise<{ checkoutUrl: string; sessionId: string }> {
    const response = await api.post<ApiResponse<{ checkoutUrl: string; sessionId: string }>>("/payments/purchase-course", {
      courseId,
      couponCode,
    });
    return response.data.data;
  },

  /**
   * Submit manual payment with receipt image or transaction ID (Vodafone Cash, InstaPay, etc.).
   */
  async submitManualPayment(input: ManualPaymentInput): Promise<ApiPaymentRecord> {
    const response = await api.post<ApiResponse<ApiPaymentRecord>>("/payments/purchase-course", {
      ...input,
      paymentMethod: input.paymentMethod || "Vodafone Cash",
    });
    return response.data.data;
  },

  /**
   * Get student's purchase history and orders.
   */
  async getMyPayments(params?: { page?: number; limit?: number; status?: string }): Promise<{ payments: ApiPaymentRecord[]; pagination: any }> {
    const response = await api.get<ApiResponse<{ payments: ApiPaymentRecord[]; pagination: any }>>("/payments", { params });
    return response.data.data;
  },
};

export default paymentService;

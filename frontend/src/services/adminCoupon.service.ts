import api from "./api";

export interface AdminCouponItem {
  _id: string;
  code: string;
  name: string;
  description?: string;
  discountType: "Percentage" | "Fixed";
  discountValue: number;
  maximumDiscount?: number;
  minimumPurchase: number;
  usageLimit?: number | string;
  usedCount: number;
  remainingUsage: number | string;
  expiresAt: string;
  isExpired: boolean;
  status: "Active" | "Inactive" | "Expired";
  createdAt: string;
}

export interface GetCouponsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  type?: string;
  sort?: string;
}

export interface GetCouponsResponse {
  coupons: AdminCouponItem[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CreateCouponDto {
  code: string;
  description?: string;
  discountType: "Percentage" | "Fixed";
  discountValue: number;
  maximumDiscount?: number;
  minimumPurchase?: number;
  usageLimit?: number;
  expiresAt: string;
  status?: "Active" | "Inactive";
}

export const adminCouponService = {
  async getCoupons(params: GetCouponsQueryParams = {}): Promise<GetCouponsResponse> {
    const response = await api.get<{ success: boolean; data: GetCouponsResponse }>("/admin/coupons", {
      params,
    });
    return response.data.data;
  },

  async getCouponById(id: string): Promise<any> {
    const response = await api.get<{ success: boolean; data: any }>(`/admin/coupons/${id}`);
    return response.data.data;
  },

  async createCoupon(data: CreateCouponDto): Promise<AdminCouponItem> {
    const response = await api.post<{ success: boolean; data: AdminCouponItem }>("/admin/coupons", data);
    return response.data.data;
  },

  async updateCoupon(id: string, data: Partial<CreateCouponDto>): Promise<AdminCouponItem> {
    const response = await api.patch<{ success: boolean; data: AdminCouponItem }>(`/admin/coupons/${id}`, data);
    return response.data.data;
  },

  async activateCoupon(id: string): Promise<void> {
    await api.patch(`/admin/coupons/${id}/activate`);
  },

  async deactivateCoupon(id: string): Promise<void> {
    await api.patch(`/admin/coupons/${id}/deactivate`);
  },

  async deleteCoupon(id: string): Promise<void> {
    await api.delete(`/admin/coupons/${id}`);
  },

  async validateCoupon(code: string, amount: number = 0): Promise<any> {
    const response = await api.post<{ success: boolean; data: any }>("/coupons/validate", {
      code,
      amount,
    });
    return response.data.data;
  },
};

export default adminCouponService;

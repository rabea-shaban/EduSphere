import api from "./api";

export interface AdminPaymentItem {
  _id: string;
  paymentReference: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  status: "Pending" | "Paid" | "Failed" | "Refunded";
  paidAt?: string;
  createdAt: string;
  student: {
    _id: string;
    fullName: string;
    email: string;
    phone?: string;
    avatar?: string;
  };
  course: {
    _id: string;
    title: string;
    price: number;
  };
  teacher: {
    _id: string;
    fullName: string;
    email: string;
  };
}

export interface AdminWithdrawalItem {
  _id: string;
  amount: number;
  method: string;
  accountDetails: string;
  status: "Pending" | "Approved" | "Paid" | "Rejected";
  requestedAt: string;
  processedAt?: string;
  rejectionReason?: string;
  teacher: {
    _id: string;
    fullName: string;
    email: string;
    phone?: string;
    avatar?: string;
  };
}

export interface PaymentsSummary {
  totalRevenue: number;
  todayRevenue: number;
  monthlyRevenue: number;
  pendingPaymentsCount: number;
  approvedPaymentsCount: number;
  refundedPaymentsCount: number;
  failedPaymentsCount: number;
  pendingWithdrawalsCount: number;
  completedWithdrawalsCount: number;
}

export interface GetPaymentsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  method?: string;
  sort?: string;
}

export interface GetPaymentsResponse {
  summary: PaymentsSummary;
  payments: AdminPaymentItem[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface GetWithdrawalsResponse {
  withdrawals: AdminWithdrawalItem[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const adminPaymentService = {
  async getPayments(params: GetPaymentsQueryParams = {}): Promise<GetPaymentsResponse> {
    const response = await api.get<{ success: boolean; data: GetPaymentsResponse }>("/admin/payments", {
      params,
    });
    return response.data.data;
  },

  async getPaymentById(id: string): Promise<any> {
    const response = await api.get<{ success: boolean; data: any }>(`/admin/payments/${id}`);
    return response.data.data;
  },

  async approvePayment(id: string): Promise<void> {
    await api.patch(`/admin/payments/${id}/approve`);
  },

  async rejectPayment(id: string, reason: string): Promise<void> {
    await api.patch(`/admin/payments/${id}/reject`, { reason });
  },

  async refundPayment(id: string, reason: string): Promise<void> {
    await api.patch(`/admin/payments/${id}/refund`, { reason });
  },

  async getWithdrawals(params: { page?: number; limit?: number; status?: string } = {}): Promise<GetWithdrawalsResponse> {
    const response = await api.get<{ success: boolean; data: GetWithdrawalsResponse }>("/admin/withdrawals", {
      params,
    });
    return response.data.data;
  },

  async approveWithdrawal(id: string): Promise<void> {
    await api.patch(`/admin/withdrawals/${id}/approve`);
  },

  async markWithdrawalPaid(id: string): Promise<void> {
    await api.patch(`/admin/withdrawals/${id}/paid`);
  },

  async rejectWithdrawal(id: string, reason: string): Promise<void> {
    await api.patch(`/admin/withdrawals/${id}/reject`, { reason });
  },

  async getRevenueAnalytics(): Promise<any> {
    const response = await api.get<{ success: boolean; data: any }>("/admin/revenue");
    return response.data.data;
  },
};

export default adminPaymentService;

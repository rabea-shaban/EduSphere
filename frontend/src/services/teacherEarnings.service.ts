import api from "./api";
import type {
  EarningsDashboardData,
  TransactionItem,
  PayoutsResponse,
  PayoutItem,
  FinancialReportData,
  EarningsFilters,
} from "@/features/teacher/types/earnings";
import type { ApiResponse } from "@/features/dashboard/types/api";

interface TransactionsListResponse {
  transactions: TransactionItem[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const teacherEarningsService = {
  /**
   * Get earnings dashboard overview metrics.
   */
  async getDashboard(filters?: EarningsFilters): Promise<EarningsDashboardData> {
    const response = await api.get<ApiResponse<EarningsDashboardData>>(
      `/teacher/earnings/dashboard`,
      { params: filters }
    );
    return response.data.data;
  },

  /**
   * Get filterable & searchable transactions list.
   */
  async getTransactions(filters?: EarningsFilters): Promise<TransactionsListResponse> {
    const response = await api.get<ApiResponse<TransactionsListResponse>>(
      `/teacher/earnings/transactions`,
      { params: filters }
    );
    return response.data.data;
  },

  /**
   * Get single transaction details.
   */
  async getTransactionById(id: string): Promise<TransactionItem> {
    const response = await api.get<ApiResponse<TransactionItem>>(
      `/teacher/earnings/transactions/${id}`
    );
    return response.data.data;
  },

  /**
   * Get withdrawal payouts history and available balance.
   */
  async getPayouts(): Promise<PayoutsResponse> {
    const response = await api.get<ApiResponse<PayoutsResponse>>(
      `/teacher/earnings/payouts`
    );
    return response.data.data;
  },

  /**
   * Request withdrawal payout.
   */
  async requestPayout(data: {
    amount: number;
    method: "Vodafone Cash" | "InstaPay" | "Bank Transfer" | "Fawry";
    accountDetails: string;
  }): Promise<PayoutItem> {
    const response = await api.post<ApiResponse<PayoutItem>>(
      `/teacher/earnings/payouts`,
      data
    );
    return response.data.data;
  },

  /**
   * Get revenue breakdown.
   */
  async getRevenueBreakdown(): Promise<any[]> {
    const response = await api.get<ApiResponse<any[]>>(
      `/teacher/earnings/revenue`
    );
    return response.data.data;
  },

  /**
   * Get financial summary report.
   */
  async getFinancialReports(exportMode?: boolean): Promise<FinancialReportData> {
    const response = await api.get<ApiResponse<FinancialReportData>>(
      `/teacher/earnings/reports`,
      { params: exportMode ? { export: true } : {} }
    );
    return response.data.data;
  },

  /**
   * Get refunds history.
   */
  async getRefunds(): Promise<any[]> {
    const response = await api.get<ApiResponse<any[]>>(
      `/teacher/earnings/refunds`
    );
    return response.data.data;
  },
};

export default teacherEarningsService;

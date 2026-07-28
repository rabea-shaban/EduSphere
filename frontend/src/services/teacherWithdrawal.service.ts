import api from "./api";
import type {
  WalletSummary,
  TeacherWithdrawalItem,
  CreateWithdrawalInput,
  WithdrawalFilters,
} from "@/features/teacher/types/withdrawal";
import type { ApiResponse } from "@/features/dashboard/types/api";

interface WithdrawalsListResponse {
  withdrawals: TeacherWithdrawalItem[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const teacherWithdrawalService = {
  /**
   * Get wallet summary and real-time available balance.
   */
  async getWallet(): Promise<WalletSummary> {
    const response = await api.get<ApiResponse<WalletSummary>>(
      `/teacher/wallet`
    );
    return response.data.data;
  },

  /**
   * Get full wallet history.
   */
  async getWalletHistory(): Promise<TeacherWithdrawalItem[]> {
    const response = await api.get<ApiResponse<TeacherWithdrawalItem[]>>(
      `/teacher/wallet/history`
    );
    return response.data.data;
  },

  /**
   * Get list of withdrawal requests with search & filters.
   */
  async getWithdrawals(filters?: WithdrawalFilters): Promise<WithdrawalsListResponse> {
    const response = await api.get<ApiResponse<WithdrawalsListResponse>>(
      `/teacher/withdrawals`,
      { params: filters }
    );
    return response.data.data;
  },

  /**
   * Get single withdrawal details.
   */
  async getWithdrawalById(id: string): Promise<TeacherWithdrawalItem> {
    const response = await api.get<ApiResponse<TeacherWithdrawalItem>>(
      `/teacher/withdrawals/${id}`
    );
    return response.data.data;
  },

  /**
   * Submit a new withdrawal request.
   */
  async createWithdrawal(data: CreateWithdrawalInput): Promise<TeacherWithdrawalItem> {
    const response = await api.post<ApiResponse<TeacherWithdrawalItem>>(
      `/teacher/withdrawals`,
      data
    );
    return response.data.data;
  },

  /**
   * Cancel a pending withdrawal request.
   */
  async cancelWithdrawal(id: string): Promise<TeacherWithdrawalItem> {
    const response = await api.patch<ApiResponse<TeacherWithdrawalItem>>(
      `/teacher/withdrawals/${id}/cancel`
    );
    return response.data.data;
  },
};

export default teacherWithdrawalService;

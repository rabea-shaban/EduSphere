export type WithdrawalMethodType =
  | "Vodafone Cash"
  | "InstaPay"
  | "Bank Transfer"
  | "Fawry";

export type WithdrawalStatusType =
  | "Pending"
  | "UnderReview"
  | "Approved"
  | "Processing"
  | "Paid"
  | "Rejected"
  | "Cancelled";

export interface WalletSummary {
  lifetimeEarnings: number;
  totalWithdrawn: number;
  pendingBalance: number;
  availableBalance: number;
  activePendingCount: number;
  currency: string;
  minWithdrawalAmount: number;
}

export interface TeacherWithdrawalItem {
  _id: string;
  withdrawalId: string;
  amount: number;
  method: WithdrawalMethodType;
  accountDetails: string;
  status: WithdrawalStatusType;
  requestedAt: string;
  processedAt?: string;
  rejectionReason?: string;
  teacherName?: string;
  teacherEmail?: string;
}

export interface CreateWithdrawalInput {
  amount: number;
  method: WithdrawalMethodType;
  accountDetails: string;
}

export interface WithdrawalFilters {
  search?: string;
  status?: WithdrawalStatusType | "ALL" | "";
  sort?: "newest" | "oldest" | "highest_amount";
  page?: number;
  limit?: number;
}

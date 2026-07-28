export interface EarningsDashboardData {
  totalEarnings: number;
  availableBalance: number;
  pendingBalance: number;
  withdrawnAmount: number;
  pendingWithdrawalAmount: number;
  monthlyEarnings: number;
  weeklyEarnings: number;
  dailyEarnings: number;
  lifetimeRevenue: number;
  revenueGrowth: number;
  totalTransactionsCount: number;
  teacherSharePercentage: number;
  currency: string;
}

export interface TransactionItem {
  _id: string;
  transactionId: string;
  studentId?: string;
  studentName: string;
  studentEmail: string;
  courseId?: string;
  courseTitle: string;
  amount: number;
  teacherShare: number;
  currency: string;
  paymentMethod: "Stripe" | "Cash" | "Bank Transfer" | "Wallet";
  status: "Pending" | "Paid" | "Failed" | "Refunded";
  paidAt?: string;
  createdAt: string;
}

export interface PayoutItem {
  _id: string;
  teacherId: string;
  amount: number;
  method: "Vodafone Cash" | "InstaPay" | "Bank Transfer" | "Fawry";
  accountDetails: string;
  status: "Pending" | "Approved" | "Paid" | "Rejected" | "Cancelled";
  requestedAt: string;
  processedAt?: string;
  rejectionReason?: string;
}

export interface PayoutsResponse {
  availableBalance: number;
  withdrawnAmount: number;
  pendingWithdrawalAmount: number;
  withdrawals: PayoutItem[];
}

export interface FinancialReportData {
  grossRevenue: number;
  netRevenue: number;
  platformFee: number;
  refundedAmount: number;
  paidTransactionsCount: number;
  refundedTransactionsCount: number;
  generatedAt: string;
}

export interface EarningsFilters {
  search?: string;
  courseId?: string;
  status?: "Pending" | "Paid" | "Failed" | "Refunded" | "ALL" | "";
  paymentMethod?: "Stripe" | "Cash" | "Bank Transfer" | "Wallet" | "ALL" | "";
  sort?: "newest" | "oldest" | "highest_amount" | "lowest_amount";
  page?: number;
  limit?: number;
}

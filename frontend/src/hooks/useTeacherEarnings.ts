import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import teacherEarningsService from "@/services/teacherEarnings.service";
import type { EarningsFilters } from "@/features/teacher/types/earnings";

export const TEACHER_EARNINGS_KEYS = {
  all: ["teacher-earnings"] as const,
  dashboard: (filters?: EarningsFilters) => ["teacher-earnings", "dashboard", filters] as const,
  transactions: (filters?: EarningsFilters) => ["teacher-earnings", "transactions", filters] as const,
  transactionById: (id: string) => ["teacher-earnings", "transactions", id] as const,
  payouts: ["teacher-earnings", "payouts"] as const,
  revenue: ["teacher-earnings", "revenue"] as const,
  reports: ["teacher-earnings", "reports"] as const,
  refunds: ["teacher-earnings", "refunds"] as const,
};

export function useTeacherEarningsDashboard(filters?: EarningsFilters) {
  return useQuery({
    queryKey: TEACHER_EARNINGS_KEYS.dashboard(filters),
    queryFn: () => teacherEarningsService.getDashboard(filters),
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
  });
}

export function useTeacherTransactions(filters?: EarningsFilters) {
  return useQuery({
    queryKey: TEACHER_EARNINGS_KEYS.transactions(filters),
    queryFn: () => teacherEarningsService.getTransactions(filters),
    staleTime: 1000 * 60 * 2,
  });
}

export function useTeacherTransaction(id: string) {
  return useQuery({
    queryKey: TEACHER_EARNINGS_KEYS.transactionById(id),
    queryFn: () => teacherEarningsService.getTransactionById(id),
    enabled: !!id,
  });
}

export function useTeacherPayouts() {
  return useQuery({
    queryKey: TEACHER_EARNINGS_KEYS.payouts,
    queryFn: () => teacherEarningsService.getPayouts(),
    staleTime: 1000 * 60 * 2,
  });
}

export function useRequestPayout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      amount: number;
      method: "Vodafone Cash" | "InstaPay" | "Bank Transfer" | "Fawry";
      accountDetails: string;
    }) => teacherEarningsService.requestPayout(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TEACHER_EARNINGS_KEYS.all });
      toast.success("تم تقديم طلب سحب المستحقات بنجاح وفي انتظار قيد المراجعة.");
    },
    onError: (error: any) => {
      toast.error(error?.message || "تعذر إرسال طلب سحب المستحقات");
    },
  });
}

export function useTeacherRevenueBreakdown() {
  return useQuery({
    queryKey: TEACHER_EARNINGS_KEYS.revenue,
    queryFn: () => teacherEarningsService.getRevenueBreakdown(),
    staleTime: 1000 * 60 * 3,
  });
}

export function useTeacherFinancialReports(exportMode?: boolean) {
  return useQuery({
    queryKey: TEACHER_EARNINGS_KEYS.reports,
    queryFn: () => teacherEarningsService.getFinancialReports(exportMode),
    staleTime: 1000 * 60 * 3,
  });
}

export function useTeacherRefunds() {
  return useQuery({
    queryKey: TEACHER_EARNINGS_KEYS.refunds,
    queryFn: () => teacherEarningsService.getRefunds(),
    staleTime: 1000 * 60 * 3,
  });
}

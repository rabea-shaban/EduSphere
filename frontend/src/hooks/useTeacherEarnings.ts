import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import teacherEarningsService from "@/services/teacherEarnings.service";
import type { EarningsFilters } from "@/features/teacher/types/earnings";
import { queryKeys, handleApiError } from "@/lib/react-query";

export const TEACHER_EARNINGS_KEYS = queryKeys.teacher.earnings;

export function useTeacherEarningsDashboard(filters?: EarningsFilters) {
  return useQuery({
    queryKey: queryKeys.teacher.earnings.summary(),
    queryFn: () => teacherEarningsService.getDashboard(filters),
    staleTime: 1000 * 60 * 5,
  });
}

export function useTeacherTransactions(filters?: EarningsFilters) {
  return useQuery({
    queryKey: queryKeys.teacher.earnings.analytics(JSON.stringify(filters ?? {})),
    queryFn: () => teacherEarningsService.getTransactions(filters),
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData,
  });
}

export function useTeacherTransaction(id: string) {
  return useQuery({
    queryKey: ["teacher-earnings", "transaction", id],
    queryFn: () => teacherEarningsService.getTransactionById(id),
    enabled: !!id,
  });
}

export function useTeacherPayouts() {
  return useQuery({
    queryKey: queryKeys.teacher.withdrawals.history(),
    queryFn: () => teacherEarningsService.getPayouts(),
    staleTime: 1000 * 60 * 5,
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
      queryClient.invalidateQueries({ queryKey: queryKeys.teacher.earnings.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.teacher.withdrawals.all });
      toast.success("تم تقديم طلب سحب المستحقات بنجاح وفي انتظار قيد المراجعة.");
    },
    onError: (error: any) => {
      handleApiError(error, "تعذر إرسال طلب سحب المستحقات");
    },
  });
}

export function useTeacherRevenueBreakdown() {
  return useQuery({
    queryKey: queryKeys.teacher.earnings.analytics("breakdown"),
    queryFn: () => teacherEarningsService.getRevenueBreakdown(),
    staleTime: 1000 * 60 * 5,
  });
}

export function useTeacherFinancialReports(exportMode?: boolean) {
  return useQuery({
    queryKey: queryKeys.teacher.earnings.statement(exportMode ? "export" : "current"),
    queryFn: () => teacherEarningsService.getFinancialReports(exportMode),
    staleTime: 1000 * 60 * 5,
  });
}

export function useTeacherRefunds() {
  return useQuery({
    queryKey: queryKeys.teacher.earnings.analytics("refunds"),
    queryFn: () => teacherEarningsService.getRefunds(),
    staleTime: 1000 * 60 * 5,
  });
}

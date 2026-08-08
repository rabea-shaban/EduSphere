import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import teacherWithdrawalService from "@/services/teacherWithdrawal.service";
import type { CreateWithdrawalInput, WithdrawalFilters } from "@/features/teacher/types/withdrawal";
import { queryKeys, handleApiError } from "@/lib/react-query";

export const TEACHER_WITHDRAWAL_KEYS = queryKeys.teacher.withdrawals;

export function useWallet() {
  const isChatActive = typeof window !== "undefined" && window.location.pathname.includes("/chat");
  return useQuery({
    queryKey: queryKeys.teacher.withdrawals.wallet(),
    queryFn: () => teacherWithdrawalService.getWallet(),
    staleTime: 1000 * 30, // 30 seconds
    refetchInterval: isChatActive ? false : 30 * 1000, // Background refresh every 30s
  });
}

export function useWithdrawalHistory() {
  return useQuery({
    queryKey: queryKeys.teacher.withdrawals.history(),
    queryFn: () => teacherWithdrawalService.getWalletHistory(),
    staleTime: 1000 * 60 * 5,
  });
}

export function useTeacherWithdrawals(filters?: WithdrawalFilters) {
  return useQuery({
    queryKey: queryKeys.teacher.withdrawals.list(filters as Record<string, any>),
    queryFn: () => teacherWithdrawalService.getWithdrawals(filters),
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData,
  });
}

export function useTeacherWithdrawal(id: string) {
  return useQuery({
    queryKey: queryKeys.teacher.withdrawals.byId(id),
    queryFn: () => teacherWithdrawalService.getWithdrawalById(id),
    enabled: !!id,
  });
}

export function useCreateWithdrawal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateWithdrawalInput) => teacherWithdrawalService.createWithdrawal(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.teacher.withdrawals.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.teacher.earnings.all });
      toast.success("تم تقديم طلب سحب المستحقات بنجاح وفي انتظار قيد المراجعة.");
    },
    onError: (error: any) => {
      handleApiError(error, "تعذر تقديم طلب السحب");
    },
  });
}

export function useCancelWithdrawal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => teacherWithdrawalService.cancelWithdrawal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.teacher.withdrawals.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.teacher.earnings.all });
      toast.success("تم إلغاء طلب السحب واستعادة المبلغ للرصيد المتاح بنجاح.");
    },
    onError: (error: any) => {
      handleApiError(error, "تعذر إلغاء طلب السحب");
    },
  });
}

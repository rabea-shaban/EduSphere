import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import teacherWithdrawalService from "@/services/teacherWithdrawal.service";
import type { CreateWithdrawalInput, WithdrawalFilters } from "@/features/teacher/types/withdrawal";

export const TEACHER_WITHDRAWAL_KEYS = {
  all: ["teacher-withdrawals"] as const,
  wallet: ["teacher-withdrawals", "wallet"] as const,
  history: ["teacher-withdrawals", "history"] as const,
  list: (filters?: WithdrawalFilters) => ["teacher-withdrawals", "list", filters] as const,
  byId: (id: string) => ["teacher-withdrawals", "id", id] as const,
};

export function useWallet() {
  return useQuery({
    queryKey: TEACHER_WITHDRAWAL_KEYS.wallet,
    queryFn: () => teacherWithdrawalService.getWallet(),
    staleTime: 1000 * 15,
    refetchInterval: 15 * 1000, // Silent background auto-refresh every 15s
    refetchOnWindowFocus: true,
  });
}

export function useWithdrawalHistory() {
  return useQuery({
    queryKey: TEACHER_WITHDRAWAL_KEYS.history,
    queryFn: () => teacherWithdrawalService.getWalletHistory(),
    staleTime: 1000 * 60 * 2,
  });
}

export function useTeacherWithdrawals(filters?: WithdrawalFilters) {
  return useQuery({
    queryKey: TEACHER_WITHDRAWAL_KEYS.list(filters),
    queryFn: () => teacherWithdrawalService.getWithdrawals(filters),
    staleTime: 1000 * 60 * 2,
  });
}

export function useTeacherWithdrawal(id: string) {
  return useQuery({
    queryKey: TEACHER_WITHDRAWAL_KEYS.byId(id),
    queryFn: () => teacherWithdrawalService.getWithdrawalById(id),
    enabled: !!id,
  });
}

export function useCreateWithdrawal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateWithdrawalInput) => teacherWithdrawalService.createWithdrawal(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TEACHER_WITHDRAWAL_KEYS.all });
      toast.success("تم تقديم طلب سحب المستحقات بنجاح وفي انتظار قيد المراجعة.");
    },
    onError: (error: any) => {
      toast.error(error?.message || "تعذر تقديم طلب السحب");
    },
  });
}

export function useCancelWithdrawal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => teacherWithdrawalService.cancelWithdrawal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TEACHER_WITHDRAWAL_KEYS.all });
      toast.success("تم إلغاء طلب السحب واستعادة المبلغ للرصيد المتاح بنجاح.");
    },
    onError: (error: any) => {
      toast.error(error?.message || "تعذر إلغاء طلب السحب");
    },
  });
}

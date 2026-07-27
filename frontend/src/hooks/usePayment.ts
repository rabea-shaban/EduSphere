import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import paymentService, { ManualPaymentInput } from "@/services/payment.service";
import { toast } from "react-hot-toast";

export const PAYMENT_KEYS = {
  myPayments: (page?: number, status?: string) => ["payments", "my", page ?? 1, status ?? "all"],
};

export function usePayment() {
  const queryClient = useQueryClient();

  const useMyPayments = (page: number = 1, status?: string) =>
    useQuery({
      queryKey: PAYMENT_KEYS.myPayments(page, status),
      queryFn: () => paymentService.getMyPayments({ page, status: status !== "all" ? status : undefined }),
      staleTime: 1000 * 60 * 2,
    });

  const validateCouponMutation = useMutation({
    mutationFn: ({ code, amount }: { code: string; amount: number }) =>
      paymentService.validateCoupon(code, amount),
    onSuccess: (data) => {
      toast.success(`تم تطبيق الكوبون بنجاح! خصم: ${data.discount} ج.م 🎉`);
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || err?.message || "كوبون غير صالح أو منتهي الصلاحية");
    },
  });

  const submitManualPaymentMutation = useMutation({
    mutationFn: (input: ManualPaymentInput) => paymentService.submitManualPayment(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      queryClient.invalidateQueries({ queryKey: ["enrollments"] });
      toast.success("تم إرسال إيصال السداد للمراجعة وتأكيد الاشتراك بنجاح! 🧾");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || err?.message || "حدث خطأ أثناء إرسال عملية السداد");
    },
  });

  return {
    useMyPayments,
    validateCoupon: validateCouponMutation.mutateAsync,
    isValidatingCoupon: validateCouponMutation.isPending,
    submitManualPayment: submitManualPaymentMutation.mutateAsync,
    isSubmittingPayment: submitManualPaymentMutation.isPending,
  };
}

export default usePayment;

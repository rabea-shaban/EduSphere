import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import paymentService, { ManualPaymentInput } from "@/services/payment.service";
import { toast } from "react-hot-toast";
import { queryKeys, handleApiError } from "@/lib/react-query";

export const PAYMENT_KEYS = queryKeys.payment;

export function usePayment() {
  const queryClient = useQueryClient();

  const useMyPayments = (page: number = 1, status?: string) =>
    useQuery({
      queryKey: queryKeys.payment.history(),
      queryFn: () => paymentService.getMyPayments({ page, status: status !== "all" ? status : undefined }),
      staleTime: 1000 * 60 * 5,
      placeholderData: keepPreviousData,
    });

  const validateCouponMutation = useMutation({
    mutationFn: ({ code, amount }: { code: string; amount: number }) =>
      paymentService.validateCoupon(code, amount),
    onSuccess: (data) => {
      toast.success(`تم تطبيق الكوبون بنجاح! خصم: ${data.discount} ج.م 🎉`);
    },
    onError: (err: any) => {
      handleApiError(err, "كوبون غير صالح أو منتهي الصلاحية");
    },
  });

  const submitManualPaymentMutation = useMutation({
    mutationFn: (input: ManualPaymentInput) => paymentService.submitManualPayment(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.payment.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.student.all });
      toast.success("تم إرسال إيصال السداد للمراجعة وتأكيد الاشتراك بنجاح! 🧾");
    },
    onError: (err: any) => {
      handleApiError(err, "حدث خطأ أثناء إرسال عملية السداد");
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

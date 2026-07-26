import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import authService from "@/services/auth.service";
import { LoginInput, RegisterInput, ForgotPasswordInput, ResetPasswordInput } from "@/features/auth";
import { toast } from "react-hot-toast";

export const AUTH_QUERY_KEY = ["auth", "currentUser"];

export function useAuth() {
  const queryClient = useQueryClient();

  const currentUserQuery = useQuery({
    queryKey: AUTH_QUERY_KEY,
    queryFn: () => authService.getCurrentUser(),
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const loginMutation = useMutation({
    mutationFn: (data: LoginInput) => authService.login(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY });
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data: RegisterInput) => authService.register(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      queryClient.setQueryData(AUTH_QUERY_KEY, null);
      toast.success("تم تسجيل الخروج بنجاح 👋");
    },
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: (data: ForgotPasswordInput) => authService.forgotPassword(data),
  });

  const resetPasswordMutation = useMutation({
    mutationFn: (data: ResetPasswordInput) => authService.resetPassword(data),
  });

  return {
    user: currentUserQuery.data,
    isLoadingUser: currentUserQuery.isLoading,
    isLoggedIn: !!currentUserQuery.data,
    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    register: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    logout: logoutMutation.mutateAsync,
    forgotPassword: forgotPasswordMutation.mutateAsync,
    resetPassword: resetPasswordMutation.mutateAsync,
  };
}

export default useAuth;

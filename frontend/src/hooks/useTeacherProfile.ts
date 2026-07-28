import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import teacherProfileService from "@/services/teacherProfile.service";
import type { ChangePasswordInput } from "@/features/teacher/types/profile";

export const TEACHER_PROFILE_KEYS = {
  all: ["teacher-profile"] as const,
  details: ["teacher-profile", "details"] as const,
  completeness: ["teacher-profile", "completeness"] as const,
  analytics: ["teacher-profile", "analytics"] as const,
};

export function useTeacherProfile() {
  return useQuery({
    queryKey: TEACHER_PROFILE_KEYS.details,
    queryFn: () => teacherProfileService.getProfile(),
    staleTime: 1000 * 60 * 3,
    refetchOnWindowFocus: false,
  });
}

export function useUpdateTeacherProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => teacherProfileService.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TEACHER_PROFILE_KEYS.all });
      toast.success("تم تحديث بيانات الملف الشخصي بنجاح 🎉");
    },
    onError: (error: any) => {
      toast.error(error?.message || "تعذر تحديث بيانات الملف الشخصي");
    },
  });
}

export function useUploadAvatar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (avatarUrl: string) => teacherProfileService.updateAvatar(avatarUrl),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TEACHER_PROFILE_KEYS.all });
      toast.success("تم تحديث الصورة الشخصية بنجاح");
    },
    onError: (error: any) => {
      toast.error(error?.message || "تعذر تحديث الصورة الشخصية");
    },
  });
}

export function useDeleteAvatar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => teacherProfileService.deleteAvatar(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TEACHER_PROFILE_KEYS.all });
      toast.success("تم إعادة الصورة الافتراضية");
    },
    onError: (error: any) => {
      toast.error(error?.message || "تعذر حذف الصورة الشخصية");
    },
  });
}

export function useUploadCover() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (coverUrl: string) => teacherProfileService.updateCover(coverUrl),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TEACHER_PROFILE_KEYS.all });
      toast.success("تم تحديث صورة الغلاف بنجاح");
    },
    onError: (error: any) => {
      toast.error(error?.message || "تعذر تحديث صورة الغلاف");
    },
  });
}

export function useDeleteCover() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => teacherProfileService.deleteCover(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TEACHER_PROFILE_KEYS.all });
      toast.success("تم إعادة غلاف الحساب الافتراضي");
    },
    onError: (error: any) => {
      toast.error(error?.message || "تعذر حذف صورة الغلاف");
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (data: ChangePasswordInput) => teacherProfileService.changePassword(data),
    onSuccess: () => {
      toast.success("تم تغيير كلمة المرور بنجاح 🔒");
    },
    onError: (error: any) => {
      toast.error(error?.message || "تعذر تغيير كلمة المرور");
    },
  });
}

export function useUpdateEmail() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (email: string) => teacherProfileService.updateEmail(email),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TEACHER_PROFILE_KEYS.all });
      toast.success("تم تحديث البريد الإلكتروني بنجاح");
    },
    onError: (error: any) => {
      toast.error(error?.message || "تعذر تحديث البريد الإلكتروني");
    },
  });
}

export function useProfileCompleteness() {
  return useQuery({
    queryKey: TEACHER_PROFILE_KEYS.completeness,
    queryFn: () => teacherProfileService.getCompleteness(),
    staleTime: 1000 * 60 * 3,
  });
}

export function useProfileAnalytics() {
  return useQuery({
    queryKey: TEACHER_PROFILE_KEYS.analytics,
    queryFn: () => teacherProfileService.getAnalytics(),
    staleTime: 1000 * 60 * 3,
  });
}

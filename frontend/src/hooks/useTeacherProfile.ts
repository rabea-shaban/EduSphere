import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import teacherProfileService from "@/services/teacherProfile.service";
import type { ChangePasswordInput } from "@/features/teacher/types/profile";
import { queryKeys, handleApiError } from "@/lib/react-query";

export const TEACHER_PROFILE_KEYS = queryKeys.teacher.profile;

export function useTeacherProfile() {
  return useQuery({
    queryKey: queryKeys.teacher.profile.details(),
    queryFn: () => teacherProfileService.getProfile(),
    staleTime: 1000 * 60 * 5,
  });
}

export function useUpdateTeacherProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => teacherProfileService.updateProfile(data),
    onSuccess: (updatedData) => {
      queryClient.setQueryData(queryKeys.teacher.profile.details(), updatedData);
      queryClient.invalidateQueries({ queryKey: queryKeys.teacher.profile.all });
      toast.success("تم تحديث بيانات الملف الشخصي بنجاح.");
    },
    onError: (error: any) => {
      handleApiError(error, "تعذر تحديث بيانات الملف الشخصي");
    },
  });
}

export function useUploadAvatar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (avatarUrl: string) => teacherProfileService.updateAvatar(avatarUrl),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.teacher.profile.all });
      toast.success("تم تحديث الصورة الشخصية بنجاح");
    },
    onError: (error: any) => {
      handleApiError(error, "تعذر تحديث الصورة الشخصية");
    },
  });
}

export function useDeleteAvatar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => teacherProfileService.deleteAvatar(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.teacher.profile.all });
      toast.success("تم إعادة الصورة الافتراضية");
    },
    onError: (error: any) => {
      handleApiError(error, "تعذر حذف الصورة الشخصية");
    },
  });
}

export function useUploadCover() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (coverUrl: string) => teacherProfileService.updateCover(coverUrl),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.teacher.profile.all });
      toast.success("تم تحديث صورة الغلاف بنجاح");
    },
    onError: (error: any) => {
      handleApiError(error, "تعذر تحديث صورة الغلاف");
    },
  });
}

export function useDeleteCover() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => teacherProfileService.deleteCover(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.teacher.profile.all });
      toast.success("تم إعادة غلاف الحساب الافتراضي");
    },
    onError: (error: any) => {
      handleApiError(error, "تعذر حذف صورة الغلاف");
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (data: ChangePasswordInput) => teacherProfileService.changePassword(data),
    onSuccess: () => {
      toast.success("تم تغيير كلمة المرور بنجاح.");
    },
    onError: (error: any) => {
      handleApiError(error, "تعذر تغيير كلمة المرور");
    },
  });
}

export function useUpdateEmail() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (email: string) => teacherProfileService.updateEmail(email),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.teacher.profile.all });
      toast.success("تم تحديث البريد الإلكتروني بنجاح");
    },
    onError: (error: any) => {
      handleApiError(error, "تعذر تحديث البريد الإلكتروني");
    },
  });
}

export function useProfileCompleteness() {
  return useQuery({
    queryKey: queryKeys.teacher.profile.completeness(),
    queryFn: () => teacherProfileService.getCompleteness(),
    staleTime: 1000 * 60 * 5,
  });
}

export function useProfileAnalytics() {
  return useQuery({
    queryKey: queryKeys.teacher.profile.analytics(),
    queryFn: () => teacherProfileService.getAnalytics(),
    staleTime: 1000 * 60 * 5,
  });
}
